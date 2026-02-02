---
slug: "/ai/ray/volcano-ray-plugin"
title: "通过Volcano Job插件部署使用Ray"
hide_title: true
keywords:
  [
    "Volcano",
    "Ray",
    "分布式训练",
    "任务调度",
    "插件机制",
    "Kubernetes",
    "批处理调度",
    "集群管理",
    "Ray Cluster",
    "容器编排",
    "云原生",
    "深度学习",
    "机器学习",
    "分布式计算",
    "AI训练",
    "资源调度",
    "Pod管理",
    "Service发现",
    "Worker节点",
    "Head节点"
  ]
description: "深入介绍Volcano Job的插件机制以及Ray插件的配置和使用方法。详细讲解Volcano如何通过插件扩展支持不同的分布式训练框架，重点介绍Ray插件的工作原理、配置参数、使用方法和完整示例。通过实战案例演示如何在Kubernetes集群中使用Volcano Job运行Ray分布式计算任务，包括集群创建、任务提交、服务发现等核心功能，帮助开发者快速掌握在云原生环境下使用Ray进行分布式训练的完整流程。"
---



## Volcano Job插件机制概述

`Volcano`是一个基于`Kubernetes`的批处理调度系统，专为高性能计算、大数据和机器学习等场景设计。为了支持不同的分布式训练框架，`Volcano Job`提供了灵活的插件机制，允许用户通过配置不同的插件来适配各种分布式计算框架的特定需求。

### 插件机制工作原理

`Volcano Job`插件机制通过以下方式工作：

1. **插件接口定义**：`Volcano`定义了标准的插件接口`PluginInterface`，所有插件必须实现该接口
2. **生命周期钩子**：插件可以在`Job`和`Pod`的不同生命周期阶段执行自定义逻辑
3. **资源管理**：插件可以自动创建和管理相关资源（如`Service`、`ConfigMap`等）
4. **配置灵活性**：用户可以在`Job`规范中声明需要使用的插件及其参数

### 插件接口定义

所有`Volcano`插件都需要实现以下核心接口：

```go
type PluginInterface interface {
    // 返回插件的唯一名称
    Name() string

    // 在Pod创建时被调用，可以修改Pod规范
    OnPodCreate(pod *v1.Pod, job *vcbatch.Job) error

    // 在Job创建时被调用，可以执行初始化操作
    OnJobAdd(job *vcbatch.Job) error

    // 在Job删除时被调用，可以执行清理操作
    OnJobDelete(job *vcbatch.Job) error

    // 在Job更新时被调用
    OnJobUpdate(job *vcbatch.Job) error
}
```

### 支持的分布式训练框架插件

`Volcano`内置支持多种分布式训练框架的插件，以下是当前支持的主要框架：

| 插件名称 | 框架 | 主要用途 | 核心功能 |
|---------|------|---------|---------|
| `tensorflow` | `TensorFlow` | 深度学习分布式训练 | 自动配置`TF_CONFIG`环境变量，支持`PS-Worker`架构 |
| `pytorch` | `PyTorch` | 深度学习分布式训练 | 配置分布式训练所需的环境变量，支持多种后端 |
| `mpi` | `MPI` | 高性能计算、科学计算 | 配置`SSH`免密、生成`hostfile`，支持`MPI`作业 |
| `ray` | `Ray` | 通用分布式计算 | 自动创建`Ray Cluster`，配置`Head`和`Worker`节点 |
| `hcclrank` | `HCCL` | 华为昇腾分布式训练 | 配置华为昇腾芯片的分布式训练环境 |
| `ssh` | 通用 | 节点间通信 | 配置`Pod`间的`SSH`免密访问 |
| `svc` | 通用 | 服务发现 | 为每个`Pod`创建独立的`Service` |
| `env` | 通用 | 环境变量注入 | 自动注入任务相关的环境变量 |

## Ray插件详解

`Ray`是一个开源的分布式计算框架，专为构建分布式应用和实现机器学习工作负载而设计。`Volcano`的`Ray`插件使得在`Kubernetes`上运行`Ray`集群变得简单高效。

### Ray插件的工作原理

`Ray`插件在`Volcano Job`运行期间执行以下核心操作：

1. **自动配置Head节点**
   - 在`Head`节点容器中注入启动命令：`ray start --head`
   - 配置并开放必要的端口（`GCS`端口、`Dashboard`端口、`Client`端口）
   - 创建`Service`用于服务发现

2. **自动配置Worker节点**
   - 在`Worker`节点容器中注入启动命令：`ray start --address=<head-address>`
   - 自动解析`Head`节点地址并连接

3. **服务发现管理**
   - 为`Head`节点创建`Kubernetes Service`
   - `Service`名称格式：`<job-name>-head-svc`
   - `Worker`节点通过`Service`发现并连接到`Head`节点

### Ray插件配置参数

`Ray`插件支持以下配置参数（通过插件参数传递）：

| 参数名称 | 默认值 | 说明 |
|---------|-------|------|
| `head` | `head` | `Head`节点的任务名称 |
| `headContainer` | `head` | `Head`节点的容器名称 |
| `worker` | `worker` | `Worker`节点的任务名称 |
| `workerContainer` | `worker` | `Worker`节点的容器名称 |
| `port` | `6379` | `Ray GCS(Global Control Storage)`端口 |
| `dashboardPort` | `8265` | `Ray Dashboard`端口 |
| `clientPort` | `10001` | `Ray Client API`端口 |

### 插件创建的资源

`Ray`插件会自动创建以下`Kubernetes`资源：

**Service资源**：为`Head`节点创建的`Service`，包含以下端口映射：

| 端口名称 | 端口号 | 用途说明 |
|---------|-------|---------|
| `gcs` | `6379` | 用于`Ray GCS`通信 |
| `dashboard` | `8265` | 用于访问`Ray Dashboard` |
| `client-server` | `10001` | 用于`Ray Client API` |

## Ray插件使用方法

### 基本配置示例

以下是使用`Ray`插件的最简单配置：

> `Ray`的官方镜像仓库为：https://hub.docker.com/r/rayproject/ray ，为简化示例，这里使用精简版的`rayproject/ray:latest-py311-cpu-aarch64`镜像。作者本机是`arm64`系统，请读者根据实际环境选择合适的镜像。

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ray-cluster-job
spec:
  minAvailable: 3
  schedulerName: volcano
  plugins:
    ray: []  # 启用Ray插件，使用默认配置
  queue: default
  tasks:
    - replicas: 1
      name: head  # 必须有一个名为head的任务
      template:
        spec:
          containers:
            - name: head  # 容器名称必须为head
              image: rayproject/ray:latest-py311-cpu-aarch64
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
          restartPolicy: OnFailure
    - replicas: 2
      name: worker  # worker任务
      template:
        spec:
          containers:
            - name: worker  # 容器名称必须为worker
              image: rayproject/ray:latest-py311-cpu-aarch64
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
          restartPolicy: OnFailure
```

### 自定义配置示例

如果需要自定义任务名称、容器名称或端口，可以通过插件参数配置：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ray-cluster-custom
spec:
  minAvailable: 3
  schedulerName: volcano
  plugins:
    ray: 
      - "--head=ray-head"
      - "--headContainer=ray-head-container"
      - "--worker=ray-worker"
      - "--workerContainer=ray-worker-container"
      - "--port=6380"
      - "--dashboardPort=8266"
      - "--clientPort=10002"
  queue: default
  tasks:
    - replicas: 1
      name: ray-head
      template:
        spec:
          containers:
            - name: ray-head-container
              image: rayproject/ray:latest-py311-cpu-aarch64
              resources:
                requests:
                  cpu: "2"
                  memory: "4Gi"
          restartPolicy: OnFailure
    - replicas: 3
      name: ray-worker
      template:
        spec:
          containers:
            - name: ray-worker-container
              image: rayproject/ray:latest-py311-cpu-aarch64
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
          restartPolicy: OnFailure
```

## 完整运行示例

下面提供一个完整的、可运行的示例，演示如何使用`Volcano Job`的`Ray`插件执行一个简单的分布式计算任务。

### 准备工作

**前提条件**：
- 已安装`Kubernetes`集群（版本`1.20+`）
- 已安装`Volcano`调度器（版本`1.8+`）
- 已创建`default`队列

**安装Volcano**：

```bash
# 安装Volcano
kubectl apply -f https://raw.githubusercontent.com/volcano-sh/volcano/master/installer/volcano-development.yaml

# 验证安装
kubectl get pods -n volcano-system
```

### 创建Ray计算任务

创建一个简单的`Python`脚本，执行分布式计算：

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: ray-job-code
data:
  job.py: |
    import ray
    import time
    
    # 连接到Ray集群
    ray.init(address='auto')
    
    print(f"Ray cluster resources: {ray.cluster_resources()}")
    print(f"Available nodes: {len(ray.nodes())}")
    
    # 定义一个远程函数
    @ray.remote
    def compute_square(x):
        time.sleep(1)
        return x * x
    
    # 并行计算
    numbers = range(10)
    futures = [compute_square.remote(i) for i in numbers]
    results = ray.get(futures)
    
    print(f"Input numbers: {list(numbers)}")
    print(f"Squared results: {results}")
    print("Job completed successfully!")
```

### 创建Volcano Job

创建`Volcano Job`来运行`Ray`集群：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ray-compute-job
spec:
  minAvailable: 3
  schedulerName: volcano
  plugins:
    ray: []
  policies:
    - event: PodEvicted
      action: RestartJob
  queue: default
  tasks:
    # Head节点 - 运行Ray集群的主节点
    - replicas: 1
      name: head
      policies:
        - event: TaskCompleted
          action: CompleteJob
      template:
        spec:
          containers:
            - name: head
              image: rayproject/ray:latest-py311-cpu-aarch64
              command:
                - /bin/bash
                - -c
                - |
                  # 等待Ray Head启动
                  sleep 10
                  # 提交Ray任务
                  python /mnt/job/job.py
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
                limits:
                  cpu: "2"
                  memory: "4Gi"
              volumeMounts:
                - name: job-code
                  mountPath: /mnt/job
          volumes:
            - name: job-code
              configMap:
                name: ray-job-code
          restartPolicy: OnFailure
    
    # Worker节点 - 运行计算任务的工作节点
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: worker
              image: rayproject/ray:latest-py311-cpu-aarch64
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
                limits:
                  cpu: "2"
                  memory: "4Gi"
          restartPolicy: OnFailure
```

### 部署和运行

按照以下步骤部署和运行示例：

```bash
# 1. 创建ConfigMap（包含Python代码）
kubectl apply -f ray-job-code.yaml

# 2. 创建Volcano Job
kubectl apply -f ray-compute-job.yaml

# 3. 查看Job状态
kubectl get vcjob ray-compute-job

# 4. 查看Pods
kubectl get pods -l volcano.sh/job-name=ray-compute-job

# 5. 查看Head节点Service
kubectl get svc ray-compute-job-head-svc

# 6. 查看Head节点日志（查看计算结果）
kubectl logs -l volcano.sh/job-name=ray-compute-job,volcano.sh/task-spec=head -f

# 7. 访问Ray Dashboard（可选）
kubectl port-forward svc/ray-compute-job-head-svc 8265:8265
# 然后在浏览器访问 http://localhost:8265
```

### 预期输出

如果一切正常，你应该在`Head`节点的日志中看到类似以下的输出：

```
Ray cluster resources: {'CPU': 4.0, 'memory': 8589934592, ...}
Available nodes: 3
Input numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
Squared results: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
Job completed successfully!
```

### 清理资源

完成实验后，清理创建的资源：

```bash
# 删除Volcano Job
kubectl delete vcjob ray-compute-job

# 删除ConfigMap
kubectl delete configmap ray-job-code

# 验证资源已删除
kubectl get vcjob
kubectl get pods -l volcano.sh/job-name=ray-compute-job
```

## 高级用法和最佳实践

### 使用GPU资源

如果需要使用`GPU`进行训练，可以这样配置：

```yaml
resources:
  requests:
    nvidia.com/gpu: "1"
  limits:
    nvidia.com/gpu: "1"
```

### 持久化存储

对于需要持久化数据的场景，可以挂载`PVC`：

```yaml
volumes:
  - name: data
    persistentVolumeClaim:
      claimName: ray-data-pvc
volumeMounts:
  - name: data
    mountPath: /data
```

## 常见问题

### Worker无法连接到Head节点

**问题描述**：`Worker`节点无法连接到`Head`节点。

**解决方案**：
1. 检查`Service`是否正确创建：`kubectl get svc <job-name>-head-svc`
2. 确认任务名称为`head`且容器名称为`head`（或使用自定义配置）
3. 检查网络策略是否允许`Pod`间通信

### 端口冲突

**问题描述**：多个`Ray`任务同时运行时端口冲突。

**解决方案**：
- 为不同的任务使用不同的端口配置
- 确保每个`Job`使用不同的命名空间

### 任务无法完成

**问题描述**：任务长时间处于`Running`状态。

**解决方案**：
1. 添加`TaskCompleted`策略：
   ```yaml
   policies:
     - event: TaskCompleted
       action: CompleteJob
   ```
2. 确保`Head`任务在完成后正常退出

