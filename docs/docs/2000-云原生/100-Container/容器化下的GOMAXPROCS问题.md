---
slug: "/cloud-native/container-gomaxprocs-issue"
title: "容器化下的GOMAXPROCS问题"
hide_title: true
keywords: ["Go", "GOMAXPROCS", "容器化", "性能调优", "资源限制", "并发编程"]
description: "探讨在容器化环境下 Go 程序 GOMAXPROCS 设置的问题及其对性能的影响"
---

## 基本介绍

`GOMAXPROCS` 是 Go 提供的非常重要的一个环境变量。通过设定 `GOMAXPROCS`，用户可以调整调度器中 `Processor`（简称`P`）的数量。

`GOMAXPROCS` 在 `Go 1.5` 版本后的默认值是机器的 `CPU` 核数 （`runtime.NumCPU`）。而以 `Docker` 为代表的容器虚拟化技术，会通过 `cgroup` 等技术对 `CPU` 资源进行隔离。这类技术对 `CPU` 的隔离限制，导致 `runtime.NumCPU()` 无法正确获取到容器被分配的 `CPU` 资源数。`runtime.NumCPU()`获取的是宿主机的核心数。

设置 `GOMAXPROCS` 高于真正可使用的核心数后会导致`Go`调度器不停地进行`OS`线程切换，从而给调度器增加很多不必要的工作。

## 解决方案

目前 `Go` 官方并无好的方式来规避在容器里获取不到真正可使用的核心数这一问题，而 `Uber` 提出了一种 `Workaround` 方法，利用 [https://github.com/uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) 这一个包，可以在运行时根据 `cgroup` 为容器分配的`CPU`资源限制数来修改 `GOMAXPROCS`。

使用方式：

```go
import _ "go.uber.org/automaxprocs"

func main() {
  // Your application logic here.
}
```

## `automaxprocs` 解决了什么问题

线上容器里的服务通常都对`CPU`资源做了限制，例如默认的 `4C`。但是在容器里通过 `lscpu` 命令仍然能看到宿主机的所有 `CPU` 核心：

![](/attachments/95c4e8faeaf64218803c57f31dae1f3f.png)

  
这就导致`Golang`服务默认会拿宿主机的`CPU`核心数来调用 `runtime.GOMAXPROCS()`，导致进程 数量远远大于可用的`CPU`核心，不仅导致`Golang` `Runtime`的调度成本提高，还引起频繁上下文切换，影响高负载情况下的服务性能。

`automaxprocs`自动识别`cgroup`为容器分配的`CPU`限制，来纠正`GOMAXPROCS`。  
  

