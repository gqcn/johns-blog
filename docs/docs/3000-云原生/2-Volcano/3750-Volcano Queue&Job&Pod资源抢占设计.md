---
slug: "/cloud-native/volcano-queue-job-pod-preemption"
title: "Volcano Queue&Job&Pod资源抢占设计"
hide_title: true
keywords:
  [
    "Volcano", "资源抢占", "优先级", "Queue", "Job", "Pod", "PriorityClass", "Kubernetes", "调度器", "云原生"
  ]
description: "本文详细介绍了Volcano调度系统中Queue、Job和Pod三个层级的资源抢占设计与实现原理，以及它们之间的优先级关系和抢占机制。"
---


## 1. 资源抢占的背景和用途

### 1.1 什么是资源抢占

在`Kubernetes`集群中，资源抢占(`Preemption`)是指当高优先级的工作负载需要资源但集群资源不足时，调度系统会终止低优先级的工作负载以释放资源，从而确保高优先级工作负载能够正常运行的机制。

资源抢占是解决资源竞争问题的关键技术，特别是在以下场景中尤为重要：

- **资源紧张环境**：在计算资源有限的集群中，需要确保关键业务获得足够资源
- **混合负载场景**：同一集群中同时运行在线服务和批处理作业时，需要保证在线服务的资源优先级
- **弹性计算**：在需求波动较大的环境中，通过优先级机制实现资源的动态分配
- **多租户环境**：在多用户共享集群的情况下，通过优先级和抢占机制实现资源隔离和公平分配

### 1.2 Kubernetes原生抢占机制的局限性

`Kubernetes`原生的抢占机制主要基于`Pod`级别的`PriorityClass`实现，虽然提供了基本的资源抢占能力，但在复杂的高性能计算和`AI/ML`工作负载场景中存在以下局限性：

1. **层级抢占机制不完善**：
   - 虽然`Job`可以通过`PriorityClass`设置优先级，但缺乏队列级别的资源管理
   - 无法实现多层级、多维度的资源抢占策略

2. **缺乏作业感知**：
   - 无法识别同一作业中不同`Pod`之间的关系
   - 在资源紧张时可能导致`Gang`调度失败，造成资源碎片

3. **抢占策略单一**：
   - 仅支持基于优先级的简单抢占
   - 无法根据不同场景和业务需求定制复杂的抢占策略

4. **多租户支持有限**：
   - 缺乏队列级资源保障和隔离机制
   - 难以为不同部门或团队提供差异化的资源配额和服务质量保障

### 1.3 Volcano抢占机制的优势

`Volcano`作为一个面向高性能计算和`AI/ML`工作负载的调度系统，提供了更加完善的资源抢占机制：

1. **多层级抢占**：支持`Queue`(队列)、`Job`(作业)和`Pod`(容器组)三个层级的资源抢占
2. **作业感知**：理解批处理作业的特性，支持`Gang`调度等高级特性
3. **丰富的抢占策略**：提供多种可配置的抢占策略，满足不同场景需求
4. **队列级资源管理**：支持队列级别的资源分配和抢占，适合多租户环境
5. **公平性保障**：通过`DRF`(主导资源公平)算法等机制，确保资源分配的公平性

## 2. Volcano资源抢占的设计与实现

`Volcano`的资源抢占机制设计为三个层级：`Queue`(队列)、`Job`(作业)和`Pod`(容器组)，形成了一个层级分明的抢占体系。

### 2.1 Queue级别抢占

#### 2.1.1 设计原理

`Queue`是`Volcano`中最高层级的资源管理单位，代表一个租户或一个业务线。`Queue`级别的抢占主要基于以下原则：

1. **优先级机制**：每个`Queue`可以设置优先级(`priority`)，高优先级`Queue`可以抢占低优先级`Queue`的资源
2. **资源配额**：`Queue`可以设置最小保障资源(`guarantee`)和最大资源上限(`capacity`)
3. **权重分配**：当多个`Queue`优先级相同时，可以通过权重(`weight`)决定资源分配比例

#### 2.1.2 实现方式

`Volcano`主要通过以下核心组件实现`Queue`级别的资源抢占：

1. **`reclaim action`**：资源回收动作，是实现不同队列间资源抢占的核心机制
2. **队列`priority`属性**：在`Queue`定义中设置的优先级值，决定了队列间的抢占顺序

下面是`Volcano`调度器的配置示例，展示了资源抢占相关的动作：

```yaml
# volcano-scheduler-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: volcano-scheduler-config
  namespace: volcano-system
data:
  volcano-scheduler.conf: |
    # 调度器执行的动作序列，包含资源回收和抢占动作
    actions: "enqueue, allocate, preempt, reclaim, backfill"
    # 其他插件配置...
```

上述配置中，资源抢占相关的核心动作是：

- **`reclaim`**：实现不同队列间的资源抢占，高优先级队列可以从低优先级队列抢占资源

  ```yaml
  apiVersion: scheduling.volcano.sh/v1beta1
  kind: Queue
  metadata:
    name: high-priority-queue
  spec:
    weight: 10
    capability:
      cpu: 100
      memory: 100Gi
    reclaimable: true  # 允许其他Queue抢占此Queue的资源
    priority: 100      # 队列优先级，值越大优先级越高
  ```

### 2.2 Job级别抢占

#### 2.2.1 设计原理

`Job`代表一个完整的工作单元，如一个`AI`训练任务或批处理作业。`Job`级别的抢占主要基于以下原则：

1. **优先级机制**：
   - `Job`通过`priorityClassName`字段关联到`Kubernetes`的`PriorityClass`资源
   - 高优先级`Job`可以抢占同一`Queue`中低优先级`Job`的资源
   - `Job`的优先级会传递给其创建的所有`Pod`，除非`Pod`模板中明确指定了不同的`priorityClassName`

2. **最小资源保障**：
   - `Job`可以设置`minResources`确保获得最小资源保障
   - 结合`minAvailable`参数确保关键任务的资源需求

3. **Gang调度**：
   - 支持`All-or-Nothing`的调度模式
   - 确保作业所有关键任务同时调度，避免资源碎片化

#### 2.2.2 实现方式

`Volcano`主要通过以下核心组件实现`Job`级别的抢占：

1. **`preempt action`**：资源抢占动作，是实现同一队列内不同作业间资源抢占的核心机制
2. **`priorityClassName`**：与`Job`关联的优先级类，决定了作业间的抢占顺序

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: high-priority-job
spec:
  minAvailable: 3
  priorityClassName: high-priority  # 关联PriorityClass设置作业优先级
  queue: research                   # 指定所属队列
  tasks:
    - replicas: 3
      name: worker
      template:
        spec:
          containers:
            - image: training-image
              name: worker
```

### 2.3 Pod级别抢占

#### 2.3.1 设计原理

`Pod`是`Kubernetes`中最小的调度单位，也是`Volcano`调度的基本单位。`Pod`级别的抢占主要基于以下原则：

1. **优先级机制**：`Pod`可以通过`PriorityClass`或`task-priority`注解设置优先级
2. **可抢占性**：`Pod`可以通过`volcano.sh/preemptable`注解标记是否可被抢占
3. **资源需求**：`Pod`的资源请求(`requests`)决定了需要多少资源

#### 2.3.2 实现方式

`Volcano`主要通过以下核心组件实现`Pod`级别的抢占：

1. **`volcano.sh/task-priority`注解**：设置同一`Job`内不同`Pod`的优先级，是实现`Pod`间抢占的核心
2. **`volcano.sh/preemptable`注解**：标记`Pod`是否可被抢占，控制`Pod`的可抢占性
3. **`PreemptionPolicy`**：控制`Pod`的抢占策略，可设置为`PreemptLowerPriority`或`Never`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority-pod
  annotations:
    volcano.sh/task-priority: "10"       # 设置Pod在Job内的优先级
    volcano.sh/preemptable: "false"      # 标记Pod不可被抢占
spec:
  priorityClassName: high-priority        # 设置Pod的全局优先级
  schedulerName: volcano                  # 使用Volcano调度器
```

## 3. 资源抢占的层级关系

在`Volcano`的抢占体系中，`Queue`、`Job`和`Pod`三个层级之间存在明确的优先级关系，形成了一个层级化的抢占机制。

### 3.1 `Queue`与`Queue`之间的抢占

当集群资源紧张时，`Queue`之间的抢占遵循以下规则：

1. **优先级决定性**：高优先级`Queue`可以抢占低优先级`Queue`的资源
2. **权重影响**：当优先级相同时，权重较高的`Queue`可以获得更多资源
3. **最小保障**：每个`Queue`的`guarantee`资源是受保护的，不会被抢占
4. **资源回收**：当高优先级`Queue`不需要资源时，被抢占的`Queue`可以重新获得资源

抢占过程：
1. `Volcano`调度器检测到高优先级`Queue`资源不足
2. 根据优先级和权重策略选择低优先级的`Queue`
3. 从低优先级`Queue`中选择可抢占的`Job`和`Pod`
4. 驱逐选中的`Pod`，释放资源给高优先级`Queue`

### 3.2 `Job`与`Job`之间的抢占

在同一`Queue`内，`Job`之间的抢占遵循以下规则：

1. **优先级决定性**：高优先级`Job`可以抢占低优先级`Job`的资源
2. **创建时间**：当优先级相同时，通常先创建的`Job`优先级更高
3. **最小资源**：每个`Job`的`minAvailable`资源需求会影响抢占决策
4. **Gang调度**：支持`All-or-Nothing`的调度模式，确保作业完整性

抢占过程：
1. `Volcano`检测到高优先级`Job`资源不足
2. 根据`PriorityClass`和创建时间选择同一`Queue`中优先级较低的`Job`
3. 从低优先级`Job`中选择可抢占的`Pod`
4. 驱逐选中的`Pod`，释放资源给高优先级`Job`

### 3.3 `Pod`与`Pod`之间的抢占

在同一`Job`内，`Pod`之间的抢占遵循以下规则：

1. **task-priority决定性**：高`task-priority`的`Pod`可以抢占低`task-priority`的`Pod`
2. **可抢占性**：只有标记为可抢占(`preemptable=true`)的`Pod`才能被抢占
3. **BestEffort限制**：`BestEffort Pod`不能抢占非`BestEffort Pod`
4. **状态限制**：只有处于`Running`状态的`Pod`才能被抢占

抢占过程：
1. `Volcano`检测到高优先级`Pod`无法调度
2. 根据任务优先级找到同一`Job`中优先级较低的`Pod`
3. 检查`Pod`的可抢占性和其他约束条件
4. 驱逐选中的`Pod`，释放资源给高优先级`Pod`

### 3.4 跨层级抢占的优先顺序

当涉及跨层级的资源抢占时，`Volcano`遵循以下优先顺序：

1. **Queue优先级最高**：不同`Queue`之间的优先级高于`Queue`内部的`Job`优先级
2. **Job优先级次之**：同一`Queue`内不同`Job`之间的优先级高于`Job`内部的`Pod`优先级
3. **Pod优先级最低**：同一`Job`内不同`Pod`之间的优先级最低

这意味着：
- 即使是低优先级`Queue`中的高优先级`Job`，也会被高优先级`Queue`中的低优先级`Job`抢占
- 即使是低优先级`Job`中的高`task-priority` `Pod`，也会被高优先级`Job`中的低`task-priority` `Pod`抢占

> **重要说明**：要实现这种层级化的资源抢占机制，**必须统一使用Volcano调度器**。在所有需要参与这种资源管理的`Job`中指定`schedulerName: volcano`。如果混用不同的调度器（如`Kubernetes`默认调度器），将无法保证这种层级化的资源抢占机制正常工作，因为其他调度器不理解`Queue`概念和层级关系。

## 4. 实际应用场景与最佳实践

### 4.1 多租户资源管理

在多租户环境中，可以为不同部门或团队创建独立的`Queue`，通过优先级和资源配额实现资源隔离和保障：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: production
spec:
  weight: 20
  capability:
    cpu: 1000
    memory: 2000Gi
  guarantee:
    cpu: 500
    memory: 1000Gi
  priority: 100
---
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: development
spec:
  weight: 10
  capability:
    cpu: 500
    memory: 1000Gi
  priority: 50
```

### 4.2 关键业务保障

对于关键业务，可以设置高优先级和不可抢占属性，确保资源稳定性：

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: critical-service
value: 1000000
globalDefault: false
description: "Critical business services"
---
apiVersion: v1
kind: Pod
metadata:
  name: critical-service-pod
  annotations:
    volcano.sh/preemptable: "false"
spec:
  priorityClassName: critical-service
  schedulerName: volcano
```

### 4.3 AI训练任务优化

对于`AI`训练任务，可以通过`Gang`调度和任务内部优先级优化资源利用：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: training-job
spec:
  minAvailable: 4
  priorityClassName: high-priority
  queue: research
  tasks:
    - replicas: 1
      name: ps
      template:
        metadata:
          annotations:
            volcano.sh/task-priority: "10"  # 参数服务器优先级高
            volcano.sh/preemptable: "false" # 参数服务器不可抢占
    - replicas: 3
      name: worker
      template:
        metadata:
          annotations:
            volcano.sh/task-priority: "5"    # 工作节点优先级低
            volcano.sh/preemptable: "true"   # 工作节点可被抢占
```

### 4.4 混合负载管理

在同时运行在线服务和批处理作业的环境中，可以通过优先级和抢占机制实现资源平衡：

- 为在线服务创建高优先级`Queue`，设置适当的`guarantee`资源
- 为批处理作业创建低优先级`Queue`，允许被抢占
- 对关键批处理作业设置较高的`Job`优先级，但低于在线服务`Queue`的优先级

## 5. 总结

`Volcano`的资源抢占设计提供了一个层级化、灵活且强大的资源管理机制，通过`Queue`、`Job`和`Pod`三个层级的抢占关系，满足了复杂环境下的资源调度需求。

核心优势包括：

1. **多层级抢占**：支持从`Queue`到`Pod`的完整抢占体系
2. **灵活配置**：提供丰富的配置选项，适应不同场景需求
3. **公平性保障**：通过多种算法确保资源分配的公平性
4. **作业感知**：理解批处理作业的特性，支持Gang调度等高级特性
5. **多租户支持**：为多租户环境提供资源隔离和保障机制

通过合理配置`Volcano`的资源抢占机制，可以显著提高集群资源利用率，同时确保关键业务的资源保障，为AI训练、高性能计算和混合负载环境提供强大的调度支持。
