---
title:  "Kamigo 搭配 Devise 實作會員功能"
createdAt:   '2021-07-11T09:50:00Z'
categories: Tutorial
tags:  [Rails, Chatbot]
description: 前陣子在做實作[台科不分系學姊](https://github.com/jhang-jhe-wei/NTUST-Senior)時，發現需要會員機制，但假如直接開一個表單要使用者註冊似乎又有點太麻煩， 因為最終傳到 Server 的每一條訊息都已經帶有使用者資訊，於是和卡米哥討論該怎麼做，沒想到他早就已經做過了，而且還結合了 Devise，十分的方便，真是偉哉偉哉卡米哥。

---
# Kamigo 搭配 Devise 實作會員功能

我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。
## 簡介
前陣子在做實作[台科不分系學姊](https://github.com/jhang-jhe-wei/NTUST-Senior)時，發現需要會員機制，但假如直接開一個表單要使用者註冊似乎又有點太麻煩， 因為最終傳到 Server 的每一條訊息都已經帶有使用者資訊，於是和卡米哥討論該怎麼做，沒想到他早就已經做過了，而且還結合了 Devise，十分的方便，真是偉哉偉哉卡米哥。

## 前提提要
此篇文的前提是使用[ Rails 的 Kamigo 框架](https://github.com/etrex/kamigo)進行 Line Chatbot 開發，如果還不知道如何使用 Kamigo 可以查看前方的連結，參考該 Repo 的 README.md 進行實作。

## 操作步驟
1. 安裝相關 Gem
2. 生成 User Model
3. 設定 Devise
4. 認證 User

#### 安裝相關 Gem
在 `Gemfile` 中加入以下內容：
```ruby
gem 'devise'
```
之後執行：
```shell
bundle install
```

#### 生成 User Model
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

#### 設定 Devise
由於 User 使用 `line_id` 進行區分，因此 `email` 和 `password` 為非必填，在 `app/models/user.rb` 加入以下內容：
```ruby
def email_required?
    false
end

def password_required?
    false
end
```

#### 認證 User
在 `app/controllers/application_controller.rb` 加入以下內容：
```ruby
include Rails.application.routes.url_helpers
before_action :line_messaging_login

def line_messaging_login
  user = User.from_kamigo(params)
  sign_in user if user.present?
end
```
在 `app/models/user.rb` 加入以下內容：
```ruby
# params[:source_user_id]
# params[:profile][:displayName]
def self.from_kamigo(params)
  if params[:profile].present? && params[:source_user_id].present?
    line_id = params.dig(:source_user_id)
    name = params.dig(:profile, :displayName)
    user = User.find_or_create_by(line_id: line_id)
    user.update(name: name)
    user
  end
end
```
完成到這一步後，每次使用者傳訊息至 Line Chatbot 都會判斷 `line_id` 是否已存在於 users 中，如果沒有會建立，最後的功能就和 Devise 一樣，可以在 controller 中使用 `current_user` 進行操作。

## 結語
會員功能就是這麼簡單就做好了，當然這都要歸功於 Kamigo 框架本身就寫得與 Rails 息息相關，目前來說雖然已經完成在 Line Chatbot 中確認使用者，但假如使用者開啟網頁就沒辦法確認了，因此下一篇會介紹使用 Line Login 擴充此會員功能。

## 參考連結
[Kamigo LINE Bot 框架 - 實作簡單的取號機器人](https://docs.google.com/presentation/d/1WCeoOwDzq-oeBWXeUIYUsfpBbDRSnMhBWMeqYEfQ6jU/edit?fbclid=IwAR1UMGY7GxGLWmwP03a1Uov_fGJ8Z7q_OWxn3iOcI1ZtPf2FHVT7bGY94PQ#slide=id.p)
