---
slug: "/kubelet-cadvisor-metrics-collection"
title: "如何从kubelet拉取cadvisor指标"
hide_title: true
keywords:
  ["Kubelet", "cAdvisor", "指标采集", "容器监控", "监控配置", "性能数据"]
description: "详细介绍如何从 Kubelet 获取 cAdvisor 的容器监控指标，包括配置方法、采集步骤和最佳实践"
---

## 背景

`kubelet`中已经内置了`cadvisor`，可以拉取到容器的指标，并且会自动给容器指标注入`pod, node`等标签信息。但`kubelet`暴露的指标接口是`https`协议，因此涉及到权限验证，具体步骤可以参考：[https://github.com/SUSE/doc-caasp/issues/166](https://github.com/SUSE/doc-caasp/issues/166)

![](/attachments/image-2024-5-14_14-55-12.png)

## 注意事项

由于容器指标依赖于`kubelet`，扩展性受限于`kubernetes`版本，比如`kubelet`存在`bug`，那么可能难以修复，因为升级`kubernetes`版本是比较重的操作，特别是针对租户端的用户通常难以接受。具体可参考遇到的已知问题：[从kubelet获取cadvisor指标偶现丢失container\*相关指标](./6-从kubelet获取cadvisor指标偶现丢失container*相关指标.md)

  

  

  

  

  

