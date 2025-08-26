---
slug: "/cloud-native/volcano-hierarchy-queue-notes"
title: "Volcano层级队列使用的一些笔记"
hide_title: true
keywords:
  [
    "Volcano",
    "Kubernetes",
    "层级队列",
    "capacity插件",
    "hierarchy队列",
    "队列配额",
    "root队列",
    "guarantee配额",
    "capability配额",
    "deserved配额",
    "TaskStatus",
    "AllocatedStatus",
    "Pod调度",
    "资源管理",
    "云原生调度",
    "enableHierarchy",
    "叶子节点",
    "队列层级",
    "资源预留",
    "调度器配置"
  ]
description: "基于Volcano源码分析和实践经验总结的层级队列使用笔记，涵盖root队列机制、capacity插件配置、guarantee与capability的区别、层级队列的配置规则、Pod状态与资源计算逻辑、以及常见调度问题的排查方法。"
---


> 以下笔记是在工作使用中，通过分析`volcano`源码，并且实践得到的经验。`volcano`源码版本为 `commit: 80eea1df4b922773c47ac4f8e483b48a3ccc7090`，最新提交时间：`Wed Aug 13 10:17:58 2025 +0800`。

## 默认root队列问题

1. `volcano`默认情况下会给创建的一级队列设置默认的父级队列为`root`队列。
2. `volcano`资源队列默认的`root`队列资源配额是集群的所有资源的总和（`nodes allocatable`），并且会随着节点变化或节点资源的变化而自动改变。
3. 当队列已分配的额度超过`root`队列时，`volcano`调度器将不在继续工作，出现系统性故障。
4. 具体请参考问题排查：[Volcano层级队列配置引发的调度器系统性故障问题](./5000-Volcano层级队列配置引发的调度器系统性故障问题.md)

## 层级队列的插件配置

层级队列的特性需要启用`capacity`插件，并且设置`enableHierarchy: true`。

```yaml title="volcano-scheduler-configmap.yaml"
apiVersion: v1
data:
  volcano-scheduler.conf: |
    actions: "enqueue, allocate, backfill"
    tiers:
    - plugins:
      - name: priority
      - name: gang
        enablePreemptable: false
      - name: conformance
    - plugins:
      - name: overcommit
      - name: drf
        enablePreemptable: false
      - name: predicates
      - name: capacity
        enableHierarchy: true
      - name: nodeorder
      - name: binpack
kind: ConfigMap
metadata:
  name: volcano-scheduler-configmap
  namespace: volcano-system
```

## capability、deserved与guarantee

1. 大部分使用场景下，不需要对队列设置`deserved`，只需要设置`guarantee`和`capability`即可。
2. `guarantee`是给队列的预留资源量，不管队列用不用，`volcano`调度器都会为该队列预留`guarantee`的资源量。
3. `capability`是队列的资源配额，当队列的资源使用量超过`capability`时，`volcano`调度器会拒绝该队列的资源申请。
4. 队列可以通过`guarantee`预留某一种资源，并且通过`capability`限制对该资源的最大使用量。在队列的`capability`和`guarantee`中不设置其他资源的配额时，表示该队列对集群中的其他资源使用集群中空余的资源。
    ```yaml title="test-queue-card.yaml"
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: test-queue-card
    spec:
      capability:
        nvidia.com/gpu: 2
      guarantee:
        resource:
          nvidia.com/gpu: 2
    ```


## 层级队列的guarantee与capability配置

1. `Volcano Job`或者`Pod`只能创建到队列的叶子节点上，否则任务无法创建成功，**并且会引发调度器系统性无法工作**。调度器日志中会出现类似如下的报错：
    ```text
    E0826 09:01:29.031005       1 capacity.go:551] The Queue <test-queue> of Job <volcano-system/podgroup-b82f796a-6767-46b9-94ad-b94ae7f7b695> is not leaf queue
    ```
2. 当子级队列设置有`guarantee`配额时，父级队列必须设置`guarantee`配额，并且父级队列的`guarantee`配额必须大于等于子级队列的`guarantee`配额。
3. 当子级队列设置有`capability`配额时，父级队列可以不设置`capability`配额，但如果父级队列设置了`capability`配额，那么父级队列的`capability`配额必须大于等于子级队列的`capability`配额。

    使用示例：
    ```yaml title="test-queue.yaml"
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: test-queue
    spec:
      guarantee:
        resource:
          cpu: 2
          memory: 2Gi
    ```

    ```yaml title="test-queue2.yaml"
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: test-queue2
    spec:
      parent: test-queue
      capability:
        cpu: 2
        memory: 2Gi
      guarantee:
        resource:
          cpu: 2
          memory: 2Gi
    ```

4. 子级可以设置`capability`和`guarantee`，表示对该队列预留了资源并且设置了资源上限。父级可以只设置`guarantee`，不需要设置`capability`。并且父级队列的`guarantee`配额必须大于等于所有子级队列的`guarantee`配额。

    使用示例：
    
    层级关系：
    ```text
    test-queue
    ├── test-queue-card
    └── test-queue-cpu
    ```

    ```yaml title="test-queue.yaml"
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: test-queue
    spec:
      guarantee:
        resource:
          cpu: 2
          memory: 2Gi
          nvidia.com/gpu: 2
    ```
    
    ```yaml title="test-queue-card.yaml"
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: test-queue-card
    spec:
      capability:
        nvidia.com/gpu: 2
      guarantee:
        resource:
          nvidia.com/gpu: 2
    ```

    ```yaml title="test-queue-cpu.yaml"
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: test-queue-cpu
    spec:
      capability:
        cpu: 2
        memory: 2Gi
      guarantee:
        resource:
          cpu: 2
          memory: 2Gi
    ```

## Pod使用volcano队列

1. 如果`Pod`想要使用`volcano`队列：
    - 需要通过注解的形式注入队列名称，并且设置`Pod`的`schedulerName`为`volcano`。
    - 需要注意注解的键名为`scheduling.volcano.sh/queue-name`而不是`volcano.sh/queue-name`。
    - 队列的识别是由`volcano controller`实现的，`volcano controller`只识别通过注解方式注入的队列名称，不支持标签注入队列名称。
2. `volcano controller`会通过`Informer`机制监听所有`Pod`的创建，并判断`schedulerName`为`volcano`时才会纳入自身管理。`volcano controller`会为每个`Pod`创建对应的`PodGroup`，随后通过`PodGroup`的逻辑使用到`volcano`队列机制。
3. 通过`volcano job`创建的`Pod`中，`volcano`会将队列名称注入到`Pod`的标签和注解中，键名为`volcano.sh/queue-name`。注意该键名和手动为`Pod`注入`volcano`队列注解的键名不同。

## 哪些状态的Pod会被计入队列使用量

1. `volcano`将`Pod`包装为了`Task`，同时扩展了`Pod`的状态，叫做`TaskStatus`。`TaskStatus`的枚举值如下：
    ```go
    const (
      // Pending means the task is pending in the apiserver.
      Pending TaskStatus = 1 << iota

      // Allocated means the scheduler assigns a host to it.
      Allocated

      // Pipelined means the scheduler assigns a host to wait for releasing resource.
      Pipelined

      // Binding means the scheduler send Bind request to apiserver.
      Binding

      // Bound means the task/Pod bounds to a host.
      Bound

      // Running means a task is running on the host.
      Running

      // Releasing means a task/pod is deleted.
      Releasing

      // Succeeded means that all containers in the pod have voluntarily terminated
      // with a container exit code of 0, and the system is not going to restart any of these containers.
      Succeeded

      // Failed means that all containers in the pod have terminated, and at least one container has
      // terminated in a failure (exited with a non-zero exit code or was stopped by the system).
      Failed

      // Unknown means the status of task/pod is unknown to the scheduler.
      Unknown
    )
    ```
2. 只有`Bound, Binding, Running, Allocated`四种`TaskStatus`的`Pod`才会被计入队列使用量。关键的源码如下：
    ```go
    // 根据Pod生成TaskStatus
    func getTaskStatus(pod *v1.Pod) TaskStatus {
      switch pod.Status.Phase {
        case v1.PodRunning:
          if pod.DeletionTimestamp != nil {
            return Releasing
          }

          return Running
        case v1.PodPending:
          if pod.DeletionTimestamp != nil {
            return Releasing
          }

          if len(pod.Spec.NodeName) == 0 {
            return Pending
          }
          return Bound
        case v1.PodUnknown:
          return Unknown
        case v1.PodSucceeded:
          return Succeeded
        case v1.PodFailed:
          return Failed
      }

      return Unknown
    }

    // AllocatedStatus判断Pod是否计入队列使用量
    func AllocatedStatus(status TaskStatus) bool {
      switch status {
        case Bound, Binding, Running, Allocated:
          return true
        default:
          return false
      }
    }
    ```

3. 其中`Binding`和`Allocated`的状态计算较复杂，如果需要粗略计算，可以只关注`Bound`和`Running`状态即可。


## 常见调度问题排查

1. 队列配额设置不合理。如：
  - 父级队列有设置`guarantee`配额，并且该配额值小于所有子级队列的`guarantee`配额值之和
  - 父级队列有设置`capability`配额，并且该配额值小于所有子级队列的`capability`配额值之和
  - 这个时候可以查看`volcano`调度器日志，并通过`grep`关键字`than`来查看是否出现该问题，以及出现配额设置不正确的队列名称

2. 调度器系统性不工作。这个时候查看`volcano`调度器日志即可，默认每隔`1`秒钟就会执行`Session`的创建和关闭，会有大量的错误日志输出。

2. 队列资源确实不够用，`Pod`无法调度。如：
  - 其他队列使用了大量的`guarantee`配置，占用了集群资源，导致其他队列没有配置`guarantee`时，无法调度`Pod`。
  - 队列配置的`capability`资源确实不够用了，导致无法调度`Pod`。
  - 这种场景的问题不是很好排查，`volcano`调度器的日志不是很友好，只有自己编写工具排查并确定资源问题。