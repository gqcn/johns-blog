---
slug: /ai/kubeflow-trainer-deploy-usage
title: Kubeflow Trainer 安装、部署及使用
hide_title: true
keywords: [kubeflow, trainer, pytorch, 分布式训练, kubernetes, hpc, cpu训练, configmap, hostpath, docker]
description: "详细介绍Kubeflow Trainer的真实安装、部署及使用过程，基于CPU的PyTorch分布式训练案例，包括ConfigMap、HostPath、镜像构建三种部署方式的完整实践指南"
last_update:
  date: "2026-09-18"
---


## 简介

本文将介绍如何在`Kubernetes`集群中安装和部署`Kubeflow Trainer`，并通过真实的基于`CPU`的`PyTorch`分布式训练案例，详细演示三种不同的训练任务部署使用方式。


本文基于以下环境进行实践：

| 组件 | 版本 |
|------|------|
| **操作系统** | `MacOS M4` |
| **Kubernetes** | `1.27.3` |
| **Kubeflow Trainer** | `v2.1.0` |
| **PyTorch** | `2.4.1` |
| **Python** | `3.10+` |
| **训练设备** | `CPU` |

:::info 说明
虽然本文使用`CPU`进行训练演示，但所有方法同样适用于`GPU`训练场景，只需调整相应的资源配置即可。
:::

## 安装部署

### 前置条件

在开始安装之前，请确保：

1. ✅ 已安装并配置`Kubernetes`集群（版本 >= `1.27`）
2. ✅ 已安装`kubectl`命令行工具
3. ✅ 已安装`Helm`（版本 >= `3.0`）
4. ✅ 集群有足够的`CPU/内存`资源用于训练任务

### 方式一：Helm 部署（推荐）

`Helm`是最简单和推荐的部署方式，可以方便地管理`Kubeflow Trainer`的生命周期。

#### 拉取 Chart 到本地

```bash
helm pull oci://ghcr.io/kubeflow/charts/kubeflow-trainer --version 2.1.0 --untar
```

#### 部署 Kubeflow Trainer

```bash
helm install kubeflow-trainer ./kubeflow-trainer -n kubeflow-system --create-namespace
```

#### 验证部署结果

```bash
kubectl get pods -n kubeflow-system
```

预期输出：

```bash
NAME                                                   READY   STATUS    RESTARTS   AGE
jobset-controller-5b77f7f78-q6ftq                      1/1     Running   0          9m53s
kubeflow-trainer-controller-manager-56c44969b8-7mghh   1/1     Running   0          9m53s
```

:::tip 提示
- `jobset-controller`：负责管理`JobSet CRD`
- `kubeflow-trainer-controller-manager`：负责管理`TrainJob`、`TrainingRuntime`等训练相关资源
:::

### 方式二：kubectl 部署

如果不使用`Helm`，也可以直接通过`kubectl`部署：

```bash
export VERSION=v2.1.0
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/manager?ref=${VERSION}"
```

### 验证 API 资源

部署完成后，验证`Kubeflow Trainer`提供的`API`资源：

```bash
kubectl api-resources | grep trainer
```

预期输出：

```text
NAME                          SHORTNAMES   APIVERSION                      NAMESPACED   KIND
clustertrainingruntimes       ctr          trainer.kubeflow.org/v1alpha1   false        ClusterTrainingRuntime
trainingruntimes              tr           trainer.kubeflow.org/v1alpha1   true         TrainingRuntime
trainjobs                     tj           trainer.kubeflow.org/v1alpha1   true         TrainJob
```

## Training Runtimes 配置

### 什么是Training Runtimes？

`Training Runtimes`是`Kubeflow Trainer`的上层增强组件，用于标准化训练环境配置。它的核心价值在于：

| 功能 | 说明 |
|------|------|
| **标准化训练环境** | 预定义训练运行时（如`pytorch-2.1-cpu`、`tensorflow-2.15-gpu`），提交任务时直接引用 |
| **多框架适配** | 支持不同框架（`PyTorch/TensorFlow/MXNet`）、不同版本、不同硬件（`CPU/GPU`） |
| **简化任务提交** | `TrainJob`只需指定`runtimeRef`即可复用配置，无需重复定义 |
| **增强的资源调度** | 支持更精细的资源调度策略（如`GPU`分片、节点亲和性）和任务容错机制 |

### Training Runtimes常用模板

通过以下方式安装社区提供的`Training Runtimes`常用模板：

```bash
export VERSION=v2.1.0
kubectl apply --server-side -k "https://github.com/kubeflow/trainer.git/manifests/overlays/manager?ref=${VERSION}"
```

:::info 使用建议
- **基础分布式训练**：仅需`TrainJob/PyTorchJob/TFJob`，现有组件已满足需求
- **灵活训练环境管理**：需要多框架适配、资源调度优化，建议安装`Training Runtimes`
:::

### 创建ClusterTrainingRuntime

下面创建一个用于`PyTorch CPU`训练的自定义运行时模板：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: training-runtime-demo
  labels:
    # 指定训练框架类型为 PyTorch
    trainer.kubeflow.org/framework: torch
spec:
  # ML策略配置：定义分布式训练的基础参数
  mlPolicy:
    # ClusterTrainingRuntime 模板中的默认节点数（会被 TrainJob 中的 numNodes 覆盖）
    numNodes: 1
    # PyTorch 框架专用配置
    torch:
      # 每个节点的进程数
      # auto: 自动检测（通常等于 GPU/CPU 核心数）
      # 也可以设置具体数字如 2、4 等
      numProcPerNode: auto
  
  # JobSet 模板配置
  template:
    spec:
      replicatedJobs:
      # 不能随意修改该名称
      # Kubeflow Trainer在生成PET_MASTER_ADDR环境变量时硬编码使用了node
      - name: node
        template:
          metadata:
            labels:
              # trainjob-ancestor-step: 标识该 Job 在训练流程中的角色
              # trainer: 表示这是训练任务的主执行器
              trainer.kubeflow.org/trainjob-ancestor-step: trainer
          spec:
            # 调试配置：减少重试次数，快速失败
            backoffLimit: 2
            # 调试配置：失败后保留 Pod 30分钟以便查看日志
            ttlSecondsAfterFinished: 1800
            template:
              spec:
                # 调试配置：失败后不自动重启，保留现场
                restartPolicy: Never
                containers:
                # 当Job模板标签为 trainer.kubeflow.org/trainjob-ancestor-step: trainer 时
                # 必须包含名为 node 的容器
                - name: node
                  image: pytorch/pytorch:2.4.1-cuda11.8-cudnn9-runtime
                  # 使用 torchrun 启动分布式训练
                  # Kubeflow Trainer 会自动注入 PET_* 环境变量
                  command:
                    - torchrun
                    - --nproc_per_node=$(PET_NPROC_PER_NODE)
                    - --nnodes=$(PET_NNODES)
                    - --node_rank=$(PET_NODE_RANK)
                    - --master_addr=$(PET_MASTER_ADDR)
                    - --master_port=$(PET_MASTER_PORT)
                    - /workspace/pytorch-demo.py
                  env:
                  - name: PYTHONUNBUFFERED
                    value: "1"
```

应用配置：

```bash
kubectl apply -f training-runtime-demo.yaml
```

:::tip 关键环境变量说明
`Kubeflow Trainer`会自动为训练`Pod`注入以下环境变量：

| 环境变量 | 说明 | 示例值 |
|----------|------|--------|
| `PET_NNODES` | 训练节点总数 | `2` |
| `PET_NPROC_PER_NODE` | 每节点进程数 | `2` |
| `PET_NODE_RANK` | 当前节点编号（0开始） | `0`, `1` |
| `PET_MASTER_ADDR` | 主节点地址 | `trainjob-demo-node-0-0.trainjob-demo` |
| `PET_MASTER_PORT` | 主节点端口 | `29500` |
:::

## PyTorch 分布式训练案例

### 脚本示例

我们使用一个简单的`PyTorch`分布式训练脚本来演示三种部署方式。该脚本实现了一个简单的线性回归模型训练：

```python
import os
import torch
import torch.nn as nn
import torch.optim as optim
import torch.distributed as dist
from torch.utils.data import Dataset, DataLoader
from torch.utils.data.distributed import DistributedSampler

# ====================== 1. 定义简单的数据集和模型 ======================
class SimpleDataset(Dataset):
    """简单的数据集：输入是随机数，标签是输入的2倍（简单回归任务）"""
    def __init__(self, size=100):
        self.data = torch.randn(size, 1)  # 输入：(size, 1)
        self.labels = self.data * 2 + 0.1 * torch.randn_like(self.data)  # 标签：2x + 噪声

    def __len__(self):
        return len(self.data)

    def __getitem__(self, idx):
        return self.data[idx], self.labels[idx]

class SimpleModel(nn.Module):
    """简单的线性模型：y = wx + b"""
    def __init__(self):
        super(SimpleModel, self).__init__()
        self.linear = nn.Linear(1, 1)

    def forward(self, x):
        return self.linear(x)

# ====================== 2. 初始化分布式进程组 ======================
def init_distributed():
    """
    初始化分布式环境（CPU + gloo后端）
    
    Kubeflow Trainer 会自动设置以下环境变量：
    - RANK: 全局进程排名（由 torchrun 设置）
    - WORLD_SIZE: 总进程数（由 torchrun 设置）
    - LOCAL_RANK: 节点内进程排名（由 torchrun 设置）
    - MASTER_ADDR: 主节点地址（由 torchrun 设置）
    - MASTER_PORT: 主节点端口（由 torchrun 设置）
    """
    # 从环境变量中获取分布式训练参数（torchrun 设置的标准环境变量）
    rank = int(os.environ.get("RANK", 0))
    world_size = int(os.environ.get("WORLD_SIZE", 1))
    local_rank = int(os.environ.get("LOCAL_RANK", 0))
    
    print(f"[初始化] RANK={rank}, WORLD_SIZE={world_size}, LOCAL_RANK={local_rank}")
    print(f"[初始化] MASTER_ADDR={os.environ.get('MASTER_ADDR', 'N/A')}")
    print(f"[初始化] MASTER_PORT={os.environ.get('MASTER_PORT', 'N/A')}")
    
    # 初始化分布式进程组
    # 使用 gloo 后端（CPU专用），自动从环境变量读取配置
    dist.init_process_group(backend="gloo")
    
    print(f"[初始化完成] 成功初始化分布式进程组")

    return rank, world_size, local_rank

# ====================== 3. 核心训练函数 ======================
def train():
    print("=" * 60)
    print("开始 PyTorch 分布式训练（Kubeflow Trainer 版本）")
    print("=" * 60)
    
    # 初始化分布式环境
    rank, world_size, local_rank = init_distributed()

    # 设置当前进程的设备（CPU）
    device = torch.device("cpu")

    # 1. 构建数据集和分布式采样器（核心：将数据分发给不同进程）
    dataset = SimpleDataset(size=100)
    # DistributedSampler：保证不同进程读取不同的数据分片
    sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    dataloader = DataLoader(
        dataset,
        batch_size=10,
        sampler=sampler,  # 必须用分布式采样器，替代shuffle
        num_workers=0  # 简化demo，关闭多线程
    )

    # 2. 构建模型并包装为分布式数据并行（DDP）
    model = SimpleModel()
    # DDP：自动处理参数同步、梯度聚合
    model = nn.parallel.DistributedDataParallel(model, device_ids=None)  # CPU训练，device_ids设为None

    # 3. 定义损失函数和优化器
    criterion = nn.MSELoss()
    optimizer = optim.SGD(model.parameters(), lr=0.01)

    # 4. 训练循环
    epochs = 5
    print(f"\n[Rank {rank}] 开始训练，共 {epochs} 个 epoch")
    print("-" * 60)
    
    for epoch in range(epochs):
        # 每个epoch开始前，更新采样器的epoch（保证分布式数据打乱的一致性）
        sampler.set_epoch(epoch)
        model.train()
        total_loss = 0.0

        for batch_idx, (data, labels) in enumerate(dataloader):
            # 将数据移动到设备
            data, labels = data.to(device), labels.to(device)
            
            # 前向传播
            outputs = model(data)
            loss = criterion(outputs, labels)

            # 反向传播和优化
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()

            total_loss += loss.item()

        # 只在主进程（rank=0）打印训练信息
        if rank == 0:
            avg_loss = total_loss / len(dataloader)
            print(f"Epoch [{epoch+1}/{epochs}], Average Loss: {avg_loss:.4f}")

    print("-" * 60)
    print(f"[Rank {rank}] 训练完成！")
    
    # 在主进程打印最终的模型参数
    if rank == 0:
        print("\n" + "=" * 60)
        print("最终模型参数:")
        for name, param in model.named_parameters():
            print(f"  {name}: {param.data}")
        print("=" * 60)

    # 清理分布式进程组
    dist.destroy_process_group()
    print(f"[Rank {rank}] 进程组已销毁")

if __name__ == "__main__":
    train()
```

:::tip 代码关键点
1. **分布式初始化**：使用`dist.init_process_group(backend="gloo")`初始化分布式环境，`CPU`训练使用`gloo`后端
2. **数据并行**：使用`DistributedSampler`确保不同进程读取不同的数据分片
3. **模型并行**：使用`DistributedDataParallel`包装模型，自动处理梯度聚合
4. **环境变量**：`Kubeflow Trainer`会自动设置所有必要的环境变量（`RANK`、`WORLD_SIZE`、`MASTER_ADDR`等）
:::

### 本地测试

在提交到`Kubernetes`之前，可以先在本地测试脚本是否正常运行：

```bash
# 启动2个CPU进程模拟分布式训练（world_size=2）
torchrun --nproc_per_node=2 --master_port=23456 pytorch-demo.py
```

预期输出：

```bash
[初始化] RANK=0, WORLD_SIZE=2, LOCAL_RANK=0
[初始化完成] 成功初始化分布式进程组
[Rank 0] 开始训练，共 5 个 epoch
------------------------------------------------------------
Epoch [1/5], Average Loss: 0.0234
Epoch [2/5], Average Loss: 0.0189
Epoch [3/5], Average Loss: 0.0156
Epoch [4/5], Average Loss: 0.0128
Epoch [5/5], Average Loss: 0.0103
------------------------------------------------------------
[Rank 0] 训练完成！
```

## 部署方式一：ConfigMap 挂载脚本

### 方案说明

`ConfigMap`方式适合快速开发和测试场景，将训练脚本存储在`ConfigMap`中，然后挂载到训练`Pod`中。

**优点：**
- ✅ 快速迭代：修改脚本只需更新`ConfigMap`
- ✅ 无需构建镜像：避免镜像构建和推送的开销
- ✅ 适合调试：快速验证训练逻辑

**缺点：**
- ❌ 文件大小限制：`ConfigMap`最大`1MB`
- ❌ 不适合生产：缺少版本控制和回滚能力

### 部署步骤

#### 创建 ConfigMap

将训练脚本打包到`ConfigMap`中：

```bash
kubectl create configmap pytorch-demo-script --from-file=pytorch-demo.py
```

验证`ConfigMap`：

```bash
kubectl get configmap pytorch-demo-script
kubectl describe configmap pytorch-demo-script
```

#### 创建 TrainJob

创建`trainjob-demo-with-configmap.yaml`：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: trainjob-demo-with-configmap
spec:
  # 引用前面定义的 ClusterTrainingRuntime
  runtimeRef:
    kind: ClusterTrainingRuntime
    name: training-runtime-demo
  
  # 训练器配置
  trainer:
    # 训练节点数量
    numNodes: 2
    
    # 每个节点的进程数
    numProcPerNode: 2
    
    # 每个节点的资源配置
    resourcesPerNode:
      requests:
        cpu: "1"
        memory: "2Gi"
      limits:
        cpu: "1"
        memory: "2Gi"

  # Pod 模板覆盖配置 - 用于挂载 ConfigMap
  podTemplateOverrides:
    - targetJobs:
        - name: node
      spec:
        containers:
          - name: node
            volumeMounts:
              - name: training-script
                mountPath: /workspace
        volumes:
          - name: training-script
            configMap:
              name: pytorch-demo-script
```

应用配置：

```bash
kubectl apply -f trainjob-demo-with-configmap.yaml
```

#### 查看训练状态

```bash
# 查看 TrainJob 状态
kubectl get trainjob trainjob-demo-with-configmap

# 查看 Pod 状态
kubectl get pods -l training.kubeflow.org/job-name=trainjob-demo-with-configmap

# 查看训练日志
kubectl logs -l training.kubeflow.org/job-name=trainjob-demo-with-configmap -f

# 查看详细信息
kubectl describe trainjob trainjob-demo-with-configmap
```

#### 预期输出

从任一训练`Pod`的日志中，你应该看到类似的输出：

```bash
[初始化] RANK=0, WORLD_SIZE=4, LOCAL_RANK=0
[初始化] MASTER_ADDR=trainjob-demo-with-configmap-node-0-0.trainjob-demo-with-configmap
[初始化] MASTER_PORT=29500
[初始化完成] 成功初始化分布式进程组
[Rank 0] 开始训练，共 5 个 epoch
------------------------------------------------------------
Epoch [1/5], Average Loss: 0.0234
Epoch [2/5], Average Loss: 0.0189
Epoch [3/5], Average Loss: 0.0156
Epoch [4/5], Average Loss: 0.0128
Epoch [5/5], Average Loss: 0.0103
------------------------------------------------------------
[Rank 0] 训练完成！
```

:::tip 分布式训练验证
- 查看`WORLD_SIZE`确认总进程数：`2节点 × 2进程/节点 = 4进程`
- 查看`RANK`确认进程编号：`0, 1, 2, 3`
- 查看`MASTER_ADDR`确认主节点地址
:::

#### 清理资源

```bash
kubectl delete trainjob trainjob-demo-with-configmap
kubectl delete configmap pytorch-demo-script
```

## 部署方式二：HostPath 挂载脚本

### 方案说明

`HostPath`方式将宿主机目录挂载到训练`Pod`中，适合训练脚本频繁变更的场景。

**优点：**
- ✅ 无需重建：直接修改宿主机文件，`Pod`重启即可生效
- ✅ 大文件支持：不受`ConfigMap`大小限制
- ✅ 共享存储：多个`Pod`可以共享相同的脚本和数据

**缺点：**
- ❌ 节点依赖：需要确保所有节点都有相同路径的文件（可以使用云盘）
- ❌ 安全风险：直接访问宿主机文件系统
- ❌ 不适合生产：缺少隔离和版本控制

### 部署步骤

#### 准备宿主机目录

在所有训练节点上创建相同的目录结构并放置脚本：

```bash
# 在每个节点上执行
sudo mkdir -p /data/kubeflow-training/scripts
sudo cp pytorch-demo.py /data/kubeflow-training/scripts/
sudo chmod -R 755 /data/kubeflow-training/scripts
```

:::warning 注意
使用`HostPath`时，必须确保脚本文件在所有可能调度训练`Pod`的节点上都存在，且路径完全一致。
:::

#### 创建 TrainJob

创建`trainjob-demo-with-hostpath.yaml`：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: trainjob-demo-with-hostpath
spec:
  # 引用前面定义的 ClusterTrainingRuntime
  runtimeRef:
    kind: ClusterTrainingRuntime
    name: training-runtime-demo
  
  # 训练器配置
  trainer:
    # 训练节点数量
    numNodes: 2
    
    # 每个节点的进程数
    numProcPerNode: 2
    
    # 每个节点的资源配置
    resourcesPerNode:
      requests:
        cpu: "1"
        memory: "2Gi"
      limits:
        cpu: "1"
        memory: "2Gi"

  # Pod 模板覆盖配置 - 用于挂载 HostPath
  podTemplateOverrides:
    - targetJobs:
        - name: node
      spec:
        containers:
          - name: node
            volumeMounts:
              - name: training-script
                mountPath: /workspace
                readOnly: true
        volumes:
          - name: training-script
            # 使用 HostPath 挂载宿主机目录
            hostPath:
              # 宿主机上的脚本目录路径
              path: /data/kubeflow-training/scripts
              type: Directory
```

应用配置：

```bash
kubectl apply -f trainjob-demo-with-hostpath.yaml
```

#### 查看训练状态

```bash
# 查看 TrainJob 状态
kubectl get trainjob trainjob-demo-with-hostpath

# 查看 Pod 状态
kubectl get pods -l training.kubeflow.org/job-name=trainjob-demo-with-hostpath

# 查看训练日志
kubectl logs -l training.kubeflow.org/job-name=trainjob-demo-with-hostpath -f
```

#### 动态更新脚本

`HostPath`的优势在于可以动态更新脚本而无需重建镜像：

```bash
# 修改宿主机上的脚本
sudo vi /data/kubeflow-training/scripts/pytorch-demo.py

# 删除现有的 TrainJob（会触发 Pod 重启）
kubectl delete trainjob trainjob-demo-with-hostpath

# 重新创建 TrainJob（Pod 会读取最新的脚本）
kubectl apply -f trainjob-demo-with-hostpath.yaml
```

#### 清理资源

```bash
kubectl delete trainjob trainjob-demo-with-hostpath

# 清理宿主机文件（可选）
sudo rm -rf /data/kubeflow-training/scripts
```

## 部署方式三：镜像构建方式（推荐）

### 方案说明

镜像构建方式是生产环境的推荐方式，将训练脚本打包到`Docker`镜像中。

**优点：**
- ✅ 生产就绪：完整的版本控制和回滚能力
- ✅ 可移植性：镜像可以在任何`Kubernetes`集群中运行
- ✅ 依赖管理：可以在镜像中预装所有依赖
- ✅ 安全隔离：不依赖宿主机文件系统

**缺点：**
- ❌ 构建开销：每次修改都需要重新构建和推送镜像
- ❌ 存储成本：需要镜像仓库存储空间

### 部署步骤

#### 创建 Dockerfile

创建`Dockerfile`：

```dockerfile
FROM --platform=linux/amd64 pytorch/pytorch:2.4.1-cuda11.8-cudnn9-runtime

# 设置工作目录
WORKDIR /workspace

# 复制训练脚本
COPY pytorch-demo.py /workspace/pytorch-demo.py

# 设置Python不缓冲输出（便于查看日志）
ENV PYTHONUNBUFFERED=1
```

:::info 镜像说明
- 基础镜像：使用官方`PyTorch`镜像，已包含`PyTorch`和常用依赖
- 平台指定：`--platform=linux/amd64`确保镜像兼容性（特别是在`Apple Silicon`上构建时）
- 工作目录：将脚本放在`/workspace`目录，与前面的配置保持一致
:::

#### 构建镜像

```bash
docker buildx build --load --platform linux/amd64 -t pytorch-demo:latest .
```

:::tip 构建选项说明
- `--load`：构建完成后加载到本地`Docker`
- `--platform linux/amd64`：指定目标平台为`amd64`
- `-t pytorch-demo:latest`：指定镜像标签
:::

验证镜像：

```bash
docker images | grep pytorch-demo
```

#### 推送镜像到仓库（可选）

如果是多节点集群，需要将镜像推送到镜像仓库：

```bash
# 标记镜像
docker tag pytorch-demo:latest your-registry/pytorch-demo:latest

# 推送到镜像仓库
docker push your-registry/pytorch-demo:latest
```

:::info 本地测试
如果使用单节点集群（如`Kind`、`Minikube`），可以将镜像直接加载到集群：

```bash
# Kind 示例
kind load docker-image pytorch-demo:latest

# Minikube 示例
minikube image load pytorch-demo:latest
```
:::

#### 创建 TrainJob

创建`trainjob-demo-with-image.yaml`：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: trainjob-demo-with-image
spec:
  # 引用前面定义的 ClusterTrainingRuntime
  runtimeRef:
    kind: ClusterTrainingRuntime
    name: training-runtime-demo
  
  # 训练器配置
  trainer:
    # 容器镜像（会覆盖 runtime 中的镜像）
    image: pytorch-demo:latest

    # 训练节点数量
    numNodes: 2
    
    # 每个节点的进程数
    numProcPerNode: 2
    
    # 每个节点的资源配置
    resourcesPerNode:
      requests:
        cpu: "1"
        memory: "2Gi"
      limits:
        cpu: "1"
        memory: "2Gi"
```

:::tip 镜像覆盖
`trainer.image`字段会覆盖`ClusterTrainingRuntime`中定义的镜像，因此不需要修改`runtime`配置。
:::

应用配置：

```bash
kubectl apply -f trainjob-demo-with-image.yaml
```

#### 查看训练状态

```bash
# 查看 TrainJob 状态
kubectl get trainjob trainjob-demo-with-image

# 查看 Pod 状态
kubectl get pods -l training.kubeflow.org/job-name=trainjob-demo-with-image

# 查看训练日志
kubectl logs -l training.kubeflow.org/job-name=trainjob-demo-with-image -f
```

#### 更新训练脚本

当需要更新训练脚本时：

```bash
# 1. 修改脚本
vi pytorch-demo.py

# 2. 重新构建镜像（使用新的版本标签）
docker buildx build --load --platform linux/amd64 -t pytorch-demo:v1.1 .

# 3. 更新 TrainJob 配置中的镜像版本
# 修改 trainjob-demo-with-image.yaml 中的 image: pytorch-demo:v1.1

# 4. 重新部署
kubectl delete trainjob trainjob-demo-with-image
kubectl apply -f trainjob-demo-with-image.yaml
```

:::tip 版本管理最佳实践
- 使用语义化版本号：`v1.0.0`、`v1.1.0`等
- 避免使用`latest`标签（除非是开发测试环境）
- 在`Git`中为每个镜像版本打`tag`
- 使用`CI/CD`自动化镜像构建和推送流程
:::

#### 清理资源

```bash
kubectl delete trainjob trainjob-demo-with-image

# 清理本地镜像（可选）
docker rmi pytorch-demo:latest
```

## 三种部署方式对比

| 对比维度 | ConfigMap | HostPath | 镜像构建 |
|---------|-----------|----------|---------|
| **适用场景** | 快速开发、小脚本测试 | 频繁修改、本地开发 | 生产环境、多集群部署 |
| **更新速度** | ⚡ 快（更新ConfigMap） | ⚡⚡ 最快（修改文件） | 🐢 慢（重新构建镜像） |
| **版本控制** | ❌ 不支持 | ❌ 不支持 | ✅ 完整支持 |
| **依赖管理** | ❌ 需基础镜像包含 | ❌ 需基础镜像包含 | ✅ 可自定义安装 |
| **文件大小限制** | ⚠️ 1MB | ✅ 无限制 | ✅ 无限制 |
| **多节点同步** | ✅ 自动同步 | ❌ 需手动同步 | ✅ 自动同步 |
| **安全性** | ✅ 较好 | ⚠️ 较差 | ✅ 最好 |
| **可移植性** | ⚡ 中等 | ❌ 差 | ✅ 最好 |
| **生产就绪** | ❌ | ❌ | ✅ |


## 常见问题排查

### Pod Pending

**问题描述：**
```bash
kubectl get pods
NAME                                   READY   STATUS    RESTARTS   AGE
trainjob-demo-node-0-0-xxxxx          0/1     Pending   0          5m
```

**排查步骤：**

```bash
# 查看 Pod 详情
kubectl describe pod <pod-name>

# 常见原因：
# 1. 资源不足：Insufficient cpu/memory
# 2. 节点不可调度：Node Unschedulable
# 3. 镜像拉取失败：ImagePullBackOff
```

**解决方案：**

```yaml
# 1. 降低资源请求
resourcesPerNode:
  requests:
    cpu: "500m"    # 降低到500毫核
    memory: "1Gi"  # 降低到1GB

# 2. 检查节点状态
kubectl get nodes
kubectl describe node <node-name>

# 3. 使用本地镜像（开发环境）
imagePullPolicy: Never  # 添加到容器配置中
```

### ConfigMap Not Found

**问题描述：**
```bash
Error: configmaps "pytorch-demo-script" not found
```

**解决方案：**

```bash
# 1. 确认 ConfigMap 是否存在
kubectl get configmap

# 2. 确认命名空间是否正确
kubectl get configmap -n <namespace>

# 3. 重新创建 ConfigMap
kubectl create configmap pytorch-demo-script --from-file=pytorch-demo.py
```

### HostPath 文件不存在

**问题描述：**
```bash
Error: failed to start container: stat /data/kubeflow-training/scripts: no such file or directory
```

**解决方案：**

```bash
# 1. 登录到训练 Pod 调度的节点
kubectl get pod <pod-name> -o wide  # 查看 NODE 列

# 2. 在该节点上创建目录并复制文件
ssh <node>
sudo mkdir -p /data/kubeflow-training/scripts
sudo cp pytorch-demo.py /data/kubeflow-training/scripts/
sudo chmod -R 755 /data/kubeflow-training/scripts

# 3. 对所有可能的训练节点重复上述步骤
```

### 训练任务卡住不启动

**问题描述：**
所有`Pod`都处于`Running`状态，但训练日志没有输出。

**排查步骤：**

```bash
# 1. 查看所有 Pod 的日志
kubectl logs -l training.kubeflow.org/job-name=<trainjob-name> --all-containers

# 2. 检查环境变量是否正确注入
kubectl exec <pod-name> -- env | grep PET_

# 3. 检查网络连通性
kubectl exec <pod-name> -- ping <master-pod-ip>
```

**常见原因：**
1. 主节点地址`MASTER_ADDR`不正确
2. 端口`29500`被占用或无法访问
3. 防火墙规则阻止了`Pod`间通信

**解决方案：**

```yaml
# 1. 检查 ClusterTrainingRuntime 配置
# 确保 replicatedJobs 名称为 "node"
replicatedJobs:
- name: node  # 必须是 "node"

# 2. 检查端口配置
# 如果端口冲突，可以修改默认端口
env:
- name: MASTER_PORT
  value: "29501"  # 使用不同的端口
```

### API 版本错误

**问题描述：**
```bash
error: unable to recognize "trainjob.yaml": no matches for kind "TrainJob" in version "trainer.kubeflow.org/v2alpha1"
```

**解决方案：**

```bash
# 1. 确认集群支持的 API 版本
kubectl api-resources | grep trainjob

# 2. 使用正确的 API 版本
apiVersion: trainer.kubeflow.org/v1alpha1  # 而不是 v2alpha1
```

## 最佳实践

### 资源配置

```yaml
# 生产环境推荐配置
trainer:
  numNodes: 4
  numProcPerNode: 8
  resourcesPerNode:
    requests:
      cpu: "16"
      memory: "64Gi"
      nvidia.com/gpu: 4  # GPU训练
    limits:
      cpu: "16"
      memory: "64Gi"
      nvidia.com/gpu: 4
```

### 监控和日志

```yaml
# 添加到 ClusterTrainingRuntime 的容器配置中
env:
# 日志配置
- name: PYTHONUNBUFFERED
  value: "1"
- name: LOGLEVEL
  value: "INFO"

# Prometheus 监控（如果使用）
- name: PROMETHEUS_PUSHGATEWAY
  value: "http://prometheus-pushgateway:9091"
```

### 任务容错

```yaml
# 在 ClusterTrainingRuntime 中配置
spec:
  template:
    spec:
      replicatedJobs:
      - name: node
        template:
          spec:
            # 失败重试次数
            backoffLimit: 3
            # 任务完成后保留时间
            ttlSecondsAfterFinished: 3600
```

### 弹性训练

```yaml
# 支持动态扩缩容（PyTorch Elastic）
spec:
  mlPolicy:
    numNodes: 4
    torch:
      numProcPerNode: auto
      # 启用弹性训练
      elasticPolicy:
        minNodes: 2       # 最少节点数
        maxNodes: 8       # 最多节点数
        maxRestarts: 3    # 最大重启次数
```

### GPU 训练配置

```yaml
# GPU 训练示例
spec:
  mlPolicy:
    torch:
      numProcPerNode: gpu  # 自动检测 GPU 数量
  template:
    spec:
      replicatedJobs:
      - name: node
        template:
          spec:
            template:
              spec:
                containers:
                - name: node
                  resources:
                    limits:
                      nvidia.com/gpu: 4  # 每节点4个GPU
                  # GPU训练使用NCCL后端
                  env:
                  - name: NCCL_DEBUG
                    value: "INFO"
```

## 参考资料

- [Kubeflow Trainer 官方文档](https://www.kubeflow.org/docs/components/trainer/)
- [Kubeflow Trainer GitHub](https://github.com/kubeflow/trainer)
- [PyTorch 分布式训练教程](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html)
- [torchrun 文档](https://pytorch.org/docs/stable/elastic/run.html)
- [Kubernetes ConfigMap](https://kubernetes.io/docs/concepts/configuration/configmap/)
- [Kubernetes HostPath](https://kubernetes.io/docs/concepts/storage/volumes/#hostpath)
