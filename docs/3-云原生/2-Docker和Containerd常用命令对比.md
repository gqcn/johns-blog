---
slug: "/cloud-native/docker-containerd-commands"
title: "Docker和Containerd常用命令对比"
hide_title: true
keywords:
  [
    "Docker",
    "Containerd",
    "crictl",
    "ctr",
    "容器命令",
    "命令对比",
    "容器运维",
    "容器管理",
  ]
description: "详细对比 Docker、Containerd (crictl) 和 ctr 的常用命令，帮助用户在不同容器运行时环境下进行容器操作和管理"
---

| 命令  | docker | crictl（推荐） | ctr |
| --- | --- | --- | --- |
| **查看容器列表** | `docker ps` | `crictl ps` | `ctr -n k8s.io c ls` |
| **查看容器详情** | `docker inspect` | `crictl inspect` | `ctr -n k8s.io c info` |
| **查看容器日志** | `docker logs` | `crictl logs` | 无   |
| **容器内执行命令** | `docker exec` | `crictl exec` | 无   |
| **挂载容器** | `docker attach` | `crictl attach` | 无   |
| **容器资源使用** | `docker stats` | `crictl stats` | 无   |
| **创建容器** | `docker create` | `crictl create` | `ctr -n k8s.io c create` |
| **启动容器** | `docker start` | `crictl start` | `ctr -n k8s.io run` |
| **停止容器** | `docker stop` | `crictl stop` | 无   |
| **删除容器** | `docker rm` | `crictl rm` | `ctr -n k8s.io c del` |
| **查看镜像列表** | `docker images` | `crictl images` | `ctr -n k8s.io i ls` |
| **查看镜像详情** | `docker inspect` | `crictl inspecti` | 无   |
| **拉取镜像** | `docker pull` | `crictl pull` | `ctr -n k8s.io i pull` |
| **推送镜像** | `docker push` | 无   | `ctr -n k8s.io i push` |
| **删除镜像** | `docker rmi` | `crictl rmi` | `ctr -n k8s.io i rm` |
| **查看Pod列表** | 无   | `crictl pods` | 无   |
| **查看Pod详情** | 无   | `crictl inspectp` | 无   |
| **启动Pod** | 无   | `crictl runp` | 无   |
| **停止Pod** | 无   | `crictl stopp` | 无   |