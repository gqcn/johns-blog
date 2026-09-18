---
slug: "/cloud-native/docker-cross-platform-build"
title: "Docker跨平台镜像构建"
hide_title: true
keywords:
  [
    "Docker",
    "buildx",
    "跨平台构建",
    "多平台镜像",
    "docker buildx",
    "linux/amd64",
    "linux/arm64",
    "多架构镜像",
    "ARM镜像",
    "x86镜像",
    "构建器",
    "docker-container",
    "QEMU",
    "容器镜像",
    "镜像推送",
    "Docker Hub",
    "构建驱动",
  ]
description: "详细介绍如何使用Docker buildx工具在单台机器上构建支持多种CPU架构的容器镜像，包括安装docker-buildx插件、创建并配置docker-container驱动的构建器、执行跨平台构建并将镜像推送至镜像仓库等完整操作流程，适用于需要同时支持amd64与arm64架构的业务场景。"
---

## 背景

随着`ARM`架构服务器的普及（如`AWS Graviton`、华为鲲鹏、苹果`Apple Silicon`等），越来越多的业务需要同时在`amd64`和`arm64`平台上运行容器。传统方式需要在对应架构的机器上分别构建镜像，再通过`manifest`手动合并，操作繁琐且容易出错。

`Docker buildx`是官方提供的跨平台构建插件，基于`QEMU`用户态模拟和`BuildKit`后端，可以在单台机器上一次性构建出多架构的镜像，并将其以`manifest list`的形式推送到镜像仓库。拉取镜像时，`Docker`会自动根据当前宿主机架构选取匹配的镜像层，无需额外配置。

## 安装docker-buildx插件

在`Ubuntu`系统上，`docker-buildx`作为独立软件包提供，执行以下命令安装：

```bash
apt install -y docker-buildx
```

安装完成后，可通过以下命令验证插件是否可用：

```bash
docker buildx version
```

## 创建构建器

默认的`docker`驱动不支持多平台构建，直接执行跨平台构建命令会出现如下报错：

```
ERROR: failed to build: Multi-platform build is not supported for the docker driver.
Switch to a different driver, or turn on the containerd image store, and try again.
Learn more at https://docs.docker.com/go/build-multi-platform/
```

需要创建一个使用`docker-container`驱动的构建器，该驱动会以容器的形式运行`BuildKit`，支持多平台构建：

```bash
docker buildx create --name mybuilder --driver docker-container --use
```

参数说明如下：

| 参数 | 说明 |
| --- | --- |
| `--name mybuilder` | 构建器的名称，可自定义 |
| `--driver docker-container` | 使用`docker-container`驱动，以容器方式运行`BuildKit` |
| `--use` | 创建后立即将其设为当前活跃构建器 |

## 启动并检查构建器

创建构建器后，需要使用`inspect`命令初始化并启动`BuildKit`容器，同时确认构建器支持的目标平台列表：

```bash
docker buildx inspect mybuilder --bootstrap
```

命令执行成功后，输出示例如下：

```
Name:          mybuilder
Driver:        docker-container
Last Activity: 2026-05-06 ...

Nodes:
Name:                  mybuilder0
Endpoint:              unix:///var/run/docker.sock
Status:                running
BuildKit daemon flags: --allow-insecure-entitlement=network.host
Platforms:             linux/amd64, linux/arm64, linux/arm/v7, ...
```

若`Platforms`列表中包含`linux/amd64`和`linux/arm64`，则说明构建器已就绪。

## 执行跨平台构建

构建器准备完成后，使用如下命令构建多架构镜像并直接推送到镜像仓库：

```bash
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t loads/ubuntu:24.04-with-ca \
  -f Dockerfile \
  . \
  --push
```

参数说明如下：

| 参数 | 说明 |
| --- | --- |
| `--platform linux/amd64,linux/arm64` | 指定目标平台，多个平台用逗号分隔 |
| `-t loads/ubuntu:24.04-with-ca` | 镜像名称及标签 |
| `-f Dockerfile` | 指定`Dockerfile`路径 |
| `.` | 构建上下文目录 |
| `--push` | 构建完成后自动推送到镜像仓库 |

> 注意：多平台构建结果无法保存到本地`docker images`，必须配合`--push`推送到远端仓库，或使用`--output type=oci`导出为本地文件。

## 完整流程

```mermaid
flowchart LR
    A[安装 docker-buildx 插件] --> B[创建 docker-container 驱动构建器]
    B --> C[启动并检查构建器]
    C --> D[执行跨平台构建并推送]
    D --> E[镜像仓库中包含 amd64/arm64 两个架构层]
```

## 常见问题

**构建时提示无法拉取基础镜像**

跨平台构建时，`BuildKit`容器需要访问外网以拉取基础镜像。若网络受限，可预先配置镜像加速代理，或使用`--build-arg GOPROXY`等方式指定代理。

**构建器状态异常**

若构建器异常，可删除后重新创建：

```bash
docker buildx rm mybuilder
docker buildx create --name mybuilder --driver docker-container --use
```

**本地验证多架构镜像**

镜像推送完成后，可通过以下命令查看`manifest`确认多架构信息：

```bash
docker buildx imagetools inspect loads/ubuntu:24.04-with-ca
```
