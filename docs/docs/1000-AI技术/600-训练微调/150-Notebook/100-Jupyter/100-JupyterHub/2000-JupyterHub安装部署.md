---
slug: "/ai/jupyterhub-deployment"
title: "JupyterHub安装部署"
hide_title: true
keywords:
  [
    JupyterHub安装,
    Kubernetes部署,
    Helm安装,
    多用户Jupyter,
    集群部署,
    容器编排,
    持久化存储,
    服务暴露,
    端口转发,
    生产环境部署,
    K8S集群,
    Chart安装
  ]
description: "在Kubernetes集群上使用Helm部署JupyterHub的完整步骤指南，包括前置条件检查、Helm仓库配置、安装流程、部署验证、访问方法和卸载操作，适用于多用户Jupyter环境的生产级部署。"
---



## 前置条件

在开始之前，确保你已经具备以下条件：

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| `Kubernetes` | `>= 1.23` | 需要有可用的`K8S`集群，支持动态存储卷 |
| `Helm` | `>= 3.5` | `Kubernetes`包管理工具 |
| `kubectl` | 与集群版本匹配 | 已配置并可以访问你的`K8S`集群 |
| 集群资源 | 至少`2`个`worker`节点 | 每个节点建议`4GB+`内存，`2C`+`CPU` |
| 存储类(`StorageClass`) | 支持动态供给 | 用于用户数据持久化存储 |
| 镜像仓库 | 可选 | 如需使用自定义镜像，需要可访问的镜像仓库 |

## 部署JupyterHub

### 添加JupyterHub Helm仓库

首先，将`JupyterHub`的`Helm Chart`仓库添加到本地：

```bash
helm repo add jupyterhub https://hub.jupyter.org/helm-chart/
helm repo update
```

### 安装JupyterHub

使用`Helm`拉取`JupyterHub`安装包：

```bash
helm pull jupyterhub/jupyterhub --version=4.3.2 --untar
```

使用以下指令安装`JupyterHub`：

```bash
helm install jupyterhub ./jupyterhub -n jupyterhub-system --create-namespace
```

### 验证部署

查看`Pod`状态：

```bash
kubectl get pod --namespace jupyterhub-system
```

等待所有`Pod`进入`Running`状态：

```text
NAME                              READY   STATUS    RESTARTS   AGE
continuous-image-puller-7f49d     1/1     Running   0          1m
continuous-image-puller-7j4jg     1/1     Running   0          1m
continuous-image-puller-hrj2c     1/1     Running   0          1m
continuous-image-puller-qkgb6     1/1     Running   0          1m
hub-5c5d9f7678-vkjpc              1/1     Running   0          1m
proxy-6496d4dff4-b9fts            1/1     Running   0          1m
user-scheduler-6fcfff9557-k55c6   1/1     Running   0          1m
user-scheduler-6fcfff9557-pgpnx   1/1     Running   0          1m
```

### 访问JupyterHub

通过`kubectl port-forward`获取访问地址：

```bash
kubectl port-forward --namespace=jupyterhub-system service/proxy-public 8080:http
```

在浏览器中访问 http://localhost:8080 地址即可打开`JupyterHub`登录页面。

### 卸载JupyterHub

```bash
helm uninstall jupyterhub -n jupyterhub-system
```

## 参考资料

- https://z2jh.jupyter.org/en/stable/index.html