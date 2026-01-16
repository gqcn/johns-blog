---
slug: "/ai/jupyter-case"
title: "Jupyter使用案例"
hide_title: true
keywords:
  [
    Jupyter,
    JupyterLab,
    Kubernetes,
    NFS存储,
    Pod配置,
    用户权限管理,
    UID/GID,
    InitContainer,
    PersistentVolume,
    PersistentVolumeClaim,
    共享存储,
    多用户环境,
    安全隔离,
    数据访问控制,
    企业级部署
  ]
description: "详细介绍在Kubernetes环境中部署多用户JupyterLab的实践案例。通过NFS共享存储配置PV/PVC，使用InitContainer动态读取用户UID/GID实现权限隔离，确保每个用户的JupyterLab实例只能访问自己的数据目录。涵盖完整的Pod配置、安全上下文设置、存储挂载和访问方式，适用于企业级多租户JupyterLab部署场景。"
---



## 背景描述

- 我们有`NFS`网盘，网盘中存储了各个用户的数据和文件。
- 每个用户可以创建不同的`JupyterLab`，在其中可以访问和操作这些数据和文件。
- 我们希望通过`Kubernetes`的`Pod`配置，确保`JupyterLab`以非`root`用户身份运行，并且用户只能访问自己的数据目录。

## 配置示例

### PV

创建`NFS`网络存储的`PersistentVolume`：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: hpc-pv
spec:
  capacity:
    storage: 100Ti
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  mountOptions:
    - vers=3
    - rsize=1048576
    - wsize=1048576
    - hard
    - nolock
    - proto=tcp
  nfs:
    server: aixsky.msxf.local
    path: /hpc
```

### PVC

创建`PersistentVolumeClaim`以便使用到`Pod`中，需要注意的是该PVC可以被多个`Pod`共享挂载：

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: hpc-shared-pvc
spec:
  resources:
    requests:
      storage: 100Ti 
  accessModes:
    - ReadWriteMany 
  storageClassName: ""  # 必须和 PV 一致（空字符串）
  volumeName: hpc-pv
```

### Jupyter Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: jupyterlab-qiangguo03
  namespace: jupyter-system
  labels:
    app: jupyterlab-qiangguo03
spec:
 # 核心：initContainer 自动读取 HPC 目录的 UID/GID
  initContainers:
  - name: init
    image: aiharbor.msxf.local/base/ubuntu:22.04
    command:
      - /bin/bash
      - -c
      - |
        # 出错立即退出
        set -e

        USER_DIR="/data/hpc/home"
        USER_NAME="qiang.guo03"

        # 读取目录的 UID 和 GID（ls -n 输出的第3、4列）
        USER_UID=$(ls -n ${USER_DIR} | grep ${USER_NAME} | awk '{print $3}' | head -n1)
        USER_GID=$(ls -n ${USER_DIR} | grep ${USER_NAME} | awk '{print $4}' | head -n1)

        # 将 UID/GID 写入共享卷的配置文件
        echo "USER_UID=${USER_UID}" > /config/uid-gid.env
        echo "USER_GID=${USER_GID}" >> /config/uid-gid.env
        echo "USER_NAME=${USER_NAME}" >> /config/uid-gid.env

        # 打印日志（方便调试）
        echo "Read ${USER_NAME}, UID: ${USER_UID}, GID: ${USER_GID}"
    volumeMounts:
    - name: hpc-shared-volume
      mountPath: /data/hpc  
    - name: uid-gid-config
      mountPath: /config
      
  containers:
  - name: jupyterlab
    image: aiharbor.msxf.local/jupyterhub/minimal-notebook:3.3.8
    imagePullPolicy: IfNotPresent
    command:
      - /bin/bash
      - -c
      - |
        # 出错立即退出
        set -e  

        # 加载 initContainer 写入的 UID/GID 配置
        source /config/uid-gid.env

        export NB_UID=${USER_UID}
        export NB_GID=${USER_GID}
        export NB_USER=${USER_NAME}

        # 将网盘中的个人目录软链到home目录下
        ln -s /data/hpc/home/${USER_NAME} /home/${USER_NAME}

        # 启动Jupyter Server，默认使用/home/jovyan/.jupyter/jupyter_server_config.py配置文件
        start-notebook.sh
    securityContext:
      runAsUser: 0  
      runAsGroup: 0
    ports:
    - containerPort: 8888
      name: http
      protocol: TCP
    env:
    - name: JUPYTER_ENABLE_LAB
      value: "yes"
    - name: JUPYTER_TOKEN
      value: "pass"
    volumeMounts:
    - name: hpc-shared-volume
      mountPath: /data/hpc
    - name: uid-gid-config
      mountPath: /config
    resources:
      requests:
        cpu: "1"
        memory: "2Gi"
      limits:
        cpu: "2"
        memory: "4Gi"
    livenessProbe:
      httpGet:
        path: /lab
        port: 8888
      initialDelaySeconds: 30
      periodSeconds: 10
    readinessProbe:
      httpGet:
        path: /lab
        port: 8888
      initialDelaySeconds: 10
      periodSeconds: 5
      
  volumes:
  # HPC共享网盘
  - name: hpc-shared-volume
    persistentVolumeClaim:
      claimName: hpc-shared-pvc
  # 共享卷：用于 initContainer 和主容器传递 UID/GID
  - name: uid-gid-config         
    emptyDir: {}
```

### 访问Pod

使用`Port Forward`：

```bash
kubectl port-forward --address 0.0.0.0 -n jupyter-system pod/jupyterlab-qiangguo03 8888:8888
```

然后访问 http://localhost:8888
