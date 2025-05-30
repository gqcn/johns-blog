---
slug: "/cloud-native/volcano-introduction"
title: "Volcano介绍"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "调度器", "Gang Scheduling", "批处理", "AI训练", "机器学习", "深度学习", "Queue", "PodGroup"
  ]
description: "Volcano是基于Kubernetes的高性能批处理系统，为机器学习、深度学习等大数据应用提供高级调度功能。"
---

## 基本介绍

[Volcano](https://volcano.sh/zh/docs/) 是一个基于`Kubernetes`的批处理平台，提供了机器学习、深度学习、生物信息学、基因组学及其他大数据应用所需要而`Kubernetes`当前缺失的一系列特性，提供了高性能任务调度引擎、高性能异构芯片管理、高性能任务运行管理等通用计算能力。

![Volcano架构](../assets/arch_2.PNG)

相较于原生的调度器，`Volcano`具有的显著特点有：

- **支持 `Gang Scheduling`**

  对于批量作业的调度，容易碰到死锁的问题，比如两个作业都需要同时运行 10 个 Pod 才能启动，当两个作业同时提交时，可能都只有部分 Pod 被调度，两个作业都无法正常运行，而处于互相等待状态。`Gang Scheduling` 就是为了解决这个问题。

- **调度队列**

  配置不同的调度队列，能够实现对资源的抢占、配额的控制等。

- **硬件感知**

  `Numa`、`GPU`等硬件资源的感知，能够让`Pod`对硬件资源更高效的使用。

`Volcano`是在 `Kubernetes`原生调度能力的基础上进行的扩展和优化，因此，对于基本的 `nodeSelector`、`nodeAffinity`等也是支持的。同时也支持 `Extended Resource`，这点对于`GPU`、`IB`网卡等资源的在调度层面的感知非常重要。

> `Volcano`是业界首个云原生批量计算项目，`2019`年由华为云捐献给云原生计算基金会（`CNCF`），也是`CNCF`首个和唯一的孵化级容器批量计算项目。它源自于华为云AI容器，在支撑华为云一站式AI开发平台`ModelArts`、容器服务`CCI`等服务稳定运行中发挥重要作用。

### 核心组件

`Volcano`由以下几个核心组件组成，各自承担不同的功能职责：

1. **`Volcano Controller Manager`**：负责管理`Volcano`自定义资源的生命周期，监控和处理`Job`、`Queue`、`PodGroup`等资源的状态变化。

2. **`Volcano Scheduler`**：实现高级调度功能，如`Gang Scheduling`（组调度）、队列调度和优先级调度，通过插件化架构提供灵活的调度策略配置。

3. **`Volcano Admission`**：验证`Volcano`资源对象的合法性，为资源对象设置默认值，实现准入控制，确保提交的作业符合系统策略。

4. **`Volcano MutatingAdmission`**：修改资源对象的配置，如添加标签、注解等，自动注入环境变量和配置信息。

5. **`Volcano Agent`**（可选组件）：在节点上收集资源使用情况和硬件信息，为调度器提供更精确的节点资源信息，支持 GPU、FPGA 等异构资源的管理。

### 组件交互关系

下图展示了`Volcano`各组件之间的交互关系及数据流向：

```mermaid
graph TD
    User[[用户]] -->|1 提交作业| Admission[准入控制]
    
    subgraph "Volcano 系统"
        Admission -->|2.1 验证资源对象| Controller[Controller Manager]
        Controller -->|3 创建资源对象| Scheduler[Volcano Scheduler]
        Scheduler -->|6 调度决策| K8s[Kubernetes API]
        
        Controller <-->|4 监控状态变化| Resources[(PodGroup/Queue/Job)]
        Scheduler <-->|5 读取资源状态| Resources
        
        Agent[Volcano Agent] -->|7 资源信息收集| Scheduler
        MutatingAdmission[Volcano MutatingAdmission] -->|2.2 修改资源配置| Controller
    end
    
    K8s -->|8 创建 Pod| Kubelet[Kubelet]
    Kubelet -->|9 运行容器| Containers[[容器运行]]
    
    classDef core fill:#d1e5f0,stroke:#333,stroke-width:2px
    classDef resource fill:#bbf,stroke:#333,stroke-width:1px
    classDef external fill:#dfd,stroke:#333,stroke-width:1px
    
    class Controller,Scheduler,Admission,MutatingAdmission,Agent core
    class Resources resource
    class User,K8s,Kubelet,Containers external
```

`Volcano`的各个组件之间通过清晰的职责划分和有效的协作实现了完整的调度系统：

1. **用户提交流程**：用户提交作业→`Admission`验证 →`Controller`处理 →`Scheduler`调度 →`Kubelet`执行

2. **状态监控与管理**：
   -`Controller Manager`监控所有`Volcano`自定义资源的状态变化
   - 根据资源状态变化，触发相应的事件处理
   - 当需要重调度或清理资源时，通知`Scheduler`进行相应操作

3. **调度决策过程**：
   -`Scheduler`根据`Queue`配置和系统状态，为`PodGroup`分配资源
   - 通过插件化架构，实现不同的调度策略和算法
   - 支持`Gang Scheduling`，确保相关联的`Pod`要么全部调度成功，要么全部失败

4. **资源信息收集**：
   -`Agent`(如果启用) 提供节点资源信息，辅助调度决策
   - 特别是对于 GPU、FPGA 等异构资源，提供更精确的资源状态

5. **资源对象之间的关系**：
   -`Job`包含多个`Task`，每个`Task`对应一组相同角色的`Pod`
   -`PodGroup`作为调度的基本单位，表示一组需要同时调度的`Pod`
   -`Queue`容纳多个`PodGroup`，并控制这些`PodGroup`的资源分配和调度策略

这种组件化设计使`Volcano`能够灵活应对不同的工作负载需求，并且可以通过扩展插件来增强系统能力。

## Scheduler

### Kubernetes Scheduler
`kubernetes`当然有默认的pod调度器，但是其并不适应AI作业任务需求。在多机训练任务中，一个AI作业可能需要同时创建上千个甚至上万个pod，而只有当所有pod当创建完成后，AI作业才能开始运行，而如果有几个pod创建失败，已经创建成功的pod就应该退出并释放资源，否则便会产生资源浪费的情况。因此Ai作业的pod调度应该遵循`All or nothing`的理念，即要不全部调度成功，否则应一个也不调度。这便是`Volcano`项目的由来（前身是`kube-batch`项目），接下来便来介绍`Volcano`的调度。

![](../assets/20240330125540.png)



### Volcano Scheduler

值得注意的是，原生 `Kubernetes` 调度器（`kube-scheduler`）没有内置提供完整的 `Gang Scheduling`（组调度）能力。`Gang Scheduling` 是指将一组相关的任务作为一个整体进行调度，要么全部调度成功，要么全部不调度。

`Kubernetes` 默认调度器主要关注单个 `Pod` 的调度，它会逐个处理 `Pod`，而不会考虑 `Pod` 之间的相互依赖关系或者需要同时调度的需求。这种设计对于无状态应用和独立工作负载很有效，但对于需要多个 `Pod` 协同工作的场景（如分布式机器学习、大数据处理等）就显得不足。

`Volcano` 通过实现 `Gang Scheduling` 能力，确保一组相关的 `Pod` 要么全部被调度成功，要么全部不被调度，避免资源浪费和死锁情况。这是 `Volcano` 相对于原生 `Kubernetes` 调度器的一个关键优势。

![](../assets/zh-cn_image_0000002065638558.png)

`Volcano Scheduler`是负责`Pod`调度的组件，它由一系列`action`和`plugin`组成。`action`定义了调度各环节中需要执行的动作；`plugin`根据不同场景提供了`action`中算法的具体实现细节。`Volcano Scheduler`具有高度的可扩展性，您可以根据需要实现自己的`action`和`plugin`。



`Volcano Scheduler`的工作流程如下：

1.  客户端提交的`Job`被调度器识别到并缓存起来。
2.  周期性开启会话（`Session`），一个调度周期开始。
3.  将没有被调度的`Job`发送到会话的待调度队列中。
4.  遍历所有的待调度`Job`，按照定义的次序依次执行`enqueue`、`allocate`、`preempt`、`reclaim`、`backfill`等动作，为每个`Job`找到一个最合适的节点。将该`Job`绑定到这个节点。`action`中执行的具体算法逻辑取决于注册的`plugin`中各函数的实现。
5.  关闭本次会话。

具体流程、`Actions`和`Plugins`介绍请参考：
- https://volcano.sh/zh/docs/schduler_introduction
- https://volcano.sh/zh/docs/actions
- https://volcano.sh/zh/docs/plugins



### Task/Pod状态转换


![Task/Pod状态转换](../assets/v2-0a38d4ee885e17ce828f581eab1d795b_1440w.jpg)


`Volcano`在`Pod`和`Pod`的状态方面增加了很多状态:
- 图中**蓝色部分**为`Kubernetes`自带的状态。
- **绿色部分**是`session`级别的状态，一个调度周期，`Volcano Scheduler`会创建一个`session`，它只在调度周期内发挥作用，一旦过了调度周期，这几个状态它是失效的。
- **黄色部分**的状态是放在`Cache`内的。

我们加这些状态的目的是减少调度和API之间的一个交互，从而来优化调度性能。

`Pod`的这些状态为调度器提供了更多优化的可能。例如，当进行`Pod`驱逐时，驱逐在`Binding`和`Bound`状态的`Pod`要比较驱逐`Running`状态的`Pod`的代价要小；并且状态都是记录在`Volcano`调度内部，减少了与`kube-apiserver`的通信。但目前`Volcano`调度器仅使用了状态的部分功能，比如现在的`preemption/reclaim`仅会驱逐`Running`状态下的`Pod`；这主要是由于分布式系统中很难做到完全的状态同步，在驱逐`Binding`和`Bound`状态的`Pod`会有很多的状态竞争。

## Volcano自定义资源

*  `Pod`组（`PodGroup`）：`Pod`组是`Volcano`自定义资源类型，代表一组强关联`Pod`的集合，主要用于批处理工作负载场景，比如`Tensorflow`中的一组`ps`和`worker`。这主要解决了`Kubernetes`原生调度器中单个`Pod`调度的限制。

*   队列（`Queue`）：容纳一组`PodGroup`的队列，也是该组`PodGroup`获取集群资源的划分依据。它允许用户根据业务需求或优先级，将作业分组到不同的队列中。
  ![](../assets/20240420124730.png)

*   作业（`Volcano Job`，简称`vcjob`）：`Volcano`自定义的`Job`资源类型，它扩展了`Kubernetes`的`Job`资源。区别于`Kubernetes Job`，`vcjob`提供了更多高级功能，如可指定调度器、支持最小运行`Pod`数、支持`task`、支持生命周期管理、支持指定队列、支持优先级调度等。`Volcano Job`更加适用于机器学习、大数据、科学计算等高性能计算场景。

### PodGroup 资源组

`PodGroup` 是 `Volcano` 中实现`Gang Scheduling`的核心资源对象，它将一组相关的 `Pod` 视为一个整体进行调度。



#### PodGroup 的作用

1. **整体调度**
   - 确保一组相关的 `Pod` 要么全部调度成功，要么全部不调度
   - 防止部分 `Pod` 调度成功而其他失败导致资源浪费

2. **资源预留**
   - 可以为 `PodGroup` 设置最小成员数（`minMember`）
   - 当可用资源不足以调度最小成员数时，整个组将等待而不是部分调度

3. **状态跟踪**
   - 提供 `PodGroup` 的整体状态信息
   - 包括已调度数量、运行状态等

#### PodGroup 配置示例

下面是一个基本的 `PodGroup` 定义示例：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: tf-training-group
spec:
  minMember: 4  # 最小需要 4 个 Pod 同时调度
  queue: ml-jobs  # 指定队列
  priorityClassName: high-priority  # 指定优先级
  minResources:  # 最小资源需求
    cpu: 8
    memory: 16Gi
    nvidia.com/gpu: 2
```

#### 使用 PodGroup 的方法

1. **直接创建 PodGroup 资源**

   先创建 `PodGroup`，然后在 `Pod` 中引用它：
   ```yaml
   apiVersion: v1
   kind: Pod
   metadata:
     name: tf-worker-1
     annotations:
       volcano.sh/pod-group: "tf-training-group"  # 引用 PodGroup 名称
   spec:
     schedulerName: volcano  # 使用 Volcano 调度器
     containers:
     - name: tensorflow
       image: tensorflow/tensorflow:latest-gpu
   ```

2. **通过 Volcano Job 自动创建**

   `Volcano Job` 会自动创建并管理 `PodGroup`：
   ```yaml
   apiVersion: batch.volcano.sh/v1alpha1
   kind: Job
   metadata:
     name: tensorflow-training
   spec:
     minAvailable: 4
     schedulerName: volcano
     queue: ml-jobs
   ```

#### PodGroup 的实际应用场景

1. **分布式机器学习**
   - 确保参数服务器和工作节点同时启动
   - 避免资源浪费和训练任务失败

2. **大数据处理**
   - 确保`Spark`或`Flink`集群的所有组件同时启动
   - 提高数据处理效率

3. **高性能计算**
   - 为`MPI`等高性能计算任务提供同步启动能力
   - 确保计算节点的一致性

`PodGroup` 是 `Volcano` 实现`Gang Scheduling`的基础，它使得复杂的分布式工作负载可以更可靠地运行在 `Kubernetes` 集群上。


### Queue 资源队列

`Queue`是`Volcano`调度系统中的核心概念，用于管理和分配集群资源。
它充当了资源池的角色，允许管理员将集群资源划分给不同的用户组或应用场景。该自定义资源可以很好地用于多租户场景下的资源隔离。



#### Queue 的作用

1. **资源隔离与划分**
   - 将集群资源划分给不同的用户组或业务线
   - 防止一个应用或用户组消耗过多资源影响其他应用

2. **资源配额与限制**
   - 为队列设置资源上限（`capability`）
   - 控制队列可以使用的最大`CPU`、内存、`GPU`等资源量

3. **优先级和权重管理**
   - 通过`weight`属性设置队列的相对重要性
   - 当资源竞争时，根据权重比例分配资源

4. **资源回收策略**
   - 通过`reclaimable`属性控制队列资源是否可被回收（被其他队列借用）
   - 当集群资源紧张时，决定哪些队列的资源可以被抢占

#### Queue 配置示例

下面是一个定义三个不同队列的示例，分别用于生产、开发和测试环境：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: production
spec:
  weight: 10       # 高权重，资源竞争时获得更多资源
  reclaimable: false  # 资源不可被回收
  capability:
    cpu: 100       # 最多使用 100 核 CPU
    memory: 500Gi  # 最多使用 500Gi 内存
    nvidia.com/gpu: 10  # 最多使用 10 个 GPU

---

apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: development
spec:
  weight: 5        # 中等权重
  reclaimable: true   # 资源可被回收
  capability:
    cpu: 50        # 最多使用 50 核 CPU
    memory: 200Gi  # 最多使用 200Gi 内存

---

apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: testing
spec:
  weight: 2        # 低权重
  reclaimable: true   # 资源可被回收
  capability:
    cpu: 20        # 最多使用 20 核 CPU
    memory: 100Gi  # 最多使用 100Gi 内存
```

#### 使用 Queue 的方法

1. **在 Pod 中指定队列**

   通过注解指定：
   ```yaml
   metadata:
     annotations:
      volcano.sh/queue-name: "production"
   ```

2. **在 PodGroup 中指定队列**

   直接在`spec`中指定：
   ```yaml
   apiVersion: scheduling.volcano.sh/v1beta1
   kind: PodGroup
   metadata:
     name: ml-training
   spec:
     minMember: 5
     queue: production  # 指定使用 production 队列
   ```

3. **在 Job 中指定队列**

   ```yaml
   apiVersion: batch.volcano.sh/v1alpha1
   kind: Job
   metadata:
     name: tensorflow-training
   spec:
     minAvailable: 3
     schedulerName: volcano
     queue: production  # 指定使用 production 队列
   ```

#### Queue 的实际应用场景

1. **多租户环境**
   - 为不同部门或团队创建独立队列
   - 确保每个部门都有公平的资源分配

2. **优先级划分**
   - 为关键业务创建高权重队列
   - 为非关键任务创建可回收队列

3. **资源限制**
   - 防止单个应用消耗过多集群资源
   - 为不同类型的工作负载设置适当的资源上限

`Queue`机制是`Volcano`实现多租户资源管理和公平调度的关键组件，它使得集群管理员可以更精细地控制资源分配策略，提高集群资源利用率和用户满意度。




#### Queue 对象详解

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: default-queue  # 队列名称
  namespace: default   # 命名空间，可选
  labels:              # 标签，可选
    type: production   # 自定义标签
  annotations:         # 注释，可选
    description: "Production workloads queue"  # 自定义注释
spec:
  weight: 1            # 队列权重，影响资源分配优先级，数值越大优先级越高
  capability:          # 队列资源容量限制（上限）
    cpu: 100           # CPU资源上限，单位为核心数
    memory: 100Gi      # 内存资源上限
    nvidia.com/gpu: 4  # GPU资源上限
    huawei.com/npu: 2  # NPU资源上限（如华为Ascend NPU）
    ephemeral-storage: 500Gi  # 临时存储资源上限
  deserved:            # 应得资源量（多队列竞争时的资源分配基准）
    cpu: 80            # 应得的CPU资源量
    memory: 80Gi       # 应得的内存资源量
    nvidia.com/gpu: 3  # 应得的GPU资源量
  guarantee:           # 队列保障资源，即使在资源紧张情况下也会保证分配
    cpu: 50            # 保障的CPU资源量
    memory: 50Gi       # 保障的内存资源量
    nvidia.com/gpu: 2  # 保障的GPU资源量
  minResources:        # 队列最小资源，队列启动时必须满足的最小资源需求
    cpu: 10            # 最小CPU资源量
    memory: 10Gi       # 最小内存资源量
  maxResources:        # 队列最大资源，队列能够使用的最大资源上限
    cpu: 200           # 最大CPU资源量
    memory: 200Gi      # 最大内存资源量
    nvidia.com/gpu: 8  # 最大GPU资源量
  reclaimable: true    # 是否允许回收资源，设为true时允许其他队列在空闲时借用该队列资源
  state: Open          # 队列状态，可选值：Open(开放)、Closed(关闭)、Unknown(未知)
  hierarchy: root.production.team-a  # 层级队列结构，定义队列在层级结构中的位置
  priorityClassName: high-priority   # 优先级类名，引用集群中定义的PriorityClass
  preemptable: true    # 是否允许被抢占，设为true时允许高优先级队列抢占该队列资源
  jobOrderPolicy: FIFO # 作业排序策略，可选值：FIFO(先进先出)、Priority(按优先级)
  timeToLiveSeconds: 3600  # 队列生存时间，超时后自动清理，单位为秒
  resourceLimitPercent: 80  # 资源限制百分比，控制队列可使用的集群资源比例
  podGroupMinAvailable: 2   # PodGroup最小可用数，指定该队列中的PodGroup至少需要多少Pod可用
  shareWeight: 5       # 共享权重，影响队列在共享资源时的优先级
```


##### 三级资源配置机制

`Volcano`的`Queue`资源对象采用了一个灵活的三级资源配置机制，这三个级别分别是：`capability`（资源上限）、`deserved`（应得资源）和`guarantee`（保障资源）。这种设计允许集群管理员精细控制资源分配，特别适合多租户环境下的资源管理。

**1. capability（资源上限）**

**定义**：队列能够使用的资源上限，队列中的所有作业使用的资源总和不能超过这个上限。

**特点**：

- 代表队列能够使用的最大资源量
- 设置了资源使用的硬限制，防止单个队列过度消耗集群资源
- 可以针对多种资源类型设置（`CPU`、内存、`GPU`等）

**示例场景**： 假设一个生产队列设置了`capability.cpu=100`，那么即使集群有更多空闲资源，该队列中的所有作业使用的`CPU`总和也不能超过`100`核。

**2. deserved（应得资源）**

**定义**：队列在资源竞争情况下应该获得的资源量，是资源分配和回收的基准线。

**特点**：

- 当集群资源充足时，队列可以使用超过`deserved`的资源（但不超过`capability`）
- 当集群资源紧张时，超过`deserved`的资源可能被回收给其他队列使用
- 是资源借用和回收机制的核心参考值

**配置建议**：

- 在同级队列场景下，所有队列的`deserved`值总和应等于集群总资源
- 在层级队列场景下，子队列的`deserved`值总和应等于父队列的`deserved`值

**示例场景**： 假设队列`A`设置了`deserved.cpu=80`，当资源充足时，它可以使用多达`100`核（`capability`上限）；但当资源紧张时，它只能保证获得`80`核，超出部分可能被回收。当资源极度紧张时，会保证后续介绍的队列`guarantee`资源，

**3. guarantee（保障资源）**

**定义**：队列被保证能够使用的最小资源量，即使在集群资源紧张的情况下也不会被回收。

**特点**：

- 提供了资源使用的最低保障
- 这部分资源专属于该队列，不会被其他队列借用或抢占
- 即使在资源紧张的情况下，调度器也会确保队列能获得这些资源

**示例场景**： 假设关键业务队列设置了`guarantee.cpu=50`，即使集群资源非常紧张，该队列也能保证获得`50`核CPU资源用于运行关键业务。

**三者之间的关系**

1. **资源层级关系：guarantee ≤ deserved ≤ capability**
- `guarantee`是最低保障
- `deserved`是正常情况下（资源不是极度紧张情况下）应得的资源
- `capability`是最高上限

2. **资源分配优先级**：
- 首先保证所有队列的`guarantee`资源
- 然后按照`deserved`值和权重分配剩余资源
- 最后允许队列使用空闲资源，但不超过`capability`

3. **资源回收顺序**：

    1. 首先回收超出`capability`的资源
    - 这种情况通常不会发生，因为调度器会确保队列使用的资源不超过`capability`上限

    2. 然后回收超出`deserved`但未超出`capability`的资源
    - 当资源紧张时，队列使用的超过`deserved`值的资源可能被回收
    - 这部分资源被视为"借用"的资源，在资源紧张时需要"归还"

    3. 最后考虑回收超出`guarantee`但未超出`deserved`的资源
    - 只有在极度资源紧张的情况下，且有更高优先级的队列需要资源时
    - 这种回收通常通过抢占（`preemption`）机制实现，而不是简单的资源回收

    4. `guarantee`资源永远不会被回收
    - `guarantee`资源是队列的最低保障，即使在极度资源紧张的情况下也不会被回收
    - 这是保证关键业务稳定运行的基础

##### 资源抢占机制

在`Volcano`中，队列的资源抢占（强占）机制主要基于`priorityClassName`属性配置，而不是`weight`属性。这两个属性在资源管理中有不同的作用。

**1. priorityClassName与资源抢占**

**定义**：`priorityClassName`是`Queue`对象中用于定义队列优先级的属性，它直接关联到`Kubernetes`的`PriorityClass`资源。

**特点**：

- 当集群资源紧张时，高优先级队列可以抢占低优先级队列的资源
- 抢占决策主要基于队列的`priorityClassName`所指定的优先级值
- 优先级值越高的队列可以抢占优先级值较低的队列资源

**工作原理**：

- 每个`priorityClassName`对应一个整数值，这个值在`PriorityClass`资源中定义
- 调度器在资源紧张时，会比较不同队列的优先级值
- 高优先级队列的作业可以抢占低优先级队列中的作业资源

**抢占条件**：

- 被抢占队列的`preemptable`属性必须设置为`true`
- 抢占通常只发生在资源极度紧张且无法满足高优先级队列需求的情况下

**2. weight与资源分配**

**定义**：`weight`属性主要用于正常资源分配过程中的权重计算。

**特点**：

- `weight`影响队列在正常资源分配过程中的权重
- 当有多个队列竞争资源但资源足够分配时，`weight`值较高的队列会获得更多资源
- 这主要应用于`deserved`资源的分配过程

**非抢占性质**：

- `weight`不直接触发资源抢占
- 它只影响资源分配的比例，而不会导致已分配资源的重新分配

**3. 两者的区别与联系**

**作用时机不同**：

- `priorityClassName`在资源紧张需要抢占时起作用
- `weight`在正常资源分配过程中起作用

**影响方式不同**：

- `priorityClassName`可能导致已运行作业被终止（抢占）
- `weight`只影响新资源的分配比例，不会终止已运行的作业

**配合使用**：

- 在完整的资源管理策略中，这两个属性通常配合使用
- 高优先级队列通常也会设置较高的`weight`值
- 但它们解决的是不同的资源管理问题

**4. 实际应用示例**

假设有三个队列：

1. **关键业务队列**：
   ```yaml
   priorityClassName: high-priority  # 对应优先级值1000
   weight: 10
   preemptable: false  # 不允许被抢占
   ```

2. **常规业务队列**：
   ```yaml
   priorityClassName: normal-priority  # 对应优先级值500
   weight: 5
   preemptable: true  # 允许被抢占
   ```

3. **批处理队列**：
   ```yaml
   priorityClassName: low-priority  # 对应优先级值100
   weight: 2
   preemptable: true  # 允许被抢占
   ```

**资源分配与抢占行为**：

- 在资源充足时，三个队列按照`10:5:2`的比例分配资源（基于`weight`）
- 在资源紧张时，关键业务队列可以抢占常规业务队列和批处理队列的资源（基于`priorityClassName`）
- 常规业务队列可以抢占批处理队列的资源，但不能抢占关键业务队列的资源

### Job 资源任务

`Volcano Job`（简称 `vcjob`）是 `Volcano` 提供的一种高级作业资源类型，扩展了 `Kubernetes` 原生的 `Job` 资源，为高性能计算和批处理场景提供了更丰富的功能。



#### Job 的作用

1. **多任务类型支持**
   - 支持在一个作业中定义多种不同类型的任务（`task`）
   - 每种任务类型可以有不同的镜像、资源需求和副本数

2. **生命周期管理**
   - 支持在作业生命周期的不同阶段执行特定命令
   - 包括启动前、运行中、完成后等阶段

3. **高级调度策略**
   - 支持指定最小可用数量（`minAvailable`）
   - 支持指定队列、优先级和调度策略

4. **容错和恢复机制**
   - 提供多种重启策略（`RestartPolicy`）
   - 支持在任务失败时的不同处理方式

#### Volcano Job 配置示例

下面是一个`TensorFlow`分布式训练任务的`Volcano Job`配置示例：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: tensorflow-training
spec:
  minAvailable: 3
  schedulerName: volcano
  queue: ml-jobs
  policies:
  - event: PodEvicted
    action: RestartJob
  - event: PodFailed
    action: RestartJob
  tasks:
  - replicas: 1
    name: ps
    template:
      spec:
        containers:
        - image: tensorflow/tensorflow:latest
          name: tensorflow
          command: ["python", "/app/ps.py"]
          resources:
            requests:
              cpu: 2
              memory: 4Gi
  - replicas: 2
    name: worker
    template:
      spec:
        containers:
        - image: tensorflow/tensorflow:latest-gpu
          name: tensorflow
          command: ["python", "/app/worker.py"]
          resources:
            requests:
              cpu: 4
              memory: 8Gi
              nvidia.com/gpu: 1
```

#### Volcano Job 的特性

1. **多任务类型**
   - 在上面的示例中，定义了两种任务类型：`ps`（参数服务器）和 `worker`（工作节点）
   - 每种类型有不同的副本数和资源需求

2. **事件处理策略**
   - 定义了当 `Pod` 被驱逐或失败时重启整个作业的策略
   - 可以根据不同事件类型执行不同的操作

3. **队列和调度器指定**
   - 指定使用 `volcano` 调度器和 `ml-jobs` 队列
   - 确保作业在正确的资源池中运行

#### Volcano Job 的实际应用场景

1. **分布式机器学习**
   - `TensorFlow`、`PyTorch` 等分布式训练任务
   - 支持参数服务器和工作节点的协调调度

2. **大数据处理**
   - `Spark`、`Flink` 等大数据处理框架
   - 支持`Master`和`Worker`节点的组织管理

3. **MPI 并行计算**
   - 高性能计算和科学模拟
   - 支持多节点协同计算

`Volcano Job` 为复杂的分布式工作负载提供了完整的生命周期管理和调度能力，是 `Volcano` 系统中最强大的资源类型之一。



## 参考资料
- https://volcano.sh/
- https://ericam.top/posts/understand-volcano-scheduler-from-zero/