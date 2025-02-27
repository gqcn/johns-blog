---
slug: "/kubelet-cadvisor-metrics-missing"
title: "从kubelet获取cadvisor指标偶现丢失container*相关指标"
hide_title: true
keywords:
  ["Kubelet", "cAdvisor", "容器监控", "指标采集", "故障排查", "监控问题"]
description: "分析从 Kubelet 获取 cAdvisor 指标时偶现丢失容器相关指标的原因和解决方案，提供监控数据采集问题的排查思路"
---

## 背景介绍

在`Kubernetes`下的监控组件需要获取容器的监控指标数据，并且`kubelet`已经内置了`cadvisor`，因此我们直接从**当前节点**的`kubelet`拉取容器监控指标数据。但是却遇到偶发的丢失`container*`相关指标的情况，例如`container_cpu_usage_seconds_total`、`container_spec_cpu_quota`、`container_spec_cpu_period`等重要的容器指标数据。

## 问题排查

一开始以为是网络访问的问题，直到给程序增加了调试信息，发现确实是`kubelet`返回的指标数据就已经丢失了相关指标，因此再去查看节点上的`kubeket`日志，通过以下命令：

```bash
journalctl -u kubelet
```

发下以下错误：

![](/attachments/tapd_69993163_base64_1715136610_905.png)

![](/attachments/tapd_69993163_base64_1715139686_366.png)

通过该错误去检索到社区也反馈过类似的`issue`：

*   [https://github.com/google/cadvisor/issues/2867](https://github.com/google/cadvisor/issues/2867)
*   [https://github.com/kubernetes/kubernetes/issues/89903](https://github.com/kubernetes/kubernetes/issues/89903)

查看当前集群的`kubelet`版本是：`v1.22.0`。然后查看了一下`kubernetes`的源码，发现问题出现在这两个地方：只要有个别container的指标获取不了数据，所有的containers指标数据都不会返回了。

![](/attachments/tapd_69993163_base64_1715153128_685.png)

![](/attachments/tapd_69993163_base64_1715153103_322.png)

## 问题修复

这个问题不应该只有我遇到了，经过仔细查看`issue`的讨论，发现该`issue`在**2021年5月10号**就已经修复了，对应的是`cadvisor v0.43.0`: [https://github.com/google/cadvisor/commit/655773dc5ee9cbf48fe3f629f4e724c75dcd569c](https://github.com/google/cadvisor/commit/655773dc5ee9cbf48fe3f629f4e724c75dcd569c) 对应已修复的最低`kubernetes`版本为 `v1.23.0`：

![](/attachments/tapd_69993163_base64_1715155501_445.png)

  

因此，我们升级版本即可解决。但注意升级版本时需要上下游对齐，评估升级风险。

  

  

  

  

  

  

  

  

  

  

  

