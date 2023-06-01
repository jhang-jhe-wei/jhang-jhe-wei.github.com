---
# 解決 Github Deploy Key is already in use 問題
title:  "解決 Github Deploy Key is already in use 問題"
createdAt:   '2021-08-04T00:00:00Z'
categories: Note
tags:  [Deubg]
description: 由於最近 Github 開始限制使用 Password(HTTPS) 進行 Push 的行為，因此之後盡量都改使用 SSH 的方式進行 Push，但是之前在設定 Deploy Keys 遇到了以下的錯誤...
---
# 解決 Github Deploy Key is already in use 問題
我是wells，擔任過室內配線的國手，征服了電氣領域後，現在正跨大版圖到資訊界。

# 簡介
由於最近 Github 開始限制使用 Password(HTTPS) 進行 Push 的行為，因此之後盡量都改使用 SSH 的方式進行 Push，但是之前在設定 Deploy Keys 遇到了以下的錯誤：
![picture 1](2021-08-04-github-deploy-key-問題-d63a3fcff010a2f3ab8cb5036b8c5a43c673f11b5ce79d4f01a51b7473032cab.png)

簡單來說是因為這個帳號已經有其他 Repository 使用該金鑰，但一個帳號少說也有 10 個 Repository，每一個 Repository 都去查未免也太沒有效率，於是記錄一下使用該金鑰找出對應的 Repository。

# 尋找對應的 Repository
使用方式：
```shell
ssh -T -ai ~/.ssh/your_ssh_key git@github.com
```

## 範例
例如我希望使用 `~/.ssh/test` 這個金鑰進行 Push，但是遇到了前面的問題，於是我可以執行：
```shell
ssh -T -ai ~/.ssh/test git@github.com
```
接著會輸出：
```
Hi jhang-jhe-wei/jhang-jhe-wei.github.io! You've successfully authenticated, but GitHub does not provide shell access.
```
而 `jhang-jhe-wei/jhang-jhe-wei.github.io` 就是我們訪問到的 Repository，接著就去檢查該 Repository 是否的 Deploy Keys 是否有該金鑰。

# 推薦方式
該錯誤是由於已經有 Repository 使用了該金鑰，但實際上的情況有可能是整個帳號都用同一個金鑰，對於這種情況可以直接至帳號中的設定（點擊右上角的頭像）填寫 `SSH and GPG Keys`：
![picture 2](2021-08-04-github-deploy-key-問題-779a008fddd8581e679bc84a265bf149b4b982d833215f51ed4b1a534e88969f.png)

這樣子就可以使用該金鑰訪問該帳號之下的所有 Repository。

# 參考資料
- [Error: Key already in use](https://docs.github.com/en/github/authenticating-to-github/troubleshooting-ssh/error-key-already-in-use)
