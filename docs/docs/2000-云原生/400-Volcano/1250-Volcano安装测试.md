---
slug: "/cloud-native/volcano-installation-testing"
title: "Volcano安装测试"
hide_title: true
keywords:
  - Volcano
  - Kubernetes
  - 安装部署
  - Helm
  - 调度器
  - Volcano Job
  - PodGroup
  - 测试验证
  - K8S集群
description: "本文介绍如何在Kubernetes集群上使用Helm安装Volcano批处理调度系统，并通过创建Volcano Job进行测试验证，确保调度功能正常运行。"
---


## K8S集群搭建

在部署`Volcano`之前，需要有一个`K8S`集群，这里可以参考：[使用Kind快速创建K8S测试集群](../500-Kind/2000-使用Kind快速创建K8S测试集群.md) 快速搭建一个本地测试集群。

## Volcano安装


使用`Helm`安装`Volcano`：

```bash
# 添加Volcano Helm仓库
helm repo add volcano-sh https://volcano-sh.github.io/helm-charts
helm repo update

# 安装Volcano（版本可自行指定）
helm install volcano volcano-sh/volcano \
  -n volcano-system \
  --create-namespace \
  --version 1.13.0

# 等待Volcano组件就绪，预计需要几分钟时间
```

验证安装：
```bash
kubectl get pods -n volcano-system
```

预期输出：
```
NAME                                   READY   STATUS    RESTARTS   AGE
volcano-admission-b84bbd89-9k55v       1/1     Running   0          105s
volcano-controllers-7b97b6455c-q2jf9   1/1     Running   0          105s
volcano-scheduler-65d4d4645b-k6nmk     1/1     Running   0          105s
```



## 测试验证

使用以下`Volcano Job`测试`Volcano`调度是否正常运行：[volcano-job.yaml](./assets/1250-Volcano安装测试/volcano-job.yaml)

```yaml title="volcano-job.yaml"
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: volcano-job-test
spec:
  minAvailable: 2
  schedulerName: volcano
  queue: default
  tasks:
    - replicas: 2
      name: worker
      template:
        spec:
          containers:
            - name: busybox
              image: busybox:latest
              command: ["sh", "-c", "sleep 3600"]
              resources:
                requests:
                  cpu: "100m"
                  memory: "128Mi"
                limits:
                  cpu: "100m"
                  memory: "128Mi"
```

执行部署：
```bash
kubectl apply -f volcano-job.yaml
```

查看部署：
```bash
kubectl get vcjob -A
kubectl get pg -A
kubectl get pods -A | grep volcano-job-test
```
