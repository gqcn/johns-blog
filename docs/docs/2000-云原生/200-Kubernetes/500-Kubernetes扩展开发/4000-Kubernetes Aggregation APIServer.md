---
slug: "/cloud-native/kubernetes-aggregation-apiserver"
title: "Kubernetes Aggregation APIServer"
hide_title: true
keywords:
  [
    "Kubernetes",
    "Aggregation Layer",
    "APIServer",
    "扩展API",
    "自定义资源",
    "认证授权",
  ]
description: "详细说明 Kubernetes Aggregation APIServer 的原理和实现方法，包括如何创建和配置扩展 API"
---

我们自定义扩展Kubernetes的能力通常有两种方式：CRD及Aggregation Layer。CRD的介绍请参考章节：[Kubernetes CRD, Controller, Operator](https://iwiki.woa.com/display/~txqiangguo/Kubernetes+CRD%2C+Controller%2C+Operator)，本文我们简单介绍一下Aggregation Layer。

## 基本介绍

![](/attachments/prku_0401.png)

Kubernetes API内部的请求转发模型

### 聚合层

聚合层在 kube-apiserver 进程内运行。在扩展资源注册之前，聚合层不做任何事情。 要注册 API，用户必须添加一个 APIService 对象，用它来“申领” Kubernetes API 中的 URL 路径。 自此以后，聚合层将会把发给该 API 路径的所有内容（例如  `/apis/[myextension.mycompany.io/v1/…](http://myextension.mycompany.io/v1/…)` ） 转发到已注册的 APIService。

APIService 的最常见实现方式是在集群中某 Pod 内运行  *扩展 API 服务器*。 如果你在使用扩展 API 服务器来管理集群中的资源，该扩展 API 服务器（也被写成“extension-apiserver”） 一般需要和一个或多个控制器一起使用。 apiserver-builder 库同时提供构造扩展 API 服务器和控制器框架代码。

### 反应延迟

扩展 API 服务器与 kube-apiserver 之间需要存在低延迟的网络连接。 发现请求需要在五秒钟或更短的时间内完成到 kube-apiserver 的往返。

如果你的扩展 API 服务器无法满足这一延迟要求，应考虑如何更改配置已满足需要。

### 扩展方式对比

关于是否选择CRD还是AggregationAPI来实现自定义扩展的对比：[https://kubernetes.feisky.xyz/extension/api](https://kubernetes.feisky.xyz/extension/api)

## 开启 API Aggregation

kube-apiserver 增加以下配置：

```bash
--requestheader-client-ca-file=<path to aggregator CA cert>
--requestheader-allowed-names=aggregator
--requestheader-extra-headers-prefix=X-Remote-Extra-
--requestheader-group-headers=X-Remote-Group
--requestheader-username-headers=X-Remote-User
--proxy-client-cert-file=<path to aggregator proxy cert>
--proxy-client-key-file=<path to aggregator proxy key>
```

如果 `kube-proxy` 没有在 Master 上面运行，还需要配置：

```bash
--enable-aggregator-routing=true
```

## 创建扩展 API

1.  确保开启 APIService API（默认开启，可用 `kubectl get apiservice` 命令验证）

2.  创建 RBAC 规则

3.  创建一个 namespace，用来运行扩展的 API 服务

4.  创建 CA 和证书，用于 https

5.  创建一个存储证书的 secret

6.  创建一个部署扩展 API 服务的 deployment，并使用上一步的 secret 配置证书，开启 https 服务

7.  创建一个 ClusterRole 和 ClusterRoleBinding

8.  创建一个非 namespace 的 apiservice，注意设置 `spec.caBundle`

9.  运行 `kubectl get <resource-name>`，正常应该返回 `No resources found.`


可以使用 [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder) 工具自动化上面的步骤。

```bash
## 初始化项目
$ cd GOPATH/src/github.com/my-org/my-project
$ apiserver-boot init repo --domain <your-domain>
$ apiserver-boot init glide

## 创建资源
$ apiserver-boot create group version resource --group <group> --version <version> --kind <Kind>

## 编译
$ apiserver-boot build executables
$ apiserver-boot build docs

## 本地运行
$ apiserver-boot run local

## 集群运行
$ apiserver-boot run in-cluster --name nameofservicetorun --namespace default --image gcr.io/myrepo/myimage:mytag
$ kubectl create -f sample/<type>.yaml
```

## 参考示例

见 [sample-apiserver](https://github.com/kubernetes/sample-apiserver) 和 [apiserver-builder/example](https://github.com/kubernetes-incubator/apiserver-builder/tree/master/example)。

## 参考资料

*   [https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
*   [https://www.yisu.com/zixun/9840.html](https://www.yisu.com/zixun/9840.html)
*   [https://blog.csdn.net/u012986012/article/details/105755943](https://blog.csdn.net/u012986012/article/details/105755943)
*   [https://kubernetes.feisky.xyz/extension/api/aggregation](https://kubernetes.feisky.xyz/extension/api/aggregation)
*   [https://medium.com/@vanSadhu/kubernetes-api-aggregation-setup-nuts-bolts-733fef22a504](https://medium.com/@vanSadhu/kubernetes-api-aggregation-setup-nuts-bolts-733fef22a504)
*   [https://www.oreilly.com/library/view/programming-kubernetes/9781492047094/ch04.html](https://www.oreilly.com/library/view/programming-kubernetes/9781492047094/ch04.html)
*   [https://draveness.me/cloud-native-kubernetes-extension/](https://draveness.me/cloud-native-kubernetes-extension/)

  

  

  

  

  

  

  

  

