---
# Ruby 搭配 Sketchup 學習筆記(八)
title:  "Ruby 搭配 Sketchup 學習筆記(八)"
createdAt:   2021-07-17 09:00:00 +0800
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. 視景畫面 2. 照相機

---
# Ruby 搭配 Sketchup 學習筆記(八)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- 視景畫面
- 照相機

## 視景畫面
視景畫面代表使用者目前畫面上呈現的資訊，以下示範如何取用視景資訊：
```ruby
view = Sketchup.active_model.active_view

height = view.vpheight.to_s
width = view.vpwidth.to_s

puts "視景尺寸：#{width}:#{height}"

puts "上左：#{view.corner(0)[0]},#{view.corner(0)[1]}。"
puts "上右：#{view.corner(1)[0]},#{view.corner(1)[1]}。"
puts "下左：#{view.corner(2)[0]},#{view.corner(2)[1]}。"
puts "下右：#{view.corner(3)[0]},#{view.corner(3)[1]}。"

center = view.center

puts "視景中心點：#{center[0]},#{center[1]}"

origin = view.screen_coords [0,0,0]
puts "繪圖原點的位置：\n#{origin[0].to_f}\n#{origin[1].to_f}"
```
輸出結果：
```
視景尺寸：2880:1504
上左：0,0。
上右：2880,0。
下左：0,1504。
下右：2880,1504。
視景中心點：1440,752
繪圖原點的位置：
958.4791057184447
1012.086470675737
```

還有一個有趣的用法是讓畫面聚焦在特定物件
```ruby
view = Sketchup.active_model.active_view
view.zoom Sketchup.active_model.entities[0]
```
輸出結果：
![picture 1](2021-07-17-Ruby搭配Sketchup學習筆記八-868de5ab300f18db076dd06c07ea63e14403fda724d673e57a78f5f83648f6c8.png)

## 照相機
以下示範變更視景位置：
```ruby
eye = [100,100,200]
target = [0,0,0]
up = [0,0,1]
my_cam = Sketchup::Camera.new eye, target, up

view = Sketchup.active_model.active_view
view.camera = my_cam
```
輸出結果：

![picture 2](2021-07-17-Ruby搭配Sketchup學習筆記八-f3d88690161295af2e9c9cdd8d05126c53b4221fc195073dc6533f7b0aa4b494.png)
其中的參數分別是：
- eye：視角位置
- target：看哪裡
- up：移動時向量，會決定畫面的角度

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)
