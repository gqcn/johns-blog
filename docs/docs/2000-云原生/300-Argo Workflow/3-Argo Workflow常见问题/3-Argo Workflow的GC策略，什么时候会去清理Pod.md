---
slug: "/cloud-native/argo-workflow-gc-policy"
title: "Argo Workflow的GC策略，什么时候会去清理Pod"
hide_title: true
keywords:
  ["Argo Workflow", "GC策略", "Pod清理", "资源管理", "垃圾回收", "性能优化"]
description: "详细说明 Argo Workflow 的垃圾回收策略，包括 Pod 的生命周期管理、清理时机和相关配置参数的解析"
---

我们发现，创建的Workflow在执行成功后并没有清理，而是全部都保留了下来，造成空间下的Pod越积越多。其实Argo Workflow是有清理策略的，我们先看看官方文档介绍：[https://argoproj.github.io/argo-workflows/cost-optimisation/#limit-the-total-number-of-workflows-and-pods](https://argoproj.github.io/argo-workflows/cost-optimisation/#limit-the-total-number-of-workflows-and-pods)

![](/attachments/image2021-7-6_16-15-19.png)

官方提供了三种建议性的方案，其中`TTLStrategy`和`PodGC`比较常用一些，一个是`Workflow清理策略`，一个是`Pod清理策略`。我们来看看这两种清理策略的具体逻辑是怎么样的吧。

## 一、`TTLStrategy`

执行流程图：

![](/attachments/image2021-7-6_16-42-1.png)

流程简要介绍：

*   `wfc.runTTLController` 是伴随着`Argo Workflow Controller`主流程启动，但是是异步执行的任务。该任务负责TTL操作。
    
*   通过`ttlcontroller.NewController`方法创建`TTLController`，并且在这里会注册对应的`EventHandler`用于处理完成的`Workflow`对象：

![](/attachments/image2021-7-6_16-47-1.png)

![](/attachments/image2021-7-6_16-50-23.png)

## 二、`PodGC`

我们在之前的源码分析中已经发现有`podCleanQueue`这么一个队列，用于清理`Pod`资源。在之前对`Argo Workflow Controller`的核心流程的介绍中有一个`woc.operate`操作，该操作执行完成后`Workflow`核心流程便执行完成了。在这之后还有一个操作便是`PodGC处理逻辑`。

![](/attachments/image2021-7-6_17-12-0.png)

添加到队列的操作行为是`deletePod`，执行逻辑便是直接删除`Kubernetes`中对应的`Pod`：

![](/attachments/image2021-7-6_17-14-46.png)

:::tip
这里需要注意`Completion`和`Success`的区别。
`Completion`表示`Workflow`执行完成，`Workflow`的状态不是`Running/Appending/Unknown`阻塞状态。
`Success`表示`Workflow`执行完成，并且`exit code`为`0`，表示没有错误产生。
:::
  

  

