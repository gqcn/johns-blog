---
slug: "/ai/jupyter-intro-usage"
title: "Jupyter基本介绍与使用"
hide_title: true
keywords:
  [
    Jupyter,
    JupyterLab,
    Jupyter Notebook,
    计算型笔记本,
    交互式计算,
    数据科学,
    机器学习,
    IPython,
    Docker部署,
    Kubernetes部署,
    JupyterHub,
    Python开发环境
  ]
description: "深入介绍Jupyter交互式计算平台，包括核心概念、应用场景、使用Docker快速部署JupyterLab、以及在Kubernetes上部署单用户和多用户JupyterHub环境的完整指南。"
---

## 什么是Jupyter？

`Jupyter`是一个开源的大型伞形项目（`Umbrella Project`），涵盖了多个软件产品和工具。`Jupyter`项目及其子项目都围绕着为交互式计算提供工具和标准，核心是**计算型笔记本（`Computational Notebook`）**。

### 核心概念

**计算型笔记本（`Computational Notebook`）** 是 `Jupyter` 的核心理念。它借鉴了著名计算机科学家`Donald Knuth`提出的"文学编程"（`Literate Programming`）思想，将：

- **代码**（`Code`）
- **说明性文本**（`Narrative Text`）
- **数据**（`Data`）
- **可视化内容**（`Rich Visualizations`）
- **交互式控件**（`Interactive Controls`）

组合在一个可共享的文档中。这种方式使得复杂的信息和想法能够更好地向广泛的受众进行解释和传播。

### Jupyter项目组成

`Jupyter`元包（`metapackage`）安装时会包含以下核心组件：

- **JupyterLab** - 功能丰富的现代化笔记本编辑环境
- **Jupyter Notebook** - 简化的轻量级笔记本编辑应用
- **IPython** - 交互式`Python shell`和内核
- **ipykernel** - `Jupyter`的`IPython`内核
- **nbconvert** - 笔记本格式转换工具
- **ipywidgets** - 交互式小部件包

### Jupyter解决的问题

1. **交互式开发** - 提供快速的交互式编程环境（`REPL`），支持代码的快速原型开发和调试
2. **结果可视化** - 将代码执行结果、图表、数据直接嵌入到文档中，便于理解和展示
3. **知识共享** - 通过笔记本格式，将代码、文档、数据和分析结果整合在一起，便于分享和协作
4. **教学与学习** - 非常适合用于教学场景，可以边写边运行代码，直观展示执行过程
5. **数据科学工作流** - 为数据分析、机器学习、科学计算提供完整的工作环境
6. **可重现研究** - 确保研究结果的可重现性，记录完整的分析过程

### 应用场景

`Jupyter`在科研、教育、工业界都有广泛应用：

- **科学研究** - `NASA`使用`Jupyter`处理詹姆斯·韦伯太空望远镜（`JWST`）的天文数据
- **天文学** - 首张黑洞照片的生成使用了`Jupyter`进行数据处理
- **物理学** - `LIGO`项目使用`Jupyter`计算引力波的存在
- **数据分析** - 企业用于数据分析、报表生成、业务洞察
- **机器学习** - 模型训练、实验跟踪、结果可视化
- **教育培训** - 计算机科学、数据科学课程的教学工具

## 使用Docker运行JupyterLab

使用`Docker`是在本地快速启动`JupyterLab`的最简单方式。`Jupyter`官方提供了一系列预构建的`Docker`镜像。

### 基础镜像选择


`Jupyter`官方维护了多个`Docker`镜像，适用于不同场景：

| 镜像名称 | 主要内容/用途 |
|---|---|
| `jupyter/base-notebook` | 最小化的`Jupyter`环境 |
| `jupyter/minimal-notebook` | 包含`TeX Live`，用于导出`PDF` |
| `jupyter/scipy-notebook` | 包含科学计算库（`pandas`, `matplotlib`, `scipy` 等） |
| `jupyter/tensorflow-notebook` | 包含`TensorFlow`机器学习库 |
| `jupyter/pytorch-notebook` | 包含`PyTorch`机器学习库 |
| `jupyter/datascience-notebook` | 包含`Julia`、`Python`、`R` 三种语言支持 |
| `jupyter/all-spark-notebook` | 包含`Apache Spark`支持 |

### 快速启动

最简单的启动方式：

```bash
docker run -p 8888:8888 quay.io/jupyter/base-notebook:latest
```

:::note 提示
`Jupyter`官方镜像托管在`quay.io`，而非`Docker Hub`。
:::

启动后，终端会输出包含`token`的访问链接，格式为：`http://127.0.0.1:8888/lab?token=<your-token>`，例如：

```text
http://127.0.0.1:8888/lab?token=43f464700dbba3f9a6e5fdb3802517144d526c0073ef9e6c
```

使用浏览器打开该链接即可访问`JupyterLab`。

### 持久化数据

为了保存工作内容，需要挂载本地目录：

```bash
docker run -p 8888:8888 \
  -v "${PWD}/notebooks:/home/jovyan/work" \
  quay.io/jupyter/base-notebook:latest
```

这会将当前目录下的`notebooks`文件夹映射到容器内的`/home/jovyan/work`目录。

### 设置工作目录

```bash
docker run -p 8888:8888 \
  -v "${PWD}/notebooks:/home/jovyan/notebooks" \
  -e JUPYTER_ENABLE_LAB=yes \
  quay.io/jupyter/base-notebook:latest \
  start-notebook.sh --notebook-dir=/home/jovyan/notebooks
```

### 设置环境变量

`Jupyter Docker Stacks`镜像支持以下环境变量进行配置：

#### 用户相关配置

| 环境变量 | 说明 | 默认值 | 示例 |
|---------|------|--------|------|
| `NB_USER` | 容器内用户名和主目录名称 | `jovyan` | `-e NB_USER="myuser"` |
| `NB_UID` | 用户的数字ID，用于匹配主机文件权限 | `1000` | `-e NB_UID=1001` |
| `NB_GID` | 用户的主组ID | `100` | `-e NB_GID=1001` |
| `NB_GROUP` | 用户组名称，配合`NB_GID`使用 | `${NB_USER}` | `-e NB_GROUP="mygroup"` |

#### 权限相关配置

| 环境变量 | 说明 | 默认值 | 示例 |
|---------|------|--------|------|
| `GRANT_SUDO` | 赋予用户无密码`sudo`权限（需要`--user root`） | - | `-e GRANT_SUDO=yes` |
| `CHOWN_HOME` | 更改用户主目录的所有者为`${NB_UID}:${NB_GID}` | - | `-e CHOWN_HOME=yes` |
| `CHOWN_HOME_OPTS` | 修改`chown`行为的选项 | - | `-e CHOWN_HOME_OPTS="-R"` |
| `CHOWN_EXTRA` | 逗号分隔的目录列表，更改其所有者 | - | `-e CHOWN_EXTRA="/data,/tmp/work"` |
| `CHOWN_EXTRA_OPTS` | 修改`CHOWN_EXTRA`的`chown`行为 | - | `-e CHOWN_EXTRA_OPTS="-R"` |
| `NB_UMASK` | 设置`Jupyter`进程的`umask`值 | `022` | `-e NB_UMASK=002` |

#### Jupyter运行时配置

| 环境变量 | 说明 | 默认值 | 示例 |
|---------|------|--------|------|
| `DOCKER_STACKS_JUPYTER_CMD` | 指定启动的`Jupyter`命令（`lab`/`notebook`/`nbclassic`/`server`） | `lab` | `-e DOCKER_STACKS_JUPYTER_CMD=notebook` |
| `JUPYTER_PORT` | `Jupyter`服务监听的端口 | `8888` | `-e JUPYTER_PORT=8117` |
| `JUPYTER_TOKEN` | 设置固定的访问`token`，而不是自动生成 | 自动生成 | `-e JUPYTER_TOKEN=mytoken123` |
| `NOTEBOOK_ARGS` | 传递给`jupyter`命令的额外参数 | - | `-e NOTEBOOK_ARGS="--log-level='DEBUG'"` |
| `RESTARTABLE` | 在循环中运行`Jupyter`，退出后不终止容器 | - | `-e RESTARTABLE=yes` |
| `JUPYTER_ENV_VARS_TO_UNSET` | 启动前要取消设置的环境变量列表（逗号分隔） | - | `-e JUPYTER_ENV_VARS_TO_UNSET="SECRET1,SECRET2"` |
| `JUPYTERHUB_API_TOKEN` | `JupyterHub`环境下的`API token`（自动传递，无需手动设置） | - | 由`JupyterHub`自动设置 |

#### SSL/TLS配置

| 环境变量 | 说明 | 默认值 | 示例 |
|---------|------|--------|------|
| `GEN_CERT` | 生成自签名`SSL`证书并启用`HTTPS` | - | `-e GEN_CERT=yes` |


#### 常用配置组合示例

**基础开发环境**：
```bash
docker run -p 8888:8888 \
  -v "${PWD}:/home/jovyan/work" \
  -e JUPYTER_ENABLE_LAB=yes \
  quay.io/jupyter/base-notebook:latest
```

**自定义用户和权限**：
```bash
docker run -p 8888:8888 \
  --user root \
  -e NB_USER="datauser" \
  -e NB_UID=1001 \
  -e NB_GID=1001 \
  -e CHOWN_HOME=yes \
  -e GRANT_SUDO=yes \
  -w "/home/datauser" \
  -v "${PWD}:/home/datauser/work" \
  quay.io/jupyter/base-notebook:latest
```

**使用Jupyter Notebook界面**：
```bash
docker run -p 8888:8888 \
  -e DOCKER_STACKS_JUPYTER_CMD=notebook \
  -v "${PWD}:/home/jovyan/work" \
  quay.io/jupyter/base-notebook:latest
```

**自签名HTTPS访问**：
```bash
docker run -p 8888:8888 \
  -e GEN_CERT=yes \
  -v "${PWD}:/home/jovyan/work" \
  quay.io/jupyter/base-notebook:latest
```

**调试模式**：
```bash
docker run -p 8888:8888 \
  -e NOTEBOOK_ARGS="--log-level='DEBUG' --dev-mode" \
  -v "${PWD}:/home/jovyan/work" \
  quay.io/jupyter/base-notebook:latest
```

**设置固定Token**：
```bash
# 设置固定token，方便开发环境访问
docker run -p 8888:8888 \
  -e JUPYTER_TOKEN=mytoken123 \
  -v "${PWD}:/home/jovyan/work" \
  quay.io/jupyter/base-notebook:latest
# 访问地址: http://localhost:8888/lab?token=mytoken123
```

**禁用Token认证（仅限开发环境）**：
```bash
# 完全禁用token认证（不推荐用于生产环境）
docker run -p 8888:8888 \
  -v "${PWD}:/home/jovyan/work" \
  quay.io/jupyter/base-notebook:latest \
  start-notebook.py --IdentityProvider.token=''
# 访问地址: http://localhost:8888/lab
```


## 在Kubernetes上部署JupyterLab

### 创建 Namespace

用于管理`JupyterLab`资源的独立命名空间，所有用户的`JupyterLab Pod`都将在此命名空间中运行：

```yaml title="namespace.yaml"
apiVersion: v1
kind: Namespace
metadata:
  name: jupyter-system
```

### 创建 PV（可选）

通过`PV`持久化存储用户数据，多个用户可以共享一个`PV`，通过不同的目录区分不同用户的数据：

```yaml title="pv.yaml"
apiVersion: v1
kind: PersistentVolume
metadata:
  name: jupyterlab-pv
spec:
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteMany
  persistentVolumeReclaimPolicy: Retain
  storageClassName: ""
  hostPath:
    path: /data/jupyterlab
    type: DirectoryOrCreate
```

### 创建 PVC（可选）

通过`PVC`声明当前`Jupyter`开发机依赖的存储（通常是一块云盘）：

```yaml title="pvc.yaml"
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jupyterlab-pvc
  namespace: jupyter-system
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi
  # storageClassName: <your-storage-class>
```

### 创建 Pod/Deployment

#### Pod

```yaml title="pod.yaml"
apiVersion: v1
kind: Pod
metadata:
  name: jupyterlab
  namespace: jupyter-system
  labels:
    app: jupyterlab
spec:
  containers:
  - name: jupyterlab
    image: quay.io/jupyter/base-notebook:latest
    imagePullPolicy: IfNotPresent
    ports:
    - containerPort: 8888
      name: http
      protocol: TCP
    env:
    - name: JUPYTER_ENABLE_LAB
      value: "yes"
    - name: GRANT_SUDO
      value: "yes"
    # volumeMounts:
    # - name: jupyterlab-data
    #   mountPath: /home/jovyan/work
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
  # volumes:
  # - name: jupyterlab-data
  #   persistentVolumeClaim:
  #     claimName: jupyterlab-pvc
```

#### Deployment

通常使用`Deployment`而不是`Pod`来部署`JupyterLab`的`Pod`，因为直接用`Pod`来部署的话，如果`Pod`挂掉了是不会自动重启的，而`Deployment`会帮我们管理`Pod`的生命周期，确保`Pod`始终运行。

```yaml title="deployment.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jupyterlab
  namespace: jupyter-system
  labels:
    app: jupyterlab
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jupyterlab
  template:
    metadata:
      labels:
        app: jupyterlab
    spec:
      containers:
      - name: jupyterlab
        image: quay.io/jupyter/base-notebook:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 8888
          name: http
          protocol: TCP
        env:
        - name: JUPYTER_ENABLE_LAB
          value: "yes"
        - name: GRANT_SUDO
          value: "yes"
        # volumeMounts:
        # - name: jupyterlab-data
        #   mountPath: /home/jovyan/work
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
      # volumes:
      # - name: jupyterlab-data
      #   persistentVolumeClaim:
      #     claimName: jupyterlab-pvc
```


### 创建 Service

创建`Service`才能将`Deployment`对外访问。

```yaml title="service.yaml"
apiVersion: v1
kind: Service
metadata:
  name: jupyterlab
  namespace: jupyter-system
spec:
  type: ClusterIP
  ports:
  - port: 8888
    targetPort: 8888
    protocol: TCP
    name: http
  selector:
    app: jupyterlab
```

### 创建 Ingress（可选）

如果是需要对集群外提供访问，那么通常需要设置`Ingress`。

```yaml title="ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jupyterlab
  namespace: jupyter-system
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    # 如果使用 HTTPS
    # cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  ingressClassName: nginx
  rules:
  - host: jupyterlab.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: jupyterlab
            port:
              number: 8888
  # tls:
  # - hosts:
  #   - jupyterlab.example.com
  #   secretName: jupyterlab-tls
```

### 部署应用

```bash
# 创建所有资源
kubectl apply -f namespace.yaml
kubectl apply -f pvc.yaml
kubectl apply -f pod.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml

# 查看 Pod 状态
kubectl get pods -n jupyter-system

# 查看日志获取访问 token
kubectl logs -n jupyter-system <pod-name>
```

### 访问 JupyterLab

如果使用`Ingress`，直接访问配置的域名即可。

如果没有`Ingress`，可以使用`Port Forward`：

```bash
kubectl port-forward --address 0.0.0.0 -n jupyter-system svc/jupyterlab 8888:8888
```

然后访问 http://localhost:8888




## 参考资料

- [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/)
- [Jupyter Server Configuration](https://jupyter-server.readthedocs.io/en/latest/other/full-config.html)