---
slug: "/goland-remote-debug"
title: "使用goland remote debug远程调试"
hide_title: true
keywords:
  ["Goland", "远程调试", "dlv", "Remote Debug", "Kubernetes", "调试工具"]
description: "详细说明如何使用 Goland IDE 的 Remote Debug 功能进行远程调试，包括 dlv 工具的安装和配置过程"
---

当我们需要特定的运行环境才能复现某些疑难问题，通过`goland`的`remote debug`功能可以实现很方便的远程调试，快速定位问题。我这里以远程调试`Kubernetes`集群中的`golang`程序为示例演示如何使用`goland`的`remote debug`功能。

## 安装dlv工具

是的，你没猜错，这个玩意是拿来远程交互`debug`工作的：[https://github.com/go-delve/delve](https://github.com/go-delve/delve)

通过手动编译安装，命令如下，注意这和官方提供的命令有出入，以我的为准：

```bash
git clone https://github.com/go-delve/delve
cd delve/cmd/dlv
CGO_ENABLED=0 go build -o dlv main.go

## 拷贝工具到容器
kubectl cp ./dlv khaos/khaos-guardian-x7j9t:/app/ -c metrics-agent
```

## 重新编译程序

需要添加`-gcflags`参数，给编译器传递`-N -l`参数，禁止编译器优化和内联：

```bash
CGO_ENABLED=0 go build -gcflags "all=-N -l" main.go

## 拷贝程序到容器
kubectl cp ./main khaos/khaos-guardian-x7j9t:/app/ -c metrics-agent
```

## 进容器执行程序

使用`dlv`工具执行程序的语法如下：

```bash
dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./demo
```

如果程序需要运行参数，那么需要加上`--`，例如：

```bash
dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./demo -- --c=/config
## 等同于
./demo --c=/config
```

因此我的程序的执行命令如下：

```bash
./dlv --listen=:2345 --headless=true --api-version=2 --accept-multiclient exec ./main -- --debug=true --address=:13047 --nodeIP=21.0.44.12 --rootPath=/khaos/root --agentConfigFilePath=/var/run/khaos-guardian/metricsconfig/config.yaml --kubeStateUrl=http://127.0.0.1:13043/metrics --enabledPlugins=.+
```

##  执行反向代理到dlv

使用`kubectl`的`port-forward`命令：

```bash
kubectl -n khaos port-forward pod/khaos-guardian-8p2gx 2345:2345 --address 0.0.0.0
```

## 开启goland remote debug

增加`Go Remote`配置即可。可以看到，这里的`IDE`也有提示如何开启远程调试的步骤。

![](/attachments/image-2024-5-24_15-31-18.png)

  

  

  

  

  

  

  

  

  

