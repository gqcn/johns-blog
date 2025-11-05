---
slug: "/cloud-native/volcano-cross-queues-reclaim"
title: "Volcano跨队列资源抢占驱逐测试"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "跨队列抢占", "资源驱逐", "reclaim", "在线推理", "离线训练", "优先级调度", "GPU资源", "capacity-card", "多租户", "资源配额"
  ]
description: "本文通过实际测试验证Volcano调度器的reclaim动作在跨队列资源抢占场景下的行为，重点测试在线推理服务和离线训练任务之间的资源抢占策略，包括不同优先级任务的抢占规则、资源回收机制以及使用自定义capacity-card插件实现GPU卡维度配额管理的实践经验。"
---

## 背景介绍

### 业务场景
- 主要是在线推理和离线训练任务
- 在线推理和离线训练任务有使用不同的队列管理配额
- 在线和离线均有不同的队列，其中在线推理按照租户和项目空间维度分配队列管理配额；离线训练按照业务队列的维度管理配额，底层均是由`Volcano queue`来实现配额管理。

### Volcano调度器

`Volcano`原生提供了两个支持按照优先级进行资源抢占驱逐的`action`：`preempt`和`reclaim`。其中`preempt`仅支持单队列内的多个任务之间的抢占驱逐，而`reclaim`则支持跨队列的抢占驱逐。根据当前业务背景来看，我们需要的是`reclaim`动作来实现跨队列的资源抢占驱逐。

由于`Volcano`不支持卡维度的配额管理，因此在我们的调度器中使用的是自定义的`capacity-card`插件来实现卡维度的配额管理。具体可以参考章节：[Volcano调度器支持智算卡Quota改进方案](./7000-Volcano调度器支持智算卡Quota改进方案.md)

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

- 1个高优先级在线服务
- 1个低优先级在线服务
- 1个高优先级离线任务
- 1个中优先级离线任务
- 1个低优先级离线任务

### 结论

- 离线任务之间不能进行相互抢占
- 在线服务之间不能进行相互抢占
- 高优在线服务可以抢占中/低优离线任务资源
- 低优在线服务不能抢占中/高优的离线任务资源
- 当在离线的资源销毁后，在线服务将优先获得调度（因为在线服务队列优先级比离线任务队列优先级高），其次按照优先级进行调度

### 代码

https://github.com/gqcn/volcano-test-cases/tree/main/reclaim-between-queues/case1


## 场景2：单个在线服务抢占多个离线任务资源


### 用例

- 1个高优先级在线服务，使用6卡
- 1个高优先级在线服务，使用2卡
- 2个中优先级离线任务，使用4卡
- 2个低优先级离线任务，使用4卡

### 结论

- 1个高优在线服务只会抢占并驱逐3个低优离线任务，满足6卡需求。剩下一个离线任务没有变化。
- 1个高优在线服务抢占并驱逐剩下的1个中优离线任务，满足2卡需求。
- 在抢占驱逐的过程中，在线服务优先抢占并驱逐低优离线任务资源，随后才是中优离线任务。

### 代码

https://github.com/gqcn/volcano-test-cases/tree/main/reclaim-between-queues/case2
