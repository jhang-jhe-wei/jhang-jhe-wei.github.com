---
title:  "Ruby 搭配 Sketchup 學習筆記(六)"
createdAt:   '2021-07-16T09:00:00Z'
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. 對話方塊 2. 功能表 3. 命令 4. 工具列 5. WebDialogs

---
# Ruby 搭配 Sketchup 學習筆記(六)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- 對話方塊
- 功能表
- 命令
- 工具列
- WebDialogs

## 對話方塊
對話方塊在之前的範例中用作於呈現資訊，但其實它還可以與使用者進行互動。以下是基本的用法：
```ruby
UI.messagebox "測試訊息"
```
輸出結果：
![picture 1](2021-07-16-Ruby搭配Sketchup學習筆記六-22191d9b3fdfdf9f25a2962157e485aee406dec8f153383c5096a5802b08c69c.png)

`UI.messagebox` 的參數除了接受一個 String 之外，還可以傳入第二個參數決定按鈕形式，以下介紹幾種參數：
- MB_OK：有一個「確定」按鈕
- MB_OKCANCEL：有「確定」和「取消」按鈕
- MB_RETRYCANCEL：有「重試」和「取消」按鈕
- MB_ABORTRETRYCANCEL：有「放棄」、「重試」和「取消」按鈕
- MB_YESNO：有「是」和「否」按鈕
- MB_YESNOCANCEL：有「是」、「否」和「取消」按鈕
- MB_MULTILINE：顯示多列文字的訊息方塊，有第三個參數，代表訊息方塊的標題

各事件回傳的值皆不同：
- 「確定」：1
- 「取消」：2
- 「重試」：4
- 「放棄」：3
- 「是」：6
- 「否」：7

使用範例：
```ruby
case UI.messagebox "測試訊息",MB_OKCANCEL
    when 1
        puts "你按下確定"
    when 2
        puts "你按下取消"
end
```

還有一種對話方塊可以讓使用者輸入資訊，以下示範 BMI 計算：
```ruby
label = ["身高", "體重"]
defaults = [173, 68]
result = inputbox label, defaults, "輸入你的身高與體重"
bmi = result[1]/((result[0]/100.0)**2)

UI.messagebox "你的BMI是#{bmi}"
```
輸出結果：

![picture 2](2021-07-16-Ruby搭配Sketchup學習筆記六-81afc7a6aefe70d5bde2c806d95aa85771b9ec2c0b3dde8b861bbae1a04e2f39.png)

![picture 3](2021-07-16-Ruby搭配Sketchup學習筆記六-63de432d62cbe0706cdf914b62fe3dad10c61340496323ec1978e6b66536d0a2.png)

以下示範如何使用下拉式選單：
```ruby
label = ["餐點種類"]
default = ["炒飯"]
options = ["炒飯", "炒麵"]
enums = [options.join("|")]
result = inputbox label, default, enums, "今天晚上吃什麼？"

UI.messagebox "今天吃#{result[0]}" if result
```
輸出結果：
![picture 4](2021-07-16-Ruby搭配Sketchup學習筆記六-4c43000ed372e070a848daa8865c4cbcc328d4eeaaac6710eb55034615b61627.png)

![picture 5](2021-07-16-Ruby搭配Sketchup學習筆記六-229943a1c31c9829531eb4c8ab9a0e35c4d37bbbfb650acd93e3997f24f66a33.png)
比較麻煩的就是所有的參數都要塞 Array

## 功能表
功能表可以新增的位置有兩種：
1. 上方工具列
2. 右鍵點擊物件(快顯)

### 上方工具列
要新增在上方工具列，請先選擇一列，例如： File, Plugins等等，以下示範如何使用：
```ruby
menu = UI.menu "Plugins"
menu.add_item "按按看" do
    UI.messagebox "這是功能表"
end
submenu = menu.add_submenu "工具列"
submenu.add_item "板手" do
    UI.messagebox "板手"
end
submenu.add_item "螺絲起子" do
    UI.messagebox "螺絲起子"
end
submenu.add_separator
item = submenu.add_item "電動起子" do
    UI.messagebox "電動起子"
end
submenu.set_validation_proc(item){MF_DISABLED}
```
輸出結果：
![picture 6](2021-07-16-Ruby搭配Sketchup學習筆記六-19043a5fecc60814230b0be39bf8d7dd94b591c51deafeda4dc6271261111cbc.png)

`set_validation_proc` 的區塊中共有五種常數可以填入：
- MF_ENABLED
- MF_DISABLED
- MF_CHECKED
- MF_UNCHECKED
- MF_GRAYED

### 右鍵點擊物件(快顯)
以下示範如何使用快顯功能表：
```ruby
UI.add_context_menu_handler do |menu|
    menu.add_item("這是快顯按鈕") do
        UI.messagebox("你點到啦！")
    end
end
```
輸出結果：

![picture 7](2021-07-16-Ruby搭配Sketchup學習筆記六-48ebeb35a9ee926b5f4f9362e288538413473a7516cf4fe14cc7c02fde55c944.png)

## 命令
當有需要製作大量相同功能的按鈕時，可以考慮使用命令：
```ruby
UI.menu("Draw").add_item("觸發命令") do
    UI.messagebox("從這裡開始執行我定義的程序")
end

cmd = UI::Command.new("測試新的命令") do
    UI.messagebox("開始執行")
end

UI.menu("Draw").add_item cmd
```

## 工具列
還記得裝完 Ruby Code Editor 後會有一個小對話框浮現嗎？那其實就是工具列。以下示範如何製作：
```ruby
tool_cmd = UI::Command.new("測試工具"){UI.messagebox "這是我第一個工具"}
tool_cmd.large_icon = "carton.jpeg"
tool_cmd.tooltip = "這是提示"
tool_toolbar = UI::Toolbar.new "我的工具列"
tool_toolbar.add_item tool_cmd
tool_toolbar.show
```
輸出結果：

![picture 8](2021-07-16-Ruby搭配Sketchup學習筆記六-2d2bdb3c09350f5cd712d2c866d1f0b610881780b4ea0065b3e96850ff098613.png)

## WebDialogs
> Sketchup Ruby Api 官方文件建議改為 HTMLDialogs。

以下示範如何建立一個 WebDialogs
```ruby
wd = UI::WebDialog.new "一個 WebDialog"
wd.show
```
在新增 WebDialog 時也可以給予其參數：
1. dialog_title
2. scrollable
3. preferences_key：記住 WebDialog 的位置尺寸
4. width
5. height
6. left
7. top
8. resizable


而產生出來的物件有以下的方法可使用：
- set_url
- set_potition
- set_size
- set_file
- max_height
- max_width
- min_height
- min_width

### 搭配 HTML
在 WebDialogs 之中可以放入 HTML 和 Javascript，例如以下範例先建立一個 .html 檔，之後進行引入：
新增一個 `index.html` 在 Sketchup 的 `Plugins/mytest` 資料夾之下
```ruby
wd = UI::WebDialog.new "一個 WebDialog"
path = Sketchup.find_support_file "index.html", "Plugins/mytest"
wd.set_file path
wd.show
```
輸出結果：

![picture 9](2021-07-16-Ruby搭配Sketchup學習筆記六-52d65ea954c0fb95acc22cfe3866fec5218dd97c278708a05e97317110aa7646.png)

### 搭配 Javescript
 當 Ruby 想要傳送訊息到 Javascript 時可以使用 `wd.execute_script funcName(arg1,arg2)`，當 Javascript 想要傳送資料到 Ruby 時，可以在 Javascript 使用 `window.loaction = "skp:callback_name@callback_data"`
#### Ruby 傳資料給 Javascript
先建立 `ex_909.rb`，程式碼如以下：
```ruby
class EntObserver < Sketchup::EntityObserver
  def onChangeEntity(entity)
    f_count = 1
    for v in entity.vertices
      args = "'#{v.position.x.to_s}','#{v.position.y.to_s}','#{v.position.z.to_s}'"
      $wd.execute_script "setPoint#{f_count.to_s}(#{args})"
      f_count += 1
    end
  end

  def onEraseEntity(entity)
    $wd.execute_script "faceDeleted()"
  end
end

ents = Sketchup.active_model.entities
face = ents.add_face [0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0]

cbs = EntObserver.new
face.add_observer cbs

$wd = UI::WebDialog.new "檢查並顯示端點位置"
path = Sketchup.find_support_file "ex_910.html", "Plugins/mytest"
$wd.set_file path
$wd.show
```
再建立 `ex_910.html`：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        function setPoint1(c1, c2, c3) {
            document.getElementById("pt1").innerHTML = `${c1},${c2},${c3}`
        }

        function setPoint2(c1, c2, c3) {
            document.getElementById("pt2").innerHTML = `${c1},${c2},${c3}`
        }

        function setPoint3(c1, c2, c3) {
            document.getElementById("pt3").innerHTML = `${c1},${c2},${c3}`
        }

        function setPoint4(c1, c2, c3) {
            document.getElementById("pt4").innerHTML = `${c1},${c2},${c3}`
        }

        function faceDeleted() {
            document.getElementById("pt1").innerHTML = "圖形已被刪除"
            document.getElementById("pt2").innerHTML = "圖形已被刪除"
            document.getElementById("pt3").innerHTML = "圖形已被刪除"
            document.getElementById("pt4").innerHTML = "圖形已被刪除"
        }
    </script>
</head>

<body>
    <h1>第一個點：</h1>
    <p id="pt1">在預設位置</p>
    <h1>第二個點：</h1>
    <p id="pt2">在預設位置</p>
    <h1>第三個點：</h1>
    <p id="pt3">在預設位置</p>
    <h1>第四個點：</h1>
    <p id="pt4">在預設位置</p>

</body>

</html>
```
輸出結果：

![picture 10](2021-07-16-Ruby搭配Sketchup學習筆記六-242c59dcbaeb35a8d6cf0325c985281dcf103d4fbbbb2e7e6d67304df3c8e996.png)

#### Javascript 傳資料給 Ruby
請建立 `ex_911.rb`，並複製以下內容：
```ruby
wd = UI::WebDialog.new "Face 製造機"
wd.set_size 600, 350
path = Sketchup.find_support_file "ex_912.html", "Plugins/mytest"
wd.set_file path

wd.add_action_callback("create_face") do |dialog, arg|
  if arg.to_s.length == 0
    puts "無效的輸入"
  else
    v = arg.to_s.split(",")
    pt1 = [v[0].strip.to_f, v[1].strip.to_f, v[2].strip.to_f]
    pt2 = [v[3].strip.to_f, v[4].strip.to_f, v[5].strip.to_f]
    pt3 = [v[6].strip.to_f, v[7].strip.to_f, v[8].strip.to_f]
    pt4 = [v[9].strip.to_f, v[10].strip.to_f, v[11].strip.to_f]

    Sketchup.active_model.entities.add_face pt1, pt2, pt3, pt4
  end
end
if RUBY_PLATFORM.index "darwin"
  wd.show_modal
else
  wd.show
end
```
再建立 `ex_912.html` ，複製以下內容：
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
        function sendPoints() {
            var ids = new Array("x1", "y1", "z1", "x2", "y2", "z2", "x3", "y3", "z3", "x4", "y4", "z4");
            var arg = "";
            var entry = "";
            var valid = true;

            for (i in ids) {
                entry = document.getElementById(ids[i]).value
                if (entry.length == 0 || isNaN(entry)) {
                    valid = false;
                } else {
                    arg += `${entry},`
                }
            }
            if (!valid) {
                arg = "";
            }
            window.location = `skp:create_face@${arg}`;
        }
    </script>
</head>

<body>
    <input type="text" id="x1" value="0.0" size="10" maxlength="6">
    <input type="text" id="y1" value="0.0" size="10" maxlength="6">
    <input type="text" id="z1" value="0.0" size="10" maxlength="6">
    <hr>
    <input type="text" id="x2" value="0.0" size="10" maxlength="6">
    <input type="text" id="y2" value="0.0" size="10" maxlength="6">
    <input type="text" id="z2" value="0.0" size="10" maxlength="6">
    <hr>
    <input type="text" id="x3" value="0.0" size="10" maxlength="6">
    <input type="text" id="y3" value="0.0" size="10" maxlength="6">
    <input type="text" id="z3" value="0.0" size="10" maxlength="6">
    <hr>
    <input type="text" id="x4" value="0.0" size="10" maxlength="6">
    <input type="text" id="y4" value="0.0" size="10" maxlength="6">
    <input type="text" id="z4" value="0.0" size="10" maxlength="6">
    <hr>
    <input type="submit" onclick="sendPoints();" value="產生">
</body>

</html>
```

輸出結果：
![picture 11](2021-07-16-Ruby搭配Sketchup學習筆記六-d59f34a8601664a5dc8fc5705ad5bc411e42ff73f5354d37c1a7ee5e4b474222.png)

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)
