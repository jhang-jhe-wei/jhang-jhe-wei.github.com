---
# Ruby 搭配 Sketchup 學習筆記(四)
title:  "Ruby 搭配 Sketchup 學習筆記(四)"
createdAt:   2021-07-15 09:00:00 +0800
categories: Note
tags:  [Ruby, Sketchup]
description: Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。本篇內容 1. 邊線(Edges) 2. 向量 3. 二維表面 4. 三維物體 5. 文字 6. 轉形

---
# Ruby 搭配 Sketchup 學習筆記(四)

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 前情提要
Sketchup 是一款在建築、都市計畫和遊戲開發都頗有名氣的 3D 建模軟體，而 Ruby 則是一個程式語言，它可以搭配 Sketchup 達成程式化 建模的任務，近期經由系主任引薦，要開發 Sketchup 的 Extension，雖然我寫過 Ruby，但 Sketchup 則是完全沒碰過，於是利用文章來記錄所學的一點一滴。

## 本篇內容
- 邊線(Edges)
- 向量
- 二維表面
- 三維物體
- 文字
- 轉形

## 邊線(Edge)
邊線(Edge)是一個物件，還記得之前畫直線跟畫圓形時最大的差別在於畫圓形回傳的是一個 Array，嚴格來說是一個由 Edge 組成的 Array，而 Entity 提供一個方法可以讓我們以其中一個 Edge 得到其相連的全部 Edges，以下為程式碼：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model
origin = [0,0,0]
normal = [0,0,1]
radius = 10

polygon = ent.add_ngon origin, normal, radius, 6
entity1 = ent[1] # ent[0] 是 Steve

edges = entity1.all_connected
puts edges.to_s
```
輸出：
```
[#<Sketchup::Edge:0x00007f87663ce688>, #<Sketchup::Edge:0x00007f87663ce728>, #<Sketchup::Edge:0x00007f87663ce700>, #<Sketchup::Edge:0x00007f87663ce6d8>, #<Sketchup::Edge:0x00007f87663ce6b0>, #<Sketchup::Edge:0x00007f87663ce750>]
true
```
經由 `.all_connected` 我們可以得到整個 Array，這在之後建立表面時十分有用。

Edge 提供了幾個有用的方法：
- length：取得直線長度(單位為目前設定的度量單位)
- start：傳回起點(Vertex 物件)
- end：傳回終點(Vertex 物件)
- vertices：傳回兩的端點(由 Vertex 物件組成的 Array)
- other_vertex：提供一個端點作為參數，回傳另一個端點
- split：分割直線；需傳入該直線上的一個端點，分割後為新直線的端點
- used_by?：判斷指定的端點是否在直線上

以下程式碼可供測試：
```ruby
test_line = Sketchup.active_model.entities.add_line [0, 0, 0], [9, 9, 0]
test_line.length # 1' 3/4
new_line = test_line.split [6, 6, 0]
test_line.length # 8 1/2
new_line.length # 4 1/4
test_line.start.position # (0", 0", 0")
vertex2 = test_line.end
vertex2.position # (6", 6", 0")

vertex1 = test_line.other_vertex vertex2
vertex1.position # (0", 0", 0")
new_line.start.position # (6", 6", 0")
new_line.end.position # (9", 9", 0")
test_line.used_by? vertex1 # true
new_line.used_by? vertex1 # false
```

## 向量
在 Sketchup 中畫直線時，經由起點和終點可以產生出向量，而在二維表面中，向量則決定該面該朝哪一個方向。例如希望做一個垂直於 X 軸的表面，該向量就會是 [1,0,0]。

## 二維表面
### 建立第一個二維表面
要生成二維表面有個前提，就是必須用 Edges 圍成一個封閉的區域，要生成二維表面使用的是 `.add_face`，之後傳入一個由 Edges 組成的 Array，因此可以先生成一個幾何圖形，之後再用該回傳的物件生成表面。以下示範製作一個矩形表面：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

depth = 50
width = 100

pt1 = [0, 0, 0]
pt2 = [width, 0, 0]
pt3 = [width, depth, 0]
pt4 = [0, depth, 0]

test_face = ent.add_face pt1,pt2,pt3,pt4
```
執行結果：
![picture 1](2021-07-13-Ruby搭配Sketchup學習筆記四-3c29f6d4c89f6b505a502954dd92976d90f426dfc07136151e30ffe0b506e199.png)
之後我們可以來看一下產生一個表面對於 Entity 的影響，以下是 Ruby Console：
``` ruby
> ent.size
1
> # Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

depth = 50
width = 100

pt1 = [0, 0, 0]
pt2 = [width, 0, 0]
pt3 = [width, depth, 0]
pt4 = [0, depth, 0]

test_face = ent.add_face pt1,pt2,pt3,pt4

#<Sketchup::Face:0x00007f8765c67b10>
> ent.size
6
```
可以發現在生成表面後，Entity 的 size 從 1 變成了 6，也就是一次增加了 5 個實體物件，而這 5 個物件分別是：
1. 表面
2. 端點1
3. 端點2
4. 端點3
5. 端點4

這 ５ 個物件是一個陣列，指的是這個平面物件。之後我們先選取的方式來確認這 4 個端點：
1. 先點擊該平面
2. 執行以下程式碼：

```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
sel = mod.selection # Current selection

vertices = sel[0].vertices

UI.messagebox "第一個端點#{vertices[0].position.cm}\n第二個端點#{vertices[1].position.cm}\n第三個端點#{vertices[2].position.cm}\n第四個端點#{vertices[3].position.cm}\n"
```
結果：
![picture 2](2021-07-13-Ruby搭配Sketchup學習筆記四-20f85cc50b8f491d965ce9284ee0ecf9be7054aba4a58c1aa38480537c7296ae.png)

### Face 物件搭配向量
依照上方的結果，我們可以發現一件事(單位問題請省略)，那就是寫入的端點順序與真正的端點順序並不相同，經由「右手四指定則」的四指和該端點的順序相比，可以發現大拇指是朝下的，也就是向量為 [0,0,-1]，那該如何修正呢？可以使用以下指令：
```ruby
test_face.normal # 確認修改之前的向量
test_face.reverse! # 把向量方向反轉
test_face.normal # 再次確認向量
```

### Face 類別的方法
以下紀錄幾個有用的方法
- area：回傳表面的面積
- edges：回傳組成表面的 Edges 陣列
- followme：沿著 Edges 陣列建立 3D 圖形
- pushpull：用來推拉表面形成 3D 圖形
- classify_point：回傳指定點在表面上的位置代表值
    - 0：無法判斷
    - 1：點在表面上
    - 2：點在端點上
    - 4：點在邊線上
    - 16：點在表面同一平面的外側或空洞中
    - 32：點不在表面平面上

## 三維物體
三維物體可以藉由二維表面拉抬而成，以下紀錄兩種方法
### pushpull 方法
pushpull 會將該二維表面依向量拉抬。範例程式碼示範如何製作一個立方體：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

test_face = ent.add_face [0,0,0],[10,0,0],[10,10,0],[0,10,0]

test_face.pushpull 10
```
輸出結果：

![picture 4](2021-07-13-Ruby搭配Sketchup學習筆記四-03ab5610c213d71b0a266b87dd27b08ecd35c2d401f57703f26dfc67b3decef4.png)
為什麼是往下的呢？抓出 test_face 的四個 vertex 再用「右手定則」比比看吧。

如果希望把它切角的話，該怎麼做呢？
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

test_face = ent.add_face [0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0]

test_face.reverse!
test_face.pushpull 10

cut_line = ent.add_line [10, 8, 10], [8, 10, 10] # 將表面一分為二

cut_line.faces[1].pushpull -10 # 將第二個表面往下壓
```
輸出結果：

![picture 6](2021-07-13-Ruby搭配Sketchup學習筆記四-b7305d2c08201cc12950f5f58d7af97d2851bb4ca58b7337e3829319a58cacc7.png)
在這個正方體的表面新增一條線，將此表面拆為兩份，並且將第二份往下壓。

### followme 方法
followme 與 pushpull 的差別在於其可以依照指定的路徑拉出三維圖形，也因此其可以不用考慮目前表面的向量，試想想你該如何用 pushpull 拉出一個有弧度的圓柱體呢？這一點 followme 輕鬆就能做到。

#### 立方體
同樣先建立一個立方體，這次使用 followme：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

depth = 10
width = 10

pt1 = [0, 0, 0]
pt2 = [width, 0, 0]
pt3 = [width, depth, 0]
pt4 = [0, depth, 0]

test_face = ent.add_face pt1, pt2, pt3, pt4

point1 = [0, 0, 0]; point2 = [0, 0, 10]
path = ent.add_line point1, point2
test_face.followme path
```
輸出結果：

![picture 7](2021-07-13-Ruby搭配Sketchup學習筆記四-63612ba44274c30195f5ee34e3f8c747ccdec939d04efdbd20e8bac07e41ada3.png)
其實還滿好理解的，假如要用 followme 的話，我們只需要給它一條線，之後他就會沿著這條線拉出立體圖了。

#### 立方體切邊
接著來看看假如想要將立方體周邊的角都去掉，該怎麼做：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

test_face = ent.add_face [0, 0, 0], [10, 0, 0], [10, 10, 0], [0, 10, 0]
test_face.pushpull -10

cut = ent.add_line [0, 0, 9], [1, 0, 10]
cut.faces[0].followme test_face.edges
```
輸出結果：

![picture 8](2021-07-13-Ruby搭配Sketchup學習筆記四-25d2c73900f1dc4e6c2a0edeb532315760e023791bf8aad7f065a4a7d1869174.png)
還記得 edges 是什麼嗎？就是表面周圍的邊。

#### 圓柱彎管
在這範例中，我們先建立一個圓形的表面，然後使用三角函數 sin 製作一個弧度路徑，之後使用 followme沿著這條路徑生成，最後再把這條路徑刪除。
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

# 製作圓形表面
circle = ent.add_circle [0, 0, 0], [1, 1, 0], 5 # 畫一個圓框
circle_face = ent.add_face circle # 使用圓框製作平面

# 製作路徑
pt = []
for i in 0..135
  pt[i] = [i, 100 * Math::sin(i.degrees), 0]
end
path = ent.add_curve pt

# 沿著路徑生成立體圖形
circle_face.followme path

# 刪除路徑
ent.erase_entities path
```
輸出結果：

![picture 9](2021-07-13-Ruby搭配Sketchup學習筆記四-da3e85e020dcf7afecbe4f892eea8c2cdfca564b37156139c9776051631b9e2b.png)

#### 球體和甜甜圈
要做出球體的道理很簡單，就跟把硬幣旋轉一樣，原本硬幣是圓形平面，當把它旋轉時，它將變成一個球體，在 Sketchup 中也是類似的做法，請看以下：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

center = [0, 0, 0]
radius = 5
# 製作圓形表面
circle = ent.add_circle center, [1, 1, 0], radius # 畫一個圓框
circle_face = ent.add_face circle # 使用圓框製作平面

# 製作路徑
path = ent.add_circle center, [0, 0, 1], radius+1 # 要比半徑大一點，不然刪不掉

# 沿著路徑生成立體圖形
circle_face.followme path

# 刪除路徑
ent.erase_entities path
```
輸出結果：

![picture 10](2021-07-13-Ruby搭配Sketchup學習筆記四-552b1dda26b2fd32513e40c26822d7f9a7e718683236fa912dac2b1533dd334a.png)
我們將二維表面與路徑做垂直，之後直接 followme 就可以得到這個結果。

假如我們把路徑的中心點偏移一點的話...
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

center = [0, 0, 0]
radius = 5
# 製作圓形表面
circle = ent.add_circle center, [1, 1, 0], radius # 畫一個圓框
circle_face = ent.add_face circle # 使用圓框製作平面

# 製作路徑
path = ent.add_circle [-5, 0, 0], [0, 0, 1], radius + 1 # 要比半徑大一點，不然刪不掉

# 沿著路徑生成立體圖形
circle_face.followme path

# 刪除路徑
ent.erase_entities path
```
輸出結果：

![picture 11](2021-07-13-Ruby搭配Sketchup學習筆記四-168ede2db56f8d559a47969ae18b57102e7470cdb3d4fc2554e32a2e056ec1b2.png)
看呀！它就變成甜甜圈了。

## 文字
### 二維文字
二維文字通常用作標示用途，其有 overloading 兩種用法，第一種是傳入兩個參數，第二種是傳入三個參數，以下看比較：

| 參數數量 | 第一個參數       | 第二個參數   | 第三個參數                   |
| -------- | ---------------- | ------------ | ---------------------------- |
| 2        | 放置要呈現的文字 | 文字開頭位置 |                              |
| 3        | 放置要呈現的文字 | 箭頭開頭位置 | 箭頭結束位置(空格後文字開頭) |

測試看看：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

ent.add_text "這是兩個參數的 add_text！", [0,0,0]
ent.add_text "這是三個參數的 add_text！", [0,0,0],[0,5,5]
```
輸出結果：

![picture 12](2021-07-13-Ruby搭配Sketchup學習筆記四-05f42736d810aaa31e793d2c2f55f2b32b80123dd00a0effb7a4094fcf19b761.png)

除此之外 Text 還有幾個方法可以用：
- text=：顯示的文字
- point=：文字起點或箭頭起點
- vector=：箭頭引出現終點的位置
- line_weight=：引出線的粗細
- arrow_type=：箭頭的外觀
    - 0：隱藏箭頭
    - 1：橫線形
    - 2：點形
    - 3：封閉形
    - 4：開放形
- leader_type=：引出線的樣式
    - 0：不作用
    - 1：檢視型(不會隨著檢視角度變化)
    - 2：圖釘型(隨著檢視角度變化)

### 三維文字
三維文字通常都是模型的一部分，使用三維文字的方法是 `.add_3d_text`，當然它還是在 Entity 類別之下，使用這個方法的參數有不少，以下是其參數：
```ruby
 .add_3d_text(string, alignment, fontname, bold, inalic, height, tolerance, baseZ, filled, extrusion)
```
基本上還滿好理解，除了幾個比較特別的額外介紹：
- tolerance：可以把它當作解析度，但這個值越高，品質越差
- baseZ：Z軸的尺寸
- filled：是否為實心字
- extrusion：若為實心字，設定三維文字的深度

範例程式碼：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

string = "Hello, World"

ent.add_3d_text(string, TextAlignLeft, "Arial", true, false, 1.0, 0.0, 0.5, true, 5.0)
```
執行結果：

![picture 13](2021-07-13-Ruby搭配Sketchup學習筆記四-6681de70fe7be66cc2fa41ff7e242edee46682a201af7cca6c4331f3f8ba0907.png)

## 轉形
轉型可以來進行移動、旋轉和縮放，在 Entities 類別中提供了 transform_entities 的方法，以下是範例：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

test_face = ent.add_face [0, 0, 0], [30, 0, 0], [30, 15, 0], [0, 15, 0]
test_face.pushpull 10

roof_line = ent.add_line [15, 0, 5], [15, 15, 5]

tr = Geom::Transformation.translation [0, 0, 10]
ent.transform_entities tr, roof_line
```
輸出結果：

![picture 14](2021-07-13-Ruby搭配Sketchup學習筆記四-7526010c8491a4afdcdc7ec415ba8e34b1c2ad20fe6044e3ccf574fbbb883d7e.png)
是不是覺得很神奇，怎麼突然就有個屋頂，依我的理解，此段程式應該是當 roof_line 建立時，因為上 test_face 的表面上，因此它會將該表面畫分為二，當 roof_line 被拉到 [0,0,10] 時，由於物件相連，因此那兩個表面也會被拉抬。

Geom::Transformation 共有三種方法，分別是：
- translation：轉移
- ratation：旋轉
- scaling：縮放

### Translation 轉移
 Translation 轉移所接受的參數是轉移前後的距離，共有 3 種方式可以執行，以下逐一示範：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

tran_face = ent.add_face [0, 0, 0], [30, 0, 0], [30, 15, 0], [0, 15, 0]

# 第一種
t = Geom::Transformation.new [15, 0, 0]
ent.transform_entities t, tran_face

# 第二種
t = Geom::Transformation.translation [0, 12, 0]
ent.transform_entities t, tran_face

# 第三種
ent.transform_entities [-13, 0, 0], tran_face
```
最後輸出只會看到結果，假如想到確認每一步，可以按下 ctrl+z 一步一步退回。

### Ratation 旋轉
旋轉的需要三個資訊，分別是：
1. 旋轉的定點
2. 旋轉的軸
3. 旋轉的角度

以下示範旋轉的做法：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

tran_face = ent.add_face [0, 0, 0], [30, 0, 0], [30, 15, 0], [0, 15, 0]

# 第一種
t = Geom::Transformation.new [0, 0, 0], [0, 1, 0], 30.degrees
ent.transform_entities t, tran_face

# 第二種
t = Geom::Transformation.rotation [0, 0, 0], [0, 0, 1], 90.degrees
ent.transform_entities t, tran_face
```
輸出結果：

![picture 15](2021-07-13-Ruby搭配Sketchup學習筆記四-b9ed05b6c6e47a6508f9f088afab0e29ef720d776971bc857e707a58632d2231.png)
第二個參數一樣可以用「右手定則輔助」。

### Scaling 縮放
縮放要特別注意的是除了面積會縮小外，端點也會縮小。

以下示範縮放：
```ruby
# Default code, use or delete...
mod = Sketchup.active_model # Open model
ent = mod.entities # All entities in model

tran_face = ent.add_face [0, 0, 0], [30, 0, 0], [30, 15, 0], [0, 15, 0]

# 第一種
t = Geom::Transformation.new 0.5
ent.transform_entities t, tran_face

# 第二種
t = Geom::Transformation.scaling 0.5
ent.transform_entities t, tran_face
```
輸出結果：

![picture 16](2021-07-13-Ruby搭配Sketchup學習筆記四-d99ec012fd9b4f342ba8561e0626fc2163dfde8ce4752d2fc1d404c145c03763.png)
因為縮小的 0.5 倍兩次，因此為原本的 0.25 倍。

`Geom::Transformation.scaling` 總共有 overloading 四種定義，以下逐一說明：

| 參數數量 | 第一個參數 | 第二個參數 | 第三個參數 | 第四個參數 |
| -------- | ---------- | ---------- | ---------- | ---------- |
| 1        | 比例       |            |            |            |
| 2        | 新原點     | 比例       |            |            |
| 3        | X軸比例    | Y軸比例    | Z軸比例    |            |
| 4        | 新原點     | X軸比例    | Y軸比例    | Z軸比例    |

以上共四種，但要特別注意的是新原點也會受到比例縮放的影響。

#### 綜合應用
轉形共有 3 種不同的功用，那假如想要轉移之後旋轉，是不是就要寫兩段呢？其實不用，只要把轉移和移動 `Geom::Transformation.new` 出來的物件以 `*` 進行連接即可。
> 請注意，假如是 `total = t_rotation * t_translation`的話，會是先轉移再旋轉，也就是右邊的先執行

## 參考資料
- [當SketchUp遇見Ruby：邁向程式化建模之路](https://www.books.com.tw/products/0010683532)
