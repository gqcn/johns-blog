---
slug: "/cloud-native/volcano-session-plugins-fns"
title: "Volcano Session Plugins方法介绍"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "Session", "Plugins", "调度器", "AddFn", "插件开发", "调度逻辑", "扩展点", "PredicateFn", "NodeOrderFn", "JobOrderFn"
  ]
description: "本文详细介绍了Volcano调度器框架中Session对象的31个Add*Fn方法，包括排序、调度决策、抢占回收、作业状态检查等各类插件扩展点的作用、使用场景和代码示例，为Volcano插件开发提供完整的技术参考。"
---

`Volcano`调度器框架中的`Session`对象提供了丰富的插件扩展点，通过各种`Add*Fn`方法允许插件注册自定义的调度逻辑。这些方法是`Volcano`调度器插件开发的核心接口，本文档详细介绍每个方法的作用、使用场景和代码示例。


## 排序相关方法

### AddJobOrderFn - 作业排序函数
**作用**: 注册作业排序函数，用于确定作业的调度优先级顺序。

**函数签名**: 
```go
func (ssn *Session) AddJobOrderFn(name string, cf api.CompareFn)
```

**CompareFn类型定义**:
```go
type CompareFn func(interface{}, interface{}) int
```

**参数详解**:
- 第一个参数: `*api.JobInfo` 类型，表示左侧作业信息
- 第二个参数: `*api.JobInfo` 类型，表示右侧作业信息

**返回值含义**:
- 返回 `-1`: 表示左侧作业优先级高于右侧作业
- 返回 `1`: 表示右侧作业优先级高于左侧作业
- 返回 `0`: 表示两个作业优先级相等


**使用场景**: 
- 实现基于优先级的作业调度
- 实现基于资源需求的作业排序
- 实现基于提交时间的`FIFO`调度

**代码示例**:
```go
// 在插件的OnSessionOpen方法中注册
func (pp *priorityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册基于优先级的作业排序函数
    ssn.AddJobOrderFn(pp.Name(), func(l, r interface{}) int {
        lv := l.(*api.JobInfo)
        rv := r.(*api.JobInfo)
        
        // 获取作业优先级
        lPriority := lv.PodGroup.Spec.PriorityClassName
        rPriority := rv.PodGroup.Spec.PriorityClassName
        
        // 高优先级作业排在前面
        if lPriority > rPriority {
            return -1
        } else if lPriority < rPriority {
            return 1
        }
        return 0
    })
}
```

### AddQueueOrderFn - 队列排序函数
**作用**: 注册队列排序函数，用于确定队列的调度优先级顺序。

**函数签名**: 
```go
func (ssn *Session) AddQueueOrderFn(name string, qf api.CompareFn)
```

**CompareFn类型定义**:
```go
type CompareFn func(interface{}, interface{}) int
```

**参数详解**:
- 第一个参数: `*api.QueueInfo` 类型，表示左侧队列信息
- 第二个参数: `*api.QueueInfo` 类型，表示右侧队列信息

**返回值含义**:
- 返回 `-1`: 表示左侧队列优先级高于右侧队列
- 返回 `1`: 表示右侧队列优先级高于左侧队列
- 返回 `0`: 表示两个队列优先级相等

**使用场景**: 
- 实现基于权重的队列调度
- 实现基于资源使用率的队列排序
- 实现多租户资源公平分配

**代码示例**:
```go
func (dp *drfPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册基于DRF算法的队列排序函数
    ssn.AddQueueOrderFn(dp.Name(), func(l, r interface{}) int {
        lv := l.(*api.QueueInfo)
        rv := r.(*api.QueueInfo)
        
        // 计算队列的主导资源份额
        lShare := calculateDominantResourceShare(lv)
        rShare := calculateDominantResourceShare(rv)
        
        // 主导资源份额小的队列优先调度
        if lShare < rShare {
            return -1
        } else if lShare > rShare {
            return 1
        }
        return 0
    })
}

func calculateDominantResourceShare(queue *api.QueueInfo) float64 {
    // DRF算法实现逻辑
    // 计算CPU和内存的资源份额，返回较大值
    cpuShare := float64(queue.Used.MilliCPU) / float64(queue.Capability.MilliCPU)
    memShare := float64(queue.Used.Memory) / float64(queue.Capability.Memory)
    
    if cpuShare > memShare {
        return cpuShare
    }
    return memShare
}
```

### AddVictimQueueOrderFn - 受害者队列排序函数
**作用**: 注册受害者队列排序函数，用于在抢占场景中确定队列的优先级顺序。

**函数签名**: 
```go
func (ssn *Session) AddVictimQueueOrderFn(name string, vcf api.VictimCompareFn)
```

**VictimCompareFn类型定义**:
```go
type VictimCompareFn func(interface{}, interface{}, interface{}) int
```

**参数详解**:
- 第一个参数: `*api.QueueInfo` 类型，表示左侧候选受害者队列
- 第二个参数: `*api.QueueInfo` 类型，表示右侧候选受害者队列
- 第三个参数: `*api.QueueInfo` 类型，表示抢占者队列

**返回值含义**:
- 返回 `-1`: 表示左侧队列更适合作为受害者（优先被抢占）
- 返回 `1`: 表示右侧队列更适合作为受害者（优先被抢占）
- 返回 `0`: 表示两个队列作为受害者的优先级相等

**使用场景**: 
- 实现抢占时的队列选择策略
- 实现多租户抢占优先级
- 实现基于资源使用情况的抢占顺序

**代码示例**:
```go
func (pp *preemptPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册受害者队列排序函数
    ssn.AddVictimQueueOrderFn(pp.Name(), func(l, r, preemptor interface{}) int {
        lQueue := l.(*api.QueueInfo)
        rQueue := r.(*api.QueueInfo)
        preemptorQueue := preemptor.(*api.QueueInfo)
        
        // 优先抢占资源使用超出保证的队列
        lOverGuarantee := isQueueOverGuarantee(lQueue)
        rOverGuarantee := isQueueOverGuarantee(rQueue)
        
        if lOverGuarantee && !rOverGuarantee {
            return -1
        } else if !lOverGuarantee && rOverGuarantee {
            return 1
        }
        
        return 0
    })
}
```

### AddClusterOrderFn - 集群排序函数
**作用**: 注册集群排序函数，用于多集群调度场景中确定集群的优先级顺序。

**函数签名**: 
```go
func (ssn *Session) AddClusterOrderFn(name string, qf api.CompareFn)
```

**CompareFn类型定义**:
```go
type CompareFn func(interface{}, interface{}) int
```

**参数详解**:
- 第一个参数: `*scheduling.Cluster` 类型，表示左侧集群信息
- 第二个参数: `*scheduling.Cluster` 类型，表示右侧集群信息

**返回值含义**:
- 返回 `-1`: 表示左侧集群优先级高于右侧集群
- 返回 `1`: 表示右侧集群优先级高于左侧集群
- 返回 `0`: 表示两个集群优先级相等

**使用场景**: 
- 实现多集群资源调度
- 实现集群负载均衡
- 实现基于集群性能的排序

**代码示例**:
```go
func (cp *clusterPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册集群排序函数
    ssn.AddClusterOrderFn(cp.Name(), func(l, r interface{}) int {
        lCluster := l.(*scheduling.Cluster)
        rCluster := r.(*scheduling.Cluster)
        
        // 基于集群资源利用率排序
        lUtilization := getClusterUtilization(lCluster)
        rUtilization := getClusterUtilization(rCluster)
        
        // 优先选择利用率较低的集群
        if lUtilization < rUtilization {
            return -1
        } else if lUtilization > rUtilization {
            return 1
        }
        return 0
    })
}
```

### AddTaskOrderFn - 任务排序函数
**作用**: 注册任务排序函数，用于确定同一作业内任务的调度顺序。

**函数签名**: 
```go
func (ssn *Session) AddTaskOrderFn(name string, cf api.CompareFn)
```

**CompareFn类型定义**:
```go
type CompareFn func(interface{}, interface{}) int
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示左侧任务信息
- 第二个参数: `*api.TaskInfo` 类型，表示右侧任务信息

**返回值含义**:
- 返回 `-1`: 表示左侧任务优先级高于右侧任务
- 返回 `1`: 表示右侧任务优先级高于左侧任务
- 返回 `0`: 表示两个任务优先级相等

**使用场景**: 
- 实现基于任务类型的排序（如`master`优先于`worker`）
- 实现基于资源需求的任务排序
- 实现基于任务依赖关系的排序

**代码示例**:
```go
func (gp *gangPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册基于任务角色的排序函数
    ssn.AddTaskOrderFn(gp.Name(), func(l, r interface{}) int {
        lv := l.(*api.TaskInfo)
        rv := r.(*api.TaskInfo)
        
        // 获取任务角色
        lRole := getTaskRole(lv)
        rRole := getTaskRole(rv)
        
        // master任务优先调度
        if lRole == "master" && rRole != "master" {
            return -1
        } else if lRole != "master" && rRole == "master" {
            return 1
        }
        return 0
    })
}

func getTaskRole(task *api.TaskInfo) string {
    if role, exists := task.Pod.Labels["role"]; exists {
        return role
    }
    return "worker"
}
```

## 调度决策相关方法

### AddPredicateFn - 节点过滤函数
**作用**: 注册节点过滤函数，用于判断任务是否可以调度到特定节点。

**函数签名**: 
```go
func (ssn *Session) AddPredicateFn(name string, pf api.PredicateFn)
```

**PredicateFn类型定义**:
```go
type PredicateFn func(*TaskInfo, *NodeInfo) error
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `*api.NodeInfo` 类型，表示候选节点信息

**返回值含义**:
- 返回 `nil`: 表示任务可以调度到该节点
- 返回 `error`: 表示任务不能调度到该节点，错误信息说明原因

**使用场景**: 
- 实现节点资源充足性检查
- 实现节点亲和性和反亲和性
- 实现`GPU`类型匹配检查

**代码示例**:
```go
func (np *nodeAffinityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册节点亲和性检查函数
    ssn.AddPredicateFn(np.Name(), func(task *api.TaskInfo, node *api.NodeInfo) error {
        // 检查节点标签是否满足任务要求
        if requiredLabels, exists := task.Pod.Spec.NodeSelector; exists {
            for key, value := range requiredLabels {
                if nodeValue, hasLabel := node.Node.Labels[key]; !hasLabel || nodeValue != value {
                    return fmt.Errorf("node %s doesn't match required label %s=%s", 
                        node.Name, key, value)
                }
            }
        }
        
        // 检查GPU类型匹配
        if gpuType := getRequiredGPUType(task); gpuType != "" {
            nodeGPUType := getNodeGPUType(node)
            if nodeGPUType != gpuType {
                return fmt.Errorf("node %s GPU type %s doesn't match required %s", 
                    node.Name, nodeGPUType, gpuType)
            }
        }
        
        return nil
    })
}

func getRequiredGPUType(task *api.TaskInfo) string {
    if gpuType, exists := task.Pod.Annotations["volcano.sh/gpu-type"]; exists {
        return gpuType
    }
    return ""
}

func getNodeGPUType(node *api.NodeInfo) string {
    if gpuType, exists := node.Node.Labels["accelerator"]; exists {
        return gpuType
    }
    return ""
}
```

### AddPrePredicateFn - 预过滤函数
**作用**: 注册预过滤函数，在节点过滤之前进行任务级别的预检查。

**函数签名**: 
```go
func (ssn *Session) AddPrePredicateFn(name string, pf api.PrePredicateFn)
```

**PrePredicateFn类型定义**:
```go
type PrePredicateFn func(*TaskInfo) error
```

**参数详解**:
- 参数: `*api.TaskInfo` 类型，表示待调度的任务信息

**返回值含义**:
- 返回 `nil`: 表示任务通过预过滤检查
- 返回 `error`: 表示任务不通过预过滤检查，错误信息说明原因

**使用场景**: 
- 实现任务级别的资源检查
- 实现任务状态预验证
- 实现调度前的快速过滤

**代码示例**:
```go
func (rp *resourcePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册预过滤函数
    ssn.AddPrePredicateFn(rp.Name(), func(task *api.TaskInfo) error {
        // 检查任务资源请求是否合理
        if task.Resreq.MilliCPU <= 0 && task.Resreq.Memory <= 0 {
            return fmt.Errorf("task %s has invalid resource request", task.Name)
        }
        
        // 检查任务状态
        if task.Status != api.Pending {
            return fmt.Errorf("task %s is not in pending state", task.Name)
        }
        
        return nil
    })
}
```

### AddBestNodeFn - 最佳节点选择函数
**作用**: 注册最佳节点选择函数，从候选节点中选择最优节点。

**函数签名**: 
```go
func (ssn *Session) AddBestNodeFn(name string, pf api.BestNodeFn)
```

**BestNodeFn类型定义**:
```go
type BestNodeFn func(*TaskInfo, []*NodeInfo) *NodeInfo
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `[]*api.NodeInfo` 类型，表示候选节点列表

**返回值含义**:
- 返回 `*api.NodeInfo`: 表示选中的最佳节点
- 返回 `nil`: 表示没有找到合适的节点

**使用场景**: 
- 实现自定义节点选择策略
- 实现基于业务逻辑的节点选择
- 实现多维度节点评估

**代码示例**:
```go
func (bp *bestNodePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册最佳节点选择函数
    ssn.AddBestNodeFn(bp.Name(), func(task *api.TaskInfo, nodeScores map[float64][]*api.NodeInfo) *api.NodeInfo {
        // 从最高分的节点中选择CPU利用率最低的
        var bestScore float64 = -1
        for score := range nodeScores {
            if score > bestScore {
                bestScore = score
            }
        }
        
        if bestScore < 0 {
            return nil
        }
        
        bestNodes := nodeScores[bestScore]
        if len(bestNodes) == 0 {
            return nil
        }
        
        // 选择CPU利用率最低的节点
        var bestNode *api.NodeInfo
        var minCPUUtilization float64 = 1.0
        
        for _, node := range bestNodes {
            utilization := float64(node.Used.MilliCPU) / float64(node.Allocatable.MilliCPU)
            if utilization < minCPUUtilization {
                minCPUUtilization = utilization
                bestNode = node
            }
        }
        
        return bestNode
    })
}
```

### AddNodeOrderFn - 节点打分函数
**作用**: 注册节点打分函数，用于为节点计算优先级分数。

**函数签名**: 
```go
func (ssn *Session) AddNodeOrderFn(name string, pf api.NodeOrderFn)
```

**NodeOrderFn类型定义**:
```go
type NodeOrderFn func(*TaskInfo, *NodeInfo) (float64, error)
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `*api.NodeInfo` 类型，表示候选节点信息

**返回值含义**:
- 第一个返回值: `float64` 类型，表示节点的优先级分数（分数越高优先级越高）
- 第二个返回值: `error` 类型，表示打分过程中的错误信息

**使用场景**: 
- 实现基于资源利用率的节点打分
- 实现基于网络拓扑的节点打分
- 实现负载均衡策略

**代码示例**:
```go
func (bp *binpackPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册BinPack节点打分函数
    ssn.AddNodeOrderFn(bp.Name(), func(task *api.TaskInfo, node *api.NodeInfo) (float64, error) {
        // 计算资源利用率分数，优先选择资源利用率高的节点
        cpuScore := calculateResourceScore(
            task.Resreq.MilliCPU, 
            node.Allocatable.MilliCPU, 
            node.Used.MilliCPU,
        )
        
        memScore := calculateResourceScore(
            task.Resreq.Memory,
            node.Allocatable.Memory,
            node.Used.Memory,
        )
        
        // 返回加权平均分数
        return (cpuScore + memScore) / 2.0, nil
    })
}

func calculateResourceScore(requested, allocatable, used int64) float64 {
    if allocatable == 0 {
        return 0
    }
    
    // 计算调度后的利用率
    utilization := float64(used+requested) / float64(allocatable)
    
    // BinPack策略：利用率越高分数越高
    if utilization <= 1.0 {
        return utilization * 100
    }
    
    // 超出容量则返回负分
    return -100
}
```

### AddHyperNodeOrderFn - 超级节点排序函数
**作用**: 注册超级节点排序函数，用于对超级节点组进行排序和打分。

**函数签名**: 
```go
func (ssn *Session) AddHyperNodeOrderFn(name string, fn api.HyperNodeOrderFn)
```

**HyperNodeOrderFn类型定义**:
```go
type HyperNodeOrderFn func(*TaskInfo, []*NodeInfo) (map[string]float64, error)
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `[]*api.NodeInfo` 类型，表示候选节点列表

**返回值含义**:
- 第一个返回值: `map[string]float64` 类型，表示节点ID到分数的映射（分数越高优先级越高）
- 第二个返回值: `error` 类型，表示打分过程中的错误信息

**使用场景**: 
- 实现多节点组合的调度策略
- 实现拓扑感知的节点组选择
- 实现大规模分布式任务的节点分配

**代码示例**:
```go
func (tp *topologyPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册超级节点排序函数
    ssn.AddHyperNodeOrderFn(tp.Name(), func(job *api.JobInfo, hyperNodes map[string][]*api.NodeInfo) (map[string]float64, error) {
        scores := make(map[string]float64)
        
        for groupName, nodes := range hyperNodes {
            // 计算节点组的拓扑分数
            topologyScore := calculateTopologyScore(nodes)
            // 计算节点组的资源利用率分数
            utilizationScore := calculateGroupUtilization(nodes)
            
            // 综合评分
            scores[groupName] = topologyScore*0.6 + utilizationScore*0.4
        }
        
        return scores, nil
    })
}
```

### AddBatchNodeOrderFn - 批量节点排序函数
**作用**: 注册批量节点排序函数，用于批量计算多个节点的优先级分数。

**函数签名**: 
```go
func (ssn *Session) AddBatchNodeOrderFn(name string, pf api.BatchNodeOrderFn)
```

**BatchNodeOrderFn类型定义**:
```go
type BatchNodeOrderFn func(*TaskInfo, []*NodeInfo) (map[string]float64, error)
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `[]*api.NodeInfo` 类型，表示候选节点列表

**返回值含义**:
- 第一个返回值: `map[string]float64` 类型，表示节点名称到分数的映射（分数越高优先级越高）
- 第二个返回值: `error` 类型，表示打分过程中的错误信息

**使用场景**: 
- 实现批量节点评分优化
- 实现并行节点打分计算
- 实现大规模集群的性能优化

**代码示例**:
```go
func (bp *batchPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册批量节点排序函数
    ssn.AddBatchNodeOrderFn(bp.Name(), func(task *api.TaskInfo, nodes []*api.NodeInfo) (map[string]float64, error) {
        scores := make(map[string]float64, len(nodes))
        
        // 并行计算所有节点的分数
        for _, node := range nodes {
            scores[node.Name] = calculateBatchNodeScore(task, node)
        }
        
        return scores, nil
    })
}
```

### AddNodeMapFn - 节点映射函数
**作用**: 注册节点映射函数，用于将节点信息映射为特定的分数值。

**函数签名**: 
```go
func (ssn *Session) AddNodeMapFn(name string, pf api.NodeMapFn)
```

**NodeMapFn类型定义**:
```go
type NodeMapFn func(*TaskInfo, *NodeInfo) (float64, error)
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `*api.NodeInfo` 类型，表示候选节点信息

**返回值含义**:
- 第一个返回值: `float64` 类型，表示节点的映射分数值
- 第二个返回值: `error` 类型，表示映射过程中的错误信息

**使用场景**: 
- 实现节点特征提取
- 实现自定义节点评分维度
- 实现节点分类和标记

**代码示例**:
```go
func (mp *mapPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册节点映射函数
    ssn.AddNodeMapFn(mp.Name(), func(task *api.TaskInfo, node *api.NodeInfo) (float64, error) {
        score := 0.0
        
        // GPU节点加分
        if gpuCount, exists := node.Node.Status.Capacity["nvidia.com/gpu"]; exists {
            if gpuCount.Value() > 0 {
                score += 20.0
            }
        }
        
        return score, nil
    })
}
```

### AddNodeReduceFn - 节点归约函数
**作用**: 注册节点归约函数，用于将多个节点分数归约为最终结果。

**函数签名**: 
```go
func (ssn *Session) AddNodeReduceFn(name string, pf api.NodeReduceFn)
```

**NodeReduceFn类型定义**:
```go
type NodeReduceFn func(*TaskInfo, k8sframework.NodeScoreList) error
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待调度的任务信息
- 第二个参数: `k8sframework.NodeScoreList` 类型，表示节点分数列表

**返回值含义**:
- 返回 `nil`: 表示归约处理成功
- 返回 `error`: 表示归约处理失败，错误信息说明原因

**使用场景**: 
- 实现多维度分数的聚合
- 实现分数标准化处理
- 实现最终节点排序逻辑

**代码示例**:
```go
func (rp *reducePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册节点归约函数
    ssn.AddNodeReduceFn(rp.Name(), func(task *api.TaskInfo, nodeScores k8sframework.NodeScoreList) error {
        // 标准化分数处理
        return nil
    })
}
```

### AddAllocatableFn - 资源分配检查函数

**作用**: 注册资源分配检查函数，用于判断队列是否可以为任务分配资源。该函数将会允许`Pending`的`Pod`继续进行调度（分配资源），随后`Pod`将会从`Pending`状态转换到`Running`状态。

**函数签名**: 
```go
func (ssn *Session) AddAllocatableFn(name string, fn api.AllocatableFn)
```

**AllocatableFn类型定义**:
```go
type AllocatableFn func(*QueueInfo, *TaskInfo) bool
```

**参数详解**:
- 第一个参数: `*api.QueueInfo` 类型，表示队列信息
- 第二个参数: `*api.TaskInfo` 类型，表示待分配的任务信息

**返回值含义**:
- 返回 `true`: 表示队列可以为任务分配资源
- 返回 `false`: 表示队列无法为任务分配资源

**使用场景**: 
- 实现队列容量检查
- 实现资源配额管理
- 实现多租户资源隔离

**代码示例**:
```go
func (cp *capacityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册资源分配检查函数
    ssn.AddAllocatableFn(cp.Name(), func(queue *api.QueueInfo, candidate *api.TaskInfo) bool {
        // 检查队列是否超出容量限制
        afterCPU := queue.Used.MilliCPU + candidate.Resreq.MilliCPU
        afterMemory := queue.Used.Memory + candidate.Resreq.Memory
        
        if afterCPU > queue.Capability.MilliCPU {
            return false
        }
        
        if afterMemory > queue.Capability.Memory {
            return false
        }
        
        return true
    })
}
```

### AddOverusedFn - 队列超用检查函数
**作用**: 注册队列超用检查函数，用于判断队列是否超出资源使用限制。

**函数签名**: 
```go
func (ssn *Session) AddOverusedFn(name string, fn api.ValidateFn)
```

**ValidateFn类型定义**:
```go
type ValidateFn func(interface{}) bool
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.QueueInfo` 类型，表示队列信息

**返回值含义**:
- 返回 `true`: 表示队列超出资源使用限制
- 返回 `false`: 表示队列未超出资源使用限制

**使用场景**: 
- 实现队列资源监控
- 实现资源回收触发条件
- 实现弹性资源管理

**代码示例**:
```go
func (cp *capacityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册队列超用检查函数
    ssn.AddOverusedFn(cp.Name(), func(obj interface{}) bool {
        queue := obj.(*api.QueueInfo)
        
        // 检查是否超出保证资源的150%
        cpuOverused := queue.Used.MilliCPU > queue.Guarantee.MilliCPU*3/2
        memOverused := queue.Used.Memory > queue.Guarantee.Memory*3/2
        
        return cpuOverused || memOverused
    })
}
```


## 抢占和回收相关方法

### AddPreemptableFn - 抢占判断函数
**作用**: 注册抢占判断函数，用于确定哪些任务可以被抢占。

**函数签名**: 
```go
func (ssn *Session) AddPreemptableFn(name string, cf api.EvictableFn)
```

**EvictableFn类型定义**:
```go
type EvictableFn func(*TaskInfo, []*TaskInfo) ([]*TaskInfo, int)
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示抢占者任务信息
- 第二个参数: `[]*api.TaskInfo` 类型，表示候选被抢占任务列表

**返回值含义**:
- 第一个返回值: `[]*api.TaskInfo` 类型，表示最终被抢占的任务列表
- 第二个返回值: `int` 类型，表示抢占的任务数量

**使用场景**: 
- 实现基于优先级的任务抢占
- 实现基于资源使用时间的抢占策略
- 实现多租户间的资源抢占

**代码示例**:
```go
func (pp *priorityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册基于优先级的抢占函数
    ssn.AddPreemptableFn(pp.Name(), func(preemptor *api.TaskInfo, preemptees []*api.TaskInfo) ([]*api.TaskInfo, int) {
        var victims []*api.TaskInfo
        preemptorPriority := getTaskPriority(preemptor)
        
        for _, preemptee := range preemptees {
            preempteePriority := getTaskPriority(preemptee)
            
            // 只能抢占优先级更低的任务
            if preemptorPriority > preempteePriority {
                // 检查是否标记为可抢占
                if isPreemptable(preemptee) {
                    victims = append(victims, preemptee)
                }
            }
        }
        
        // 返回可抢占的任务列表和投票权重
        return victims, 1
    })
}

func getTaskPriority(task *api.TaskInfo) int32 {
    if task.Pod.Spec.Priority != nil {
        return *task.Pod.Spec.Priority
    }
    return 0
}

func isPreemptable(task *api.TaskInfo) bool {
    if preemptable, exists := task.Pod.Annotations["volcano.sh/preemptable"]; exists {
        return preemptable == "true"
    }
    return false
}
```

### AddPreemptiveFn - 抢占能力检查函数
**作用**: 注册抢占能力检查函数，用于判断队列是否具备抢占其他任务的能力。

**函数签名**: 
```go
func (ssn *Session) AddPreemptiveFn(name string, fn api.ValidateWithCandidateFn)
```

**ValidateWithCandidateFn类型定义**:
```go
type ValidateWithCandidateFn func(interface{}, interface{}) bool
```

**参数详解**:
- 第一个参数: `interface{}` 类型，通常为 `*api.QueueInfo` 类型，表示队列信息
- 第二个参数: `interface{}` 类型，通常为 `*api.TaskInfo` 类型，表示候选任务信息

**返回值含义**:
- 返回 `true`: 表示队列具备抢占能力
- 返回 `false`: 表示队列不具备抢占能力

**使用场景**: 
- 实现抢占权限控制
- 实现基于优先级的抢占策略
- 实现多租户抢占管理

**代码示例**:
```go
func (pp *priorityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册抢占能力检查函数
    ssn.AddPreemptiveFn(pp.Name(), func(queue *api.QueueInfo, candidate *api.TaskInfo) bool {
        // 检查队列是否有抢占权限
        if preemptive, exists := queue.Queue.Annotations["volcano.sh/preemptive"]; exists {
            if preemptive != "true" {
                return false
            }
        }
        
        // 检查任务优先级是否足够高
        if candidate.Pod.Spec.Priority == nil || *candidate.Pod.Spec.Priority < 1000 {
            return false
        }
        
        return true
    })
}
```


### AddReclaimableFn - 资源回收函数
**作用**: 注册资源回收函数，用于确定哪些任务的资源可以被回收。

**函数签名**: 
```go
func (ssn *Session) AddReclaimableFn(name string, rf api.EvictableFn)
```

**EvictableFn类型定义**:
```go
type EvictableFn func(*TaskInfo, []*TaskInfo) ([]*TaskInfo, int)
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示请求资源的任务信息
- 第二个参数: `[]*api.TaskInfo` 类型，表示候选回收任务列表

**返回值含义**:
- 第一个返回值: `[]*api.TaskInfo` 类型，表示最终被回收的任务列表
- 第二个返回值: `int` 类型，表示回收的任务数量

**使用场景**: 
- 实现队列间的资源回收
- 实现基于资源保证的回收策略
- 实现弹性资源管理

**代码示例**:
```go
func (cp *capacityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册资源回收函数
    ssn.AddReclaimableFn(cp.Name(), func(reclaimer *api.TaskInfo, reclaimees []*api.TaskInfo) ([]*api.TaskInfo, int) {
        var victims []*api.TaskInfo
        reclaimerQueue := ssn.Jobs[reclaimer.Job].Queue
        
        for _, reclaimee := range reclaimees {
            reclaimeeQueue := ssn.Jobs[reclaimee.Job].Queue
            
            // 不能回收同一队列的资源
            if reclaimerQueue == reclaimeeQueue {
                continue
            }
            
            // 检查队列是否超出保证资源
            queueInfo := ssn.Queues[reclaimeeQueue]
            if isQueueOverGuarantee(queueInfo) {
                victims = append(victims, reclaimee)
            }
        }
        
        return victims, 1
    })
}

func isQueueOverGuarantee(queue *api.QueueInfo) bool {
    // 检查队列是否超出保证资源
    if queue.Used.MilliCPU > queue.Guarantee.MilliCPU {
        return true
    }
    if queue.Used.Memory > queue.Guarantee.Memory {
        return true
    }
    return false
}
```

## 作业状态检查相关方法

### AddJobPipelinedFn - 作业流水线检查函数
**作用**: 注册作业流水线检查函数，用于判断作业是否已经绑定到节点上，但是节点上暂无资源分配，等待节点上的其他任务释放资源。主要用于`allocate`和`preempt`两个`action`。目前在`gang/sla/tdm`中有注册该方法。

**函数签名**: 
```go
func (ssn *Session) AddJobPipelinedFn(name string, vf api.VoteFn)
```

**VoteFn类型定义**:
```go
type VoteFn func(interface{}) int
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.JobInfo` 类型，表示作业信息

**返回值含义**:
- 返回`util.Permit`(`1`): 表示支持作业进行流水线调度。
- 返回`util.Abstain`(`0`): 表示中性票，不影响决策。
- 返回`util.Reject`(`-1`): 表示不允许作业进行流水线调度。

**使用场景**: 
- 实现流水线作业调度
- 实现资源预分配检查
- 实现作业启动条件控制

**代码示例**:
```go
func (pp *pipelinePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册作业流水线检查函数
    ssn.AddJobPipelinedFn(pp.Name(), func(obj interface{}) int {
        job := obj.(*api.JobInfo)
        
        // 检查作业是否满足流水线调度条件
        minResource := calculateMinResourceForPipeline(job)
        availableResource := getAvailableResourceForJob(ssn, job)
        
        if availableResource.MilliCPU >= minResource.MilliCPU && 
           availableResource.Memory >= minResource.Memory {
            return util.Permit // 允许流水线调度
        }
        
        return util.Reject // 暂不允许
    })
}

func calculateMinResourceForPipeline(job *api.JobInfo) *api.Resource {
    // 计算流水线调度所需的最小资源
    return &api.Resource{
        MilliCPU: job.MinAvailable * 100, // 每个任务最少100m CPU
        Memory:   job.MinAvailable * 128 * 1024 * 1024, // 每个任务最少128Mi内存
    }
}
```

### AddJobValidFn - 作业有效性检查函数
**作用**: 注册作业有效性检查函数，用于验证作业配置的合法性。

**函数签名**: 
```go
func (ssn *Session) AddJobValidFn(name string, fn api.ValidateExFn)
```

**ValidateExFn类型定义**:
```go
type ValidateExFn func(interface{}) *ValidateResult
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.JobInfo` 类型，表示作业信息

**返回值含义**:
- 返回 `*ValidateResult`: 包含验证结果的结构体，包括是否通过验证和错误信息

**使用场景**: 
- 实现作业配置验证
- 实现资源请求合理性检查
- 实现业务规则验证

**代码示例**:
```go
func (vp *validationPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册作业有效性检查函数
    ssn.AddJobValidFn(vp.Name(), func(obj interface{}) *api.ValidateResult {
        job := obj.(*api.JobInfo)
        
        // 检查作业资源请求是否合理
        totalCPU := int64(0)
        totalMemory := int64(0)
        
        for _, task := range job.Tasks {
            totalCPU += task.Resreq.MilliCPU
            totalMemory += task.Resreq.Memory
        }
        
        // 检查是否超出队列限制
        queue := ssn.Queues[job.Queue]
        if totalCPU > queue.Capability.MilliCPU {
            return &api.ValidateResult{
                Pass:   false,
                Reason: fmt.Sprintf("Job CPU request %d exceeds queue capability %d", 
                    totalCPU, queue.Capability.MilliCPU),
            }
        }
        
        return &api.ValidateResult{Pass: true}
    })
}
```

### AddJobStarvingFns - 作业饥饿检查函数
**作用**: 注册作业饥饿检查函数，用于判断作业是否处于资源饥饿状态。

**函数签名**: 
```go
func (ssn *Session) AddJobStarvingFns(name string, fn api.ValidateFn)
```

**ValidateFn类型定义**:
```go
type ValidateFn func(interface{}) bool
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.JobInfo` 类型，表示作业信息

**返回值含义**:
- 返回 `true`: 表示作业处于饥饿状态
- 返回 `false`: 表示作业未处于饥饿状态

**使用场景**: 
- 实现作业饥饿检测
- 实现优先级提升策略
- 实现公平调度保障

**代码示例**:
```go
func (sp *starvationPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册作业饥饿检查函数
    ssn.AddJobStarvingFns(sp.Name(), func(obj interface{}) bool {
        job := obj.(*api.JobInfo)
        
        // 检查作业等待时间
        waitTime := time.Since(job.CreationTimestamp.Time)
        starvationThreshold := 10 * time.Minute
        
        if waitTime > starvationThreshold {
            // 检查是否有任务在运行
            runningTasks := len(job.TaskStatusIndex[api.Running])
            if runningTasks == 0 {
                return true // 作业处于饥饿状态
            }
        }
        
        return false
    })
}
```

### AddJobReadyFn - 作业就绪检查函数
**作用**: 注册作业就绪检查函数，用于判断作业是否准备好进行调度。

**函数签名**: 
```go
func (ssn *Session) AddJobReadyFn(name string, vf api.ValidateFn)
```

**ValidateFn类型定义**:
```go
type ValidateFn func(interface{}) bool
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.JobInfo` 类型，表示作业信息

**返回值含义**:
- 返回 `true`: 表示作业已准备好进行调度
- 返回 `false`: 表示作业尚未准备好进行调度

**使用场景**: 
- 实现Gang调度的就绪检查
- 实现依赖作业的状态检查
- 实现资源预检查

**代码示例**:
```go
func (gp *gangPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册Gang调度就绪检查函数
    ssn.AddJobReadyFn(gp.Name(), func(obj interface{}) bool {
        job := obj.(*api.JobInfo)
        
        // 检查是否达到最小运行任务数
        if job.MinAvailable == 0 {
            return true
        }
        
        // 统计可调度的任务数量
        schedulableCount := 0
        for _, task := range job.TaskStatusIndex[api.Pending] {
            if canScheduleTask(ssn, task) {
                schedulableCount++
            }
        }
        
        // 检查是否满足Gang调度条件
        return schedulableCount >= int(job.MinAvailable)
    })
}

func canScheduleTask(ssn *framework.Session, task *api.TaskInfo) bool {
    // 检查是否有节点可以调度该任务
    for _, node := range ssn.Nodes {
        if node.State != api.Ready {
            continue
        }
        
        // 执行预选检查
        if err := ssn.PredicateFn(task, node); err != nil {
            continue
        }
        
        return true
    }
    return false
}
```

## 高级调度功能方法

### AddJobEnqueueableFn - 作业入队检查函数

**作用**: 注册作业入队检查函数，用于判断作业是否可以进入调度队列。该函数将会把`Pending`状态的`PodGroup`转换为`Inqueue`状态，随后`PodHGroup`对应的`Pod`将会创建出来，新建出来的`Pod`处于`Pending`状态。

**函数签名**: 
```go
func (ssn *Session) AddJobEnqueueableFn(name string, fn api.VoteFn)
```

**VoteFn类型定义**:
```go
type VoteFn func(interface{}) int
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.JobInfo` 类型，表示作业信息

**返回值含义**:
- 返回`util.Permit`(`1`): 表示支持作业入队的票数
- 返回`util.Abstain`(`0`): 表示中性票，不影响决策
- 返回`util.Reject`(`-1`): 表示反对作业入队的票数

**使用场景**: 
- 实现作业依赖检查
- 实现资源预分配检查
- 实现调度策略控制

**代码示例**:
```go
func (dp *dependencyPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册作业依赖检查函数
    ssn.AddJobEnqueueableFn(dp.Name(), func(obj interface{}) int {
        job := obj.(*api.JobInfo)
        
        // 检查作业依赖
        dependencies := getJobDependencies(job)
        for _, dep := range dependencies {
            depJob := findJobByName(ssn, dep)
            if depJob == nil {
                return util.Reject // 拒绝入队
            }
        }
        
        return util.Permit // 允许入队
    })
}
```

### AddJobEnqueuedFn - 作业入队完成回调函数
**作用**: 注册作业入队完成回调函数，在作业成功入队后执行相关操作。

**函数签名**: 
```go
func (ssn *Session) AddJobEnqueuedFn(name string, fn api.JobEnqueuedFn)
```

**JobEnqueuedFn类型定义**:
```go
type JobEnqueuedFn func(interface{})
```

**参数详解**:
- 参数: `interface{}` 类型，通常为 `*api.JobInfo` 类型，表示已入队的作业信息

**返回值含义**:
- 无返回值，仅执行回调操作

**使用场景**: 
- 实现作业入队后的状态更新
- 实现作业入队统计和监控
- 实现作业入队后的资源预留

**代码示例**:
```go
func (mp *monitorPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册作业入队完成回调函数
    ssn.AddJobEnqueuedFn(mp.Name(), func(obj interface{}) {
        job := obj.(*api.JobInfo)
        
        // 记录作业入队时间
        if job.PodGroup.Annotations == nil {
            job.PodGroup.Annotations = make(map[string]string)
        }
        job.PodGroup.Annotations["volcano.sh/enqueued-time"] = time.Now().Format(time.RFC3339)
        
        // 发送入队事件
        klog.V(3).Infof("Job %s/%s has been enqueued to queue %s", 
            job.Namespace, job.Name, job.Queue)
    })
}
```

### AddReservedNodesFn - 节点预留函数
**作用**: 注册节点预留函数，用于为特定作业预留节点资源。

**函数签名**: 
```go
func (ssn *Session) AddReservedNodesFn(name string, fn api.ReservedNodesFn)
```

**ReservedNodesFn类型定义**:
```go
type ReservedNodesFn func(*TaskInfo) error
```

**参数详解**:
- 参数: `*api.TaskInfo` 类型，表示需要预留节点的任务信息

**返回值含义**:
- 返回 `nil`: 表示节点预留成功
- 返回 `error`: 表示节点预留失败，错误信息说明原因

**使用场景**: 
- 实现节点资源预留
- 实现专用节点管理
- 实现资源隔离策略

**代码示例**:
```go
func (rp *reservationPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册节点预留函数
    ssn.AddReservedNodesFn(rp.Name(), func() {
        // 为高优先级队列预留节点
        for _, queue := range ssn.Queues {
            if isHighPriorityQueue(queue) {
                reserveNodesForQueue(ssn, queue)
            }
        }
    })
}

func reserveNodesForQueue(ssn *framework.Session, queue *api.QueueInfo) {
    reservedCount := 0
    targetReserved := calculateReservedNodes(queue)
    
    for _, node := range ssn.Nodes {
        if reservedCount >= targetReserved {
            break
        }
        
        if canReserveNode(node, queue) {
            // 标记节点为预留状态
            if node.Node.Annotations == nil {
                node.Node.Annotations = make(map[string]string)
            }
            node.Node.Annotations["volcano.sh/reserved-for"] = queue.Name
            reservedCount++
        }
    }
}
```

### AddVictimTasksFns - 受害者任务选择函数
**作用**: 注册受害者任务选择函数，用于选择需要被抢占或回收的任务。

**函数签名**: 
```go
func (ssn *Session) AddVictimTasksFns(name string, fns []api.VictimTasksFn)
```

**VictimTasksFn类型定义**:
```go
type VictimTasksFn func([]*TaskInfo) []*TaskInfo
```

**参数详解**:
- 参数: `[]*api.TaskInfo` 类型，表示候选受害者任务列表

**返回值含义**:
- 返回 `[]*api.TaskInfo`: 表示最终选中的受害者任务列表

**使用场景**: 
- 实现任务抢占策略
- 实现资源回收策略
- 实现多维度任务选择

**代码示例**:
```go
func (vp *victimPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册受害者任务选择函数
    victimFns := []api.VictimTasksFn{
        // 按优先级选择受害者
        func(tasks []*api.TaskInfo) []*api.TaskInfo {
            var victims []*api.TaskInfo
            minPriority := int32(1000)
            
            for _, task := range tasks {
                priority := getTaskPriority(task)
                if priority < minPriority {
                    minPriority = priority
                    victims = []*api.TaskInfo{task}
                } else if priority == minPriority {
                    victims = append(victims, task)
                }
            }
            return victims
        },
        // 按运行时间选择受害者
        func(tasks []*api.TaskInfo) []*api.TaskInfo {
            var victims []*api.TaskInfo
            var shortestRunTime time.Duration = time.Hour * 24
            
            for _, task := range tasks {
                runTime := getTaskRunTime(task)
                if runTime < shortestRunTime {
                    shortestRunTime = runTime
                    victims = []*api.TaskInfo{task}
                } else if runTime == shortestRunTime {
                    victims = append(victims, task)
                }
            }
            return victims
        },
    }
    
    ssn.AddVictimTasksFns(vp.Name(), victimFns)
}
```



### AddTargetJobFn - 目标作业选择函数
**作用**: 注册目标作业选择函数，用于从作业列表中选择特定的目标作业。

**函数签名**: 
```go
func (ssn *Session) AddTargetJobFn(name string, fn api.TargetJobFn)
```

**TargetJobFn类型定义**:
```go
type TargetJobFn func([]*JobInfo) *JobInfo
```

**参数详解**:
- 参数: `[]*api.JobInfo` 类型，表示候选作业列表

**返回值含义**:
- 返回 `*api.JobInfo`: 表示选中的目标作业
- 返回 `nil`: 表示没有找到合适的目标作业

**使用场景**: 
- 实现作业优先级选择
- 实现负载均衡策略
- 实现特殊调度策略

**代码示例**:
```go
func (sp *starvationPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册饥饿作业选择函数
    ssn.AddTargetJobFn(sp.Name(), func(jobs []*api.JobInfo) *api.JobInfo {
        var targetJob *api.JobInfo
        maxWaitTime := time.Duration(0)
        
        for _, job := range jobs {
            // 计算作业等待时间
            waitTime := time.Since(job.CreationTimestamp.Time)
            
            // 检查是否为饥饿作业
            if waitTime > maxWaitTime {
                targetJob = job
                maxWaitTime = waitTime
            }
        }
        
        return targetJob
    })
}
```

### AddSimulateAddTaskFn - 模拟添加任务函数

**作用**: 注册模拟添加任务函数，用于在不实际调度的情况下模拟任务添加的效果。

**函数签名**: 
```go
func (ssn *Session) AddSimulateAddTaskFn(name string, fn api.SimulateAddTaskFn)
```

**SimulateAddTaskFn类型定义**:
```go
type SimulateAddTaskFn func(*TaskInfo, *NodeInfo) error
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待模拟添加的任务信息
- 第二个参数: `*api.NodeInfo` 类型，表示目标节点信息

**返回值含义**:
- 返回 `nil`: 表示模拟添加成功
- 返回 `error`: 表示模拟添加失败，错误信息说明原因

**核心使用场景**: 
- **抢占调度验证**：在`preempt action`中验证高优先级任务是否能在释放资源后成功调度
- **避免实际操作副作用**：在确定抢占策略前，不实际执行`Pod`调度操作
- **提高抢占决策准确性**：通过模拟验证抢占方案的可行性

**代码示例**:
```go
func (sp *simulatePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册模拟添加任务函数
    ssn.AddSimulateAddTaskFn(sp.Name(), func(ctx context.Context, state *k8sframework.CycleState, taskToSchedule *api.TaskInfo, taskToAdd *api.TaskInfo, nodeInfo *api.NodeInfo) error {
        // 模拟将任务添加到节点
        nodeInfo.AddTask(taskToAdd)
        
        // 检查资源是否足够
        if nodeInfo.Used.MilliCPU > nodeInfo.Allocatable.MilliCPU {
            return fmt.Errorf("simulated CPU overcommit on node %s", nodeInfo.Name)
        }
        
        return nil
    })
}
```

### AddSimulateRemoveTaskFn - 模拟移除任务函数

**作用**: 注册模拟移除任务函数，用于在不实际移除的情况下模拟任务移除的效果。

**函数签名**: 
```go
func (ssn *Session) AddSimulateRemoveTaskFn(name string, fn api.SimulateRemoveTaskFn)
```

**SimulateRemoveTaskFn类型定义**:
```go
type SimulateRemoveTaskFn func(*TaskInfo, *NodeInfo) error
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待模拟移除的任务信息
- 第二个参数: `*api.NodeInfo` 类型，表示目标节点信息

**返回值含义**:
- 返回 `nil`: 表示模拟移除成功
- 返回 `error`: 表示模拟移除失败，错误信息说明原因

**核心使用场景**: 
- **抢占资源释放模拟**：在`preempt action`中模拟驱逐低优先级任务后的资源状态
- **避免不必要的Pod驱逐**：验证移除某些任务后是否能释放足够资源
- **减少资源浪费**：避免驱逐Pod后发现无法调度目标任务的情况

**代码示例**:
```go
func (sp *simulatePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册模拟移除任务函数
    ssn.AddSimulateRemoveTaskFn(sp.Name(), func(ctx context.Context, state *k8sframework.CycleState, taskToSchedule *api.TaskInfo, taskToRemove *api.TaskInfo, nodeInfo *api.NodeInfo) error {
        // 模拟从节点移除任务
        nodeInfo.RemoveTask(taskToRemove)
        
        return nil
    })
}
```

### AddSimulateAllocatableFn - 模拟资源分配函数

**作用**: 注册模拟资源分配函数，用于在模拟环境中检查资源分配的可行性。

**函数签名**: 
```go
func (ssn *Session) AddSimulateAllocatableFn(name string, fn api.SimulateAllocatableFn)
```

**SimulateAllocatableFn类型定义**:
```go
type SimulateAllocatableFn func(*QueueInfo, *TaskInfo) bool
```

**参数详解**:
- 第一个参数: `*api.QueueInfo` 类型，表示队列信息
- 第二个参数: `*api.TaskInfo` 类型，表示待分配的任务信息

**返回值含义**:
- 返回 `true`: 表示在模拟环境中队列可以为任务分配资源
- 返回 `false`: 表示在模拟环境中队列无法为任务分配资源

**核心使用场景**: 
- **队列资源配额验证**：在`preempt action`抢占过程中验证队列是否有足够配额来调度任务
- **多轮抢占决策支持**：为复杂的抢占算法提供模拟环境
- **资源分配预检查**：确保只有在确认可以成功调度时才执行实际抢占操作

**代码示例**:
```go
func (sp *simulatePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册模拟资源分配函数
    ssn.AddSimulateAllocatableFn(sp.Name(), func(ctx context.Context, state *k8sframework.CycleState, queue *api.QueueInfo, task *api.TaskInfo) bool {
        // 在模拟环境中检查队列资源分配
        simulatedUsed := &api.Resource{
            MilliCPU: queue.Used.MilliCPU + task.Resreq.MilliCPU,
            Memory:   queue.Used.Memory + task.Resreq.Memory,
        }
        
        // 检查是否超出队列容量
        return simulatedUsed.MilliCPU <= queue.Capability.MilliCPU && 
               simulatedUsed.Memory <= queue.Capability.Memory
    })
}
```

### AddSimulatePredicateFn - 模拟预选函数

**作用**: 注册模拟预选函数，用于在模拟环境中进行节点过滤检查。

**函数签名**: 
```go
func (ssn *Session) AddSimulatePredicateFn(name string, fn api.SimulatePredicateFn)
```

**SimulatePredicateFn类型定义**:
```go
type SimulatePredicateFn func(*TaskInfo, *NodeInfo) error
```

**参数详解**:
- 第一个参数: `*api.TaskInfo` 类型，表示待模拟调度的任务信息
- 第二个参数: `*api.NodeInfo` 类型，表示候选节点信息

**返回值含义**:
- 返回 `nil`: 表示在模拟环境中任务可以调度到该节点
- 返回 `error`: 表示在模拟环境中任务不能调度到该节点，错误信息说明原因

**核心使用场景**: 
- **抢占节点约束验证**：在`preempt action`抢占过程中验证任务在模拟环境中是否满足节点约束条件
- **拓扑约束检查**：在抢占场景中维护拓扑约束的同时验证调度可行性
- **智能抢占决策**：确保抢占后的任务能满足所有节点级别的调度要求

**代码示例**:
```go
func (sp *simulatePlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册模拟预选函数
    ssn.AddSimulatePredicateFn(sp.Name(), func(ctx context.Context, state *k8sframework.CycleState, task *api.TaskInfo, node *api.NodeInfo) error {
        // 在模拟环境中检查节点适配性
        availableCPU := node.Allocatable.MilliCPU - node.Used.MilliCPU
        availableMemory := node.Allocatable.Memory - node.Used.Memory
        
        if task.Resreq.MilliCPU > availableCPU {
            return fmt.Errorf("simulated CPU insufficient on node %s", node.Name)
        }
        
        if task.Resreq.Memory > availableMemory {
            return fmt.Errorf("simulated memory insufficient on node %s", node.Name)
        }
        
        return nil
    })
}
```

## 事件处理相关方法

### AddEventHandler - 事件处理器注册函数

**作用**: 注册事件处理器，用于在任务分配和释放过程中执行自定义的回调逻辑。这是插件中对资源分配管理的关键方法。

**函数签名**: 
```go
func (ssn *Session) AddEventHandler(eh *EventHandler)
```

**EventHandler结构**:
```go
type EventHandler struct {
    AllocateFunc   func(event *Event)
    DeallocateFunc func(event *Event)
}

type Event struct {
    Task *api.TaskInfo
    Err  error
}
```

**参数详解**:
- `AllocateFunc`: 任务被正式分配到节点时（`Allocate`操作）、进入流水线调度时（`Pipeline`操作）、被驱逐的任务恢复运行时（`Unevict`操作），参数为包含任务和节点信息的事件
- `DeallocateFunc`: 任务被抢占驱逐（`Evict`操作）、调度决策被撤销（`UnPipeline`操作）、任务分配被取消（`UnAllocate`操作）时，参数为包含任务和节点信息的事件

**返回值含义**:
- 无返回值，仅执行事件处理逻辑

**核心使用场景**: 
- **资源分配跟踪**：在任务成功分配到节点时执行资源统计和状态更新
- **资源释放管理**：在任务从节点释放时执行资源清理和状态恢复
- **插件状态同步**：维护插件内部的资源分配状态与调度器状态一致
- **多租户资源管理**：实现队列级别的资源使用统计和配额管理

**调用时机**:
- `AllocateFunc`：在`ssn.Allocate()`、`ssn.Pipeline()`等分配操作成功后调用
- `DeallocateFunc`：在`ssn.Evict()`、`ssn.UpdateTaskStatus()`等释放操作后调用

**代码示例**:
```go
func (cp *capacityPlugin) OnSessionOpen(ssn *framework.Session) {
    // 注册事件处理器
    ssn.AddEventHandler(&framework.EventHandler{
        AllocateFunc: func(event *framework.Event) {
            job := ssn.Jobs[event.Task.Job]
            attr := cp.queueOpts[job.Queue]
            
            // 更新队列已使用资源
            attr.allocated.Add(event.Task.Resreq)
            
            klog.V(4).Infof("Capacity allocated <%v> to queue <%v>, total allocated <%v>",
                event.Task.Resreq, job.Queue, attr.allocated)
        },
        DeallocateFunc: func(event *framework.Event) {
            job := ssn.Jobs[event.Task.Job]
            attr := cp.queueOpts[job.Queue]
            
            // 释放队列已使用资源
            attr.allocated.Sub(event.Task.Resreq)
            
            klog.V(4).Infof("Capacity deallocated <%v> from queue <%v>, total allocated <%v>",
                event.Task.Resreq, job.Queue, attr.allocated)
        },
    })
}
```

**实际应用场景**:

1. **DRF插件中的资源份额管理**:

    ```go
    ssn.AddEventHandler(&framework.EventHandler{
        AllocateFunc: func(event *framework.Event) {
            attr := drf.jobAttrs[event.Task.Job]
            attr.allocated.Add(event.Task.Resreq)
            
            // 重新计算主导资源份额
            attr.share = drf.calculateShare(attr.allocated, attr.request)
        },
    })
    ```

2. **Proportion插件中的权重调整**:

    ```go
    ssn.AddEventHandler(&framework.EventHandler{
        AllocateFunc: func(event *framework.Event) {
            job := ssn.Jobs[event.Task.Job]
            attr := pp.queueOpts[job.Queue]
            
            // 更新队列资源使用情况
            attr.allocated.Add(event.Task.Resreq)
            
            // 重新计算队列权重
            pp.updateQueueWeight(job.Queue, attr)
        },
    })
    ```

3. **NUMA感知插件中的拓扑状态管理**:

    ```go
    ssn.AddEventHandler(&framework.EventHandler{
        AllocateFunc: func(event *framework.Event) {
            node := pp.nodeResSets[event.Task.NodeName]
            
            // 更新NUMA节点资源分配状态
            pp.assignRes[event.Task.UID] = pp.allocateNumaResource(node, event.Task)
            
            klog.V(4).Infof("NUMA resource allocated for task %s on node %s", 
                event.Task.Name, event.Task.NodeName)
        },
    })
    ```

**重要特性**:
- **自动触发**：无需手动调用，调度器在资源分配/释放时自动触发
- **状态同步**：确保插件内部状态与调度器实际状态保持一致
- **错误处理**：`Event`结构包含错误信息，支持异常情况处理
- **多插件支持**：多个插件可以注册不同的事件处理器，按注册顺序执行
