---
slug: "/cloud-native/kubernetes-pod-stuck-issues"
title: "Pod stuck in ContainerCreating/Terminating"
hide_title: true
keywords:
  [
    "Kubernetes",
    "Pod",
    "ContainerCreating",
    "Terminating",
    "问题排查",
    "容器状态",
    "Docker",
  ]
description: "分析和解决 Kubernetes Pod 卡在 ContainerCreating 或 Terminating 状态的问题，包括问题排查和解决方案"
---

## 问题描述

`kubernetes`版本：`v1.22.5`

部分`Pod`在新版本发布后一直处于`ContainerCreating`状态，经过`kubectl delete`命令删除后一直`Terminating`状态。

![](/attachments/image-2024-4-16_16-33-32.png)

## 排查过程

### 遇到问题先查日志

首先进入宿主机，查看三个日志，按照`pod`名称及`imageid`进行筛选。其中`pod`名称为`khaos-guardian-bmzsk` ，`imageid`为`1da9e4f1-a5d4-40db-b8bc-4db1d27ca458`。

*   `kubelet`日志：`journalctl -u kubelet | grep khaos-guardian-bmzsk ` 
*   `docker`日志：`journalctl -u docker | grep 1da9e4f1-a5d4-40db-b8bc-4db1d27ca458`
*   系统日志：`cd /var/log && grep khaos-guardian-bmzsk  messages`

花费了不少时间检索日志，**实际上没有找到任何有用的信息**。

### 配置细节排查

我们可以看到整个集群只有这个`daemonset`的`pod`出现过这个问题，其他的`pod`没有出现，那么可能问题出在这个`daemonset`的某些配置引发的这个问题。但这个`daemonset`的配置比较复杂，并且包含`4`个`container`，所以这块排查起来很吃力，也比较浪费时间。经过细节的梳理，以及团队内部同学的协作，我们最终发现是有两个配置项引发的问题。

*   `hostPID`
*   `lifecycle.postStart`

#### hostPID

官方文档：[https://kubernetes.io/docs/concepts/security/pod-security-standards/](https://kubernetes.io/docs/concepts/security/pod-security-standards/)

配置到`pod spec`中，用于让`Pod`中的所有容器感知宿主机的进程信息，并且执行进程管理。

此外，相关联的还有一个`shareProcessNamespace`配置，也是配置到`pod spec`中，用于单`pod`多`container`场景下让`pod`下的`container`相互感知`pid`，具体介绍：[https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/](https://kubernetes.io/docs/tasks/configure-pod-container/share-process-namespace/)

#### lifecycle.postStart

用于在指定`container`成功`Running`后执行一些自定义脚本，具体介绍：[https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/](https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/)

![](/attachments/image-2024-4-16_17-9-27.png)

![](/attachments/image-2024-4-16_16-36-18.png)

### 相关联的docker bug

这里与`hostPID/shareProcessNamespace`相关的有一个`docker`的`bug`：[https://github.com/kubernetes/kubernetes/issues/92214](https://github.com/kubernetes/kubernetes/issues/92214)

当开启进程信息共享时，如果对`docker`容器执行`exec`命令，并且`docker`容器先于`exec`进程退出，那么此时`exec`的执行会卡住。

#### docker bug复现过程

通过`docker run`运行一个容器：

```bash
docker run -d --pid=host --rm --name nginx nginx
```

在另一个终端执行`docker exec`指令：

```bash
docker exec -it nginx sh
```

随后`kill`容器：

```bash
docker kill nginx
```

可以看到当`kill`掉容器后，对应的`exec`进程此时卡住了，无法退出，只能强行关闭终端解决。 

### Kubernetes Pod管理细节

如果想要了解这个`docker bug`对`pod`生命周期的影响，我们来看看`kubernetes`源码中的`pod`创建流程。首先了解一个背景，`kubernetes`的每一个`pod`在`kubelet`中都对应有一个`goroutine`一一对应来管理维护其`reconcile`，即任何`pod spec`的变更或者宿主机`container status`的变化都由该`goroutine`来保证执行和同步。

#### SyncPod

每当`Pod Spec`变化时，例如创建时，会按照`EphemeralContainers、InitContainers、Containers`依次执行容器创建。具体参考：[https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime\_manager.go#L1048](https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime_manager.go#L1048)

![](/attachments/image-2024-4-16_18-2-48.png)

:::tip
这种创建虽然在`kubernetes`中是顺序执行的，但是宿主机的容器启动成功却是异步的，不能保证顺序性。
有的容器可能在最开始执行创建，但是可能在最后才运行成功。
:::

但是，如果容器中存在`PostStart`脚本，那么将会阻塞后续容器的创建，需要等待`PostStart`脚本执行完成后才会继续执行。具体参考：[https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime\_container.go#L297](https://github.com/kubernetes/kubernetes/blob/b722d017a34b300a2284b890448e5a605f21d01e/pkg/kubelet/kuberuntime/kuberuntime_container.go#L297)

![](/attachments/image-2024-4-16_17-59-57.png)

如果底层是`docker`，那么这里使用的便正是`docker exec`命令来实现的`PostStart`自定义脚本执行。

## 解决问题

找到问题根因后，解决目前集群中`Terminating`的`Pod`就比较简单了。

step1：检索出`Terminating`的`Pod`

```bash
kubectl get pod -n xxx -owide | grep Terminating
```

step2：进入宿主机干掉`docker`容器

```bash
kubectl node-shell x.x.x.x
docker ps -a | grep xxx
docker rm -f xxx
exit
```

step3：退出宿主机，强删对应的`Pod`

```bash
kubectl delete -n xxx pod/xxx --force
```

操作记录：

![](/attachments/image-2024-4-16_16-43-36.png)

![](/attachments/image-2024-4-16_16-42-9.png)

  

## 问题总结

*   尽量不要使用`docker`作为底层容器管理工具。
*   尽量不要在`pod`中使用`postStart`自定义脚本。

  

  

  

  

  

  

