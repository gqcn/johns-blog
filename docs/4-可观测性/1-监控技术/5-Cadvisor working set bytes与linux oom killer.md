---
slug: "/cadvisor-working-set-bytes-oom-killer"
title: "Cadvisor working set bytes与linux oom killer"
hide_title: true
keywords:
  [
    "Cadvisor",
    "Working Set",
    "OOM Killer",
    "Linux",
    "内存管理",
    "容器监控",
    "资源限制",
  ]
description: "探讨 Cadvisor 中 working set bytes 的概念以及其与 Linux OOM killer 的关系，帮助用户理解容器内存监控和管理机制"
---

## 背景

内存使用率告警的`promeql`如下：

```text
100*(sum (container_memory_working_set_bytes{namespace=~"argo|khaos|obs|kube-system"}) by (khaos_product,khaos_cluster,namespace,app_name,pod,container)/sum (container_spec_memory_limit_bytes{namespace=~"argo|khaos|obs|kube-system"}) by (khaos_product,khaos_cluster,namespace,app_name,pod,container) <= 1)
```

其中`container_memory_working_set_bytes`包含了`pagecache`内存，如果容器使用了较多的`pagecache`，计算出来的内存使用率会比较偏高。那么我们需要关心的指标应该是哪些呢？这需要解答`linux`内核`oom killer`依赖哪些具体的`cgroup`指标项来执行`oom kill`。

## container\_memory\_working\_set\_bytes的具体实现

`cadvisor`中的源码计算如下：

```go
func setMemoryStats(s *cgroups.Stats, ret *info.ContainerStats) {
	ret.Memory.Usage = s.MemoryStats.Usage.Usage
	ret.Memory.MaxUsage = s.MemoryStats.Usage.MaxUsage
	ret.Memory.Failcnt = s.MemoryStats.Usage.Failcnt
	ret.Memory.KernelUsage = s.MemoryStats.KernelUsage.Usage

	if cgroups.IsCgroup2UnifiedMode() {
		ret.Memory.Cache = s.MemoryStats.Stats["file"]
		ret.Memory.RSS = s.MemoryStats.Stats["anon"]
		ret.Memory.Swap = s.MemoryStats.SwapUsage.Usage - s.MemoryStats.Usage.Usage
		ret.Memory.MappedFile = s.MemoryStats.Stats["file_mapped"]
	} else if s.MemoryStats.UseHierarchy {
		ret.Memory.Cache = s.MemoryStats.Stats["total_cache"]
		ret.Memory.RSS = s.MemoryStats.Stats["total_rss"]
		ret.Memory.Swap = s.MemoryStats.Stats["total_swap"]
		ret.Memory.MappedFile = s.MemoryStats.Stats["total_mapped_file"]
	} else {
		ret.Memory.Cache = s.MemoryStats.Stats["cache"]
		ret.Memory.RSS = s.MemoryStats.Stats["rss"]
		ret.Memory.Swap = s.MemoryStats.Stats["swap"]
		ret.Memory.MappedFile = s.MemoryStats.Stats["mapped_file"]
	}
	if v, ok := s.MemoryStats.Stats["pgfault"]; ok {
		ret.Memory.ContainerData.Pgfault = v
		ret.Memory.HierarchicalData.Pgfault = v
	}
	if v, ok := s.MemoryStats.Stats["pgmajfault"]; ok {
		ret.Memory.ContainerData.Pgmajfault = v
		ret.Memory.HierarchicalData.Pgmajfault = v
	}

	inactiveFileKeyName := "total_inactive_file"
	if cgroups.IsCgroup2UnifiedMode() {
		inactiveFileKeyName = "inactive_file"
	}

	workingSet := ret.Memory.Usage
	if v, ok := s.MemoryStats.Stats[inactiveFileKeyName]; ok {
		if workingSet < v {
			workingSet = 0
		} else {
			workingSet -= v
		}
	}
	ret.Memory.WorkingSet = workingSet
}
```

 其中的`s.MemoryStats.Usage.Usage`来源于`github.com/opencontainers/runc`库：

```go
func getMemoryData(path, name string) (cgroups.MemoryData, error) {
	memoryData := cgroups.MemoryData{}

	moduleName := "memory"
	if name != "" {
		moduleName = "memory." + name
	}
	var (
		usage    = moduleName + ".usage_in_bytes"
		maxUsage = moduleName + ".max_usage_in_bytes"
		failcnt  = moduleName + ".failcnt"
		limit    = moduleName + ".limit_in_bytes"
	)

	value, err := fscommon.GetCgroupParamUint(path, usage)
	if err != nil {
		if name != "" && os.IsNotExist(err) {
			// Ignore ENOENT as swap and kmem controllers
			// are optional in the kernel.
			return cgroups.MemoryData{}, nil
		}
		return cgroups.MemoryData{}, err
	}
	memoryData.Usage = value
	value, err = fscommon.GetCgroupParamUint(path, maxUsage)
	if err != nil {
		return cgroups.MemoryData{}, err
	}
	memoryData.MaxUsage = value
	value, err = fscommon.GetCgroupParamUint(path, failcnt)
	if err != nil {
		return cgroups.MemoryData{}, err
	}
	memoryData.Failcnt = value
	value, err = fscommon.GetCgroupParamUint(path, limit)
	if err != nil {
		if name == "kmem" && os.IsNotExist(err) {
			// Ignore ENOENT as kmem.limit_in_bytes has
			// been removed in newer kernels.
			return memoryData, nil
		}

		return cgroups.MemoryData{}, err
	}
	memoryData.Limit = value

	return memoryData, nil
}
```

可以看到`container_memory_working_set_bytes=memory.usage_in_bytes - memory.stat[total_inactive_file]`，其中的`memory.usage_in_bytes`就包含了`pagecache`内容。

## OOM Killer机制

在`linux oom-killer`的源码中，主要使用的是`rss+swap+pagetable`来计算`oom`分值 [https://elixir.bootlin.com/linux/v5.4.58/source/mm/oom\_kill.c#L227](https://elixir.bootlin.com/linux/v5.4.58/source/mm/oom_kill.c#L227) 因此在`pagecache`比较大的场景下可以使用底层已经提供的两个指标`container_memory_rss+container_memory_swap`来替代`container_memory_working_set_bytes`计算内存使用率。

## 参考资料

*   [https://www.baeldung.com/linux/memory-overcommitment-oom-killer](https://www.baeldung.com/linux/memory-overcommitment-oom-killer)

  

  

  

