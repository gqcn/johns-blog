---
slug: "/cloud-native/volcano-cross-queues-reclaim-design"
title: "Volcano跨队列资源抢占驱逐改进设计"
hide_title: true
keywords:
  [
    "Volcano", "Kubernetes", "跨队列抢占", "资源驱逐", "reclaim", "在线推理", "离线训练", "优先级调度", "GPU资源", "capacity-card", "多租户", "资源配额"
  ]
description: "详细阐述Volcano调度器跨队列资源抢占驱逐的改进设计方案,实现在线推理服务与离线训练任务间的智能资源调度,支持潮汐调度和Gang策略,提升GPU资源利用率。"
---

## 背景介绍

### 业务场景

- 业务上的任务类型分两类：在线推理(`inference`)和离线训练(`training`)。
- 在线推理和离线训练任务使用不同的队列管理配额。
- 在线推理服务按照租户和项目空间维度通过不同的队列管理配额，租户和项目空间是`1:N`关系。
- 离线训练任务按照业务队列的维度管理配额。
- 底层均是由`Volcano queue`来实现配额管理。

### 潮汐调度

- 资源抢占驱逐的背景是基于潮汐调度。
- 抢占驱逐的关键策略如下：
  - 允许**在线推理服务**抢占**离线训练任务**的资源，高优先级的在线推理服务优先获得资源，低优先级的离线训练任务优先被抢占。
  - 离线训练任务之间不允许相互抢占，离线训练任务不能抢占在线推理服务的资源。
  - 离线训练任务被抢占资源时，应当满足`gang`策略：要么全部失败，要么全部运行。

### Volcano调度器

`Volcano`原生提供了两个支持按照优先级进行资源抢占驱逐的`action`：`preempt`和`reclaim`。其中`preempt`仅支持单队列内的多个任务之间的抢占驱逐，而`reclaim`则支持跨队列的抢占驱逐。根据当前业务背景来看，我们需要通过`reclaim`动作来实现跨队列的资源抢占驱逐。

由于`Volcano`不支持卡维度的配额管理，因此在我们的调度器中使用的是自定义的`capacity-card`插件来实现卡维度的配额管理。具体可以参考章节：[Volcano调度器支持智算卡Quota改进方案](./2000-Volcano调度器支持智算卡Quota改进方案.md)。由于在抢占和驱逐过程中也会涉及到对资源的计算，因此该过程也依赖此插件来实现卡维度的计算。


## 技术方案

### 任务类型的识别

#### 任务类型注解标识

严谨的方式是在工作负载中增加任务类型的注解，以便调度器识别该任务类型，根据任务类型再做进一步的抢占优先级控制。

增加的任务类型注解为`volcano.sh/service.type`，`volcano.sh`的注解前缀是`Volcano`提供的一个内置隐含能力，以该前缀开头的注解能从具体的工作负载如`Deployment`或者`Volcano Job`传递到`PodGroup`上，而`Volcano`调度器从`PodGroup`上能读取到该注解，从而识别到该工作负载的任务类型。

任务类型的可选值：`inference`, `training`。

在线推理服务使用示例：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ai-service
  annotations:
    volcano.sh/service.type: inference
    volcano.sh/card.request: '{"NVIDIA-H200/mig-1g.18gb-mixed":2}'

spec:
  // ...
```

离线训练任务使用示例：
```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: ai-job
  annotations:
    volcano.sh/service.type: training
    volcano.sh/card.request: '{"NVIDIA-H200":2}'
spec:
  // ...
```

#### 根据工作负载自动识别

由于在业务使用上，不同的任务类型会使用不同类型的工作负载，而任何工作负载最终都会生成`Pod`用于承载执行容器，在`Pod`的`OwnerReference`中会关联其具体的工作负载，因此我们可以根据不同类型的工作负载就能反向识别出该`Pod`对应的任务类型。

该方案可以作为一种补充手段，当工作负载中没有设置`volcano.sh/service.type`注解时，调度器会根据`Pod`的`OwnerReference`反向识别出该`Pod`对应的任务类型。

为`Volcano`调度器插件增加相关工作负载与任务类型之间的映射关系：
```yaml
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
      overCommitFactor: 2
      cardUnlimitedCpuMemory: true
      # 工作负载与任务类型映射关系
      podOwnerReferenceToServiceType: 
        ReplicaSet: inference
        Deployment: inference
        Job: training
  - name: nodeorder
```

实现示例：
```go
func (p *Plugin) getTaskServiceType(ssn *framework.Session, ti *api.TaskInfo) serviceType {
	if ti.Pod == nil {
		return serviceTypeUnknown
	}
	var (
		job = ssn.Jobs[ti.Job]
		pg  = job.PodGroup
		st  = pg.Annotations[serviceTypeAnnoKey]
	)
	if st != "" {
		return serviceType(st)
	}
	if len(p.podOwnerReferenceToServiceType) == 0 {
		return serviceTypeUnknown
	}
	if ti.Pod.OwnerReferences == nil || len(ti.Pod.OwnerReferences) == 0 {
		return serviceTypeUnknown
	}
	return serviceType(p.podOwnerReferenceToServiceType[ti.Pod.OwnerReferences[0].Kind])
}
```


### 抢占优先级控制

#### 队列优先级及抢占控制

在`Volcano`中，通过为队列配置`priority`和`reclaimable`字段来控制队列的优先级和抢占控制。根据业务上的抢占策略，我们可以为在线和离线的队列设置不同的`priority`和`reclaimable`字段。

优先级高的队列优先获取抢占权利，优先级低的队列优先被抢占资源。根据我们业务上的抢占策略，在线推理和离线训练资源队列具有不同的优先级和抢占控制配置，其`priority`和`reclaimable`字段设置如下：

| 队列类型 | priority | reclaimable |
| --- | --- | --- |
| 在线资源队列 | `80000` | `false` |
| 离线资源队列 | `20000` | `true` |

在线资源队列示例：
```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: queue-inference
  annotations:
    volcano.sh/card.quota: '{"NVIDIA-GeForce-RTX-4090":8}'
spec:
  weight: 1
  # 在线服务的队列设置的优先级需要比离线任务高，
  # 以便在线服务在进行资源抢占的时候优先抢占离线任务的队列资源。
  # 所有在线队列使用同一个优先级值即可。
  priority: 80000 
  reclaimable: false
  capability:
    cpu: 4
    memory: 4Gi
```

离线资源队列示例：
```yaml
apiVersion: scheduling.volcano.sh/v1beta1
kind: Queue
metadata:
  name: queue-training
  annotations:
    volcano.sh/card.quota: '{"NVIDIA-GeForce-RTX-4090":8}'
spec:
  weight: 1
  # 离线任务的队列的优先级需要比在线服务低，
  # 以便在线服务在进行资源抢占的时候优先抢占离线任务的队列资源。
  # 所有离线任务队列使用同一个优先级值即可。
  priority: 20000
  reclaimable: true
  capability:
    cpu: 4
    memory: 4Gi
```

#### 任务优先级及抢占控制

**任务优先级**用于控制在资源抢占时候的优先级，优先级高的任务优先获得资源，优先级低的任务优先被抢占。任务可以通过`priorityClassName`优先级配置字段来配置任务的优先级。

**抢占控制**在`Volcano`调度器设计中通过`volcano.sh/preemptable`注解来配置任务的抢占开关。该注解标识该任务是否可被抢占，在没有配置的情况下，默认能够被抢占，所以都应当显式配置该字段。

我们需要先创建`PriorityClass`资源对象来管理优先级，优先级划分为`4`类级别，分别对应的优先级数值为`80000`、`60000`、`40000`、`20000`，配置模板如下：
```yaml
apiVersion: scheduling.k8s.io/v1
description: High priority class for Volcano.
kind: PriorityClass
metadata:
  name: pc-high
globalDefault: false
preemptionPolicy: PreemptLowerPriority
value: 80000
```


在线推理服务模板：
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: inference-high
  annotations:
    # 是否可被抢占
    volcano.sh/preemptable: "false"
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
      annotations:
        volcano.sh/card.name: NVIDIA-GeForce-RTX-4090
        scheduling.volcano.sh/queue-name: "queue-inference"
    spec:
      schedulerName: volcano
      # 优先级控制
      priorityClassName: pc-high
      // ...
```

离线训练任务模板：
```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: training-low
  annotations:
    # 是否可被抢占
    volcano.sh/preemptable: "true"
spec:
  minAvailable: 1
  # 优先级控制
  priorityClassName: pc-low
  schedulerName: volcano
  queue: queue-training
  // ...
```


### 抢占相关扩展点

`Volcano`提供了丰富的插件扩展点，用于针对不同的调度阶段实现自定义的调度逻辑。与资源抢占相关的扩展点函数为`PreemptiveFn`和`ReclaimableFn`。

#### PreemptiveFn

该扩展点函数用于判断队列是否能为当前队列的指定任务抢占其他队列任务。在该函数的实现中，通常判断该任务的资源是否会超过队列的配额。该函数通常用于`reclaim`动作中，用于跨队列回收资源时，判断是否可进一步执行资源回收逻辑。

参考示例代码：
```go
// PreemptiveFn decides whether the queue can preempt resource for its task.
func (p *Plugin) PreemptiveFn(queue *api.QueueInfo, reclaimer *api.TaskInfo) bool {
	if queue.Queue.Status.State != scheduling.QueueStateOpen {
		klog.V(3).Infof(
			"Queue <%s> current state: %s, is not open state, can not reclaim for <%s>.",
			queue.Name, queue.Queue.Status.State, reclaimer.Name,
		)
		return false
	}
	var (
		qAttr         = p.queueOpts[queue.UID]
		canPreemptive = p.canPreemptive(qAttr, reclaimer)
	)
	return canPreemptive
}

func (p *Plugin) canPreemptive(qAttr *queueAttr, ti *api.TaskInfo) bool {
	taskReqResource, err := p.GetTaskRequestResources(ti)
	if err != nil {
		klog.V(5).Infof(
			"Get request resource for Task <%s/%s> failed, Queue <%s>, error: <%s>",
			ti.Namespace, ti.Name, qAttr.name, err.Error(),
		)
		if ti.Pod != nil {
			eventRecorder.Eventf(
				ti.Pod, v1.EventTypeWarning, EventTypeGetTaskRequestResourceFailed,
				"Get request resource failed, Queue <%s>, error: <%s>",
				qAttr.name, err.Error(),
			)
		}
		return false
	}

	var (
		queueCapability    = qAttr.capability
		totalToBeAllocated = qAttr.allocated.Clone().Add(taskReqResource)
	)
	if totalToBeAllocated == nil {
		klog.V(5).Infof(
			"Task <%s/%s>, Queue <%s> totalToBeAllocated is nil, allow it to preempt",
			ti.Namespace, ti.Name, qAttr.name,
		)
		return true
	}
	if taskReqResource == nil {
		if ok := totalToBeAllocated.LessEqual(queueCapability, api.Zero); !ok {
			klog.Warningf(
				"Task <%s/%s>, Queue <%s> capability <%s> is empty, deny it to preempt",
				ti.Namespace, ti.Name, qAttr.name, queueCapability.String(),
			)
			if ti.Pod != nil {
				eventRecorder.Eventf(
					ti.Pod, v1.EventTypeWarning, EventTypeEmptyQueueCapability,
					"Queue <%s> capability <%s> is empty, deny it to preempt",
					qAttr.name, queueCapability.String(),
				)
			}
			return false
		}
		klog.V(5).Infof(
			"Task <%s/%s>, Queue <%s> request is nil, allow it to preempt",
			ti.Namespace, ti.Name, qAttr.name,
		)
		return true
	}

	// check cpu and memory
	if taskReqResource.MilliCPU > 0 && totalToBeAllocated.MilliCPU > queueCapability.MilliCPU {
		klog.Warningf(
			"Task <%s/%s>, Queue <%s> has no enough CPU, request <%v>, total would be <%v>, capability <%v>",
			ti.Namespace, ti.Name, qAttr.name,
			taskReqResource.MilliCPU, totalToBeAllocated.MilliCPU, queueCapability.MilliCPU,
		)
		if ti.Pod != nil {
			eventRecorder.Eventf(
				ti.Pod, v1.EventTypeWarning, EventTypeInsufficientCPUQuota,
				"Queue <%s> has insufficient CPU quota: requested <%v>, total would be <%v>, but capability is <%v>",
				qAttr.name, taskReqResource.MilliCPU, totalToBeAllocated.MilliCPU, queueCapability.MilliCPU,
			)
		}
		return false
	}
	if taskReqResource.Memory > 0 && totalToBeAllocated.Memory > queueCapability.Memory {
		var (
			taskReqResourceMi    = taskReqResource.Memory / 1024 / 1024
			totalToBeAllocatedMi = totalToBeAllocated.Memory / 1024 / 1024
			queueCapabilityMi    = queueCapability.Memory / 1024 / 1024
		)
		klog.Warningf(
			"Task <%s/%s>, Queue <%s> has no enough Memory, request <%v Mi>, total would be <%v Mi>, capability <%v Mi>",
			ti.Namespace, ti.Name, qAttr.name, taskReqResourceMi, totalToBeAllocatedMi, queueCapabilityMi,
		)
		if ti.Pod != nil {
			eventRecorder.Eventf(
				ti.Pod, v1.EventTypeWarning, EventTypeInsufficientMemoryQuota,
				"Queue <%s> has insufficient memory quota: requested <%v Mi>, total would be <%v Mi>, but capability is <%v Mi>",
				qAttr.name, taskReqResourceMi, totalToBeAllocatedMi, queueCapabilityMi,
			)
		}
		return false
	}

	// if r.scalar is nil, whatever rr.scalar is, r is less or equal to rr
	if totalToBeAllocated.ScalarResources == nil {
		return true
	}

	for scalarName, scalarQuant := range taskReqResource.ScalarResources {
		if api.IsIgnoredScalarResource(scalarName) {
			continue
		}
		checkResult := CheckSingleScalarResource(
			scalarName, scalarQuant, totalToBeAllocated, queueCapability, CheckModeTask,
		)
		if checkResult.Ok {
			continue
		}
		klog.Warningf(
			"Task <%s/%s>, Queue <%s> has no enough %s, request <%v>, total would be <%v>, capability <%v>",
			ti.Namespace, ti.Name, qAttr.name,
			checkResult.NoEnoughScalarName,
			checkResult.NoEnoughScalarCount,
			checkResult.ToBeUsedScalarQuant,
			checkResult.QueueCapabilityQuant,
		)
		if ti.Pod != nil {
			eventRecorder.Eventf(
				ti.Pod, v1.EventTypeWarning, EventTypeInsufficientScalarQuota,
				"Queue <%s> has insufficient <%s> quota: requested <%v>, total would be <%v>, but capability is <%v>",
				qAttr.name,
				checkResult.NoEnoughScalarName,
				checkResult.NoEnoughScalarCount,
				checkResult.ToBeUsedScalarQuant,
				checkResult.QueueCapabilityQuant,
			)
		}
		return false
	}
	return true
}
```

#### ReclaimableFn

该扩展点函数用于确定哪些任务的资源可以被回收。该函数主要是`reclaim`插件调用，`reclaim`用于跨队列的资源抢占，该函数可以实现对已有的候选任务做自定义的过滤。

参考示例代码：
```go
// ReclaimableFn selects the reclaimable tasks under the capacity card plugin.
// Polices:
// 1. High priority inference services can preempt resources from lower priority training tasks.
// 2. Training tasks cannot preempt each other, nor can they preempt resources from inference services.
// 3. Inference services cannot preempt each other.
func (p *Plugin) ReclaimableFn(
	ssn *framework.Session, reclaimer *api.TaskInfo, reclaimees []*api.TaskInfo,
) ([]*api.TaskInfo, int) {
	var (
		victims              []*api.TaskInfo
		reclaimerServiceType = p.getTaskServiceType(ssn, reclaimer)
	)
	// Training tasks cannot preempt each other, nor can they preempt resources from inference services.
	if reclaimerServiceType == serviceTypeTraining {
		return victims, util.Permit
	}
	for _, reclaimee := range reclaimees {
		reclaimeeServiceType := p.getTaskServiceType(ssn, reclaimee)
		if reclaimeeServiceType == serviceTypeInference {
			// Inference services cannot preempt each other.
			continue
		}

		if reclaimeeServiceType == serviceTypeUnknown {
			klog.V(4).Infof("unknown service type for reclaimee task: %s, skip it", reclaimee.Name)
			continue
		}

		victims = append(victims, reclaimee)
	}
	klog.V(4).Infof("reclaimer: %s, victims: %+v", reclaimer, victims)
	return victims, util.Permit
}
```


### 抢占gang策略实现

在`Volcano`默认的`recliam`实现中，如果一个`Volcano Job`存在多个实例，那么`reclaim`只会抢占其中所需资源的实例，可能会造成`Volcano Job`中一部分实例被抢占后处于`Pending`，另一部分没有被抢占的实例处于`Running`状态不满足`gang`策略。

要解决这个问题，我们除了需要设置`minAvailable`参数外，还需要设置`Volcano Job`的重启策略。`minAvailable`参数的数值通常和实例数一致，例如：
```yaml
# gang策略关键配置，设置识别可用的最小副本数
minAvailable: 2
```

当`Volcano Job`中的实例被抢占后，根据重启策略决定`Volcano`直接终止该任务，停止全部实例，或者重启该任务的所有实例，当无资源时所有实例处于`Pending`状态。通过以下重试策略实现：
```yaml
policies:
# 只要任一Task被资源抢占，那么整个任务失败（引发Job Aborted状态）
- event: PodEvicted
  action: AbortJob
```
或者
```yaml
# 只要任一Task被资源抢占，那么整个任务重启（引发Pod Pending状态）
- event: PodEvicted
  action: RestartJob 
```

示例任务配置如下：
```yaml
apiVersion: batch.volcano.sh/v1alpha1
kind: Job
metadata:
  name: training-low
  annotations:
    volcano.sh/preemptable: "true"
spec:
  minAvailable: 2
  priorityClassName: pc-low
  schedulerName: volcano
  queue: queue-training
  policies:
  - event: TaskCompleted
    action: CompleteJob
  # 只要任一Task被资源抢占，那么整个任务失败
  - event: PodEvicted
    action: AbortJob 
  tasks:
  - replicas: 1
    name: worker1
    template:
      metadata:
        annotations:
          volcano.sh/card.name: NVIDIA-GeForce-RTX-4090
      spec:
        affinity:
          nodeAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: nvidia.com/gpu.product
                  operator: In
                  values:
                  - NVIDIA-GeForce-RTX-4090
        restartPolicy: Never
        containers:
        - image: alpine:latest
          imagePullPolicy: IfNotPresent
          name: worker
          command: ["sh", "-c", "sleep 1d"]
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
              nvidia.com/gpu: 4
            limits:
              cpu: 100m
              memory: 100Mi
              nvidia.com/gpu: 4
  - replicas: 1
    name: worker2
    template:
      metadata:
        annotations:
          volcano.sh/card.name: NVIDIA-GeForce-RTX-4090
      spec:
        affinity:
          nodeAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
              nodeSelectorTerms:
              - matchExpressions:
                - key: nvidia.com/gpu.product
                  operator: In
                  values:
                  - NVIDIA-GeForce-RTX-4090
        restartPolicy: Never
        containers:
        - image: alpine:latest
          imagePullPolicy: IfNotPresent
          name: worker
          command: ["sh", "-c", "sleep 1d"]
          resources:
            requests:
              cpu: 100m
              memory: 100Mi
              nvidia.com/gpu: 4
            limits:
              cpu: 100m
              memory: 100Mi
              nvidia.com/gpu: 4
```
