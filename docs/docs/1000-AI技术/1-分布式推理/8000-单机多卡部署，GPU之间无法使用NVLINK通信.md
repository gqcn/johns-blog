---
slug: "/ai/single-node-multi-gpu-nvlink-communication-issue"
title: 单机多卡部署，GPU之间无法使用NVLINK通信
hide_title: true
keywords: [单机多卡, NVLINK通信, Pod GPU通信, 分布式推理, PD分离, Prefill Decode, GPU拓扑结构, NCCL NVLINK, 容器GPU隔离, privileged容器, NVIDIA_VISIBLE_DEVICES, CUDA_VISIBLE_DEVICES, GPU device plugin, Kubernetes GPU调度, UCX性能测试, GPU通信优化, 高性能计算, AI推理加速]
description: 详细分析和解决单机多卡部署中GPU之间无法使用NVLINK通信的问题。以PD分离技术为例，深入探讨GPU资源隔离机制、容器特权模式配置、GPU拓扑结构发现等关键技术，提供可供参考的解决方案。
---

本章节使用`PD`分离作为示例，排查和演示单机多卡部署，`Pod`的`GPU`之间无法使用`NVLINK`通信的问题。


## 1. 问题介绍
`PD（Prefill & Decode）`分离技术中，如果`Prefill`和`Decode`部署到同节点下，`Prefill`和`Decode`两个`Pod`无法使用`NVLINK`通信，导致`Prefill`和`Decode`之间的通信性能较差。

## 2. 问题复现
### 2.1 复现环境
节点系统版本：
```text
$ cat /etc/issue
Ubuntu 22.04.5 LTS 
```
节点内核版本：
```text
$ uname -a
Linux ai-app-8-1-msxf 5.15.0-1078-nvidia #79-Ubuntu SMP Fri Apr 25 14:51:39 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
```
节点`GPU卡`列表：
```text
$ nvidia-smi topo -m
        GPU0    GPU1    GPU2    GPU3    GPU4    GPU5    GPU6    GPU7    NIC0    NIC1    NIC2    NIC3    NIC4    CPU Affinity    NUMA Affinity   GPU NUMA ID
GPU0     X      NV18    NV18    NV18    NV18    NV18    NV18    NV18    PIX     NODE    SYS     SYS     NODE    0-47,96-143     0               N/A
GPU1    NV18     X      NV18    NV18    NV18    NV18    NV18    NV18    NODE    NODE    SYS     SYS     NODE    0-47,96-143     0               N/A
GPU2    NV18    NV18     X      NV18    NV18    NV18    NV18    NV18    NODE    PIX     SYS     SYS     NODE    0-47,96-143     0               N/A
GPU3    NV18    NV18    NV18     X      NV18    NV18    NV18    NV18    NODE    NODE    SYS     SYS     NODE    0-47,96-143     0               N/A
GPU4    NV18    NV18    NV18    NV18     X      NV18    NV18    NV18    SYS     SYS     PIX     NODE    SYS     48-95,144-191   1               N/A
GPU5    NV18    NV18    NV18    NV18    NV18     X      NV18    NV18    SYS     SYS     NODE    NODE    SYS     48-95,144-191   1               N/A
GPU6    NV18    NV18    NV18    NV18    NV18    NV18     X      NV18    SYS     SYS     NODE    PIX     SYS     48-95,144-191   1               N/A
GPU7    NV18    NV18    NV18    NV18    NV18    NV18    NV18     X      SYS     SYS     NODE    NODE    SYS     48-95,144-191   1               N/A
NIC0    PIX     NODE    NODE    NODE    SYS     SYS     SYS     SYS      X      NODE    SYS     SYS     NODE
NIC1    NODE    NODE    PIX     NODE    SYS     SYS     SYS     SYS     NODE     X      SYS     SYS     NODE
NIC2    SYS     SYS     SYS     SYS     PIX     NODE    NODE    NODE    SYS     SYS      X      NODE    SYS
NIC3    SYS     SYS     SYS     SYS     NODE    NODE    PIX     NODE    SYS     SYS     NODE     X      SYS
NIC4    NODE    NODE    NODE    NODE    SYS     SYS     SYS     SYS     NODE    NODE    SYS     SYS      X

Legend:

  X    = Self
  SYS  = Connection traversing PCIe as well as the SMP interconnect between NUMA nodes (e.g., QPI/UPI)
  NODE = Connection traversing PCIe as well as the interconnect between PCIe Host Bridges within a NUMA node
  PHB  = Connection traversing PCIe as well as a PCIe Host Bridge (typically the CPU)
  PXB  = Connection traversing multiple PCIe bridges (without traversing the PCIe Host Bridge)
  PIX  = Connection traversing at most a single PCIe bridge
  NV#  = Connection traversing a bonded set of # NVLinks

NIC Legend:

  NIC0: ibp14s0
  NIC1: ibp71s0
  NIC2: ibp134s0
  NIC3: ibp195s0
  NIC4: rocep32s0f0
```

### 2.2 部署内容

以下部署内容示例仅供参考，内容无法独立部署。

#### 2.2.1 prefill
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: qwen25-72b-int4-dhzn-pd-prefill
  name: qwen25-72b-int4-dhzn-pd-prefill
spec:
  replicas: 1
  selector:
    matchLabels:
      app: qwen25-72b-int4-dhzn-pd-prefill
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: qwen25-72b-int4-dhzn-pd-prefill
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: nvidia.com/gpu.product
                operator: In
                values:
                - "NVIDIA-H20"
      containers:
      - command:
        - bash
        - -c
        - sleep 30 && python3 -m sglang.launch_server  --host 0.0.0.0 --port 30000  --model-path
          /models/model --served-model-name qwen   --disaggregation-mode prefill  --disaggregation-transfer-backend
          nixl --enable-nccl-nvls
          --mem-fraction-static 0.9 --enable-p2p-check --tp-size 2 --pp-size 1 --enable-metrics
          --page-size 64  --enable-metrics --collect-tokens-histogram
        env:
        - name: UCX_TLS
          value: cuda_ipc,cuda_copy,rc,tcp
        - name: UCX_MEMTYPE_CACHE
          value: "n"
        - name: UCX_RNDV_SCHEME
          value: get_zcopy
        - name: UCX_PROTO_INFO
          value: "y"
        - name: UCX_LOG_LEVEL
          value: debug
        - name: SGL_LOGURU_PATH
          value: /home/finance/Logs/prefill.log
        image: aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128
        imagePullPolicy: IfNotPresent
        name: pd-sglang-prefill
        resources:
          limits:
            cpu: "24"
            memory: 150Gi
            nvidia.com/gpu: "2"
          requests:
            cpu: "24"
            memory: 150Gi
            nvidia.com/gpu: "2"
        securityContext:
          capabilities:
            add:
            - IPC_LOCK
# ...
```

#### 2.2.2 decoder

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: qwen25-72b-int4-dhzn-pd-decoder
  name: qwen25-72b-int4-dhzn-pd-decoder
spec:
  replicas: 1
  selector:
    matchLabels:
      app: qwen25-72b-int4-dhzn-pd-decoder
  template:
    metadata:
      labels:
        app: qwen25-72b-int4-dhzn-pd-decoder
    spec:
      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
            - matchExpressions:
              - key: nvidia.com/gpu.product
                operator: In
                values:
                - "NVIDIA-H20"
      containers:
      - command:
        - bash
        - -c
        - sleep 30 &&  python3 -m sglang.launch_server --host 0.0.0.0 --port 30000   --model-path
          /models/model  --served-model-name qwen  --disaggregation-mode decode  --disaggregation-transfer-backend
          nixl   --enable-nccl-nvls --mem-fraction-static 0.85 --enable-p2p-check
          --tp-size 2 --pp-size 1 --enable-metrics --page-size 64  --enable-metrics
          --collect-tokens-histogram
        env:
        - name: UCX_TLS
          value: cuda_ipc,cuda_copy,rc,tcp
        - name: UCX_MEMTYPE_CACHE
          value: "n"
        - name: UCX_RNDV_SCHEME
          value: get_zcopy
        - name: UCX_PROTO_INFO
          value: "y"
        - name: UCX_LOG_LEVEL
          value: debug
        - name: SGL_LOGURU_PATH
          value: /home/finance/Logs/decoder.log
        image: aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128
        imagePullPolicy: IfNotPresent
        name: pd-sglang-decoder
        resources:
          limits:
            cpu: "24"
            memory: 192Gi
            nvidia.com/gpu: "2"
          requests:
            cpu: "24"
            memory: 192Gi
            nvidia.com/gpu: "2"
        securityContext:
          capabilities:
            add:
            - IPC_LOCK
      hostIPC: true
      securityContext: {}
# ...
```

### 2.3 测试过程

执行后，查看`Pod`列表：
```bash
$ k get pod -owide
NAME                                               READY   STATUS    RESTARTS   AGE   IP               NODE                                  NOMINATED NODE   READINESS GATES
qwen25-72b-int4-dhzn-pd-decoder-6f44bd8869-lhjv9   1/1     Running   0          20m   10.188.52.252    ai-app-8-1-msxf                       <none>           <none>
qwen25-72b-int4-dhzn-pd-prefill-88f47f885-d2c9h    1/1     Running   0          24m   10.188.52.247    ai-app-8-1-msxf                       <none>           <none>
```

测试操作：

1. 在`qwen25-72b-int4-dhzn-pd-decoder-6f44bd8869-lhjv`容器中执行：
    ```bash
    CUDA_VISIBLE_DEVICES=1 UCX_TLS=cuda_ipc,cuda_copy,rc,tcp ucx_perftest -t tag_bw -m cuda -s 10000000 -n 10 -p 9999 -c 0
    ```

2. 在`qwen25-72b-int4-dhzn-pd-prefill-88f47f885-d2c9h`容器中执行：

    ```bash
    CUDA_VISIBLE_DEVICES=0 UCX_TLS=cuda_ipc,cuda_copy,rc,tcp ucx_perftest 10.188.52.252 -t tag_bw -m cuda -s 100000000 -n 10 -p 9999 -c 1 | grep Final
    ```
    其中`10.188.52.252`的`IP`是`decoder`的`Pod IP`。
    最终输出结果如下：
    ```bash
    $ CUDA_VISIBLE_DEVICES=0 UCX_TLS=cuda_ipc,cuda_copy,rc,tcp ucx_perftest 10.188.52.252 -t tag_bw -m cuda -s 100000000 -n 10 -p 9999 -c 1 | grep -i final
    Final:                    10      7.122 261054.587 261054.587      365.32     365.32           4           4
    ```
    可以看待两个`Pod`之间的网速只有`365MB/S`，根本没有用上`NVLINK`，如果用上的话至少是上百`GB/S`的速率。


3. 分别查看两个`Pod`中容器挂载的`GPU`卡信息，发现分配了不同的`GPU`卡：

    `prefill`容器：
    ```bash
    $ nvidia-smi -L
    GPU 0: NVIDIA H20 (UUID: GPU-b0c5b618-67d0-f464-9905-e1fd41226305)
    GPU 1: NVIDIA H20 (UUID: GPU-4695a002-ab2d-092d-6db9-44e9ae3cb5a6)
    ```
    `decoder`容器：
    ```bash
    $ nvidia-smi -L
    GPU 0: NVIDIA H20 (UUID: GPU-4650fca3-dbba-f168-d6bd-338a4ba8f044)
    GPU 1: NVIDIA H20 (UUID: GPU-9648f14e-6ab2-46f0-221f-777f7652630b)
    ```

## 3. 排查过程

篇幅太长，已省略。

## 4. 解决方案

### 4.1 问题原因
- `GPU`卡资源的分配是由底层`GPU`的`device plugin`来实现的，而GPU资源分配是按照容器维度做了资源隔离。
- 每个容器中只能看到自身分配到的`GPU`卡（并且索引号都是从`0`开始），无法看到其他`GPU`卡，造成不同的容器之间无法发现完整`GPU`拓扑结构，从而引发`NCCL`的`NVLINK`失效。

### 4.2 关键技术

#### 4.2.1 关键配置

#### 4.2.1.1 privileged

**配置类型：** 容器配置

**配置说明：** 通过该配置项标识该容器是特权容器，特权容器能够访问宿主机上所有的硬件资源，包括所有的`GPU卡`。

使用示例：
```yaml
securityContext:
  privileged: true
```

#### 4.2.1.2 NVIDIA_VISIBLE_DEVICES

**配置类型：** 容器运行时控制面环境变量

**配置说明：**

容器申请资源时使用的是`nvidia.com/gpu: "2"`这样的`resources.requests`和`limits`，但在底层进行`GPU`资源分配的时候，`GPU DevicePlugin`先查找空闲的`GPU`卡，再通过给业务容器注入`NVIDIA_VISIBLE_DEVICES`环境来实现的`GPU`卡分配，表示该容器只能使用该环境变量指定的这几张卡。

注意`device plugin`注入的该变量的值存储的是`GPU`卡的`UUID`。

具体可以参考官方资料：https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/docker-specialized.html

使用示例：
```bash
export NVIDIA_VISIBLE_DEVICES="GPU-f055d080-1808-96f1-1c87-70fad19d9040,GPU-4650fca3-dbba-f168-d6bd-338a4ba8f044"
```

#### 4.2.1.3 CUDA_VISIBLE_DEVICES

**配置类型：** 容器运行时控制面环境变量

**配置说明：**

表示使用CUDA的应用程序能够使用的卡索引号列表，`CUDA`应用程序会根据该环境变量去访问`/dev/nvidia*`设备。

默认情况下，业务容器不会被`device plugin`注入该环境变量，`CUDA`应用程序会自动从容器中挂载的索引`0`号的`GPU`卡开始使用。

具体可以参考官方资料：https://docs.nvidia.com/cuda/cuda-c-programming-guide/index.html#env-vars

使用示例：
```bash
export CUDA_VISIBLE_DEVICES="1,2,3,4"
```

#### 4.2.2 技术原理
1. 通过配置`privileged`开启容器的特权模式，这样业务容器能够访问所有的硬件资源，包括完整的`GPU`卡列表，这样每个容器能够看到完整的`GPU`拓扑结构，以便能确认是否能够和目标进行`NVLINK`通信。
2. 业务容器仍然使用`nvidia.com/gpu: "2"`这样的资源申请方式来申请`GPU`卡，让`device plugin`自动分配可用的`GPU`卡给业务容器，并自动注入`NVIDIA_VISIBLE_DEVICES`环境变量到业务容器中。
3. 由于特权容器能够看到宿主机所有的`GPU`卡，默认情况下，业务容器的`CUDA`应用程序会自动从容器中挂载的索引`0`号的`GPU`卡开始使用。当存在多个特权容器时，都访问索引`0`号的`GPU`卡就会出现资源冲突。为了解决这个问题，我们需要让业务容器感知到自身被`device plugin`分配的`GPU`卡是哪些，通过`CUDA_VISIBLE_DEVICES`环境变量设置`CUDA`应用程序允许使用的正确的`GPU`卡索引号。
4. 其中`NVIDIA_VISIBLE_DEVICES`是`device plugin`自动分配的`GPU`卡UUID，我们需要将这些`UUID`转换为宿主机上对应卡的索引号，并将该索引号注入到`CUDA_VISIBLE_DEVICES`环境变量即可。

#### 4.2.3 部署示例

实现原理：
- 通过给容器`privileged`权限，挂载所有的`GPU`设备，提供拓扑信息。
- 此时`CUDA`会看到节点上的所有`GPU`，需要指定其使用`device-plugin`分配的`GPU`。
- `device-plugin`在分配`GPU`资源时会为容器注入环境变量`NVIDIA_VISIBLE_DEVICES`，为指定的`GPU`设备`UUID`，如：`NVIDIA_VISIBLE_DEVICES=GPU-f055d080-1808-96f1-1c87-70fad19d9040,GPU-4650fca3-dbba-f168-d6bd-338a4ba8f044`。
- 将`NVIDIA_VISIBLE_DEVICES`转换为`GPU`的序号设置为`CUDA_VISIBLE_DEVICES`。但由于转换逻辑有点复杂，这里调整为了从本地进程文件中去读取对应的`GPU`索引列表。命令如下：
  ```bash
  CUDA_VISIBLE_DEVICES=$(find /proc/driver/nvidia/gpus/ -mindepth 1 -maxdepth 1 -type d | sort | awk -F'/' '{print $6}'| while read -r gpu_dir; do index=$(grep "Device Minor" "/proc/driver/nvidia/gpus/$gpu_dir/information" 2>/dev/null | awk '{print $3}') ; echo $index; done | paste -sd, )
  ```

部署示例如下，仅供参考：

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: pd-sglang-prefill
  name: pd-sglang-prefill
spec:
  replicas: 1
  selector:
    matchLabels:
      app: pd-sglang-prefill
  template:
    metadata:
      labels:
        app: pd-sglang-prefill
    spec:
      tolerations:
        - effect: NoSchedule
          key: special.accelerate
          operator: Exists
        - effect: NoSchedule
          key: special.accelerate.usage
          value: inference
        - key: "nvidia.com/gpu.product"
          operator: "Equal"
          value: "NVIDIA-H200"         

      containers:
        - name: pd-sglang-prefill
          image: harborai.msxf.lo/online/sglang:0.4.10.post2-cu128
          imagePullPolicy: IfNotPresent
          securityContext:
            privileged: true
            capabilities:
              add:
                - IPC_LOCK

          command:
            - bash
            - -c
            - sleep 30 && CUDA_VISIBLE_DEVICES=$(find /proc/driver/nvidia/gpus/ -mindepth 1 -maxdepth 1 -type d | sort | awk -F'/' '{print $6}'| while read -r gpu_dir; do index=$(grep "Device Minor" "/proc/driver/nvidia/gpus/$gpu_dir/information" 2>/dev/null | awk '{print $3}') ; echo $index; done | paste -sd, ) python3 -m sglang.launch_server  --host 0.0.0.0 --port 30000  --model-path /models/model --served-model-name qwen25-72b-int4-dhzn-pd   --disaggregation-mode prefill  --disaggregation-transfer-backend nixl --enable-torch-compile --torch-compile-max-bs 32 --enable-nccl-nvls --mem-fraction-static 0.9 --enable-p2p-check --tp-size 2 --pp-size 1 --enable-metrics --page-size 64  --enable-metrics --collect-tokens-histogram

          resources:
            limits:
              cpu: "24"
              memory: "150Gi"
              nvidia.com/gpu: 2
            requests:
              cpu: "24"
              memory: "150Gi"
              nvidia.com/gpu: 2
          env:
            - name: UCX_TLS
              value: "cuda_ipc,cuda_copy,tcp"
            - name: UCX_MEMTYPE_CACHE
              value: 'n'
            - name: UCX_RNDV_SCHEME
              value: "get_zcopy"
            - name: UCX_PROTO_INFO
              value: 'y'
            - name: UCX_LOG_LEVEL
              value: 'debug'
            - name: SGL_LOGURU_PATH  
              value: '/home/finance/Logs/prefill.log'              

      affinity:
        nodeAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
            nodeSelectorTerms:
              - matchExpressions:
                  - values:
                      - 'NVIDIA-H200'
                    key: nvidia.com/gpu
                    operator: In

# ...
```

## 5. 参考资料
- https://github.com/NVIDIA/k8s-device-plugin/issues/347
- https://github.com/NVIDIA/nvidia-docker/issues/1255
- https://github.com/NVIDIA/nccl/issues/324
