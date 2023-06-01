---
# Ruby 使用 Splat Operator 修飾參數
title:  "Ruby 使用 Splat Operator 修飾參數"
createdAt:   '2021-06-27T09:50:00Z'
categories: Tutorial
tags:  [Ruby]
description: Splat Operator  是 Ruby 定義方法時很常使用的運算子，  使用 Splat Operator 修飾的參數會將傳入的引入變成一個 Array ，其可以運用在不確定會傳入多少引數的情況，關於其特性和使用範例請繼續看下去。

---
# Ruby 使用 Splat Operator 修飾參數
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 簡介
Splat Operator  是 Ruby 定義方法時很常使用的運算子，  使用 Splat Operator 修飾的參數會將傳入的引入變成一個 Array ，其可以運用在不確定會傳入多少引數的情況，關於其特性和使用範例請繼續看下去。

## 使用方式
在參數前方加入`*`，如以下：
```ruby
def test(*arg)
    ...
end
```

## Splat Operator (*)
使用  Splat Operator  修飾的參數會有以下幾個特性：
1. 可以傳入不限數目的引數，並將所有傳入的引數變成一個 Array，內容依傳入順序排序
2. 該參數為選填，假如沒有傳入引數，該參數的變數會是一個空的 Array
3. 不能有兩個以上 Splat Operator  修飾的參數
4. 可以在其他參數中間
5. 假如其他參數有預設值，一定得在有預設值的參數後面，但建議不要用~~沒必要刁難自己~~
6. 假如有指定關鍵字參數(Keyword Parameter)，則必須在其前面 ，如`def test(*arg, key:)`

### 使用範例
#### 引數數目不確定
還記得以前我還不會講日文的時候(現在也不會)，當時遇到了一位日本來的同學，為了表示我的友好我決定用日文跟他溝通，於是我使用一個會在結尾都加上「得斯」的翻譯機(translator)，那麼這個翻譯機的程式會是怎樣寫呢？

如果我今天不會 Splat Operator ，我可能會寫成以下：
```ruby
def translator(arg)
    puts "#{arg}得斯"
end

translator("哈囉")
translator("你好")
translator("我不會講日文")
```
輸出：
```
哈囉得斯
你好得斯
我不會講日文得斯
```
這樣子雖然可以跟日本同學聊上天了，但是這個翻譯機每次只能翻譯一句話，實在有點麻煩，我希望不管我傳入幾句話，它都能夠翻譯，於是我使用 Splat Operator 改寫看看 ：
```ruby
def translator(*arg)
  arg.each do |str|
    puts "#{str}得斯"
  end
end

translator("空巴哇", "台日友好", "我很會講日文")
```
輸出：
```
空巴哇得斯
台日友好得斯
我很會講日文得斯
```
完美！這下子不僅搭上話，還讓日本來的同學覺得我的日文很好，偉哉偉哉，對打 Code 的人來說語言真不是個問題。

#### 收集多出的引數
我常去吃的小吃店，老闆非常不喜歡餐點做到一半時，客人才跟他說不要香菜或是突然要加麵之類的，於是他希望除了基本的餐點外，客人可以一次把他的需求說出來，所以老闆希望你可以幫他製作點餐系統，除了餐點和大小碗外，其他的要求也不知道有多少個，那麼這該怎麼製作呢？

```ruby
def order(type, size, *notes)
    puts "餐點種類: #{type}"
    puts "大小碗: #{size}"
    puts "其他備註:" unless notes.empty?
    notes.each do |note|
        puts note
    end
end

order("湯麵","大碗","不要加蔥、要辣","不用免洗筷","湯和麵要分開裝")
puts "------------------"
order("乾麵","小碗")
```
輸出：
```
餐點種類: 湯麵
大小碗: 大碗
其他備註:
不要加蔥、要辣
不用免洗筷
湯和麵要分開裝
------------------
餐點種類: 乾麵
大小碗: 小碗
```
製作完成！無論客人的要求有幾百項，這個系統都不會壞掉！~~但可憐的老闆就沒這麼幸運了~~

### 放置在其中參數之間
 過年時，小孩子說句吉祥話就可以討到紅包，於是我想到假如寫個說吉祥話的程式，放在有小朋友外型的機器人，它是不是就會變成一個紅包吸引機了！？~~並沒有~~

```ruby
def say_blessing_words(title,*peoples,blessing_words)
    peoples.each do |people|
        puts "#{title}#{people},#{blessing_words}!"
    end
end

say_blessing_words("親愛的","阿貓叔叔","阿太哥哥","美美阿姨","恭喜發財")
```
輸出：
```
親愛的阿貓叔叔,恭喜發財!
親愛的阿太哥哥,恭喜發財!
親愛的美美阿姨,恭喜發財!
```
有了這一個紅包吸引機我已經迫不期待要過年了！！

## 結語
總結一下 Splat Operator 的使用時機：
1. 引數的數量不確定
2. 假如參數的數量確定，但太多時也可以節省數量
3. 取代預設值為空陣列的參數，例如`def test(arg=[])`

在[下一篇](../Ruby-使用-Double-Splat-Operator-修飾參數/index.html)會介紹 Double Splat Operator 的用法。

## 參考連結
- [Parameter with splat operator (*) in Ruby (part 1/2)](https://medium.com/@sologoubalex/parameter-with-splat-operator-in-ruby-part-1-2-a1c2176215a5)
- [Parameter with splat operator (*) in Ruby (part 2/2)](https://medium.com/@sologoubalex/parameter-with-splat-operator-in-ruby-part-2-2-595784b8aeb8)
