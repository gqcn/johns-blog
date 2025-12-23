---
slug: "/ai/kubeflow-trainer-crd-reference"
title: "Kubeflow Trainer CRD配置格式详解"
hide_title: true
keywords:
  [
    "Kubeflow Trainer",
    "TrainJob",
    "TrainingRuntime",
    "ClusterTrainingRuntime",
    "CRD",
    "Custom Resource Definition",
    "分布式训练",
    "PyTorch",
    "DeepSpeed",
    "MPI",
    "YAML配置",
    "Kubernetes",
    "训练任务",
    "运行时模板",
    "Gang Scheduling",
    "数据集初始化",
    "模型初始化",
    "Pod模板覆盖",
    "弹性训练",
    "HPC"
  ]
description: "详细介绍Kubeflow Trainer的三个核心CRD（TrainJob、TrainingRuntime、ClusterTrainingRuntime）的完整配置格式，包括每个配置项的注释说明、复杂配置项的表格解释、特殊标签和注解的使用，以及最佳实践指南"
---

## 1. 概述

`Kubeflow Trainer`提供了三个核心的`CRD（Custom Resource Definition）`来支持分布式训练任务的定义和执行：

| CRD名称 | 作用域 | 主要作用 |
|----------|-----------|--------|
| `TrainJob` | 命名空间 | 定义具体的训练任务，包括训练的配置参数、资源需求、数据集和模型初始化等 |
| `TrainingRuntime` | 命名空间 | 命名空间级别的训练运行时模板，定义了特定框架（如 `PyTorch`、`DeepSpeed`）的执行环境，只能被同一命名空间的`TrainJob`引用 |
| `ClusterTrainingRuntime` | 集群 | 集群级别的训练运行时模板，可以被任何命名空间的 `TrainJob`引用，适用于跨团队共享的标准运行时配置 |

本文将详细介绍这三个`CRD`的完整配置格式，并对每个配置项进行说明。

## 2. TrainJob

`TrainJob`是用户创建分布式训练任务的核心`CRD`，它定义了训练任务的所有配置参数。

### 2.1 完整模板示例

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainJob
metadata:
  # TrainJob 的名称，必须符合 RFC 1035 DNS 标签格式（小写字母、数字、连字符，最多63个字符）
  name: pytorch-distributed-training
  # TrainJob 所在的命名空间
  namespace: kubeflow
  # 可选的标签
  labels:
    app: training
    framework: pytorch
  # 可选的注解
  annotations:
    description: "PyTorch distributed training example"
spec:
  # 引用的训练运行时配置（必填）
  runtimeRef:
    # 运行时的名称（必填，最小长度为1）
    name: torch-distributed
    # 运行时的 API 组，默认为 trainer.kubeflow.org
    apiGroup: trainer.kubeflow.org
    # 运行时的类型，可选值：TrainingRuntime 或 ClusterTrainingRuntime
    # 默认为 ClusterTrainingRuntime
    kind: ClusterTrainingRuntime

  # 初始化器配置，用于数据集和模型的初始化（可选）
  initializer:
    # 数据集初始化配置
    dataset:
      # 数据集存储的 URI，支持各种存储协议（如 s3://、gs://、pvc:// 等）
      storageUri: s3://my-bucket/datasets/fashion-mnist
      # 环境变量列表，用于数据集初始化容器
      env:
        - name: AWS_REGION
          value: us-west-2
        - name: DATASET_FORMAT
          value: pytorch
      # Secret 引用，包含访问数据集的凭证
      # Secret 必须在 TrainJob 所在的命名空间中创建
      secretRef:
        name: s3-credentials

    # 预训练模型初始化配置
    model:
      # 预训练模型存储的 URI
      storageUri: s3://my-bucket/models/pretrained-resnet
      # 环境变量列表，用于模型初始化容器
      env:
        - name: MODEL_FORMAT
          value: pytorch
        - name: MODEL_VERSION
          value: v1.0
      # Secret 引用，包含访问模型的凭证
      secretRef:
        name: s3-credentials

  # 训练器配置（可选）
  trainer:
    # 训练容器的镜像
    image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
    # 容器的启动命令
    command:
      - python
      - /workspace/train.py
    # 容器的参数
    args:
      - --epochs=10
      - --batch-size=64
      - --learning-rate=0.001
    # 环境变量列表
    env:
      - name: NCCL_DEBUG
        value: INFO
      - name: PYTORCH_CUDA_ALLOC_CONF
        value: max_split_size_mb:512
    # 训练节点数量
    numNodes: 4
    # 每个节点的资源配置
    resourcesPerNode:
      requests:
        cpu: "4"
        memory: 16Gi
        nvidia.com/gpu: "1"
      limits:
        cpu: "8"
        memory: 32Gi
        nvidia.com/gpu: "1"
    # 每个节点的进程/worker 数量
    # 对于 PyTorch：可以设置为 auto、cpu、gpu 或整数值
    # 对于 MPI：只能设置为整数值
    numProcPerNode: auto

  # 应用到衍生 JobSet 和 Jobs 的标签（可选）
  # 这些标签会与 TrainingRuntime 中的标签合并
  # 注意：当存在相同键时，TrainJob 中的标签值会覆盖 TrainingRuntime 中的标签值
  labels:
    team: ml-team
    project: image-classification

  # 应用到衍生 JobSet 和 Jobs 的注解（可选）
  # 这些注解会与 TrainingRuntime 中的注解合并
  # 注意：当存在相同键时，TrainJob 中的注解值会覆盖 TrainingRuntime 中的注解值
  annotations:
    owner: john@example.com
    cost-center: "1234"

  # Pod 模板覆盖配置，用于自定义特定 Job 的 Pod 配置（可选）
  podTemplateOverrides:
    # 可以配置多个覆盖规则，后面的规则会覆盖前面的字段值
    - targetJobs:
        # 目标 Job 名称列表
        - name: node
      # Pod 元数据覆盖
      metadata:
        labels:
          custom-label: custom-value
        annotations:
          custom-annotation: custom-value
      # Pod Spec 覆盖
      spec:
        # 服务账号名称
        serviceAccountName: training-sa
        # 节点选择器
        nodeSelector:
          node-type: gpu-node
          gpu-type: nvidia-a100
        # 亲和性配置
        affinity:
          nodeAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
                - matchExpressions:
                    - key: gpu-type
                      operator: In
                      values:
                        - nvidia-a100
                        - nvidia-v100
          podAntiAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
              - weight: 100
                podAffinityTerm:
                  labelSelector:
                    matchExpressions:
                      - key: app
                        operator: In
                        values:
                          - training
                  topologyKey: kubernetes.io/hostname
        # 容忍度配置
        tolerations:
          - key: nvidia.com/gpu
            operator: Exists
            effect: NoSchedule
          - key: training-workload
            operator: Equal
            value: "true"
            effect: NoSchedule
        # 卷配置
        volumes:
          - name: workspace
            persistentVolumeClaim:
              claimName: training-workspace-pvc
          - name: shared-memory
            emptyDir:
              medium: Memory
              sizeLimit: 8Gi
        # 初始化容器覆盖
        initContainers:
          - name: setup
            env:
              - name: SETUP_MODE
                value: distributed
            volumeMounts:
              - name: workspace
                mountPath: /workspace
        # 容器覆盖
        containers:
          - name: node
            env:
              - name: CUSTOM_ENV
                value: custom-value
            volumeMounts:
              - name: workspace
                mountPath: /workspace
              - name: shared-memory
                mountPath: /dev/shm
        # 调度门控（用于 Pod 调度就绪性控制）
        schedulingGates:
          - name: custom-gate
        # 镜像拉取 Secret
        imagePullSecrets:
          - name: docker-registry-secret

  # 是否暂停运行中的 TrainJob（可选）
  # 默认为 false
  suspend: false

  # 管理者标识，指示由哪个控制器或实体管理此 TrainJob（可选）
  # 可选值：
  # - trainer.kubeflow.org/trainjob-controller（默认，由内置控制器管理）
  # - kueue.x-k8s.io/multikueue（委托给 Kueue 管理）
  # 此字段不可变
  managedBy: trainer.kubeflow.org/trainjob-controller
```

### 2.2 重要字段说明

#### 2.2.1 runtimeRef

`runtimeRef` 是必填字段，用于引用训练运行时配置：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `name` | `string` | 是 | - | 运行时名称，最小长度为`1` |
| `apiGroup` | `string` | 否 | `trainer.kubeflow.org` | 运行时的`API`组 |
| `kind` | `string` | 否 | `ClusterTrainingRuntime` | 运行时类型，可选 `TrainingRuntime` 或 `ClusterTrainingRuntime` |

#### 2.2.2 numProcPerNode

每个节点的进程/`worker`数量配置：

| 框架 | 支持的值 | 说明 |
|------|----------|------|
| `PyTorch` | `auto`、`cpu`、`gpu`、整数 | `auto`表示自动检测，`cpu`/`gpu`表示使用所有 `CPU`/`GPU`，整数表示具体进程数 |
| `MPI` | 整数 | 只能设置具体的整数值 |
| `DeepSpeed` | 整数 | 只能设置具体的整数值 |

#### 2.2.3 managedBy

控制`TrainJob`的管理者：

| 值 | 说明 |
|----|------|
| `trainer.kubeflow.org/trainjob-controller` | 由内置的 `TrainJob` 控制器管理（默认） |
| `kueue.x-k8s.io/multikueue` | 委托给 Kueue 进行管理，支持多集群调度 |


#### 2.2.4 initializer（初始化器）

初始化器用于在训练开始前自动完成数据集和预训练模型的准备工作，极大简化了训练任务的配置和管理。

##### 2.2.4.1 dataset（数据集初始化器）

数据集初始化器的作用：

- **自动下载数据集**：从各种存储源（`S3`、`GCS`、`Hugging Face`、`PVC` 等）自动下载训练所需的数据集
- **数据预处理**：可以在初始化阶段对数据进行预处理和格式转换
- **数据持久化**：将下载的数据集存储到共享卷中，供所有训练节点访问
- **凭证管理**：通过`secretRef`安全地管理访问私有数据集所需的凭证

配置示例：
```yaml
initializer:
  dataset:
    # 数据集 URI，支持多种协议：
    # - s3://bucket/path（AWS S3）
    # - gs://bucket/path（Google Cloud Storage）
    # - hf://dataset-name（Hugging Face）
    # - pvc://pvc-name/path（Kubernetes PVC）
    storageUri: s3://my-bucket/datasets/imagenet
    env:
      - name: AWS_REGION
        value: us-west-2
    secretRef:
      name: s3-credentials  # 包含 AWS_ACCESS_KEY_ID 和 AWS_SECRET_ACCESS_KEY
```

数据集初始化完成后，数据会被挂载到训练容器的`/workspace/dataset`路径。

##### model（模型初始化器）

模型初始化器的作用：

- **自动下载预训练模型**：从模型仓库下载预训练模型权重
- **模型格式转换**：支持不同框架间的模型格式转换
- **模型持久化**：将模型文件存储到共享卷中
- **版本管理**：可以通过环境变量指定具体的模型版本

配置示例：
```yaml
initializer:
  model:
    # 预训练模型 URI
    storageUri: hf://meta-llama/Llama-2-7b-hf
    env:
      - name: MODEL_VERSION
        value: v1.0
      - name: HUGGING_FACE_TOKEN
        valueFrom:
          secretKeyRef:
            name: hf-token
            key: token
    secretRef:
      name: hf-credentials
```

模型初始化完成后，模型文件会被挂载到训练容器的`/workspace/model`路径。

##### 初始化器的执行流程

1. `dataset-initializer Job`首先启动，下载并准备数据集
2. `model-initializer Job`随后启动，下载并准备预训练模型
3. 两个初始化`Job`都成功完成后，`trainer Job`才会启动
4. 训练容器可以直接访问`/workspace/dataset`和`/workspace/model`路径下的数据和模型

这种机制确保了训练任务启动时所有必需的资源都已就绪，避免了训练过程中的资源加载失败。

#### 2.2.5 Status Conditions

| Type | Reason | 说明 |
|------|--------|------|
| `Suspended` | `Suspended` | `TrainJob` 被暂停 |
| `Suspended` | `Resumed` | `TrainJob` 从暂停状态恢复 |
| `Failed` | `TrainingRuntimeNotSupported` | 引用的`TrainingRuntime`不受支持 |
| `Complete` | `JobsCompleted` | `TrainJob` 成功完成 |

## 3. TrainingRuntime

`TrainingRuntime`是命名空间级别的训练运行时模板，定义了特定`ML`框架的执行环境。它只能被同一命名空间中的`TrainJob`引用。

### 3.1 完整模板示例

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: TrainingRuntime
metadata:
  # TrainingRuntime 的名称
  name: pytorch-distributed
  # TrainingRuntime 所在的命名空间
  namespace: kubeflow
  # 标签，通常标识框架类型
  labels:
    trainer.kubeflow.org/framework: pytorch
    environment: production
spec:
  # ML 策略配置，提供ML特定的参数（可选）
  mlPolicy:
    # 训练节点数量，默认为1
    numNodes: 2
    
    # PyTorch运行时配置
    torch:
      # 每个节点的进程数量
      # 支持的值：auto（自动检测）、cpu（CPU数量）、gpu（GPU数量）或整数值
      # 默认为 auto
      numProcPerNode: auto
      
      # PyTorch 弹性训练策略（可选）
      # 注意：如果配置了 elasticPolicy，则不能同时设置 mlPolicy.numNodes
      elasticPolicy:
        # 训练任务可以重启的最大次数
        # 此值会插入到 torchrun 的 --max-restarts 参数中
        maxRestarts: 3
        # 可以缩减到的最小节点数
        minNodes: 1
        # 可以扩展到的最大节点数
        maxNodes: 4
        # 用于计算期望节点数的指标
        # 将创建 HPA 来执行自动缩放
        metrics:
          - type: Resource
            resource:
              name: cpu
              target:
                type: Utilization
                averageUtilization: 80

  # PodGroup 策略配置，用于启用 gang-scheduling（可选）
  podGroupPolicy:
    # 使用 Kubernetes scheduler-plugins 的 coscheduling 插件
    coscheduling:
      # gang-scheduling 的最大调度超时时间（秒）
      # 如果为 0，则使用默认值
      # 默认为 60 秒
      scheduleTimeoutSeconds: 120
    
    # 或者使用 Volcano gang-scheduler
    # 注意：coscheduling 和 volcano 只能配置其中一个
    # volcano:
    #   # 网络拓扑配置，与网络拓扑特性和 hyperNode CRD 配合使用
    #   networkTopology:
    #     # 配置具体的网络拓扑策略
    #     # 详见 Volcano 文档

  # JobSet 模板配置
  template:
    # JobSet 的元数据
    metadata:
      labels:
        runtime: pytorch
        version: v2.7
      annotations:
        description: PyTorch distributed training runtime
    
    # JobSet 的规范
    spec:
      # 复制的 Job 列表
      replicatedJobs:
        # 主要的训练节点 Job
        - name: node
          # 该 Job 的副本数量（节点数量）
          # 注意：实际的副本数会被 mlPolicy.numNodes 或 TrainJob.trainer.numNodes 覆盖
          replicas: 1
          
          # Job 模板
          template:
            metadata:
              labels:
                # 此标签标识这是训练器步骤
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              # Job 完成模式
              # Indexed 表示每个 Pod 都有唯一的索引
              completionMode: Indexed
              
              # Job 的 Pod 模板
              template:
                spec:
                  # 容器列表
                  containers:
                    - name: node
                      # 默认镜像，会被 TrainJob.trainer.image 覆盖
                      image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
                      # 默认命令，会被 TrainJob.trainer.command 覆盖
                      command:
                        - torchrun
                      # 默认参数
                      args:
                        - --nnodes=$(TRAINER_NNODES)
                        - --nproc_per_node=$(TRAINER_NPROC_PER_NODE)
                        - --node_rank=$(JOB_COMPLETION_INDEX)
                        - --rdzv_backend=c10d
                        - --rdzv_endpoint=$(TRAINER_NODE_0_HOSTNAME):29400
                        - --rdzv_id=$(TRAINER_JOB_ID)
                        - /workspace/train.py
                      # 环境变量
                      env:
                        - name: LOGLEVEL
                          value: INFO
                        - name: NCCL_DEBUG
                          value: INFO
                      # 资源配置
                      resources:
                        requests:
                          cpu: "2"
                          memory: 8Gi
                        limits:
                          cpu: "4"
                          memory: 16Gi
                      # 卷挂载
                      volumeMounts:
                        - name: workspace
                          mountPath: /workspace
                  
                  # 卷定义
                  volumes:
                    - name: workspace
                      emptyDir: {}
                  
                  # 重启策略
                  restartPolicy: OnFailure
      
      # 失败策略
      failurePolicy:
        # 允许的最大重启次数
        maxRestarts: 3
      
      # 成功策略
      successPolicy:
        # 操作符，表示如何判断成功
        # All 表示所有目标 Job 都必须成功
        operator: All
        # 目标 Job 列表
        targetReplicatedJobs:
          - node
      
      # 网络配置
      network:
        # 是否发布未就绪的地址
        # 对于分布式训练，通常设置为 true
        publishNotReadyAddresses: true
        # 是否启用 DNS 主机名
        enableDNSHostnames: true
```


### 3.2 重要字段说明

#### 3.2.1 mlPolicy

`ML`策略配置的互斥规则：

| 配置 | 互斥规则 | 说明 |
|------|----------|------|
| `numNodes` | 不能与 `torch.elasticPolicy` 同时使用 | 弹性训练使用 `minNodes`/`maxNodes` 代替固定节点数 |
| `torch` | 不能与 `mpi` 同时使用 | 只能配置一种运行时策略 |
| `mpi` | 不能与 `torch` 同时使用 | 只能配置一种运行时策略 |

#### 3.2.2 PyTorch 弹性训练

启用`PyTorch`弹性训练时的关键配置：

| 字段 | 说明 |
|------|------|
| `maxRestarts` | 插入到 `torchrun` 的 `--max-restarts` 参数和`Job`的 `.spec.failurePolicy.maxRestarts` |
| `minNodes` | 插入到 `torchrun` 的 `--nnodes` 参数的最小值 |
| `maxNodes` | 插入到 `torchrun` 的 `--nnodes` 参数的最大值 |
| `metrics` | 用于创建`HPA（Horizontal Pod Autoscaler）`进行自动缩放 |

#### 3.2.3 MPI 实现类型

支持的`MPI`实现：

| 类型 | 说明 |
|------|------|
| `OpenMPI` | `Open MPI` 实现（默认） |
| `Intel` | `Intel MPI` 实现 |
| `MPICH` | `MPICH` 实现 |


### 3.3 特殊标签和注解

`Kubeflow Trainer`使用一些特殊的标签和注解来控制训练任务的行为和标识资源关系。

#### 3.3.1 系统预留标签

| 标签键 | 可能的值 | 用途 | 应用位置 |
|--------|---------|------|----------|
| `trainer.kubeflow.org/trainjob-ancestor-step` | `dataset-initializer`<br/>`model-initializer`<br/>`trainer` | 标识`Pod`模板在训练流程中的角色，用于关联`TrainJob`的不同配置项与`Runtime`中的`Job`模板 | `TrainingRuntime/ClusterTrainingRuntime`的`replicatedJobs[].template.labels` |
| `trainer.kubeflow.org/framework` | `torch`<br/>`deepspeed`<br/>`mpi`<br/>`mlx`<br/>`torchtune` | 标识 `Runtime` 支持的训练框架类型 | `TrainingRuntime/ClusterTrainingRuntime` 的 `metadata.labels` |
| `trainer.kubeflow.org/support` | `deprecated` |标识`Runtime`的支持状态，当值为 `deprecated` 时会在创建 `TrainJob`时发出警告 | `TrainingRuntime/ClusterTrainingRuntime` 的 `metadata.labels` |

#### 3.3.2 标签使用说明

##### 3.3.2.1 trainer.kubeflow.org/trainjob-ancestor-step

这是最重要的系统标签，用于建立`TrainJob`配置与`Runtime`中`Job`模板之间的映射关系：

- **dataset-initializer**：带有此标签的`Job`模板会被`TrainJob.spec.initializer.dataset`配置覆盖
- **model-initializer**：带有此标签的`Job`模板会被`TrainJob.spec.initializer.model`配置覆盖  
- **trainer**：带有此标签的`Job`模板会被`TrainJob.spec.trainer`配置覆盖

**是否必须配置：**

该标签在`TrainingRuntime/ClusterTrainingRuntime`的`replicatedJobs`中**不是强制要求**的，但通常应该要配置，但具有以下重要作用：

1. **不配置该标签**：
   - 该`Job`模板将不会被`TrainJob`的任何配置项覆盖
   - 适用于辅助性的`Job`（如日志收集、监控等），这些`Job`不需要`TrainJob`级别的定制
   - `Job`将完全按照`Runtime`中定义的配置运行

2. **配置 `trainer` 值**：
   - **强烈推荐**为主训练节点配置此标签
   - 允许用户通过`TrainJob.spec.trainer`定制训练镜像、命令、参数、资源等
   - 提供了训练任务级别的灵活性，是`Kubeflow Trainer`的核心功能之一
   - 不配置此标签意味着放弃了`TrainJob`级别的训练配置能力

3. **配置初始化器标签**：
   - 如果需要数据集/模型初始化功能，必须为对应的`Job`配置相应的标签
   - 不配置则无法使用`TrainJob.spec.initializer`功能

**最佳实践示例：**

```yaml
# 推荐的配置方式
spec:
  template:
    spec:
      replicatedJobs:
        # 可选：数据集初始化 Job
        - name: dataset-initializer
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: dataset-initializer
        
        # 可选：模型初始化 Job
        - name: model-initializer
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: model-initializer
        
        # 强烈推荐：主训练节点必须配置此标签
        - name: node
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: trainer  # 推荐配置
        
        # 可选：辅助 Job 可以不配置此标签
        - name: monitoring
          template:
            metadata:
              labels:
                app: monitoring  # 不配置 trainjob-ancestor-step
```

示例：
```yaml
# 在 TrainingRuntime 中定义
spec:
  template:
    spec:
      replicatedJobs:
        - name: dataset-initializer
          template:
            metadata:
              labels:
                # 此标签标识这是数据集初始化步骤
                trainer.kubeflow.org/trainjob-ancestor-step: dataset-initializer
        - name: node
          template:
            metadata:
              labels:
                # 此标签标识这是训练器步骤
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
```

##### 3.3.2.2 trainer.kubeflow.org/framework

用于标识`Runtime`的框架类型，便于用户筛选和管理。

**标签作用：**

1. **资源分类和管理**：
   - 帮助平台管理员对不同框架的`Runtime`进行分类
   - 便于通过标签选择器查询特定框架的`Runtime`
   - 支持在`UI`或`CLI`工具中按框架类型过滤和展示

2. **用户体验优化**：
   - 用户可以通过 `kubectl get clustertrainingruntimes -l trainer.kubeflow.org/framework=torch` 快速查找`PyTorch`训练任务模板
   - 在多租户环境中，可以基于框架类型实现`RBAC`权限控制
   - 便于监控和审计特定框架的使用情况

3. **文档和自动化**：
   - 作为`Runtime`的元数据，帮助生成文档和使用指南
   - 支持自动化工具根据框架类型进行配置推荐
   - 便于集成到`CI/CD`流程中进行框架相关的校验

**是否必须配置：**

该标签**不是强制要求**的，但**强烈推荐**配置：

- ✅ **推荐配置**：可以提供更好的用户体验和管理便利性
- ⚠️ **不配置影响**：`Runtime`功能完全正常，但会失去上述分类和筛选能力
- 📝 **命名约定**：建议使用官方支持的框架名称（`torch`、`deepspeed`、`mpi`、`mlx`、`torchtune`）

**支持的框架类型：**

| 框架值 | 对应框架 | 说明 |
|--------|---------|------|
| `torch` | `PyTorch` | 标准 `PyTorch` 分布式训练 |
| `deepspeed` | `DeepSpeed` | `Microsoft DeepSpeed` 框架 |
| `mpi` | `MPI` | 基于 `MPI` 的分布式训练 |
| `mlx` | `MLX` | `Apple MLX` 框架 |
| `torchtune` | `TorchTune` | `PyTorch` 微调框架 |


**使用示例：**

```yaml
# 示例1：PyTorch Runtime
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: torch-distributed
  labels:
    trainer.kubeflow.org/framework: torch  # 标识为 PyTorch 运行时

# 示例2：DeepSpeed Runtime
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: deepspeed-distributed
  labels:
    trainer.kubeflow.org/framework: deepspeed  # 标识为 DeepSpeed 运行时

# 示例3：查询特定框架的 Runtime
# kubectl get clustertrainingruntimes -l trainer.kubeflow.org/framework=torch
```

**最佳实践：**

1. 为所有生产环境的`Runtime`配置此标签
2. 保持标签值的一致性，避免使用自定义值
3. 结合其他标签（如版本、环境）实现更细粒度的管理：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: torch-distributed
  labels:
    trainer.kubeflow.org/framework: torch  # 标识这是 PyTorch 运行时
```

##### 3.3.2.3 trainer.kubeflow.org/support

用于标识`Runtime`的废弃状态：

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: legacy-runtime
  labels:
    trainer.kubeflow.org/support: deprecated  # 标识此运行时已废弃
```

当引用带有 `deprecated` 标签的`Runtime`时，`TrainJob`创建时会收到警告，提示用户该`Runtime`将在未来版本中移除。详见[运行时废弃策略](https://www.kubeflow.org/docs/components/trainer/operator-guides/runtime/#runtime-deprecation-policy)。


#### 3.3.3 用户自定义标签和注解

除了系统预留标签外，用户可以在以下位置添加自定义标签和注解：

1. **TrainJob.metadata.labels/annotations**：应用`TrainJob`资源本身
2. **TrainJob.spec.labels/annotations**：应用于衍生的`JobSet`和`Jobs`，会与`Runtime`中的标签/注解合并
3. **TrainJob.spec.podTemplateOverrides[].metadata.labels/annotations**：应用于特定`Job`的`Pod`模板

标签和注解的合并规则：
- `TrainJob`中定义的标签/注解会与`Runtime`中的标签/注解合并
- 当存在相同的键时，**`TrainJob`中的值会覆盖`Runtime`中的值**
- 这种设计允许用户在不修改`Runtime`的情况下为特定训练任务自定义标签和注解



## 4. ClusterTrainingRuntime

`ClusterTrainingRuntime`是集群级别的训练运行时模板，可以被任何命名空间中的`TrainJob`引用。其配置格式与`TrainingRuntime`完全相同，唯一区别是资源作用域。

### 4.1 完整模板示例

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  # ClusterTrainingRuntime 的名称（集群唯一）
  name: torch-distributed
  # 标签，标识框架类型
  labels:
    trainer.kubeflow.org/framework: torch
    version: v2.7
spec:
  # ML 策略配置（与 TrainingRuntime 相同）
  mlPolicy:
    numNodes: 1
    torch:
      numProcPerNode: auto

  # PodGroup 策略配置（可选）
  podGroupPolicy:
    # Volcano gang-scheduler 配置示例
    volcano:
      # 网络拓扑配置，用于网络感知调度
      networkTopology:
        # 网络拓扑键，用于标识网络域
        # 例如：topology.kubernetes.io/zone
        topologyKey: topology.kubernetes.io/zone
        # 网络策略，定义 Pod 应该如何分布
        # 可选值：Best-effort（尽力而为）、Strict（严格模式）
        # Best-effort：尽量将 Pod 调度到同一网络域，但不强制
        # Strict：必须将所有 Pod 调度到同一网络域，否则调度失败
        networkPolicy: Best-effort

  # JobSet 模板配置
  template:
    metadata:
      labels:
        runtime-type: cluster-wide
        framework: pytorch
    
    spec:
      # 复制的 Job 列表
      replicatedJobs:
        - name: node
          replicas: 1
          template:
            metadata:
              labels:
                # 标识这是训练器步骤
                trainer.kubeflow.org/trainjob-ancestor-step: trainer
            spec:
              # Job 的 Pod 模板
              template:
                spec:
                  containers:
                    - name: node
                      # 默认 PyTorch 镜像
                      image: pytorch/pytorch:2.7.1-cuda12.8-cudnn9-runtime
                      # torchrun 命令配置
                      command:
                        - torchrun
                      args:
                        - --nnodes=$(TRAINER_NNODES)
                        - --nproc_per_node=$(TRAINER_NPROC_PER_NODE)
                        - --node_rank=$(JOB_COMPLETION_INDEX)
                        - --rdzv_backend=c10d
                        - --rdzv_endpoint=$(TRAINER_NODE_0_HOSTNAME):29400
                        - --rdzv_id=$(TRAINER_JOB_ID)
                      # 环境变量
                      env:
                        - name: LOGLEVEL
                          value: INFO
                        - name: PYTHONUNBUFFERED
                          value: "1"
                        - name: NCCL_DEBUG
                          value: INFO
                        - name: TORCH_DISTRIBUTED_DEBUG
                          value: INFO
                      # 资源请求和限制
                      resources:
                        requests:
                          cpu: "4"
                          memory: 16Gi
                        limits:
                          cpu: "8"
                          memory: 32Gi
                  
                  # 重启策略
                  restartPolicy: OnFailure
      
      # 失败策略
      failurePolicy:
        maxRestarts: 3
      
      # 成功策略
      successPolicy:
        operator: All
        targetReplicatedJobs:
          - node
      
      # 网络配置
      network:
        publishNotReadyAddresses: true
        enableDNSHostnames: true
```

### 4.2 集群级数据初始化运行时示例

```yaml
apiVersion: trainer.kubeflow.org/v1alpha1
kind: ClusterTrainingRuntime
metadata:
  name: torch-distributed-with-initializer
  labels:
    trainer.kubeflow.org/framework: torch
spec:
  mlPolicy:
    numNodes: 1
    torch:
      numProcPerNode: auto

  template:
    spec:
      replicatedJobs:
        # 数据集初始化 Job
        - name: dataset-initializer
          replicas: 1
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: dataset-initializer
            spec:
              template:
                spec:
                  containers:
                    - name: dataset-initializer
                      # 数据集初始化镜像
                      image: ghcr.io/kubeflow/trainer/storage-initializer
                      # 环境变量会被 TrainJob.initializer.dataset.env 合并
                      env:
                        - name: STORAGE_TYPE
                          value: s3
                      # 卷挂载
                      volumeMounts:
                        - name: dataset
                          mountPath: /mnt/dataset
                  
                  # 卷定义
                  volumes:
                    - name: dataset
                      emptyDir: {}
                  
                  restartPolicy: OnFailure
        
        # 模型初始化 Job
        - name: model-initializer
          replicas: 1
          template:
            metadata:
              labels:
                trainer.kubeflow.org/trainjob-ancestor-step: model-initializer
            spec:
              template:
                spec:
                  containers:
                    - name: model-initializer
                      image: ghcr.io/kubeflow/trainer/storage-initializer
                      env:
                        - name: STORAGE_TYPE
                          value: s3
                      volumeMounts:
                        - name: pretrained-model
                          mountPath: /mnt/model
                  
                  volumes:
                    - name: pretrained-model
                      emptyDir: {}
                  
                  restartPolicy: OnFailure
        
        # 训练节点 Job
        - name: node
          replicas: 1
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
                      command:
                        - torchrun
                      args:
                        - --nnodes=$(TRAINER_NNODES)
                        - --nproc_per_node=$(TRAINER_NPROC_PER_NODE)
                        - --node_rank=$(JOB_COMPLETION_INDEX)
                        - --rdzv_backend=c10d
                        - --rdzv_endpoint=$(TRAINER_NODE_0_HOSTNAME):29400
                        - --rdzv_id=$(TRAINER_JOB_ID)
                        - /workspace/train.py
                      # 挂载初始化的数据集和模型
                      volumeMounts:
                        - name: dataset
                          mountPath: /mnt/dataset
                        - name: pretrained-model
                          mountPath: /mnt/model
                  
                  volumes:
                    - name: dataset
                      emptyDir: {}
                    - name: pretrained-model
                      emptyDir: {}
                  
                  restartPolicy: OnFailure
      
      # 成功策略：只要训练节点成功即可
      successPolicy:
        operator: All
        targetReplicatedJobs:
          - node
      
      network:
        publishNotReadyAddresses: true
```

### 4.3 TrainingRuntime vs ClusterTrainingRuntime

两种运行时的对比：

| 特性 | TrainingRuntime | ClusterTrainingRuntime |
|------|----------------|------------------------|
| 作用域 | 命名空间级别 | 集群级别 |
| 可见性 | 只能被同一命名空间的`TrainJob`引用 | 可以被任何命名空间的`TrainJob`引用 |
| 使用场景 | 团队或项目特定的运行时配置 | 跨团队共享的标准运行时配置 |
| 权限要求 | 命名空间级别的权限 | 集群级别的权限 |
| 配置格式 | 完全相同 | 完全相同 |

## 5. 环境变量注入

`Kubeflow Trainer`会根据使用的训练框架，为训练容器自动注入相应的环境变量。不同框架使用的环境变量不同。

### 5.1 PyTorch框架环境变量

使用`PyTorch`（通过`torchrun`启动）时，`Torch Plugin`会自动注入以下环境变量：

#### 5.1.1 PET_*系列（PyTorch Elastic Training）

这些是`torchrun`使用的标准环境变量，由`Kubeflow Trainer`自动注入：

| 环境变量 | 说明 | 示例值 | 注入来源 |
|----------|------|--------|----------|
| `PET_NNODES` | 训练节点总数 | `2` | `spec.trainer.numNodes` |
| `PET_NPROC_PER_NODE` | 每节点进程数 | `4` | `spec.mlPolicy.torch.numProcPerNode` |
| `PET_NODE_RANK` | 当前节点编号 | `0-1` | `JOB_COMPLETION_INDEX` |
| `PET_MASTER_ADDR` | 主节点地址 | `myjob-node-0-0.myjob` | `{trainjob-name}-node-0-0.{trainjob-name}` |
| `PET_MASTER_PORT` | 主节点端口 | `29400` | 固定值 |

**说明**：
- `PET`代表`PyTorch Elastic Training`，是`torchrun`的标准环境变量前缀
- 这些变量在`TrainingRuntime`的`command`中使用，如：`torchrun --nproc_per_node=$(PET_NPROC_PER_NODE) ...`
- `PET_NODE_RANK`通过`Kubernetes`的`fieldRef`机制自动从`JOB_COMPLETION_INDEX`获取

#### 5.1.2 标准分布式训练环境变量

`torchrun`会根据`PET_*`变量，为每个进程设置以下标准环境变量：

| 环境变量 | 说明 | 计算方式 | 示例值 |
|----------|------|----------|--------|
| `WORLD_SIZE` | 总进程数 | `PET_NNODES × PET_NPROC_PER_NODE` | `8` |
| `RANK` | 全局进程编号 | 自动计算 | `0-7` |
| `LOCAL_RANK` | 本地进程编号 | 节点内进程索引 | `0-3` |
| `MASTER_ADDR` | 主节点地址 | 继承`PET_MASTER_ADDR` | `myjob-node-0-0.myjob` |
| `MASTER_PORT` | 主节点端口 | 继承`PET_MASTER_PORT` | `29400` |

**说明**：
- 这些变量由`torchrun`自动设置，无需在`TrainingRuntime`中配置
- 训练代码中可直接使用`torch.distributed.get_rank()`等`API`，或通过`os.environ`访问

### 5.2 OpenMPI框架环境变量

使用`OpenMPI`（如`DeepSpeed`）时，会注入以下环境变量：

| 环境变量 | 说明 | 示例值 |
|----------|------|--------|
| `OMPI_MCA_orte_default_hostfile` | 主机列表文件路径 | `/etc/mpi/hostfile` |
| `OMPI_MCA_plm_rsh_agent` | SSH代理（禁用） | `/usr/bin/false` |
| `OMPI_MCA_orte_keep_fqdn_hostnames` | 保持完整主机名 | `true` |

**说明**：
- 这些变量用于配置`OpenMPI`运行时行为
- 通常由`ClusterTrainingRuntime`的容器模板配置

### 5.3 通用环境变量

所有框架都可以使用以下`Kubernetes`原生环境变量：

| 环境变量 | 说明 | 示例值 |
|----------|------|--------|
| `JOB_COMPLETION_INDEX` | 节点索引（`0`开始） | `0-1` |

**说明**：
- 此变量来自`Kubernetes Job`的索引机制，表示当前`Pod`在`Job`中的序号
- 可用于获取节点编号或配置节点特定行为

### 5.4 使用示例

#### 5.4.1 PyTorch训练脚本示例

```python
import os
import torch.distributed as dist

# 初始化分布式进程组（torchrun会自动设置所需环境变量）
dist.init_process_group(backend="nccl")

# 获取分布式信息
rank = dist.get_rank()           # 等价于 int(os.environ['RANK'])
world_size = dist.get_world_size()  # 等价于 int(os.environ['WORLD_SIZE'])
local_rank = int(os.environ['LOCAL_RANK'])
node_rank = int(os.environ.get('JOB_COMPLETION_INDEX', 0))

print(f"Node Rank: {node_rank}")
print(f"Global Rank: {rank}, World Size: {world_size}")
print(f"Local Rank: {local_rank}")
```

#### 5.4.2 TrainingRuntime command配置示例

```yaml
command:
  - torchrun
  - --nproc_per_node=$(PET_NPROC_PER_NODE) 
  - --nnodes=$(PET_NNODES)
  - --node_rank=$(PET_NODE_RANK)
  - --master_addr=$(PET_MASTER_ADDR)
  - --master_port=$(PET_MASTER_PORT)
  - /workspace/train.py
```

## 6. 最佳实践

1. **资源配置**
    - 为训练任务设置合理的资源请求（`requests`）和限制（`limits`）
    - `GPU`资源通常设置相同的`requests`和`limits`
    - 为需要大量内存的操作（如数据加载）预留足够的内存

2. **存储配置**
    - 使用`PVC`或对象存储（`S3`、`GCS`）来持久化数据集和模型
    - 对于需要高`I/O`性能的场景，考虑使用`hostPath`或`local volume`
    - 使用`emptyDir`（`medium: Memory`）作为共享内存，避免`/dev/shm`不足

3. **网络配置**
    - 启用`publishNotReadyAddresses: true`确保分布式训练的网络连通性
    - 对于大规模分布式训练，考虑使用高速网络（如`InfiniBand`）
    - 配置适当的网络插件和`CNI`

4. **调度策略**
    - 使用`gang-scheduling`（`coscheduling`或`Volcano`）确保所有训练节点同时启动
    - 使用节点亲和性和反亲和性控制`Pod`分布
    - 对于`GPU`训练，使用节点选择器确保`Pod`调度到`GPU`节点

5. **容错配置**
    - 设置合理的`maxRestarts`值，避免无限重试
    - 使用`checkpoint`机制定期保存训练状态
    - 配置健康检查（`readinessProbe`、`livenessProbe`）

6. **运行时选择**
    - 使用`ClusterTrainingRuntime`定义组织级别的标准运行时
    - 使用`TrainingRuntime`为特定团队或项目定制运行时
    - 保持运行时配置的版本化管理

## 7. 参考资料

- [Kubeflow Trainer 官方文档](https://www.kubeflow.org/docs/components/trainer/)
- [Kubeflow Trainer GitHub 仓库](https://github.com/kubeflow/trainer)
- [PyTorch Distributed 文档](https://pytorch.org/tutorials/intermediate/ddp_tutorial.html)
- [Volcano 网络拓扑调度](https://volcano.sh/zh/docs/network_topology_aware_scheduling/)
- [Kubernetes JobSet](https://github.com/kubernetes-sigs/jobset)
