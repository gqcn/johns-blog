---
slug: "/ai/pd-separation"
title: "PD(Prefill&Decode)分离介绍"
hide_title: true
keywords:
  [
    "AI技术",
    "LLM推理优化",
    "PD分离",
    "Prefill",
    "Decode",
    "TTFT",
    "TPOT",
    "TBT",
    "Continuous Batching",
    "KV Cache",
    "大模型部署"
  ]
description: "深入探讨LLM推理中的PD(Prefill&Decode)分离技术，分析其原理、指标、优势及实现方案，提升大模型推理性能和用户体验"
---




## 为什么要做PD分离

### 定义

整个`LLM`推理过程由`Prefill`和多轮迭代的`Decode`组成：

- 计算密集型的`Prefill`阶段，`LLM`处理所有用户的`input`，计算出对应的`KV Cache`。

- 显存密集型的`Decode`阶段，顺序的产生一个个的`token`，每次访存只计算一个`token`。

### 指标

#### Prefill性能评估指标
- `TTFT(Time To First Token)`表示生成第 `1` 个`token` 所用的时间

  `P90 TTFT SLO = 0.4s`，意味着我们对该系统的要求是：`90%`的`request`的`TTFT`值都必须`<=0.4`

#### Decode性能评估指标
- `TPOT(Time Per Output Token)`表示产出每一个`response token` 所用的时间

  `P90 TPOT SLO = 0.04s`，意味着我们对该系统的要求是，在 `90%` 的 `request` 的 `TPOT` 值都必须`<=0.04s`。

- `TBT(Token By Token)`表示增量`Token`时延，即连续生成两个`token`之间的时间间隔。这是衡量用户体验流畅度的重要指标，`TBT`越稳定，用户感知到的响应就越连贯。在PD分离架构中，保持稳定的`TBT`是一个关键目标。

### Continuing Batching

![alt text](assets/PD(Prefill&Decode)分离介绍/image.png)

- `Prefill`阶段：因为`Prefill`阶段是计算密集型，随着`Batch Size`的增加，算力受限，吞吐量的增长趋势趋于平缓。

- `Decode`阶段：因为`Decode`阶段是带宽、内存密集，随着`Batch Size`的增加，吞吐量的增长趋势越来越显著。






想要在`Decode`阶段实现`Continuing Batching`的前提是，每个被调度的`request`需要空闲算力完成`Prefill`计算。按现有的部署模式，当`Prefill`和`Decode`部署在一起时，当有新的`Prefill`请求时，会被优先处理，从而导致`Decode`的执行流程被影响，增量`Token`时延（`TBT`）无法得到有效保障。

例如下图，当`request5`或`request6`到来时，系统可能会优先执行`request5`或`request6`的`Prefill`，此时`request2/3/4`的响应时延会受到一定影响，从而导致`TBT`不稳定。

![alt text](assets/PD(Prefill&Decode)分离介绍/image-2.png)

在实际的深度学习模型部署中，由于`Prefill`和`Decode`两阶段的计算/通信特征的差异特点，为了提升性能和资源利用效率，通过`PD`分离部署方案将`Prefill`和`Decode`分别部署在不同规格和架构的集群中，并且配合服务层的任务调度，在满足`TTFT`和`TBT`指标范围内，结合`Continuous batching`机制尽可能提高`Decode`阶段的`batch`并发数，在提供更好用户体验的前提下，提升算力利用率。

基于该方案，结合下图可以看到`Prefill`和`Decode`的执行互不影响，系统能够提供给用户一个稳定的`TBT`。

![alt text](assets/PD(Prefill&Decode)分离介绍/image-1.png)

## PD分离带来的优势

在`long context`背景下，`Prefill`和`Decode`阶段对计算和显存的需求非常不平衡。PD分离架构能够带来以下显著优势：

### 资源分配与利用的优化

- **充分利用异构设备资源**：`Prefill`阶段计算密集，可采用高算力的 `GPU`（如`A100`、`H100`等高端计算卡）；而`Decode`阶段显存密集，可采用低算力大显存的 `GPU`（如大内存的`L40`等）。这种分配方式能够显著降低硬件成本，提高资源利用率。

- **动态资源伸缩**：可以根据负载情况独立地为`Prefill`和`Decode`集群进行扩缩容，在高峰期可以为瓶颈阶段分配更多资源，提高系统的弹性和成本效益。

### 性能指标的优化

- **分开优化，同时提升多项指标**：在`Prefill`阶段应该限制`Batch Size`大小以减少`TTFT`，而在`Decode`阶段则应该增大`Batch Size`以提高并发处理能力。这种分离优化策略能同时改善`TTFT`和`TPOT`指标，而不必在两者之间做折中。

- **稳定的TBT保障**：通过将`Prefill`和`Decode`分离，新请求的`Prefill`计算不会占用`Decode`阶段的资源，从而保证了稳定的`TBT`，提供更流畅的用户体验。

### 技术实现的灵活性

- **模型优化的灵活性**：可以对`Prefill`和`Decode`阶段分别采用不同的模型优化技术，如在`Prefill`阶段采用量化、矩阵分解等技术，而在`Decode`阶段使用`Continuous Batching`和`KV Cache`管理优化。

- **不同硬件加速器的支持**：可以在`Prefill`阶段使用`GPU`，而在`Decode`阶段尝试使用其他类型的加速器（如专用的推理芯片），进一步降低成本和提高效率。

### 系统可靠性提升

- **故障隔离**：当`Prefill`或`Decode`集群中的某个节点出现故障时，不会直接影响另一阶段的处理，提高了系统的整体可靠性。

- **版本升级的灵活性**：可以独立地升级`Prefill`或`Decode`集群，减少系统维护和升级对服务的影响。