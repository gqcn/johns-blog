---
slug: "/argo-workflow-template-storage"
title: "Argo Workflow及Template数据是如何存储的"
hide_title: true
keywords:
  ["Argo Workflow", "模板存储", "数据持久化", "Kubernetes", "etcd", "状态管理"]
description: "探讨 Argo Workflow 中的模板数据存储机制，包括模板定义的持久化方式和状态数据的管理策略"
---

从之前的源码的梳理我们可以发现，Argo Framework对于Workflow以及其Template数据没有自身的存储逻辑，而是通过KubeClient直接调用Kubernetes的接口处理对象查询、创建、更新、销毁。也就是说，这些数据应该是交给Kubernetes来负责维护的，当然也包括存储。我们都知道Kubernetes底层是使用的etcd服务作为存储，为了验证Workflow/Template数据存储的这一点猜测，我们直接去看Kubernetes中etcd的数据不就行了吗。想不如做，`Let's do it`。

## 一、本地环境

*   为了方便操作，我本地搭建的是`minikube`来愉快玩耍`Kubernetes`，安装的`Kubernetes`版本为`v1.20.7`。
*   本地安装的`argo`版本为`v3.0.3，安装在ago命名空间下`。
*   本地系统为`macOs Big Sur 11.3.1`。
*   当前已经运行了一些实例：

![](/attachments/image2021-7-5_16-34-59.png)

## 二、查看`Kubernetes etcd`

*   进入到`kube-system`命名空间下的`etcd`容器中：

![](/attachments/image2021-7-5_16-41-13.png)

*   为方便操作这里设置一下`etcdctl`的别名：
    
    ```
    alias etcdctl="ETCDCTL_API=3 /usr/local/bin/etcdctl --endpoints= https://127.0.0.1:2379 --cacert=/var/lib/minikube/certs/etcd/ca.crt --cert=/var/lib/minikube/certs/etcd/healthcheck-client.crt --key=/var/lib/minikube/certs/etcd/healthcheck-client.key"
    ```
    
*   随后使用命名 `etcdctl get / --prefix=true --keys-only=true` 查看所有的键名列表，可以看到有很多自定义的 `/registry/[argoproj.io/workflows](http://argoproj.io/workflows)`  为前缀的键名：

![](/attachments/image2021-7-5_16-45-2.png)

可以看到这个前缀跟`WorkflowInformer`注册`ListWatch`时的`Resource`参数有一定的关联关系，第三级的话是`namespace`，第四级的话是`pod`名称。

![](/attachments/image2021-7-7_14-58-56.png)

*   可以看到这里都是`argo`注册的`Workflow CRD`数据，我们拿其中的 `steps-4ttw6(对应官方示例steps.yaml) ` 查看下其中数据是什么样子的：

![](/attachments/image2021-7-5_16-47-18.png)

*   为方便查看，我们将结果格式化一下，由于内容较长，[这里可以点击查看格式化后的文件](#)。

*   可以看到这里面包含了`Workflow`的所有信息（也包括`Workflow`中的`Template`），而这个数据结构正好跟我们上面介绍到的程序中的`Workflow`数据结构一一对应。

## 三、已完成`Workflow`的数据存储

已经执行完成的`Workflow`是有一定的清理策略，默认情况下是永久保留，具体的清理策略介绍请参考下一个常见问题介绍。如果想要将已经完成的`Workflow`数据永久保存下来，官方提供了数据库存储的支持，仅需简单的配置即可将已执行完成的数据保存到`PgSQL/MySQL`数据库中。具体请参考官方文档：[https://argoproj.github.io/argo-workflows/workflow-archive/](https://argoproj.github.io/argo-workflows/workflow-archive/)

  

  

  

