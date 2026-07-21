---
slug: "/observability/cadvisor-metrics"
title: "cAdvisor：容器资源指标与 Label 说明"
hide_title: true
keywords:
  ["cAdvisor", "Prometheus", "Kubernetes", "容器监控", "Kubelet", "Label", "cgroup"]
description: "系统介绍 cAdvisor 暴露的容器 CPU、内存、文件系统、网络、进程、规格和机器级资源指标，并逐项说明指标 Label。"
---

## 基本简介

`cAdvisor`采集容器和节点硬件资源统计，并以 `Prometheus` 格式暴露。它既可以独立运行，也常通过 `Kubernetes` `kubelet` 的`/metrics/cadvisor`端点提供容器资源指标。

`cAdvisor` 的容器指标包含一组基础 `Label`，具体由`ContainerLabelsFunc`决定。独立部署的 `cAdvisor` 默认会输出容器 ID、别名、镜像以及可配置的容器标签和环境变量；`Kubernetes` 集成环境通常会追加或替换为`namespace`、`pod`、`container`等 `Kubernetes` 维度。本文逐项列出固定 `Label`、当前常见 `Kubernetes` `Label`，以及源码确认的可配置动态 `Label`。

## 监控指标

组件源码地址：https://github.com/kubernetes/kubernetes/tree/master/vendor/github.com/google/cadvisor

Sample文件：[cadvisor.txt](/attachments/cadvisor.txt)

### cAdvisor 元信息

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `cadvisor_version_info` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>常量 `1`</span> | `cAdvisor` 版本信息指标，指标值恒为 `1`，通过 `Label` 标识内核、操作系统、`Docker`、`cAdvisor` 版本和修订号。 |

### 容器 CPU

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `container_cpu_cfs_periods_total` | `counter` | 累计计数 | 容器 `CFS` 配额控制周期的累计次数。 |
| `container_cpu_cfs_throttled_periods_total` | `counter` | 累计计数 | 容器因 `CFS` 配额被限流的周期累计次数。 |
| `container_cpu_cfs_throttled_seconds_total` | `counter` | 秒 | 容器因 `CFS` 配额被限流的累计时长。 |
| `container_cpu_load_average_10s` | `gauge` | 负载均值 | 容器最近 10 秒的 `CPU` 平均负载。 |
| `container_cpu_system_seconds_total` | `counter` | 秒 | 容器累计消耗的系统态 `CPU` 时间。 |
| `container_cpu_usage_seconds_total` | `counter` | 秒 | 容器累计消耗的 `CPU` 时间。 |
| `container_cpu_user_seconds_total` | `counter` | 秒 | 容器累计消耗的用户态 `CPU` 时间。 |

### 容器内存

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `container_memory_cache` | `gauge` | 字节 | 容器页缓存内存大小，单位为字节。 |
| `container_memory_failcnt` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | 容器内存使用触达限制的累计次数。 |
| `container_memory_failures_total` | `counter` | 累计计数 | 容器内存分配失败的累计次数。 |
| `container_memory_mapped_file` | `gauge` | 字节 | 容器内存映射文件大小，单位为字节。 |
| `container_memory_max_usage_bytes` | `gauge` | 字节 | 容器记录到的最大内存使用量，单位为字节。 |
| `container_memory_rss` | `gauge` | 字节 | 容器 `RSS` 内存大小，单位为字节。 |
| `container_memory_swap` | `gauge` | 字节 | 容器 `Swap` 使用量，单位为字节。 |
| `container_memory_usage_bytes` | `gauge` | 字节 | 容器当前内存使用量，包含所有已计入的内存，不区分最近是否访问。 |
| `container_memory_working_set_bytes` | `gauge` | 字节 | 容器当前工作集内存大小，单位为字节。 |

### 容器文件系统/I/O

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `container_blkio_device_usage_total` | `counter` | 字节 | 容器在块设备上的 `blkio` 字节使用量。 |
| `container_fs_inodes_free` | `gauge` | `inode` 数量 | 容器文件系统当前可用 `inode` 数。 |
| `container_fs_inodes_total` | `gauge` | `inode` 数量 | 容器文件系统 `inode` 总数。 |
| `container_fs_io_current` | `gauge` | 数量 | 容器文件系统当前正在进行的 `I/O` 数量。 |
| `container_fs_io_time_seconds_total` | `counter` | 秒 | 容器文件系统执行 `I/O` 累计消耗的时间。 |
| `container_fs_io_time_weighted_seconds_total` | `counter` | 秒 | 容器文件系统累计加权 `I/O` 时间。 |
| `container_fs_limit_bytes` | `gauge` | 字节 | 容器在该文件系统上可使用的字节数上限。 |
| `container_fs_read_seconds_total` | `counter` | 秒 | 容器文件系统读操作累计耗时。 |
| `container_fs_reads_bytes_total` | `counter` | 字节 | 容器文件系统累计读取字节数。 |
| `container_fs_reads_merged_total` | `counter` | 累计计数 | 容器文件系统累计合并读操作次数。 |
| `container_fs_reads_total` | `counter` | 累计计数 | 容器文件系统累计完成读操作次数。 |
| `container_fs_sector_reads_total` | `counter` | 累计计数 | 容器文件系统累计完成扇区读次数。 |
| `container_fs_sector_writes_total` | `counter` | 累计计数 | 容器文件系统累计完成扇区写次数。 |
| `container_fs_usage_bytes` | `gauge` | 字节 | 容器在该文件系统上已使用的字节数。 |
| `container_fs_write_seconds_total` | `counter` | 秒 | 容器文件系统写操作累计耗时。 |
| `container_fs_writes_bytes_total` | `counter` | 字节 | 容器文件系统累计写入字节数。 |
| `container_fs_writes_merged_total` | `counter` | 累计计数 | 容器文件系统累计合并写操作次数。 |
| `container_fs_writes_total` | `counter` | 累计计数 | 容器文件系统累计完成写操作次数。 |

### 容器网络

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `container_network_receive_bytes_total` | `counter` | 字节 | 容器网络累计接收字节数。 |
| `container_network_receive_errors_total` | `counter` | 累计计数 | 容器网络接收方向累计错误数。 |
| `container_network_receive_packets_dropped_total` | `counter` | 累计计数 | 容器网络接收方向累计丢包数。 |
| `container_network_receive_packets_total` | `counter` | 累计计数 | 容器网络累计接收包数。 |
| `container_network_transmit_bytes_total` | `counter` | 字节 | 容器网络累计发送字节数。 |
| `container_network_transmit_errors_total` | `counter` | 累计计数 | 容器网络发送方向累计错误数。 |
| `container_network_transmit_packets_dropped_total` | `counter` | 累计计数 | 容器网络发送方向累计丢包数。 |
| `container_network_transmit_packets_total` | `counter` | 累计计数 | 容器网络累计发送包数。 |

### 容器规格

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `container_spec_cpu_period` | `gauge` | 配置值 | 容器配置的 `CPU CFS` 调度周期。 |
| `container_spec_cpu_quota` | `gauge` | 配置值 | 容器配置的 `CPU CFS` 配额。 |
| `container_spec_cpu_shares` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`CPU` 权重（`shares`）</span> | 容器配置的 `CPU` 权重（`shares`）。 |
| `container_spec_memory_limit_bytes` | `gauge` | 字节 | 容器配置的内存限制。 |
| `container_spec_memory_reservation_limit_bytes` | `gauge` | 字节 | 容器配置的内存预留限制。 |
| `container_spec_memory_swap_limit_bytes` | `gauge` | 字节 | 容器配置的内存加 `Swap` 限制。 |

### 容器运行状态

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `container_file_descriptors` | `gauge` | 数量 | 容器当前打开的文件描述符数量。 |
| `container_last_seen` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | `exporter` 最近一次看到该容器的时间。 |
| `container_processes` | `gauge` | 数量 | 容器内当前运行的进程数量。 |
| `container_scrape_error` | `gauge` | 状态值 | 采集容器指标出错时为 `1`，否则为 `0`。 |
| `container_sockets` | `gauge` | 数量 | 容器当前打开的套接字（`socket`）数量。 |
| `container_start_time_seconds` | `gauge` | `Unix` 时间戳（秒） | 容器启动时间，表示为 `Unix` 时间戳秒数。 |
| `container_tasks_state` | `gauge` | 数量 | 容器内处于指定状态的任务（`task`）数量。 |
| `container_threads` | `gauge` | 数量 | 容器内当前运行的线程数量。 |
| `container_threads_max` | `gauge` | 数量 | 容器内允许的最大线程数；值为 `0` 表示不限制。 |
| `container_ulimits_soft` | `gauge` | 配置值 | 容器根进程的软 `ulimit` 值；除 `priority`、`nice` 外，`-1` 表示不限制。 |

### 机器级资源

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `machine_cpu_cores` | `gauge` | `CPU` 核数 | 机器逻辑 `CPU` 核数。 |
| `machine_cpu_physical_cores` | `gauge` | `CPU` 核数 | 机器物理 `CPU` 核数。 |
| `machine_cpu_sockets` | `gauge` | `CPU` 插槽数 | 机器 `CPU` 插槽数量。 |
| `machine_memory_bytes` | `gauge` | 字节 | 机器已安装内存总量。 |
| `machine_nvm_avg_power_budget_watts` | `gauge` | 瓦特 | `NVM` 平均功耗预算。 |
| `machine_nvm_capacity` | `gauge` | 字节 | 按 `NVM` 模式标识的 `NVM` 容量。 |
| `machine_scrape_error` | `gauge` | 状态值 | 采集机器级指标出错时为 `1`，否则为 `0`。 |

## 指标详情

本节逐项说明指标含义、`Label` 和 `Prometheus` 文本格式示例。示例用于展示暴露格式，实际 `HELP` 文案、`Label` 集合和值以采集端输出为准。直方图指标的`le`只出现在`_bucket`序列；`Summary` 指标的`quantile`只出现在分位序列。

### `cadvisor_version_info`

`cAdvisor` 版本信息指标，指标值恒为 `1`，通过 `Label` 标识内核、操作系统、`Docker`、`cAdvisor` 版本和修订号。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `cadvisorRevision` | `空字符串` | `cAdvisor` 构建修订版本。 |
| `cadvisorVersion` | `空字符串` | `cAdvisor` 版本。 |
| `dockerVersion` | `v19.3.9-tke.1` | `Docker` 版本。 |
| `kernelVersion` | `5.4.119-19-0009.11` | 内核版本。 |
| `osVersion` | `TencentOS Server 3.1 (Final)` | 操作系统版本。 |

```prometheus
# HELP cadvisor_version_info cAdvisor 版本信息指标，指标值恒为 1，通过 Label 标识内核、操作系统、Docker、cAdvisor 版本和修订号
# TYPE cadvisor_version_info gauge
cadvisor_version_info{cadvisorRevision="",cadvisorVersion="",dockerVersion="v19.3.9-tke.1",kernelVersion="5.4.119-19-0009.11",osVersion="TencentOS Server 3.1 (Final)"} 1
```

### `container_blkio_device_usage_total`

容器在块设备上的 `blkio` 字节使用量。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `空字符串` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `major` | `7` | 块设备主设备号。 |
| `minor` | `0` | 块设备次设备号。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `operation` | `Async` | 块 `I/O` 操作类型。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_blkio_device_usage_total 容器在块设备上的 blkio 字节使用量
# TYPE container_blkio_device_usage_total counter
container_blkio_device_usage_total{container="",device="",id="/",image="",major="7",minor="0",name="",namespace="",operation="Async",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_cpu_cfs_periods_total`

容器 `CFS` 配额控制周期的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-log-agent-2fmt2` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_cfs_periods_total 容器 CFS 配额控制周期的累计次数
# TYPE container_cpu_cfs_periods_total counter
container_cpu_cfs_periods_total{container="",id="/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555",image="",name="",namespace="kube-system",pod="tke-log-agent-2fmt2",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_cpu_cfs_throttled_periods_total`

容器因 `CFS` 配额被限流的周期累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-log-agent-2fmt2` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_cfs_throttled_periods_total 容器因 CFS 配额被限流的周期累计次数
# TYPE container_cpu_cfs_throttled_periods_total counter
container_cpu_cfs_throttled_periods_total{container="",id="/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555",image="",name="",namespace="kube-system",pod="tke-log-agent-2fmt2",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_cpu_cfs_throttled_seconds_total`

容器因 `CFS` 配额被限流的累计时长。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-log-agent-2fmt2` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_cfs_throttled_seconds_total 容器因 CFS 配额被限流的累计时长
# TYPE container_cpu_cfs_throttled_seconds_total counter
container_cpu_cfs_throttled_seconds_total{container="",id="/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555",image="",name="",namespace="kube-system",pod="tke-log-agent-2fmt2",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_cpu_load_average_10s`

容器最近 10 秒的 `CPU` 平均负载。类型为`gauge`，单位/值为：负载均值。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_load_average_10s 容器最近 10 秒的 CPU 平均负载
# TYPE container_cpu_load_average_10s gauge
container_cpu_load_average_10s{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_cpu_system_seconds_total`

容器累计消耗的系统态 `CPU` 时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_system_seconds_total 容器累计消耗的系统态 CPU 时间
# TYPE container_cpu_system_seconds_total counter
container_cpu_system_seconds_total{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_cpu_usage_seconds_total`

容器累计消耗的 `CPU` 时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `cpu` | `total` | `CPU` 维度，`cAdvisor` 常见取值为`total`或单个 `CPU` 标识，具体取决于运行时和采集版本。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_usage_seconds_total 容器累计消耗的 CPU 时间
# TYPE container_cpu_usage_seconds_total counter
container_cpu_usage_seconds_total{container="",cpu="total",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_cpu_user_seconds_total`

容器累计消耗的用户态 `CPU` 时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_cpu_user_seconds_total 容器累计消耗的用户态 CPU 时间
# TYPE container_cpu_user_seconds_total counter
container_cpu_user_seconds_total{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_file_descriptors`

容器当前打开的文件描述符数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_file_descriptors 容器当前打开的文件描述符数量
# TYPE container_file_descriptors gauge
container_file_descriptors{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_fs_inodes_free`

容器文件系统当前可用 `inode` 数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_inodes_free 容器文件系统当前可用 inode 数
# TYPE container_fs_inodes_free gauge
container_fs_inodes_free{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_fs_inodes_total`

容器文件系统 `inode` 总数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_inodes_total 容器文件系统 inode 总数
# TYPE container_fs_inodes_total gauge
container_fs_inodes_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_fs_io_current`

容器文件系统当前正在进行的 `I/O` 数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_io_current 容器文件系统当前正在进行的 I/O 数量
# TYPE container_fs_io_current gauge
container_fs_io_current{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_fs_io_time_seconds_total`

容器文件系统执行 `I/O` 累计消耗的时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_io_time_seconds_total 容器文件系统执行 I/O 累计消耗的时间
# TYPE container_fs_io_time_seconds_total counter
container_fs_io_time_seconds_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_fs_io_time_weighted_seconds_total`

容器文件系统累计加权 `I/O` 时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_io_time_weighted_seconds_total 容器文件系统累计加权 I/O 时间
# TYPE container_fs_io_time_weighted_seconds_total counter
container_fs_io_time_weighted_seconds_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_fs_limit_bytes`

容器在该文件系统上可使用的字节数上限。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_limit_bytes 容器在该文件系统上可使用的字节数上限
# TYPE container_fs_limit_bytes gauge
container_fs_limit_bytes{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_fs_read_seconds_total`

容器文件系统读操作累计耗时。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_read_seconds_total 容器文件系统读操作累计耗时
# TYPE container_fs_read_seconds_total counter
container_fs_read_seconds_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_fs_reads_bytes_total`

容器文件系统累计读取字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `空字符串` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_reads_bytes_total 容器文件系统累计读取字节数
# TYPE container_fs_reads_bytes_total counter
container_fs_reads_bytes_total{container="",device="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_fs_reads_merged_total`

容器文件系统累计合并读操作次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_reads_merged_total 容器文件系统累计合并读操作次数
# TYPE container_fs_reads_merged_total counter
container_fs_reads_merged_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_fs_reads_total`

容器文件系统累计完成读操作次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `空字符串` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_reads_total 容器文件系统累计完成读操作次数
# TYPE container_fs_reads_total counter
container_fs_reads_total{container="",device="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_fs_sector_reads_total`

容器文件系统累计完成扇区读次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_sector_reads_total 容器文件系统累计完成扇区读次数
# TYPE container_fs_sector_reads_total counter
container_fs_sector_reads_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_fs_sector_writes_total`

容器文件系统累计完成扇区写次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_sector_writes_total 容器文件系统累计完成扇区写次数
# TYPE container_fs_sector_writes_total counter
container_fs_sector_writes_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_fs_usage_bytes`

容器在该文件系统上已使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_usage_bytes 容器在该文件系统上已使用的字节数
# TYPE container_fs_usage_bytes gauge
container_fs_usage_bytes{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_fs_write_seconds_total`

容器文件系统写操作累计耗时。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_write_seconds_total 容器文件系统写操作累计耗时
# TYPE container_fs_write_seconds_total counter
container_fs_write_seconds_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 12345.67
```

### `container_fs_writes_bytes_total`

容器文件系统累计写入字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `空字符串` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_writes_bytes_total 容器文件系统累计写入字节数
# TYPE container_fs_writes_bytes_total counter
container_fs_writes_bytes_total{container="",device="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_fs_writes_merged_total`

容器文件系统累计合并写操作次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `/dev/shm` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_writes_merged_total 容器文件系统累计合并写操作次数
# TYPE container_fs_writes_merged_total counter
container_fs_writes_merged_total{container="",device="/dev/shm",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_fs_writes_total`

容器文件系统累计完成写操作次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `device` | `空字符串` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_fs_writes_total 容器文件系统累计完成写操作次数
# TYPE container_fs_writes_total counter
container_fs_writes_total{container="",device="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_last_seen`

`exporter` 最近一次看到该容器的时间。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_last_seen exporter 最近一次看到该容器的时间
# TYPE container_last_seen gauge
container_last_seen{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1700000000
```

### `container_memory_cache`

容器页缓存内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_cache 容器页缓存内存大小，单位为字节
# TYPE container_memory_cache gauge
container_memory_cache{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_memory_failcnt`

容器内存使用触达限制的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_failcnt 容器内存使用触达限制的累计次数
# TYPE container_memory_failcnt counter
container_memory_failcnt{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_memory_failures_total`

容器内存分配失败的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `failure_type` | `pgfault` | 内存失败类型。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `scope` | `container` | 内存失败统计范围。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_failures_total 容器内存分配失败的累计次数
# TYPE container_memory_failures_total counter
container_memory_failures_total{container="",failure_type="pgfault",id="/",image="",name="",namespace="",pod="",scope="container",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_memory_mapped_file`

容器内存映射文件大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_mapped_file 容器内存映射文件大小，单位为字节
# TYPE container_memory_mapped_file gauge
container_memory_mapped_file{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_memory_max_usage_bytes`

容器记录到的最大内存使用量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_max_usage_bytes 容器记录到的最大内存使用量，单位为字节
# TYPE container_memory_max_usage_bytes gauge
container_memory_max_usage_bytes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_memory_rss`

容器 `RSS` 内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_rss 容器 RSS 内存大小，单位为字节
# TYPE container_memory_rss gauge
container_memory_rss{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_memory_swap`

容器 `Swap` 使用量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_swap 容器 Swap 使用量，单位为字节
# TYPE container_memory_swap gauge
container_memory_swap{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_memory_usage_bytes`

容器当前内存使用量，包含所有已计入的内存，不区分最近是否访问。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_usage_bytes 容器当前内存使用量，包含所有已计入的内存，不区分最近是否访问
# TYPE container_memory_usage_bytes gauge
container_memory_usage_bytes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_memory_working_set_bytes`

容器当前工作集内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_memory_working_set_bytes 容器当前工作集内存大小，单位为字节
# TYPE container_memory_working_set_bytes gauge
container_memory_working_set_bytes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_network_receive_bytes_total`

容器网络累计接收字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_receive_bytes_total 容器网络累计接收字节数
# TYPE container_network_receive_bytes_total counter
container_network_receive_bytes_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_network_receive_errors_total`

容器网络接收方向累计错误数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_receive_errors_total 容器网络接收方向累计错误数
# TYPE container_network_receive_errors_total counter
container_network_receive_errors_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_network_receive_packets_dropped_total`

容器网络接收方向累计丢包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_receive_packets_dropped_total 容器网络接收方向累计丢包数
# TYPE container_network_receive_packets_dropped_total counter
container_network_receive_packets_dropped_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_network_receive_packets_total`

容器网络累计接收包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_receive_packets_total 容器网络累计接收包数
# TYPE container_network_receive_packets_total counter
container_network_receive_packets_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_network_transmit_bytes_total`

容器网络累计发送字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_transmit_bytes_total 容器网络累计发送字节数
# TYPE container_network_transmit_bytes_total counter
container_network_transmit_bytes_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_network_transmit_errors_total`

容器网络发送方向累计错误数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_transmit_errors_total 容器网络发送方向累计错误数
# TYPE container_network_transmit_errors_total counter
container_network_transmit_errors_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_network_transmit_packets_dropped_total`

容器网络发送方向累计丢包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_transmit_packets_dropped_total 容器网络发送方向累计丢包数
# TYPE container_network_transmit_packets_dropped_total counter
container_network_transmit_packets_dropped_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_network_transmit_packets_total`

容器网络累计发送包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `interface` | `eni07359beb4fe` | 网络接口名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_network_transmit_packets_total 容器网络累计发送包数
# TYPE container_network_transmit_packets_total counter
container_network_transmit_packets_total{container="",id="/",image="",interface="eni07359beb4fe",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 42
```

### `container_processes`

容器内当前运行的进程数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_processes 容器内当前运行的进程数量
# TYPE container_processes gauge
container_processes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_scrape_error`

采集容器指标出错时为 `1`，否则为 `0`。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `id` | `/kubepods/...` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `name` | `container-name` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `image` | `nginx:1.25` | 容器镜像名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `container` | `nginx` | 容器名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_scrape_error 采集容器指标出错时为 1，否则为 0
# TYPE container_scrape_error gauge
container_scrape_error{id="/kubepods/...",name="container-name",image="nginx:1.25",namespace="default",pod="nginx-xxxxx",container="nginx",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_sockets`

容器当前打开的套接字（`socket`）数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_sockets 容器当前打开的套接字（socket）数量
# TYPE container_sockets gauge
container_sockets{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_spec_cpu_period`

容器配置的 `CPU CFS` 调度周期。类型为`gauge`，单位/值为：配置值。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_spec_cpu_period 容器配置的 CPU CFS 调度周期
# TYPE container_spec_cpu_period gauge
container_spec_cpu_period{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_spec_cpu_quota`

容器配置的 `CPU CFS` 配额。类型为`gauge`，单位/值为：配置值。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-log-agent-2fmt2` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_spec_cpu_quota 容器配置的 CPU CFS 配额
# TYPE container_spec_cpu_quota gauge
container_spec_cpu_quota{container="",id="/kubepods/burstable/podc6951b6e-49c8-45ca-a9f6-998c9447f555",image="",name="",namespace="kube-system",pod="tke-log-agent-2fmt2",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_spec_cpu_shares`

容器配置的 `CPU` 权重（shares）。类型为`gauge`，单位/值为：`CPU` 权重（shares）。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_spec_cpu_shares 容器配置的 CPU 权重（shares）
# TYPE container_spec_cpu_shares gauge
container_spec_cpu_shares{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_spec_memory_limit_bytes`

容器配置的内存限制。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_spec_memory_limit_bytes 容器配置的内存限制
# TYPE container_spec_memory_limit_bytes gauge
container_spec_memory_limit_bytes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_spec_memory_reservation_limit_bytes`

容器配置的内存预留限制。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_spec_memory_reservation_limit_bytes 容器配置的内存预留限制
# TYPE container_spec_memory_reservation_limit_bytes gauge
container_spec_memory_reservation_limit_bytes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_spec_memory_swap_limit_bytes`

容器配置的内存加 `Swap` 限制。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_spec_memory_swap_limit_bytes 容器配置的内存加 Swap 限制
# TYPE container_spec_memory_swap_limit_bytes gauge
container_spec_memory_swap_limit_bytes{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1048576
```

### `container_start_time_seconds`

容器启动时间，表示为 `Unix` 时间戳秒数。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_start_time_seconds 容器启动时间，表示为 Unix 时间戳秒数
# TYPE container_start_time_seconds gauge
container_start_time_seconds{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1700000000
```

### `container_tasks_state`

容器内处于指定状态的任务（`task`）数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `state` | `iowaiting` | 状态枚举值，具体含义由指标上下文决定。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_tasks_state 容器内处于指定状态的任务（task）数量
# TYPE container_tasks_state gauge
container_tasks_state{container="",id="/",image="",name="",namespace="",pod="",state="iowaiting",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_threads`

容器内当前运行的线程数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_threads 容器内当前运行的线程数量
# TYPE container_threads gauge
container_threads{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_threads_max`

容器内允许的最大线程数；值为 `0` 表示不限制。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_threads_max 容器内允许的最大线程数；值为 0 表示不限制
# TYPE container_threads_max gauge
container_threads_max{container="",id="/",image="",name="",namespace="",pod="",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `container_ulimits_soft`

容器根进程的软 `ulimit` 值；除 `priority`、`nice` 外，`-1` 表示不限制。类型为`gauge`，单位/值为：配置值。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `空字符串` | 容器名称。 |
| `id` | `/` | `cgroup` 或容器 ID；通过 `kubelet` 集成暴露时，常见取值是 `cgroup` 路径。 |
| `image` | `空字符串` | 容器镜像名称。 |
| `name` | `空字符串` | `cAdvisor` 容器别名或容器名称；通过 `kubelet` 集成暴露时可能为空。 |
| `namespace` | `空字符串` | `Kubernetes` 命名空间。 |
| `pod` | `空字符串` | `Pod` 名称。 |
| `ulimit` | `max_open_files` | `ulimit` 名称。 |
| `container_label_KEY` | `container_label_io_kubernetes_pod_name="nginx"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器动态标签；实际后缀由容器标签键清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |
| `container_env_KEY` | `container_env_ENV_NAME="value"` | 独立部署的 `cAdvisor` 默认标签函数可能输出的容器环境变量动态标签；实际后缀由环境变量名清洗得到。通过 `kubelet` 集成暴露时不一定输出。 |

```prometheus
# HELP container_ulimits_soft 容器根进程的软 ulimit 值；除 priority、nice 外，-1 表示不限制
# TYPE container_ulimits_soft gauge
container_ulimits_soft{container="",id="/",image="",name="",namespace="",pod="",ulimit="max_open_files",container_label_io_kubernetes_pod_name="nginx",container_env_ENV_NAME="value"} 1
```

### `machine_cpu_cores`

机器逻辑 `CPU` 核数。类型为`gauge`，单位/值为：`CPU` 核数。

| Label | 示例值 | 含义 |
|---|---|---|
| `boot_id` | `f7faea96-a17c-4713-9180-cf2108f700c2` | 机器 boot ID。 |
| `machine_id` | `a55f24e7c88e4c169a750377751e75e8` | 机器 ID。 |
| `system_uuid` | `a55f24e7-c88e-4c16-9a75-0377751e75e8` | 机器或节点 system UUID。 |

```prometheus
# HELP machine_cpu_cores 机器逻辑 CPU 核数
# TYPE machine_cpu_cores gauge
machine_cpu_cores{boot_id="f7faea96-a17c-4713-9180-cf2108f700c2",machine_id="a55f24e7c88e4c169a750377751e75e8",system_uuid="a55f24e7-c88e-4c16-9a75-0377751e75e8"} 4
```

### `machine_cpu_physical_cores`

机器物理 `CPU` 核数。类型为`gauge`，单位/值为：`CPU` 核数。

| Label | 示例值 | 含义 |
|---|---|---|
| `boot_id` | `f7faea96-a17c-4713-9180-cf2108f700c2` | 机器 boot ID。 |
| `machine_id` | `a55f24e7c88e4c169a750377751e75e8` | 机器 ID。 |
| `system_uuid` | `a55f24e7-c88e-4c16-9a75-0377751e75e8` | 机器或节点 system UUID。 |

```prometheus
# HELP machine_cpu_physical_cores 机器物理 CPU 核数
# TYPE machine_cpu_physical_cores gauge
machine_cpu_physical_cores{boot_id="f7faea96-a17c-4713-9180-cf2108f700c2",machine_id="a55f24e7c88e4c169a750377751e75e8",system_uuid="a55f24e7-c88e-4c16-9a75-0377751e75e8"} 4
```

### `machine_cpu_sockets`

机器 `CPU` 插槽数量。类型为`gauge`，单位/值为：`CPU` 插槽数。

| Label | 示例值 | 含义 |
|---|---|---|
| `boot_id` | `f7faea96-a17c-4713-9180-cf2108f700c2` | 机器 boot ID。 |
| `machine_id` | `a55f24e7c88e4c169a750377751e75e8` | 机器 ID。 |
| `system_uuid` | `a55f24e7-c88e-4c16-9a75-0377751e75e8` | 机器或节点 system UUID。 |

```prometheus
# HELP machine_cpu_sockets 机器 CPU 插槽数量
# TYPE machine_cpu_sockets gauge
machine_cpu_sockets{boot_id="f7faea96-a17c-4713-9180-cf2108f700c2",machine_id="a55f24e7c88e4c169a750377751e75e8",system_uuid="a55f24e7-c88e-4c16-9a75-0377751e75e8"} 1
```

### `machine_memory_bytes`

机器已安装内存总量。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `boot_id` | `f7faea96-a17c-4713-9180-cf2108f700c2` | 机器 boot ID。 |
| `machine_id` | `a55f24e7c88e4c169a750377751e75e8` | 机器 ID。 |
| `system_uuid` | `a55f24e7-c88e-4c16-9a75-0377751e75e8` | 机器或节点 system UUID。 |

```prometheus
# HELP machine_memory_bytes 机器已安装内存总量
# TYPE machine_memory_bytes gauge
machine_memory_bytes{boot_id="f7faea96-a17c-4713-9180-cf2108f700c2",machine_id="a55f24e7c88e4c169a750377751e75e8",system_uuid="a55f24e7-c88e-4c16-9a75-0377751e75e8"} 1048576
```

### `machine_nvm_avg_power_budget_watts`

`NVM` 平均功耗预算。类型为`gauge`，单位/值为：瓦特。

| Label | 示例值 | 含义 |
|---|---|---|
| `boot_id` | `f7faea96-a17c-4713-9180-cf2108f700c2` | 机器 boot ID。 |
| `machine_id` | `a55f24e7c88e4c169a750377751e75e8` | 机器 ID。 |
| `system_uuid` | `a55f24e7-c88e-4c16-9a75-0377751e75e8` | 机器或节点 system UUID。 |

```prometheus
# HELP machine_nvm_avg_power_budget_watts NVM 平均功耗预算
# TYPE machine_nvm_avg_power_budget_watts gauge
machine_nvm_avg_power_budget_watts{boot_id="f7faea96-a17c-4713-9180-cf2108f700c2",machine_id="a55f24e7c88e4c169a750377751e75e8",system_uuid="a55f24e7-c88e-4c16-9a75-0377751e75e8"} 120
```

### `machine_nvm_capacity`

按 `NVM` 模式标识的 `NVM` 容量。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `boot_id` | `f7faea96-a17c-4713-9180-cf2108f700c2` | 机器 boot ID。 |
| `machine_id` | `a55f24e7c88e4c169a750377751e75e8` | 机器 ID。 |
| `mode` | `app_direct_mode` | `NVM` 容量模式，例如 `memory mode` 或 `app direct mode`。 |
| `system_uuid` | `a55f24e7-c88e-4c16-9a75-0377751e75e8` | 机器或节点 system UUID。 |

```prometheus
# HELP machine_nvm_capacity 按 NVM 模式标识的 NVM 容量
# TYPE machine_nvm_capacity gauge
machine_nvm_capacity{boot_id="f7faea96-a17c-4713-9180-cf2108f700c2",machine_id="a55f24e7c88e4c169a750377751e75e8",mode="app_direct_mode",system_uuid="a55f24e7-c88e-4c16-9a75-0377751e75e8"} 1048576
```

### `machine_scrape_error`

采集机器级指标出错时为 `1`，否则为 `0`。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP machine_scrape_error 采集机器级指标出错时为 1，否则为 0
# TYPE machine_scrape_error gauge
machine_scrape_error 1
```




## 资料来源

- [cAdvisor 上游仓库](https://github.com/google/cadvisor)
- [cAdvisor Prometheus metrics 文档](https://github.com/google/cadvisor/blob/master/docs/storage/prometheus.md)
- [cAdvisor Prometheus metrics 源码](https://github.com/google/cadvisor/blob/master/lib/metrics/prometheus.go)
- [Kubernetes Node metrics data](https://kubernetes.io/docs/reference/instrumentation/node-metrics/)
