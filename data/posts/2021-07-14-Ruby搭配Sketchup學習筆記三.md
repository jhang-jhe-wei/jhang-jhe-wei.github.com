---
title:  "Ruby 搭配 Sketchup 學習筆記(三)"
createdAt:   '2021-07-14T09:00:00Z'
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. Sketchup 基本結構 2. Sketchup 模組 3. Model 類別物件 4. Entities 類別物件 5. 超級類別 Entity 6. Sketchup 的 Ruby

---
# Ruby 搭配 Sketchup 學習筆記(三)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- Sketchup 基本結構
- Sketchup 模組
- Model 類別物件
- Entities 類別物件
- 超級類別 Entity
- Sketchup 的 Ruby

## Sketchup 基本結構
在之前我們畫直線時，曾經使用過以下指令：
```ruby
Sketchup.active_model.entities.add_line [0,0,0],[9,9,9]
```
以 Sketchup 的基本結構來拆分的話，可以分為以下三種：
1. Sketchup 模組(Module)
2. Model
3. Entity
4. Method


那這分別代表什麼意思呢？接著看下去。

## Sketchup 模組
Sketchup 模組是 Sketchup 專屬的模組，所以你無法在其他地方呼叫 Sketchup，這個模組是專門用來處理 Sketchup 應用程式的所有資訊，在 Ruby 中任何東西都是物件，因此你可以使用 Sketchup 的幾個指令：
```ruby
Sketchup.os_language
Sketchup.app_name
Sketchup.version
```

其中最重要的就是 `Sketchup.active_model`，呼叫此方法將會回傳目前的 Model 物件，至於 Model 物件是什麼？接著看下去。

## Model 類別物件
Model 代表一個 Sketchup 的檔案(*.skp)，包括其所有幾何圖形和模型的相關資訊，Sketchup 模組和 Model 模組僅有在剛開啟軟體時才會相同，假如之後有進行變更的話，就會不相同，簡單來說 Model 是 Sketchup 的子集合，可以試試以下指令：
```ruby
mod = Sketchup.active_model
mod.title
mod.description
mod.path
mod.modified?
```
Model 是一個大型的容器，其底下包含了六類的容器：
- 元件定義(.definitions)：回傳檔案中ComponentDefinitions物件關聯的元件定義
- 圖層容器(.layer)：回傳檔案中的所有圖層資訊
- 實體容器(.entities)：回傳所有幾何圖形資訊
- 選項管理員(.options)：回傳「模型資訊」的設定選項
- 材料容器(.materials)：回傳使用材料的資訊
- 檢視容器(.pages)：回傳所有場景畫面資訊

## Entities 類別物件
還記得之前畫過的直線嗎？
```ruby
Sketchup.active_model.entities.add_line [0,0,0],[9,9,9]
```
當我們要畫直線之前，必須要先拿到 Entity 的控制權，也就是 `Sketchup.active_model.entities`，之後我們才可以用 `.add_line` 方法去畫直線。

值得一提的是當初我們在畫圓形時 `.add_circle`，其會回傳由多個 Edges 物件所組成的 Array，而並非單個物件。

## 超級類別 Entity
在 Entity 之下有許多子類別，其中最重要的就是 Drawingelement，在我們繪製幾何圖形時使用的就是該子類別的方法。
另外 Entity 物件有提供幾個常用的方法：
- entityID：回傳該物件 ID
- typename：回傳幾何物件的型態
- model：回傳此物件所在的 Model
- parent：回傳此物件的父層
- deleted?：回傳此物件是否已被刪除
- valid?：回傳此物件是否有效

> 請記得假如用 .add_circle 畫出來的物件是 Array，因此不能直接用上述的方法讀取。

## Sketchup 的 Ruby
Sketchup 的 Ruby 有幾個有趣的操作，有些認為沒這麼好用的就不記錄了。
1. 長度的轉換

    由於 Sketchup 有所謂的長度單位，還記得[第一篇](../Ruby搭配Sketchup學習筆記/index.html)中，我們使用預設的英吋單位開啟檔案，那假如在程式碼中想要畫公分怎麼辦？
    ```ruby
    Sketchup.active_model.entities.add_line [0,0,0],[9.cm,9.cm,9.cm]
    ```
    直接在後方加入單位即可，十分的方便。

2. 陣列

    在 Sketchup 中假如要標示某點，必須以三維空間標示，而這通常都以一個陣列表示，於是 Sketchup 中的 Array 有以下幾種特別的方法：

    | 方法     | 用途                             | 範例                              |
| -------- | -------------------------------- | --------------------------------- |
| x        | 回傳陣列中x軸的座標              | pt=[1,2,3];pt.x -> 1              |
| y        | 回傳陣列中y軸的座標              | pt=[1,2,3];pt.y -> 2              |
| z        | 回傳陣列中z軸的座標              | pt=[1,2,3];pt.z -> 3              |
| on_line? | 判斷陣列代表的點是否在同一直線上 | pt=[3,3,3];line=[[1,1,1],[2,2,2]]; pt.on_line? line ->true|

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)
