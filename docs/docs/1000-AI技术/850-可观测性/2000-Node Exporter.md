---
slug: "/ai/observability/node-exporter-metrics"
title: "Node Exporter：节点监控指标与 Label 说明"
hide_title: true
keywords:
  ["Node Exporter", "Prometheus", "节点监控", "主机指标", "Label", "CPU", "Filesystem", "Network"]
description: "系统介绍 Node Exporter 常用主机指标，覆盖 CPU、磁盘、文件系统、内存、网络、电源、温控和采集器自身指标，并逐项说明指标 Label。"
---

## 基本简介

`Node Exporter`是 `Prometheus` 官方维护的主机指标 `exporter`，用于采集类 `Unix` 系统暴露的硬件与操作系统指标。它通过可插拔 `collector` 暴露 `CPU`、磁盘、文件系统、内存、网络、系统时间、`uname`、采集器自身状态等指标。

不同操作系统、内核接口、`collector` 开关和 `node_exporter` 版本会影响最终输出。本文覆盖当前常用指标集合，并在指标详情中逐项列出公开资料、源码和指标输出中可确认的 `Label`；上游没有稳定公开完整 `Label` 契约的地方会明确备注。



## 监控指标

### 系统/采集器

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_boot_time_seconds` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | 系统最近一次启动的 `Unix` 时间戳，精确到微秒。 |
| `node_exporter_build_info` | `gauge` | 常量 `1` | `node_exporter` 构建信息指标，指标值恒为 `1`，通过 `Label` 标识版本、源码修订、分支、`Go` 版本、目标操作系统和目标架构。 |
| `node_scrape_collector_duration_seconds` | `gauge` | 秒 | `node_exporter` 单个 `collector` 执行一次采集所用时间。 |
| `node_scrape_collector_success` | `gauge` | 状态值 | `node_exporter` 单个 `collector` 最近一次采集是否成功。 |
| `node_textfile_scrape_error` | `gauge` | 状态值 | 打开或读取 `textfile` 文件出错时为 `1`，否则为 `0`。 |
| `node_time_seconds` | `gauge` | 秒 | 当前系统时间，表示为自 `1970-01-01` 起的秒数。 |
| `node_time_zone_offset_seconds` | `gauge` | 秒 | 系统时区相对 `UTC` 的偏移量，单位为秒。 |
| `node_uname_info` | `gauge` | 常量 `1` | `uname` 系统调用返回的系统信息，指标值恒为 `1`，通过 `Label` 标识系统属性。 |

### CPU/负载

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_cpu_seconds_total` | `counter` | 秒 | 各 `CPU` 在不同运行模式下累计消耗的时间。 |
| `node_load1` | `gauge` | 负载均值 | 最近 `1` 分钟的系统平均负载。 |
| `node_load15` | `gauge` | 负载均值 | 最近 `15` 分钟的系统平均负载。 |
| `node_load5` | `gauge` | 负载均值 | 最近 `5` 分钟的系统平均负载。 |

### 内存

| 指标名称 | 类型 | <span style={{whiteSpace: 'nowrap'}}>单位/值</span> | 说明 |
|---|---|---|---|
| `node_memory_active_bytes` | `gauge` | 字节 | 活跃内存大小，单位为字节。 |
| `node_memory_compressed_bytes` | `gauge` | 字节 | 压缩内存大小，单位为字节。 |
| `node_memory_free_bytes` | `gauge` | 字节 | 空闲内存大小，单位为字节。 |
| `node_memory_inactive_bytes` | `gauge` | 字节 | 非活跃内存大小，单位为字节。 |
| `node_memory_internal_bytes` | `gauge` | 字节 | 系统内部使用的内存大小，单位为字节。 |
| `node_memory_purgeable_bytes` | `gauge` | 字节 | 可清理内存大小，单位为字节。 |
| `node_memory_swap_total_bytes` | `gauge` | 字节 | `Swap` 总容量，单位为字节。 |
| `node_memory_swap_used_bytes` | `gauge` | 字节 | 已使用 `Swap` 大小，单位为字节。 |
| `node_memory_swapped_in_bytes_total` | `counter` | 字节 | 累计换入内存大小，单位为字节。 |
| `node_memory_swapped_out_bytes_total` | `counter` | 字节 | 累计换出内存大小，单位为字节。 |
| `node_memory_total_bytes` | `gauge` | 字节 | 物理内存总量，单位为字节。 |
| `node_memory_wired_bytes` | `gauge` | 字节 | `wired` 内存大小，单位为字节；该术语常见于 `Darwin/macOS` 内存统计。 |

### 磁盘 I/O

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_disk_read_bytes_total` | `counter` | 字节 | 磁盘成功读取的累计字节数。 |
| `node_disk_read_errors_total` | `counter` | 累计计数 | 磁盘读取错误的累计次数。 |
| `node_disk_read_retries_total` | `counter` | 累计计数 | 磁盘读取重试的累计次数。 |
| `node_disk_read_sectors_total` | `counter` | 累计计数 | 磁盘成功读取的累计扇区数。 |
| `node_disk_read_time_seconds_total` | `counter` | 秒 | 所有读操作累计消耗的时间。 |
| `node_disk_reads_completed_total` | `counter` | 累计计数 | 成功完成的磁盘读操作累计次数。 |
| `node_disk_write_errors_total` | `counter` | 累计计数 | 磁盘写入错误的累计次数。 |
| `node_disk_write_retries_total` | `counter` | 累计计数 | 磁盘写入重试的累计次数。 |
| `node_disk_write_time_seconds_total` | `counter` | 秒 | 所有写操作累计消耗的时间。 |
| `node_disk_writes_completed_total` | `counter` | 累计计数 | 成功完成的磁盘写操作累计次数。 |
| `node_disk_written_bytes_total` | `counter` | 字节 | 磁盘成功写入的累计字节数。 |
| `node_disk_written_sectors_total` | `counter` | 累计计数 | 磁盘成功写入的累计扇区数。 |

### 文件系统

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_filesystem_avail_bytes` | `gauge` | 字节 | 非 `root` 用户可用的文件系统空间，单位为字节。 |
| `node_filesystem_device_error` | `gauge` | 状态值 | 采集指定文件系统设备统计信息时是否发生错误。 |
| `node_filesystem_files` | `gauge` | `inode` 数量 | 文件系统 `inode` 总数。 |
| `node_filesystem_files_free` | `gauge` | `inode` 数量 | 文件系统可用 `inode` 数。 |
| `node_filesystem_free_bytes` | `gauge` | 字节 | 文件系统剩余空间，单位为字节。 |
| `node_filesystem_readonly` | `gauge` | 状态值 | 文件系统是否为只读状态。 |
| `node_filesystem_size_bytes` | `gauge` | 字节 | 文件系统总容量，单位为字节。 |

### 网络

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_network_noproto_total` | `counter` | 累计计数 | 网络设备因未知或不支持协议而丢弃的累计包数。 |
| `node_network_receive_bytes_total` | `counter` | 字节 | 网络设备累计接收字节数。 |
| `node_network_receive_drop_total` | `counter` | 累计计数 | 网络设备接收方向累计丢包数。 |
| `node_network_receive_errs_total` | `counter` | 累计计数 | 网络设备接收方向累计错误数。 |
| `node_network_receive_multicast_total` | `counter` | 累计计数 | 网络设备接收方向累计多播包数。 |
| `node_network_receive_packets_total` | `counter` | 累计计数 | 网络设备累计接收包数。 |
| `node_network_transmit_bytes_total` | `counter` | 字节 | 网络设备累计发送字节数。 |
| `node_network_transmit_colls_total` | `counter` | 累计计数 | 网络设备发送方向累计冲突数。 |
| `node_network_transmit_errs_total` | `counter` | 累计计数 | 网络设备发送方向累计错误数。 |
| `node_network_transmit_multicast_total` | `counter` | 累计计数 | 网络设备发送方向累计多播包数。 |
| `node_network_transmit_packets_total` | `counter` | 累计计数 | 网络设备累计发送包数。 |

### 电源

| 指标名称 | 类型 | <span style={{whiteSpace: 'nowrap'}}>单位/值</span> | 说明 |
|---|---|---|---|
| `node_power_supply_battery_health` | `gauge` | 状态值 | 指定电源设备的电池健康状态。 |
| `node_power_supply_charged` | `gauge` | 状态值 | 指定电源设备是否已充满。 |
| `node_power_supply_charging` | `gauge` | 状态值 | 指定电源设备是否正在充电。 |
| `node_power_supply_current_ampere` | `gauge` | 安培 | 指定电源设备当前电流，单位为安培。 |
| `node_power_supply_current_capacity` | `gauge` | 容量值 | 指定电源设备当前容量值。 |
| `node_power_supply_info` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>常量 `1`</span> | 指定电源设备的基础信息，指标值恒为 `1`，通过 `Label` 标识设备属性。 |
| `node_power_supply_max_capacity` | `gauge` | 容量值 | 指定电源设备最大容量值。 |
| `node_power_supply_power_source_state` | `gauge` | 状态值 | 指定电源设备当前供电来源状态。 |
| `node_power_supply_present` | `gauge` | 状态值 | 指定电源设备是否存在。 |
| `node_power_supply_time_to_empty_seconds` | `gauge` | 秒 | 指定电源设备预计放空剩余时间，单位为秒。 |
| `node_power_supply_time_to_full_seconds` | `gauge` | 秒 | 指定电源设备预计充满剩余时间，单位为秒。 |

### 温控

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_thermal_cpu_available_cpu` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`CPU` 数量</span> | 当前仍可用的 `CPU` 数量；当系统下线部分 `CPU` 时，该值会相应降低。 |
| `node_thermal_cpu_scheduler_limit_ratio` | `gauge` | 比例 | 操作系统允许使用的 `CPU` 调度时间比例；正常情况下为 `100%`，受限时低于 `100%`。 |
| `node_thermal_cpu_speed_limit_ratio` | `gauge` | 比例 | `CPU` 速度和电压限制占最大 `CPU` 速度的比例。 |

## 指标详情

本节逐项说明指标含义、`Label` 和 `Prometheus` 文本格式示例。示例用于展示暴露格式，实际 `HELP` 文案、`Label` 集合和值以采集端输出为准。直方图指标的`le`只出现在`_bucket`序列；`Summary` 指标的`quantile`只出现在分位序列。

### `node_boot_time_seconds`

系统最近一次启动的 `Unix` 时间戳，精确到微秒。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_boot_time_seconds 系统最近一次启动的 Unix 时间戳，精确到微秒
# TYPE node_boot_time_seconds gauge
node_boot_time_seconds 1700000000
```

### `node_cpu_seconds_total`

各 `CPU` 在不同运行模式下累计消耗的时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `cpu` | `0` | 逻辑 `CPU` 序号。 |
| `mode` | `idle` | `CPU` 运行模式，例如`idle`、`user`、`system`；实际取值由操作系统和 `collector` 实现决定。 |

```prometheus
# HELP node_cpu_seconds_total 各 CPU 在不同运行模式下累计消耗的时间
# TYPE node_cpu_seconds_total counter
node_cpu_seconds_total{cpu="0",mode="idle"} 12345.67
```

### `node_disk_read_bytes_total`

磁盘成功读取的累计字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_read_bytes_total 磁盘成功读取的累计字节数
# TYPE node_disk_read_bytes_total counter
node_disk_read_bytes_total{device="disk0"} 1048576
```

### `node_disk_read_errors_total`

磁盘读取错误的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_read_errors_total 磁盘读取错误的累计次数
# TYPE node_disk_read_errors_total counter
node_disk_read_errors_total{device="disk0"} 42
```

### `node_disk_read_retries_total`

磁盘读取重试的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_read_retries_total 磁盘读取重试的累计次数
# TYPE node_disk_read_retries_total counter
node_disk_read_retries_total{device="disk0"} 42
```

### `node_disk_read_sectors_total`

磁盘成功读取的累计扇区数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_read_sectors_total 磁盘成功读取的累计扇区数
# TYPE node_disk_read_sectors_total counter
node_disk_read_sectors_total{device="disk0"} 42
```

### `node_disk_read_time_seconds_total`

所有读操作累计消耗的时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_read_time_seconds_total 所有读操作累计消耗的时间
# TYPE node_disk_read_time_seconds_total counter
node_disk_read_time_seconds_total{device="disk0"} 12345.67
```

### `node_disk_reads_completed_total`

成功完成的磁盘读操作累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_reads_completed_total 成功完成的磁盘读操作累计次数
# TYPE node_disk_reads_completed_total counter
node_disk_reads_completed_total{device="disk0"} 42
```

### `node_disk_write_errors_total`

磁盘写入错误的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_write_errors_total 磁盘写入错误的累计次数
# TYPE node_disk_write_errors_total counter
node_disk_write_errors_total{device="disk0"} 42
```

### `node_disk_write_retries_total`

磁盘写入重试的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_write_retries_total 磁盘写入重试的累计次数
# TYPE node_disk_write_retries_total counter
node_disk_write_retries_total{device="disk0"} 42
```

### `node_disk_write_time_seconds_total`

所有写操作累计消耗的时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_write_time_seconds_total 所有写操作累计消耗的时间
# TYPE node_disk_write_time_seconds_total counter
node_disk_write_time_seconds_total{device="disk0"} 12345.67
```

### `node_disk_writes_completed_total`

成功完成的磁盘写操作累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_writes_completed_total 成功完成的磁盘写操作累计次数
# TYPE node_disk_writes_completed_total counter
node_disk_writes_completed_total{device="disk0"} 42
```

### `node_disk_written_bytes_total`

磁盘成功写入的累计字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_written_bytes_total 磁盘成功写入的累计字节数
# TYPE node_disk_written_bytes_total counter
node_disk_written_bytes_total{device="disk0"} 1048576
```

### `node_disk_written_sectors_total`

磁盘成功写入的累计扇区数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `disk0` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_disk_written_sectors_total 磁盘成功写入的累计扇区数
# TYPE node_disk_written_sectors_total counter
node_disk_written_sectors_total{device="disk0"} 42
```

### `node_exporter_build_info`

`node_exporter` 构建信息指标，指标值恒为 `1`，通过 `Label` 标识版本、源码修订、分支、`Go` 版本、目标操作系统和目标架构。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `branch` | `空字符串` | 构建 `node_exporter` 的源码分支。 |
| `goarch` | `amd64` | 构建目标 `CPU` 架构。 |
| `goos` | `darwin` | 构建目标操作系统。 |
| `goversion` | `go1.20.3` | 构建使用的 `Go` 版本。 |
| `revision` | `76ad633a98081c8386f2d6fc56309d78f3bbc1db-modified` | 源码修订版本。 |
| `tags` | `unknown` | 构建标签。 |
| `version` | `空字符串` | `node_exporter` 版本。 |

```prometheus
# HELP node_exporter_build_info node_exporter 构建信息指标，指标值恒为 1，通过 Label 标识版本、源码修订、分支、Go 版本、目标操作系统和目标架构
# TYPE node_exporter_build_info gauge
node_exporter_build_info{branch="",goarch="amd64",goos="darwin",goversion="go1.20.3",revision="76ad633a98081c8386f2d6fc56309d78f3bbc1db-modified",tags="unknown",version=""} 1
```

### `node_filesystem_avail_bytes`

非 root 用户可用的文件系统空间，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_avail_bytes 非 root 用户可用的文件系统空间，单位为字节
# TYPE node_filesystem_avail_bytes gauge
node_filesystem_avail_bytes{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1048576
```

### `node_filesystem_device_error`

采集指定文件系统设备统计信息时是否发生错误。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_device_error 采集指定文件系统设备统计信息时是否发生错误
# TYPE node_filesystem_device_error gauge
node_filesystem_device_error{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1
```

### `node_filesystem_files`

文件系统 `inode` 总数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_files 文件系统 inode 总数
# TYPE node_filesystem_files gauge
node_filesystem_files{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1
```

### `node_filesystem_files_free`

文件系统可用 `inode` 数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_files_free 文件系统可用 inode 数
# TYPE node_filesystem_files_free gauge
node_filesystem_files_free{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1
```

### `node_filesystem_free_bytes`

文件系统剩余空间，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_free_bytes 文件系统剩余空间，单位为字节
# TYPE node_filesystem_free_bytes gauge
node_filesystem_free_bytes{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1048576
```

### `node_filesystem_readonly`

文件系统是否为只读状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_readonly 文件系统是否为只读状态
# TYPE node_filesystem_readonly gauge
node_filesystem_readonly{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1
```

### `node_filesystem_size_bytes`

文件系统总容量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `/dev/disk1s1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |
| `fstype` | `apfs` | 文件系统类型。 |
| `mountpoint` | `/System/Volumes/Data` | 文件系统挂载点。 |

```prometheus
# HELP node_filesystem_size_bytes 文件系统总容量，单位为字节
# TYPE node_filesystem_size_bytes gauge
node_filesystem_size_bytes{device="/dev/disk1s1",fstype="apfs",mountpoint="/System/Volumes/Data"} 1048576
```

### `node_load1`

最近 1 分钟的系统平均负载。类型为`gauge`，单位/值为：负载均值。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_load1 最近 1 分钟的系统平均负载
# TYPE node_load1 gauge
node_load1 1
```

### `node_load15`

最近 15 分钟的系统平均负载。类型为`gauge`，单位/值为：负载均值。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_load15 最近 15 分钟的系统平均负载
# TYPE node_load15 gauge
node_load15 1
```

### `node_load5`

最近 5 分钟的系统平均负载。类型为`gauge`，单位/值为：负载均值。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_load5 最近 5 分钟的系统平均负载
# TYPE node_load5 gauge
node_load5 1
```

### `node_memory_active_bytes`

活跃内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_active_bytes 活跃内存大小，单位为字节
# TYPE node_memory_active_bytes gauge
node_memory_active_bytes 1048576
```

### `node_memory_compressed_bytes`

压缩内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_compressed_bytes 压缩内存大小，单位为字节
# TYPE node_memory_compressed_bytes gauge
node_memory_compressed_bytes 1048576
```

### `node_memory_free_bytes`

空闲内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_free_bytes 空闲内存大小，单位为字节
# TYPE node_memory_free_bytes gauge
node_memory_free_bytes 1048576
```

### `node_memory_inactive_bytes`

非活跃内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_inactive_bytes 非活跃内存大小，单位为字节
# TYPE node_memory_inactive_bytes gauge
node_memory_inactive_bytes 1048576
```

### `node_memory_internal_bytes`

系统内部使用的内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_internal_bytes 系统内部使用的内存大小，单位为字节
# TYPE node_memory_internal_bytes gauge
node_memory_internal_bytes 1048576
```

### `node_memory_purgeable_bytes`

可清理内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_purgeable_bytes 可清理内存大小，单位为字节
# TYPE node_memory_purgeable_bytes gauge
node_memory_purgeable_bytes 1048576
```

### `node_memory_swap_total_bytes`

`Swap` 总容量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_swap_total_bytes Swap 总容量，单位为字节
# TYPE node_memory_swap_total_bytes gauge
node_memory_swap_total_bytes 1048576
```

### `node_memory_swap_used_bytes`

已使用 `Swap` 大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_swap_used_bytes 已使用 Swap 大小，单位为字节
# TYPE node_memory_swap_used_bytes gauge
node_memory_swap_used_bytes 1048576
```

### `node_memory_swapped_in_bytes_total`

累计换入内存大小，单位为字节。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_swapped_in_bytes_total 累计换入内存大小，单位为字节
# TYPE node_memory_swapped_in_bytes_total counter
node_memory_swapped_in_bytes_total 1048576
```

### `node_memory_swapped_out_bytes_total`

累计换出内存大小，单位为字节。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_swapped_out_bytes_total 累计换出内存大小，单位为字节
# TYPE node_memory_swapped_out_bytes_total counter
node_memory_swapped_out_bytes_total 1048576
```

### `node_memory_total_bytes`

物理内存总量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_total_bytes 物理内存总量，单位为字节
# TYPE node_memory_total_bytes gauge
node_memory_total_bytes 1048576
```

### `node_memory_wired_bytes`

wired 内存大小，单位为字节；该术语常见于 `Darwin/macOS` 内存统计。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_memory_wired_bytes wired 内存大小，单位为字节；该术语常见于 Darwin/macOS 内存统计
# TYPE node_memory_wired_bytes gauge
node_memory_wired_bytes 1048576
```

### `node_network_noproto_total`

网络设备因未知或不支持协议而丢弃的累计包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_noproto_total 网络设备因未知或不支持协议而丢弃的累计包数
# TYPE node_network_noproto_total counter
node_network_noproto_total{device="ap1"} 42
```

### `node_network_receive_bytes_total`

网络设备累计接收字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_receive_bytes_total 网络设备累计接收字节数
# TYPE node_network_receive_bytes_total counter
node_network_receive_bytes_total{device="ap1"} 1048576
```

### `node_network_receive_drop_total`

网络设备接收方向累计丢包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_receive_drop_total 网络设备接收方向累计丢包数
# TYPE node_network_receive_drop_total counter
node_network_receive_drop_total{device="ap1"} 42
```

### `node_network_receive_errs_total`

网络设备接收方向累计错误数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_receive_errs_total 网络设备接收方向累计错误数
# TYPE node_network_receive_errs_total counter
node_network_receive_errs_total{device="ap1"} 42
```

### `node_network_receive_multicast_total`

网络设备接收方向累计多播包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_receive_multicast_total 网络设备接收方向累计多播包数
# TYPE node_network_receive_multicast_total counter
node_network_receive_multicast_total{device="ap1"} 42
```

### `node_network_receive_packets_total`

网络设备累计接收包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_receive_packets_total 网络设备累计接收包数
# TYPE node_network_receive_packets_total counter
node_network_receive_packets_total{device="ap1"} 42
```

### `node_network_transmit_bytes_total`

网络设备累计发送字节数。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_transmit_bytes_total 网络设备累计发送字节数
# TYPE node_network_transmit_bytes_total counter
node_network_transmit_bytes_total{device="ap1"} 1048576
```

### `node_network_transmit_colls_total`

网络设备发送方向累计冲突数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_transmit_colls_total 网络设备发送方向累计冲突数
# TYPE node_network_transmit_colls_total counter
node_network_transmit_colls_total{device="ap1"} 42
```

### `node_network_transmit_errs_total`

网络设备发送方向累计错误数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_transmit_errs_total 网络设备发送方向累计错误数
# TYPE node_network_transmit_errs_total counter
node_network_transmit_errs_total{device="ap1"} 42
```

### `node_network_transmit_multicast_total`

网络设备发送方向累计多播包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_transmit_multicast_total 网络设备发送方向累计多播包数
# TYPE node_network_transmit_multicast_total counter
node_network_transmit_multicast_total{device="ap1"} 42
```

### `node_network_transmit_packets_total`

网络设备累计发送包数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `ap1` | 设备名、块设备、网络设备或文件系统设备，取值由指标上下文决定。 |

```prometheus
# HELP node_network_transmit_packets_total 网络设备累计发送包数
# TYPE node_network_transmit_packets_total counter
node_network_transmit_packets_total{device="ap1"} 42
```

### `node_power_supply_battery_health`

指定电源设备的电池健康状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |
| `state` | `Fair` | 电池健康状态枚举；源码确认 Darwin 实现会为`Good`、`Fair`、`Poor`等状态分别输出 0/1。 |

```prometheus
# HELP node_power_supply_battery_health 指定电源设备的电池健康状态
# TYPE node_power_supply_battery_health gauge
node_power_supply_battery_health{power_supply="InternalBattery-0",state="Fair"} 1
```

### `node_power_supply_charged`

指定电源设备是否已充满。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_charged 指定电源设备是否已充满
# TYPE node_power_supply_charged gauge
node_power_supply_charged{power_supply="InternalBattery-0"} 1
```

### `node_power_supply_charging`

指定电源设备是否正在充电。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_charging 指定电源设备是否正在充电
# TYPE node_power_supply_charging gauge
node_power_supply_charging{power_supply="InternalBattery-0"} 1
```

### `node_power_supply_current_ampere`

指定电源设备当前电流，单位为安培。类型为`gauge`，单位/值为：安培。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_current_ampere 指定电源设备当前电流，单位为安培
# TYPE node_power_supply_current_ampere gauge
node_power_supply_current_ampere{power_supply="InternalBattery-0"} 2.5
```

### `node_power_supply_current_capacity`

指定电源设备当前容量值。类型为`gauge`，单位/值为：容量值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_current_capacity 指定电源设备当前容量值
# TYPE node_power_supply_current_capacity gauge
node_power_supply_current_capacity{power_supply="InternalBattery-0"} 1
```

### `node_power_supply_info`

指定电源设备的基础信息，指标值恒为 `1`，通过 `Label` 标识设备属性。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `id` | `6553699` | IOKit 电源对象 ID。 |
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |
| `serial_number` | `D860275A3WCK7LNBP` | 设备序列号。 |
| `transport_type` | `Internal` | 电源或设备传输/连接类型。 |
| `type` | `InternalBattery` | IOKit 电源类型。 |

```prometheus
# HELP node_power_supply_info 指定电源设备的基础信息，指标值恒为 1，通过 Label 标识设备属性
# TYPE node_power_supply_info gauge
node_power_supply_info{id="6553699",power_supply="InternalBattery-0",serial_number="D860275A3WCK7LNBP",transport_type="Internal",type="InternalBattery"} 1
```

### `node_power_supply_max_capacity`

指定电源设备最大容量值。类型为`gauge`，单位/值为：容量值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_max_capacity 指定电源设备最大容量值
# TYPE node_power_supply_max_capacity gauge
node_power_supply_max_capacity{power_supply="InternalBattery-0"} 1
```

### `node_power_supply_power_source_state`

指定电源设备当前供电来源状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |
| `state` | `AC Power` | 电源来源状态枚举；源码确认 Darwin 实现会为`Off Line`、`AC Power`、`Battery Power`等状态分别输出 0/1。 |

```prometheus
# HELP node_power_supply_power_source_state 指定电源设备当前供电来源状态
# TYPE node_power_supply_power_source_state gauge
node_power_supply_power_source_state{power_supply="InternalBattery-0",state="AC Power"} 1
```

### `node_power_supply_present`

指定电源设备是否存在。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_present 指定电源设备是否存在
# TYPE node_power_supply_present gauge
node_power_supply_present{power_supply="InternalBattery-0"} 1
```

### `node_power_supply_time_to_empty_seconds`

指定电源设备预计放空剩余时间，单位为秒。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_time_to_empty_seconds 指定电源设备预计放空剩余时间，单位为秒
# TYPE node_power_supply_time_to_empty_seconds gauge
node_power_supply_time_to_empty_seconds{power_supply="InternalBattery-0"} 1.23
```

### `node_power_supply_time_to_full_seconds`

指定电源设备预计充满剩余时间，单位为秒。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `power_supply` | `InternalBattery-0` | 电源设备名称。 |

```prometheus
# HELP node_power_supply_time_to_full_seconds 指定电源设备预计充满剩余时间，单位为秒
# TYPE node_power_supply_time_to_full_seconds gauge
node_power_supply_time_to_full_seconds{power_supply="InternalBattery-0"} 1.23
```

### `node_scrape_collector_duration_seconds`

`node_exporter` 单个 `collector` 执行一次采集所用时间。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `collector` | `boottime` | `node_exporter` `collector` 名称。 |

```prometheus
# HELP node_scrape_collector_duration_seconds node_exporter 单个 collector 执行一次采集所用时间
# TYPE node_scrape_collector_duration_seconds gauge
node_scrape_collector_duration_seconds{collector="boottime"} 1.23
```

### `node_scrape_collector_success`

`node_exporter` 单个 `collector` 最近一次采集是否成功。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `collector` | `boottime` | `node_exporter` `collector` 名称。 |

```prometheus
# HELP node_scrape_collector_success node_exporter 单个 collector 最近一次采集是否成功
# TYPE node_scrape_collector_success gauge
node_scrape_collector_success{collector="boottime"} 1
```

### `node_textfile_scrape_error`

打开或读取 `textfile` 文件出错时为 `1`，否则为 `0`。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_textfile_scrape_error 打开或读取 textfile 文件出错时为 1，否则为 0
# TYPE node_textfile_scrape_error gauge
node_textfile_scrape_error 1
```

### `node_thermal_cpu_available_cpu`

当前仍可用的 `CPU` 数量；当系统下线部分 `CPU` 时，该值会相应降低。类型为`gauge`，单位/值为：`CPU` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_thermal_cpu_available_cpu 当前仍可用的 CPU 数量；当系统下线部分 CPU 时，该值会相应降低
# TYPE node_thermal_cpu_available_cpu gauge
node_thermal_cpu_available_cpu 1
```

### `node_thermal_cpu_scheduler_limit_ratio`

操作系统允许使用的 `CPU` 调度时间比例；正常情况下为 100%，受限时低于 100%。类型为`gauge`，单位/值为：比例。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_thermal_cpu_scheduler_limit_ratio 操作系统允许使用的 CPU 调度时间比例；正常情况下为 100%，受限时低于 100%
# TYPE node_thermal_cpu_scheduler_limit_ratio gauge
node_thermal_cpu_scheduler_limit_ratio 0.95
```

### `node_thermal_cpu_speed_limit_ratio`

`CPU` 速度和电压限制占最大 `CPU` 速度的比例。类型为`gauge`，单位/值为：比例。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_thermal_cpu_speed_limit_ratio CPU 速度和电压限制占最大 CPU 速度的比例
# TYPE node_thermal_cpu_speed_limit_ratio gauge
node_thermal_cpu_speed_limit_ratio 0.95
```

### `node_time_seconds`

当前系统时间，表示为自 1970-01-01 起的秒数。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_time_seconds 当前系统时间，表示为自 1970-01-01 起的秒数
# TYPE node_time_seconds gauge
node_time_seconds 1.23
```

### `node_time_zone_offset_seconds`

系统时区相对 `UTC` 的偏移量，单位为秒。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `time_zone` | `CST` | 系统时区名称。 |

```prometheus
# HELP node_time_zone_offset_seconds 系统时区相对 UTC 的偏移量，单位为秒
# TYPE node_time_zone_offset_seconds gauge
node_time_zone_offset_seconds{time_zone="CST"} 1.23
```

### `node_uname_info`

`uname` 系统调用返回的系统信息，指标值恒为 `1`，通过 `Label` 标识系统属性。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `domainname` | `(none)` | `uname` 返回的域名。 |
| `machine` | `x86_64` | `uname` 返回的硬件/机器架构。 |
| `nodename` | `TXQIANGGUO-MB2` | `uname` 返回的节点名。 |
| `release` | `22.6.0` | `uname` 返回的内核 release。 |
| `sysname` | `Darwin` | `uname` 返回的操作系统名称。 |
| `version` | `Darwin Kernel Version 22.6.0: Wed Jul  5 22:21:56 PDT 2023; root:xnu-8796.141.3~6/RELEASE_X86_64` | `uname` 返回的内核版本或构建字符串。 |

```prometheus
# HELP node_uname_info uname 系统调用返回的系统信息，指标值恒为 1，通过 Label 标识系统属性
# TYPE node_uname_info gauge
node_uname_info{domainname="(none)",machine="x86_64",nodename="TXQIANGGUO-MB2",release="22.6.0",sysname="Darwin",version="Darwin Kernel Version 22.6.0: Wed Jul  5 22:21:56 PDT 2023; root:xnu-8796.141.3~6/RELEASE_X86_64"} 1
```




## 资料来源

- [Prometheus Node Exporter 上游仓库](https://github.com/prometheus/node_exporter)
- [Node Exporter README：collector 支持矩阵与使用说明](https://github.com/prometheus/node_exporter/blob/master/README.md)
- [Node Exporter collector 源码目录](https://github.com/prometheus/node_exporter/tree/master/collector)
- [Prometheus 官方 Node Exporter Guide](https://prometheus.io/docs/guides/node-exporter/)

