---
slug: "/opentracing-introduction"
title: "OpenTracing介绍"
hide_title: true
keywords:
  ["OpenTracing", "链路追踪", "Jaeger", "Span", "分布式追踪", "链路监控"]
description: "详细介绍 OpenTracing 分布式链路追踪规范，包括核心概念、数据模型和实践示例，并使用 Jaeger 进行演示"
---




在微服务架构的系统中，请求在各服务之间流转，调用链错综复杂，一旦出现了问题和异常，很难追查定位，这个时候就需要链路追踪来帮忙了。链路追踪系统能追踪并记录请求在系统中的调用顺序，调用时间等一系列关键信息，从而帮助我们定位异常服务和发现性能瓶颈。

# Opentracing

![](/attachments/a78b058374144b879a8ab05b91ea1bcf.png)

`Opentracing`是分布式链路追踪的一种规范标准，是`CNCF`（云原生计算基金会）下的项目之一。和一般的规范标准不同，`Opentracing`不是传输协议，消息格式层面上的规范标准，而是一种语言层面上的API标准。以`Go`语言为例，只要某链路追踪系统实现了`Opentracing`规定的接口（`interface`），符合`Opentracing`定义的表现行为，那么就可以说该应用符合`Opentracing`标准。这意味着开发者只需修改少量的配置代码，就可以在符合`Opentracing`标准的链路追踪系统之间自由切换：[https://github.com/opentracing/opentracing-go](https://github.com/opentracing/opentracing-go)

在使用`Opentracing`来实现全链路追踪前，有必要先了解一下它所定义的数据模型。

## Trace

`Trace`表示一次完整的追踪链路，`trace`由一个或多个`span`组成。下图示例表示了一个由`8`个`span`组成的`trace`:

```
        [Span A]  ←←←(the root span)
            |
     +------+------+
     |             |
 [Span B]      [Span C] ←←←(Span C is a `ChildOf` Span A)
     |             |
 [Span D]      +---+-------+
               |           |
           [Span E]    [Span F] >>> [Span G] >>> [Span H]
                                       ↑
                                       ↑
                                       ↑
                         (Span G `FollowsFrom` Span F)
```

时间轴的展现方式会更容易理解：

```
––|–––––––|–––––––|–––––––|–––––––|–––––––|–––––––|–––––––|–> time

 [Span A···················································]
   [Span B··············································]
      [Span D··········································]
    [Span C········································]
         [Span E·······]        [Span F··] [Span G··] [Span H··]
```

示例来源：[https://github.com/opentracing/specification/blob/master/specification.md#the-opentracing-data-model](https://github.com/opentracing/specification/blob/master/specification.md#the-opentracing-data-model)

## Span

`Span`是一条追踪链路中的基本组成要素，一个`span`表示一个独立的工作单元，比如可以表示一次函数调用，一次`http`请求等等。`span`会记录如下基本要素:

*   服务名称（`operation name`）
*   服务的开始时间和结束时间
*   `K/V`形式的`Tags`
*   `K/V`形式的`Logs`
*   `SpanContext`
*   `References`：该`span`对一个或多个`span`的引用（通过引用`SpanContext`）。

### Tags

`Tags`以`K/V`键值对的形式保存用户自定义标签，主要用于链路追踪结果的查询过滤。例如： `http.method="GET",http.status_code=200`。其中`key`值必须为字符串，`value`必须是字符串，布尔型或者数值型。 `span`中的`tag`仅自己可见，不会随着 `SpanContext`传递给后续`span`。 例如：

```
span.SetTag("http.method","GET")
span.SetTag("http.status_code", 200)
```

### Logs

`Logs`与`tags`类似，也是`K/V`键值对形式。与`tags`不同的是，`logs`还会记录写入`logs`的时间，因此`logs`主要用于记录某些事件发生的时间。`logs`的`key`值同样必须为字符串，但对`value`类型则没有限制。例如：

```
span.LogFields( 
    log.String("event", "soft error"), 
    log.String("type", "cache timeout"), 
    log.Int("waited.millis", 1500), 
)
```

> [!INFO]
> `Opentracing`列举了一些惯用的`Tags`和`Logs`：[https://github.com/opentracing/specification/blob/master/semantic\_conventions.md](https://github.com/opentracing/specification/blob/master/semantic_conventions.md)

### SpanContext

`SpanContext`携带着一些用于**跨服务通信的（跨进程）**数据，主要包含：

*   足够在系统中标识该`span`的信息，比如：`span_id, trace_id`。
*   `Baggage Items`，为整条追踪连保存跨服务（跨进程）的`K/V`格式的用户自定义数据。`Baggage Items`与`tags`类似，也是`K/V`键值对。与`tags`不同的是：

*   *   其`key`跟`value`都只能是字符串格式
    *   `Baggage items`不仅当前`span`可见，其会随着`SpanContext`传递给后续所有的子`span`。要小心谨慎的使用`baggage items` - 因为在所有的`span`中传递这些`K,V`会带来不小的网络和`CPU`开销。

## References

`Opentracing`定义了两种引用关系:`ChildOf`和`FollowFrom`。

*   `ChildOf`: 父`span`的执行依赖子`span`的执行结果时，此时子`span`对父`span`的引用关系是`ChildOf`。比如对于一次`RPC`调用，服务端的`span`（子`span`）与客户端调用的`span`（父`span`）是`ChildOf`关系。
*   `FollowFrom`：父`span`的执不依赖子`span`执行结果时，此时子`span`对父`span`的引用关系是`FollowFrom`。`FollowFrom`常用于异步调用的表示，例如消息队列中`consumer span`与`producer span`之间的关系。

# 使用示例

对`Opentracing`的概念有初步了解后，下面使用`Jaeger`来演示如何在程序中使用实现链路追踪。

> [!TIP]
> 为方便演示，以下示例为进程内部方法的链路跟踪记录，更多详细的示例可参考： [Opentracing Go Tutorial](https://github.com/yurishkuro/opentracing-tutorial/tree/master/go)

  

![](/attachments/architecture-v1.png)

## Jaeger

[Jaeger](https://www.jaegertracing.io/)\\ˈyā-gər\\ 是Uber开源的分布式追踪系统，是遵循`Opentracing`的系统之一，也是`CNCF`项目。本篇将使用`Jaeger`来演示如何在系统中引入分布式追踪。

## Quick Start

`Jaeger`提供了`all-in-one`镜像，方便我们快速开始测试：

```
docker run -d --name jaeger \
-e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
-p 5775:5775/udp \
-p 6831:6831/udp \
-p 6832:6832/udp \
-p 5778:5778 \
-p 16686:16686 \
-p 14268:14268 \
-p 9411:9411 \
jaegertracing/all-in-one:1.14
```

镜像启动后，通过 [http://localhost:16686](http://localhost:16686/) 可以打开`Jaeger UI`。

下载客户端`library`:

```
go get github.com/jaegertracing/jaeger-client-go
```

初始化`Jaeger tracer`:

```
import (
	"context"
	"errors"
	"fmt"
	"io"
	"time"

	"github.com/opentracing/opentracing-go"
	"github.com/opentracing/opentracing-go/log"
	"github.com/uber/jaeger-client-go"
	jaegerCfg "github.com/uber/jaeger-client-go/config"
)

// initJaeger 将jaeger tracer设置为全局tracer
func initJaeger(service string) io.Closer {
	cfg := jaegerCfg.Configuration{
		// 将采样频率设置为1，每一个span都记录，方便查看测试结果
		Sampler: &jaegerCfg.SamplerConfig{
			Type:  jaeger.SamplerTypeConst,
			Param: 1,
		},
		Reporter: &jaegerCfg.ReporterConfig{
			LogSpans: true,
			// 将span发往jaeger-collector的服务地址
			CollectorEndpoint: "http://localhost:14268/api/traces",
		},
	}
	closer, err := cfg.InitGlobalTracer(service, jaegerCfg.Logger(jaeger.StdLogger))
	if err != nil {
		panic(fmt.Sprintf("ERROR: cannot init Jaeger: %v\n", err))
	}
	return closer
}
```

创建`tracer`，生成`root span`：

```
func main() {
	closer := initJaeger("in-process")
	defer closer.Close()
	// 获取jaeger tracer
	tracer := opentracing.GlobalTracer()
	// 创建root span
	span := tracer.StartSpan("in-process-service")
	// main执行完结束这个span
	defer span.Finish()
	// 将span传递给Foo
	ctx := opentracing.ContextWithSpan(context.Background(), span)
	Foo(ctx)
}
```

上述代码创建了一个`root span`，并将该`span`通过`context`传递给`Foo`方法，以便在`Foo`方法中将追踪链继续延续下去：

```
func Foo(ctx context.Context) {
	// 开始一个span, 设置span的operation_name为Foo
	span, ctx := opentracing.StartSpanFromContext(ctx, "Foo")
	defer span.Finish()
	// 将context传递给Bar
	Bar(ctx)
	// 模拟执行耗时
	time.Sleep(1 * time.Second)
}

func Bar(ctx context.Context) {
	// 开始一个span，设置span的operation_name为Bar
	span, ctx := opentracing.StartSpanFromContext(ctx, "Bar")
	defer span.Finish()

	// 模拟执行耗时
	time.Sleep(2 * time.Second)

	// 假设Bar发生了某些错误
	err := errors.New("something wrong")
	span.LogFields(
		log.String("event", "error"),
		log.String("message", err.Error()),
	)
	span.SetTag("error", true)
}
```

`Foo`方法调用了`Bar`，假设在`Bar`中发生了一些错误，可以通过`span.LogFields`和`span.SetTag`将错误记录在追踪链中。 通过上面的例子可以发现，如果要确保追踪链在程序中不断开，需要将函数的第一个参数设置为`context.Context`，通过`opentracing.ContextWithSpan`将保存到`context`中，通过`opentracing.StartSpanFromContext`开始一个新的子`span`。

## 效果查看

执行完上面的程序后，打开`Jaeger UI`: [http://localhost:16686/search](http://localhost:16686/search)，可以看到链路追踪的结果：![](/attachments/16d37797d34b4a5f.jpg)

![](/attachments/16d37797d34b4a5f.jpg)

点击详情可以查看具体信息：

![](/attachments/16d3779b990d1859.jpg)

 

通过链路追踪系统，我们可以方便的掌握链路中各`span`的调用顺序，调用关系，执行时间轴，以及记录一些`tag`和`log`信息，极大的方便我们定位系统中的异常和发现性能瓶颈。

# 其他参考

*   [Opentracing Go Tutorial](https://github.com/yurishkuro/opentracing-tutorial/tree/master/go)
*   [Opentracing语义习惯](https://github.com/opentracing/specification/blob/master/semantic_conventions.md)
*   [Opentracing规范文档v1.1](https://github.com/opentracing/specification/blob/master/specification.md)

  



