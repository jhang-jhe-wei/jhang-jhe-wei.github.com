---
title:  "使用Template美化你的Jekyll專案"
createdAt:   '2021-05-01T09:50:00Z'
categories: Tutorial
tags:  [Jekyll]
description: 一個靜態網頁的生成器受歡迎程度除了本身的性能(速度、穩定度)外，有很大的因素取決於社群，關於Jekyll網路上有許多熱心人士提供各式各樣的主題，像是[jekyllthemes.org](http://jekyllthemes.org/)這個網站中就有各式各樣的模板供你選擇，但要特別注意的是不同的模板要求的jekyll版本也是會不同的。

---
# 使用Template美化你的Jekyll專案
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

## 料理食材(內文內容)
- [X] Jekyll的使用
- [X] Jekyll Template

## 誰可以安心食用(適合誰讀)
- [X] 看過前一篇文[使用Jekyll自架部落格](../使用Jekyll自架部落格/index.html)

## 服用完你會獲得什麼
- [X] 知道如何~~亂改別人的Code~~使用Jekyll模板
- [X] 幫你抓幾隻蟲、踩幾個雷，節省你好幾個小時的時間

## 挑選Jekyll Template
一個靜態網頁的生成器受歡迎程度除了本身的性能(速度、穩定度)外，有很大的因素取決於社群，關於Jekyll網路上有許多熱心人士提供各式各樣的主題，像是[jekyllthemes.org](http://jekyllthemes.org/)這個網站中就有各式各樣的模板供你選擇，但要特別注意的是不同的模板要求的jekyll版本也是會不同的。

![](https://i.imgur.com/xIZ9cqP.png)
> 如果網站上的模板都不得你喜好，要自己刻一個也是沒問題的，關於Jekyll的官方文件可以查閱[此處](https://jekyllrb.com/)

這邊我選擇[chirpy](https://chirpy.cotes.info/)這個模板，點進去之後可以再點擊Demo頁面，或是按下前面的chirpy也可以進入此畫面：

![](https://i.imgur.com/ZxW6qU8.png)

這些模板的提供者通常都會把使用說明放在Demo網站上，個人覺得這種做法非常的高效，充分的發揮了這個Demo的價值及教育意義。

## 使用Theme Gem安裝Jekyll Template
如果想要使用這個模板有很多種方式，這邊我們示範使用Theme Gem的方法

1. 在Jekyll專案的GemFile中加入以下這段：
    `gem "jekyll-theme-chirpy"`
2. 在Jekyll專案的_config.yml中加入以下這段：
    `theme: jekyll-theme-chirpy`
3. 使用bundler安裝GemFile中的Gem
    `bundle`
4. 下載[chirpy的Github](https://github.com/cotes2020/chirpy-starter.git)專案
    使用`git clone https://github.com/cotes2020/chirpy-starter.git`下載
5. 複製專案中的以下內容到你自己的專案
    ```
    .
    ├── _data
    ├── _plugins
    ├── _tabs
    ├── _config.yml
    └──  index.html
    ```
    此時運行`bundle exec jekyll s`你會發現已經有畫面了，但是卻沒有任何文章。
6. 在自己的專案中刪除以下文件
     ```
    .
    ├──  about.markdown
    └──  index.markdown
    ```
    此時再重新開啟server，就會出現以下畫面了。
    ![](chirpy-demo.png)
7. 修改`_config.yml`中的以下變數：
    - `url`換成你推上github page的url，例如`https://blog.wells.tw`
    - `avatar`大頭貼的圖檔(使用圓框遮罩修改後更佳)
    - `timezone`換成你所在位置的時區，例如` Asia/Taipei`
    - `lang`換成你的語言，例如`Zh-TW`

到這一步基本的建置功能就都已經完成了，在`_post/`中新增文章進行撰寫吧！

## 更改專案中的favicon
favicon就是在網站名稱左邊的小小圖片，這東西是可以自己定義的
![](favicon-show.png)

首先先到[Real Favicon Generator](https://realfavicongenerator.net/)選擇上傳要當作facicon的圖片，上傳會可以在最下面點擊`Generate your Favicons and HTML code`，即可得到一個zip的檔案

解壓縮後刪除裡面的兩個東西：
- browserconfig.xml
- site.webmanifest

之後把所有的圖片檔案都複製到自己專案中的`assets/img/favicons/`資料夾中，之後你就可以看到你的網站名稱旁已經有你剛剛放置的icon了。

## 部署Jekyll專案
在本地端寫好檔案後我們就部署到Github Page上，關於如何部署請看[這裡](/posts/使用Jekyll自架部落格/#部署到github-page
)
![](https://i.imgur.com/bJJYgIc.png)
**但...等等！！怎麼有點落差...**

![](https://i.imgur.com/ZxW6qU8.png)
> 這是Demo的網頁

接著...讓我們按下F12來Debug一下
![](https://i.imgur.com/LQJPK16.png)
可以發現這裡的錯誤主要的原因是找不到檔案，所以我們來檢查一下網址
```
http://blog.wells.tw/jekyll-demo/
```
這一段網址`http://blog.wells.tw/`是domain name，而後面的`jekyll-demo`則是專案的名稱，再打開Jekyll專案中的_config.yml

![](https://i.imgur.com/wrvIJGM.png)
這邊可以發現需要填入專案名稱baseurl是空的，因此我們把它更改為`baseurl: /jekyll-demo`
>`jekyll-demo`換成你的專案名稱

之後在終端機輸入
```
git add .
git commit -m "提交訊息"
git push
```
過幾秒後就可以看到正常的網站囉

![](chirpy-github-page-deploy.png)

## 結語
本篇文主要介紹如何使用Theme Gem的方式套上模板，但還有更快的方式，就是直接Fork專案XDD<br>
但是自己一步一步完成就是有那種成就感啦！這篇結束後已經有一個blog該有的樣子了，下一篇開始我們來介紹一些對於部署更方便的功能吧！
