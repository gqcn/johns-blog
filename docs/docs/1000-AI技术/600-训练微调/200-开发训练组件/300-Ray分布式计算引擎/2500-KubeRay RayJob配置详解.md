---
slug: "/ai/kuberay-rayjob-configuration"
title: "KubeRay RayJob配置详解"
hide_title: true
keywords:
  [
    "KubeRay",
    "RayJob",
    "Ray",
    "Kubernetes",
    "配置详解",
    "分布式计算",
    "机器学习",
    "AI训练",
    "批量推理",
    "任务调度",
    "资源管理",
    "集群配置",
    "Job提交",
    "自动清理",
    "运行时环境",
    "容器编排",
    "云原生",
    "配置参数",
    "YAML配置",
    "提交模式"
  ]
description: "深入详解KubeRay中RayJob的完整配置方法与参数说明。RayJob是KubeRay提供的一种自动化任务管理方式，能够自动创建 RayCluster、提交Ray任务并在任务完成后自动清理资源。本文通过完整的示例配置文件，以表格形式详细介绍RayJob的各个配置项，包括任务提交配置、集群规格定义、运行时环境设置、资源清理策略等核心参数，帮助读者全面掌握RayJob的配置方法，实现高效的分布式计算任务管理和资源调度优化，适用于机器学习训练、批量推理等多种应用场景。"

---

## 什么是RayJob

`RayJob`是`KubeRay`提供的一种`Kubernetes`自定义资源（`CRD`），用于简化`Ray`任务的提交和管理流程。`RayJob`管理两个关键方面：

- **RayCluster管理**：自动创建和管理`RayCluster`资源，包括`Head Node`和`Worker Nodes`。
- **任务提交**：在集群就绪后自动提交`Ray`任务，并跟踪任务执行状态。

相比手动管理`RayCluster`和任务提交，`RayJob`提供了以下优势：

- **自动化**：无需手动创建集群和提交任务，`KubeRay Operator`会自动处理整个生命周期。
- **资源优化**：任务完成后可自动清理集群资源，避免资源浪费。
- **易于管理**：通过单一的`YAML`配置文件管理整个任务流程。
- **重试机制**：支持任务失败后的自动重试。

## 完整示例配置

以下是一个功能完整的`RayJob`配置示例，展示了所有主要配置项：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: rayjob-sample
  namespace: default
  labels:
    app: ray-job
    version: v1
spec:
  # ==================== 任务提交配置 ====================
  
  # 任务入口命令
  entrypoint: python /home/ray/samples/sample_code.py
  
  # 任务提交模式，默认为K8sJobMode
  submissionMode: K8sJobMode
  
  # 任务ID，如果不设置会自动生成
  # jobId: "custom-job-id-12345"
  
  # 任务元数据
  metadata:
    app: "sample-ray-job"
    version: "1.0"
  
  # 运行时环境配置
  runtimeEnvYAML: |
    pip:
      - requests==2.26.0
      - pendulum==2.1.2
    env_vars:
      counter_name: "test_counter"
      LOG_LEVEL: "INFO"
  
  # 入口任务资源配置
  # entrypointNumCpus: 1.0
  # entrypointNumGpus: 0
  # entrypointResources: '{"custom_resource": 1}'
  
  # ==================== 重试和超时配置 ====================
  
  # 任务失败后的重试次数，每次重试都会创建新的RayCluster
  backoffLimit: 0
  
  # 任务超时时间（秒），超时后任务会被标记为失败
  # activeDeadlineSeconds: 600
  
  # ==================== 集群选择配置 ====================
  
  # 使用标签选择器选择已有的RayCluster，而不是创建新集群
  # clusterSelector:
  #   ray.io/cluster: "existing-cluster"
  
  # ==================== 资源清理配置 ====================
  
  # 任务完成后是否自动删除RayCluster
  shutdownAfterJobFinishes: false
  
  # 任务完成后延迟删除时间（秒），仅在shutdownAfterJobFinishes为true时有效
  ttlSecondsAfterFinished: 0
  
  # ==================== 暂停配置 ====================
  
  # 是否暂停任务，为true时不会创建RayCluster
  suspend: false
  
  # ==================== 提交器配置 ====================
  
  # 提交器Job的配置
  submitterConfig:
    # 提交器Job的重试次数
    backoffLimit: 2
  
  # 自定义提交器Pod模板（可选）
  # submitterPodTemplate:
  #   spec:
  #     restartPolicy: Never
  #     containers:
  #     - name: ray-job-submitter
  #       image: rayproject/ray:latest-py311-cpu
  #       resources:
  #         requests:
  #           cpu: "500m"
  #           memory: "512Mi"
  #         limits:
  #           cpu: "1"
  #           memory: "1Gi"
  
  # ==================== RayCluster配置 ====================
  
  rayClusterSpec:
    # Ray版本，应与容器镜像中的Ray版本匹配
    rayVersion: '2.9.0'
    
    # ===== Head节点配置 =====
    headGroupSpec:
      # Ray启动参数
      rayStartParams:
        dashboard-host: '0.0.0.0'
        block: 'true'
      
      # Head Pod模板
      template:
        metadata:
          labels:
            app: ray-head
            ray.io/cluster: rayjob-sample
        spec:
          containers:
          - name: ray-head
            image: rayproject/ray:latest-py311-cpu
            imagePullPolicy: IfNotPresent
            
            # 容器端口
            ports:
            - containerPort: 6379
              name: gcs-server
            - containerPort: 8265
              name: dashboard
            - containerPort: 10001
              name: client
            
            # 资源限制
            resources:
              requests:
                cpu: "1"
                memory: "2Gi"
              limits:
                cpu: "2"
                memory: "4Gi"
            
            # 挂载代码文件
            volumeMounts:
            - name: code-sample
              mountPath: /home/ray/samples
          
          # 卷配置
          volumes:
          - name: code-sample
            configMap:
              name: ray-job-code-sample
              items:
              - key: sample_code.py
                path: sample_code.py
    
    # ===== Worker节点组配置 =====
    workerGroupSpecs:
    - groupName: small-group
      replicas: 2
      minReplicas: 1
      maxReplicas: 5
      
      # Ray启动参数
      rayStartParams:
        block: 'true'
      
      # Worker Pod模板
      template:
        metadata:
          labels:
            app: ray-worker
            ray.io/cluster: rayjob-sample
            ray.io/group: small-group
        spec:
          initContainers:
          # 等待Head节点就绪的初始化容器
          - name: wait-for-head
            image: busybox:1.28
            command:
            - sh
            - -c
            - |
              until nslookup $RAY_IP.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do
                echo "Waiting for head service..."
                sleep 2
              done
          
          containers:
          - name: ray-worker
            image: rayproject/ray:latest-py311-cpu
            imagePullPolicy: IfNotPresent
            
            # 资源限制
            resources:
              requests:
                cpu: "500m"
                memory: "1Gi"
              limits:
                cpu: "1"
                memory: "2Gi"
            
            # 生命周期配置
            lifecycle:
              preStop:
                exec:
                  command:
                  - /bin/sh
                  - -c
                  - ray stop
```

:::info 说明
以上配置示例基于`KubeRay v1.0.0+`和`Ray 2.9.0+`版本。不同版本的配置项可能有所差异，请根据实际使用的版本进行调整。
:::

## RayJob核心配置项

### Spec级别配置

`RayJob`的`spec`字段定义了任务的核心配置，以下是各配置项的详细说明：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `entrypoint` | - | `Ray`任务的入口命令，相当于`ray job submit`命令的最后一个参数。例如：`python train.py`或`python -m module.main` |
| `submissionMode` | `K8sJobMode` | 任务提交模式。可选值：<br/>- `K8sJobMode`：通过`Kubernetes Job`提交任务（推荐）<br/>- `HTTPMode`：通过`HTTP`请求提交任务<br/>- `InteractiveMode`：等待用户手动提交任务（`alpha`阶段）<br/>- `SidecarMode`：通过`Sidecar`容器提交任务 |
| `jobId` | 自动生成 | 任务提交ID。如果不设置，`KubeRay`会自动生成一个唯一ID。手动设置可用于任务追踪和幂等性保证 |
| `metadata` | - | 任务元数据，以键值对形式存储，可用于任务分类和检索 |
| `runtimeEnvYAML` | - | 运行时环境配置，以多行`YAML`字符串形式提供。支持配置`pip`包、环境变量、工作目录等。详见[Ray运行时环境文档](https://docs.ray.io/en/latest/ray-core/handling-dependencies.html) |
| `backoffLimit` | `0` | 任务失败后的最大重试次数。每次重试会创建新的`RayCluster`。设置为`0`表示不重试 |
| `activeDeadlineSeconds` | - | 任务的最大执行时间（秒）。超过该时间后，任务会被标记为失败，状态变为`Failed`，原因为`DeadlineExceeded` |
| `suspend` | `false` | 是否暂停任务。为`true`时，`KubeRay`不会创建`RayCluster`；如果集群已存在，会被删除。适用于临时暂停任务的场景 |
| `shutdownAfterJobFinishes` | `false` | 任务完成后是否自动删除`RayCluster`。设置为`true`可节省资源 |
| `ttlSecondsAfterFinished` | `0` | 任务完成后延迟删除`RayCluster`的时间（秒）。仅在`shutdownAfterJobFinishes`为`true`时生效 |
| `rayClusterSpec` | - | `RayCluster`的配置规格，定义集群的节点配置、资源分配等。与`clusterSelector`互斥 |
| `clusterSelector` | - | 通过标签选择器选择已有的`RayCluster`运行任务，而不是创建新集群。与`rayClusterSpec`互斥 |

### 入口任务资源配置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `entrypointNumCpus` | - | 为入口任务保留的`CPU`核数。相当于`ray job submit --entrypoint-num-cpus`参数 |
| `entrypointNumGpus` | - | 为入口任务保留的`GPU`卡数。相当于`ray job submit --entrypoint-num-gpus`参数 |
| `entrypointResources` | - | 为入口任务保留的自定义资源，以`JSON`字符串形式提供。例如：`'{"custom_resource": 1}'` |

### 提交器配置

当`submissionMode`为`K8sJobMode`时（默认值），`KubeRay`会创建一个`Kubernetes Job`来提交`Ray`任务。以下配置用于自定义提交器的行为：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `submitterConfig.backoffLimit` | `2` | 提交器`Job`的重试次数。注意与`spec.backoffLimit`的区别：<br/>- `spec.backoffLimit`：整个`RayJob`的重试次数，每次重试创建新集群<br/>- `submitterConfig.backoffLimit`：单次任务提交失败时的重试次数 |
| `submitterPodTemplate` | - | 自定义提交器`Pod`的模板。可以自定义镜像、资源限制、环境变量等。`KubeRay`会自动注入`RAY_DASHBOARD_ADDRESS`和`RAY_JOB_SUBMISSION_ID`环境变量 |

### 删除策略配置（Alpha功能）

`deletionStrategy`字段提供了更灵活的资源清理策略。该功能需要启用`RayJobDeletionPolicy`特性开关。

#### 基于规则的删除策略（推荐）

通过`deletionRules`定义多个删除规则，每个规则包含触发条件和删除动作：

```yaml
deletionStrategy:
  deletionRules:
  # 规则1：任务成功后立即删除Worker节点
  - policy: DeleteWorkers
    condition:
      jobStatus: SUCCEEDED
      ttlSeconds: 0
  
  # 规则2：任务成功后300秒删除整个集群
  - policy: DeleteCluster
    condition:
      jobStatus: SUCCEEDED
      ttlSeconds: 300
  
  # 规则3：任务失败后立即删除整个RayJob资源
  - policy: DeleteSelf
    condition:
      jobStatus: FAILED
      ttlSeconds: 0
```

**删除规则配置说明：**

| 配置项 | 可选值 | 默认值 | 说明 |
|--------|--------|--------|------|
| `policy` | `DeleteCluster`<br/>`DeleteWorkers`<br/>`DeleteSelf`<br/>`DeleteNone` | - | 删除策略类型：<br/>- `DeleteCluster`：删除整个`RayCluster`及其所有`Pod`<br/>- `DeleteWorkers`：仅删除`Worker Pod`，保留`Head Pod`<br/>- `DeleteSelf`：删除`RayJob`及其关联的所有资源<br/>- `DeleteNone`：不删除任何资源 |
| `condition.jobStatus` | `SUCCEEDED`<br/>`FAILED` | - | 触发删除的任务状态。与`jobDeploymentStatus`互斥，必须设置其中一个 |
| `condition.jobDeploymentStatus` | `Failed` | - | 触发删除的部署状态。用于任务提交失败等基础设施层面的清理 |
| `condition.ttlSeconds` | - | `0` | 达到指定状态后延迟删除的秒数。默认为`0`表示立即删除 |

:::warning 注意
- `deletionRules`模式与`shutdownAfterJobFinishes`和`ttlSecondsAfterFinished`不兼容，不能同时使用。
- 使用`deletionRules`时，需要为每个条件设置独立的`ttlSeconds`。
- 多个规则同时满足条件时，影响最大的规则（如`DeleteSelf`）会优先执行。
:::

#### 传统删除策略（已弃用）

通过`onSuccess`和`onFailure`定义任务成功和失败时的删除策略。该方式将在`v1.6.0`版本中移除，建议迁移到`deletionRules`。

```yaml
deletionStrategy:
  onSuccess:
    policy: DeleteCluster
  onFailure:
    policy: DeleteSelf
```

## RayCluster配置

`rayClusterSpec`字段定义了要创建的`RayCluster`的完整规格。这是`RayJob`中最复杂的部分，包含了集群的所有配置细节。

### RayCluster基本配置

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `rayVersion` | - | `Ray`版本号，应与容器镜像中的`Ray`版本一致。例如：`2.9.0`。该字段为必填项 |
| `headGroupSpec` | - | `Head`节点的配置规格，包括`Pod`模板、资源限制等。该字段为必填项 |
| `workerGroupSpecs` | - | `Worker`节点组的配置列表。可以定义多个不同配置的`Worker`组 |

### HeadGroupSpec配置

`Head`节点是`Ray`集群的控制节点，负责调度任务、管理元数据和提供`Dashboard`服务。

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `serviceType` | `ClusterIP` | `Head`节点服务类型。可选值：`ClusterIP`、`NodePort`、`LoadBalancer` |
| `rayStartParams` | - | `ray start`命令的参数。常用参数：<br/>- `dashboard-host`：`Dashboard`监听地址，设置为`0.0.0.0`可从外部访问<br/>- `block`：是否阻塞，建议设置为`true`<br/>- `num-cpus`：手动指定`CPU`数量<br/>- `num-gpus`：手动指定`GPU`数量 |
| `template` | - | `Head Pod`的模板，定义容器镜像、资源限制、卷挂载等。该字段为必填项 |

### WorkerGroupSpec配置

`Worker`节点负责实际的计算任务。可以定义多个`Worker`组，每组有不同的资源配置。

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `groupName` | - | `Worker`组的名称，在同一集群内必须唯一。该字段为必填项 |
| `replicas` | `1` | `Worker`节点的初始副本数 |
| `minReplicas` | `0` | 最小副本数，用于自动伸缩 |
| `maxReplicas` | `2147483647` | 最大副本数，用于自动伸缩 |
| `rayStartParams` | - | `ray start`命令的参数，与`Head`节点类似 |
| `template` | - | `Worker Pod`的模板。该字段为必填项 |

### PodTemplate常用配置

`Head`和`Worker`节点的`template`字段都是标准的`Kubernetes PodTemplateSpec`，以下是常用配置：

**容器配置：**

| 配置项 | 说明 |
|--------|------|
| `image` | 容器镜像 |
| `imagePullPolicy` | 镜像拉取策略，可选：`Always`、`IfNotPresent`、`Never` |
| `resources.requests` | 资源请求量，用于调度决策 |
| `resources.limits` | 资源限制量，超过限制会触发`OOMKilled`或`CPU`限流 |
| `ports` | 容器端口列表，`Head`节点通常需要暴露`6379`（`GCS`）、`8265`（`Dashboard`）、`10001`（`Client`）端口 |
| `volumeMounts` | 卷挂载配置，用于挂载代码文件、数据集等 |
| `env` | 环境变量列表 |
| `lifecycle` | 生命周期钩子，如`preStop`用于优雅停止 |

**Pod配置：**

| 配置项 | 说明 |
|--------|------|
| `volumes` | 卷定义，支持`ConfigMap`、`Secret`、`PVC`、`EmptyDir`等 |
| `nodeSelector` | 节点选择器，用于将`Pod`调度到特定节点 |
| `tolerations` | 污点容忍，配合节点污点使用 |
| `affinity` | 亲和性和反亲和性规则 |
| `serviceAccountName` | 服务账户名称，用于`Pod`的权限控制 |
| `imagePullSecrets` | 镜像拉取密钥 |
| `initContainers` | 初始化容器，在主容器启动前执行 |

## 配置示例详解

### 示例1：基础任务提交

最简单的`RayJob`配置，创建集群并运行任务：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: simple-job
spec:
  entrypoint: python /home/ray/test.py
  
  rayClusterSpec:
    rayVersion: '2.9.0'
    
    headGroupSpec:
      rayStartParams:
        dashboard-host: '0.0.0.0'
      template:
        spec:
          containers:
          - name: ray-head
            image: rayproject/ray:latest-py311-cpu
            resources:
              requests:
                cpu: "1"
                memory: "2Gi"
    
    workerGroupSpecs:
    - groupName: workers
      replicas: 2
      template:
        spec:
          containers:
          - name: ray-worker
            image: rayproject/ray:latest-py311-cpu
            resources:
              requests:
                cpu: "1"
                memory: "2Gi"
```

### 示例2：带运行时环境的任务

配置任务运行时需要的`Python`包和环境变量：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: job-with-runtime-env
spec:
  entrypoint: python /home/ray/train.py
  
  # 运行时环境配置
  runtimeEnvYAML: |
    pip:
      - torch==2.0.0
      - transformers==4.30.0
      - datasets==2.12.0
    env_vars:
      MODEL_NAME: "bert-base-uncased"
      BATCH_SIZE: "32"
      LEARNING_RATE: "2e-5"
    working_dir: "/home/ray/workspace"
  
  rayClusterSpec:
    rayVersion: '2.9.0'
    # ... 集群配置省略 ...
```

### 示例3：自动清理资源

任务完成后自动删除集群，节省资源：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: job-with-cleanup
spec:
  entrypoint: python /home/ray/batch_inference.py
  
  # 任务完成后自动删除集群
  shutdownAfterJobFinishes: true
  
  # 延迟10分钟后删除，留出时间查看日志
  ttlSecondsAfterFinished: 600
  
  rayClusterSpec:
    rayVersion: '2.9.0'
    # ... 集群配置省略 ...
```

### 示例4：使用已有集群

选择已存在的`RayCluster`运行任务，而不是创建新集群：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: job-on-existing-cluster
spec:
  entrypoint: python /home/ray/analyze.py
  
  # 通过标签选择已有集群
  clusterSelector:
    ray.io/cluster-name: "my-existing-cluster"
    environment: "production"
  
  # 注意：使用clusterSelector时不需要rayClusterSpec
```

### 示例5：GPU训练任务

配置使用`GPU`资源的训练任务：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: gpu-training-job
spec:
  entrypoint: python /home/ray/train_llm.py
  
  # 为入口任务分配GPU
  entrypointNumGpus: 1
  
  runtimeEnvYAML: |
    pip:
      - torch==2.0.0+cu118
      - accelerate==0.20.0
  
  rayClusterSpec:
    rayVersion: '2.9.0'
    
    headGroupSpec:
      rayStartParams:
        dashboard-host: '0.0.0.0'
        num-gpus: '0'  # Head节点不需要GPU
      template:
        spec:
          containers:
          - name: ray-head
            image: rayproject/ray:latest-py311-cpu-gpu
            resources:
              requests:
                cpu: "2"
                memory: "4Gi"
    
    workerGroupSpecs:
    - groupName: gpu-workers
      replicas: 4
      minReplicas: 2
      maxReplicas: 8
      rayStartParams:
        num-gpus: '1'
      template:
        spec:
          containers:
          - name: ray-worker
            image: rayproject/ray:latest-py311-cpu-gpu
            resources:
              requests:
                cpu: "4"
                memory: "16Gi"
                nvidia.com/gpu: "1"
              limits:
                nvidia.com/gpu: "1"
          
          # GPU节点选择器
          nodeSelector:
            nvidia.com/gpu.present: "true"
          
          # 容忍GPU节点污点
          tolerations:
          - key: nvidia.com/gpu
            operator: Exists
            effect: NoSchedule
```

### 示例6：高级删除策略

使用新的基于规则的删除策略，实现分阶段资源清理：

```yaml
apiVersion: ray.io/v1
kind: RayJob
metadata:
  name: job-with-deletion-rules
spec:
  entrypoint: python /home/ray/process.py
  
  # 高级删除策略（需要启用RayJobDeletionPolicy特性开关）
  deletionStrategy:
    deletionRules:
    # 成功时：立即删除Worker，保留Head用于调试
    - policy: DeleteWorkers
      condition:
        jobStatus: SUCCEEDED
        ttlSeconds: 0
    
    # 成功时：5分钟后删除整个集群
    - policy: DeleteCluster
      condition:
        jobStatus: SUCCEEDED
        ttlSeconds: 300
    
    # 失败时：保留30分钟用于排查问题
    - policy: DeleteSelf
      condition:
        jobStatus: FAILED
        ttlSeconds: 1800
  
  rayClusterSpec:
    rayVersion: '2.9.0'
    # ... 集群配置省略 ...
```


## 参考资料

- [KubeRay RayJob官方文档](https://docs.ray.io/en/latest/cluster/kubernetes/getting-started/rayjob-quick-start.html)
- [KubeRay API参考](https://ray-project.github.io/kuberay/reference/api/)
- [Ray运行时环境文档](https://docs.ray.io/en/latest/ray-core/handling-dependencies.html)
- [Ray Jobs CLI API参考](https://docs.ray.io/en/latest/cluster/running-applications/job-submission/jobs-package-ref.html)
- [KubeRay GitHub仓库](https://github.com/ray-project/kuberay)
- [Ray官方文档](https://docs.ray.io/)

