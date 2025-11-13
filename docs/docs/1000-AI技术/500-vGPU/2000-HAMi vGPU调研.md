---
slug: "/ai/vgpu-hami"
title: "HAMi vGPU调研"
hide_title: true
keywords: [HAMi, vGPU, GPU虚拟化, Kubernetes, CUDA API劫持, 显存隔离, GPU共享, CNCF, 云原生]
description: "HAMi是CNCF沙箱项目，提供Kubernetes环境下的GPU虚拟化解决方案。通过CUDA API劫持实现硬显存隔离和算力配额管理，支持多GPU厂商，零侵入应用，是目前最成熟的开源vGPU方案之一。"
---

## 1. HAMi项目概述

![HAMi整体架构](assets/1000-vGPU方案调研/image-2.png)

**HAMi** (`Heterogeneous AI Computing Virtualization Middleware`) 是开源的 `vGPU`与调度系统 https://project-hami.io/ ，目标是为`Kubernetes`环境下的深度学习/推理任务提供细粒度、灵活的`GPU`资源管理能力。其思路是：在`Kubernetes`调度层与`GPU driver`层能力之间，建立一个智能的中间层，用统一的接口和策略提供给用户。这样，用户提交任务时不需要关心底层细节，只需要声明需要多少`GPU`算力/显存，`HAMi`就能动态分配、隔离并调度。

**项目信息**：
- **GitHub**: https://github.com/Project-HAMi/HAMi
- **开源协议**: `Apache 2.0`
- **项目状态**: `CNCF`沙箱项目，活跃，持续更新

**核心特性**：
- ✅ 硬显存隔离
- ✅ 算力配额限制
- ✅ `Kubernetes`原生集成
- ✅ 多GPU厂商支持（`NVIDIA`、`AMD`、昇腾等）
- ✅ 完善的监控和可观测性
- ✅ 零侵入，应用无需修改

**支持的设备**：

| 生产商 | 制造商 | 类型 | 内存隔离 | 核心隔离 | 多卡支持 |
|--------|--------|------|----------|----------|----------|
| `GPU` | `NVIDIA` | 全部 | ✅ | ✅ | ✅ |
| `GPU` | `iluvatar` | 全部 | ✅ | ✅ | ❌ |
| `GPU` | `Mthreads` | `MTT S4000` | ✅ | ✅ | ❌ |
| `GPU` | `Metax` | `MXC500` | ✅ | ✅ | ❌ |
| `MLU` | `Cambricon` | `370`, `590` | ✅ | ✅ | ❌ |
| `DCU` | `Hygon` | `Z100`, `Z100L` | ✅ | ✅ | ❌ |
| `Ascend` | `Huawei` | `910B`, `910B3`, `310P` | ✅ | ✅ | ❌ |
| `GCU` | `Enflame` | `S60` | ✅ | ✅ | ❌ |
| `XPU` | `Kunlunxin` | `P800` | ✅ | ✅ | ❌ |
| `DPU` | `Teco` | 检查中 | 进行中 | 进行中 | ❌ |

## 2. HAMi的优势与局限

| 维度 | 优势 ✅ | 局限 ⚠️ |
|------|---------|---------|
| **隔离性** | • 硬显存隔离，防止`OOM`相互影响<br />• 进程崩溃不影响其他容器<br />• 资源配额强制执行 | • 算力隔离较弱，仅能软限制<br />• 无法像`MIG`那样硬件级隔离<br />• 恶意进程可能超出配额 |
| **性能** | • 大规模计算场景影响较小<br />• 相比内核态方案开销更低 | • `API`劫持带来`5-15%`性能损失<br />• 小`batch`推理场景影响较大 |
| **易用性** | • `Kubernetes`原生集成<br />• 无缝集成`K8S`调度器<br />• 支持标准资源请求语法<br />• 完善的监控和可观测性 | • `API`劫持可能影响调试工具<br />• 错误信息可能不够直观<br />• 需要理解`vGPU`机制 |
| **兼容性** | • 多`GPU`厂商支持（`NVIDIA`、`AMD`、昇腾等）<br />• 易于扩展支持新硬件<br />• 零侵入，应用无需修改 | • 某些使用`CUDA IPC`的应用不兼容<br />• 直接调用`Driver API`的应用可能绕过<br />• 需要针对`CUDA`版本适配 |
| **开源与社区** | • `Apache 2.0`协议<br />• 社区活跃，持续更新<br />• 无版权风险<br />• `CNCF`沙箱项目 | • 相比商业方案技术支持有限<br />• 部分高级特性需要社区贡献 |

## 3. HAMi版本限制

### 3.1 兼容的CUDA版本

| CUDA版本范围 | 支持状态 | 说明 |
|-------------|---------|------|
| `CUDA 9.0+` | ✅ 支持 | 早期版本支持 |
| `CUDA 10.x` | ✅ 支持 | 完整支持 |
| `CUDA 11.0-11.2` | ✅ 支持 | 完整支持 |
| `CUDA 11.3+` | ✅ 支持 | `v2.2`版本优化了显存计数机制以兼容`CUDA 11.3+`编译的任务 |
| `CUDA 11.6+` | ✅ 支持 | `v1.1.0.0`版本更新以兼容`CUDA 11.6`和`Driver 500+` |
| `CUDA 12.x` | ✅ 支持 | 完整支持，包括`CUDA 12.0-12.6` |

### 3.2 NVIDIA驱动版本要求

- **最低驱动版本**：`>= 440`
- **推荐驱动版本**：`>= 500` (更好的兼容性)
- **最新驱动版本**：`550+` (完整支持所有特性)

## 4. HAMi整体架构

![HAMi关键组件详解](assets/1000-vGPU方案调研/image-3.png)

`HAMi`采用分层架构设计，由以下四个核心组件协同工作：

- **HAMi Mutating Webhook**：`Pod`准入控制器，拦截并修改`Pod`定义
- **HAMi Scheduler Extender**：调度器扩展，实现智能`GPU`资源调度
- **HAMi Device Plugin**：设备插件，负责`GPU`资源注册与分配
- **HAMi Core**：容器内运行时库，实现资源隔离与配额控制

### 3.1 HAMi Mutating Webhook

**功能职责**：
- 拦截`Pod`创建请求，检查是否包含`GPU`资源需求
- 自动为`GPU Pod`注入必要的配置和环境变量
- 设置`schedulerName`为`hami-scheduler`，确保由`HAMi`调度器处理
- 注入`runtimeClassName`和`LD_PRELOAD`等运行时参数

**工作流程**：
1. **Pod提交拦截**：当用户提交包含`GPU`资源请求的`Pod`时，`Webhook`首先拦截该请求
2. **资源字段扫描**：检查`Pod`的资源需求字段，识别是否为`HAMi`管理的`GPU`资源
3. **自动配置注入**：为符合条件的`Pod`自动设置调度器名称和运行时配置
4. **环境变量预埋**：注入`LD_PRELOAD`等环境变量，为后续的`API`劫持做准备

### 3.2 HAMi Scheduler Extender

**功能职责**：
- 扩展`Kubernetes`默认调度器，实现`GPU`资源的智能调度
- 维护集群级别的`GPU`资源全局视图
- 根据显存、算力等多维度资源进行节点筛选和打分
- 支持拓扑感知、资源碎片优化等高级调度策略

**调度策略**：
1. **Filter阶段**：
   - 过滤显存不足的节点
   - 过滤算力不足的节点
   - 检查`GPU`型号匹配性

2. **Score阶段**：
   - 优先选择资源碎片少的节点
   - 考虑`GPU`拓扑结构，减少跨卡通信
   - 平衡节点负载，避免资源热点

3. **Bind阶段**：
   - 确定最优节点并绑定`Pod`
   - 更新资源分配记录到`Pod`注解

### 3.3 HAMi Device Plugin

**功能职责**：
- 发现节点上的`GPU`资源并向`Kubernetes`注册虚拟`GPU`资源
- 处理`Pod`的`GPU`资源分配请求
- 从调度结果的注解字段获取分配信息
- 将相应的`GPU`设备映射到容器，并注入配额环境变量

**工作流程**：
1. **启动阶段**：
   - 扫描节点`GPU`资源（型号、显存、数量等）
   - 计算可分配的虚拟`GPU`数量
   - 向`kubelet`注册设备资源

2. **资源分配阶段**：
   - 接收`kubelet`的`Allocate`请求
   - 从`Pod`注解中读取调度器分配的`GPU`信息
   - 生成环境变量（显存限制、算力配额等）
   - 挂载`HAMi Core`库到容器
   - 返回设备列表和环境变量

3. **监控阶段**：
   - 定期更新资源状态
   - 上报`GPU`使用情况
   - 处理设备异常情况

**使用示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod-example
spec:
  schedulerName: hami-scheduler  # 使用HAMi调度器
  containers:
  - name: training-container
    image: nvidia/cuda:11.8.0-runtime-ubuntu22.04
    command: ["python", "train.py"]
    resources:
      limits:
        nvidia.com/gpu: 1          # 请求1个GPU
        nvidia.com/gpumem: 8000    # 请求8GB显存
        nvidia.com/gpucores: 50    # 请求50%算力
```


### 3.4 HAMi Core (libvgpu.so)

源码仓库：https://github.com/Project-HAMi/HAMi-core

**功能职责**：
- 通过`LD_PRELOAD`机制劫持`CUDA Runtime API`调用
- 实现显存配额的硬隔离管理
- 提供算力使用的软限制功能
- 收集容器级别的`GPU`使用统计信息

**工作原理**：

`HAMi Core`是一个动态链接库（`libvgpu.so`），通过`LD_PRELOAD`机制在应用程序启动时被加载。它拦截关键的`CUDA API`调用，在调用真正的`CUDA`函数之前进行资源检查和配额控制。

**核心拦截API**：
- `cudaMalloc` / `cudaFree`：显存分配与释放
- `cudaMemcpy` / `cudaMemcpyAsync`：显存拷贝操作
- `cudaLaunchKernel`：内核函数启动
- `cudaStreamCreate`：流管理

**算力限制机制**：

通过监控`kernel`启动频率和执行时间，实现算力使用的软限制。当容器的算力使用超过配额时，会延迟后续`kernel`的启动，从而控制整体算力占用。

## 5. HAMi原理分析

![HAMi原理分析](assets/1000-vGPU方案调研/image-6.png)


### 5.1 Pod调度阶段

在`Kubernetes`集群中，`HAMi`扩展了`Pod`的调度与运行流程。整个过程可以分为以下几个阶段：

1. **`Pod`提交与`Mutating Webhook`拦截**

   当用户提交一个带有`GPU`资源请求的`Pod`时，请求首先进入`API Server`。此时`Mutating Webhook`会拦截`Pod`对象，对其中的`GPU`资源声明进行补全和修正，例如：

   *   自动设置`schedulerName=hami-scheduler`
   *   注入`runtimeClassName=nvidia`
   *   为容器补齐必要的`GPU`资源字段和环境变量

   同时，`HAMi`还会通过`Pod`的环境变量和容器启动参数注入 `LD_PRELOAD`，确保在容器启动后，应用程序会自动加载`HAMi Core`的动态库。这样，就为后续的`GPU`调度与运行阶段预埋了“劫持” `CUDA API`的钩子。

   这样，`Pod`被标记为交由`HAMi Scheduler`来处理，而不是默认调度器。

2. **`HAMi Scheduler`调度**

   `Pod`被送入`HAMi Scheduler`的调度逻辑：

   *   **Filter** **阶段**：解析`Pod`的资源需求，筛选出满足显存、算力等要求的候选节点。
   *   **Score** **阶段**：对候选节点进行多维度打分，包括资源利用率、碎片化程度、拓扑结构等。
   *   **Bind** **阶段**：选择最优节点，并将`Pod`绑定到该节点。

   这一流程保证了`Pod`能够在合适的`GPU`上运行，并提高集群整体的利用效率。

3. **`HAMi Device Plugin`与环境变量注入**

   当`Pod`被分配到节点后，`HAMi Device Plugin`接管了容器与`GPU`的连接过程。与 `NVIDIA`官方插件相比，`HAMi Device Plugin`不仅保留了驱动与API的兼容性，还新增了以下能力：

   *   为容器注入显存、算力、任务优先级等控制参数
   *   挂载`HAMi Core`库，实现对`GPU`的虚拟化控制
   *   精细化配置`CUDA_MEM_LIMIT`、`CUDA_CORE_LIMIT`等环境变量，实现资源隔离与共享

   最终，`Pod`内部的应用感知到的`GPU`是一个受控的虚拟化`GPU`，既保证了隔离性，也支持资源共享。

### 5.2 Pod持续运行阶段

在`Pod`启动后，`HAMi Core`通过`Linux`的`LD_PRELOAD`机制直接“嵌入”到应用进程中。

`LD_PRELOAD`是`Linux`动态链接器的一种功能，允许开发者在运行时指定一个自定义的动态链接库，让它在系统标准库之前被加载。这时程序里调用的函数（比如`malloc`、`open`，或者在`CUDA`应用里调用的`cudaMalloc`）就会先经过自定义库的实现，从而实现“函数劫持”（`interception`）。`HAMi Core`正是利用这一点：它通过 `LD_PRELOAD` 注入一个定制的库到容器应用中，这个库拦截了关键的`CUDA Runtime API`（如`cudaMalloc`）。

关键工作流程如下：

1. **拦截调用**：当应用尝试调用`cudaMalloc`申请显存时，请求首先会进入`HAMi Core`的拦截逻辑，而不是直接进入`CUDA runtime API`。
2. **资源校验**：`HAMi Core`会读取`Pod`下发的`GPU`配置（例如显存上限），检查本次申请是否超限。
3. **严格控制**：若超出限制，则直接拒绝分配并返回错误码；若合法，则放行并记录分配情况。
4. **持续监管**：所有显存分配和释放都会经过这种拦截校验机制，形成一个完整的`Pod`级“资源沙盒”。

对比`NVIDIA MPS`仅能在`GPU`核心算力（`SM`）维度做时间片调度不同，`HAMi Core`能进一步在显存维度上做细粒度隔离。这样即便某个应用因为显存泄漏或异常崩溃，也不会像`MPS`下那样拖垮同节点的其他应用。


## 6. HAMi配置说明

参考：https://github.com/Project-HAMi/HAMi/blob/master/docs/config_cn.md

### 6.1 全局设备配置

全局配置通过`hami-scheduler-device` `ConfigMap`进行管理，可以通过以下方式更新：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `nvidia.deviceSplitCount` | 整数 | `10` | `GPU`分割数，每张`GPU`最多可同时运行的任务数 |
| `nvidia.deviceMemoryScaling` | 浮点数 | `1.0` | 显存使用比例，可大于1启用虚拟显存（实验功能） |
| `nvidia.migStrategy` | 字符串 | `none` | `MIG`设备策略：`none`忽略`MIG`，`mixed`使用`MIG`设备 |
| `nvidia.disablecorelimit` | 字符串 | `false` | 是否关闭算力限制：`true`关闭，`false`启用 |
| `nvidia.defaultMem` | 整数 | `0` | 默认显存大小（`MB`），`0`表示使用全部显存 |
| `nvidia.defaultCores` | 整数 | `0` | 默认算力百分比(`0-100`)，`0`表示可分配到任意`GPU`，`100`表示独占 |
| `nvidia.defaultGPUNum` | 整数 | `1` | 未指定`GPU`数量时的默认值 |
| `nvidia.resourceCountName` | 字符串 | `nvidia.com/gpu` | `vGPU`个数的资源名称 |
| `nvidia.resourceMemoryName` | 字符串 | `nvidia.com/gpumem` | `vGPU`显存大小的资源名称 |
| `nvidia.resourceMemoryPercentageName` | 字符串 | `nvidia.com/gpumem-percentage` | `vGPU`显存比例的资源名称 |
| `nvidia.resourceCoreName` | 字符串 | `nvidia.com/gpucores` | `vGPU`算力的资源名称 |
| `nvidia.resourcePriorityName` | 字符串 | `nvidia.com/priority` | 任务优先级的资源名称 |

### 6.2 节点级配置

可以为每个节点配置不同的行为，通过编辑`hami-device-plugin` `ConfigMap`：

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `name` | 字符串 | - | 要配置的节点名称 |
| `operatingmode` | 字符串 | `hami-core` | 运行模式：`hami-core`或`mig` |
| `devicememoryscaling` | 浮点数 | - | 节点显存超配率 |
| `devicecorescaling` | 浮点数 | - | 节点算力超配率 |
| `devicesplitcount` | 整数 | - | 每个设备允许的任务数 |
| `filterdevices.uuid` | 字符串列表 | - | 要排除设备的UUID列表 |
| `filterdevices.index` | 整数列表 | - | 要排除设备的索引列表 |

### 6.3 调度策略配置

通过`Helm Chart`参数配置调度策略：

```bash
helm install vgpu vgpu-charts/vgpu --set scheduler.defaultSchedulerPolicy.nodeSchedulerPolicy=binpack
```

| 配置项 | 类型 | 默认值 | 说明 | 可选值 |
|--------|------|--------|--------|------|
| `scheduler.defaultSchedulerPolicy.nodeSchedulerPolicy` | 字符串 | `binpack` | 节点调度策略：`binpack`尽量集中，`spread`尽量分散 | `binpack`/`spread` |
| `scheduler.defaultSchedulerPolicy.gpuSchedulerPolicy` | 字符串 | `spread` | `GPU`调度策略：`binpack`尽量集中，`spread`尽量分散 | `binpack`/`spread` |

### 6.4 Pod注解配置

在`Pod`的`metadata.annotations`中指定：

| 注解 | 类型 | 说明 | 示例值 |
|------|------|--------|------|
| `nvidia.com/use-gpuuuid` | 字符串 | 指定只能使用的`GPU UUID`列表 | `GPU-AAA,GPU-BBB` |
| `nvidia.com/nouse-gpuuuid` | 字符串 | 指定不能使用的`GPU UUID`列表 | `GPU-AAA,GPU-BBB` |
| `nvidia.com/use-gputype` | 字符串 | 指定只能使用的`GPU`型号 | `Tesla V100-PCIE-32GB` |
| `nvidia.com/nouse-gputype` | 字符串 | 指定不能使用的`GPU`型号 | `NVIDIA A10` |
| `hami.io/gpu-scheduler-policy` | 字符串 | `Pod`级别的`GPU`调度策略 | `binpack`/`spread` |
| `hami.io/node-scheduler-policy` | 字符串 | `Pod`级别的节点调度策略 | `binpack`/`spread` |
| `nvidia.com/vgpu-mode` | 字符串 | 指定使用的`vGPU`类型 | `hami-core`/`mig` |

**使用示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
  annotations:
    nvidia.com/use-gputype: "Tesla V100-PCIE-32GB"
    hami.io/gpu-scheduler-policy: "binpack"
spec:
  schedulerName: hami-scheduler
  containers:
  - name: app
    image: nvidia/cuda:11.8.0-runtime-ubuntu22.04
    resources:
      limits:
        nvidia.com/gpu: 1
        nvidia.com/gpumem: 8000
```

### 6.5 容器环境变量配置

在容器的`env`中指定：

| 环境变量 | 类型 | 默认值 | 说明 | 可选值 |
|----------|------|--------|------|------|
| `GPU_CORE_UTILIZATION_POLICY` | 字符串 | `default` | 算力限制策略：`default`默认，`force`强制限制，`disable`忽略限制 | `default`/`force`/`disable` |
| `CUDA_DISABLE_CONTROL` | 布尔 | `false` | 是否屏蔽容器层资源隔离，一般用于调试 | `true`/`false` |

**使用示例**：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gpu-pod
spec:
  schedulerName: hami-scheduler
  containers:
  - name: app
    image: nvidia/cuda:11.8.0-runtime-ubuntu22.04
    env:
    - name: GPU_CORE_UTILIZATION_POLICY
      value: "force"
    resources:
      limits:
        nvidia.com/gpu: 1
        nvidia.com/gpumem: 8000
        nvidia.com/gpucores: 50
```


## 7. HAMi With Volcano

`Volcano`原生支持`HAMi vGPU`，但需要启用对应的`deviceshare` 插件，具体配置如下：
```yaml
kind: ConfigMap
apiVersion: v1
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
      - name: conformance
    - plugins:
      - name: drf
      - name: deviceshare
        arguments:
          deviceshare.VGPUEnable: true # 启用 vgpu
      - name: predicates
      - name: proportion
      - name: nodeorder
      - name: binpack
```

同时需要替换`NVIDIA Device Plugin`为 https://github.com/Project-HAMi/volcano-vgpu-device-plugin ，具体参考：https://project-hami.io/zh/docs/userguide/volcano-vgpu/NVIDIA-GPU/how-to-use-volcano-vgpu

## 8. 参考资料

- https://github.com/Project-HAMi/HAMi
- https://dynamia.ai/