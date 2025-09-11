---
slug: "/cloud-native/volcano-startup-parameters"
title: "Volcano启动参数"
hide_title: true
keywords:
  [
    "Volcano", "启动参数", "scheduler", "controller-manager", "admission", "webhook-manager", "配置参数", "命令行参数", "vc-scheduler", "vc-controller-manager", "vc-webhook-manager"
  ]
description: "详细介绍Volcano调度系统中scheduler、controller-manager和admission三个核心组件的所有启动参数，包括参数名称、类型、默认值和说明，帮助用户正确配置和部署Volcano组件。"
---


本文档详细介绍`Volcano`调度系统中`scheduler`、`controller-manager`和`admission`核心组件的启动参数配置。

## 1. Scheduler

`volcano-scheduler`是`Volcano`的核心调度组件，负责`Pod`的调度决策。

镜像默认启动参数：
```bash
--logtostderr
--scheduler-conf=/volcano.scheduler/volcano-scheduler.conf
--enable-healthz=true
--enable-metrics=true
--leader-elect=false
--kube-api-qps=2000
--kube-api-burst=2000
--schedule-period=1s
--node-worker-threads=20
-v=3
2>&1
```

### 1.1 基础配置参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--master` | `string` |  | `Kubernetes API`服务器地址（覆盖`kubeconfig`中的值） |
| `--kubeconfig` | `string` |  | `kubeconfig`文件路径，包含授权和master位置信息 |
| `--scheduler-name` | `[]string` | `["volcano"]` | 调度器名称，只处理`.spec.SchedulerName`匹配的`Pod` |
| `--scheduler-conf` | `string` |  | 调度器配置文件的绝对路径 |
| `--schedule-period` | `duration` | `1s` | 每个调度周期的间隔时间 |
| `--resync-period` | `duration` | `0` | `Kubernetes`原生`informer`工厂的默认重新同步周期 |
| `--default-queue` | `string` | `default` | 作业的默认队列名称 |

### 1.2 网络和安全参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--listen-address` | `string` | `:8080` | `HTTP`请求监听地址 |
| `--healthz-address` | `string` | `:11251` | 健康检查服务器监听地址 |
| `--ca-cert-file` | `string` |  | `HTTPS`的`x509`证书文件 |
| `--tls-cert-file` | `string` |  | `HTTPS`的默认`x509`证书文件 |
| `--tls-private-key-file` | `string` |  | 与`--tls-cert-file`匹配的`x509`私钥文件 |

### 1.3 API客户端参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--kube-api-qps` | `float32` | `2000.0` | 与`Kubernetes APIServer`通信时使用的`QPS` |
| `--kube-api-burst` | `int` | `2000` | 与`Kubernetes APIServer`通信时使用的`Burst` |

### 1.4 调度优化参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--minimum-feasible-nodes` | `int32` | `100` | 查找和评分的最小可行节点数 |
| `--minimum-percentage-nodes-to-find` | `int32` | `5` | 查找和评分的最小节点百分比 |
| `--percentage-nodes-to-find` | `int32` | `0` | 每个调度周期评分的节点百分比，`<=0`时基于集群大小自动计算 |
| `--node-worker-threads` | `uint32` | `20` | 同步节点操作的线程数 |

### 1.5 功能开关参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--priority-class` | `bool` | `true` | 启用`PriorityClass`以提供`pod组`级别的抢占能力 |
| `--csi-storage` | `bool` | `false` | 启用跟踪`CSI`驱动程序提供的可用存储容量 |
| `--enable-healthz` | `bool` | `false` | 启用健康检查 |
| `--enable-metrics` | `bool` | `false` | 启用指标功能 |
| `--enable-pprof` | `bool` | `false` | 启用`pprof`端点 |
| `--cache-dumper` | `bool` | `true` | 启用缓存转储器 |

### 1.6 高级配置参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--plugins-dir` | `string` |  | `vc-scheduler`加载自定义插件的目录 |
| `--node-selector` | `[]string` | `nil` | `volcano`只处理带有指定标签的节点 |
| `--cache-dump-dir` | `string` | `/tmp` | 缓存信息转储到`JSON`文件的目标目录 |
| `--ignored-provisioners` | `[]string` | `nil` | 在`pod pvc`请求计算和抢占期间忽略的`provisioner`列表 |

### 1.7 Leader选举参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--leader-elect` | `bool` | `true` | 启用`leader选举`，确保只有一个调度器实例处于活动状态 |
| `--leader-elect-lease-duration` | `duration` | `15s` | `leader`选举租约持续时间 |
| `--leader-elect-renew-deadline` | `duration` | `10s` | `leader`选举续约截止时间 |
| `--leader-elect-retry-period` | `duration` | `2s` | `leader`选举重试周期 |
| `--leader-elect-resource-lock` | `string` | `leases` | `leader`选举使用的资源锁类型 |
| `--leader-elect-resource-name` | `string` | `volcano-scheduler` | `leader`选举资源名称 |
| `--leader-elect-resource-namespace` | `string` | `volcano-system` | `leader`选举资源所在的命名空间 |
| `--lock-object-namespace` | `string` | `volcano-system` | 锁对象的命名空间（已弃用，使用`--leader-elect-resource-namespace`） |

### 1.8 日志参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `-v` | `int` | `0` | 日志级别，数值越大日志越详细 |
| `--logtostderr` | `bool` | `false` | 将日志输出到`stderr`而不是文件 |
| `--alsologtostderr` | `bool` | `false` | 同时将日志输出到`stderr`和文件 |
| `--log_dir` | `string` |  | 日志文件输出目录 |
| `--log_file` | `string` |  | 日志文件路径 |
| `--log_file_max_size` | `uint64` | `1800` | 日志文件最大大小（MB） |
| `--skip_headers` | `bool` | `false` | 跳过日志头信息 |
| `--skip_log_headers` | `bool` | `false` | 跳过日志头信息 |
| `--stderrthreshold` | `int` | `2` | 输出到`stderr`的日志级别阈值 |
| `--vmodule` | `string` |  | 按模块设置日志级别，格式：`pattern=N,...` |
| `--log-flush-frequency` | `duration` | `5s` | 日志刷新之间的最大秒数 |

### 1.9 Feature Gate参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--feature-gates` | `string` |  | 启用或禁用特定功能的键值对列表，格式：`key1=value1,key2=value2` |

### 1.10 其他参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--version` | `bool` | `false` | 显示版本信息并退出 |

## 2. Controller Manager

`volcano-controller-manager`负责管理`Volcano`的自定义资源管理，如`Job`、`Queue`、`PodGroup`等。

镜像默认启动参数：
```bash
--logtostderr
--enable-healthz=true
--enable-metrics=true
--leader-elect=false
--kube-api-qps=50
--kube-api-burst=100
--worker-threads=3
--worker-threads-for-gc=5
--worker-threads-for-podgroup=5
-v=4
2>&1
```

### 2.1 基础配置参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--master` | `string` |  | `Kubernetes API`服务器地址（覆盖`kubeconfig`中的值） |
| `--kubeconfig` | `string` |  | `kubeconfig`文件路径，包含授权和`master`位置信息 |
| `--scheduler-name` | `[]string` | `["volcano"]` | 处理`.spec.SchedulerName`匹配的`Pod` |

### 2.2 网络和安全参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--listen-address` | `string` | `:8081` | `HTTP`请求监听地址 |
| `--healthz-address` | `string` | `:11251` | 健康检查服务器监听地址 |
| `--ca-cert-file` | `string` |  | `HTTPS`的`x509`证书文件 |
| `--tls-cert-file` | `string` |  | `HTTPS`的默认`x509`证书文件 |
| `--tls-private-key-file` | `string` |  | 与`--tls-cert-file`匹配的`x509`私钥文件 |

### 2.3 API客户端参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--kube-api-qps` | `float32` | `50.0` | 与`Kubernetes APIServer`通信时使用的`QPS` |
| `--kube-api-burst` | `int` | `100` | 与`Kubernetes APIServer`通信时使用的`Burst` |

### 2.4 工作线程参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--worker-threads` | `uint32` | `3` | 并发同步作业操作的线程数，数量越大作业更新越快但CPU负载更高 |
| `--worker-threads-for-podgroup` | `uint32` | `5` | 同步`podgroup`操作的线程数，数量越大处理越快但需要更多CPU负载 |
| `--worker-threads-for-queue` | `uint32` | `5` | 同步`队列`操作的线程数，数量越大处理越快但需要更多CPU负载 |
| `--worker-threads-for-gc` | `uint32` | `1` | 回收作业的线程数，数量越大回收越快但需要更多CPU负载 |

### 2.5 重试和控制参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--max-requeue-num` | `int` | `15` | 作业、队列或命令在从队列中删除之前的重新排队次数 |
| `--controllers` | `[]string` | `["*"]` | 指定要启用的控制器，使用'*'表示所有控制器 |

### 2.6 功能开关参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--enable-healthz` | `bool` | `false` | 启用健康检查 |
| `--enable-metrics` | `bool` | `false` | 启用指标功能 |
| `--inherit-owner-annotations` | `bool` | `true` | 创建`podgroup`时启用继承所有者注释 |

### 2.7 Leader选举参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--leader-elect` | `bool` | `true` | 启用`leader选举`，确保只有一个控制器实例处于活动状态 |
| `--leader-elect-lease-duration` | `duration` | `15s` | `leader选举`租约持续时间 |
| `--leader-elect-renew-deadline` | `duration` | `10s` | `leader选举`续约截止时间 |
| `--leader-elect-retry-period` | `duration` | `2s` | `leader选举`重试周期 |
| `--leader-elect-resource-lock` | `string` | `leases` | `leader选举`使用的资源锁类型 |
| `--leader-elect-resource-name` | `string` | `vc-controller-manager` | `leader选举`资源名称 |
| `--leader-elect-resource-namespace` | `string` | `volcano-system` | `leader选举`资源所在的命名空间 |
| `--lock-object-namespace` | `string` | `volcano-system` | 锁对象的命名空间（已弃用，使用`--leader-elect-resource-namespace`） |

### 2.8 日志参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `-v` | `int` | `0` | 日志级别，数值越大日志越详细 |
| `--logtostderr` | `bool` | `false` | 将日志输出到`stderr`而不是文件 |
| `--alsologtostderr` | `bool` | `false` | 同时将日志输出到`stderr`和文件 |
| `--log_dir` | `string` |  | 日志文件输出目录 |
| `--log_file` | `string` |  | 日志文件路径 |
| `--log_file_max_size` | `uint64` | `1800` | 日志文件最大大小（MB） |
| `--skip_headers` | `bool` | `false` | 跳过日志头信息 |
| `--skip_log_headers` | `bool` | `false` | 跳过日志头信息 |
| `--stderrthreshold` | `int` | `2` | 输出到`stderr`的日志级别阈值 |
| `--vmodule` | `string` |  | 按模块设置日志级别，格式：`pattern=N,...` |
| `--log-flush-frequency` | `duration` | `5s` | 日志刷新之间的最大秒数 |

### 2.9 Feature Gate参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--feature-gates` | `string` |  | 启用或禁用特定功能的键值对列表，格式：`key1=value1,key2=value2` |

### 2.10 其他参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--version` | `bool` | `false` | 显示版本信息并退出 |

## 3. Admission(Webhook Manager)

`volcano-webhook-manager（vc-webhook-manager）`是`Volcano`的`admission`控制器组件，负责对`Volcano`资源进行准入控制和验证。

镜像默认启动参数：
```bash
--enabled-admission=/jobs/mutate,/jobs/validate,/podgroups/validate,/queues/mutate,/queues/validate,/hypernodes/validate
--tls-cert-file=/admission.local.config/certificates/tls.crt
--tls-private-key-file=/admission.local.config/certificates/tls.key
--ca-cert-file=/admission.local.config/certificates/ca.crt
--admission-conf=/admission.local.config/configmap/volcano-admission.conf
--webhook-namespace=volcano-system
--webhook-service-name=volcano-admission-service
--enable-healthz=true
--logtostderr
--port=8443
-v=4
2>&1
```

### 3.1 基础配置参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--master` | `string` |  | `Kubernetes API`服务器地址（覆盖`kubeconfig`中的值） |
| `--kubeconfig` | `string` |  | `kubeconfig`文件路径，包含授权和`master`位置信息 |
| `--scheduler-name` | `[]string` | `["volcano"]` | 处理`.spec.SchedulerName`匹配的`Pod` |

### 3.2 网络和服务参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--listen-address` | `string` |  | `admission`控制器服务器监听地址 |
| `--port` | `int` | `8443` | `admission`控制器服务器使用的端口 |
| `--healthz-address` | `string` | `:11251` | 健康检查服务器监听地址 |

### 3.3 TLS和安全参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--tls-cert-file` | `string` |  | `HTTPS`的默认`x509`证书文件 |
| `--tls-private-key-file` | `string` |  | 与`--tls-cert-file`匹配的`x509`私钥文件 |
| `--ca-cert-file` | `string` |  | `HTTPS`的`x509`证书文件 |

### 3.4 Webhook配置参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--webhook-namespace` | `string` |  | `webhook`所在的命名空间 |
| `--webhook-service-name` | `string` |  | `webhook`服务名称 |
| `--webhook-url` | `string` |  | `webhook`的`URL`地址 |
| `--admission-conf` | `string` |  | `webhook`的`configmap`配置文件 |

### 3.5 Admission控制参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--enabled-admission` | `string` | `/jobs/mutate,/jobs/validate,/podgroups/mutate,/pods/validate,/pods/mutate,/queues/mutate,/queues/validate` | 启用的`admission webhook`列表 |
| `--graceful-shutdown-time` | `duration` | `30s` | 优雅关闭时强制终止前的等待时间 |

### 3.6 API客户端参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--kube-api-qps` | `float32` | `50.0` | 与`Kubernetes APIServer`通信时使用的`QPS` |
| `--kube-api-burst` | `int` | `100` | 与`Kubernetes APIServer`通信时使用的`Burst` |

### 3.7 功能开关参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--enable-healthz` | `bool` | `false` | 启用健康检查 |

### 3.8 日志参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `-v` | `int` | `0` | 日志级别，数值越大日志越详细 |
| `--logtostderr` | `bool` | `false` | 将日志输出到`stderr`而不是文件 |
| `--alsologtostderr` | `bool` | `false` | 同时将日志输出到`stderr`和文件 |
| `--log_dir` | `string` |  | 日志文件输出目录 |
| `--log_file` | `string` |  | 日志文件路径 |
| `--log_file_max_size` | `uint64` | `1800` | 日志文件最大大小（MB） |
| `--skip_headers` | `bool` | `false` | 跳过日志头信息 |
| `--skip_log_headers` | `bool` | `false` | 跳过日志头信息 |
| `--stderrthreshold` | `int` | `2` | 输出到`stderr`的日志级别阈值 |
| `--vmodule` | `string` |  | 按模块设置日志级别，格式：`pattern=N,...` |
| `--log-flush-frequency` | `duration` | `5s` | 日志刷新之间的最大秒数 |

### 3.9 其他参数

| 参数名称 | 参数类型 | 默认值 | 参数说明 |
|---------|---------|--------|----------|
| `--version` | `bool` | `false` | 显示版本信息并退出 |
