---
slug: "/observability/prometheus-exporter-metrics-samples"
title: "常用exporter指标samples"
hide_title: true
keywords:
  ["Prometheus", "Exporter", "监控指标", "Metrics", "监控采集", "指标样例"]
description: "收集和整理常用 Prometheus Exporter 的监控指标样例，帮助用户快速了解和使用各类 Exporter 进行监控数据采集"
---

## 节点类指标

使用`node-exporter`实现。

文件（建议新标签页打开）：[nodes.txt](/attachments/nodes.txt)

## 容器类指标

使用`cadvisor`实现，在新版本`Kubernetes`中已经内置。

文件（建议新标签页打开）：[cadvisor.txt](/attachments/cadvisor.txt)

## Kubernetes状态指标

使用`kube-state-metrics`实现，集群中各个资源的快照值，比较大。

文件（建议新标签页打开）：[kube-state.txt](/attachments/kube-state.txt)

## Kubernetes内部指标

集群的内部指标，大部分场景下没什么用，常用于管控类指标监控。

文件（建议新标签页打开）：[kube-internal.txt](/attachments/kube-internal.txt)

  

