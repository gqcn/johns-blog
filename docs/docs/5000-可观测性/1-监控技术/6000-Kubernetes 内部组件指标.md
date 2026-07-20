---
slug: "/observability/kubernetes-internal-metrics"
title: "Kubernetes 内部组件指标：API Server、Kubelet 与运行时 Label 说明"
hide_title: true
keywords:
  ["Kubernetes", "Prometheus", "API Server", "Kubelet", "client-go", "Go 运行时", "Workqueue", "Label"]
description: "系统介绍 Kubernetes 内部组件常见指标，覆盖 API Server、认证授权、Kubelet、client-go、Go 运行时、进程和 workqueue，并逐项说明指标 Label。"
---

## 基本简介

`Kubernetes` 控制面和节点组件会在各自`/metrics`端点暴露运行时与控制循环指标。常见来源包括 `kube-apiserver`、`kubelet`、`kube-controller-manager`、`kube-scheduler`、`cloud-controller-manager` 以及使用 `client-go` 的组件。

本文覆盖 `API Server` 审计/认证授权/存储加密、`Kubelet`、`REST 客户端`、`Go 运行时`、进程、`CSI`、存储操作和 `workqueue` 等指标。`Label` 说明优先采用 `Kubernetes` Metrics Reference；对当前官方资料缺失或版本差异较大的指标，保留可确认 `Label` 并标注无可查资料。


## 监控指标

集群的内部指标，大部分场景下没什么用，常用于管控类指标监控。

组件源码地址：https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/apiserver

Sample文件：[kube-internal.txt](/attachments/kube-internal.txt)

### API Server

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `apiserver_audit_event_total` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `ALPHA`：`API Server` 生成并发送到审计后端的审计事件累计数。 |
| `apiserver_audit_requests_rejected_total` | `counter` | 累计计数 | `ALPHA`：因审计日志后端错误而被 `API Server` 拒绝的请求累计数。 |
| `apiserver_client_certificate_expiration_seconds` | `histogram` | 秒 | `ALPHA`：用于认证请求的客户端证书剩余有效期分布。 |
| `apiserver_delegated_authn_request_duration_seconds` | `histogram` | 秒 | `ALPHA`：请求延迟分布，按状态码拆分。 |
| `apiserver_delegated_authn_request_total` | `counter` | 累计计数 | `ALPHA`：`HTTP` 请求累计数，按状态码拆分。 |
| `apiserver_delegated_authz_request_duration_seconds` | `histogram` | 秒 | `ALPHA`：请求延迟分布，按状态码拆分。 |
| `apiserver_delegated_authz_request_total` | `counter` | 累计计数 | `ALPHA`：`HTTP` 请求累计数，按状态码拆分。 |
| `apiserver_envelope_encryption_dek_cache_fill_percent` | `gauge` | 百分比 | `ALPHA`：`DEK` 缓存当前已占用槽位的百分比。 |
| `apiserver_storage_data_key_generation_duration_seconds` | `histogram` | 秒 | `ALPHA`：数据加密密钥（`DEK`）生成操作的延迟分布。 |
| `apiserver_storage_data_key_generation_failures_total` | `counter` | 累计计数 | `ALPHA`：数据加密密钥（`DEK`）生成失败的累计次数。 |
| `apiserver_storage_envelope_transformation_cache_misses_total` | `counter` | 累计计数 | `ALPHA`：访问密钥加密密钥（`KEK`）时发生缓存未命中的累计次数。 |
| `apiserver_webhooks_x509_missing_san_total` | `counter` | 累计计数 | `ALPHA`：统计目标服务证书缺少 `SAN` 扩展的请求次数，或因缺少 `SAN` 扩展导致连接失败的次数；具体含义取决于运行环境。 |

### 认证 Token

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `authentication_token_cache_active_fetch_count` | `gauge` | - | `ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。 |
| `authentication_token_cache_fetch_total` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。 |
| `authentication_token_cache_request_duration_seconds` | `histogram` | 秒 | `ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。 |
| `authentication_token_cache_request_total` | `counter` | 累计计数 | `ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。 |
| `get_token_count` | `counter` | 累计计数 | `ALPHA`：向备用 `token` 来源发起 `Token()` 请求的累计次数。 |
| `get_token_fail_count` | `counter` | 累计计数 | `ALPHA`：向备用 `token` 来源发起 `Token()` 请求失败的累计次数。 |

### Kubelet

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kubelet_cgroup_manager_duration_seconds` | `histogram` | 秒 | `ALPHA`：`cgroup` 管理器操作耗时分布，按方法拆分。 |
| `kubelet_container_log_filesystem_used_bytes` | `gauge` | 字节 | `ALPHA`：容器日志在文件系统中占用的字节数。 |
| `kubelet_containers_per_pod_count` | `histogram` | 数量 | `ALPHA`：每个 `Pod` 中的容器数量分布。 |
| `kubelet_device_plugin_alloc_duration_seconds` | `histogram` | 秒 | `ALPHA`：处理设备插件 `Allocation` 请求的耗时分布，按资源名称拆分。 |
| `kubelet_device_plugin_registration_total` | `counter` | 累计计数 | `ALPHA`：设备插件注册累计次数，按资源名称拆分。 |
| `kubelet_docker_operations_duration_seconds` | `histogram` | 秒 | `ALPHA`：`Docker` 操作延迟分布，按操作类型拆分。 |
| `kubelet_docker_operations_errors_total` | `counter` | 累计计数 | `ALPHA`：`Docker` 操作错误累计次数，按操作类型拆分。 |
| `kubelet_docker_operations_timeout_total` | `counter` | 累计计数 | `ALPHA`：`Docker` 操作超时累计次数，按操作类型拆分。 |
| `kubelet_docker_operations_total` | `counter` | 累计计数 | `ALPHA`：`Docker` 操作累计次数，按操作类型拆分。 |
| `kubelet_http_inflight_requests` | `gauge` | 当前数量 | `ALPHA`：当前正在处理中的 `HTTP` 请求数量。 |
| `kubelet_http_requests_duration_seconds` | `histogram` | 秒 | `ALPHA`：处理 `HTTP` 请求的耗时分布。 |
| `kubelet_http_requests_total` | `counter` | 累计计数 | `ALPHA`：服务启动以来收到的 `HTTP` 请求累计数。 |
| `kubelet_managed_ephemeral_containers` | `gauge` | 数量 | `ALPHA`：该 `kubelet` 管理的 `Pod` 中当前临时容器（ephemeral container）数量；如果 `EphemeralContainers` 特性门控关闭，则不统计临时容器，指标值为 `0`。 |
| `kubelet_network_plugin_operations_duration_seconds` | `histogram` | 秒 | `ALPHA`：网络插件操作延迟分布，按操作类型拆分。 |
| `kubelet_network_plugin_operations_errors_total` | `counter` | 累计计数 | `ALPHA`：网络插件操作错误累计次数，按操作类型拆分。 |
| `kubelet_network_plugin_operations_total` | `counter` | 累计计数 | `ALPHA`：网络插件操作累计次数，按操作类型拆分。 |
| `kubelet_node_name` | `gauge` | 常量 `1` | `ALPHA`：当前 `kubelet` 所属 `Node` 名称，指标值恒为 `1`。 |
| `kubelet_pleg_discard_events` | `counter` | 累计计数 | `ALPHA`：`PLEG` 丢弃事件的累计次数。 |
| `kubelet_pleg_last_seen_seconds` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | `ALPHA`：`PLEG` 最近一次活跃时间的 `Unix` 时间戳。 |
| `kubelet_pleg_relist_duration_seconds` | `histogram` | 秒 | `ALPHA`：`PLEG` 重新列举 `Pod` 的耗时分布。 |
| `kubelet_pleg_relist_interval_seconds` | `histogram` | 秒 | `ALPHA`：`PLEG` 两次重新列举之间的间隔分布。 |
| `kubelet_pod_start_duration_seconds` | `histogram` | 秒 | `ALPHA`：单个 `Pod` 从 `Pending` 到 `Running` 的耗时分布。 |
| `kubelet_pod_worker_duration_seconds` | `histogram` | 秒 | `ALPHA`：同步单个 `Pod` 的耗时分布，按 create、update 或 sync 操作类型拆分。 |
| `kubelet_pod_worker_start_duration_seconds` | `histogram` | 秒 | `ALPHA`：从发现 `Pod` 到启动 `worker` 的耗时分布。 |
| `kubelet_run_podsandbox_duration_seconds` | `histogram` | 秒 | `ALPHA`：`RunPodSandbox` 操作耗时分布，按 `RuntimeClass handler` 拆分。 |
| `kubelet_run_podsandbox_errors_total` | `counter` | 累计计数 | `ALPHA`：`RunPodSandbox` 操作错误累计次数，按 `RuntimeClass handler` 拆分。 |
| `kubelet_running_containers` | `gauge` | 数量 | `ALPHA`：当前正在运行的容器数量。 |
| `kubelet_running_pods` | `gauge` | 数量 | `ALPHA`：已有运行中 `Pod sandbox` 的 `Pod` 数量。 |
| `kubelet_runtime_operations_duration_seconds` | `histogram` | 秒 | `ALPHA`：容器运行时操作耗时分布，按操作类型拆分。 |
| `kubelet_runtime_operations_errors_total` | `counter` | 累计计数 | `ALPHA`：容器运行时操作错误累计次数，按操作类型拆分。 |
| `kubelet_runtime_operations_total` | `counter` | 累计计数 | `ALPHA`：容器运行时操作累计次数，按操作类型拆分。 |
| `kubelet_started_containers_errors_total` | `counter` | 累计计数 | `ALPHA`：启动容器时发生错误的累计次数。 |
| `kubelet_started_containers_total` | `counter` | 累计计数 | `ALPHA`：已启动容器的累计数量。 |
| `kubelet_started_pods_errors_total` | `counter` | 累计计数 | `ALPHA`：启动 `Pod` 时发生错误的累计次数。 |
| `kubelet_started_pods_total` | `counter` | 累计计数 | `ALPHA`：已启动 `Pod` 的累计数量。 |
| `kubelet_volume_stats_available_bytes` | `gauge` | 字节 | `ALPHA`：卷（`volume`）当前可用字节数。 |
| `kubelet_volume_stats_capacity_bytes` | `gauge` | 字节 | `ALPHA`：卷（`volume`）总容量，单位为字节。 |
| `kubelet_volume_stats_inodes` | `gauge` | `inode` 数量 | `ALPHA`：卷（`volume`）`inode` 总数。 |
| `kubelet_volume_stats_inodes_free` | `gauge` | `inode` 数量 | `ALPHA`：卷（`volume`）当前可用 `inode` 数。 |
| `kubelet_volume_stats_inodes_used` | `gauge` | `inode` 数量 | `ALPHA`：卷（`volume`）当前已用 `inode` 数。 |
| `kubelet_volume_stats_used_bytes` | `gauge` | 字节 | `ALPHA`：卷（`volume`）当前已用字节数。 |

### CSI/存储

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `csi_operations_seconds` | `histogram` | 秒 | `ALPHA`：`CSI` 操作耗时分布，并按 `gRPC` 状态码等维度统计。 |
| `plugin_manager_total_plugins` | `gauge` | 数量 | `ALPHA`：插件管理器（`Plugin Manager`）中的插件数量。 |
| `storage_operation_duration_seconds` | `histogram` | 秒 | `ALPHA`：存储操作耗时分布。 |
| `storage_operation_errors_total` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `ALPHA`：存储操作错误累计次数；自 `Kubernetes` 1.21.0 起废弃。 |
| `storage_operation_status_count` | `counter` | 累计计数 | `ALPHA`：存储操作返回状态累计次数；自 `Kubernetes` 1.21.0 起废弃。 |
| `volume_manager_total_volumes` | `gauge` | 数量 | `ALPHA`：卷管理器（`Volume Manager`）中的卷数量。 |

### REST 客户端

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `rest_client_exec_plugin_certificate_rotation_age` | `histogram` | 秒 | `ALPHA`：认证 `exec` 插件客户端证书在最近一次轮转前的存活时长分布；未使用该证书时，直方图不会产生数据。 |
| `rest_client_exec_plugin_ttl_seconds` | `gauge` | 秒 | `ALPHA`：认证 `exec` 插件管理的客户端证书最短剩余有效期；单位为秒，已过期时为负值，未使用或未管理 `TLS` 证书时为 `+Inf`。 |
| `rest_client_rate_limiter_duration_seconds` | `histogram` | 秒 | `ALPHA`：客户端限速器延迟分布，按请求方法和 `URL` 拆分。 |
| `rest_client_request_duration_seconds` | `histogram` | 秒 | `ALPHA`：`REST 客户端`请求延迟分布，按请求方法和 `URL` 拆分。 |
| `rest_client_requests_total` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `ALPHA`：`HTTP` 请求累计数，按状态码、请求方法和 `host` 拆分。 |

### Go 运行时/进程

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `go_gc_duration_seconds` | `summary` | 秒 | `Go` 垃圾回收暂停时长的 `summary` 类型指标。 |
| `go_goroutines` | `gauge` | 数量 | 当前存在的 goroutine 数量。 |
| `go_info` | `gauge` | 常量 `1` | `Go` 运行环境信息，指标值恒为 `1`。 |
| `go_memstats_alloc_bytes` | `gauge` | 字节 | 当前已分配且仍在使用的字节数。 |
| `go_memstats_alloc_bytes_total` | `counter` | 字节 | 累计分配的字节数，包括已经释放的内存。 |
| `go_memstats_buck_hash_sys_bytes` | `gauge` | 字节 | 性能分析 `bucket` 哈希表使用的字节数。 |
| `go_memstats_frees_total` | `counter` | 累计计数 | 内存释放操作的累计次数。 |
| `go_memstats_gc_cpu_fraction` | `gauge` | 比例 | 进程启动以来，GC 使用的可用 `CPU` 时间占比。 |
| `go_memstats_gc_sys_bytes` | `gauge` | 字节 | 垃圾回收系统元数据使用的字节数。 |
| `go_memstats_heap_alloc_bytes` | `gauge` | 字节 | 当前已分配且仍在使用的堆内存字节数。 |
| `go_memstats_heap_idle_bytes` | `gauge` | 字节 | 已保留但尚未使用的堆内存字节数。 |
| `go_memstats_heap_inuse_bytes` | `gauge` | 字节 | 正在使用的堆内存字节数。 |
| `go_memstats_heap_objects` | `gauge` | 数量 | 当前已分配对象数量。 |
| `go_memstats_heap_released_bytes` | `gauge` | 字节 | 已归还给操作系统的堆内存字节数。 |
| `go_memstats_heap_sys_bytes` | `gauge` | 字节 | 从系统获得的堆内存字节数。 |
| `go_memstats_last_gc_time_seconds` | `gauge` | `Unix` 时间戳（秒） | 最近一次垃圾回收发生时间的 `Unix` 时间戳。 |
| `go_memstats_lookups_total` | `counter` | 累计计数 | 指针查找的累计次数。 |
| `go_memstats_mallocs_total` | `counter` | 累计计数 | malloc 分配操作的累计次数。 |
| `go_memstats_mcache_inuse_bytes` | `gauge` | 字节 | mcache 结构当前使用的字节数。 |
| `go_memstats_mcache_sys_bytes` | `gauge` | 字节 | 系统为 mcache 结构分配的字节数。 |
| `go_memstats_mspan_inuse_bytes` | `gauge` | 字节 | mspan 结构当前使用的字节数。 |
| `go_memstats_mspan_sys_bytes` | `gauge` | 字节 | 系统为 mspan 结构分配的字节数。 |
| `go_memstats_next_gc_bytes` | `gauge` | 字节 | 触发下一次垃圾回收的堆内存目标字节数。 |
| `go_memstats_other_sys_bytes` | `gauge` | 字节 | 其他系统分配使用的字节数。 |
| `go_memstats_stack_inuse_bytes` | `gauge` | 字节 | 栈分配器当前使用的字节数。 |
| `go_memstats_stack_sys_bytes` | `gauge` | 字节 | 系统为栈分配器分配的字节数。 |
| `go_memstats_sys_bytes` | `gauge` | 字节 | `Go 运行时`从系统获得的总字节数。 |
| `go_threads` | `gauge` | 数量 | `Go 运行时`创建的 `OS` 线程数量。 |
| `kubernetes_build_info` | `gauge` | 常量 `1` | `ALPHA`：`Kubernetes` 构建信息指标，指标值恒为 `1`，通过 `Label` 标识版本、`Git` 修订、构建时间、`Go` 版本、编译器和运行平台。 |
| `process_cpu_seconds_total` | `counter` | 秒 | 进程累计消耗的用户态和系统态 `CPU` 时间。 |
| `process_max_fds` | `gauge` | 数量 | 进程允许打开的最大文件描述符数量。 |
| `process_open_fds` | `gauge` | 数量 | 进程当前打开的文件描述符数量。 |
| `process_resident_memory_bytes` | `gauge` | 字节 | 进程常驻内存大小，单位为字节。 |
| `process_start_time_seconds` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | 进程启动时间，表示为 `Unix` 时间戳秒数。 |
| `process_virtual_memory_bytes` | `gauge` | 字节 | 进程虚拟内存大小，单位为字节。 |
| `process_virtual_memory_max_bytes` | `gauge` | 字节 | 进程可用虚拟内存上限，单位为字节。 |

### Workqueue

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `workqueue_adds_total` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `ALPHA`：`workqueue` 接收 `add` 事件的累计次数。 |
| `workqueue_depth` | `gauge` | 数量 | `ALPHA`：`workqueue` 当前队列深度。 |
| `workqueue_longest_running_processor_seconds` | `gauge` | 秒 | `ALPHA`：`workqueue` 中运行时间最长的处理器（`processor`）已运行的时长。 |
| `workqueue_queue_duration_seconds` | `histogram` | 秒 | `ALPHA`：元素被取出处理前在 `workqueue` 中停留的时长分布。 |
| `workqueue_retries_total` | `counter` | 累计计数 | `ALPHA`：`workqueue` 处理 `retry` 事件的累计次数。 |
| `workqueue_unfinished_work_seconds` | `gauge` | 秒 | `ALPHA`：`workqueue` 中正在处理但尚未被 `work_duration` 观测到的工作累计耗时；数值过大通常表示处理线程卡住，可结合增长速率推断卡住线程数量。 |
| `workqueue_work_duration_seconds` | `histogram` | 秒 | `ALPHA`：`workqueue` 处理单个元素的耗时分布。 |

## 指标详情

本节逐项说明指标含义、`Label` 和 `Prometheus` 文本格式示例。示例用于展示暴露格式，实际 `HELP` 文案、`Label` 集合和值以采集端输出为准。直方图指标的`le`只出现在`_bucket`序列；`Summary` 指标的`quantile`只出现在分位序列。

### `apiserver_audit_event_total`

`ALPHA`：`API Server` 生成并发送到审计后端的审计事件累计数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP apiserver_audit_event_total ALPHA：API Server 生成并发送到审计后端的审计事件累计数
# TYPE apiserver_audit_event_total counter
apiserver_audit_event_total 42
```

### `apiserver_audit_requests_rejected_total`

`ALPHA`：因审计日志后端错误而被 `API Server` 拒绝的请求累计数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP apiserver_audit_requests_rejected_total ALPHA：因审计日志后端错误而被 API Server 拒绝的请求累计数
# TYPE apiserver_audit_requests_rejected_total counter
apiserver_audit_requests_rejected_total 42
```

### `apiserver_client_certificate_expiration_seconds`

`ALPHA`：用于认证请求的客户端证书剩余有效期分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `0` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP apiserver_client_certificate_expiration_seconds ALPHA：用于认证请求的客户端证书剩余有效期分布
# TYPE apiserver_client_certificate_expiration_seconds histogram
apiserver_client_certificate_expiration_seconds_bucket{le="0"} 3
apiserver_client_certificate_expiration_seconds_bucket{le="+Inf"} 5
apiserver_client_certificate_expiration_seconds_sum 1.23
apiserver_client_certificate_expiration_seconds_count 5
```

### `apiserver_delegated_authn_request_duration_seconds`

`ALPHA`：请求延迟分布，按状态码拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `code` | `201` | `HTTP` 状态码或请求结果码。 |
| `le` | `0.25` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP apiserver_delegated_authn_request_duration_seconds ALPHA：请求延迟分布，按状态码拆分
# TYPE apiserver_delegated_authn_request_duration_seconds histogram
apiserver_delegated_authn_request_duration_seconds_bucket{code="201",le="0.25"} 3
apiserver_delegated_authn_request_duration_seconds_bucket{code="201",le="+Inf"} 5
apiserver_delegated_authn_request_duration_seconds_sum{code="201"} 1.23
apiserver_delegated_authn_request_duration_seconds_count{code="201"} 5
```

### `apiserver_delegated_authn_request_total`

`ALPHA`：`HTTP` 请求累计数，按状态码拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `code` | `201` | `HTTP` 状态码或请求结果码。 |

```prometheus
# HELP apiserver_delegated_authn_request_total ALPHA：HTTP 请求累计数，按状态码拆分
# TYPE apiserver_delegated_authn_request_total counter
apiserver_delegated_authn_request_total{code="201"} 42
```

### `apiserver_delegated_authz_request_duration_seconds`

`ALPHA`：请求延迟分布，按状态码拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `code` | `201` | `HTTP` 状态码或请求结果码。 |
| `le` | `0.25` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP apiserver_delegated_authz_request_duration_seconds ALPHA：请求延迟分布，按状态码拆分
# TYPE apiserver_delegated_authz_request_duration_seconds histogram
apiserver_delegated_authz_request_duration_seconds_bucket{code="201",le="0.25"} 3
apiserver_delegated_authz_request_duration_seconds_bucket{code="201",le="+Inf"} 5
apiserver_delegated_authz_request_duration_seconds_sum{code="201"} 1.23
apiserver_delegated_authz_request_duration_seconds_count{code="201"} 5
```

### `apiserver_delegated_authz_request_total`

`ALPHA`：`HTTP` 请求累计数，按状态码拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `code` | `201` | `HTTP` 状态码或请求结果码。 |

```prometheus
# HELP apiserver_delegated_authz_request_total ALPHA：HTTP 请求累计数，按状态码拆分
# TYPE apiserver_delegated_authz_request_total counter
apiserver_delegated_authz_request_total{code="201"} 42
```

### `apiserver_envelope_encryption_dek_cache_fill_percent`

`ALPHA`：`DEK` 缓存当前已占用槽位的百分比。类型为`gauge`，单位/值为：百分比。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP apiserver_envelope_encryption_dek_cache_fill_percent ALPHA：DEK 缓存当前已占用槽位的百分比
# TYPE apiserver_envelope_encryption_dek_cache_fill_percent gauge
apiserver_envelope_encryption_dek_cache_fill_percent 75
```

### `apiserver_storage_data_key_generation_duration_seconds`

`ALPHA`：数据加密密钥（`DEK`）生成操作的延迟分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `5e-06` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP apiserver_storage_data_key_generation_duration_seconds ALPHA：数据加密密钥（DEK）生成操作的延迟分布
# TYPE apiserver_storage_data_key_generation_duration_seconds histogram
apiserver_storage_data_key_generation_duration_seconds_bucket{le="5e-06"} 3
apiserver_storage_data_key_generation_duration_seconds_bucket{le="+Inf"} 5
apiserver_storage_data_key_generation_duration_seconds_sum 1.23
apiserver_storage_data_key_generation_duration_seconds_count 5
```

### `apiserver_storage_data_key_generation_failures_total`

`ALPHA`：数据加密密钥（`DEK`）生成失败的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP apiserver_storage_data_key_generation_failures_total ALPHA：数据加密密钥（DEK）生成失败的累计次数
# TYPE apiserver_storage_data_key_generation_failures_total counter
apiserver_storage_data_key_generation_failures_total 42
```

### `apiserver_storage_envelope_transformation_cache_misses_total`

`ALPHA`：访问密钥加密密钥（`KEK`）时发生缓存未命中的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP apiserver_storage_envelope_transformation_cache_misses_total ALPHA：访问密钥加密密钥（KEK）时发生缓存未命中的累计次数
# TYPE apiserver_storage_envelope_transformation_cache_misses_total counter
apiserver_storage_envelope_transformation_cache_misses_total 42
```

### `apiserver_webhooks_x509_missing_san_total`

`ALPHA`：统计目标服务证书缺少 `SAN` 扩展的请求次数，或因缺少 `SAN` 扩展导致连接失败的次数；具体含义取决于运行环境。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP apiserver_webhooks_x509_missing_san_total ALPHA：统计目标服务证书缺少 SAN 扩展的请求次数，或因缺少 SAN 扩展导致连接失败的次数；具体含义取决于运行环境
# TYPE apiserver_webhooks_x509_missing_san_total counter
apiserver_webhooks_x509_missing_san_total 42
```

### `authentication_token_cache_active_fetch_count`

`ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。类型为`gauge`，单位/值为：未在公开说明中声明。

| Label | 示例值 | 含义 |
|---|---|---|
| `status` | `blocked` | 认证 `Token` 缓存状态维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在，但未给出完整取值集合。 |

```prometheus
# HELP authentication_token_cache_active_fetch_count ALPHA：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 Label，未找到可核验的语义描述
# TYPE authentication_token_cache_active_fetch_count gauge
authentication_token_cache_active_fetch_count{status="blocked"} 1
```

### `authentication_token_cache_fetch_total`

`ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `status` | `ok` | 认证 `Token` 缓存状态维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在，但未给出完整取值集合。 |

```prometheus
# HELP authentication_token_cache_fetch_total ALPHA：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 Label，未找到可核验的语义描述
# TYPE authentication_token_cache_fetch_total counter
authentication_token_cache_fetch_total{status="ok"} 42
```

### `authentication_token_cache_request_duration_seconds`

`ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `status` | `hit` | 认证 `Token` 缓存状态维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在，但未给出完整取值集合。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP authentication_token_cache_request_duration_seconds ALPHA：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 Label，未找到可核验的语义描述
# TYPE authentication_token_cache_request_duration_seconds histogram
authentication_token_cache_request_duration_seconds_bucket{status="hit",le="0.005"} 3
authentication_token_cache_request_duration_seconds_bucket{status="hit",le="+Inf"} 5
authentication_token_cache_request_duration_seconds_sum{status="hit"} 1.23
authentication_token_cache_request_duration_seconds_count{status="hit"} 5
```

### `authentication_token_cache_request_total`

`ALPHA`：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 `Label`，未找到可核验的语义描述。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `status` | `hit` | 认证 `Token` 缓存状态维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在，但未给出完整取值集合。 |

```prometheus
# HELP authentication_token_cache_request_total ALPHA：无可查资料。公开资料只能确认指标名称、类型、稳定性标记和 Label，未找到可核验的语义描述
# TYPE authentication_token_cache_request_total counter
authentication_token_cache_request_total{status="hit"} 42
```

### `csi_operations_seconds`

`ALPHA`：`CSI` 操作耗时分布，并按 `gRPC` 状态码等维度统计。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `driver_name` | `com.tencent.cloud.csi.cbs` | `CSI` 驱动名称。 |
| `grpc_status_code` | `Internal` | `gRPC` 状态码。 |
| `method_name` | `/csi.v1.Node/NodeUnpublishVolume` | `CSI` `gRPC` 方法名。 |
| `migrated` | `false` | `CSI` 迁移是否启用。 |
| `le` | `0.1` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP csi_operations_seconds ALPHA：CSI 操作耗时分布，并按 gRPC 状态码等维度统计
# TYPE csi_operations_seconds histogram
csi_operations_seconds_bucket{driver_name="com.tencent.cloud.csi.cbs",grpc_status_code="Internal",method_name="/csi.v1.Node/NodeUnpublishVolume",migrated="false",le="0.1"} 3
csi_operations_seconds_bucket{driver_name="com.tencent.cloud.csi.cbs",grpc_status_code="Internal",method_name="/csi.v1.Node/NodeUnpublishVolume",migrated="false",le="+Inf"} 5
csi_operations_seconds_sum{driver_name="com.tencent.cloud.csi.cbs",grpc_status_code="Internal",method_name="/csi.v1.Node/NodeUnpublishVolume",migrated="false"} 1.23
csi_operations_seconds_count{driver_name="com.tencent.cloud.csi.cbs",grpc_status_code="Internal",method_name="/csi.v1.Node/NodeUnpublishVolume",migrated="false"} 5
```

### `get_token_count`

`ALPHA`：向备用 `token` 来源发起 `Token()` 请求的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP get_token_count ALPHA：向备用 token 来源发起 Token() 请求的累计次数
# TYPE get_token_count counter
get_token_count 42
```

### `get_token_fail_count`

`ALPHA`：向备用 `token` 来源发起 `Token()` 请求失败的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP get_token_fail_count ALPHA：向备用 token 来源发起 Token() 请求失败的累计次数
# TYPE get_token_fail_count counter
get_token_fail_count 42
```

### `go_gc_duration_seconds`

`Go` 垃圾回收暂停时长的 `summary` 类型指标。类型为`summary`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `quantile` | `0` | `Summary` 分位点标签，仅出现在 `summary` 分位序列上。 |

```prometheus
# HELP go_gc_duration_seconds Go 垃圾回收暂停时长的 summary 类型指标
# TYPE go_gc_duration_seconds summary
go_gc_duration_seconds{quantile="0"} 0.012
go_gc_duration_seconds_sum 0.036
go_gc_duration_seconds_count 3
```

### `go_goroutines`

当前存在的 `goroutine` 数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_goroutines 当前存在的 goroutine 数量
# TYPE go_goroutines gauge
go_goroutines 1
```

### `go_info`

`Go` 运行环境信息，指标值恒为 `1`。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `version` | `go1.16.14` | `Go 运行时` 版本。 |

```prometheus
# HELP go_info Go 运行环境信息，指标值恒为 1
# TYPE go_info gauge
go_info{version="go1.16.14"} 1
```

### `go_memstats_alloc_bytes`

当前已分配且仍在使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_alloc_bytes 当前已分配且仍在使用的字节数
# TYPE go_memstats_alloc_bytes gauge
go_memstats_alloc_bytes 1048576
```

### `go_memstats_alloc_bytes_total`

累计分配的字节数，包括已经释放的内存。类型为`counter`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_alloc_bytes_total 累计分配的字节数，包括已经释放的内存
# TYPE go_memstats_alloc_bytes_total counter
go_memstats_alloc_bytes_total 1048576
```

### `go_memstats_buck_hash_sys_bytes`

性能分析 `bucket` 哈希表使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_buck_hash_sys_bytes 性能分析 bucket 哈希表使用的字节数
# TYPE go_memstats_buck_hash_sys_bytes gauge
go_memstats_buck_hash_sys_bytes 1048576
```

### `go_memstats_frees_total`

内存释放操作的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_frees_total 内存释放操作的累计次数
# TYPE go_memstats_frees_total counter
go_memstats_frees_total 42
```

### `go_memstats_gc_cpu_fraction`

进程启动以来，GC 使用的可用 `CPU` 时间占比。类型为`gauge`，单位/值为：比例。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_gc_cpu_fraction 进程启动以来，GC 使用的可用 CPU 时间占比
# TYPE go_memstats_gc_cpu_fraction gauge
go_memstats_gc_cpu_fraction 0.95
```

### `go_memstats_gc_sys_bytes`

垃圾回收系统元数据使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_gc_sys_bytes 垃圾回收系统元数据使用的字节数
# TYPE go_memstats_gc_sys_bytes gauge
go_memstats_gc_sys_bytes 1048576
```

### `go_memstats_heap_alloc_bytes`

当前已分配且仍在使用的堆内存字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_heap_alloc_bytes 当前已分配且仍在使用的堆内存字节数
# TYPE go_memstats_heap_alloc_bytes gauge
go_memstats_heap_alloc_bytes 1048576
```

### `go_memstats_heap_idle_bytes`

已保留但尚未使用的堆内存字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_heap_idle_bytes 已保留但尚未使用的堆内存字节数
# TYPE go_memstats_heap_idle_bytes gauge
go_memstats_heap_idle_bytes 1048576
```

### `go_memstats_heap_inuse_bytes`

正在使用的堆内存字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_heap_inuse_bytes 正在使用的堆内存字节数
# TYPE go_memstats_heap_inuse_bytes gauge
go_memstats_heap_inuse_bytes 1048576
```

### `go_memstats_heap_objects`

当前已分配对象数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_heap_objects 当前已分配对象数量
# TYPE go_memstats_heap_objects gauge
go_memstats_heap_objects 1
```

### `go_memstats_heap_released_bytes`

已归还给操作系统的堆内存字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_heap_released_bytes 已归还给操作系统的堆内存字节数
# TYPE go_memstats_heap_released_bytes gauge
go_memstats_heap_released_bytes 1048576
```

### `go_memstats_heap_sys_bytes`

从系统获得的堆内存字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_heap_sys_bytes 从系统获得的堆内存字节数
# TYPE go_memstats_heap_sys_bytes gauge
go_memstats_heap_sys_bytes 1048576
```

### `go_memstats_last_gc_time_seconds`

最近一次垃圾回收发生时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_last_gc_time_seconds 最近一次垃圾回收发生时间的 Unix 时间戳
# TYPE go_memstats_last_gc_time_seconds gauge
go_memstats_last_gc_time_seconds 1700000000
```

### `go_memstats_lookups_total`

指针查找的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_lookups_total 指针查找的累计次数
# TYPE go_memstats_lookups_total counter
go_memstats_lookups_total 42
```

### `go_memstats_mallocs_total`

malloc 分配操作的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_mallocs_total malloc 分配操作的累计次数
# TYPE go_memstats_mallocs_total counter
go_memstats_mallocs_total 42
```

### `go_memstats_mcache_inuse_bytes`

mcache 结构当前使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_mcache_inuse_bytes mcache 结构当前使用的字节数
# TYPE go_memstats_mcache_inuse_bytes gauge
go_memstats_mcache_inuse_bytes 1048576
```

### `go_memstats_mcache_sys_bytes`

系统为 mcache 结构分配的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_mcache_sys_bytes 系统为 mcache 结构分配的字节数
# TYPE go_memstats_mcache_sys_bytes gauge
go_memstats_mcache_sys_bytes 1048576
```

### `go_memstats_mspan_inuse_bytes`

mspan 结构当前使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_mspan_inuse_bytes mspan 结构当前使用的字节数
# TYPE go_memstats_mspan_inuse_bytes gauge
go_memstats_mspan_inuse_bytes 1048576
```

### `go_memstats_mspan_sys_bytes`

系统为 mspan 结构分配的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_mspan_sys_bytes 系统为 mspan 结构分配的字节数
# TYPE go_memstats_mspan_sys_bytes gauge
go_memstats_mspan_sys_bytes 1048576
```

### `go_memstats_next_gc_bytes`

触发下一次垃圾回收的堆内存目标字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_next_gc_bytes 触发下一次垃圾回收的堆内存目标字节数
# TYPE go_memstats_next_gc_bytes gauge
go_memstats_next_gc_bytes 1048576
```

### `go_memstats_other_sys_bytes`

其他系统分配使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_other_sys_bytes 其他系统分配使用的字节数
# TYPE go_memstats_other_sys_bytes gauge
go_memstats_other_sys_bytes 1048576
```

### `go_memstats_stack_inuse_bytes`

栈分配器当前使用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_stack_inuse_bytes 栈分配器当前使用的字节数
# TYPE go_memstats_stack_inuse_bytes gauge
go_memstats_stack_inuse_bytes 1048576
```

### `go_memstats_stack_sys_bytes`

系统为栈分配器分配的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_stack_sys_bytes 系统为栈分配器分配的字节数
# TYPE go_memstats_stack_sys_bytes gauge
go_memstats_stack_sys_bytes 1048576
```

### `go_memstats_sys_bytes`

`Go 运行时`从系统获得的总字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_memstats_sys_bytes Go 运行时从系统获得的总字节数
# TYPE go_memstats_sys_bytes gauge
go_memstats_sys_bytes 1048576
```

### `go_threads`

`Go 运行时`创建的 `OS` 线程数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP go_threads Go 运行时创建的 OS 线程数量
# TYPE go_threads gauge
go_threads 1
```

### `kubelet_cgroup_manager_duration_seconds`

`ALPHA`：`cgroup` 管理器操作耗时分布，按方法拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `create` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_cgroup_manager_duration_seconds ALPHA：cgroup 管理器操作耗时分布，按方法拆分
# TYPE kubelet_cgroup_manager_duration_seconds histogram
kubelet_cgroup_manager_duration_seconds_bucket{operation_type="create",le="0.005"} 3
kubelet_cgroup_manager_duration_seconds_bucket{operation_type="create",le="+Inf"} 5
kubelet_cgroup_manager_duration_seconds_sum{operation_type="create"} 1.23
kubelet_cgroup_manager_duration_seconds_count{operation_type="create"} 5
```

### `kubelet_container_log_filesystem_used_bytes`

`ALPHA`：容器日志在文件系统中占用的字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `alertmanager` | 容器名称。 |
| `namespace` | `obs` | `Kubernetes` 命名空间。 |
| `pod` | `prometheus-alertmanager-0` | `Pod` 名称。 |
| `uid` | `451af3aa-a471-4f9f-8ab1-1b89f615011f` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kubelet_container_log_filesystem_used_bytes ALPHA：容器日志在文件系统中占用的字节数
# TYPE kubelet_container_log_filesystem_used_bytes gauge
kubelet_container_log_filesystem_used_bytes{container="alertmanager",namespace="obs",pod="prometheus-alertmanager-0",uid="451af3aa-a471-4f9f-8ab1-1b89f615011f"} 1048576
```

### `kubelet_containers_per_pod_count`

`ALPHA`：每个 `Pod` 中的容器数量分布。类型为`histogram`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `1` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_containers_per_pod_count ALPHA：每个 Pod 中的容器数量分布
# TYPE kubelet_containers_per_pod_count histogram
kubelet_containers_per_pod_count_bucket{le="1"} 3
kubelet_containers_per_pod_count_bucket{le="+Inf"} 5
kubelet_containers_per_pod_count_sum 1.23
kubelet_containers_per_pod_count_count 5
```

### `kubelet_device_plugin_alloc_duration_seconds`

`ALPHA`：处理设备插件 `Allocation` 请求的耗时分布，按资源名称拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `resource_name` | `tke.cloud.tencent.com/eni-ip` | 资源名称，常用于设备插件资源。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_device_plugin_alloc_duration_seconds ALPHA：处理设备插件 Allocation 请求的耗时分布，按资源名称拆分
# TYPE kubelet_device_plugin_alloc_duration_seconds histogram
kubelet_device_plugin_alloc_duration_seconds_bucket{resource_name="tke.cloud.tencent.com/eni-ip",le="0.005"} 3
kubelet_device_plugin_alloc_duration_seconds_bucket{resource_name="tke.cloud.tencent.com/eni-ip",le="+Inf"} 5
kubelet_device_plugin_alloc_duration_seconds_sum{resource_name="tke.cloud.tencent.com/eni-ip"} 1.23
kubelet_device_plugin_alloc_duration_seconds_count{resource_name="tke.cloud.tencent.com/eni-ip"} 5
```

### `kubelet_device_plugin_registration_total`

`ALPHA`：设备插件注册累计次数，按资源名称拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `resource_name` | `tke.cloud.tencent.com/eip` | 资源名称，常用于设备插件资源。 |

```prometheus
# HELP kubelet_device_plugin_registration_total ALPHA：设备插件注册累计次数，按资源名称拆分
# TYPE kubelet_device_plugin_registration_total counter
kubelet_device_plugin_registration_total{resource_name="tke.cloud.tencent.com/eip"} 42
```

### `kubelet_docker_operations_duration_seconds`

`ALPHA`：`Docker` 操作延迟分布，按操作类型拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `create_container` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_docker_operations_duration_seconds ALPHA：Docker 操作延迟分布，按操作类型拆分
# TYPE kubelet_docker_operations_duration_seconds histogram
kubelet_docker_operations_duration_seconds_bucket{operation_type="create_container",le="0.005"} 3
kubelet_docker_operations_duration_seconds_bucket{operation_type="create_container",le="+Inf"} 5
kubelet_docker_operations_duration_seconds_sum{operation_type="create_container"} 1.23
kubelet_docker_operations_duration_seconds_count{operation_type="create_container"} 5
```

### `kubelet_docker_operations_errors_total`

`ALPHA`：`Docker` 操作错误累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `inspect_container` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_docker_operations_errors_total ALPHA：Docker 操作错误累计次数，按操作类型拆分
# TYPE kubelet_docker_operations_errors_total counter
kubelet_docker_operations_errors_total{operation_type="inspect_container"} 42
```

### `kubelet_docker_operations_timeout_total`

`ALPHA`：`Docker` 操作超时累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `stop_container` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_docker_operations_timeout_total ALPHA：Docker 操作超时累计次数，按操作类型拆分
# TYPE kubelet_docker_operations_timeout_total counter
kubelet_docker_operations_timeout_total{operation_type="stop_container"} 42
```

### `kubelet_docker_operations_total`

`ALPHA`：`Docker` 操作累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `create_container` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_docker_operations_total ALPHA：Docker 操作累计次数，按操作类型拆分
# TYPE kubelet_docker_operations_total counter
kubelet_docker_operations_total{operation_type="create_container"} 42
```

### `kubelet_http_inflight_requests`

`ALPHA`：当前正在处理中的 `HTTP` 请求数量。类型为`gauge`，单位/值为：当前数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `long_running` | `false` | 请求是否为长连接/长运行请求。 |
| `method` | `GET` | `HTTP` 方法或内部操作方法。 |
| `path` | `containerLogs` | `HTTP` 路径。 |
| `server_type` | `readwrite` | `kubelet` `HTTP` 服务端类型。 |

```prometheus
# HELP kubelet_http_inflight_requests ALPHA：当前正在处理中的 HTTP 请求数量
# TYPE kubelet_http_inflight_requests gauge
kubelet_http_inflight_requests{long_running="false",method="GET",path="containerLogs",server_type="readwrite"} 1
```

### `kubelet_http_requests_duration_seconds`

`ALPHA`：处理 `HTTP` 请求的耗时分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `long_running` | `false` | 请求是否为长连接/长运行请求。 |
| `method` | `GET` | `HTTP` 方法或内部操作方法。 |
| `path` | `containerLogs` | `HTTP` 路径。 |
| `server_type` | `readwrite` | `kubelet` `HTTP` 服务端类型。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_http_requests_duration_seconds ALPHA：处理 HTTP 请求的耗时分布
# TYPE kubelet_http_requests_duration_seconds histogram
kubelet_http_requests_duration_seconds_bucket{long_running="false",method="GET",path="containerLogs",server_type="readwrite",le="0.005"} 3
kubelet_http_requests_duration_seconds_bucket{long_running="false",method="GET",path="containerLogs",server_type="readwrite",le="+Inf"} 5
kubelet_http_requests_duration_seconds_sum{long_running="false",method="GET",path="containerLogs",server_type="readwrite"} 1.23
kubelet_http_requests_duration_seconds_count{long_running="false",method="GET",path="containerLogs",server_type="readwrite"} 5
```

### `kubelet_http_requests_total`

`ALPHA`：服务启动以来收到的 `HTTP` 请求累计数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `long_running` | `false` | 请求是否为长连接/长运行请求。 |
| `method` | `GET` | `HTTP` 方法或内部操作方法。 |
| `path` | `containerLogs` | `HTTP` 路径。 |
| `server_type` | `readwrite` | `kubelet` `HTTP` 服务端类型。 |

```prometheus
# HELP kubelet_http_requests_total ALPHA：服务启动以来收到的 HTTP 请求累计数
# TYPE kubelet_http_requests_total counter
kubelet_http_requests_total{long_running="false",method="GET",path="containerLogs",server_type="readwrite"} 42
```

### `kubelet_managed_ephemeral_containers`

`ALPHA`：该 `kubelet` 管理的 `Pod` 中当前临时容器（ephemeral container）数量；如果 `EphemeralContainers` 特性门控关闭，则不统计临时容器，指标值为 `0`。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP kubelet_managed_ephemeral_containers ALPHA：该 kubelet 管理的 Pod 中当前临时容器（ephemeral container）数量；如果 EphemeralContainers 特性门控关闭，则不统计临时容器，指标值为 0
# TYPE kubelet_managed_ephemeral_containers gauge
kubelet_managed_ephemeral_containers 1
```

### `kubelet_network_plugin_operations_duration_seconds`

`ALPHA`：网络插件操作延迟分布，按操作类型拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `get_pod_network_status` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_network_plugin_operations_duration_seconds ALPHA：网络插件操作延迟分布，按操作类型拆分
# TYPE kubelet_network_plugin_operations_duration_seconds histogram
kubelet_network_plugin_operations_duration_seconds_bucket{operation_type="get_pod_network_status",le="0.005"} 3
kubelet_network_plugin_operations_duration_seconds_bucket{operation_type="get_pod_network_status",le="+Inf"} 5
kubelet_network_plugin_operations_duration_seconds_sum{operation_type="get_pod_network_status"} 1.23
kubelet_network_plugin_operations_duration_seconds_count{operation_type="get_pod_network_status"} 5
```

### `kubelet_network_plugin_operations_errors_total`

`ALPHA`：网络插件操作错误累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `get_pod_network_status` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_network_plugin_operations_errors_total ALPHA：网络插件操作错误累计次数，按操作类型拆分
# TYPE kubelet_network_plugin_operations_errors_total counter
kubelet_network_plugin_operations_errors_total{operation_type="get_pod_network_status"} 42
```

### `kubelet_network_plugin_operations_total`

`ALPHA`：网络插件操作累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `get_pod_network_status` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_network_plugin_operations_total ALPHA：网络插件操作累计次数，按操作类型拆分
# TYPE kubelet_network_plugin_operations_total counter
kubelet_network_plugin_operations_total{operation_type="get_pod_network_status"} 42
```

### `kubelet_node_name`

`ALPHA`：当前 `kubelet` 所属 `Node` 名称，指标值恒为 `1`。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.54` | `Node` 名称。 |

```prometheus
# HELP kubelet_node_name ALPHA：当前 kubelet 所属 Node 名称，指标值恒为 1
# TYPE kubelet_node_name gauge
kubelet_node_name{node="192.168.6.54"} 1
```

### `kubelet_pleg_discard_events`

`ALPHA`：`PLEG` 丢弃事件的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP kubelet_pleg_discard_events ALPHA：PLEG 丢弃事件的累计次数
# TYPE kubelet_pleg_discard_events counter
kubelet_pleg_discard_events 42
```

### `kubelet_pleg_last_seen_seconds`

`ALPHA`：`PLEG` 最近一次活跃时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP kubelet_pleg_last_seen_seconds ALPHA：PLEG 最近一次活跃时间的 Unix 时间戳
# TYPE kubelet_pleg_last_seen_seconds gauge
kubelet_pleg_last_seen_seconds 1700000000
```

### `kubelet_pleg_relist_duration_seconds`

`ALPHA`：`PLEG` 重新列举 `Pod` 的耗时分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_pleg_relist_duration_seconds ALPHA：PLEG 重新列举 Pod 的耗时分布
# TYPE kubelet_pleg_relist_duration_seconds histogram
kubelet_pleg_relist_duration_seconds_bucket{le="0.005"} 3
kubelet_pleg_relist_duration_seconds_bucket{le="+Inf"} 5
kubelet_pleg_relist_duration_seconds_sum 1.23
kubelet_pleg_relist_duration_seconds_count 5
```

### `kubelet_pleg_relist_interval_seconds`

`ALPHA`：`PLEG` 两次重新列举之间的间隔分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_pleg_relist_interval_seconds ALPHA：PLEG 两次重新列举之间的间隔分布
# TYPE kubelet_pleg_relist_interval_seconds histogram
kubelet_pleg_relist_interval_seconds_bucket{le="0.005"} 3
kubelet_pleg_relist_interval_seconds_bucket{le="+Inf"} 5
kubelet_pleg_relist_interval_seconds_sum 1.23
kubelet_pleg_relist_interval_seconds_count 5
```

### `kubelet_pod_start_duration_seconds`

`ALPHA`：单个 `Pod` 从 `Pending` 到 `Running` 的耗时分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_pod_start_duration_seconds ALPHA：单个 Pod 从 Pending 到 Running 的耗时分布
# TYPE kubelet_pod_start_duration_seconds histogram
kubelet_pod_start_duration_seconds_bucket{le="0.005"} 3
kubelet_pod_start_duration_seconds_bucket{le="+Inf"} 5
kubelet_pod_start_duration_seconds_sum 1.23
kubelet_pod_start_duration_seconds_count 5
```

### `kubelet_pod_worker_duration_seconds`

`ALPHA`：同步单个 `Pod` 的耗时分布，按 create、update 或 sync 操作类型拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `create` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_pod_worker_duration_seconds ALPHA：同步单个 Pod 的耗时分布，按 create、update 或 sync 操作类型拆分
# TYPE kubelet_pod_worker_duration_seconds histogram
kubelet_pod_worker_duration_seconds_bucket{operation_type="create",le="0.005"} 3
kubelet_pod_worker_duration_seconds_bucket{operation_type="create",le="+Inf"} 5
kubelet_pod_worker_duration_seconds_sum{operation_type="create"} 1.23
kubelet_pod_worker_duration_seconds_count{operation_type="create"} 5
```

### `kubelet_pod_worker_start_duration_seconds`

`ALPHA`：从发现 `Pod` 到启动 `worker` 的耗时分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_pod_worker_start_duration_seconds ALPHA：从发现 Pod 到启动 worker 的耗时分布
# TYPE kubelet_pod_worker_start_duration_seconds histogram
kubelet_pod_worker_start_duration_seconds_bucket{le="0.005"} 3
kubelet_pod_worker_start_duration_seconds_bucket{le="+Inf"} 5
kubelet_pod_worker_start_duration_seconds_sum 1.23
kubelet_pod_worker_start_duration_seconds_count 5
```

### `kubelet_run_podsandbox_duration_seconds`

`ALPHA`：`RunPodSandbox` 操作耗时分布，按 `RuntimeClass handler` 拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `runtime_handler` | `空字符串` | `RuntimeClass handler`。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_run_podsandbox_duration_seconds ALPHA：RunPodSandbox 操作耗时分布，按 RuntimeClass handler 拆分
# TYPE kubelet_run_podsandbox_duration_seconds histogram
kubelet_run_podsandbox_duration_seconds_bucket{runtime_handler="",le="0.005"} 3
kubelet_run_podsandbox_duration_seconds_bucket{runtime_handler="",le="+Inf"} 5
kubelet_run_podsandbox_duration_seconds_sum{runtime_handler=""} 1.23
kubelet_run_podsandbox_duration_seconds_count{runtime_handler=""} 5
```

### `kubelet_run_podsandbox_errors_total`

`ALPHA`：`RunPodSandbox` 操作错误累计次数，按 `RuntimeClass handler` 拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `runtime_handler` | `空字符串` | `RuntimeClass handler`。 |

```prometheus
# HELP kubelet_run_podsandbox_errors_total ALPHA：RunPodSandbox 操作错误累计次数，按 RuntimeClass handler 拆分
# TYPE kubelet_run_podsandbox_errors_total counter
kubelet_run_podsandbox_errors_total{runtime_handler=""} 42
```

### `kubelet_running_containers`

`ALPHA`：当前正在运行的容器数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `container_state` | `created` | 容器状态维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在。 |

```prometheus
# HELP kubelet_running_containers ALPHA：当前正在运行的容器数量
# TYPE kubelet_running_containers gauge
kubelet_running_containers{container_state="created"} 1
```

### `kubelet_running_pods`

`ALPHA`：已有运行中 `Pod sandbox` 的 `Pod` 数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP kubelet_running_pods ALPHA：已有运行中 Pod sandbox 的 Pod 数量
# TYPE kubelet_running_pods gauge
kubelet_running_pods 1
```

### `kubelet_runtime_operations_duration_seconds`

`ALPHA`：容器运行时操作耗时分布，按操作类型拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `container_status` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |
| `le` | `0.005` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP kubelet_runtime_operations_duration_seconds ALPHA：容器运行时操作耗时分布，按操作类型拆分
# TYPE kubelet_runtime_operations_duration_seconds histogram
kubelet_runtime_operations_duration_seconds_bucket{operation_type="container_status",le="0.005"} 3
kubelet_runtime_operations_duration_seconds_bucket{operation_type="container_status",le="+Inf"} 5
kubelet_runtime_operations_duration_seconds_sum{operation_type="container_status"} 1.23
kubelet_runtime_operations_duration_seconds_count{operation_type="container_status"} 5
```

### `kubelet_runtime_operations_errors_total`

`ALPHA`：容器运行时操作错误累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `container_status` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_runtime_operations_errors_total ALPHA：容器运行时操作错误累计次数，按操作类型拆分
# TYPE kubelet_runtime_operations_errors_total counter
kubelet_runtime_operations_errors_total{operation_type="container_status"} 42
```

### `kubelet_runtime_operations_total`

`ALPHA`：容器运行时操作累计次数，按操作类型拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_type` | `container_status` | 运行时、`Docker`、网络插件或 `Pod` `worker` 的操作类型。 |

```prometheus
# HELP kubelet_runtime_operations_total ALPHA：容器运行时操作累计次数，按操作类型拆分
# TYPE kubelet_runtime_operations_total counter
kubelet_runtime_operations_total{operation_type="container_status"} 42
```

### `kubelet_started_containers_errors_total`

`ALPHA`：启动容器时发生错误的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `code` | `ErrImagePull` | `HTTP` 状态码或请求结果码。 |
| `container_type` | `container` | 容器类型维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在。 |

```prometheus
# HELP kubelet_started_containers_errors_total ALPHA：启动容器时发生错误的累计次数
# TYPE kubelet_started_containers_errors_total counter
kubelet_started_containers_errors_total{code="ErrImagePull",container_type="container"} 42
```

### `kubelet_started_containers_total`

`ALPHA`：已启动容器的累计数量。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `container_type` | `container` | 容器类型维度；`Kubernetes` Metrics Reference 确认该 `Label` 存在。 |

```prometheus
# HELP kubelet_started_containers_total ALPHA：已启动容器的累计数量
# TYPE kubelet_started_containers_total counter
kubelet_started_containers_total{container_type="container"} 42
```

### `kubelet_started_pods_errors_total`

`ALPHA`：启动 `Pod` 时发生错误的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP kubelet_started_pods_errors_total ALPHA：启动 Pod 时发生错误的累计次数
# TYPE kubelet_started_pods_errors_total counter
kubelet_started_pods_errors_total 42
```

### `kubelet_started_pods_total`

`ALPHA`：已启动 `Pod` 的累计数量。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP kubelet_started_pods_total ALPHA：已启动 Pod 的累计数量
# TYPE kubelet_started_pods_total counter
kubelet_started_pods_total 42
```

### `kubelet_volume_stats_available_bytes`

`ALPHA`：卷（`volume`）当前可用字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-mysql-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kubelet_volume_stats_available_bytes ALPHA：卷（volume）当前可用字节数
# TYPE kubelet_volume_stats_available_bytes gauge
kubelet_volume_stats_available_bytes{namespace="tdsql-cju2wvno",persistentvolumeclaim="data-mysql-0"} 1048576
```

### `kubelet_volume_stats_capacity_bytes`

`ALPHA`：卷（`volume`）总容量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-mysql-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kubelet_volume_stats_capacity_bytes ALPHA：卷（volume）总容量，单位为字节
# TYPE kubelet_volume_stats_capacity_bytes gauge
kubelet_volume_stats_capacity_bytes{namespace="tdsql-cju2wvno",persistentvolumeclaim="data-mysql-0"} 1048576
```

### `kubelet_volume_stats_inodes`

`ALPHA`：卷（`volume`）`inode` 总数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-mysql-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kubelet_volume_stats_inodes ALPHA：卷（volume）inode 总数
# TYPE kubelet_volume_stats_inodes gauge
kubelet_volume_stats_inodes{namespace="tdsql-cju2wvno",persistentvolumeclaim="data-mysql-0"} 1
```

### `kubelet_volume_stats_inodes_free`

`ALPHA`：卷（`volume`）当前可用 `inode` 数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-mysql-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kubelet_volume_stats_inodes_free ALPHA：卷（volume）当前可用 inode 数
# TYPE kubelet_volume_stats_inodes_free gauge
kubelet_volume_stats_inodes_free{namespace="tdsql-cju2wvno",persistentvolumeclaim="data-mysql-0"} 1
```

### `kubelet_volume_stats_inodes_used`

`ALPHA`：卷（`volume`）当前已用 `inode` 数。类型为`gauge`，单位/值为：`inode` 数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-mysql-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kubelet_volume_stats_inodes_used ALPHA：卷（volume）当前已用 inode 数
# TYPE kubelet_volume_stats_inodes_used gauge
kubelet_volume_stats_inodes_used{namespace="tdsql-cju2wvno",persistentvolumeclaim="data-mysql-0"} 1
```

### `kubelet_volume_stats_used_bytes`

`ALPHA`：卷（`volume`）当前已用字节数。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-mysql-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kubelet_volume_stats_used_bytes ALPHA：卷（volume）当前已用字节数
# TYPE kubelet_volume_stats_used_bytes gauge
kubelet_volume_stats_used_bytes{namespace="tdsql-cju2wvno",persistentvolumeclaim="data-mysql-0"} 1048576
```

### `kubernetes_build_info`

`ALPHA`：`Kubernetes` 构建信息指标，指标值恒为 `1`，通过 `Label` 标识版本、`Git` 修订、构建时间、`Go` 版本、编译器和运行平台。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `build_date` | `2023-08-01T10:07:27Z` | `Kubernetes` 组件构建时间。 |
| `compiler` | `gc` | `Go` 编译器。 |
| `git_commit` | `f38c2957c3b7e62c9777d6d8b5ccfc69aff20688` | `Git` 提交哈希。 |
| `git_tree_state` | `clean` | `Git` 工作树状态。 |
| `git_version` | `v1.22.5-tke.19` | `Kubernetes` `Git` 版本。 |
| `go_version` | `go1.16.14` | `Go` 版本。 |
| `major` | `1` | `Kubernetes` 主版本号。 |
| `minor` | `22+` | `Kubernetes` 次版本号。 |
| `platform` | `linux/amd64` | 构建平台。 |

```prometheus
# HELP kubernetes_build_info ALPHA：Kubernetes 构建信息指标，指标值恒为 1，通过 Label 标识版本、Git 修订、构建时间、Go 版本、编译器和运行平台
# TYPE kubernetes_build_info gauge
kubernetes_build_info{build_date="2023-08-01T10:07:27Z",compiler="gc",git_commit="f38c2957c3b7e62c9777d6d8b5ccfc69aff20688",git_tree_state="clean",git_version="v1.22.5-tke.19",go_version="go1.16.14",major="1",minor="22+",platform="linux/amd64"} 1
```

### `plugin_manager_total_plugins`

`ALPHA`：插件管理器（`Plugin Manager`）中的插件数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `socket_path` | `/var/lib/kubelet/plugins_registry/com.tencent.cloud.csi.cbs-reg.sock` | `Unix` 套接字路径。 |
| `state` | `actual_state_of_world` | 状态枚举值，具体含义由指标上下文决定。 |

```prometheus
# HELP plugin_manager_total_plugins ALPHA：插件管理器（Plugin Manager）中的插件数量
# TYPE plugin_manager_total_plugins gauge
plugin_manager_total_plugins{socket_path="/var/lib/kubelet/plugins_registry/com.tencent.cloud.csi.cbs-reg.sock",state="actual_state_of_world"} 1
```

### `process_cpu_seconds_total`

进程累计消耗的用户态和系统态 `CPU` 时间。类型为`counter`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_cpu_seconds_total 进程累计消耗的用户态和系统态 CPU 时间
# TYPE process_cpu_seconds_total counter
process_cpu_seconds_total 12345.67
```

### `process_max_fds`

进程允许打开的最大文件描述符数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_max_fds 进程允许打开的最大文件描述符数量
# TYPE process_max_fds gauge
process_max_fds 1
```

### `process_open_fds`

进程当前打开的文件描述符数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_open_fds 进程当前打开的文件描述符数量
# TYPE process_open_fds gauge
process_open_fds 1
```

### `process_resident_memory_bytes`

进程常驻内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_resident_memory_bytes 进程常驻内存大小，单位为字节
# TYPE process_resident_memory_bytes gauge
process_resident_memory_bytes 1048576
```

### `process_start_time_seconds`

进程启动时间，表示为 `Unix` 时间戳秒数。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_start_time_seconds 进程启动时间，表示为 Unix 时间戳秒数
# TYPE process_start_time_seconds gauge
process_start_time_seconds 1700000000
```

### `process_virtual_memory_bytes`

进程虚拟内存大小，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_virtual_memory_bytes 进程虚拟内存大小，单位为字节
# TYPE process_virtual_memory_bytes gauge
process_virtual_memory_bytes 1048576
```

### `process_virtual_memory_max_bytes`

进程可用虚拟内存上限，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP process_virtual_memory_max_bytes 进程可用虚拟内存上限，单位为字节
# TYPE process_virtual_memory_max_bytes gauge
process_virtual_memory_max_bytes 1048576
```

### `rest_client_exec_plugin_certificate_rotation_age`

`ALPHA`：认证 `exec` 插件客户端证书在最近一次轮转前的存活时长分布；未使用该证书时，直方图不会产生数据。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `600` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP rest_client_exec_plugin_certificate_rotation_age ALPHA：认证 exec 插件客户端证书在最近一次轮转前的存活时长分布；未使用该证书时，直方图不会产生数据
# TYPE rest_client_exec_plugin_certificate_rotation_age histogram
rest_client_exec_plugin_certificate_rotation_age_bucket{le="600"} 3
rest_client_exec_plugin_certificate_rotation_age_bucket{le="+Inf"} 5
rest_client_exec_plugin_certificate_rotation_age_sum 1.23
rest_client_exec_plugin_certificate_rotation_age_count 5
```

### `rest_client_exec_plugin_ttl_seconds`

`ALPHA`：认证 `exec` 插件管理的客户端证书最短剩余有效期；单位为秒，已过期时为负值，未使用或未管理 `TLS` 证书时为 `+Inf`。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| 无 | - | 该指标定义未使用业务 `Label`。 |

```prometheus
# HELP rest_client_exec_plugin_ttl_seconds ALPHA：认证 exec 插件管理的客户端证书最短剩余有效期；单位为秒，已过期时为负值，未使用或未管理 TLS 证书时为 +Inf
# TYPE rest_client_exec_plugin_ttl_seconds gauge
rest_client_exec_plugin_ttl_seconds 1.23
```

### `rest_client_rate_limiter_duration_seconds`

`ALPHA`：客户端限速器延迟分布，按请求方法和 `URL` 拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `url` | `https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D` | 请求 `URL` 或路径模板，可能经过清洗。 |
| `verb` | `GET` | `Kubernetes` `REST 客户端`请求方法。 |
| `le` | `0.001` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP rest_client_rate_limiter_duration_seconds ALPHA：客户端限速器延迟分布，按请求方法和 URL 拆分
# TYPE rest_client_rate_limiter_duration_seconds histogram
rest_client_rate_limiter_duration_seconds_bucket{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET",le="0.001"} 3
rest_client_rate_limiter_duration_seconds_bucket{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET",le="+Inf"} 5
rest_client_rate_limiter_duration_seconds_sum{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET"} 1.23
rest_client_rate_limiter_duration_seconds_count{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET"} 5
```

### `rest_client_request_duration_seconds`

`ALPHA`：`REST 客户端`请求延迟分布，按请求方法和 `URL` 拆分。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `url` | `https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D` | 请求 `URL` 或路径模板，可能经过清洗。 |
| `verb` | `GET` | `Kubernetes` `REST 客户端`请求方法。 |
| `le` | `0.001` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP rest_client_request_duration_seconds ALPHA：REST 客户端请求延迟分布，按请求方法和 URL 拆分
# TYPE rest_client_request_duration_seconds histogram
rest_client_request_duration_seconds_bucket{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET",le="0.001"} 3
rest_client_request_duration_seconds_bucket{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET",le="+Inf"} 5
rest_client_request_duration_seconds_sum{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET"} 1.23
rest_client_request_duration_seconds_count{url="https://169.254.128.13:60002/api/v1/namespaces/%7Bnamespace%7D/configmaps?fieldSelector=%7Bvalue%7D&limit=%7Bvalue%7D&resourceVersion=%7Bvalue%7D",verb="GET"} 5
```

### `rest_client_requests_total`

`ALPHA`：`HTTP` 请求累计数，按状态码、请求方法和 `host` 拆分。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `code` | `200` | `HTTP` 状态码或请求结果码。 |
| `host` | `169.254.128.13:60002` | 目标主机。 |
| `method` | `DELETE` | `HTTP` 方法或内部操作方法。 |

```prometheus
# HELP rest_client_requests_total ALPHA：HTTP 请求累计数，按状态码、请求方法和 host 拆分
# TYPE rest_client_requests_total counter
rest_client_requests_total{code="200",host="169.254.128.13:60002",method="DELETE"} 42
```

### `storage_operation_duration_seconds`

`ALPHA`：存储操作耗时分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `migrated` | `false` | `CSI` 迁移是否启用。 |
| `operation_name` | `unmount_device` | 操作名称。 |
| `status` | `success` | 存储操作返回状态。 |
| `volume_plugin` | `kubernetes.io/csi:com.tencent.cloud.csi.cbs` | 卷插件名称。 |
| `le` | `0.1` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP storage_operation_duration_seconds ALPHA：存储操作耗时分布
# TYPE storage_operation_duration_seconds histogram
storage_operation_duration_seconds_bucket{migrated="false",operation_name="unmount_device",status="success",volume_plugin="kubernetes.io/csi:com.tencent.cloud.csi.cbs",le="0.1"} 3
storage_operation_duration_seconds_bucket{migrated="false",operation_name="unmount_device",status="success",volume_plugin="kubernetes.io/csi:com.tencent.cloud.csi.cbs",le="+Inf"} 5
storage_operation_duration_seconds_sum{migrated="false",operation_name="unmount_device",status="success",volume_plugin="kubernetes.io/csi:com.tencent.cloud.csi.cbs"} 1.23
storage_operation_duration_seconds_count{migrated="false",operation_name="unmount_device",status="success",volume_plugin="kubernetes.io/csi:com.tencent.cloud.csi.cbs"} 5
```

### `storage_operation_errors_total`

`ALPHA`：存储操作错误累计次数；自 `Kubernetes` 1.21.0 起废弃。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_name` | `verify_controller_attached_volume` | 操作名称。 |
| `volume_plugin` | `kubernetes.io/csi:com.tencent.cloud.csi.cbs` | 卷插件名称。 |

```prometheus
# HELP storage_operation_errors_total ALPHA：存储操作错误累计次数；自 Kubernetes 1.21.0 起废弃
# TYPE storage_operation_errors_total counter
storage_operation_errors_total{operation_name="verify_controller_attached_volume",volume_plugin="kubernetes.io/csi:com.tencent.cloud.csi.cbs"} 42
```

### `storage_operation_status_count`

`ALPHA`：存储操作返回状态累计次数；自 `Kubernetes` 1.21.0 起废弃。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `operation_name` | `unmount_device` | 操作名称。 |
| `status` | `success` | 存储操作返回状态。 |
| `volume_plugin` | `kubernetes.io/csi:com.tencent.cloud.csi.cbs` | 卷插件名称。 |

```prometheus
# HELP storage_operation_status_count ALPHA：存储操作返回状态累计次数；自 Kubernetes 1.21.0 起废弃
# TYPE storage_operation_status_count counter
storage_operation_status_count{operation_name="unmount_device",status="success",volume_plugin="kubernetes.io/csi:com.tencent.cloud.csi.cbs"} 42
```

### `volume_manager_total_volumes`

`ALPHA`：卷管理器（`Volume Manager`）中的卷数量。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `plugin_name` | `kubernetes.io/configmap` | 插件名称。 |
| `state` | `actual_state_of_world` | 状态枚举值，具体含义由指标上下文决定。 |

```prometheus
# HELP volume_manager_total_volumes ALPHA：卷管理器（Volume Manager）中的卷数量
# TYPE volume_manager_total_volumes gauge
volume_manager_total_volumes{plugin_name="kubernetes.io/configmap",state="actual_state_of_world"} 1
```

### `workqueue_adds_total`

`ALPHA`：`workqueue` 接收 `add` 事件的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |

```prometheus
# HELP workqueue_adds_total ALPHA：workqueue 接收 add 事件的累计次数
# TYPE workqueue_adds_total counter
workqueue_adds_total{name="DynamicCABundle-client-ca-bundle"} 42
```

### `workqueue_depth`

`ALPHA`：`workqueue` 当前队列深度。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |

```prometheus
# HELP workqueue_depth ALPHA：workqueue 当前队列深度
# TYPE workqueue_depth gauge
workqueue_depth{name="DynamicCABundle-client-ca-bundle"} 1
```

### `workqueue_longest_running_processor_seconds`

`ALPHA`：`workqueue` 中运行时间最长的处理器（`processor`）已运行的时长。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |

```prometheus
# HELP workqueue_longest_running_processor_seconds ALPHA：workqueue 中运行时间最长的处理器（processor）已运行的时长
# TYPE workqueue_longest_running_processor_seconds gauge
workqueue_longest_running_processor_seconds{name="DynamicCABundle-client-ca-bundle"} 1.23
```

### `workqueue_queue_duration_seconds`

`ALPHA`：元素被取出处理前在 `workqueue` 中停留的时长分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |
| `le` | `1e-08` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP workqueue_queue_duration_seconds ALPHA：元素被取出处理前在 workqueue 中停留的时长分布
# TYPE workqueue_queue_duration_seconds histogram
workqueue_queue_duration_seconds_bucket{name="DynamicCABundle-client-ca-bundle",le="1e-08"} 3
workqueue_queue_duration_seconds_bucket{name="DynamicCABundle-client-ca-bundle",le="+Inf"} 5
workqueue_queue_duration_seconds_sum{name="DynamicCABundle-client-ca-bundle"} 1.23
workqueue_queue_duration_seconds_count{name="DynamicCABundle-client-ca-bundle"} 5
```

### `workqueue_retries_total`

`ALPHA`：`workqueue` 处理 `retry` 事件的累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |

```prometheus
# HELP workqueue_retries_total ALPHA：workqueue 处理 retry 事件的累计次数
# TYPE workqueue_retries_total counter
workqueue_retries_total{name="DynamicCABundle-client-ca-bundle"} 42
```

### `workqueue_unfinished_work_seconds`

`ALPHA`：`workqueue` 中正在处理但尚未被 `work_duration` 观测到的工作累计耗时；数值过大通常表示处理线程卡住，可结合增长速率推断卡住线程数量。类型为`gauge`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |

```prometheus
# HELP workqueue_unfinished_work_seconds ALPHA：workqueue 中正在处理但尚未被 work_duration 观测到的工作累计耗时；数值过大通常表示处理线程卡住，可结合增长速率推断卡住线程数量
# TYPE workqueue_unfinished_work_seconds gauge
workqueue_unfinished_work_seconds{name="DynamicCABundle-client-ca-bundle"} 1.23
```

### `workqueue_work_duration_seconds`

`ALPHA`：`workqueue` 处理单个元素的耗时分布。类型为`histogram`，单位/值为：秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `name` | `DynamicCABundle-client-ca-bundle` | `workqueue` 名称。 |
| `le` | `1e-08` | 直方图 `bucket` 上界，仅出现在`_bucket`时间序列上。 |

```prometheus
# HELP workqueue_work_duration_seconds ALPHA：workqueue 处理单个元素的耗时分布
# TYPE workqueue_work_duration_seconds histogram
workqueue_work_duration_seconds_bucket{name="DynamicCABundle-client-ca-bundle",le="1e-08"} 3
workqueue_work_duration_seconds_bucket{name="DynamicCABundle-client-ca-bundle",le="+Inf"} 5
workqueue_work_duration_seconds_sum{name="DynamicCABundle-client-ca-bundle"} 1.23
workqueue_work_duration_seconds_count{name="DynamicCABundle-client-ca-bundle"} 5
```

## 采集与使用注意事项

- `Kubernetes Metrics Reference` 会随 `Kubernetes` 版本变化。`ALPHA` 指标尤其可能变更或删除，生产告警中需要固定 `Kubernetes` 版本并进行升级回归检查。
- `ALPHA`指标可能在 `Kubernetes` 升级中变更或删除；建议在升级前对依赖这些指标的看板和告警做回归验证。

## 资料来源

- [Kubernetes Metrics Reference](https://kubernetes.io/docs/reference/instrumentation/metrics/)
- [Kubernetes System Metrics](https://kubernetes.io/docs/concepts/cluster-administration/system-metrics/)
- [Kubernetes apiserver 源码目录](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/apiserver)
- [Prometheus client_golang collectors](https://github.com/prometheus/client_golang/tree/main/prometheus/collectors)


