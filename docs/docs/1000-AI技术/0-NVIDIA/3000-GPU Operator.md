---
slug: "/ai/gpu-operator"
title: "GPU Operator"
hide_title: true
keywords:
  [
    "GPU Operator", "NVIDIA", "Kubernetes", "容器化", "GPU管理", "云原生", 
    "设备插件", "驱动管理", "AI基础设施", "机器学习", "深度学习"
  ]
description: "本文详细介绍NVIDIA GPU Operator的主要作用、组件构成、与GPU DevicePlugin的区别、Kubernetes兼容性以及部署方法，帮助用户在Kubernetes环境中更轻松地管理GPU资源。"
---


## 1. GPU Operator的主要作用

![alt text](<assets/GPU Operator技术介绍/image.png>)

`NVIDIA GPU Operator`是一个基于`Kubernetes Operator`框架开发的解决方案，旨在简化`Kubernetes`集群中`NVIDIA GPU`的管理和使用。在传统的`Kubernetes`环境中，要使用`GPU`资源，管理员需要手动完成多个复杂的配置步骤，包括：

- 在每个`GPU`节点上安装`NVIDIA`驱动程序
- 配置容器运行时以支持`GPU`（如`NVIDIA Container Runtime`）
- 部署`Kubernetes Device Plugin`以暴露`GPU`资源
- 设置`GPU`监控和指标收集工具
- 管理`GPU`资源的版本更新和升级

这些手动配置过程不仅繁琐且容易出错，还难以在大规模集群中保持一致性。`GPU Operator`通过自动化这些过程，解决了以下关键问题：

1. **简化部署流程**：使用标准的`Kubernetes API`自动部署所有必要的`NVIDIA`软件组件
2. **统一管理**：提供一致的方式管理集群中的所有`GPU`节点
3. **自动化版本控制**：简化组件的版本管理和升级流程
4. **降低操作复杂性**：减少手动配置错误，提高系统可靠性
5. **支持异构集群**：能够在同一集群中管理不同型号和配置的`GPU`

通过`GPU Operator`，管理员只需一个命令即可完成所有`GPU`相关组件的部署，大大简化了在`Kubernetes`环境中使用`NVIDIA GPU`的流程。

## 2. GPU Operator与GPU DevicePlugin的区别

理解`GPU Operator`与`GPU DevicePlugin`的区别对于正确选择和使用这些工具至关重要。

### 2.1 GPU DevicePlugin

`GPU DevicePlugin`是`Kubernetes`的一个组件，其主要功能是：

- 向`Kubernetes`暴露`GPU`资源，使其可以被调度系统识别
- 跟踪`GPU`的健康状态和可用性
- 为容器分配`GPU`资源
- 实现`GPU`资源的隔离

然而，`GPU DevicePlugin`仅解决了`GPU`资源暴露和分配的问题，它**假设**所有必要的`GPU`驱动和运行时环境已经正确配置。它不负责安装或管理这些底层组件。

### 2.2 GPU Operator的扩展功能

相比之下，`GPU Operator`提供了更全面的解决方案：

| 功能 | `GPU DevicePlugin` | GPU Operator |
|------|-----------------|------------|
| 暴露`GPU`资源 | ✓ | ✓ (包含`DevicePlugin`) |
| `GPU`驱动安装 | ✗ | ✓ |
| 容器运行时配置 | ✗ | ✓ |
| 自动节点标签 | ✗ | ✓ |
| 监控集成 | ✗ | ✓ |
| 版本管理 | ✗ | ✓ |
| `MIG`支持 | 有限 | 完整支持 |

`GPU Operator`实际上将`GPU DevicePlugin`作为其管理的组件之一，同时负责整个`GPU`软件栈的生命周期管理。可以将两者的关系理解为：`GPU DevicePlugin`是`GPU Operator`管理的众多组件之一。

## 3. GPU Operator的工作流程

`NVIDIA GPU Operator`基于`Kubernetes`的`Operator`框架实现，通过自定义资源定义(`CRD`)和相应的控制器来管理`GPU`组件的生命周期。了解其工作流程有助于理解它如何协调各组件的部署和管理。

### 3.1 Operator状态机

`GPU Operator`使用状态机模式来管理其生命周期，主要包括以下状态转换过程：

![alt text](<assets/GPU Operator技术介绍/image-1.png>)

状态机按照以下顺序执行：

1. **容器工具包状态**：部署一个`DaemonSet`，在`GPU`节点上安装`NVIDIA Container Runtime`
2. **驱动状态**：部署一个`DaemonSet`，在`GPU`节点上安装容器化的`NVIDIA`驱动程序
3. **驱动验证状态**：运行一个简单的`CUDA`工作负载，验证驱动是否正确安装
4. **设备插件状态**：部署`NVIDIA Device Plugin`的`DaemonSet`，向`Kubernetes`注册`GPU`资源
5. **设备插件验证状态**：请求分配`GPU`资源并运行`CUDA`工作负载，验证资源分配是否正常

在每个状态之间，`Operator`都会执行验证步骤，确保当前组件已正确部署和配置，只有在验证成功后才会进入下一个状态。如果任何验证步骤失败，状态机将退出并报告错误。

### 3.2 节点发现与选择

`GPU Operator`依赖`Node Feature Discovery (NFD)`来识别集群中的`GPU`节点。`NFD`会检测节点上的硬件特性，并为节点添加标签。例如，对于具有`NVIDIA GPU`的节点，`NFD`会添加以下标签：

```
feature.node.kubernetes.io/pci-10de.present=true
```

其中`0x10DE`是`NVIDIA`的`PCI`供应商`ID`。`GPU Operator`使用这些标签来确定在哪些节点上部署`GPU`组件。

### 3.3 组件部署与协调

`Operator`在两个命名空间中工作：

- **gpu-operator命名空间**：运行`Operator`本身
- **gpu-operator-resources命名空间**：部署和管理底层`NVIDIA`组件

当`Operator`检测到带有`NVIDIA GPU`的节点时，它会按照状态机的顺序，在这些节点上部署必要的组件。`Operator`使用`Reconcile()`函数实现协调循环，持续监控组件状态并根据需要进行调整。

### 3.4 版本管理与自定义

`GPU Operator`使用`Helm`模板(`values.yaml`)来允许用户自定义各组件的版本。这提供了一定程度的参数化能力，使用户可以根据需要部署特定版本的驱动程序、设备插件等组件。

通过这种设计，`GPU Operator`能够以声明式方式管理`GPU`资源，简化了复杂的手动配置过程，并确保了组件之间的一致性和兼容性。

## 4. GPU Operator包含的组件

![alt text](./assets/GPU%20Operator技术介绍/image-2.png)

`GPU Operator`采用容器化方式部署和管理以下核心组件：

### 4.1 NVIDIA驱动容器 (Driver Container)

- **功能**：在节点上安装和管理`NVIDIA GPU`驱动程序
- **特点**：以容器方式运行，但能够将驱动加载到主机内核中
- **优势**：简化驱动版本管理，避免直接在主机上安装驱动

### 3.2 NVIDIA容器工具包 (Container Toolkit)

- **功能**：配置容器运行时以支持`GPU`访问
- **组件**：包含`nvidia-container-runtime`和相关配置
- **作用**：确保容器能够正确访问主机上的`GPU`设备和驱动

### 3.3 Kubernetes设备插件 (Device Plugin)

- **功能**：向`Kubernetes API`服务器注册`GPU`资源
- **作用**：使`Kubernetes`调度器能够感知`GPU`资源并进行分配
- **实现**：以`DaemonSet`形式在每个`GPU`节点上运行

详细介绍请参考文章：[Decvice Plugin](../../2000-云原生/200-Kubernetes/9000-Decvice%20Plugin.md)

### 3.4 节点特性发现 (Node Feature Discovery, NFD)

- **功能**：自动检测节点上的硬件特性并添加标签
- **作用**：识别具有`GPU`的节点，为其添加标签如``feature.node.kubernetes.io/pci-10de.present=true``
- **优势**：简化节点选择和工作负载调度

详细介绍请参考文章：[NFD&GFD技术介绍](../2000-NFD&GFD.md)

### 3.5 GPU特性发现 (GPU Feature Discovery, GFD)

- **功能**：为节点添加详细的`GPU`特性标签
- **标签示例**：`GPU`型号、架构、`CUDA`版本等
- **用途**：支持基于特定`GPU`特性的精细化调度

详细介绍请参考文章：[NFD&GFD技术介绍](../2000-NFD&GFD技术介绍.md)

### 3.6 DCGM导出器 (DCGM Exporter)

- **功能**：收集`GPU`指标并以`Prometheus`格式导出
- **监控内容**：`GPU`利用率、内存使用、温度、功耗等
- **集成**：可与`Prometheus`和`Grafana`等监控系统集成

详细介绍请参考文章：[NVIDIA GPU DCGM-Exporter监控方案](./4000-GPU%20DCGM-Exporter监控方案.md)

### 3.7 MIG管理器 (MIG Manager)

- **功能**：管理`NVIDIA Multi-Instance GPU` (`MIG`)配置
- **作用**：允许将单个物理`GPU`分割为多个逻辑`GPU`实例
- **优势**：提高`GPU`利用率和隔离性

### 3.8 验证器 (Validator)

- **功能**：验证`GPU`组件是否正确安装和配置
- **作用**：运行诊断测试确保`GPU`功能正常
- **实现**：在状态转换过程中执行验证

## 4. GPU Operator与Kubernetes版本的兼容性

`GPU Operator`对`Kubernetes`版本有特定的兼容性要求。根据最新文档，兼容性情况如下：

### 4.1 支持的Kubernetes版本

`GPU Operator`最新版本(`v25.3.0`)支持以下`Kubernetes`版本：

- **当前支持的版本**：`Kubernetes 1.29 - 1.32`
- **最低支持版本**：`Kubernetes 1.23`（较旧版本的`GPU Operator`）

需要注意的是，`Kubernetes`社区通常只支持最近的三个次要版本。对于更旧的版本，可能需要通过企业级`Kubernetes`发行版（如`Red Hat OpenShift`）获得支持。

### 4.2 操作系统兼容性

`GPU Operator`在以下操作系统上经过验证：

- `Ubuntu 20.04 LTS`
- `Ubuntu 22.04 LTS`
- `Ubuntu 24.04 LTS`
- `Red Hat Core OS (RHCOS)`
- `Red Hat Enterprise Linux 8`

### 4.3 容器运行时兼容性

`GPU Operator`支持以下容器运行时：

- `Containerd 1.6 - 2.0`（`Ubuntu`所有支持版本）
- `CRI-O`（所有支持的操作系统）

### 4.4 GPU兼容性

`GPU Operator`支持多种`NVIDIA`数据中心`GPU`，包括但不限于：

- `NVIDIA Hopper`架构：`H100`、`H800`、`H20`、`GH200`等
- `NVIDIA Ampere`架构：`A100`、`A30`、`A10`、`A2`等
- `NVIDIA Ada`架构：`L40`、`L4`等
- `NVIDIA Turing`架构：`T4`等
- `NVIDIA Volta`架构：`V100`等
- `NVIDIA Pascal`架构：`P100`、`P40`、`P4`等

## 5. GPU Operator的部署方式

`GPU Operator`的部署相对简单，主要通过`Helm Chart`完成。以下是详细的部署步骤：

### 5.1 前提条件

在部署`GPU Operator`之前，需要确保：

1. 有一个正常运行的`Kubernetes`集群（版本兼容）
2. 集群中至少有一个配备`NVIDIA GPU`的节点
3. 已安装`Helm`（推荐`v3.x`或更高版本）
4. 节点能够访问容器镜像仓库（如`NGC`、`Docker Hub`等）

### 5.2 使用Helm部署

#### 5.2.1 添加NVIDIA Helm仓库

```bash
$ helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
$ helm repo update
```

#### 5.2.2 基本安装

最简单的安装方式是使用默认配置：

```bash
$ helm install --wait --generate-name \
     -n gpu-operator --create-namespace \
     nvidia/gpu-operator \
     --version=v25.3.0
```

这个命令会：
- 创建名为``gpu-operator``的命名空间
- 在该命名空间中安装`GPU Operator`
- 使用版本`v25.3.0`的`Operator`

安装完成后，`GPU Operator`会自动检测集群中的`GPU`节点并部署必要的组件。

### 5.3 自定义部署选项

`GPU Operator`提供了多种自定义选项，以适应不同的部署场景：

#### 5.3.1 使用预安装的驱动程序

如果节点上已经安装了`NVIDIA`驱动，可以配置`Operator`跳过驱动安装：

```bash
$ helm install --wait --generate-name \
     -n gpu-operator --create-namespace \
     nvidia/gpu-operator \
     --version=v25.3.0 \
     --set driver.enabled=false
```

#### 5.3.2 使用预安装的容器工具包

同样，如果已经安装了`NVIDIA Container Toolkit`，可以跳过该组件的安装：

```bash
$ helm install --wait --generate-name \
     -n gpu-operator --create-namespace \
     nvidia/gpu-operator \
     --version=v25.3.0 \
     --set driver.enabled=false \
     --set toolkit.enabled=false
```

#### 5.3.3 指定特定版本的组件

可以为各个组件指定特定版本，例如：

```bash
$ helm install --wait --generate-name \
     -n gpu-operator --create-namespace \
     nvidia/gpu-operator \
     --version=v25.3.0 \
     --set toolkit.version=v1.16.1-ubi8
```

#### 5.3.4 启用MIG支持

对于支持`MIG`的`GPU`（如`A100`），可以启用`MIG`管理器：

```bash
$ helm install --wait --generate-name \
     -n gpu-operator --create-namespace \
     nvidia/gpu-operator \
     --version=v25.3.0 \
     --set mig.strategy=mixed
```

### 5.4 验证部署

部署完成后，可以通过以下命令验证`GPU Operator`是否正常工作：

```bash
# 检查GPU Operator的Pod状态
$ kubectl get pods -n gpu-operator

# 检查GPU资源是否可用
$ kubectl get nodes -o json | jq '.items[].status.capacity["nvidia.com/gpu"]'

# 运行示例工作负载测试GPU功能
$ kubectl run nvidia-smi --rm -t -i --restart=Never \
    --image=nvidia/cuda:11.6.2-base-ubuntu20.04 \
    --overrides='{"spec": { "nodeSelector": {"nvidia.com/gpu.present": "true"}}}' \
    -- nvidia-smi
```

## 6. 总结

`NVIDIA GPU Operator`极大地简化了在`Kubernetes`环境中管理`GPU`资源的复杂性。通过自动化部署和管理`NVIDIA`软件组件，它使得`AI`和高性能计算工作负载能够更轻松地在`Kubernetes`中运行。与单独使用`GPU DevicePlugin`相比，`GPU Operator`提供了更全面的解决方案，覆盖了从驱动安装到监控的整个`GPU`管理生命周期。

对于任何需要在`Kubernetes`中大规模管理`GPU`资源的组织，`GPU Operator`都是一个值得考虑的工具，它能够显著降低运维复杂度，提高资源利用效率，并确保`GPU`工作负载的可靠运行。

## 7. 参考资料

- [NVIDIA GPU Operator: Simplifying GPU Management in Kubernetes](https://developer.nvidia.com/blog/nvidia-gpu-operator-simplifying-gpu-management-in-kubernetes/)
- [NVIDIA GPU Operator官方文档](https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/index.html)
- [Kubernetes Device Plugin文档](https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
