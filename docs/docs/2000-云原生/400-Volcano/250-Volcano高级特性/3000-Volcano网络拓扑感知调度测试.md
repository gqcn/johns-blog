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

`Volcano`的**网络拓扑感知调度（`Network Topology Aware Scheduling`）**特性，通过统一的网络拓扑`API`和智能调度策略，将工作负载调度到具有最高吞吐量和最低延迟的最佳性能域，尽可能减少跨交换机的通信，以加速数据交换，提升训练效率。

本文将通过实际部署`Kind`集群、创建`HyperNode`、运行测试任务，来真实验证`Volcano`的网络拓扑感知调度能力。

## 测试环境拓扑

我们将构建如下的网络拓扑结构：

```text
  tier3                                       s6
                              /                               \
  tier2                     s4                                 s5                         
                    /               \                   /              \                 
  tier1           s0                s1                 s2              s3              
               /      \          /      \           /      \        /      \         
            node0    node1    node2    node3      node4   node5   node6   node7   
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

```yaml
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
volcano-admission-b84bbd89-rqrvq       1/1     Running   0          46s
volcano-controllers-7b97b6455c-d8hcv   1/1     Running   0          46s
volcano-scheduler-65d4d4645b-k9vdl     1/1     Running   0          46s
```

## 配置Volcano调度器

为了启用网络拓扑感知调度功能，需要更新`Volcano`调度器配置：

修改调度器`ConfigMap`配置`volcano-scheduler-configmap`：
```bash
kubectl edit configmap volcano-scheduler-configmap -n volcano-system
```
启用`network-topology-aware`插件：
```yaml
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

重启调度器保证配置生效：

```bash
kubectl delete pod volcano-scheduler-65d4d4645b-k9vdl -n volcano-system
```

## 创建HyperNode资源

根据我们设计的网络拓扑，创建`HyperNode`资源。

创建文件 `hypernodes.yaml`：

```yaml
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

# 查看HyperNode
kubectl get hypernodes
```

预期输出：
```text
NAME   TIER   AGE
s0     1      10s
s1     1      10s
s2     1      10s
s3     1      10s
s4     2      10s
s5     2      10s
s6     3      10s
```

查看HyperNode详细信息：
```bash
# 查看tier1的s0
kubectl get hypernode s0 -o yaml

# 查看tier2的s4
kubectl get hypernode s4 -o yaml

# 查看tier3的s6
kubectl get hypernode s6 -o yaml
```

## 测试网络拓扑感知调度

### 测试1：Hard模式 - Tier1约束

创建一个只能在tier1 HyperNode内调度的任务。

创建文件 `test-job-tier1.yaml`：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-tier1
  namespace: default
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
              command: 
                - sh
                - -c
                - |
                  echo "Pod: $HOSTNAME"
                  echo "Node: $(cat /etc/hostname)"
                  echo "Starting sleep..."
                  sleep 3600
              resources:
                requests:
                  cpu: "500m"
                  memory: "256Mi"
                limits:
                  cpu: "500m"
                  memory: "256Mi"
          restartPolicy: OnFailure
```

运行测试：

```bash
# 创建任务
kubectl apply -f test-job-tier1.yaml

# 查看任务状态
kubectl get vcjob topology-test-tier1

# 查看Pod调度情况
kubectl get pods -l volcano.sh/job-name=topology-test-tier1 -o wide
```

预期结果：
- 所有2个Pod应该被调度到同一个tier1 HyperNode内（即同一个s0/s1/s2/s3）
- 例如：都在 `volcano-topology-test-worker` 和 `volcano-topology-test-worker2`（s0）

验证调度结果：
```bash
# 查看Pod所在节点
PODS=$(kubectl get pods -l volcano.sh/job-name=topology-test-tier1 -o jsonpath='{.items[*].spec.nodeName}')
echo "Pods scheduled on nodes: $PODS"

# 验证是否在同一个tier1 HyperNode内
# 应该看到节点名称连续（如worker和worker2，或worker3和worker4）
```

### 测试2：Hard模式 - Tier2约束

创建一个可以跨tier1但必须在tier2内调度的任务。

创建文件 `test-job-tier2.yaml`：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-tier2
  namespace: default
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
              command: 
                - sh
                - -c
                - |
                  echo "================================================"
                  echo "Pod Information:"
                  echo "  Pod Name: $HOSTNAME"
                  echo "  Pod IP: $(hostname -i)"
                  echo "  Node Name: $(cat /etc/hostname)"
                  echo "================================================"
                  echo "Starting sleep for 1 hour..."
                  sleep 3600
              resources:
                requests:
                  cpu: "500m"
                  memory: "256Mi"
                limits:
                  cpu: "500m"
                  memory: "256Mi"
          restartPolicy: OnFailure
```

运行测试：

```bash
# 清理之前的任务
kubectl delete vcjob topology-test-tier1

# 创建新任务
kubectl apply -f test-job-tier2.yaml

# 查看任务状态
kubectl get vcjob topology-test-tier2

# 查看Pod调度情况
kubectl get pods -l volcano.sh/job-name=topology-test-tier2 -o wide
```

预期结果：
- 所有4个Pod应该被调度到同一个tier2 HyperNode内
- 可能跨越2个tier1 HyperNode，但都在s4（worker-worker4）或s5（worker5-worker8）内

验证调度结果：
```bash
# 查看Pod所在节点
kubectl get pods -l volcano.sh/job-name=topology-test-tier2 \
  -o custom-columns=POD:metadata.name,NODE:spec.nodeName

# 应该看到所有Pod都在s4（node0-3）或s5（node4-7）对应的节点上
```

### 测试3：调度失败场景 - 资源不足

测试当tier1资源不足时，任务无法调度的情况。

创建文件 `test-job-tier1-fail.yaml`：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-tier1-fail
  namespace: default
spec:
  minAvailable: 8  # 需要8个Pod，但一个tier1 HyperNode只有2个节点
  schedulerName: volcano
  queue: default
  
  networkTopology:
    mode: hard
    highestTierAllowed: 1  # 强制在tier1内
  
  tasks:
    - replicas: 8
      name: worker
      template:
        spec:
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "echo 'Hello from $HOSTNAME' && sleep 3600"]
              resources:
                requests:
                  cpu: "500m"
                  memory: "256Mi"
                limits:
                  cpu: "500m"
                  memory: "256Mi"
          restartPolicy: OnFailure
```

运行测试：

```bash
# 清理之前的任务
kubectl delete vcjob topology-test-tier2

# 创建任务
kubectl apply -f test-job-tier1-fail.yaml

# 查看任务状态（应该是Pending）
kubectl get vcjob topology-test-tier1-fail

# 查看调度事件
kubectl describe vcjob topology-test-tier1-fail
```

预期结果：
- Job状态应该是 `Pending`
- 事件中应该显示类似 "cannot find a HyperNode to satisfy the networkTopology constraint" 的信息

### 测试4：Soft模式（可选）

如果想测试soft模式，可以将highestTierAllowed设置为tier3，此时调度器会尽力而为。

创建文件 `test-job-soft.yaml`：

```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: topology-test-soft
  namespace: default
spec:
  minAvailable: 4
  schedulerName: volcano
  queue: default
  
  # Soft模式：尽可能在低tier内调度，但允许跨越
  networkTopology:
    mode: hard
    highestTierAllowed: 3  # 设置为最高tier，等效于soft模式
  
  tasks:
    - replicas: 4
      name: worker
      template:
        spec:
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "echo 'Pod $HOSTNAME on node' && sleep 3600"]
              resources:
                requests:
                  cpu: "500m"
                  memory: "256Mi"
                limits:
                  cpu: "500m"
                  memory: "256Mi"
          restartPolicy: OnFailure
```

## 调度结果分析

### 查看Pod分布

```bash
# 查看所有测试任务的Pod分布
kubectl get pods -l volcano.sh/queue-name=default -o wide --sort-by=.spec.nodeName

# 按节点统计Pod数量
kubectl get pods -o wide --no-headers | awk '{print $7}' | sort | uniq -c
```

### 查看调度器日志

```bash
# 查看调度器日志，了解调度决策过程
kubectl logs -n volcano-system -l app=volcano-scheduler --tail=100

# 查找网络拓扑相关的日志
kubectl logs -n volcano-system -l app=volcano-scheduler --tail=500 | grep -i "topology\|hypernode"
```

### 验证网络拓扑约束

```bash
# 检查tier1测试的Pod是否都在同一个tier1 HyperNode
echo "=== Tier1 Test Pods ==="
kubectl get pods -l volcano.sh/job-name=topology-test-tier1 \
  -o custom-columns=POD:metadata.name,NODE:spec.nodeName

# 检查tier2测试的Pod是否都在同一个tier2 HyperNode
echo "=== Tier2 Test Pods ==="
kubectl get pods -l volcano.sh/job-name=topology-test-tier2 \
  -o custom-columns=POD:metadata.name,NODE:spec.nodeName
```

## 清理环境

测试完成后清理资源：

```bash
# 删除测试任务
kubectl delete vcjob --all

# 删除HyperNode
kubectl delete hypernodes --all

# 卸载Volcano
helm uninstall volcano -n volcano-system

# 删除namespace
kubectl delete namespace volcano-system

# 删除Kind集群
kind delete cluster --name volcano-topology-test
```

## 常见问题

### Q1: Pod一直处于Pending状态

**可能原因**：
1. 网络拓扑约束过于严格，无法找到满足条件的HyperNode
2. 节点资源不足
3. HyperNode配置错误

**解决方法**：
```bash
# 查看Pod事件
kubectl describe pod <pod-name>

# 查看调度器日志
kubectl logs -n volcano-system -l app=volcano-scheduler --tail=100

# 检查HyperNode配置
kubectl get hypernodes -o yaml
```

### Q2: HyperNode创建失败

**可能原因**：
1. CRD未正确安装
2. 节点名称不匹配
3. YAML格式错误

**解决方法**：
```bash
# 检查CRD是否存在
kubectl get crd hypernodes.topology.volcano.sh

# 验证节点名称
kubectl get nodes --show-labels

# 查看HyperNode详情
kubectl describe hypernode <hypernode-name>
```

### Q3: 调度器未使用网络拓扑感知

**可能原因**：
1. 调度器配置未正确更新
2. 插件未启用

**解决方法**：
```bash
# 检查调度器配置
kubectl get cm volcano-scheduler-configmap -n volcano-system -o yaml

# 重启调度器
kubectl rollout restart deployment volcano-scheduler -n volcano-system

# 验证插件是否加载
kubectl logs -n volcano-system -l app=volcano-scheduler | grep "network-topology-aware"
```

## 总结

通过本文的实践，我们：

1. **搭建了测试环境**：使用Kind创建了包含8个worker节点的K8s集群
2. **定义了网络拓扑**：通过HyperNode CRD构建了三层网络拓扑结构
3. **验证了调度能力**：
   - Hard模式tier1约束：Pod被限制在同一个tier1 HyperNode内
   - Hard模式tier2约束：Pod可以跨tier1但必须在tier2内
   - 资源不足场景：任务正确地保持Pending状态
4. **理解了调度原理**：网络拓扑感知调度通过HyperNode层级关系，确保任务在最优的网络性能域内运行

网络拓扑感知调度是Volcano针对AI大模型训练场景的重要优化特性，能够显著提升分布式训练的网络通信效率。在实际生产环境中，建议：

- 根据实际的数据中心网络拓扑结构配置HyperNode
- 使用HyperNode自动发现功能简化管理
- 结合实际工作负载特点选择合适的tier约束
- 监控调度效果，持续优化配置

## 参考资料

- [Volcano官方文档 - 网络拓扑感知调度](https://volcano.sh/docs/network_topology_aware_scheduling/)
- [Volcano GitHub仓库](https://github.com/volcano-sh/volcano)
- [Kind官方文档](https://kind.sigs.k8s.io/)
- [Kubernetes调度框架](https://kubernetes.io/docs/concepts/scheduling-eviction/scheduling-framework/)
