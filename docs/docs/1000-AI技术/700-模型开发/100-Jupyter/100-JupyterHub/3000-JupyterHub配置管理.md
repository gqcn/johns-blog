---
slug: "/ai/jupyterhub-configuration"
title: "JupyterHub配置管理"
hide_title: true
keywords:
  [
    JupyterHub配置,
    Helm配置,
    values.yaml,
    认证配置,
    OAuth认证,
    LDAP认证,
    资源限制,
    存储配置,
    用户环境配置,
    GPU配置,
    Ingress配置,
    用户调度,
    自动清理,
    多租户管理,
    ProfileList
  ]
description: "JupyterHub生产环境完整配置指南，包括认证配置（OAuth、LDAP等）、资源限制、存储管理、用户环境配置、GPU支持、Ingress配置、自动清理策略和多资源环境选项等，提供可直接使用的配置示例。"
---

部署完成后，我们需要根据实际需求对`JupyterHub`进行配置。所有配置都在`Helm`安装包的`values.yaml`文件中进行，修改后通过 `helm upgrade` 命令应用更新。

## 完整的配置示例

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

## 常用配置项说明

### 认证配置

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

### 资源配置

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

### 存储配置

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

### GPU 配置

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

## 应用配置更新

修改 `config.yaml` 后，应用更新：

```bash
helm upgrade jupyterhub ./jupyterhub -n jupyterhub-system --values values.yaml
```

查看更新状态：

```bash
kubectl get pods -n jupyterhub-system -w
```

## 配置验证

验证配置是否生效：

```bash
# 查看 Hub 配置
kubectl get configmap -n jupyterhub-system hub -o yaml

# 查看 Hub 日志
kubectl logs -n jupyterhub-system deployment/hub -f
```



## 参考资料

- https://z2jh.jupyter.org/en/stable/index.html