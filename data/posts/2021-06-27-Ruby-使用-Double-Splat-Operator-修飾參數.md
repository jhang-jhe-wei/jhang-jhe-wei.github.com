---
# Ruby 使用 Double Splat Operator 修飾參數
title:  "Ruby 使用 Double Splat Operator 修飾參數"
createdAt:   2021-06-27 12:50:00 +0800
categories: Tutorial
tags:  [Ruby]
description: 此篇是延伸至上一篇 [Ruby 使用 Splat Operator 修飾參數](../Ruby-使用-Splat-Operator-修飾參數/index.html)，上篇介紹的是 Splat Operator (*)，會將傳入的引數變成一個 Array，而此篇的 Double Splat Operator (**) 則是一個不同的應用，詳細內容就繼續看下去吧。

---
# Ruby 使用 Double Splat Operator 修飾參數
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 簡介
此篇是延伸至上一篇 [Ruby 使用 Splat Operator 修飾參數](../Ruby-使用-Splat-Operator-修飾參數/index.html)，上篇介紹的是 Splat Operator (*)，會將傳入的引數變成一個 Array，而此篇的 Double Splat Operator (**) 則是一個不同的應用，詳細內容就繼續看下去吧。

## 使用方式
在參數前方加入`**`，如以下：
```ruby
def test(**arg)
    ...
end
```

## Double Splat Operator (**)
使用 Double Splat Operator  修飾的參數會有以下幾個特性：
1. 只能傳入 Hash
2. 該參數為選填，不傳入時該參數會是`{}`
3. 只能傳入一個 Hash，不像 Splat Operator (*)可以傳入多個引數
4. 該參數需要放在最後
5. 可以搭配關鍵字參數(Keyword Parameter)

除了 **第4點** 和 **第5點** 外，使用 Double Splat Operator  修飾的參數與以下參數並無差別
```ruby
def test(arg={})
    ...
end
```

## 與 Splat Operator (*) 比較
以下比較使用 Splat Operator (*) 和 Double Splat Operator (**) 修飾後的參數差別

| 功能                     | Splat Operator (*)                     | Double Splat Operator (**) |
| ------------------------ | -------------------------------------- | -------------------------- |
| 類別                     | Array                                  | Hash                       |
| 可傳入引數的類別         | 只要能儲存在 Array 之中皆可            | 只能是 Hash                |
| 可傳入引數的數量         | 無限制                                 | 只能是 Hash                |
| 無引數傳入時             | []                                     | {}                         |
| 可放置位置               | 不限，但假如有預設值的參數，必須在其後 | 必須是最後                 |
| 假如有 Keyword Parameter | 需放置在 Keyword Parameter 前方        | 一樣放置在最後             |

### 使用範例
#### 使用 Splat Operator (*) 和 Double Splat Operator (**) 搭配
我們學校每一年都會舉辦就業博覽會，邀請許多廠商來學校擺攤，今年我大三剛好也有機會去看一下，但是到每一個攤位，都會請我填寫一些個人資料，裡面的資料包含姓名、聯絡方式、學歷和競賽經驗，那我其實就有點好奇，學歷和競賽經驗這種數目不一定的選項，我可以用 Splat Operator (*) 和 Double Splat Operator (**) 寫出來嗎？

```ruby
def profile(name, email, *educations, **competitions)
    puts "姓名：#{name}"
    puts "電子信箱：#{email}"
    puts "畢業學校：" unless educations.empty?
    educations.each{|education| puts education}
    puts "競賽經驗：" unless competitions.empty?
    competitions.each{|name,award| puts "競賽名稱：#{name} 獎項：#{award}"}
end

profile("wells", "abc@gmail.com", "花蓮高工", "台灣柯基大學", "IOCCC":"冠軍", "國際技能競賽": "冠軍", "英雄聯盟六都爭霸賽":"倒數第一")
```
輸出：
```
姓名：wells
電子信箱：abc@gmail.com
畢業學校：
花蓮高工
台灣柯基大學
競賽經驗：
競賽名稱：IOCCC 獎項：冠軍
競賽名稱：國際技能競賽 獎項：冠軍
競賽名稱：英雄聯盟六都爭霸賽 獎項：倒數第一
```
哦哦！原來真的可以用 Splat Operator (*) 和 Double Splat Operator (**) 寫出來欸！但是調皮的我想要試試看假如沒有 `**competitions` 這程式會怎麼跑呢？
#### 不使用 Double Splat Operator (**) 的情況

```ruby
def profile(name, email, *educations)
    puts "姓名：#{name}"
    puts "電子信箱：#{email}"
    puts "畢業學校：" unless educations.empty?
    educations.each{|education| puts education}
end

profile("wells", "abc@gmail.com", "花蓮高工", "台灣柯基大學", "IOCCC":"冠軍", "國際技能競賽": "冠軍", "英雄聯盟六都爭霸賽":"倒數第一")
```
輸出：
```
姓名：wells
電子信箱：abc@gmail.com
畢業學校：
花蓮高工
台灣柯基大學
{:IOCCC=>"冠軍", :國際技能競賽=>"冠軍", :英雄聯盟六都爭霸賽=>"倒數第一"}
```
雖然程式還是可以運作，但是他似乎把最後一個 Hash 也放進 Array 裡了，如果我想要做出與上一版相同的功能，那我就只能用`educations.last.each`了，但還要處理一些繁瑣的東西，重點是看起來完全不潮！因此假如最後會傳入一個 Hash，我將優先使用 Double Splat Operator (**)。

## 結語
Double Splat Operator 相比 Splat Operator 我覺得用途就沒有這麼廣泛了，但是相比`def test(arg={})`，用 Double Splat Operator 就是潮！

## 參考連結
- [Parameter with double splat operator (**) in Ruby](https://medium.com/@sologoubalex/parameter-with-double-splat-operator-in-ruby-d944d234de34)
