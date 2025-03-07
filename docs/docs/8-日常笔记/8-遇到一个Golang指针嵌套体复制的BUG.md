---
slug: "/notes/golang-nested-pointer-bug"
title: "遇到一个Golang指针嵌套体复制的BUG"
hide_title: true
keywords: ["Go", "指针", "嵌套结构体", "Bug修复", "空指针", "内存管理"]
description: "分析和解决 Golang 中遇到的指针嵌套结构体复制导致的空指针异常问题"
---

## 排查1

当查询不到数据时，`item`变量为`nil`，此时会触发`BUG`：

`exception recovered: runtime error: invalid memory address or nil pointer dereference`

![](/attachments/image2023-7-25_11-44-50.png)

其中的`resourceV1.GetTemplateRes`结构体的定义如下：

![](/attachments/image2023-7-25_11-46-26.png)

将代码改为如下即可解决问题，相当于增加了一个`if`判断：

![](/attachments/image2023-7-25_11-47-33.png)

## 排查2

经过进一步排查，发现根因在这里：

![](/attachments/image2023-7-25_11-58-44.png)

因为返回的`resourceV1.GetTemplateRes`结构体中嵌套了一个指针结构体，并且这个指针结构体的属性是`nil`，那么在外层直接使用`template.TemplateId`访问时，其实是想要访问`resourceV1.GetTemplateRes`中嵌套的指针结构体`*entity.ResourceParamTemplate`中的`TemplateId`属性。但是这个时候该属性`*entity.ResourceParamTemplate`是`nil`，那么直接访问它的属性`TemplateId`则会报空指针问题。