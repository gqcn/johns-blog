---
slug: "/ai/gpu-mig-docker-specify-subcard"
title: "GPU MIG拆卡后使用docker指定子卡执行"
hide_title: true
keywords:
  [
    "GPU MIG", "MIG拆卡", "docker", "NVIDIA H200", "子卡指定", "NVIDIA_VISIBLE_DEVICES", "MIG Manager", "GPU虚拟化", "容器GPU调度", "MIG UUID", "MIG索引", "nvidia-container-runtime"
  ]
description: "详细介绍NVIDIA GPU通过MIG拆卡后，如何在Docker容器中指定特定MIG子卡执行任务的两种方法：通过docker device参数和NVIDIA_VISIBLE_DEVICES环境变量，支持UUID和索引两种方式"
---


## 1. 背景介绍
对`H200`进行`MIG`拆卡，拆分为`1`张`2g35gb`，`5`张`1g18gb`，拆卡已经通过`Kubernetes MIG Manager`实现。在节点上使用`nvidia-smi -L`查看，如下：
```bash
$ nvidia-smi -L
GPU 0: NVIDIA H200 (UUID: GPU-b2acda36-db78-a209-f9ef-d07b4336c449)
  MIG 2g.35gb     Device  0: (UUID: MIG-b05c0034-4d0e-5d3c-a25c-e6795d1779df)
  MIG 1g.18gb     Device  1: (UUID: MIG-be041b89-b751-5c96-84aa-85315833c669)
  MIG 1g.18gb     Device  2: (UUID: MIG-605bf89c-7be6-586e-a729-a2369e833b3e)
  MIG 1g.18gb     Device  3: (UUID: MIG-02b4e55e-29a1-5d28-b9ee-8e9445e355f0)
  MIG 1g.18gb     Device  4: (UUID: MIG-dc7ad5d3-20d8-5dcb-adf7-fb22c2459352)
  MIG 1g.18gb     Device  5: (UUID: MIG-148a1759-0dd2-59c6-9605-26206ae0e79b)
GPU 1: NVIDIA H200 (UUID: GPU-af5e38ec-d1d6-1c20-67c8-c8001109e6d8)
GPU 2: NVIDIA H200 (UUID: GPU-da9f3cba-5f87-5830-26d6-b3f5a545ae34)
GPU 3: NVIDIA H200 (UUID: GPU-f2c60745-001d-1948-52bb-c9616b34da97)
GPU 4: NVIDIA H200 (UUID: GPU-7b8f55d1-e1d9-30a2-590b-3eff9b86ae05)
GPU 5: NVIDIA H200 (UUID: GPU-a73089ba-c8f9-f9dc-bd1e-9da99cb2104b)
GPU 6: NVIDIA H200 (UUID: GPU-4e19f7d9-e5d6-1223-e9d2-983f01ef45f6)
GPU 7: NVIDIA H200 (UUID: GPU-5b73e21c-9b5d-4156-8b8d-aed96f9f8d86)
```

## 2. 解决方案
参考官方文档：https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/docker-specialized.html

### 2.1 使用镜像
这里使用到了公司测试环境的内网镜像：`aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128`
如果需要使用公网镜像，那么可以使用`nvidia`官方提供的镜像：`nvidia/cuda`

### 2.2 指定runtime
首先需要保证`docker`的`runtime`配置为`nvidia`：
```bash
$ cat /etc/docker/daemon.json
  {
      "bip":"192.168.99.1/16",
      "exec-opts": ["native.cgroupdriver=cgroupfs"],
      "default-runtime":"nvidia",
      "runtimes": {
          "nvidia": {
              "path": "/usr/bin/nvidia-container-runtime",
              "runtimeArgs": []
          }
      },
          "data-root": "/home/docker/data",
          "insecure-registries": ["harbor.maip.io","aiharbor.msxf.local"],
          "experimental": true,
          "live-restore": true
  }
```
如果没有配置`default-runtime`为`nvidia`，那么在`docker`执行命令中需要增加指定`runtime`的参数，例如：
```bash
docker run --rm --runtime=nvidia -e NVIDIA_VISIBLE_DEVICES=2,3 aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 nvidia-smi
```

### 2.3 指定使用MIG子卡
#### 2.3.1 通过docker device指定子卡
指定子卡执行`docker`镜像。可以通过子卡的`UUID`或者`索引号`来指定。

##### 2.3.1.1 通过指定UUID
```bash
docker run --rm --gpus device=MIG-b05c0034-4d0e-5d3c-a25c-e6795d1779df aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 nvidia-smi
```
执行后，终端输出：
```text
Mon Jul 28 01:58:33 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.86.15              Driver Version: 570.86.15      CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H200                    Off |   00000000:2A:00.0 Off |                   On |
| N/A   30C    P0             76W /  700W |                  N/A   |     N/A      Default |
|                                         |                        |              Enabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| MIG devices:                                                                            |
+------------------+----------------------------------+-----------+-----------------------+
| GPU  GI  CI  MIG |                     Memory-Usage |        Vol|        Shared         |
|      ID  ID  Dev |                       BAR1-Usage | SM     Unc| CE ENC  DEC  OFA  JPG |
|                  |                                  |        ECC|                       |
|==================+==================================+===========+=======================|
|  0    5   0   0  |              29MiB / 33280MiB    | 32      0 |  2   0    2    0    2 |
|                  |                 0MiB / 65535MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```
##### 2.3.1.2 通过指定子卡索引
注意这里指定的子卡索引:
```bash
docker run --rm --gpus '"device=0:0,0:1"' aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 nvidia-smi
```
执行后，终端输出：
```text
Mon Jul 28 02:00:04 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.86.15              Driver Version: 570.86.15      CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H200                    Off |   00000000:2A:00.0 Off |                   On |
| N/A   31C    P0             76W /  700W |                  N/A   |     N/A      Default |
|                                         |                        |              Enabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| MIG devices:                                                                            |
+------------------+----------------------------------+-----------+-----------------------+
| GPU  GI  CI  MIG |                     Memory-Usage |        Vol|        Shared         |
|      ID  ID  Dev |                       BAR1-Usage | SM     Unc| CE ENC  DEC  OFA  JPG |
|                  |                                  |        ECC|                       |
|==================+==================================+===========+=======================|
|  0    5   0   0  |              29MiB / 33280MiB    | 32      0 |  2   0    2    0    2 |
|                  |                 0MiB / 65535MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+
|  0    7   0   1  |              15MiB / 16384MiB    | 16      0 |  1   0    1    0    1 |
|                  |                 0MiB / 32767MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```
### 2.3.2 通过环境变量指定子卡
也可以通过`NVIDIA_VISIBLE_DEVICES`环境变量来指定使用的子卡，当然该环境变量也支持使用子卡的`UUID`或者`索引号`。

#### 2.3.2.1 通过指定UUID
```bash
docker run -e NVIDIA_VISIBLE_DEVICES=MIG-b05c0034-4d0e-5d3c-a25c-e6795d1779df,MIG-be041b89-b751-5c96-84aa-85315833c669 aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 nvidia-smi
```
执行后，终端输出：
```text
Mon Jul 28 02:04:51 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.86.15              Driver Version: 570.86.15      CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H200                    Off |   00000000:2A:00.0 Off |                   On |
| N/A   31C    P0             77W /  700W |                  N/A   |     N/A      Default |
|                                         |                        |              Enabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| MIG devices:                                                                            |
+------------------+----------------------------------+-----------+-----------------------+
| GPU  GI  CI  MIG |                     Memory-Usage |        Vol|        Shared         |
|      ID  ID  Dev |                       BAR1-Usage | SM     Unc| CE ENC  DEC  OFA  JPG |
|                  |                                  |        ECC|                       |
|==================+==================================+===========+=======================|
|  0    5   0   0  |              29MiB / 33280MiB    | 32      0 |  2   0    2    0    2 |
|                  |                 0MiB / 65535MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+
|  0    7   0   1  |              15MiB / 16384MiB    | 16      0 |  1   0    1    0    1 |
|                  |                 0MiB / 32767MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```
#### 2.3.2.2 通过指定子卡索引
```bash
docker run -e NVIDIA_VISIBLE_DEVICES=0:0,0:1 aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 nvidia-smi
```

执行后，终端输出：

```text
Mon Jul 28 02:02:51 2025
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.86.15              Driver Version: 570.86.15      CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|                                         |                        |               MIG M. |
|=========================================+========================+======================|
|   0  NVIDIA H200                    Off |   00000000:2A:00.0 Off |                   On |
| N/A   31C    P0             76W /  700W |                  N/A   |     N/A      Default |
|                                         |                        |              Enabled |
+-----------------------------------------+------------------------+----------------------+

+-----------------------------------------------------------------------------------------+
| MIG devices:                                                                            |
+------------------+----------------------------------+-----------+-----------------------+
| GPU  GI  CI  MIG |                     Memory-Usage |        Vol|        Shared         |
|      ID  ID  Dev |                       BAR1-Usage | SM     Unc| CE ENC  DEC  OFA  JPG |
|                  |                                  |        ECC|                       |
|==================+==================================+===========+=======================|
|  0    5   0   0  |              29MiB / 33280MiB    | 32      0 |  2   0    2    0    2 |
|                  |                 0MiB / 65535MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+
|  0    7   0   1  |              15MiB / 16384MiB    | 16      0 |  1   0    1    0    1 |
|                  |                 0MiB / 32767MiB  |           |                       |
+------------------+----------------------------------+-----------+-----------------------+

+-----------------------------------------------------------------------------------------+
| Processes:                                                                              |
|  GPU   GI   CI              PID   Type   Process name                        GPU Memory |
|        ID   ID                                                               Usage      |
|=========================================================================================|
|  No running processes found                                                             |
+-----------------------------------------------------------------------------------------+
```

## 3. 相关问题
### 3.1 sglang v0.4.9.post4以下版本不支持指定MIG子卡
#### 3.1.1 问题描述
尝试在`H200`的节点上指定`MIG`子卡，执行以下命令运行推理服务：
```bash
docker run -it --rm \
--name Qwen2.5-7b-fp8 \
--gpus='"device=MIG-b05c0034-4d0e-5d3c-a25c-e6795d1779df"' \
-v /share:/share \
-p 9800:8000 \
aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 \
python3 -m sglang.launch_server \
        --model-path /share/global/models/Qwen2.5-7B-Instruct/ \
        --host 0.0.0.0 \
        --port 8000 \
        --disable-radix-cache \
        --served-model-name Qwen2.5-7b-fp8 \
        --tensor-parallel-size 1 \
        --quantization fp8 \
        --dtype auto
```
执行后，将会出现报错：
```text
2025-07-28 06:24:08.068 | INFO     | vllm.platforms:resolve_current_platform_cls_qualname:244 - Automatically detected platform cuda.
/tmp/pinpointdxbgbm_2
Traceback (most recent call last):
  File "<frozen runpy>", line 198, in _run_module_as_main
  File "<frozen runpy>", line 88, in _run_code
  File "/usr/local/python3/lib/python3.12/site-packages/sglang/launch_server.py", line 16, in <module>
    server_args = prepare_server_args(sys.argv[1:])
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/python3/lib/python3.12/site-packages/sglang/srt/server_args.py", line 1689, in prepare_server_args
    server_args = ServerArgs.from_cli_args(raw_args)
                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/python3/lib/python3.12/site-packages/sglang/srt/server_args.py", line 1632, in from_cli_args
    return cls(**{attr: getattr(args, attr) for attr in attrs})
           ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "<string>", line 165, in __init__
  File "/usr/local/python3/lib/python3.12/site-packages/sglang/srt/server_args.py", line 273, in __post_init__
    gpu_mem = get_device_memory_capacity(self.device)
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/python3/lib/python3.12/site-packages/sglang/srt/utils.py", line 1316, in get_device_memory_capacity
    gpu_mem = get_nvgpu_memory_capacity()
              ^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/usr/local/python3/lib/python3.12/site-packages/sglang/srt/utils.py", line 1263, in get_nvgpu_memory_capacity
    raise ValueError("No GPU memory values found.")
ValueError: No GPU memory values found.
```
#### 3.1.2 问题原因
根据社区检索和源码排查，最终确定问题出在`sglang`上，相关连接：https://github.com/sgl-project/sglang/pull/8167
问题原因是`sglang`当前版本（`v0.4.8`）默认通过命令行的方式去获取GPU卡的内存信息，然后整卡的内存获取和`MIG`子卡的内存获取方式会不太一样，具体源码在这里：https://github.com/sgl-project/sglang/blob/7c3a12c0002e33fed1e72f4157e74a64a998f251/python/sglang/srt/utils.py#L1235
![alt text](<assets/7500-GPU MIG拆卡后使用docker指定子卡执行/image.png>)

#### 3.1.3 验证方式
当前`sglang`版本或通过以下方式获取显存大小：
```bash
docker run --rm --gpus '"device=MIG-b05c0034-4d0e-5d3c-a25c-e6795d1779df"'  aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 nvidia-smi --query-gpu=memory.total --format=csv,noheader,nounits
```
当直接将该命令在节点上执行后，终端会输出`Insufficient Permissions`的错误，因此`sglang`获取显存就失败了，直接退出执行。
可以通过以下方式验证`Github`上`PR`方案的可行性：
1. 手动执行进入容器
    ```bash
    docker run -it --rm --gpus '"device=MIG-b05c0034-4d0e-5d3c-a25c-e6795d1779df"' aiharbor.msxf.local/test/sglang:0.4.8.post1-cu128 bash 
    ```
2. 执行以下python脚本验证
    ```python
    python3 -c "
    import torch
    print('CUDA available:', torch.cuda.is_available())
    print('Device count:', torch.cuda.device_count())
    if torch.cuda.is_available():
        print('Device name:', torch.cuda.get_device_name(0))
        print('Memory:', torch.cuda.get_device_properties(0).total_memory / 1024**3, 'GB')
    "
    ```
    终端输出：
    ```text
    CUDA available: True
    Device count: 1
    Device name: NVIDIA H200 MIG 2g.35gb
    Memory: 32.5 GB
    ```
3. 也可以通过另外python脚本验证，该脚本实现方式来源于PR提交内容
    ```python
    python3 -c "
    import torch
    print('CUDA available:', torch.cuda.is_available())
    print('Device count:', torch.cuda.device_count())
    if torch.cuda.is_available():
        print('Device name:', torch.cuda.get_device_name(0))
        print('Memory:', torch.cuda.mem_get_info()[1] / 1024**3, 'GB')
    "
    ```
    终端输出：
    ```text
    CUDA available: True
    Device count: 1
    Device name: NVIDIA H200 MIG 2g.35gb
    Memory: 32.5 GB
    ```
#### 3.1.4 解决方案
- 【推荐】升级使用的`sglang`版本到`v0.4.9.post4`或以上解决该问题。
- 考虑切换到`vllm`框架，并参考`vllm`框架解决方案。