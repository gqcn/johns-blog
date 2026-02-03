---
slug: "/cloud-native/volcano-job-plugin"
title: "Volcano Job Plugin详解"
hide_title: true
keywords:
  [
    "Volcano Job Plugin",
    "Volcano",
    "SSH Plugin",
    "SVC Plugin",
    "Env Plugin",
    "TensorFlow Plugin",
    "PyTorch Plugin",
    "MPI Plugin",
    "Ray Plugin",
    "分布式训练",
    "批量调度",
    "Kubernetes",
    "云原生",
    "机器学习",
    "高性能计算"
  ]
description: "深入解析Volcano Job Plugin的各种插件功能，包括SSH、SVC、Env等基础插件，以及TensorFlow、PyTorch、MPI、Ray等分布式框架插件。详细介绍每个插件的工作原理、配置参数、使用场景和实践示例，帮助用户构建高效的分布式计算和机器学习工作负载。"
---

本文详细介绍`Volcano Job`中的`Plugin`机制及各个插件的配置和使用方法。关于`Job`的基础介绍，请参考 [Volcano Job详解](./3600-Volcano%20Job详解.md)。

## Plugin机制概述

`Volcano Job Plugin`是一套扩展机制，用于在`Job`的不同生命周期阶段自动注入额外的功能和配置。插件机制使得`Volcano`能够灵活支持各种分布式计算框架和应用场景，而无需修改核心代码。

### Plugin接口定义

所有插件都需要实现以下接口：

```go
type PluginInterface interface {
    // Name 返回插件的唯一名称
    Name() string

    // OnPodCreate 在创建Pod时被调用，可以修改Pod配置
    OnPodCreate(pod *v1.Pod, job *vcbatch.Job) error

    // OnJobAdd 在Job初始化时被调用，可以创建辅助资源
    // 注意：可能被多次调用，必须保证幂等性
    OnJobAdd(job *vcbatch.Job) error

    // OnJobDelete 在Job删除时被调用，用于清理资源
    // 注意：可能被多次调用，必须保证幂等性
    OnJobDelete(job *vcbatch.Job) error

    // OnJobUpdate 在Job更新时被调用
    // 注意：可能被多次调用，必须保证幂等性
    OnJobUpdate(job *vcbatch.Job) error
}
```

### Plugin生命周期

插件在`Job`的以下生命周期阶段发挥作用：

1. **Job创建阶段**：`OnJobAdd()`被调用，通常用于创建辅助资源（如`Secret`、`ConfigMap`、`Service`等）
2. **Pod创建阶段**：`OnPodCreate()`被调用，用于修改`Pod`配置（如添加环境变量、挂载卷等）
3. **Job更新阶段**：`OnJobUpdate()`被调用，用于更新相关资源
4. **Job删除阶段**：`OnJobDelete()`被调用，用于清理创建的资源

### Plugin配置方式

在`Job`的`spec.plugins`字段中配置需要启用的插件：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: example-job
spec:
  plugins:
    ssh: []                                # 启用SSH插件，无参数
    env: []                                # 启用环境变量插件
    svc: ["--publish-not-ready-addresses=true"]  # 启用服务插件，带参数
    pytorch: ["--master=master", "--worker=worker"]  # 启用PyTorch插件，带参数
```

## 基础插件

### SSH

**SSH Plugin**为`Volcano Job`中的所有`Pod`提供无密码登录功能，这对于需要节点间通信的工作负载（如`MPI`）是必需的。

#### 工作原理

1. **密钥生成**：在`Job`创建时自动生成`RSA`密钥对（`2048`位），或使用用户提供的密钥
2. **Secret创建**：将密钥存储在名为`{JobName}-ssh`的`Secret`中，包含以下内容：
   - `id_rsa`：私钥
   - `id_rsa.pub`：公钥
   - `authorized_keys`：授权密钥文件
   - `config`：SSH配置文件
3. **卷挂载**：将`Secret`作为卷挂载到所有容器（包括`InitContainer`）的指定路径
4. **主机配置**：在`config`文件中包含所有`Pod`的主机名和域名对

#### 配置参数

| 参数名 | 类型 | 默认值 | 必需 | 说明 | 示例 |
|--------|------|--------|------|------|------|
| `ssh-key-file-path` | `string` | `/root/.ssh` | 否 | `SSH`密钥文件存储路径 | `--ssh-key-file-path=/home/user/.ssh` |
| `ssh-private-key` | `string` | 自动生成 | 否 | 用户提供的私钥内容 | `--ssh-private-key=-----BEGIN RSA PRIVATE KEY-----...` |
| `ssh-public-key` | `string` | 自动生成 | 否 | 用户提供的公钥内容 | `--ssh-public-key=ssh-rsa AAAAB3...` |

#### 使用场景

- **MPI分布式计算**：主节点需要通过`SSH`在工作节点上启动进程
- **分布式训练**：训练任务需要在不同节点间建立直接通信
- **集群管理**：需要在集群内部执行命令或传输文件

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: mpi-job
spec:
  queue: default
  minAvailable: 3
  schedulerName: volcano
  plugins:
    ssh: []  # 使用默认配置，自动生成密钥
    svc: []
  tasks:
    - replicas: 1
      name: mpimaster
      template:
        spec:
          containers:
            - name: mpimaster
              image: lyd911/mindspore-gpu-example:0.2.0
              command:
                - /bin/bash
                - -c
                - |
                  mkdir -p /var/run/sshd; /usr/sbin/sshd;
                  MPI_HOST=`cat /etc/volcano/mpiworker.host | tr "\n" ","`;
                  sleep 10;
                  mpiexec --allow-run-as-root --host ${MPI_HOST} -np 2 python /tmp/gpu-test.py;
              ports:
                - containerPort: 22
                  name: mpijob-port
              workingDir: /home
          restartPolicy: OnFailure
    - replicas: 2
      name: mpiworker
      template:
        spec:
          containers:
            - name: mpiworker
              image: lyd911/mindspore-gpu-example:0.2.0
              command:
                - /bin/bash
                - -c
                - |
                  mkdir -p /var/run/sshd; /usr/sbin/sshd -D;
              resources:
                limits:
                  nvidia.com/gpu: "1"
              ports:
                - containerPort: 22
                  name: mpijob-port
              workingDir: /home
          restartPolicy: OnFailure
```

**验证SSH连接**：

在`master` Pod中执行：

```bash
# 查看SSH配置
cat /root/.ssh/config
# 输出：
# StrictHostKeyChecking no
# UserKnownHostsFile /dev/null
# Host mpi-job-mpimaster-0
#   HostName mpi-job-mpimaster-0.mpi-job
# Host mpi-job-mpiworker-0
#   HostName mpi-job-mpiworker-0.mpi-job
# Host mpi-job-mpiworker-1
#   HostName mpi-job-mpiworker-1.mpi-job

# 无密码登录worker节点
ssh mpi-job-mpiworker-0
```

#### 注意事项

1. 确保容器镜像中安装了`sshd`服务
2. 如果使用非默认路径，需要确保应用程序能够访问该路径
3. 建议大多数场景使用默认配置，让`Volcano`自动生成密钥
4. `SSH Plugin`通常与`SVC Plugin`配合使用，以提供主机名解析功能



### SVC

**SVC Plugin**为`Volcano Job`中的`Pod`提供网络通信能力，使`Pod`之间可以通过域名相互访问。这对于需要节点间通信的分布式应用（如`TensorFlow`、`MPI`）是必需的。

#### 工作原理

1. **主机名和子域名配置**：
   - 自动设置每个`Pod`的`hostname`为`Pod`名称
   - 自动设置每个`Pod`的`subdomain`为`Job`名称
   - 完整的`FQDN`格式为：`{PodName}.{JobName}.{Namespace}.svc.cluster.local`

2. **Headless Service创建**：
   - 创建名为`{JobName}`的`Headless Service`（`ClusterIP: None`）
   - 该服务将`Pod`的`FQDN`指向其`IP`地址

3. **ConfigMap创建**：
   - 创建名为`{JobName}-svc`的`ConfigMap`
   - 包含每个`Task`的主机列表和副本数量
   - 将`ConfigMap`挂载到所有`Pod`的`/etc/volcano/`目录

4. **环境变量注入**：
   - 为每个`Task`注入`VC_{TaskName}_HOSTS`环境变量（包含该`Task`所有`Pod`的域名）
   - 为每个`Task`注入`VC_{TaskName}_NUM`环境变量（包含该`Task`的副本数量）

5. **NetworkPolicy创建**（可选）：
   - 默认创建`NetworkPolicy`，允许`Job`内部的`Pod`相互通信
   - 可通过参数禁用

#### 配置参数

| 参数名 | 类型 | 默认值 | 必需 | 说明 | 示例 |
|--------|------|--------|------|------|------|
| `publish-not-ready-addresses` | `bool` | `false` | 否 | 是否发布未就绪的`Pod`地址 | `--publish-not-ready-addresses=true` |
| `disable-network-policy` | `bool` | `false` | 否 | 是否禁用`NetworkPolicy` | `--disable-network-policy=true` |

#### 使用场景

- **TensorFlow分布式训练**：`PS`和`Worker`需要相互通信
- **MPI并行计算**：主节点需要知道所有工作节点的地址
- **Spark分布式计算**：`Driver`和`Executor`需要建立连接
- **分布式数据库集群**：节点间需要建立集群关系

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: tensorflow-dist-mnist
spec:
  queue: default
  minAvailable: 3
  schedulerName: volcano
  plugins:
    env: []
    svc: ["--publish-not-ready-addresses=false", "--disable-network-policy=false"]
  policies:
    - event: PodEvicted
      action: RestartJob
  queue: default
  tasks:
    - replicas: 1
      name: ps
      template:
        spec:
          containers:
            - name: tensorflow
              image: volcanosh/dist-mnist-tf-example:0.0.1
              command:
                - sh
                - -c
                - |
                  PS_HOST=`cat /etc/volcano/ps.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  WORKER_HOST=`cat /etc/volcano/worker.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  export TF_CONFIG={\"cluster\":{\"ps\":[${PS_HOST}],\"worker\":[${WORKER_HOST}]},\"task\":{\"type\":\"ps\",\"index\":${VK_TASK_INDEX}},\"environment\":\"cloud\"};
                  python /var/tf_dist_mnist/dist_mnist.py
              ports:
                - containerPort: 2222
                  name: tfjob-port
          restartPolicy: Never
    - replicas: 2
      name: worker
      policies:
        - event: TaskCompleted
          action: CompleteJob
      template:
        spec:
          containers:
            - name: tensorflow
              image: volcanosh/dist-mnist-tf-example:0.0.1
              command:
                - sh
                - -c
                - |
                  PS_HOST=`cat /etc/volcano/ps.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  WORKER_HOST=`cat /etc/volcano/worker.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  export TF_CONFIG={\"cluster\":{\"ps\":[${PS_HOST}],\"worker\":[${WORKER_HOST}]},\"task\":{\"type\":\"worker\",\"index\":${VK_TASK_INDEX}},\"environment\":\"cloud\"};
                  python /var/tf_dist_mnist/dist_mnist.py
              ports:
                - containerPort: 2222
                  name: tfjob-port
          restartPolicy: Never
```

**验证服务和环境变量**：

```bash
# 查看创建的Service
kubectl get service
# 输出：
# NAME                       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
# tensorflow-dist-mnist      ClusterIP   None           <none>        <none>    5s

# 在Pod中查看环境变量
kubectl exec tensorflow-dist-mnist-ps-0 -- env | grep VC_
# 输出：
# VC_PS_HOSTS=tensorflow-dist-mnist-ps-0.tensorflow-dist-mnist
# VC_PS_NUM=1
# VC_WORKER_HOSTS=tensorflow-dist-mnist-worker-0.tensorflow-dist-mnist,tensorflow-dist-mnist-worker-1.tensorflow-dist-mnist
# VC_WORKER_NUM=2

# 查看主机列表文件
kubectl exec tensorflow-dist-mnist-ps-0 -- cat /etc/volcano/ps.host
# 输出：
# tensorflow-dist-mnist-ps-0.tensorflow-dist-mnist

kubectl exec tensorflow-dist-mnist-ps-0 -- cat /etc/volcano/worker.host
# 输出：
# tensorflow-dist-mnist-worker-0.tensorflow-dist-mnist
# tensorflow-dist-mnist-worker-1.tensorflow-dist-mnist
```

#### 注意事项

1. `SVC Plugin`为分布式应用提供基础网络能力，通常是其他插件的前置依赖
2. 环境变量中的`Task`名称会自动转换：将`-`替换为`_`，并转换为大写
3. 当`Pod`重建时，`FQDN`保持不变，但`IP`地址会改变
4. `publish-not-ready-addresses`设置为`true`时，即使`Pod`未就绪也会发布其地址，适合需要提前建立连接的场景



### Env

**Env Plugin**为`Volcano Job`中的每个`Pod`自动注入索引环境变量，使`Pod`能够感知自己在`Task`中的位置。这对于需要根据索引分配不同数据分片或角色的应用非常有用。

#### 工作原理

1. **索引计算**：根据`Pod`在其`Task`中的位置计算索引值（从`0`开始）
2. **环境变量注入**：为所有容器（包括`InitContainer`）注入以下环境变量：
   - `VK_TASK_INDEX`：`Pod`在`Task`中的索引（历史兼容，将来会废弃）
   - `VC_TASK_INDEX`：`Pod`在`Task`中的索引（推荐使用）

#### 配置参数

无需配置参数，直接启用即可：

```yaml
plugins:
  env: []
```

#### 使用场景

- **数据分片**：每个`Worker`根据索引处理不同的数据分片
- **角色分配**：根据索引分配不同的角色（如`rank 0`作为主节点）
- **分布式训练**：`TensorFlow`、`PyTorch`等框架需要知道每个进程的`rank`
- **配置差异化**：根据索引加载不同的配置文件

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: tensorflow-dist-mnist
spec:
  queue: default
  minAvailable: 3
  schedulerName: volcano
  plugins:
    env: []  # 启用环境变量插件
    svc: []
  policies:
    - event: PodEvicted
      action: RestartJob
  queue: default
  tasks:
    - replicas: 1
      name: ps
      template:
        spec:
          containers:
            - name: tensorflow
              image: volcanosh/dist-mnist-tf-example:0.0.1
              command:
                - sh
                - -c
                - |
                  PS_HOST=`cat /etc/volcano/ps.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  WORKER_HOST=`cat /etc/volcano/worker.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  # 使用VC_TASK_INDEX环境变量配置TensorFlow任务索引
                  export TF_CONFIG={\"cluster\":{\"ps\":[${PS_HOST}],\"worker\":[${WORKER_HOST}]},\"task\":{\"type\":\"ps\",\"index\":${VC_TASK_INDEX}},\"environment\":\"cloud\"};
                  python /var/tf_dist_mnist/dist_mnist.py
              ports:
                - containerPort: 2222
                  name: tfjob-port
          restartPolicy: Never
    - replicas: 2
      name: worker
      policies:
        - event: TaskCompleted
          action: CompleteJob
      template:
        spec:
          containers:
            - name: tensorflow
              image: volcanosh/dist-mnist-tf-example:0.0.1
              command:
                - sh
                - -c
                - |
                  PS_HOST=`cat /etc/volcano/ps.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  WORKER_HOST=`cat /etc/volcano/worker.host | sed 's/$/&:2222/g' | sed 's/^/"/;s/$/"/' | tr "\n" ","`;
                  # 使用VC_TASK_INDEX环境变量配置TensorFlow任务索引
                  export TF_CONFIG={\"cluster\":{\"ps\":[${PS_HOST}],\"worker\":[${WORKER_HOST}]},\"task\":{\"type\":\"worker\",\"index\":${VC_TASK_INDEX}},\"environment\":\"cloud\"};
                  python /var/tf_dist_mnist/dist_mnist.py
              ports:
                - containerPort: 2222
                  name: tfjob-port
          restartPolicy: Never
```

**验证环境变量**：

```bash
# 查看ps Pod的索引
kubectl exec tensorflow-dist-mnist-ps-0 -- env | grep TASK_INDEX
# 输出：
# VK_TASK_INDEX=0
# VC_TASK_INDEX=0

# 查看worker Pod的索引
kubectl exec tensorflow-dist-mnist-worker-0 -- env | grep TASK_INDEX
# 输出：
# VK_TASK_INDEX=0
# VC_TASK_INDEX=0

kubectl exec tensorflow-dist-mnist-worker-1 -- env | grep TASK_INDEX
# 输出：
# VK_TASK_INDEX=1
# VC_TASK_INDEX=1
```

#### 注意事项

1. `VK_TASK_INDEX`将在未来版本中废弃，推荐使用`VC_TASK_INDEX`
2. 索引值从`0`开始，最大值为`replicas - 1`
3. 当`Pod`重建时，如果`Pod`名称不变，索引值也保持不变
4. 该插件无需配置参数，注册时传入空数组即可


## 分布式框架插件

### PyTorch

**PyTorch Plugin**为`PyTorch`分布式训练任务自动配置必要的环境变量，支持`DistributedDataParallel (DDP)`等分布式训练模式。

#### 工作原理

1. **角色识别**：识别`master`和`worker`任务
2. **环境变量注入**：为所有容器注入以下环境变量：
   - `MASTER_ADDR`：主节点的域名地址
   - `MASTER_PORT`：主节点的通信端口
   - `WORLD_SIZE`：总的进程数量
   - `RANK`：当前进程的全局排名（`master`为`0`，`worker`从`1`开始）
3. **端口开放**：为所有容器开放指定的通信端口

#### 配置参数

| 参数名 | 类型 | 默认值 | 必需 | 说明 | 示例 |
|--------|------|--------|------|------|------|
| `master` | `string` | `master` | 否 | `Master`任务名称 | `--master=main` |
| `worker` | `string` | `worker` | 否 | `Worker`任务名称 | `--worker=node` |
| `port` | `integer` | `23456` | 否 | `PyTorch`通信端口 | `--port=29500` |

#### 使用场景

- **PyTorch DDP训练**：自动配置分布式数据并行训练
- **多GPU训练**：跨节点的多`GPU`训练
- **弹性训练**：支持节点动态伸缩的训练任务

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: pytorch-job
spec:
  queue: default
  minAvailable: 3
  schedulerName: volcano
  plugins:
    pytorch: ["--master=master", "--worker=worker", "--port=23456"]
    svc: []
  tasks:
    - replicas: 1
      name: master
      policies:
        - event: TaskCompleted
          action: CompleteJob
      template:
        spec:
          containers:
            - name: pytorch
              image: pytorch/pytorch:2.4.1-cuda11.8-cudnn9-runtime
              imagePullPolicy: IfNotPresent
              command:
                - python
                - -c
                - |
                  import os
                  import torch
                  import torch.distributed as dist
                  
                  print(f"MASTER_ADDR: {os.environ['MASTER_ADDR']}")
                  print(f"MASTER_PORT: {os.environ['MASTER_PORT']}")
                  print(f"WORLD_SIZE: {os.environ['WORLD_SIZE']}")
                  print(f"RANK: {os.environ['RANK']}")
                  
                  # 初始化分布式环境
                  dist.init_process_group(backend="gloo")
                  print(f"Initialized process group, rank: {dist.get_rank()}")
                  # PyTorch训练代码...
          restartPolicy: OnFailure
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: pytorch
              image: pytorch/pytorch:2.4.1-cuda11.8-cudnn9-runtime
              imagePullPolicy: IfNotPresent
              command:
                - python
                - -c
                - |
                  import os
                  import torch
                  import torch.distributed as dist
                  
                  print(f"MASTER_ADDR: {os.environ['MASTER_ADDR']}")
                  print(f"MASTER_PORT: {os.environ['MASTER_PORT']}")
                  print(f"WORLD_SIZE: {os.environ['WORLD_SIZE']}")
                  print(f"RANK: {os.environ['RANK']}")
                  
                  # 初始化分布式环境
                  dist.init_process_group(backend="gloo")
                  print(f"Initialized process group, rank: {dist.get_rank()}")
                  # PyTorch训练代码...
          restartPolicy: OnFailure
```

**验证环境变量**：

```bash
# 查看master的环境变量
kubectl exec pytorch-job-master-0 -- env | grep -E "MASTER|WORLD|RANK"
# 输出：
# MASTER_ADDR=pytorch-job-master-0.pytorch-job
# MASTER_PORT=23456
# WORLD_SIZE=3
# RANK=0

# 查看worker-0的环境变量
kubectl exec pytorch-job-worker-0 -- env | grep -E "MASTER|WORLD|RANK"
# 输出：
# MASTER_ADDR=pytorch-job-master-0.pytorch-job
# MASTER_PORT=23456
# WORLD_SIZE=3
# RANK=1

# 查看worker-1的环境变量
kubectl exec pytorch-job-worker-1 -- env | grep -E "MASTER|WORLD|RANK"
# 输出：
# MASTER_ADDR=pytorch-job-master-0.pytorch-job
# MASTER_PORT=23456
# WORLD_SIZE=3
# RANK=2
```

#### 注意事项

1. 插件会自动启用`SVC Plugin`，确保主节点地址可以被解析
2. `WORLD_SIZE`包含`master`和所有`worker`的总数
3. `RANK`分配：`master`为`0`，`worker`从`1`开始递增
4. 确保防火墙规则允许指定端口的通信
5. 如果使用`NCCL`后端，需要额外配置`GPU`直通和网络设置



### TensorFlow

**TensorFlow Plugin**为`TensorFlow`分布式训练任务自动配置`TF_CONFIG`环境变量，简化了分布式训练的配置过程。

#### 工作原理

1. **集群拓扑识别**：识别`Job`中的不同角色（`ps`、`worker`、`chief`、`evaluator`）
2. **TF_CONFIG生成**：为每个`Pod`生成包含集群信息和任务信息的`TF_CONFIG` JSON配置
3. **环境变量注入**：将`TF_CONFIG`注入到所有容器中

#### TF_CONFIG结构

```json
{
  "cluster": {
    "ps": ["ps-0.job-name:2222", "ps-1.job-name:2222"],
    "worker": ["worker-0.job-name:2222", "worker-1.job-name:2222"],
    "chief": ["chief-0.job-name:2222"]
  },
  "task": {
    "type": "worker",  // 当前Pod的角色
    "index": 0         // 当前Pod在该角色中的索引
  }
}
```

#### 配置参数

| 参数名 | 类型 | 默认值 | 必需 | 说明 | 示例 |
|--------|------|--------|------|------|------|
| `ps` | `string` | `ps` | 否 | `Parameter Server`任务名称 | `--ps=ps-role` |
| `worker` | `string` | `worker` | 否 | `Worker`任务名称 | `--worker=worker-role` |
| `chief` | `string` | `chief` | 否 | `Chief`任务名称 | `--chief=chief-role` |
| `evaluator` | `string` | `evaluator` | 否 | `Evaluator`任务名称 | `--evaluator=evaluator-role` |
| `port` | `integer` | `2222` | 否 | `TensorFlow`通信端口 | `--port=3333` |
#### 使用场景

- **TensorFlow分布式训练**：自动配置`PS-Worker`架构
- **多角色训练任务**：支持`Chief`、`Evaluator`等多种角色
- **参数服务器架构**：简化`Parameter Server`模式的配置

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: tensorflow-training
spec:
  queue: default
  minAvailable: 4
  schedulerName: volcano
  plugins:
    tensorflow: ["--ps=ps", "--worker=worker", "--port=2222"]
    svc: []
  tasks:
    - replicas: 2
      name: ps
      template:
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:2.4.0
              command:
                - python
                - -c
                - |
                  import os
                  import json
                  tf_config = json.loads(os.environ['TF_CONFIG'])
                  print(f"TF_CONFIG: {tf_config}")
                  # TensorFlow训练代码...
              resources:
                limits:
                  cpu: 4
                  memory: 8Gi
          restartPolicy: OnFailure
    - replicas: 3
      name: worker
      template:
        spec:
          containers:
            - name: tensorflow
              image: tensorflow/tensorflow:2.4.0
              command:
                - python
                - -c
                - |
                  import os
                  import json
                  tf_config = json.loads(os.environ['TF_CONFIG'])
                  print(f"TF_CONFIG: {tf_config}")
                  # TensorFlow训练代码...
              resources:
                limits:
                  cpu: 2
                  memory: 4Gi
          restartPolicy: OnFailure
```

**验证TF_CONFIG**：

```bash
# 查看worker-0的TF_CONFIG
kubectl exec tensorflow-training-worker-0 -- env | grep TF_CONFIG
# 输出（格式化后）：
# TF_CONFIG={
#   "cluster": {
#     "ps": [
#       "tensorflow-training-ps-0.tensorflow-training:2222",
#       "tensorflow-training-ps-1.tensorflow-training:2222"
#     ],
#     "worker": [
#       "tensorflow-training-worker-0.tensorflow-training:2222",
#       "tensorflow-training-worker-1.tensorflow-training:2222",
#       "tensorflow-training-worker-2.tensorflow-training:2222"
#     ]
#   },
#   "task": {
#     "type": "worker",
#     "index": 0
#   }
# }
```

#### 注意事项

1. 对于单`Pod`的`TensorFlow Job`（`replicas=1`），不会生成`TF_CONFIG`
2. 插件会自动启用`SVC Plugin`功能，确保域名解析正常工作
3. 任务名称必须与参数中配置的名称匹配，否则不会包含在`TF_CONFIG`中
4. 确保容器中的`TensorFlow`版本支持通过`TF_CONFIG`进行分布式配置




### MPI

**MPI Plugin**为`MPI (Message Passing Interface)`并行计算任务提供必要的配置，包括主机列表、`SSH`配置和端口开放。

#### 工作原理

1. **角色识别**：识别`master`和`worker`任务
2. **主机列表生成**：为`master` Pod生成包含所有`worker`主机域名的`MPI_HOST`环境变量
3. **端口开放**：为所有容器开放`SSH`端口
4. **依赖插件启动**：自动启用`SSH`和`SVC`插件

#### 配置参数

| 参数名 | 类型 | 默认值 | 必需 | 说明 | 示例 |
|--------|------|--------|------|------|------|
| `master` | `string` | `master` | 否 | `Master`任务名称 | `--master=mpimaster` |
| `worker` | `string` | `worker` | 否 | `Worker`任务名称 | `--worker=mpiworker` |
| `port` | `integer` | `22` | 否 | `SSH`通信端口 | `--port=5000` |

#### 使用场景

- **MPI并行计算**：科学计算、数值模拟
- **高性能计算**：大规模并行任务
- **分布式模拟**：物理模拟、流体力学计算

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: lm-mpi-job
spec:
  queue: default
  minAvailable: 1
  schedulerName: volcano
  plugins:
    mpi: ["--master=mpimaster", "--worker=mpiworker", "--port=22"]
  tasks:
    - replicas: 1
      name: mpimaster
      policies:
        - event: TaskCompleted
          action: CompleteJob
      template:
        spec:
          containers:
            - name: mpimaster
              image: volcanosh/example-mpi:0.0.3
              command:
                - /bin/sh
                - -c
                - |
                  mkdir -p /var/run/sshd; /usr/sbin/sshd;
                  # MPI_HOST环境变量包含所有worker的域名
                  echo "MPI_HOST: ${MPI_HOST}"
                  # 使用mpiexec在所有worker上运行程序
                  mpiexec --allow-run-as-root --host ${MPI_HOST} -np 2 mpi_hello_world;
              workingDir: /home
          restartPolicy: OnFailure
    - replicas: 2
      name: mpiworker
      template:
        spec:
          containers:
            - name: mpiworker
              image: volcanosh/example-mpi:0.0.3
              command:
                - /bin/sh
                - -c
                - |
                  mkdir -p /var/run/sshd; /usr/sbin/sshd -D;
              workingDir: /home
          restartPolicy: OnFailure
```

**验证MPI配置**：

```bash
# 查看master的MPI_HOST环境变量
kubectl exec lm-mpi-job-mpimaster-0 -- env | grep MPI_HOST
# 输出：
# MPI_HOST=lm-mpi-job-mpiworker-0.lm-mpi-job,lm-mpi-job-mpiworker-1.lm-mpi-job

# 在master中测试SSH连接
kubectl exec lm-mpi-job-mpimaster-0 -- ssh lm-mpi-job-mpiworker-0 hostname
# 输出：
# lm-mpi-job-mpiworker-0

# 查看MPI任务执行结果
kubectl logs lm-mpi-job-mpimaster-0
```

#### 注意事项

1. 插件会自动启用`SSH Plugin`和`SVC Plugin`，无需手动配置
2. 确保容器镜像中安装了`MPI`运行时环境和`sshd`服务
3. `MPI_HOST`只在`master` Pod中注入，包含所有`worker`的域名列表
4. 如果使用`gang`插件，确保`minAvailable`等于`worker`的`replicas`数量
5. `SSH`端口必须与`mpiexec`使用的端口一致



### Ray

**Ray Plugin**为`Ray`分布式计算框架提供自动化配置，包括`Head`节点和`Worker`节点的命令配置、端口开放和服务创建。

> 关于使用`Volcano Job`中运行`Ray`节点的详细调研测试请参考：[通过Volcano Job插件部署使用Ray Cluster](../../../1000-AI技术/600-训练微调/300-Ray分布式计算引擎/3000-通过Volcano%20Job插件部署使用Ray%20Cluster.md)

#### 工作原理

1. **节点角色配置**：
   - 为`Head`节点配置`ray start --head`命令
   - 为`Worker`节点配置`ray start`命令，连接到`Head`节点
2. **端口开放**：为`Head`节点开放三个关键端口：
   - `GCS`端口（默认`6379`）：全局控制服务
   - `Dashboard`端口（默认`8265`）：`Web`界面
   - `Client Server`端口（默认`10001`）：客户端连接
3. **Service创建**：创建名为`{JobName}-head-svc`的`Service`，映射到`Head`节点的端口
4. **依赖插件启动**：自动启用`SVC Plugin`

#### 配置参数

| 参数名 | 类型 | 默认值 | 必需 | 说明 | 示例 |
|--------|------|--------|------|------|------|
| `head` | `string` | `head` | 否 | `Head`任务名称 | `--head=ray-head` |
| `worker` | `string` | `worker` | 否 | `Worker`任务名称 | `--worker=ray-worker` |
| `headContainer` | `string` | `head` | 否 | `Head`容器名称 | `--headContainer=ray-head-container` |
| `workerContainer` | `string` | `worker` | 否 | `Worker`容器名称 | `--workerContainer=ray-worker-container` |
| `port` | `integer` | `6379` | 否 | `GCS`端口 | `--port=6380` |
| `dashboardPort` | `integer` | `8265` | 否 | `Dashboard`端口 | `--dashboardPort=8266` |
| `clientServerPort` | `integer` | `10001` | 否 | `Client Server`端口 | `--clientServerPort=10002` |

#### 使用场景

- **Ray分布式计算**：数据处理、机器学习推理
- **强化学习**：`RLlib`分布式训练
- **分布式Python应用**：大规模并行`Python`任务

#### 使用示例

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ray-cluster-job
spec:
  queue: default
  minAvailable: 3
  schedulerName: volcano
  plugins:
    ray: []  # 使用默认配置
    svc: []
  policies:
    - event: PodEvicted
      action: RestartJob
  queue: default
  tasks:
    - replicas: 1
      name: head
      template:
        spec:
          containers:
            - name: head
              image: rayproject/ray:latest-py311-cpu
              resources:
                limits:
                  cpu: 2
                  memory: 4Gi
          restartPolicy: OnFailure
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: worker
              image: rayproject/ray:latest-py311-cpu
              resources:
                limits:
                  cpu: 2
                  memory: 4Gi
          restartPolicy: OnFailure
```

**验证Ray集群**：

```bash
# 查看创建的Service
kubectl get service
# 输出：
# NAME                       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)                       AGE
# ray-cluster-job            ClusterIP   None           <none>        <none>                        5s
# ray-cluster-job-head-svc   ClusterIP   10.96.184.65   <none>        6379/TCP,8265/TCP,10001/TCP   5s

# 查看Pod状态
kubectl get pod
# 输出：
# NAME                       READY   STATUS    RESTARTS   AGE
# ray-cluster-job-head-0     1/1     Running   0          60s
# ray-cluster-job-worker-0   1/1     Running   0          60s
# ray-cluster-job-worker-1   1/1     Running   0          60s

# 访问Ray Dashboard（需要端口转发）
kubectl port-forward ray-cluster-job-head-0 8265:8265
# 在浏览器中访问 http://localhost:8265

# 提交Ray任务
kubectl exec ray-cluster-job-head-0 -- python -c "
import ray
ray.init()
@ray.remote
def hello():
    return 'Hello from Ray!'
print(ray.get(hello.remote()))
"
```

#### 注意事项

1. 插件会自动启用`SVC Plugin`，确保节点间通信正常
2. `Ray Plugin`基于`Ray CLI`，需要使用官方或兼容的`Ray`容器镜像
3. 通过`Service`可以从集群外部访问`Ray Dashboard`和提交任务
4. 插件自动配置`ray start`命令，无需在容器`command`中手动指定
5. 确保`Head`节点有足够的资源，因为它承担集群管理职责


