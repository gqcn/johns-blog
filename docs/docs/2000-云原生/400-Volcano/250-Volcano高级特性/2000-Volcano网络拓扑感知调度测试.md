---
slug: "/cloud-native/volcano-network-topology-scheduling-test"
title: "Volcano网络拓扑感知调度测试"
hide_title: true
keywords:
  [
    Volcano,
    Kubernetes,
    网络拓扑感知调度,
    HyperNode,
    Kind,
    调度测试,
    Network Topology,
    network-topology-aware,
    拓扑感知,
    多机多卡,
    AI训练,
    分布式调度,
  ]
description: "通过实际部署Kind集群、创建HyperNode、运行测试任务，真实验证Volcano网络拓扑感知调度能力。包含完整的环境搭建、配置示例、测试用例和结果分析，帮助理解和实践Volcano的网络拓扑调度特性。"
---


## 概述

在`AI`大模型训练场景中，模型并行（`Model Parallelism`）将模型分割到多个节点上，训练过程中这些节点需要频繁进行大量数据交互。此时，节点间的网络传输性能往往成为训练的瓶颈，显著影响训练效率。

`Volcano`的 **网络拓扑感知调度（`Network Topology Aware Scheduling`）** 特性，通过统一的网络拓扑`API`和智能调度策略，将工作负载调度到具有最高吞吐量和最低延迟的最佳性能域，尽可能减少跨交换机的通信，以加速数据交换，提升训练效率。

本文将通过实际部署`Kind`集群、创建`HyperNode`、运行测试任务，来真实验证`Volcano`的网络拓扑感知调度能力。

## 测试环境拓扑

我们将构建如下的网络拓扑结构：

```text
tier3                                     s6
                          /                                \
tier2                   s4                                  s5                         
                /               \                    /               \                 
tier1         s0                s1                  s2               s3              
           /      \          /      \            /      \         /      \         
        node0    node1    node2    node3      node4    node5    node6    node7     
```

这个拓扑结构模拟了一个典型的数据中心网络：
- **`tier1`（叶子层）**：`4`个`HyperNode`（`s0-s3`），每个包含`2`个物理节点
- **`tier2`（汇聚层）**：`2`个`HyperNode`（`s4-s5`），分别管理`2`个`tier1`的`HyperNode`
- **`tier3`（核心层）**：`1`个`HyperNode`（`s6`），管理所有`tier2`的`HyperNode`

节点间的通信效率规则：
- 同一`tier1 HyperNode`内的节点通信效率最高
- 跨`tier1`但在同一`tier2`内的节点次之
- 跨`tier2`需要经过`tier3`的节点通信效率最低

## 环境准备

创建包含`8`个`worker`节点的`Kind`集群，用于模拟我们的网络拓扑。



### Kind集群配置文件

:::warning 注意
这里的节点标签不能使用`topology.kubernetes.io/switch`，`kind`默认使用`kindnet CNI`插件，该插件会识别`topology.kubernetes.io/switch`标签，并尝试：
- 为同交换机标签的节点配置相同的子网/路由
- 生成基于交换机的网络策略规则

当手动指定了节点名（`node0-node7`），导致`kindnet CNI`插件在配置网络时，出现「节点名与拓扑标签不匹配」的异常，最终阻塞`kubelet`网络初始化，表现为 `10248`端口拒绝连接。

因此这里我们使用自定义标签`switch`而不是`topology.kubernetes.io/switch`来避免该问题。
:::

创建文件 `kind-cluster.yaml`：

```yaml title="kind-cluster.yaml"
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: volcano-topology-test
nodes:
  # 控制平面节点
  - role: control-plane
    image: kindest/node:v1.27.3
  
  # Worker节点 - 模拟网络拓扑
  # tier1 - s0
  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s0
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node0

  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s0
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node1
  
  # tier1 - s1
  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s1
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node2

  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s1
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node3
  
  # tier1 - s2
  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s2
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node4

  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s2
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node5
  
  # tier1 - s3
  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s3
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node6

  - role: worker
    image: kindest/node:v1.27.3
    labels:
      switch: s3
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node7
```

### 创建集群

```bash
# 创建集群
kind create cluster --config kind-cluster.yaml

# 验证节点
kubectl get nodes
```

预期输出：
```text
NAME                                  STATUS   ROLES           AGE   VERSION
node0                                 Ready    <none>          10s   v1.27.3
node1                                 Ready    <none>          10s   v1.27.3
node2                                 Ready    <none>          10s   v1.27.3
node3                                 Ready    <none>          10s   v1.27.3
node4                                 Ready    <none>          10s   v1.27.3
node5                                 Ready    <none>          9s    v1.27.3
node6                                 Ready    <none>          10s   v1.27.3
node7                                 Ready    <none>          10s   v1.27.3
volcano-topology-test-control-plane   Ready    control-plane   30s   v1.27.3
```

### 安装Volcano

使用`Helm`安装支持网络拓扑感知调度的`Volcano`版本：

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

验证安装：
```bash
kubectl get pods -n volcano-system
```

预期输出：
```
NAME                                   READY   STATUS    RESTARTS   AGE
volcano-admission-b84bbd89-9k55v       1/1     Running   0          105s
volcano-controllers-7b97b6455c-q2jf9   1/1     Running   0          105s
volcano-scheduler-65d4d4645b-k6nmk     1/1     Running   0          105s
```

## 配置Volcano调度器

为了启用网络拓扑感知调度功能，需要更新`Volcano`调度器配置，启用`network-topology-aware`插件：

```yaml title="volcano-scheduler-configmap.yaml"
apiVersion: v1
kind: ConfigMap
metadata:
  name: volcano-scheduler-configmap
  namespace: volcano-system
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
      - name: proportion
      - name: nodeorder
      - name: binpack
      # 启用网络拓扑感知调度插件
      - name: network-topology-aware
```

应用配置：

```bash
kubectl apply -f volcano-scheduler-configmap.yaml
```

重启调度器保证配置生效（通过滚动重启优雅实现）：

```bash
kubectl rollout restart deployment volcano-scheduler -n volcano-system
```

## 创建HyperNode资源

根据我们设计的网络拓扑，创建`HyperNode`资源。

创建文件 `hypernodes.yaml`：

```yaml title="hypernodes.yaml"
# Tier1 - 叶子HyperNode
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s0
spec:
  tier: 1
  members:
  - type: Node
    selector:
      labelMatch:
        matchLabels:
          switch: s0
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s1
spec:
  tier: 1
  members:
  - type: Node
    selector:
      labelMatch:
        matchLabels:
          switch: s1
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s2
spec:
  tier: 1
  members:
  - type: Node
    selector:
      labelMatch:
        matchLabels:
          switch: s2
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s3
spec:
  tier: 1
  members:
  - type: Node
    selector:
      labelMatch:
        matchLabels:
          switch: s3
---
# Tier2 - 汇聚层HyperNode
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s4
spec:
  tier: 2
  members:
  - type: HyperNode
    selector:
      exactMatch:
        name: "s0"
  - type: HyperNode
    selector:
      exactMatch:
        name: "s1"
---
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s5
spec:
  tier: 2
  members:
  - type: HyperNode
    selector:
      exactMatch:
        name: "s2"
  - type: HyperNode
    selector:
      exactMatch:
        name: "s3"
---
# Tier3 - 核心层HyperNode
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s6
spec:
  tier: 3
  members:
  - type: HyperNode
    selector:
      exactMatch:
        name: "s4"
  - type: HyperNode
    selector:
      exactMatch:
        name: "s5"
```

应用`HyperNode`配置：

```bash
# 创建HyperNode资源
kubectl apply -f hypernodes.yaml

# 查看HyperNode（该CRD是Cluster作用域）
kubectl get hypernodes
```

预期输出：
```text
NAME   TIER   NODECOUNT   AGE
s0     1      2           10s
s1     1      2           10s
s2     1      2           10s
s3     1      2           10s
s4     2      2           10s
s5     2      2           10s
s6     3      2           10s
```

查看`HyperNode`详细信息：
```bash
# 查看tier1的s0
kubectl get hypernode s0 -o yaml

# 查看tier2的s4
kubectl get hypernode s4 -o yaml

# 查看tier3的s6
kubectl get hypernode s6 -o yaml
```

## 测试网络拓扑感知调度

### Hard模式 - Tier1约束

创建一个只能在`tier1 HyperNode`内调度的任务。

创建简单的测试文件`topology-test-1.yaml`：

```yaml title="topology-test-1.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-1
spec:
  minAvailable: 2
  schedulerName: volcano
  queue: default
  
  # 网络拓扑约束：只能在tier1内调度
  networkTopology:
    mode: hard
    highestTierAllowed: 1
  
  tasks:
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "sleep 3600"]
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "100m"
                  memory: "128Mi"
```

运行测试：

```bash
# 创建任务
kubectl apply -f topology-test-1.yaml

# 查看任务状态
kubectl get vcjob topology-test-1

# 查看Pod调度情况
kubectl get pods -o wide
```

调度结果：
```text
NAME                                   READY   STATUS    RESTARTS   AGE   IP           NODE    NOMINATED NODE   READINESS GATES
topology-test-1-worker-0           1/1     Running   0          11s   10.244.7.2   node0   <none>           <none>
topology-test-1-worker-1           1/1     Running   0          11s   10.244.2.3   node1   <none>           <none>
```

符合预期：
- 所有`2`个`Pod`应该被调度到同一个`tier1 HyperNode`内（即同一个`s0/s1/s2/s3`）
- 例如：都在 `node0` 和 `node1`（s0）

清理任务：

```bash
kubectl delete -f topology-test-1.yaml
```

### Hard模式 - Tier2约束

创建一个可以跨`tier1`但必须在`tier2`内调度的任务。

创建文件 `topology-test-2.yaml`：

```yaml title="topology-test-2.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-2
spec:
  minAvailable: 4
  schedulerName: volcano
  queue: default
  
  # 网络拓扑约束：可以跨tier1，但必须在tier2内
  networkTopology:
    mode: hard
    highestTierAllowed: 2
  
  tasks:
    - replicas: 4
      name: worker
      template:
        spec:
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "sleep 3600"]
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "100m"
                  memory: "128Mi"
```

运行测试：

```bash
# 创建新任务
kubectl apply -f topology-test-2.yaml

# 查看任务状态
kubectl get vcjob topology-test-2

# 查看Pod调度情况
kubectl get pods -o wide
```

调度结果：
```text
NAME                                   READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
topology-test-2-worker-0           1/1     Running   0          9s      10.244.3.37   node3   <none>           <none>
topology-test-2-worker-1           1/1     Running   0          9s      10.244.1.46   node2   <none>           <none>
topology-test-2-worker-2           1/1     Running   0          9s      10.244.3.38   node3   <none>           <none>
topology-test-2-worker-3           1/1     Running   0          9s      10.244.3.39   node3   <none>           <none>
```

符合预期：
- 所有`4`个`Pod`应该被调度到同一个`tier2 HyperNode`内
- 可能跨越`2`个`tier1 HyperNode`，但都在`s4`（`s0-s1`）或`s5`（`s2-s3`）内



清理任务：

```bash
kubectl delete -f topology-test-2.yaml
```

### Hard模式 - Tier2约束 + 反亲和性

在测试2的基础上增加反亲和性约束，确保`Pod`分散到不同节点，以达到更好的测试效果。

创建文件 `topology-test-3.yaml`：

```yaml title="topology-test-3.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-3
spec:
  minAvailable: 4
  schedulerName: volcano
  queue: default
  
  # 网络拓扑约束：可以跨tier1，但必须在tier2内
  networkTopology:
    mode: hard
    highestTierAllowed: 2
  
  tasks:
    - replicas: 4
      name: worker
      template:
        metadata:
          labels:
            # 用于反亲和性规则，确保Pod分散到不同节点
            app: exclusive-app
        spec:
          affinity:
            podAntiAffinity:
              requiredDuringSchedulingIgnoredDuringExecution: 
                - labelSelector:
                    matchExpressions:
                      - key: app
                        operator: In
                        values:
                          - exclusive-app 
                  topologyKey: kubernetes.io/hostname
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "sleep 3600"]
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "100m"
                  memory: "128Mi"
```

**配置说明**：
- **反亲和性约束**：通过`podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution`，确保具有相同`app=exclusive-app`标签的Pod不会被调度到同一个节点
- **拓扑键**：`topologyKey: kubernetes.io/hostname`表示按节点主机名进行互斥判断
- **综合效果**：`4`个`Pod`必须分散到`4`个不同节点，且这`4`个节点必须在同一个`tier2`的`HyperNode`内

运行测试：

```bash
# 创建任务
kubectl apply -f topology-test-3.yaml

# 查看任务状态
kubectl get vcjob topology-test-3

# 查看Pod调度情况
kubectl get pods -o wide
```

预期调度结果：
```text
NAME                                   READY   STATUS    RESTARTS   AGE   IP            NODE    NOMINATED NODE   READINESS GATES
topology-test-3-worker-0           1/1     Running   0          10s   10.244.7.3    node0   <none>           <none>
topology-test-3-worker-1           1/1     Running   0          10s   10.244.2.4    node1   <none>           <none>
topology-test-3-worker-2           1/1     Running   0          10s   10.244.1.5    node2   <none>           <none>
topology-test-3-worker-3           1/1     Running   0          10s   10.244.3.6    node3   <none>           <none>
```

符合预期：
- `4`个`Pod`分别调度到`4`个不同的节点（满足反亲和性）
- 这`4`个节点都属于同一个`tier2` `HyperNode`，例如`s4`（包含`node0-node3`）或`s5`（包含`node4-node7`）
- 网络拓扑和反亲和性约束同时得到满足

清理任务：

```bash
kubectl delete -f topology-test-3.yaml
```

### 调度失败场景 - 跨Tier2约束

测试当任务需要跨越`tier2`边界时，在`hard`模式下无法调度的情况。

创建文件 `topology-test-4.yaml`：

```yaml title="topology-test-4.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-4
spec:
  minAvailable: 5
  schedulerName: volcano
  queue: default
  
  # 网络拓扑约束：必须在tier2内
  networkTopology:
    mode: hard
    highestTierAllowed: 2
  
  tasks:
    - replicas: 5
      name: worker
      template:
        metadata:
          labels:
            # 用于反亲和性规则，确保Pod分散到不同节点
            app: exclusive-app
        spec:
          affinity:
            podAntiAffinity:
              requiredDuringSchedulingIgnoredDuringExecution: 
                - labelSelector:
                    matchExpressions:
                      - key: app
                        operator: In
                        values:
                          - exclusive-app 
                  topologyKey: kubernetes.io/hostname
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "sleep 3600"]
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "100m"
                  memory: "128Mi"
```

**配置说明**：
- **任务数量**：需要`5`个`Pod`，每个`Pod`必须在不同节点（反亲和性）
- **拓扑约束**：`highestTierAllowed: 2`，要求所有`Pod`在同一个`tier2` `HyperNode`内
- **资源冲突**：每个`tier2` `HyperNode`（`s4`或`s5`）只包含`4`个节点，无法满足`5`个不同节点的需求

运行测试：

```bash
# 创建任务
kubectl apply -f topology-test-4.yaml

# 查看任务状态（应该是Pending）
kubectl get vcjob topology-test-4

# 查看Pod状态
kubectl get pods -l volcano.sh/job-name=topology-test-4

# 查看调度事件
kubectl describe vcjob topology-test-4
```

预期结果：
```text
NAME                                   READY   STATUS    RESTARTS   AGE     IP            NODE     NOMINATED NODE   READINESS GATES
topology-test-4-worker-0           0/1     Pending   0          2m17s   <none>        <none>   <none>           <none>
topology-test-4-worker-1           0/1     Pending   0          2m17s   <none>        <none>   <none>           <none>
topology-test-4-worker-2           0/1     Pending   0          2m17s   <none>        <none>   <none>           <none>
topology-test-4-worker-3           0/1     Pending   0          2m17s   <none>        <none>   <none>           <none>
topology-test-4-worker-4           0/1     Pending   0          2m17s   <none>        <none>   <none>           <none>
```

符合预期：
- 所有`5`个`Pod`处于`Pending`状态，无法被调度
- 原因：每个`tier2` `HyperNode`只有`4`个节点，无法同时满足以下约束：
  - `5`个`Pod`必须在`5`个不同节点（反亲和性，测试需要）
  - 这些节点必须在同一个`tier2` `HyperNode`内（网络拓扑约束），只能使用`s4`或`s5`中的`4`个节点，不能两边各调度一部分`Pod`

查看详细调度信息：

```bash
# 查看调度器日志
kubectl logs -n volcano-system -l app=volcano-scheduler --tail=50 | grep -i "topology-test-4"

# 查看PodGroup状态
kubectl get podgroup topology-test-4 -o yaml
```

清理任务：

```bash
kubectl delete -f topology-test-4.yaml
```

### Soft模式 - 跨Tier2调度

将测试4中的示例使用`soft`模式运行，可实现跨`tier2`调度，比如`s4`和`s5`拓扑下各调度一部分`Pod`，但在真实业务场景中，这种跨多层网络拓扑的通信效率很差。本示例仅做测试和参考。

创建文件 `topology-test-5.yaml`：

```yaml title="topology-test-5.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-5
spec:
  minAvailable: 5
  schedulerName: volcano
  queue: default
  
  # 网络拓扑约束：尽可能在tier2内
  networkTopology:
    mode: soft
    highestTierAllowed: 2
  
  tasks:
    - replicas: 5
      name: worker
      template:
        metadata:
          labels:
            # 用于反亲和性规则，确保Pod分散到不同节点
            app: exclusive-app
        spec:
          affinity:
            podAntiAffinity:
              requiredDuringSchedulingIgnoredDuringExecution: 
                - labelSelector:
                    matchExpressions:
                      - key: app
                        operator: In
                        values:
                          - exclusive-app 
                  topologyKey: kubernetes.io/hostname
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "sleep 3600"]
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "100m"
                  memory: "128Mi"
```

**配置说明**：
- **调度模式**：`soft`模式（软约束），调度器会尽最大努力满足拓扑约束，但允许降级
- **任务数量**：`5`个`Pod`，每个`Pod`必须在不同节点（反亲和性）
- **拓扑约束**：`highestTierAllowed: 2`，尽可能在`tier2`内调度
- **降级策略**：当单个`tier2` `HyperNode`无法满足时，允许跨越`tier2`边界进行调度

运行测试：

```bash
# 创建任务
kubectl apply -f topology-test-5.yaml

# 查看任务状态
kubectl get vcjob topology-test-5

# 查看Pod调度情况
kubectl get pods -o wide -l volcano.sh/job-name=topology-test-5
```

预期调度结果：
```text
NAME                                   READY   STATUS    RESTARTS   AGE     IP            NODE    NOMINATED NODE   READINESS GATES
topology-test-5-worker-0               1/1     Running   0          13m     10.244.7.44   node0   <none>           <none>
topology-test-5-worker-1               1/1     Running   0          13m     10.244.2.55   node1   <none>           <none>
topology-test-5-worker-2               1/1     Running   0          13m     10.244.1.49   node2   <none>           <none>
topology-test-5-worker-3               1/1     Running   0          13m     10.244.3.42   node3   <none>           <none>
topology-test-5-worker-4               1/1     Running   0          13m     10.244.8.16   node4   <none>           <none>
```

符合预期：
- 所有`5`个`Pod`成功调度并运行（与测试4的`Pending`状态形成对比）
- `Pod`分散到`5`个不同节点（满足反亲和性）
- 由于单个`tier2` `HyperNode`只有`4`个节点，调度器允许跨越`tier2`边界
- 可能的分布：
  - `4`个`Pod`在`s4`下（`node0-node3`）
  - `1`个`Pod`在`s5`下（例如`node4`）
- `node0-node3`与`node4`之间的通信需要跨越`tier2`，经过`tier3`（`s6`），通信效率较低

**对比测试4**：
- **测试4（hard模式）**：无法调度，所有`Pod`保持`Pending`状态
- **测试5（soft模式）**：成功调度，但可能跨越拓扑边界，牺牲了部分网络性能

清理任务：

```bash
kubectl delete -f topology-test-5.yaml
```

## 常见问题

### HyperNode创建失败

**可能原因**：
1. `CRD`未正确安装
2. 节点名称不匹配
3. `YAML`格式错误
4. 非叶子`HyperNode`使用了不支持的选择器类型（只支持`exactMatch`）

**解决方法**：
```bash
# 检查CRD是否存在
kubectl get crd hypernodes.topology.volcano.sh

# 验证节点名称
kubectl get nodes --show-labels

# 查看HyperNode详情
kubectl describe hypernode <hypernode-name>
```

**关于选择器限制**：

- **叶子`HyperNode`**（包含`Node`类型成员）：支持三种选择器
  - `exactMatch`：精确匹配节点名称
  - `regexMatch`：正则表达式匹配节点名称
  - `labelMatch`：基于标签匹配节点

- **非叶子`HyperNode`**（包含`HyperNode`类型成员）：**仅支持`exactMatch`**
  - 必须使用`exactMatch`精确指定子`HyperNode`的名称
  - 不支持`regexMatch`和`labelMatch`

**错误示例**（非叶子`HyperNode`使用`labelMatch`会失败）：
```yaml
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s4
spec:
  tier: 2
  members:
  - type: HyperNode
    selector:
      labelMatch:  # ❌ 错误：非叶子HyperNode不支持labelMatch
        matchLabels:
          tier: "1"
```

**正确示例**：
```yaml
apiVersion: topology.volcano.sh/v1alpha1
kind: HyperNode
metadata:
  name: s4
spec:
  tier: 2
  members:
  - type: HyperNode
    selector:
      exactMatch:  # ✅ 正确：使用exactMatch
        name: "s0"
  - type: HyperNode
    selector:
      exactMatch:
        name: "s1"
```

### 调度器未使用网络拓扑感知

**可能原因**：
1. 调度器配置未正确更新
2. 插件未启用
3. 任务未设置资源请求和限制，被视为`BestEffort`类型

**解决方法**：
```bash
# 检查调度器配置
kubectl get cm volcano-scheduler-configmap -n volcano-system -o yaml

# 重启调度器
kubectl rollout restart deployment volcano-scheduler -n volcano-system

# 验证插件是否加载
kubectl logs -n volcano-system -l app=volcano-scheduler | grep "network-topology-aware"
```

**关于BestEffort任务**：

网络拓扑感知调度依赖于任务的资源请求信息来进行调度决策。如果`Pod`没有设置`resources.requests`和`resources.limits`，它会被标记为`BestEffort` `QoS`类型。对于`BestEffort`类型的任务，即使启用了网络拓扑调度插件，该插件也不会对其生效。

**原因**：
- `BestEffort`任务没有明确的资源需求，调度器无法准确评估其对网络拓扑的影响
- 网络拓扑调度需要基于资源请求来计算节点得分和拓扑匹配度
- 为保证调度质量，插件会跳过`BestEffort`类型的任务

**检查方法**：
```bash
# 查看Pod的QoS类型
kubectl get pod <pod-name> -o jsonpath='{.status.qosClass}'

# 应该返回 Guaranteed 或 Burstable，而非 BestEffort
```

**解决方案**：

在任务定义中必须设置资源请求和限制：
```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "100m"
    memory: "128Mi"
```

### HyperNode的NODECOUNT显示不符合预期

**现象**：

查看`HyperNode`时，发现`s4`、`s5`、`s6`的`NODECOUNT`都显示为`2`：

```bash
NAME   TIER   NODECOUNT   AGE
s0     1      2           10s
s1     1      2           10s
s2     1      2           10s
s3     1      2           10s
s4     2      2           10s    # 包含s0和s1，为什么不是4？
s5     2      2           10s    # 包含s2和s3，为什么不是4？
s6     3      2           10s    # 包含s4和s5，为什么不是8？
```

**原因**：

这是正常现象。`NODECOUNT`字段统计的是`HyperNode`的**直接子成员数量**，而不是递归统计所有叶子节点的数量。

**详细说明**：

- **`s0-s3`（`tier1`）**：
  - 直接包含`2`个`Node`类型的成员
  - `NODECOUNT = 2`

- **`s4-s5`（`tier2`）**：
  - 直接包含`2`个`HyperNode`类型的成员（例如`s4`包含`s0`和`s1`）
  - `NODECOUNT = 2`（统计的是`HyperNode`成员数，不是叶子节点数）

- **`s6`（`tier3`）**：
  - 直接包含`2`个`HyperNode`类型的成员（`s4`和`s5`）
  - `NODECOUNT = 2`（统计的是`HyperNode`成员数，不是叶子节点数）

**验证方法**：

查看`HyperNode`的详细配置可以确认成员类型：

```bash
# 查看s4的成员
kubectl get hypernode s4 -o yaml

# 输出显示members包含2个HyperNode类型的成员
spec:
  tier: 2
  members:
  - type: HyperNode
    selector:
      exactMatch:
        name: "s0"
  - type: HyperNode
    selector:
      exactMatch:
        name: "s1"
```

**总结**：`NODECOUNT`反映的是树状结构中的直接子节点数量，不是叶子节点总数。这种设计有助于清晰地理解`HyperNode`的层级结构。


## 参考资料

- [Volcano官方文档 - 网络拓扑感知调度](https://volcano.sh/docs/network_topology_aware_scheduling/)
- [Volcano GitHub仓库](https://github.com/volcano-sh/volcano)
- [Kind官方文档](https://kind.sigs.k8s.io/)
- [Kubernetes调度框架](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/)
