---
slug: "/golang-memory-optimization-case"
title: "一个Golang程序内存占用问题排查优化（复盘）"
hide_title: true
keywords: ["内存优化", "PProf", "性能分析", "内存泄漏", "OOM", "性能优化"]
description: "详细记录一个 Go 语言程序的内存占用问题排查和优化过程，包括使用 PProf 进行分析、问题定位和解决方案"
---


## 背景介绍

笔者编写的一个监控采集上报程序部署遇到了频繁`OOM`的问题，之前一直在赶业务需求，虽然知道这块存在一些优化空间，记录了需求单跟进但是一直没有时间去完善。终于在交付给客户后由于其他问题的诱发导致了`OOM`即便增加资源也不可恢复，因此将此问题提高了优先级来处理。

首先介绍下这个监控采集程序，它实现了秒级监控的能力，但基础监控指标复用于其他开源组件或者服务，比如：

*   **容器监控数据**来源于`kubelet`中内置的`cadvisor`数据，通过`https`请求`kubelet`而来。
*   **`kubelet`自身的监控数据**同样来源于`kubelet`，通过`https`请求`kubelet`而来。
*   **集群状态数据**来源于独立部署的开源组件`kube-state-metrics`而来，通过`http`请求`kube-state-metrics`服务地址而来。

这`3`项数据均涉及到`HTTP`远程访问，并且这些基础指标拿到后根据不同的业务会有独立的`plugin`接口注册，用于实现各自独立的数据面监控指标。由于涉及到数据面监控指标，因此这些基础监控数据非常重要，容不得丢失。

## 排查优化

### 开启PProf

首先我们的程序需要开启`PProf`，以便拿到程序的分析指标。具体可以参考：[PProf服务性能分析](https://goframe.org/docs/web/senior-pprof)

### 拿到PProf数据

具体细节不赘述，具体的命令差不多是这样：

```bash
## 拷贝带有pprof功能的新二进制到指定容器
kubectl cp /root/khaos-metrics-agent khaos/khaos-guardian-sjsm4:/root/khaos-metrics-agent -c app

## 进入指定容器执行bash，便于独立采集pprof数据
k exec -n khaos khaos-guardian-sjsm4 -c app bash -it
cd ~ && chmod +x khaos-metrics-agent


## 运行一个独立的khaos-metrics-agent
nohup ./khaos-metrics-agent \
--debug=false \
--address=:13142 \
--nodeIP=10.186.19.165 \
--rootPath=/ \
--agentConfigFilePath=/var/run/khaos-guardian/metricsconfig/config.yaml \
--kubeStateUrl=http://127.0.0.1:13043/metrics \
--enabledPlugins=.+ &


## 采集pprof相关信息
curl 127.0.0.1:13045/debug/pprof/heap > pprof.heap
curl 127.0.0.1:13045/debug/pprof/goroutine > pprof.goroutine
curl 127.0.0.1:13045/debug/pprof/profile > pprof.profile

## 将pprof信息从容器中拷贝到客户端，便于本地进一步分析
kubectl cp khaos/khaos-guardian-sjsm4:/root/pprof.heap /root/pprof.heap  -c app
kubectl cp khaos/khaos-guardian-sjsm4:/root/pprof.goroutine /root/pprof.goroutine  -c app
kubectl cp khaos/khaos-guardian-sjsm4:/root/pprof.profile /root/pprof.profile  -c app
```

### 执行PProf分析

### sample1

文件：[pprof.heap](/attachments/pprof.heap)

由于我们需要排查的是内存占用问题，所以主要是分析`pprof.heap`这个文件即可，其他两个文件（`pprof.profile`用以分析`cpu`耗时、`pprof.goroutine`用以分析`goroutine`占用判断有误`goroutine`阻塞）主要用来辅助排查。通过以下命令使用`go tool`打开`pprof`内存分析：

```bash
$ go tool pprof -http :8080 pprof.heap
Serving web UI on http://localhost:8080
```

![](/attachments/image-2024-5-11_16-0-58.png)

点开火炬图发现内存占用居然会处在框架的缓存组件方法`GetOrSetFuncLock`上，说明程序不断地去调用缓存方法来读取和缓存数据，很有可能就是缓存失效了，或者缓存没有起作用，导致频繁地更新缓存。通过查看程序，发现这里的代码写得垃圾得一批，缓存根本没起作用，缓存键名加了一个时间戳是什么鬼？**脑子抽了？😰**

![](/attachments/image-2024-5-11_16-19-22.png)

为了方便缓存，这里调整一下`Gatherer`的接口实现，增加`Name`接口实现，并封装了新的方法来聚合这块缓存逻辑：

![](/attachments/image-2024-5-11_17-15-7.png)

### sample2

文件：[pprof.heap](/attachments/pprof.heap)

修复该问题后重新执行`pprof`分析。这次发现问题出在了`io.ReadAll`上。由于业务插件在采集业务程序的指标时是通过`HTTP GET`拉取，里面使用了`ReadAll`方法来完成读取业务程序的指标数据，并返回给上层转换为`Prometheus`数据结构，处理后再`push`给远端存储。

![](/attachments/image-2024-5-11_16-25-42.png)

涉及到的代码如下。但是由于业务实例的**指标数据过大（几MB到100+MB不等）**，这里完整读取的话会申请一块新的临时内存，造成过大的内存压力，所以这里的内存问题比较容易凸显。

![](/attachments/image-2024-5-11_16-29-31.png)

::: tip
这种问题其实属于常见问题，对于所有的`HTTP`访问操作都容易出现。大多数`HTTP`访问的场景下，程序员的思维逻辑都是直接完整读取后再交给上层处理，但是这样会额外占用一块无意义的临时内存。
:::

因此去掉临时内存申请，改为直接`res.Body`流式读取。同时程序中其他`HTTP`请求也做类似的改进。

![](/attachments/image-2024-5-11_16-35-7.png)

### sample3

文件：[pprof.heap](/attachments/pprof.heap)

修复后继续`pprof`分析，发现现在内存占用主要是在执行`RemoteWrite`远端写入时的第三方包数据结构转换组件调用上。

![](/attachments/image-2024-5-11_16-37-22.png)

这个`fmtutil`包是属于`prometheus`官方社区的组件包，用于执行指标数据的各种数据结构转换。我们看看这个`fmtutil.makeLabels`做了什么事情。

![](/attachments/image-2024-5-11_16-40-53.png)

可以看到内存分配主要是这里的`labels`数组创建。这里的`prompb.Label`数据结构很奇怪，它这里使用了**值传参**形式，也就是说，指标标签的键值对都会复制一遍到这个`labels`中。而我们知道，指标数据容量主要是标签键值对的大小容量占用，那么这里就会不断申请很多内存用于拷贝标签键值对数据。

![](/attachments/image-2024-5-11_16-43-57.png)

我们这里来梳理一下业务实例的监控指标的数据结构转换流程：

```text
Metric Text -> dto.MetricFamily -> prompb.WriteRequest
```

其中：

*   `Metric Text`：从业务实例采集到的`Prometheus`监控数据，文本类型，从`Response.Body`中流式读取。
*   `dto.MetricFamily`：从`Prometheus`监控数据文本转换为的监控数据结构，用于方便采集程序内部处理，如指标过滤、注入等操作。
*   `prompb.WriteRequest`：当监控数据处理好后，需要通过`Prometheus RemoteWrite`协议写入到远端存储，需要进行协议转换为该格式。

那么既然这里有两次协议转换，为什么`Metric Text`到`dto.MetricFamily`没有出现内存占用问题呢？我们来看看它的数据结构：

![](/attachments/image-2024-5-11_16-45-59.png)

可以看到，在转换为`dto.MetricFamily`的时候，内存容量占比较大的部分使用的是指针，其实并没有涉及到额外的内存申请。因此对转换`prompb.WriteRequest`数据结构的优化可以参考该思路。通过查看`Prometheus`的源码，发现其实这里不太好改，因为这是个公开的数据结构，并且引用的地方还蛮多，直接修改会有兼容问题。回顾自身的监控采集程序，已经没有更多的优化空间。而针对社区组件的改动，也许未来再详细考虑吧。

![](/attachments/tapd_69993163_base64_1715248124_728.png)

### 其他一些点

除了程序方面的优化，其实在部署上也有一些改进，具体请参考：

*   [Golang程序在Kubernetes下的资源控制](./7-Golang程序在Kubernetes下的资源控制.md)

## 回顾总结

*   开发人员应当对自身产出的物料负责。项目周期通常都非常繁忙（且忙中易出错），不可能单独预留改进优化的时间。在评估每个开发迭代的任务时，应当积极介入工作安排，不要被动接受输入。将遗留的可能风险及时和上级Leader沟通，给Leader更多的输入以便综合权衡评估工作安排来改进。不要等待问题影响业务/客户时再回过头来改进，那样的成本太大了。
*   Golang的工具链很丰富，特别是PProf的存在确实帮助开发人员快速排查、优化程序提供了高效的辅助。

  