---
slug: "/cloud-native/volcano-scheduler-config"
title: "Volcano调度器配置"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "Plugins", "调度器", "插件配置", "PluginOption", "Arguments", "volcano-scheduler.conf", "配置格式", "插件参数"
  ]
description: "本文详细介绍了Volcano调度器的插件配置格式，包括volcano-scheduler.conf的整体结构、PluginOption配置项的作用和使用方法，以及各个插件的Arguments参数配置示例，为Volcano调度器配置提供完整的技术参考。"
---

## 配置文件概述

`Volcano`调度器的配置主要通过`volcano-scheduler.conf`文件进行管理，该配置文件定义了调度器的行为，包括调度动作的执行顺序、插件的启用和配置等。

## 配置文件整体结构

```yaml
actions: "enqueue, allocate, backfill, preempt, reclaim"
tiers:
- plugins:
  - name: priority
  - name: gang
    enableJobOrder: true
  - name: conformance
- plugins:
  - name: drf
    enabledHierarchy: false
  - name: predicates
  - name: proportion
  - name: nodeorder
    arguments:
      nodeorder.weight: 10
configurations:
- name: allocate
  arguments:
    allocate.timeout: 30s
metrics:
  address: ":8080"
```

### 配置结构说明

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `actions` | `string` | 定义调度动作的执行顺序，多个动作用逗号分隔 |
| `tiers` | `[]Tier` | 定义插件的分层配置，不同层级的插件按顺序执行 |
| `configurations` | `[]Configuration` | 定义各个动作的配置参数 |
| `metrics` | `map[string]string` | 定义监控指标相关配置 |

### Actions顺序的重要性

`Volcano`中的`actions`顺序配置非常重要，因为它决定了调度器执行各种调度操作的顺序，这直接影响调度决策和性能。

`actions`的执行是按照配置中指定的顺序依次进行的，不同的顺序配置会产生以下影响：

1. **效率影响**：
   - 如果将`backfill`放在`allocate`之前，可能会导致资源碎片化，降低整体资源利用率
   - 如果将`preempt`放在最前面，可能会导致过度抢占，增加系统波动

2. **公平性影响**：
   - 如果将资源公平相关的`action`放在较后位置，可能会影响资源分配的公平性

3. **性能影响**：
   - 某些`action`计算复杂度较高，如果频繁执行可能会影响调度器性能
   - 合理的顺序可以减少不必要的计算和资源重分配

推荐的顺序通常是：`enqueue,allocate,preempt,reclaim,backfill`。这个顺序确保了：
1. 首先将任务入队(`enqueue`)
2. 然后尝试正常分配资源(`allocate`)
3. 如果仍有高优先级任务未得到满足，考虑抢占(`preempt`)
4. 尝试回收利用率低的资源(`reclaim`)
5. 最后利用剩余资源进行回填(`backfill`)，最大化资源利用率

在特定场景下，你可能需要根据工作负载特点调整顺序。例如，在高优先级任务较多的环境中，可能希望提前执行`preempt`；在资源紧张的环境中，可能希望提前执行`reclaim`。

### 多层级(Tiers)数组结构

每个`Tier`包含一组插件配置：

```yaml
tiers:
- plugins:  # 第一层插件
  - name: priority
  - name: gang
- plugins:  # 第二层插件
  - name: drf
  - name: predicates
```

为什么使用多层级(`tiers`)数组结构来配置`Plugins`？

1. **优先级分层执行**：
   - 不同层级（`tier`）的插件有着严格的优先级顺序
   - 高层级（第一个数组）中的插件会先执行，其决策结果会影响或限制低层级插件的决策空间
   - 只有当高层级的所有插件都允许一个调度决策时，才会继续执行低层级的插件

2. **决策流程的过滤机制**：
   - 第一层级的插件（如 `priority`、`gang`、`conformance`）主要负责基本的筛选和约束
   - 第二层级的插件（如 `drf`、`predicates`、`proportion` 等）负责更细粒度的资源分配和优化
   - 这种分层设计形成了一种"**粗筛-细筛**"的决策流水线

3. **解决冲突的明确机制**：
   - 当不同插件之间可能产生冲突决策时，层级结构提供了明确的优先级规则
   - 例如，如果 `gang` 插件（第一层）决定某个任务不能被调度（因为它的所有成员无法同时运行），那么即使 `binpack` 插件（第二层）认为该任务可以被有效打包，该任务也不会被调度

### Configuration 结构

`Configuration`用于配置特定`action`(动作)的参数：

```yaml
configurations:
- name: allocate
  arguments:
    allocate.timeout: 30s
    allocate.maxRetries: 3
```

## PluginOption 配置项

`PluginOption`定义了插件的通用配置选项，这些选项控制插件注册的回调函数是否启用。

### 配置格式

```yaml
tiers:
- plugins:
  - name: <plugin-name>
    enableJobOrder: true/false
    enableHierarchy: true/false
    enableJobReady: true/false
    # ... 其他选项
    arguments:
      <key>: <value>
```

### 配置项详解

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `name` | `string` | 必填 | 插件名称，如`priority`、`gang`、`drf`等 |
| `enableJobOrder` | `bool` | `true` | 是否启用作业排序函数（`AddJobOrderFn`） |
| `enableHierarchy` | `bool` | `true` | 是否启用层级共享（主要用于`drf`插件的层级DRF算法） |
| `enableJobReady` | `bool` | `true` | 是否启用作业就绪检查函数（`AddJobReadyFn`） |
| `enableJobPipelined` | `bool` | `true` | 是否启用作业流水线检查函数（`AddJobPipelinedFn`） |
| `enableTaskOrder` | `bool` | `true` | 是否启用任务排序函数（`AddTaskOrderFn`） |
| `enablePreemptable` | `bool` | `true` | 是否启用抢占判断函数（`AddPreemptableFn`） |
| `enableReclaimable` | `bool` | `true` | 是否启用资源回收函数（`AddReclaimableFn`） |
| `enablePreemptive` | `bool` | `true` | 是否启用抢占能力检查函数（`AddPreemptiveFn`） |
| `enableQueueOrder` | `bool` | `true` | 是否启用队列排序函数（`AddQueueOrderFn`） |
| `EnabledClusterOrder` | `bool` | `true` | 是否启用集群排序函数（`AddClusterOrderFn`） |
| `enablePredicate` | `bool` | `true` | 是否启用断言函数（`AddPredicateFn`） |
| `enableBestNode` | `bool` | `true` | 是否启用最佳节点选择函数（`AddBestNodeFn`） |
| `enableNodeOrder` | `bool` | `true` | 是否启用节点排序函数（`AddNodeOrderFn`） |
| `enableTargetJob` | `bool` | `true` | 是否启用目标作业选择函数（`AddTargetJobFn`） |
| `enableReservedNodes` | `bool` | `true` | 是否启用节点预留函数（`AddReservedNodesFn`） |
| `enableJobEnqueued` | `bool` | `true` | 是否启用作业入队完成回调函数（`AddJobEnqueuedFn`） |
| `enabledVictim` | `bool` | `true` | 是否启用受害者任务选择函数（`AddVictimTasksFns`） |
| `enableJobStarving` | `bool` | `true` | 是否启用作业饥饿检查函数（`AddJobStarvingFns`） |
| `enabledOverused` | `bool` | `true` | 是否启用队列超用检查函数（`AddOverusedFn`） |
| `enabledAllocatable` | `bool` | `true` | 是否启用资源分配检查函数（`AddAllocatableFn`） |
| `enabledHyperNodeOrder` | `bool` | `true` | 是否启用超级节点排序函数（`AddHyperNodeOrderFn`） |
| `arguments` | `map[string]interface{}` | `nil` | 插件特定的参数配置 |

### 配置注意事项

1. **默认行为**：所有`PluginOption`配置项默认值为`true`，即默认启用所有回调函数。

2. **显式禁用**：如果需要禁用某个回调函数，需要显式设置为`false`：
   ```yaml
   - name: conformance
     enableReclaimable: false
   ```

3. **特殊配置**：
   - `enableHierarchy`：仅用于`drf`插件，启用层级DRF算法。注意：`proportion`插件和启用了`enableHierarchy`的`drf`插件不能同时使用。

4. **配置优先级**：如果配置项未设置（`nil`），则使用默认值`true`；如果显式设置，则使用设置的值。

## 插件 Arguments 配置

每个插件可以通过`arguments`字段配置特定的参数，这些参数会传递给插件的构造函数。

### Arguments 配置格式

```yaml
tiers:
- plugins:
  - name: <plugin-name>
    arguments:
      <key1>: <value1>
      <key2>: <value2>
```

### 常见插件 Arguments 示例

#### 1. binpack 插件

```yaml
- name: binpack
  arguments:
    binpack.weight: 10          # 整体权重
    binpack.cpu: 5              # CPU权重
    binpack.memory: 1           # 内存权重
    binpack.resources: nvidia.com/gpu, example.com/foo  # 扩展资源列表
    binpack.resources.nvidia.com/gpu: 2                 # GPU权重
    binpack.resources.example.com/foo: 3                # 自定义资源权重
```

**说明**：
- `binpack.weight`：装箱算法的整体权重，默认为1
- `binpack.cpu`：CPU资源的权重，默认为1
- `binpack.memory`：内存资源的权重，默认为1
- `binpack.resources`：需要考虑的扩展资源列表
- `binpack.resources.<resource-name>`：特定扩展资源的权重

#### 2. nodeorder 插件

```yaml
- name: nodeorder
  arguments:
    nodeorder.weight: 10        # 节点排序权重
```

**说明**：
- `nodeorder.weight`：节点排序的权重，影响节点打分的重要程度

#### 3. capacity-card 插件（自定义插件示例）

```yaml
- name: capacity-card
  arguments:
    cardUnlimitedCpuMemory: true                      # 使用GPU卡的Pod不限制CPU/Memory资源
    allowServiceTypeByPodOwnerReferences: true        # 允许通过PodOwnerReferences判断Pod类型
```

**说明**：
- `cardUnlimitedCpuMemory`：是否对使用GPU卡的Pod取消CPU和内存限制
- `allowServiceTypeByPodOwnerReferences`：是否通过Pod的OwnerReferences来判断是推理还是训练类型

#### 4. drf 插件

```yaml
- name: drf
  enabledHierarchy: true        # 启用层级DRF
  arguments:
    drf.namespaceWeight: "namespace1:10,namespace2:5"  # 命名空间权重配置
```

**说明**：
- `enabledHierarchy`：启用层级DRF算法
- `drf.namespaceWeight`：配置不同命名空间的权重

## 完整配置示例

### 示例1：基础配置

```yaml
actions: "enqueue, allocate, backfill"
tiers:
- plugins:
  - name: priority
  - name: gang
  - name: conformance
- plugins:
  - name: drf
  - name: predicates
  - name: proportion
  - name: nodeorder
```

### 示例2：高级配置

```yaml
actions: "enqueue, allocate, backfill, preempt, reclaim"
tiers:
- plugins:
  - name: priority
    enableJobOrder: true
  - name: gang
    enableJobReady: true
    enableJobPipelined: true
  - name: conformance
    enableReclaimable: false
- plugins:
  - name: drf
    enabledHierarchy: false
  - name: predicates
    enablePredicate: true
  - name: proportion
  - name: nodeorder
    arguments:
      nodeorder.weight: 10
  - name: binpack
    arguments:
      binpack.weight: 10
      binpack.cpu: 5
      binpack.memory: 1
      binpack.resources: nvidia.com/gpu
      binpack.resources.nvidia.com/gpu: 2
configurations:
- name: allocate
  arguments:
    allocate.timeout: 30s
metrics:
  address: ":8080"
  path: "/metrics"
```

### 示例3：AI训练场景配置

```yaml
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
      cardUnlimitedCpuMemory: true
      allowServiceTypeByPodOwnerReferences: true
  - name: nodeorder
  - name: binpack
    arguments:
      binpack.resources: nvidia.com/gpu
      binpack.resources.nvidia.com/gpu: 10
```

## 配置最佳实践

### 1. 插件分层

将功能相关的插件放在同一层，不同层之间按照执行优先级排列：

```yaml
tiers:
- plugins:  # 第一层：核心调度策略
  - name: priority
  - name: gang
  - name: conformance
- plugins:  # 第二层：资源分配策略
  - name: drf
  - name: proportion
- plugins:  # 第三层：节点选择策略
  - name: predicates
  - name: nodeorder
  - name: binpack
```

### 2. 选择性启用回调函数

根据实际需求选择性启用或禁用回调函数：

```yaml
- name: conformance
  enableReclaimable: false  # 禁用跨队列资源回收
  enablePreemptable: true   # 启用同队列内抢占
```

### 3. 合理配置 Arguments

根据业务场景调整插件参数：

```yaml
- name: binpack
  arguments:
    binpack.weight: 10
    binpack.cpu: 1
    binpack.memory: 1
    binpack.resources: nvidia.com/gpu
    binpack.resources.nvidia.com/gpu: 100  # GPU权重远大于CPU和内存
```

### 4. 避免插件冲突

注意某些插件不能同时使用：

```yaml
# 错误示例：proportion 和 drf(enabledHierarchy=true) 不能同时使用
tiers:
- plugins:
  - name: drf
    enabledHierarchy: true  # ❌ 与 proportion 冲突
  - name: proportion        # ❌ 与 drf(enabledHierarchy=true) 冲突

# 正确示例：只使用其中一个
tiers:
- plugins:
  - name: drf
    enabledHierarchy: false
  - name: proportion
```

### 5. 监控配置

配置监控指标以便观察调度器行为：

```yaml
metrics:
  address: ":8080"
  path: "/metrics"
```
