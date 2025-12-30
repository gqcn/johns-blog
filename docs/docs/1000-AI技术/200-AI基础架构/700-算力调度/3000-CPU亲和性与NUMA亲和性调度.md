---
slug: "/ai/cpu-numa-affinity-scheduling"
title: "CPU亲和性与NUMA亲和性调度"
hide_title: true
keywords:
  [
    "CPU亲和性",
    "NUMA亲和性",
    "NUMA架构",
    "GPU调度",
    "AI训练",
    "AI推理",
    "性能优化",
    "Docker亲和性",
    "Kubernetes亲和性",
    "CPU绑核",
    "内存访问优化",
    "跨NUMA节点",
    "nvidia-smi",
    "GPU拓扑",
    "分布式训练",
    "NVLINK",
    "资源调度",
    "Kubernetes Topology Manager",
    "CPU Manager",
    "静态策略"
  ]
description: "深入探讨AI模型开发训练推理场景下的CPU亲和性与NUMA亲和性调度技术，介绍NUMA架构原理、GPU拓扑分析、Docker和Kubernetes环境下的亲和性配置方案，通过实际案例优化AI工作负载的性能表现"
---


:::danger 注意
本文的内容还在编写中，示例代码还未进行严格测试。
:::


## 引言

在`AI`模型开发、训练和推理场景中，计算密集型任务对硬件资源的高效利用提出了极高要求。除了`GPU`算力本身，`CPU`和内存的访问效率同样是影响整体性能的关键因素。不合理的`CPU`与内存分配可能导致跨`NUMA`节点的内存访问、频繁的进程迁移等问题，从而显著降低系统性能。

`CPU`亲和性（`CPU Affinity`）和`NUMA`亲和性（`NUMA Affinity`）调度技术通过精确控制进程与`CPU`核心、内存节点的绑定关系，最大化利用硬件拓扑结构，减少资源访问延迟，提升`AI`工作负载的性能表现。本文将深入介绍这些核心技术的原理、应用场景及在`Docker`和`Kubernetes`环境下的具体实现方法。

## NUMA架构简介

### 什么是NUMA

`NUMA`（`Non-Uniform Memory Access`，非统一内存访问）是现代多处理器系统采用的一种内存访问架构。在`NUMA`架构中，系统内存被划分为多个`NUMA`节点（`NUMA Node`），每个节点包含一组`CPU`核心和本地内存。

与传统的`UMA`（`Uniform Memory Access`，统一内存访问）架构相比，`NUMA`架构具有以下特点：

- **本地访问优化**：`CPU`访问本地`NUMA`节点的内存速度最快
- **远程访问代价**：`CPU`访问其他`NUMA`节点的内存（跨节点访问）会产生额外延迟
- **可扩展性强**：通过增加`NUMA`节点可以线性扩展系统规模

### NUMA架构的层级结构

例如一个典型的`NUMA`系统具有以下层级结构：

```text
┌─────────────────────────────────────────────────────────────┐
│                        NUMA 系统                              │
├──────────────────────────┬──────────────────────────────────┤
│     NUMA Node 0          │        NUMA Node 1               │
├──────────────────────────┼──────────────────────────────────┤
│  CPU 0-31, 64-95         │     CPU 32-63, 96-127            │
│  Local Memory            │     Local Memory                 │
│  PCIe Devices (GPU0-3)   │     PCIe Devices (GPU4-7)        │
└──────────────────────────┴──────────────────────────────────┘
```

在上述架构中：
- 每个`NUMA`节点包含一组`CPU`核心
- 每个`NUMA`节点有自己的本地内存
- `PCIe`设备（如`GPU`）也归属于特定的`NUMA`节点

### NUMA对性能的影响

在`AI`训练和推理场景中，`NUMA`架构对性能的影响主要体现在：

1. **内存访问延迟**：本地内存访问延迟通常为`100-200ns`，而跨`NUMA`节点访问延迟可达`300-500ns`，差距达`2-3`倍

2. **内存带宽**：跨节点访问会占用`NUMA`互连总线，降低整体内存带宽

3. **PCIe通信延迟**：
   - `GPU`物理连接在特定`NUMA`节点的`PCIe`总线上
   - `CPU`访问非本地`NUMA`节点的`GPU`需要经过`NUMA`互联（`QPI`/`UPI`）
   - 跨`NUMA`的`PCIe`访问会增加`100-200ns`额外延迟
   - `DMA(Direct Memory Access)`传输带宽可能降低`50%`以上

4. **GPU-CPU通信效率**：
   - `GPU kernel`启动、状态查询、寄存器访问等`PCIe`事务受跨`NUMA`影响
   - 频繁的`CPU-GPU`交互会放大跨`NUMA`开销
   - 影响整体`GPU`利用率和吞吐量

5. **数据传输效率**：跨`NUMA`节点的数据传输会影响`GPU`与`CPU`之间的数据交换效率，包括：
   - 主机到设备（`Host-to-Device`）传输
   - 设备到主机（`Device-to-Host`）传输  
   - 统一内存（`Unified Memory`）的页面迁移

## CPU&NUMA亲和性的重要性

### CPU亲和性的作用

`CPU`亲和性（`CPU Affinity`）是指将进程或线程绑定到特定的`CPU`核心上运行。在`AI`工作负载中，合理的`CPU`亲和性配置可以：

1. **减少上下文切换**：避免进程在不同`CPU`核心间频繁迁移，减少上下文切换开销
2. **提升缓存命中率**：进程固定在特定核心运行，可以更好地利用`CPU`的`L1`、`L2`、`L3`缓存
3. **降低延迟抖动**：避免进程迁移带来的性能波动，提供更稳定的延迟表现
4. **避免资源竞争**：将不同任务绑定到不同的核心，减少`CPU`资源争抢

### NUMA亲和性的作用

`NUMA`亲和性（`NUMA Affinity`）是指将进程、内存分配和`I/O`设备绑定到同一`NUMA`节点，以**优化内存访问性能**。在`AI`场景中的价值包括：

1. **降低内存访问延迟**：确保进程访问本地内存，避免跨`NUMA`节点的远程内存访问
2. **提升内存带宽**：本地内存访问可以充分利用`NUMA`节点的内存带宽
3. **优化GPU-CPU通信**：将`GPU`、对应的`CPU`核心和内存绑定到同一`NUMA`节点，最小化数据传输延迟
4. **提高整体吞吐量**：通过减少跨节点通信，提升系统整体的数据处理能力

### AI模型训练推理场景中的影响

在`AI`模型训练和推理场景中，不合理的亲和性配置可能导致：

- **训练速度下降**：数据加载、预处理过程中的跨`NUMA`访问会拖累整体训练速度
- **推理延迟增加**：推理服务中的请求处理涉及频繁的`CPU-GPU`交互，跨`NUMA`访问会增加延迟
- **吞吐量降低**：在高并发推理场景下，跨`NUMA`访问会成为系统瓶颈
- **性能不稳定**：进程迁移和非本地内存访问会导致性能抖动

通过合理配置`CPU`亲和性和`NUMA`亲和性，通常可以获得`10%-30%`的性能提升，在某些场景下甚至可以达到`50%`以上的优化效果。

## CPU&NUMA亲和性示例分析

### 理解nvidia-smi topo命令输出

`NVIDIA`提供了`nvidia-smi topo -m`命令来查看`GPU`之间以及`GPU`与`CPU`之间的拓扑关系。让我们详细分析提供的拓扑信息：

```text
        GPU0    GPU1    GPU2    GPU3    GPU4    GPU5    GPU6    GPU7    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      PIX     NODE    NODE    SYS     SYS     SYS     SYS     0-31,64-95      0               N/A
GPU1    PIX      X      NODE    NODE    SYS     SYS     SYS     SYS     0-31,64-95      0               N/A
GPU2    NODE    NODE     X      PIX     SYS     SYS     SYS     SYS     0-31,64-95      0               N/A
GPU3    NODE    NODE    PIX      X      SYS     SYS     SYS     SYS     0-31,64-95      0               N/A
GPU4    SYS     SYS     SYS     SYS      X      PIX     NODE    NODE    32-63,96-127    1               N/A
GPU5    SYS     SYS     SYS     SYS     PIX      X      NODE    NODE    32-63,96-127    1               N/A
GPU6    SYS     SYS     SYS     SYS     NODE    NODE     X      PIX     32-63,96-127    1               N/A
GPU7    SYS     SYS     SYS     SYS     NODE    NODE    PIX      X      32-63,96-127    1               N/A
```

### 连接类型说明

矩阵中的符号表示`GPU`之间的连接类型，按照性能从高到低排列：

| 连接类型 | 说明 | 典型带宽 | 适用场景 |
|-------------|------|---------|---------|
| `X` | 自身 | `N/A` | 同一`GPU` |
| `NV#` | `NVLink`连接（#表示链接数量） | `300-900 GB/s` | 高性能`GPU`间通信（如`NVLink 3.0/4.0`） |
| `PIX` | 同一`PCIe`交换机<br/>可能包含`NVLink Bridge` | `PCIe: 16-64 GB/s`<br/>`NVLink Bridge: 100-200 GB/s` | 同`PCIe`树`GPU`通信<br/>部分消费级`GPU`使用`NVLink Bridge`互联 |
| `NODE` | 同一`NUMA`节点，不同`PCIe`交换机 | `16-32 GB/s` | 同`NUMA`节点`GPU`跨`PCIe`交换机通信 |
| `SYS` | 跨`NUMA`节点，通过`CPU`互联 | `8-16 GB/s` | 跨`NUMA`节点`GPU`通信，性能最低 |

### CPU Affinity字段解析

`CPU Affinity`列显示了每个`GPU`关联的最优`CPU`核心范围：

- **GPU0-GPU3**: `0-31, 64-95`
  - 物理核心：`0-31`
  - 超线程核心：`64-95`
  - 总共`32`个物理核心，`64`个逻辑核心（启用超线程）

- **GPU4-GPU7**: `32-63, 96-127`
  - 物理核心：`32-63`
  - 超线程核心：`96-127`
  - 总共`32`个物理核心，`64`个逻辑核心（启用超线程）

**关键理解**：当进程需要使用特定`GPU`时，应将其绑定到该`GPU`的`CPU Affinity`范围内的核心，以实现最优性能。

### NUMA Affinity字段解析

`NUMA Affinity`列显示了每个`GPU`所属的`NUMA`节点：

- **GPU0-GPU3**: 属于`NUMA Node 0`
- **GPU4-GPU7**: 属于`NUMA Node 1`

这意味着：
- 使用`GPU0-GPU3`的任务应绑定到`NUMA Node 0`的`CPU`核心和内存
- 使用`GPU4-GPU7`的任务应绑定到`NUMA Node 1`的`CPU`核心和内存

**NUMA与PCIe拓扑的关系**：

```text
NUMA Node 0                          NUMA Node 1
├── CPU 0-31, 64-95                  ├── CPU 32-63, 96-127
├── Local Memory                     ├── Local Memory
└── PCIe Root Complex                └── PCIe Root Complex
    ├── PCIe Switch 0                    ├── PCIe Switch 2
    │   ├── GPU0                         │   ├── GPU4
    │   └── GPU1                         │   └── GPU5
    └── PCIe Switch 1                    └── PCIe Switch 3
        ├── GPU2                             ├── GPU6
        └── GPU3                             └── GPU7
```

**关键理解**：
- 每个`GPU`物理连接到特定`NUMA`节点的`PCIe`总线
- `CPU`访问非本地`NUMA`节点的`GPU`需要经过`NUMA`互联（`QPI/UPI`）
- 跨`NUMA`的`PCIe`访问会显著增加延迟并降低带宽
- 最佳性能需要`CPU`、内存、`GPU`都在同一`NUMA`节点

### 拓扑分析总结

从上述拓扑信息可以得出以下结论：

1. **GPU分组**：
   - 组1：`GPU0-GPU3`（`NUMA Node 0`）
   - 组2：`GPU4-GPU7`（`NUMA Node 1`）

2. **GPU间连接模式**：
   - `GPU0-GPU1`通过`PIX`连接（同`PCIe`交换机）
   - `GPU2-GPU3`通过`PIX`连接（同`PCIe`交换机）
   - `GPU0/1`与`GPU2/3`通过`NODE`连接（同`NUMA`节点，不同`PCIe`交换机）
   - 跨`NUMA`节点的`GPU`通过`SYS`连接（性能最低）

3. **最佳实践**：
   - 单卡任务：使用任意一张`GPU`，绑定到对应的`CPU`核心和`NUMA`节点
   - 2卡任务：优先选择`GPU0-GPU1`或`GPU2-GPU3`等`PIX`连接的`GPU`对
   - 4卡任务：选择`GPU0-GPU3`或`GPU4-GPU7`（同`NUMA`节点，性能最优）
   - 5卡任务：例如`GPU0-GPU4`，会跨`NUMA`节点，`GPU4`与`GPU0-3`通信性能较低（`SYS`连接）
   - 跨`NUMA`任务：尽量选择4+4的组合（如`GPU0-3` + `GPU4-7`在不同节点），避免5卡这种不均衡配置


## Docker中的CPU&NUMA亲和性配置

### Docker的亲和性参数

`Docker`提供了多个参数来控制容器的`CPU`和`NUMA`亲和性：

| 参数 | 说明 | 示例 |
|------|------|------|
| `--cpuset-cpus` | 指定容器可使用的`CPU`核心 | `--cpuset-cpus="0-31,64-95"` |
| `--cpuset-mems` | 指定容器可使用的`NUMA`内存节点 | `--cpuset-mems="0"` |
| `--cpus` | 限制容器可使用的`CPU`核心数量 | `--cpus="8.0"` |
| `--cpu-shares` | 设置`CPU`权重（相对值） | `--cpu-shares=1024` |

### 示例1：单GPU训练任务

假设我们要运行一个使用`GPU0`的训练任务：

```bash
# 查看GPU0的CPU亲和性和NUMA亲和性
# GPU0: CPU Affinity: 0-31,64-95, NUMA Affinity: 0

docker run -d \
  --name ai-training-gpu0 \
  --gpus '"device=0"' \
  --cpuset-cpus="0-31,64-95" \
  --cpuset-mems="0" \
  --shm-size=16g \
  -v /data:/data \
  my-training-image:latest \
  python train.py --gpu 0
```

**参数说明**：
- `--gpus '"device=0"'`：使用`GPU0`
- `--cpuset-cpus="0-31,64-95"`：将容器绑定到`GPU0`的亲和`CPU`核心
- `--cpuset-mems="0"`：将容器的内存分配限制在`NUMA Node 0`
- `--shm-size=16g`：设置共享内存大小（`AI`训练通常需要较大的共享内存）

**为什么单GPU也需要设置CPU亲和性？**

虽然是单`GPU`任务，设置`CPU`和`NUMA`亲和性仍然非常重要：

1. **优化CPU-GPU数据传输（内存维度）**：`GPU0`连接在`NUMA Node 0`，即使进程运行在`Node 0`的`CPU`上，如果内存分配来自`NUMA Node 1`，数据从`CPU`内存传输到`GPU`时仍需要跨`NUMA`节点，延迟会增加`2-3`倍。

2. **优化CPU-GPU通信（PCIe维度）**：`GPU`物理连接在特定`NUMA`节点的`PCIe`总线上（如`GPU0`连接在`Node 0`的`PCIe`），如果`CPU`进程运行在其他`NUMA`节点（如`Node 1`），`CPU`与`GPU`的控制命令、状态查询等`PCIe`通信都需要经过`NUMA`互联总线（`QPI/UPI`），增加额外延迟。

3. **提升数据预处理性能**：训练任务通常需要大量`CPU`进行数据加载和预处理（如图像解码、数据增强），这些操作的内存访问如果跨`NUMA`会显著降低吞吐量。

4. **减少延迟抖动**：即使`CPU`绑核，内存分配策略不当或`PCIe`访问跨`NUMA`仍可能导致性能不稳定。

5. **实际性能提升**：根据测试，单`GPU`训练任务正确设置亲和性后，通常可获得`10%-20%`的性能提升。

**重要理解：CPU亲和性 ≠ NUMA内存亲和性**

这是一个常见误解，需要特别说明：

- **`--cpuset-cpus`参数**：控制容器进程可以在**哪些`CPU`核心上执行**（进程调度层面）。
- **`--cpuset-mems`参数**：控制容器进程的**内存分配来自哪些`NUMA`节点**（内存分配层面），同时也会影响 **`GPU`-内存之间的`PCIe DMA`传输效率**（因为`GPU`物理连接在特定`NUMA`节点的`PCIe`总线上）。

**为什么指定了CPU亲和性还需要指定NUMA亲和性？**

即使使用`--cpuset-cpus="0-31,64-95"`将进程限制在`NUMA Node 0`的`CPU`上运行，**并不意味着内存也会自动从`NUMA Node 0`分配**。原因如下：

1. **Linux内核的内存分配策略**：
   - 如果不指定`--cpuset-mems`，内核可能使用默认的内存策略（如`default`或`interleave`）
   - 内核会根据内存压力从任何有可用内存的`NUMA`节点分配
   - 当`NUMA Node 0`内存不足或碎片化时，会自动从`Node 1`分配

2. **实际场景示例**：
   ```bash
   # 只指定CPU亲和性，不指定内存亲和性
   docker run --cpuset-cpus="0-31,64-95" ...
   
   # 容器内查看内存分布
   numastat -p <pid>
   # 结果可能显示：
   # Node 0: 8GB
   # Node 1: 24GB  ← 大部分内存来自Node 1！

3. **`PCIe`通信与`DMA`传输的影响**：
   - `GPU`通过`PCIe`连接到特定`NUMA`节点（`GPU0-3`连接到`Node 0`的`PCIe Root Complex`）
   - 如果`CPU`在`Node 0`但使用`Node 1`的`GPU`，或者`CPU`在`Node 1`但使用`Node 0`的`GPU`
   - `CPU`与`GPU`之间的`PCIe`事务（寄存器访问、中断处理）都需要跨`NUMA`互联
   - **`GPU`-内存`DMA`传输同样受`NUMA`影响**：如果`GPU`在`Node 0`但内存在`Node 1`，`GPU`读写内存时需要通过`QPI/UPI`跨`NUMA`访问，`DMA`带宽可能降低50%以上
   - 跨`NUMA`的`PCIe`访问延迟增加，`DMA`传输效率降低，`GPU`利用率下降


### 示例2：多GPU训练任务（同NUMA节点）

使用`GPU0-GPU3`进行`4`卡训练：

```bash
docker run -d \
  --name ai-training-4gpu \
  --gpus '"device=0,1,2,3"' \
  --cpuset-cpus="0-31,64-95" \
  --cpuset-mems="0" \
  --shm-size=32g \
  -v /data:/data \
  -e CUDA_VISIBLE_DEVICES=0,1,2,3 \
  my-training-image:latest \
  torchrun --nproc_per_node=4 train.py
```

**关键点**：
- `4`张`GPU`都在`NUMA Node 0`，使用相同的`CPU`亲和性配置
- 增加共享内存大小以支持多`GPU`通信
- 使用`torchrun`启动分布式训练

### 示例3：推理服务（优化延迟）

运行一个使用`GPU0`的推理服务，需要绑定特定的`CPU`核心以降低延迟：

```bash
docker run -d \
  --name ai-inference-gpu0 \
  --gpus '"device=0"' \
  --cpuset-cpus="0-7,64-71" \
  --cpuset-mems="0" \
  --memory="32g" \
  --memory-reservation="28g" \
  -p 8080:8080 \
  -v /models:/models \
  my-inference-image:latest \
  python serve.py --gpu 0 --port 8080
```

**优化说明**：
- `--cpuset-cpus="0-7,64-71"`：只使用`8`个物理核心（及其超线程），减少调度开销
- `--memory-reservation`：预留内存，减少内存回收带来的延迟抖动
- 绑定到`NUMA Node 0`确保本地内存访问

### 示例4：跨NUMA节点的5卡训练

当需要使用`5`张`GPU`时（`GPU0-4`，跨越两个`NUMA`节点），需要考虑跨`NUMA`节点的配置：

```bash
docker run -d \
  --name ai-training-5gpu \
  --gpus '"device=0,1,2,3,4"' \
  --cpuset-cpus="0-63,64-127" \
  --cpuset-mems="0,1" \
  --shm-size=48g \
  -v /data:/data \
  -e CUDA_VISIBLE_DEVICES=0,1,2,3,4 \
  -e OMP_NUM_THREADS=64 \
  my-training-image:latest \
  torchrun --nproc_per_node=5 train.py
```

**注意事项**：
- **跨NUMA场景**：`GPU0-3`在`NUMA Node 0`，`GPU4`在`NUMA Node 1`，必然存在跨`NUMA`通信
- `--cpuset-mems="0,1"`：允许使用两个`NUMA`节点的内存
- 增加`OMP_NUM_THREADS`以充分利用所有`CPU`核心
- 训练代码应注意`GPU`间通信模式，`GPU4`与`GPU0-3`的通信会经过`SYS`连接（性能较低）
- **性能优化建议**：如果可能，优先使用`4`卡（`GPU0-3`或`GPU4-7`，单`NUMA`节点）而非`5`卡，可避免跨`NUMA`开销


### Docker亲和性配置验证

在容器内可以使用以下命令验证亲和性配置：

```bash
# 查看容器的CPU亲和性
docker exec ai-training-gpu0 taskset -cp 1

# 查看容器的NUMA策略
docker exec ai-training-gpu0 numactl --show

# 查看容器可见的GPU
docker exec ai-training-gpu0 nvidia-smi -L

# 查看进程的CPU绑定情况
docker exec ai-training-gpu0 ps -eLo pid,tid,psr,comm | grep python
```

## Kubernetes中CPU&NUMA亲和性配置

### Kubernetes的亲和性机制

`Kubernetes`提供了多种机制来控制`Pod`的`CPU`和`NUMA`亲和性：

1. **CPU Manager**：静态策略下实现`CPU`绑核
2. **Topology Manager**：协调`CPU Manager`和`Device Manager`实现拓扑感知调度
3. **Device Plugin**：管理`GPU`等设备资源
4. **节点亲和性**：控制`Pod`调度到特定节点

### 前置条件配置

#### 1. 启用Kubelet特性

需要在`Kubelet`配置中启用以下特性：

```yaml
# /var/lib/kubelet/config.yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cpuManagerPolicy: static
cpuManagerReconcilePeriod: 10s
topologyManagerPolicy: single-numa-node  # 或 best-effort、restricted
topologyManagerScope: pod
reservedSystemCPUs: "0,64"  # 为系统预留CPU核心
# ...
```

**Topology Manager策略说明**：

| 策略 | 说明 | 适用场景 |
|------|------|---------|
| `none` | 默认策略，不进行拓扑对齐 | 不关心`NUMA`亲和性 |
| `best-effort` | 尽力对齐，对齐失败也允许调度 | 希望优化但不强制要求 |
| `restricted` | 优先对齐，失败时放宽限制 | 平衡性能和调度成功率 |
| `single-numa-node` | 强制所有资源在同一`NUMA`节点 | 对性能要求极高的场景 |

#### 2. 重启Kubelet使配置生效

```bash
systemctl restart kubelet
```


### 示例1：单GPU训练任务（NUMA Node 0）

创建一个使用`GPU0`的训练任务，绑定到`NUMA Node 0`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ai-training-gpu0
  labels:
    app: ai-training
    gpu-id: "0"
spec:
  restartPolicy: Never
  # 节点选择器：确保调度到有GPU0的节点
  nodeSelector:
    nvidia.com/gpu.present: "true"
  
  containers:
  - name: training
    image: my-training-image:latest
    command: ["python", "train.py", "--gpu", "0"]
    
    resources:
      requests:
        cpu: "16"           # 请求16个CPU核心
        memory: "64Gi"      # 请求64GB内存
        nvidia.com/gpu: 1   # 请求1个GPU
      limits:
        cpu: "32"           # 限制最多使用32个CPU核心
        memory: "128Gi"     # 限制最多使用128GB内存
        nvidia.com/gpu: 1
    
    env:
    - name: CUDA_VISIBLE_DEVICES
      value: "0"
    - name: OMP_NUM_THREADS
      value: "16"
    # NUMA绑定环境变量（需要容器支持）
    - name: GOMP_CPU_AFFINITY
      value: "0-31 64-95"
    
    volumeMounts:
    - name: data
      mountPath: /data
    - name: shm
      mountPath: /dev/shm
  
  volumes:
  - name: data
    hostPath:
      path: /data
      type: Directory
  - name: shm
    emptyDir:
      medium: Memory
      sizeLimit: 32Gi
```

**关键配置说明**：

1. **CPU请求和限制**：
   - `requests.cpu: "16"`确保`Pod`获得足够的`CPU`资源
   - 在`static`策略下，`Kubernetes`会为该`Pod`独占分配`16`个`CPU`核心
   
2. **GPU资源**：
   - `nvidia.com/gpu: 1`请求一个`GPU`
   - `Device Plugin`会根据调度策略分配合适的`GPU`

3. **共享内存**：
   - 使用`emptyDir`卷挂载到`/dev/shm`，提供足够的共享内存

### 示例2：多GPU训练任务（4卡，同NUMA节点）

使用`GPU0-GPU3`进行`4`卡分布式训练：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ai-training-4gpu
  labels:
    app: ai-training-distributed
    gpu-count: "4"
spec:
  restartPolicy: Never
  
  # 节点亲和性：选择有足够GPU的节点
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: nvidia.com/gpu.count
            operator: Gt
            values: ["3"]
  
  containers:
  - name: training
    image: my-training-image:latest
    command: 
      - torchrun
      - --nproc_per_node=4
      - --nnodes=1
      - --node_rank=0
      - train.py
    
    resources:
      requests:
        cpu: "32"           # 4卡任务请求更多CPU
        memory: "128Gi"
        nvidia.com/gpu: 4   # 请求4个GPU
      limits:
        cpu: "64"
        memory: "256Gi"
        nvidia.com/gpu: 4
    
    env:
    - name: CUDA_VISIBLE_DEVICES
      value: "0,1,2,3"
    - name: NCCL_DEBUG
      value: "INFO"
    - name: NCCL_IB_DISABLE
      value: "0"          # 启用InfiniBand（如果可用）
    - name: NCCL_SOCKET_IFNAME
      value: "eth0"
    - name: OMP_NUM_THREADS
      value: "32"
    
    volumeMounts:
    - name: data
      mountPath: /data
    - name: shm
      mountPath: /dev/shm
  
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: training-data-pvc
  - name: shm
    emptyDir:
      medium: Memory
      sizeLimit: 64Gi
```

### 示例3：推理服务（固定GPU和CPU绑核）

部署一个低延迟的推理服务：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-inference-service
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ai-inference
  template:
    metadata:
      labels:
        app: ai-inference
    spec:
      # 使用Guaranteed QoS确保独占CPU
      containers:
      - name: inference
        image: my-inference-image:latest
        command: ["python", "serve.py", "--gpu", "0", "--port", "8080"]
        
        ports:
        - containerPort: 8080
          name: http
          protocol: TCP
        
        resources:
          # requests和limits相同，确保Guaranteed QoS
          requests:
            cpu: "8"
            memory: "32Gi"
            nvidia.com/gpu: 1
          limits:
            cpu: "8"
            memory: "32Gi"
            nvidia.com/gpu: 1
        
        env:
        - name: CUDA_VISIBLE_DEVICES
          value: "0"
        - name: OMP_NUM_THREADS
          value: "8"
        # 固定CPU亲和性
        - name: GOMP_CPU_AFFINITY
          value: "0-7 64-71"
        
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 20
          periodSeconds: 5
        
        volumeMounts:
        - name: models
          mountPath: /models
          readOnly: true
      
      volumes:
      - name: models
        persistentVolumeClaim:
          claimName: models-pvc
```

**推理服务优化要点**：

1. **Guaranteed QoS**：requests和limits相同，确保Pod获得独占CPU资源
2. **固定CPU数量**：使用较少的CPU核心，减少调度开销
3. **健康检查**：配置liveness和readiness探针确保服务稳定

### 示例4：跨NUMA节点的5卡训练

使用5张GPU进行分布式训练（跨NUMA节点）：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: ai-training-5gpu
  labels:
    app: ai-training-distributed
    gpu-count: "5"
spec:
  restartPolicy: Never
  
  containers:
  - name: training
    image: my-training-image:latest
    command:
      - torchrun
      - --nproc_per_node=5
      - --nnodes=1
      - --node_rank=0
      - train.py
    
    resources:
      requests:
        cpu: "48"
        memory: "192Gi"
        nvidia.com/gpu: 5
      limits:
        cpu: "96"
        memory: "384Gi"
        nvidia.com/gpu: 5
    
    env:
    - name: CUDA_VISIBLE_DEVICES
      value: "0,1,2,3,4"
    - name: NCCL_DEBUG
      value: "INFO"
    - name: NCCL_IB_DISABLE
      value: "0"
    - name: NCCL_SOCKET_IFNAME
      value: "eth0"
    # 跨NUMA节点，允许使用所有CPU
    - name: OMP_NUM_THREADS
      value: "48"
    # NCCL拓扑感知
    - name: NCCL_TOPO_FILE
      value: "/etc/nccl/topo.xml"
    
    volumeMounts:
    - name: data
      mountPath: /data
    - name: shm
      mountPath: /dev/shm
    - name: nccl-topo
      mountPath: /etc/nccl
      readOnly: true
  
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: training-data-pvc
  - name: shm
    emptyDir:
      medium: Memory
      sizeLimit: 96Gi
  - name: nccl-topo
    configMap:
      name: nccl-topology-config
```

**跨NUMA配置说明**：

- **资源分配**：`5`卡场景下，`4`卡在`NUMA Node 0`，`1`卡在`NUMA Node 1`
- **CPU配置**：分配`48`个物理核心，足够支持`5`卡训练的数据预处理
- **内存配置**：总共`192GB`请求内存，`Topology Manager`会尽量从两个`NUMA`节点分配
- **性能考虑**：`GPU4`与`GPU0-3`之间的通信会通过`SYS`连接，带宽较低（8-16 GB/s）
- **替代方案**：如果性能要求高，建议使用`4`卡（单`NUMA`节点）或`8`卡（双`NUMA`均衡）方案

### 使用Topology Manager实现自动NUMA对齐

当启用`Topology Manager`并设置为`single-numa-node`策略时，`Kubernetes`会自动确保：

1. `Pod`请求的所有`GPU`在同一`NUMA`节点
2. `Pod`分配的`CPU`核心在同一`NUMA`节点
3. `Pod`的内存分配优先从同一`NUMA`节点分配

**验证Topology对齐**：

```bash
# 进入Pod查看CPU绑定
kubectl exec -it ai-training-gpu0 -- taskset -cp 1

# 查看NUMA策略
kubectl exec -it ai-training-gpu0 -- numactl --show

# 查看GPU拓扑
kubectl exec -it ai-training-gpu0 -- nvidia-smi topo -m
```

