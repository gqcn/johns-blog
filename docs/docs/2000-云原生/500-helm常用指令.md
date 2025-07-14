---
slug: "/cloud-native/helm"
title: "helm常用指令"
hide_title: true
keywords:
  [
    "helm", "kubernetes", "包管理", "chart", "云原生", "容器编排"
  ]
description: "详细介绍Helm的背景、用途、安装配置以及常用指令的使用方法和示例"
---

## 什么是Helm？

`Helm`是`Kubernetes`的包管理工具，被称为"`Kubernetes`的包管理器"。它通过`Chart`（图表）的概念来打包、配置和部署应用程序到`Kubernetes`集群中。

### Helm的背景

在`Kubernetes`生态系统中，部署复杂的应用往往需要创建多个相关的资源对象，如`Deployment`、`Service`、`ConfigMap`、`Secret`等。手动管理这些`YAML`文件既繁琐又容易出错。`Helm`应运而生，它提供了：

- **模板化**：使用`Go`模板语法创建可重用的配置
- **版本控制**：支持应用的版本管理和回滚
- **依赖管理**：处理复杂应用之间的依赖关系
- **打包分发**：将应用打包成`Chart`，便于分享和部署

### Helm的核心概念

- **Chart**：`Helm`的包格式，包含运行应用所需的所有资源定义
- **Release**：`Chart`在`Kubernetes`集群中的一个实例
- **Repository**：存储和分享`Chart`的地方

## Helm的安装和配置

### 安装Helm

#### 方法一：使用脚本安装（推荐）

```bash
# 下载并安装最新版本的Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

#### 方法二：使用包管理器安装

**macOS (使用Homebrew):**
```bash
brew install helm
```

**Ubuntu/Debian:**
```bash
# 添加Helm的官方GPG密钥
curl https://baltocdn.com/helm/signing.asc | gpg --dearmor | sudo tee /usr/share/keyrings/helm.gpg > /dev/null

# 添加官方Helm稳定仓库
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/helm.gpg] https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list

# 更新包列表并安装
sudo apt-get update
sudo apt-get install helm
```

**CentOS/RHEL/Fedora:**
```bash
# 添加Helm仓库
sudo dnf config-manager --add-repo https://rpm.releases.hashicorp.com/RHEL/hashicorp.repo

# 安装Helm
sudo dnf install helm
```

#### 方法三：手动安装

```bash
# 下载二进制文件
wget https://get.helm.sh/helm-v3.13.0-linux-amd64.tar.gz

# 解压
tar -zxvf helm-v3.13.0-linux-amd64.tar.gz

# 移动到系统路径
sudo mv linux-amd64/helm /usr/local/bin/helm

# 验证安装
helm version
```

### 验证安装

```bash
# 查看Helm版本
helm version

# 输出示例：
# version.BuildInfo{Version:"v3.13.0", GitCommit:"825e86f6a7a38cef1112bfa606e4127a706749b1", GitTreeState:"clean", GoVersion:"go1.20.8"}
```

### 配置Helm

#### 添加Chart仓库

```bash
# 添加官方稳定仓库
helm repo add stable https://charts.helm.sh/stable

# 添加Bitnami仓库（推荐）
helm repo add bitnami https://charts.bitnami.com/bitnami

# 更新仓库索引
helm repo update
```

#### 查看配置信息

```bash
# 查看Helm环境信息
helm env

# 查看已添加的仓库
helm repo list
```

## Helm常用指令及使用示例

### 1. 仓库管理

#### 添加仓库
```bash
# 添加仓库
helm repo add <仓库名称> <仓库URL>

# 示例：添加nginx仓库
helm repo add nginx-stable https://helm.nginx.com/stable
```

#### 查看仓库
```bash
# 列出所有仓库
helm repo list

# 输出示例：
# NAME    URL
# stable  https://charts.helm.sh/stable
# bitnami https://charts.bitnami.com/bitnami
```

#### 更新仓库
```bash
# 更新所有仓库
helm repo update

# 更新特定仓库
helm repo update bitnami
```

#### 删除仓库
```bash
# 删除仓库
helm repo remove <仓库名称>

# 示例
helm repo remove stable
```

### 2. 搜索和查看

#### 搜索Chart
```bash
# 在所有仓库中搜索
helm search repo <关键词>

# 示例：搜索nginx相关Chart
helm search repo nginx

# 搜索Hub中的Chart
helm search hub nginx
```

#### 查看仓库中所有Chart包
```bash

# 查看所有仓库中的所有Chart（显示所有可用的包）
helm search repo --versions

# 查看指定仓库中的所有Chart
helm search repo <仓库名>/

# 示例：查看bitnami仓库中的所有Chart
helm search repo bitnami/

# 查看所有仓库中的所有Chart（显示所有可用的包）
helm search repo ""

# 显示更多信息（包括Chart版本、应用版本、描述等）
helm search repo bitnami/ --versions

# 显示包含已废弃的Chart
helm search repo bitnami/ --devel

# 输出JSON格式
helm search repo bitnami/ -o json

# 输出YAML格式
helm search repo bitnami/ -o yaml

# 限制显示结果数量
helm search repo bitnami/ --max-col-width 50

# 正则表达式搜索
helm search repo "bitnami/.*sql"
```

#### 查看特定Chart的所有版本
```bash
# 查看Chart的所有可用版本
helm search repo <仓库名>/<Chart名> --versions

# 示例：查看nginx的所有版本
helm search repo bitnami/nginx --versions

# 显示详细版本信息
helm search repo bitnami/nginx --versions -o json
```

#### 查看Chart信息
```bash
# 查看Chart详细信息
helm show chart <仓库名>/<Chart名>

# 示例
helm show chart bitnami/nginx

# 查看Chart的values.yaml
helm show values bitnami/nginx

# 查看Chart的所有信息
helm show all bitnami/nginx
```

#### 下载Chart包
```bash
# 下载Chart到本地
helm pull <仓库名>/<Chart名>

# 示例：下载nginx Chart
helm pull bitnami/nginx

# 下载指定版本的Chart
helm pull bitnami/nginx --version 13.2.23

# 下载并解压Chart
helm pull bitnami/nginx --untar

# 下载到指定目录
helm pull bitnami/nginx --destination ./charts

# 下载并解压到指定目录
helm pull bitnami/nginx --untar --destination ./charts

# 验证下载的Chart完整性
helm pull bitnami/nginx --verify

# 组合使用：下载特定版本并解压到指定目录
helm pull bitnami/nginx --version 13.2.23 --untar --destination ./my-charts
```

#### 从URL下载Chart
```bash
# 从URL直接下载Chart
helm pull https://github.com/bitnami/charts/releases/download/nginx-13.2.23/nginx-13.2.23.tgz

# 下载并解压远程Chart
helm pull https://example.com/charts/my-app-1.0.0.tgz --untar

# 验证远程Chart签名
helm pull https://example.com/charts/my-app-1.0.0.tgz --verify
```

### 3. 应用部署

#### 安装应用
```bash
# 基本安装
helm install <release名称> <Chart> -n 命名空间

# 示例：安装nginx
helm install my-nginx bitnami/nginx

# 指定命名空间安装
helm install my-nginx bitnami/nginx -n web-apps --create-namespace

# 使用自定义values文件安装
helm install my-nginx bitnami/nginx -f custom-values.yaml

# 设置特定参数
helm install my-nginx bitnami/nginx --set service.type=NodePort --set service.nodePorts.http=30080
```

#### 模拟安装（dry-run）
```bash
# 模拟安装，查看生成的资源但不实际部署
helm install my-nginx bitnami/nginx --dry-run --debug

# 生成YAML文件
helm template my-nginx bitnami/nginx > nginx-manifests.yaml
```

### 4. 升级回滚卸载

#### 查看Release
```bash
# 列出所有Release
helm list

# 列出所有命名空间的Release
helm list --all-namespaces

# 列出特定命名空间的Release
helm list -n web-apps

# 查看Release状态
helm status my-nginx
```

#### 升级Release
```bash
# 升级Release
helm upgrade <release名称> <Chart> -n 命名空间

# 示例：升级nginx
helm upgrade my-nginx bitnami/nginx -n my-apps

# 升级并修改配置
helm upgrade my-nginx bitnami/nginx -n my-apps --set replicaCount=3

# 升级时重新使用之前的值
helm upgrade my-nginx bitnami/nginx -n my-apps --reuse-values
```

#### 回滚Release
```bash
# 查看Release历史
helm history my-nginx -n my-apps

# 回滚到上一个版本
helm rollback my-nginx -n my-apps

# 回滚到指定版本
helm rollback my-nginx 2 -n my-apps
```

#### 卸载Release


```bash
# 卸载Release
helm uninstall my-nginx -n my-apps

# 保留历史记录的卸载
helm uninstall my-nginx -n my-apps --keep-history
```

### 5. Chart开发

#### 创建Chart
```bash
# 创建新的Chart
helm create my-app

# 这会创建如下目录结构：
# my-app/
#   Chart.yaml          # Chart的基本信息
#   values.yaml         # 默认配置值
#   templates/          # 模板文件目录
#     deployment.yaml
#     service.yaml
#     ingress.yaml
#     ...
```

#### 验证Chart
```bash
# 验证Chart语法
helm lint my-app

# 测试Chart模板渲染
helm template my-app ./my-app

# 使用测试values验证
helm template my-app ./my-app -f test-values.yaml
```

#### 打包Chart
```bash
# 打包Chart
helm package my-app

# 指定输出目录
helm package my-app -d ./charts

# 更新依赖后打包
helm dependency update my-app
helm package my-app
```

### 6. 依赖管理

#### 管理Chart依赖
```bash
# 下载依赖
helm dependency update my-app

# 构建依赖
helm dependency build my-app

# 列出依赖
helm dependency list my-app
```

### 7. 插件管理

#### 安装插件
```bash
# 安装diff插件（用于比较Release差异）
helm plugin install https://github.com/databus23/helm-diff

# 列出已安装插件
helm plugin list

# 使用diff插件
helm diff upgrade my-nginx bitnami/nginx --set replicaCount=3
```

### 8. 实用技巧

#### 获取Release值
```bash
# 获取Release的values
helm get values my-nginx

# 获取所有values（包括默认值）
helm get values my-nginx --all
```

#### 获取Release清单
```bash
# 获取Release生成的Kubernetes资源清单
helm get manifest my-nginx
```

#### 测试Release
```bash
# 运行Chart中定义的测试
helm test my-nginx
```

## 常见使用场景示例

### 场景1：部署MySQL数据库

```bash
# 添加Bitnami仓库
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 创建自定义配置文件
cat > mysql-values.yaml << EOF
auth:
  rootPassword: "mypassword123"
  database: "myapp"
  username: "myuser"
  password: "myuserpass"

primary:
  persistence:
    enabled: true
    size: 20Gi

metrics:
  enabled: true
EOF

# 安装MySQL
helm install my-mysql bitnami/mysql -f mysql-values.yaml -n database --create-namespace

# 查看状态
helm status my-mysql -n database
```

### 场景2：部署完整的Web应用栈

```bash
# 部署Redis
helm install my-redis bitnami/redis --set auth.password=redis123 -n webapp --create-namespace

# 部署PostgreSQL
helm install my-postgres bitnami/postgresql \
  --set auth.postgresPassword=postgres123 \
  --set auth.database=myapp \
  -n webapp

# 部署应用（假设有自己的Chart）
helm install my-webapp ./my-webapp-chart \
  --set database.host=my-postgres-postgresql \
  --set redis.host=my-redis-master \
  -n webapp
```

### 场景3：使用Helm管理应用升级

```bash
# 初始部署
helm install my-app bitnami/nginx --set replicaCount=2

# 升级应用，增加副本数
helm upgrade my-app bitnami/nginx --set replicaCount=5

# 查看升级历史
helm history my-app

# 如果升级有问题，快速回滚
helm rollback my-app 1
```

### 场景4：离线环境部署（下载Chart包）

```bash
# 在有网络的环境中下载Chart包
helm pull bitnami/nginx --version 13.2.23 --destination ./offline-charts
helm pull bitnami/mysql --version 9.4.6 --destination ./offline-charts
helm pull bitnami/redis --version 18.1.5 --destination ./offline-charts

# 将Chart包传输到离线环境后，从本地文件安装
helm install my-nginx ./offline-charts/nginx-13.2.23.tgz

# 或者先解压再安装
tar -xzf ./offline-charts/nginx-13.2.23.tgz
helm install my-nginx ./nginx

# 查看本地Chart包信息
helm show values ./offline-charts/nginx-13.2.23.tgz
```

### 场景5：Chart定制和调试

```bash
# 下载并解压Chart进行定制
helm pull bitnami/nginx --untar --destination ./custom-charts

# 修改Chart内容（如templates、values.yaml等）
cd custom-charts/nginx
# 编辑文件...

# 验证修改后的Chart
helm lint ./custom-charts/nginx

# 测试渲染模板
helm template my-nginx ./custom-charts/nginx --dry-run --debug

# 从本地定制的Chart安装
helm install my-nginx ./custom-charts/nginx
```

### 场景6：浏览和管理仓库Chart包

```bash
# 查看当前配置的所有仓库
helm repo list

# 更新所有仓库索引
helm repo update

# 浏览bitnami仓库中所有可用的Chart
helm search repo bitnami/

# 查找所有数据库相关的Chart
helm search repo database
helm search repo ".*sql"
helm search repo ".*db"

# 查看具体Chart的多个版本，选择合适的版本
helm search repo bitnami/mysql --versions

# 比较不同仓库中相同应用的Chart
helm search repo mysql
helm search repo nginx

# 查看Chart的详细信息再决定是否使用
helm show chart bitnami/mysql
helm show values bitnami/mysql

# 下载多个版本进行比较
helm pull bitnami/mysql --version 9.4.6 --destination ./charts/mysql-9.4.6
helm pull bitnami/mysql --version 9.4.5 --destination ./charts/mysql-9.4.5

# 查看仓库统计信息
helm search repo bitnami/ | wc -l  # 统计bitnami仓库Chart数量
helm search repo "" | wc -l        # 统计所有仓库Chart总数
```

## 最佳实践

1. **使用版本锁定**：在生产环境中，始终指定Chart版本
   ```bash
   helm install my-app bitnami/nginx --version 13.2.23
   ```

2. **使用values文件**：将配置外化到values文件中，便于管理
   ```bash
   helm install my-app bitnami/nginx -f production-values.yaml
   ```

3. **命名空间隔离**：为不同环境使用不同命名空间
   ```bash
   helm install my-app bitnami/nginx -n production --create-namespace
   ```

4. **定期备份**：定期备份Release配置
   ```bash
   helm get values my-app --all > my-app-backup.yaml
   ```

5. **使用dry-run**：部署前先进行模拟
   ```bash
   helm install my-app bitnami/nginx --dry-run --debug
   ```

6. **离线部署准备**：为离线环境提前下载Chart包
   ```bash
   helm pull bitnami/nginx --version 13.2.23 --destination ./charts
   ```

7. **Chart定制开发**：下载Chart源码进行定制
   ```bash
   helm pull bitnami/nginx --untar --destination ./custom-charts
   ```

## 总结

`Helm`作为`Kubernetes`的包管理工具，极大地简化了应用的部署和管理。通过`Chart`的模板化特性，我们可以轻松地在不同环境中部署相同的应用，并通过版本控制实现应用的升级和回滚。掌握`Helm`的使用对于`Kubernetes`运维和开发人员来说是非常重要的技能。

随着云原生技术的发展，`Helm`已经成为`Kubernetes`生态系统中不可或缺的工具之一，值得每个从事云原生开发的工程师深入学习和掌握。

