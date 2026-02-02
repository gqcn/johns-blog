---
slug: "/cloud-native/kubernetes-kind-quick-usage"
title: "使用Kind快速创建K8S测试集群"
hide_title: true
keywords:
  - Kind
  - Kubernetes
  - K8S
  - 测试集群
  - Docker
  - 本地开发
  - 集群部署
  - kubectl
description: "本文介绍如何使用Kind（Kubernetes in Docker）快速创建一个包含1个控制平面节点和4个工作节点的本地K8S测试集群，包括集群配置、创建、验证和删除的完整步骤。"
---

> 该文章的内容，其实主要是笔者自用做的笔记。

## Kind配置

以下脚本快速创建一个包含`1`个控制平面节点和`4`个工作节点的`Kind`集群：[kind-cluster.yaml](./assets/2000-使用Kind快速创建K8S测试集群/kind-cluster.yaml)

> 这里使用的是`v1.27.3`版本的`K8S`，更多`K8S`版本请查看：https://hub.docker.com/r/kindest/node/tags

```yaml title="kind-cluster.yaml"
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
name: kind-cluster
nodes:
  # 控制平面节点
  - role: control-plane
    image: kindest/node:v1.27.3
  
  # Worker节点
  - role: worker
    image: kindest/node:v1.27.3
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node0

  - role: worker
    image: kindest/node:v1.27.3
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node1

  - role: worker
    image: kindest/node:v1.27.3
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node2

  - role: worker
    image: kindest/node:v1.27.3
    kubeadmConfigPatches:
    - |
      kind: JoinConfiguration
      nodeRegistration:
        name: node3
```

保存为 `kind-config.yaml`。


## 集群创建与查看

### 创建集群
运行以下命令创建集群：

```bash
kind create cluster --config kind-cluster.yaml
```

### 列出集群
等待`2-5`分钟：

```bash
kind get clusters
```

预期输出：

```bash
kind-cluster
```

### 验证节点

```bash
kubectl get nodes
```

预期输出：

```bash
NAME                         STATUS   ROLES           AGE   VERSION
kind-cluster-control-plane   Ready    control-plane   42s   v1.27.3
node0                        Ready    <none>          20s   v1.27.3
node1                        Ready    <none>          20s   v1.27.3
node2                        Ready    <none>          20s   v1.27.3
node3                        Ready    <none>          20s   v1.27.3
```

## 删除集群


```bash
kind delete clusters kind-cluster
```

## 其他常见操作

### 加载本地Docker镜像到Kind集群

由于`Kind`集群运行在`Docker`容器内，它不会自动访问你本地`Docker`守护进程中的镜像。你需要使用以下命令将本地镜像加载到`Kind`集群中：
```bash
kind load docker-image --name kind-cluster my-custom-image:tag
```

### 安装Volcano调度器

由于笔者主要使用`Volcano`作为集群的任务调度器，因此需要安装`Volcano`调度器：

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
