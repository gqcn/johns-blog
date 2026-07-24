---
slug: "/observability/volcano-job-metrics"
title: "Volcano Job：作业调度指标与 ACS 封装说明"
hide_title: true
keywords:
  ["Volcano", "Volcano Job", "VCJob", "Prometheus", "Kubernetes", "调度器指标", "控制器指标", "作业指标", "Gang Scheduling", "DRF", "Queue", "PodGroup", "Histogram", "Gauge", "Counter", "acs", "资源请求", "作业状态", "可观测性"]
description: "本文基于 Volcano 和 acs 项目源码，系统梳理 Volcano Job 在调度器、控制器和 acs 业务层暴露或封装的指标，包括作业调度耗时、调度起止时间、未调度任务数、作业重试次数、完成和失败计数、作业公平性份额、Pod 创建延迟以及 acs 任务列表中的状态、资源请求和业务归属字段，并说明每个指标的 Label、触发路径和使用注意事项。"
---

## 基本简介

`Volcano Job`是`Volcano`提供的批处理作业自定义资源，资源类型为`batch.volcano.sh/v1alpha1`下的`Job`，常用简称为`vcjob`或`vj`。

## 监控指标

### 调度器作业指标

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `volcano_e2e_job_scheduling_latency_milliseconds` | `histogram` | 毫秒 | 调度器侧`JobInfo`创建时间到最近一次成功`Allocate`或`Pipeline`任务的耗时分布。当前`JobInfo`创建时间来自`PodGroup`创建时间。 |
| `volcano_e2e_job_scheduling_duration` | `gauge` | 毫秒 | 每个作业当前保留的调度耗时，按作业、队列和命名空间区分。调度器每成功`Allocate`或`Pipeline`任务时刷新，起点为`PodGroup`创建时间。 |
| `volcano_e2e_job_scheduling_start_time` | `gauge` | <span style={{whiteSpace: 'nowrap'}}>`Unix`时间戳（秒）</span> | 调度器缓存看到`PodGroup`时写入的`PodGroup`创建时间。 |
| `volcano_e2e_job_scheduling_last_time` | `gauge` | `Unix`时间戳（秒） | 调度器最近一次为该作业成功`Allocate`或`Pipeline`任务的时间。 |
| `volcano_unschedule_task_count` | `gauge` | 数量 | `Gang`插件判定作业不可调度时，该作业距离`minAvailable`还缺少的任务数量。 |
| `volcano_unschedule_job_count` | `gauge` | 数量 | 当前调度会话中被`Gang`插件判定为不可调度的非终止作业数量。 |
| `volcano_job_retry_counts` | `counter` | 累计计数 | `Gang`插件每次判定非终止作业不可调度时递增，可用于观察作业被反复调度尝试但未满足`Gang`约束的次数。 |
| `volcano_job_share` | `gauge` | 份额值 | `DRF`插件计算的作业资源份额。只有启用并执行`DRF`相关逻辑时才有业务意义。 |

### 控制器作业指标

| 指标名称 | 类型 | 单位/值 | 说明 |
|---|---|---|---|
| `volcano_controller_job_to_pod_creation_latency_milliseconds` | `histogram` | 毫秒 | `vc-controller-manager`成功创建单个`Pod`时，记录该`Pod`创建时间与所属`Job`创建时间之间的延迟。一个`Job`通常会产生多次观测。 |
| `volcano_job_completed_phase_count` | `counter` | <span style={{whiteSpace: 'nowrap'}}>累计计数</span> | `Job`状态机将作业推进到`Completed`阶段时递增。 |
| `volcano_job_failed_phase_count` | `counter` | 累计计数 | `Job`状态机将作业推进到`Failed`阶段时递增，例如未满足`minAvailable`、`minSuccess`或重试达到`maxRetry`。 |

## 指标详情

本节逐项说明`Prometheus`指标含义、`Label`和文本格式示例。示例用于展示暴露格式，实际`HELP`文案、采集任务标签和值以运行环境输出为准。直方图指标会产生`_bucket`、`_sum`和`_count`序列，`le`只出现在`_bucket`序列。

### `volcano_e2e_job_scheduling_latency_milliseconds`

作业端到端调度耗时直方图。调度器每次成功为作业中的任务执行`Allocate`或`Pipeline`时，使用当前耗时写入该直方图；`backfill`成功分配任务时也会写入。当前源码中的耗时起点是调度器`JobInfo.CreationTimestamp`，该字段由`PodGroup`创建时间赋值。类型为`histogram`，单位为毫秒。

该指标没有作业维度`Label`，适合观察集群整体作业调度延迟分布，例如计算`p95`或`p99`。如果需要按作业、队列或命名空间分析，请结合`volcano_e2e_job_scheduling_duration`。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `100` | 直方图桶上界，只出现在`_bucket`序列。 |

```prometheus
# HELP volcano_e2e_job_scheduling_latency_milliseconds Volcano Job 端到端调度耗时分布，单位为毫秒
# TYPE volcano_e2e_job_scheduling_latency_milliseconds histogram
volcano_e2e_job_scheduling_latency_milliseconds_bucket{le="100"} 12
volcano_e2e_job_scheduling_latency_milliseconds_bucket{le="+Inf"} 20
volcano_e2e_job_scheduling_latency_milliseconds_sum 18500
volcano_e2e_job_scheduling_latency_milliseconds_count 20
```

### `volcano_e2e_job_scheduling_duration`

每个作业当前保留的调度耗时。源码中每次成功`Allocate`或`Pipeline`任务时都会刷新该`Gauge`，值为当前时间距离调度器`JobInfo.CreationTimestamp`的毫秒数；该时间戳当前来自`PodGroup`创建时间。作业删除时会清理对应`Label`值。类型为`gauge`，单位为毫秒。

该指标不是累计量，不建议使用`increase()`计算耗时增长。更常见的做法是直接按`job_name`、`queue`、`job_namespace`查看当前值，或在较短窗口内使用`max_over_time()`保留峰值。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_name` | `resnet-train` | `Volcano Job`资源名称，来自调度器内存中的`JobInfo.Name`。 |
| `queue` | `default` | 作业所属队列，来自`spec.queue`或默认队列。 |
| `job_namespace` | `default` | 作业所在命名空间。 |

```prometheus
# HELP volcano_e2e_job_scheduling_duration Volcano Job 当前保留的调度耗时，单位为毫秒
# TYPE volcano_e2e_job_scheduling_duration gauge
volcano_e2e_job_scheduling_duration{job_name="resnet-train",queue="default",job_namespace="default"} 3250
```

### `volcano_e2e_job_scheduling_start_time`

调度器缓存处理`PodGroup`时写入的起点时间。源码写入的是`JobInfo.CreationTimestamp.Time`转换后的`Unix`秒级时间戳，而`JobInfo.CreationTimestamp`由`PodGroup`创建时间赋值。因此它更准确地表示调度器侧作业对象的创建时间起点，而不是调度动作实际开始执行的时间。类型为`gauge`，单位为`Unix`时间戳秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_name` | `resnet-train` | `Volcano Job`资源名称。 |
| `queue` | `default` | 作业所属队列。 |
| `job_namespace` | `default` | 作业所在命名空间。 |

```prometheus
# HELP volcano_e2e_job_scheduling_start_time Volcano 调度器 JobInfo 创建时间戳
# TYPE volcano_e2e_job_scheduling_start_time gauge
volcano_e2e_job_scheduling_start_time{job_name="resnet-train",queue="default",job_namespace="default"} 1710000000
```

### `volcano_e2e_job_scheduling_last_time`

调度器最近一次成功为作业执行`Allocate`或`Pipeline`任务的时间。`allocate`和`backfill`路径都会在成功后写入当前时间。类型为`gauge`，单位为`Unix`时间戳秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_name` | `resnet-train` | `Volcano Job`资源名称。 |
| `queue` | `default` | 作业所属队列。 |
| `job_namespace` | `default` | 作业所在命名空间。 |

```prometheus
# HELP volcano_e2e_job_scheduling_last_time Volcano Job 最近一次成功调度任务的时间戳
# TYPE volcano_e2e_job_scheduling_last_time gauge
volcano_e2e_job_scheduling_last_time{job_name="resnet-train",queue="default",job_namespace="default"} 1710000004
```

### `volcano_unschedule_task_count`

`Gang`插件判定作业不可调度时写入该作业缺少的可调度任务数。源码计算逻辑是`job.MinAvailable - schedulableTaskNum()`，其中`schedulableTaskNum()`包含已处于已分配状态的任务和已就绪任务。类型为`gauge`，单位为任务数量。

需要注意，虽然`Label`名为`job_id`，当前源码传入的是`job.Name`，没有包含命名空间；如果多个命名空间中存在同名作业，查询时应结合采集实例或其他上下文判断。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_id` | `resnet-train` | 当前源码中为`Volcano Job`资源名称。 |

```prometheus
# HELP volcano_unschedule_task_count Volcano Job 未满足 Gang 约束的任务缺口数
# TYPE volcano_unschedule_task_count gauge
volcano_unschedule_task_count{job_id="resnet-train"} 2
```

### `volcano_unschedule_job_count`

当前调度会话中被`Gang`插件判定为不可调度的非终止作业数量。类型为`gauge`，单位为作业数量。

该指标没有`Job`维度，用于观察整体不可调度压力。如果需要定位具体作业，需要结合`volcano_unschedule_task_count`、`PodGroup`条件和`Job`事件。

```prometheus
# HELP volcano_unschedule_job_count 当前调度会话中不可调度的 Volcano Job 数量
# TYPE volcano_unschedule_job_count gauge
volcano_unschedule_job_count 5
```

### `volcano_job_retry_counts`

`Gang`插件每次判定非终止作业不可调度时递增。它反映的是调度侧反复尝试但作业尚未满足`Gang`约束的次数，不等同于`JobStatus.RetryCount`，后者是`Volcano Job`状态里的作业重启次数。类型为`counter`，单位为累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_id` | `resnet-train` | 当前源码中为`Volcano Job`资源名称。 |

```prometheus
# HELP volcano_job_retry_counts Volcano Job 被 Gang 插件判定不可调度的累计次数
# TYPE volcano_job_retry_counts counter
volcano_job_retry_counts{job_id="resnet-train"} 8
```

### `volcano_job_share`

`DRF`插件计算的作业资源份额。源码在`DRF`初始化作业属性、任务分配和任务释放时刷新该指标。类型为`gauge`，值为份额数值。

该指标依赖`DRF`插件逻辑；如果调度配置没有启用相关插件，或某个作业没有经过`DRF`路径，该指标可能不存在或不具备分析意义。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_ns` | `default` | 作业所在命名空间。 |
| `job_id` | `resnet-train` | 作业名称。 |

```prometheus
# HELP volcano_job_share DRF 插件计算的 Volcano Job 资源份额
# TYPE volcano_job_share gauge
volcano_job_share{job_ns="default",job_id="resnet-train"} 0.125
```

### `volcano_controller_job_to_pod_creation_latency_milliseconds`

`vc-controller-manager`成功创建`Pod`后，记录`Pod`创建时间减去`Job`创建时间的延迟。一个包含多个副本或多个任务的`Job`会产生多次观测，因此它更适合衡量控制器从作业到`Pod`对象创建的整体延迟分布，而不是单个作业最终完成时间。类型为`histogram`，单位为毫秒。

| Label | 示例值 | 含义 |
|---|---|---|
| `le` | `50` | 直方图桶上界，只出现在`_bucket`序列。 |

```prometheus
# HELP volcano_controller_job_to_pod_creation_latency_milliseconds Volcano Job 创建到 Pod 创建的控制器延迟，单位为毫秒
# TYPE volcano_controller_job_to_pod_creation_latency_milliseconds histogram
volcano_controller_job_to_pod_creation_latency_milliseconds_bucket{le="50"} 4
volcano_controller_job_to_pod_creation_latency_milliseconds_bucket{le="+Inf"} 10
volcano_controller_job_to_pod_creation_latency_milliseconds_sum 7200
volcano_controller_job_to_pod_creation_latency_milliseconds_count 10
```

### `volcano_job_completed_phase_count`

`Job`状态机将作业推进到`Completed`阶段时递增。源码中的写入点包括`running`状态满足`minSuccess`或`minAvailable`完成条件，以及`completing`状态清理完成后进入`Completed`。类型为`counter`，单位为累计计数。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_name` | `default/resnet-train` | 源码传入`namespace/name`格式，而不是单独的作业名。 |
| `queue_name` | `default` | 作业所属队列。 |

```prometheus
# HELP volcano_job_completed_phase_count Volcano Job 进入 Completed 阶段的累计次数
# TYPE volcano_job_completed_phase_count counter
volcano_job_completed_phase_count{job_name="default/resnet-train",queue_name="default"} 1
```

### `volcano_job_failed_phase_count`

`Job`状态机将作业推进到`Failed`阶段时递增。源码中的写入点覆盖了作业执行结束但未满足任务级`minAvailable`、未满足`minSuccess`、成功数小于作业`minAvailable`，以及`Restarting`状态下`RetryCount`达到`MaxRetry`等情况。类型为`counter`，单位为累计计数。

该指标只统计进入`Failed`阶段的情况；`Aborted`、`Terminated`等其它终止阶段不在该计数器的已确认写入路径中。

| Label | 示例值 | 含义 |
|---|---|---|
| `job_name` | `default/resnet-train` | 源码传入`namespace/name`格式。 |
| `queue_name` | `default` | 作业所属队列。 |

```prometheus
# HELP volcano_job_failed_phase_count Volcano Job 进入 Failed 阶段的累计次数
# TYPE volcano_job_failed_phase_count counter
volcano_job_failed_phase_count{job_name="default/resnet-train",queue_name="default"} 1
```


## 常用查询

### 作业调度延迟分位数

计算过去 `5` 分钟内，集群整体作业调度延迟的 `p95` 百分位数（毫秒）。该指标无作业维度，适合评估整体调度性能基线或触发告警阈值。

```promql
histogram_quantile(
  0.95,
  sum(rate(volcano_e2e_job_scheduling_latency_milliseconds_bucket[5m])) by (le)
)
```

### 按队列查看作业调度耗时

按队列维度汇总各作业当前保留的调度耗时均值（毫秒）。可用于对比不同队列的调度效率，快速定位高延迟队列。

```promql
avg by (queue) (
  volcano_e2e_job_scheduling_duration
)
```

### 查看未满足 Gang 约束的作业

列出当前缺口任务数最多的前 `20` 个作业，值大于 `0` 表示该作业因 `Gang` 约束尚未满足而处于不可调度状态。可结合 `PodGroup` 事件和节点资源情况排查阻塞原因。

```promql
topk(20, volcano_unschedule_task_count > 0)
```

### 查看近期失败作业计数

统计过去 `1` 小时内各作业进入 `Failed` 阶段的次数。值大于 `0` 表示对应作业在该时间窗口内出现过失败，可用于告警或故障复盘。

```promql
increase(volcano_job_failed_phase_count[1h])
```

### 控制器创建 Pod 延迟分位数

计算过去 `5` 分钟内，`vc-controller-manager` 从 `Job` 创建到成功创建 `Pod` 的延迟 `p99` 百分位数（毫秒）。可用于评估控制器侧 `Pod` 拉起速度，识别大批量作业场景下的创建瓶颈。

```promql
histogram_quantile(
  0.99,
  sum(rate(volcano_controller_job_to_pod_creation_latency_milliseconds_bucket[5m])) by (le)
)
```

