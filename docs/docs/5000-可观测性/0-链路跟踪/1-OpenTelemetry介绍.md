---
slug: "/observability/opentelemetry-introduction"
title: "OpenTelemetry介绍"
hide_title: true
keywords:
  [
    "OpenTelemetry",
    "OpenTracing",
    "Metrics",
    "可观察性",
    "链路追踪",
    "指标收集",
  ]
description: "介绍 OpenTelemetry 项目的背景、发展历程和核心特性，探讨其如何统一链路追踪和指标收集的标准"
---




在分布式的系统架构中，Tracing链路跟踪和Metrcis指标搜集是不可或缺的两大技术，而这一次，两大技术终于迎来了大统一的行业标准。

## 项目背景

#### OpenTracing

OpenTracing制定了一套平台无关、厂商无关的Trace协议，使得开发人员能够方便的添加或更换分布式追踪系统的实现。在2016年11月的时候CNCF技术委员会投票接受OpenTracing作为Hosted项目，这是CNCF的第三个项目，第一个是Kubernetes，第二个是Prometheus，可见CNCF对OpenTracing背后可观察性的重视。比如大名鼎鼎的Zipkin、Jaeger都遵循OpenTracing协议。

#### OpenCensus

大家可能会想，既然有了OpenTracing，OpenCensus又来凑什么热闹？对不起，你要知道OpenCensus的发起者可是谷歌，也就是最早提出Tracing概念的公司，而OpenCensus也就是Google Dapper的社区版。OpenCensus和OpenTracing最大的不同在于除了Tracing外，它还把Metrics也包括进来，这样也可以在OpenCensus上做基础的指标监控；还一点不同是OpenCensus并不是单纯的规范制定，他还把包括数据采集的Agent、Collector一股脑都搞了。OpenCensus也有众多的追随者，最近最大的新闻就是微软也宣布加入，OpenCensus可谓是如虎添翼。

#### OpenTracing vs OpenCensus

两套Tracing框架，都有很多追随者，都想统一对方，咋办？首先来PK啊，这里偷个懒，直接上Steve的图：  
![](/attachments/1563762974088-2291ef83-8fa4-4ac8-9666-6e2bdc67c5aa.png)

  
可以看到，OpenTracing和OpenCensus从功能和特性上来看，各有优缺点，半斤八两。OpenTracing支持的语言更多、相对对其他系统的耦合性要更低；OpenCensus支持Metrics、从API到基础框架都实现了个便。既然从功能和特性上分不出高下，那就从知名度和用户数上来PK吧：  
![](/attachments/1563762974088-2291ef83-8fa4-4ac8-9666-6e2bdc67c5aa.png)

  
好吧，又是半斤八两，OpenTracing有很多厂商追随（比如ElasticSearch、Uber、DataDog、还有国产的SkyWalking），OpenCensus背后Google和微软两个大佬就够撑起半边天了。  
最终一场PK下来，没有胜负，怎么办？

## OpenTelemetry

#### 横空出世

所谓天下合久必分、分久必合，既然没办法分个高低，谁都有优劣势，咱们就别干了，统一吧。于是OpenTelemetry横空出世。那么问题来了：统一可以，起一个新的项目从头搞吗？那之前追随我的弟兄们怎么办？不能丢了我的兄弟们啊。放心，这种事情肯定不会发生的。要知道OpenTelemetry的发起者都是OpenTracing和OpenCensus的人，所以项目的第一宗旨就是：兼容OpenTracing和OpenCensus。对于使用OpenTracing或OpenCensus的应用不需要重新改动就可以接入OpenTelemetry。

通过将OpenTracing 和OpenCensus 合并为一个开放的标准，OpenTelemetry提供了如下便利：

*   **选择简单**：不必在两个标准之间进行选择，OpenTelemetry可以同时兼容 OpenTracing和OpenCensus。
*   **跨平台性**：OpenTelemetry 支持各种语言和后端。它代表了一种厂商中立的方式，可以在不改变现有工具的情况下捕获并将遥测数据传输到后端。
*   **简化可观测性**：正如OpenTelemetry所说的"高质量的观测下要求高质量的遥测"。希望看到更多的厂商转向OpenTelemetry，因为它更方便，且仅需测试单一标准。

#### 核心工作

OpenTelemetry可谓是一出生就带着无比炫目的光环：OpenTracing支持、OpenCensus支持、直接进入CNCF sanbox项目。但OpenTelemetry也不是为了解决可观察性上的所有问题，他的核心工作主要集中在3个部分：

1.  规范的制定，包括概念、协议、API，除了自身的协议外，还需要把这些规范和W3C、GRPC这些协议达成一致；
2.  相关SDK、Tool的实现和集成，包括各类语言的SDK、代码自动注入、其他三方库（Log4j、LogBack等）的集成；
3.  采集系统的实现，目前还是采用OpenCensus的采集架构，包括Agent和Collector。

可以看到OpenTelemetry只是做了数据规范、SDK、采集的事情，对于Backend、Visual、Alert等并不涉及，官方目前推荐的是用Prometheus去做Metrics的Backend、用Jaeger去做Tracing的Backend。  
![](/attachments/1563762974104-af119ce7-d6d1-4135-8dc2-07c8cb199ba8.png)

看了上面的图大家可能会有疑问：Metrics、Tracing都有了，那Logging为什么也不加到里面呢？  
其实Logging之所以没有进去，主要有两个原因：

1.  工作组目前主要的工作是在把OpenTracing和OpenCensus的概念尽早统一并开发相应的SDK，Logging是P2的优先级。
2.  他们还没有想好Logging该怎么集成到规范中，因为这里还需要和CNCF里面的Fluentd一起去做，大家都还没有想好。

#### 终极目标

OpenTelemetry的终态就是实现Metrics、Tracing、Logging的融合，作为CNCF可观察性的终极解决方案。

Tracing：提供了一个请求从接收到处理完毕整个生命周期的跟踪路径，通常请求都是在分布式的系统中处理，所以也叫做分布式链路追踪。  
Metrics：提供量化的系统内/外部各个维度的指标，一般包括Counter、Gauge、Histogram等。  
Logging：提供系统/进程最精细化的信息，例如某个关键变量、事件、访问记录等。

这三者在可观察性上缺一不可：基于Metrics的告警发现异常，通过Tracing定位问题（可疑）模块，根据模块具体的日志详情定位到错误根源，最后再基于这次问题调查经验调整Metrics（增加或者调整报警阈值等）以便下次可以更早发现/预防此类问题。

#### 如何使用

OpenTelemetry APIs 和SDKs有很多快速使用指南和[文档](https://opentelemetry.io/docs/)帮助快速入门。

将OpenTelemetry trace APIs插装到应用程序后，就可以使用预先编译好的[OpenTelemetry库中的exporters ](https://opentelemetry.io/registry/) 将trace数据发送到观测平台，如New Relic或其他后端。

  

## 参考资料

*   [https://opentracing.io](https://opentracing.io)
*   [https://opencensus.io](https://opencensus.io/)
*   [https://opentelemetry.io](https://opentelemetry.io/)
*   [https://developer.aliyun.com/article/710154](https://developer.aliyun.com/article/710154)

  


  