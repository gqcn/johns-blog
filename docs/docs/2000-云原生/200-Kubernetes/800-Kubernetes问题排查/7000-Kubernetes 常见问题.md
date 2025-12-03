---
slug: "/cloud-native/kubernetes-common-issues"
title: "Kubernetes 常见问题"
hide_title: true
keywords:
  ["Kubernetes", "常见问题", "namespace", "Terminating", "问题排查", "运维经验"]
description: "总结和解决 Kubernetes 中的常见问题，包括 namespace 删除失败、Pod 状态异常等问题的解决方案"
---

## 删除`ns`失败，`ns`一直处于`Terminating`状态

首先，保证`ns`下所有的`pod`已经删除，如果`pod`未删除完毕，那么保证`pod`删除完毕后再看`ns`是否删除。

其次，查看`ns`的详情，通常这个时候`ns`会有`finalizers`的存在导致无法删除。直接`edit ns`是不得行的，按照以下步骤将`ns`中的`finalizers`删除即可：

![](/attachments/image-2024-1-30_16-31-59.png)

```bash
## 导出ns详情
kubectl get namespace khaos -o json > tmp.json
## 修改tmp.json，去掉finalizers中的关联
vim tmp.json
## 开启kubernetes api代理，以便本地可访问
kubectl proxy
## 将修改好的tmp.json通过api接口修改ns信息，我们这里修改的是khaos空间
curl -k -H "Content-Type: application/json" -X PUT --data-binary @tmp.json http://127.0.0.1:8001/api/v1/namespaces/khaos/finalize
```

  

  

  

  

