---
# Rails Deploy 筆記
title:  "Rails Deploy 筆記"
createdAt:   2021-07-28 00:00:00 +0800
categories: Note
tags:  [Rails, GCP]
description: 近期 GCP 的免費額度快沒了，身為一位免費仔我決定再開一個帳號進行移機動作，但每次移機都會發現一些詭異的事情導致浪費一整天，故寫下這個筆記希望以後移機可以快一點。

---
# Rails Deploy 筆記
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

# 簡介
近期 GCP 的免費額度快沒了，身為一位免費仔我決定再開一個帳號進行移機動作，但每次移機都會發現一些詭異的事情導致浪費一整天，故寫下這個筆記希望以後移機可以快一點。

# 設定流程
- [ 簡介](#簡介)
- [設定流程](#設定流程)
- [開始設定](#開始設定)
  - [設定 SSH](#設定-ssh)
  - [安裝 RVM](#安裝-rvm)
  - [安裝 Ruby on Rails](#安裝-ruby-on-rails)
  - [安裝 NVM](#安裝-nvm)
  - [安裝 Nodejs 和 Yarn](#安裝-nodejs-和-yarn)
  - [安裝 Database](#安裝-database)
    - [MySQL](#mysql)
    - [PostgreSQL](#postgresql)
  - [安裝 Passenger + Nginx](#安裝-passenger--nginx)
    - [確認安裝成功](#確認安裝成功)
  - [設定 Passenger + Nginx](#設定-passenger--nginx)
  - [新增 Ngork](#新增-ngork)
  - [Bundle lock 新增 Linux Platform](#bundle-lock-新增-linux-platform)
  - [加入 Capistrano Gem 至專案](#加入-capistrano-gem-至專案)
  - [設定 Capistrano](#設定-capistrano)
  - [新增 database.yml](#新增-databaseyml)
  - [新增 secrets.yml](#新增-secretsyml)
  - [建立憑證](#建立憑證)
  - [安裝 Chromedriver](#安裝-chromedriver)
  - [常見狀況](#常見狀況)
    - [相同 Domain Name 但 SSH 連不上](#相同-domain-name-但-ssh-連不上)
    - [假如 Server 上的 RVM 找不到](#假如-server-上的-rvm-找不到)

# 開始設定
## 設定 SSH
請參考 [建立ssh連線到遠端伺服器](../建立ssh連線到遠端伺服器/index.html)。

## 安裝 RVM
由於 [rvm](https://rvm.io/) 在 Ubuntu 有專用的軟體包，以下指令為 [此篇](https://github.com/rvm/ubuntu_rvm) 擷取：
```shell
sudo apt-get install software-properties-common
sudo apt-add-repository -y ppa:rael-gc/rvm
sudo apt-get update
sudo apt-get install rvm
sudo usermod -a -G rvm $USER
```
> 安裝完後記得把 RVM 加入環境變數，之後執行 `source /home/deploy/.bashrc`。

## 安裝 Ruby on Rails
```shell
rvm install 2.7.2
gem install bundler
gem install rails -v 6.1.2
rails --version
```
## 安裝 NVM
```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```
> 將 NVM 加入環境變數後，執行 `source /home/deploy/.bashrc`。

## 安裝 Nodejs 和 Yarn
```shell
nvm install node
npm install -g yarn
```
## 安裝 Database
### MySQL
```shell
sudo apt-get install mysql-common mysql-client libmysqlclient-dev mysql-server
mysql -u root -p
CREATE DATABASE databasename CHARACTER SET utf8mb4;
```
> 如果遇到 `ERROR 1698 (28000): Access denied for user 'root'@'localhost'` 參考 [此篇](https://mustgeorge.blogspot.com/2011/11/mysql-error-1045-28000-using-password.html)。

### PostgreSQL
```shell
sudo apt-get install postgresql libpq-dev postgresql-contrib
sudo -u postgres psql
\password
\quit
sudo -u postgres createdb demo-production
```

## 安裝 Passenger + Nginx
擷取 [此篇](https://www.phusionpassenger.com/library/walkthroughs/deploy/ruby/ownserver/nginx/oss/xenial/install_passenger.html) 內容，執行以下指令：
```shell
sudo apt-get install nginx

sudo apt-get install -y dirmngr gnupg
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 561F9B9CAC40B2F7
sudo apt-get install -y apt-transport-https ca-certificates

sudo sh -c 'echo deb https://oss-binaries.phusionpassenger.com/apt/passenger xenial main > /etc/apt/sources.list.d/passenger.list'
sudo apt-get update

sudo apt-get install -y nginx-extras passenger
```
> 安裝完後重啟server `sudo service nginx restart`

### 確認安裝成功
```shell
sudo /usr/bin/passenger-config validate-install #選擇`Passenger itself`
sudo /usr/sbin/passenger-memory-stats # 確認Nginx和Passenger有在運行
```

## 設定 Passenger + Nginx
編輯 `/etc/nginx/nginx.conf`
```diff
    # 讓 Nginx 可以讀到環境變量 PATH，Rails 需要這一行才能調用到 nodejs 來編譯靜態檔案
+   env PATH;

    user www-data;
    worker_processes auto;
    pid /run/nginx.pid;

    events {
    worker_connections 768;
    # multi_accept on;
    }

http {

    # 關閉 Passenger 和 Nginx 在 HTTP Response Header 的版本資訊，減少資訊洩漏
+   passenger_show_version_in_header off;
+   server_tokens       off;

    # 設定檔案上傳可以到100mb，默認只有1Mb超小氣的，上傳一張圖片就爆了
+   client_max_body_size 100m;

    gzip on;
    gzip_disable "msie6";

    # 最佳化 gzip 壓縮
+   gzip_comp_level    5;
+   gzip_min_length    256;
+   gzip_proxied       any;
+   gzip_vary          on;
+   gzip_types application/atom+xml application/javascript application/x-javascript application/json application/rss+xml application/vnd.ms-fontobject application/x-font-ttf application/x-web-app-manifest+json application/xhtml+xml application/xml font/opentype image/svg+xml image/x-icon text/css text/xml text/plain text/javascript text/x-component;

    # 打開 passenger 模組
-   # include /etc/nginx/passenger.conf;
+   include /etc/nginx/passenger.conf;
```
新增`/etc/nginx/sites-available/${project-name}`這個檔案，並填入以下內容：
```
server {
    listen 80;
    server_name 1.2.3.4;   # 用你自己的服務器 IP 位置

    root /home/deploy/${project-name}/current/public; # 用你自己的項目名稱位置

    passenger_enabled on;

    passenger_min_instances 1;

    location ~ ^/assets/ {
        expires 1y;
        add_header Cache-Control public;
        add_header ETag "";
        break;
    }
}
```
執行以下指令：
```shell
cd ../sites-enabled/
sudo ln -s ../sites-available/${project-name} .
service nginx restart
```
## 新增 Ngork
新增 `etc/nginx/sites-available/ngrok`，填入以下內容：
```
server {
  server_name ngrok.yourdomain.com;
  # 這邊設定你要設定的 url
  location / {
      proxy_pass http://localhost:3333/;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header Host $host;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto https; # 如果有設定 https 要加上這行
  }
}
```
執行以下指令：
```shell
cd ../sites-enabled/
sudo ln -s ../sites-available/ngrok .
service nginx restart
```

## Bundle lock 新增 Linux Platform
至專案中執行以下指令：
```shell
bundle lock --add-platform x86_64-linux
```
> 執行完後要再推到 Repo

## 加入 Capistrano Gem 至專案

在 `Gemfile` 的 `development` 區塊中加入以下 Gem：
```
gem "capistrano-rails"
gem "capistrano-passenger"
gem 'capistrano-rvm'
```
接著執行以下指令：
```shell
bundle install
cap install
```

## 設定 Capistrano
編輯 `Capfile`，加入以下內容
```
require 'capistrano/rails'
require 'capistrano/passenger'
require "capistrano/rvm"
```
編輯`config/deploy.rb`
```diff
+  sh "ssh-add"

   # config valid only for current version of Capistrano
   lock "3.8.1"

-  set :application, "my_app_name"
+  set :application, "demo"   # 請用你自己的項目名稱

-  set :repo_url, "git@example.com:me/my_repo.git"
+  set :repo_url, "git@github.com:growthschool/rails-recipes.git"    # 請用你自己項目的git位置

+  set :rvm_custom_path, '/usr/share/rvm'  # only needed if not detected
   # Default branch is :master
   # ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

   # Default deploy_to directory is /var/www/my_app_name
   # set :deploy_to, "/var/www/my_app_name"
+  set :deploy_to, "/home/deploy/demo"     # 這樣服務器上代碼的目錄位置，放在 deploy 帳號下。請用你自己的項目名稱。

   # Default value for :format is :airbrussh.
   # set :format, :airbrussh

   # You can configure the Airbrussh format using :format_options.
   # These are the defaults.
   # set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

   # Default value for :pty is false
   # set :pty, true

   # Default value for :linked_files is []
-  # append :linked_files, "config/database.yml", "config/secrets.yml"
+  append :linked_files, "config/database.yml", "config/secrets.yml"

   # Default value for linked_dirs is []
-  # append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"
+  append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

+  set :passenger_restart_with_touch, true

   # Default value for default_env is {}
   # set :default_env, { path: "/opt/ruby/bin:$PATH" }

   # Default value for keep_releases is 5
-  # set :keep_releases, 5
+  set :keep_releases, 5
```
編輯 `config/deploy/production.rb`
```diff
+   set :branch, "master"
-   # server "example.com", user: "deploy", roles: %w{app db web}, my_property: :my_value
+   server "demo.wells.tw", user: "deploy", roles: %w{app db web}, my_property: :my_value
```
設定完成後執行以下指令：
```shell
cap production deploy:check
```
因為還沒有新增 `database.yml` 所以會報錯。

## 新增 database.yml
在 `/home/deploy/demo/shared/config` 中新增 `database.yml`，如果使用 PostgreSQL 填入以下內容：
```yml
default: &default
  adapter: postgresql
  encoding: unicode
  pool: 25
  host: localhost
  username: postgres
  password: password

production:
  <<: *default
  database: demo-production
```

## 新增 secrets.yml
在本地專案執行：
```shell
rails secret
```
將產生的金鑰依照下方格式貼在 Server 的 `/home/deploy/demo/shared/config/secrets.yml`。
```yml
production:
  secret_key_base: 把剛剛的亂數key貼上來
```

## 建立憑證
參考 [此篇](https://blog.hellojcc.tw/setup-https-with-letsencrypt-on-nginx/) 擷取其中內容，執行以下程式：
```
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install python-certbot-nginx
```
產生憑證指令：
```
sudo certbot --nginx -d hellojcc.tw -d www.hellojcc.tw
```
註銷憑證指令(有用到再執行)：
```
certbot revoke --cert-path /etc/letsencrypt/archive/${YOUR_DOMAIN}/cert1.pem
```
## 安裝 Chromedriver
因為專案需要爬蟲，因此要裝 Chromedriver，執行以下指令：
```
apt install chromium-chromedriver
```

## 常見狀況
### 相同 Domain Name 但 SSH 連不上
遇到類似以下錯誤訊息：
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
github.com,52.69.186.44 ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAq2A7hRGmdnm9tUDbO9ID@       WARNING: POSSIBLE DNS SPOOFING DETECTED!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
The ECDSA host key for test.wells.tw has changed,
and the key for the corresponding IP address 34.81.121.249
is unchanged. This could either mean that
DNS SPOOFING is happening or the IP address for the host
and its host key have changed at the same time.
Offending key for IP in /Users/wells/.ssh/known_hosts:9
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:EC3r9M29PBWfOLIuF32Ha3meLK/wzu884s7/29tsxGs.
Please contact your system administrator.
Add correct host key in /Users/wells/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in /Users/wells/.ssh/known_hosts:3
ECDSA host key for test.wells.tw has changed and you have requested strict checking.
Host key verification failed.
```
至本地開啟 `known_hosts`，並刪除有問題的 Domain
```
vim  ~/.ssh/known_hosts
```

### 假如 Server 上的 RVM 找不到
參考 [Capistrano 官方文件](https://github.com/capistrano/rvm)，在本地的`config/deploy.rb`新增以下內容：
```
set :rvm_custom_path, '/usr/share/rvm'  # only needed if not detected
```
