---
slug: "/cloud-native/volcano-examples"
title: "Volcano使用示例"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "调度器", "资源管理", "Gang Scheduling", "Queue", "PodGroup", "Job", "Deployment", "资源限制", "并发控制"
  ]
description: "本文通过实际示例展示如何使用Volcano调度器控制Kubernetes资源使用，包括限制Deployment的CPU使用和配置Job的并发执行，详细介绍了Volcano队列、策略和任务生命周期管理的实际应用。"
---


## 配置 Deployment 使用 Volcano 控制资源使用

这里举一个示例，限制`Deployment`最多仅能使用 2 核 CPU。

1. 创建队列
   ```yaml
    apiVersion: scheduling.volcano.sh/v1beta1
    kind: Queue
    metadata:
      name: my-node-queue
    spec:
      weight: 1
      reclaimable: false
      capability:
        cpu: 2
   ```
    创建一个仅有 2 核 CPU、并且绑定到节点组`my-node-group`的队列。这里的`weight`表示集群资源划分中所占的相对比重，是软约束;`reclaimable`表示是否允许被回收，由`weight`来决定;`capability`表示队列的资源限制。

2. 创建`Deployment`
   ```yaml
    apiVersion: apps/v1
    kind: Deployment
    metadata:
      name: ubuntu-with-volcano
      labels:
        app: demo
    spec:
      replicas: 1
      selector:
        matchLabels:
          app: demo
      template:
        metadata:
          labels:
            app: demo
        spec:
          schedulerName: volcano
          containers:
            - name: demo
              image: shaowenchen/demo-ubuntu
              resources:
                requests:
                  cpu: 1
   ```
    将`schedulerName`设置为`volcano，表示使用``Volcano`调度器。

3. 查看`Pod`
   ```bash
    $ kubectl get pods -l app=demo
    NAME                                  READY   STATUS    RESTARTS   AGE
    ubuntu-with-volcano-97c94f9fb-bfgrh   1/1     Running   0          6m24s
   ```
4. 扩容`Deployment`
   ```bash
    $ kubectl scale deployment/ubuntu-with-volcano --replicas=3
   ```
    此时，三个 Pod 只有两个处于 Running 状态，因为 Volcano 限制了 Deployment 最多仅能使用 2c CPU。
   ```bash
    $ kubectl get pods -l app=demo

    NAME                                  READY   STATUS    RESTARTS   AGE
    ubuntu-with-volcano-97c94f9fb-25nb7   1/1     Running   0          27s
    ubuntu-with-volcano-97c94f9fb-6fd64   0/1     Pending   0          27s
    ubuntu-with-volcano-97c94f9fb-bfgrh   1/1     Running   0          7m31s
   ```

## 配置Job使用Volcano限流并发执行

这里创建一个`Job`并且要求至少 3 个`Pod`一起运行的`Job。`

直接使用`Kubernetes batch/v1`中的`Job`，配置`completions`和`parallelism`，也可以实现这个需求。但`Volcano`提供的`Queue`可以控制资源使用、`Policy`可以控制`Task`的生命周期策略，能更精准控制`Job`的执行。

1. 创建`Job`
   ```yaml
    apiVersion: batch.volcano.sh/v1alpha1
    kind: Job
    metadata:
      name: my-job
    spec:
      minAvailable: 3
      schedulerName: volcano
      queue: default
      policies:
        - event: PodEvicted
          action: RestartJob
      tasks:
        - replicas: 30
          name: demo
          policies:
          - event: TaskCompleted
            action: CompleteJob
          template:
            spec:
              containers:
                - image: ubuntu
                  name: demo
                  command: ["sleep", "5"]
                  resources:
                    requests:
                      cpu: 20
              restartPolicy: Never
    ```
    其中:
    ```yaml
    policies:
      - event: PodEvicted
        action: RestartJob
    ```
    表示如果`Pod`被`Evict`了，就重启`Job`。
    ```yaml
    policies:
      - event: TaskCompleted
        action: CompleteJob
    ```
    表示如果`Task`完成了，就完成`Job`。

    通过`Event`和`Action`，可以控制`Job`的状态和行为。

2. 查看`Pod`创建情况
    ```bash
    $ kubectl get pod

    NAME                            READY   STATUS    RESTARTS   AGE
    my-job-demo-0                   1/1     Running   0          7s
    my-job-demo-1                   1/1     Running   0          7s
    my-job-demo-10                  0/1     Pending   0          7s
    ...
    my-job-demo-2                   1/1     Running   0          7s
    ...
    ```
    由于我设置了`Pod`的`CPU Request`为 20，集群上没有足够的资源，所以 30 个`Pod`每次只能运行 3 个。

    执行完成之后，`Pod`不会被删除而是处于`Completed`状态。由于`Pod`的`ownerReferences`是`Job`，如果删除`Job`，`Pod`也会被删除。



