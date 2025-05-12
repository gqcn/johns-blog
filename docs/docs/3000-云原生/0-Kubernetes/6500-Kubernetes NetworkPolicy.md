---
slug: "/cloud-native/kubernetes-network-policy"
title: "Kubernetes NetworkPolicy"
hide_title: true
keywords:
  ["Kubernetes", "NetworkPolicy", "网络策略", "安全", "云原生"]
description: "详解Kubernetes NetworkPolicy的功能、配置方法、常见用法及业务场景实践。"
---

# 1. NetworkPolicy简介

在`Kubernetes`集群中，`NetworkPolicy`（网络策略）是一种用于控制`Pod`之间及`Pod`与外部网络之间流量的资源对象。通过定义`NetworkPolicy`，可以实现细粒度的网络访问控制，提升集群的安全性，防止未经授权的流量访问敏感服务。

**核心功能**：
- 限制不同`Pod`之间的网络通信
- 控制`Pod`与外部网络的流量
- 支持基于命名空间、标签、`IP`等多维度的访问规则
- 配合`CNI`插件实现网络隔离

> 注意：`NetworkPolicy`的生效依赖于底层网络插件（如`Calico`、`Cilium`、`Weave`等）对其支持。

## 默认行为说明

如果没有手动创建任何`NetworkPolicy`资源，Kubernetes集群默认**不会应用任何网络隔离策略**：

- 所有`Pod`之间的网络通信都是允许的，无论是否属于同一命名空间。
- 外部流量也可以访问`Pod`（只要有合适的Service或端口暴露），没有基于NetworkPolicy的限制。
- 只有为某些`Pod`创建了`NetworkPolicy`后，这些被选中的`Pod`才会受到流量限制。未被任何策略选中的`Pod`依然是“全开放”状态。

**结论**：`Kubernetes`的`NetworkPolicy`是“显式生效”，未定义时网络是“全通”的。若需实现安全隔离，务必主动为关键业务`Pod`编写`NetworkPolicy`策略。

# 2. NetworkPolicy配置与YAML属性详解

`NetworkPolicy`通过`YAML`文件进行定义，主要包含以下关键字段：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: example-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: frontend
      ports:
        - protocol: TCP
          port: 3306
  egress:
    - to:
        - ipBlock:
            cidr: 10.0.0.0/24
      ports:
        - protocol: TCP
          port: 53
```

**主要属性说明**：
- `podSelector`：选择要应用该策略的`Pod`（通过标签匹配）
- `policyTypes`：指定策略类型（`Ingress`入站、`Egress`出站）
- `ingress`：定义允许哪些流量进入选中`Pod`
- `egress`：定义允许哪些流量从选中`Pod`流出
- `from`/`to`：来源或目标，可以是`Pod`、`Namespace`、`IP`块等
- `ports`：允许的端口和协议
- `ipBlock`：基于`IP`范围的规则

# 3. 常见NetworkPolicy功能配置

## 3.1 只允许同命名空间内访问
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-same-namespace
  namespace: default
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: default
```

## 3.2 只允许特定Pod访问
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-specific-pod
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
```

## 3.3 拒绝所有入站流量（默认拒绝）
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Ingress
  ingress: []
```

## 3.4 允许DNS和外部互联网访问
```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns-egress
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
      ports:
        - protocol: UDP
          port: 53
```

# 4. 典型业务场景与实现示例

## 4.1 数据库仅允许应用层访问
**场景说明**：数据库`Pod`只允许来自应用`Pod`的访问，禁止其他流量。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: db-only-allow-app
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  ingress:
    - from:
        - podSelector:
            matchLabels:
              role: app
      ports:
        - protocol: TCP
          port: 3306
```

## 4.2 多租户环境下的命名空间隔离
**场景说明**：不同租户的命名空间之间完全隔离，互不访问。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: tenant-ns-isolation
  namespace: tenant-a
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: tenant-a
```

## 4.3 允许监控系统访问所有Pod
**场景说明**：`Prometheus`等监控`Pod`需要采集全集群数据。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-prometheus
  namespace: default
spec:
  podSelector: {}
  ingress:
    - from:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              app: prometheus
```

## 4.4 仅允许Pod访问外部特定IP
**场景说明**：业务`Pod`只能访问公司内网或指定外部服务。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-egress-to-internal
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress
  egress:
    - to:
        - ipBlock:
            cidr: 10.1.0.0/16
```

# 5. 总结与最佳实践

- 制定`NetworkPolicy`时建议先从最小权限原则出发，逐步放开必要流量
- 配合标签、命名空间合理划分访问边界
- 部署前建议在测试环境充分验证策略效果，避免误伤业务流量
- 关注CNI插件兼容性和性能影响

`NetworkPolicy`是提升`Kubernetes`集群安全性的重要手段，合理配置可有效防止横向攻击和数据泄露，是生产环境必不可少的安全保障。

# 6. 参考资料

- https://kubernetes.io/docs/concepts/services-networking/network-policies/