---
slug: "/cloud-native/volcano-scheduler-actions-plugins"
title: "Volcano调度器Actions & Plugins"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "Actions", "Plugins", "调度器", "Job", "Pod", "PodGroup", "RestartJob", "CompleteJob", "AbortJob", "生命周期管理", "事件处理"
  ]
description: "本文详细介绍了Volcano调度器中的Actions和Plugins机制，包括各种Actions的作用、应用场景和配置示例，以及如何通过这些机制实现灵活的任务生命周期管理和事件处理。"
---


`Volcano`调度器是一个为高性能计算、机器学习和批处理工作负载设计的`Kubernetes`调度器。它的核心功能之一是通过可插拔的`Actions`和`Plugins`机制来实现灵活的调度策略。本文将通俗地介绍这些机制，帮助你更好地理解和使用`Volcano`调度器。

![](../assets/zh-cn_image_0000002065638558.png)

## 调度器配置示例

以下是一个典型的`Volcano`调度器配置示例：

```yaml
actions: "enqueue,allocate,backfill,preempt,reclaim"
tiers:
- plugins:
  - name: priority
  - name: gang
  - name: conformance
- plugins:
  - name: drf
  - name: predicates
  - name: proportion
  - name: resourcequota
  - name: nodeorder
  - name: binpack
```

这个配置定义了调度器的工作流程（`Actions`）和决策机制（`Plugins`）。


### 为什么使用多层级(tiers)的数组结构

1. **优先级分层执行**：
   - 不同层级（`tier`）的插件有着严格的优先级顺序
   - 高层级（第一个数组）中的插件会先执行，其决策结果会影响或限制低层级插件的决策空间
   - 只有当高层级的所有插件都允许一个调度决策时，才会继续执行低层级的插件

2. **决策流程的过滤机制**：
   - 第一层级的插件（如 `priority`、`gang`、`conformance`）主要负责基本的筛选和约束
   - 第二层级的插件（如 `drf`、`predicates`、`proportion` 等）负责更细粒度的资源分配和优化
   - 这种分层设计形成了一种"粗筛-细筛"的决策流水线

3. **解决冲突的明确机制**：
   - 当不同插件之间可能产生冲突决策时，层级结构提供了明确的优先级规则
   - 例如，如果 `gang` 插件（第一层）决定某个任务不能被调度（因为它的所有成员无法同时运行），那么即使 `binpack` 插件（第二层）认为该任务可以被有效打包，该任务也不会被调度

### 与单一数组相比的优势

如果所有插件都放在一个扁平的数组中，调度器将面临以下问题：

1. **无法表达优先级关系**：
   - 所有插件将被视为同等重要，难以表达某些基本约束（如成组调度）应该优先于优化决策（如资源打包）
   
2. **决策冲突难以解决**：
   - 没有明确的机制来解决插件之间的冲突，可能导致不一致或不可预测的调度行为
   
3. **调度效率降低**：
   - 分层执行允许在早期阶段快速过滤掉不符合基本条件的调度决策，避免不必要的计算




## Volcano 中的 Actions

`Actions`定义了调度器的工作流程和执行顺序。在上面的配置中，我们定义了五个动作：`enqueue`、`allocate`、`backfill`、`preempt`和`reclaim`。这些动作将按照定义的顺序执行。

让我们逐一解释各个动作的作用：

### 1. enqueue（入队）

**作用**：将新提交的任务放入调度队列，并检查任务是否满足调度条件。

**工作原理**：
- 检查`PodGroup`是否满足最小成员数要求
- 检查队列是否有足够的配额
- 将符合条件的任务标记为“可调度”状态

**示例**：当一个要求至少三个`Pod`同时运行的`TensorFlow`训练任务被提交时，`enqueue`动作会检查是否有足够的资源来运行这些`Pod`，如果有，则将其标记为可调度。


**注意**：`enqueue action` 是不可省略的核心组件，原因如下：

1. **调度流程的入口点**：
- `enqueue`是整个调度流程的第一步，负责将任务从"未调度"状态转移到"可调度"状态
- 如果没有`enqueue`，新提交的任务将无法进入调度队列，调度器将无法感知这些任务的存在

2. **基础验证机制**：
- `enqueue` 执行关键的前置检查，如验证`PodGroup`是否满足最小成员数要求
- 它确保只有满足基本条件的任务才能进入调度流程，避免无效调度

3. **默认配置的一部分**：
- 在 `Volcano` 的默认配置中，`enqueue`总是作为第一个 `action`存在
- 即使在自定义配置中不显式指定，系统也会使用内置的`enqueue`逻辑


### 2. allocate（分配）

**作用**：为队列中的任务分配资源，并将它们调度到合适的节点上。

**工作原理**：
- 根据队列权重和任务优先级对任务进行排序
- 使用插件对任务进行过滤和打分
- 为符合条件的任务分配资源并绑定到节点

**示例**：当多个队列中有多个任务时，`allocate`动作会首先将资源分配给高权重队列中的高优先级任务，然后再考虑低权重队列中的任务。


**注意**：在 `Volcano` 调度器中，`allocate` `action` 是**不可省略**的核心组件，原因如下：

1. **核心调度功能的实现者**：
   - `allocate` 是实际执行资源分配和`Pod`绑定的关键`action`
   - 它负责将已入队的任务分配到具体的节点上，是调度过程的核心步骤
   - 如果没有 `allocate`，任务会停留在队列中而不会被实际调度执行

2. **调度决策的执行者**：
   - 虽然其他`actions`（如`backfill`、`preempt`）也可以执行调度，但它们都是针对特殊场景的补充
   - `allocate` 处理常规的资源分配，是最基本的调度机制
   - 其他`actions`通常在`allocate`无法满足需求时才会被触发

3. **插件系统的主要应用点**：
   - 大多数调度插件（如`drf`、`predicates`、`nodeorder`等）主要在`allocate`阶段发挥作用
   - 这些插件通过过滤和打分机制帮助`allocate`做出最优的调度决策

4. **调度流程的核心环节**：
   - 在典型的调度流程中，`enqueue`将任务放入队列，而`allocate`则负责实际分配资源
   - 这两个`action`构成了调度的基本闭环，缺一不可



### 3. backfill（回填）

**作用**：利用集群中的空闲资源来运行小型或低优先级的任务，提高资源利用率。

**工作原理**：
- 在主要的资源分配完成后执行
- 寻找集群中的碎片资源（小块未使用的资源）
- 将这些资源分配给可以快速完成的小任务

**示例**：当集群中有一些节点只剩下少量的CPU和内存时，这些资源可能不足以运行大型任务，但`backfill`动作可以将这些资源分配给小型的批处理任务。

### 4. preempt（抢占）

**作用**：当高优先级任务无法获得足够资源时，从低优先级任务中抢占资源。

**工作原理**：
- 识别高优先级但无法调度的任务
- 查找可以被抢占的低优先级任务
- 终止被选中的低优先级任务，释放其资源
- 将释放的资源分配给高优先级任务

**示例**：当一个生产环境的关键任务（高优先级）需要运行，但集群资源已被开发环境的任务（低优先级）占用时，`preempt`动作会终止部分开发环境的任务，将资源让给生产环境的关键任务。

### 5. reclaim（回收）

**作用**：从超出其公平份额的队列中回收资源，并将其重新分配给其他队列。

**工作原理**：
- 计算每个队列的公平份额和实际使用情况
- 识别超额使用资源的队列
- 从这些队列中选择可回收的任务
- 终止这些任务以释放资源

**示例**：当集群中有多个队列，每个队列都有权重设置（如生产队列权重为60%，开发队列为30%，测试队列为10%）。如果开发队列使用了超过50%的集群资源，而生产队列需要更多资源时，`reclaim`动作会从开发队列中回收资源。

## Volcano 中的 Plugins

`Plugins`是`Volcano`调度器的决策模块，它们在不同的调度阶段提供特定的功能。在上面的配置中，插件被组织成两个层级（`tiers`），每个层级包含多个插件。层级的概念允许插件按照优先级顺序执行，高层级的插件优先级高于低层级的插件。

让我们逐一解释这些插件的作用：

### 第一层级插件

#### 1. priority（优先级）

**作用**：根据任务的优先级对其进行排序，确保高优先级任务先被调度。

**工作原理**：
- 读取任务的`PriorityClass`或优先级注解
- 根据优先级值对任务进行排序
- 高优先级任务在资源分配时会被优先考虑

**示例**：
```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class is used for critical production jobs"
---
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: critical-job
spec:
  priorityClassName: high-priority
  # 其他配置...
```

这个配置将使`critical-job`获得高优先级，在资源竞争时优先被调度。

#### 2. gang（成组）

**作用**：实现成组调度，确保任务的所有成员（Pod）可以同时运行。

**工作原理**：
- 读取任务的`minAvailable`设置
- 检查是否有足够的资源来运行最小所需的Pod数量
- 只有当所有必要的Pod都能被调度时，才会进行调度

**示例**：
```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: distributed-training
spec:
  minAvailable: 4
  tasks:
    - replicas: 1
      name: ps
      template: # Pod模板...
    - replicas: 3
      name: worker
      template: # Pod模板...
```

这个配置要求至少4个Pod（1个ps和3个worker）同时可用才会开始调度。这对于分布式训练等需要多个组件协同工作的任务非常重要。

#### 3. conformance（一致性）

**作用**：确保调度决策符合Kubernetes的标准和约定。

**工作原理**：
- 检查调度决策是否符合Kubernetes的API约定
- 验证资源请求和限制
- 确保与标准Kubernetes调度器的行为兼容

**示例**：这个插件主要在后台工作，确保调度决策符合Kubernetes的规范，通常不需要特定的配置。

### 第二层级插件

#### 1. drf（主导资源公平性）

**作用**：实现主导资源公平性（Dominant Resource Fairness）算法，确保资源在不同队列和任务之间公平分配。

**工作原理**：
- 计算每个任务的主导资源（即任务所需的最多的资源类型）
- 根据主导资源的使用比例对任务进行排序
- 确保所有用户或队列都能获得公平的资源份额

**示例**：当一个任务需要大量的CPU而另一个任务需要大量的内存时，DRF算法会确保两个任务都能获得公平的资源分配，而不是简单地平均分配每种资源。

#### 2. predicates（断言）

**作用**：检查节点是否满足运行特定任务的条件，类似于标准Kubernetes调度器的断言。

**工作原理**：
- 检查节点资源是否满足任务需求
- 检查节点是否满足任务的亲和性、反亲和性要求
- 检查节点标签是否符合任务要求

**示例**：
```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: gpu-job
spec:
  tasks:
    - replicas: 2
      name: gpu-task
      template:
        spec:
          nodeSelector:
            gpu: "true"
          containers:
            - name: gpu-container
              image: nvidia/cuda:latest
              resources:
                limits:
                  nvidia.com/gpu: 1
```

这个配置要求任务只能运行在标记为`gpu=true`的节点上，并且需要GPU资源。`predicates`插件会确保只有满足这些条件的节点才会被选中。

#### 3. proportion（比例）

**作用**：根据队列的权重按比例分配资源，确保资源分配符合预定的比例。

**工作原理**：
- 计算每个队列的目标资源份额（根据权重）
- 监控实际资源使用情况
- 调整资源分配以符合目标比例

**示例**：
```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: production
spec:
  weight: 6
---
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: development
spec:
  weight: 3
---
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: testing
spec:
  weight: 1
```

这个配置定义了三个队列，权重比例为`6:3:1`。`proportion`插件会确保资源分配大致符合这个比例，即生产队列获得`60%`的资源，开发队列获得`30%`，测试队列获得`10%`。

#### 4. resourcequota（资源配额）

**作用**：实现队列级别的资源配额限制，确保队列不会超过其分配的资源上限。

**工作原理**：
- 计算每个队列的资源使用情况
- 检查是否超过配额限制
- 阻止超过配额的资源请求

**示例**：
```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: development
spec:
  weight: 3
  capability:
    cpu: 10
    memory: 20Gi
    nvidia.com/gpu: 2
```

这个配置限制了开发队列最多可以使用10个CPU核心、20GB内存和2个GPU。如果队列中的任务请求超过这些限制，则新的任务将无法被调度。

#### 5. nodeorder（节点排序）

**作用**：为任务选择最适合的节点，基于多种因素对节点进行打分和排序。

**工作原理**：
- 考虑节点的资源利用率
- 考虑任务的亲和性和反亲和性要求
- 考虑节点的标签和条件
- 为每个节点计算分数，选择分数最高的节点

**示例**：当一个任务需要调度到集群中的节点时，`nodeorder`插件会考虑多种因素，如节点的当前负载、资源利用率、与其他任务的亲和性等，然后选择最适合的节点。

#### 6. binpack（装箱）

**作用**：将任务紧密地打包到尽可能少的节点上，提高资源利用率。

**工作原理**：
- 优先选择已经有高资源利用率的节点
- 尽量将任务集中在少数节点上
- 减少空闲节点的数量，提高能源效率

**示例**：当集群中有多个小型任务需要调度时，`binpack`插件会尽量将它们调度到同一个或少数几个节点上，而不是分散到多个节点。这样可以保持更多的节点处于空闲状态，可以关闭这些节点以节省能源，或者用于运行大型任务。

## 总结

`Volcano`调度器的`Actions`和`Plugins`机制提供了强大的灵活性，可以满足各种复杂场景的调度需求。通过合理配置这些机制，可以实现：

1. **公平的资源分配**：确保不同团队和任务类型获得合理的资源份额
2. **高效的资源利用**：通过回填和装箱策略提高集群资源利用率
3. **智能的优先级处理**：确保关键任务在资源紧张时优先获得服务
4. **特殊工作负载的支持**：如机器学习、高性能计算等需要成组调度的任务

对于不同的应用场景，可以通过调整`Actions`的顺序和启用不同的`Plugins`来定制调度器的行为，以满足特定的需求。这种灵活性使`Volcano`成为在Kubernetes上运行复杂工作负载的理想选择。


## 参考资料

- https://volcano.sh/zh/docs/actions
- https://volcano.sh/zh/docs/plugins