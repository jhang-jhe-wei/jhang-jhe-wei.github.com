---
title:  "Ruby 搭配 Sketchup 學習筆記(一)"
createdAt:   '2021-07-13T09:50:00Z'
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. 安裝 Sketchup 2. 使用 Ruby Console 印出第一個 Hello, world! 3. 安裝 Ruby code editor extension 4. 使用 Ruby code editor 畫出第一條直線

---
# Ruby 搭配 Sketchup 學習筆記(一)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- 安裝 Sketchup
- 使用 Ruby Console 印出第一個 Hello, world!
- 安裝 Ruby code editor extension
- 使用 Ruby code editor 畫出第一條直線

## 安裝 Sketchup
至 [Sketchup 官網](https://www.sketchup.com/zh-TW/try-sketchup) 下載 Sketchup
![picture 1](2021-07-13-Ruby搭配Sketchup學習筆記-ddab56e94a754e47b63c57d5844d6ee16a075cfcf2ef089afff5fefabf09e623.png)

下載完成後開啟 Sketchup，第一次使用會要求你登入，即可開始 30 天試用期，之後你會看到以下畫面：
![picture 2](2021-07-13-Ruby搭配Sketchup學習筆記-3c7612b7a08cfc2138fec51a7811cedc3e1f479c4b21bdffcc455848b14b4755.png)
這邊我們選擇預設的 `簡單/英吋` 模型

開啟後你可以看到此畫面：
![picture 3](2021-07-13-Ruby搭配Sketchup學習筆記-a256919ad900008167ddc792d34c5d2d5855d093524b1bd6ec917ecb1b24d6bc.png)

## 使用 Ruby Console 印出第一個 Hello, world!
在上方工具列中的 `擴展程式套件/開發人員` 中有 Ruby 控制台，點擊它
![picture 6](2021-07-13-Ruby搭配Sketchup學習筆記-da90a28597e4fe7254230b8a83ce0a1116b1193851b2cab1b8e367d54d67a5b4.png)

之後你將可以看到一個對話框，輸入以下內容並送出
```ruby
puts "Hello, World!"
```
你將可以看到以下畫面：
![picture 7](2021-07-13-Ruby搭配Sketchup學習筆記-8c23915bf8d8decbbb43f2cbdde3e887ae40fcb8e6c421292299d429a3aec02f.png)

## 安裝 Ruby code editor
由於 Ruby console 不適合用來編寫大量的程式碼，因此我們會安裝一個 extension，叫做 Ruby code editor。

點擊上方工具列中的 `擴展程式套件/Extension Warehouse` ，在搜尋列表中輸入 `Ruby code editor`，可以看到以下畫面：
![picture 8](2021-07-13-Ruby搭配Sketchup學習筆記-ec673e326bdfed81faa089104fb51c2594ac7bfd62bb16f148f65aa9d81cd88c.png)
點擊第一個後安裝。

安裝成功後你將可以看到一個小對話框，點擊後就可以開啟 Ruby code editor：
![picture 9](2021-07-13-Ruby搭配Sketchup學習筆記-8656ae86cbd3b1f59f9b41c0f76498bbe4e35fe20ae9d5e1e3808d5915ecd1ea.png)


## 使用 Ruby code editor 畫出第一條直線
點擊 Ruby code editor 的小對話框，你將可以開啟一個編輯器，在其中輸入以下內容
```ruby
Sketchup.active_model.entities.add_line [0,0,0],[9,9,9]
```
按下下方的執行按鈕，如下圖：
![picture 10](2021-07-13-Ruby搭配Sketchup學習筆記-164e01596587f60809ffcc6495c5df6b32f4209d25c10c2fdc3efecdde939f57.png)

之後你將可以在 sketchup 中看到剛剛畫的那條直線：
![picture 11](2021-07-13-Ruby搭配Sketchup學習筆記-2683a2613fc163479426cdde4f3065c058342b48845327a637f85b78d4214b46.png)

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)

