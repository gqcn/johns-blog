---
slug: "/cloud-native/kubernetes-generate-bearer-token"
title: "Kubernetes生成Bearer Token"
hide_title: true
keywords:
  [
    "Kubernetes",
    "Bearer Token",
    "ServiceAccount",
    "kubeconfig",
    "认证",
    "授权",
    "RBAC",
    "ClusterRole",
    "ClusterRoleBinding",
    "Secret",
    "Token认证",
    "API访问",
    "集群管理",
    "权限管理",
    "kubectl",
    "cluster-admin",
    "CA证书",
    "API Server",
    "长期Token",
    "安全认证"
  ]
description: "详细介绍如何从现有的admin权限kubeconfig文件生成可用于Bearer Token验证的内容。包括创建ServiceAccount、绑定RBAC权限、提取Token、生成新kubeconfig文件等完整流程，以及使用curl和kubectl进行验证的方法。"
---

以下通过现有的`admin`权限`kubeconfig`文件生成可用于`Bearer Token`验证的内容。

:::note
以下方式生成的`Bearer Token`是长期有效的，请妥善保管。
:::

## 创建ServiceAccount和相关资源

其中的命名空间`kube-system`可根据需要调整。

```yaml
# serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-token-user
  namespace: kube-system
---
apiVersion: v1
kind: Secret
metadata:
  name: admin-token-user-secret
  namespace: kube-system
  annotations:
    kubernetes.io/service-account.name: admin-token-user
type: kubernetes.io/service-account-token
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-token-user-binding
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
- kind: ServiceAccount
  name: admin-token-user
  namespace: kube-system
```

## 应用配置并获取Token


```bash
# 应用配置
kubectl apply -f serviceaccount.yaml

# 获取Token
TOKEN=$(kubectl get secret admin-token-user-secret -n kube-system -o jsonpath='{.data.token}' | base64 -d)

# 获取集群CA证书
CA_CERT=$(kubectl get secret admin-token-user-secret -n kube-system -o jsonpath='{.data.ca\.crt}')

# 获取API Server地址（从现有kubeconfig中提取）
API_SERVER=$(kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}')

echo "Token: $TOKEN"
echo "API Server: $API_SERVER"
```

## 生成新的kubeconfig文件

```bash
# 创建新的kubeconfig文件
cat > kubeconfig-bearer-token.yaml << EOF
apiVersion: v1
kind: Config
clusters:
- cluster:
    certificate-authority-data: $CA_CERT
    server: $API_SERVER
  name: kubernetes
contexts:
- context:
    cluster: kubernetes
    user: admin-token-user
  name: admin-token-user@kubernetes
current-context: admin-token-user@kubernetes
users:
- name: admin-token-user
  user:
    token: $TOKEN
EOF
```

## 验证生成的Bearer Token kubeconfig

```bash
# 使用新的kubeconfig测试连接
export KUBECONFIG=kubeconfig-bearer-token.yaml

# 测试集群访问
kubectl cluster-info

# 测试权限
kubectl auth can-i "*" "*" --all-namespaces

# 测试获取节点信息
kubectl get nodes
```

## 使用curl验证Bearer Token

```bash
curl -k -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     $API_SERVER/api/v1/nodes
```



