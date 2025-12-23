---
slug: "/cloud-native/kubernetes-crd-controller-operator"
title: "Kubernetes CRD, Controller, Operator"
hide_title: true
keywords:
  [
    "Kubernetes",
    "CRD",
    "Controller",
    "Operator",
    "自定义资源",
    "KubeBuilder",
    "扩展开发",
  ]
description: "详细介绍 Kubernetes 中的 CRD、Controller 和 Operator 概念，以及如何使用 KubeBuilder 开发自定义资源控制器"
---

由于[Kubernetes官网](https://kubernetes.io/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)已经对CRD做了比较详细的介绍，并且也有想用的工具和组件来开发Operator项目，因此本文仅做简单的概念介绍。

## 基本介绍

### CRD

Kubernetes 里资源类型有如下所示：

![](/attachments/v2-f101bda2e95f9943abccc5439b915934_1440w.jpg)

上述资源类型可以满足大多数分布式系统部署的需求。但是在不同应用业务环境下，对于平台可能有一些特殊的需求，这些需求可以抽象为 Kubernetes 的扩展资源，而 Kubernetes 的 CRD (`CustomResourceDefinition`)为这样的需求提供了轻量级的机制，保证新的资源的快速注册和使用。

这是CRD定义的标准模板参考，更详细的介绍请参考官方：[https://kubernetes.io/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/](https://kubernetes.io/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)

```yaml
apiVersion: apiextensions.k8s.io/v1
kind: CustomResourceDefinition
metadata:
  ## 名字必需与下面的 spec 字段匹配，并且格式为 '<名称的复数形式>.<组名>'
  name: crontabs.stable.example.com
spec:
  ## 组名称，用于 REST API: /apis/<组>/<版本>
  group: stable.example.com
  ## 列举此 CustomResourceDefinition 所支持的版本
  versions:
    - name: v1
      ## 每个版本都可以通过 served 标志来独立启用或禁止
      served: true
      ## 其中一个且只有一个版本必需被标记为存储版本
      storage: true
      schema:
        openAPIV3Schema:
          type: object
          properties:
            spec:
              type: object
              properties:
                cronSpec:
                  type: string
                image:
                  type: string
                replicas:
                  type: integer
  ## 可以是 Namespaced 或 Cluster
  scope: Namespaced
  names:
    ## 名称的复数形式，用于 URL：/apis/<组>/<版本>/<名称的复数形式>
    plural: crontabs
    ## 名称的单数形式，作为命令行使用时和显示时的别名
    singular: crontab
    ## kind 通常是单数形式的驼峰编码（CamelCased）形式。你的资源清单会使用这一形式。
    kind: CronTab
    ## shortNames 允许你在命令行使用较短的字符串来匹配资源
    shortNames:
    - ct
```

举个例子：我希望在 kubernetes 中有 KafkaSource 这个资源， 资源示例 `kafka-source.yaml`如下：

![](/attachments/v2-2ab4149b2fd650f8f26d327fa1e42b9d_1440w.jpg)

我们希望在执行 kubectl create -f kafka-source.yaml 之后，在 kubernetes 里会启动一个 pod，这个 pod 会做下面的事情：

*   它会从地址是 my-cluster-kafka-bootstrap.kafka:9092，topic 是 knative- demo-topic 的 kafka 机群里读取消
*   将读到的消息，发送到 kubernetes 的一个 Service 去执行

Kuberentes 里并没有 KafkaSource 这个资源可以使用，所以直接执行 `kubectl create -f kafka-source.yaml` 的时候，会出错。但是 kubernetes 提供的 CRD 机制可以让我们轻松的把上述功能添加到 kubernetes 里。

### Controller

CRD 机制以上述 Kafkasource 为例，如下：

1.  需要把 KafkaSource 这个资源注册到 kubernetes 中，这样 kubernetes 才会知道这个资源。
2.  注册之后，还需要开发一个 controller 组件，来监听用户是否创建了 KafkaSource，也就是部署、更新或者删除如上的 yaml 文件。
3.  Controller 监听到有用户创建了 KafkaSource，就会创建一个 pod 来做相应的工作。

归纳一下就是：

用户向 Kubernetes API 服务注册一个带特定 schema 的资源，并定义相关 API

1.  将扩展资源的数据存储到 Kubernetes 的 etcd 集群。
2.  借助 Kubernetes 提供的 controller 模式开发框架，实现新的 controller，并借助 APIServer 监听 etcd 集群关于该资源的状态并定义状态变化的处理逻辑。

具体流程如下图：

![](/attachments/v2-571462ff67a3dbdafd00881e398adfd7_1440w.jpg)

在这个流程里，大部分是 client-go 为用户提供的框架和逻辑，可以直接使用，灰色的 AddFunc等是用户需要实现的关于该扩展资源的业务逻辑。informer 会借助 APIServer 跟踪该扩展资源定义的变化，一旦被触发就会调用回调函数，并把变更的具体内容放到 Workqueue 中，自定义 controller 里面的 worker会获取Workqueue 里面内容，并进行相应的业务处理。关于Informer的介绍请参考章节：[Kubernetes Informer及client-go资料](https://iwiki.woa.com/pages/viewpage.action?pageId=709639220)

### Operator

`Operator = CRD + Controller`

## 项目开发

一个Operator的开发可以使用KubeBuilder工具，具体请参考：

*   [https://github.com/kubernetes-sigs/kubebuilder](https://github.com/kubernetes-sigs/kubebuilder)
*   [https://cloudnative.to/kubebuilder/introduction.html](https://cloudnative.to/kubebuilder/introduction.html)

## 参考资料

*   [https://zhuanlan.zhihu.com/p/52367044](https://zhuanlan.zhihu.com/p/52367044)
*   [https://kubernetes.io/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/](https://kubernetes.io/zh/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)
*   [https://zhuanlan.zhihu.com/p/114659529](https://zhuanlan.zhihu.com/p/114659529)
*   [https://github.com/kubernetes-sigs/kubebuilder](https://github.com/kubernetes-sigs/kubebuilder)

  

  

  

  

  

  

  

  

  

  

  

