---
slug: "/cloud-native/volcano-network-topology-scheduling"
title: "Volcano网络拓扑感知调度"
hide_title: true
keywords:
  [
    "Volcano",
    "Kubernetes",
    "网络拓扑感知调度",
    "Network Topology",
    "HyperNode",
    "InfiniBand",
    "NVLINK",
    "RoCE",
    "AI训练",
    "分布式训练",
    "多机多卡",
    "network-topology-aware",
    "拓扑感知",
    "Gang调度",
    "高性能网络",
  ]
description: "深入介绍Volcano网络拓扑感知调度特性，包括HyperNode CRD定义、自动发现机制、调度策略以及在多机多卡AI训练场景中的实践应用，帮助优化InfiniBand和NVLINK等高性能网络环境下的任务调度效率。"
---


## 背景与价值

### AI大模型训练的网络挑战

在`AI`大模型训练场景中，特别是采用模型并行（`Model Parallelism`）策略时，模型被分割到多个节点上进行训练。训练过程中，这些节点需要频繁进行大量的数据交互，包括：

- **梯度同步**：分布式训练中各节点间需要频繁交换梯度信息
- **参数更新**：模型参数需要在多个节点间同步
- **中间结果传输**：模型并行场景下，不同层的计算结果需要在节点间传递

此时，**节点间的网络传输性能往往成为训练的瓶颈**，显著影响训练效率。

### 数据中心网络的复杂性

现代数据中心的网络环境具有以下特点：

1. **网络类型多样**：
   - `InfiniBand (IB)`：提供超低延迟和高带宽，常用于`HPC`和`AI`训练
   - `RoCE (RDMA over Converged Ethernet)`：在以太网上实现`RDMA`功能
   - `NVSwitch/NVLINK`：`NVIDIA GPU`间的高速互连技术
   - 传统以太网：通用网络连接

2. **网络拓扑复杂**：
   - 多层交换机架构（`Spine-Leaf`、`Fat-Tree`等）
   - 不同层级的交换机性能差异显著
   - 跨交换机通信会增加延迟、降低吞吐量

3. **性能差异明显**：
   - 同一交换机下的节点通信：延迟最低、带宽最高
   - 跨一层交换机通信：性能有所下降
   - 跨多层交换机通信：性能显著降低

### 网络拓扑感知调度的价值

**核心价值**：将工作负载调度到具有最高吞吐量和最低延迟的最佳性能域，尽可能减少跨交换机的通信，从而：

- **提升训练效率**：减少网络通信开销，加速数据交换
- **降低通信延迟**：优先选择网络拓扑距离近的节点
- **提高网络吞吐**：充分利用高速网络互连（如`IB`、`NVLINK`）
- **优化资源利用**：将任务调度到最合适的网络性能域

**典型收益**：
- 在大规模模型训练中，网络优化可将训练时间缩短`40-60%`
- `GPU`利用率可提升`20-30%`
- 支持更大规模的分布式训练任务

## Volcano网络拓扑感知调度实现原理

:::info 提示
本文档基于`volcano v1.13.0`版本梳理，由于网络拓扑插件更新较快，未来版本会有一些变化，例如本文未覆盖的一些新特性和配置。
:::

### 核心设计理念

`Volcano`的网络拓扑感知调度基于以下核心设计：

1. **统一的网络拓扑API**：通过`HyperNode CRD`标准化描述网络拓扑
2. **拓扑感知调度策略**：基于网络拓扑信息进行智能调度决策
3. **灵活的约束模式**：支持`Hard`和`Soft`两种调度约束模式

### HyperNode CRD

#### HyperNode概念

`HyperNode` 是一个性能域（`Performance Domain`），表示一组具有相同网络带宽和延迟特性的节点或子性能域。通常映射到一个交换机或`Tor（Top of Rack）`。

`Tier`（层级） 用于区分不同的性能域：
- `Tier`值越小，网络带宽越高、延迟越低
- 同一`Tier`内的节点具有相同的网络性能特征
- 不同`Tier`代表不同层级的交换机

#### HyperNode的优势

相比传统的通过节点标签（`Label`）表示网络拓扑的方式，`HyperNode`具有以下优势：

| 特性 | 节点标签方式 | HyperNode方式 |
|------|-------------|---------------|
| **语义统一** | 标签命名不统一，语义模糊 | 标准化的`API`，语义清晰 |
| **层级结构** | 难以表达多层级关系 | 支持树状层级结构 |
| **管理便捷** | 需要手动维护大量标签 | 支持自动发现和集中管理 |
| **扩展性** | 扩展困难 | 易于扩展和定制 |

#### HyperNode关键字段

```yaml
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s0
spec:
  # Tier层级，层级越低，网络性能越好
  tier: 1
  
  # 成员列表，可以是Node或HyperNode
  members:
    - type: Node  # 成员类型：Node或HyperNode
      selector:
        # 支持三种选择器：exactMatch、regexMatch、labelMatch
        exactMatch:
          name: node0
```

**关键字段说明**：

- `spec.tier`：`HyperNode`的层级，层级越低，节点间通信效率越高
- `spec.members`：`HyperNode`的子节点列表
- `spec.members[i].type`：子节点类型
  - `Node`：真实的`Kubernetes`节点（叶子`HyperNode`）
  - `HyperNode`：其他`HyperNode`（非叶子`HyperNode`）
- `spec.members[i].selector`：子节点选择器，支持三种方式：
  - `exactMatch`：精确匹配节点名称
  - `regexMatch`：正则表达式匹配节点名称
  - `labelMatch`：基于标签匹配节点

:::warning 注意事项
- `regexMatch`和`labelMatch`只能用在叶子`HyperNode`中
- 三种`selector`不能同时配置，通常只配置一种选择器
- 非叶子`HyperNode`只支持`exactMatch`
:::

### 网络拓扑树状结构

多个`HyperNode`通过层级连接，形成树状结构。例如：

```text
tier3                                     s6
                          /                                \
tier2                   s4                                  s5                         
                /               \                    /               \                 
tier1         s0                s1                  s2               s3              
           /      \          /      \            /      \         /      \         
        node0    node1    node2    node3      node4    node5    node6    node7      
```

**通信效率分析**：
- `node0`和`node1`：同属于`s0`（`tier1`），通信效率**最高**
- `node0`和`node2`：需跨`s0→s4→s1`，通信效率**较低**
- `node0`和`node4`：需跨`s0→s4→s5→s2`，通信效率**最低**

### 调度策略：Hard/Soft模式

`Volcano Job`和`PodGroup`可以通过`networkTopology`字段设置拓扑约束：

```yaml
spec:
  networkTopology:
    mode: hard  # 或 soft
    highestTierAllowed: 2
```

#### Hard模式（硬约束）

**特点**：
- 作业中的**所有任务必须**被调度到`highestTierAllowed`定义的单个`HyperNode`层级（或更低层级）内
- 如果找不到满足约束的`HyperNode`，作业将保持`Pending`状态
- 适用于对网络拓扑有**严格要求**的场景

**适用场景**：
- 大规模分布式训练，对网络延迟极其敏感
- 需要保证所有节点在同一高速网络域内
- 模型并行训练，节点间通信频繁

**使用举例**：

以前面的网络拓扑为例，以下网络拓扑调度配置仅允许任务在`s4`或`s5`下调度，但不允许一部分任务调度到`s4`下，一部分任务调度到`s5`下：
```yaml
spec:
  networkTopology:
    mode: hard
    highestTierAllowed: 2
```


#### Soft模式（软约束）

**特点**：
- 调度器会**尽最大努力**将任务调度到同一个`HyperNode`内
- 如果无法满足，允许任务被调度到不同的`HyperNode`上
- 确保作业能够尽快运行，提供调度灵活性

**适用场景**：
- 希望优化网络性能，但可接受一定的调度灵活性
- 集群资源紧张，需要平衡性能和资源利用率
- 数据并行训练，网络通信相对较少


**使用举例**：

以前面的网络拓扑为例，以下网络拓扑调度配置允许任务同时在`s4`和`s5`下调度，即一部分任务在`s4`，一部分在`s5`，但尽可能将所有任务调度到同一个`HyperNode`下：
```yaml
spec:
  networkTopology:
    mode: soft
    highestTierAllowed: 2
```

### 调度打分逻辑

`network-topology-aware`插件在调度时采用以下打分策略：

#### 基于Tier的打分

**目标**：`HyperNode`的`Tier`越低，得分越高

**计算公式**：
```
tierScore = (maxTier - currentTier) / (maxTier - minTier) * 100
```

**示例**：
- 假设集群中`Tier`范围为`1-3`
- `Tier=1`的`HyperNode`得分：`(3-1)/(3-1) * 100 = 100分`
- `Tier=2`的`HyperNode`得分：`(3-2)/(3-1) * 100 = 50分`
- `Tier=3`的`HyperNode`得分：`(3-3)/(3-1) * 100 = 0分`

#### 基于任务分布的打分

**目标**：作业在该`HyperNode`内已成功调度的`Pod`数量越多，得分越高

**计算公式**：
```
taskNumScore = (hyperNodeTaskNum / totalTaskNum) * 100
```

**作用**：鼓励将同一作业的任务调度到同一`HyperNode`，减少跨`HyperNode`通信

#### 综合打分流程

1. **首次调度**：所有候选`HyperNode`得分为`0`，调度成功后记录`JobAllocatedHyperNode`
2. **后续调度**：
   - 计算候选`HyperNode`与`JobAllocatedHyperNode`的`LCA`（最低公共祖先）`HyperNode`
   - 基于`LCA`的`Tier`计算`tierScore`
   - 如果有多个`HyperNode`得分相同，进一步基于任务分布计算`taskNumScore`
3. **最终得分**：`finalScore = tierScore + taskNumScore`

## 配置方式

### 配置Volcano调度器

要启用网络拓扑感知调度功能，需要修改`Volcano`调度器的`ConfigMap`：

```yaml title="volcano-scheduler.conf"
actions: "enqueue, allocate, backfill"
tiers:
- plugins:
  - name: priority
  - name: gang
  - name: conformance
- plugins:
  - name: predicates
  - name: proportion
  # 启用网络拓扑感知插件
  - name: network-topology-aware  
    arguments:
      # 设置插件权重，默认为1
      # 当多个节点打分插件（如nodeorder、binpack等）同时存在时，该值决定该插件在总分中的占比
      weight: 10  
  - name: nodeorder
  - name: binpack
```

### HyperNode管理方式

#### 自动发现机制（推荐）

`Volcano`通过集成可插拔的网络拓扑发现工具（`Discoverer`）实现`HyperNode`的自动发现与管理。

**工作原理**：
1. `Discoverer`定期从外部系统收集网络拓扑信息
2. 将信息转换为标准的`HyperNode`表示
3. `HyperNode Controller`自动创建、更新或删除`HyperNode CRs`

**支持的发现源**：
- **UFM（Unified Fabric Manager）**：`InfiniBand`网络管理
- **RoCE**：`RDMA over Converged Ethernet`
- **Label**：基于节点标签

##### 配置示例

**Step 1：创建UFM凭据Secret（如果使用UFM）**

```bash
kubectl create secret generic ufm-credentials \
  --from-literal=username='your-ufm-username' \
  --from-literal=password='your-ufm-password' \
  -n volcano-system
```

**Step 2：配置Discoverer**

注意这里修改的是`volcano controller`的配置，由于`volcano controller`对`ConfigMap`有异步监听和热更新机制，因此修改该配置后无需手动重启`volcano controller`，理论上等待数秒后即可生效。

```yaml title="volcano-controller.conf"
networkTopologyDiscovery:
  # UFM发现源配置（适用于InfiniBand网络）
  - source: ufm
    enabled: true
    interval: 10m
    credentials:
      secretRef:
        name: ufm-credentials
        namespace: volcano-system
    config:
      endpoint: https://ufm-server:8080
      insecureSkipVerify: true
  
  # RoCE发现源配置
  - source: roce
    enabled: false
    interval: 15m
    config:
      endpoint: https://roce-server:9090
  
  # 基于标签的发现源配置
  - source: label
    enabled: true
    config:
      networkTopologyTypes:
        # 定义拓扑类型A2：2层网络拓扑
        topologyA2:
          - nodeLabel: "volcano.sh/tor"  # 交换机标签
          - nodeLabel: "kubernetes.io/hostname"  # 节点主机名
        
        # 定义拓扑类型A3：3层网络拓扑
        topologyA3:
          - nodeLabel: "volcano.sh/hypercluster"  # 超集群标签
          - nodeLabel: "volcano.sh/hypernode"  # 超节点标签
          - nodeLabel: "kubernetes.io/hostname"  # 节点主机名
```

**配置说明**：
- `interval`：发现工具的执行间隔
- `enabled`：是否启用该发现源
- 基于标签的发现需要预先在节点上打好相应的标签

#### 手动配置HyperNode（基于标签）

如果不使用自动发现，可以手动创建`HyperNode`资源。

##### 示例1：基于精确匹配（完整三层拓扑）

```yaml
# Tier 1: 叶子HyperNode - 包含真实节点
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s0
spec:
  tier: 1
  members:
    - type: Node
      selector:
        exactMatch:
          name: node0
    - type: Node
      selector:
        exactMatch:
          name: node1
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s1
spec:
  tier: 1
  members:
    - type: Node
      selector:
        exactMatch:
          name: node2
    - type: Node
      selector:
        exactMatch:
          name: node3
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s2
spec:
  tier: 1
  members:
    - type: Node
      selector:
        exactMatch:
          name: node4
    - type: Node
      selector:
        exactMatch:
          name: node5
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s3
spec:
  tier: 1
  members:
    - type: Node
      selector:
        exactMatch:
          name: node6
    - type: Node
      selector:
        exactMatch:
          name: node7
---
# Tier 2: 中间层HyperNode - 组合Tier 1的HyperNode
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s4
spec:
  tier: 2
  members:
    - type: HyperNode
      selector:
        exactMatch:
          name: s0
    - type: HyperNode
      selector:
        exactMatch:
          name: s1
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s5
spec:
  tier: 2
  members:
    - type: HyperNode
      selector:
        exactMatch:
          name: s2
    - type: HyperNode
      selector:
        exactMatch:
          name: s3
---
# Tier 3: 根HyperNode - 组合Tier 2的HyperNode
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s6
spec:
  tier: 3
  members:
    - type: HyperNode
      selector:
        exactMatch:
          name: s4
    - type: HyperNode
      selector:
        exactMatch:
          name: s5
```

##### 示例2：基于正则匹配

```yaml
# 使用regexMatch匹配一组节点（匹配s0下的node0和node1）
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s0-regex
spec:
  tier: 1
  members:
    - type: Node
      selector:
        regexMatch:
          pattern: "^node[0-1]$"  # 匹配node0和node1
---
# 使用正则匹配所有节点
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: all-nodes-regex
spec:
  tier: 1
  members:
    - type: Node
      selector:
        regexMatch:
          pattern: "^node[0-7]$"  # 匹配node0到node7
```

##### 示例3：基于标签匹配

```yaml
# 使用labelMatch基于标签匹配节点（假设节点已打上相应标签）
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s0-labeled
spec:
  tier: 1
  members:
    - type: Node
      selector:
        labelMatch:
          matchLabels:
            volcano.sh/hypernode: s0
            network-type: infiniband
---
# 匹配特定Tier的所有节点
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: tier1-nodes
spec:
  tier: 1
  members:
    - type: Node
      selector:
        labelMatch:
          matchLabels:
            volcano.sh/tier: "1"
```





## 使用示例

### 网络拓扑感知配置参数说明

`Volcano Job`和`PodGroup`通过`networkTopology`字段配置网络拓扑约束，该字段包含以下参数：

#### 参数详解

```yaml
networkTopology:
  mode: <string>              # 调度模式：hard 或 soft
  highestTierAllowed: <int>   # 允许的最高Tier层级
```

**参数说明**：

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `mode` | `string` | 是 | 调度模式，可选值：<br/>- `hard`：硬约束，所有任务必须在指定`Tier`内<br/>- `soft`：软约束，尽力而为，允许降级 |
| `highestTierAllowed` | `int` | 是 | 允许的最高`Tier`层级值<br/>- 所有任务必须调度到`Tier ≤ highestTierAllowed`的同一`HyperNode`内<br/>- 值越小，网络性能要求越高 |


### Volcano Job配置示例

#### Hard模式调度

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: distributed-training
spec:
  minAvailable: 8
  schedulerName: volcano
  queue: default
  
  # 网络拓扑约束配置
  networkTopology:
    mode: hard  # 硬约束模式
    highestTierAllowed: 2  # 最高允许跨越Tier 2
  
  tasks:
    - replicas: 8
      name: worker
      template:
        spec:
          containers:
            - name: pytorch-worker
              image: pytorch/pytorch:latest
              command: ["python", "/workspace/train.py"]
              resources:
                limits:
                  nvidia.com/gpu: "1"
                requests:
                  nvidia.com/gpu: "1"
          restartPolicy: OnFailure
```

**说明**：
- `8`个任务必须调度到`Tier≤2`的同一个`HyperNode`内
- 如果没有满足条件的`HyperNode`，`Job`将保持`Pending`状态
- 适用于对网络性能要求极高的训练任务

#### Soft模式示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: flexible-training
spec:
  minAvailable: 16
  schedulerName: volcano
  queue: default
  
  networkTopology:
    mode: soft  # 软约束模式
    highestTierAllowed: 1
  
  tasks:
    - replicas: 16
      name: worker
      template:
        spec:
          containers:
            - name: tensorflow-worker
              image: tensorflow/tensorflow:latest-gpu
              resources:
                limits:
                  nvidia.com/gpu: "1"
          restartPolicy: OnFailure
```

**说明**：
- 调度器会尽量将`16`个任务调度到`Tier 1`的同一`HyperNode`
- 如果资源不足，允许跨`HyperNode`调度
- 保证作业能够尽快启动

### Deployment配置示例

`Volcano`通过`annotations`机制**支持**`Deployment`类型工作负载的网络拓扑感知调度。

**实现方式**：

通过在`Deployment`的`metadata`和`Pod`模板中添加特定的`annotations`来实现：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inference-service
  annotations:
    # 组调度设置：最少需要4个Pod同时调度
    scheduling.volcano.sh/group-min-member: "4"
spec:
  replicas: 4
  selector:
    matchLabels:
      app: inference
  template:
    metadata:
      labels:
        app: inference
      annotations:
        # 队列名称
        scheduling.volcano.sh/queue-name: default
        # 设置网络拓扑为硬约束
        volcano.sh/network-topology-mode: "hard"
        # 设置允许调度的最高网络层级为2
        volcano.sh/network-topology-highest-tier: "2"
    spec:
      schedulerName: volcano
      containers:
        - name: inference
          image: inference:latest
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
              nvidia.com/gpu: "1"
            limits:
              cpu: "100m"
              memory: "128Mi"
              nvidia.com/gpu: "1"
```

**配置说明**：

| 位置 | Annotation | 说明 |
|------|-----------|------|
| `Deployment`级别 | `scheduling.volcano.sh/group-min-member` | 最少需要同时调度的`Pod`数量，启用组调度 |
| `Pod`模板级别 | `scheduling.volcano.sh/queue-name` | 指定使用的`Volcano`队列 |
| `Pod`模板级别 | `volcano.sh/network-topology-mode` | 网络拓扑约束模式：`hard`或`soft` |
| `Pod`模板级别 | `volcano.sh/network-topology-highest-tier` | 允许的最高`Tier`层级 |

**工作原理**：
- `Volcano`会为该`Deployment`自动创建对应的`PodGroup`
- 所有`Pod`会继承`PodGroup`的网络拓扑约束
- 调度器按照网络拓扑感知策略进行调度决策

**注意事项**：
- `schedulerName`必须设置为`volcano`
- 必须设置资源`requests`和`limits`，避免`BestEffort`类型
- `group-min-member`通常设置为`replicas`的值


## 注意事项


### 必须设置任务资源量

网络拓扑感知调度依赖于任务的资源请求信息来进行合理的调度决策，如果任务是`BestEffort`类型（没有资源请求或者限制），即便启用了网络拓扑调度插件，但该任务并不触发网络拓扑调度。因此，**必须在`Volcano Job`或`PodGroup`的任务模板中明确设置资源请求（`requests`）和限制（`limits`）**，例如：

```yaml
resources:
  requests:
    cpu: "4"
    memory: "16Gi"
    nvidia.com/gpu: "1"
  limits:
    cpu: "4"
    memory: "16Gi"
    nvidia.com/gpu: "1"
```

### 调度时不存在HyperNode

如果任务中指定了网络拓扑调度的配置，但是集群中不存在任何`HyperNode`资源，那么该任务的调度不会受到网络拓扑感知调度插件的影响，调度器会按照默认的调度逻辑进行调度。

## 扩展阅读

- [RDMA硬件管理及网络拓扑信息查看](../../../1000-AI技术/800-基础架构/200-RDMA/3000-RDMA硬件管理及网络拓扑信息查看.md)



## 参考资料

- [Volcano官方文档 - 网络拓扑感知调度](https://volcano.sh/zh/docs/network_topology_aware_scheduling/)
- [Volcano GitHub - Network Topology Aware Scheduling设计文档](https://github.com/volcano-sh/volcano/blob/master/docs/design/Network%20Topology%20Aware%20Scheduling.md)

