---
title:  "Ruby 使用 Byebug 進行 Debug"
createdAt:   '2021-07-04T09:50:00Z'
categories: Note
tags:  [Ruby]
description: Byebug 是 Ruby 很出名的除錯工具，以 Gem 的方式加入進 Ruby 的專案中，其擁有其他除錯工具的相同功能，如： 1. 步進：程式一行一行執行。 2. 暫停：程式停止在指定處。 3. 交互式編輯環境(REPL)：在程式停止的該處進行操作。 4. 追蹤：追蹤變數的值在不同行的差異。

---
# Ruby 使用 Byebug 進行 Debug

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 簡介
Byebug 是 Ruby 很出名的除錯工具，以 Gem 的方式加入進 Ruby 的專案中，其擁有其他除錯工具的相同功能，如：
- 步進：程式一行一行執行。
- 暫停：程式停止在指定處。
- 交互式編輯環境(REPL)：在程式停止的該處進行操作。
- 追蹤：追蹤變數的值在不同行的差異。

## 使用方式
1. 安裝 Byebug
```shell
gem install byebug
```

2. 在 `.rb` 檔案最上方加入以下內容：
```ruby
require "byebug"
```

3. 埋入中斷點
4. 開始執行
    - `ruby xxx.rb`
        執行到 `byebug` 的地方後進入 byebug 模式
    - `byebug xxx.rb`
        自第一行開始進入 byebug 模式

## Byebug 操作指令
### 說明相關指令

| 指令       | 別名          | 範例  | 說明                       |
| ---------- | ------------- | ----- | -------------------------- |
| `help`     | `h`           | `h`   | 列出全部指令的說明         |
| `help cmd` | `h cmd-alias` | `h n` | 列出 `next` 這個指令的說明 |

### 執行下一步相關指令

| 指令        | 別名  | 範例   | 說明                                                  |
|:----------- | ----- | ------ | ----------------------------------------------------- |
| `next`      | `n`   | `n`    | 在同一個區塊或方法中往下執行 1 行                     |
| &nbsp;      |       | `n 3`  | 在同一個區塊或方法中往下執行 3 行                     |
| `step`      | `s`   | `s`    | 進入區塊或是方法執行 1 行                             |
| &nbsp;      |       | `s 3`  | 進入區塊或是方法執行 3 行                             |
| `continue`  | `c`   | `c`    | 執行到下一個斷點或是程式結束                          |
| &nbsp;      |       | `c 43` | 執行到第 43 行(或是在下一個斷點停止)                  |
| `continue!` | `c!`  | `c!`   | 執行到程式結束(遇到斷點也不會停止)                    |
| `finish`    | `fin` | `fin`  | 執行所有 `frame` 中的程式(完成由 `step` 進入的程式碼) |

### 斷點相關指令

| 指令                 | 別名    | 範例           | 說明                                                |
|:-------------------- | ------- | -------------- | --------------------------------------------------- |
| `info breakpoints`   | `i b`   | `i b`          | 列出所有斷點的編號、啟用與否和放置位置              |
| `break`              | `b`     | `b 33`         | 在目前檔案的第 33 行新增一個斷點                    |
| `disable breakpoint` | `dis b` | `dis b 2`      | 關閉編號 2 的斷點(如果沒指定編號則代表關閉所有斷點) |
| `enable breakpoint ` | `en b`  | `en b 2`       | 開啟編號 2 的斷點(如果沒指定編號則代表開啟所有斷點) |
| `delete`             | `del`   | `del 1`        | 刪除編號 1 的斷點(如果沒指定編號則代表刪除所有斷點) |
| `condition`          | `cond`  | `cond 3 i > 3` | 為編號 3 的斷點新增 `i > 3` 的判斷式                |
| &nbsp;               |         | `cond 3`       | 刪除編號 3 的斷點判斷式                             |

### 監控相關指令

在程式每次被斷點中斷時都會呈現監控點上的程式碼回傳值。

| 指令               | 別名     | 範例       | 說明                                                        |
|:------------------ | -------- | ---------- | ----------------------------------------------------------- |
| `info display    ` | `i d`    | `i d`      | 列出所有監控的編號、啟用與否和其程式碼                      |
| `display`          | `disp`   | `disp arg` | 新增一個每次被斷點中斷時，都會呈現 `arg` 數值的監控點       |
| &nbsp;             |          | `disp`     | 列出所有監控點的編號、程式碼和其回傳值                      |
| `disable display`  | `dis d`  | `dis d 2`  | 關閉編號 2 的監控點                                         |
| `enable display `  | `en d`   | `en d 2`   | 開啟編號 2 的監控點                                         |
| `undisplay`        | `undisp` | `undisp 1` | 停止顯示編號 2 的監控點(無指定編號則代表停止顯示所有監控點) |

### 變數相關指令

| 指令           | 別名    | 範例        | 說明                                           |
|:-------------- | ------- | ----------- | ---------------------------------------------- |
| `var args`     | `v a`   | `v a`       | 顯示當前方法的參數名稱和值                     |
| `var local`    | `v l`   | `v l`       | 顯示當前範圍(區塊或是方法)的所有變數名稱和值   |
| `var instance` | `v i`   | `v i`       | 顯示實例化物件中的變數名稱和值                 |
| &nbsp;         |         | `v i obj`   | 顯示 `obj` 這個實例化物件中的變數名稱和值      |
| `var const`    | `v c`   | `v c`       | 顯示所有的常數名稱和值                         |
| &nbsp;         |         | `v c Klass` | 顯示 `Klass` 這個 class/module 裡常數名稱和值  |
| `var global`   | `v g`   | `v g`       | 顯示所有的全域變數名稱和值                     |
| `var all`      | `v all` | `v all`     | 顯示所有的變數                                 |
| `eval`         | `eval`  | `eval i`    | 當變數為 byebug 關鍵字時，可以用這種方式取得值 |

### 追蹤和定位相關指令

| 指令                   | 別名        | 範例     | 說明                                                  |
| ---------------------- | ----------- | -------- | ----------------------------------------------------- |
| `list=`                | `l=`        | `l=`     | 顯示目前執行位置的前 5 行和後 4 行程式碼              |
| `list`                 | `l`         | `l 8-20` | 顯示第 8 行到第 20 行的程式碼                         |
| &nbsp;                 |             | `l`      | 顯示往後 10 行的程式碼(再輸入一次 `l` 會在往後 10 行) |
| `list-`                | `l-`        | `l-`     | 顯示往前 10 行的程式碼(再輸入一次 `l` 會在往前 10 行) |
| `where` or `backtrace` | `w` or `bt` | `w`      | 顯示目前停止的位置其上下文(由誰呼叫等等)              |
| &nbsp;                 |             | `bt`     | 顯示目前停止的位置其上下文(由誰呼叫等等)              |
| `frame`                | `f`         | `f 2`    | 往上 2 層查看進入點                                   |


### 操作相關指令

| 指令      | 別名      | 範例      | 說明                 |
| --------- | --------- | --------- | -------------------- |
| `edit`    | `ed`      | `ed`      | 編輯當前執行的檔案   |
| `irb`     | `irb`      | `irb`    | 開啟 irb           |
| `quit`    | `q`       | `q`       | 離開 byebug        |
| `quit!`   | `q!`      | `q!`      | 強制離開 byebug     |
| `restart` | `restart` | `restart` | 重新開始執行         |


## 使用範例
#### Byebug 後面加判斷式
```ruby
require "byebug"
10.times.each do |i|
    byebug if i == 3
    puts i
end
```
輸出：
```shell
0
1
2
3
Return value is: nil

[1, 6] in /Users/wells/project/test.rb
   1: require "byebug"
   2:
   3: 10.times.each do |i|
   4:   puts i
   5:   byebug if i == 3
=> 6: end
(byebug)
```

## 參考連結
- [Byebug Github](https://github.com/deivid-rodriguez/byebug)
- [Rails Guides](https://rails.ruby.tw/debugging_rails_applications.html)
- [elrayle/byebug_commands.md](https://gist.github.com/elrayle/e88693f74d4f02803d54d75150e3bfad)
- [debug 小幫手 - byebug](https://ithelp.ithome.com.tw/articles/10239650)
