---
# Rails 實作 SQL Injection
title:  "Rails 實作 SQL Injection"
createdAt:   2021-07-19 09:00:00 +0800
categories: Note
tags:  ["Network security", Rails]
description: SQL(結構化查詢語言)用於管理資料庫，由於其無法區分值和控制指令， 因此惡意人士可以藉由在值中安插控制指令從而對資料庫進行惡意操作，這種操作稱為 SQL Injection。

---
# Rails 實作 SQL Injection

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

## 本篇內容
- 介紹
- 入侵實作
- 修補方式

## 介紹
SQL(結構化查詢語言)用於管理資料庫，由於其無法區分值和控制指令， 因此惡意人士可以藉由在值中安插控制指令從而對資料庫進行惡意操作，這種操作稱為 SQL Injection。

## 入侵實作
本範例使用 Ruby on Rails 6 進行實作。

### 1. 建立新檔案
使用 Rails 指令新增專案：
```shell
rails new demo
cd demo
```
### 2. 更改資料庫為 PostgreSQL
更改 `Gemfile` 中的內容：
```diff
- gem 'sqlite3', '~> 1.4'
+ gem 'pg'
```
複製以下內容，取代 `config/database.yml` ：
```yaml
default: &default
  adapter: postgresql
  encoding: unicode


development:
  <<: *default
  database: development
```
新增 PostgreSQL 資料庫：
```shell
createdb development
```
### 3. 產生貼文功能
使用 Rails 指令新增貼文功能：
```shell
rails g scaffold post title content
rails db:migrate
```
並且在 `config/routes.rb` 中新增以下內容：
```ruby
root to: "posts#index"
```
### 4. 新增搜尋功能
在 `app/views/posts/index.html.erb` h1 之下新增以下內容：
```erb
<%= form_tag(:posts, method: :get) do%>
  <%= label_tag(:search)%>
  <%= text_field_tag(:search, params[:search])%>
  <%= submit_tag("search")%>
<% end%>
```
接著把 `app/controllers/posts_controller.rb` 中 index 的部分替換為以下內容：
```ruby
 def index
    if(params[:search])
      sql = "SELECT posts.* FROM posts WHERE (posts.title LIKE '%#{params[:search]}');"
      result = ActiveRecord::Base.connection.execute(sql)
      @posts = result.map { |p| OpenStruct.new p }
    else
      @posts = Post.all
    end
end
```
之所以不能使用`Post.where()`是因為 Rails 有防止 SQL Injection 的機制，就算使用 `Post.where("id = #{params[id]}")` 依然會被擋下來。
### 5. 進行 SQL Injection
此時執行 `rails s`，之後在瀏覽器輸入 `localhost:3000` 新增幾個 post 後，就可以看到類似以下的畫面：
![picture 1](2021-07-19-sql-injection實作-14d771e7c31ecd9b9b46168991baf4d029dc9ec85c96045c027b8677306a54af.png)
之後我們在搜尋框中輸入 `apple');DELETE FROM posts; --`
![picture 2](2021-07-19-sql-injection實作-db30e557c85e6135d251cf8ef83a22d579fc6d3a77c74bb91bed5628b54152f9.png)
送出後查看log：
![picture 1](2021-07-19-sql-injection實作-cef63ca3dc90577e2dacb4e103da45cd911950288f5e2e55c3b9039045d7ad0a.png)
可以發現它最終組出了以下的 SQL 指令：
```sql
SELECT posts.* FROM posts WHERE (posts.title LIKE '%apple');DELETE FROM posts; --');
```
這段指令可以分為三段：
1. `SELECT posts.* FROM posts WHERE (posts.title LIKE '%apple');`
2. `DELETE FROM posts;`
3. `--');`

第一段是正常執行的指令，只不過因為我們在搜尋框中填入了 `apple');` 導致第一段程式碼提前中斷，而第二段就是惡意指令，使我們 posts 這個 table 的資料全部被刪除，而最後一段 `--` 則是註解，可以讓其之後的指令皆不被執行。

## 修補方式
其實 Rails 的防止 SQL Injection 機制很完善，雖然並不保證百分之百不會被攻擊，通常 SQL Ingection 都發生在需要搭配變數的情況，常見的做法就是將所有會影響 SQL 的控制字元進行轉義，以下示範：

```diff
-   sql = "SELECT posts.* FROM posts WHERE (posts.title LIKE '%#{params[:search]}');"
+   keyword = ActiveRecord::Base::connection.quote_string(params[:search])
+   sql = "SELECT posts.* FROM posts WHERE (posts.title LIKE '%#{keyword}');"

result = ActiveRecord::Base.connection.execute(sql)
@posts = result.map { |p| OpenStruct.new p }
```
這會使原本是 `"apple');DELETE FROM posts; --"` 的文字變成 `"apple'');DELETE FROM posts; --"` 從而避免 SQL Injection。

另一種更方便的就是用 Array 或是 Hash 傳入：
```ruby
Post.where("title = ?", "test")
Post.where(title: "test")
```
這樣子也是有效防止 SQL Injection 的方式。

但就是不要使用以下的做法：
```ruby
Post.where("title = #{var}")
```
因為 只要執行 `var = "' OR 1='1"` 後，上面的程式碼會被轉換成以下的 SQL 指令：
```sql
SELECT "posts".* FROM "posts" WHERE (title = '' OR 1='1')
```
這樣子駭客就能取得所有的資料。

但萬幸的是無法用 `;` 注入第二段指令，例如 `var = "');DELETE FROM posts;--"` 後再執行 `Post.where("title = #{var}")`，就會產生：
```sql
SELECT "posts".* FROM "posts" WHERE (title = '');DELETE FROM posts;--')
```
雖然會以上的指令有害，但真正運行時會遇到以下此錯誤：
```
ActiveRecord::StatementInvalid (PG::SyntaxError: ERROR:  cannot insert multiple commands into a prepared statement)
```

## 參考資料
- [什麽是 SQL Injection 攻擊?](https://ihower.tw/rails/fullstack-security-sql-injection.html)
- [Simple Search Form in Rails](https://medium.com/@yassimortensen/simple-search-form-in-rails-8483739e4042)
- [Rails raw SQL example](https://stackoverflow.com/questions/14824453/rails-raw-sql-example)
- [LIKE (Transact-SQL)](https://docs.microsoft.com/zh-tw/sql/t-sql/language-elements/like-transact-sql?view=sql-server-ver15)
