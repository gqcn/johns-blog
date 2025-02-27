---
slug: "/golang-development-tips"
title: "Golang开发中的一些技巧"
hide_title: true
keywords:
  ["Go语言", "开发技巧", "最佳实践", "receiver name", "命名规范", "代码规范"]
description: "总结 Go 语言开发中的实用技巧和最佳实践，包括命名规范、代码规范等开发经验"
---

## 为什么`go`中的`receiver name`不推荐使用`this`或者`self`

在日常的开发中我们除了定义函数以外， 我们还会定义一些方法。这本来没有什么， 但是一些从PHP/Java或者其他面向对象语言转GO的同学往往会把`receiver name`命名为`this`, `self`, `me`等。

在Golang开发中，Go官方并不推荐将`receiver name`命名为`this`, `self`, `me。`

我们来看一下Go官方推荐的标准命名`Receiver Names：[https://github.com/golang/go/wiki/CodeReviewComments#receiver-names](https://github.com/golang/go/wiki/CodeReviewComments#receiver-names)`

![](/attachments/image2021-4-30_11-55-27.png)

简单翻译总结有如下2点：

1.  方法接受者名称应反映其身份， 并且不要使用`me`, `this`, `self`这些面向对象语言的典型标志符。
2.  在Go中方法接受者其实就是方法的另一个参数。

## 在同一文件中，类型定义及常量/变量放上面，方法定义放下面

在同一文件中，如果存在类型、常量、变量、方法（公开/私有）定义的时候，如果您有C/C++的经验那您应该能理解到，我们最好按照以下顺序组织代码结构，以方便维护：

```text
类型定义
常量定义
变量定义
方法定义（公开）
方法定义（私有）
```

例如：

```go
// 类型定义
type Xxx struct {}

// 常量定义
const (
    internalConstName = "xxx"
)

// 变量定义
var (
    internalVariable = "xxx"
)

// 方法定义（公开）
func GetXxx() {

}

// 方法定义（私有）
func doGetXxx() {

}
```

  

  

  

  

