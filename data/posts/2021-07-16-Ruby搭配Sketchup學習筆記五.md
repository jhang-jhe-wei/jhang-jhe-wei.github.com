---
title:  "Ruby 搭配 Sketchup 學習筆記(五)"
createdAt:   '2021-07-16T09:00:00Z'
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. 圖層 Layer 2. 群組 Group 3. 元件 Components 4. 材料 Meterial 5. 圖片

---
# Ruby 搭配 Sketchup 學習筆記(五)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- 圖層 Layer
- 群組 Group
- 元件 Components
- 材料 Meterial
- 圖片

## 圖層 Layer
圖層(Layer)用來顯示或隱藏特定的圖形，以減少在作業中的干擾，在2021版的 Sketchup 被稱為標記(Tag)，它位於視窗的工具列：
![picture 1](2021-07-16-Ruby搭配Sketchup學習筆記五-0123e071bad511474b250ba2fad9b697904138629796b63df79320a548b5ec4a.png)

圖層是屬於 Model 類別之下，以下示範如何建立一個圖層：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
layers = mod.layers # All entities in model

new_layer = layers.add "測試用圖層"
mod.active_layer = new_layer
```
輸出結果：

![picture 2](2021-07-16-Ruby搭配Sketchup學習筆記五-8429c8e1f2c5aa38cb5ef321f2fd366ef14e78d6048531ca13daf1f651b01a49.png)
這邊可以看到有兩個圖層，第一個是預設的，第二個則是我們剛剛新增的。

另外圖層也可以使用以下方法：
- visible=
- visible?
- name=
- name

## 群組 Group
假如我們在 Sketchup 中做一個圓柱體：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle
circle_face.pushpull -10
```
輸出結果：

![picture 3](2021-07-16-Ruby搭配Sketchup學習筆記五-82c572379683ca0dc2eccbbb309110ce690cdb2c1da9aa08465a990b69772053.png)
對我們來說，這是一整個物件，但對 Sketchup 來說並不是，因為在上方的程式碼中的 `circle_face` 僅是一個平面，而使用平台拉抬而成的部分並屬於同一個物件，如果使用轉形，就只有表面移動，因此假如要移動整個圓柱體，可以使用 `circle_face.all_connected` ，不過每次都要這麼打，似乎有點麻煩，因此我們可以使用群組功能將整個圓柱體定義為一個群組：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle
circle_face.pushpull -10

circle_group = ent.add_group circle_face.all_connected

t = Geom::Transformation.translation [0, 10, 0]
ent.transform_entities t, circle_group
```
輸出結果：

![picture 4](2021-07-16-Ruby搭配Sketchup學習筆記五-f8a371a6031f92caf77d048520f762ef38d3f027c07a22f08bc66d71b6c97d1e.png)

群組提供了幾個方法：
- name=
- description=
- locked=：是否鎖定，鎖定後不能進行修改
- explode：將 Group 物件分解
- deleted?：是否被刪除

### 群組的特色
將一個或多個物體定義為群組後，可以使用幾個方便的功能對群組整體進行操作，功能如下：
- copy：複製
- move!：移動到特定位置
- transform!：轉形

## 元件 Components
元件與群組的最大差別在於元件可以跨不同的檔案，而群組只能在其建立的那個檔案。元件有點像 Class 經由定義完成後儲存成 `.skp` 檔案，要用到的時候在引入之後進行實體化(instance)

### 建立元件
建立元件有兩種方式。
#### 群組產生元件
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle
circle_face.pushpull -10

circle_group = ent.add_group circle_face.all_connected

circle_group.to_component
```
輸出結果：

![picture 5](2021-07-16-Ruby搭配Sketchup學習筆記五-c1b4585ae2b0f54a3520fd8295c64238a1ccab02cc22a37e2cb42f8367d9da1c.png)
在上方工具列的視窗中可以查看元件，點擊後可以發現此群組已經變為元件了。

#### 使用 DefinitionList 建立元件
DefinitionList 是 active_model 的其中一個方法，詳細做法看以下範例：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
def_list = mod.definitions # 取得 DefinitionList

# 新增一個文件定義
new_def = def_list.add "測試元件"
new_def.description = "這是一個測試元件"

# 只用文件定義的 Entities 建立一個圓柱體
ent = new_def.entities
circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle
circle_face.pushpull -10

# 儲存元件定義
save_path = Sketchup.find_support_file "components", ""
new_def.save_as(save_path+"/test.skp")

# Check
puts "已儲存到#{new_def.path}"
```

![picture 6](2021-07-16-Ruby搭配Sketchup學習筆記五-e275b46bafc9ad05b08721c235b5e4a662cd2680bfee2fcc3155ce470891fb14.png)

### 引入元件
開新的 Sketchup 專案，在 Ruby Console 中輸入以下內容：
```ruby
def_list = Sketchup.active_model.definitions
file_path = Sketchup.find_support_file "test.skp", "Components"
load_def = def_list.load file_path
```
這樣子就可以引入該元件了

### 元件實體化
這邊來示範如何使用元件進行實體化
```ruby
def_list = Sketchup.active_model.definitions
file_path = Sketchup.find_support_file "test.skp", "Components"
load_def = def_list.load file_path

ent = Sketchup.active_model.entities
t = Geom::Transformation.translation [0,0,0]
ent.add_instance load_def, t
```
使用元件實體化後的物件，假如元件被修改，該物件也會產生變化，如果要避免此情況可以使用 `make_unique`，元件還有幾個方法如下：
- locked
- name=
- name
- explode

## 材料
Sketchup 的材料並不具備物理資訊，其只負責呈現不同外觀，以下示範如何新增、使用材料：
### 新增材料
```ruby
mod = Sketchup.active_model
mats = mod.materials
new_mat = mats.add "新材料"
```

### 使用材料
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities
mats = mod.materials

new_mat = mats.add "新材料"

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle

circle_face.material = new_mat
```
materials 除了 `add` 外，還有其他方法：
- current
- current=
- name
- displat_name
- materialType

### 為材料新增顏色
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities
mats = mod.materials

new_mat = mats.add "新材料"
new_mat.color = [255,0,0]

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle

circle_face.material = new_mat
```
輸出結果：

![picture 7](2021-07-16-Ruby搭配Sketchup學習筆記五-7164950cc531f1990d784c087f34449b9c6389738311b41f39c7f82ce6143c04.png)
請注意！其會為表面塗色，但表面取決於向量。

### 為材料新增材質
材質與顏色類似，唯一不同點在於材質需要圖檔，看以下範例程式碼：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
mats = mod.materials
ent = mod.entities

new_mat = mats.add "新材料"
texture_path = Sketchup.find_support_file "images/wood.jpeg", "Plugins"
new_mat.texture = texture_path
new_mat.color = [255,0,0]

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle

circle_face.material = new_mat
```
輸出結果：

![picture 8](2021-07-16-Ruby搭配Sketchup學習筆記五-7b1ee571f725886377474530a53318545dd48ce622b96336e1b61a1b7a819d31.png)
順帶一提，為材料新增材質的同時也可以新增顏色。

也可以將新增變更顏色的材質進行儲存：
```ruby
mod = Sketchup.active_model # Open model
mats = mod.materials
ent = mod.entities

new_mat = mats.add "新材料"
new_mat.texture = Sketchup.find_support_file "images/wood.jpeg", "Plugins"
new_mat.color = [255,0,0]

circle = ent.add_circle [0, 0, 0], [0, 0, 1], 5
circle_face = ent.add_face circle
circle_face.material = new_mat

twriter = Sketchup.create_texture_writer
twriter.write circle_face, false, "texture.jpg"
```
twriter.write 第二個參數決定正面還是背面，目前是背面

## 圖片
以下範例程式碼示範如何展示圖片：
```ruby
ent = Sketchup.active_model.entities
path = Sketchup.find_support_file "images/carton.jpeg", "Plugins"
img = ent.add_image path, [0, 0, 0], 100

t = Geom::Transformation.rotation [0,0,0],[1,0,0],90.degrees
ent.transform_entities t,img
```
輸出結果：

![picture 9](2021-07-16-Ruby搭配Sketchup學習筆記五-5da3df3a8249f3290f9903c625941caaa28b12dfa63b68e61f3a47a89ab79308.png)

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)
