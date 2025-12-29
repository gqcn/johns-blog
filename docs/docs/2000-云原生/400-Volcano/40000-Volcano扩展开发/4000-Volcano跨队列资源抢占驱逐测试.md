---
slug: "/cloud-native/volcano-cross-queues-reclaim-test"
title: "Volcano跨队列资源抢占驱逐测试"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "跨队列抢占", "资源驱逐", "reclaim", "在线推理", "离线训练", "优先级调度", "GPU资源", "capacity-card", "多租户", "资源配额"
  ]
description: "本文通过实际测试验证Volcano调度器的reclaim动作在跨队列资源抢占场景下的行为，重点测试在线推理服务和离线训练任务之间的资源抢占策略，包括不同优先级任务的抢占规则、资源回收机制以及使用自定义capacity-card插件实现GPU卡维度配额管理的实践经验。"
---

## 背景介绍

具体参考：[Volcano跨队列资源抢占驱逐改进设计](./3000-Volcano跨队列资源抢占驱逐改进设计.md)

## 测试环境

**系统**：`MacOS M4 15.6 (24G)`

**组件**：
| 组件 | 版本 | 备注 |
|---|---|---|
| `Volcano` | `v1.13.0` | 使用自定义配额插件`capacity-card` |
| `Kubernetes` | `v1.27.3` |  |
| `Kind` | `v0.27.0 `| 模拟`GPU`集群资源 |

**资源**：
| GPU | 数量 | 备注 |
|---|---|---|
| `NVIDIA-GeForce-RTX-4090` | `8张` | 模拟 |

## 相关配置

```yaml title="volcano-scheduler.conf"
actions: "enqueue, allocate, backfill, reclaim"
tiers:
- plugins:
  - name: priority
  - name: gang
    enableReclaimable: false
  - name: conformance
    enableReclaimable: false
- plugins:
  - name: predicates
  - name: capacity-card
    arguments:
      # 使用GPU卡的Pod不限制CPU/Memory资源
      cardUnlimitedCpuMemory: true
      # 允许通过`PodOwnerReferences`来判断Pod的类型是推理还是训练类型
      allowServiceTypeByPodOwnerReferences: true
  - name: nodeorder
```

## 场景1：跨队列抢占策略

### 用例

- `1`个高优先级在线服务
- `1`个低优先级在线服务
- `1`个高优先级离线任务
- `1`个中优先级离线任务
- `1`个低优先级离线任务

### 结论

- 离线任务之间不能进行相互抢占
- 在线服务之间不能进行相互抢占
- 高优在线服务可以抢占中/低优离线任务资源
- 低优在线服务不能抢占中/高优的离线任务资源
- 当在离线的资源销毁后，在线服务将优先获得调度（因为在线服务队列优先级比离线任务队列优先级高），其次按照优先级进行调度

### 代码

https://github.com/gqcn/volcano-test-cases/tree/main/reclaim-between-queues/case1


## 场景2：抢占多个任务资源


### 用例

- `1`个高优先级在线服务，使用`6`卡
- `1`个高优先级在线服务，使用`2`卡
- `2`个中优先级离线任务，使用`4`卡
- `2`个低优先级离线任务，使用`4`卡

### 结论

- `1`个高优在线服务只会抢占并驱逐`3`个低优离线任务，满足`6`卡需求。剩下一个离线任务没有变化。
- `1`个高优在线服务抢占并驱逐剩下的`1`个中优离线任务，满足`2`卡需求。
- 在抢占驱逐的过程中，在线服务优先抢占并驱逐低优离线任务资源，随后才是中优离线任务。

### 代码

https://github.com/gqcn/volcano-test-cases/tree/main/reclaim-between-queues/case2


## 场景3：离线任务按照gang策略Aborted

### 用例

- `1`个高优先级在线服务，使用`4`卡
- `1`个低优先级离线任务，包含`2`个`Task`，每个`Task`使用`4`卡

### 结论

- `1`个高优在线服务会抢占并驱逐`1`个低优离线任务`Task`，满足`4`卡需求。
- 虽然离线任务只被抢占了`1`个`Task`，但整个离线任务都会失败，另一个`Task`也会被`Terminate`掉，离线任务处于`Aborted`状态。

### 代码

https://github.com/gqcn/volcano-test-cases/tree/main/reclaim-between-queues/case3


## 场景3：离线任务按照gang策略Pending

### 用例

- `1`个高优先级在线服务，使用`4`卡
- `1`个低优先级离线任务，包含`2`个`Task`，每个`Task`使用`4`卡

### 结论

- `1`个高优在线服务会抢占并驱逐`1`个低优离线任务`Task`，满足`4`卡需求。
- 虽然离线任务只被抢占了`1`个`Task`，但整个离线任务都会重启，另一个`Task`也会被`Terminate`掉，离线任务处于`Pending`状态，其`PodGroup`处于`Inqueue`状态。

### 代码

https://github.com/gqcn/volcano-test-cases/tree/main/reclaim-between-queues/case4
