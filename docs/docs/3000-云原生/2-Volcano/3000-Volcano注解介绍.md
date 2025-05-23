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
|`volcano.sh/task-spec`|`Pod`| 指定`Pod`所属的任务类型 |`"default"`|
|`volcano.sh/min-available`|`PodGroup`| 指定`PodGroup`最小可用`Pod`数量 |`"3"`|
|`volcano.sh/priorityClassName`|`PodGroup`| 指定`PodGroup`的优先级类名 |`"high-priority"`|
|`volcano.sh/task-priority`|`Pod`| 指定`Pod`在任务中的优先级 |`"10"`|
|`volcano.sh/closed-by-parent`|`Queue`| 标记队列是否由父队列关闭 |`"true"`|
|`volcano.sh/createdByJobTemplate`|`Job`| 标记`Job`是否由作业模板创建 |`"template-name"`|
|`volcano.sh/createdByJobFlow`|`Job`| 标记`Job`是否由作业流创建 |`"flow-name"`|
|`scheduling.volcano.sh/preemptable`|`Pod`| 标记`Pod`是否可被抢占（调度器插件使用） |`"true"`,`"false"`|

## 注解使用示例

1. **将`Pod`分配到特定队列**

    ```yaml
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

2. **设置`PodGroup`的最小可用数量**

    ```yaml
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: PodGroup
    metadata:
      name: example-podgroup
      annotations:
        volcano.sh/min-available: "3"
    spec:
      minMember: 5
      queue: default
    ```

3. **标记 Pod 为可抢占**

    可抢占（`Preemptable`）是`Volcano`中的一个重要概念，它允许集群在资源紧张时为高优先级任务让出资源。当标记为可抢占时：
    
    - 该`Pod`可能会在运行过程中被终止，以释放资源给更高优先级的任务
    - 适用于容错性高、可以中断的工作负载，如批处理任务、后台分析等
    - 可以提高集群资源利用率，允许低优先级任务在资源空闲时运行，高优先级任务来时自动让出

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
    
    当集群资源紧张时，调度器会优先抢占标记为`volcano.sh/preemptable: "true"`的`Pod`，而不是随机选择。这使得集群管理员可以明确指定哪些工作负载可以被安全地中断。

## 注解的优势

使用注解控制`Volcano`行为有以下优势：

1. **简单易用**：无需创建复杂的自定义资源，只需添加注解即可
2. **灵活性**：可以针对单个`Pod`或`PodGroup`进行精细控制
3. **兼容性**：与现有`Kubernetes`工作负载控制器（如`Deployment`、`StatefulSet`）良好集成
4. **动态调整**：可以通过更新注解动态调整调度行为，而无需重启组件

通过合理使用这些注解，用户可以更精细地控制`Volcano`的调度行为，满足不同场景下的资源分配和调度需求。
