---
slug: "/ai/volcano-ray-plugin"
title: "通过Volcano Job插件部署使用Ray Cluster"
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

:::danger 重要说明
- 本文档基于`Volcano v1.13.0`版本编写和测试。
- 当前版本的`Ray`插件存在设计缺陷，无法支持自定义`command`指令，且`hostname`和`subdomain`配置无法正常生效。
- 本文档的测试版本经过自行修复，允许自定义`command`指令，以便功能测试能顺利进行。
:::


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
   - 在`Head`节点容器中注入启动命令：`ray start --head --block`
   - 配置并开放必要的端口（`GCS`端口`6379`、`Dashboard`端口`8265`、`Client`端口`10001`）
   - 创建`Service`（`<job-name>-head-svc`）用于集群内访问

2. **自动配置Worker节点**
   - 在`Worker`节点容器中注入启动命令：`ray start --block --address=<head-service>:6379`
   - 自动通过`Service`名称连接到`Head`节点

3. **服务发现管理**
   - 为`Head`节点创建`ClusterIP Service`
   - `Service`名称格式：`<job-name>-head-svc`
   - `Worker`节点通过该`Service`发现并连接`Head`节点

:::warning 插件功能范围
`Volcano Ray`插件只负责创建`Ray Cluster`（`Head`节点 + `Worker`节点），**不支持直接在`Volcano Job`中提交`Ray Job`**。任务提交需要通过以下两种方式之一：

1. **方式一**：使用`kubectl exec`在`Head`节点中执行`Python`脚本
2. **方式二**：创建独立的任务提交`Pod`，通过它向`Ray Cluster`提交任务

任务执行完毕后，手动销毁`Volcano Job`以释放资源。
:::

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

**Service资源**（`<job-name>-head-svc`）：为`Head`节点创建的普通`ClusterIP Service`，包含以下端口映射：

| 端口名称 | 端口号 | 用途说明 |
|---------|-------|---------|
| `gcs` | `6379` | 用于`Ray GCS`通信 |
| `dashboard` | `8265` | 用于访问`Ray Dashboard` |
| `client-server` | `10001` | 用于`Ray Client API` |

:::info Service说明
`Volcano Ray`插件会自动创建一个`ClusterIP Service`（`<job-name>-head-svc`），该`Service`用于：

- 集群内部访问`Head`节点（包括`Worker`节点连接）
- 外部通过`Ingress`或者`kubectl port-forward`访问`Ray Dashboard`和`Client API`
- 提供稳定的服务发现端点

`Worker`节点通过该`Service`自动发现并连接到`Head`节点，无需额外配置。
:::

## Ray插件使用方法

### 基本配置示例

以下是使用`Ray`插件创建`Ray Cluster`的最简单配置：

> `Ray`的官方镜像仓库为：https://hub.docker.com/r/rayproject/ray ，为简化示例，这里使用精简版的`rayproject/ray:latest-py311-cpu`镜像。作者本机是`arm64`系统，请读者根据实际环境选择合适的镜像。

```yaml title="ray-cluster-job.yaml"
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
              image: rayproject/ray:latest-py311-cpu
              imagePullPolicy: IfNotPresent
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
              image: rayproject/ray:latest-py311-cpu
              imagePullPolicy: IfNotPresent
              command:
                - /bin/bash
                - -c
                - |
                  ray start --block --address=ray-cluster-job-head-svc:6379
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
          restartPolicy: OnFailure
```

### 自定义配置示例

如果需要自定义任务名称、容器名称或端口，可以通过插件参数配置：

```yaml title="ray-cluster-custom.yaml"
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
              image: rayproject/ray:latest-py311-cpu
              imagePullPolicy: IfNotPresent
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
              image: rayproject/ray:latest-py311-cpu
              imagePullPolicy: IfNotPresent
              command:
                - /bin/bash
                - -c
                - |
                  ray start --block --address=ray-cluster-job-head-svc:6379
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
          restartPolicy: OnFailure
```

## 完整运行示例

下面提供一个完整的示例，演示如何使用`Volcano Job`的`Ray`插件创建`Ray Cluster`，并通过不同方式提交分布式计算任务。

> 为便于测试，以下运行的命名空间均使用`volcano-system`，请根据实际环境调整。

### 准备工作

**前提条件**：
- 已安装`Kubernetes`集群（版本`1.27+`）
- 已安装`Volcano`调度器（版本`1.13+`）
- 已创建`default`队列（默认应该有自动创建）

**安装Volcano**：

```bash
# 添加Volcano Helm仓库
helm repo add volcano-sh https://volcano-sh.github.io/helm-charts
helm repo update

# 安装Volcano（版本可自行指定）
helm install volcano volcano-sh/volcano \
  -n volcano-system \
  --create-namespace \
  --version 1.13.0

# 等待Volcano组件就绪，预计需要几分钟时间
```


### 创建Ray Cluster

创建`Volcano Job`来运行`Ray`集群：

```yaml title="ray-cluster.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ray-cluster
  namespace: volcano-system
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
    # Head节点 - Ray集群的主节点
    - replicas: 1
      name: head
      template:
        spec:
          containers:
            - name: head
              image: rayproject/ray:latest-py311-cpu
              imagePullPolicy: IfNotPresent
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
                limits:
                  cpu: "2"
                  memory: "4Gi"
          restartPolicy: OnFailure
    
    # Worker节点 - 执行计算任务的工作节点
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: worker
              image: rayproject/ray:latest-py311-cpu
              imagePullPolicy: IfNotPresent
              command:
                - /bin/bash
                - -c
                - |
                  ray start --block --address=ray-cluster-head-svc:6379
              resources:
                requests:
                  cpu: "1"
                  memory: "2Gi"
                limits:
                  cpu: "2"
                  memory: "4Gi"
          restartPolicy: OnFailure
```

按照以下步骤部署`Ray Cluster`并提交任务：

**步骤1：创建Volcano Job（Ray Cluster）**

```bash
kubectl apply -f ray-cluster.yaml

# 查看Job状态
kubectl get vcjob -n volcano-system ray-cluster

# 查看Pods
kubectl get pods -n volcano-system -l volcano.sh/job-name=ray-cluster

# 等待所有Pod运行
kubectl wait --for=condition=Ready pod -n volcano-system -l volcano.sh/job-name=ray-cluster --timeout=300s
```

**步骤2：验证Ray Cluster就绪**

```bash
# 查看Service（插件自动创建）
kubectl get svc -n volcano-system | grep ray-cluster
# 应该看到: ray-cluster-head-svc (ClusterIP Service)

# 访问Ray Dashboard
kubectl port-forward -n volcano-system svc/ray-cluster-head-svc 8265:8265
# 在浏览器访问 http://localhost:8265
```

### 提交Ray任务

`Volcano Ray`插件只创建`Ray Cluster`，不负责任务提交。有两种方式向集群提交任务：

#### 方式一：使用kubectl exec提交任务

这是最简单的方式，直接在`Head`节点中执行`Python`脚本：

**1. 创建任务脚本**：

```python title="ray-job-code.py"
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

**2. 将脚本复制到Head节点并执行**：

```bash
# 复制脚本到Head节点
kubectl cp ray-job-code.py volcano-system/ray-cluster-head-0:/tmp/

# 在Head节点中执行任务
kubectl exec -n volcano-system ray-cluster-head-0 -- python /tmp/ray-job-code.py

# 或者直接执行
kubectl exec -n volcano-system ray-cluster-head-0 -- bash -c "
cat <<'EOF' | python
import ray
ray.init(address='auto')

@ray.remote
def compute_square(x):
    return x * x

results = ray.get([compute_square.remote(i) for i in range(10)])
print(f'Results: {results}')
EOF
"
```

#### 方式二：使用任务提交Pod

创建一个独立的`Pod`，专门用于向`Ray Cluster`提交任务。这种方式更适合生产环境。

**1. 创建任务ConfigMap**：

```yaml title="ray-job-code.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: ray-job-code
  namespace: volcano-system
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

**2. 创建任务提交Pod**：

```yaml title="ray-job-submitter.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: ray-job-submitter
  namespace: volcano-system
spec:
  restartPolicy: Never
  containers:
  - name: submitter
    image: rayproject/ray:latest-py311-cpu
    command:
      - /bin/bash
      - -c
      - |
        # 等待Ray集群就绪
        echo "Waiting for Ray cluster to be ready..."
        until ray health-check --address=ray-cluster-head-svc:6379 2>/dev/null; do
          sleep 5
        done
        
        echo "Ray cluster is ready, submitting job..."
        
        # 执行Ray任务
        python /mnt/job/job.py
        
        echo "Job completed!"
    env:
    - name: RAY_ADDRESS
      value: "ray://ray-cluster-head-svc:10001" # 使用Ray Client API
    resources:
      requests:
        cpu: "500m"
        memory: "1Gi"
      limits:
        cpu: "1"
        memory: "2Gi"
    volumeMounts:
    - name: job-code
      mountPath: /mnt/job
  volumes:
  - name: job-code
    configMap:
      name: ray-job-code
```

**2. 监控任务执行**：

```bash
# 应用ConfigMap
kubectl apply -f ray-job-code.yaml

# 创建任务提交Pod
kubectl apply -f ray-job-submitter.yaml

# 检查任务状态
kubectl get pod -n volcano-system ray-job-submitter

# 查看任务执行日志
kubectl logs -n volcano-system ray-job-submitter -f
```


### 预期输出

执行任务后，应该看到类似以下的输出：

**方式一（kubectl exec）的输出**：

```text
Results: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
```

**方式二（任务提交Pod）的输出**：

```text
Ray cluster resources: {'CPU': 4.0, 'memory': 8589934592, ...}
Available nodes: 3
Input numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
Squared results: [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
Job completed successfully!
```

### 清理资源

任务执行完成后，清理创建的资源：

```bash
# 删除任务提交Pod（如果使用了方式二）
kubectl delete pod -n volcano-system ray-job-submitter

# 删除ConfigMap
kubectl delete configmap -n volcano-system ray-job-code

# 删除Volcano Job（Ray Cluster）
kubectl delete vcjob -n volcano-system ray-cluster
```


## 参考资料

- https://volcano.sh/zh/docs/ray_on_volcano/
- https://github.com/volcano-sh/volcano/blob/master/docs/user-guide/how_to_use_ray_plugin.md
- https://docs.ray.io/en/latest/cluster/kubernetes/index.html