---
slug: "/ai/hpc-slurm-vs-k8s-high-performance-network"
title: "Slurm与K8S在AI训练高网场景下的差异对比"
hide_title: true
keywords:
  [
    "Slurm",
    "Kubernetes",
    "K8S",
    "AI训练",
    "高性能网络",
    "InfiniBand",
    "RDMA",
    "NUMA",
    "GPU拓扑",
    "网络拓扑调度",
    "多机多卡",
    "NVLink",
    "NVLinkBridge",
    "topology-aware",
    "GRES",
    "GPU调度",
    "分布式训练",
    "HPC",
    "GPUDirect RDMA",
    "拓扑感知调度",
    "网卡亲和性",
    "CPU&NUMA亲和性",
    "GPU通信优化",
    "Topology Manager",
    "高网环境"
  ]
description: "本文深入对比Slurm与Kubernetes（K8S）在AI大模型训练高性能网络场景下的调度能力差异，重点分析三大核心场景：跨IB交换机的多机多卡网络拓扑感知调度、单节点内CPU&NUMA亲和性调度（GPU与NIC亲和）、以及单节点内基于NVLink/PCIe拓扑的GPU通信优化调度。通过详细对比两种调度系统在各场景下的实现机制、成熟度和配置方式，帮助AI基础设施团队在实际高网环境中做出合理的技术选型决策。"
---

参考章节：[Slurm与K8S在AI训练高网场景下的差异对比](../../800-基础架构/700-算力调度/5500-Slurm与K8S在AI训练高网场景下的差异对比.md)
