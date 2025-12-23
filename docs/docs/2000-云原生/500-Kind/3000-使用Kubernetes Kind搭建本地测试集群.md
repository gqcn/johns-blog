---
slug: "/cloud-native/kubernetes-kind"
title: "使用Kubernetes Kind搭建本地测试集群"
hide_title: true
keywords:
  [
    "Kubernetes", "Kind", "本地集群", "测试环境", "Docker", "容器", "k8s", "minikube", "云原生", "开发环境"
  ]
description: "本文详细介绍了如何使用Kind工具快速搭建Kubernetes本地测试集群，包括Kind的安装配置、基本使用方法以及常见问题解决方案，帮助开发者在本地高效进行Kubernetes应用开发和测试。"
---

## Kind简介

![使用Kubernetes Kind搭建本地测试集群](<assets/3000-使用Kubernetes Kind搭建本地测试集群/image.png>)

`Kind` (`Kubernetes IN Docker`) 是一个使用`Docker`容器作为节点来运行本地`Kubernetes`集群的工具。它主要用于`Kubernetes`自身的测试，但也是在本地快速创建和测试`Kubernetes`集群的绝佳选择。`Kind`是`CNCF`（`Cloud Native Computing Foundation`）的一个认证项目，由`Kubernetes SIG (Special Interest Group) Testing`团队开发和维护。

相关链接：
- 仓库地址：https://github.com/kubernetes-sigs/kind
- 官网地址：https://kind.sigs.k8s.io/

### Kind的主要特点

- **轻量级**：相比于传统的虚拟机方案，`Kind`使用`Docker`容器作为`Kubernetes`节点，资源消耗更少，启动更快。
- **多节点支持**：可以轻松创建包含多个控制平面和工作节点的集群。
- **跨平台**：支持`Linux`、`macOS`和`Windows`。
- **可配置性**：提供丰富的配置选项，可以根据需要定制集群。
- **快速**：集群创建和销毁速度快，非常适合`CI/CD`环境。
- **接近生产环境**：提供了与生产环境更相似的多节点`Kubernetes`体验。

## Kind与Minikube的对比

在选择本地`Kubernetes`测试工具时，`Kind`和`Minikube`是两个常见的选择。下面是它们的主要区别：

| 特性 | `Kind` | `Minikube` |
|------|------|----------|
| 底层技术 | 使用`Docker`容器作为`Kubernetes`节点 | 使用虚拟机（如`VirtualBox`、`HyperKit`）或容器 |
| 资源消耗 | 较低，适合资源受限的环境 | 较高，特别是使用虚拟机时 |
| 多节点支持 | 原生支持多节点集群 | 主要设计为单节点，虽然也支持多节点 |
| 启动速度 | 非常快 | 相对较慢，特别是使用虚拟机时 |
| 附加功能 | 专注于提供纯`Kubernetes`环境 | 内置更多插件和附加功能 |
| 用途 | 适合开发测试和`CI/CD`环境 | 适合学习和本地开发 |
| 成熟度 | 相对较新，但发展迅速 | 更成熟，存在时间更长 |

### 何时选择Kind

- 当你需要快速创建和销毁集群时
- 当你需要在`CI/CD`管道中测试`Kubernetes`应用时
- 当你需要测试多节点场景时
- 当你的计算机资源有限时
- 当你需要测试`Kubernetes`自身的功能时

### 何时选择Minikube

- 当你是`Kubernetes`初学者，需要更多指导和内置功能时
- 当你需要更接近生产环境的虚拟机隔离时
- 当你需要使用`Minikube`特有的插件和附加功能时

## Kind的安装和配置

### 前提条件

在安装`Kind`之前，你需要确保已经安装了以下软件：

- `Docker`：`Kind`依赖`Docker`来创建容器节点
- `Kubernetes`命令行工具（`kubectl`）：用于与`Kubernetes`集群交互

### 安装Kind

#### macOS安装

使用`Homebrew`安装：

```bash
brew install kind
```

或者使用二进制文件安装：

```bash
# 下载最新版本的Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.27.0/kind-darwin-amd64
# 使文件可执行
chmod +x ./kind
# 移动到PATH路径下
mv ./kind /usr/local/bin/kind
```

#### Linux安装

使用二进制文件安装：

```bash
# 下载最新版本的Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.27.0/kind-linux-amd64
# 使文件可执行
chmod +x ./kind
# 移动到PATH路径下
sudo mv ./kind /usr/local/bin/kind
```

#### Windows安装

使用`Chocolatey`安装：

```powershell
choco install kind
```

或者使用二进制文件安装（在`PowerShell`中）：

```powershell
curl.exe -Lo kind-windows-amd64.exe https://kind.sigs.k8s.io/dl/v0.27.0/kind-windows-amd64
move kind-windows-amd64.exe C:\some-dir-in-your-PATH\kind.exe
```

### 验证安装

安装完成后，运行以下命令验证`Kind`是否安装成功：

```bash
kind version
```

如果安装成功，将显示`Kind`的版本信息。

## Kind的基本使用

### 创建集群

创建一个默认的单节点集群非常简单：

```bash
kind create cluster
```

这个命令会创建一个名为`kind`的默认集群。

如果你想指定集群名称，可以使用`--name`参数：

```bash
kind create cluster --name my-cluster
```

### 使用配置文件创建自定义集群

`Kind`支持使用`YAML`配置文件创建自定义集群。例如，创建一个包含`1`个控制平面节点和`2`个工作节点的集群：

```yaml title="kind-config.yaml"
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
- role: worker
```

然后使用这个配置文件创建集群：

```bash
kind create cluster --config kind-config.yaml
```

### 查看集群

创建集群后，可以使用以下命令查看集群信息：

```bash
# 列出所有Kind集群
kind get clusters

# 查看集群节点
docker ps
```

### 配置kubectl访问集群

`Kind`会自动配置`kubectl`以访问新创建的集群。你可以使用以下命令验证连接：

```bash
kubectl cluster-info
```

如果你有多个集群，可以使用以下命令切换到特定的Kind集群：

```bash
kubectl cluster-info --context kind-my-cluster
```

### 加载本地Docker镜像到Kind集群

由于`Kind`集群运行在`Docker`容器内，它不会自动访问你本地`Docker`守护进程中的镜像。你需要使用以下命令将本地镜像加载到`Kind`集群中：

```bash
kind load docker-image my-custom-image:tag --name my-cluster
```

### 删除集群

当你不再需要集群时，可以使用以下命令删除它：

```bash
kind delete cluster --name my-cluster
```

如果不指定名称，将删除默认的`kind`集群：

```bash
kind delete cluster
```

## 高级配置示例

### 配置端口映射

如果你想从主机直接访问集群中的服务，可以配置端口映射：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraPortMappings:
  - containerPort: 30000
    hostPort: 30000
    protocol: TCP
```

### 配置生成的APIServer访问地址

默认情况下，`Kind`会自动配置`kubeconfig`，其中`APIServer`地址为`127.0.0.1:端口号`。
我们可以通过以下配置方式指定`APIServer`的访问地址：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  apiServerAddress: "10.112.2.150" 
```


自动生成的`kubeconfig`中访问的`APIServer`地址则为`10.112.2.150:端口号`，这样该`kubeconfig`文件我们可以分发给统一网段的其他机器访问使用。


### 挂载主机目录

将主机目录挂载到`Kind`节点：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  extraMounts:
  - hostPath: /path/on/host
    containerPath: /path/in/node
```

### 配置集群网络

自定义`Pod`和`Service`的`CIDR`：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  podSubnet: "10.244.0.0/16"
  serviceSubnet: "10.96.0.0/12"
```




## 常见问题及解决方案

### 镜像拉取失败

在国内环境中，由于网络原因，可能会遇到镜像拉取失败的问题。解决方案是配置国内镜像源。

#### 配置Docker国内镜像源

编辑或创建`/etc/docker/daemon.json`文件：

```json
{
  "registry-mirrors": [
    "https://registry.docker-cn.com",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
```

然后重启Docker服务：

```bash
sudo systemctl restart docker
```

#### 使用自定义镜像

你也可以在`Kind`配置文件中指定使用自定义的节点镜像：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  image: registry.cn-hangzhou.aliyuncs.com/google_containers/kindest-node:v1.25.3
```

### 资源不足

`Kind`运行多节点集群可能会消耗大量资源。如果遇到资源不足的问题，可以：

- 减少节点数量
- 增加`Docker`的资源限制（在`Docker Desktop`的设置中）
- 使用更小的单节点集群

### 网络问题

如果遇到网络连接问题，可以尝试：

- 检查防火墙设置
- 确保`Docker`网络正常工作
- 重新创建集群

```bash
kind delete cluster
kind create cluster
```

### 集群创建失败

如果集群创建失败，可以查看详细日志：

```bash
kind create cluster --name my-cluster --verbosity 9
```

### kubectl无法连接到集群

如果`kubectl`无法连接到`Kind`集群，可以尝试：

```bash
# 检查集群状态
kind get clusters

# 导出kubeconfig
kind export kubeconfig --name my-cluster

# 验证连接
kubectl cluster-info
```

## 实用技巧

### 自定义创建节点名称

使用`kubeadmConfigPatches`配置实现，参考以下示例：

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  image: kindest/node:v1.27.3

- role: worker
  image: kindest/node:v1.27.3
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      name: cpu-node

- role: worker
  image: kindest/node:v1.27.3
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      name: gpu-node-h200

- role: worker
  image: kindest/node:v1.27.3
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      name: gpu-node-4090

- role: worker
  image: kindest/node:v1.27.3
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      name: gpu-node-h800

- role: worker
  image: kindest/node:v1.27.3
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      name: gpu-node-h800-mps
  
- role: worker
  image: kindest/node:v1.27.3
  kubeadmConfigPatches:
  - |
    kind: JoinConfiguration
    nodeRegistration:
      name: gpu-node-h20-mig
```
集群创建后，查看节点列表形如：
```bash
$ kubectl get node
NAME                             STATUS   ROLES           AGE   VERSION
cpu-node                         Ready    <none>          17d   v1.27.3
gpu-node-4090                    Ready    <none>          17d   v1.27.3
gpu-node-h200                    Ready    <none>          17d   v1.27.3
gpu-node-h200-mig                Ready    <none>          17d   v1.27.3
gpu-node-h800                    Ready    <none>          17d   v1.27.3
gpu-node-h800-mps                Ready    <none>          17d   v1.27.3
mock-cluster-127-control-plane   Ready    control-plane   17d   v1.27.3
```