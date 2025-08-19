---
slug: "/cloud-native/specify-root-process-using-exec"
title: "通过exec指令指定容器root进程(wip)"
hide_title: true
keywords: ["Docker", "容器技术", "exec指令", "root进程", "PID 1", "信号处理", "僵尸进程", "容器最佳实践", "tini"]
description: "详细介绍容器中root进程的重要性，以及如何通过exec指令正确指定容器root进程，避免信号处理和僵尸进程问题"
---


## 1. 背景

在容器启动之前，通常需要通过`bash/sh`执行一些`shell`指令再启动主进程。
在这种场景下，开发者通常会将入口执行命令指向到一段`shell`命令或者一个命令文件，同时会引起容器`root`进程（进程号为`1`）变为`bash/sh`进程而不是真实的服务进程。

如果容器的`root`进程（进程号为`1`）是`bash/sh`或`sh`而不是服务进程，会带来以下几个重要问题：

### 1.1 信号处理问题

**问题**：`bash/sh`进程默认不会正确处理和转发信号给子进程
- `docker stop`发送的`SIGTERM`信号可能无法正确传递给实际的服务进程
- 容器停止时可能需要等待超时（默认`10`秒）后被强制杀死（`SIGKILL`）
- 子进程可能无法优雅关闭，导致数据丢失或状态不一致

### 1.2 僵尸进程问题

**问题**：`bash/sh`进程可能无法正确回收子进程
- 当子进程退出时，如果父进程（`bash/sh`）没有正确调用`wait()`，会产生僵尸进程
- 僵尸进程会占用进程表项，长期积累可能导致系统资源耗尽

### 1.3 容器健康检查失效

**问题**：容器编排系统无法正确判断服务状态
- `Kubernetes`的`liveness/readiness`探针可能检测到`bash`进程正常运行，但实际服务进程已经崩溃
- 容器看起来是"健康"的，但实际上服务不可用

### 1.4 资源监控不准确

**问题**：监控系统可能获取错误的进程信息
- 监控工具可能监控到`bash`进程的资源使用情况，而不是实际服务进程
- 影响性能分析和资源规划

## 2. 解决方案


使用`exec`命令替换当前`shell`进程，使服务进程成为`PID 1`。在`shell`脚本中，可以使用`exec`命令替换当前的`shell`进程。这样做的效果是在脚本中执行完`exec`命令后，当前`shell`进程将被替换为新的命令，原始脚本中的任何后续命令都将被忽略。

命令示例：
```bash
#!/bin/bash
# 执行初始化操作
echo "Initializing..."
# 其他准备工作...

# 使用exec替换当前进程，使服务进程成为PID 1
exec your-service-command
```

## 3. 使用示例

为方便演示，这里的服务进程使用`sleep`。

### 3.1 不使用exec启用服务进程

启动脚本如下：

```shell title="shell.sh"
#!/bin/sh

echo "sleep 1d"
sleep 1d
```

`Dockerfile`如下：

```dockerfile title="Dockerfile"
FROM alpine:3.18

COPY ./script.sh /app/script.sh
RUN chmod +x /app/script.sh
ENTRYPOINT ["/app/script.sh"]
```

编译命令：
```bash
docker build . -t test
```

运行容器：
```bash
docker run test:latest
```

查看容器`root`进程：
```bash
docker exec -it <container_id> ps -ef
```

### 3.2 使用exec启用服务进程

启动脚本如下：

```shell title="shell-exec.sh"
#!/bin/sh

echo "sleep 1d"
exec sleep 1d
```

`Dockerfile`如下：

```dockerfile title="Dockerfile"
FROM alpine:3.18

COPY ./script-exec.sh /app/script-exec.sh
RUN chmod +x /app/script-exec.sh
ENTRYPOINT ["/app/script-exec.sh"]
```

编译命令：
```bash
docker build . -t test
```

运行容器：
```bash
docker run test:latest
```

查看容器`root`进程：
```bash
docker exec -it <container_id> ps -ef
```