---
slug: "/observability/linux-memory-cgroup-statistics"
title: "Linux中进程内存及cgroup内存统计差异"
hide_title: true
keywords:
  ["Linux", "Memory", "cgroup", "内存统计", "进程内存", "容器内存", "系统监控"]
description: "深入分析 Linux 系统中进程内存和 cgroup 内存统计的差异，帮助用户理解容器环境下的内存管理和监控"
---




## Linux内存简介

由于`BIOS`和`Kernel`启动过程消耗了部分物理内存，因此`MemTotal`值（ `free` 命令获取）小于`RAM`容量。 `Linux`内存查询方式：

*   `free` 命令
*   `/proc/meminfo`

通过查询到的内存数据可以得到`Linux`内存计算公式如下：

```bash
## 总内存 = 已使用内存 + 空闲内存 + 缓存
total = used + free + buff/cache 
```

其中，已使用内存数据包括`Kernel`消耗的内存和所有进程消耗的内存。

## 进程内存

进程消耗的内存包括：

*   虚拟地址空间映射的物理内存。
*   读写磁盘生成`PageCache`消耗的内存。

#### 虚拟地址映射的物理内存

![](/attachments/p619795.png)

*   **物理内存**：硬件安装的内存（**内存条**）。
*   **虚拟内存**：操作系统为程序运行提供的内存。程序运行空间包括**用户空间（用户态）**和**内核空间（内核态）**。
    *   **用户态**：低特权运行程序。数据存储空间包括：

        *   栈（`Stack`）：函数调用的函数栈。
        *   `MMap(Memory Mapping Segment)`：内存映射区。
        *   堆（`Heap`）：动态分配内存。
        *   `BBS`区：未初始化的静态变量存放区。
        *   `Data`区：已初始化的静态常量存放区。
        *   `Text`区：二进制可执行代码存放区。

        用户态中运行的程序通过`MMap`将虚拟地址映射至物理内存中。

    *   **内核态**：运行的程序需要访问操作系统内核数据。数据存储空间包括：
        *   直接映射区：通过简单映射将虚拟地址映射至物理内存中。
        *   `VMALLOC`：内核动态映射空间，用于将连续的虚拟地址映射至不连续的物理内存中。
        *   持久内核映射区：将虚拟地址映射至物理内存的高端内存中。
        *   固定映射区：用于满足特殊映射需求。

虚拟地址映射的物理内存可以区分为**共享物理内存**和**独占物理内存**。如下图所示，物理内存1和3由进程A独占，物理内存2由进程B独占，物理内存4由进程A和进程B共享。

![](/attachments/p619791.png)

#### PageCache

除了通过`MMap`文件直接映射外，进程文件还可以通过系统调用`Buffered I/O`相关的`Syscall`将数据写入到`PageCache`，因此，`PageCache`也会占用一部分内存。

![](/attachments/p620216.png)

## 进程内存统计指标

#### 单进程内存统计指标

进程资源有如下类型：

*   `anno_rss`：表示没有映射到文件的内存量，即匿名内存。匿名内存通常是进程通过`malloc`或类似的方法动态分配的内存。
*   `file_rss`：表示映射到文件的内存量。如果一个进程打开了一个文件并将其映射到内存，那么这部分内存就会被计入`file_rss`。
*   `shmem_rss`：表示共享内存量。如果多个进程共享一部分内存，那么这部分内存就会被计入`shmem_rss`。

:::tip
`RSS( resident set size)`：驻留集大小。表示进程已装入内存的页面的集合。
:::

#### 常用内存查询命令

###### top

:::tip
该命令展示的内存单位默认为`KB`。
:::

![](/attachments/image-2024-5-6_15-47-44.png)

| 命令  | 内存  | 说明  | 计算公式 |
| --- | --- | --- | --- |
| `top` | `VIRT(Virtual Set Size)` | 虚拟地址空间。 | 无   |
| `RES(Resident Set Size)` | `RSS`映射的物理内存。 | `anno_rss + file_rss + shmem_rss` |
| `SHR(Shared Memory)` | 共享内存。 | `file_rss + shmem_rss` |
| `%MEM` | 内存使用率。 | `RES / MemTotal` |

###### ps

:::tip
该命令展示的内存单位默认为`KB`。
:::

![](/attachments/image-2024-5-6_15-49-57.png)

| 命令  | 内存  | 说明  | 计算公式 |
| --- | --- | --- | --- |
| `ps` | `VSZ(Virtual Set Size)` | 虚拟地址空间。 | 无   |
| `RSS(Resident Set Size)` | `RSS`映射的物理内存。 | `anno_rss + file_rss + shmem_rss` |
| `%MEM` | 内存使用率。 | `RSS / MemTotal` |

###### smem

:::tip
该命令需要单独安装。
:::

![](/attachments/image-2024-5-6_15-54-38.png)

| 命令  | 内存  | 说明  | 计算公式 |
| --- | --- | --- | --- |
| `smem` | `USS(Unique Set Size)` | 独占内存。 | `anno_rss` |
| `PSS(Proportional Set Size)` | 按比例分配内存。 | `anno_rss + file_rss/m + shmem_rss/n` |
| `RSS(Resident Set Size)` | `RSS`映射的物理内存。 | `anno_rss + file_rss + shmem_rss` |

#### 内存指标关系

![](/attachments/p623795.png)

:::tip
`WSS(Memoy Working Set Size)`指标：一种更为合理评估进程内存真实使用内存的计算方式。
但是受限于`Linux Page Reclaim`机制，这个概念目前还只是概念，并没有哪一个工具可以正确统计出`WSS`，只能是趋近。
:::


#### `cgroup`内存统计指标

`cgroup`用于对`Linux`的一组进程资源进行限制、管理和隔离。更多信息，请参见[官方文档](https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/6/html/resource_management_guide/ch01)。  
`cgroup`按层级管理，每个节点都包含一组文件，用于统计由这个节点包含的`cgroup`的某些方面的指标。例如，`Memory Control Group(memcg)`统计内存相关指标。   
![](/attachments/p624557.png)

`memory cgroup`文件包含以下指标：

```text
cgroup.event_control       ## 用于eventfd的接口
memory.usage_in_bytes      ## 显示当前已用的内存
memory.limit_in_bytes      ## 设置/显示当前限制的内存额度
memory.failcnt             ## 显示内存使用量达到限制值的次数
memory.max_usage_in_bytes  ## 历史内存最大使用量
memory.soft_limit_in_bytes ## 设置/显示当前限制的内存软额度
memory.stat                ## 显示当前cgroup的内存使用情况
memory.use_hierarchy       ## 设置/显示是否将子cgroup的内存使用情况统计到当前cgroup里面
memory.force_empty         ## 触发系统立即尽可能的回收当前cgroup中可以回收的内存
memory.pressure_level      ## 设置内存压力的通知事件，配合cgroup.event_control一起使用
memory.swappiness          ## 设置和显示当前的swappiness
memory.move_charge_at_immigrate ## 设置当进程移动到其他cgroup中时，它所占用的内存是否也随着移动过去
memory.oom_control         ## 设置/显示oom controls相关的配置
memory.numa_stat           ## 显示numa相关的内存
```

其中需要关注以下`3`个指标：

*   `memory.limit_in_bytes`：限制当前`cgroup`可以使用的内存大小。对应`k8s`、`docker`下的`memory limits`值。
*   `memory.usage_in_bytes`：当前`cgroup`里所有进程实际使用的内存总和，约等于`memory.stat`文件下的`RSS+Cache`值。
*   `memory.stat`：当前`cgroup`的内存统计详情。


    | memory.stat文件字段 | 说明  |
    | --- | --- |
    | `cache` | `PageCache`缓存页大小。 |
    | `rss` | `cgroup`中所有进程的`anno_rss`内存之和。 |
    | `mapped_file` | `cgroup`中所有进程的`file_rss`和`shmem_rss`内存之和。 |
    | `active_anon` | 活跃LRU（`least-recently-used`，最近最少使用）列表中所有`Anonymous`进程使用内存和`Swap`缓存，包括 `tmpfs`（`shmem`），单位为`bytes`。 |
    | `inactive_anon` | 不活跃`LRU`列表中所有`Anonymous`进程使用内存和`Swap`缓存，包括 `tmpfs`（`shmem`），单位为`bytes`。 |
    | `active_file` | 活跃`LRU`列表中所有`File-backed`进程使用内存，以`bytes`为单位。 |
    | `inactive_file` | 不活跃`LRU`列表中所有`File-backed`进程使用内存，以`bytes`为单位。 |
    | `unevictable` | 无法再生的内存，以`bytes`为单位。 |
    
    以上指标中如果带有`total_`前缀则表示当前`cgroup`及其下所有子孙`cgroup`对应指标之和。例如 `total_rss` 指标表示当前`cgroup`及其下所有子孙`cgroup`的`RSS`指标之和。


#### 总结

单进程和进程`cgroup`指标区别：

*   `cgroup`的`RSS`指标只包含`anno_rss`，对应单进程下的`USS`指标，因此`cgroup`的`mapped_file+RSS`则对应单进程下的`RSS`指标。
*   单进程中`PageCache`需单独统计，`cgroup`中 `memcg` 文件统计的内存已包含`PageCache`。


| 内存  | 单进程 | 进程`cgroup(memcg)` |
| --- | --- | --- |
| `RSS` | `anon_rss + file_rss ＋ shmem_rss` | `anon_rss` |
| `mapped_file` | 无   | `file_rss + shmem_rss` |
| `cache` | 无   | `PageCache` |

## Docker和K8s中的内存统计

`Docker`和`K8S`中的内存统计即`Linux memcg`进程统计，但两者内存使用率的定义不同。

#### docker stat命令

返回示例如下：

![](/attachments/p624725.png)

*   `LIMIT`对应控制组的`memory.limit_in_bytes`
*   `MEM USAGE`对应控制组的`memory.usage_in_bytes - memory.stat[total_cache]`

:::tip
`docker stat`命令查询原理，请参见[官方文档](https://github.com/docker/cli/blob/37f9a88c696ae81be14c1697bd083d6421b4933c/cli/command/container/stats_helpers.go##L233)。
:::

#### kubectl top pod命令

`kubectl top`命令通过`Metric-server`和`Heapster`获取`Cadvisor`中`working_set`的值，表示`Pod`实例使用的内存大小（不包括`Pause`容器）。`Metrics-server`中`Pod`内存获取原理如下，更多信息，请参见[官方文档](https://github.com/kubernetes-sigs/metrics-server/blob/d4432d67b2fc435b9c71a89c13659882008a4c54/pkg/sources/summary/summary.go##L206)。

```go
func decodeMemory(target *resource.Quantity, memStats *stats.MemoryStats) error {
    if memStats == nil || memStats.WorkingSetBytes == nil {
        return fmt.Errorf("missing memory usage metric")
    }

    *target = *uint64Quantity(*memStats.WorkingSetBytes, 0)
    target.Format = resource.BinarySI

    return nil
}
```

`Cadvisor`内存`workingset`算法如下，更多信息，请参见[官方文档](https://github.com/google/cadvisor/blob/0ff17b8d0df3712923c46ca484701b876d02dfee/container/libcontainer/handler.go##L706)。 

```go
func setMemoryStats(s *cgroups.Stats, ret *info.ContainerStats) {
    ret.Memory.Usage = s.MemoryStats.Usage.Usage
    ret.Memory.MaxUsage = s.MemoryStats.Usage.MaxUsage
    ret.Memory.Failcnt = s.MemoryStats.Usage.Failcnt

    if s.MemoryStats.UseHierarchy {
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

    workingSet := ret.Memory.Usage
    if v, ok := s.MemoryStats.Stats["total_inactive_file"]; ok {
        if workingSet < v {
            workingSet = 0
        } else {
            workingSet -= v
        }
    }
    ret.Memory.WorkingSet = workingSet
}
```

通过以上命令算法可以得出，`kubectl top pod`命令查询到的`Memory Usage = Memory WorkingSet = memory.usage_in_bytes - memory.stat[total_inactive_file]`。

#### 总结


| 命令  | 生态  | Memory Usage计算方式 |
| --- | --- | --- |
| `docker stat` | `docker` | `memory.usage_in_bytes - memory.stat[total_cache]` |
| `kubectl top pod` | `k8s` | `memory.usage_in_bytes - memory.stat[total_inactive_file]` |


如果使用`top/ps`命令查询内存，则`cgroup`下的`Memory Usage`指标需对`top/ps`命令查询到的指标进行以下计算：


| 进程组生态 | 计算公式 |
| --- | --- |
| `cgroup` | `rss + cache（active cache + inactive cache）` |
| `docker` | `rss` |
| `k8s` | `rss + active cache` |

## 参考资料

*   [https://www.alibabacloud.com/help/zh/arms/application-monitoring/memory-metrics](https://www.alibabacloud.com/help/zh/arms/application-monitoring/memory-metrics)
*   [http://hustcat.github.io/memory-usage-in-process-and-cgroup](http://hustcat.github.io/memory-usage-in-process-and-cgroup/?spm=a2c6h.12873639.article-detail.8.4db570921VdAkk)
*   [https://www.51cto.com/article/692936.html](https://www.51cto.com/article/692936.html)
*   [https://itnext.io/from-rss-to-wss-navigating-the-depths-of-kubernetes-memory-metrics-4d7d77d8fdcb](https://itnext.io/from-rss-to-wss-navigating-the-depths-of-kubernetes-memory-metrics-4d7d77d8fdcb)

  