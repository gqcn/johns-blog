---
slug: /cloud-native/docker-permission-issue
title: 解决非root用户没有权限运行docker命令的问题
hide_title: true
description: 解决非root用户没有权限运行docker命令的问题，包括添加用户到docker组的方法
keywords: [Docker, 权限, Unix socket, 用户组, Linux, 非root用户]
---

## 问题描述

```bash
Got permission denied while trying to connect to the Docker daemon
socket at unix:///var/run/docker.sock: Get
http://%2Fvar%2Frun%2Fdocker.sock/v1.26/images/json: dial unix
/var/run/docker.sock: connect: permission denied
```

## 原因（摘自docker手册）

> Manage Docker as a non-root user
>
> The docker daemon binds to a Unix socket instead of a TCP port. By
default that Unix socket is owned by the user root and other users can
only access it using sudo. The docker daemon always runs as the root
user.
>
> If you don’t want to use sudo when you use the docker command, create
a Unix group called docker and add users to it. When the docker daemon
starts, it makes the ownership of the Unix socket read/writable by the
docker group.

答案显而易见，要不用root用户，要不创建一个名为docker的用户组，并把你需要使用docker的非root用户添加到该组中，如果还不会搞，继续往下看。

## 方法1
使用`sudo`获取管理员权限，运行`docker`命令，这个方法在通过脚本执行`docker`命令的时候会有很多局限性

## 方法2

`docker`守护进程启动的时候，会默认赋予名为`docker`的用户组读写`Unix socket`的权限，因此只要创建`docker`用户组，并将当前用户加入到`docker`用户组中，那么当前用户就有权限访问`Unix socket`了，进而也就可以执行`docker`相关命令

```bash
sudo groupadd docker         #添加docker用户组
sudo gpasswd -a $USER docker #将登陆用户加入到docker用户组中
newgrp docker                #更新用户组
```
