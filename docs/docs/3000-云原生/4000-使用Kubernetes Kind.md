---
slug: "/cloud-native/kubernettes-kind-ai-test-cluster"
title: "使用Kubernetes Kind搭建AI算力测试集群"
hide_title: true
keywords:
  [
    "Kubernetes", "Kind", "AI算力", "测试环境", "Docker", "容器", "k8s", "minikube", "云原生", "开发环境"
  ]
description: "本文详细介绍了如何使用Kind工具快速搭建Kubernetes本地测试集群，包括Kind的安装配置、基本使用方法以及常见问题解决方案，帮助开发者在本地高效进行Kubernetes应用开发和测试。"
---

## 安装 Volcano

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

## 创建测试集群

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

```bash
kind create cluster --config kind-config.yaml
```

## 模拟NFD&GFD标签

关于NFD&GFD的介绍请参考我另一篇文章：[NFD&GFD技术介绍](../4000-AI技术/2000-NFD&GFD技术介绍.md)

### 模拟标签脚本

```shell title="kind-label.sh"
#!/bin/bash

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

## 为节点模拟GPU资源类型

```shell title="add-gpu-resources.sh"
#!/bin/bash

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

## 创建测试队列

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

## 创建测试任务

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
