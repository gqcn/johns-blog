---
slug: "/observability/node-exporter-metrics"
title: "Node Exporter：节点监控指标与 Label 说明"
hide_title: true
keywords:
  ["Node Exporter", "Prometheus", "节点监控", "主机指标", "Label", "CPU", "Filesystem", "Network", "InfiniBand", "Ethtool", "Textfile"]
description: "系统介绍 Node Exporter 常用主机指标，覆盖 CPU、磁盘、文件系统、内存、网络、InfiniBand、Ethtool、Textfile、电源、温控和采集器自身指标，并逐项说明指标 Label。"
---

## 基本简介

`Node Exporter`是 `Prometheus` 官方维护的主机指标 `exporter`，用于采集类 `Unix` 系统暴露的硬件与操作系统指标。它通过可插拔 `collector` 暴露 `CPU`、磁盘、文件系统、内存、网络、`InfiniBand/RDMA`、`Ethtool`、`Textfile`、系统时间、`uname`、采集器自身状态等指标。

不同操作系统、内核接口、`collector` 开关和 `node_exporter` 版本会影响最终输出。本文覆盖当前常用指标集合，并在指标详情中逐项列出公开资料、源码和指标输出中可确认的 `Label`；上游没有稳定公开完整 `Label` 契约的地方会明确备注。



## 监控指标

组件源码仓库：https://github.com/prometheus/node_exporter

Sample文件：[nodes.txt](/attachments/nodes.txt)

### 系统/采集器

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_boot_time_seconds` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | 系统最近一次启动的 `Unix` 时间戳，精确到微秒。 |
| `node_exporter_build_info` | `gauge` | 常量 `1` | `node_exporter` 构建信息指标，指标值恒为 `1`，通过 `Label` 标识版本、源码修订、分支、`Go` 版本、目标操作系统和目标架构。 |
| `node_scrape_collector_duration_seconds` | `gauge` | 秒 | `node_exporter` 单个 `collector` 执行一次采集所用时间。 |
| `node_scrape_collector_success` | `gauge` | 状态值 | `node_exporter` 单个 `collector` 最近一次采集是否成功。 |
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

### InfiniBand/RDMA

分类含义：`InfiniBand/RDMA` 指标用于观察主机上的**高速互连与 RDMA 设备**，包括 `InfiniBand`、`RoCE` 和 `Omni-Path` 等设备的**设备信息、端口状态、链路速率、收发包/字节计数、链路错误、丢包、拥塞控制和硬件计数器**。这类指标更偏向 HPC、AI 训练集群、低延迟存储或 RDMA 网络环境中的**高速网络链路健康度与传输质量**。

采集配置：`infiniband collector` 仅支持 `Linux`，在上游 `node_exporter` 中**默认启用**。该 `collector` 从 `/sys/class/infiniband` 读取 `InfiniBand`、`RoCE` 或 `Omni-Path` 相关设备和端口计数器，不需要安装额外的 `node_exporter` 采集组件；但主机必须有对应硬件/内核驱动并暴露该 `sysfs` 目录，否则不会产生这组指标。可用 `--collector.infiniband.device-include` 或 `--collector.infiniband.device-exclude` 按设备名过滤，两者互斥。部分 `hw_counters`、`counters_ext` 指标是否出现取决于内核和设备驱动实际暴露的文件。

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_infiniband_info` | `gauge` | 常量 `1` | `InfiniBand/RDMA` 设备信息，通过 `Label` 暴露设备名、板卡 ID、固件版本和 HCA 类型。 |
| `node_infiniband_state_id` | `gauge` | 状态 ID | 端口逻辑状态：`0: no change`、`1: down`、`2: init`、`3: armed`、`4: active`、`5: act defer`。 |
| `node_infiniband_physical_state_id` | `gauge` | 状态 ID | 端口物理状态：`0: no change`、`1: sleep`、`2: polling`、`3: disable`、`4: shift`、`5: link up`、`6: link error recover`、`7: phytest`。 |
| `node_infiniband_rate_bytes_per_second` | `gauge` | 字节/秒 | 端口最大信号传输速率。 |
| `node_infiniband_legacy_data_received_bytes_total` | `counter` | 字节 | `counters_ext` 中端口累计接收数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。 |
| `node_infiniband_legacy_data_transmitted_bytes_total` | `counter` | 字节 | `counters_ext` 中端口累计发送数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。 |
| `node_infiniband_legacy_packets_received_total` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `counters_ext` 中端口累计接收数据包数。 |
| `node_infiniband_legacy_packets_transmitted_total` | `counter` | 累计计数 | `counters_ext` 中端口累计发送数据包数。 |
| `node_infiniband_legacy_multicast_packets_received_total` | `counter` | 累计计数 | `counters_ext` 中端口累计接收多播包数。 |
| `node_infiniband_legacy_multicast_packets_transmitted_total` | `counter` | 累计计数 | `counters_ext` 中端口累计发送多播包数。 |
| `node_infiniband_legacy_unicast_packets_received_total` | `counter` | 累计计数 | `counters_ext` 中端口累计接收单播包数。 |
| `node_infiniband_legacy_unicast_packets_transmitted_total` | `counter` | 累计计数 | `counters_ext` 中端口累计发送单播包数。 |
| `node_infiniband_port_data_received_bytes_total` | `counter` | 字节 | 端口累计接收数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。 |
| `node_infiniband_port_data_transmitted_bytes_total` | `counter` | 字节 | 端口累计发送数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。 |
| `node_infiniband_port_packets_received_total` | `counter` | 累计计数 | 端口在所有虚拟通道上累计接收的数据包数，包含错误包。 |
| `node_infiniband_port_packets_transmitted_total` | `counter` | 累计计数 | 端口在所有虚拟通道上累计发送的数据包数，包含错误包。 |
| `node_infiniband_multicast_packets_received_total` | `counter` | 累计计数 | 端口累计接收多播包数，包含错误包。 |
| `node_infiniband_multicast_packets_transmitted_total` | `counter` | 累计计数 | 端口累计发送多播包数，包含错误包。 |
| `node_infiniband_unicast_packets_received_total` | `counter` | 累计计数 | 端口累计接收单播包数，包含错误包。 |
| `node_infiniband_unicast_packets_transmitted_total` | `counter` | 累计计数 | 端口累计发送单播包数，包含错误包。 |
| `node_infiniband_port_errors_received_total` | `counter` | 累计计数 | 端口累计接收的包含错误的数据包数。 |
| `node_infiniband_port_discards_received_total` | `counter` | 累计计数 | 端口因端口关闭或拥塞而丢弃的入站包数。 |
| `node_infiniband_port_discards_transmitted_total` | `counter` | 累计计数 | 端口因端口关闭或拥塞而丢弃的出站包数。 |
| `node_infiniband_port_constraint_errors_received_total` | `counter` | 累计计数 | 交换机物理端口接收后被丢弃的数据包数。 |
| `node_infiniband_port_constraint_errors_transmitted_total` | `counter` | 累计计数 | 交换机物理端口未能发送的数据包数。 |
| `node_infiniband_port_receive_remote_physical_errors_total` | `counter` | 累计计数 | 端口累计收到带 `EBP` 结尾标记的坏包数。 |
| `node_infiniband_port_receive_switch_relay_errors_total` | `counter` | 累计计数 | 交换机无法转发的数据包数。 |
| `node_infiniband_port_transmit_wait_total` | `counter` | `tick` 数 | 端口有数据待发送但整个 `tick` 内未发送数据的累计 `tick` 数。 |
| `node_infiniband_symbol_error_total` | `counter` | 累计计数 | 一个或多个物理 `lane` 上检测到的轻微链路错误数。 |
| `node_infiniband_link_downed_total` | `counter` | 累计计数 | 链路未能从错误状态恢复并进入 `down` 状态的次数。 |
| `node_infiniband_link_error_recovery_total` | `counter` | 累计计数 | 链路从错误状态成功恢复的次数。 |
| `node_infiniband_local_link_integrity_errors_total` | `counter` | 累计计数 | 本地物理错误超过 `LocalPhyErrors` 阈值的次数。 |
| `node_infiniband_excessive_buffer_overrun_errors_total` | `counter` | 累计计数 | 连续流控更新周期内发生过量`buffer overrun`错误的次数。 |
| `node_infiniband_vl15_dropped_total` | `counter` | 累计计数 | 因资源限制而丢弃的入站 `VL15` 包数。 |
| `node_infiniband_lifespan_seconds` | `gauge` | 秒 | 硬件计数器读取值的最大老化时间；两次读取间隔短于该值时可能返回相同计数。 |
| `node_infiniband_duplicate_requests_packets_total` | `counter` | 累计计数 | 已执行过的重复请求包数。 |
| `node_infiniband_implied_nak_seq_errors_total` | `counter` | 累计计数 | `RDMA` `read` 或 `response` 中因 `ACK PSN` 大于预期 `PSN` 产生的 `implied NAK` 序列错误次数。 |
| `node_infiniband_local_ack_timeout_errors_total` | `counter` | 累计计数 | `RC`、`XRC`、`DCT QP` 发送侧 `ACK` 定时器超时但未超过重试上限的次数。 |
| `node_infiniband_np_cnp_packets_sent_total` | `counter` | 累计计数 | `RoCEv2` 通知点在发现 `ECN` 拥塞标记后发送的 `CNP` 包数。 |
| `node_infiniband_np_ecn_marked_roce_packets_received_total` | `counter` | 累计计数 | 通知点收到的带 `ECN` 拥塞标记的 `RoCEv2` 包数。 |
| `node_infiniband_out_of_buffer_drops_total` | `counter` | 累计计数 | 因关联 `QP` 缺少 `WQE` 而发生的丢包数。 |
| `node_infiniband_out_of_sequence_packets_received_total` | `counter` | 累计计数 | 收到的乱序包数。 |
| `node_infiniband_packet_sequence_errors_total` | `counter` | 累计计数 | 收到的 `NAK` 序列错误包数，且 `QP` 重试上限未被超过。 |
| `node_infiniband_req_cqes_errors_total` | `counter` | 累计计数 | `requester` 检测到以错误状态完成的 `CQE` 次数。 |
| `node_infiniband_req_cqes_flush_errors_total` | `counter` | 累计计数 | `requester` 检测到以 `flushed error` 状态完成的 `CQE` 次数。 |
| `node_infiniband_req_remote_access_errors_total` | `counter` | 累计计数 | `requester` 检测到远端访问错误的次数。 |
| `node_infiniband_req_remote_invalid_request_errors_total` | `counter` | 累计计数 | `requester` 检测到远端无效请求错误的次数。 |
| `node_infiniband_resp_cqes_errors_total` | `counter` | 累计计数 | `responder` 检测到以错误状态完成的 `CQE` 次数。 |
| `node_infiniband_resp_cqes_flush_errors_total` | `counter` | 累计计数 | `responder` 检测到以 `flushed error` 状态完成的 `CQE` 次数。 |
| `node_infiniband_resp_local_length_errors_total` | `counter` | 累计计数 | `responder` 检测到本地长度错误的次数。 |
| `node_infiniband_resp_remote_access_errors_total` | `counter` | 累计计数 | `responder` 检测到远端访问错误的次数。 |
| `node_infiniband_rnr_nak_retry_packets_received_total` | `counter` | 累计计数 | 收到的 `RNR NAK` 包数，且`QP`重试上限未被超过。 |
| `node_infiniband_roce_adp_retransmits_total` | `counter` | 累计计数 | `RoCE` 流量自适应重传次数。 |
| `node_infiniband_roce_adp_retransmits_timeout_total` | `counter` | 累计计数 | `RoCE` 流量因自适应重传而达到超时的次数。 |
| `node_infiniband_roce_slow_restart_used_total` | `counter` | 累计计数 | 使用 `RoCE slow restart` 的次数。 |
| `node_infiniband_roce_slow_restart_cnps_total` | `counter` | 累计计数 | `RoCE slow restart` 生成 `CNP` 包的次数。 |
| `node_infiniband_roce_slow_restart_total` | `counter` | 累计计数 | `RoCE slow restart` 状态转换次数。 |
| `node_infiniband_rp_cnp_packets_handled_total` | `counter` | 累计计数 | `RoCE reaction point HCA` 处理的 `CNP` 包数。 |
| `node_infiniband_rp_cnp_ignored_packets_received_total` | `counter` | 累计计数 | `reaction point HCA` 收到但忽略的 `CNP` 包数。 |
| `node_infiniband_rx_atomic_requests_total` | `counter` | 累计计数 | 关联 `QP` 收到的 `ATOMIC` 请求数。 |
| `node_infiniband_rx_dct_connect_requests_total` | `counter` | 累计计数 | 关联 `DCT` 收到的连接请求数。 |
| `node_infiniband_rx_read_requests_total` | `counter` | 累计计数 | 关联`QP`收到的 `READ` 请求数。 |
| `node_infiniband_rx_write_requests_total` | `counter` | 累计计数 | 关联`QP`收到的 `WRITE` 请求数。 |
| `node_infiniband_rx_icrc_encapsulated_errors_total` | `counter` | 累计计数 | 带 `ICRC` 错误的 `RoCE` 包数。 |

### Ethtool

分类含义：`Ethtool` 指标用于观察 `Linux` **普通网络接口/以太网网卡的驱动层和链路层信息**，数据来源等价于 `ethtool`、`ethtool -S`、`ethtool -i` 等接口。它采集的是**网卡驱动信息、固件版本、驱动统计计数器、链路支持能力、advertised 能力、自协商、pause frame、端口/PHY 类型和速率组合**等数据，不是应用层、互联网访问层或公网链路指标。

采集配置：`ethtool collector`仅支持 `Linux`，在上游 `node_exporter` 中**默认禁用**，需要显式添加 `--collector.ethtool`。该 `collector` 通过 `Go` 库读取内核 `ethtool` 接口，指标含义等价于 `ethtool`、`ethtool -S` 和 `ethtool -i` 暴露的信息，不需要安装外部 `ethtool` 命令行工具；但网卡驱动必须支持相应 `ethtool link info`、`driver info` 或 `stats` 接口。

可用 `--collector.ethtool.device-include`、`--collector.ethtool.device-exclude` 过滤设备，用 `--collector.ethtool.metrics-include` 过滤驱动 `stats` 指标。驱动 `stats` 没有上游稳定全集，具体指标名以对应驱动返回的 `ethtool -S <device>`/内核接口为准；无可查的跨驱动固定完整清单。

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_ethtool_info` | `gauge` | 常量 `1` | 网卡驱动信息，通过 `Label` 暴露 bus info、设备名、驱动名、扩展 `ROM` 版本、固件版本和驱动版本。 |
| `node_ethtool_received_bytes_total` | `untyped` | 字节 | 驱动 `stats` 中 `rx_bytes` 规范化后的接收字节数。 |
| `node_ethtool_received_dropped_total` | `untyped` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | 驱动 `stats` 中 `rx_dropped` 规范化后的接收丢帧数。 |
| `node_ethtool_received_errors_total` | `untyped` | 累计计数 | 驱动`stats`中 `rx_errors` 规范化后的接收错误帧数。 |
| `node_ethtool_received_packets_total` | `untyped` | 累计计数 | 驱动`stats`中 `rx_packets` 规范化后的接收包数。 |
| `node_ethtool_transmitted_bytes_total` | `untyped` | 字节 | 驱动`stats`中 `tx_bytes` 规范化后的发送字节数。 |
| `node_ethtool_transmitted_errors_total` | `untyped` | 累计计数 | 驱动`stats`中 `tx_errors` 规范化后的发送错误帧数。 |
| `node_ethtool_transmitted_packets_total` | `untyped` | 累计计数 | 驱动`stats`中 `tx_packets` 规范化后的发送包数。 |
| `node_network_supported_port_info` | `gauge` | 常量 `1` | 网卡支持的端口或 PHY 类型，例如 `TP`、`FIBRE`、`Backplane`。 |
| `node_network_supported_speed_bytes` | `gauge` | 字节/秒 | 网卡支持的速度、双工模式和物理模式组合。 |
| `node_network_autonegotiate_supported` | `gauge` | 状态值 | 网卡是否支持自协商。 |
| `node_network_pause_supported` | `gauge` | 状态值 | 网卡是否支持`pause frame`。 |
| `node_network_asymmetricpause_supported` | `gauge` | 状态值 | 网卡是否支持`asymmetric pause frame`。 |
| `node_network_advertised_speed_bytes` | `gauge` | 字节/秒 | 网卡当前`advertised`的速度、双工模式和物理模式组合。 |
| `node_network_autonegotiate_advertised` | `gauge` | 状态值 | 网卡是否 `advertised` 自协商能力。 |
| `node_network_pause_advertised` | `gauge` | 状态值 | 网卡是否 `advertised pause` 能力。 |
| `node_network_asymmetricpause_advertised` | `gauge` | 状态值 | 网卡是否 `advertised asymmetric pause` 能力。 |
| `node_network_autonegotiate` | `gauge` | 状态值 | 端口当前是否启用自协商。 |

### Textfile

分类含义：`Textfile` 指标用于把**本机脚本、定时任务或批处理任务生成的自定义指标**纳入 `node_exporter` 输出。它采集的不是内核或硬件自动暴露的固定指标，而是 `.prom` 文件中的**业务状态、批任务完成时间、机器角色、离线检查结果、外部命令输出转换结果**等文本格式指标；固定的 `node_textfile_mtime_seconds` 和 `node_textfile_scrape_error` 只用于描述这些 `.prom` 文件的读取状态。

采集配置：`textfile` collector 支持所有平台，在上游 `node_exporter` 中默认启用，但必须配置 `--collector.textfile.directory` 才会读取本地指标文件；该参数可重复并支持 glob。collector 只解析目录下后缀为 `.prom` 的文件，文件内容必须是 `Prometheus` 文本格式且不支持客户端时间戳。它不需要额外安装采集组件，但需要由 `cron`、批处理任务或其他本机脚本以原子方式写入 `.prom` 文件。除下面两个 `node_textfile_*` 指标外，其他通过 `textfile` 暴露的指标完全由 `.prom` 文件内容决定，上游没有也不可能提供固定指标全集。

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `node_textfile_mtime_seconds` | `gauge` | `Unix` 时间戳（秒） | 成功读取的 `.prom` 文件最后修改时间。 |
| `node_textfile_scrape_error` | `gauge` | 状态值 | 打开目录、读取文件、解析文件或发现不一致 `HELP` 文案等错误时为 `1`，否则为 `0`。 |

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

### `node_infiniband_info`

`InfiniBand/RDMA` 设备信息，指标值恒为 `1`。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `mlx5_0` | `/sys/class/infiniband` 下的设备名。 |
| `board_id` | `MT_0000000019` | 板卡 ID；取值来自设备 `sysfs`。 |
| `firmware_version` | `16.35.2000` | 设备固件版本。 |
| `hca_type` | `MT4125` | HCA 类型。 |

```prometheus
# HELP node_infiniband_info Non-numeric data from /sys/class/infiniband/<device>, value is always 1.
# TYPE node_infiniband_info gauge
node_infiniband_info{device="mlx5_0",board_id="MT_0000000019",firmware_version="16.35.2000",hca_type="MT4125"} 1
```

### `node_infiniband_state_id`

端口逻辑状态 ID：`0` no change、`1` down、`2` init、`3` armed、`4` active、`5` act defer。类型为`gauge`，单位/值为：状态 ID。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_state_id{device="mlx5_0",port="1"} 4
```

### `node_infiniband_physical_state_id`

端口物理状态 ID：`0` no change、`1` sleep、`2` polling、`3` disable、`4` shift、`5` link up、`6` link error recover、`7` phytest。类型为`gauge`，单位/值为：状态 ID。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_physical_state_id{device="mlx5_0",port="1"} 5
```

### `node_infiniband_rate_bytes_per_second`

端口最大信号传输速率。类型为`gauge`，单位/值为：字节/秒。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rate_bytes_per_second{device="mlx5_0",port="1"} 12500000000
```

### `node_infiniband_legacy_data_received_bytes_total`

`counters_ext` 中端口累计接收数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。类型为`counter`，单位/值为：字节。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_data_received_bytes_total{device="mlx5_0",port="1"} 1048576
```

### `node_infiniband_legacy_data_transmitted_bytes_total`

`counters_ext` 中端口累计发送数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。类型为`counter`，单位/值为：字节。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_data_transmitted_bytes_total{device="mlx5_0",port="1"} 1048576
```

### `node_infiniband_legacy_packets_received_total`

`counters_ext` 中端口累计接收数据包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_packets_received_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_legacy_packets_transmitted_total`

`counters_ext` 中端口累计发送数据包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_packets_transmitted_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_legacy_multicast_packets_received_total`

`counters_ext` 中端口累计接收多播包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_multicast_packets_received_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_legacy_multicast_packets_transmitted_total`

`counters_ext` 中端口累计发送多播包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_multicast_packets_transmitted_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_legacy_unicast_packets_received_total`

`counters_ext` 中端口累计接收单播包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_unicast_packets_received_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_legacy_unicast_packets_transmitted_total`

`counters_ext` 中端口累计发送单播包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_legacy_unicast_packets_transmitted_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_port_data_received_bytes_total`

端口累计接收数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。类型为`counter`，单位/值为：字节。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_data_received_bytes_total{device="mlx5_0",port="1"} 1048576
```

### `node_infiniband_port_data_transmitted_bytes_total`

端口累计发送数据量；`procfs` 读取时会把内核`4`字节单位转换为字节。类型为`counter`，单位/值为：字节。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_data_transmitted_bytes_total{device="mlx5_0",port="1"} 1048576
```

### `node_infiniband_port_packets_received_total`

端口在所有虚拟通道上累计接收的数据包数，包含错误包。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_packets_received_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_port_packets_transmitted_total`

端口在所有虚拟通道上累计发送的数据包数，包含错误包。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_packets_transmitted_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_multicast_packets_received_total`

端口累计接收多播包数，包含错误包。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_multicast_packets_received_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_multicast_packets_transmitted_total`

端口累计发送多播包数，包含错误包。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_multicast_packets_transmitted_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_unicast_packets_received_total`

端口累计接收单播包数，包含错误包。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_unicast_packets_received_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_unicast_packets_transmitted_total`

端口累计发送单播包数，包含错误包。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_unicast_packets_transmitted_total{device="mlx5_0",port="1"} 42
```

### `node_infiniband_port_errors_received_total`

端口累计接收的包含错误的数据包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_errors_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_discards_received_total`

端口因端口关闭或拥塞而丢弃的入站包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_discards_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_discards_transmitted_total`

端口因端口关闭或拥塞而丢弃的出站包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_discards_transmitted_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_constraint_errors_received_total`

交换机物理端口接收后被丢弃的数据包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_constraint_errors_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_constraint_errors_transmitted_total`

交换机物理端口未能发送的数据包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_constraint_errors_transmitted_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_receive_remote_physical_errors_total`

端口累计收到带 `EBP` 结尾标记的坏包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_receive_remote_physical_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_receive_switch_relay_errors_total`

交换机无法转发的数据包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_receive_switch_relay_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_port_transmit_wait_total`

端口有数据待发送但整个 tick 内未发送数据的累计 tick 数。类型为`counter`，单位/值为：tick 数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_port_transmit_wait_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_symbol_error_total`

一个或多个物理 lane 上检测到的轻微链路错误数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_symbol_error_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_link_downed_total`

链路未能从错误状态恢复并进入 down 状态的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_link_downed_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_link_error_recovery_total`

链路从错误状态成功恢复的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_link_error_recovery_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_local_link_integrity_errors_total`

本地物理错误超过 `LocalPhyErrors` 阈值的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_local_link_integrity_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_excessive_buffer_overrun_errors_total`

连续流控更新周期内发生过量`buffer overrun`错误的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_excessive_buffer_overrun_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_vl15_dropped_total`

因资源限制而丢弃的入站 `VL15` 包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_vl15_dropped_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_lifespan_seconds`

硬件计数器读取值的最大老化时间；两次读取间隔短于该值时可能返回相同计数。类型为`gauge`，单位/值为：秒。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_lifespan_seconds{device="mlx5_0",port="1"} 10
```

### `node_infiniband_duplicate_requests_packets_total`

已执行过的重复请求包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_duplicate_requests_packets_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_implied_nak_seq_errors_total`

`RDMA` read 或 response 中因 ACK PSN 大于预期 PSN 产生的 implied NAK 序列错误次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_implied_nak_seq_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_local_ack_timeout_errors_total`

`RC`、`XRC`、`DCT``QP`发送侧 ACK 定时器超时但未超过重试上限的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_local_ack_timeout_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_np_cnp_packets_sent_total`

`RoCEv2` 通知点在发现 ECN 拥塞标记后发送的 `CNP` 包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_np_cnp_packets_sent_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_np_ecn_marked_roce_packets_received_total`

通知点收到的带 ECN 拥塞标记的 `RoCEv2` 包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_np_ecn_marked_roce_packets_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_out_of_buffer_drops_total`

因关联`QP`缺少 `WQE` 而发生的丢包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_out_of_buffer_drops_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_out_of_sequence_packets_received_total`

收到的乱序包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_out_of_sequence_packets_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_packet_sequence_errors_total`

收到的 NAK 序列错误包数，且`QP`重试上限未被超过。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_packet_sequence_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_req_cqes_errors_total`

requester 检测到以错误状态完成的 `CQE` 次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_req_cqes_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_req_cqes_flush_errors_total`

requester 检测到以 flushed error 状态完成的 `CQE` 次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_req_cqes_flush_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_req_remote_access_errors_total`

requester 检测到远端访问错误的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_req_remote_access_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_req_remote_invalid_request_errors_total`

requester 检测到远端无效请求错误的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_req_remote_invalid_request_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_resp_cqes_errors_total`

responder 检测到以错误状态完成的 `CQE` 次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_resp_cqes_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_resp_cqes_flush_errors_total`

responder 检测到以 flushed error 状态完成的 `CQE` 次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_resp_cqes_flush_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_resp_local_length_errors_total`

responder 检测到本地长度错误的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_resp_local_length_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_resp_remote_access_errors_total`

responder 检测到远端访问错误的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_resp_remote_access_errors_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rnr_nak_retry_packets_received_total`

收到的 `RNR NAK` 包数，且`QP`重试上限未被超过。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rnr_nak_retry_packets_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_roce_adp_retransmits_total`

`RoCE` 流量自适应重传次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_roce_adp_retransmits_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_roce_adp_retransmits_timeout_total`

`RoCE` 流量因自适应重传而达到超时的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_roce_adp_retransmits_timeout_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_roce_slow_restart_used_total`

使用 `RoCE` slow restart 的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_roce_slow_restart_used_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_roce_slow_restart_cnps_total`

`RoCE` slow restart 生成 `CNP` 包的次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_roce_slow_restart_cnps_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_roce_slow_restart_total`

`RoCE` slow restart 状态转换次数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_roce_slow_restart_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rp_cnp_packets_handled_total`

`RoCE` reaction point HCA 处理的 `CNP` 包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rp_cnp_packets_handled_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rp_cnp_ignored_packets_received_total`

reaction point HCA 收到但忽略的 `CNP` 包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rp_cnp_ignored_packets_received_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rx_atomic_requests_total`

关联`QP`收到的 `ATOMIC` 请求数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rx_atomic_requests_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rx_dct_connect_requests_total`

关联 `DCT` 收到的连接请求数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rx_dct_connect_requests_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rx_read_requests_total`

关联`QP`收到的 `READ` 请求数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rx_read_requests_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rx_write_requests_total`

关联`QP`收到的 `WRITE` 请求数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rx_write_requests_total{device="mlx5_0",port="1"} 0
```

### `node_infiniband_rx_icrc_encapsulated_errors_total`

带 `ICRC` 错误的 `RoCE` 包数。类型为`counter`，单位/值为：累计计数。Label：`device` 表示 `InfiniBand/RDMA` 设备名，`port` 表示设备端口号。

```prometheus
node_infiniband_rx_icrc_encapsulated_errors_total{device="mlx5_0",port="1"} 0
```

### `node_ethtool_info`

网卡驱动信息，指标值恒为 `1`。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `bus_info` | `0000:03:00.0` | 设备总线信息。 |
| `device` | `eth0` | 网络设备名。 |
| `driver` | `mlx5_core` | 网卡驱动名。 |
| `expansion_rom_version` | `14.32.12` | 扩展 ROM 版本；驱动未提供时可能为空。 |
| `firmware_version` | `16.35.2000` | 固件版本；驱动未提供时可能为空。 |
| `version` | `5.15.0` | 驱动版本；驱动未提供时可能为空。 |

```prometheus
# HELP node_ethtool_info A metric with a constant '1' value labeled by bus_info, device, driver, expansion_rom_version, firmware_version, version.
# TYPE node_ethtool_info gauge
node_ethtool_info{bus_info="0000:03:00.0",device="eth0",driver="mlx5_core",expansion_rom_version="",firmware_version="16.35.2000",version="5.15.0"} 1
```

### `node_ethtool_received_bytes_total`

驱动`stats`中 `rx_bytes` 规范化后的接收字节数。类型为`untyped`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_received_bytes_total{device="eth0"} 1048576
```

### `node_ethtool_received_dropped_total`

驱动`stats`中 `rx_dropped` 规范化后的接收丢帧数。类型为`untyped`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_received_dropped_total{device="eth0"} 0
```

### `node_ethtool_received_errors_total`

驱动`stats`中 `rx_errors` 规范化后的接收错误帧数。类型为`untyped`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_received_errors_total{device="eth0"} 0
```

### `node_ethtool_received_packets_total`

驱动`stats`中 `rx_packets` 规范化后的接收包数。类型为`untyped`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_received_packets_total{device="eth0"} 42
```

### `node_ethtool_transmitted_bytes_total`

驱动`stats`中 `tx_bytes` 规范化后的发送字节数。类型为`untyped`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_transmitted_bytes_total{device="eth0"} 1048576
```

### `node_ethtool_transmitted_errors_total`

驱动`stats`中 `tx_errors` 规范化后的发送错误帧数。类型为`untyped`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_transmitted_errors_total{device="eth0"} 0
```

### `node_ethtool_transmitted_packets_total`

驱动`stats`中 `tx_packets` 规范化后的发送包数。类型为`untyped`，单位/值为：累计计数。其他驱动`stats`会经指标名清理后暴露，具体名称、单位和含义由网卡驱动决定，上游没有跨驱动固定完整清单；因此本节只拆分上游源码中预置描述的固定 `ethtool` 指标。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_ethtool_transmitted_packets_total{device="eth0"} 42
```

### `node_network_supported_port_info`

网卡支持的端口或 PHY 类型，例如 `TP`、`FIBRE`、`Backplane`。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |
| `type` | `FIBRE` | 支持的端口或 PHY 类型。 |

```prometheus
node_network_supported_port_info{device="eth0",type="FIBRE"} 1
```

### `node_network_supported_speed_bytes`

网卡支持的速度、双工模式和物理模式组合。类型为`gauge`，单位/值为：字节/秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |
| `duplex` | `full` | 双工模式。 |
| `mode` | `100000baseSR4` | 物理模式或链路模式。 |

```prometheus
node_network_supported_speed_bytes{device="eth0",duplex="full",mode="100000baseSR4"} 12500000000
```

### `node_network_autonegotiate_supported`

网卡是否支持自协商。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_autonegotiate_supported{device="eth0"} 1
```

### `node_network_pause_supported`

网卡是否支持 pause frame。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_pause_supported{device="eth0"} 1
```

### `node_network_asymmetricpause_supported`

网卡是否支持 asymmetric pause frame。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_asymmetricpause_supported{device="eth0"} 1
```

### `node_network_advertised_speed_bytes`

网卡当前 advertised 的速度、双工模式和物理模式组合。类型为`gauge`，单位/值为：字节/秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |
| `duplex` | `full` | 双工模式。 |
| `mode` | `100000baseSR4` | 物理模式或链路模式。 |

```prometheus
node_network_advertised_speed_bytes{device="eth0",duplex="full",mode="100000baseSR4"} 12500000000
```

### `node_network_autonegotiate_advertised`

网卡是否 advertised 自协商能力。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_autonegotiate_advertised{device="eth0"} 1
```

### `node_network_pause_advertised`

网卡是否 advertised pause 能力。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_pause_advertised{device="eth0"} 1
```

### `node_network_asymmetricpause_advertised`

网卡是否 advertised asymmetric pause 能力。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_asymmetricpause_advertised{device="eth0"} 1
```

### `node_network_autonegotiate`

端口当前是否启用自协商。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `device` | `eth0` | 网络设备名。 |

```prometheus
node_network_autonegotiate{device="eth0"} 1
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

### `node_textfile_mtime_seconds`

成功读取的 `.prom` 文件最后修改时间。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `file` | `/var/lib/node_exporter/textfile_collector/job.prom` | 成功解析并读取的 `.prom` 文件完整路径。 |

```prometheus
# HELP node_textfile_mtime_seconds Unixtime mtime of textfiles successfully read.
# TYPE node_textfile_mtime_seconds gauge
node_textfile_mtime_seconds{file="/var/lib/node_exporter/textfile_collector/job.prom"} 1700000000
```

### `node_textfile_scrape_error`

打开目录、读取文件、解析 `.prom` 文件、发现不支持的客户端时间戳或同名指标存在不一致 `HELP` 文案时为 `1`，否则为 `0`。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP node_textfile_scrape_error 1 if there was an error opening or reading a file, 0 otherwise
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
- [Node Exporter infiniband collector 源码](https://github.com/prometheus/node_exporter/blob/master/collector/infiniband_linux.go)
- [Prometheus procfs InfiniBand sysfs 解析源码](https://github.com/prometheus/procfs/blob/master/sysfs/class_infiniband.go)
- [Node Exporter ethtool collector 源码](https://github.com/prometheus/node_exporter/blob/master/collector/ethtool_linux.go)
- [Node Exporter textfile collector 源码](https://github.com/prometheus/node_exporter/blob/master/collector/textfile.go)
- [Prometheus 文本格式说明](https://prometheus.io/docs/instrumenting/exposition_formats/)
- [Prometheus 官方 Node Exporter Guide](https://prometheus.io/docs/guides/node-exporter/)
