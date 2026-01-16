---
slug: "/ai/jupyter-prebuild-docker-install-extra-tools"
title: "Jupyter扩展镜像与工具"
hide_title: true
keywords:
  [
    Jupyter镜像扩展,
    Docker镜像构建,
    AI开发环境,
    机器学习工具包,
    PyTorch,
    TensorFlow,
    JupyterLab扩展,
    pip安装,
    conda环境,
    Python包管理,
    深度学习框架,
    NLP工具,
    计算机视觉,
    实验跟踪,
    自定义镜像
  ]
description: "详细介绍如何构建自定义Jupyter Docker镜像和在Notebook中安装AI/ML工具包，涵盖深度学习框架（PyTorch、TensorFlow）、数据处理工具、NLP和CV库、实验跟踪工具等的安装与配置，以及如何创建和管理conda环境。"
---



## 扩展Jupyter镜像

为了给用户提供预配置的`AI`开发和训练环境，我们可以通过构建自定义的`Docker`镜像来实现。

### 基于官方镜像扩展

创建 `Dockerfile`：

```dockerfile title="Dockerfile"
# 基于官方notebook镜像
FROM quay.io/jupyter/base-notebook:2026-01-11

# 切换到 root 用户以安装系统包
USER root

# 配置国内镜像源（清华大学镜像）
RUN sed -i 's|http://ports.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list.d/ubuntu.sources
RUN sed -i 's|http://archive.ubuntu.com|https://mirrors.tuna.tsinghua.edu.cn|g' /etc/apt/sources.list

# 安装系统依赖和 Node.js（用于 JupyterLab 构建）
RUN apt-get update
RUN apt-get install -y build-essential
RUN apt-get install -y git vim curl wget htop sudo
RUN apt-get install -y nodejs npm
RUN rm -rf /var/lib/apt/lists/*

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

也可以在`Terminal`中直接使用`pip`命令：

```bash
pip install torch torchvision
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

为了让`Jupyter`识别新创建的`conda`环境，需要安装`ipykernel`：

```python
# 在新环境中安装 ipykernel
!conda install -n pytorch_env ipykernel -y

# 将环境注册为 Jupyter kernel
!python -m ipykernel install --user --name=pytorch_env --display-name="Python (PyTorch)"
```

然后刷新页面，在`Kernel`菜单中就可以看到新的`kernel`选项。

### 持久化安装的包

由于用户环境的`/home/jovyan`目录是持久化的（根据具体配置和部署环境），安装在用户目录下的包会在服务器重启后保留。

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

#### 使用requirements.txt

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

在`Notebook`中批量安装：

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

- [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/)
