---
# Rails使用Assets Pipeline管理靜態檔案
title:  "Rails使用Assets Pipeline管理靜態檔案"
createdAt:   '2021-05-11T09:50:00Z'
categories: Note
tags:  [Rails]
description: Rails專案中可能會有許多靜態的檔案，例如：JavaScript、Stylesheets和圖檔，把所有的靜態檔案都放在`public`目錄或許是個選擇，但是檔案一多的時候，就不好管理了。

---
# Rails使用Assets Pipeline管理靜態檔案
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

## 簡介
  Rails專案中可能會有許多靜態的檔案，例如：JavaScript、Stylesheets和圖檔，把所有的靜態檔案都放在`public`目錄或許是個選擇，但是檔案一多的時候，就不好管理了。

因此為了便於管理這些檔案，Rails提供以下兩種方式：
1. Webpacker
2. Assets Pipeline

雖然從Rails 6後預設使用Webpacker來處理Javascript和Asset Pipeline處理CSS，但還是能使用Asset Pipeline管理全部的靜態檔案。

前陣子為了套上模板頁面，因而接觸到Asset Pipeline，所以本篇就來紀錄一下~~這個過時的~~Asset Pipeline管理靜態資源的方法吧。

## 操作步驟
### 下載模板
本篇文章使用`Start Bootstrap-Landing Page`作為模板範例，首先請先下載該[專案](https://github.com/StartBootstrap/startbootstrap-landing-page)或使用git進行下載<br>
`git clone https://github.com/StartBootstrap/startbootstrap-landing-page.git`
> 下載完成後可以進入該資料夾執行`npm start`，即可瀏覽網頁，如果沒裝npm也沒關係，直接點擊`dist/index.html`就好

![](startbootstrap-landing-page.png)

### 複製所需靜態檔案到專案
接著我們需要把模板的以下內容放到   自己的Rails專案
- `scss/*`複製到`你的專案/app/assets/stylesheets`
> `*`代表所有檔案
- `assets/img/*`複製到`你的專案/app/assets/images`

### 新增Layout
由於我們下載的是一個首頁的模板，為了不打亂原本的專案，因此我們另外創建一個Layout
- `rails g controller landing`
- 修改`landing_controller`中的內容
把此段程式碼刪除
```ruby
class LandingController < ApplicationController
end
```
替換成以下
```ruby
class LandingController < ActionController::Base
    def index
    end
end
```
- 在`config/routes`中設定根路徑`root to: "landing#index"`
- 在`app/views/landing`中新增`index.html.erb`，並且複製模板`dist/index.html` 的`body`部分到`index.html.erb`
- 在`app/views/layouts`中新增`landing.html.erb`，複製`app/views/layouts/application.html.erb`的內容到裡面
- 把模板`dist/index.html`中的以下內容全部貼到`app/views/layouts/landing.html.erb`的`head`區塊

    ```html
    <!-- Font Awesome icons (free version)-->
    <script src="https://use.fontawesome.com/releases/v5.15.3/js/all.js" crossorigin="anonymous"><script>
    <!-- Simple line icons-->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/csssimple-line-icons.min.css" rel="stylesheet" type="text/css" />
    <!-- Google fonts-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic700italic" rel="stylesheet" type="text/css" />

    ```

### 使用Assets Pipeline
- 依照下方指示修改`app/views/layouts/landing.html.erb`
把此段程式碼刪除
```ruby
<%= javascript_pack_tag 'application' %>
```
替換成以下
```ruby
<%= stylesheet_link_tag 'landing', media: 'all' %>
```

> 這一步是讓`landing`這個layout使用Assets Pipeline而並非Webpacker，並且使用`landing.scss`作為Stylesheet

- 複製`app/assets/styles.scss`的內容到`app/assets/landing.scss`中
- 刪除`app/assets/stylesheets/application.css`中的` *= require_tree .`

到達這一步後你可以使用`rails s`來測試看看，你可能會看到以下畫面
![](沒有圖片的畫面.png)

### 修改圖檔URL
會發生這種情況是因為圖片放在assets中Rails會將檔案加密，因而導致找不到圖片，因此我們修改圖檔的路徑，依照不同的檔案屬性，我們也會以不同的方式進行修改。

1. 在`app/views/layouts/landing.html.erb`中，請將`background-image: url('assets/img/檔名.jpg')`更換為`url('<%= asset_path('檔名.jpg')%>')">`
2. 在`app/assets/stylesheets/sections/_call-to-action.scss`中，請將`url('../assets/img/bg-masthead.jpg')`更換為`url('<%= asset_path("bg-masthead.jpg") %>')`，並且更改檔名為`_call-to-action.scss.erb`
2. 在`app/assets/stylesheets/sections/_masthead.scss`中，請將`url('../assets/img/bg-masthead.jpg')`更換為`url('<%= asset_path("bg-masthead.jpg") %>')`，並且更改檔名為`_masthead.scss.erb`

之後再次重啟server，一切都會變好了

## 結語
本篇文章主要是拿來紀錄使用Assets Pipeline的過程，第一次搞的時候是拖累同事一起跟我debug，但是在debug的途中也對於Assets Pipeline漸漸地瞭解了，寫完這篇文章後，接著就要來研究Webpacker啦～
