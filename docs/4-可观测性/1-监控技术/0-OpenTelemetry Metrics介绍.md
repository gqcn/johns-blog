---
slug: "/opentelemetry-metrics-introduction"
title: "OpenTelemetry Metrics介绍"
hide_title: true
keywords:
  ["OpenTelemetry", "Metrics", "可观测性", "监控", "指标收集", "分布式追踪"]
description: "详细介绍 OpenTelemetry Metrics 的核心概念、实现原理和最佳实践，帮助开发者更好地理解和使用 OpenTelemetry 进行应用监控"
---

`OpenTelemetry Metrics` 是一个关于如何收集、聚合和发送指标到 `OpenTelemetry APM` 工具(如 `Uptrace` 或 `Prometheus` )的标准。

## `Instruments`

`Instrument` 是一种特定类型的指标(例如，`counter, gauge, histogram`)，用于收集关于应用程序行为的特定方面的数据。

您通过创建具有以下功能的 `instrument` 来捕获测量结果:

*   **指标名称**，例如 `http.server.duration`。
*   **指标类型**，例如 `Histogram`。
*   **指标单位**，例如 `milliseconds` 或 `bytes`。
*   **指标描述**，可选。

## `Timeseries`(时间序列)

一个 `instrument` 可以生成多个时间序列。时间序列是一个具有唯一属性集的指标，例如，对于相同的指标名称，每个主机都有一个单独的时间序列。

## `Synchronous`(同步)

`Synchronous instruments` 与它们正在测量的操作一起被调用。例如，为了测量请求的数量，只要有新的请求，就可以调用 `counter.Add(ctx, 1)`。同步测量可以具有关联的 `trace context`。

| Instrument | Properties | Aggregation | Example |
| --- | --- | --- | --- |
| `Counter` | 可递增 | sum -> delta | 请求数，请求大小 |
| `UpDownCounter` | 可增减 | last value -> sum | 连接数 |
| `Histogram` | 可分组的 | histogram | 请求持续时间、请求大小 |

## `Asynchronous`(异步)

`Asynchronous instruments` 定期调用回调函数来收集测量值。例如，可以使用观察器定期测量内存或 `CPU` 的使用情况。`Asynchronous` 测量不能具有关联的 `trace context`。

| Instrument Name | Properties | Aggregation | Example |
| --- | --- | --- | --- |
| `CounterObserver` | 可递增 | sum -> delta | CPU time |
| `UpDownCounterObserver` | 可增减 | last value -> sum | Memory usage (bytes) |
| `GaugeObserver` | 可分组的 | last value -> none/avg | Memory utilization (%) |

## 使用示例

![](/attachments/v2-475e053e38d458862db5e8a18143d3e5_1440w.png)

![](/attachments/v2-ff998bb5d4c779996d922dfe1f67b2e6_1440w.png)

## 参考链接

*   [https://opentelemetry.io/docs/specs/otel/metrics/data-model/](https://opentelemetry.io/docs/specs/otel/metrics/data-model/)
*   [https://github.com/open-telemetry/opentelemetry-go/tree/main/metric](https://github.com/open-telemetry/opentelemetry-go/tree/main/metric)

  

  

  

  

  

  

