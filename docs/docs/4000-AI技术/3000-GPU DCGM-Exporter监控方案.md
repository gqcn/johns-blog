---
slug: "/ai/gpu-dcgm-exporter"
title: "GPU DCGM-Exporter监控方案"
hide_title: true
keywords:
  [
    "GPU监控", "DCGM", "Prometheus", "Kubernetes", "云原生", "AI算力", "GPU指标", "性能监控", "资源管理"
  ]
description: "本文详细介绍GPU DCGM-Exporter监控方案，提供完整的监控指标列表和Prometheus配置示例，帮助用户构建高效的GPU监控系统。"
---


## 1. DCGM-Exporter简介

`NVIDIA DCGM-Exporter`是一个专为`GPU`监控设计的强大工具，它基于`DCGM (Data Center GPU Manager) API`，能够收集`NVIDIA GPU`的详细指标并以`Prometheus`格式暴露。它是`NVIDIA GPU Operator`的一部分，但也可以独立部署使用。

作为目前最全面、最易于集成的`GPU监控解决方案`，`DCGM-Exporter`特别适合在`Kubernetes`环境中部署，为`AI训练`和`高性能计算`提供可靠的监控支持。

> **重要说明：** `NVIDIA DCGM-Exporter`仅适用于`NVIDIA`品牌的`GPU硬件`，如`Tesla`、`Quadro`、`GeForce`等系列。它不支持其他厂商的`GPU`产品，如`AMD`的`Radeon`系列、`Intel`的`Xe`系列、`华为`的`昇腾`系列或`寒武纪`的`MLU`系列等。如果您的环境中使用了非`NVIDIA`的`GPU`，需要采用相应厂商提供的监控解决方案。

## 2. 主要特点

- **全面的指标收集**：提供超过`40`种`GPU`相关指标，包括利用率、内存、温度、功耗等
- **低开销**：相比直接调用`nvidia-smi`，`DCGM-Exporter`的资源消耗更低
- **高可靠性**：由`NVIDIA`官方维护，确保与各代`GPU`的兼容性
- **云原生友好**：提供容器化部署方案，易于在`Kubernetes`环境中集成
- **可扩展性**：支持从单个节点到大型集群的监控

## 3. 架构

`DCGM-Exporter`的基本架构如下：

```
+------------------+    +---------------+    +-------------+    +------------+
| NVIDIA GPU(s)    |<---| NVIDIA Driver |<---| DCGM        |<---| DCGM       |
| (Tesla, Quadro,  |    | (440.xx+)     |    | (2.0+)      |    | Exporter   |
|  etc.)           |    |               |    |             |    |            |
+------------------+    +---------------+    +-------------+    +------------+
                                                                      ^
                                                                      |
                                                                      v
                                                               +------------+
                                                               | Prometheus |
                                                               |            |
                                                               +------------+
                                                                      ^
                                                                      |
                                                                      v
                                                               +------------+
                                                               | Grafana    |
                                                               | Dashboard  |
                                                               +------------+
```


## 4. DCGM-Exporter提供的监控指标

`DCGM-Exporter`提供了丰富的`GPU`监控指标，以下是主要指标的详细说明：

| 指标名称 | 描述 | 单位 | 重要性 |
|---------|------|-----|--------|
| `DCGM_FI_DEV_GPU_UTIL` | `GPU`利用率 | `%` | 高 |
| `DCGM_FI_DEV_MEM_COPY_UTIL` | 内存拷贝引擎利用率 | `%` | 中 |
| `DCGM_FI_DEV_FB_TOTAL` | 显存总量 | `MiB` | 中 |
| `DCGM_FI_DEV_FB_FREE` | 空闲显存 | `MiB` | 高 |
| `DCGM_FI_DEV_FB_USED` | 已使用显存 | `MiB` | 高 |
| `DCGM_FI_DEV_POWER_USAGE` | `GPU`功耗 | `W` | 高 |
| `DCGM_FI_DEV_POWER_LIMIT` | `GPU`功耗限制 | `W` | 中 |
| `DCGM_FI_DEV_GPU_TEMP` | `GPU`温度 | `°C` | 高 |
| `DCGM_FI_DEV_SM_CLOCK` | `SM`时钟频率 | `MHz` | 中 |
| `DCGM_FI_DEV_MEM_CLOCK` | 显存时钟频率 | `MHz` | 中 |
| `DCGM_FI_DEV_PCIE_TX_THROUGHPUT` | `PCIe`发送吞吐量 | `KB/s` | 中 |
| `DCGM_FI_DEV_PCIE_RX_THROUGHPUT` | `PCIe`接收吞吐量 | `KB/s` | 中 |
| `DCGM_FI_DEV_PCIE_REPLAY_COUNTER` | `PCIe`重传计数器 | 计数 | 低 |
| `DCGM_FI_DEV_XID_ERRORS` | `XID`错误 | 计数 | 高 |
| `DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL` | `NVLink`总带宽 | `KB/s` | 高 |
| `DCGM_FI_DEV_VGPU_LICENSE_STATUS` | `vGPU`许可状态 | 状态码 | 低 |
| `DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS` | 不可纠正但已重映射的内存行 | 计数 | 中 |
| `DCGM_FI_DEV_CORRECTABLE_ERRORS` | 可纠正的`ECC`错误 | 计数 | 中 |
| `DCGM_FI_DEV_UNCORRECTABLE_ERRORS` | 不可纠正的`ECC`错误 | 计数 | 高 |
| `DCGM_FI_DEV_ECC_ENABLED` | `ECC`内存是否启用 | 状态码 | 低 |
| `DCGM_FI_DEV_RETIRED_PAGES_SBE` | 单比特`ECC`错误导致的页面退役 | 计数 | 中 |
| `DCGM_FI_DEV_RETIRED_PAGES_DBE` | 双比特`ECC`错误导致的页面退役 | 计数 | 高 |
| `DCGM_FI_DEV_ENCODER_STATS_SESSION_COUNT` | `NVENC`编码器会话数 | 计数 | 中 |
| `DCGM_FI_DEV_ENCODER_STATS_AVERAGE_FPS` | `NVENC`编码器平均FPS | `FPS` | 中 |
| `DCGM_FI_DEV_ENCODER_STATS_AVERAGE_LATENCY` | `NVENC`编码器平均延迟 | `μs` | 中 |
| `DCGM_FI_DEV_DECODER_STATS_SESSION_COUNT` | `NVDEC`解码器会话数 | 计数 | 中 |
| `DCGM_FI_DEV_DECODER_STATS_AVERAGE_FPS` | `NVDEC`解码器平均FPS | `FPS` | 中 |
| `DCGM_FI_DEV_DECODER_STATS_AVERAGE_LATENCY` | `NVDEC`解码器平均延迟 | `μs` | 中 |
| `DCGM_FI_DEV_COMPUTE_PIDS` | 正在使用`GPU`的计算进程ID | 列表 | 高 |
| `DCGM_FI_DEV_GRAPHICS_PIDS` | 正在使用`GPU`的图形进程ID | 列表 | 中 |
| `DCGM_FI_DEV_TENSOR_ACTIVE` | `Tensor`核心活跃度 | `%` | 高 |
| `DCGM_FI_DEV_NVLINK_CRC_FLIT_ERROR_COUNT_TOTAL` | `NVLink` CRC错误计数 | 计数 | 中 |
| `DCGM_FI_DEV_NVLINK_ECC_ERROR_COUNT_TOTAL` | `NVLink` ECC错误计数 | 计数 | 中 |

参考`Prometheus`的采集内容如下：
```json
# HELP DCGM_FI_DEV_SM_CLOCK SM clock frequency (in MHz).
# TYPE DCGM_FI_DEV_SM_CLOCK gauge
DCGM_FI_DEV_SM_CLOCK{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1410
DCGM_FI_DEV_SM_CLOCK{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1410
DCGM_FI_DEV_SM_CLOCK{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1410
DCGM_FI_DEV_SM_CLOCK{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
DCGM_FI_DEV_SM_CLOCK{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
DCGM_FI_DEV_SM_CLOCK{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
DCGM_FI_DEV_SM_CLOCK{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
DCGM_FI_DEV_SM_CLOCK{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
DCGM_FI_DEV_SM_CLOCK{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
DCGM_FI_DEV_SM_CLOCK{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210
# HELP DCGM_FI_DEV_MEM_CLOCK Memory clock frequency (in MHz).
# TYPE DCGM_FI_DEV_MEM_CLOCK gauge
DCGM_FI_DEV_MEM_CLOCK{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
DCGM_FI_DEV_MEM_CLOCK{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 1593
# HELP DCGM_FI_DEV_MEMORY_TEMP Memory temperature (in C).
# TYPE DCGM_FI_DEV_MEMORY_TEMP gauge
DCGM_FI_DEV_MEMORY_TEMP{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 29
DCGM_FI_DEV_MEMORY_TEMP{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 29
DCGM_FI_DEV_MEMORY_TEMP{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 29
DCGM_FI_DEV_MEMORY_TEMP{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 25
DCGM_FI_DEV_MEMORY_TEMP{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 25
DCGM_FI_DEV_MEMORY_TEMP{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 28
DCGM_FI_DEV_MEMORY_TEMP{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 30
DCGM_FI_DEV_MEMORY_TEMP{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 25
DCGM_FI_DEV_MEMORY_TEMP{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 26
DCGM_FI_DEV_MEMORY_TEMP{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 28
# HELP DCGM_FI_DEV_GPU_TEMP GPU temperature (in C).
# TYPE DCGM_FI_DEV_GPU_TEMP gauge
DCGM_FI_DEV_GPU_TEMP{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 33
DCGM_FI_DEV_GPU_TEMP{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 33
DCGM_FI_DEV_GPU_TEMP{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 33
DCGM_FI_DEV_GPU_TEMP{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 27
DCGM_FI_DEV_GPU_TEMP{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 26
DCGM_FI_DEV_GPU_TEMP{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 31
DCGM_FI_DEV_GPU_TEMP{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 31
DCGM_FI_DEV_GPU_TEMP{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 26
DCGM_FI_DEV_GPU_TEMP{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 26
DCGM_FI_DEV_GPU_TEMP{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 29
# HELP DCGM_FI_DEV_POWER_USAGE Power draw (in W).
# TYPE DCGM_FI_DEV_POWER_USAGE gauge
DCGM_FI_DEV_POWER_USAGE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 78.174000
DCGM_FI_DEV_POWER_USAGE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 78.174000
DCGM_FI_DEV_POWER_USAGE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 78.446000
DCGM_FI_DEV_POWER_USAGE{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 55.942000
DCGM_FI_DEV_POWER_USAGE{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 53.752000
DCGM_FI_DEV_POWER_USAGE{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 56.990000
DCGM_FI_DEV_POWER_USAGE{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 58.643000
DCGM_FI_DEV_POWER_USAGE{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 54.581000
DCGM_FI_DEV_POWER_USAGE{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 57.145000
DCGM_FI_DEV_POWER_USAGE{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 55.011000
# HELP DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION Total energy consumption since boot (in mJ).
# TYPE DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION counter
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 257858316
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 257858316
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 257858316
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 187554325
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 179711977
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 190722266
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 196329125
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 182536958
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 191045467
DCGM_FI_DEV_TOTAL_ENERGY_CONSUMPTION{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 183986286
# HELP DCGM_FI_DEV_PCIE_REPLAY_COUNTER Total number of PCIe retries.
# TYPE DCGM_FI_DEV_PCIE_REPLAY_COUNTER counter
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_PCIE_REPLAY_COUNTER{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_GPU_UTIL GPU utilization (in %).
# TYPE DCGM_FI_DEV_GPU_UTIL gauge
DCGM_FI_DEV_GPU_UTIL{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_GPU_UTIL{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_GPU_UTIL{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_GPU_UTIL{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_GPU_UTIL{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_GPU_UTIL{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_GPU_UTIL{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_MEM_COPY_UTIL Memory utilization (in %).
# TYPE DCGM_FI_DEV_MEM_COPY_UTIL gauge
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_MEM_COPY_UTIL{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_ACCOUNTING_DATA Process Accounting Stats
# TYPE DCGM_FI_DEV_ACCOUNTING_DATA gauge
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ACCOUNTING_DATA{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_ENC_UTIL Encoder utilization (in %).
# TYPE DCGM_FI_DEV_ENC_UTIL gauge
DCGM_FI_DEV_ENC_UTIL{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ENC_UTIL{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ENC_UTIL{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ENC_UTIL{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ENC_UTIL{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ENC_UTIL{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ENC_UTIL{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_DEC_UTIL Decoder utilization (in %).
# TYPE DCGM_FI_DEV_DEC_UTIL gauge
DCGM_FI_DEV_DEC_UTIL{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_DEC_UTIL{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_DEC_UTIL{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_DEC_UTIL{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_DEC_UTIL{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_DEC_UTIL{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_DEC_UTIL{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_XID_ERRORS Value of the last XID error encountered.
# TYPE DCGM_FI_DEV_XID_ERRORS gauge
DCGM_FI_DEV_XID_ERRORS{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_XID_ERRORS{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_FB_FREE Framebuffer memory free (in MiB).
# TYPE DCGM_FI_DEV_FB_FREE gauge
DCGM_FI_DEV_FB_FREE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 19957
DCGM_FI_DEV_FB_FREE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 19957
DCGM_FI_DEV_FB_FREE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 19957
DCGM_FI_DEV_FB_FREE{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
DCGM_FI_DEV_FB_FREE{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
DCGM_FI_DEV_FB_FREE{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
DCGM_FI_DEV_FB_FREE{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
DCGM_FI_DEV_FB_FREE{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
DCGM_FI_DEV_FB_FREE{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
DCGM_FI_DEV_FB_FREE{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 81226
# HELP DCGM_FI_DEV_FB_USED Framebuffer memory used (in MiB).
# TYPE DCGM_FI_DEV_FB_USED gauge
DCGM_FI_DEV_FB_USED{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 10
DCGM_FI_DEV_FB_USED{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 10
DCGM_FI_DEV_FB_USED{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 10
DCGM_FI_DEV_FB_USED{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
DCGM_FI_DEV_FB_USED{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
DCGM_FI_DEV_FB_USED{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
DCGM_FI_DEV_FB_USED{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
DCGM_FI_DEV_FB_USED{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
DCGM_FI_DEV_FB_USED{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
DCGM_FI_DEV_FB_USED{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 2
# HELP DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS Number of remapped rows for uncorrectable errors
# TYPE DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS counter
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_UNCORRECTABLE_REMAPPED_ROWS{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS Number of remapped rows for correctable errors
# TYPE DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS counter
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_CORRECTABLE_REMAPPED_ROWS{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_ROW_REMAP_FAILURE Whether remapping of rows has failed
# TYPE DCGM_FI_DEV_ROW_REMAP_FAILURE gauge
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_ROW_REMAP_FAILURE{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL Total number of NVLink bandwidth counters for all lanes.
# TYPE DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL counter
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_NVLINK_BANDWIDTH_TOTAL{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION vGPU Per Process Utilization
# TYPE DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION gauge
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
DCGM_FI_DEV_VGPU_PER_PROCESS_UTILIZATION{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} ERROR - FAILED TO CONVERT TO STRING
# HELP DCGM_FI_DEV_VGPU_LICENSE_STATUS vGPU License status
# TYPE DCGM_FI_DEV_VGPU_LICENSE_STATUS gauge
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
DCGM_FI_DEV_VGPU_LICENSE_STATUS{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0
# HELP DCGM_FI_PROF_GR_ENGINE_ACTIVE Ratio of time the graphics engine is active (in %).
# TYPE DCGM_FI_PROF_GR_ENGINE_ACTIVE gauge
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_GR_ENGINE_ACTIVE{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
# HELP DCGM_FI_PROF_PIPE_TENSOR_ACTIVE Ratio of cycles the tensor (HMMA) pipe is active (in %).
# TYPE DCGM_FI_PROF_PIPE_TENSOR_ACTIVE gauge
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_PIPE_TENSOR_ACTIVE{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
# HELP DCGM_FI_PROF_DRAM_ACTIVE Ratio of cycles the device memory interface is active sending or receiving data (in %).
# TYPE DCGM_FI_PROF_DRAM_ACTIVE gauge
DCGM_FI_PROF_DRAM_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="3",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="5",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="0",UUID="GPU-1f027ee8-6e1e-2b8c-0108-3d370e5f0418",device="nvidia0",modelName="NVIDIA A800-SXM4-80GB",GPU_I_PROFILE="2g.20gb",GPU_I_ID="6",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
DCGM_FI_PROF_DRAM_ACTIVE{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 0.000000
# HELP DCGM_FI_PROF_PCIE_TX_BYTES The rate of data transmitted over the PCIe bus - including both protocol headers and data payloads - in bytes per second.
# TYPE DCGM_FI_PROF_PCIE_TX_BYTES gauge
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 143341
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 135469
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 172128
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 137399
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 154056
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 141257
DCGM_FI_PROF_PCIE_TX_BYTES{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 145473
# HELP DCGM_FI_PROF_PCIE_RX_BYTES The rate of data received over the PCIe bus - including both protocol headers and data payloads - in bytes per second.
# TYPE DCGM_FI_PROF_PCIE_RX_BYTES gauge
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="1",UUID="GPU-9e5b8fec-61bf-5124-a0a9-079af1b65cc6",device="nvidia1",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 211846
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="2",UUID="GPU-5022ce43-b44a-987b-71c3-dee05378a618",device="nvidia2",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 207094
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="3",UUID="GPU-f22db14d-1597-8eb1-78dc-d93765918c73",device="nvidia3",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 232474
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="4",UUID="GPU-a878a9f3-cf6d-b94c-38ba-892ed140c7ee",device="nvidia4",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 209486
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="5",UUID="GPU-a1dd6923-de62-e22b-c882-4d6f7e1ec5ce",device="nvidia5",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 216347
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="6",UUID="GPU-c07eb90d-74b0-d3b4-e6ce-f18687564243",device="nvidia6",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 210443
DCGM_FI_PROF_PCIE_RX_BYTES{gpu="7",UUID="GPU-4e75c9ab-0ed7-8a57-75f5-23761b9f053f",device="nvidia7",modelName="NVIDIA A800-SXM4-80GB",Hostname="msxf-hpc-64-35-ai",DCGM_FI_DRIVER_VERSION="535.129.03",DCGM_FI_PROCESS_NAME="/usr/bin/dcgm-exporter"} 213124
```

## 5. 安装部署

### 5.1 前提条件

- `NVIDIA`驱动 (`450.80.02`或更高版本)
- `NVIDIA DCGM` (`2.0.13`或更高版本)
- `Kubernetes`集群 (如果在`Kubernetes`环境中部署)
- `Prometheus`服务器

### 5.2 在`Kubernetes`中部署

使用`Helm`安装`DCGM-Exporter`：

```bash
# 添加NVIDIA Helm仓库
helm repo add nvidia https://helm.ngc.nvidia.com/nvidia
helm repo update

# 安装DCGM-Exporter
helm install --generate-name nvidia/dcgm-exporter
```

或者使用`YAML`清单文件部署：

```bash
# 克隆DCGM-Exporter仓库
git clone https://github.com/NVIDIA/dcgm-exporter.git
cd dcgm-exporter

# 部署DCGM-Exporter
kubectl apply -f deployment/kubernetes/dcgm-exporter-daemonset.yaml
```

### 5.3 在非Kubernetes环境中部署

使用`Docker`运行`DCGM-Exporter`：

```bash
docker run -d --gpus all --rm -p 9400:9400 nvcr.io/nvidia/k8s/dcgm-exporter:2.4.6-2.6.10-ubuntu20.04
```


## 6. Prometheus配置示例

### 6.1 Prometheus服务发现配置

以下是在`Kubernetes`环境中配置`Prometheus`抓取`DCGM-Exporter`指标的示例：

```yaml
scrape_configs:
  - job_name: 'dcgm-exporter'
    kubernetes_sd_configs:
      - role: endpoints
        namespaces:
          names:
            - default  # 替换为DCGM-Exporter所在的命名空间
    relabel_configs:
      - source_labels: [__meta_kubernetes_service_name]
        action: keep
        regex: dcgm-exporter
      - source_labels: [__meta_kubernetes_endpoint_port_name]
        action: keep
        regex: metrics
```

### 6.2 告警规则配置

以下是一些常用的`GPU`监控告警规则示例：

```yaml
groups:
- name: gpu-alerts
  rules:
  - alert: GPUHighUtilization
    expr: DCGM_FI_DEV_GPU_UTIL > 95
    for: 10m
    labels:
      severity: warning
    annotations:
      summary: "GPU利用率过高"
      description: "GPU {{ $labels.gpu }} 的利用率已经超过95%持续10分钟以上。"

  - alert: GPUHighTemperature
    expr: DCGM_FI_DEV_GPU_TEMP > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "GPU温度过高"
      description: "GPU {{ $labels.gpu }} 的温度已经超过85°C持续5分钟以上。"

  - alert: GPUMemoryNearlyFull
    expr: DCGM_FI_DEV_FB_FREE / DCGM_FI_DEV_FB_TOTAL * 100 < 5
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "GPU显存接近耗尽"
      description: "GPU {{ $labels.gpu }} 的可用显存低于5%持续5分钟以上。"

  - alert: GPUXidErrors
    expr: delta(DCGM_FI_DEV_XID_ERRORS[5m]) > 0
    labels:
      severity: critical
    annotations:
      summary: "GPU检测到XID错误"
      description: "GPU {{ $labels.gpu }} 在过去5分钟内检测到XID错误，这可能表示驱动程序崩溃或硬件问题。"

  - alert: GPUECCErrors
    expr: delta(DCGM_FI_DEV_UNCORRECTABLE_ERRORS[1h]) > 0
    labels:
      severity: critical
    annotations:
      summary: "GPU检测到不可纠正的ECC错误"
      description: "GPU {{ $labels.gpu }} 在过去1小时内检测到不可纠正的ECC错误，这可能表示硬件问题。"
```

## 7. 总结

`NVIDIA DCGM-Exporter`是目前最全面、最易于集成的`NVIDIA GPU监控解决方案`，特别适合在`Kubernetes`环境中部署。它提供了丰富的监控指标，可以帮助运维人员和开发人员全面了解`GPU`的使用情况、性能状态和健康状况。

通过将`DCGM-Exporter`与`Prometheus`和`Grafana`结合使用，可以构建一个强大的`GPU监控系统`，实现以下目标：

- 实时监控`GPU`资源使用情况
- 及时发现潜在的`GPU`硬件问题
- 优化`GPU`资源分配和调度
- 分析`GPU`性能瓶颈
- 预测`GPU`资源需求趋势

需要再次强调的是，`DCGM-Exporter`仅适用于`NVIDIA`的`GPU硬件`。如果您的环境中使用了来自不同厂商的`GPU`，则需要为每种类型的`GPU`部署相应的监控解决方案，并将它们的指标统一集成到您的监控平台中。

对于大规模`AI训练`和`推理集群`，完善的`GPU监控系统`是保障系统稳定运行和资源高效利用的关键组成部分。
