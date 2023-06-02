---
title:  "Rails 搭配 Omniauth line"
createdAt:   '2021-07-21T09:00:00Z'
categories: Note
tags:  [Rails]
description: 本篇內容 1. 前置作業 2. 安裝相關套件 3. 生成 User Model 4. 設定  Line Login 5. 新增身份驗證 6. 實作登入登出

---
# Rails 搭配 Omniauth line

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

## 本篇內容
- 前置作業
- 安裝相關套件
- 生成 User Model
- 設定  Line Login
- 新增身份驗證
- 實作登入登出

## 前置作業
### 1. 建立新檔案
使用 Rails 指令新增專案：
```shell
rails new demo
cd demo
```
### 2. 產生空白頁
使用 Rails 指令新增 Controller：
```shell
rails g controller home
```
之後新增 `app/views/home/index.html.erb`。

最後在 `config/routes.rb` 中新增以下內容：
```ruby
root to: "home#index"
```
## 安裝相關套件
在 `Gemfile` 中加入以下內容：
```ruby
gem 'devise'
gem 'omniauth-line', git: 'https://github.com/etrex/omniauth-line.git'
gem "dotenv-rails", "~> 2.7"
```
加入後執行 `bundle`。
## 生成 User Model
請執行以下指令：
```shell
rails g devise:install
rails g devise user
rails g migration add_line_login
```
開啟剛剛新增的 `db/migrate/xxxxxxxxx_add_line_login.rb` 並在 `change` 方法中加入以下內容：
```ruby
add_column :users, :line_id, :string
add_column :users, :name, :string
add_column :users, :image_url, :string
```
另外，由於我們之後要以 `line_id` 區分使用者，這導致 `email` column 的值可能會重複（因為 Devise 預設 email 的值為 '' ），因此需要解決 `email` 重複的問題，以下新增一個 migration：
```shell
rails g migration resolve_users_email_unique
```
開啟新增的 `db/migrate/xxxxxxxxx_resolve_users_email_unique.rb` 更改為以下內容：
```ruby
def up
  change_column :users, :email, :string, null: true, default: nil
end
def down
  change_column_null :users, :email, false, SecureRandom.uuid
end
```
此段主要為修改 `email` column，當 `user` 被建立時，預設值為 `nil`，以此來避免唯一鍵重複，而 `down` 中的 `SecureRandom.uuid` 則是為了避免原本 `email` 為 `nil` 的資料 `db rollback` 後發生重複的問題。
到了這一步後就可以執行 Database migrate：
```shell
rails db:migrate
```

## 設定  Line Login
新增 `.env` 並在其中放入以下內容：
```
LINE_LOGIN_CHANNEL_ID= 你的 CHANNEL ID
LINE_LOGIN_CHANNEL_SECRET= 你的 CHANNEL SECRET
```
該資訊可以在 [Line Developers](https://developers.line.biz/console/) 找到，點擊 LINE LOGIN 的 CHANNEL，可以看到以下畫面：
![picture 1](2021-07-21-rails-搭配-omniauth-line-7e293f196b7688812d36ece3d5ff2b9121aff6c9c21ea54c7cc206fd9d815ef0.png)
> LINE LOGIN CHANNEL ID，複製該內容貼至 `.env`

![picture 2](2021-07-21-rails-搭配-omniauth-line-c441b37fbbc25874f27e45d85313d080a618e8df09b5e66bf6b0fa9bac47677d.png)
> LINE LOGIN CHANNEL SECRET，複製該內容貼至 `.env`（與 LINE LOGIN CHANNEL ID 同頁面的下方）

![picture 3](2021-07-21-rails-搭配-omniauth-line-eccc5b73628a8496a05c002ed5fb4bf9a1715bd4ab252aa2d7b1c1a34c27728d.png)
> 在 Callback URL 部分填入 `https://{your-domain-name}/users/auth/line/callback`

在 `config/initializers/devise.rb` 的 `Devise.setup` 區塊中新增以下內容：
```ruby
config.omniauth :line, ENV['LINE_LOGIN_CHANNEL_ID'], ENV['LINE_LOGIN_CHANNEL_SECRET']
```

在 `app/models/user.rb` 開啟 Omniauthable 功能
```diff
devise :database_authenticatable, :registerable,
-        :recoverable, :rememberable, :validatable
+        :recoverable, :rememberable, :validatable,
+       :omniauthable, omniauth_providers: [:line]
```

在 `app/models/user.rb` 新增 `from_omniauth` 方法
```ruby
def self.from_omniauth(auth)
    if auth.provider == "line"
        user = User.find_or_create_by(line_id: auth.uid)
        user.update(name: auth.info.name, image_url: auth.info.image)
        user
    end
end
```

因為 LINE Login 只會傳入 `line_id` 而沒有 `email` 和 `password`，因此 `email` 和 `password` 為非必填，在 `app/models/user.rb` 中加入以下內容：
```ruby
def email_required?
    false
end

def password_required?
    false
end
```

新增 omniauth controller
```shell
rails g controller OmniauthCallbacks
```
並在其中填入以下內容：
```ruby
def line
    user = User.from_omniauth(request.env["omniauth.auth"] )
    sign_in user
    redirect_to root_path
end
```

在 `config/routes.rb` 中加入以下內容：
```diff
-   devise_for :users
+   devise_for :users, controllers: {
+        omniauth_callbacks: 'omniauth_callbacks'
+    }
```

## 新增身份驗證
在 `app/controllers/application_controller.rb` 中加入以下內容：
```ruby
include Rails.application.routes.url_helpers

def authenticate_user
    return if current_user.present?
    redirect_to user_line_omniauth_authorize_path
end
```
之後只需要在先登入才能進行動作的 Controller 中加入以下內容：
```ruby
before_action :authenticate_user
```
> Devise 預設是 `before_action :authenticate_user!`

![picture 4](2021-07-21-rails-搭配-omniauth-line-cc976c6e4eff721e56be1bdc9bb537b82423b0d3614770c3fe072ab87bd9c4d0.png)

## 實作登入登出
完成至上一步已經可以進行 Line Login，但假如希望登入登出這件事並非強制的話，可以增加登入登出的列表。

在 `app/views/layouts/application.html.erb` 的 `<body> ... </body>` 之中加入以下內容：
```erb
 <nav>
    <h1>
    <% if current_user.present? %>
        <%= current_user.name %> 您好：
        <%= link_to "登出", destroy_user_session_path, method: :delete  %>
    <% else %>
        <%= link_to "登入", user_line_omniauth_authorize_path %>
    <% end %>
    <h1>
    <hr />
</nav>
```

這樣子就可以在未登入時可以登入：
![picture 1](2021-07-21-rails-搭配-omniauth-line-8cfba153cbcf5556c7ffa33539015bc3f70971642efd211790e2c92f3e736f81.png)

已登入時可以登出：
![picture 2](2021-07-21-rails-搭配-omniauth-line-2bfab160b2892a66381ee5acb2f13ef92dfeda936e362fd40d9ee4924960a6e6.png)


## 參考資料
- [Kamigo LINE Bot 框架 - 實作簡單的取號機器人](https://docs.google.com/presentation/d/1WCeoOwDzq-oeBWXeUIYUsfpBbDRSnMhBWMeqYEfQ6jU/edit?fbclid=IwAR1UMGY7GxGLWmwP03a1Uov_fGJ8Z7q_OWxn3iOcI1ZtPf2FHVT7bGY94PQ#slide=id.p)
- [使用者認證-Rails實戰聖經](https://ihower.tw/rails/auth.html)
