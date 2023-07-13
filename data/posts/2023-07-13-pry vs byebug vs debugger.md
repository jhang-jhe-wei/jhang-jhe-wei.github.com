---
title:  "Pry vs Byebug vs Debugger"
createdAt:   '2023-07-13T00:00:00Z'
categories: Note
description: 比較 Pry, Byebug, Debugger
---

# Pry vs Byebug vs Debugger

## Pry

> Irb 的替代品，正常使用的方式是先取得 binding 後呼叫 pry
>

```ruby
binding.pry
```

> 但為了便利性，#pry 被加入進 Object 中，因此目前任何地方都可以被呼叫。
>

 Pry 不是 debugger 工具，它僅是 interactive shell (如同 IRB)，因此無法控制接下來的程式運作流程，如單步執行等等。

## Byebug

這是真正的 debugger 工具，與 Pry 相比，它能夠使用 Step 運作下一行程式碼，其預設的 interactive shell 是 IRB。

## ****pry-byebug****

由於 byebug 預設使用 irb，因此這個套件就是把 byebug 的 interactive 換成 pry。

## debugger

這是一個在 Ruby 2.0+ 出現的 gem，據說已經掛掉2年了

但進行在 Ruby 3.1 中出現了新的 gem debug，這是整合過去 debugger 而成的 gem

## References
- [https://blog.pawandubey.com/explained-binding-pry-byebug-debugger/](https://blog.pawandubey.com/explained-binding-pry-byebug-debugger/)
