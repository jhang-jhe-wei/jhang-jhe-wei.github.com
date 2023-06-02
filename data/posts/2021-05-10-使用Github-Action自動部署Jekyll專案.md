---
title:  "使用Github Action部署Jekyll專案"
createdAt:   '2021-05-10T09:50:00Z'
categories: Tutorial
tags:  [Jekyll]
description: 在前幾篇文章中，我們了解到假如要部署Jekyll專案，除了專案本身外，還需要把`_site/`這個資料夾推上Github Page，因此假如能把這件事情變成自動化的話，一切都會輕鬆不少。

---
# 使用Github Action部署Jekyll專案
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

## 料理食材(內文內容)
- [X] Jekyll deploy
- [X] Github Action的使用

## 誰可以安心食用(適合誰讀)
- [X] 看過前一篇文[使用Template美化你的Jekyll專案](../使用Template美化你的Jekyll專案/index.html)

## 服用完你會獲得什麼
- [X] 使用Github Action讓你部署Jekyll專案變得更輕鬆
- [X] 幫你抓幾隻蟲、踩幾個雷，節省你好幾個小時的時間

## 使用Github Action部署Jekyll專案
在前幾篇文章中，我們了解到假如要部署Jekyll專案，除了專案本身外，還需要把`_site/`這個資料夾推上Github Page，因此假如能把這件事情變成自動化的話，一切都會輕鬆不少。

因此本篇文章就是要來介紹如何使用Github Action自動部署到Github Page上

## 安裝步驟
以下步驟以[chirpy](https://chirpy.cotes.info/)這個模板為例。
1. 下載[chirpy的Github專案](https://github.com/cotes2020/chirpy-starter.git)，並且複製其中的`tools/test.sh`和`tools/deploy.sh`到你自己的專案(請確保相對路徑與原專案相同)
2. 在自己的專案下創建`.github/workflows/pages-deploy.yml`這個檔案，並且複製[該段程式碼](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/.github/workflows/pages-deploy.yml.hook)到檔案中。
> 需要注意的是`on.push.branches`後面接的branch要是你Github Repository的預設branch，如果Ruby版本不同也要修改
3. 由於Github Action上是Linux作業系統，因此請在自己的專案中運行以下指令：
```
bundle lock --add-platform ruby
bundle lock --add-platform x86_64-linux
```
4. `bundle add html-proofer`<br>
    由於`tools/test.sh`是使用html-proofer進行測試，因此請加入這個gem
    > 如果你的文章含有中文或是非英文，在測試的時候會報錯，因此請在`tools/test.sh`的底部刪掉` --check-html \`，~~這將是欠技術債的開始~~

5. 將你的專案推上Github，在Github Repository的功能列可以找到Action，點擊後就可以看到以下畫面
![](github-action.png)
完成後你切換branch到`gh-pages`分支，你就可以看到機器人幫你把`_site/`推上這個分支了
![](github-action-deploy-finished.png)

## 踩坑紀錄
依照以上的步驟通常可以幫你避開一些坑，但坑這種東西是永遠填不完的，最主要的問題在於test沒辦法過，假如你有這種情況可以試試以下動作：
1. 如果沒有使用Google Analytics，可以註解掉`_config.yml`中的GA部分
2. 不要填寫baseurl，這會導致test去找`_site$baseurl`，文件是預設你的Github Repository名稱是`<username>.github.io`，因此不會報錯，但假如你調皮的話......我也不知道該怎麼辦QQ

## 結語
Github Action博大精深，我對他還只是初步的了解，大部分的設定也都是參考網路上的範例，希望之後有機會來好好的研究Github Action。
