---
slug: "/cloud-native/volcano-examples"
title: "Volcano使用示例"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "使用示例", "Queue", "Gang调度", "Pod", "Deployment", "Job", "调度器", "队列管理", "资源分配", "批处理", "分布式训练"
  ]
description: "本文提供了Volcano在Kubernetes中的实际使用示例，包括Pod和Deployment如何使用队列进行调度，以及Gang调度的配置和使用方法，帮助用户快速上手Volcano调度器。"
---


## pod/deployment使用队列

创建测试队列：
```yaml title="test-queue.yaml"
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: test-queue
spec:
  capability:
    cpu: 10
    memory: 10Gi
```

通过`Pod`测试：
```yaml title="example-pod.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
  annotations:
    # 需要注意，只能使用annotations，不能使用labels指定队列，
    # 否则无法设置队列，生成的PodGroup的队列名称为默认的default
    scheduling.volcano.sh/queue-name: "test-queue"
spec:
  schedulerName: volcano
  containers:
  - name: example-container
    image: nginx
```

通过`Deployment`测试：
```yaml title="example-deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: example-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
      annotations:
        # 只能在annotations中设置队列名称，不能在labels中设置
        # 只能这里设置队列名称，不能在Deployment的annotations中设置
        scheduling.volcano.sh/queue-name: "test-queue"
    spec:
      schedulerName: volcano
      containers:
      - name: nginx
        image: nginx:1.14.2
```


## gang调度

创建一个限制资源上限的队列：
```yaml title="test-gang-queue.yaml"
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: test-gang-queue
spec:
  capability:
    cpu: 2
    memory: 2Gi
```

创建一个`gang`调度的`Job`：
```yaml title="test-gang-job.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: test-gang-job
spec:
  minAvailable: 5
  schedulerName: volcano
  queue: test-gang-queue
  policies:
  - action: CompleteJob
    event: TaskCompleted
  tasks:
  - replicas: 5
    name: worker
    template:
      spec:
        restartPolicy: Never
        containers:
        - image: alpine:latest
          imagePullPolicy: IfNotPresent
          name: worker
          command: ["sh", "-c", "sleep 1d"]
          resources:
            requests:
              cpu: 1
              memory: 100Mi
```

`Job`中的所有`Pod`都不会创建出来，因为队列的`CPU`资源上限为`2`，而`Job`中的`Pod`需要`5`个`CPU`。