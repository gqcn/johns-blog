---
slug: "/ai/cpu-numa-affinity-in-kubernetes"
title: "Kubernetes中CPU&NUMA亲和性配置"
hide_title: true
keywords:
  [
    "Kubernetes",
    "CPU亲和性",
    "NUMA亲和性",
    "Topology Manager",
    "CPU Manager",
    "Memory Manager",
    "Device Manager",
    "GPU调度",
    "AI训练",
    "kubelet配置",
    "cpuset-cpus",
    "cpuset-mems",
    "PCIe拓扑",
    "NUMA节点",
    "QoS",
    "nvidia-device-plugin",
    "静态策略",
    "拓扑感知调度",
  ]
description: "深入解析Kubernetes中CPU和NUMA亲和性调度的完整实现方案。详细讲解Topology Manager、CPU Manager、Memory Manager和Device Manager四大核心组件的工作原理、配置方法和协同机制。涵盖kubelet完整配置示例、策略选项详解、NVIDIA GPU设备插件的NUMA感知功能、多种拓扑管理策略对比，以及实际测试案例和故障排查指南。适用于AI训练、推理等对CPU-GPU-内存局部性要求高的工作负载，助力性能优化和资源高效利用。"
---

参考章节：[Kubernetes CPU&NUMA亲和性调度](../../../2000-云原生/200-Kubernetes/5000-Kubernetes%20CPU&NUMA亲和性调度.md)