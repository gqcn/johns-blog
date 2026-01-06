---
slug: "/ai/kubeflow-trainer-pytorch-parallel-computing"
title: "Kubeflow Trainer PyTorch并行计算"
hide_title: true
keywords:
  [
    "Kubeflow Trainer",
    "PyTorch",
    "并行计算",
    "分布式训练",
    "DDP",
    "FSDP",
    "torchrun",
    "HPC",
    "数据并行",
    "模型并行",
    "NCCL",
    "Gloo",
    "torch.distributed",
    "DistributedDataParallel",
    "FullyShardedDataParallel",
    "GPU训练",
    "多机多卡",
    "TrainJob",
    "TrainingRuntime",
    "Kubernetes",
    "分布式环境变量",
    "WORLD_SIZE",
    "RANK",
    "LOCAL_RANK"
  ]
description: "深入介绍Kubeflow Trainer如何支持PyTorch框架实现HPC并行计算能力，包括HPC并行计算基础特性、PyTorch分布式训练原理、Kubeflow Trainer的CRD设计与组件架构、torchrun自动配置机制，以及算法工程师如何在代码中使用并行计算能力"
---

## HPC并行计算基础特性

### 什么是HPC并行计算

`HPC`（`High Performance Computing`，高性能计算）是指利用多个计算资源（如`CPU`、`GPU`）协同工作，以解决复杂计算问题的技术。在`AI`模型训练场景中，`HPC`并行计算是实现大规模模型训练的核心技术基础。

### 并行计算的核心特性

| 特性 | 描述 | 在AI训练中的应用 |
|------|------|------------------|
| **任务分解** | 将大任务拆分为多个可并行执行的子任务 | 将训练数据分片到多个`GPU` |
| **并行执行** | 多个计算单元同时处理不同子任务 | 多`GPU`同时计算梯度 |
| **通信同步** | 计算单元间交换数据和同步状态 | 梯度聚合、参数同步 |
| **结果合并** | 将各计算单元的结果汇总 | 模型参数更新 |

### AI训练中的并行策略

在`AI`大模型训练中，单个`GPU`的计算能力和显存往往无法满足需求，需要使用多个`GPU`协同工作。并行策略就是如何合理地将训练任务分配到多个`GPU`上的方法。

#### 并行策略分类对比

| 并行策略 | 英文名称 | 核心原理 | 简单理解 | 适用场景 | 优势 | 局限性 |
|---------|---------|---------|---------|---------|------|--------|
| **数据并行** | Data Parallelism (DP) | 每个`GPU`持有完整模型，处理不同的数据分片 | 就像4个厨师，每人拿着相同的菜谱（模型），同时做不同的菜（数据），最后交流心得（同步梯度） | 模型较小，数据量大 | 最简单、应用最广泛 | 每个`GPU`都要存完整模型，显存开销大 |
| **模型并行** | Model Parallelism (MP) | 将模型的不同层分配到不同`GPU` | 就像流水线，第1个工人加工零件A（第1层），传给第2个工人加工零件B（第2层） | 模型超大，单`GPU`装不下 | 突破单卡显存限制 | `GPU`间需频繁传输数据，可能有空闲等待 |
| **流水线并行** | Pipeline Parallelism (PP) | 模型并行+微批次流水线优化 | 改进版流水线：第1批数据在第1个工人处理时，第2批数据同时进入第2个工人 | 大模型+想提高效率 | 减少`GPU`空闲时间 | 实现复杂，需要合理划分批次 |
| **张量并行** | Tensor Parallelism (TP) | 将单个神经网络层的计算拆分到多个`GPU` | 就像搬一个大箱子，几个人同时抬不同部位 | 单层计算量特别大 | 层内并行，减少等待 | 需要更多`GPU`间通信 |

#### 数据并行详解

数据并行是最常用的并行策略，下面通过图示和术语表来深入理解：

```mermaid
graph TB
    subgraph "并行策略分类"
        DP["数据并行<br/>Data Parallelism"]
        MP["模型并行<br/>Model Parallelism"]
        PP["流水线并行<br/>Pipeline Parallelism"]
        TP["张量并行<br/>Tensor Parallelism"]
    end
    
    subgraph "数据并行原理"
        D1["GPU 0: 数据分片1 + 完整模型"]
        D2["GPU 1: 数据分片2 + 完整模型"]
        D3["GPU 2: 数据分片3 + 完整模型"]
        D4["GPU 3: 数据分片4 + 完整模型"]
        SYNC["梯度同步 AllReduce"]
    end
    
    DP --> D1
    DP --> D2
    DP --> D3
    DP --> D4
    D1 --> SYNC
    D2 --> SYNC
    D3 --> SYNC
    D4 --> SYNC
```

**数据并行核心术语**：

| 术语 | 英文 | 定义 | 通俗理解 | 在数据并行中的作用 |
|------|-----|------|---------|-------------------|
| **数据分片** | Data Sharding | 将完整训练数据集切分成多份，每份分配给一个`GPU` | 把一本书的页码平均分给4个人同时阅读 | 图中`GPU 0/1/2/3`各自处理不同"数据分片"，避免重复计算相同数据 |
| **模型副本** | Model Replica | 每个`GPU`上存储的完整模型拷贝 | 每个人手里都有一本相同的菜谱（模型） | 确保每个`GPU`都能独立完成前向和反向传播计算 |
| **前向传播** | Forward Pass | 数据从输入层经过各层计算到输出层的过程 | 按照菜谱一步步做菜的过程 | 每个`GPU`独立用自己的数据分片计算输出，互不干扰 |
| **反向传播** | Backward Pass | 从输出层计算损失，逐层计算梯度传回输入层 | 做完菜后总结每一步的改进空间 | 每个`GPU`独立计算自己数据分片产生的梯度 |
| **梯度** | Gradient | 损失函数对模型参数的导数，指示参数更新方向 | 告诉你模型参数应该往哪个方向调整、调多少 | 每个`GPU`计算出"本地梯度"，需要同步后才能更新模型 |
| **梯度同步** | Gradient Synchronization | 将所有`GPU`的梯度汇总求平均（或求和），让所有`GPU`得到相同的梯度 | 4个厨师分别做菜后，交流心得并达成一致意见 | **数据并行的关键步骤**：确保所有`GPU`用相同的梯度更新模型，保持模型一致性 |
| **AllReduce** | AllReduce | 一种集合通信算法，高效地完成"所有进程的数据求和并广播给所有进程" | 就像开会时统计大家的意见，算出平均值，再告诉每个人 | 实现梯度同步的高效通信方式，比逐个传递快得多 |
| **参数更新** | Parameter Update | 使用梯度更新模型参数 | 根据改进建议（梯度）修改菜谱（模型） | 同步后所有`GPU`用相同梯度更新参数，确保模型一致 |
| **DistributedSampler** | Distributed Sampler | `PyTorch`提供的数据采样器，确保各`GPU`取到不重复的数据分片 | 自动分配工作的调度员，保证4个人不会重复读同一页书 | 训练时必须使用，否则所有`GPU`会处理相同数据导致浪费 |

**数据并行的完整流程（以4个GPU为例）**：

1. **初始化阶段**：
   - 4个`GPU`各自加载相同的模型副本（模型参数完全一致）
   - 准备好完整的训练数据集

2. **数据分片**：
   - 使用`DistributedSampler`将一个批次（例如256张图片）均匀分成4份
   - `GPU 0`处理图片1-64，`GPU 1`处理图片65-128，以此类推

3. **前向传播**（各GPU独立计算）：
   - 每个`GPU`用自己的64张图片，通过模型计算得到预测结果
   - 这一步**不需要通信**，各`GPU`并行执行

4. **反向传播**（各GPU独立计算梯度）：
   - 每个`GPU`计算损失，并反向传播得到本地梯度
   - `GPU 0`得到梯度$\nabla W_0$，`GPU 1`得到$\nabla W_1$，等等

5. **梯度同步**（关键通信步骤）：
   - 通过`AllReduce`操作，所有`GPU`交换梯度并求平均
   - 最终所有`GPU`得到相同的平均梯度：$\nabla W = \frac{1}{4}(\nabla W_0 + \nabla W_1 + \nabla W_2 + \nabla W_3)$

6. **参数更新**（各GPU独立执行）：
   - 每个`GPU`用相同的平均梯度更新自己的模型参数
   - 由于起点相同（上一步参数一致）、更新量相同（同步后的梯度一致），所以更新后参数仍然一致

7. **重复步骤2-6**，直到训练完成

**为什么需要梯度同步？**

假设没有梯度同步，会发生什么：
- `GPU 0`看到猫的图片，学到"有毛→是猫"
- `GPU 1`看到狗的图片，学到"有毛→是狗"
- 两个`GPU`的模型会朝不同方向更新，导致模型"分裂"

梯度同步让所有`GPU`看到全局信息：
- 同步后梯度 = "有毛→50%是猫 + 50%是狗"
- 所有`GPU`用这个全局视角更新模型，保持一致性

#### 其他并行策略简介

**模型并行（Model Parallelism）**：
- **原理**：将模型的不同层分配到不同`GPU`，数据依次流过各层
- **示例**：4层神经网络，第1层在`GPU 0`，第2层在`GPU 1`...
- **适用场景**：模型太大（如`GPT-3`有1750亿参数），单个`GPU`显存装不下
- **缺点**：同一时刻只有一个`GPU`在工作，其他`GPU`在等待，利用率低

**流水线并行（Pipeline Parallelism）**：
- **原理**：模型并行的优化版，将数据切分成多个小批次（微批次），流水线式处理
- **示例**：当微批次1在`GPU 1`处理时，微批次2可以进入`GPU 0`，减少空闲
- **适用场景**：大模型+需要提高`GPU`利用率
- **实现**：如`DeepSpeed`、`Megatron-LM`等框架

**张量并行（Tensor Parallelism）**：
- **原理**：将单个网络层的矩阵运算拆分到多个`GPU`并行计算
- **示例**：一个`[1024, 1024]`的矩阵乘法，拆成4个`[1024, 256]`的小矩阵在4个`GPU`上同时计算
- **适用场景**：超大的`Transformer`模型，单个注意力层计算量巨大
- **实现**：如`Megatron-LM`对`GPT`模型的张量并行实现

:::tip 实际应用
大模型训练通常**组合使用**多种并行策略：
- **数据并行** + **流水线并行**：如8节点，每节点8卡，节点间数据并行（8路），节点内流水线并行（8级流水线）
- **数据并行** + **张量并行** + **流水线并行**：如`GPT-3`训练，3维并行策略
:::


### 分布式通信后端

| 后端 | 适用场景 | 支持操作 | 性能特点 |
|------|----------|----------|----------|
| **NCCL** | `GPU`集群 | 全部集合通信 | 最优`GPU`通信性能 |
| **Gloo** | `CPU`/`GPU` | 全部集合通信 | 跨平台兼容 |
| **MPI** | `HPC`集群 | 点对点+集合通信 | 传统`HPC`标准 |

## PyTorch分布式训练原理

### torch.distributed核心概念

`PyTorch`通过`torch.distributed`包提供分布式训练能力，核心概念包括：

| 概念 | 说明 | 示例 |
|------|------|------|
| **World Size** | 参与训练的总进程数 | `4节点×8GPU = 32` |
| **Rank** | 当前进程的全局唯一标识 | `0, 1, 2, ..., 31` |
| **Local Rank** | 当前进程在本节点的标识 | `0, 1, ..., 7` |
| **Process Group** | 进程组，用于集合通信 | 默认组包含所有进程 |
| **Backend** | 通信后端 | `nccl, gloo, mpi` |
| **AllReduce** | 集合通信算子：对所有进程的张量做规约（`sum/avg`）并广播回所有进程 |  |

### 分布式数据并行（DDP）

`DistributedDataParallel`（`DDP`）是`PyTorch`推荐的数据并行方案：

```mermaid
sequenceDiagram
    participant GPU0 as GPU 0 (Rank 0)
    participant GPU1 as GPU 1 (Rank 1)
    participant GPU2 as GPU 2 (Rank 2)
    participant GPU3 as GPU 3 (Rank 3)
    
    Note over GPU0,GPU3: 1. 初始化分布式环境
    GPU0->>GPU0: init_process_group(backend="nccl")
    GPU1->>GPU1: init_process_group(backend="nccl")
    GPU2->>GPU2: init_process_group(backend="nccl")
    GPU3->>GPU3: init_process_group(backend="nccl")
    
    Note over GPU0,GPU3: 2. 加载数据分片
    GPU0->>GPU0: DataLoader + DistributedSampler
    GPU1->>GPU1: DataLoader + DistributedSampler
    GPU2->>GPU2: DataLoader + DistributedSampler
    GPU3->>GPU3: DataLoader + DistributedSampler
    
    Note over GPU0,GPU3: 3. 前向传播（独立计算）
    GPU0->>GPU0: output = model(data_0)
    GPU1->>GPU1: output = model(data_1)
    GPU2->>GPU2: output = model(data_2)
    GPU3->>GPU3: output = model(data_3)
    
    Note over GPU0,GPU3: 4. 反向传播 + 梯度同步
    GPU0->>GPU1: AllReduce(gradients)
    GPU1->>GPU2: AllReduce(gradients)
    GPU2->>GPU3: AllReduce(gradients)
    GPU3->>GPU0: AllReduce(gradients)
    
    Note over GPU0,GPU3: 5. 参数更新（使用同步后的梯度）
    GPU0->>GPU0: optimizer.step()
    GPU1->>GPU1: optimizer.step()
    GPU2->>GPU2: optimizer.step()
    GPU3->>GPU3: optimizer.step()
```

**DDP训练流程说明**：

1. **前向传播阶段**：各`GPU`独立执行，互不通信。每个进程用自己的数据分片（如`data_0`、`data_1`等）通过模型得到输出。
2. **反向传播阶段**：在计算梯度时，`DDP`会自动将梯度按`bucket`分组进行`AllReduce`同步，确保所有进程得到相同的梯度。这个过程与梯度计算重叠执行，减少等待时间。
3. **参数更新阶段**：因为所有进程的梯度已同步，各进程独立执行`optimizer.step()`后，模型参数仍保持一致。

**DDP核心优势**：
- 梯度同步与反向传播重叠，减少通信开销
- 每个进程独立运行，无`GIL`限制
- 支持多机多卡扩展

### 全分片数据并行（FSDP）

`FullyShardedDataParallel`（`FSDP`）是`PyTorch`针对大模型的优化方案：

| 特性 | DDP | FSDP |
|------|-----|------|
| 模型存储 | 每个`GPU`存储完整模型 | 模型参数分片存储 |
| 显存占用 | 高（`N`份完整模型） | 低（`1/N`模型参数） |
| 通信模式 | `AllReduce`梯度 | `AllGather`参数 + `ReduceScatter`梯度 |
| 适用场景 | 中小模型 | 大模型（`>10B`参数） |

### torchrun启动器

`torchrun`是`PyTorch`官方推荐的分布式训练启动工具，它会自动设置以下环境变量：

| 环境变量 | 说明 | 来源 |
|----------|------|------|
| `WORLD_SIZE` | 总进程数 | `--nnodes × --nproc-per-node` |
| `RANK` | 全局进程编号 | 自动计算 |
| `LOCAL_RANK` | 本地进程编号 | 自动计算 |
| `MASTER_ADDR` | 主节点地址 | `--master-addr` |
| `MASTER_PORT` | 主节点端口 | `--master-port` |

**torchrun命令示例**：

```bash
# 单机4卡
torchrun --nproc-per-node=4 train.py

# 多机多卡（4节点，每节点8卡）
torchrun \
    --nnodes=4 \
    --nproc-per-node=8 \
    --node-rank=0 \
    --master-addr=192.168.1.1 \
    --master-port=29500 \
    train.py
```

## Kubeflow Trainer PyTorch并行计算支持

### 整体架构

```mermaid
graph TB
    subgraph "用户提交"
        CLIENT["客户端<br/>(SDK/kubectl/API调用)"]
        TJ["TrainJob CR"]
    end
    
    subgraph "Kubernetes API Server"
        API["kube-apiserver"]
    end
    
    subgraph "Kubeflow Training Runtimes"
        CTR["ClusterTrainingRuntime"]
        TR["TrainingRuntime"]
    end
    
    subgraph "Trainer Controller Manager"
        TC["TrainJob Controller"]
        RF["Runtime Framework"]
        TP["Torch Plugin<br/>(EnforceMLPolicy)"]
    end
    
    subgraph "JobSet Controller"
        JSC["JobSet Controller"]
    end
    
    subgraph "Kubernetes Workloads"
        JS["JobSet CR"]
        JOB["Kubernetes Job"]
        POD["Training Pods"]
    end
    
    subgraph "Training Pod"
        ENV["环境变量注入<br/>PET_NNODES<br/>PET_NPROC_PER_NODE<br/>PET_NODE_RANK<br/>PET_MASTER_ADDR<br/>PET_MASTER_PORT"]
        TORCHRUN["torchrun启动器"]
        TRAIN["训练脚本"]
    end
    
    CLIENT --> TJ
    TJ --> API
    API --> TC
    CTR --> RF
    TR --> RF
    TC --> RF
    RF --> TP
    TP --> JS
    JS --> JSC
    JSC --> JOB
    JOB --> POD
    POD --> ENV
    ENV --> TORCHRUN
    TORCHRUN --> TRAIN
```

### 核心CRD设计

#### TrainJob

`TrainJob`是面向数据科学家的简化`API`，用于提交训练任务：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: pytorch-ddp-training
  namespace: ml-team
spec:
  # 引用预定义的训练运行时
  runtimeRef:
    apiGroup: trainer.kubeflow.org
    kind: ClusterTrainingRuntime
    name: torch-distributed
  
  # 训练器配置（可覆盖Runtime默认值）
  trainer:
    image: my-registry/pytorch-training:v1.0
    command:
      - torchrun
      - train.py
    args:
      - --epochs=100
      - --batch-size=64
    numNodes: 4                    # 训练节点数
    numProcPerNode: 8              # 每节点进程数（通常等于GPU数）
    resourcesPerNode:
      requests:
        nvidia.com/gpu: 8
        memory: "64Gi"
        cpu: "16"
    env:
      - name: NCCL_DEBUG
        value: "INFO"
```

#### ClusterTrainingRuntime

`ClusterTrainingRuntime`是平台工程师预定义的训练任务模板：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: torch-distributed
  labels:
    trainer.kubeflow.org/framework: torch
spec:
  # ML策略配置
  mlPolicy:
    numNodes: 1                    # 默认节点数
    torch:
      numProcPerNode: auto         # auto/cpu/gpu/具体数值
      # 弹性训练配置（可选）
      # elasticPolicy:
      #   minNodes: 2
      #   maxNodes: 8
      #   maxRestarts: 3
  
  # Gang调度策略（可选）
  podGroupPolicy:
    volcano: {}                    # 使用Volcano调度器
  
  # JobSet模板
  template:
    spec:
      replicatedJobs:
        - name: node
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              template:
                spec:
                  containers:
                    - name: node
                      image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
                      ports:
                        - containerPort: 29500  # 分布式通信端口
```

### Torch Plugin实现原理

`Kubeflow Trainer`通过`Torch Plugin`实现对`PyTorch`分布式训练的支持。该插件的核心功能是自动注入分布式环境变量。

#### 环境变量注入

`Torch Plugin`会自动为每个训练`Pod`注入以下环境变量：

| 环境变量 | 说明 | 计算方式 |
|----------|------|----------|
| `PET_NNODES` | 训练节点总数 | `spec.trainer.numNodes` |
| `PET_NPROC_PER_NODE` | 每节点进程数 | `spec.mlPolicy.torch.numProcPerNode` |
| `PET_NODE_RANK` | 当前节点编号 | 从`Job Completion Index`获取 |
| `PET_MASTER_ADDR` | 主节点地址 | `{trainjob-name}-node-0-0.{trainjob-name}` |
| `PET_MASTER_PORT` | 主节点端口 | 默认`29500` |

**注意**：这些环境变量使用`PET_`前缀（`PyTorch Elastic Training`），`torchrun`会自动识别并使用这些变量。

#### numProcPerNode计算逻辑

`numProcPerNode`支持多种配置方式：

| 配置值 | 行为 |
|--------|------|
| `auto` | 如果配置了`GPU`资源，使用`GPU`数量；否则使用`CPU`数量 |
| `cpu` | 使用`CPU`核心数 |
| `gpu` | 使用`GPU`数量 |
| 整数值 | 使用指定的数值 |

```go
// 源码逻辑简化
if numProcPerNode == "auto" {
    if gpuCount > 0 {
        numProcPerNode = gpuCount
    } else {
        numProcPerNode = cpuCount
    }
}
```

### 执行流程详解

```mermaid
sequenceDiagram
    participant User as 用户
    participant API as Kubernetes API
    participant TC as TrainJob Controller
    participant TP as Torch Plugin
    participant JS as JobSet Controller
    participant POD as Training Pods
    
    User->>API: 1. 创建TrainJob
    API->>TC: 2. 触发Reconcile
    
    TC->>TC: 3. 获取RuntimeRef引用的Runtime
    TC->>TP: 4. 调用EnforceMLPolicy
    
    rect rgb(200, 220, 240)
        Note over TP: Torch Plugin处理
        TP->>TP: 5. 计算numProcPerNode
        TP->>TP: 6. 生成PET_*环境变量
        TP->>TP: 7. 设置容器端口(29500)
        TP->>TP: 8. 更新Pod模板
    end
    
    TC->>API: 9. 创建JobSet
    API->>JS: 10. 触发JobSet Reconcile
    JS->>API: 11. 创建Job资源
    
    loop 每个训练节点
        API->>POD: 12. 创建Pod
        POD->>POD: 13. 注入环境变量
        POD->>POD: 14. 启动torchrun
        POD->>POD: 15. 执行训练脚本
    end
    
    Note over POD: 所有Pod通过NCCL进行梯度同步
```

### Headless Service与节点发现

`Kubeflow Trainer`会自动创建`Headless Service`用于节点间通信：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: pytorch-ddp-training  # 与TrainJob同名
spec:
  clusterIP: None             # Headless Service
  selector:
    trainer.kubeflow.org/trainjob-name: pytorch-ddp-training
  ports:
    - port: 29500
      targetPort: 29500
```

**节点DNS解析**：
- 主节点：`pytorch-ddp-training-node-0-0.pytorch-ddp-training`
- 工作节点1：`pytorch-ddp-training-node-0-1.pytorch-ddp-training`
- 工作节点2：`pytorch-ddp-training-node-0-2.pytorch-ddp-training`

## 算法工程师使用指南

### 是否需要感知底层架构？

**简短回答**：**不需要**。`Kubeflow Trainer`的设计目标之一就是对算法工程师屏蔽`Kubernetes`和分布式训练的复杂性。

| 关注点 | 算法工程师需要关心 | Kubeflow Trainer自动处理 |
|--------|-------------------|-------------------------|
| 分布式环境初始化 | ❌ | ✅ 自动注入环境变量 |
| 节点发现与通信 | ❌ | ✅ 自动创建`Headless Service` |
| `torchrun`参数配置 | ❌ | ✅ 自动计算`nnodes`、`nproc`等 |
| `GPU`资源分配 | ❌ | ✅ 通过`Runtime`配置 |
| `Pod`调度与编排 | ❌ | ✅ 通过`JobSet`管理 |
| 训练代码编写 | ✅ | - |
| 模型架构设计 | ✅ | - |
| 超参数调优 | ✅ | - |

### 训练代码编写规范

算法工程师只需按照标准的`PyTorch`分布式训练方式编写代码：

```python
def train():
    import os
    import torch
    import torch.distributed as dist
    from torch.nn.parallel import DistributedDataParallel as DDP
    from torch.utils.data import DataLoader, DistributedSampler
    
    # [1] 初始化分布式环境
    # Kubeflow Trainer已自动设置所有必要的环境变量
    device = "cuda" if torch.cuda.is_available() else "cpu"
    backend = "nccl" if device == "cuda" else "gloo"
    dist.init_process_group(backend=backend)
    
    # [2] 获取分布式信息（可选，用于日志或调试）
    world_size = dist.get_world_size()
    rank = dist.get_rank()
    local_rank = int(os.environ.get("LOCAL_RANK", 0))
    
    print(f"Initialized: World Size={world_size}, Rank={rank}, Local Rank={local_rank}")
    
    # [3] 设置当前进程使用的GPU
    if device == "cuda":
        torch.cuda.set_device(local_rank)
        device = torch.device(f"cuda:{local_rank}")
    
    # [4] 创建模型并包装为DDP
    model = MyModel().to(device)
    model = DDP(model, device_ids=[local_rank] if device.type == "cuda" else None)
    
    # [5] 创建数据加载器（使用DistributedSampler）
    dataset = MyDataset()
    sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    dataloader = DataLoader(dataset, batch_size=64, sampler=sampler)
    
    # [6] 训练循环
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    for epoch in range(100):
        sampler.set_epoch(epoch)  # 重要：确保每个epoch数据打乱方式不同
        for batch in dataloader:
            inputs, labels = batch
            inputs, labels = inputs.to(device), labels.to(device)
            
            optimizer.zero_grad()
            outputs = model(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
        
        # 只在主节点保存模型
        if rank == 0:
            torch.save(model.module.state_dict(), f"model_epoch_{epoch}.pt")
    
    # [7] 清理
    dist.destroy_process_group()

if __name__ == "__main__":
    train()
```

### 使用Kubeflow Python SDK提交任务

算法工程师可以使用`Kubeflow Python SDK`直接从`Python`代码提交训练任务：

```python
from kubeflow.trainer import TrainerClient, CustomTrainer

# 定义训练函数
def train_pytorch():
    import torch
    import torch.distributed as dist
    from torch.nn.parallel import DistributedDataParallel as DDP
    
    # 初始化分布式环境（Kubeflow Trainer自动配置）
    device, backend = ("cuda", "nccl") if torch.cuda.is_available() else ("cpu", "gloo")
    dist.init_process_group(backend=backend)
    
    local_rank = int(os.environ.get("LOCAL_RANK", 0))
    
    # 创建模型
    model = torch.nn.Linear(10, 10).to(device)
    model = DDP(model)
    
    # 训练逻辑...
    print(f"Training on rank {dist.get_rank()}/{dist.get_world_size()}")
    
    dist.destroy_process_group()

# 创建训练任务
client = TrainerClient()

job_id = client.train(
    trainer=CustomTrainer(
        func=train_pytorch,
        num_nodes=4,                    # 4个训练节点
        resources_per_node={
            "cpu": 8,
            "memory": "32Gi",
            "gpu": 2,                   # 每节点2个GPU
        },
        packages_to_install=["transformers>=4.53.0"],  # 额外依赖
    )
)

# 等待任务完成
client.wait_for_job_status(job_id)

# 查看日志
for log in client.get_job_logs(job_id, follow=True):
    print(log)
```

### 关键注意事项

#### 数据加载

```python
# ✅ 正确：使用DistributedSampler
sampler = DistributedSampler(dataset)
dataloader = DataLoader(dataset, sampler=sampler)

# ❌ 错误：不使用Sampler会导致所有节点处理相同数据
dataloader = DataLoader(dataset, shuffle=True)
```

#### 模型保存

```python
# ✅ 正确：只在主节点保存
if dist.get_rank() == 0:
    torch.save(model.module.state_dict(), "model.pt")

# ❌ 错误：所有节点都保存会造成冲突
torch.save(model.state_dict(), "model.pt")
```

#### 日志输出

```python
# ✅ 推荐：只在主节点输出详细日志
if dist.get_rank() == 0:
    print(f"Epoch {epoch}, Loss: {loss.item()}")

# 或使用条件日志
def log(msg):
    if dist.get_rank() == 0:
        print(msg)
```

#### 随机种子

```python
# ✅ 正确：设置确定性种子，但每个节点使用不同的数据增强
torch.manual_seed(42 + dist.get_rank())
```

### FSDP使用示例

对于大模型训练，可以使用`FSDP`：

```python
from torch.distributed.fsdp import FullyShardedDataParallel as FSDP
from torch.distributed.fsdp.wrap import transformer_auto_wrap_policy

def train_large_model():
    import torch
    import torch.distributed as dist
    from transformers import AutoModelForCausalLM
    
    dist.init_process_group(backend="nccl")
    local_rank = int(os.environ["LOCAL_RANK"])
    torch.cuda.set_device(local_rank)
    
    # 加载大模型
    model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-7b")
    
    # 使用FSDP包装
    model = FSDP(
        model,
        auto_wrap_policy=transformer_auto_wrap_policy,
        device_id=local_rank,
    )
    
    # 训练逻辑...
    
    dist.destroy_process_group()
```

## 完整示例

### TrainingRuntime配置

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: pytorch-ddp-gpu
spec:
  mlPolicy:
    numNodes: 2
    torch:
      numProcPerNode: auto
  podGroupPolicy:
    volcano: {}
  template:
    spec:
      replicatedJobs:
        - name: node
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              template:
                spec:
                  schedulerName: volcano
                  containers:
                    - name: node
                      image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
                      resources:
                        limits:
                          nvidia.com/gpu: 4
                          memory: "64Gi"
                          cpu: "16"
                      env:
                        - name: NCCL_DEBUG
                          value: "INFO"
```

### TrainJob提交

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  name: mnist-ddp-training
  namespace: ml-team
spec:
  runtimeRef:
    name: pytorch-ddp-gpu
  trainer:
    image: my-registry/mnist-training:v1.0
    command:
      - torchrun
      - train.py
    args:
      - --epochs=50
      - --batch-size=128
    numNodes: 4
    resourcesPerNode:
      requests:
        nvidia.com/gpu: 8
```

### 训练脚本

```python
#!/usr/bin/env python3
"""
MNIST分布式训练示例
此脚本可直接在Kubeflow Trainer中运行，无需修改
"""

import os
import argparse
import torch
import torch.nn as nn
import torch.nn.functional as F
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader
from torch.utils.data.distributed import DistributedSampler
from torchvision import datasets, transforms


class MNISTNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = nn.Conv2d(1, 32, 3, 1)
        self.conv2 = nn.Conv2d(32, 64, 3, 1)
        self.fc1 = nn.Linear(9216, 128)
        self.fc2 = nn.Linear(128, 10)

    def forward(self, x):
        x = F.relu(self.conv1(x))
        x = F.relu(self.conv2(x))
        x = F.max_pool2d(x, 2)
        x = torch.flatten(x, 1)
        x = F.relu(self.fc1(x))
        x = self.fc2(x)
        return F.log_softmax(x, dim=1)


def train(args):
    # 初始化分布式环境
    device = "cuda" if torch.cuda.is_available() else "cpu"
    backend = "nccl" if device == "cuda" else "gloo"
    dist.init_process_group(backend=backend)
    
    rank = dist.get_rank()
    world_size = dist.get_world_size()
    local_rank = int(os.environ.get("LOCAL_RANK", 0))
    
    if device == "cuda":
        torch.cuda.set_device(local_rank)
        device = torch.device(f"cuda:{local_rank}")
    
    if rank == 0:
        print(f"Starting distributed training with {world_size} processes")
    
    # 准备数据
    transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.1307,), (0.3081,))
    ])
    
    # 只在rank 0下载数据
    if rank == 0:
        datasets.MNIST('./data', train=True, download=True)
    dist.barrier()
    
    dataset = datasets.MNIST('./data', train=True, transform=transform)
    sampler = DistributedSampler(dataset, num_replicas=world_size, rank=rank)
    dataloader = DataLoader(dataset, batch_size=args.batch_size, sampler=sampler)
    
    # 创建模型
    model = MNISTNet().to(device)
    model = DDP(model, device_ids=[local_rank] if device.type == "cuda" else None)
    
    optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
    
    # 训练循环
    for epoch in range(args.epochs):
        sampler.set_epoch(epoch)
        model.train()
        
        for batch_idx, (data, target) in enumerate(dataloader):
            data, target = data.to(device), target.to(device)
            
            optimizer.zero_grad()
            output = model(data)
            loss = F.nll_loss(output, target)
            loss.backward()
            optimizer.step()
            
            if batch_idx % 100 == 0 and rank == 0:
                print(f"Epoch {epoch} [{batch_idx * len(data)}/{len(dataset)}] Loss: {loss.item():.6f}")
        
        # 保存检查点
        if rank == 0:
            torch.save({
                'epoch': epoch,
                'model_state_dict': model.module.state_dict(),
                'optimizer_state_dict': optimizer.state_dict(),
            }, f'checkpoint_epoch_{epoch}.pt')
    
    if rank == 0:
        print("Training completed!")
    
    dist.destroy_process_group()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--batch-size", type=int, default=64)
    args = parser.parse_args()
    
    train(args)
```

## 参考资料

- [Kubeflow Trainer官方文档](https://www.kubeflow.org/docs/components/trainer/)
- [PyTorch Distributed Overview](https://pytorch.org/tutorials/beginner/dist_overview.html)
- [PyTorch DDP Tutorial](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html)
- [PyTorch FSDP Tutorial](https://pytorch.org/tutorials/intermediate/FSDP_tutorial.html)
- [torchrun Documentation](https://pytorch.org/docs/stable/elastic/run.html)
- [Kubeflow Trainer GitHub](https://github.com/kubeflow/trainer)
- [PyTorch on Kubernetes Blog](https://pytorch.org/blog/pytorch-on-kubernetes-kubeflow-trainer-joins-the-pytorch-ecosystem/)
