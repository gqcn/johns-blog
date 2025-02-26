---
slug: "/godebug-gc-trace"
title: "GODEBUG配置GC跟踪介绍"
hide_title: true
keywords: ["GODEBUG", "GC跟踪", "垃圾回收", "性能分析", "内存管理", "调试工具"]
description: "详细说明如何使用 GODEBUG 环境变量进行 Go 程序的 GC 跟踪和分析，包括 gctrace 输出格式解析"
---


## 背景介绍

`Golang`执行引擎提供了很多实用的运行时**环境变量**参数来控制特性开关或者打印一些调试信息，其中比较有用的`GODEBUG`环境变量。通常我们使用`gctrace=1`作为`GODBUG`环境变量的值来打印`gc`执行的情况，可以评估进程的内存使用情况以及`gc`执行对程序性能影响。

## gctrace=1格式介绍

在`Golang`官方文档中已有比较详细的介绍，大家可以先了解一下：[https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme](https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme)

### 示例

```
$ GODEBUG=gctrace=1 go run main.go    
gc 1 @0.032s 0%: 0.019+0.45+0.003 ms clock, 0.076+0.22/0.40/0.80+0.012 ms cpu, 4->4->0 MB, 5 MB goal, 4 P
gc 2 @0.046s 0%: 0.004+0.40+0.008 ms clock, 0.017+0.32/0.25/0.81+0.034 ms cpu, 4->4->0 MB, 5 MB goal, 4 P
gc 3 @0.063s 0%: 0.004+0.40+0.008 ms clock, 0.018+0.056/0.32/0.64+0.033 ms cpu, 4->4->0 MB, 5 MB goal, 4 P
gc 4 @0.080s 0%: 0.004+0.45+0.016 ms clock, 0.018+0.15/0.34/0.77+0.065 ms cpu, 4->4->1 MB, 5 MB goal, 4 P
gc 5 @0.095s 0%: 0.015+0.87+0.005 ms clock, 0.061+0.27/0.74/1.8+0.023 ms cpu, 4->4->1 MB, 5 MB goal, 4 P
gc 6 @0.113s 0%: 0.014+0.69+0.002 ms clock, 0.056+0.23/0.48/1.4+0.011 ms cpu, 4->4->1 MB, 5 MB goal, 4 P
gc 7 @0.140s 1%: 0.031+2.0+0.042 ms clock, 0.12+0.43/1.8/0.049+0.17 ms cpu, 4->4->1 MB, 5 MB goal, 4 P
...
```

### 格式

```
gc ## @#s #%: #+#+## ms clock, #+#/#/#+## ms cpu, #->#->## MB, ## MB goal, ## P
```

### 含义

*   `gc#`：GC 执行次数的编号，每次叠加。

*   `@#s`：自程序启动后到当前的具体秒数。

*   `#%`：自程序启动以来在GC中花费的时间百分比。

*   `#+...+#`：GC 的标记工作共使用的 CPU 时间占总 CPU 时间的百分比。

*   `#->#->## MB`：分别表示 GC 启动时, GC 结束时, GC 活动时的堆大小.

*   `#MB goal`：下一次触发 GC 的内存占用阈值。

*   `#P`：当前使用的处理器 P 的数量。


### 案例

```
gc 7 @0.140s 1%: 0.031+2.0+0.042 ms clock, 0.12+0.43/1.8/0.049+0.17 ms cpu, 4->4->1 MB, 5 MB goal, 4 P
```

*   `gc 7`：第 7 次 GC。

*   `@0.140s`：当前是程序启动后的 0.140s。

*   `1%`：程序启动后到现在共花费 1% 的时间在 GC 上。

*   `0.031+2.0+0.042 ms clock`：

    *   `0.031`：表示单个 P 在 mark 阶段的 STW 时间。

    *   `2.0`：表示所有 P 的 mark concurrent（并发标记）所使用的时间。

    *   `0.042`：表示单个 P 的 markTermination 阶段的 STW 时间。

*   `0.12+0.43/1.8/0.049+0.17 ms cpu`：

    *   `0.12`：表示整个进程在 mark 阶段 STW 停顿的时间。

    *   `0.43/1.8/0.049`：0.43 表示 mutator assist 占用的时间，1.8 表示 dedicated + fractional 占用的时间，0.049 表示 idle 占用的时间。

    *   `0.17ms`：0.17 表示整个进程在 markTermination 阶段 STW 时间。

*   `4->4->1 MB`：

    *   4：表示开始 mark 阶段前的 heap\_live 大小。

    *   4：表示开始 markTermination 阶段前的 heap\_live 大小。

    *   1：**表示被标记为存活对象的大小（也就是不会释放的heap大小）**。

*   `5 MB goal`：表示下一次触发 GC 回收的阈值是 5 MB。

*   `4 P`：本次 GC 一共涉及多少个 P。


## 参考资料

*   [https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme](https://pkg.go.dev/github.com/chanshik/gotraining/topics/profiling/godebug/gctrace#section-readme)
*   [https://eddycjy.gitbook.io/golang/di-9-ke-gong-ju/godebug-gc](https://eddycjy.gitbook.io/golang/di-9-ke-gong-ju/godebug-gc)
*   [https://www.ardanlabs.com/blog/2019/05/garbage-collection-in-go-part2-gctraces.html](https://www.ardanlabs.com/blog/2019/05/garbage-collection-in-go-part2-gctraces.html)

  

  