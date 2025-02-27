---
slug: "/golang-kubernetes-resource-control"
title: "Golang程序在Kubernetes下的资源控制"
hide_title: true
keywords:
  [
    "Golang",
    "Kubernetes",
    "GOMAXPROCS",
    "资源控制",
    "cgroup",
    "容器化",
    "资源限制",
  ]
description: "详细说明 Go 语言程序在 Kubernetes 环境下的资源控制机制，包括 GOMAXPROCS 设置、资源限制和最佳实践"
---

## 基本介绍

众所周知，`GOMAXPROCS` 是 `Golang` 提供的非常重要的一个环境变量设定。通过设定 `GOMAXPROCS`，用户可以调整 `Runtime Scheduler` 中 `Processor`（简称`P`）的数量。由于每个系统线程，必须要绑定 `P` 才能真正地进行执行。所以 `P` 的数量会很大程度上影响 `Golang Runtime` 的并发表现。`GOMAXPROCS` 的默认值是 `CPU` 核数，而以 `Docker` 为代表的容器虚拟化技术，会通过 `cgroup` 等技术对 `CPU` 资源进行隔离。以 `Kubernetes` 为代表的基于容器虚拟化实现的资源管理系统，也支持这样的特性。这类技术对 `CPU` 的隔离限制，会影响到 `Golang` 中的 `GOMAXPROCS`，进而影响到 `Golang Runtime` 的并发表现。

::: tip
更多关于调度器的介绍请参考：[Goroutine调度器](./0-Goroutine调度器.md)
:::

理论上来讲，过多的调度器`P`设置以及过少的`CPU`资源限制，将会增大调度器内部的**上下文切换**以及**资源竞争**成本。如何优雅地让`Golang`程序资源设置与外部`cgroup`资源限制匹配是本文讨论的主题。

## Golang资源设置

`Golang`引擎已经在运行时提供了两个比较重要的资源设置参数，通过环境变量来设置/改变：

*   `GOMAXPROCS` ：设置调度器使用的`Processor`数量，进而控制并发数量。
*   `GOMEMLIMIT` ：设置进程可用的最大内存大小，进而影响`GC`的表现。在`Go 1.19`版本后支持。需要注意，如果是在内存泄漏的程序中，该设置会延迟`OOM`的出现，但不会阻止`OOM`的出现。

::: tip
这里的`GOMEMLIMIT`会影响`GC`的触发条件，与之相关联同样影响`GC`触发条件的就是`GOGC`环境变量。`GOGC`用于控制`GC`的触发频率， 其值默认为`100`，意为直到自上次垃圾回收后`heap size`已经增长了`100%`时`GC`才触发运行。即是`GOGC=100`意味着`live heap size`每增长一倍，`GC`触发运行一次。如设定`GOGC=200`, 则`live heap size`自上次垃圾回收后，增长`2`倍时，`GC`触发运行， 总之，其值越大则`GC`触发运行频率越低， 反之则越高， 如果`GOGC=off`则关闭`GC`。`GOGC`以及`GC`策略不在本章节的讨论范围，大家仅做了解即可。
:::
> 
##  测试过程

### 测试环境

使用的`Kubernetes`集群，每台`Node`节点`32`核`128G`内存。

我们通过给容器设置环境变量，来实现对容器中`Golang`程的资源设置：

```yaml
env:
- name: GOMEMLIMIT
  valueFrom:
    resourceFieldRef:
      resource: limits.memory
- name: GOMAXPROCS
  valueFrom:
    resourceFieldRef:
      resource: limits.cpu
```

### 不限制资源

#### 不传递环境变量

我们先来看看不设置资源`limits`也不传递环境变量的时候`Golang`程序使用的资源情况：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gomaxprocs-test
spec:
  containers:
  - name: main
    image: golang:1.22
    imagePullPolicy: IfNotPresent
    args:
      - bash
      - -c
      - |
        cat <<EOF > /tmp/code.go
        package main

        import (
          "fmt"
          "os"
          "runtime"
          "runtime/debug"
        )

        func main() {
          fmt.Printf("GOMAXPROCS(env): %s\n", os.Getenv("GOMAXPROCS"))
          fmt.Printf("GOMEMLIMIT(env): %s\n", os.Getenv("GOMEMLIMIT"))
          fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
          fmt.Printf("GOMEMLIMIT: %d\n", debug.SetMemoryLimit(-1))
        }
        EOF
        go run /tmp/code.go        
```

运行后，我们查看终端输出结果：

```bash
$ kubectl logs pod/gomaxprocs-test 
GOMAXPROCS(env): 
GOMEMLIMIT(env): 
GOMAXPROCS: 32
GOMEMLIMIT: 9223372036854775807
```

可以看到，`Golang`程序使用的是当前运行`Node`的`CPU`并且内存没有任何的限制。 其中默认的内存值`9223372036854775807`表示`int64`类型的最大值。

#### 传递环境变量

我们再来看看不设置资源`limits`但传递环境变量的时候`Golang`程序使用的资源情况：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gomaxprocs-test
spec:
  containers:
  - name: main
    image: golang:1.22
    imagePullPolicy: IfNotPresent
    args:
      - bash
      - -c
      - |
        cat <<EOF > /tmp/code.go
        package main

        import (
          "fmt"
          "os"
          "runtime"
          "runtime/debug"
        )

        func main() {
          fmt.Printf("GOMAXPROCS(env): %s\n", os.Getenv("GOMAXPROCS"))
          fmt.Printf("GOMEMLIMIT(env): %s\n", os.Getenv("GOMEMLIMIT"))
          fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
          fmt.Printf("GOMEMLIMIT: %d\n", debug.SetMemoryLimit(-1))
        }
        EOF
        go run /tmp/code.go        
    resources:
    env:
    - name: GOMEMLIMIT
      valueFrom:
        resourceFieldRef:
          resource: limits.memory
    - name: GOMAXPROCS
      valueFrom:
        resourceFieldRef:
          resource: limits.cpu       
```

运行后，我们查看终端输出结果：

```bash
$ kubectl logs pod/gomaxprocs-test 
GOMAXPROCS(env): 32
GOMEMLIMIT(env): 127719542784
GOMAXPROCS: 32
GOMEMLIMIT: 127719542784
```

可以看到，`Golang`程序使用的是当前运行`Node`的`CPU`并且内存没有任何的限制。在没有设置资源`limits`的情况下，环境变量中的`limits.cpu`及`limits.memory`传递的是当前`Node`节点的`CPU`和内存值。 

### 设置资源限制

#### 不传递环境变量

如果只设置资源`limits`但是不传递环境变量会怎么样呢？我们来试试看。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gomaxprocs-test
spec:
  containers:
  - name: main
    image: golang:1.22
    imagePullPolicy: IfNotPresent
    args:
      - bash
      - -c
      - |
        cat <<EOF > /tmp/code.go
        package main

        import (
          "fmt"
          "os"
          "runtime"
          "runtime/debug"
        )

        func main() {
          fmt.Printf("GOMAXPROCS(env): %s\n", os.Getenv("GOMAXPROCS"))
          fmt.Printf("GOMEMLIMIT(env): %s\n", os.Getenv("GOMEMLIMIT"))
          fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
          fmt.Printf("GOMEMLIMIT: %d\n", debug.SetMemoryLimit(-1))
        }
        EOF
        go run /tmp/code.go        
    resources:
      limits:
        cpu: 200m
        memory: 512M
      requests:
        cpu: 100m
        memory: 128M   
```

运行后，我们查看终端输出结果：

```bash
$ kubectl logs pod/gomaxprocs-test 
GOMAXPROCS(env): 
GOMEMLIMIT(env): 
GOMAXPROCS: 32
GOMEMLIMIT: 9223372036854775807
```

可以看到，同上面没有设置资源限制一样，`Golang`程序仍然使用的是默认资源设置，并不能感知`cgroup`的资源限制。

#### 传递环境变量

我们仍然需要环境变量来通知容器中的`Golang`程序`cgroup`资源的限制。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: gomaxprocs-test
spec:
  containers:
  - name: main
    image: golang:1.22
    imagePullPolicy: IfNotPresent
    args:
      - bash
      - -c
      - |
        cat <<EOF > /tmp/code.go
        package main

        import (
          "fmt"
          "os"
          "runtime"
          "runtime/debug"
        )

        func main() {
          fmt.Printf("GOMAXPROCS(env): %s\n", os.Getenv("GOMAXPROCS"))
          fmt.Printf("GOMEMLIMIT(env): %s\n", os.Getenv("GOMEMLIMIT"))
          fmt.Printf("GOMAXPROCS: %d\n", runtime.GOMAXPROCS(0))
          fmt.Printf("GOMEMLIMIT: %d\n", debug.SetMemoryLimit(-1))
        }
        EOF
        go run /tmp/code.go        
    resources:
      limits:
        cpu: 200m
        memory: 512M
      requests:
        cpu: 100m
        memory: 128M
    env:
    - name: GOMEMLIMIT
      valueFrom:
        resourceFieldRef:
          resource: limits.memory
    - name: GOMAXPROCS
      valueFrom:
        resourceFieldRef:
          resource: limits.cpu     
```

运行后，我们查看终端输出结果：

```bash
$ kubectl logs pod/gomaxprocs-test 
GOMAXPROCS(env): 1
GOMEMLIMIT(env): 512000000
GOMAXPROCS: 1
GOMEMLIMIT: 512000000
```

可以看到，`Golang`程序的`CPU`及内存受限制给定的`limits`限制。并且`CPU`的限制使用的是`limits`中`CPU`核心数的**向上取整**设置，例如给定的`CPU limits`为`100m`时，容器`Golang`程序获取到的`GOMAXPROCS`变量是`1`。

## 一些总结

容器中的`Golang`程序并不能动态感知外部`cgroup`的资源限制，需要通过环境变量的方式来同步外部`cgroup`对资源的限制到容器中的`Golang`程序中。此外，也有一些第三方开源组件可以使得`Golang`程序动态感知`cgroup`的资源限制：[https://github.com/uber-go/automaxprocs](https://github.com/uber-go/automaxprocs) 其原理也是通过程序动态读取`cgroup`配置来实现的。

## 参考资料

*   [Goroutine调度器](./0-Goroutine调度器.md)
*   [https://gaocegege.com/Blog/maxprocs-cpu](https://gaocegege.com/Blog/maxprocs-cpu)
*   [https://blog.howardjohn.info/posts/gomaxprocs/](https://blog.howardjohn.info/posts/gomaxprocs/)
*   [https://www.ardanlabs.com/blog/2024/02/kubernetes-cpu-limits-go.html](https://www.ardanlabs.com/blog/2024/02/kubernetes-cpu-limits-go.html)
*   [https://weaviate.io/blog/gomemlimit-a-game-changer-for-high-memory-applications](https://weaviate.io/blog/gomemlimit-a-game-changer-for-high-memory-applications)

  
