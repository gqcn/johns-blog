---
slug: "/cloud-native/argo-workflow-context-passing"
title: "Argo Workflow的流程数据是如何实现上下文传递的"
hide_title: true
keywords:
  [
    "Argo Workflow",
    "上下文传递",
    "数据流转",
    "Parameters",
    "Artifacts",
    "工作流通信",
  ]
description: "深入分析 Argo Workflow 中的数据流转机制，包括 Parameters 和 Artifacts 两种主要的上下文传递方式及其实现原理"
---

关于`Argo Workflow`的流程数据传递方式，官方文档上提供的是三种方式：`**Parameters**`、`**Artifacts**`及`**Volume**`。其中，通过共享`Volume`传递数据方式官方只是提了个例子（[https://argoproj.github.io/argo-workflows/examples/#volumes](https://argoproj.github.io/argo-workflows/examples/#volumes)），来自于`Kubernetes`基本功能，并不属于`Argo Workflow`的自有特性。那么`Argo Workflow`的`Parameters`和`Artifacts`功能特性底层又是怎么实现的呢，我们这里着重探究前两种流程数据传递方式的本质。

## 一、`Parameters`

`Parameters`的参数传递分为两种，一种是不带`Outputs`输出的`Parameters`，另一种是带有`Outputs`输出的`Parameters`。

### 1、不带`Outputs`输出的`Parameters`

这是 `Argo Workflow`中最简单的方式，甚至都不用做任何的脚本执行解析。因为变量都直接通过`Yaml`的形式配置到了`Workflow`中，`Argo Workflow Controller`中可以直接通过模板变量解析的方式即可将参数嵌入到命令行参数中。我们以官方示例`steps.yaml`作为示例演示一下。

![](/attachments/image2021-7-6_11-9-55.png)

我们查看一下创建的`Pod`情况：

![](/attachments/image2021-7-6_11-22-11.png)

`hello1`节点的执行：

![](/attachments/image2021-7-6_11-33-33.png)

`hello2a`节点的执行：

![](/attachments/image2021-7-6_11-34-22.png)

`hello2b`节点的执行：

![](/attachments/image2021-7-6_11-35-11.png)

### 2、带有`Outputs`输出的`Parameters`

这种情况会稍微复杂一些，因为会涉及到命令的执行以及执行结果的保存和传递。我们在之前的源码解析中有介绍到，在`Wait Container`中等待`Main Container`结束后，会根据`Template`的配置决定是否将`Template`的执行结果`Json`化之后，通过`Patch`方式写入到该`Template`运行`Pod`的`MetaData.Annotation`中，随后其他依赖该`Template`的Node会读取该`MetaData.Annotation`，并解析该数据后存放到`globalParams`中，并使用`globalParams`做自身的模板变量替换，随后创建该`Template Pod`。

`Parameters`存储到`MetaData.Annotations`：

![](/attachments/image2021-7-5_20-23-45.png)

在`Argo Workflow Controller`中`Template`使用`MetaData.Annotations：`

![](/attachments/image2021-7-6_10-35-11.png)

![](/attachments/image2021-7-3_15-42-58.png)

我们以官方实例`output-parameter.yaml`作为示例演示一下。

![](/attachments/image2021-7-6_11-47-49.png)

执行后我们看看`Pod`情况：

![](/attachments/image2021-7-6_11-48-51.png)

`generate-parameter`执行结果的保存：

![](/attachments/image2021-7-6_11-50-16.png)

`consumer-parameter`对于其他节点执行结果参数的输入：

![](/attachments/image2021-7-6_11-52-59.png)

## 二、Artifacts

`Artifacts`会稍微复杂一些。`Argo`默认使用`minio`来对`Artifacts`做存储和读取，并且`Main Container`对于`Atifacts`内容的操作原理都是基于共享`Volume`。也就是说往往必须要挂载`Volume`来使用`Artifacts`，不过`Volume`的挂载是由`Argo Workflow Controller`自动帮我们实现的，我们并不能直接感知到。我们以官方示例`artifact-passing.yaml`作为示例演示一下。

![](/attachments/image2021-7-6_15-32-39.png)

在`generate-artifact`的节点`Annotiations`中只有`Artifacts`的输出路径及类型，真实的内容是保存到`minio`中的：

![](/attachments/image2021-7-6_15-35-12.png)

在`consume-artifact`节点中`Init/Wait/Main Containers`挂载了相同的`Volume`，因此可以共享`Artifacts`数据。其中`Init Container`负责将`Artifacts`的内容拉取到本地的`/argo/inputs/artifacts`路径下，随后`Main Container`会读取`/tmp/message`路径下的内容，这两个路径均是来自于相同的`Volume (input-artifacts)`。

                    `           ![](/attachments/image2021-7-6_15-42-7.png)           `

  

