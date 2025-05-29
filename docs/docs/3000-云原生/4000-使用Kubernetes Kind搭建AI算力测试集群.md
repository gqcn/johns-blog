---
slug: "/cloud-native/kubernettes-kind-mock-ai-test-cluster"
title: "使用Kubernetes Kind模拟AI算力测试集群"
hide_title: true
keywords:
  [
    "Kubernetes", "Kind", "Volcano", "AI算力", "资源调度", "测试集群", "Docker", "k8s", "云原生", "高性能计算"
  ]
description: "本文详细介绍了如何使用Kind工具快速搭建模拟AI算力场景的Kubernetes本地测试集群，并安装Volcano调度器进行资源管理。适用于需要在本地环境中测试AI训练任务调度和资源抢占机制的开发者。"
---

在开发和测试`AI`应用时，我们常需要一个能模拟生产环境的本地`Kubernetes`集群。特别是对于`AI`训练任务，需要测试不同类型的`GPU`资源调度和抢占机制。`Kind`（`Kubernetes IN Docker`）是一个使用`Docker`容器作为节点运行`Kubernetes`集群的工具，非常适合在本地快速搭建测试环境。结合`Volcano`调度器，我们可以实现对`AI`训练任务的高级调度和资源管理。

> 本文使用`Kind v0.27.0`、`Volcano v1.11.2`、`Kubernetes v1.32.2`版本。
> 基于`MacOS 15.3.2`，`apple m4`芯片。

## 创建测试集群

首先，我们需要创建一个具有多个节点的`Kubernetes`集群，其中包含一个控制平面节点和多个模拟`GPU`的工作节点。

### 创建 Kind 配置文件
```yaml title="kind-config.yaml"
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: ai-cluster
nodes:
  # 控制平面节点
  - role: control-plane
  
  # GPU工作节点1 - 模拟NVIDIA A100 GPU节点
  - role: worker
    labels:
      gpu-type: nvidia-a100
  
  # GPU工作节点2 - 模拟NVIDIA V100 GPU节点
  - role: worker
    labels:
      gpu-type: nvidia-v100
  
  # GPU工作节点3 - 模拟NVIDIA T4 GPU节点
  - role: worker
    labels:
      gpu-type: nvidia-t4
```

### 执行集群创建

执行以下命令：

```bash
kind create cluster --config kind-config.yaml
```

执行后输出：

```text
% kind create cluster --config kind.yaml
Creating cluster "ai-cluster" ...
 ✓ Ensuring node image (kindest/node:v1.32.2) 🖼 
 ✓ Preparing nodes 📦 📦 📦 📦  
 ✓ Writing configuration 📜 
 ✓ Starting control-plane 🕹️ 
 ✓ Installing CNI 🔌 
 ✓ Installing StorageClass 💾 
 ✓ Joining worker nodes 🚜 
Set kubectl context to "kind-ai-cluster"
You can now use your cluster with:

kubectl cluster-info --context kind-ai-cluster
```


## 安装 Volcano

集群创建成功后，我们需要安装`Volcano`调度器。`Volcano`是一个为高性能计算和AI/ML工作负载优化的`Kubernetes`原生批处理系统，提供了丰富的调度策略和资源管理功能。我们将使用`Helm`来安装`Volcano`：

参考官方文档：https://volcano.sh/en/docs/v1-11-0/installation/

```bash
# 添加Volcano Helm仓库
helm repo add volcano-sh https://volcano-sh.github.io/helm-charts

# 更新仓库
helm repo update

# 安装Volcano
helm install volcano volcano-sh/volcano -n volcano-system --create-namespace

# 查看安装结果
kubectl get all -n volcano-system
```

最终输出结果：

```text
% kubectl get all -n volcano-system
NAME                                       READY   STATUS    RESTARTS   AGE
pod/volcano-admission-784ff9c4f-vx6sp      1/1     Running   0          3m48s
pod/volcano-controllers-555c955d58-69j4k   1/1     Running   0          3m48s
pod/volcano-scheduler-9b977dd77-hdqjz      1/1     Running   0          3m48s

NAME                                  TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)    AGE
service/volcano-admission-service     ClusterIP   10.96.62.159   <none>        443/TCP    3m48s
service/volcano-controllers-service   ClusterIP   10.96.243.25   <none>        8081/TCP   3m48s
service/volcano-scheduler-service     ClusterIP   10.96.34.86    <none>        8080/TCP   3m48s

NAME                                  READY   UP-TO-DATE   AVAILABLE   AGE
deployment.apps/volcano-admission     1/1     1            1           3m48s
deployment.apps/volcano-controllers   1/1     1            1           3m48s
deployment.apps/volcano-scheduler     1/1     1            1           3m48s

NAME                                             DESIRED   CURRENT   READY   AGE
replicaset.apps/volcano-admission-784ff9c4f      1         1         1       3m48s
replicaset.apps/volcano-controllers-555c955d58   1         1         1       3m48s
replicaset.apps/volcano-scheduler-9b977dd77      1         1         1       3m48s
```


### 常见问题解决

#### 本地VPN环境变量代理引起Kind拉取镜像失败

如果本地有启用`VPN`的环境变量代理，比如使用了：
```bash
export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890
```

那么在创建`Pod`的时候会报错：`proxyconnect tcp: dial tcp 127.0.0.1:7890: connect: connection refused`

```text
% kubectl get pod -A
NAMESPACE            NAME                                               READY   STATUS         RESTARTS   AGE
kube-system          coredns-668d6bf9bc-4s2tl                           1/1     Running        0          2m1s
kube-system          coredns-668d6bf9bc-gl4c6                           1/1     Running        0          2m1s
kube-system          etcd-ai-cluster-control-plane                      1/1     Running        0          2m8s
kube-system          kindnet-7m28t                                      1/1     Running        0          2m
kube-system          kindnet-d6fjg                                      1/1     Running        0          2m
kube-system          kindnet-f597l                                      1/1     Running        0          2m1s
kube-system          kindnet-lmrjr                                      1/1     Running        0          2m
kube-system          kube-apiserver-ai-cluster-control-plane            1/1     Running        0          2m8s
kube-system          kube-controller-manager-ai-cluster-control-plane   1/1     Running        0          2m7s
kube-system          kube-proxy-746fp                                   1/1     Running        0          2m
kube-system          kube-proxy-fxqj9                                   1/1     Running        0          2m
kube-system          kube-proxy-m5j7t                                   1/1     Running        0          2m
kube-system          kube-proxy-xl887                                   1/1     Running        0          2m1s
kube-system          kube-scheduler-ai-cluster-control-plane            1/1     Running        0          2m8s
local-path-storage   local-path-provisioner-7dc846544d-h9kxl            1/1     Running        0          2m1s
volcano-system       volcano-admission-init-lj7t6                       0/1     ErrImagePull   0          96s

% kubectl describe pod -n volcano-system volcano-admission-init-lj7t6

...

Events:
  Type     Reason     Age                   From               Message
  ----     ------     ----                  ----               -------
  Normal   Scheduled  2m52s                 default-scheduler  Successfully assigned volcano-system/volcano-admission-init-lj7t6 to ai-cluster-worker3
  Normal   BackOff    16s (x10 over 2m51s)  kubelet            Back-off pulling image "docker.io/volcanosh/vc-webhook-manager:v1.11.2"
  Warning  Failed     16s (x10 over 2m51s)  kubelet            Error: ImagePullBackOff
  Normal   Pulling    3s (x5 over 2m51s)    kubelet            Pulling image "docker.io/volcanosh/vc-webhook-manager:v1.11.2"
  Warning  Failed     3s (x5 over 2m51s)    kubelet            Failed to pull image "docker.io/volcanosh/vc-webhook-manager:v1.11.2": failed to pull and unpack image "docker.io/volcanosh/vc-webhook-manager:v1.11.2": failed to resolve reference "docker.io/volcanosh/vc-webhook-manager:v1.11.2": failed to do request: Head "https://registry-1.docker.io/v2/volcanosh/vc-webhook-manager/manifests/v1.11.2": proxyconnect tcp: dial tcp 127.0.0.1:7890: connect: connection refused
  Warning  Failed     3s (x5 over 2m51s)    kubelet            Error: ErrImagePull
```

这是因为在创建`Kind`集群的时候会将当前的环境变量全部复制到集群中，特别是拉取镜像时。解决这个方法是新开不带代理环境变量的终端，删除集群后再新建集群。

## 模拟NFD&GFD标签

`Volcano`安装完成后，我们需要模拟节点特征发现（`Node Feature Discovery`，`NFD`）和GPU特征发现（`GPU Feature Discovery`，`GFD`）的标签。在真实集群中，这些标签会由`NFD`和`GFD`自动发现并添加到节点上，但在我们的模拟环境中，需要手动添加这些标签。这些标签将用于让调度器识别不同节点的硬件特性，便于进行精准调度：

关于`NFD&GFD`的介绍请参考我另一篇文章：[NFD&GFD技术介绍](../4000-AI技术/2000-NFD&GFD技术介绍.md)

### 模拟标签脚本

```shell title="kind-label.sh"
#!/bin/sh

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}开始为Kind集群节点添加NFD和GFD标签...${NC}"

# 确保脚本有执行权限
chmod +x "$0"

# 检查kubectl是否可用
if ! command -v kubectl &> /dev/null; then
    echo "错误: kubectl命令未找到，请确保已安装kubectl并配置正确"
    exit 1
fi

# 检查集群连接
if ! kubectl cluster-info &> /dev/null; then
    echo "错误: 无法连接到Kubernetes集群，请确保集群已启动"
    exit 1
fi

# 等待所有节点就绪
echo "等待所有节点就绪..."
kubectl wait --for=condition=Ready nodes --all --timeout=300s

# 获取工作节点列表
WORKER_NODES=($(kubectl get nodes --no-headers | grep -v control-plane | awk '{print $1}'))

if [ ${#WORKER_NODES[@]} -ne 3 ]; then
    echo "警告: 预期有3个工作节点，但实际找到 ${#WORKER_NODES[@]} 个"
fi

echo "${YELLOW}找到以下工作节点:${NC}"
for node in "${WORKER_NODES[@]}"; do
    echo " - $node"
done

# 为每个节点添加标签
# 如果没有足够的工作节点，则退出
if [ ${#WORKER_NODES[@]} -lt 3 ]; then
    echo "${YELLOW}错误: 需要至少3个工作节点，但只找到 ${#WORKER_NODES[@]} 个${NC}"
    exit 1
fi

# 节点1: 模拟A100 GPU节点
echo "${GREEN}为节点 ${WORKER_NODES[0]} 添加NFD和GFD标签 (A100 GPU)...${NC}"

# NFD标签 - CPU相关
kubectl label node ${WORKER_NODES[0]} \
    feature.node.kubernetes.io/cpu-model.vendor_id=GenuineIntel \
    feature.node.kubernetes.io/cpu-model.family=6 \
    feature.node.kubernetes.io/cpu-model.id=85 \
    feature.node.kubernetes.io/cpu-cpuid.AVX=true \
    feature.node.kubernetes.io/cpu-cpuid.AVX2=true \
    feature.node.kubernetes.io/cpu-cpuid.AVX512F=true \
    feature.node.kubernetes.io/cpu-cpuid.AMXBF16=true \
    feature.node.kubernetes.io/cpu-cpuid.AMXINT8=true \
    feature.node.kubernetes.io/cpu-hardware_multithreading=true \
    feature.node.kubernetes.io/cpu-pstate.status=active \
    feature.node.kubernetes.io/cpu-pstate.turbo=true \
    feature.node.kubernetes.io/cpu-pstate.scaling_governor=performance \
    feature.node.kubernetes.io/cpu-cstate.enabled=true \
    --overwrite

# NFD标签 - 内核相关
kubectl label node ${WORKER_NODES[0]} \
    feature.node.kubernetes.io/kernel-version.full=5.15.0-76-generic \
    feature.node.kubernetes.io/kernel-version.major=5 \
    feature.node.kubernetes.io/kernel-version.minor=15 \
    feature.node.kubernetes.io/kernel-version.revision=0 \
    --overwrite

# NFD标签 - 内存相关
kubectl label node ${WORKER_NODES[0]} \
    feature.node.kubernetes.io/memory-numa=true \
    feature.node.kubernetes.io/memory-nv.present=true \
    --overwrite

# NFD标签 - PCI设备相关 (NVIDIA GPU)
kubectl label node ${WORKER_NODES[0]} \
    feature.node.kubernetes.io/pci-10de.present=true \
    feature.node.kubernetes.io/pci-10de.device-10de.model-name=NVIDIA_A100-SXM4-80GB \
    --overwrite

# GFD标签 - NVIDIA GPU相关
kubectl label node ${WORKER_NODES[0]} \
    nvidia.com/gpu.present=true \
    nvidia.com/gpu.count=8 \
    nvidia.com/gpu.product=A100-SXM4-80GB \
    nvidia.com/gpu.family=ampere \
    nvidia.com/gpu.compute.major=8 \
    nvidia.com/gpu.compute.minor=0 \
    nvidia.com/gpu.machine=NVIDIA_A100-SXM4-80GB \
    nvidia.com/gpu.memory=81920 \
    nvidia.com/gpu.clock=1410 \
    nvidia.com/gpu.driver.major=535 \
    nvidia.com/gpu.driver.minor=104 \
    nvidia.com/gpu.driver.rev=05 \
    nvidia.com/gpu.cuda.major=12 \
    nvidia.com/gpu.cuda.minor=2 \
    nvidia.com/gpu.cuda.patch=0 \
    nvidia.com/mig.capable=true \
    nvidia.com/mps.capable=true \
    nvidia.com/gpu.multiprocessors=108 \
    nvidia.com/gpu.slices.ci=1 \
    nvidia.com/gpu.slices.gi=1 \
    nvidia.com/gpu.slices.mem=1 \
    nvidia.com/gpu.max-instances=7 \
    nvidia.com/gpu.virtualization=false \
    --overwrite

# 节点2: 模拟V100 GPU节点
echo "${GREEN}为节点 ${WORKER_NODES[1]} 添加NFD和GFD标签 (V100 GPU)...${NC}"

# NFD标签 - CPU相关
kubectl label node ${WORKER_NODES[1]} \
    feature.node.kubernetes.io/cpu-model.vendor_id=GenuineIntel \
    feature.node.kubernetes.io/cpu-model.family=6 \
    feature.node.kubernetes.io/cpu-model.id=85 \
    feature.node.kubernetes.io/cpu-cpuid.AVX=true \
    feature.node.kubernetes.io/cpu-cpuid.AVX2=true \
    feature.node.kubernetes.io/cpu-cpuid.AVX512F=true \
    feature.node.kubernetes.io/cpu-hardware_multithreading=true \
    feature.node.kubernetes.io/cpu-pstate.status=active \
    feature.node.kubernetes.io/cpu-pstate.turbo=true \
    feature.node.kubernetes.io/cpu-pstate.scaling_governor=performance \
    feature.node.kubernetes.io/cpu-cstate.enabled=true \
    --overwrite

# NFD标签 - 内核相关
kubectl label node ${WORKER_NODES[1]} \
    feature.node.kubernetes.io/kernel-version.full=5.15.0-76-generic \
    feature.node.kubernetes.io/kernel-version.major=5 \
    feature.node.kubernetes.io/kernel-version.minor=15 \
    feature.node.kubernetes.io/kernel-version.revision=0 \
    --overwrite

# NFD标签 - 内存相关
kubectl label node ${WORKER_NODES[1]} \
    feature.node.kubernetes.io/memory-numa=true \
    --overwrite

# NFD标签 - PCI设备相关 (NVIDIA GPU)
kubectl label node ${WORKER_NODES[1]} \
    feature.node.kubernetes.io/pci-10de.present=true \
    feature.node.kubernetes.io/pci-10de.device-10de.model-name=NVIDIA_V100-SXM2-32GB \
    --overwrite

# GFD标签 - NVIDIA GPU相关
kubectl label node ${WORKER_NODES[1]} \
    nvidia.com/gpu.present=true \
    nvidia.com/gpu.count=4 \
    nvidia.com/gpu.product=V100-SXM2-32GB \
    nvidia.com/gpu.family=volta \
    nvidia.com/gpu.compute.major=7 \
    nvidia.com/gpu.compute.minor=0 \
    nvidia.com/gpu.machine=NVIDIA_V100-SXM2-32GB \
    nvidia.com/gpu.memory=32768 \
    nvidia.com/gpu.clock=1530 \
    nvidia.com/gpu.driver.major=535 \
    nvidia.com/gpu.driver.minor=104 \
    nvidia.com/gpu.driver.rev=05 \
    nvidia.com/gpu.cuda.major=12 \
    nvidia.com/gpu.cuda.minor=0 \
    nvidia.com/gpu.cuda.patch=0 \
    nvidia.com/mig.capable=false \
    nvidia.com/mps.capable=true \
    nvidia.com/gpu.multiprocessors=80 \
    nvidia.com/gpu.virtualization=false \
    --overwrite

# 节点3: 模拟T4 GPU节点
echo "${GREEN}为节点 ${WORKER_NODES[2]} 添加NFD和GFD标签 (T4 GPU)...${NC}"

# NFD标签 - CPU相关
kubectl label node ${WORKER_NODES[2]} \
    feature.node.kubernetes.io/cpu-model.vendor_id=GenuineIntel \
    feature.node.kubernetes.io/cpu-model.family=6 \
    feature.node.kubernetes.io/cpu-model.id=85 \
    feature.node.kubernetes.io/cpu-cpuid.AVX=true \
    feature.node.kubernetes.io/cpu-cpuid.AVX2=true \
    feature.node.kubernetes.io/cpu-hardware_multithreading=true \
    feature.node.kubernetes.io/cpu-pstate.status=active \
    feature.node.kubernetes.io/cpu-pstate.turbo=true \
    feature.node.kubernetes.io/cpu-pstate.scaling_governor=performance \
    feature.node.kubernetes.io/cpu-cstate.enabled=true \
    --overwrite

# NFD标签 - 内核相关
kubectl label node ${WORKER_NODES[2]} \
    feature.node.kubernetes.io/kernel-version.full=5.15.0-76-generic \
    feature.node.kubernetes.io/kernel-version.major=5 \
    feature.node.kubernetes.io/kernel-version.minor=15 \
    feature.node.kubernetes.io/kernel-version.revision=0 \
    --overwrite

# NFD标签 - 内存相关
kubectl label node ${WORKER_NODES[2]} \
    feature.node.kubernetes.io/memory-numa=false \
    --overwrite

# NFD标签 - PCI设备相关 (NVIDIA GPU)
kubectl label node ${WORKER_NODES[2]} \
    feature.node.kubernetes.io/pci-10de.present=true \
    feature.node.kubernetes.io/pci-10de.device-10de.model-name=NVIDIA_T4 \
    --overwrite

# GFD标签 - NVIDIA GPU相关
kubectl label node ${WORKER_NODES[2]} \
    nvidia.com/gpu.present=true \
    nvidia.com/gpu.count=2 \
    nvidia.com/gpu.product=T4 \
    nvidia.com/gpu.family=turing \
    nvidia.com/gpu.compute.major=7 \
    nvidia.com/gpu.compute.minor=5 \
    nvidia.com/gpu.machine=NVIDIA_T4 \
    nvidia.com/gpu.memory=16384 \
    nvidia.com/gpu.clock=1590 \
    nvidia.com/gpu.driver.major=535 \
    nvidia.com/gpu.driver.minor=104 \
    nvidia.com/gpu.driver.rev=05 \
    nvidia.com/gpu.cuda.major=11 \
    nvidia.com/gpu.cuda.minor=8 \
    nvidia.com/gpu.cuda.patch=0 \
    nvidia.com/mig.capable=false \
    nvidia.com/mps.capable=true \
    nvidia.com/gpu.multiprocessors=40 \
    nvidia.com/gpu.virtualization=false \
    --overwrite

echo "${GREEN}所有节点标签添加完成!${NC}"
echo "${YELLOW}验证节点标签:${NC}"

# 验证标签
for node in "${WORKER_NODES[@]}"; do
    echo "${GREEN}节点 $node 的NFD标签:${NC}"
    kubectl get node $node -o json | jq -r '.metadata.labels | with_entries(select(.key | startswith("feature.node.kubernetes.io"))) | to_entries | .[] | "\(.key)=\(.value)"'
    
    echo "${GREEN}节点 $node 的GFD标签:${NC}"
    kubectl get node $node -o json | jq -r '.metadata.labels | with_entries(select(.key | startswith("nvidia.com"))) | to_entries | .[] | "\(.key)=\(.value)"'
    
    echo ""
done

echo "${GREEN}脚本执行完成!${NC}"
```


### 执行标签脚本

```bash
./kind-label.sh
```

### 验证执行结果

```bash
kubectl describe node ai-cluster-worker
```

![alt text](<assets/4000-使用Kubernetes Kind搭建AI算力测试集群/image.png>)

## 模拟GPU资源类型

添加节点标签后，我们还需要模拟节点上的GPU资源。在真实集群中，GPU资源会由NVIDIA设备插件自动注册，但在我们的模拟环境中，需要手动添加这些资源。我们将为不同节点添加不同数量和类型的GPU资源：

为节点模拟GPU资源类型，这里模拟的是`NVIDIA`的卡，因此需要加上`nvidia.com/gpu`的资源。

### 模拟GPU资源脚本
```shell title="add-gpu-resources.sh"
#!/bin/sh

# 设置颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "${GREEN}开始为Kind集群节点添加模拟GPU资源...${NC}"

# 获取工作节点列表
WORKER_NODES=($(kubectl get nodes --no-headers | grep -v control-plane | awk '{print $1}'))

if [ ${#WORKER_NODES[@]} -lt 3 ]; then
    echo "${YELLOW}警告: 预期有3个工作节点，但实际找到 ${#WORKER_NODES[@]} 个${NC}"
fi

echo "${YELLOW}找到以下工作节点:${NC}"
for node in "${WORKER_NODES[@]}"; do
    echo " - $node"
done

# 使用kubectl patch命令直接修改节点资源

# 为第一个节点添加8个A100 GPU
echo "${GREEN}为节点 ${WORKER_NODES[0]} 添加8个模拟A100 GPU...${NC}"

# 使用kubectl patch命令修改节点资源
kubectl get node ${WORKER_NODES[0]} -o json | jq '.status.capacity["nvidia.com/gpu"]="8" | .status.allocatable["nvidia.com/gpu"]="8"' | kubectl replace --raw /api/v1/nodes/${WORKER_NODES[0]}/status -f -

# 为第二个节点添加4个V100 GPU
echo "${GREEN}为节点 ${WORKER_NODES[1]} 添加4个模拟V100 GPU...${NC}"
kubectl get node ${WORKER_NODES[1]} -o json | jq '.status.capacity["nvidia.com/gpu"]="4" | .status.allocatable["nvidia.com/gpu"]="4"' | kubectl replace --raw /api/v1/nodes/${WORKER_NODES[1]}/status -f -

# 为第三个节点添加2个T4 GPU
echo "${GREEN}为节点 ${WORKER_NODES[2]} 添加2个模拟T4 GPU...${NC}"
kubectl get node ${WORKER_NODES[2]} -o json | jq '.status.capacity["nvidia.com/gpu"]="2" | .status.allocatable["nvidia.com/gpu"]="2"' | kubectl replace --raw /api/v1/nodes/${WORKER_NODES[2]}/status -f -

# 验证GPU资源是否添加成功
echo "${GREEN}验证节点GPU资源:${NC}"
kubectl get nodes -o=custom-columns=NAME:.metadata.name,GPU:.status.capacity.\'nvidia\.com/gpu\'

echo "${GREEN}模拟GPU资源添加完成!${NC}"
```


### 执行GPU资源脚本

```bash
./add-gpu-resources.sh
```

### 验证GPU资源结果

```bash
kubectl describe node ai-cluster-worker
```

![alt text](<assets/4000-使用Kubernetes Kind搭建AI算力测试集群/image-1.png>)


## 创建测试队列

现在我们的集群已经有了模拟的`GPU`资源和节点标签，接下来需要创建测试队列。在`Volcano`中，`队列`（`Queue`）是资源管理的重要概念，用于实现多租户资源隔离和优先级管理。我们将创建不同优先级和资源配额的队列：

### 测试队列YAML

```yaml title="test-queue.yaml"
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: default
spec:
  weight: 1
  reclaimable: false
---
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: high-priority
spec:
  weight: 10
  capability:
    cpu: 100
    memory: 100Gi
    nvidia.com/gpu: 8
  reclaimable: true
---
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: ai-training
spec:
  weight: 5
  capability:
    cpu: 50
    memory: 50Gi
    nvidia.com/gpu: 4
  reclaimable: true
```

### 创建测试队列

```bash
% kubectl apply -f test-queue.yaml
```

### 查看创建队列

```bash
% kubectl get queue
NAME            AGE
ai-training     11s
default         4m9s
high-priority   11s
root            4m9s
```

## 创建测试任务

队列创建完成后，我们可以创建测试任务来验证我们的设置。我们将创建一个请求`GPU`资源的`Volcano Job`，并指定其运行在我们创建的高优先级队列中。这个任务将使用节点选择器来选择有`NVIDIA GPU`的节点：

### 测试任务YAML

```yaml title="test-job.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: gpu-test-job
spec:
  minAvailable: 1
  schedulerName: volcano
  queue: high-priority
  policies:
    - event: PodEvicted
      action: RestartJob
  maxRetry: 1
  tasks:
    - replicas: 1
      name: gpu-test
      template:
        spec:
          containers:
            - name: gpu-test-container
              image: alpine:latest
              command:
                - sh
                - -c
                - "nvidia-smi || echo 'No GPU found, but scheduled to GPU node' && sleep 300"
              resources:
                limits:
                  cpu: 1
                  memory: 1Gi
                  nvidia.com/gpu: 1
                requests:
                  cpu: 500m
                  memory: 512Mi
                  nvidia.com/gpu: 1
          restartPolicy: Never
          nodeSelector:
            feature.node.kubernetes.io/pci-10de.present: "true"  # 选择有NVIDIA GPU的节点
```

### 创建测试任务

```bash
% kubectl apply -f test-job.yaml
```

### 查看测试任务

```bash
% k get vcjob -A
NAMESPACE   NAME           STATUS    MINAVAILABLE   RUNNINGS   AGE
default     gpu-test-job   Running   1              1          47s
```
