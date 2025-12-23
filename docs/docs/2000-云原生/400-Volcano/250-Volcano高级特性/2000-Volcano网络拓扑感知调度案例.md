---
slug: "/cloud-native/volcano-network-topology-scheduling-case"
title: "Volcano网络拓扑感知调度案例"
hide_title: true
keywords:
  [
    Volcano,
    网络拓扑感知调度,
    HyperNode,
    PD分离,
    Prefill-Decode,
    IB网络,
    InfiniBand,
    GPU调度,
    Kubernetes调度,
    大模型推理,
    分布式推理,
    网络优化,
    Gang调度,
  ]
description: "通过PD分离部署场景，详细演示如何使用Volcano网络拓扑感知调度功能，在IB网络环境下优化大模型推理服务的节点选择，降低网络延迟，提升带宽利用率。包含HyperNode配置、节点标签、Prefill和Decode服务部署的完整示例。"
---

在大规模`GPU`集群中部署大模型推理服务时，网络拓扑对性能的影响至关重要。本文通过**PD（Prefill-Decode）分离部署**的实战场景案例，详细演示如何使用`Volcano`的网络拓扑感知调度功能，在`IB（InfiniBand）`网络环境下优化节点选择，实现：

- 🎯 **延迟优化**：将跨交换机通信延迟从`5-10μs`降低到`2-5μs`，性能提升`2-5`倍
- 🎯 **带宽优化**：保持`200Gbps`高带宽，避免`50%`的带宽损失，吞吐量提升`30-50%`
- 🎯 **资源优化**：`Prefill`使用`H100`高性能`GPU`，`Decode`使用`RTX 4090`性价比`GPU`，降低整体成本

本文将从场景背景、技术方案分析、`HyperNode`拓扑设计到具体实施，提供完整的实践案例。

## 场景背景

### 基础设施环境

**硬件拓扑**：
- **集群规模**：`GPU`服务器若干
- **IB网络组网**：
  - `7`个交换机，其中`3`个`IB`交换机，`4`个以太网交换机，每个叶子交换机上最多有`64`台`GPU`服务器
  - `IB`网络提供高带宽（`200Gbps`）、低延迟（`<2μs`）的`RDMA`通信
  - 跨`IB`网络域通信需要经过以太网，延迟显著增加（`>10μs`）
- **GPU配置**：
  - 每台服务器配置`8`张`GPU`卡
  - 每个交换机下有各种卡型号服务器，以`A100/H100`和`4090/5090`为主。

大致的网络拓扑如下：

```text
                                    eth switch6
                      /                                    \
                  ib switch4                           eth switch5
              /                \                    /               \
      ib switch0           ib switch1         eth switch2      eth switch3
      /    |    \          /    |    \        /    |    \      /    |    \ 
 node0    ...   node63  node64 ... node127  ...   ...   ...  ...   ...   ...
```


**网络性能对比**：

| 通信类型 | 带宽 | 延迟 | 带宽损失 | 适用场景 |
|---------|------|------|---------|----------|
| `IB`交换机内（同交换机节点） | `200Gbps` | `<2μs` | `0%` | 高性能分布式推理 |
| `IB`交换机间（跨`IB`交换机） | `200Gbps` | `2-5μs` | `0%` | 分布式推理 |
| `IB`到以太网（跨交换机类型） | `100Gbps` | `5-10μs` | `~50%` | 一般分布式任务 |
| 以太网交换机间 | `10-100Gbps` | `>10μs` | `50-95%` | 非性能敏感任务 |

### PD分离推理场景介绍

**什么是PD分离？**

`PD`分离（`Prefill-Decode`分离）是大模型推理优化的一种架构模式：

- **Prefill阶段**：处理输入`prompt`，生成初始`KV Cache`
  - 计算密集型，需要高算力
  - 输入长度可变，计算量大
  - 适合部署在高性能数据中心`GPU`上（如`H100`、`A100`）

- **Decode阶段**：逐个生成输出`token`
  - 访存密集型，对带宽要求高
  - 计算量相对较小，但需要频繁访问`KV Cache`
  - 可以使用性价比更高的消费级`GPU`（如`RTX 4090`、`RTX 5090`）

**PD分离的优势**：
- ✅ 资源利用率提升：不同阶段使用最适合的`GPU`型号
- ✅ 吞吐量提升：`Prefill`和`Decode`可以并行处理不同请求
- ✅ 成本优化：根据计算特点选择性价比最优的硬件

### 业务需求

**分布式PD推理架构**：

在我们的场景中，需要部署分布式`PD`分离推理服务：

1. **Prefill服务**：
   - 需要`12`个`Pod`，每个`Pod`使用`1`张`GPU`（`H100`）
   - 要求在同一`IB`网络域内，以实现高效的`KV Cache`传输

2. **Decode服务**：
   - 需要`12`个`Pod`，每个`Pod`使用`1`张`GPU`（`RTX 4090`）
   - 要求在同一`IB`网络域内，以实现高效的`KV Cache`访问

**核心需求**：
- ✅ **同域部署**：`Prefill`和`Decode`集群必须部署在同一`IB`网络域内，避免跨域通信延迟
- ✅ **域内优化**：在`IB`网络域内，优化节点选择，减少跨交换机通信
- ✅ **资源利用**：充分利用同一域内不同节点的`GPU`型号优势（`H100`用于`Prefill`，`RTX 4090`用于`Decode`）

## 技术方案分析

### 简单亲和性调度的局限性

**场景分析**：

在大规模混合网络集群中（`7`个交换机，其中`3`个`IB`交换机、`4`个以太网交换机，最多`384`台服务器），如果仅使用节点亲和性或`Pod`亲和性：

```yaml
# 仅使用节点亲和性的配置示例
affinity:
  nodeAffinity:
    requiredDuringSchedulingIgnoredDuringExecution:
      nodeSelectorTerms:
        - matchExpressions:
            - key: gpu-type
              operator: In
              values:
                - h100  # 只能保证选择H100节点
```

**存在的问题**：

1. **无法感知网络拓扑**：
   - ❌ 调度器不知道节点之间的网络距离和交换机类型
   - ❌ `12`个`Prefill Pod`可能分散在`IB`和以太网交换机下
   - ❌ `12`个`Decode Pod`也可能分散在不同类型的交换机下
   - ❌ `Prefill`和`Decode`之间的`KV Cache`传输可能需要跨交换机类型

2. **网络性能不可控**：
   - ❌ **延迟问题**：
     - 同一`IB`交换机内通信延迟`<2μs`
     - 跨`IB`交换机通信延迟`2-5μs`
     - 跨交换机类型（`IB`到以太网）延迟`5-10μs`
     - 延迟差异可能导致`5`倍的性能差距
   - ❌ **带宽损失问题**：
     - `IB`交换机间保持`200Gbps`带宽
     - 跨交换机类型带宽降至`100Gbps`（损失`~50%`）
     - 以太网交换机间带宽仅`10-100Gbps`（损失`50-95%`）
     - 带宽损失严重影响`KV Cache`传输效率

3. **资源利用率低**：
   - ❌ 无法优先选择网络距离近且交换机类型匹配的节点
   - ❌ 可能导致高性能`IB`交换机下的节点空闲，而低性能以太网交换机下的节点过载

**实际影响**：

对于`PD`分离推理服务：
- `Prefill`生成的`KV Cache`需要频繁传输给`Decode`
- 如果`12`个`Prefill Pod`和`12`个`Decode Pod`分散在不同类型的交换机下：
  - **延迟影响**：跨交换机类型通信延迟从`<2μs`增加到`5-10μs`，增加`5`倍
  - **带宽影响**：跨交换机类型带宽从`200Gbps`降至`100Gbps`，损失`50%`
  - **吞吐量影响**：`KV Cache`传输效率降低，`Decode`阶段等待时间增加，整体吞吐量可能下降`30-50%`

### 网络拓扑感知调度的优势

**核心价值**：

网络拓扑感知调度能够理解集群的网络拓扑结构，在调度时优先选择网络距离近的节点：

1. **拓扑感知**：
   - ✅ 调度器知道每个节点所属的交换机层级和交换机类型（`IB`或以太网）
   - ✅ 能够计算节点之间的网络距离（通过`LCA`最低公共祖先）
   - ✅ 优先选择同一交换机下的节点，避免跨交换机类型通信

2. **性能优化**：
   - ✅ **延迟优化**：
     - `12`个`Prefill Pod`尽量集中在`IB`交换机下（`ib switch0`、`ib switch1`）
     - `12`个`Decode Pod`也尽量集中在`IB`交换机下
     - 两组`Pod`尽量在同一`IB`汇聚交换机（`ib switch4`）下，延迟保持在`2-5μs`
   - ✅ **带宽优化**：
     - 避免跨交换机类型通信，保持`200Gbps`带宽
     - 避免带宽损失（`50-95%`），确保`KV Cache`传输效率

3. **灵活性**：
   - ✅ 支持`Hard`模式（严格限制）和`Soft`模式（尽力而为）
   - ✅ 可以通过`highestTierAllowed`控制允许的最大网络距离
   - ✅ 在满足拓扑约束的前提下，仍然支持其他调度策略

### 使用方案

**组合方案：节点亲和性 + 网络拓扑感知调度**

- **节点亲和性**：硬约束，确保选择正确的`GPU`型号（`H100`或`RTX 4090`）
- **网络拓扑感知调度**：软约束，在满足`GPU`型号要求的前提下，优化网络拓扑

**方案优势**：
- ✅ **精确控制**：通过节点亲和性确保`GPU`型号正确
- ✅ **性能优化**：通过网络拓扑感知在域内选择网络距离近的节点
- ✅ **适应性强**：适合大规模、复杂网络拓扑的集群

## HyperNode拓扑设计

### 拓扑结构设计

根据我们的网络拓扑情况，设计如下`HyperNode`拓扑层级：

```text
tier3                                            eth switch6
                                  /                                    \
tier2                         ib switch4                           eth switch5
                          /                \                    /              \
tier1             ib switch0           ib switch1         eth switch2      eth switch3
                  /    |    \          /    |    \        /    |    \      /    |    \ 
             node0    ...   node63  node64 ... node127  ...   ...   ...   ...  ...   ...
```

**层级说明**：
- **Tier 1**：叶子交换机层，每个叶子交换机下最多`64`台服务器
  - `ib switch0`、`ib switch1`：`IB`交换机，提供高带宽低延迟通信
  - `eth switch2`、`eth switch3`：以太网交换机，用于非性能敏感任务
- **Tier 2**：汇聚交换机层
  - `ib switch4`：`IB`汇聚交换机，连接`ib switch0`和`ib switch1`
  - `eth switch5`：以太网汇聚交换机，连接`eth switch2`和`eth switch3`
- **Tier 3**：核心交换机（`eth switch6`），整个集群的根节点，连接不同类型的汇聚交换机

**网络拓扑特点**：
- **同一`IB`交换机内**：延迟`<2μs`，带宽`200Gbps`，性能最优
- **跨`IB`交换机**：延迟`2-5μs`，带宽`200Gbps`，保持高性能
- **`IB`到以太网**：延迟`5-10μs`，带宽降至`100Gbps`（损失`~50%`），性能显著下降
- **以太网交换机间**：延迟`>10μs`，带宽`10-100Gbps`（损失`50-95%`），不适合高性能任务

**PD分离部署说明**：
- `Prefill`服务：`12`个`Pod`，需要选择`H100`节点，**必须部署在`IB`交换机下**（`ib switch0`或`ib switch1`）
- `Decode`服务：`12`个`Pod`，需要选择`RTX 4090`节点，**必须部署在`IB`交换机下**（`ib switch0`或`ib switch1`）
- 两个服务的所有节点应尽量在同一`IB`汇聚交换机（`ib switch4`）下，以：
  - 保持`200Gbps`带宽，避免带宽损失
  - 保持`2-5μs`延迟，避免跨交换机类型通信
  - 确保`KV Cache`传输效率最优

### HyperNode配置

为了支持网络拓扑感知调度，我们需要创建`HyperNode`资源来描述集群的网络拓扑（这里使用手动维护`HyperNode`的方式）。

> 如果不基于以太网节点之间的网络拓扑实现感知调度，可以不创建以太网的`HyperNode`以简化维护成本。本示例为保证完整性，为所有交换机创建了`HyperNode`配置。

```yaml
# Tier 1: IB叶子交换机 ib-switch0
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: ib-switch0
spec:
  tier: 1
  members:
    - type: Node
      selector:
        labelMatch:
          matchLabels:
            topology.kubernetes.io/switch: ib-switch0
            topology.kubernetes.io/switch-type: ib  # IB交换机标识

---
# Tier 1: IB叶子交换机 ib-switch1
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: ib-switch1
spec:
  tier: 1
  members:
    - type: Node
      selector:
        labelMatch:
          matchLabels:
            topology.kubernetes.io/switch: ib-switch1
            topology.kubernetes.io/switch-type: ib

---
# Tier 1: 以太网叶子交换机 eth-switch2
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: eth-switch2
spec:
  tier: 1
  members:
    - type: Node
      selector:
        labelMatch:
          matchLabels:
            topology.kubernetes.io/switch: eth-switch2
            topology.kubernetes.io/switch-type: ethernet  # 以太网交换机标识

---
# Tier 1: 以太网叶子交换机 eth-switch3
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: eth-switch3
spec:
  tier: 1
  members:
    - type: Node
      selector:
        labelMatch:
          matchLabels:
            topology.kubernetes.io/switch: eth-switch3
            topology.kubernetes.io/switch-type: ethernet

---
# Tier 2: IB汇聚交换机 ib-switch4（连接 ib-switch0 和 ib-switch1）
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: ib-switch4
spec:
  tier: 2
  members:
    - type: HyperNode
      selector:
        exactMatch:
          name: ib-switch0
    - type: HyperNode
      selector:
        exactMatch:
          name: ib-switch1

---
# Tier 2: 以太网汇聚交换机 eth-switch5（连接 eth-switch2 和 eth-switch3）
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: eth-switch5
spec:
  tier: 2
  members:
    - type: HyperNode
      selector:
        exactMatch:
          name: eth-switch2
    - type: HyperNode
      selector:
        exactMatch:
          name: eth-switch3

---
# Tier 3: 核心交换机 eth-switch6（集群根节点）
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: eth-switch6
spec:
  tier: 3
  members:
    - type: HyperNode
      selector:
        exactMatch:
          name: ib-switch4
    - type: HyperNode
      selector:
        exactMatch:
          name: eth-switch5
```

**配置说明**：
- **IB交换机**（`ib-switch0`、`ib-switch1`）：通过标签选择器关联`IB`交换机下的节点，用于高性能任务
- **以太网交换机**（`eth-switch2`、`eth-switch3`）：通过标签选择器关联以太网交换机下的节点，用于非性能敏感任务
- **IB汇聚交换机**（`ib-switch4`）：连接两个`IB`叶子交换机，保持`200Gbps`带宽
- **以太网汇聚交换机**（`eth-switch5`）：连接两个以太网叶子交换机
- **核心交换机**（`eth-switch6`）：连接不同类型的汇聚交换机，形成完整的拓扑树

**重要提示**：
- `PD`分离服务应部署在`IB`交换机下的节点，通过节点标签`topology.kubernetes.io/switch-type: ib`进行筛选
- 避免将高性能任务调度到以太网交换机下的节点，以免带宽损失和延迟增加

## 方案实施

### 为节点打标签

> 以下脚本仅做示例，主要阐述在使用网络拓扑感知调度之前，节点打标也是很重要一个环节。

```bash
# 为 IB switch0 下的节点打标签（假设 node0-node63）
for i in {0..63}; do
  kubectl label node node$i topology.kubernetes.io/switch=ib-switch0
  kubectl label node node$i topology.kubernetes.io/switch-type=ib
done

# 为 IB switch1 下的节点打标签（假设 node64-node127）
for i in {64..127}; do
  kubectl label node node$i topology.kubernetes.io/switch=ib-switch1
  kubectl label node node$i topology.kubernetes.io/switch-type=ib
done

# 为以太网 switch2 下的节点打标签（假设 node128-node191）
for i in {128..191}; do
  kubectl label node node$i topology.kubernetes.io/switch=eth-switch2
  kubectl label node node$i topology.kubernetes.io/switch-type=ethernet
done

# 为以太网 switch3 下的节点打标签（假设 node192-node255）
for i in {192..255}; do
  kubectl label node node$i topology.kubernetes.io/switch=eth-switch3
  kubectl label node node$i topology.kubernetes.io/switch-type=ethernet
done

# 为 H100 节点打上 GPU 型号标签（仅在 IB 交换机下）
# 假设 ib-switch0 和 ib-switch1 下有 H100 节点
kubectl label node node0 node1 node5 node10 node15 node20 node64 node65 node70 node75 node80 node85 gpu-type=h100

# 为 RTX 4090 节点打上 GPU 型号标签（仅在 IB 交换机下）
# 假设 ib-switch0 和 ib-switch1 下也有 RTX 4090 节点
kubectl label node node2 node3 node6 node11 node16 node21 node66 node67 node71 node76 node81 node86 gpu-type=rtx4090

# 验证标签
kubectl get nodes -L topology.kubernetes.io/switch,topology.kubernetes.io/switch-type,gpu-type
```

**标签说明**：
- `topology.kubernetes.io/switch`：标识节点所属的叶子交换机（`ib-switch0`、`ib-switch1`、`eth-switch2`、`eth-switch3`）
- `topology.kubernetes.io/switch-type`：标识交换机类型（`ib`或`ethernet`）
- `gpu-type`：标识节点上的`GPU`型号（`h100`或`rtx4090`）

**重要提示**：
- `PD`分离服务的节点必须在`IB`交换机下（`topology.kubernetes.io/switch-type=ib`）
- 以太网交换机下的节点不适合高性能推理任务，应用于非性能敏感任务

### Prefill服务配置

**需求**：部署`Prefill`服务，`12`个`Pod`，选择`H100`节点，尽量集中在少数交换机下。

> 这里使用`Volcano Job`来演示`Prefill`服务的部署，若使用`Deployment`部署，相关配置一致。

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: pd-prefill-service
spec:
  minAvailable: 12  # Gang调度：12个Pod必须同时满足
  schedulerName: volcano
  queue: default
  
  # 网络拓扑感知调度：优化节点选择，尽量集中在少数交换机下
  networkTopology:
    mode: soft  # 软约束，尽量选择网络距离近的节点
    highestTierAllowed: 2  # 允许在Tier 2（汇聚交换机）内调度
  
  tasks:
    - replicas: 12
      name: prefill-worker
      template:
        spec:
          # 节点亲和性：必须选择IB交换机下的H100节点（硬约束）
          affinity:
            nodeAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                nodeSelectorTerms:
                  - matchExpressions:
                      - key: gpu-type
                        operator: In
                        values:
                          - h100  # 必须在H100节点
                      - key: topology.kubernetes.io/switch-type
                        operator: In
                        values:
                          - ib  # 必须在IB交换机下
            
            # Pod反亲和性：尽量将Pod分散到不同节点（软约束）
            podAntiAffinity:
              preferredDuringSchedulingIgnoredDuringExecution:
                - weight: 100
                  podAffinityTerm:
                    labelSelector:
                      matchExpressions:
                        - key: volcano.sh/job-name
                          operator: In
                          values:
                            - pd-prefill-service
                    topologyKey: kubernetes.io/hostname
          
          containers:
            - name: prefill-service
              image: vllm/vllm:latest
              command: ["python", "-m", "vllm.entrypoints.api_server"]
              args:
                - "--model=/models/llama-70b"
                - "--tensor-parallel-size=1"
                - "--pipeline-parallel-size=1"
                - "--enable-prefix-caching"
              env:
                - name: NCCL_IB_DISABLE
                  value: "0"    # 启用IB网络
                - name: NCCL_SOCKET_IFNAME
                  value: "ib0"  # 指定IB网络接口
                - name: NCCL_IB_HCA
                  value: "mlx5" # 指定IB设备
              resources:
                limits:
                  nvidia.com/gpu: "1"
                requests:
                  nvidia.com/gpu: "1"
          restartPolicy: OnFailure
```

**关键配置说明**：
- `minAvailable: 12`：Gang调度，确保`12`个`Pod`同时满足才开始调度
- `nodeAffinity`：硬约束，确保所有`Prefill Pod`调度到`IB`交换机下的`H100`节点
  - `gpu-type: h100`：选择`H100`节点
  - `topology.kubernetes.io/switch-type: ib`：**必须在`IB`交换机下**
- `networkTopology.mode: soft`：软约束，优化网络拓扑
- `networkTopology.highestTierAllowed: 2`：允许在`Tier 2`（`IB`汇聚交换机）内调度
- `podAntiAffinity`：软约束，尽量将`Pod`分散到不同节点
- `NCCL_IB_DISABLE=0`：启用`IB`网络

**调度效果（网络拓扑感知的优势）**：

如果**不使用**网络拓扑感知调度或未限制交换机类型：
- ❌ `12`个`Pod`可能分散在`IB`和以太网交换机下
- ❌ **延迟问题**：跨交换机类型通信延迟可能达到`5-10μs`
- ❌ **带宽损失**：跨交换机类型带宽降至`100Gbps`，损失`50%`
- ❌ `KV Cache`传输效率严重下降，吞吐量可能下降`30-50%`

使用网络拓扑感知调度 + `IB`交换机约束后：
- ✅ `12`个`Prefill Pod`全部部署在`IB`交换机下（`ib-switch0`和`ib-switch1`）
- ✅ 大部分`Pod`在同一叶子交换机下，通信延迟`<2μs`，带宽`200Gbps`
- ✅ 少数跨叶子交换机的通信也在同一`IB`汇聚交换机（`ib-switch4`）下，延迟`2-5μs`，带宽`200Gbps`
- ✅ **避免跨交换机类型通信，无带宽损失，网络性能最优**

### Decode服务配置

**需求**：部署`Decode`服务，`12`个`Pod`，选择`RTX 4090`节点，尽量集中在少数交换机下，并与`Prefill`服务在同一汇聚交换机下。

> 这里使用`Volcano Job`来演示`Decode`服务的部署，若使用`Deployment`部署，相关配置一致。

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: pd-decode-service
spec:
  minAvailable: 12  # Gang调度：12个Pod必须同时满足
  schedulerName: volcano
  queue: default
  
  # 网络拓扑感知调度：优化节点选择，尽量集中在少数交换机下
  networkTopology:
    mode: soft  # 软约束，尽量选择网络距离近的节点
    highestTierAllowed: 2  # 允许在Tier 2（汇聚交换机）内调度
  
  tasks:
    - replicas: 12
      name: decode-worker
      template:
        spec:
          # 节点亲和性：必须选择IB交换机下的RTX 4090节点（硬约束）
          affinity:
            nodeAffinity:
              requiredDuringSchedulingIgnoredDuringExecution:
                nodeSelectorTerms:
                  - matchExpressions:
                      - key: gpu-type
                        operator: In
                        values:
                          - rtx4090  # 必须在RTX 4090节点
                      - key: topology.kubernetes.io/switch-type
                        operator: In
                        values:
                          - ib  # 必须在IB交换机下
            
            # Pod反亲和性：尽量将Pod分散到不同节点（软约束）
            podAntiAffinity:
              preferredDuringSchedulingIgnoredDuringExecution:
                - weight: 100
                  podAffinityTerm:
                    labelSelector:
                      matchExpressions:
                        - key: volcano.sh/job-name
                          operator: In
                          values:
                            - pd-decode-service
                    topologyKey: kubernetes.io/hostname
          
          containers:
            - name: decode-service
              image: vllm/vllm:latest
              command: ["python", "-m", "vllm.entrypoints.api_server"]
              args:
                - "--model=/models/llama-70b"
                - "--tensor-parallel-size=1"
                - "--pipeline-parallel-size=1"
                - "--enable-prefix-caching"
              env:
                - name: NCCL_IB_DISABLE
                  value: "0"    # 启用IB网络
                - name: NCCL_SOCKET_IFNAME
                  value: "ib0"  # 指定IB网络接口
                - name: NCCL_IB_HCA
                  value: "mlx5" # 指定IB设备
              resources:
                limits:
                  nvidia.com/gpu: "1"
                requests:
                  nvidia.com/gpu: "1"
          restartPolicy: OnFailure
```

**关键配置说明**：
- `minAvailable: 12`：`Gang`调度，确保`12`个`Pod`同时满足才开始调度
- `nodeAffinity`：硬约束，确保所有`Decode Pod`调度到`IB`交换机下的`RTX 4090`节点
  - `gpu-type: rtx4090`：选择`RTX 4090`节点
  - `topology.kubernetes.io/switch-type: ib`：**必须在`IB`交换机下**
- `networkTopology.mode: soft`：软约束，优化网络拓扑
- `networkTopology.highestTierAllowed: 2`：允许在`Tier 2`（`IB`汇聚交换机）内调度
- `podAntiAffinity`：软约束，尽量将`Pod`分散到不同节点

**调度效果（PD分离的完整优化）**：

使用网络拓扑感知调度 + `IB`交换机约束后：
- ✅ `12`个`Decode Pod`也全部部署在`IB`交换机下（`ib-switch0`和`ib-switch1`）
- ✅ `Prefill`和`Decode`之间的`KV Cache`传输主要在同一`IB`汇聚交换机（`ib-switch4`）下，延迟`2-5μs`，带宽`200Gbps`
- ✅ **避免跨交换机类型的`KV Cache`传输，无带宽损失**
- ✅ 整体推理性能最优，吞吐量最高

**与简单亲和性调度的对比**：

| 对比项 | 简单亲和性调度 | 网络拓扑感知 + IB约束 |
|--------|---------------|------------------|
| `Prefill Pod`分布 | 可能分散在`IB`和以太网交换机 | 集中在`IB`交换机（`ib-switch0/1`） |
| `Decode Pod`分布 | 可能分散在`IB`和以太网交换机 | 集中在`IB`交换机（`ib-switch0/1`） |
| `Prefill`内部通信延迟 | `2-10μs`（可能跨交换机类型） | `<5μs`（`IB`交换机内） |
| `Prefill`内部通信带宽 | `100-200Gbps`（可能损失`50%`） | `200Gbps`（无损失） |
| `Decode`内部通信延迟 | `2-10μs`（可能跨交换机类型） | `<5μs`（`IB`交换机内） |
| `Decode`内部通信带宽 | `100-200Gbps`（可能损失`50%`） | `200Gbps`（无损失） |
| `Prefill-Decode`通信延迟 | `5-10μs`（可能跨交换机类型） | `2-5μs`（同一`IB`汇聚交换机） |
| `Prefill-Decode`通信带宽 | `100Gbps`（损失`50%`） | `200Gbps`（无损失） |
| 整体吞吐量 | 下降`30-50%` | 最优，无损失 |

## 总结

**网络拓扑感知调度在大规模集群中的核心价值**：

1. **拓扑感知的性能优化**：
   - ✅ 在大规模混合网络集群（`7`个交换机，其中`3`个`IB`交换机、`4`个以太网交换机，最多`384`台服务器）中，网络拓扑感知调度能够显著优化节点选择
   - ✅ 通过`IB`交换机类型约束，确保所有高性能任务部署在`IB`交换机下
   - ✅ `12`个`Prefill Pod`和`12`个`Decode Pod`集中在`IB`交换机下，避免跨交换机类型通信
   - ✅ 通过`highestTierAllowed: 2`限制，确保所有`Pod`在同一`IB`汇聚交换机（Tier 2）下
   - ✅ **延迟优化**：从可能的`5-10μs`降低到`2-5μs`，性能提升`2-5`倍
   - ✅ **带宽优化**：保持`200Gbps`带宽，避免`50%`的带宽损失，吞吐量提升`30-50%`

2. **解决简单亲和性调度的局限性**：
   - ✅ 简单的节点亲和性只能保证`GPU`型号正确，无法感知网络拓扑和交换机类型
   - ✅ 网络拓扑感知调度能够理解节点之间的网络距离和交换机类型，优先选择网络距离近且交换机类型匹配的节点
   - ✅ 在满足`GPU`型号要求的前提下，进一步优化网络性能，避免跨交换机类型的带宽损失

3. **资源精细化利用**：
   - ✅ `Prefill`服务使用高性能`H100` `GPU`，满足计算密集型需求
   - ✅ `Decode`服务使用性价比高的`RTX 4090` `GPU`，满足访存密集型需求
   - ✅ 充分发挥不同GPU型号的优势，降低整体成本

4. **适应混合网络拓扑**：
   - ✅ 支持`IB`和以太网混合的多层级网络拓扑（叶子交换机、汇聚交换机、核心交换机）
   - ✅ 通过`HyperNode`灵活定义网络拓扑结构，支持不同交换机类型的标识
   - ✅ 适合大规模、复杂混合网络拓扑的集群环境
   - ✅ 能够根据任务特性选择合适的交换机类型（高性能任务选择`IB`，非性能敏感任务选择以太网）

5. **灵活扩展**：
   - ✅ 支持多个`PD`分离服务实例
   - ✅ 可以根据负载动态调整`Prefill`和`Decode`服务规模
   - ✅ 易于水平扩展，适应业务增长

## 参考资料

- [Volcano官方文档 - 网络拓扑感知调度](https://volcano.sh/zh/docs/network_topology_aware_scheduling/)
- [Volcano GitHub - Network Topology Aware Scheduling设计文档](https://github.com/volcano-sh/volcano/blob/master/docs/design/Network%20Topology%20Aware%20Scheduling.md)