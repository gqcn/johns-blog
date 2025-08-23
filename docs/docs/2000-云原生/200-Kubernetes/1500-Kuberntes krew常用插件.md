---
slug: "/cloud-native/kubernetes-krew-plugins"
title: "Kuberntes krew常用插件"
hide_title: true
keywords:
  - krew
  - kubectl插件
  - kubernetes插件管理器
  - ns插件
  - ctx插件
  - stern日志
  - view-allocations
  - kubectl-tree
  - node-shell
  - kubectl-images
  - 命名空间切换
  - 集群上下文切换
  - 资源分配查看
  - 多pod日志
  - 节点shell访问
description: "详细介绍Kubernetes krew插件管理器的安装使用，以及ns、ctx、stern、view-allocations、tree、node-shell、images等常用插件的功能特性和使用示例，提高Kubernetes运维效率的必备工具集合。"
---

## 安装krew

`krew`是`K8S`的插件管理器，提供了很多有用的插件，可以大大提高工作效率。安装`krew`请参考官方文档：
https://krew.sigs.k8s.io/docs/user-guide/setup/install/




## 别名配置

根据当前系统设置的默认`shell`工具，修改`~/.bashrc`文件或者`~/.zprofile`文件，添加别名配置。

```bash
alias k=kubectl
```

## 常用插件


### ns

`ns`是一个可以在kubernetes集群里面切换命名空间的插件。你是否厌烦了每次敲`kubectl`命令时都要加上`-n <namespaces>`的参数，又不想在`config`里面维护大量`context`。那么`ns`插件就是来解救你的，它会在切换命名空间时修改当前`config`里面的`context`到当前命名空间，这样你就不用再加`-n`参数了。

> `ns`插件仓库与`ctx`插件源码仓库是同一个。

项目地址：https://github.com/ahmetb/kubectx

安装命令：
```bash
k krew install ns
```

使用示例：
```bash
$ k ns volcano-system
Context "kind-john" modified.
Active namespace is "volcano-system".

$ k get pod
NAME                                   READY   STATUS    RESTARTS   AGE
volcano-admission-5dd7897d96-rwfxn     1/1     Running   0          9d
volcano-controllers-7c58d44b88-bbmwm   1/1     Running   0          9d
volcano-scheduler-65c58864d-5wtd8      1/1     Running   0          8d
```


### ctx

`ctx`是一个可以在`kubernetes`集群里面切换`context`的插件。

> `ns`插件仓库与`ctx`插件源码仓库是同一个。

项目地址：https://github.com/ahmetb/kubectx

安装命令：
```bash
k krew install ctx
```

使用示例：
```bash
# switch to another cluster that's in kubeconfig
$ k ctx minikube
Switched to context "minikube".

# switch back to previous cluster
$ k ctx -
Switched to context "oregon".

# rename context
$ k ctx dublin=gke_ahmetb_europe-west1-b_dublin
Context "gke_ahmetb_europe-west1-b_dublin" renamed to "dublin".

# change the active namespace on kubectl
$ k ns kube-system
Context "test" set.
Active namespace is "kube-system".

# go back to the previous namespace
$ k ns -
Context "test" set.
Active namespace is "default".

# change the active namespace even if it doesn't exist
$ k ns not-found-namespace --force
Context "test" set.
Active namespace is "not-found-namespace".
---
$ k ns not-found-namespace -f
Context "test" set.
Active namespace is "not-found-namespace".
```

### stern

`stern`是一个可以同时查看多个`pod`日志的工具。

> 另外还有一个域`stern`类似的`tail`插件，用于获取最新的流式的日志输出。

项目地址：https://github.com/stern/stern

安装命令：
```bash
k krew install stern
```

使用示例：
```bash
$ k ns volcano-system
Context "kind-john" modified.
Active namespace is "volcano-system".

$ k stern .
volcano-admission-5dd7897d96-rwfxn admission I0821 06:52:39.431924       1 reflector.go:879] volcano.sh/apis/pkg/client/informers/externalversions/factory.go:145: Watch close - *v1beta1.Queue total 11 items received
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.691380       1 cache.go:1455] "SnapShot for scheduling" jobNum=1 QueueNum=3 NodeNum=3
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.691456       1 session.go:230] Open Session d1812087-af68-469e-9fbf-d8b53fb7cef6 with <1> Job and <3> Queues
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.692081       1 enqueue.go:79] Try to enqueue PodGroup to 0 Queues
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.692122       1 allocate.go:81] Try to allocate resource to 1 Queues
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.692138       1 proportion.go:307] Queue <default>: deserved <cpu 0.00, memory 0.00, pods 1.00, ephemeral-storage 0.00, hugepages-1Gi 0.00, hugepages-2Mi 0.00, hugepages-32Mi 0.00, hugepages-64Ki 0.00>, allocated <cpu 0.00, memory 0.00, pods 1.00>, share <1>
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.692166       1 allocate.go:142] Queue <default> is overused, ignore it.
volcano-scheduler-65c58864d-5wtd8 volcano-scheduler I0823 06:27:24.692598       1 session.go:364] Close Session d1812087-af68-469e-9fbf-d8b53fb7cef6
...
```


### view-allocations

`kubectl-view-allocations`可以非常方便的展示CPU、内存、GPU等资源的分布情况，并可以对`namespace`、`node`、`pod`等维度进行展示。

项目地址：https://github.com/davidB/kubectl-view-allocations

安装命令：
```bash
k krew install view-allocations
```

使用示例：
```bash
$ k view-allocations
 Resource                                              Requested         Limit  Allocatable    Free 
  cpu                                                   (4%) 1.1   (1%) 300.0m         30.0    28.9 
  ├─ john-control-plane                             (10%) 950.0m   (1%) 100.0m         10.0     9.1 
  │  ├─ coredns-668d6bf9bc-9r86n                          100.0m            __           __      __ 
  │  ├─ coredns-668d6bf9bc-fpk6t                          100.0m            __           __      __ 
  │  ├─ etcd-john-control-plane                           100.0m            __           __      __ 
  │  ├─ kindnet-xqhbt                                     100.0m        100.0m           __      __ 
  │  ├─ kube-apiserver-john-control-plane                 250.0m            __           __      __ 
  │  ├─ kube-controller-manager-john-control-plane        200.0m            __           __      __ 
  │  └─ kube-scheduler-john-control-plane                 100.0m            __           __      __ 
  ├─ john-worker                                     (1%) 100.0m   (1%) 100.0m         10.0     9.9 
  │  └─ kindnet-978h2                                     100.0m        100.0m           __      __ 
  └─ john-worker2                                    (1%) 100.0m   (1%) 100.0m         10.0     9.9 
     └─ kindnet-2knqv                                     100.0m        100.0m           __      __ 
  ephemeral-storage                                           __            __        2.9Ti      __ 
  ├─ john-control-plane                                       __            __     1006.9Gi      __ 
  ├─ john-worker                                              __            __     1006.9Gi      __ 
  └─ john-worker2                                             __            __     1006.9Gi      __ 
  memory                                            (2%) 390.0Mi  (2%) 490.0Mi       23.0Gi  22.5Gi 
  ├─ john-control-plane                             (4%) 290.0Mi  (5%) 390.0Mi        7.7Gi   7.3Gi 
  │  ├─ coredns-668d6bf9bc-9r86n                          70.0Mi       170.0Mi           __      __ 
  │  ├─ coredns-668d6bf9bc-fpk6t                          70.0Mi       170.0Mi           __      __ 
  │  ├─ etcd-john-control-plane                          100.0Mi            __           __      __ 
  │  └─ kindnet-xqhbt                                     50.0Mi        50.0Mi           __      __ 
  ├─ john-worker                                     (1%) 50.0Mi   (1%) 50.0Mi        7.7Gi   7.6Gi 
  │  └─ kindnet-978h2                                     50.0Mi        50.0Mi           __      __ 
  └─ john-worker2                                    (1%) 50.0Mi   (1%) 50.0Mi        7.7Gi   7.6Gi 
     └─ kindnet-2knqv                                     50.0Mi        50.0Mi           __      __ 
  pods                                                 (5%) 17.0     (5%) 17.0        330.0   313.0 
  ├─ john-control-plane                                 (8%) 9.0      (8%) 9.0        110.0   101.0 
  ├─ john-worker                                        (5%) 5.0      (5%) 5.0        110.0   105.0 
  └─ john-worker2                                       (3%) 3.0      (3%) 3.0        110.0   107.0
```


### tree

该插件是由`Google`大佬开发，通过`ownerReferences`来发现`kubernetes`对象之间的相互关联，并通过树状图来展示，对资源的关系一目了然。

项目地址：https://github.com/ahmetb/kubectl-tree

安装命令：
```bash
k krew install tree
```

使用示例：
```bash
$ k ns volcano-system
Context "kind-john" modified.
Active namespace is "volcano-system".

$ k get deploy
NAME                  READY   UP-TO-DATE   AVAILABLE   AGE
volcano-admission     1/1     1            1           9d
volcano-controllers   1/1     1            1           9d
volcano-scheduler     1/1     1            1           9d

$ k tree deploy volcano-scheduler
NAMESPACE       NAME                                       READY  REASON  AGE
volcano-system  Deployment/volcano-scheduler               -              9d 
volcano-system  ├─ReplicaSet/volcano-scheduler-65c58864d   -              8d 
volcano-system  │ └─Pod/volcano-scheduler-65c58864d-5wtd8  True           8d 
volcano-system  ├─ReplicaSet/volcano-scheduler-77cdd888b9  -              8d 
volcano-system  └─ReplicaSet/volcano-scheduler-986f77795   -              9d 
```

### node-shell

`node-shell`插件可以让你直接在`node`上执行`shell`命令，而不需要登录到`node`上。

项目地址：https://github.com/kvaps/kubectl-node-shell

安装命令：
```bash
k krew install node-shell
```

使用示例：
```bash
$ k get node
NAME                 STATUS   ROLES           AGE   VERSION
john-control-plane   Ready    control-plane   9d    v1.32.2
john-worker          Ready    <none>          9d    v1.32.2
john-worker2         Ready    <none>          9d    v1.32.2

$ k node-shell john-worker
spawning "nsenter-8xhpq5" on "john-worker"
If you don't see a command prompt, try pressing enter.
root@john-worker:/# 
```

### images

`kubectl-images`可以展示集群中正在使用的镜像，并对`namespace`进行一个简单的统计。使用这个插件可以非常方便的查看`namespace`中使用了哪些镜像，尤其在排查问题需要查看镜像版本时非常有用。

安装命令：
```bash
k krew install images
```

使用示例：
```bash
$ k images -A
[Summary]: 4 namespaces, 17 pods, 17 containers and 12 different images
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
|                    Pod                     |        Container        |                              Image                              |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| example-deployment-9488676d4-ttb6h         | nginx                   | nginx:1.14.2                                                    |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| coredns-668d6bf9bc-9r86n                   | coredns                 | registry.k8s.io/coredns/coredns:v1.11.3                         |
+--------------------------------------------+                         +                                                                 +
| coredns-668d6bf9bc-fpk6t                   |                         |                                                                 |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| etcd-john-control-plane                    | etcd                    | registry.k8s.io/etcd:3.5.16-0                                   |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| kindnet-2knqv                              | kindnet-cni             | docker.io/kindest/kindnetd:v20250214-acbabc1a                   |
+--------------------------------------------+                         +                                                                 +
| kindnet-978h2                              |                         |                                                                 |
+--------------------------------------------+                         +                                                                 +
| kindnet-xqhbt                              |                         |                                                                 |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| kube-apiserver-john-control-plane          | kube-apiserver          | registry.k8s.io/kube-apiserver:v1.32.2                          |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| kube-controller-manager-john-control-plane | kube-controller-manager | registry.k8s.io/kube-controller-manager:v1.32.2                 |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| kube-proxy-bmff8                           | kube-proxy              | registry.k8s.io/kube-proxy:v1.32.2                              |
+--------------------------------------------+                         +                                                                 +
| kube-proxy-f2fkv                           |                         |                                                                 |
+--------------------------------------------+                         +                                                                 +
| kube-proxy-nxd7w                           |                         |                                                                 |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| kube-scheduler-john-control-plane          | kube-scheduler          | registry.k8s.io/kube-scheduler:v1.32.2                          |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| local-path-provisioner-7dc846544d-74xnp    | local-path-provisioner  | docker.io/kindest/local-path-provisioner:v20250214-acbabc1a     |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| volcano-admission-5dd7897d96-rwfxn         | admission               | docker.io/volcanosh/vc-webhook-manager:v1.12.1                  |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| volcano-controllers-7c58d44b88-bbmwm       | volcano-controllers     | docker.io/volcanosh/vc-controller-manager:v1.12.1               |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
| volcano-scheduler-65c58864d-5wtd8          | volcano-scheduler       | volcanosh/vc-scheduler:80eea1df4b922773c47ac4f8e483b48a3ccc7090 |
+--------------------------------------------+-------------------------+-----------------------------------------------------------------+
```
