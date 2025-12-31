---
slug: "/cloud-native/kubernetes-kubelet-pod-eviction-process"
title: "Kubelet驱逐Pod详细流程"
hide_title: true
keywords:
  [
    "Kubelet",
    "Pod驱逐",
    "资源压力",
    "内存压力",
    "磁盘压力",
    "QoS级别",
    "Guaranteed",
    "Burstable", 
    "BestEffort",
    "驱逐信号",
    "驱逐阈值",
    "软驱逐",
    "硬驱逐",
    "节点资源管理",
    "容器资源限制",
    "requests",
    "limits",
    "优先级调度",
    "资源回收",
    "垃圾回收"
  ]
description: "深入解析Kubernetes中kubelet的Pod驱逐机制，包括驱逐信号、阈值配置、QoS级别分类、驱逐优先级逻辑等。详细说明requests和limits配置对驱逐顺序的影响，以及内存、磁盘、PID等不同资源压力下的驱逐策略。结合源码分析驱逐流程的具体实现。"
---


## 前言
`kubelet`监控集群节点的内存、磁盘空间和文件系统的`inode`等资源。 当这些资源中的一个或者多个达到特定的消耗水平，`kubelet`可以主动驱逐节点上一个或者多个`Pod`，以回收资源防止节点最终崩溃。

**需要注意的是**：由`Kubelet`发起的驱逐并不会遵循`PodDisruptionBudget`和`terminationGracePeriodSeconds`的配置。对`K8S`来说，保证节点资源充足优先级更高，牺牲小部分`Pod`来保证剩余的大部分`Pod`。

另外`Kubelet`在真正驱逐`Pod`之前会执行一次垃圾回收，尝试回收节点资源，如果回收后资源充足了，就可以避免驱逐`Pod`。

在`kubelet`中实现`Pod`驱逐逻辑的具体源码位于：https://github.com/kubernetes/kubernetes/blob/4096c9209cbf20c51d184e83ab6ffa3853bd2ee6/pkg/kubelet/eviction/eviction_manager.go

## 驱逐信号和阈值：什么时候会驱逐 Pod?

首先，新的`Pod`调度不会引发驱逐动作，驱逐动作只会在节点资源紧张时才会发生，例如某些`Pod`的资源使用率（`CPU/Memory/Disk/PID`等）飙升（因为`Container limits`可以超过节点可分配资源总量），或者节点上其他进程引发的节点资源压力。

`kubelet`使用各种参数来做出驱逐决定，具体包含以下`3`个部分：

*   1）驱逐信号
*   2）驱逐条件
*   3）监控间隔

### 驱逐信号与节点condition

#### 驱逐信号

**`Kubelet`使用驱逐信号来代表特定资源在特定时间点的状态**，根据不同资源，`Kubelet` 中定义了`5`种驱逐信号。

> 驱逐信号这个词感觉有点迷，实际看下来就是检测了这几种资源的余量用于判断是否需要驱逐`Pod`

在`Linux`系统中，`5`种信号分别为：

| 驱逐信号 | 描述 |
| --- | --- |
| `memory.available` | `memory.available := node.status.capacity[memory] - node.stats.memory.workingSet` |
| `nodefs.available` | `nodefs.available := node.stats.fs.available` |
| `nodefs.inodesFree` | `nodefs.inodesFree := node.stats.fs.inodesFree` |
| `imagefs.available` | `imagefs.available := node.stats.runtime.imagefs.available` |
| `imagefs.inodesFree` | `imagefs.inodesFree := node.stats.runtime.imagefs.inodesFree` |
| `pid.available` | `pid.available := node.stats.rlimit.maxpid - node.stats.rlimit.curproc` |

可以看到，主要是对 `内存`、`磁盘`、`PID` 这三种类型资源进行检测。其中磁盘资源又分为两类：

1.  `nodefs`：节点的主要文件系统，用于本地磁盘卷、不受内存支持的`emptyDir`卷、日志存储等。 例如，`nodefs` 包含 `/var/lib/kubelet/`。
2.  `imagefs`：可选文件系统，供容器运行时存储容器镜像和容器可写层。

#### 节点condition与污点

除了用驱逐信号来判断是否需要驱逐`Pod`之外，`Kubelet` 还会把驱逐信号反应为节点的状态。

> 即：更新到`node`对象的`status.condition`字段里

对应关系如下：

| Node Condition | Eviction Signal | Description |
| --- | --- | --- |
| `MemoryPressure` | `memory.available` | 节点可用内存余量满足驱逐阈值 |
| `DiskPressure` | `nodefs.available, nodefs.inodesFree, imagefs.available, or imagefs.inodesFree` | 节点主文件系统或者镜像文件系统剩余磁盘空间或者`inodes`数量满足驱逐阈值 |
| `PIDPressure` | `pid.available` | 节点上可用进程标识符(`processes identifiers`) 低于驱逐阈值 |

总的来说就是节点上对应资源不足时`kubelet`就会被节点打上对应的标记。

同时 `control plane(具体为 node controller)` 会自动把节点上相关`condition`转换为`taint`标记，具体见：[#taint-nodes-by-condition](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-nodes-by-condition)，这样可以避免把`Pod`调度到本来就资源不足的`Pod`上。

> 如果不给资源不足的节点打上标记，可能发生`Pod`刚调度过去就被驱逐的情况。

**整体运作流程**：

*   1）首先`Kubelet`检测到节点上剩余磁盘空间不足，更新`Node Condition`增加 `DiskPressure` 状态
*   2）然后`node controller`自动将`Condition`转换为`污点` `node.kubernetes.io/disk-pressure`
*   3）最后`Pod`调度的时候，由于没有添加对应的容忍，因此会优先调度到其他节点，或者最终调度失败

有时候节点状态处于阈值附近上下波动，导致软驱逐条件也在`true`和`false`之间反复切换，为了过滤掉这种误差，`kubelet` 提供了 `eviction-pressure-transition-period` 参数来限制，节点状态转换前必须要等待对应的时间，默认为`5m`。

> 一般这种检测状态的为了提升稳定性，都会给一个静默期，比如`K8S`中的`HPA`扩缩容也会设置静默期，防止频繁触发扩缩容动作。

### 驱逐阈值：判断条件

拿到资源当前状态之后，就可以根据阈值判断是否需要触发驱逐动作了。

`Kubelet`使用`[eviction-signal][operator][quantity]`格式定义驱逐条件，其中：

*   `eviction-signal` 是要使用的驱逐信号
    *   比如剩余内存 `memory.available`
*   `operator` 是你想要的关系运算符
    *   比如 `<`（小于）。
*   `quantity` 是驱逐条件数量，例如 `1Gi`。
    *   `quantity` 的值必须与`Kubernetes`使用的数量表示相匹配。
    *   你可以使用文字值或百分比（`%`）。

例如，如果一个节点的总内存为`10GiB`并且你希望在可用内存低于`1GiB`时触发驱逐， 则可以将驱逐条件定义为 `memory.available < 10%` 或 `memory.available < 1G`。

根据紧急程度驱逐条件又分为**软驱逐 `eviction-soft`** 和 **硬驱逐 `eviction-hard`**：

#### 软驱逐 eviction-soft

一般驱逐条件比较保守，此时还可以等待`Pod`优雅终止，需要配置以下参数

*   `eviction-soft`：软驱逐条件，例如 `memory.available<1.5Gi`
*   `eviction-soft-grace-period`：软驱逐宽限期，需要保持驱逐条件这么久之后才开始驱逐`Pod`（必须指定，否则`kubelet`启动时会直接报错）
*   `eviction-max-pod-grace-period`：软驱逐最大`Pod`宽限期，驱逐`Pod`的时候给`Pod`优雅终止的时间

在 [Pod 生命周期部分](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) 我们可以配置 `spec.terminationGracePeriodSeconds`来控制`Pod`优雅终止时间，就像这样：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: example
spec:
  containers:  
  - name: my-container    
    image: my-image  
    terminationGracePeriodSeconds: 60  # 设置终止期限为 60 秒
```

然后驱逐这里又配置了一个 `eviction-max-pod-grace-period`,实际驱逐发生时，**`Kubelet`会取二者中的较小值来作为最终优雅终止宽限期**。

#### 硬驱逐 eviction-hard

相比之下则是比较紧急，配置条件都很极限，在往上节点可能会崩溃的那种。

比如 内存小于`100Mi`这种，因此硬驱逐没有容忍时间，需要配置硬驱逐条件 `eviction-hard`。

只要满足驱逐条件 `kubelet` 就会立马将 `pod kill` 掉，而不是发送 `SIGTERM` 信号。

`Kubelet`提供了以下的默认硬驱逐条件：

*   `memory.available < 100Mi`
*   `nodefs.available < 10%`
*   `imagefs.available < 15%`
*   `nodefs.inodesFree < 5%`

例如下面这个配置：

*   `eviction-soft: memory.available < 1 Gi`
*   `eviction-soft-grace-period: 60s`
*   `eviction-max-pod-grace-period: 30s`
*   `eviction-hard: memory.available < 100 Mi`

当节点可用内存余量低于`1Gi`连续持续`60s`之后，`kubelet`就会开始软驱逐，给被选择的`Pod`发送`SIGTERM`，使其优化终止，如果终止时间超过`30s`则强制`kill`。

如果节点内存可用余量低于`100Mi`，则`kubelet`进入硬驱逐，立马`kill`掉被选中的`Pod`。

### 状态检测 & 驱逐频率

`Kubelet`默认每`10s`会检测一次节点状态，即驱逐判断条件为`10s`一次，当然也可以通过`housekeeping-interval`参数进行配置。

## 回收节点级资源

为了提升稳定性，减少`Pod`驱逐次数，`Kubelet`在执行驱逐前会进行一次垃圾回收。如果本地垃圾回收后资源充足了就不再驱逐。

对于磁盘资源可以通过驱逐`Pod`以外的方式进行回收：

如果节点有一个专用的 `imagefs`文件系统供容器运行时使用，`Kubelet`会执行以下操作：

*   如果 `nodefs`文件系统满足驱逐条件，`Kubelet`垃圾收集死亡`Pod`和容器。
*   如果 `imagefs`文件系统满足驱逐条件，`Kubelet`将删除所有未使用的镜像。

如果节点只有一个满足驱逐条件的`nodefs`文件系统，`kubelet`按以下顺序释放磁盘空间：

1.  对死亡的`Pod`和容器进行垃圾收集
2.  删除未使用的镜像

对于CPU、内存资源则是只能驱逐`Pod`方式进行回收。

## 驱逐对象：哪些 Pod 会被驱逐

如果进行垃圾回收后，节点资源也满足驱逐条件，那么为了保证当前节点不被压垮，`kubelet`只能驱逐`Pod`了。

根据触发驱逐的资源不同，驱逐目标筛选逻辑也有不同。

### 内存资源导致的驱逐

对于内存资源`kubelet`使用以下参数来确定`Pod`驱逐顺序：https://github.com/kubernetes/kubernetes/blob/4096c9209cbf20c51d184e83ab6ffa3853bd2ee6/pkg/kubelet/eviction/eviction_manager.go#L254

*   1）**`Pod`** **使用的资源是否超过请求值**：即当前占用资源是否高于`yaml`中指定的`requests`值
*   2）**`Pod`** **的优先级**：这里不是`QoS`优先级，而是 [priority-class](https://kubernetes.io/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/) 这个优先级
*   3）**`Pod`** **使用资源相对于请求资源的百分比**：百分比越高则越容易别驱逐，比如请求`100Mi`，使用了`60Mi`则占用了`60%`，如果没有`limits`导致`Pod`使用了`200Mi`，那就是`200%`

因此，虽然没有严格按照`QoS`来排序，但是整个驱逐顺序和`Pod`的`QoS`是有很大关系的：

#### QoS 级别介绍

在`Kubernetes`中，`Pod`根据其资源配置被分为三个`QoS`（`Quality of Service`）级别：

**1. Guaranteed（保证级别）**
- 所有容器都必须设置CPU和内存的`requests`和`limits`
- 每个容器的`requests`必须等于`limits`
- 这类`Pod`拥有最高的服务质量保证，在资源紧张时最不容易被驱逐

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    resources:
      requests:
        memory: "1Gi"
        cpu: "500m"
      limits:
        memory: "1Gi"    # 必须等于requests
        cpu: "500m"      # 必须等于requests
```

**2. Burstable（突发级别）**
- 至少有一个容器设置了CPU或内存的`requests`
- 不满足`Guaranteed`级别的条件（即`requests`不等于`limits`，或者部分容器未设置`limits`）
- 这类`Pod`可以在资源充足时使用超过`requests`的资源

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    resources:
      requests:
        memory: "512Mi"
        cpu: "250m"
      limits:
        memory: "1Gi"    # 大于requests，允许突发使用
        cpu: "1000m"     # 大于requests，允许突发使用
```

**3. BestEffort（尽力而为级别）**
- 所有容器都没有设置CPU和内存的`requests`和`limits`
- 这类`Pod`在资源紧张时最容易被驱逐

```yaml
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: app
    resources: {}  # 没有设置任何资源限制
```

#### 驱逐优先级关系

*   首先考虑资源使用量超过其请求的`QoS`级别为`BestEffort`或`Burstable`的`Pod`。 这些`Pod`会根据它们的优先级以及它们的资源使用级别超过其请求的程度被驱逐。
*   资源使用量少于请求量的`Guaranteed`级别的`Pod`和`Burstable Pod`根据其优先级被最后驱逐。

### inode & pid 导致的驱逐

当`kubelet`因 **inode** 或 **进程标识符(pid)** 不足而驱逐`Pod`时， 它使用`Pod`的相对优先级来确定驱逐顺序，因为`inode`和`PID`没有对应的请求字段。

相对优先级排序方式如下：

1. 节点有 `imagefs`：

*   如果 `nodefs` 触发驱逐，`kubelet`会根据 `nodefs` 使用情况（`本地卷 + 所有容器的日志`）对`Pod`进行排序。
*   如果 `imagefs` 触发驱逐，`kubelet`会根据所有容器的可写层使用情况对`Pod`进行排序。

2. 节点没有 `imagefs`：

*   如果 `nodefs` 触发驱逐，`kubelet`会根据磁盘总用量（`本地卷 + 日志和所有容器的可写层`）对`Pod`进行排序。

3. 即：`inode、pid`导致的驱逐，`Kubelet`会优先驱逐磁盘消耗大的`Pod`，而不是根据`Pod QoS`来。

### 小结

`Kubelet`并没有使用`QoS`来作为驱逐顺序，但是对于**内存资源回收**的场景，驱逐顺序和`QoS`是相差不大的。不过对于 **磁盘和 PID** 资源的回收则完全不一样的，会优先考虑驱逐磁盘占用多的`Pod`，即使`Pod QoS`等级为 `Guaranteed`。

> 毕竟不是所有资源都有`requests`和`limits`，只能先驱逐占用量大的。

### 最少资源回收量

为了保证尽量少的`Pod`，`kubelet`每次只会驱逐一个`Pod`，驱逐后就会判断一次资源是否充足。

这样可能导致该节点资源一直处于驱逐阈值，反复达到驱逐条件从而触发多次驱逐，`kubelet`也提供了参数 `--eviction-minimum-reclaim` 来指定每次驱逐最低回收资源，达到该值后才停止驱逐。从而减少触发驱逐的次数。

## 参考资料

- https://www.lixueduan.com/posts/kubernetes/20-pod-eviction