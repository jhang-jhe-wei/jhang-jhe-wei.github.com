---
title:  "SQL JSON Column"
createdAt:   '2023-07-13T00:00:00Z'
categories: Note
description: SQL 的 JSON Column 初探
---
# SQL JSON Column

## Available version

- MySQL5.7
- PostgreSQL 9.2

### PostgreSQL

- JSON type(text + validation)
- JSONB type

### MySQL

- JSON type(as PG JSONB)
- What’s the difference between JSON and JSONB in PG

    **JSON**

    - As Text type

    **JSONB**

    - Stored in internal format(Binary format), in order to use a key or array index to find a subobject without reading the whole JSON
    - Compare with JSON type has these benefits
        - Validation
        - Can update subobject or nest object by JSON functions
        - Fast to find the subobject or nest object
        - Slightly slower to input

    ### Semantically-insignificant details(white space…)

    ```sql
    SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::json;
                          json
    -------------------------------------------------
     {"bar": "baz", "balance": 7.77, "active":false}
    (1 row)

    SELECT '{"bar": "baz", "balance": 7.77, "active":false}'::jsonb;
                          jsonb
    --------------------------------------------------
     {"bar": "baz", "active": false, "balance": 7.77}
    (1 row)
    ```

    ### Convert Value to numeric

    ```sql
    SELECT '{"reading": 1.230e-5}'::json, '{"reading": 1.230e-5}'::jsonb;
             json          |          jsonb
    -----------------------+-------------------------
     {"reading": 1.230e-5} | {"reading": 0.00001230}
    (1 row)
    ```

- How big about JSON column
    - space: roughly the same as for LONGBLOB or LONGTEXT(approx 4 GB)
        - limited by `max-allowed-packet` variable
- How can I use JSON Column

    ```sql
    mysql> CREATE TABLE t1 (jdoc JSON);
    Query OK, 0 rows affected (0.20 sec)

    mysql> INSERT INTO t1 VALUES('{"key1": "value1", "key2": "value2"}');
    Query OK, 1 row affected (0.01 sec)

    mysql> INSERT INTO t1 VALUES('[1, 2,');
    ERROR 3140 (22032) at line 2: Invalid JSON text:
    "Invalid value." at position 6 in value (or column) '[1, 2,'.
    ```

    - Keys must be a `string`(Rails developers should pay attention)
    - JSON can contain strings or numbers, the JSON null literal, or the JSON boolean true or false literals

    | JSON primitive type | PostgreSQL type | Notes |
    | --- | --- | --- |
    | string | text | \u0000 is disallowed, as are unicode escapes representing characters not available in the database encoding |
    | number | numeric | NaN and infinity values are disallowed |
    | boolean | boolean | Only lowercase true and false spellings are accepted |
    | null | (none) | SQL NULL is a different concept |
- How can I search for value in the JSON column

    > using `JSON Function` with `JSON path` to searching,(e.g. `$.name`, `$[0]`, `->`)
    >

    ### MySQL(function + JSON path)

    Prefer function

    ```sql
    mysql> SELECT JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.*');
    +---------------------------------------------------------+
    | JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.*') |
    +---------------------------------------------------------+
    | [1, 2, [3, 4, 5]]                                       |
    +---------------------------------------------------------+
    mysql> SELECT JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.c[*]');
    +------------------------------------------------------------+
    | JSON_EXTRACT('{"a": 1, "b": 2, "c": [3, 4, 5]}', '$.c[*]') |
    +------------------------------------------------------------+
    | [3, 4, 5]                                                  |
    +------------------------------------------------------------+
    mysql> SELECT JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b');
    +---------------------------------------------------------+
    | JSON_EXTRACT('{"a": {"b": 1}, "c": {"b": 2}}', '$**.b') |
    +---------------------------------------------------------+
    | [1, 2]                                                  |
    +---------------------------------------------------------+
    ```

    ### PG(JSON path)

    Prefer operator

    ```sql
    SELECT doc->'site_name' FROM websites
    ```

- How can I update the value in the JSON column

    ### MySQL

    > Partial Update
    >

    ```sql
    mysql> SELECT JSON_SET('"x"', '$[0]', 'a');
    +------------------------------+
    | JSON_SET('"x"', '$[0]', 'a') |
    +------------------------------+
    | "a"                          |
    +------------------------------+
    1 row in set (0.00 sec)
    ```

    > Merge
    >

    ```sql
    mysql> SELECT
        ->   JSON_MERGE_PRESERVE('{"a": 1, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Preserve,
        ->   JSON_MERGE_PATCH('{"a": 3, "b": 2}', '{"c": 3, "a": 4}', '{"c": 5, "d": 3}') AS Patch\G
    *************************** 1. row ***************************
    Preserve: {"a": [1, 4], "b": 2, "c": [3, 5], "d": 3}
       Patch: {"a": 4, "b": 2, "c": 5, "d": 3}
    ```

    > with Update
    >

    ```sql
    mysql> update t set json_col = json_set(json_col, '$.age', age + 1);
    Query OK, 16 rows affected (13.56 sec)
    Rows matched: 16  Changed: 16  Warnings: 0
    ```

    ### Some limits to Partial Update

    - The column type is JSON
    - Using JSON Update functions
        - [JSON_SET()](https://dev.mysql.com/doc/refman/8.0/en/json-modification-functions.html#function_json-set)
        - JSON_REPLACE()
        - JSON_REMOVE()
    - The input column and the target column must be in the same column
        - `UPDATE mytable SET jcol1 = JSON_SET(jcol2, '$.a', 100)`
    - All changes replace existing array or object values with new ones
    - The new value cannot be larger than the old value

## When to Use JSON Column?

- ****Using JSON for Logging Purposes****
- ****To Store Permissions and Configurations****
- ****To Avoid Slow Performance on Highly Nested Data****

## ****When To Avoid JSON Data in a Relational Database?****

- ****You are Not Sure what Data to Store In the JSON Column****
- ****You Do Not Want to Deal With Complex Queries****
    - query with json column

    ```sql
    SELECT
      U1.id AS user1,
      U2.id AS user2,
      U1.jsonInfo->>'name' AS "U1 Name",
      U2.jsonInfo->>'name' AS "U1 Name",
      A1->>'address' AS "address"
    FROM user U1
    inner join user U2 on (U1.id > U2.id)
    cross join lateral jsonb_array_elements(U1.jsonInfo->'addresses') A1
    inner join lateral jsonb_array_elements(U2.jsonInfo->'addresses') A2 on (A1->>'address' = A2->>'address')
    ```

    - query with primitive column

    ```sql
    SELECT
      U1.id AS user1,
      U2.id AS user2,
      U1.name AS "U1 Name",
      U2.name AS "U2 Name",
      A1.address AS address
    FROM
      user U1
      INNER JOIN user U2 ON (U1.id > U2.id)
      INNER JOIN user_address A1 ON (U1.id = A1.user_id)
      INNER JOIN user_address A2 ON (U2.id = A2.user_id)
    WHERE
      A1.address = A2.address;
    ```

- ****You Have a Strongly Typed ORM****
    - ActiveRecord

## Use case

> 公司有 Orders 這一個表，在結帳時有時會有需要留備註的功能，但留下備註的人有所不同，例如：店員、店長、顧客、網站管理員……等等，在這種情境下我有幾種做法
>
1. 直接開 column 在這個 table 上
    1. 適合小流量、資料少的情況
2. 開一個 JSON column 在 order 表上
    1. 適合這些備註只需要內容的情況
3. 開一個備註表，用 poly association
    1. 適合這些備註不只要內容，還需要知道是哪個使用者留言的情況
4. 為每一個備註都開一張表
    1. 適合這些備註各個差異都很大，且需要複雜關聯的情況

## References

- [https://arctype.com/blog/json-database-when-use/](https://arctype.com/blog/json-database-when-use/)
- [https://dev.mysql.com/doc/refman/8.0/en/json.html](https://dev.mysql.com/doc/refman/8.0/en/json.html)
- [https://www.postgresql.org/docs/current/datatype-json.html](https://www.postgresql.org/docs/current/datatype-json.html)
- [https://stackoverflow.com/questions/28102425/how-to-use-the-activerecord-json-field-type](https://stackoverflow.com/questions/28102425/how-to-use-the-activerecord-json-field-type)
- [https://guides.rubyonrails.org/active_record_postgresql.html#json-and-jsonb](https://guides.rubyonrails.org/active_record_postgresql.html#json-and-jsonb)
- [https://mikerogers.io/2019/06/11/when-to-use-jsonb-columns-in-rails](https://mikerogers.io/2019/06/11/when-to-use-jsonb-columns-in-rails)
- [https://dev.to/kputra/rails-postgresql-jsonb-part-1-4ibg](https://dev.to/kputra/rails-postgresql-jsonb-part-1-4ibg)
- [https://scalegrid.io/blog/using-jsonb-in-postgresql-how-to-effectively-store-index-json-data-in-postgresql/](https://scalegrid.io/blog/using-jsonb-in-postgresql-how-to-effectively-store-index-json-data-in-postgresql/#4)
- [https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html](https://api.rubyonrails.org/classes/ActiveRecord/AttributeMethods/Serialization/ClassMethods.html)
