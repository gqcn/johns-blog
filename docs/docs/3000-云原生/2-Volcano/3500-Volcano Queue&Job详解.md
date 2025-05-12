---
slug: "/cloud-native/volcano-queue-job"
title: "Volcano Queue&Job详解"
hide_title: true
keywords:
  [

  ]
description: ""
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
  name: default-queue  # 队列名称
  annotations:         # 注释，可选
    description: "Production workloads queue"  # 自定义注释
spec:
  weight: 1            # 队列权重，影响资源分配优先级，数值越大优先级越高
  capability:          # 队列资源容量限制（上限）
    cpu: 100           # CPU资源上限，单位为核心数
    memory: 100Gi      # 内存资源上限
    nvidia.com/gpu: 4  # GPU资源上限
  deserved:            # 应得资源量（多队列竞争时的资源分配基准）
    cpu: 80            # 应得的CPU资源量
    memory: 80Gi       # 应得的内存资源量
    nvidia.com/gpu: 3  # 应得的GPU资源量
  guarantee:           # 队列保障资源，即使在资源紧张情况下也会保证分配
    resource:          # 保障的资源量
      cpu: 50          # 保障的CPU资源量
      memory: 50Gi     # 保障的内存资源量
      nvidia.com/gpu: 2  # 保障的GPU资源量
  reclaimable: true    # 是否允许回收资源，设为true时允许其他队列在空闲时借用该队列资源
  parent: "root.eng"   # 父队列，用于层级队列结构
  affinity:            # 队列亲和性配置，控制队列中的Pod调度到哪些节点
    nodeGroupAffinity:  # 节点组亲和性
      requiredDuringSchedulingIgnoredDuringExecution:  # 必须满足的亲和性规则
        - "gpu-nodes"  # 节点组名称
      preferredDuringSchedulingIgnoredDuringExecution:  # 优先满足的亲和性规则
        - "high-memory-nodes"  # 节点组名称
    nodeGroupAntiAffinity:  # 节点组反亲和性
      requiredDuringSchedulingIgnoredDuringExecution:  # 必须满足的反亲和性规则
        - "test-nodes"  # 节点组名称
  extendClusters:      # 扩展集群配置，指示队列中的作业将被调度到这些集群
    - name: "cluster-1"  # 集群名称
      weight: 5          # 集群权重
      capacity:          # 集群容量
        cpu: 1000        # CPU容量
        memory: 1000Gi   # 内存容量
```

在该队列对象上，我去掉了没有太大意义的一些配置项，一遍更好理解队列功能。去掉的配置项如下：
- 注解上实现的层级队列配置，如：
    ```yaml
    annotations:
    "volcano.sh/hierarchy": "root/eng/prod"
    "volcano.sh/hierarchy-weights": "1/2/8"
    ```
- 仅作队列类型标记使用的`spec.type`配置项，没有实际功能作用。

### 三级资源配置机制

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

**示例场景**： 假设关键业务队列设置了`guarantee.cpu=50`，即使集群资源非常紧张，该队列也能保证获得`50`核`CPU`资源用于运行关键业务。

**重要提示**：要使`Queue`中的`capability`、`deserved`和`guarantee`这三项资源配置属性生效，需要确保`Volcano`调度器启用了`capacity`插件。这个插件是处理这三级资源配置的核心组件。

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




### 资源分配机制

在`Volcano`中，队列的资源分配主要基于`weight`属性配置，而资源抢占机制则是通过内置的调度策略实现的。

**1. weight与资源分配**

**定义**：`weight`属性用于定义队列在资源分配过程中的权重。

**特点**：

- `weight`值越高，队列在资源分配中的优先级越高
- 当多个队列竞争资源时，资源分配比例与队列的`weight`值成正比
- 这主要应用于`deserved`资源的分配过程

**工作原理**：

- 当集群资源充足时，所有队列可以获得其`deserved`资源
- 当集群资源不足以满足所有队列的`deserved`资源时，按照`weight`比例分配资源
- 例如，如果队列A的`weight`是队列B的两倍，那么队列A获得的资源也将是队列B的两倍

### 资源抢占机制

在`Volcano`中，资源抢占有两种主要实现方式：基于`Queue`属性的抢占和基于`PriorityClass`的抢占。

**1. 基于 Queue 属性的抢占**

这种抢占机制主要基于队列的`weight`和`reclaimable`属性组合实现。

**工作原理**：

- 当集群资源紧张时，`Volcano`可能会从低`weight`队列中回收资源，以满足高`weight`队列的需求
- 这种回收可能包括终止低`weight`队列中的任务
- 当`reclaimable`设置为`true`时，该队列的资源可被回收或抢占

**抢占条件**：

- 被抢占队列的`reclaimable`属性必须设置为`true`
- 抢占通常只发生在资源极度紧张且无法满足高`weight`队列的`guarantee`资源需求时

**2. 基于 PriorityClass 的抢占**

虽然`Queue`对象本身没有`priorityClassName`属性，但`Volcano`与`Kubernetes`的`PriorityClass`机制集成，在`PodGroup`（作业组）级别支持基于优先级的抢占。

**工作原理**：

- `PodGroup`可以设置`priorityClassName`属性，关联到`Kubernetes`的`PriorityClass`资源
- 每个`PriorityClass`对应一个整数值，表示优先级
- 当集群资源紧张时，高优先级的`PodGroup`可以抢占低优先级的`PodGroup`资源
- 这种抢占是通过终止（`kill`）低优先级`PodGroup`中的Pod来实现的

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
