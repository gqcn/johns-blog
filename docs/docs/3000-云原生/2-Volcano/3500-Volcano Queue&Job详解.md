---
slug: "/cloud-native/volcano-queue-job"
title: "Volcano Queue&Job详解"
hide_title: true
keywords:
  [
    "Volcano",
    "Queue",
    "Job",
    "云原生",
    "批处理",
    "调度系统",
    "资源管理",
    "多租户",
    "Kubernetes",
    "高性能计算",
    "任务依赖",
    "重试策略",
    "资源隔离",
    "亲和性",
    "队列权重"
  ]
description: "详细介绍Volcano调度系统中Queue和Job两个核心对象的设计与使用，包括资源管理、队列配置、作业定义、重试策略、任务依赖关系等高级特性，帮助用户充分利用Volcano进行高效的批处理任务调度。"
---

本文详细介绍`Volcano`中`Queue`和`Job`核心对象的关键设计以及使用。关于这两个对象的基础介绍，请参考`Volcano`基本介绍章节 [Volcano介绍](./1000-Volcano介绍.md)。

## Queue

`Queue`是`Volcano`调度系统中的核心概念，用于管理和分配集群资源。
它充当了资源池的角色，允许管理员将集群资源划分给不同的用户组或应用场景。该自定义资源可以很好地用于多租户场景下的资源隔离。

该对象的数据结构如下：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: gpu-queue
spec:
  weight: 1                                      # 队列权重，范围1-65535
  priority: 100                                  # 队列优先级
  capability:                                    # 队列资源容量
    cpu: "100"
    memory: "1000Gi"
    nvidia.com/gpu: "10"
  deserved:                                      # 应得资源量
    cpu: "80"
    memory: "800Gi"
    nvidia.com/gpu: "8"
  guarantee:                                     # 资源保障配置
    resource:                                    # 保障的资源量
      cpu: "50"
      memory: "500Gi"
      nvidia.com/gpu: "5"
  reclaimable: true                              # 是否允许资源回收
  parent: "root"                                 # 父队列
  affinity:                                      # 队列亲和性配置
    nodeGroupAffinity:                           # 节点组亲和性
      requiredDuringSchedulingIgnoredDuringExecution:
        - "gpu-nodes"                            # 必须调度到GPU节点
      preferredDuringSchedulingIgnoredDuringExecution:
        - "high-memory-nodes"                    # 优先调度到高内存节点
    nodeGroupAntiAffinity:                       # 节点组反亲和性
      requiredDuringSchedulingIgnoredDuringExecution:
        - "npu-nodes"                            # 不能调度到NPU节点
  extendClusters:                                # 扩展集群配置
    - name: "cluster-1"
      weight: 1
      capacity:                                  # 集群容量
        cpu: "1000"
        memory: "1000Gi"
        nvidia.com/gpu: "20"
```

在该队列对象上，我去掉了没有太大意义的一些配置项，以便更好理解队列功能。去掉的配置项如下：
- 注解上实现的层级队列配置，如：
    ```yaml
    annotations:
      "volcano.sh/hierarchy": "root/eng/prod"
      "volcano.sh/hierarchy-weights": "1/2/8"
    ```
- 仅作队列类型标记使用的`spec.type`配置项，没有实际功能作用。



### 资源管理机制

`Volcano`的`Queue`资源对象采用了一个灵活的三级资源管理机制，这三个级别分别是：`capability`（资源上限）、`deserved`（应得资源）和`guarantee`（保障资源）。这种设计允许集群管理员精细控制资源分配，特别适合多租户环境下的资源管理。

资源管理机制的具体行为取决于使用的调度插件。下面分别介绍 `capacity` 插件和 `proportion` 插件的资源管理机制。

> **注意**：
> - 使用 `capacity` 插件时：`capability`、`deserved`和`guarantee` 三项配置都按预设值严格执行。
> - 使用 `proportion` 插件时：主要使用 `weight` 动态计算 `deserved`，`capability` 和 `guarantee` 仍然有效。
> - 两种插件不能同时启用，需要根据实际需求选择合适的资源管理策略。

#### 使用 capacity 插件的资源管理机制

当启用 `capacity` 插件时，`Queue`的三级资源配置（`capability`、`deserved`、`guarantee`）会严格按照预设值进行资源管理。

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

- 当集群资源充足时(`allocated` < `deserved`)，队列可以使用超过`deserved`的资源（但不超过`capability`）
- 当集群资源紧张时(`allocated` >= `deserved`)，超过`deserved`的资源可能被回收给其他队列使用
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

**示例场景**： 假设关键业务队列设置了`guarantee.cpu=50`，即使集群资源非常紧张，该队列也能保证获得`50`核`CPU`资源用于运行关键业务。



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

#### 使用 proportion 插件的资源管理机制

当启用 `proportion` 插件时，资源管理机制发生了重要变化，主要基于 `weight`（权重）进行动态资源分配。

**核心特点**：

1. **动态 deserved 计算**：`proportion` 插件会忽略队列中预设的 `deserved` 值，而是基于 `weight` 动态计算每个队列的应得资源
2. **权重比例分配**：每个队列的 `deserved` = 集群总资源 × (队列`weight` / 所有队列`weight`总和)
3. **简化配置**：主要依赖 `weight` 和 `capability` 配置，`guarantee` 配置仍然有效

**资源配置字段作用**：

**1. weight（权重）**

**定义**：队列在资源分配中的权重值，用于计算队列应得的资源比例。

**特点**：
- 这是 `proportion` 插件最核心的配置参数
- 权重越大，队列获得的资源比例越高
- 动态计算：`deserved = 总资源 × (队列weight / 总weight)`

**示例**：
```yaml
# 队列A：weight=3，队列B：weight=1
# 假设集群总资源 100 CPU
# 队列A deserved = 100 × (3/4) = 75 CPU
# 队列B deserved = 100 × (1/4) = 25 CPU
```

**2. capability（资源上限）**

在 `proportion` 插件中仍然作为硬限制：
- 队列使用的资源不能超过 `capability` 设置的上限
- 与 `capacity` 插件中的作用相同

**3. guarantee（保障资源）**

在 `proportion` 插件中的作用：
- 仍然提供最低资源保障
- 但由于 `deserved` 是动态计算的，实际效果可能与 `capacity` 插件不同

**资源分配流程**：

1. **第一轮分配**：按权重比例计算每个队列的 `deserved` 资源
2. **约束检查**：确保 `deserved` 不超过队列的 `capability`，不低于 `guarantee`
3. **剩余资源分配**：如果某些队列因 `capability` 限制无法使用全部应得资源，将剩余资源重新按权重分配给其他队列
4. **动态调整**：当集群资源发生变化时，重新计算所有队列的 `deserved` 值

**与 capacity 插件的关键区别**：

| 特性 | capacity 插件 | proportion 插件 |
|------|---------------|-----------------|
| `deserved` 来源 | 队列配置中的固定值 | 基于 `weight` 动态计算 |
| 主要配置参数 | `capability`、`deserved`、`guarantee` | `weight`、`capability`、`guarantee` |
| 资源分配策略 | 静态预分配 | 动态权重分配 |
| 配置复杂度 | 较高（需要精确设置三个资源值） | 较低（主要配置 `weight`） |
| 适用场景 | 需要精确资源控制的环境 | 需要灵活资源分配的环境 |
| 资源利用率 | 较低（预留资源可能闲置） | 较高（动态分配未使用资源） |



### 优先级与权重

`Volcano`队列系统中的`priority`（优先级）和`weight`（权重）是两个不同的概念，它们在资源分配和抢占机制中扮演不同的角色：

**1. priority（优先级）**

**定义**：队列的优先级，用于确定队列间资源分配和抢占的顺序。

**特点**：
- 优先级是绝对的，高优先级队列总是比低优先级队列先获得资源
- 在资源紧张时，高优先级队列可以抢占（`reclaim`）低优先级队列的资源
- 优先级值越大，队列优先级越高
- 优先级是队列间资源竞争的第一决定因素

**使用场景**：
- 区分生产环境和开发环境队列
- 确保关键业务队列优先获得资源
- 实现多租户环境中的资源优先级策略

**优先级示例**：
- 如果队列`A`的优先级为`100`，队列`B`的优先级为`50`，当有很多任务处于`Pending`状态时，那么队列`A`的任务会优先获得调度。


**2. weight（权重）**

**定义**：队列的权重，用于在优先级相同的队列之间按比例分配资源。

**特点**：
- 权重是相对的，只在优先级相同的队列之间起作用
- 权重决定了队列获得资源的比例，而不是绝对优先顺序
- 权重值越大，在同优先级队列中获得的资源比例越高
- 权重是队列间资源竞争的第二决定因素（优先级相同时才考虑权重）

**使用场景**：
- 在同一部门的多个项目队列之间分配资源
- 实现资源的按比例分配策略
- 在非抢占场景下微调资源分配
- **在使用 `proportion` 插件时**：`weight` 成为动态计算 `deserved` 资源的核心参数

**两者关系**：

1. **决策顺序**：调度器首先根据优先级（`priority`）排序队列，然后才考虑权重（`weight`）
2. **资源分配**：
   - 不同优先级：高优先级队列可以抢占低优先级队列的资源
   - 相同优先级：根据权重按比例分配资源

**权重示例**：
- 如果队列`A`的优先级为`100`，队列`B`的优先级为`50`，那么即使队列`B`的权重远高于队列`A`，队列`A`仍然会优先获得资源。
- 如果队列`C`和队列`D`的优先级都是`100`，权重分别是`2`和`1`，那么在资源分配时，队列`C`会获得约`2/3`的资源，队列`D`获得约`1/3`的资源。
- 当队列`A`和队列`B`的优先级都为`100`时，队列`A`的权重为`1`，队列`B`的权重为`2`，当有很多任务处于`Pending`状态时，那么队列`B`会优先获得调度。

### 队列状态

`Volcano Queue`有四种状态，用于控制队列的行为和作业调度。这些状态在集群维护和资源管理中非常重要。

#### 状态状态类型

1. **Open（开放）**：
   - 队列处于正常工作状态
   - 可以接受新的作业提交
   - 队列中的作业可以被正常调度执行
   - 这是队列的默认状态

2. **Closing（关闭中）**：
   - 队列正在关闭的过渡状态
   - 不再接受新的作业提交
   - 已有作业仍然可以继续运行
   - 当队列中所有作业都完成后，队列会转变为Closed状态

3. **Closed（已关闭）**：
   - 队列完全关闭状态
   - 不接受新的作业提交
   - 队列中的作业不会被调度（即使有足够的资源）
   - 通常用于系统维护或资源重新分配

4. **Unknown（未知）**：
   - 队列状态不明确
   - 通常是由于系统错误或通信问题导致
   - 控制器会尝试将队列恢复到已知状态

#### 检查队列状态

要检查队列的当前状态，可以使用以下命令：

```bash
# 查看单个队列状态
kubectl get queue <队列名称> -o jsonpath='{.status.state}'

# 查看所有队列状态
kubectl get queue -o custom-columns=NAME:.metadata.name,STATE:.status.state
```

#### 状态控制

`Volcano`使用命令（Command）机制来控制队列的状态，而不是通过直接修改`Queue`对象的字段。以下是控制队列状态的方法：

##### 方式一：使用`kubectl vc`命令行工具（推荐）

`Volcano`提供了专门的命令行工具来操作队列：

```bash
# 关闭队列
kubectl vc queue operate --action close --name <队列名称>

# 开启队列
kubectl vc queue operate --action open --name <队列名称>
```

##### 方式二：创建`Command`资源

如果需要以编程方式或在自动化脚本中控制队列状态，可以创建`Command`资源：

```yaml
apiVersion: bus.volcano.sh/v1alpha1
kind: Command
metadata:
  generateName: queue-name-close-  # 会自动生成唯一名称
  namespace: default
  ownerReferences:
  - apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    name: <队列名称>
    uid: <队列UID>  # 需要获取队列的实际UID
targetObject:
  apiVersion: scheduling.volcano.sh/v1beta1
  kind: Queue
  name: <队列名称>
  uid: <队列UID>
action: CloseQueue  # 或 OpenQueue
```

##### 方式三：使用Volcano API客户端

在`Go`程序中，可以使用`Volcano`的客户端库：

```go
import (
    "context"
    "fmt"
    
    metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
    "volcano.sh/apis/pkg/apis/bus/v1alpha1"
    "volcano.sh/apis/pkg/client/clientset/versioned"
)

func closeQueue(client *versioned.Clientset, queueName string) error {
    // 获取队列信息
    queue, err := client.SchedulingV1beta1().Queues().Get(context.TODO(), queueName, metav1.GetOptions{})
    if err != nil {
        return err
    }
    
    // 创建控制器引用
    ctrlRef := metav1.NewControllerRef(queue, v1beta1.SchemeGroupVersion.WithKind("Queue"))
    
    // 创建命令
    cmd := &v1alpha1.Command{
        ObjectMeta: metav1.ObjectMeta{
            GenerateName: fmt.Sprintf("%s-close-", queue.Name),
            OwnerReferences: []metav1.OwnerReference{*ctrlRef},
        },
        TargetObject: ctrlRef,
        Action:       string(v1alpha1.CloseQueueAction),
    }
    
    // 提交命令
    _, err = client.BusV1alpha1().Commands(queue.Namespace).Create(context.TODO(), cmd, metav1.CreateOptions{})
    return err
}
```


### 资源抢占机制

在`Volcano`中，资源抢占有两种主要实现方式：基于`Queue`属性的抢占和基于`PriorityClass`的抢占。

**注意事项：** 

要使`queue`的`reclaimable`配置真正生效，必须在`Volcano`调度器配置中同时启用`preempt`动作（`action`）和`reclaim`动作（`action`）。

**调度器配置示例：**
```yaml
actions: "enqueue, allocate, preempt, reclaim, backfill"
# 其他配置...
```
- `actions`字段中必须包含`reclaim`
- `tiers`结构中的某个插件层级中必须包含`name: reclaim`的插件配置

如果未启用`preempt`或`reclaim` `action`，即使配置了`reclaimable: true`，也不会有实际效果。
1. `reclaim action`负责识别可回收的资源并执行回收操作，但它依赖于`preempt`插件提供的抢占机制来实际终止（`kill`）低优先级队列中的任务。
2. 在`Volcano`的实现中，`reclaim action`会调用`preempt`插件注册的回调函数来判断哪些任务可以被回收，如果没有启用`preempt action`，这个过程就无法完成。
3. 资源回收的完整流程需要两个`action`协同工作：
- `reclaim action`负责识别资源紧张的情况并触发回收流程
- `preempt action`负责实际执行抢占操作，包括终止低优先级任务

**1. 基于 Queue 属性的抢占**

这种抢占机制主要基于队列的`weight`和`reclaimable`属性组合实现。

**工作原理**：

- 当集群资源紧张时，`Volcano`可能会从低`weight`队列中回收资源，以满足高`weight`队列的需求
- 这种回收可能包括终止低`weight`队列中的任务
- 当`reclaimable`设置为`true`时，该队列的资源可被回收或抢占
- 当发生队列级别的资源抢占时，被回收队列中的部分任务（`Pod`）会被调度器直接终止（`kill`），以释放资源给高优先级队列使用。

**抢占条件**：

- 被抢占队列的`reclaimable`属性必须设置为`true`
- 抢占通常只发生在资源极度紧张且无法满足高`weight`队列的`guarantee`资源需求时

**2. 基于 PriorityClass 的抢占**

虽然`Queue`对象本身没有`priorityClassName`属性，但`Volcano`与`Kubernetes`的`PriorityClass`机制集成，在`PodGroup`（作业组）级别支持基于优先级的抢占。

**注意事项：** 
- 要使`PodGroup`基于`PriorityClass`的强占生效，必须要`Volcano`调度器启用`preempt`动作（`action`），因为`PodGroup`是`Volcano`的自定义资源。
- 如果是其他`Kubernetes`原生资源如`Pod`，则不需要`Volcano`调度器，`Kubernetes`原生能力已支持。当高优先级`Pod`无法调度时，`kube-scheduler`会尝试抢占低优先级`Pod`。

**工作原理**：

- `PodGroup`可以设置`priorityClassName`属性，关联到`Kubernetes`的`PriorityClass`资源
- 每个`PriorityClass`对应一个整数值，表示优先级
- 当集群资源紧张时，高优先级的`PodGroup`可以抢占低优先级的`PodGroup`资源
- 这种抢占是通过终止（`kill`）低优先级`PodGroup`中的`Pod`来实现的

**示例配置**：

```yaml
# 在Kubernetes中定义PriorityClass
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for critical production jobs"
---
# 在PodGroup中使用PriorityClass
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: critical-job
spec:
  minMember: 3
  priorityClassName: high-priority  # 关联到上面定义的PriorityClass
```

**3. 两种抢占机制的区别与配合**

**作用范围不同**：

- `Queue`属性抢占是队列级别的，影响整个队列的资源分配
- `PriorityClass`抢占是`PodGroup`级别的，可以跨队列进行抢占

**决策依据不同**：

- `Queue`属性抢占主要基于`weight`和`reclaimable`属性
- `PriorityClass`抢占主要基于`PriorityClass`的优先级值

**应用场景不同**：

- `Queue`属性抢占适用于资源分组和多租户场景，实现队列间的资源隔离
- `PriorityClass`抢占适用于同一队列内或跨队列的作业优先级管理

**配合使用**：

- 在实际使用中，这两种机制可以配合使用
- 首先基于`Queue`属性进行队列级别的资源分配
- 然后基于`PriorityClass`在队列内部或跨队列进行细粒度的作业优先级管理

### 层级队列

在`Volcano`中，层级队列结构是一种特殊的资源管理方式，允许将队列组织成树形结构，实现更精细的资源分配和控制。`Volcano`支持层级队列结构，允许根据组织结构或业务需求创建多层次的队列体系。

#### 层级队列的配置方式

在`Volcano`中，通过`spec.parent`属性可以简单直接地配置层级队列关系：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: dev-queue
spec:
  weight: 2
  reclaimable: true
  parent: "root.eng"  # 指定父队列，使用点号分隔层级
```

#### 层级队列的使用示例

下面是一个使用`parent`属性创建三层队列结构的示例：

```yaml
# 根队列
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: root
spec:
  weight: 1
  reclaimable: false
---
# 工程部队列（第二层）
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: eng
spec:
  weight: 2
  reclaimable: false
  parent: "root"  # 指定父队列为root
---
# 开发环境队列（第三层）
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: dev
spec:
  weight: 2
  reclaimable: true
  parent: "root.eng"  # 指定父队列为root.eng
```

#### 层级队列的工作原理

层级队列的资源分配遵循以下原则：

- **自上而下的资源分配**：集群资源首先分配给根队列，然后根队列将资源分配给子队列，以此类推
- **权重比例分配**：同一父队列下的子队列根据其权重比例分配资源
- **资源限制**：子队列的`deserved`资源总和不能超过父队列的`deserved`资源
- **资源继承**：如果子队列没有设置`capability`，它会继承父队列的`capability`值

#### 层级队列的资源回收与抢占

层级队列中的资源回收遵循特定的规则：

- **同级队列优先**：当资源紧张时，会优先从同级的队列中回收资源
- **层级传递**：如果同级队列的资源回收不足，会向上传递资源需求，由父队列协调资源
- **保障机制**：即使在资源紧张时，也会保证队列的`guarantee`资源不被回收

#### 层级队列的优势

- **组织结构映射**：可以直接映射企业的组织结构，如部门/团队/项目
- **精细化资源管理**：实现多层次的资源配额和限制
- **灵活的资源共享**：同一父队列下的子队列可以共享资源
- **简化管理**：可以在父队列级别设置策略，自动应用到所有子队列

### 队列亲和性（affinity）

`Volcano`的`Queue`对象提供了强大的亲和性配置功能，允许管理员控制队列中的任务应该调度到哪些节点上。这一功能特别适用于需要特定硬件资源（如`GPU`、高内存节点）的工作负载。


> **注意**：`Queue`的`affinity`配置**必须**启用`nodegroup`插件才能生效。该插件负责解析队列的亲和性配置并在调度过程中应用这些规则。如果未启用`nodegroup`插件，即使在`Queue`对象中配置了`affinity`，这些配置也不会影响调度决策。


#### 节点组介绍

节点组是`Volcano`中的一个逻辑概念，用于将具有相似特性或用途的节点归类管理。节点组通过节点标签 `volcano.sh/nodegroup-name` 来定义。

**核心原理：**

1. **标签驱动分组**：`Volcano`通过读取节点上的 `volcano.sh/nodegroup-name` 标签值来识别节点所属的组
2. **调度时匹配**：当调度器处理带有 `nodeGroupAffinity` 的队列时，会根据节点组名称进行匹配过滤
3. **动态管理**：节点组是动态的，可以随时通过修改节点标签来调整节点的分组归属

**节点标签定义示例：**

以下是不同类型节点的标签配置示例，展示了如何通过标签将节点分配到不同的节点组：

```yaml
# GPU 计算节点 - 属于 gpu-nodes 节点组
apiVersion: v1
kind: Node
metadata:
  name: gpu-node-1
  labels:
    volcano.sh/nodegroup-name: gpu-nodes    # 关键标签：定义节点组
    nvidia.com/gpu.present: "true"
    nvidia.com/gpu.count: "8"
    # 其他标签...
spec:
  # ... 节点规格配置
---
# NPU 计算节点 - 属于 npu-nodes 节点组（用于反亲和性排除）
apiVersion: v1
kind: Node
metadata:
  name: npu-node-1
  labels:
    volcano.sh/nodegroup-name: npu-nodes    # 关键标签：定义节点组
    # 其他标签...
spec:
  # ... 节点规格配置
---
# 测试节点 - 属于 test-nodes 节点组（用于反亲和性排除）
apiVersion: v1
kind: Node
metadata:
  name: test-node-1
  labels:
    volcano.sh/nodegroup-name: test-nodes    # 关键标签：定义节点组
    # 其他标签...
spec:
  # ... 节点规格配置
```

**工作流程：**

1. **节点注册**：节点启动时，通过标签 `volcano.sh/nodegroup-name` 声明自己属于哪个节点组
2. **队列配置**：管理员在`Queue`中配置`nodeGroupAffinity`，指定允许或禁止的节点组
3. **调度决策**：当`Pod`需要调度时，`Volcano`调度器会：
   - 读取`Pod`所属队列的`nodeGroupAffinity`配置
   - 遍历候选节点，检查每个节点的 `volcano.sh/nodegroup-name` 标签
   - 根据亲和性规则过滤节点，只保留符合要求的节点
   - 在符合条件的节点中进行最终调度选择

**与 nodeAffinity 的区别：**

| 特性 | nodeGroupAffinity | nodeAffinity |
|------|------------------|--------------|
| **抽象层次** | 节点组级别，基于逻辑分组 | 节点级别，基于具体标签 |
| **配置复杂度** | 简单，直接指定组名 | 复杂，需要`matchExpressions` |
| **管理方式** | 统一管理节点组，便于批量操作 | 需要管理具体的节点标签规则 |
| **适用场景** | 大规模集群的节点分组管理 | 精确的节点选择控制 |
| **配置示例** | `["gpu-nodes", "npu-nodes"]` | `matchExpressions: [{key: "nvidia.com/gpu.present", operator: In, values: ["true"]}]` |

这种设计使得节点组管理更加灵活和可扩展，特别适合大规模、多租户的集群环境。

#### 亲和性类型

`Queue`的`affinity`配置支持两种主要类型：

1. **节点组亲和性（`nodeGroupAffinity`）**：指定队列中的任务应该调度到的节点组

2. **节点组反亲和性（`nodeGroupAntiAffinity`）**：指定队列中的任务不应该调度到的节点组

每种亲和性类型又分为两个级别：

- **`requiredDuringSchedulingIgnoredDuringExecution`**：必须满足的亲和性规则，如果不满足，任务将不会被调度
- **`preferredDuringSchedulingIgnoredDuringExecution`**：优先满足的亲和性规则，如果不满足，任务仍然可以被调度到其他节点

#### 配置示例

下面是一个完整的`Queue`亲和性配置示例：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: gpu-workloads
spec:
  weight: 10
  reclaimable: false
  affinity:
    # 节点组亲和性配置
    nodeGroupAffinity:
      # 必须满足的亲和性规则
      requiredDuringSchedulingIgnoredDuringExecution:
        - "gpu-nodes"        # 必须调度到标记为 gpu-nodes 的节点组

    # 节点组反亲和性配置
    nodeGroupAntiAffinity:
      # 必须满足的反亲和性规则
      requiredDuringSchedulingIgnoredDuringExecution:
        - "test-nodes"       # 不能调度到标记为 test-nodes 的节点组
```

#### 工作原理

当`Volcano`调度器为队列中的任务选择节点时，会根据队列的`affinity`配置进行过滤：

1. **必需亲和性（`Required Affinity`）**：
   - 如果配置了`nodeGroupAffinity.requiredDuringSchedulingIgnoredDuringExecution`，任务只能调度到指定的节点组
   - 如果配置了`nodeGroupAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`，任务不能调度到指定的节点组

2. **首选亲和性（`Preferred Affinity`）**：
   - 在满足必需亲和性的前提下，调度器会优先选择满足`preferredDuringSchedulingIgnoredDuringExecution`规则的节点

3. **与Pod亲和性的关系**：
   - `Queue`的亲和性配置不会直接修改`Pod`的`.spec.affinity`字段
   - 而是在调度决策过程中通过`nodegroup`插件应用这些规则
   - 调度器会首先查看要调度的`Pod`所属的`PodGroup`，然后确定其所属的`Queue`
   - 在节点筛选阶段，同时考虑`Pod`自身的亲和性和`Queue`的亲和性规则

4. **优先级顺序**：
   - `Pod`自身的亲和性规则优先级最高
   - `Queue`的亲和性规则是额外的约束条件
   - 两者都必须满足才能完成调度


### 扩展集群（extendClusters）

`Volcano`的`Queue`对象提供了`extendClusters`配置，允许将队列中的作业调度到多个集群中。这一功能在多集群管理和混合云场景中特别有用。

> **注意**：要使`Queue`的`extendClusters`配置生效，需要启用`Volcano`的多集群调度功能，并配置相应的集群连接信息。

#### 配置结构

`extendClusters`字段是一个数组，每个元素定义了一个扩展集群及其相关属性：

```yaml
extendClusters:
  - name: "cluster-1"    # 集群名称，必须与多集群配置中的名称匹配
    weight: 5            # 集群权重，影响作业分配到该集群的概率
    capacity:            # 集群容量限制
      cpu: 1000          # CPU容量
      memory: 1000Gi     # 内存容量
  - name: "cluster-2"
    weight: 3
    capacity:
      cpu: 500
      memory: 500Gi
```

主要属性说明：

1. **name**：指定扩展集群的名称，必须与`Volcano`多集群配置中定义的集群名称相匹配

2. **weight**：集群的权重，决定了在多集群调度场景下，作业被调度到该集群的优先级
   - 权重越高，该集群被选中的概率越大
   - 当多个集群都满足作业调度要求时，权重起到决定性作用

3. **capacity**：定义该队列在指定集群中可以使用的资源上限
   - 可以指定多种资源类型，如CPU、内存、GPU等
   - 队列中的作业在该集群上使用的资源总和不能超过这个限制

#### 工作原理

当启用多集群调度功能时，`Volcano`调度器会根据以下流程处理队列的`extendClusters`配置：

1. **集群选择**：
   - 调度器首先检查作业所属队列的`extendClusters`配置
   - 根据各集群的`weight`和当前资源状态，选择最合适的集群

2. **资源限制检查**：
   - 检查选中集群的`capacity`配置
   - 确保队列在该集群上的资源使用不超过限制

3. **跨集群调度**：
   - 将作业调度到选中的集群中执行
   - 维护作业与集群的映射关系

#### 应用场景

1. **资源池扩展**：当主集群资源不足时，可以将作业调度到其他集群，扩展资源池

2. **混合云管理**：允许将作业分配到不同的云环境（公有云、私有云、混合云）

3. **地理分布式部署**：将作业分配到不同地理位置的集群，实现全球资源调度

4. **特定资源类型的分配**：将需要特定硬件（如GPU、FPGA）的作业调度到配备这些资源的集群

#### 配置示例

下面是一个完整的使用`extendClusters`的`Queue`配置示例：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: multi-cluster-queue
spec:
  weight: 10
  capability:
    cpu: 2000
    memory: 4000Gi
  reclaimable: true
  # 扩展集群配置
  extendClusters:
    - name: "on-premise-cluster"  # 本地数据中心集群
      weight: 10                 # 高权重，优先使用
      capacity:
        cpu: 1000
        memory: 2000Gi
        nvidia.com/gpu: 8
    - name: "cloud-cluster-a"     # 公有云集群A
      weight: 5                  # 中等权重
      capacity:
        cpu: 500
        memory: 1000Gi
    - name: "cloud-cluster-b"     # 公有云集群B
      weight: 3                  # 低权重
      capacity:
        cpu: 500
        memory: 1000Gi
```

在这个配置中：

- 队列的作业会优先调度到权重为10的`on-premise-cluster`集群
- 当本地集群资源不足或不满足作业要求时，会考虑调度到公有云集群
- 每个集群都有各自的资源限制，确保队列不会过度使用某一集群的资源

#### 使用注意事项

1. **多集群配置**：使用`extendClusters`前，需要先在`Volcano`调度器中配置多集群环境

2. **集群连通性**：确保各集群之间的网络连通性，特别是对于跨地域部署的集群

3. **资源类型兼容性**：确保不同集群的资源类型定义一致，否则可能导致调度失败

4. **性能影响**：跨集群调度可能引入额外的网络延迟和性能开销，需要考虑这些因素

### 队列使用方式

`Volcano Queue`可以与多种`Kubernetes`工作负载类型结合使用。以下是不同工作负载类型如何关联到指定队列的示例：

#### 1. Volcano Job

`Volcano Job`可以直接在定义中指定队列名称：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: distributed-training
spec:
  queue: ai-training  # 指定队列名称
  minAvailable: 3
  tasks:
    - replicas: 1
      name: ps
      template:
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:latest-gpu
```

#### 2. Kubernetes Pod

对于普通的`Kubernetes Pod`，可以通过添加特定注解来指定队列：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ml-inference
  annotations:
    volcano.sh/queue-name: "inference-queue"  # 指定队列名称
spec:
  schedulerName: volcano  # 必须指定使用volcano调度器
  containers:
  - name: inference-container
    image: ml-model:v1
```

#### 3. Kubernetes Deployment

对于`Deployment`，需要在`Pod`模板中添加相关注解：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
        volcano.sh/queue-name: "web-queue"  # 通过labels指定队列名称（推荐方式，便于查询）
      # 也可以通过annotations指定队列名称
      # annotations:
      #   volcano.sh/queue-name: "web-queue"  
    spec:
      schedulerName: volcano  # 必须指定使用volcano调度器
      containers:
      - name: nginx
        image: nginx:latest
```

> 注意：使用labels方式关联队列有助于通过标签选择器快速查询属于特定队列的Pod，例如：
> ```bash
> kubectl get pods -l volcano.sh/queue-name=web-queue
> ```

#### 4. Kubernetes StatefulSet

`StatefulSet`的配置方式与`Deployment`类似：

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: database
spec:
  serviceName: "db"
  replicas: 3
  selector:
    matchLabels:
      app: database
  template:
    metadata:
      labels:
        app: database
      annotations:
        volcano.sh/queue-name: "db-queue"  # 指定队列名称
    spec:
      schedulerName: volcano  # 必须指定使用volcano调度器
      containers:
      - name: mysql
        image: mysql:5.7
```

#### 5. PodGroup

`PodGroup`是`Volcano`提供的一种自定义资源，用于将多个`Pod`作为一个组进行调度：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: ml-training-group
spec:
  queue: high-priority  # 指定队列名称
  minMember: 3
---
apiVersion: v1
kind: Pod
metadata:
  name: training-worker-1
  labels:
    podgroup: ml-training-group  # 关联到PodGroup
spec:
  schedulerName: volcano
  containers:
  - name: training
    image: ml-training:v1
```

#### 注意事项

1. **调度器指定**：无论使用哪种方式，都必须将`schedulerName`设置为`volcano`，否则`Pod`不会被`Volcano`调度器处理

2. **队列存在性**：指定的队列必须已经创建，否则`Pod`将无法被成功调度

3. **权限控制**：在多租户环境中，通常需要配置`RBAC`权限，限制用户只能使用特定的队列

4. **默认队列**：如果未指定队列，`Pod`将被分配到默认队列（通常名为`default`）


## Job

`Volcano Job`是`Volcano`调度系统中的核心工作负载对象，用于定义和管理复杂的分布式、批处理和高性能计算任务。与原生`Kubernetes Job`相比，`Volcano Job`提供了更丰富的功能和更灵活的调度策略，特别适合机器学习、大数据分析、科学计算等领域。

### 基本结构

`Volcano Job`的数据结构如下：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: distributed-training  # 作业名称
spec:
  minAvailable: 3             # 最小可用Pod数量，作业启动所需的最小资源数量
  minSuccess: 2               # 最小成功Pod数量，任务被认为完成所需的最小成功数量
  schedulerName: volcano      # 指定使用volcano调度器
  priorityClassName: high     # 作业优先级（可选）
  queue: ai-training          # 所属队列
  maxRetry: 5                 # 最大重试次数
  ttlSecondsAfterFinished: 3600  # 作业完成后保留时间（秒）
  plugins:                    # 使用的插件
    ssh: []                   # SSH插件配置
    env: []                   # 环境变量插件配置
    svc: []                   # 服务插件配置
  policies:                   # 策略配置
    - event: PodEvicted       # 触发事件
      action: RestartJob      # 对应动作
  tasks:                      # 任务定义，一个Job可以包含多个任务
    - replicas: 1             # 副本数
      name: ps                # 任务名称
      policies:               # 任务级别策略
        - event: TaskCompleted # 触发事件
          action: CompleteJob # 对应动作
      template:               # Pod模板
        metadata:
          labels:
            role: ps
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:2.4.0-gpu
              resources:
                limits:
                  cpu: 4
                  memory: 8Gi
                  nvidia.com/gpu: 1
    - replicas: 4             # 副本数
      name: worker            # 任务名称
      template:               # Pod模板
        metadata:
          labels:
            role: worker
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:2.4.0-gpu
              resources:
                limits:
                  cpu: 2
                  memory: 4Gi
                  nvidia.com/gpu: 1
```

### Job状态

`Volcano Job`是一个更高级别的抽象，它包含一个或多个`Task`，每个`Task`可以有多个`Pod`副本。`Job`有以下几种状态：

| 状态 | 说明 | 描述 |
| --- | --- | --- |
| `Pending` | 等待中 | `Job`正在队列中等待，等待调度决策 |
| `Inqueue` | 入队 | `Job`已入队，等待调度 |
| `Aborting` | 中止中 | `Job`正在被中止，等待释放`Pod` |
| `Aborted` | 已中止 | `Job`已被中止，所有`Pod`已被释放 |
| `Running` | 运行中 | `Job`中的`Pod`正在运行 |
| `Restarting` | 重启中 | `Job`正在重启，等待`Pod`终止 |
| `Completing` | 完成中 | `Job`正在完成，等待`Pod`终止 |
| `Completed` | 已完成 | `Job`已成功完成，所有`Pod`都已成功运行并终止 |
| `Terminating` | 终止中 | `Job`正在终止，等待`Pod`终止 |
| `Terminated` | 已终止 | `Job`已终止，所有`Pod`已被终止 |
| `Failed` | 失败 | `Job`已失败，无法继续运行 |


### 批量调度

`minAvailable`属性是`Volcano Job`中的核心功能之一，用于实现"批量调度"或"整体调度"机制。这一机制在分布式计算、机器学习等领域特别重要，因为这些应用通常需要多个`Pod`同时启动才能正常工作。

#### 工作原理

1. **调度保证**：
   - 当设置`minAvailable=N`时，`Volcano`调度器会确保至少有`N`个`Pod`同时被调度
   - 如果集群资源不足以满足这一要求，所有`Pod`将保持在`Pending`状态，而不是部分调度

2. **PodGroup集成**：
   - `Volcano`会为每个`Job`创建一个`PodGroup`对象
   - `minAvailable`值会设置到`PodGroup`中，用于指导调度决策

3. **资源等待机制**：
   - 当资源不足时，作业将进入等待状态
   - 一旦有足够资源可以满足`minAvailable`要求，作业将被调度

#### 应用场景示例

1. **分布式机器学习**：

    ```yaml
    apiVersion: batch.volcano.sh/v1alpha1
    kind: Job
    metadata:
      name: tf-training
    spec:
      minAvailable: 3  # 1个PS + 2个Worker最小要求
      tasks:
        - replicas: 1
          name: ps
        - replicas: 4
          name: worker
    ```

2. **MPI并行计算**：

    ```yaml
    apiVersion: batch.volcano.sh/v1alpha1
    kind: Job
    metadata:
      name: mpi-job
    spec:
      minAvailable: 5  # 1个Launcher + 4个Worker
      tasks:
        - replicas: 1
          name: launcher
        - replicas: 4
          name: worker
    ```

#### 与其他属性的配合

- **与minSuccess的区别**：`minAvailable`关注的是**调度启动**时的最小要求，而`minSuccess`关注的是**任务成功**所需的最小成功`Pod`数量。这里的成功是指Pod处于`Succeeded`状态（即`Pod`内所有容器都成功终止，退出码为`0`）

- **与policies的结合**：可以配合`PodFailed`策略，当`Pod`失败导致可用`Pod`数量小于`minAvailable`时触发重启或终止操作

### 重试策略

`Volcano Job`提供了灵活的重试机制，允许用户配置在作业失败时的处理方式。这一机制对于提高分布式任务的可靠性和容错能力至关重要。

#### 重试控制参数

1. **maxRetry**：
   - 定义作业失败时的最大重试次数
   - 当作业失败次数超过该值时，作业将被标记为最终失败状态
   - 默认值为`3`

2. **policies**：
   - 通过`event`和`action`对定义特定事件发生时的处理方式
   - 可以在作业级别或任务级别配置

#### 支持的事件类型(event)

`Volcano`支持以下事件类型来触发重试策略：

| 事件 | 描述 | 备注 |
| :--- | :--- | :--- |
| `PodFailed` | 当`Pod`失败时触发 | 适用于容器崩溃、内存溢出等异常情况 |
| `PodEvicted` | 当`Pod`被驱逐时触发 | 适用于资源抢占、节点维护等情况 |
| `PodPending` | 当`Pod`处于等待状态时触发 | 通常与`timeout`参数配合使用，适用于检测调度卡住的情况 |
| `PodRunning` | 当`Pod`进入运行状态时触发 | 适用于监控`Pod`状态变化，可用于取消其他延迟操作 |
| `JobUnknown` (`Unknown`) | 当作业状态未知时触发 | 适用于处理异常情况，如部分Pod无法调度而其他已运行 |
| `TaskCompleted` | 当任务中所有Pod成功完成时触发 | 适用于一个任务完成后触发作业级别的动作 |
| `TaskFailed` | 当任务意外失败时触发 | 适用于检测任务级别的失败 |
| `OutOfSync` | 当`Pod`或`Job`状态更新时触发 | 系统内部事件，用于处理添加/更新/删除操作 |
| `CommandIssued` | 当用户发出命令时触发 | 系统内部事件，用于响应外部命令 |
| `JobUpdated` | 当`Job`被更新时触发 | 系统内部事件，主要用于扩容/缩容操作 |
| `*` (`AnyEvent`) | 匹配任何事件 | 通配符，可用于捕获所有类型的事件 |

#### 支持的动作类型(action)

`Volcano`支持以下动作类型来处理重试：

| 动作 | 描述 | 备注 |
| :--- | :--- | :--- |
| `AbortJob` | 中止作业，但不清理资源 | 作业可以恢复 |
| `RestartJob` | 重启整个作业 | 所有`Pod`将被终止并重新创建 |
| `RestartTask` | 只重启特定任务 | 只能用于任务级别的策略 |
| `RestartPod` | 只重启特定的`Pod` | 提供更精细的重启控制 |
| `TerminateJob` | 终止作业并清理所有资源 | 作业将无法恢复 |
| `CompleteJob` | 将作业标记为完成 | 适用于关键任务完成时结束整个作业 |

#### 重试策略配置示例

1. **基本重试配置**：

    ```yaml
    apiVersion: batch.volcano.sh/v1alpha1
    kind: Job
    metadata:
      name: job-retry-example
    spec:
      minAvailable: 3
      maxRetry: 5  # 最多重试五次
      policies:
        - event: PodFailed  # 当Pod失败时
          action: RestartJob  # 重启整个作业
    ```

2. **任务级别重试策略**：

    ```yaml
    apiVersion: batch.volcano.sh/v1alpha1
    kind: Job
    metadata:
      name: task-retry-example
    spec:
      minAvailable: 3
      maxRetry: 3
      tasks:
        - replicas: 1
          name: master
          policies:
            - event: PodFailed  # 当master失败时
              action: RestartJob  # 重启整个作业
        - replicas: 3
          name: worker
          policies:
            - event: PodFailed  # 当worker失败时
              action: RestartTask  # 只重启该任务
    ```

3. **带超时的重试策略**：

    ```yaml
    apiVersion: batch.volcano.sh/v1alpha1
    kind: Job
    metadata:
      name: timeout-retry-example
    spec:
      minAvailable: 3
      policies:
        - event: PodPending  # 当Pod长时间处于等待状态
          action: AbortJob  # 中止作业
          timeout: 1h  # 超过1小时后触发
    ```

#### 重试策略最佳实践

1. **区分关键任务和非关键任务**：
   - 对于关键任务（如主节点）的失败，应触发`RestartJob`
   - 对于非关键任务（如工作节点）的失败，可以使用`RestartTask`或`RestartPod`

2. **考虑超时设置**：
   - 对于可能长时间卡住的情况，添加`timeout`参数
   - 超时时间应根据任务的复杂度和资源需求合理设置

3. **限制最大重试次数**：
   - `maxRetry`值不应设置过大，避免资源浪费
   - 对于大型作业，建议设置为`3-5`次

4. **与队列策略的协调**：
   - 考虑队列的`reclaimable`属性对重试策略的影响
   - 如果作业在可回收的队列中，可能需要更强大的重试策略

#### 与其他特性的结合

- **与minAvailable的结合**：当`Pod`失败导致可用`Pod`数量小于`minAvailable`时，可以触发重试

- **与minSuccess的结合**：当成功的`Pod`数量无法达到`minSuccess`时，可以触发重试

- **与插件的结合**：重试时会重新应用插件配置，确保环境变量、SSH密钥等正确重新配置

### 任务依赖关系

`Volcano Job`支持在不同任务之间定义依赖关系，这一功能在复杂的工作流程中非常有用，如数据处理管道、模型训练和评估流程等。

#### 依赖关系配置

`Volcano Job`使用`dependsOn`字段定义任务之间的依赖关系：

```yaml
tasks:
  - name: task-A
    replicas: 1
    template:
      # ...
  - name: task-B
    replicas: 2
    dependsOn:
      name: ["task-A"]  # task-B依赖于task-A
    template:
      # ...
  - name: task-C
    replicas: 3
    dependsOn:
      name: ["task-A", "task-B"]  # task-C依赖于task-A和task-B
    template:
      # ...
```

#### 工作原理

1. **依赖解析**：
   - `Volcano Job`控制器在创建作业时解析任务之间的依赖关系
   - 构建一个有向无环图（DAG）来表示任务执行顺序

2. **执行顺序**：
   - 只有当所有依赖的任务完成后，一个任务才会启动
   - 没有依赖关系的任务可以并行启动

3. **状态传递**：
   - 当一个任务失败时，依赖于它的任务不会启动
   - 这确保了工作流程的完整性

#### 应用场景

1. **数据处理管道**：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: data-pipeline
spec:
  minAvailable: 1
  tasks:
    - name: data-collection
      replicas: 1
      template:
        # ...
    - name: data-preprocessing
      replicas: 3
      dependsOn:
        name: ["data-collection"]
      template:
        # ...
    - name: model-training
      replicas: 2
      dependsOn:
        name: ["data-preprocessing"]
      template:
        # ...
```

2. **复杂的模型训练流程**：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ml-workflow
spec:
  minAvailable: 1
  tasks:
    - name: data-preparation
      replicas: 1
      template:
        # ...
    - name: feature-extraction
      replicas: 2
      dependsOn:
        name: ["data-preparation"]
      template:
        # ...
    - name: model-training
      replicas: 1
      dependsOn:
        name: ["feature-extraction"]
      template:
        # ...
    - name: model-evaluation
      replicas: 1
      dependsOn:
        name: ["model-training"]
      template:
        # ...
    - name: model-deployment
      replicas: 1
      dependsOn:
        name: ["model-evaluation"]
      template:
        # ...
```

#### 注意事项与最佳实践

1. **避免循环依赖**：
   - 不能创建循环依赖，如A依赖B，B依赖C，C依赖A
   - 这将导致作业创建失败

2. **考虑资源需求**：
   - 当使用依赖关系时，要考虑`minAvailable`的设置
   - 如果同时运行的任务很少，可以将`minAvailable`设置得较小

3. **与重试策略的结合**：
   - 当使用依赖关系时，要为关键任务配置适当的重试策略
   - 关键任务的失败可能会导致整个工作流程卡住

4. **使用有意义的任务名称**：
   - 任务名称应清晰地反映其功能和在工作流程中的位置
   - 这有助于理解和维护复杂的依赖关系