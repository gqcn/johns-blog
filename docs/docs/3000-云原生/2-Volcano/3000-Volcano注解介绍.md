---
slug: "/cloud-native/volcano-annotations"
title: "Volcano注解介绍"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "Annotations", "注解", "PodGroup", "Pod", "调度器", "queue-name", "preemptable", "min-available", "资源分配", "调度策略"
  ]
description: "本文详细介绍了Volcano提供的各种注解（Annotations）及其在Pod和PodGroup资源上的应用，包括队列指定、资源预留、最小可用数量和优先级设置等，并提供了实际使用示例和最佳实践。"
---


`Volcano`提供了一系列注解（`Annotations`），可以应用于`Pod`或`PodGroup`资源，用于控制调度行为和资源分配。这些注解提供了一种简单而强大的方式来影响`Volcano`的调度决策，而无需修改复杂的配置文件或自定义资源定义。

## 常用注解及其作用

| 注解 | 适用对象 | 作用 | 示例值 |
|------|---------|------|--------|
|`volcano.sh/queue-name`|`Pod, PodGroup`| 指定资源应该被分配到哪个队列 |`"default"`|
|`volcano.sh/preemptable`|`Pod`| 标记`Pod`是否可被抢占 |`"true"`,`"false"`|
|`volcano.sh/task-spec`|`Pod`| 指定`Pod`所属的任务类型 |`"worker"`|
|`volcano.sh/min-available`|`PodGroup`| 指定`PodGroup`最小可用`Pod`数量 |`"3"`|
|`volcano.sh/priorityClassName`|`PodGroup`| 指定`PodGroup`的优先级类名 |`"high-priority"`|
|`volcano.sh/task-priority`|`Pod`| 指定`Pod`在任务中的优先级 |`"10"`|
|`volcano.sh/closed-by-parent`|`Queue`| 标记队列是否由父队列关闭 |`"true"`|
|`volcano.sh/createdByJobTemplate`|`Job`| 标记`Job`是否由作业模板创建 |`"template-name"`|
|`volcano.sh/createdByJobFlow`|`Job`| 标记`Job`是否由作业流创建 |`"flow-name"`|
|`scheduling.volcano.sh/preemptable`|`Pod`| 标记`Pod`是否可被抢占（调度器插件使用） |`"true"`,`"false"`|

## 注解详细说明

下面是每个注解的详细说明和使用示例。

### 1. `volcano.sh/queue-name`

**作用**：指定资源应该被分配到哪个队列。这个注解可以应用于`Pod`或`PodGroup`。

**重要性**：队列是`Volcano`资源管理的基本单位，指定队列可以确保资源被正确分配并遵循队列的资源配额和策略。

**示例**：

```yaml
# 在Pod上使用
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
  annotations:
    volcano.sh/queue-name: "high-priority-queue"
spec:
  schedulerName: volcano
  containers:
  - name: example-container
    image: nginx
```

```yaml
# 在PodGroup上使用
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: example-podgroup
  annotations:
    volcano.sh/queue-name: "high-priority-queue"
spec:
  minMember: 3
```

### 2. `volcano.sh/preemptable`

**作用**：标记`Pod`是否可被抢占。当设置为`"true"`时，表示该`Pod`可以被高优先级的`Pod`抢占资源。

**重要性**：在资源紧张时，标记为可抢占的`Pod`可能会被终止以释放资源给高优先级任务。这对于区分关键和非关键工作负载非常重要。

**示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: preemptable-pod
  annotations:
    volcano.sh/preemptable: "true"
spec:
  schedulerName: volcano
  containers:
  - name: example-container
    image: nginx
```

### 3. `volcano.sh/task-spec`

**作用**：指定`Pod`所属的任务类型。在分布式训练任务中，不同的`Pod`可能有不同的角色（如参数服务器、工作节点等）。

**重要性**：这个注解帮助调度器识别`Pod`的角色，从而应用相应的调度策略。对于需要特定网络拓扑的任务（如高性能计算），这一点尤为重要。

**示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: worker-pod
  annotations:
    volcano.sh/task-spec: "worker"
spec:
  schedulerName: volcano
  containers:
  - name: worker-container
    image: tensorflow/tensorflow:latest-gpu
```

### 4. `volcano.sh/min-available`

**作用**：指定`PodGroup`最小可用`Pod`数量。只有当可用的`Pod`数量达到或超过这个值时，`PodGroup`才会被调度。

**重要性**：这个注解是`Volcano`实现Gang调度（整体调度）的关键。它确保了分布式任务的所有必要组件都能同时启动，避免资源浪费和死锁。

**示例**：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: distributed-training
spec:
  minMember: 3  # 等同于使用 volcano.sh/min-available: "3" 注解
```

### 5. `volcano.sh/priorityClassName`

**作用**：指定`PodGroup`的优先级类名。这个类名对应于`Kubernetes`中定义的`PriorityClass`资源。

**重要性**：当资源紧张时，高优先级的`PodGroup`可以抢占低优先级的`PodGroup`资源。这对于确保关键任务在资源竞争中获得优先处理非常重要。

**示例**：

```yaml
# 首先定义PriorityClass
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 1000000
globalDefault: false
description: "This priority class should be used for critical jobs"
---
# 然后在PodGroup中使用
apiVersion: scheduling.volcano.sh/v1beta1
kind: PodGroup
metadata:
  name: critical-job
  annotations:
    volcano.sh/priorityClassName: "high-priority"
spec:
  minMember: 3
```

### 6. `volcano.sh/task-priority`

**作用**：指定`Pod`在任务中的优先级。这个优先级值是一个整数，值越高表示优先级越高。

**重要性**：在复杂的工作流中，某些`Pod`可能需要先于其他`Pod`运行。这个注解允许在同一任务内设置不同的优先级。

**示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: high-priority-task
  annotations:
    volcano.sh/task-priority: "10"
spec:
  schedulerName: volcano
  containers:
  - name: task-container
    image: my-task-image
```

### 7. `volcano.sh/closed-by-parent`

**作用**：标记队列是否由父队列关闭。当设置为`"true"`时，表示该队列是因为其父队列关闭而关闭的。

**重要性**：在层级队列结构中，这个注解用于跟踪队列关闭的原因，帮助系统管理队列状态。

**示例**：

```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: child-queue
  annotations:
    volcano.sh/closed-by-parent: "true"
spec:
  weight: 1
```

### 8. `volcano.sh/createdByJobTemplate`

**作用**：标记`Job`是否由作业模板创建。当设置为特定值时，表示该`Job`是由指定的模板创建的。

**重要性**：这个注解用于跟踪`Job`的来源，帮助系统管理和组织相关的作业。

**示例**：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: templated-job
  annotations:
    volcano.sh/createdByJobTemplate: "ml-training-template"
spec:
  minAvailable: 3
  schedulerName: volcano
  # 其他作业配置...
```

### 9. `volcano.sh/createdByJobFlow`

**作用**：标记`Job`是否由作业流创建。当设置为特定值时，表示该`Job`是由指定的作业流创建的。

**重要性**：这个注解用于跟踪复杂工作流中的`Job`关系，帮助系统管理和组织相关的作业。

**示例**：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: flow-job
  annotations:
    volcano.sh/createdByJobFlow: "data-processing-flow"
spec:
  minAvailable: 2
  schedulerName: volcano
  # 其他作业配置...
```

### 10. `scheduling.volcano.sh/preemptable`

**作用**：标记`Pod`是否可被抢占（调度器插件使用）。这个注解与`volcano.sh/preemptable`类似，但是由调度器插件直接使用。

**重要性**：当资源紧张时，调度器插件会参考这个注解来决定哪些`Pod`可以被终止以释放资源。

**示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: preemptable-pod
  annotations:
    scheduling.volcano.sh/preemptable: "true"
spec:
  schedulerName: volcano
  containers:
  - name: example-container
    image: nginx
```

## 注解的优势

使用注解控制`Volcano`行为有以下优势：

1. **简单易用**：无需创建复杂的自定义资源，只需添加注解即可
2. **灵活性**：可以针对单个`Pod`或`PodGroup`进行精细控制
3. **兼容性**：与现有`Kubernetes`工作负载控制器（如`Deployment`、`StatefulSet`）良好集成
4. **动态调整**：可以通过更新注解动态调整调度行为，而无需重启组件

通过合理使用这些注解，用户可以更精细地控制`Volcano`的调度行为，满足不同场景下的资源分配和调度需求。
