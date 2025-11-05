---
slug: "/cloud-native/volcano-scheduler-actions"
title: "Volcano Actions详解"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "Actions", "调度器", "enqueue", "allocate", "backfill", "preempt", "reclaim", "shuffle", "资源调度", "优先级抢占", "资源回收", "碎片资源", "负载均衡", "调度流程", "predicateErrorCache", "Gang调度"
  ]
description: "深入解析Volcano调度器的6个核心Actions（enqueue、allocate、backfill、preempt、reclaim、shuffle）的工作原理、执行流程和配置方法，涵盖任务入队、资源分配、碎片资源利用、同队列优先级抢占、跨队列资源回收、负载重平衡等关键调度机制，为构建高效的批处理和AI训练调度系统提供完整的技术指南。"
---

`Actions`（动作）定义了调度器的工作流程和执行顺序。
目前`Volcano`提供了`5`个`Actions`：`enqueue`、`allocate`、`backfill`、`preempt`和`reclaim`。这些动作将按照定义的顺序执行。在`Volcano`的新版本中，可能会有增加新的动作，让我们逐一解释各个动作的作用：

## 1. enqueue（入队）

**主要功能**：将新提交的任务放入调度队列，并检查任务是否满足调度条件。

**工作原理**：
- 创建任务和队列的优先级队列，按照调度策略中定义的顺序处理
- 检查`PodGroup`是否满足最小成员数要求
- 将符合条件的`Job`状态从`Pending`更新为`Inqueue`
- 更新`PodGroup`的状态为`PodGroupInqueue`，表示已准备好被调度

**示例场景**：

当一个要求至少三个`Pod`同时运行的`TensorFlow`训练任务被提交时，`enqueue`动作会检查是否有足够的资源来运行这些`Pod`，如果有，则将其标记为可调度。


**注意事项**：`enqueue action` 是不可省略的核心组件，原因如下：

1. **调度流程的入口点**：
- `enqueue`是整个调度流程的第一步，负责将任务从"未调度"状态转移到"可调度"状态
- 如果没有`enqueue`，新提交的任务将无法进入调度队列，调度器将无法感知这些任务的存在

2. **基础验证机制**：
- `enqueue` 执行关键的前置检查，如验证`PodGroup`是否满足最小成员数要求
- 它确保只有满足基本条件的任务才能进入调度流程，避免无效调度

3. **默认配置的一部分**：
- 在 `Volcano` 的默认配置中，`enqueue`总是作为第一个 `action`存在
- 即使在自定义配置中不显式指定，系统也会使用内置的`enqueue`逻辑


## 2. allocate（分配）

**主要功能**：为队列中的任务分配资源，并将它们调度到合适的节点上。

**工作原理**：
- 根据队列权重和任务优先级对任务进行排序
- 使用插件对任务进行过滤和打分
  - **过滤策略（Predicates）**：
    - 资源匹配过滤：检查节点是否有足够的`CPU`、内存、`GPU`等资源
    - 节点亲和性过滤：根据`Pod`的`nodeAffinity`设置过滤节点
    - 污点容忍过滤：检查任务是否能容忍节点上的污点（`Taints`）
    - `PodGroup`约束过滤：检查是否有足够的资源同时运行`PodGroup`中的所有`Pod`
    - 自定义过滤器：通过`predicates`插件实现的特定过滤逻辑
  - **打分策略（Scoring）**：
    - 节点资源打分：包括`leastrequested`（选择资源使用率低的节点）、`mostrequested`（选择资源使用率高的节点）和`balancedresource`（平衡各类资源使用）
    - 节点亲和性打分（`nodeaffinity`）：根据节点亲和性规则给节点打分
    - `Pod`间亲和性打分（`podaffinity`）：考虑`Pod`之间的亲和性和反亲和性
    - 污点容忍打分（`tainttoleration`）：根据`Pod`对节点污点的容忍度打分
    - 镜像本地性打分（`imagelocality`）：优先选择已经有所需镜像的节点
    - `Pod`拓扑分布打分（`podtopologyspread`）：实现`Pod`在拓扑域之间的均匀分布
    - 任务拓扑打分（`task-topology`）：通过注解定义任务间的亲和性和反亲和性，优化分布式任务的调度
- 为符合条件的任务分配资源并绑定到得分最高的节点

**示例场景**：

当多个队列中有多个任务时，`allocate`动作会首先将资源分配给高权重队列中的高优先级任务，然后再考虑低权重队列中的任务。


**参数说明**：

| 参数名 | 默认值 | 说明 |
| --- | --- | --- |
| `predicateErrorCacheEnable` | `true` | 是否启用谓词错误缓存。启用后，调度器会缓存节点过滤阶段的错误信息，避免重复计算，提高调度效率。 |

**参数示例**：

`allocate`动作的参数需要在`Volcano`调度器的`ConfigMap`中配置。具体来说，这些参数应该在`volcano-scheduler.conf`文件的`actions.allocate`部分中配置。以下是一个配置示例：

```yaml
# volcano-scheduler-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: volcano-scheduler-configmap
  namespace: volcano-system
data:
  volcano-scheduler.conf: |
    actions: "enqueue,allocate,preempt,reclaim,backfill"
    tiers:
    - plugins:
      - name: priority
      - name: gang
      - name: conformance
    - plugins:
      - name: drf
      - name: predicates
      - name: proportion
      - name: nodeorder
    configurations:
    - name: allocate
      arguments:
        predicateErrorCacheEnable: true
```



**注意事项**：

1. 谓词错误缓存（`Predicate Error Cache`）是一种优化机制，可以避免对已知不满足条件的节点重复执行过滤操作，从而提高调度效率。
2. 在大规模集群中，启用此功能可以显著减少调度延迟，特别是当集群中有大量节点且调度频繁时。
3. 在某些特殊场景下（如节点状态快速变化的环境），可能需要禁用此功能以确保调度决策基于最新状态。

**最佳实践**：

1. 在大多数情况下，建议保持谓词错误缓存启用（默认设置）。
2. 如果观察到由于缓存导致的调度异常（例如，节点状态变化后调度决策不准确），可以考虑禁用此功能。
3. 在调试调度问题时，临时禁用此功能可能有助于排查问题。


**注意事项**：在 `Volcano` 调度器中，`allocate` `action`也是**不可省略**的核心组件，原因如下：

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
   - 这些插件通过**过滤**和**打分**机制帮助`allocate`做出最优的调度决策

4. **调度流程的核心环节**：
   - 在典型的调度流程中，`enqueue`将任务放入队列，而`allocate`则负责实际分配资源
   - 这两个`action`构成了调度的基本闭环，缺一不可



## 3. backfill（回填）

`backfill`（回填）是 `Volcano` 调度流程中非常重要的一个补充环节，其主要作用是在 `allocate` 完成主资源分配后，进一步挖掘和利用集群中的碎片资源。通常情况下，`allocate`负责为大部分高优先级或核心任务分配资源，而 `backfill` 主要针对那些由于资源碎片化而无法被 `allocate` 充分利用的节点，调度小型或低优先级任务，从而提升整体资源利用率。

**backfill 在调度流程中的定位**：
- `Volcano`的调度流程并不是"一次性"分配完所有资源、所有任务就结束。调度器会不断循环执行`actions`，每一轮都会尝试调度新的任务和处理资源变化。
- `enqueue` 负责将任务放入调度队列，`allocate` 负责进行主要的资源分配。
- 当 `allocate` 无法满足所有任务需求，或集群中出现大量碎片资源时，`backfill` 会被触发，专门调度适合这些碎片资源的小任务。
- 这使得调度流程形成了"主分配 + 回填补充"的高效闭环。

**插件系统与 backfill 的配合**：
- 大多数调度插件（如 `drf`、`predicates`、`nodeorder` 等）虽然主要在 `allocate` 阶段发挥作用，但 `backfill` 阶段同样会复用这些插件的过滤和打分机制，确保回填任务的调度决策依然科学合理。
- 某些插件参数（如谓词错误缓存）可以显著提升 `backfill` 的调度效率。

**典型应用场景**：
- 当集群中有节点仅剩少量 `CPU` 和内存时，这些资源不足以运行大型任务，但通过 `backfill`，可以将这些资源分配给小型批处理任务或低优先级作业，避免资源浪费。

**主要功能**：利用集群中的空闲资源来运行小型或低优先级的任务，提高资源利用率。

**工作原理**：
- 在主要的资源分配完成后执行
- 寻找集群中的碎片资源（小块未使用的资源）
- 将这些资源分配给可以快速完成的小任务

**示例场景**：

当集群中有一些节点只剩下少量的`CPU`和内存时，这些资源可能不足以运行大型任务，但`backfill`动作可以将这些资源分配给小型的批处理任务。

**参数说明**：

| 参数名 | 默认值 | 说明 |
| --- | --- | --- |
| `predicateErrorCacheEnable` | `true` | 是否启用谓词错误缓存。启用后，调度器会缓存节点过滤阶段的错误信息，避免重复计算，提高调度效率。 |

**参数示例**：

`backfill`动作的参数需要在`Volcano`调度器的`ConfigMap`中配置。具体来说，这些参数应该在`volcano-scheduler.conf`文件的`actions.backfill`部分中配置。以下是一个配置示例：

```yaml
# volcano-scheduler-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: volcano-scheduler-configmap
  namespace: volcano-system
data:
  volcano-scheduler.conf: |
    actions: "enqueue,allocate,preempt,reclaim,backfill"
    tiers:
    - plugins:
      - name: priority
      - name: gang
      - name: conformance
    - plugins:
      - name: drf
      - name: predicates
      - name: proportion
      - name: nodeorder
    configurations:
    - name: backfill
      arguments:
        predicateErrorCacheEnable: true
```

**注意事项**：

1. `backfill`动作与`allocate`动作类似，也支持谓词错误缓存功能，但它专注于利用集群的**碎片资源**。
2. 在资源紧张的集群中，启用此功能可以提高资源利用率，尤其是当有大量小型任务需要调度时。
3. 如果集群中的节点状态频繁变化，禁用此功能可能会带来更准确的调度结果，但代价是调度效率的降低。

**最佳实践**：

1. 在资源利用率需要提高的场景中，建议保持`backfill`动作启用。
2. 对于具有大量小型任务（如数据处理、批量任务）的工作负载，`backfill`可以显著提高资源利用率。
3. 对于需要精确资源预留的关键应用，可能需要谨慎使用`backfill`，以避免资源碎片化影响主要工作负载的性能。

## 4. preempt（抢占）

**主要功能**：当高优先级任务无法获得足够资源时，从低优先级任务中抢占资源（仅针对同队列任务）。

**工作原理**：
- 识别高优先级但无法调度的任务（首先任务的`PodGroup`需要处于`Inqueue`状态）
- 查找可以被抢占的低优先级任务
- 终止被选中的低优先级任务，释放其资源
- 将释放的资源分配给高优先级任务


抢占行为主要由以下机制控制：

1. **Pod的Preemptable标记**：通过`volcano.sh/preemptable`注解控制`Pod`是否可被抢占
   - 注意：默认值为`true`（可被抢占）
   - 设置为`false`则该`Pod`不会被抢占

2. **Kubernetes PriorityClass**：定义任务的优先级
   - 高优先级任务可以抢占低优先级任务
   - 优先级通过`priorityClassName`字段指定

3. **Plugin的Preemptable函数**：各插件（如`priority`、`conformance`、`gang`等）通过实现`PreemptableFn`来决定哪些任务可被抢占
   - 多个插件的结果取**交集**
   - 只有所有启用的插件都认为可抢占的任务才会被抢占

4. **Victim选择策略**：通过`BuildVictimsPriorityQueue`实现
   - 同一`Job`内的任务：按`Task`优先级从低到高抢占
   - 不同`Job`的任务：按`Job`优先级从低到高抢占
   - 不同`Queue`的任务：按`VictimQueueOrderFn`排序

**注意**：`Volcano`的抢占策略是**基于优先级的确定性选择**，而非随机选择。系统会优先抢占优先级最低的任务，确保高优先级任务优先保障。


**示例场景**：

当一个生产环境的关键任务（高优先级）需要运行，但集群资源已被开发环境的任务（低优先级）占用时，`preempt`动作会终止部分开发环境的任务，将资源让给生产环境的关键任务。


**配置示例**：

`preempt`动作的配置主要包括启用`action`和配置相关`plugin`。以下是一个完整的配置示例：

```yaml
actions: "enqueue, allocate, backfill, preempt"
tiers:
- plugins:
  - name: priority
  - name: conformance
  - name: overcommit
- plugins:
  - name: drf
  - name: gang
  - name: predicates
  - name: proportion
  - name: nodeorder
  - name: binpack
```

**工作流程**：

根据源码分析，抢占的关键流程如下：

1. **识别抢占者（Preemptor）**：调度器便利所有的任务，识别出因资源不足而无法调度的高优先级任务（通过`JobStarving`方法判断）。并将任务按照队列为维度进行归并，后续按照队列维度进行遍历处理。

2. **检查抢占资格**：
   - 检查任务的`PreemptionPolicy`是否为`Never`
   - 检查任务是否有`NominatedNodeName`且该节点是否仍然不可调度

3. **筛选候选节点**：
   - 过滤掉`UnschedulableAndUnresolvable`状态的节点
   - 对候选节点执行`Predicate`检查

4. **查找可抢占任务（Victims）**：
   - 遍历节点上的所有任务，应用`filter`函数过滤
   - 调用各插件的`PreemptableFn`，取所有插件结果的交集
   - 只有标记为`volcano.sh/preemptable: "true"`（或未标记，默认为`true`）的`Pod`才可被抢占
   - `BestEffort Pod`不能抢占非`BestEffort Pod`

5. **选择Victim**：
   - 通过`BuildVictimsPriorityQueue`构建优先级队列
   - 同一`Job`内：按`Task`优先级从低到高抢占
   - 不同`Job`：按`Job`优先级从低到高抢占
   - 不同`Queue`：按`VictimQueueOrderFn`排序

6. **执行抢占**：
   - 依次驱逐（`Evict`）选中的低优先级任务
   - 释放的资源累加到节点的`FutureIdle`中
   - 当资源足够或队列可分配时停止抢占

7. **Pipeline调度**：
   - 将高优先级任务`Pipeline`到目标节点
   - 更新任务状态为`Pipelined`



## 5. reclaim（回收）

**主要功能**：从超出其公平份额的队列中回收资源，并将其重新分配给其他队列（仅针对跨队列任务的资源回收，同队列不生效）。

**工作原理**：
- 计算每个队列的公平份额和实际使用情况
- 识别超额使用资源的队列
- 从这些队列中选择可回收的任务
- 终止这些任务以释放资源
- 只回收标记为`reclaimable: true`的队列的资源

**Preempt vs Reclaim 核心差别**

| 维度 | Preempt Action | Reclaim Action |
| --- | --- | --- |
| 作用范围 | 同队列内不同`Job`之间 | 跨队列资源回收 |
| 触发条件 | `Job`资源不足（`JobStarving`） | `Job`资源不足 + 队列未超额 |
| 抢占对象 | 同队列的低优先级`Job` | 其他队列的可回收资源 |
| 关键过滤 | `job.Queue == preemptorJob.Queue` | `j.Queue != job.Queue` |
| 队列控制 | 无需队列配置 | 需要`reclaimable: true` |
| 支持场景 | 1. 队列内`Job`优先级; 2. 同`Job`内`Task`优先级 | 队列间资源公平分配 |

**示例场景**：

当集群中有多个队列，每个队列都有权重设置（如生产队列权重为`60%`，开发队列为`30%`，测试队列为`10%`）。如果开发队列使用了超过`50%`的集群资源，而生产队列需要更多资源时，`reclaim`动作会从开发队列中回收资源。

**注意事项**：

为什么队列设置了 `Quota` 还会出现超额使用的情况？

`Volcano` 的资源分配和回收机制采用了"宽松分配+周期性回收"的设计，主要原因有：

- **宽松分配**：在实际调度时，为了提升资源利用率和调度灵活性，调度器可能允许某些队列临时超出其配额（`Quota`）使用资源，尤其是在集群资源充足、其他队列没有资源需求时。
- **动态变化**：集群资源和队列需求是动态变化的，某一时刻资源分配合理，但随着新任务加入或资源需求变化，某些队列可能会暂时超额。
- **周期性回收**：`reclaim` 动作就是为了解决上述问题而设计的。它会定期检查所有队列的资源使用情况，一旦发现某队列超出其公平份额，就会触发资源回收，将多占用的资源释放出来，分配给资源不足的队列。

`Volcano` 的 `reclaim`（回收）操作本质上就是强制终止（`Evict/Kill`）超额队列中的部分任务的 `Pod`，以释放资源并将其分配给其他资源不足或高优先级的队列。被回收的任务如果有重试或重调度机制，后续可能会被重新调度到集群中。

## 6. shuffle（重新分配）

**主要功能**：选择并驱逐正在运行的任务，以实现资源重新分配或负载均衡。

**工作原理**：
- 收集所有正在运行的任务
- 通过插件定义的策略选择需要驱逐的任务
- 驱逐选中的任务，释放其资源
- 这些任务将在后续调度周期中被重新调度

**示例场景**：

当集群中的负载分布不均衡时，例如某些节点资源利用率非常高而其他节点却相对空闲，`shuffle`动作可以驱逐部分任务，让它们在下一个调度周期重新分配到资源利用率较低的节点上，从而实现负载均衡。

**注意事项**：

1. `shuffle`动作会导致任务被驱逐并重新调度，这可能会对应用程序造成短暂的中断。
2. **需要配合相应的插件（如`victimtasks`）来定义驱逐策略，决定哪些任务应该被驱逐。**
3. 对于状态敏感或需要长时间运行的应用，应谨慎使用`shuffle`动作，或者确保这些应用有适当的状态保存和恢复机制。

**最佳实践**：

1. 将`shuffle`动作放在调度器配置的后面，确保它只在其他调度策略（如`allocate`、`backfill`）无法解决问题时才会被触发。
2. 为需要保护的关键任务添加适当的标签或注解，确保它们不会被`shuffle`动作驱逐。
3. 在资源利用率不均衡或需要定期重新平衡集群负载的场景中，`shuffle`动作可以提供显著的效益。

