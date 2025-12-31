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

![CPU处理器架构：SMP、NUMA、MPP](../../../7000-操作系统和网络/assets/CPU处理器架构：SMP、NUMA、MPP/image-7.png)

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

### NUMA的更多介绍

关于`NUMA`架构的更多细节，可以参考我的另一篇文章：[CPU处理器架构：SMP、NUMA、MPP](../../../7000-操作系统和网络/CPU处理器架构：SMP、NUMA、MPP.md)

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

### GPU NUMA ID字段解析

`GPU NUMA ID`列在支持的平台上显示`GPU`设备本身的`NUMA`节点`ID`。在上述示例中，所有`GPU`的`GPU NUMA ID`都显示为`N/A`，这表示：

**`N/A`的含义**：
- `GPU`没有自己的独立`NUMA`节点
- `GPU`作为`PCIe`设备挂载在`CPU`的`NUMA`节点下
- 应该参考`NUMA Affinity`列来确定`GPU`所属的`NUMA`节点

**何时会显示具体的NUMA ID**：
在某些高端系统架构中（如`AMD Infinity Fabric`架构或`NVIDIA Grace Hopper Superchip`），`GPU`可能拥有自己的`NUMA`节点：

```text
        GPU0    ...    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      ...    0-31,64-95      0               2
GPU1    PIX     ...    0-31,64-95      0               3
```

在这种情况下：
- `NUMA Affinity: 0`表示`GPU`物理连接在`NUMA Node 0`的`PCIe`总线上
- `GPU NUMA ID: 2`表示`GPU`本身被系统识别为`NUMA Node 2`
- 这种架构下，`GPU`内存（显存）可以作为独立的`NUMA`节点被`CPU`直接访问
- 支持`CPU`直接访问`GPU`内存，实现更高效的异构内存管理

**对配置的影响**：
- **N/A场景**（最常见）：按照`NUMA Affinity`列配置`CPU`和内存亲和性即可
- **独立NUMA ID场景**：需要考虑`GPU`显存作为额外`NUMA`节点的影响，可能需要配置更复杂的内存策略（如允许访问`GPU NUMA`节点）

**验证命令**：
```bash
# 查看系统所有NUMA节点
numactl --hardware
```

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
   - 跨`NUMA`任务：尽量选择`4+4`的组合（如`GPU0-3` + `GPU4-7`在不同节点），避免`5`卡这种不均衡配置


## Docker中的CPU&NUMA亲和性配置

参考章节：[Docker中的CPU&NUMA亲和性配置](./4000-Docker中的CPU&NUMA亲和性配置.md)

## Kubernetes中CPU&NUMA亲和性配置

参考章节：[Kubernetes CPU&NUMA亲和性调度调度](../../../2000-云原生/200-Kubernetes/5000-Kubernetes%20CPU&NUMA%E4%BA%B2%E5%92%8C%E6%80%A7%E8%B0%83%E5%BA%A6.md)