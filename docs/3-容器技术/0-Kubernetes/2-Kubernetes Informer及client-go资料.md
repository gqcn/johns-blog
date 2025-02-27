---
slug: "/kubernetes-informer-client-go"
title: "Kubernetes Informer及client-go资料"
hide_title: true
keywords:
  [
    "Kubernetes",
    "Informer",
    "client-go",
    "List-Watch",
    "Reflector",
    "事件监听",
    "源码分析",
  ]
description: "深入分析 Kubernetes Informer 机制和 client-go 库的实现原理，包括 List-Watch、Reflector 等核心组件的详细解析"
---






本文主要是以client-go为入口，介绍Kubernetes的Informer核心组件的原理，以及如何创建自定义的Controller以及CRD。

## 一、基本架构

### 1、K8S中的Informer

K8S是典型的Server-Client架构。K8S内部通过etcd服务存储集群的数据信息，通过apiserver作为统一的操作入口，任何对数据的操作都必须经过apiserver。客户端通过List&Watch机制查询apiserver，而Informer模块则封装了List-watch。《kubernetes源码剖析》一书中的Informer机制架构图：

![](/attachments/1424868-20200903225231946-691815526.png)

Informer In Kubernetes

### 2、自定义Controller与client-go

我们再来看一张经典的架构图，来自于client-go的官方介绍，展示了client-go与自定义Controller之间的相关组件以及数据交互流程。原文地址：[https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md](https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md)

::: tip
client-go项目地址：[https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go)
:::

![](/attachments/client-go-controller-interaction.jpeg)

自定义Controller使用client-go与Kubernetes的事件交互

## 二、相关组件

### 1、Reflector

Reflector 用来直接和 kubernetes api server 通信，内部实现了 list&watch 机制，list&watch 就是用来监听资源变化的，一个list&watch **只对应一个特定的资源**，这个资源可以是 K8S 中内部的资源也可以是自定义的资源，当收到资源变化时(创建、删除、修改)时会将资源放到 Delta Fifo 队列中。

### 2、DeltaFIFO

Delta代表变化， FIFO则是**先入先出**的队列。DeltaFIFO将接受来的资源event，转化为特定的变化类型，存储在队列中，周期性的POP出去，分发到事件处理器，并更新Indexer中的本地缓存。

### 3、Informer

Informer 是我们要监听的资源的一个代码抽象，在 Controller 的驱动下运行，能够将 Delta Filo 队列中的数据弹出，然后保存到本地缓存也就是图中的步骤5)，同时将数据分发到自定义Controller 中进行事件处理也就是图中的步骤6)。

### 4、Indexer

Indexer 能够基于一些索引函数以及对象的标签计算出索引存储到本地缓存，索引器使用线程安全的数据存储来存储对象及其键。可以看到，在自定义 Controller 中处理事件时，就是通过键名从Indexer中查询出事件中的对象再执行自定义的逻辑处理。

![](/attachments/1424868-20200903225619583-2106027163.png)

![](/attachments/1424868-20200903225628087-102525032.png)

## 三、源码示例

```go
package main

import (
    "k8s.io/apimachinery/pkg/apis/meta/v1"
    "k8s.io/client-go/informers"
    "k8s.io/client-go/kubernetes"
    "k8s.io/client-go/tools/cache"
    "k8s.io/client-go/tools/clientcmd"
    "log"
)

func main() {
    config, err := clientcmd.BuildConfigFromFlags("", "/Users/john/.kube/config")
    if err != nil {
        panic(err)
    }

    clientSet, err := kubernetes.NewForConfig(config)
    if err != nil {
        panic(err)
    }
    var (
        stopCh          = make(chan struct{})
        sharedInformers = informers.NewSharedInformerFactory(clientSet, 0)
        podsInformer    = sharedInformers.Core().V1().Pods().Informer()
    )
    defer close(stopCh)

    podsInformer.AddEventHandler(cache.ResourceEventHandlerFuncs{
        AddFunc: func(obj interface{}) {
            mObj := obj.(v1.Object)
            log.Printf("New Pod Added to Stroe: %s", mObj.GetName())
        },
        UpdateFunc: func(oldObj, newObj interface{}) {
            oObj := oldObj.(v1.Object)
            nObj := newObj.(v1.Object)
            log.Printf("%s Pod Updated to %s", oObj.GetName(), nObj.GetName())
        },
        DeleteFunc: func(obj interface{}) {
            mObj := obj.(v1.Object)
            log.Printf("Pod Deleted from Stroe : %s", mObj.GetName())
        },
    })
    podsInformer.Run(stopCh)
}
```

在这个示例中，我们监听集群中Pod的变化。

代码运行后，终端输出为：

![](/attachments/image2021-5-7_16-54-51.png)

随后我们随便操作一下集群的Pod，例如，删除一下Pod试试，看看监听的事件有什么变化没有：

![](/attachments/image2021-5-7_16-56-23.png)

可以看到，当我们执行 kubectl delete 操作的时候，我们的示例程序也监听到了事件：

![](/attachments/image2021-5-7_16-57-28.png)

 

## 四、源码解析

在以上示例中，我们通过 `podsInformer.Run(stopCh)` 来执行我们的监听，其实这个方法是依靠`Reflector对象`来实现的。

### 1、Reflector

Informer对Kubernetes的Api Server资源进行监控（Watch）操作。其中最核心的功能是Reflector，Reflector用于监控指定的Kubernetes资源，当监控的资源发生变化时，触发相应的变更事件。并将其资源对象存放到本地缓冲DeltaFIFO中。通过NewReflector方法实例化Reflector对象，方法必须传入ListerWatcher数据接口对象。 ListerWatcher拥有List和Watch方法，用于获取和监控资源列表，只要实现了List和Watch方法的对象都可以成为ListerWatcher。

[https://github.com/kubernetes/client-go/blob/8c8fa70f7a2acc191d4787327639621f69992efd/tools/cache/reflector.go#L218](https://github.com/kubernetes/client-go/blob/8c8fa70f7a2acc191d4787327639621f69992efd/tools/cache/reflector.go#L218)

![](/attachments/image2021-5-7_17-18-31.png)

Reflector通过Run函数启动监控进程，并处理监控的事件。其中最主要的是ListAndWatch函数，它负责List和Watch指定的Kubernetes Api Server资源。

### 2、ListAndWatch函数

ListAndWatch第一次运行时，通过List获取资源下的所有对象和版本信息，后续通过版本进行watch。

[https://github.com/kubernetes/client-go/blob/8c8fa70f7a2acc191d4787327639621f69992efd/tools/cache/reflector.go#L254](https://github.com/kubernetes/client-go/blob/8c8fa70f7a2acc191d4787327639621f69992efd/tools/cache/reflector.go#L254)

![](/attachments/image2021-5-7_17-19-39.png)

## 五、参考资料

*   [https://github.com/kubernetes/client-go](https://github.com/kubernetes/client-go)
*   [https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md](https://github.com/kubernetes/sample-controller/blob/master/docs/controller-client-go.md)
*   [https://segmentfault.com/a/1190000022643082](https://segmentfault.com/a/1190000022643082)
*   [https://www.kubernetes.org.cn/2693.html](https://www.kubernetes.org.cn/2693.html)
*   [https://www.cnblogs.com/yangyuliufeng/p/13611126.html](https://www.cnblogs.com/yangyuliufeng/p/13611126.html)

  

  

  

  

  

  

  

  

  

  

  

  

  

  

  
  

  

