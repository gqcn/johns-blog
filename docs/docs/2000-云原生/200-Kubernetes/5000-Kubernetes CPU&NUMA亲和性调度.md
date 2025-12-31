---
slug: "/cloud-native/kubernetes-cpu-numa-affinity"
title: "Kubernetes CPU&NUMA亲和性调度"
hide_title: true
keywords:
  [
    "Kubernetes",
    "CPU亲和性",
    "NUMA亲和性",
    "Topology Manager",
    "CPU Manager",
    "Memory Manager",
    "Device Manager",
    "GPU调度",
    "AI训练",
    "kubelet配置",
    "cpuset-cpus",
    "cpuset-mems",
    "PCIe拓扑",
    "NUMA节点",
    "QoS",
    "nvidia-device-plugin",
    "静态策略",
    "拓扑感知调度",
  ]
description: "深入解析Kubernetes中CPU和NUMA亲和性调度的完整实现方案。详细讲解Topology Manager、CPU Manager、Memory Manager和Device Manager四大核心组件的工作原理、配置方法和协同机制。涵盖kubelet完整配置示例、策略选项详解、NVIDIA GPU设备插件的NUMA感知功能、多种拓扑管理策略对比，以及实际测试案例和故障排查指南。适用于AI训练、推理等对CPU-GPU-内存局部性要求高的工作负载，助力性能优化和资源高效利用。"
---


## 背景与价值

在`AI`模型开发、训练和推理业务场景下，`CPU`亲和性与`NUMA`亲和性调度至关重要。现代服务器通常采用多`Socket`、多`NUMA`节点的架构，`GPU`等加速设备通过`PCIe`连接到特定的`NUMA`节点。如果`CPU`、`内存`和`GPU`分配在不同的`NUMA`节点上，数据访问将产生跨`NUMA`的内存延迟，显著降低训练和推理性能。通过合理配置`CPU`亲和性和`NUMA`亲和性，可以确保计算资源（`CPU`）、内存和加速设备（`GPU`）在同一`NUMA`节点内协同工作，最大化数据局部性，减少跨节点通信开销，从而提升`AI`工作负载的整体性能。

以典型的`8`卡`GPU`服务器为例，其拓扑结构如下：

```text
        GPU0    GPU1    GPU2    GPU3    GPU4    GPU5    GPU6    GPU7    CPU Affinity    NUMA Affinity
GPU0     X      PIX     NODE    NODE    SYS     SYS     SYS     SYS     0-31,64-95      0
GPU1    PIX      X      NODE    NODE    SYS     SYS     SYS     SYS     0-31,64-95      0
GPU2    NODE    NODE     X      PIX     SYS     SYS     SYS     SYS     0-31,64-95      0
GPU3    NODE    NODE    PIX      X      SYS     SYS     SYS     SYS     0-31,64-95      0
GPU4    SYS     SYS     SYS     SYS      X      PIX     NODE    NODE    32-63,96-127    1
GPU5    SYS     SYS     SYS     SYS     PIX      X      NODE    NODE    32-63,96-127    1
GPU6    SYS     SYS     SYS     SYS     NODE    NODE     X      PIX     32-63,96-127    1
GPU7    SYS     SYS     SYS     SYS     NODE    NODE    PIX      X      32-63,96-127    1
```

可以看到：
- `GPU 0-3`连接到`NUMA 0`，对应`CPU 0-31, 64-95`
- `GPU 4-7`连接到`NUMA 1`，对应`CPU 32-63, 96-127`

通过`Kubernetes`的`NUMA`亲和性调度，可以确保使用`GPU 0-3`的`Pod`被分配到`NUMA 0`对应的`CPU`核心上。

## Kubernetes NUMA 亲和性关键组件

`Kubernetes`通过`kubelet`中的多个`Manager`组件协同工作来实现`NUMA`亲和性调度：

```text
  ┌─────────────────────────────────────────────────────────────┐
  │                        Topology Manager                     │
  └─────────────────────────────────────────────────────────────┘
            ↑                    ↑                    ↑
            │                    │                    │
   ┌────────┴────────┐   ┌───────┴────────┐   ┌───────┴────────┐
   │   CPU Manager   │   │ Memory Manager │   │ Device Manager │
   └─────────────────┘   └────────────────┘   └────────────────┘
```

### 组件功能概述

| 组件 | 功能 | 说明 |
|------|------|------|
| `CPU Manager` | `CPU`亲和性管理 | 为`Guaranteed QoS Pod`分配独占`CPU`核心，提供`CPU`级别的拓扑提示 |
| `Memory Manager` | 内存`NUMA`亲和性 | 为`Pod`分配特定`NUMA`节点的内存，确保内存访问本地化 |
| `Device Manager` | 设备亲和性 | 管理`GPU`等设备的分配，提供设备所在`NUMA`节点的拓扑提示 |
| `Topology Manager` | 拓扑协调中心 | 收集各`Manager`的拓扑提示，根据策略决定资源分配和`Pod`准入 |

### 工作流程

1. `Pod`被调度到节点后，`kubelet`的`Topology Manager`开始协调资源分配
2. 各`Manager`作为`Hint Provider`，向`Topology Manager`提供拓扑亲和性提示（`Hints`）
3. `Topology Manager`根据配置的策略合并这些`Hints`，计算最优的`NUMA`节点分配
4. 根据策略决定`Pod`的准入或拒绝
5. 准入后，各`Manager`根据拓扑提示分配对应`NUMA`节点上的资源


## 关键组件配置详解

以下是启用`CPU`亲和性和`NUMA`亲和性调度的完整`kubelet`配置示例，该配置通常位于宿主机上的`/var/lib/kubelet/config.yaml`。随后我们会详细介绍每个组件的配置项：

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

# ============= CPU Manager 配置 =============
cpuManagerPolicy: static                    # 启用静态CPU管理策略
cpuManagerReconcilePeriod: 10s              # 调和周期
cpuManagerPolicyOptions:
  full-pcpus-only: "true"                   # 仅分配完整物理核心
  distribute-cpus-across-numa: "true"       # 跨NUMA均匀分配（可选）

# ============= Topology Manager 配置 =============
topologyManagerPolicy: restricted           # 严格要求NUMA对齐
topologyManagerScope: pod                   # Pod级别对齐
topologyManagerPolicyOptions:
  prefer-closest-numa-nodes: "true"         # 优先选择距离最近的NUMA节点

# ============= Memory Manager 配置 =============
memoryManagerPolicy: Static                 # 启用静态内存管理策略
reservedMemory:
  - numaNode: 0
    limits:
      memory: 2Gi                           # NUMA 0 预留内存
  - numaNode: 1
    limits:
      memory: 2Gi                           # NUMA 1 预留内存

# ============= 资源预留配置 =============
kubeReserved:
  cpu: "2"
  memory: 2Gi
systemReserved:
  cpu: "2"
  memory: 2Gi
reservedSystemCPUs: "0-3"                   # 预留CPU 0-3给系统

# ============= 驱逐配置 =============
evictionHard:
  memory.available: "100Mi"
  nodefs.available: "10%"
  imagefs.available: "15%"

# ============= Feature Gates（可选）=============
featureGates:
  CPUManagerPolicyOptions: true
  CPUManagerPolicyBetaOptions: true
  TopologyManagerPolicyOptions: true
```


### CPU Manager

`CPU Manager`负责为`Guaranteed QoS`的`Pod`分配独占`CPU`核心，避免`CPU`资源竞争带来的性能抖动。

#### 实现原理

1. **共享池管理**：`CPU Manager`维护一个共享`CPU`池，初始包含节点所有`CPU`（除预留`CPU`外）
2. **独占分配**：对于`Guaranteed QoS`且`CPU`请求为整数的容器，从共享池中分配独占`CPU`
3. **亲和性设置**：通过`Linux cgroups`的`cpuset`将容器绑定到特定`CPU`核心
4. **状态持久化**：分配状态存储在`/var/lib/kubelet/cpu_manager_state`文件中

#### 前置配置要求

| 前置要求 | 说明 |
|----------|------|
| 静态策略前提 | 使用`static`策略时，必须配置`CPU`预留（`kubeReserved`、`systemReserved`或`reservedSystemCPUs`中至少一个大于`0`） |
| `QoS`要求 | 只有`Guaranteed QoS`的`Pod`才能获得独占`CPU` |
| `CPU`请求要求 | `CPU`的`requests`和`limits`必须相等，且为**整数**值 |

#### 配置示例

```yaml
# ============= CPU Manager 配置 =============
cpuManagerPolicy: static                    # 启用静态CPU管理策略
cpuManagerReconcilePeriod: 10s              # 调和周期
cpuManagerPolicyOptions:
  full-pcpus-only: "true"                   # 仅分配完整物理核心
  distribute-cpus-across-numa: "true"       # 跨NUMA均匀分配（可选）

# ============= 资源预留配置 =============
kubeReserved:
  cpu: "2"
  memory: 2Gi
systemReserved:
  cpu: "2"
  memory: 2Gi
reservedSystemCPUs: "0-3"                   # 预留CPU 0-3给系统
```

#### 配置参数

| 参数名称 | 可选值 | 默认值 | 是否必须 | 说明 |
|---------|--------|--------|:--------:|------|
| `cpuManagerPolicy` | `none`, `static` | `none` | 否 | `CPU`管理策略。`none`不提供亲和性；`static`为`Guaranteed Pod`分配独占`CPU` |
| `cpuManagerReconcilePeriod` | `Duration` | `10s` | 否 | `CPU Manager`调和周期，定期检查并修正`CPU`分配 |
| `cpuManagerPolicyOptions` | `Map` | `nil` | 否 | 策略选项，用于精细调整`static`策略行为 |
| `reservedSystemCPUs` | `CPU`列表 | `""` | `static`策略时必须 | 为系统进程预留的`CPU`列表，如`0-3,8-11` |

#### cpuManagerPolicyOptions（策略选项）

| 选项名称  | 版本要求 | 说明 |
|---------|---------|------|
| `full-pcpus-only` | `v1.22+ (GA: v1.33+)` | **仅分配完整物理核心**：启用后，`CPU Manager`只会为容器分配完整的物理核心，而不会分配单个硬件线程（超线程）。这可以有效避免`SMT`（`Simultaneous Multithreading`，超线程）带来的"吵闹邻居"问题，即多个进程共享同一物理核心的执行单元导致的性能干扰。对于`CPU`密集型和延迟敏感的`AI`训练任务，建议启用此选项以获得更稳定的性能表现。例如，在开启超线程的`64`核服务器上（`128`个逻辑核心），启用此选项后容器最多只能获得`64`个完整物理核心 |
| `distribute-cpus-across-numa` | `v1.23+` | **跨NUMA均匀分配CPU**：当容器请求多个`CPU`核心时，`CPU Manager`会尽可能将这些核心均匀分配到多个`NUMA`节点上，而不是集中在单个`NUMA`节点。这种策略适合能够感知`NUMA`拓扑并进行并行计算的应用程序，可以充分利用多`NUMA`节点的内存带宽。但需要注意，此选项可能会增加跨`NUMA`内存访问的开销，不适合需要严格`NUMA`局部性的场景。通常与`Topology Manager`的`best-effort`策略配合使用 |
| `align-by-socket` | `v1.25+` | **按Socket对齐**：在多`Socket`服务器上，优先在物理`Socket`边界对齐`CPU`分配，而非逻辑`NUMA`边界。在某些服务器架构中，一个`Socket`可能包含多个`NUMA`节点，此选项会尝试将容器的所有`CPU`分配在同一个物理`Socket`上，以减少跨`Socket`通信延迟。这对于需要频繁`CPU`间通信的应用（如共享`L3 Cache`）有性能优势。**注意**：此选项为`Alpha`特性，默认隐藏，需要启用`CPUManagerPolicyAlphaOptions` Feature Gate |
| `distribute-cpus-across-cores` | `v1.31+` | **跨物理核心分配虚拟核心**：将虚拟核心（有时称为硬件线程）分配到不同的物理核心上，而不是集中在少数物理核心的多个硬件线程上。这样可以减少同一物理核心内多个线程之间的资源竞争（如执行单元、缓存冲突），提升整体吞吐量。例如，请求`4`个`CPU`时，会分配`4`个不同物理核心的单个线程，而不是`2`个物理核心的`4`个线程。**注意**：此选项为`Alpha`特性，默认隐藏，需要启用`CPUManagerPolicyAlphaOptions` Feature Gate |
| `strict-cpu-reservation` | `v1.32+ (GA: v1.35+)` | **严格CPU预留**：启用后，会严格隔离通过`reservedSystemCPUs`预留的`CPU`核心，确保任何`Pod`（包括`BestEffort`、`Burstable`和`Guaranteed QoS`）都无法使用这些预留的`CPU`。未启用时，预留的`CPU`仅对`Guaranteed QoS`的独占分配有效，`BestEffort`和`Burstable Pod`仍可能调度到这些核心上。对于需要为系统关键进程（如`kubelet`、容器运行时、系统守护进程）保证稳定`CPU`资源的生产环境，强烈建议启用此选项，避免节点过载导致的稳定性问题 |
| `prefer-align-cpus-by-uncorecache` | `v1.32+` | **优先按Uncore Cache对齐**：`Uncore Cache`通常指`Last Level Cache（LLC，最后级缓存）`，它在多个`CPU`核心之间共享。启用此选项后，`CPU Manager`会尽最大努力将容器的所有`CPU`核心分配到共享同一`LLC`的核心组中。这可以显著提高缓存命中率，减少内存访问延迟，对于数据局部性要求高的应用（如`AI`推理服务、数据库）有明显性能提升。在现代服务器架构中，通常一个`NUMA`节点内的核心共享一个`LLC`，因此此选项与`NUMA`亲和性策略配合效果更佳 |


### Topology Manager

`Topology Manager`是`NUMA`亲和性的核心协调器，负责收集各`Manager`的拓扑提示并做出准入决策。

#### 实现原理

1. **Hint收集**：从`CPU Manager`、`Memory Manager`、`Device Manager`收集拓扑亲和性`Hints`
2. **Hint合并**：根据配置的策略合并所有`Hints`，找出满足所有资源需求的最优`NUMA`节点组合
3. **准入决策**：根据策略决定是否允许`Pod`在该节点运行
4. **资源协调**：通知各`Manager`按照合并后的`NUMA`节点分配资源

#### 配置示例

```yaml
topologyManagerPolicy: restricted           # 严格要求NUMA对齐
topologyManagerScope: pod                   # Pod级别对齐
topologyManagerPolicyOptions:
  prefer-closest-numa-nodes: "true"         # 优先选择距离最近的NUMA节点
```

#### 配置参数

| 参数名称 | 可选值 | 默认值 | 是否必须 | 说明 |
|---------|--------|--------|:--------:|------|
| `topologyManagerPolicy` | `none`, `best-effort`, `restricted`, `single-numa-node` | `none` | **是（启用`NUMA`亲和性时）** | 拓扑管理策略，决定`NUMA`对齐的严格程度 |
| `topologyManagerScope` | `container`, `pod` | `container` | 否 | 拓扑管理的作用范围 |
| `topologyManagerPolicyOptions` | `Map` | `nil` | 否 | 策略选项，用于精细调整策略行为 |

#### topologyManagerPolicy 详解

| Policy | 说明 | 适用场景 |
|--------|------|---------|
| `none` | 不执行任何拓扑对齐，不影响资源分配 | 默认行为，不需要`NUMA`亲和性 |
| `best-effort` | 优先选择`NUMA`对齐，但不强制。即使没有最优`NUMA`对齐，`Pod`也会被准入 | 希望`NUMA`对齐但允许降级 |
| `restricted` | 仅允许`NUMA`对齐的`Pod`准入。如果无法满足最优对齐，`Pod`被拒绝 | **推荐用于AI训练/推理场景** |
| `single-numa-node` | 仅允许所有资源都在**同一个`NUMA`节点**的`Pod`准入 | 延迟极度敏感的工作负载 |

#### topologyManagerScope 详解

| Scope | 说明 | 特点 |
|-------|------|------|
| `container` | 在每个容器级别进行资源对齐 | 同一`Pod`的不同容器可能分配到不同`NUMA`节点 |
| `pod` | 在`Pod`级别进行资源对齐 | **推荐**：所有容器分配到相同的`NUMA`节点集合，适合需要进程间通信的应用 |

#### topologyManagerPolicyOptions（策略选项）

| 选项名称 | 说明 |
|---------|------|
| `prefer-closest-numa-nodes` | 优先选择距离最近的`NUMA`节点集合，减少跨`NUMA`通信延迟 |
| `max-allowable-numa-nodes` | 允许超过`8`个`NUMA`节点的系统启用`Topology Manager`（默认限制`8`个） |

### Memory Manager

`Memory Manager`负责为`Pod`分配特定`NUMA`节点的内存，确保内存访问本地化。

#### 实现原理

1. **内存计数**：跟踪每个`NUMA`节点的可用内存和已分配内存
2. **NUMA感知分配**：根据`Topology Manager`的决策，从指定`NUMA`节点分配内存
3. **Hint提供**：向`Topology Manager`提供内存的`NUMA`亲和性提示
4. **状态持久化**：分配状态存储在`/var/lib/kubelet/memory_manager_state`文件中


#### 配置示例

```yaml
memoryManagerPolicy: Static                 # 启用静态内存管理策略
reservedMemory:
  - numaNode: 0
    limits:
      memory: 2Gi                           # NUMA 0 预留内存
  - numaNode: 1
    limits:
      memory: 2Gi                           # NUMA 1 预留内存
```

#### 配置参数

| 参数名称 | 可选值 | 默认值 | 是否必须 | 说明 |
|---------|--------|--------|:--------:|------|
| `memoryManagerPolicy` | `None`, `Static` | `None` | 否 | 内存管理策略。`Static`为`Guaranteed Pod`提供内存`NUMA`亲和性 |
| `reservedMemory` | `MemoryReservation`列表 | `nil` | `Static`策略时必须 | 每个`NUMA`节点预留的内存量 |

#### Reserved Memory 配置

使用`Static`策略时，必须配置每个`NUMA`节点预留的内存，且需满足：

```text
sum(reserved-memory) = kube-reserved + system-reserved + eviction-hard
```

其中：
- **kube-reserved**：为`Kubernetes`系统组件（如`kubelet`、容器运行时）预留的资源
- **system-reserved**：为操作系统守护进程（如`sshd`、`systemd`）预留的资源
- **eviction-hard**：**硬驱逐阈值**，当节点资源使用达到该阈值时，`kubelet`会立即驱逐`Pod`以回收资源，避免节点资源耗尽。常见的驱逐信号包括：
  - `memory.available`：可用内存低于阈值
  - `nodefs.available`：节点文件系统可用空间低于阈值
  - `imagefs.available`：镜像文件系统可用空间低于阈值
  - `pid.available`：可用`PID`数量低于阈值

**evictionHard配置示例**：

```yaml
# kubelet配置
evictionHard:
  memory.available: "100Mi"      # 可用内存低于100Mi时立即驱逐Pod
  nodefs.available: "10%"        # 节点文件系统可用空间低于10%时驱逐
  imagefs.available: "15%"       # 镜像文件系统可用空间低于15%时驱逐
  nodefs.inodesFree: "5%"        # 节点文件系统可用inode低于5%时驱逐
```

当`kubelet`配置不满足`sum(reserved-memory) = kube-reserved + system-reserved + eviction-hard`规则时，会报类似如下的错误：
```
Failed to initialize memory manager" err="the total amount "xxx" of type "memory" is not equal to the value "xxx" determined by Node Allocatable feature"
```

### Device Manager

`Device Manager`本身由设备插件（`Device Plugin`）实现，如`NVIDIA GPU`的`nvidia-device-plugin`。它向`Topology Manager`提供`GPU`设备所在`NUMA`节点的信息。

#### 工作机制

1. **NUMA拓扑检测**：`Device Plugin`启动时通过读取`/sys/bus/pci/devices/<busid>/numa_node`文件自动检测每个`GPU`的`NUMA`节点信息
2. **设备注册**：向`kubelet`注册设备资源（如`nvidia.com/gpu`），并在设备的`TopologyInfo`字段中携带`NUMA`节点信息
3. **Hints提供**：当`Pod`请求`GPU`时，通过`GetPreferredAllocation`接口返回`NUMA`感知的设备分配建议
4. **拓扑协调**：`Topology Manager`结合`CPU`、`Memory`和`GPU`的`Hints`，选择最优的`NUMA`节点组合

#### NUMA感知功能说明

**重要特性**：`NVIDIA Device Plugin`从`v0.2.0`版本开始**原生支持`NUMA`感知功能**，无需额外配置即可自动启用。该功能基于以下机制：

1. **自动检测**：通过`NVML`库和`sysfs`自动获取`GPU`的`NUMA`节点信息
2. **透明传递**：通过`Kubernetes Device Plugin API`的`TopologyInfo`结构体将`NUMA`信息传递给`kubelet`
3. **智能分配**：实现了`GetPreferredAllocation`接口，根据设备类型采用不同的分配策略：
   - **对齐分配**：对于完整`GPU`，优先选择同一`NUMA`节点的设备
   - **分布式分配**：对于`MIG`、`Time-slicing`等共享模式，均匀分布设备

#### 配置方式

`NVIDIA Device Plugin`支持多种配置方式，可以通过`ConfigMap`、命令行参数或`Helm Chart`进行配置。

##### ConfigMap配置示例

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nvidia-device-plugin-config
  namespace: nvidia-device-plugin
data:
  config.yaml: |
    version: v1
    flags:
      migStrategy: "none"              # MIG策略: none, single, mixed
      failOnInitError: true             # 初始化失败时是否终止
      nvidiaDriverRoot: "/"             # NVIDIA驱动根目录
      plugin:
        passDeviceSpecs: false          # 是否传递设备规范（与CPU Manager兼容时设为true）
        deviceListStrategy: "envvar"    # 设备列表策略: envvar, volume-mounts
        deviceIDStrategy: "uuid"        # 设备ID策略: uuid, index
```

#### 关键配置参数

| 参数名称 | 可选值 | 默认值 | 说明 |
|---------|--------|--------|------|
| `migStrategy` | `none`, `single`, `mixed` | `none` | `MIG`模式策略。`none`表示不使用`MIG`；`single`表示每个`MIG`设备作为独立资源；`mixed`表示同时暴露完整`GPU`和`MIG`设备 |
| `failOnInitError` | `true`, `false` | `true` | 初始化失败时是否终止插件。建议生产环境设为`true` |
| `passDeviceSpecs` | `true`, `false` | `false` | 是否传递设备规范给容器。当启用`CPU Manager`的`static`策略时，需要设为`false`以避免权限问题 |
| `deviceListStrategy` | `envvar`, `volume-mounts` | `envvar` | 设备列表传递方式。`envvar`通过环境变量`NVIDIA_VISIBLE_DEVICES`传递；`volume-mounts`通过挂载`/dev`设备节点 |
| `deviceIDStrategy` | `uuid`, `index` | `uuid` | 设备标识策略。`uuid`使用`GPU UUID`；`index`使用设备索引 |


## 关键组件配置更新

在执行测试之前，我们对`kubelet`的配置进行修改以启用`NUMA`亲和性特性：
```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration

# ============= CPU Manager 配置 =============
cpuManagerPolicy: static                    # 启用静态CPU管理策略
cpuManagerReconcilePeriod: 10s              # 调和周期
cpuManagerPolicyOptions:
  full-pcpus-only: "true"                   # 仅分配完整物理核心

# ============= Topology Manager 配置 =============
topologyManagerPolicy: restricted           # 严格要求NUMA对齐
topologyManagerScope: pod                   # Pod级别对齐
topologyManagerPolicyOptions:
  prefer-closest-numa-nodes: "true"         # 优先选择距离最近的NUMA节点

# ============= Memory Manager 配置 =============
memoryManagerPolicy: Static                 # 启用静态内存管理策略
reservedMemory:
  - numaNode: 0
    limits:
      memory: 2Gi                           # NUMA 0 预留内存
  - numaNode: 1
    limits:
      memory: 2Gi                           # NUMA 1 预留内存

# ============= 资源预留配置 =============
# 注意需要保证公式：
# sum(reserved-memory) = kube-reserved + system-reserved + eviction-hard
kubeReserved:
  cpu: "2"
  memory: 1Gi
systemReserved:
  cpu: "2"
  memory: 1Gi
evictionHard:
  memory.available: "2Gi"        # 可用内存低于2Gi时立即驱逐Pod
  nodefs.available: "10%"        # 节点文件系统可用空间低于10%时驱逐
  imagefs.available: "15%"       # 镜像文件系统可用空间低于15%时驱逐
  nodefs.inodesFree: "5%"        # 节点文件系统可用inode低于5%时驱逐

# ============= Feature Gates（可选）=============
featureGates:
  CPUManagerPolicyOptions: true
  # 低版本K8S需要此项启用策略选项，如笔者当前的1.27.3版本
  CPUManagerPolicyBetaOptions: true
  TopologyManagerPolicyOptions: true
  # 低版本K8S需要此项启用策略选项，如笔者当前的1.27.3版本
  TopologyManagerPolicyAlphaOptions: true 

# ... 其他配置项保持不变 ...
```

按照以下步骤更新`kubelet`配置并重启：


```bash
# 1. Drain节点（建议）
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# 2. 停止kubelet
systemctl stop kubelet

# 3. 删除状态文件
rm /var/lib/kubelet/cpu_manager_state
rm /var/lib/kubelet/memory_manager_state

# 4. 修改kubelet配置
vim /var/lib/kubelet/config.yaml

# 5. 启动kubelet
systemctl start kubelet

# 6. Uncordon节点（若前面执行了drain）
kubectl uncordon <node-name>
```

需要注意切换策略需要清理状态文件，否则会报类似如下的错误：

```text
start cpu manager error: could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet"
```


## 测试示例



### 验证NUMA亲和性

以下示例使用`NVIDIA CUDA`镜像，通过`nvidia-smi topo -m`命令验证`GPU`的`NUMA`亲和性配置：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: numa-affinity-test
spec:
  restartPolicy: Never
  containers:
  - name: cuda-container
    image: nvidia/cuda:12.2.0-base-ubuntu20.04
    command:
    - /bin/bash
    - -c
    - |
      echo "========== GPU Topology Information =========="
      nvidia-smi topo -m
      echo ""
      echo "========== CPU Affinity Information =========="
      echo "Current CPU affinity: $(taskset -p $$)"
      cat /proc/self/status | grep -E "Cpus_allowed|Mems_allowed"
      echo ""
      echo "========== NUMA Information =========="
      numactl --hardware 2>/dev/null || echo "numactl not available"
      echo ""
      echo "========== Process CPU Binding =========="
      cat /proc/self/cpuset
      echo ""
      echo "========== Sleeping for observation =========="
      sleep 3600
    resources:
      # Guaranteed QoS: requests == limits
      # CPU必须是整数才能获得独占CPU
      requests:
        cpu: "4"
        memory: "8Gi"
        nvidia.com/gpu: "1"
      limits:
        cpu: "4"
        memory: "8Gi"
        nvidia.com/gpu: "1"
```

### 多GPU NUMA亲和性测试

以下示例请求同一`NUMA`节点的多个`GPU`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-gpu-numa-test
  namespace: default
spec:
  restartPolicy: Never
  containers:
  - name: cuda-multi-gpu
    image: nvidia/cuda:12.2.0-base-ubuntu20.04
    command:
    - /bin/bash
    - -c
    - |
      echo "========== GPU Topology =========="
      nvidia-smi topo -m
      echo ""
      echo "========== Allocated GPUs =========="
      echo "NVIDIA_VISIBLE_DEVICES: $NVIDIA_VISIBLE_DEVICES"
      echo ""
      echo "========== GPU Details =========="
      nvidia-smi --query-gpu=index,name,pci.bus_id,memory.total --format=csv
      echo ""
      echo "========== CPU Binding =========="
      cat /proc/self/status | grep -E "Cpus_allowed_list|Mems_allowed_list"
      echo ""
      sleep 3600
    resources:
      requests:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/gpu: "2"       # 请求2个GPU
      limits:
        cpu: "8"
        memory: "16Gi"
        nvidia.com/gpu: "2"
```




## 故障排查

### TopologyAffinityError

当`Pod`无法满足`Topology Manager`的策略要求时，会出现此错误：

```bash
$ kubectl get pods
NAME                READY   STATUS                  RESTARTS   AGE
numa-affinity-test  0/1     TopologyAffinityError   0          10s
```

**排查步骤**：
1. 检查节点可用资源是否满足`NUMA`对齐要求
2. 降低策略严格程度（如从`single-numa-node`改为`restricted`）
3. 减少`Pod`的资源请求

### 切换CPU Manager Policy

切换策略需要清理状态文件：

```bash
# 1. Drain节点（建议）
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# 2. 停止kubelet
systemctl stop kubelet

# 3. 删除状态文件
rm /var/lib/kubelet/cpu_manager_state
rm /var/lib/kubelet/memory_manager_state

# 4. 修改kubelet配置
vim /var/lib/kubelet/config.yaml

# 5. 启动kubelet
systemctl start kubelet

# 6. Uncordon节点
kubectl uncordon <node-name>
```

### 查看Kubelet日志

```bash
journalctl -u kubelet -f | grep -E "cpu_manager|topology_manager|memory_manager"
```

## 最佳实践

1. **AI训练场景推荐配置**：
   - `topologyManagerPolicy: restricted`
   - `topologyManagerScope: pod`
   - `cpuManagerPolicy: static`

2. **资源请求规范**：
   - 确保`Pod`是`Guaranteed QoS（requests == limits）`
   - `CPU`请求使用整数值以获得独占`CPU`

3. **多GPU场景**：
   - 使用`single-numa-node`策略确保多`GPU`在同一`NUMA`节点
   - 或使用`prefer-closest-numa-nodes`选项减少跨`NUMA`延迟

4. **性能监控**：
   - 监控跨`NUMA`内存访问（通过`numastat`命令）
   - 监控`CPU`上下文切换和缓存命中率

## 参考资料

- https://kubernetes.io/docs/reference/command-line-tools-reference/kubelet/
- https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/#reserved-memory-flag
- [Kubernetes CPU Management Policies](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/)
- [Kubernetes Topology Manager](https://kubernetes.io/docs/tasks/administer-cluster/topology-manager/)
- [Kubernetes Memory Manager](https://kubernetes.io/docs/tasks/administer-cluster/memory-manager/)
- [NVIDIA Device Plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin)
