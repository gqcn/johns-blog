---
slug: "/cloud-native/argo-workflow-development-setup"
title: "Argo Workflow开发环境搭建"
hide_title: true
keywords:
  [
    "Argo Workflow",
    "开发环境",
    "环境搭建",
    "Kubernetes",
    "本地开发",
    "调试配置",
  ]
description: "详细介绍如何搭建 Argo Workflow 的本地开发环境，包括必要的工具安装、配置步骤和开发调试指南"
---



`Argo Workflow`官方有一篇关于本地运行`Argo Workflow`的介绍：[https://argoproj.github.io/argo-workflows/running-locally/](https://argoproj.github.io/argo-workflows/running-locally/)。

本地搭建的Argo Workflow基于`v3.1.5`版本，搭建开发环境也踩了一些坑，做下笔记，方便后面的同学有所准备。

## 一、服务准备


:::warning
`MacOS`环境先安装好`brew`命令：[https://brew.sh/](https://brew.sh/)
:::

### 1、Golang

至少安装`v1.15`以上版本。

### 2、Yarn

```bash
brew install yarn
```

### 3、Docker

[https://docs.docker.com/docker-for-mac/install/](https://docs.docker.com/docker-for-mac/install/)

### 4、Kustomize

当前使用到的是v3.8.8版本：[https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize/v3.8.8](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv3.8.8)

下载对应的预编译二进制打包文件，解压后拷贝一份放到`$GOPATH/bin`目录下（全局用）；再拷贝一份到`argo-workflow`项目的`dist`目录下（后面argo编译的时候需要）。

### 5、Protoc

```bash
brew install protobuf
```

### 6、Minikube

[https://minikube.sigs.k8s.io/docs/start/](https://minikube.sigs.k8s.io/docs/start/)

## 三、设置hosts别名

便于后续服务的内部别名访问，修改 `/etc/hosts`：

```text
127.0.0.1 dex
127.0.0.1 minio
127.0.0.1 postgres
127.0.0.1 mysql
```

## 四、编译运行服务

### 1、使用本地MySQL

由于我本地安装有mysql，因此argo-workflows项目安装的mysql会与我本地的端口号冲突。于是在我本地的MySQL上创建一个argo数据库以及对应的账号，不使用minikube中的MySQL服务。

#### 1）创建`argo`数据库以及`mysql`账号

```sql
CREATE DATABASE `argo`;
CREATE USER 'mysql'@'%' IDENTIFIED BY 'password';
GRANT ALL ON argo.* TO 'mysql'@'%';
```

#### 2）注释掉`argo-workflows`项目中的端口转发

![](/attachments/image2021-8-9_16-34-51.png)

### 2、执行代码编译&运行

在argo-workflows项目根目录下执行以下命令执行编译安装argo-workflows相关服务到本地，并在minikube中创建相应的argo资源：

```bash
make start PROFILE=mysql
```

编译将会使用`mysql`服务（默认使用的是`pgsql`）。

:::tip
当argo相关服务启动后，可以发现argo数据库被初始化了相关数据表。
![](/attachments/image2021-8-9_16-36-46.png)
:::

## 五、检查服务状态

### 1、`Argo Server API`

[http://localhost:2746](http://localhost:2746)

:::warning
注意查看终端日志输出信息，不是HTTPS访问。
:::

### 2、`Argo UI`

[http://localhost:8080](http://localhost:8080)

:::warning
初次访问的时候会比较慢，注意查看终端日志输出信息。
:::

### 3、`MinIO UI`

[http://localhost:9000](http://localhost:9000) 

账号：`admin`

密码：`password`

## 六、构建Image镜像

:::info
正常完整编译约5分钟左右。
:::

### 1、构建镜像

**这一步是非常重要的，否则你无法创建workflow资源，因为argo相关的image在本地没有，拉取镜像会失败。**执行以下命令编译即可：

```bash
eval $(minikube -p minikube docker-env) && make build
```

:::tip
其中的 `eval $(minikube -p minikube docker-env)` 命令用以设置当前的`Docker`为`Minikube`的`Docker`，后续常见错误中有介绍。
:::

### 2、常见错误

#### 1）checksum mismatch

如果遇到`checksum mismatch`的问题：

![](/attachments/image2021-8-9_11-43-11.png)

由于编译是使用的`Docker`执行，因此找到`Dockerfile`对应的地址，去掉`go.sum`即可。

![](/attachments/image2021-8-23_16-53-20.png)

#### `2）unrecognized import path "golang.org/x/sys": reading https://golang.org/x/sys?go-get=1: 404 Not Found`

编译阶段报错：

![](/attachments/image2021-8-23_15-48-23.png)

可能由于`GFW`的关系无法访问对应的地址，在国内想好好撸代码真的是太不容易了，在`go.mod`中增加一个`replace`吧：

```go
golang.org/x/sys => github.com/golang/sys v0.0.0-20200317113312-5766fd39f98d
```

#### 3）`FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory`

![](/attachments/image2021-8-9_14-31-29.png)

我花了数个小时没有解决通该问题，由于本次开发不会涉及到UI的修改，因此可以把`Dockerfile`中涉及到`ui`的部分注释掉。随后重新执行编译命令即可。

![](/attachments/image2021-8-25_19-41-24.png)

![](/attachments/image2021-8-25_19-41-14.png)

#### `4）Container image "argoproj/argoexec:latest" is not present with pull policy of Never`

运行阶段报错：

![](/attachments/image2021-8-9_15-43-55.png)

`参考argo官方issue：[https://github.com/argoproj/argo-workflows/issues/3672](https://github.com/argoproj/argo-workflows/issues/3672)`

主要原因也就是说`Minikube`使用的`Docker`和系统安装的`Docker`不一样，我们之前编译的镜像在默认情况下都是编译到了系统的`Docker`上。因此我们需要在编译的Shell终端上执行一下 `eval $(minikube -p minikube docker-env)` 命令，设置当前的`Docker`为`Minikube`的`Docker`，随后重新执行编译即可：

```bash
eval $(minikube -p minikube docker-env) && make build
```

#### 3、编译镜像结果

![](/attachments/image2021-8-9_15-9-35.png)