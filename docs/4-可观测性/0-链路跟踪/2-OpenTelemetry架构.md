---
slug: "/observability/opentelemetry-architecture"
title: "OpenTelemetry架构"
hide_title: true
keywords:
  ["OpenTelemetry", "架构设计", "组件结构", "数据流", "可观察性", "系统集成"]
description: "详细解析 OpenTelemetry 的架构设计、核心组件和数据流向，帮助理解其如何实现分布式系统的全方位监控"
---



![](/attachments/8fbc65f937aaac8c9b6947faa89a6964.png)

OpenTelemetry架构

由于OpenTelemetry旨在成为一个为厂商和可观察性后端提供的跨语言框架，因此它非常灵活且可扩展，但同时也很复杂。OpenTelemetry的默认实现中，其架构可以分为如下三部分：

1.  OpenTelemetry API
2.  OpenTelemetry SDK，包括
    *   Tracer pipeline
    *   Meter pipeline
    *   Shared Context layer
3.  Collector

## OpenTelemetry API

应用开发者会使用Open Telemetry API对其代码进行插桩，库作者会用它(在库中)直接编写桩功能。API不处理操作问题，也不关心如何将数据发送到厂商后端。

API分为四个部分：

1.  A Tracer API
2.  A Metrics API
3.  A Context API
4.  语义规范

![](/attachments/8e12b523e73fe3bbf64bd124447914a2.png)

#### Tracer API

Tracer API 支持生成spans，可以给span分配一个traceId，也可以选择性地加上时间戳。一个Tracer会给spans打上名称和版本。当查看数据时，名称和版本会与一个Tracer关联，通过这种方式可以追踪生成sapan的插装库。

#### Metric API

[Metric API](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/metrics/api.md)提供了多种类型的Metric instruments(桩功能)，如Counters 和Observers。Counters 允许对度量进行计算，Observers允许获取离散时间点上的测量值。例如，可以使用Observers观察不在Span上下文中出现的数值，如当前CPU负载或磁盘上空闲的字节数。

#### Context API

[Context API](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/context/context.md) 会在使用相同"context"的spans和traces中添加上下文信息，如[W3C Trace Context](https://www.w3.org/TR/trace-context/), [Zipkin B3首部](https://github.com/openzipkin/b3-propagation), 或 [New Relic distributed tracing](https://docs.newrelic.com/docs/understand-dependencies/distributed-tracing/get-started/introduction-distributed-tracing) 首部。此外该API允许跟踪spans是如何在一个系统中传递的。当一个trace从一个处理传递到下一个处理时会更新上下文信息。Metric instruments可以访问当前上下文。

#### 语义规范

OpenTelemetry API包含一组 [语义规范](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/overview.md#semantic-conventions.md)，该规范包含了命名spans、属性以及与spans相关的错误。通过将该规范编码到API接口规范中，OpenTelemetry 项目保证所有的instrumentation(不论任何语言)都包含相同的语义信息。对于希望为所有用户提供一致的APM体验的厂商来说，该功能非常有价值。

## OpenTelemetry SDK

OpenTelemetry SDK是OpenTelemetry API的实现。该SDK包含三个部分，与上面的API类似：Tracer, 一个Meter, 和一个Shared Context layer。

![](/attachments/818425378eacd931058c1f478dba1eaa.png)

理想情况下，SDK应该满足99%的标准使用场景，但如果有必要，可以自定义SDK。例如，可以在Tracer pipeline实现中自定义除核心实现(如何与共享上下文层交互)外的其他任何内容，如Tracer pipeline使用的采样算法。

#### Tracer pipeline

![](/attachments/81f6a02f7a8c33537a3ab66d261f5a94.png)

当配置 [SDK](https://github.com/open-telemetry/opentelemetry-specification/blob/master/specification/trace/sdk.md) 时，需要将一个或多个`SpanProcessors`与Tracer pipeline的实现进行关联。`SpanProcessors`会查看spans的生命周期，然后在合适的时机将spans传送到一个`SpanExporter`。SDK中内置了一个简单的SpanProcessor，可以将完成的spans直接转发给exporter 。

SDK还包含一个批处理实现，按照可配置的间隔分批次转发已完成的spans。但由于`SpanProcessor`的实现可以接受插件，因此可以在完成自己的实现后赋予其自定义的行为。例如，如果遥测后端支持观测"正在进行的"spans，那么可以创建一个SpanProcessor实现，将所有span状态变更涉及的spans转发出去。

Tracer pipeline的最后是`SpanExporter`。一个exporter的工作很简单：将OpenTelemetry 的spans转换为telemetry后端要求的表达格式，然后转发给该后端即可。提供定制化的SpanExporter是telemetry厂商接入OpenTelemetry生态系统的最简单方式。

#### Meter pipeline

![](/attachments/59024b803d337f4235e1d61762999c7e.png)

#### Meter pipeline

Meter pipeline要远比Tracer pipeline复杂，而metrics也远比span复杂。下面的描述基于java SDK实现，可能跨语言会有所不同。

Meter pipeline会创建和维护多种类型的metric工具，包括Counters 和Observers。每个工具的实例都需要以某种方式聚合。默认情况下，Counters通过累加数值进行聚合，而Observers通过采集记录到的最后一个数值进行聚合。所有的工具默认都有一个聚合。

(在本文编写之际，metric工具的自定义聚合配置仍然在起草阶段)。

不同语言的Meter pipeline的实现会有所不同，但所有场景下，metric的聚合结果都会被传递到`MetricExporter`。与spans类似，供应商可以提供自己的exporter，将由metric aggregators生成的聚合数据转换为遥测后端所需的类型。

OpenTelemetry支持两种类型的exporter：基于exporters的"push"，即exporter按照时间间隔将数据发送到后端；基于exporters的"pull"，即后端按照需要请求数据。New Relic 是一个基于push的后端，而Prometheus是一个基于push的后端。

#### Shared Context layer

Shared Context layer位于Tracer和Meter pipeline之间，允许在一个执行的span的上下文中记录所有非observer的metric。可以使用propagators自定义Context，在系统内外传递span上下文。OpenTelemetry SDK提供了一个基于W3C Trace Context规范的实现，但也可以根据需要来包含 Zipkin B3 propagation等。

## Collector

![](/attachments/caddd853eb0ab7b314ac8d45c1039dbc.png)

OpenTelemetry Collector提供了一种厂商中立的实现，无缝地接收，处理和导出遥测数据。此外，它移除了为支持发送到多个开源或商业后端而使用的开源可观察性数据格式(如Jaeger，Prometheus等)的运行，操作和维护。

OpenTelemetry collector可以扩展或嵌入其他应用中。下面应用扩展了collector：

*   [opentelemetry-collector-contrib](https://github.com/open-telemetry/opentelemetry-collector-contrib)
*   [jaeger](https://github.com/jaegertracing/jaeger/tree/master/cmd/opentelemetry)

如果要创建自己的collector发行版，可以参见这篇Blog： [Building your own OpenTelemetry Collector distribution](https://medium.com/p/42337e994b63)。

如果要构建自己的发行版，可以使用[OpenTelemetry Collector Builder](https://github.com/observatorium/opentelemetry-collector-builder) 。

## 参考资料

*   [https://opentracing.io](https://opentracing.io)
*   [https://opencensus.io](https://opencensus.io/)
*   [https://opentelemetry.io](https://opentelemetry.io/)
*   [https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification](https://github.com/open-telemetry/opentelemetry-specification/tree/main/specification)
*   [https://blog.newrelic.com/product-news/what-is-opentelemetry/](https://blog.newrelic.com/product-news/what-is-opentelemetry/)
*   [https://www.mmbyte.com/article/124104.html](https://www.mmbyte.com/article/124104.html)


  

