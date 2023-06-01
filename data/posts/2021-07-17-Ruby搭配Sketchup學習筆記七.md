---
# Ruby 搭配 Sketchup 學習筆記(七)
title:  "Ruby 搭配 Sketchup 學習筆記(七)"
createdAt:   '2021-07-17T09:00:00Z'
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. 屬性 2. 模型的屬性 3. 檔案存取

---
# Ruby 搭配 Sketchup 學習筆記(七)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- 屬性
- 模型的屬性
- 檔案存取

## 屬性
與實體物件有關的資料都被稱為「屬性(Attributes)」，可以使用以下指令進行操作：
- set_attribute：新增 key 和 value，有三個參數
- get_attribute：取得特定 key 的 value，第三個參數可選填，當無該屬性資料時會回傳該值
- attribute_dictionaries：取得該實體物件所有屬性

例如以下範例：
```ruby
person = Sketchup.active_model.entities[0]
person.set_attribute "person", "state", "relaxing"

person_state = person.get_attribute "person", "state" #relaxing
person_age = person.get_attribute "person", "age", 18 # 18

attr_dicts = person.attribute_dictionaries
attr_dicts.each {|attr| attr.each_pair{|key, value| puts "#{key}-#{value}"}}
#Owner-
#Status-
#state-relaxing
```
依照上方範例可以發現與 Hash 相似，但不同點在於其總共有三層，可以想像成是一個由 Hash 組成的 Hash。
> Owner 和 Status 是 Sketchup 內建的，可以忽略。

## 模型的屬性
在之前有提過的 Active_model 之下的其中一個類別 OptionsManager，其用來放置 Sketchup 的所有選項，包括一開始所點選的英吋單位，而  OptionsManager 就像是上方的屬性一樣。以下查看所有的選項及其值：
```ruby
options_manager = Sketchup.active_model.options
options_manager.each do |options_provider|
    puts options_provider.name
    options_provider.each do |key, value|
        puts "\t#{key}-#{value}"
    end
end
```
輸出結果：
```ruby
NamedOptions
PageOptions
	ShowTransition-true
	TransitionTime-2.0
SlideshowOptions
	LoopSlideshow-true
	SlideTime-1.0
UnitsOptions
	LengthPrecision-2
	LengthFormat-0
	LengthUnit-4
	LengthSnapEnabled-true
	LengthSnapLength-0.3937007874015748
	AnglePrecision-1
	AngleSnapEnabled-true
	SnapAngle-15.0
	SuppressUnitsDisplay-false
	ForceInchDisplay-false
	AreaUnit-4
	VolumeUnit-4
	AreaPrecision-2
	VolumePrecision-2
```
UnitsOptions 中的 LengthUnit 就是指英吋或公尺的單位，也因為它是 Hash，因此可以使用 Hash 的方式進行存取。

## 檔案存取
Sketchup 相關的副檔名有以下：
- .skm：材料檔
- .style：樣式檔
- .skp：元件定義檔

  在 Sketchup 中開啟檔案就和 Ruby 一樣，也可以用 chmod 進行權限修改。

當檔案位於 Sketchup 預設工作資料夾之下時，可以使用 `Sketchup.find_support_file` 取得其路徑，而 `Sketchup.find_support_files` 則可以取得多個檔案位置，例如：
```ruby
Sketchup.find_support_files "rb", "Plugins"
```

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)
