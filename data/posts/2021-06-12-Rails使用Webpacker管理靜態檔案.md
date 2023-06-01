---
# Rails使用 Webpacker 管理靜態檔案
title:  "Rails使用 Webpacker 管理靜態檔案"
createdAt:   2021-06-12 09:00:00 +0800
categories: Note
tags:  [Rails]
description: Rails專案中可能會有許多靜態的檔案，例如：JavaScript、Stylesheets 和圖檔，把所有的靜態檔案都放在`public`目錄或許是個選擇，但是檔案一多的時候，就不好管理了。因此為了便於管理這些檔案，Rails 提供以下兩種方式： 1. Webpacker 2. Assets Pipeline 雖然從Rails 6後預設使用 Webpacker 來管理 Javascript 並使用 Asset Pipeline 管理 CSS，但是要使用其中一邊管理全部的靜態資源也是可以的，因為[上篇](https://blog.wells.tw/posts/Rails%E4%BD%BF%E7%94%A8Assets-Pipeline%E7%AE%A1%E7%90%86%E9%9D%9C%E6%85%8B%E6%AA%94%E6%A1%88/)已經寫過使用 Assets Pipeline 的方式管理靜態資料，因此本篇介紹使用 Webpacker 的方式來實作。

---
# Rails使用 Webpacker 管理靜態檔案
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

## 簡介
  Rails專案中可能會有許多靜態的檔案，例如：JavaScript、Stylesheets 和圖檔，把所有的靜態檔案都放在`public`目錄或許是個選擇，但是檔案一多的時候，就不好管理了。

因此為了便於管理這些檔案，Rails 提供以下兩種方式：
1. Webpacker
2. Assets Pipeline

雖然從Rails 6後預設使用 Webpacker 來管理 Javascript 並使用 Asset Pipeline 管理 CSS，但是要使用其中一邊管理全部的靜態資源也是可以的，因為[上篇](https://blog.wells.tw/posts/Rails%E4%BD%BF%E7%94%A8Assets-Pipeline%E7%AE%A1%E7%90%86%E9%9D%9C%E6%85%8B%E6%AA%94%E6%A1%88/)已經寫過使用 Assets Pipeline 的方式管理靜態資料，因此本篇介紹使用 Webpacker 的方式來實作。

## 操作步驟
以下示範使用 Webpacker 搭配已經寫好的模板：
1. 下載模板
2. 複製模板必要內容至專案
3. 安裝 bootstrap
4. 更改靜態資源的取得路徑
5. 其他問題

### 下載模板
本篇文章使用`Start Bootstrap-Landing Page`作為模板範例，首先請先下載該[專案](https://github.com/StartBootstrap/startbootstrap-landing-page)或使用git進行下載<br>
`git clone https://github.com/StartBootstrap/startbootstrap-landing-page.git`·
> 下載完成後可以進入該資料夾執行`npm start`，即可瀏覽網頁，如果沒裝npm也沒關係，直接點擊`dist/index.html`就好

![](startbootstrap-landing-page.png)

### 複製模板必要內容至專案
必要內容包含 `scss`、`image` 和 `dist/index.html` 中的程式碼
- 複製模板 `src/scss` 之下所有內容到專案 `app/javascript/stylesheets` 資料夾（沒有就新增）
- 複製模板 `src/assets/img`之下所有圖片到專案 `app/javascript/images` 資料夾（沒有就新增）

#### 新增 Controller
由於我們下載的是一個首頁的模板，為了不打亂原本的專案，因此我們另外創建一個 Controller
- 執行`rails g controller landing`新增 Controller
- 修改`landing_controller`中的內容
<br>把此段程式碼刪除
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
- 在 `config/routes` 中設定根路徑 `root to: "landing#index"`
- 在 `app/views/landing` 中新增 `index.html.erb`，並且複製模板 `dist/index.html` 的 `body` 區塊到 `index.html.erb`
- 在 `app/views/layouts` 中新增 `landing.html.erb`，複製 `app/views/layouts/application.html.erb` 的內容到裡面
- 把模板`dist/index.html`中的以下內容全部貼到`app/views/layouts/landing.html.erb`的`head`區塊

    ```html
    <!-- Font Awesome icons (free version)-->
    <script src="https://use.fontawesome.com/releases/v5.15.3/js/all.js" crossorigin="anonymous"><script>
    <!-- Simple line icons-->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.5.5/csssimple-line-icons.min.css" rel="stylesheet" type="text/css" />
    <!-- Google fonts-->
    <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic700italic" rel="stylesheet" type="text/css" />

    ```
- 在 `app/javascript/packs/application.js` 之中加入此段，引入模板 scss
```ruby
import 'stylesheets/styles.scss'
```

### 安裝 bootstrap
由於此模板需要 bootstrap，因此必須安裝，安裝步驟參考[Rails 6 使用 Bootstrap](https://medium.com/@hitobias/rails-6-%E4%BD%BF%E7%94%A8-bootstrap-6201ec4df75e)，但有少許修改，依下方為主

- 執行`yarn add bootstrap@4 jquery popper.js`安裝 bootstrap 相關套件
- 在`app/javascript/packs/application.js`之中加入 bootstrap 相關套件
```ruby
import 'jquery'
import 'popper.js'
import 'bootstrap'
window.jQuery = $ #jquery使用，此範例不加此行也可以正常執行
window.$ = $ #jquery使用，此範例不加此行也可以正常執行
```
- 新增 `app/javascript/stylesheets/site.scss` 檔案，在其中加入以下內容
```ruby
@import "~bootstrap/scss/bootstrap.scss";
```
- 在`app/javascript/packs/application.js`之中加入此段，引入 bootstrap
```ruby
import 'stylesheets/site.scss'
```
- 設定 Webpacker，在 `config/webpack/environment.js`加入以下內容
```ruby
const { environment } = require('@rails/webpacker')
const webpack = require('webpack');
environment.plugins.append(
    'Provide',
    new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        Popper: ['popper.js', 'default'],
    })
);
module.exports = environment
```

### 更改靜態資源的取得路徑
- 在`app/javascript/packs/application.js`加入此段
```ruby
require.context("../images", true)
```
- 更改 `app/views/layouts/landing.html.erb` 的圖片 url
<br>將有使用到圖片 url，替換成以下 helper 寫法
```ruby
asset_pack_path 'media/images/檔名.jpg'
```
- 將 `app/javascript/stylesheets` 資料下的圖檔 url 更改為相對路徑

到了這一步，執行 `rails s` 就應該可以看到正常的畫面了。

## 其他設定
如果想要指定在 production 環境運行的話，需要進行以下動作：
- `RAILS_ENV=production webpacker:compile` Webpacker重新編譯
- `RAILS_SERVE_STATIC_FILES=true rails server -e production`<br>
    config.serve_static_files在預設時是 `true` ，但在 production 環境下會是 `false`，這是因為提供靜態資源應為伺服器軟體負責的，如 Apache、Nginx 等。[相關連結](https://stackoverflow.com/questions/21969549/rails-application-css-asset-not-found-in-production-mode)、[Rails指南](https://guides.rubyonrails.org/v4.2/configuring.html)

## 結語
本篇文章主要是拿來紀錄使用 Webpacker 的過程，寫這篇文得時候我感覺是在做一件挖坑給自己跳的事情，雖然之前有做過，但當時為了趕工，留下了許多技術負債，也因為要寫這篇文，我不得不把每一個坑都跳過一遍，但藉著這個機會也讓我對於 Webpacker 更加了解。

## 參考連結
- [rails - application.css asset not found in production mode](https://stackoverflow.com/questions/21969549/rails-application-css-asset-not-found-in-production-mode)
- [Rails指南](https://guides.rubyonrails.org/v4.2/configuring.html)
- [如何在 Rails 使用 Webpacker（上）](https://kaochenlong.com/2019/11/21/webpacker-with-rails-part-1/)
- [如何在 Rails 使用 Webpacker（中）](https://kaochenlong.com/2019/11/21/webpacker-with-rails-part-2/)
- [Importing images with Webpacker](https://rossta.net/blog/importing-images-with-webpacker.html)
