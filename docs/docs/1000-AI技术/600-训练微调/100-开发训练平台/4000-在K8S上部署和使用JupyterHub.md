---
slug: "/ai/jupyterhub-k8s-deployment"
title: "在K8S上部署和使用JupyterHub"
hide_title: true
keywords:
  [
    "JupyterHub",
    "Kubernetes",
    "K8S",
    "Jupyter Notebook",
    "JupyterLab",
    "多用户",
    "AI训练平台",
    "机器学习",
    "深度学习",
    "Helm",
    "Docker镜像",
    "PyTorch",
    "TensorFlow",
    "GPU",
    "分布式训练",
    "Notebook环境",
    "数据科学",
    "持久化存储",
    "资源管理"
  ]
description: "详细介绍如何在Kubernetes上部署和配置JupyterHub多用户Notebook环境，包括Helm安装、配置管理、自定义镜像构建、用户资源分配、GPU支持等内容，以及如何在Notebook中安装AI开发工具包"
---



## 概述

`JupyterHub`是一个多用户的`Jupyter Notebook`服务器，它允许用户通过网页访问计算环境。结合 `Kubernetes`的可扩展性，`JupyterHub` 可以为大规模用户群体（如学生、研究团队、数据科学团队等）提供标准化的计算环境。

本文将介绍如何在`Kubernetes`上部署 `JupyterHub`，以及如何进行配置和定制，包括扩展 `Jupyter Notebook` 镜像以预置常用的`AI`开发和训练工具包。

主要特性：

- **多用户支持**：支持数百甚至数千用户同时访问
- **资源隔离**：每个用户拥有独立的计算资源
- **弹性伸缩**：根据需求自动扩展计算资源
- **持久化存储**：用户数据持久化保存
- **灵活定制**：支持自定义镜像、认证方式等

## 前置条件

在开始之前，确保你已经具备以下条件：

| 组件 | 版本要求 | 说明 |
|------|----------|------|
| `Kubernetes` | `>= 1.23` | 需要有可用的`K8S`集群，支持动态存储卷 |
| `Helm` | `>= 3.5` | `Kubernetes`包管理工具 |
| `kubectl` | 与集群版本匹配 | 已配置并可以访问你的`K8S`集群 |
| 集群资源 | 至少`2`个`worker`节点 | 每个节点建议`4GB+`内存，`2C`+`CPU` |
| 存储类(`StorageClass`) | 支持动态供给 | 用于用户数据持久化存储 |
| 镜像仓库 | 可选 | 如需使用自定义镜像，需要可访问的镜像仓库 |

## 部署JupyterHub

### 添加JupyterHub Helm仓库

首先，将`JupyterHub`的`Helm Chart`仓库添加到本地：

```bash
helm repo add jupyterhub https://hub.jupyter.org/helm-chart/
helm repo update
```

### 安装JupyterHub

使用`Helm`拉取`JupyterHub`安装包：

```bash
helm pull jupyterhub/jupyterhub --version=4.3.2 --untar
```

使用以下指令安装`JupyterHub`：

```bash
helm install jupyterhub ./jupyterhub -n jupyterhub-system --create-namespace
```

### 验证部署

查看`Pod`状态：

```bash
kubectl get pod --namespace jupyterhub-system
```

等待所有`Pod`进入`Running`状态：

```text
NAME                              READY   STATUS    RESTARTS   AGE
continuous-image-puller-7f49d     1/1     Running   0          1m
continuous-image-puller-7j4jg     1/1     Running   0          1m
continuous-image-puller-hrj2c     1/1     Running   0          1m
continuous-image-puller-qkgb6     1/1     Running   0          1m
hub-5c5d9f7678-vkjpc              1/1     Running   0          1m
proxy-6496d4dff4-b9fts            1/1     Running   0          1m
user-scheduler-6fcfff9557-k55c6   1/1     Running   0          1m
user-scheduler-6fcfff9557-pgpnx   1/1     Running   0          1m
```

### 访问JupyterHub

通过`kubectl port-forward`获取访问地址：

```bash
kubectl port-forward --namespace=jupyterhub-system service/proxy-public 8080:http
```

在浏览器中访问 http://localhost:8080 地址即可打开`JupyterHub`登录页面。

### 卸载JupyterHub

```bash
helm uninstall jupyterhub -n jupyterhub-system
```

## 配置JupyterHub

部署完成后，我们需要根据实际需求对`JupyterHub`进行配置。所有配置都在`Helm`安装包的`values.yaml`文件中进行，修改后通过 `helm upgrade` 命令应用更新。

### 完整的配置示例

以下是一个生产环境可用的完整 `values.yaml` 配置示例：

```yaml title="values.yaml"
# JupyterHub 完整配置示例

# 代理服务配置
proxy:
  # 安全密钥（必须配置）- 使用 openssl rand -hex 32 生成
  # secretToken: "your-random-secret-token-here"
  
  # 服务类型配置
  service:
    type: ClusterIP  # 可选: LoadBalancer, NodePort, ClusterIP
    # 如果使用 NodePort，可以指定端口
    # nodePorts:
    #   http: 30080
    #   https: 30443
  
  # HTTPS 配置（推荐生产环境启用）
  https:
    enabled: false  # 设置为 true 启用 HTTPS
    # 使用 Let's Encrypt 自动获取证书
    # type: letsencrypt
    # letsencrypt:
    #   contactEmail: your-email@example.com
    # 或使用自己的证书
    # type: manual
    # manual:
    #   key: |
    #     -----BEGIN PRIVATE KEY-----
    #     ...
    #     -----END PRIVATE KEY-----
    #   cert: |
    #     -----BEGIN CERTIFICATE-----
    #     ...
    #     -----END CERTIFICATE-----

# Hub 核心服务配置
hub:
  # Hub 容器资源配置
  resources:
    requests:
      cpu: 200m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi
  
  # JupyterHub 配置
  config:
    # 认证器配置
    JupyterHub:
      # 默认使用 DummyAuthenticator（仅用于测试）
      authenticator_class: dummy
      # 管理员用户列表
      admin_users:
        - admin
      
    # GitHub OAuth 认证示例（取消注释使用）
    # JupyterHub:
    #   authenticator_class: github
    # GitHubOAuthenticator:
    #   client_id: "your-github-client-id"
    #   client_secret: "your-github-client-secret"
    #   oauth_callback_url: "https://your-domain.com/hub/oauth_callback"
    #   allowed_organizations:
    #     - your-organization
    
    # Google OAuth 认证示例（取消注释使用）
    # JupyterHub:
    #   authenticator_class: google
    # GoogleOAuthenticator:
    #   client_id: "your-google-client-id"
    #   client_secret: "your-google-client-secret"
    #   oauth_callback_url: "https://your-domain.com/hub/oauth_callback"
    #   hosted_domain:
    #     - your-domain.com
  
  # 数据库配置（可选，用于持久化 Hub 状态）
  # db:
  #   type: sqlite-pvc  # 或 mysql, postgresql
  #   pvc:
  #     storage: 1Gi

# 单用户服务器配置
singleuser:
  # 用户镜像配置
  image:
    name: quay.io/jupyterhub/k8s-singleuser-sample
    tag: "4.3.2"
    pullPolicy: IfNotPresent
  
  # 默认 UI 配置
  defaultUrl: "/lab"  # 默认使用 JupyterLab，改为 "/tree" 使用经典 Notebook
  
  # 环境变量配置
  extraEnv:
    # 使用新版 Jupyter Server
    JUPYTERHUB_SINGLEUSER_APP: "jupyter_server.serverapp.ServerApp"
    # 时区设置
    TZ: "Asia/Shanghai"
    # 编辑器设置
    EDITOR: "vim"
    # Python pip 镜像源（可选）
    # PIP_INDEX_URL: "https://pypi.tuna.tsinghua.edu.cn/simple"
  
  # CPU 资源配置
  cpu:
    guarantee: 0.5   # 保证分配的 CPU
    limit: 2.0       # CPU 限制
  
  # 内存资源配置
  memory:
    guarantee: 1G    # 保证分配的内存
    limit: 4G        # 内存限制
  
  # 持久化存储配置
  storage:
    type: dynamic    # 动态创建 PVC
    capacity: 10Gi   # 每个用户的存储容量
    dynamic:
      storageClass: standard  # 使用的 StorageClass
    
    # 共享内存配置（用于深度学习，PyTorch DataLoader 等）
    extraVolumes:
      - name: shm-volume
        emptyDir:
          medium: Memory
    extraVolumeMounts:
      - name: shm-volume
        mountPath: /dev/shm
  
  # 用户环境配置文件（可选）
  # lifecycleHooks:
  #   postStart:
  #     exec:
  #       command:
  #         - "sh"
  #         - "-c"
  #         - >
  #           if [ ! -f /home/jovyan/.initialized ]; then
  #             echo "Initializing user environment...";
  #             touch /home/jovyan/.initialized;
  #           fi
  
  # 配置多个资源选项（用户可选择）
  profileList:
    - display_name: "小型环境 (1 CPU, 2GB RAM)"
      description: "适合轻量级开发和学习"
      default: true
      kubespawner_override:
        cpu_guarantee: 0.5
        cpu_limit: 1.0
        mem_guarantee: "1G"
        mem_limit: "2G"
    
    - display_name: "中型环境 (2 CPU, 4GB RAM)"
      description: "适合一般的数据分析和模型训练"
      kubespawner_override:
        cpu_guarantee: 1.0
        cpu_limit: 2.0
        mem_guarantee: "2G"
        mem_limit: "4G"
    
    - display_name: "大型环境 (4 CPU, 8GB RAM)"
      description: "适合大规模数据处理"
      kubespawner_override:
        cpu_guarantee: 2.0
        cpu_limit: 4.0
        mem_guarantee: "4G"
        mem_limit: "8G"
    
    # GPU 环境示例（需要集群支持 GPU）
    # - display_name: "GPU 环境 (4 CPU, 16GB RAM, 1 GPU)"
    #   description: "适合深度学习模型训练"
    #   kubespawner_override:
    #     cpu_guarantee: 2.0
    #     cpu_limit: 4.0
    #     mem_guarantee: "8G"
    #     mem_limit: "16G"
    #     extra_resource_limits:
    #       nvidia.com/gpu: "1"

# 调度配置
scheduling:
  # 用户调度器（提供更好的调度策略）
  userScheduler:
    enabled: true
  
  # Pod 优先级
  podPriority:
    enabled: true
  
  # 用户占位 Pod（加快用户启动速度）
  userPlaceholder:
    enabled: true
    replicas: 2  # 预留 2 个占位 Pod

# 镜像预拉取配置
prePuller:
  # Hook 方式预拉取（升级时）
  hook:
    enabled: true
  
  # 持续预拉取（新节点加入时）
  continuous:
    enabled: true

# 自动清理空闲用户配置
cull:
  enabled: true
  timeout: 3600      # 1小时不活动后清理
  every: 600         # 每10分钟检查一次
  maxAge: 0          # 0 表示不限制最大存活时间
  users: false       # 不清理用户数据，只停止服务器

# Ingress 配置（可选，用于域名访问）
ingress:
  enabled: false
  # hosts:
  #   - jupyterhub.your-domain.com
  # annotations:
  #   kubernetes.io/ingress.class: nginx
  #   cert-manager.io/cluster-issuer: letsencrypt-prod
  # tls:
  #   - secretName: jupyterhub-tls
  #     hosts:
  #       - jupyterhub.your-domain.com
```

### 常用配置项说明

#### 1. 认证配置

**DummyAuthenticator（测试用）**：
```yaml
hub:
  config:
    JupyterHub:
      authenticator_class: dummy
```

**GitHub OAuth**：
```yaml
hub:
  config:
    JupyterHub:
      authenticator_class: github
    GitHubOAuthenticator:
      client_id: "your-client-id"
      client_secret: "your-client-secret"
      oauth_callback_url: "https://your-domain/hub/oauth_callback"
```

**LDAP 认证**：
```yaml
hub:
  config:
    JupyterHub:
      authenticator_class: ldapauthenticator.LDAPAuthenticator
    LDAPAuthenticator:
      server_address: ldap.example.com
      bind_dn_template:
        - "uid={username},ou=people,dc=example,dc=com"
```

#### 2. 资源配置

为用户分配固定资源：
```yaml
singleuser:
  cpu:
    guarantee: 1.0
    limit: 2.0
  memory:
    guarantee: 2G
    limit: 4G
```

#### 3. 存储配置

**动态存储（推荐）**：
```yaml
singleuser:
  storage:
    type: dynamic
    capacity: 10Gi
    dynamic:
      storageClass: fast-ssd
```

**静态 NFS 存储**：
```yaml
singleuser:
  storage:
    type: static
    static:
      pvcName: shared-nfs-pvc
      subPath: "users/{username}"
```

#### 4. GPU 配置

```yaml
singleuser:
  extraResourceLimits:
    nvidia.com/gpu: "1"
```

或在`profileList`中配置：
```yaml
singleuser:
  profileList:
    - display_name: "GPU Server"
      kubespawner_override:
        extra_resource_limits:
          nvidia.com/gpu: "1"
```

### 应用配置更新

修改 `config.yaml` 后，应用更新：

```bash
helm upgrade jupyterhub ./jupyterhub -n jupyterhub-system --values values.yaml
```

查看更新状态：

```bash
kubectl get pods -n jupyterhub-system -w
```

### 配置验证

验证配置是否生效：

```bash
# 查看 Hub 配置
kubectl get configmap -n jupyterhub-system hub -o yaml

# 查看 Hub 日志
kubectl logs -n jupyterhub-system deployment/hub -f
```



## 扩展Jupyter镜像

为了给用户提供预配置的`AI`开发和训练环境，我们可以通过构建自定义的`Docker`镜像来实现。

### 基于官方镜像扩展

创建 `Dockerfile`：

```dockerfile title="Dockerfile"
# 基于官方 datascience-notebook 镜像
FROM quay.io/jupyter/base-notebook:latest

# 切换到 root 用户以安装系统包
USER root

# 配置国内镜像源（清华大学镜像）
RUN sed -i 's|http://ports.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list.d/ubuntu.sources || \
    sed -i 's|http://archive.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list || true

# 安装系统依赖和 Node.js（用于 JupyterLab 构建）
RUN apt-get update && apt-get install -y build-essential
RUN apt-get install -y git vim curl wget htop
RUN apt-get install -y nodejs npm
RUN rm -rf /var/lib/apt/lists/*

# 切换回 jovyan 用户
USER $NB_UID

# 安装 AI/ML 常用 Python 包
# 深度学习框架
RUN pip install --no-cache-dir torch torchvision torchaudio tensorflow pytorch-lightning
    
# 数据处理工具
RUN pip install --no-cache-dir pandas numpy scipy scikit-learn

# 可视化工具
RUN pip install --no-cache-dir matplotlib seaborn plotly

# NLP 工具
RUN pip install --no-cache-dir transformers datasets tokenizers sentencepiece 

# 计算机视觉工具
RUN pip install --no-cache-dir opencv-python albumentations timm
    
# 实验跟踪和管理
RUN pip install --no-cache-dir mlflow wandb tensorboard

# Jupyter 扩展 
RUN pip install --no-cache-dir jupyterlab-git jupyterlab-lsp jupyter-resource-usage ipywidgets 

# 其他工具
RUN pip install --no-cache-dir black flake8 pytest nbgitpuller

# 创建常用目录
RUN mkdir -p /home/$NB_USER/work/notebooks \
             /home/$NB_USER/work/datasets \
             /home/$NB_USER/work/models

# 设置工作目录
WORKDIR /home/$NB_USER/work
```

创建`Jupyter`配置文件 `jupyter_notebook_config.py`：

```python title="jupyter_notebook_config.py"
# jupyter_notebook_config.py
c = get_config()

# 允许 root 用户运行（不推荐在生产环境中使用）
c.NotebookApp.allow_root = True

# 配置资源使用监控
c.ResourceUseDisplay.track_cpu_percent = True
c.ResourceUseDisplay.mem_limit = 0  # 自动检测
c.ResourceUseDisplay.cpu_limit = 0  # 自动检测

# Git 集成配置
c.GitConfig.credential_helper = 'store'

# LSP 配置
c.LanguageServerManager.language_servers = {
    'python': {
        'display_name': 'Python',
        'language': 'python',
        'argv': ['pyls'],
    },
}
```


### 构建和推送镜像

```bash
# 构建镜像
docker build -t your-registry/jupyterhub-ai:v1.0.0 .

# 推送到镜像仓库
docker push your-registry/jupyterhub-ai:v1.0.0
```

### 使用自定义镜像

在 `config.yaml` 中配置自定义镜像：

```yaml
singleuser:
  image:
    name: your-registry/jupyterhub-ai
    tag: v1.0.0
  cmd: null
```

如果使用私有镜像仓库，需要配置镜像拉取凭证：

```yaml
singleuser:
  image:
    name: your-private-registry/jupyterhub-ai
    tag: v1.0.0
    pullPolicy: IfNotPresent
  imagePullSecret:
    create: true
    registry: your-private-registry
    username: your-username
    password: your-password
    email: your-email@example.com
```





## 在Notebook中安装工具包

除了通过自定义镜像预置工具包外，用户也可以在`Jupyter Notebook`中动态安装所需的`AI`开发和训练工具包。这种方式更加灵活，适合用户根据具体项目需求安装不同的包。

### 使用 pip 安装

#### 在 Notebook Cell 中安装

最简单的方式是在`Jupyter Notebook`的`cell`中使用 `!` 或 `%` 魔法命令：

```python
# 使用 ! 运行 shell 命令
!pip install torch torchvision

# 使用 %pip 魔法命令（推荐，会自动重载已安装的包）
%pip install transformers datasets

# 安装特定版本
%pip install tensorflow==2.15.0

# 从清华镜像源安装（加速）
%pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pandas numpy
```

#### 安装常用AI/ML工具包

**深度学习框架**：

```python
# PyTorch
%pip install torch torchvision torchaudio
%pip install pytorch-lightning

# TensorFlow
%pip install tensorflow keras

# JAX
%pip install jax jaxlib
```

**数据处理和分析**：

```python
# 基础数据处理
%pip install pandas numpy scipy scikit-learn

# 数据可视化
%pip install matplotlib seaborn plotly

# 数据增强
%pip install albumentations imgaug
```

**自然语言处理 (NLP)**：

```python
# Hugging Face 生态
%pip install transformers datasets tokenizers accelerate

# 其他 NLP 工具
%pip install spacy nltk jieba
%pip install sentencepiece

# 下载 spaCy 模型
!python -m spacy download en_core_web_sm
!python -m spacy download zh_core_web_sm
```

**计算机视觉 (CV)**：

```python
# 图像处理
%pip install opencv-python Pillow

# 预训练模型库
%pip install timm  # PyTorch Image Models

# 目标检测和分割
%pip install ultralytics  # YOLOv8
%pip install detectron2 -f https://dl.fbaipublicfiles.com/detectron2/wheels/cu118/torch2.0/index.html
```

**实验跟踪和管理**：

```python
# MLflow
%pip install mlflow

# Weights & Biases
%pip install wandb
# 登录
import wandb
wandb.login()

# TensorBoard
%pip install tensorboard

# Comet ML
%pip install comet-ml
```

**其他常用工具**：

```python
# Jupyter 扩展
%pip install ipywidgets jupyterlab-git jupyter-resource-usage

# 代码质量
%pip install black flake8 pylint

# 测试框架
%pip install pytest pytest-cov

# Git 集成
%pip install nbgitpuller

# 进度条
%pip install tqdm

# 配置管理
%pip install hydra-core omegaconf
```

### 使用 conda 安装

如果镜像中安装了`Conda`，可以使用`conda`命令：

```python
# 在 cell 中使用 conda
!conda install -y pytorch torchvision torchaudio -c pytorch

# 安装到特定环境
!conda install -y -n myenv scikit-learn

# 从 conda-forge 安装
!conda install -y -c conda-forge transformers
```

#### 创建独立的 Conda 环境

用户可以创建独立的`conda`环境来管理不同项目的依赖：

```python
# 创建新环境
!conda create -n pytorch_env python=3.10 -y

# 在新环境中安装包
!conda install -n pytorch_env pytorch torchvision -c pytorch -y

# 激活环境（需要在 terminal 中操作）
# 或者在 Notebook 中使用该环境的 kernel
```

为了让 Jupyter 识别新创建的 conda 环境，需要安装 ipykernel：

```python
# 在新环境中安装 ipykernel
!conda install -n pytorch_env ipykernel -y

# 将环境注册为 Jupyter kernel
!python -m ipykernel install --user --name=pytorch_env --display-name="Python (PyTorch)"
```

然后刷新页面，在`Kernel`菜单中就可以看到新的`kernel`选项。

### 持久化安装的包

由于用户环境的`/home/jovyan`目录是持久化的，安装在用户目录下的包会在服务器重启后保留。

#### 配置 pip 安装目录

确保包安装到用户目录（默认行为）：

```python
# 查看 pip 配置
!pip config list

# 设置用户安装目录（一般不需要，pip 默认就会安装到用户目录）
!pip install --user package-name
```

#### 查看已安装的包

```python
# 列出所有已安装的包
!pip list

# 查看特定包的信息
!pip show torch

# 导出已安装包列表
!pip freeze > requirements.txt
```

### 批量安装

#### 使用 requirements.txt

创建 `requirements.txt` 文件：

```text
torch==2.1.2
torchvision==0.16.2
transformers==4.36.2
datasets==2.16.1
pandas==2.1.4
numpy==1.26.3
scikit-learn==1.3.2
matplotlib==3.8.2
seaborn==0.13.1
```

在 Notebook 中批量安装：

```python
# 安装 requirements.txt 中的所有包
%pip install -r requirements.txt

# 或使用 ! 命令
!pip install -r requirements.txt
```

#### 使用环境文件（conda）

创建 `environment.yml`：

```yaml
name: ml_env
channels:
  - pytorch
  - conda-forge
  - defaults
dependencies:
  - python=3.10
  - pytorch
  - torchvision
  - pandas
  - numpy
  - scikit-learn
  - matplotlib
  - pip:
    - transformers
    - datasets
```

在`Notebook`中使用：

```python
# 从环境文件创建环境
!conda env create -f environment.yml

# 或更新现有环境
!conda env update -f environment.yml
```

### 配置镜像源加速

#### pip 镜像源

临时使用：
```python
%pip install -i https://pypi.tuna.tsinghua.edu.cn/simple package-name
```

永久配置（在用户目录创建配置文件）：

```python
# 创建 pip 配置目录
!mkdir -p ~/.pip

# 写入配置
%%writefile ~/.pip/pip.conf
[global]
index-url = https://pypi.tuna.tsinghua.edu.cn/simple
[install]
trusted-host = pypi.tuna.tsinghua.edu.cn
```

#### conda 镜像源

```python
# 添加清华源
!conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/main
!conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/pkgs/free
!conda config --add channels https://mirrors.tuna.tsinghua.edu.cn/anaconda/cloud/pytorch

# 设置搜索时显示通道地址
!conda config --set show_channel_urls yes
```

### 注意事项

1. **包冲突**：注意包之间的依赖关系，避免版本冲突
2. **内存占用**：安装大型包（如`PyTorch`、`TensorFlow`）时注意内存限制
3. **存储空间**：注意用户存储配额，定期清理不需要的包
4. **权限问题**：使用 `--user` 标志安装到用户目录，避免权限问题
5. **环境隔离**：对于复杂项目，建议使用`conda`环境进行隔离
6. **安装时间**：大型包安装可能需要较长时间，建议在非高峰期安装

### 卸载包

```python
# 使用 pip 卸载
%pip uninstall package-name -y

# 使用 conda 卸载
!conda remove package-name -y

# 清理 pip 缓存
!pip cache purge

# 清理 conda 缓存
!conda clean --all -y
```

### 最佳实践

1. **版本锁定**：在`requirements.txt`中明确指定版本号
2. **虚拟环境**：为不同项目创建独立的`conda`环境
3. **定期更新**：定期更新包到最新稳定版本
4. **文档记录**：记录项目依赖和安装步骤
5. **测试验证**：安装后验证包是否正常工作

```python
# 验证安装
import torch
print(f"PyTorch version: {torch.__version__}")
print(f"CUDA available: {torch.cuda.is_available()}")

import tensorflow as tf
print(f"TensorFlow version: {tf.__version__}")

import transformers
print(f"Transformers version: {transformers.__version__}")
```



## 参考资料

- [Zero to JupyterHub with Kubernetes](https://z2jh.jupyter.org/)
- [JupyterHub 官方文档](https://jupyterhub.readthedocs.io/)
- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Helm 官方文档](https://helm.sh/docs/)
- [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/)
