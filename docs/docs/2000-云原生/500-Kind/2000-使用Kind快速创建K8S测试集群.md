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


