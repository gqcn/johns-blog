---
slug: "/ai/vgpu-hami-test-with-volcano"
title: "HAMi Volcano安装测试"
hide_title: true
keywords: [Volcano vGPU, volcano-vgpu-device-plugin, HAMi Core, GPU共享, deviceshare插件, Kubernetes GPU调度, vGPU部署, 资源名称兼容, Prometheus监控, GPU节点配置]
description: "详细介绍Volcano vGPU的完整部署流程，包括volcano-vgpu-device-plugin组件安装、调度器配置、节点标签污点设置、资源名称兼容性配置、实际测试验证和常见问题排查。基于HAMi Core实现GPU硬隔离，支持与NVIDIA Device Plugin资源名称兼容。"
---

使用`volcano-vgpu`时，不需要 安装`HAMi`，仅使用`Volcano vgpu device-plugin`即可。它可以为由`volcano`管理的`NVIDIA`设备提供设备共享机制。
该插件源码基于`Nvidia Device Plugin`开发，并使用`HAMi-core`实现对`GPU`卡的硬隔离支持。
`Volcano vgpu`仅在`volcano > 1.9`版本中可用。


## 1. 准备工作
### 1.1 镜像准备
`Volcano`调度器已集成支持`HAMI vGPU`，我们需要以前准备以下镜像到本地集群中：
```text
docker.io/projecthami/volcano-vgpu-device-plugin:v1.11.0
```
下载到本地`harbor`中，新地址为：
```text
aiharbor.msxf.local/test/projecthami/volcano-vgpu-device-plugin:v1.11.0
```
### 1.2 节点准备
#### 1.2.1 vGPU节点标签污点
需要给需要安装`vGPU`组件的节点打上特定的标签和污点，以方便管理启用`vGPU`的节点，并且避免原有的`nvidia device plugin`对该`vGPU`节点的资源管理造成影响和资源分配冲突。
标签如下：
```yaml
volcano.sh/vgpu.enabled: "true"
```
污点如下：
```yaml
volcano.sh/vgpu=hami:NoSchedule
```

#### 1.2.2 卸载vGPU节点的nvidia-device-plugin
在已经给`vGPU`节点标记标签和污点后，需要通过`kubectl delete`指令删除对应`vGPU`节点的`nvidia device plugin pod`，例如：
```bash
kubectl delete pod nvidia-device-plugin-daemonset-vx6fk
```

## 2. 执行部署
### 2.1 部署volcano-vgpu-device-plugin
#### 2.1.1 部署文件

注意部署文件中`Daemonset`中的`nodeSelector`及`tolerations`：[volcano-vgpu-device-plugin.yaml](./assets/3000-HAMi%20Volcano安装测试/volcano-vgpu-device-plugin.yaml)


#### 2.1.2 配置说明

`Volcano vGPU`的默认配置如下：
```yaml title="device-config.yaml"
nvidia:
  resourceCountName: volcano.sh/vgpu-number
  resourceMemoryName: volcano.sh/vgpu-memory
  resourceMemoryPercentageName: volcano.sh/vgpu-memory-percentage
  resourceCoreName: volcano.sh/vgpu-cores
  overwriteEnv: false
  defaultMemory: 0
  defaultCores: 0
  defaultGPUNum: 1
  deviceSplitCount: 10
  deviceMemoryScaling: 1
  deviceCoreScaling: 1
  gpuMemoryFactor: 1
  knownMigGeometries: []
```

**关键配置项说明：**
| 配置项 |说明|示例|
|---|---|---|
|`resourceCountName`|`vGPU`个数的资源名称|`volcano.sh/vgpu-number`|
|`resourceMemoryName`|`vGPU`显存大小的资源名称|`volcano.sh/vgpu-memory`|
|`resourceCoreName`|`vGPU`算力的资源名称|`volcano.sh/vgpu-cores`|
|`resourceMemoryPercentageName`|`vGPU`显存比例的资源名称，仅用在`Pod`的资源申请中|`volcano.sh/vgpu-memory-percentage`|
|`deviceSplitCount`|`GPU`分割数，每张`GPU`最多可同时运行的任务数|`10`|

#### 2.1.3 执行结果
```bash
$ k apply -f volcano-vgpu-device-plugin.yaml
configmap/volcano-vgpu-device-config created
configmap/volcano-vgpu-node-config created
serviceaccount/volcano-device-plugin created
clusterrole.rbac.authorization.k8s.io/volcano-device-plugin created
clusterrolebinding.rbac.authorization.k8s.io/volcano-device-plugin created
Warning: spec.template.metadata.annotations[scheduler.alpha.kubernetes.io/critical-pod]: non-functional in v1.16+; use the "priorityClassName" field instead
daemonset.apps/volcano-device-plugin created

$ k get pod
NAME                                   READY   STATUS    RESTARTS      AGE
volcano-admission-7dc9b78fc6-686tb     1/1     Running   0             20d
volcano-admission-7dc9b78fc6-d9vzk     1/1     Running   0             20d
volcano-admission-7dc9b78fc6-h2ssl     1/1     Running   0             20d
volcano-controllers-855c676dd4-4gpxp   1/1     Running   1 (13d ago)   20d
volcano-controllers-855c676dd4-pspzg   1/1     Running   0             20d
volcano-controllers-855c676dd4-zl8cd   1/1     Running   0             20d
volcano-device-plugin-7g6v2            2/2     Running   0             22s
volcano-scheduler-6645c59d6d-56xdc     1/1     Running   0             6m58s
volcano-scheduler-6645c59d6d-p549s     1/1     Running   0             6m58s
volcano-scheduler-6645c59d6d-pqt68     1/1     Running   0             6m58s
```
查看节点`vGPU`资源，可以看到原有的`nvidia device plugin`注入的资源`nvidia.com/gpu`已经清空，新生成了`vGPU`相关的资源`volcano.sh/vgpu-cores`、`volcano.sh/vgpu-memory`及`volcano.sh/vgpu-number`。

```yaml
# ...
Capacity:
  cpu:                     128
  ephemeral-storage:       562291Mi
  hugepages-1Gi:           0
  hugepages-2Mi:           0
  memory:                  263746296Ki
  nvidia.com/gpu:          0
  nvidia.com/gpu.shared:   0
  pods:                    110
  volcano.sh/vgpu-cores:   800
  volcano.sh/vgpu-memory:  196512
  volcano.sh/vgpu-number:  80
Allocatable:
  cpu:                     127600m
  ephemeral-storage:       562291Mi
  hugepages-1Gi:           0
  hugepages-2Mi:           0
  memory:                  256048108548
  nvidia.com/gpu:          0
  nvidia.com/gpu.shared:   0
  pods:                    110
  volcano.sh/vgpu-cores:   800
  volcano.sh/vgpu-memory:  196512
  volcano.sh/vgpu-number:  80
# ...
```

**自动生成的资源项说明：**
| 资源项 |说明|示例|
|---|---|---|
|`volcano.sh/vgpu-cores`|`vGPU`算力的资源量百分比，是节点上`总卡数*100`|`800`|
|`volcano.sh/vgpu-memory`|`vGPU`显存的总资源量，单位`Mi`，是节点上`总卡数*单卡显存数`。由于`4090`显卡的单卡显存为`24564Mi`，那么这里的总显存量为`196512Mi`|`196512`|
|`volcano.sh/vgpu-number`|`vGPU`个数，是节点上`总卡数*deviceSplitCount配置`|`80`|

### 2.2 启用volcano调度器支持vGPU
修改`volcano-scheduler-configmap`，增加以下插件支持：
```yaml
- name: deviceshare
  arguments:
    # 是否启用vgpu特性
    deviceshare.VGPUEnable: true 
    # volcano-vgpu-device-config这个ConfigMap对应的命名空间
    # 便于调度器自动读取ConfigMap内容
    deviceshare.KnownGeometriesCMNamespace: volcano-system 
```

修改后内容如下（仅供示例参考，具体根据自身需要调整`volcano action`和`plugin`配置）：
```yaml
actions: "enqueue, allocate, backfill"
tiers:
- plugins:
  - name: priority
  - name: gang
    enablePreemptable: false
  - name: conformance
- plugins:
  - name: drf
    enablePreemptable: false
  - name: deviceshare
    arguments:
      # 是否启用vgpu特性
      deviceshare.VGPUEnable: true 
      # volcano-vgpu-device-config这个ConfigMap对应的命名空间
      # 便于调度器自动读取ConfigMap内容
      deviceshare.KnownGeometriesCMNamespace: volcano-system 
  - name: predicates
  - name: capacity-card
    arguments:
      cardUnlimitedCpuMemory: true
  - name: nodeorder
  - name: binpack
```
修改后重启`volcano-scheduler`。

## 3. 运行测试
### 3.1 vGPU基本使用
该测试`Pod`使用的镜像为`nvidia/cuda:12.2.0-base`，下载到本地集群`harbor`仓库的镜像地址`aiharbor.msxf.local/test/nvidia/cuda:12.2.0-base-ubuntu22.04`：
```yaml title="test-vgpu.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: test-vgpu
spec:
  # 需要使用volcano调度器
  schedulerName: volcano
  # 容忍所有污点，仅做测试
  tolerations:
  - key: volcano.sh/vgpu
    operator: Exists
    effect: NoSchedule
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule
  - key: nvidia.com/gpu.product
    operator: Exists
    effect: NoSchedule
  - key: special.accelerate.usage
    operator: Exists
    effect: NoSchedule
  - key: maip.msxf.io/node.usage
    operator: Exists
    effect: NoSchedule
  - key: maip.msxf.io/ib.present
    operator: Exists
    effect: NoSchedule
  containers:
    - name: cuda-container
      image: aiharbor.msxf.local/test/nvidia/cuda:12.2.0-base-ubuntu22.04
      command: ["sleep"]
      args: ["100000"]
      resources:
        requests:
          volcano.sh/vgpu-number: 2      # （必须）请求 2 张 GPU 卡
          volcano.sh/vgpu-memory: 3000   # （可选）每个 vGPU 使用 3G 显存，超过单卡显存则用最大单卡显存
          volcano.sh/vgpu-cores: 50      # （可选）每个 vGPU 使用 50% 核心
        limits:
          volcano.sh/vgpu-number: 2       
          volcano.sh/vgpu-memory: 3000   
          volcano.sh/vgpu-cores: 50    
```
运行后，查看`Pod`信息：
```bash
$ k get pod
NAME                                   READY   STATUS    RESTARTS      AGE
test-vgpu                              1/1     Running   0             23s
```

进入`Pod`容器执行`nvidia-smi`命令查看`vGPU`资源信息，执行以下指令：
```bash
k exec -it test-vgpu bash
```

查看`vGPU`资源信息如下：
```text
root@test-vgpu:/# nvidia-smi
[HAMI-core Msg(18:140441960732480:libvgpu.c:839)]: Initializing.....
Mon Nov 24 12:13:31 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.105.08             Driver Version: 580.105.08     CUDA Version: 13.0     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4090        On  |   00000000:BA:00.0 Off |                  Off |
| 30%   35C    P8             13W /  450W |       0MiB /   3000MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA GeForce RTX 4090        On  |   00000000:BB:00.0 Off |                  Off |
| 30%   33C    P8             24W /  450W |       0MiB /   3000MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
[HAMI-core Msg(18:140441960732480:multiprocess_memory_limit.c:455)]: Calling exit handler 18
root@test-vgpu:/# 
```
在标准输出中以`HAMI-core`开头的信息属于`HAMI-core`通过`CUDA API`劫持的调试信息，表示`HAMI-core`实际以及起作用，例如`[HAMI-core Msg(18:140441960732480:multiprocess_memory_limit.c:455)]: Calling exit handler 18`表示是由`HAMi-core`组件执行完成，它会在`nvidia-smi`命令末尾执行一些资源清理工作。

### 3.2 使用nvidia-device-plugin的资源

原本使用`nvidia device plugin`的节点资源不会受影响，部署的`Pod YAML`如下：
```yaml title="test-nvidia-device-plugin.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: test-nvidia-device-plugin
spec:
  # 需要使用volcano调度器
  schedulerName: volcano
  # 容忍所有污点，仅做测试
  tolerations:
  - key: volcano.sh/vgpu
    operator: Exists
    effect: NoSchedule
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule
  - key: nvidia.com/gpu.product
    operator: Exists
    effect: NoSchedule
  - key: special.accelerate.usage
    operator: Exists
    effect: NoSchedule
  - key: maip.msxf.io/node.usage
    operator: Exists
    effect: NoSchedule
  - key: maip.msxf.io/ib.present
    operator: Exists
    effect: NoSchedule
  containers:
    - name: cuda-container
      image: aiharbor.msxf.local/test/nvidia/cuda:12.2.0-base-ubuntu22.04
      command: ["sleep"]
      args: ["100000"]
      resources:
        requests:
          nvidia.com/gpu: 2 # 使用nvidia device plugin注册的资源
        limits:
          nvidia.com/gpu: 2
```

### 3.3 vGPU资源与NVIDIA资源名称兼容

按照节点维度启用`vGPU`后，该`vGPU`节点只能使用`vGPU`的资源名称进行`Pod`资源申请，无法再使用原有的资源名称调度到`vGPU`节点上。也可以将整卡和`vGPU`进行兼容性的资源名称配置，例如将`vGPU`的资源名称和`nvidia`的资源名称保持一致。我们来做一下兼容性测试。

#### 3.3.1 配置文件变化
调整`vGPU`全局资源名称的配置如下（`resourceCountName`配置从`volcano.sh/vgpu-number`改为`nvidia.com/gpu`）：
```yaml
nvidia:
  resourceCountName: nvidia.com/gpu
  resourceMemoryName: volcano.sh/vgpu-memory
  resourceMemoryPercentageName: volcano.sh/vgpu-memory-percentage
  resourceCoreName: volcano.sh/vgpu-cores
  overwriteEnv: false
  defaultMemory: 0
  defaultCores: 0
  defaultGPUNum: 1
  deviceSplitCount: 10
  deviceMemoryScaling: 1
  deviceCoreScaling: 1
  gpuMemoryFactor: 1
  knownMigGeometries: []
```
随后重启`volcano-vgpu-device-plugin`，发现`volcano-vgpu-device-plugin`组件的资源名称并未在节点上发现没有生效，经过查看`volcano-vgpu-device-plugin`和`volcano`的`deviceshare`插件的源码，发现：
- `volcano-vgpu-device-config`的`ConfigMap`配置文件只是给`volcano`的`deviceshare`插件使用的。
- `volcano-vgpu-device-plugin`组件的源码中忽略了`ConfigMap`的该配置，而是通过命令行参数指定资源名称，其支持的命令行参数如下：
    | 命令行参数 | 说明 | 默认值 |
    | --- | --- | --- |
    | `resource-name` | `vGPU`个数的资源名称，生成到节点上 | `volcano.sh/vgpu-number` |
    | `resource-memory-name` | `vGPU`显存大小的资源名称，生成到节点上 | `volcano.sh/vgpu-memory` |
    | `resource-core-name` | `vGPU`算力的资源名称，生成到节点上 | `volcano.sh/vgpu-cores` |
    | `debug` | 是否开启调试模式 | `false` |
- 这两个组件的相关配置项需要保持一致，否则无法部署`Pod`。

将命令行参数：
```yaml
containers:
- image: aiharbor.msxf.local/test/projecthami/volcano-vgpu-device-plugin:v1.11.0
  args: ["--device-split-count=10"]
```
调整为：
```yaml
containers:
- image: aiharbor.msxf.local/test/projecthami/volcano-vgpu-device-plugin:v1.11.0
  args: [
    "--device-split-count=10",
    "--resource-name=nvidia.com/gpu"
  ]
```

#### 3.3.2 部署文件示例

这是完整的`volcano-vgpu-device-plugin`组件部署文件，仅供参考：[volcano-vgpu-device-config.compatible.yaml](./assets/3000-HAMi%20Volcano安装测试/volcano-vgpu-device-config.compatible.yaml)

执行后，`volcano-vgpu-device-plugin`组件会重启，同时手动重启`volcano scheduler`，随后查看`vGPU`节点资源情况如下，可以看到，`vGPU`的卡资源名称和`NVIDIA`保持一致，使用的是`nvidia.com/gpu`：
```yaml
# ...
Capacity:
  cpu:                     128
  ephemeral-storage:       562291Mi
  hugepages-1Gi:           0
  hugepages-2Mi:           0
  memory:                  263746296Ki
  nvidia.com/gpu:          80
  nvidia.com/gpu.shared:   0
  pods:                    110
  volcano.sh/vgpu-cores:   800
  volcano.sh/vgpu-memory:  196512
  volcano.sh/vgpu-number:  80
Allocatable:
  cpu:                     127600m
  ephemeral-storage:       562291Mi
  hugepages-1Gi:           0
  hugepages-2Mi:           0
  memory:                  256048108548
  nvidia.com/gpu:          80
  nvidia.com/gpu.shared:   0
  pods:                    110
  volcano.sh/vgpu-cores:   800
  volcano.sh/vgpu-memory:  196512
  volcano.sh/vgpu-number:  0
# ...
```

#### 3.3.3 测试文件示例

运行以下示例将`Pod`调度到`vGPU`节点上：
```yaml title="test-vgpu-compatible.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: test-vgpu-compatible
spec:
  # 需要使用volcano调度器
  schedulerName: volcano
  # 新增节点选择，运行到vGPU节点上
  nodeSelector:
    name: dev-app-2-150-master-1
  # 容忍所有污点，仅做测试
  tolerations:
  - key: volcano.sh/vgpu
    operator: Exists
    effect: NoSchedule
  - key: nvidia.com/gpu
    operator: Exists
    effect: NoSchedule
  - key: nvidia.com/gpu.product
    operator: Exists
    effect: NoSchedule
  - key: special.accelerate.usage
    operator: Exists
    effect: NoSchedule
  - key: maip.msxf.io/node.usage
    operator: Exists
    effect: NoSchedule
  - key: maip.msxf.io/ib.present
    operator: Exists
    effect: NoSchedule
  containers:
    - name: cuda-container
      image: aiharbor.msxf.local/test/nvidia/cuda:12.2.0-base-ubuntu22.04
      command: ["sleep"]
      args: ["100000"]
      resources:
        requests:
          nvidia.com/gpu: 2        # 请求 2 张 GPU 卡
        limits:
          nvidia.com/gpu: 2   
```
执行后，可以看到`Pod`已经被成功调度和运行。进入`Pod`容器查看资源情况，可以看到申请的算力和显存是按照整卡来分配的，这也是`HAMi vGPU`默认的行为，以便于和原有的`NVIDIA device plugin`兼容：
```text
$ k exec -it test-vgpu-compatible bash
kubectl exec [POD] [COMMAND] is DEPRECATED and will be removed in a future version. Use kubectl exec [POD] -- [COMMAND] instead.
root@test-vgpu-compatible:/# nvidia-smi
[HAMI-core Msg(15:139748339885888:libvgpu.c:839)]: Initializing.....
Tue Nov 25 09:26:16 2025       
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.105.08             Driver Version: 580.105.08     CUDA Version: 13.0     |
+-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 4090        On  |   00000000:BA:00.0 Off |                  Off |
| 30%   34C    P8             13W /  450W |       0MiB /  24564MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+
|   1  NVIDIA GeForce RTX 4090        On  |   00000000:BB:00.0 Off |                  Off |
| 30%   32C    P8             25W /  450W |       0MiB /  24564MiB |      0%      Default |
|                                         |                        |                  N/A |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
[HAMI-core Msg(15:139748339885888:multiprocess_memory_limit.c:455)]: Calling exit handler 15
root@test-vgpu-compatible:/# 
```
## 4. 监控指标

`Volcano vgpu`的指标通过`volcano scheduler`暴露，可以通过进入集群中任一支持`curl`命令的`Pod`，随后`curl`一下`volcano scheduler`的接口地址，例如：
```yaml
# 10.233.75.65为主volcano scheduler的ClusterIP
curl 10.233.75.65:8080/metrics
```

返回的指标比较重，其中与`vGPU`相关的指标：[volcano-vgpu-metrics.txt](./assets/3000-HAMi%20Volcano安装测试/volcano-vgpu-metrics.txt)


## 5. 常见问题
### 5.1 vGPU Pod部署时报错UnexpectedAdmissionError
在调整完`volcano-vgpu-device-config`这个ConfigMap中的`resourceCountName`配置项为自定义的资源名称后，`Pod`部署时状态为`UnexpectedAdmissionError`：
```bash
$ k get pod
NAME                                   READY   STATUS                     RESTARTS   AGE
test-vgpu-compatible                   0/1     UnexpectedAdmissionError   0          75s
```

通过`kubectl describe pod`查看`Pod`的`Events`如下：
```yaml
Events:
  Type     Reason                    Age   From     Message
  ----     ------                    ----  ----     -------
  Normal   Scheduled                 25s   volcano  Successfully assigned volcano-system/test-vgpu-compatible to dev-app-2-150-master-1
  Warning  UnexpectedAdmissionError  25s   kubelet  Allocate failed due to rpc error: code = Unknown desc = device request not found, which is unexpected
```

通过翻查`volcano`和`volcano-vgpu-device-plugin`源码，经过排查是配置文件不一致引起的。在修改资源名称时，我们需要保证3个地方的配置正确性和一致性，拿`resourceCountName`配置项修改为`nvidia.com/gpu`举例，需要调整以下地方：
- `volcano-vgpu-device-config`的`resourceCountName: nvidia.com/gpu`
- `volcano-vgpu-device-plugin`命令行参数`--resource-name=nvidia.com/gpu`
- `volcano-scheduler-configmap`的`deviceshare`插件需要指定正确的命名空间，如下：
    ```yaml
    - name: deviceshare
      arguments:
        # 是否启用vgpu特性
        deviceshare.VGPUEnable: true 
        # volcano-vgpu-device-config这个ConfigMap对应的命名空间
        # 便于调度器自动读取ConfigMap内容
        deviceshare.KnownGeometriesCMNamespace: volcano-system 
    ```
  可以通过查看调度的日志来排查调度器使用的配置文件是否正确，命令如下：
    ```bash
    $ k logs volcano-scheduler-6645c59d6d-bcw68 | grep "device config"
    I1125 09:11:57.408175       1 config.go:113] "Initializing volcano device config" device-configs={"NvidiaConfig":{"ResourceCountName":"nvidia.com/gpu","ResourceMemoryName":"volcano.sh/vgpu-memory","ResourceCoreName":"volcano.sh/vgpu-cores","ResourceMemoryPercentageName":"volcano.sh/vgpu-memory-percentage","ResourcePriority":"","OverwriteEnv":false,"DefaultMemory":0,"DefaultCores":0,"DefaultGPUNum":1,"DeviceSplitCount":10,"DeviceMemoryScaling":1,"DeviceCoreScaling":1,"DisableCoreLimit":false,"MigGeometriesList":[],"GPUMemoryFactor":1}}
    ```


