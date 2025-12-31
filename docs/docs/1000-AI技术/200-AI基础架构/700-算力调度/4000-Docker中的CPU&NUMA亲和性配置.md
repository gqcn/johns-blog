---
slug: "/ai/cpu-numa-affinity-in-docker"
title: "Docker中的CPU&NUMA亲和性配置"
hide_title: true
keywords:
  [
    "Docker",
    "CPU亲和性",
    "NUMA",
    "GPU调度",
    "cpuset-cpus",
    "cpuset-mems",
    "PCIe",
    "DMA传输",
    "NUMA节点",
    "容器性能优化",
    "GPU拓扑",
    "跨NUMA通信",
  ]
description: "深入解析Docker容器中CPU和NUMA亲和性配置的原理与实践。详细说明cpuset-cpus和cpuset-mems参数的区别与配置方法，解释为什么CPU亲和性不等于NUMA内存亲和性，以及如何优化单GPU和多GPU任务的性能。涵盖PCIe通信、DMA传输、跨NUMA节点场景等核心概念，帮助您在GPU训练任务中获得10%-20%的性能提升。"
---


:::info 说明
以下示例中均使用`nvidia/cuda:12.2.0-base-ubuntu20.04`镜像结合`nvidia-smi topo -m`命令来查看`GPU`拓扑信息以验证`CPU&NUMA`亲和性设置的正确性，本文章示例不进行性能对比验证，感兴趣的小伙伴可自行实现。
:::

## Docker的亲和性参数

`Docker`提供了多个参数来控制容器的`CPU`和`NUMA`亲和性：

| 参数 | 说明 | 示例 |
|------|------|------|
| `--cpuset-cpus` | 指定容器可使用的`CPU`核心 | `--cpuset-cpus="0-31,64-95"` |
| `--cpuset-mems` | 指定容器可使用的`NUMA`内存节点 | `--cpuset-mems="0"` |
| `--cpus` | 限制容器可使用的`CPU`核心数量 | `--cpus="8.0"` |
| `--cpu-shares` | 设置`CPU`权重（相对值） | `--cpu-shares=1024` |

## 示例1：单GPU任务

假设我们要运行一个使用`GPU0`的任务：

```bash
docker run --gpus '"device=0"' \
--cpuset-cpus="0-31,64-95" \
--cpuset-mems="0" \
nvidia/cuda:12.2.0-base-ubuntu22.04 \
nvidia-smi topo -m
```

**参数说明**：
- `--gpus '"device=0"'`：使用`GPU0`
- `--cpuset-cpus="0-31,64-95"`：将容器绑定到`GPU0`的亲和`CPU`核心
- `--cpuset-mems="0"`：将容器的内存分配限制在`NUMA Node 0`

**结果输出**：
```text
        GPU0    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      0-31,64-95      0               N/A
```



### 为什么单GPU也需要设置CPU&NUMA亲和性？

虽然是单`GPU`任务，设置`CPU`和`NUMA`亲和性仍然非常重要：

1. **优化CPU-GPU数据传输（内存维度）**：`GPU0`连接在`NUMA Node 0`，即使进程运行在`Node 0`的`CPU`上，如果内存分配来自`NUMA Node 1`，数据从`CPU`内存传输到`GPU`时仍需要跨`NUMA`节点，延迟会增加`2-3`倍。

2. **优化CPU-GPU通信（PCIe维度）**：`GPU`物理连接在特定`NUMA`节点的`PCIe`总线上（如`GPU0`连接在`Node 0`的`PCIe`），如果`CPU`进程运行在其他`NUMA`节点（如`Node 1`），`CPU`与`GPU`的控制命令、状态查询等`PCIe`通信都需要经过`NUMA`互联总线（`QPI/UPI`），增加额外延迟。

3. **提升数据预处理性能**：训练任务通常需要大量`CPU`进行数据加载和预处理（如图像解码、数据增强），这些操作的内存访问如果跨`NUMA`会显著降低吞吐量。

4. **减少延迟抖动**：即使`CPU`绑核，内存分配策略不当或`PCIe`访问跨`NUMA`仍可能导致性能不稳定。

5. **实际性能提升**：根据测试，单`GPU`训练任务正确设置亲和性后，通常可获得`10%-20%`的性能提升。

### 需要注意：CPU亲和性 ≠ NUMA内存亲和性

这是一个常见误解，需要特别说明：

- **`--cpuset-cpus`参数**：控制容器进程可以在**哪些`CPU`核心上执行**（进程调度层面）。
- **`--cpuset-mems`参数**：控制容器进程的**内存分配来自哪些`NUMA`节点**（内存分配层面），同时也会影响 **`GPU`-内存之间的`PCIe DMA`传输效率**（因为`GPU`物理连接在特定`NUMA`节点的`PCIe`总线上）。

### 为什么指定了CPU亲和性还需要指定NUMA亲和性？

即使使用`--cpuset-cpus="0-31,64-95"`将进程限制在`NUMA Node 0`的`CPU`上运行，**并不意味着内存也会自动从`NUMA Node 0`分配**。原因如下：

1. **Linux内核的内存分配策略**：
   - 如果不指定`--cpuset-mems`，内核可能使用默认的内存策略（如`default`或`interleave`）
   - 内核会根据内存压力从任何有可用内存的`NUMA`节点分配
   - 当`NUMA Node 0`内存不足或碎片化时，会自动从`Node 1`分配

2. **`PCIe`通信与`DMA`传输的影响**：
   - `GPU`通过`PCIe`连接到特定`NUMA`节点（`GPU0-3`连接到`Node 0`的`PCIe Root Complex`）
   - 如果`CPU`在`Node 0`但使用`Node 1`的`GPU`，或者`CPU`在`Node 1`但使用`Node 0`的`GPU`
   - `CPU`与`GPU`之间的`PCIe`事务（寄存器访问、中断处理）都需要跨`NUMA`互联
   - **`GPU`-内存`DMA`传输同样受`NUMA`影响**：如果`GPU`在`Node 0`但内存在`Node 1`，`GPU`读写内存时需要通过`QPI/UPI`跨`NUMA`访问，`DMA`带宽可能降低`50%`以上
   - 跨`NUMA`的`PCIe`访问延迟增加，`DMA`传输效率降低，`GPU`利用率下降

### 如果`cpuset-cpus`和`cpuset-mems`不一致的情况

**执行指令**：

```bash
docker run --gpus '"device=0"' \
--cpuset-cpus="0-31,64-95" \
--cpuset-mems="1" \
nvidia/cuda:12.2.0-base-ubuntu22.04 \
nvidia-smi topo -m
```

理论上`cpuset-cpus="0-31,64-95"`的`CPU`亲和性应该对应的`NUMA`亲和性是`0`，但我们这里强制使用`NUMA`节点`1`的内存，看看结果如何。

**结果输出**：
```text
        GPU0    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      0-31,64-95              N/A             N/A
```
`NUMA`亲和性变成了`N/A`，表示内存分配不在`NUMA Node 0`，而是跨节点了。

## 示例2：多GPU任务（同NUMA节点）

假如使用`GPU0-GPU3`进行`4`卡任务：

```bash
docker run --gpus '"device=0,1,2,3"' \
--cpuset-cpus="0-31,64-95" \
--cpuset-mems="0" \
nvidia/cuda:12.2.0-base-ubuntu22.04 \
nvidia-smi topo -m
```

**简要说明**：
`4`张`GPU`都在`NUMA Node 0`，使用相同的`CPU`亲和性配置

**结果输出**：
```text
        GPU0    GPU1    GPU2    GPU3    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      PIX     NODE    NODE    0-31,64-95      0               N/A
GPU1    PIX      X      NODE    NODE    0-31,64-95      0               N/A
GPU2    NODE    NODE     X      PIX     0-31,64-95      0               N/A
GPU3    NODE    NODE    PIX      X      0-31,64-95      0               N/A
```

## 示例3：多GPU任务（跨NUMA节点）

当需要使用`5`张`GPU`时（`GPU0-4`，跨越两个`NUMA`节点），需要考虑跨`NUMA`节点的配置：

```bash
docker run --gpus '"device=0,1,2,3,4"' \
--cpuset-cpus="0-63,64-127" \
--cpuset-mems="0,1" \
nvidia/cuda:12.2.0-base-ubuntu22.04 \
nvidia-smi topo -m
```

**注意事项**：
- **跨NUMA场景**：`GPU0-3`在`NUMA Node 0`，`GPU4`在`NUMA Node 1`，必然存在跨`NUMA`通信
- `--cpuset-mems="0,1"`：允许使用两个`NUMA`节点的内存
- **性能优化建议**：如果可能，优先使用`4`卡（`GPU0-3`或`GPU4-7`，单`NUMA`节点）而非`5`卡，可避免跨`NUMA`开销

**结果输出**：
```text
        GPU0    GPU1    GPU2    GPU3    GPU4    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      PIX     NODE    NODE    SYS     0-31,64-95      0               N/A
GPU1    PIX      X      NODE    NODE    SYS     0-31,64-95      0               N/A
GPU2    NODE    NODE     X      PIX     SYS     0-31,64-95      0               N/A
GPU3    NODE    NODE    PIX      X      SYS     0-31,64-95      0               N/A
GPU4    SYS     SYS     SYS     SYS      X      32-63,96-127    1               N/A
```
