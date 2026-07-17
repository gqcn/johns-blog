---
slug: "/ai/observability/kube-state-metrics"
title: "kube-state-metrics：Kubernetes 对象状态指标与 Label 说明"
hide_title: true
keywords:
  ["kube-state-metrics", "Prometheus", "Kubernetes", "Pod", "Node", "PV", "PVC", "Label"]
description: "系统介绍 kube-state-metrics 的 Node、PV、PVC、Pod、容器和 Pod 状态指标，并逐项说明所有可确认 Label。"
---

## 基本简介

`kube-state-metrics`监听 `Kubernetes` `API Server`，将 `Kubernetes` 对象的元数据、期望状态和当前状态转换为 `Prometheus` 指标。它关注对象状态快照，不采集容器 `CPU`、内存等资源用量。

本文覆盖 `Node`、`PersistentVolume`、`PersistentVolumeClaim` 和 `Pod` 相关指标。`Label` 说明优先采用 `kube-state-metrics` 官方 metrics 文档；对于由`--metric-labels-allowlist`或`--metric-annotations-allowlist`控制的动态 `Label`，使用`label_KEY`或`annotation_KEY`模式说明，其中`KEY`表示清洗后的 `Kubernetes` 标签或注解键名。


## 监控指标


### Node

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_node_annotations` | `gauge` | 常量 `1` | 将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。 |
| `kube_node_created` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | `STABLE`：对象创建时间的 `Unix` 时间戳。 |
| `kube_node_deletion_timestamp` | `gauge` | `Unix` 时间戳（秒） | 对象删除时间的 `Unix` 时间戳。 |
| `kube_node_info` | `gauge` | 常量 `1` | `STABLE`：集群 `Node` 的基础信息。 |
| `kube_node_labels` | `gauge` | 常量 `1` | `STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。 |
| `kube_node_role` | `gauge` | 常量 `1` | 集群 `Node` 的角色信息。 |
| `kube_node_spec_taint` | `gauge` | 常量 `1` | `STABLE`：集群 `Node` 上配置的 `taint` 信息。 |
| `kube_node_spec_unschedulable` | `gauge` | 状态值 | `STABLE`：`Node` 是否禁止调度新的 `Pod`。 |
| `kube_node_status_allocatable` | `gauge` | 资源数量 | `STABLE`：扣除系统守护进程预留后，可分配给 `Pod` 的 `Node` 资源量。 |
| `kube_node_status_capacity` | `gauge` | 资源数量 | `STABLE`：`Node` 可用资源总量。 |
| `kube_node_status_condition` | `gauge` | 状态值 | `STABLE`：集群 `Node` 的状态条件（`condition`）。 |

### PV

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_persistentvolume_claim_ref` | `gauge` | 常量 `1` | `STABLE`：`PersistentVolume` 绑定的 `PersistentVolumeClaim` 引用信息。 |
| `kube_persistentvolume_annotations` | `gauge` | 常量 `1` | 将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。 |
| `kube_persistentvolume_labels` | `gauge` | 常量 `1` | `STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。 |
| `kube_persistentvolume_status_phase` | `gauge` | 状态值 | `STABLE`：`PersistentVolume` 当前阶段（`phase`），用于表示卷可用、已绑定或已释放等状态。 |
| `kube_persistentvolume_info` | `gauge` | 常量 `1` | `STABLE`：`PersistentVolume` 的基础信息。 |
| `kube_persistentvolume_capacity_bytes` | `gauge` | 字节 | `STABLE`：`PersistentVolume` 容量，单位为字节。 |
| `kube_persistentvolume_created` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | 对象创建时间的 `Unix` 时间戳。 |
| `kube_persistentvolume_deletion_timestamp` | `gauge` | `Unix` 时间戳（秒） | 对象删除时间的 `Unix` 时间戳。 |

### PVC

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_persistentvolumeclaim_labels` | `gauge` | 常量 `1` | `STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。 |
| `kube_persistentvolumeclaim_annotations` | `gauge` | 常量 `1` | 将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。 |
| `kube_persistentvolumeclaim_info` | `gauge` | 常量 `1` | `STABLE`：`PersistentVolumeClaim` 的基础信息。 |
| `kube_persistentvolumeclaim_status_phase` | `gauge` | 状态值 | `STABLE`：`PersistentVolumeClaim` 当前阶段（`phase`）。 |
| `kube_persistentvolumeclaim_resource_requests_storage_bytes` | `gauge` | 字节 | `STABLE`：`PersistentVolumeClaim` 请求的存储容量。 |
| `kube_persistentvolumeclaim_access_mode` | `gauge` | 常量 `1` | `STABLE`：`PersistentVolumeClaim` 声明的访问模式。 |
| `kube_persistentvolumeclaim_status_condition` | `gauge` | 状态值 | `PersistentVolumeClaim` 不同状态条件（`condition`）的状态信息。 |
| `kube_persistentvolumeclaim_created` | `gauge` | `Unix` 时间戳（秒） | 对象创建时间的 `Unix` 时间戳。 |
| `kube_persistentvolumeclaim_deletion_timestamp` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | 对象删除时间的 `Unix` 时间戳。 |

### Pod 元数据/生命周期

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_pod_completion_time` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | `STABLE`：`Pod` 完成时间的 `Unix` 时间戳。 |
| `kube_pod_created` | `gauge` | `Unix` 时间戳（秒） | `STABLE`：对象创建时间的 `Unix` 时间戳。 |
| `kube_pod_deletion_timestamp` | `gauge` | `Unix` 时间戳（秒） | 对象删除时间的 `Unix` 时间戳。 |
| `kube_pod_info` | `gauge` | 常量 `1` | `STABLE`：`Pod` 的基础信息。 |
| `kube_pod_ips` | `gauge` | 常量 `1` | `Pod` 的 `IP` 地址信息。 |
| `kube_pod_annotations` | `gauge` | 常量 `1` | 将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。 |
| `kube_pod_labels` | `gauge` | 常量 `1` | `STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。 |
| `kube_pod_overhead_cpu_cores` | `gauge` | `CPU` 核数 | 运行 `Pod` 所需的 `CPU` 额外开销。 |
| `kube_pod_overhead_memory_bytes` | `gauge` | 字节 | 运行 `Pod` 所需的内存额外开销。 |
| `kube_pod_owner` | `gauge` | 常量 `1` | `STABLE`：`Pod` 所属控制器（`owner`）信息。 |
| `kube_pod_restart_policy` | `gauge` | 状态值 | `STABLE`：`Pod` 使用的重启策略（`restartPolicy`）。 |
| `kube_pod_runtimeclass_name_info` | `gauge` | 常量 `1` | `Pod` 关联的 `RuntimeClass` 信息。 |
| `kube_pod_start_time` | `gauge` | `Unix` 时间戳（秒） | `STABLE`：`Pod` 启动时间的 `Unix` 时间戳。 |
| `kube_pod_tolerations` | `gauge` | 常量 `1` | `Pod` 容忍度（`toleration`）信息。 |
| `kube_pod_service_account` | `gauge` | 常量 `1` | `Pod` 使用的 `ServiceAccount`。 |

### Pod 容器

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_pod_container_info` | `gauge` | 常量 `1` | `STABLE`：`Pod` 中容器的基础信息。 |
| `kube_pod_container_resource_limits` | `gauge` | 资源数量 | 容器声明的资源限制数量；上游建议优先使用 `kube-scheduler` 暴露的 `kube_pod_resource_limit`，因为该指标更精确。 |
| `kube_pod_container_resource_requests` | `gauge` | 资源数量 | 容器声明的资源请求数量；上游建议优先使用 `kube-scheduler` 暴露的 `kube_pod_resource_request`，因为该指标更精确。 |
| `kube_pod_container_state_started` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | `STABLE`：`Pod` 容器启动时间的 `Unix` 时间戳。 |
| `kube_pod_container_status_last_terminated_reason` | `gauge` | 状态值 | 容器上一次进入 `Terminated` 状态的原因。 |
| `kube_pod_container_status_last_terminated_exitcode` | `gauge` | 退出码 | 容器上一次 `Terminated` 状态的退出码。 |
| `kube_pod_container_status_ready` | `gauge` | 状态值 | `STABLE`：容器 `Readiness` 检查是否通过。 |
| `kube_pod_container_status_restarts_total` | `counter` | 累计计数 | `STABLE`：每个容器的重启累计次数。 |
| `kube_pod_container_status_running` | `gauge` | 状态值 | `STABLE`：容器当前是否处于 `Running` 状态。 |
| `kube_pod_container_status_terminated` | `gauge` | 状态值 | `STABLE`：容器当前是否处于 `Terminated` 状态。 |
| `kube_pod_container_status_terminated_reason` | `gauge` | 状态值 | 容器当前处于 `Terminated` 状态的原因。 |
| `kube_pod_container_status_waiting` | `gauge` | 状态值 | `STABLE`：容器当前是否处于 `Waiting` 状态。 |
| `kube_pod_container_status_waiting_reason` | `gauge` | 状态值 | `STABLE`：容器当前处于 `Waiting` 状态的原因。 |

### Pod Init 容器

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_pod_init_container_info` | `gauge` | 常量 `1` | `STABLE`：`Pod` 中 `init` 容器的基础信息。 |
| `kube_pod_init_container_resource_limits` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>资源数量</span> | `Init` 容器声明的资源限制数量。 |
| `kube_pod_init_container_resource_requests` | `gauge` | 资源数量 | `Init` 容器声明的资源请求数量。 |
| `kube_pod_init_container_status_last_terminated_reason` | `gauge` | 状态值 | `Init` 容器上一次进入 `Terminated` 状态的原因。 |
| `kube_pod_init_container_status_ready` | `gauge` | 状态值 | `STABLE`：`Init` 容器 `Readiness` 检查是否通过。 |
| `kube_pod_init_container_status_restarts_total` | `counter` | 累计计数 | `STABLE`：`Init` 容器的重启累计次数。 |
| `kube_pod_init_container_status_running` | `gauge` | 状态值 | `STABLE`：`Init` 容器当前是否处于 `Running` 状态。 |
| `kube_pod_init_container_status_terminated` | `gauge` | 状态值 | `STABLE`：`Init` 容器当前是否处于 `Terminated` 状态。 |
| `kube_pod_init_container_status_terminated_reason` | `gauge` | 状态值 | `Init` 容器当前处于 `Terminated` 状态的原因。 |
| `kube_pod_init_container_status_waiting` | `gauge` | 状态值 | `STABLE`：`Init` 容器当前是否处于 `Waiting` 状态。 |
| `kube_pod_init_container_status_waiting_reason` | `gauge` | 状态值 | `Init` 容器当前处于 `Waiting` 状态的原因。 |

### Pod Spec

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_pod_spec_volumes_persistentvolumeclaims_info` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>常量 `1`</span> | `STABLE`：`Pod` 中 `PersistentVolumeClaim` 类型卷（`volume`）的信息。 |
| `kube_pod_spec_volumes_persistentvolumeclaims_readonly` | `gauge` | 状态值 | `STABLE`：`PersistentVolumeClaim` 类型卷（`volume`）是否以只读方式挂载。 |

### Pod 状态

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `kube_pod_status_phase` | `gauge` | 状态值 | `STABLE`：`Pod` 当前阶段（`phase`）。 |
| `kube_pod_status_qos_class` | `gauge` | 状态值 | `Pod` 当前 `QoS Class`。 |
| `kube_pod_status_ready` | `gauge` | 状态值 | `STABLE`：`Pod` 是否已经 `Ready`，可对外提供服务。 |
| `kube_pod_status_ready_time` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix` 时间戳（秒）</span> | `Pod` 通过 `Readiness Probe` 的时间。 |
| `kube_pod_status_initialized_time` | `gauge` | `Unix` 时间戳（秒） | `Pod` 完成初始化的时间。 |
| `kube_pod_status_container_ready_time` | `gauge` | `Unix` 时间戳（秒） | `Pod` 中容器进入 `Ready` 状态的时间。 |
| `kube_pod_status_reason` | `gauge` | 状态值 | `Pod` 状态原因。 |
| `kube_pod_status_scheduled` | `gauge` | 状态值 | `STABLE`：`Pod` 调度过程的状态。 |
| `kube_pod_status_scheduled_time` | `gauge` | `Unix` 时间戳（秒） | `STABLE`：`Pod` 进入 `Scheduled` 状态的 `Unix` 时间戳。 |
| `kube_pod_status_unschedulable` | `gauge` | 状态值 | `STABLE`：`Pod` 是否处于不可调度状态。 |

## 指标详情

本节逐项说明指标含义、`Label` 和 `Prometheus` 文本格式示例。示例用于展示暴露格式，实际 `HELP` 文案、`Label` 集合和值以采集端输出为准。直方图指标的`le`只出现在`_bucket`序列；`Summary` 指标的`quantile`只出现在分位序列。

### `kube_node_annotations`

将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `node-1` | `Node` 名称。 |
| `annotation_KEY` | `annotation_team="platform"` | `Kubernetes` 对象注解（`annotation`）转换后的 `Prometheus Label`；实际后缀由原始 `annotation` 键名清洗得到，并受允许列表（`allowlist`）控制。 |

```prometheus
# HELP kube_node_annotations 将 Kubernetes 注解（annotation）转换为 Prometheus Label，输出受 --metric-annotations-allowlist 控制
# TYPE kube_node_annotations gauge
kube_node_annotations{node="node-1",annotation_team="platform"} 1
```

### `kube_node_created`

`STABLE`：对象创建时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.200.15` | `Node` 名称。 |

```prometheus
# HELP kube_node_created STABLE：对象创建时间的 Unix 时间戳
# TYPE kube_node_created gauge
kube_node_created{node="192.168.200.15"} 1700000000
```

### `kube_node_deletion_timestamp`

对象删除时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `node-1` | `Node` 名称。 |

```prometheus
# HELP kube_node_deletion_timestamp 对象删除时间的 Unix 时间戳
# TYPE kube_node_deletion_timestamp gauge
kube_node_deletion_timestamp{node="node-1"} 1700000000
```

### `kube_node_info`

`STABLE`：集群 `Node` 的基础信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.10` | `Node` 名称。 |
| `kernel_version` | `5.4.119-19-0009.11` | 节点内核版本。 |
| `os_image` | `TencentOS Server 3.1 (Final)` | 节点操作系统镜像描述。 |
| `container_runtime_version` | `docker://19.3.9-tke.1` | 容器运行时及版本。 |
| `kubelet_version` | `v1.22.5-tke.18` | `kubelet` 版本。 |
| `kubeproxy_version` | `v1.22.5-tke.18` | kube-proxy 版本；上游文档已标注为已废弃字段。 |
| `provider_id` | `qcloud:///100006/ins-6pjllxhq` | 云厂商或基础设施 provider ID。 |
| `pod_cidr` | `空字符串` | 节点 `Pod` CIDR。 |
| `system_uuid` | `6f6070bc-320b-4516-92b6-76b939227aa2` | 机器或节点 system UUID。 |
| `internal_ip` | `192.168.6.10` | 节点内部 IP。 |

```prometheus
# HELP kube_node_info STABLE：集群 Node 的基础信息
# TYPE kube_node_info gauge
kube_node_info{node="192.168.6.10",kernel_version="5.4.119-19-0009.11",os_image="TencentOS Server 3.1 (Final)",container_runtime_version="docker://19.3.9-tke.1",kubelet_version="v1.22.5-tke.18",kubeproxy_version="v1.22.5-tke.18",provider_id="qcloud:///100006/ins-6pjllxhq",pod_cidr="",system_uuid="6f6070bc-320b-4516-92b6-76b939227aa2",internal_ip="192.168.6.10"} 1
```

### `kube_node_labels`

`STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `node-1` | `Node` 名称。 |
| `label_KEY` | `label_app="web"` | `Kubernetes` 对象标签（`label`）转换后的 `Prometheus Label`；实际后缀由原始 `label` 键名清洗得到，并受允许列表（`allowlist`）控制。 |

```prometheus
# HELP kube_node_labels STABLE：将 Kubernetes 标签（label）转换为 Prometheus Label，输出受 --metric-labels-allowlist 控制
# TYPE kube_node_labels gauge
kube_node_labels{node="node-1",label_app="web"} 1
```

### `kube_node_role`

集群 `Node` 的角色信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.16` | `Node` 名称。 |
| `role` | `master` | `Node` 角色。 |

```prometheus
# HELP kube_node_role 集群 Node 的角色信息
# TYPE kube_node_role gauge
kube_node_role{node="192.168.6.16",role="master"} 1
```

### `kube_node_spec_taint`

`STABLE`：集群 `Node` 上配置的 `taint` 信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.10` | `Node` 名称。 |
| `key` | `node-role.kubernetes.io/master` | `taint` 或 `toleration` 的 key。 |
| `value` | `空字符串` | `taint` 或 `toleration` 的 value。 |
| `effect` | `NoSchedule` | `taint` 或 `toleration` 的 effect。 |

```prometheus
# HELP kube_node_spec_taint STABLE：集群 Node 上配置的 taint 信息
# TYPE kube_node_spec_taint gauge
kube_node_spec_taint{node="192.168.6.10",key="node-role.kubernetes.io/master",value="",effect="NoSchedule"} 1
```

### `kube_node_spec_unschedulable`

`STABLE`：`Node` 是否禁止调度新的 `Pod`。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.10` | `Node` 名称。 |

```prometheus
# HELP kube_node_spec_unschedulable STABLE：Node 是否禁止调度新的 Pod
# TYPE kube_node_spec_unschedulable gauge
kube_node_spec_unschedulable{node="192.168.6.10"} 1
```

### `kube_node_status_allocatable`

`STABLE`：扣除系统守护进程预留后，可分配给 `Pod` 的 `Node` 资源量。类型为`gauge`，单位/值为：资源数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.6` | `Node` 名称。 |
| `resource` | `pods` | 资源名称，例如 cpu、memory、pods。 |
| `unit` | `integer` | 资源单位，例如 core、byte、integer。 |

```prometheus
# HELP kube_node_status_allocatable STABLE：扣除系统守护进程预留后，可分配给 Pod 的 Node 资源量
# TYPE kube_node_status_allocatable gauge
kube_node_status_allocatable{node="192.168.6.6",resource="pods",unit="integer"} 1
```

### `kube_node_status_capacity`

`STABLE`：`Node` 可用资源总量。类型为`gauge`，单位/值为：资源数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.4.15` | `Node` 名称。 |
| `resource` | `pods` | 资源名称，例如 cpu、memory、pods。 |
| `unit` | `integer` | 资源单位，例如 core、byte、integer。 |

```prometheus
# HELP kube_node_status_capacity STABLE：Node 可用资源总量
# TYPE kube_node_status_capacity gauge
kube_node_status_capacity{node="192.168.4.15",resource="pods",unit="integer"} 1
```

### `kube_node_status_condition`

`STABLE`：集群 `Node` 的状态条件（`condition`）。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `node` | `192.168.6.16` | `Node` 名称。 |
| `condition` | `MemoryPressure` | `Kubernetes` `condition` 的类型或状态枚举。 |
| `status` | `true` | `Kubernetes` `condition` 的状态，通常为 true、false 或 unknown。 |

```prometheus
# HELP kube_node_status_condition STABLE：集群 Node 的状态条件（condition）
# TYPE kube_node_status_condition gauge
kube_node_status_condition{node="192.168.6.16",condition="MemoryPressure",status="true"} 1
```

### `kube_persistentvolumeclaim_labels`

`STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolumeclaim` | `data` | `PersistentVolumeClaim` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `label_KEY` | `label_app="web"` | `Kubernetes` 对象标签（`label`）转换后的 `Prometheus Label`；实际后缀由原始 `label` 键名清洗得到，并受允许列表（`allowlist`）控制。 |

```prometheus
# HELP kube_persistentvolumeclaim_labels STABLE：将 Kubernetes 标签（label）转换为 Prometheus Label，输出受 --metric-labels-allowlist 控制
# TYPE kube_persistentvolumeclaim_labels gauge
kube_persistentvolumeclaim_labels{persistentvolumeclaim="data",namespace="default",label_app="web"} 1
```

### `kube_persistentvolumeclaim_annotations`

将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolumeclaim` | `data` | `PersistentVolumeClaim` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `annotation_KEY` | `annotation_team="platform"` | `Kubernetes` 对象注解（`annotation`）转换后的 `Prometheus Label`；实际后缀由原始 `annotation` 键名清洗得到，并受允许列表（`allowlist`）控制。 |

```prometheus
# HELP kube_persistentvolumeclaim_annotations 将 Kubernetes 注解（annotation）转换为 Prometheus Label，输出受 --metric-annotations-allowlist 控制
# TYPE kube_persistentvolumeclaim_annotations gauge
kube_persistentvolumeclaim_annotations{persistentvolumeclaim="data",namespace="default",annotation_team="platform"} 1
```

### `kube_persistentvolumeclaim_info`

`STABLE`：`PersistentVolumeClaim` 的基础信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-etcd2-0` | `PersistentVolumeClaim` 名称。 |
| `storageclass` | `cbs-ssd` | StorageClass 名称。 |
| `volumename` | `pvc-9540bb2b-0b34-40b6-9c2a-61db4bf8be37` | `PVC` 绑定的 `PV` 名称。 |
| `volumemode` | `Filesystem` | 卷模式，例如 Filesystem 或 Block。 |

```prometheus
# HELP kube_persistentvolumeclaim_info STABLE：PersistentVolumeClaim 的基础信息
# TYPE kube_persistentvolumeclaim_info gauge
kube_persistentvolumeclaim_info{namespace="khaos",persistentvolumeclaim="data-etcd2-0",storageclass="cbs-ssd",volumename="pvc-9540bb2b-0b34-40b6-9c2a-61db4bf8be37",volumemode="Filesystem"} 1
```

### `kube_persistentvolumeclaim_status_phase`

`STABLE`：`PersistentVolumeClaim` 当前阶段（`phase`）。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-j4pr0osk` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data-proxy-0` | `PersistentVolumeClaim` 名称。 |
| `phase` | `Lost` | `Kubernetes` 对象 `phase` 枚举值。 |

```prometheus
# HELP kube_persistentvolumeclaim_status_phase STABLE：PersistentVolumeClaim 当前阶段（phase）
# TYPE kube_persistentvolumeclaim_status_phase gauge
kube_persistentvolumeclaim_status_phase{namespace="tdsql-j4pr0osk",persistentvolumeclaim="data-proxy-0",phase="Lost"} 1
```

### `kube_persistentvolumeclaim_resource_requests_storage_bytes`

`STABLE`：`PersistentVolumeClaim` 请求的存储容量。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `prometheus-storage-volume-prometheus-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kube_persistentvolumeclaim_resource_requests_storage_bytes STABLE：PersistentVolumeClaim 请求的存储容量
# TYPE kube_persistentvolumeclaim_resource_requests_storage_bytes gauge
kube_persistentvolumeclaim_resource_requests_storage_bytes{namespace="khaos",persistentvolumeclaim="prometheus-storage-volume-prometheus-0"} 1048576
```

### `kube_persistentvolumeclaim_access_mode`

`STABLE`：`PersistentVolumeClaim` 声明的访问模式。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `obs` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `storage-prometheus-alertmanager-0` | `PersistentVolumeClaim` 名称。 |
| `access_mode` | `ReadWriteOnce` | `PVC` 访问模式。 |

```prometheus
# HELP kube_persistentvolumeclaim_access_mode STABLE：PersistentVolumeClaim 声明的访问模式
# TYPE kube_persistentvolumeclaim_access_mode gauge
kube_persistentvolumeclaim_access_mode{namespace="obs",persistentvolumeclaim="storage-prometheus-alertmanager-0",access_mode="ReadWriteOnce"} 1
```

### `kube_persistentvolumeclaim_status_condition`

`PersistentVolumeClaim` 不同状态条件（`condition`）的状态信息。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data` | `PersistentVolumeClaim` 名称。 |
| `type` | `Ready` | `PersistentVolumeClaim` 状态条件（`condition`）类型。 |
| `status` | `true` | `Kubernetes` `condition` 的状态，通常为 true、false 或 unknown。 |

```prometheus
# HELP kube_persistentvolumeclaim_status_condition PersistentVolumeClaim 不同状态条件（condition）的状态信息
# TYPE kube_persistentvolumeclaim_status_condition gauge
kube_persistentvolumeclaim_status_condition{namespace="default",persistentvolumeclaim="data",type="Ready",status="true"} 1
```

### `kube_persistentvolumeclaim_created`

对象创建时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `prometheus-storage-volume-prometheus-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kube_persistentvolumeclaim_created 对象创建时间的 Unix 时间戳
# TYPE kube_persistentvolumeclaim_created gauge
kube_persistentvolumeclaim_created{namespace="khaos",persistentvolumeclaim="prometheus-storage-volume-prometheus-0"} 1700000000
```

### `kube_persistentvolumeclaim_deletion_timestamp`

对象删除时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `persistentvolumeclaim` | `data` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kube_persistentvolumeclaim_deletion_timestamp 对象删除时间的 Unix 时间戳
# TYPE kube_persistentvolumeclaim_deletion_timestamp gauge
kube_persistentvolumeclaim_deletion_timestamp{namespace="default",persistentvolumeclaim="data"} 1700000000
```

### `kube_persistentvolume_claim_ref`

`STABLE`：`PersistentVolume` 绑定的 `PersistentVolumeClaim` 引用信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `pvc-49c13c75-1b8d-4799-a39a-aa1a4eb9ee00` | `PersistentVolume` 名称。 |
| `name` | `data-etcd1-0` | `PV` claimRef 中引用的 `PersistentVolumeClaim` 名称。 |
| `claim_namespace` | `khaos` | `PV` 绑定 `PVC` 所在 `Namespace`。 |

```prometheus
# HELP kube_persistentvolume_claim_ref STABLE：PersistentVolume 绑定的 PersistentVolumeClaim 引用信息
# TYPE kube_persistentvolume_claim_ref gauge
kube_persistentvolume_claim_ref{persistentvolume="pvc-49c13c75-1b8d-4799-a39a-aa1a4eb9ee00",name="data-etcd1-0",claim_namespace="khaos"} 1
```

### `kube_persistentvolume_annotations`

将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `pv-data` | `PersistentVolume` 名称。 |
| `annotation_KEY` | `annotation_team="platform"` | `Kubernetes` 对象注解（`annotation`）转换后的 `Prometheus Label`；实际后缀由原始 `annotation` 键名清洗得到，并受允许列表（`allowlist`）控制。 |

```prometheus
# HELP kube_persistentvolume_annotations 将 Kubernetes 注解（annotation）转换为 Prometheus Label，输出受 --metric-annotations-allowlist 控制
# TYPE kube_persistentvolume_annotations gauge
kube_persistentvolume_annotations{persistentvolume="pv-data",annotation_team="platform"} 1
```

### `kube_persistentvolume_labels`

`STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `pv-data` | `PersistentVolume` 名称。 |
| `label_KEY` | `label_app="web"` | `Kubernetes` 对象标签（`label`）转换后的 `Prometheus Label`；实际后缀由原始 `label` 键名清洗得到，并受允许列表（`allowlist`）控制。 |

```prometheus
# HELP kube_persistentvolume_labels STABLE：将 Kubernetes 标签（label）转换为 Prometheus Label，输出受 --metric-labels-allowlist 控制
# TYPE kube_persistentvolume_labels gauge
kube_persistentvolume_labels{persistentvolume="pv-data",label_app="web"} 1
```

### `kube_persistentvolume_status_phase`

`STABLE`：`PersistentVolume` 当前阶段（`phase`），用于表示卷可用、已绑定或已释放等状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `prometheus-pv` | `PersistentVolume` 名称。 |
| `phase` | `Pending` | `Kubernetes` 对象 `phase` 枚举值。 |

```prometheus
# HELP kube_persistentvolume_status_phase STABLE：PersistentVolume 当前阶段（phase），用于表示卷可用、已绑定或已释放等状态
# TYPE kube_persistentvolume_status_phase gauge
kube_persistentvolume_status_phase{persistentvolume="prometheus-pv",phase="Pending"} 1
```

### `kube_persistentvolume_info`

`STABLE`：`PersistentVolume` 的基础信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `kube-prometheus-stack-pv-thanos` | `PersistentVolume` 名称。 |
| `storageclass` | `prometheus-data-thanos` | StorageClass 名称。 |
| `gce_persistent_disk_name` | `空字符串` | `GCE Persistent Disk` 名称。 |
| `ebs_volume_id` | `空字符串` | `AWS EBS` 卷 ID。 |
| `azure_disk_name` | `空字符串` | `Azure` 磁盘名称。 |
| `fc_wwids` | `空字符串` | `Fibre Channel` WWID 列表。 |
| `fc_lun` | `空字符串` | `Fibre Channel` LUN。 |
| `fc_target_wwns` | `空字符串` | `Fibre Channel` 目标 WWN 列表。 |
| `iscsi_target_portal` | `空字符串` | `iSCSI` 目标门户。 |
| `iscsi_iqn` | `空字符串` | `iSCSI` IQN。 |
| `iscsi_lun` | `空字符串` | `iSCSI` LUN。 |
| `iscsi_initiator_name` | `空字符串` | `iSCSI` 启动器名称。 |
| `nfs_server` | `空字符串` | `NFS` 服务端。 |
| `nfs_path` | `空字符串` | `NFS` 路径。 |
| `csi_driver` | `空字符串` | `CSI` 驱动名称。 |
| `csi_volume_handle` | `空字符串` | `CSI` 卷句柄。 |
| `local_path` | `空字符串` | 本地卷路径。 |
| `local_fs` | `空字符串` | 本地卷文件系统类型。 |
| `host_path` | `/prometheus/data` | HostPath 路径。 |
| `host_path_type` | `空字符串` | HostPath 类型。 |
| `reclaim_policy` | `Delete` | `PersistentVolume` 回收策略。 |

```prometheus
# HELP kube_persistentvolume_info STABLE：PersistentVolume 的基础信息
# TYPE kube_persistentvolume_info gauge
kube_persistentvolume_info{persistentvolume="kube-prometheus-stack-pv-thanos",storageclass="prometheus-data-thanos",gce_persistent_disk_name="",ebs_volume_id="",azure_disk_name="",fc_wwids="",fc_lun="",fc_target_wwns="",iscsi_target_portal="",iscsi_iqn="",iscsi_lun="",iscsi_initiator_name="",nfs_server="",nfs_path="",csi_driver="",csi_volume_handle="",local_path="",local_fs="",host_path="/prometheus/data",host_path_type="",reclaim_policy="Delete"} 1
```

### `kube_persistentvolume_capacity_bytes`

`STABLE`：`PersistentVolume` 容量，单位为字节。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `pvc-9540bb2b-0b34-40b6-9c2a-61db4bf8be37` | `PersistentVolume` 名称。 |

```prometheus
# HELP kube_persistentvolume_capacity_bytes STABLE：PersistentVolume 容量，单位为字节
# TYPE kube_persistentvolume_capacity_bytes gauge
kube_persistentvolume_capacity_bytes{persistentvolume="pvc-9540bb2b-0b34-40b6-9c2a-61db4bf8be37"} 1048576
```

### `kube_persistentvolume_created`

对象创建时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `pvc-25784d81-c6fa-4be2-a8e5-5ae9e7555c28` | `PersistentVolume` 名称。 |

```prometheus
# HELP kube_persistentvolume_created 对象创建时间的 Unix 时间戳
# TYPE kube_persistentvolume_created gauge
kube_persistentvolume_created{persistentvolume="pvc-25784d81-c6fa-4be2-a8e5-5ae9e7555c28"} 1700000000
```

### `kube_persistentvolume_deletion_timestamp`

对象删除时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `persistentvolume` | `pv-data` | `PersistentVolume` 名称。 |

```prometheus
# HELP kube_persistentvolume_deletion_timestamp 对象删除时间的 Unix 时间戳
# TYPE kube_persistentvolume_deletion_timestamp gauge
kube_persistentvolume_deletion_timestamp{persistentvolume="pv-data"} 1700000000
```

### `kube_pod_completion_time`

`STABLE`：`Pod` 完成时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b-3278891036` | `Pod` 名称。 |
| `uid` | `20956f63-af94-4e47-a286-85e242e57bf8` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_completion_time STABLE：Pod 完成时间的 Unix 时间戳
# TYPE kube_pod_completion_time gauge
kube_pod_completion_time{namespace="khaos-workflow",pod="resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b-3278891036",uid="20956f63-af94-4e47-a286-85e242e57bf8"} 1700000000
```

### `kube_pod_container_info`

`STABLE`：`Pod` 中容器的基础信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-modify-instance-normal-tdsql-fz0j2cw2-s253cem6o-3929726258` | `Pod` 名称。 |
| `uid` | `fbc39bff-c25f-44c4-92b1-19b276e911bb` | `Kubernetes` 对象 UID。 |
| `container` | `wait` | 容器名称。 |
| `image_spec` | `ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2` | `Pod` spec 中声明的镜像。 |
| `image` | `ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2` | 容器镜像名称。 |
| `image_id` | `docker-pullable://ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec@sha256:e38535f76815627c11b55b757e5449dd062214b1125c1fed6b65a40c82013fa6` | 容器镜像 ID。 |
| `container_id` | `docker://ace7b4b34ca8e6e44d9cbeded9f15b608466680ac4bc3ffbc88fb76f2d0ebf41` | 容器运行时 ID。 |

```prometheus
# HELP kube_pod_container_info STABLE：Pod 中容器的基础信息
# TYPE kube_pod_container_info gauge
kube_pod_container_info{namespace="khaos-workflow",pod="tdsql-modify-instance-normal-tdsql-fz0j2cw2-s253cem6o-3929726258",uid="fbc39bff-c25f-44c4-92b1-19b276e911bb",container="wait",image_spec="ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2",image="ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2",image_id="docker-pullable://ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec@sha256:e38535f76815627c11b55b757e5449dd062214b1125c1fed6b65a40c82013fa6",container_id="docker://ace7b4b34ca8e6e44d9cbeded9f15b608466680ac4bc3ffbc88fb76f2d0ebf41"} 1
```

### `kube_pod_container_resource_limits`

容器声明的资源限制数量；上游建议优先使用 `kube-scheduler` 暴露的 `kube_pod_resource_limit`，因为该指标更精确。类型为`gauge`，单位/值为：资源数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-q6pdrfvs-s252gjsgj-1407416850` | `Pod` 名称。 |
| `uid` | `f36c93fe-9774-4961-b8de-1d8b2b2210fe` | `Kubernetes` 对象 UID。 |
| `container` | `wait` | 容器名称。 |
| `node` | `192.168.200.15` | `Node` 名称。 |
| `resource` | `tke_cloud_tencent_com_eni_ip` | 资源名称，例如 cpu、memory、pods。 |
| `unit` | `integer` | 资源单位，例如 core、byte、integer。 |

```prometheus
# HELP kube_pod_container_resource_limits 容器声明的资源限制数量；上游建议优先使用 kube-scheduler 暴露的 kube_pod_resource_limit，因为该指标更精确
# TYPE kube_pod_container_resource_limits gauge
kube_pod_container_resource_limits{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-q6pdrfvs-s252gjsgj-1407416850",uid="f36c93fe-9774-4961-b8de-1d8b2b2210fe",container="wait",node="192.168.200.15",resource="tke_cloud_tencent_com_eni_ip",unit="integer"} 1
```

### `kube_pod_container_resource_requests`

容器声明的资源请求数量；上游建议优先使用 `kube-scheduler` 暴露的 `kube_pod_resource_request`，因为该指标更精确。类型为`gauge`，单位/值为：资源数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `cls-provisioner-77d5bdd87-pm7tb` | `Pod` 名称。 |
| `uid` | `c1d8deb6-d72c-47fe-9ece-2313073a9969` | `Kubernetes` 对象 UID。 |
| `container` | `cls-provisioner` | 容器名称。 |
| `node` | `192.168.4.5` | `Node` 名称。 |
| `resource` | `cpu` | 资源名称，例如 cpu、memory、pods。 |
| `unit` | `core` | 资源单位，例如 core、byte、integer。 |

```prometheus
# HELP kube_pod_container_resource_requests 容器声明的资源请求数量；上游建议优先使用 kube-scheduler 暴露的 kube_pod_resource_request，因为该指标更精确
# TYPE kube_pod_container_resource_requests gauge
kube_pod_container_resource_requests{namespace="kube-system",pod="cls-provisioner-77d5bdd87-pm7tb",uid="c1d8deb6-d72c-47fe-9ece-2313073a9969",container="cls-provisioner",node="192.168.4.5",resource="cpu",unit="core"} 1
```

### `kube_pod_container_state_started`

`STABLE`：`Pod` 容器启动时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos` | `Kubernetes` 命名空间。 |
| `pod` | `vmagent-0` | `Pod` 名称。 |
| `uid` | `b7271c1f-b73a-4712-865d-195307f57ca4` | `Kubernetes` 对象 UID。 |
| `container` | `main` | 容器名称。 |

```prometheus
# HELP kube_pod_container_state_started STABLE：Pod 容器启动时间的 Unix 时间戳
# TYPE kube_pod_container_state_started gauge
kube_pod_container_state_started{namespace="khaos",pod="vmagent-0",uid="b7271c1f-b73a-4712-865d-195307f57ca4",container="main"} 1700000000
```

### `kube_pod_container_status_last_terminated_reason`

容器上一次进入 `Terminated` 状态的原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-log-agent-qkmgc` | `Pod` 名称。 |
| `uid` | `5e4d7ef5-15ce-4be4-b3b7-48b595ccde80` | `Kubernetes` 对象 UID。 |
| `container` | `kafkalistener` | 容器名称。 |
| `reason` | `Error` | 状态原因枚举值。 |

```prometheus
# HELP kube_pod_container_status_last_terminated_reason 容器上一次进入 Terminated 状态的原因
# TYPE kube_pod_container_status_last_terminated_reason gauge
kube_pod_container_status_last_terminated_reason{namespace="kube-system",pod="tke-log-agent-qkmgc",uid="5e4d7ef5-15ce-4be4-b3b7-48b595ccde80",container="kafkalistener",reason="Error"} 1
```

### `kube_pod_container_status_last_terminated_exitcode`

容器上一次 `Terminated` 状态的退出码。类型为`gauge`，单位/值为：退出码。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-eni-agent-g4sxw` | `Pod` 名称。 |
| `uid` | `25250511-ded6-4339-9da7-0cc5e1202735` | `Kubernetes` 对象 UID。 |
| `container` | `tke-eni-agent` | 容器名称。 |

```prometheus
# HELP kube_pod_container_status_last_terminated_exitcode 容器上一次 Terminated 状态的退出码
# TYPE kube_pod_container_status_last_terminated_exitcode gauge
kube_pod_container_status_last_terminated_exitcode{namespace="kube-system",pod="tke-eni-agent-g4sxw",uid="25250511-ded6-4339-9da7-0cc5e1202735",container="tke-eni-agent"} 1
```

### `kube_pod_container_status_ready`

`STABLE`：容器 `Readiness` 检查是否通过。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `kube-proxy-4k9nj` | `Pod` 名称。 |
| `uid` | `2dc1f067-903a-4d22-b454-deeb3b9e3bae` | `Kubernetes` 对象 UID。 |
| `container` | `kube-proxy` | 容器名称。 |

```prometheus
# HELP kube_pod_container_status_ready STABLE：容器 Readiness 检查是否通过
# TYPE kube_pod_container_status_ready gauge
kube_pod_container_status_ready{namespace="kube-system",pod="kube-proxy-4k9nj",uid="2dc1f067-903a-4d22-b454-deeb3b9e3bae",container="kube-proxy"} 1
```

### `kube_pod_container_status_restarts_total`

`STABLE`：每个容器的重启累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-mkppbwy4-s252je4t8-2479938884` | `Pod` 名称。 |
| `uid` | `64b48860-300d-48bd-b4b7-e5922487b6a3` | `Kubernetes` 对象 UID。 |
| `container` | `main` | 容器名称。 |

```prometheus
# HELP kube_pod_container_status_restarts_total STABLE：每个容器的重启累计次数
# TYPE kube_pod_container_status_restarts_total counter
kube_pod_container_status_restarts_total{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-mkppbwy4-s252je4t8-2479938884",uid="64b48860-300d-48bd-b4b7-e5922487b6a3",container="main"} 42
```

### `kube_pod_container_status_running`

`STABLE`：容器当前是否处于 `Running` 状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-cni-agent-rmb7v` | `Pod` 名称。 |
| `uid` | `b17c1b8e-1fce-44e5-9ce3-a1f658b4ff7a` | `Kubernetes` 对象 UID。 |
| `container` | `tke-cni-agent` | 容器名称。 |

```prometheus
# HELP kube_pod_container_status_running STABLE：容器当前是否处于 Running 状态
# TYPE kube_pod_container_status_running gauge
kube_pod_container_status_running{namespace="kube-system",pod="tke-cni-agent-rmb7v",uid="b17c1b8e-1fce-44e5-9ce3-a1f658b4ff7a",container="tke-cni-agent"} 1
```

### `kube_pod_container_status_terminated`

`STABLE`：容器当前是否处于 `Terminated` 状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `kube-proxy-4k9nj` | `Pod` 名称。 |
| `uid` | `2dc1f067-903a-4d22-b454-deeb3b9e3bae` | `Kubernetes` 对象 UID。 |
| `container` | `kube-proxy` | 容器名称。 |

```prometheus
# HELP kube_pod_container_status_terminated STABLE：容器当前是否处于 Terminated 状态
# TYPE kube_pod_container_status_terminated gauge
kube_pod_container_status_terminated{namespace="kube-system",pod="kube-proxy-4k9nj",uid="2dc1f067-903a-4d22-b454-deeb3b9e3bae",container="kube-proxy"} 1
```

### `kube_pod_container_status_terminated_reason`

容器当前处于 `Terminated` 状态的原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-fz0j2cw2-s27f5jh5o-1026515105` | `Pod` 名称。 |
| `uid` | `2cfeb1f7-3a4a-4a3c-af82-b728cc8833c4` | `Kubernetes` 对象 UID。 |
| `container` | `main` | 容器名称。 |
| `reason` | `Error` | 状态原因枚举值。 |

```prometheus
# HELP kube_pod_container_status_terminated_reason 容器当前处于 Terminated 状态的原因
# TYPE kube_pod_container_status_terminated_reason gauge
kube_pod_container_status_terminated_reason{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-fz0j2cw2-s27f5jh5o-1026515105",uid="2cfeb1f7-3a4a-4a3c-af82-b728cc8833c4",container="main",reason="Error"} 1
```

### `kube_pod_container_status_waiting`

`STABLE`：容器当前是否处于 `Waiting` 状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `testkube` | `Kubernetes` 命名空间。 |
| `pod` | `testkube1-nats-0` | `Pod` 名称。 |
| `uid` | `715c8db0-d2db-40d3-8810-07a39d7c28a2` | `Kubernetes` 对象 UID。 |
| `container` | `metrics` | 容器名称。 |

```prometheus
# HELP kube_pod_container_status_waiting STABLE：容器当前是否处于 Waiting 状态
# TYPE kube_pod_container_status_waiting gauge
kube_pod_container_status_waiting{namespace="testkube",pod="testkube1-nats-0",uid="715c8db0-d2db-40d3-8810-07a39d7c28a2",container="metrics"} 1
```

### `kube_pod_container_status_waiting_reason`

`STABLE`：容器当前处于 `Waiting` 状态的原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `monitoring` | `Kubernetes` 命名空间。 |
| `pod` | `monitor-kube-prometheus-st-admission-create--1-zdx62` | `Pod` 名称。 |
| `uid` | `a6232977-5db9-4088-a138-28a3dcd9402d` | `Kubernetes` 对象 UID。 |
| `container` | `create` | 容器名称。 |
| `reason` | `ImagePullBackOff` | 状态原因枚举值。 |

```prometheus
# HELP kube_pod_container_status_waiting_reason STABLE：容器当前处于 Waiting 状态的原因
# TYPE kube_pod_container_status_waiting_reason gauge
kube_pod_container_status_waiting_reason{namespace="monitoring",pod="monitor-kube-prometheus-st-admission-create--1-zdx62",uid="a6232977-5db9-4088-a138-28a3dcd9402d",container="create",reason="ImagePullBackOff"} 1
```

### `kube_pod_created`

`STABLE`：对象创建时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-monitor-agent-pflvn` | `Pod` 名称。 |
| `uid` | `dd118443-6321-4c01-afec-b99de25c9b2a` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_created STABLE：对象创建时间的 Unix 时间戳
# TYPE kube_pod_created gauge
kube_pod_created{namespace="kube-system",pod="tke-monitor-agent-pflvn",uid="dd118443-6321-4c01-afec-b99de25c9b2a"} 1700000000
```

### `kube_pod_deletion_timestamp`

对象删除时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_deletion_timestamp 对象删除时间的 Unix 时间戳
# TYPE kube_pod_deletion_timestamp gauge
kube_pod_deletion_timestamp{pod="nginx-xxxxx",namespace="default",uid="9f8b..."} 1700000000
```

### `kube_pod_info`

`STABLE`：`Pod` 的基础信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b-3278891036` | `Pod` 名称。 |
| `uid` | `20956f63-af94-4e47-a286-85e242e57bf8` | `Kubernetes` 对象 UID。 |
| `host_ip` | `192.168.200.15` | `Pod` 所在节点 IP。 |
| `pod_ip` | `192.168.200.154` | `Pod` IP。 |
| `node` | `192.168.200.15` | `Node` 名称。 |
| `created_by_kind` | `Workflow` | `Pod` 创建者 kind。 |
| `created_by_name` | `resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b` | `Pod` 创建者名称。 |
| `priority_class` | `空字符串` | `Pod` priorityClass 名称。 |
| `host_network` | `false` | `Pod` 是否使用 hostNetwork。 |

```prometheus
# HELP kube_pod_info STABLE：Pod 的基础信息
# TYPE kube_pod_info gauge
kube_pod_info{namespace="khaos-workflow",pod="resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b-3278891036",uid="20956f63-af94-4e47-a286-85e242e57bf8",host_ip="192.168.200.15",pod_ip="192.168.200.154",node="192.168.200.15",created_by_kind="Workflow",created_by_name="resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b",priority_class="",host_network="false"} 1
```

### `kube_pod_ips`

`Pod` 的 IP 地址信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `csi-cbs-node-94p56` | `Pod` 名称。 |
| `uid` | `cc447e8d-eaba-4fde-87af-9636abd5a2cf` | `Kubernetes` 对象 UID。 |
| `ip` | `192.168.4.10` | `Pod` IP 地址。 |
| `ip_family` | `4` | IP 地址族，通常为 4 或 6。 |

```prometheus
# HELP kube_pod_ips Pod 的 IP 地址信息
# TYPE kube_pod_ips gauge
kube_pod_ips{namespace="kube-system",pod="csi-cbs-node-94p56",uid="cc447e8d-eaba-4fde-87af-9636abd5a2cf",ip="192.168.4.10",ip_family="4"} 1
```

### `kube_pod_init_container_info`

`STABLE`：`Pod` 中 init 容器的基础信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `resource-horizontal-upgrade-tdsql-gb2nize4-s251b9i2a-4005882514` | `Pod` 名称。 |
| `uid` | `a1e27a3a-7cf5-4773-aad8-74159a121252` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |
| `image_spec` | `ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2` | `Pod` spec 中声明的镜像。 |
| `image` | `ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2` | 容器镜像名称。 |
| `image_id` | `docker-pullable://ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec@sha256:e38535f76815627c11b55b757e5449dd062214b1125c1fed6b65a40c82013fa6` | 容器镜像 ID。 |
| `container_id` | `docker://8602a61d991e12eedbd44f4be169683b0fbe96e286a798446ae62296f9d30a55` | 容器运行时 ID。 |
| `restart_policy` | `Always` | Init 容器重启策略；官方文档确认该 `Label` 表示 `restartPolicy` 的取值。 |

```prometheus
# HELP kube_pod_init_container_info STABLE：Pod 中 init 容器的基础信息
# TYPE kube_pod_init_container_info gauge
kube_pod_init_container_info{namespace="khaos-workflow",pod="resource-horizontal-upgrade-tdsql-gb2nize4-s251b9i2a-4005882514",uid="a1e27a3a-7cf5-4773-aad8-74159a121252",container="init",image_spec="ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2",image="ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec:v3.4.7.2",image_id="docker-pullable://ccr.ccs.tencentyun.com/cdb.khaos.eros/argoexec@sha256:e38535f76815627c11b55b757e5449dd062214b1125c1fed6b65a40c82013fa6",container_id="docker://8602a61d991e12eedbd44f4be169683b0fbe96e286a798446ae62296f9d30a55",restart_policy="Always"} 1
```

### `kube_pod_init_container_resource_limits`

Init 容器声明的资源限制数量。类型为`gauge`，单位/值为：资源数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `resource` | `cpu` | 资源名称，例如 cpu、memory、pods。 |
| `unit` | `core` | 资源单位，例如 core、byte、integer。 |
| `container` | `nginx` | 容器名称。 |
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `node` | `node-1` | `Node` 名称。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_init_container_resource_limits Init 容器声明的资源限制数量
# TYPE kube_pod_init_container_resource_limits gauge
kube_pod_init_container_resource_limits{resource="cpu",unit="core",container="nginx",pod="nginx-xxxxx",namespace="default",node="node-1",uid="9f8b..."} 1
```

### `kube_pod_init_container_resource_requests`

Init 容器声明的资源请求数量。类型为`gauge`，单位/值为：资源数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-mkppbwy4-s252je4t8-2479938884` | `Pod` 名称。 |
| `uid` | `64b48860-300d-48bd-b4b7-e5922487b6a3` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |
| `node` | `192.168.200.15` | `Node` 名称。 |
| `resource` | `cpu` | 资源名称，例如 cpu、memory、pods。 |
| `unit` | `core` | 资源单位，例如 core、byte、integer。 |

```prometheus
# HELP kube_pod_init_container_resource_requests Init 容器声明的资源请求数量
# TYPE kube_pod_init_container_resource_requests gauge
kube_pod_init_container_resource_requests{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-mkppbwy4-s252je4t8-2479938884",uid="64b48860-300d-48bd-b4b7-e5922487b6a3",container="init",node="192.168.200.15",resource="cpu",unit="core"} 1
```

### `kube_pod_init_container_status_last_terminated_reason`

Init 容器上一次进入 `Terminated` 状态的原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `nginx` | 容器名称。 |
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `reason` | `CrashLoopBackOff` | 状态原因枚举值。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_init_container_status_last_terminated_reason Init 容器上一次进入 Terminated 状态的原因
# TYPE kube_pod_init_container_status_last_terminated_reason gauge
kube_pod_init_container_status_last_terminated_reason{container="nginx",pod="nginx-xxxxx",namespace="default",reason="CrashLoopBackOff",uid="9f8b..."} 1
```

### `kube_pod_init_container_status_ready`

`STABLE`：Init 容器 `Readiness` 检查是否通过。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-ba7peyay-s25ibxal2-2677890097` | `Pod` 名称。 |
| `uid` | `3f2be3dc-cd7c-49c1-8428-ff67cb59cbd5` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |

```prometheus
# HELP kube_pod_init_container_status_ready STABLE：Init 容器 Readiness 检查是否通过
# TYPE kube_pod_init_container_status_ready gauge
kube_pod_init_container_status_ready{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-ba7peyay-s25ibxal2-2677890097",uid="3f2be3dc-cd7c-49c1-8428-ff67cb59cbd5",container="init"} 1
```

### `kube_pod_init_container_status_restarts_total`

`STABLE`：Init 容器的重启累计次数。类型为`counter`，单位/值为：累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b-2674749657` | `Pod` 名称。 |
| `uid` | `9dde934f-ec2c-4186-87c5-ea4f3d5ab51c` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |

```prometheus
# HELP kube_pod_init_container_status_restarts_total STABLE：Init 容器的重启累计次数
# TYPE kube_pod_init_container_status_restarts_total counter
kube_pod_init_container_status_restarts_total{namespace="khaos-workflow",pod="resource-horizontal-upgrade-tdsql-68h3dsum-s258vnx8b-2674749657",uid="9dde934f-ec2c-4186-87c5-ea4f3d5ab51c",container="init"} 42
```

### `kube_pod_init_container_status_running`

`STABLE`：Init 容器当前是否处于 `Running` 状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-modify-instance-normal-tdsql-gb2nize4-s251b7t3y-521091190` | `Pod` 名称。 |
| `uid` | `0cba8d39-2f40-46c3-9fc3-292bfa4f18e3` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |

```prometheus
# HELP kube_pod_init_container_status_running STABLE：Init 容器当前是否处于 Running 状态
# TYPE kube_pod_init_container_status_running gauge
kube_pod_init_container_status_running{namespace="khaos-workflow",pod="tdsql-modify-instance-normal-tdsql-gb2nize4-s251b7t3y-521091190",uid="0cba8d39-2f40-46c3-9fc3-292bfa4f18e3",container="init"} 1
```

### `kube_pod_init_container_status_terminated`

`STABLE`：Init 容器当前是否处于 `Terminated` 状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-lnyv2te0-s252febw3-2956683304` | `Pod` 名称。 |
| `uid` | `23c2ede0-48d9-4eba-a2db-c8f803658f74` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |

```prometheus
# HELP kube_pod_init_container_status_terminated STABLE：Init 容器当前是否处于 Terminated 状态
# TYPE kube_pod_init_container_status_terminated gauge
kube_pod_init_container_status_terminated{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-lnyv2te0-s252febw3-2956683304",uid="23c2ede0-48d9-4eba-a2db-c8f803658f74",container="init"} 1
```

### `kube_pod_init_container_status_terminated_reason`

Init 容器当前处于 `Terminated` 状态的原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-cju2wvno` | `Kubernetes` 命名空间。 |
| `pod` | `mysql-2` | `Pod` 名称。 |
| `uid` | `3a5ef2e6-f9f9-4141-bf68-8fc7ae590799` | `Kubernetes` 对象 UID。 |
| `container` | `khaos-initializer` | 容器名称。 |
| `reason` | `Completed` | 状态原因枚举值。 |

```prometheus
# HELP kube_pod_init_container_status_terminated_reason Init 容器当前处于 Terminated 状态的原因
# TYPE kube_pod_init_container_status_terminated_reason gauge
kube_pod_init_container_status_terminated_reason{namespace="tdsql-cju2wvno",pod="mysql-2",uid="3a5ef2e6-f9f9-4141-bf68-8fc7ae590799",container="khaos-initializer",reason="Completed"} 1
```

### `kube_pod_init_container_status_waiting`

`STABLE`：Init 容器当前是否处于 `Waiting` 状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `resource-horizontal-upgrade-tdsql-8ynwvxpi-s24zq4nmy-3463132431` | `Pod` 名称。 |
| `uid` | `b016ea92-6c02-4e2f-b631-7f61efa31aec` | `Kubernetes` 对象 UID。 |
| `container` | `init` | 容器名称。 |

```prometheus
# HELP kube_pod_init_container_status_waiting STABLE：Init 容器当前是否处于 Waiting 状态
# TYPE kube_pod_init_container_status_waiting gauge
kube_pod_init_container_status_waiting{namespace="khaos-workflow",pod="resource-horizontal-upgrade-tdsql-8ynwvxpi-s24zq4nmy-3463132431",uid="b016ea92-6c02-4e2f-b631-7f61efa31aec",container="init"} 1
```

### `kube_pod_init_container_status_waiting_reason`

Init 容器当前处于 `Waiting` 状态的原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `container` | `nginx` | 容器名称。 |
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `reason` | `CrashLoopBackOff` | 状态原因枚举值。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_init_container_status_waiting_reason Init 容器当前处于 Waiting 状态的原因
# TYPE kube_pod_init_container_status_waiting_reason gauge
kube_pod_init_container_status_waiting_reason{container="nginx",pod="nginx-xxxxx",namespace="default",reason="CrashLoopBackOff",uid="9f8b..."} 1
```

### `kube_pod_annotations`

将 `Kubernetes` 注解（`annotation`）转换为 `Prometheus Label`，输出受 `--metric-annotations-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `annotation_KEY` | `annotation_team="platform"` | `Kubernetes` 对象注解（`annotation`）转换后的 `Prometheus Label`；实际后缀由原始 `annotation` 键名清洗得到，并受允许列表（`allowlist`）控制。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_annotations 将 Kubernetes 注解（annotation）转换为 Prometheus Label，输出受 --metric-annotations-allowlist 控制
# TYPE kube_pod_annotations gauge
kube_pod_annotations{pod="nginx-xxxxx",namespace="default",annotation_team="platform",uid="9f8b..."} 1
```

### `kube_pod_labels`

`STABLE`：将 `Kubernetes` 标签（`label`）转换为 `Prometheus Label`，输出受 `--metric-labels-allowlist` 控制。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `label_KEY` | `label_app="web"` | `Kubernetes` 对象标签（`label`）转换后的 `Prometheus Label`；实际后缀由原始 `label` 键名清洗得到，并受允许列表（`allowlist`）控制。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_labels STABLE：将 Kubernetes 标签（label）转换为 Prometheus Label，输出受 --metric-labels-allowlist 控制
# TYPE kube_pod_labels gauge
kube_pod_labels{pod="nginx-xxxxx",namespace="default",label_app="web",uid="9f8b..."} 1
```

### `kube_pod_overhead_cpu_cores`

运行 `Pod` 所需的 `CPU` 额外开销。类型为`gauge`，单位/值为：`CPU` 核数。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_overhead_cpu_cores 运行 Pod 所需的 CPU 额外开销
# TYPE kube_pod_overhead_cpu_cores gauge
kube_pod_overhead_cpu_cores{pod="nginx-xxxxx",namespace="default",uid="9f8b..."} 4
```

### `kube_pod_overhead_memory_bytes`

运行 `Pod` 所需的内存额外开销。类型为`gauge`，单位/值为：字节。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_overhead_memory_bytes 运行 Pod 所需的内存额外开销
# TYPE kube_pod_overhead_memory_bytes gauge
kube_pod_overhead_memory_bytes{pod="nginx-xxxxx",namespace="default",uid="9f8b..."} 1048576
```

### `kube_pod_owner`

`STABLE`：`Pod` 所属控制器（`owner`）信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-offline-instance-tdsql-9puat6nc-s252ih43w-1971323033` | `Pod` 名称。 |
| `uid` | `48de16ed-0ff7-4045-885d-84272ba3a5a9` | `Kubernetes` 对象 UID。 |
| `owner_kind` | `Workflow` | `Pod` 所属控制器类型。 |
| `owner_name` | `tdsql-offline-instance-tdsql-9puat6nc-s252ih43w` | `Pod` 所属控制器名称。 |
| `owner_is_controller` | `true` | `owner` 是否为 controller。 |

```prometheus
# HELP kube_pod_owner STABLE：Pod 所属控制器（owner）信息
# TYPE kube_pod_owner gauge
kube_pod_owner{namespace="khaos-workflow",pod="tdsql-offline-instance-tdsql-9puat6nc-s252ih43w-1971323033",uid="48de16ed-0ff7-4045-885d-84272ba3a5a9",owner_kind="Workflow",owner_name="tdsql-offline-instance-tdsql-9puat6nc-s252ih43w",owner_is_controller="true"} 1
```

### `kube_pod_restart_policy`

`STABLE`：`Pod` 使用的重启策略（`restartPolicy`）。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-modify-instance-normal-tdsql-s12bk5mo-s1nfwscle-1073516541` | `Pod` 名称。 |
| `uid` | `de1bc1c8-63f3-4eef-a714-aa4409a9df7d` | `Kubernetes` 对象 UID。 |
| `type` | `Never` | `Pod` 重启策略（`restartPolicy`），取值为`Always`、`Never`或`OnFailure`。 |

```prometheus
# HELP kube_pod_restart_policy STABLE：Pod 使用的重启策略（restartPolicy）
# TYPE kube_pod_restart_policy gauge
kube_pod_restart_policy{namespace="khaos-workflow",pod="tdsql-modify-instance-normal-tdsql-s12bk5mo-s1nfwscle-1073516541",uid="de1bc1c8-63f3-4eef-a714-aa4409a9df7d",type="Never"} 1
```

### `kube_pod_runtimeclass_name_info`

`Pod` 关联的 `RuntimeClass` 信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_runtimeclass_name_info Pod 关联的 RuntimeClass 信息
# TYPE kube_pod_runtimeclass_name_info gauge
kube_pod_runtimeclass_name_info{pod="nginx-xxxxx",namespace="default",uid="9f8b..."} 1
```

### `kube_pod_spec_volumes_persistentvolumeclaims_info`

`STABLE`：`Pod` 中 `PersistentVolumeClaim` 类型卷（`volume`）的信息。类型为`gauge`，单位/值为：数量。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `tdsql-nfcrhc2s` | `Kubernetes` 命名空间。 |
| `pod` | `proxy-2` | `Pod` 名称。 |
| `uid` | `ef3de691-639e-4cbc-97db-3d5268cbd26b` | `Kubernetes` 对象 UID。 |
| `volume` | `data` | `Pod` `volume` 名称。 |
| `persistentvolumeclaim` | `data-proxy-2` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kube_pod_spec_volumes_persistentvolumeclaims_info STABLE：Pod 中 PersistentVolumeClaim 类型卷（volume）的信息
# TYPE kube_pod_spec_volumes_persistentvolumeclaims_info gauge
kube_pod_spec_volumes_persistentvolumeclaims_info{namespace="tdsql-nfcrhc2s",pod="proxy-2",uid="ef3de691-639e-4cbc-97db-3d5268cbd26b",volume="data",persistentvolumeclaim="data-proxy-2"} 1
```

### `kube_pod_spec_volumes_persistentvolumeclaims_readonly`

`STABLE`：`PersistentVolumeClaim` 类型卷（`volume`）是否以只读方式挂载。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos` | `Kubernetes` 命名空间。 |
| `pod` | `etcd0-0` | `Pod` 名称。 |
| `uid` | `a400c3ed-9ac2-4556-9330-f2860e239e5a` | `Kubernetes` 对象 UID。 |
| `volume` | `data` | `Pod` `volume` 名称。 |
| `persistentvolumeclaim` | `data-etcd0-0` | `PersistentVolumeClaim` 名称。 |

```prometheus
# HELP kube_pod_spec_volumes_persistentvolumeclaims_readonly STABLE：PersistentVolumeClaim 类型卷（volume）是否以只读方式挂载
# TYPE kube_pod_spec_volumes_persistentvolumeclaims_readonly gauge
kube_pod_spec_volumes_persistentvolumeclaims_readonly{namespace="khaos",pod="etcd0-0",uid="a400c3ed-9ac2-4556-9330-f2860e239e5a",volume="data",persistentvolumeclaim="data-etcd0-0"} 1
```

### `kube_pod_start_time`

`STABLE`：`Pod` 启动时间的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos-workflow` | `Kubernetes` 命名空间。 |
| `pod` | `tdsql-modify-instance-normal-tdsql-fz0j2cw2-s253cem6o-2541528106` | `Pod` 名称。 |
| `uid` | `172e9264-8c33-423e-bc8e-1090606496c4` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_start_time STABLE：Pod 启动时间的 Unix 时间戳
# TYPE kube_pod_start_time gauge
kube_pod_start_time{namespace="khaos-workflow",pod="tdsql-modify-instance-normal-tdsql-fz0j2cw2-s253cem6o-2541528106",uid="172e9264-8c33-423e-bc8e-1090606496c4"} 1700000000
```

### `kube_pod_status_phase`

`STABLE`：`Pod` 当前阶段（`phase`）。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `kube-proxy-4k9nj` | `Pod` 名称。 |
| `uid` | `2dc1f067-903a-4d22-b454-deeb3b9e3bae` | `Kubernetes` 对象 UID。 |
| `phase` | `Pending` | `Kubernetes` 对象 `phase` 枚举值。 |

```prometheus
# HELP kube_pod_status_phase STABLE：Pod 当前阶段（phase）
# TYPE kube_pod_status_phase gauge
kube_pod_status_phase{namespace="kube-system",pod="kube-proxy-4k9nj",uid="2dc1f067-903a-4d22-b454-deeb3b9e3bae",phase="Pending"} 1
```

### `kube_pod_status_qos_class`

`Pod` 当前 `QoS Class`。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `chaos-mesh` | `Kubernetes` 命名空间。 |
| `pod` | `chaos-controller-manager-7568545568-tw5km` | `Pod` 名称。 |
| `uid` | `7f86d7bf-c4b7-4094-9431-0cd51a2a45fb` | `Kubernetes` 对象 UID。 |
| `qos_class` | `BestEffort` | `Pod` `QoS Class`。 |

```prometheus
# HELP kube_pod_status_qos_class Pod 当前 QoS Class
# TYPE kube_pod_status_qos_class gauge
kube_pod_status_qos_class{namespace="chaos-mesh",pod="chaos-controller-manager-7568545568-tw5km",uid="7f86d7bf-c4b7-4094-9431-0cd51a2a45fb",qos_class="BestEffort"} 1
```

### `kube_pod_status_ready`

`STABLE`：`Pod` 是否已经 `Ready`，可对外提供服务。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `ip-masq-agent-fsv5s` | `Pod` 名称。 |
| `uid` | `c5788eb6-d7b2-424f-95c4-0294ca910948` | `Kubernetes` 对象 UID。 |
| `condition` | `true` | `Kubernetes` `condition` 的类型或状态枚举。 |

```prometheus
# HELP kube_pod_status_ready STABLE：Pod 是否已经 Ready，可对外提供服务
# TYPE kube_pod_status_ready gauge
kube_pod_status_ready{namespace="kube-system",pod="ip-masq-agent-fsv5s",uid="c5788eb6-d7b2-424f-95c4-0294ca910948",condition="true"} 1
```

### `kube_pod_status_ready_time`

`Pod` 通过 `Readiness Probe` 的时间。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `csi-cbs-node-b8258` | `Pod` 名称。 |
| `uid` | `81e55f11-acda-42a4-bcad-e951d9604c99` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_status_ready_time Pod 通过 Readiness Probe 的时间
# TYPE kube_pod_status_ready_time gauge
kube_pod_status_ready_time{namespace="kube-system",pod="csi-cbs-node-b8258",uid="81e55f11-acda-42a4-bcad-e951d9604c99"} 1700000000
```

### `kube_pod_status_initialized_time`

`Pod` 完成初始化的时间。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `csi-cbs-node-94p56` | `Pod` 名称。 |
| `uid` | `cc447e8d-eaba-4fde-87af-9636abd5a2cf` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_status_initialized_time Pod 完成初始化的时间
# TYPE kube_pod_status_initialized_time gauge
kube_pod_status_initialized_time{namespace="kube-system",pod="csi-cbs-node-94p56",uid="cc447e8d-eaba-4fde-87af-9636abd5a2cf"} 1700000000
```

### `kube_pod_status_container_ready_time`

`Pod` 中容器进入 `Ready` 状态的时间。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `khaos` | `Kubernetes` 命名空间。 |
| `pod` | `khaos-guardian-btj5m` | `Pod` 名称。 |
| `uid` | `74440dc4-7dc5-441e-96a6-bd7532ff6b31` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_status_container_ready_time Pod 中容器进入 Ready 状态的时间
# TYPE kube_pod_status_container_ready_time gauge
kube_pod_status_container_ready_time{namespace="khaos",pod="khaos-guardian-btj5m",uid="74440dc4-7dc5-441e-96a6-bd7532ff6b31"} 1700000000
```

### `kube_pod_status_reason`

`Pod` 状态原因。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-eni-agent-tsjpl` | `Pod` 名称。 |
| `uid` | `af117e35-f9d6-4b57-99f8-7e0a7ee973f1` | `Kubernetes` 对象 UID。 |
| `reason` | `Evicted` | 状态原因枚举值。 |

```prometheus
# HELP kube_pod_status_reason Pod 状态原因
# TYPE kube_pod_status_reason gauge
kube_pod_status_reason{namespace="kube-system",pod="tke-eni-agent-tsjpl",uid="af117e35-f9d6-4b57-99f8-7e0a7ee973f1",reason="Evicted"} 1
```

### `kube_pod_status_scheduled`

`STABLE`：`Pod` 调度过程的状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `csi-cbs-node-jnfd8` | `Pod` 名称。 |
| `uid` | `08c8666c-18c2-4cd9-a73a-68087fa9f042` | `Kubernetes` 对象 UID。 |
| `condition` | `true` | `Kubernetes` `condition` 的类型或状态枚举。 |

```prometheus
# HELP kube_pod_status_scheduled STABLE：Pod 调度过程的状态
# TYPE kube_pod_status_scheduled gauge
kube_pod_status_scheduled{namespace="kube-system",pod="csi-cbs-node-jnfd8",uid="08c8666c-18c2-4cd9-a73a-68087fa9f042",condition="true"} 1
```

### `kube_pod_status_scheduled_time`

`STABLE`：`Pod` 进入 `Scheduled` 状态的 `Unix` 时间戳。类型为`gauge`，单位/值为：`Unix` 时间戳（秒）。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `kube-proxy-qknsc` | `Pod` 名称。 |
| `uid` | `00dfc48e-6cc7-4578-b827-875131d5a447` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_status_scheduled_time STABLE：Pod 进入 Scheduled 状态的 Unix 时间戳
# TYPE kube_pod_status_scheduled_time gauge
kube_pod_status_scheduled_time{namespace="kube-system",pod="kube-proxy-qknsc",uid="00dfc48e-6cc7-4578-b827-875131d5a447"} 1700000000
```

### `kube_pod_status_unschedulable`

`STABLE`：`Pod` 是否处于不可调度状态。类型为`gauge`，单位/值为：状态值。

| Label | 示例值 | 含义 |
|---|---|---|
| `pod` | `nginx-xxxxx` | `Pod` 名称。 |
| `namespace` | `default` | `Kubernetes` 命名空间。 |
| `uid` | `9f8b...` | `Kubernetes` 对象 UID。 |

```prometheus
# HELP kube_pod_status_unschedulable STABLE：Pod 是否处于不可调度状态
# TYPE kube_pod_status_unschedulable gauge
kube_pod_status_unschedulable{pod="nginx-xxxxx",namespace="default",uid="9f8b..."} 1
```

### `kube_pod_tolerations`

`Pod` 容忍度（`toleration`）信息。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `etcd-192.168.6.16` | `Pod` 名称。 |
| `uid` | `a1f3857d-afa5-4a72-9312-0800dd3875b3` | `Kubernetes` 对象 UID。 |
| `operator` | `Exists` | `toleration` 操作符。 |
| `effect` | `NoExecute` | `taint` 或 `toleration` 的 effect。 |
| `key` | `node.kubernetes.io/not-ready` | `taint` 或 `toleration` 的 key。 |
| `value` | `arm64` | `taint` 或 `toleration` 的 value。 |
| `toleration_seconds` | `300` | tolerationSeconds 值。 |

```prometheus
# HELP kube_pod_tolerations Pod 容忍度（toleration）信息
# TYPE kube_pod_tolerations gauge
kube_pod_tolerations{namespace="kube-system",pod="etcd-192.168.6.16",uid="a1f3857d-afa5-4a72-9312-0800dd3875b3",operator="Exists",effect="NoExecute",key="node.kubernetes.io/not-ready",value="arm64",toleration_seconds="300"} 1
```

### `kube_pod_service_account`

`Pod` 使用的 `ServiceAccount`。类型为`gauge`，单位/值为：常量 `1`。

| Label | 示例值 | 含义 |
|---|---|---|
| `namespace` | `kube-system` | `Kubernetes` 命名空间。 |
| `pod` | `tke-cni-agent-72rdw` | `Pod` 名称。 |
| `uid` | `c26c85ce-a853-4272-9922-4c7042cc5bc4` | `Kubernetes` 对象 UID。 |
| `service_account` | `tke-cni` | `Pod` 使用的 `ServiceAccount`。 |

```prometheus
# HELP kube_pod_service_account Pod 使用的 ServiceAccount
# TYPE kube_pod_service_account gauge
kube_pod_service_account{namespace="kube-system",pod="tke-cni-agent-72rdw",uid="c26c85ce-a853-4272-9922-4c7042cc5bc4",service_account="tke-cni"} 1
```

## 采集与使用注意事项

- `kube-state-metrics` 的标签/注解指标会把 `Kubernetes` 标签/注解的键名清洗为 `Prometheus Label` 名，且需要允许列表（`allowlist`）配置允许后才会输出。
- `kube_pod_container_resource_limits`和`kube_pod_container_resource_requests`在上游说明中建议优先使用 `kube-scheduler` 暴露的`kube_pod_resource_limits`和`kube_pod_resource_requests`，因为 scheduler 指标更精确。

## 资料来源

- [kube-state-metrics 上游仓库](https://github.com/kubernetes/kube-state-metrics)
- [kube-state-metrics Pod 指标文档](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/workload/pod-metrics.md)
- [kube-state-metrics Node 指标文档](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/cluster/node-metrics.md)
- [kube-state-metrics PV 指标文档](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/storage/persistentvolume-metrics.md)
- [kube-state-metrics PVC 指标文档](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/storage/persistentvolumeclaim-metrics.md)

