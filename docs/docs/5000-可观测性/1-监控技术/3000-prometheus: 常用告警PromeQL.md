---
slug: "/observability/prometheus-alert-rules"
title: "Prometheus: 常用告警PromeQL"
hide_title: true
keywords:
  ["Prometheus", "AlertManager", "PromQL", "监控告警", "告警规则", "监控运维"]
description: "总结 Prometheus 常用的告警规则和 PromQL 查询语句，帮助运维人员快速配置和管理监控告警"
---



## 告警梳理

梳理需要用于监控的指标以及规则。告警规则前置设定如下：

*   **执行间隔**：以 `1` 分钟作为默认的告警规则执行间隔。
    
*   **触发阈值**：以连续`3`次达到触发阈值为前提才触发一次告警。**阈值触发在未特殊提醒的前提下，统一使用** `>=` **的计算方式**。
    
*   **告警分级**：告警分`3`个优先级，**普通**告警(`info`)、**严重**告警(`warn`)、**致命**告警(`crit`)，分别对应`3`个不同的阈值。
    

以下告警阈值初始值为经验设定，在现网配置时会需要根据实际情况进行适当调整，并不断完善该文档。

## 集群纬度

| **告警名称** | **告警描述** | **表达式** | **阈值设置** |
| --- | --- | --- | --- |
| **集群CPU使用率**<br/><br/>`alert.cluster.cpu.usage_rate`<br/><br/>重要程序：一般 | 集群的`CPU`使用率过高时，意味着需要排查个别容器是否有异常，亦或需要扩展节点资源。<br/><br/>单位`%`。 | `sum(rate(container_cpu_usage_seconds_total{id="/"}[5m])) by (khaos_product,khaos_cluster) / sum (machine_cpu_cores{}) by (khaos_product,khaos_cluster) * 100` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **集群内存使用率**<br/><br/>`alert.cluster.memory.usage_rate`<br/><br/>重要程序：一般 | 集群的内存使用率过高时，意味着需要排查个别容器是否有异常，抑或需要扩展节点资源。<br/><br/>单位`%`。 | `sum (container_memory_working_set_bytes{id="/"}) by (khaos_product,khaos_cluster) / sum (machine_memory_bytes{}) by (khaos_product,khaos_cluster) * 100` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **集群Pods使用率**<br/><br/>`alert.cluster.pods.usage_rate`<br/><br/>重要程序：可有可无 | 每个`Node`节点能够维护的`Pods`数量是有限制的，当每个`Node`的`Pods`使用率过高时会引发集群的`Pods`使用率过高，会影响`Pod`的调度，甚至无法创建`Pod`。<br/><br/>单位`%`。<br/><br/>该规则默认不启用。 | `sum(kube_pod_status_phase{phase="Running"})) by (khaos_product,khaos_cluster) / sum(kube_node_status_allocatable{resource="pods"}) by (khaos_product,khaos_cluster) * 100` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |

## 节点纬度

| **告警名称** | **告警描述** | **表达式** | **阈值设置** |
| --- | --- | --- | --- |
| **节点CPU使用率**<br/><br/>`alert.node.cpu.usage_rate`<br/><br/>重要程序：重要 | `CPU`使用率过高会导致进程响应慢。<br/><br/>单位`%`。 | `sum by(khaos_product,khaos_cluster,instance) (irate(node_cpu_seconds_total{mode!="idle"}[5m])) / on(khaos_product,khaos_cluster,instance) group_left sum by (khaos_product,khaos_cluster,instance)((irate(node_cpu_seconds_total{}[5m]))) * 100` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **节点内存使用率**<br/><br/>`alert.node.memory.usage_rate`<br/><br/>重要程序：重要 | 主机内存利用率高会导致进程响应慢。<br/><br/>单位`%`。 | `100 - ((avg_over_time(node_memory_MemAvailable_bytes{}[5m]) * 100) / avg_over_time(node_memory_MemTotal_bytes{}[5m]))` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **节点磁盘使用率**<br/><br/>`alert.node.storage.usage_rate`<br/><br/>重要程序：可有可无 | 由于节点上挂载的磁盘比较多，我们并不需要关心所有挂载点的磁盘使用率，因此该规则默认不启用。<br/><br/>单位`%`。 | `100 - 100*(sum(node_filesystem_avail_bytes{device=~"/dev.*", mountpoint!~".*pods.*\|.*pvc.*"}) by(khaos_product,khaos_cluster, instance, device) / sum(node_filesystem_size_bytes{device=~"/dev.*", mountpoint!~".*pods.*\|.*pvc.*"}) by (khaos_product,khaos_cluster, instance, device))` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **节点系统磁盘使用率**<br/><br/>`alert.node.storage.root.usage_rate`<br/><br/>重要程序：重要 | **系统盘**使用率过高会影响系统稳定性。<br/><br/>单位`%`。 | `100 - 100*(sum(node_filesystem_avail_bytes{device=~"/dev.*", mountpoint="/"}) by(khaos_product,khaos_cluster, instance, device) / sum(node_filesystem_size_bytes{device=~"/dev.*", mountpoint="/"}) by (khaos_product,khaos_cluster, instance, device))` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **磁盘** `inode` **使用率**<br/><br/>`alert.node.storage.inode.usage_rate`<br/><br/>重要程序：重要 | 使用率如果达到`100%`会影响磁盘文件的创建。<br/><br/>单位`%`。 | `100 - node_filesystem_files_free{fstype=~"ext4\|xfs"}/node_filesystem_files{fstype=~"ext4\|xfs"} * 100` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **磁盘读延迟过高**<br/><br/>`alert.node.storage.io_delay_ms.read`<br/><br/>重要程序：重要 | 影响磁盘内容读取。<br/><br/>单位`ms`。 | `rate(node_disk_read_time_seconds_total{}[5m]) / (rate(node_disk_reads_completed_total{}[5m])>0) * 1000` | `info: 1000`<br/><br/>`warn: 3000`<br/><br/>`crit: 5000` |
| **磁盘写延迟过高**<br/><br/>`alert.node.storage.io_delay_ms.write`<br/><br/>重要程序：重要 | 影响磁盘内容写入。<br/><br/>单位`ms`。 | `rate(node_disk_write_time_seconds_total{}[5m]) / (rate(node_disk_writes_completed_total{}[5m])>0) * 1000` | `info: 1000`<br/><br/>`warn: 3000`<br/><br/>`crit: 5000` |
| **节点TCP每秒出包错误率**<br/><br/>`alert.node.network.tcp.error_rate.out`<br/><br/>重要程序：重要 | 网络出入包错误率过高会严重影响数据面及管控面网络访问。<br/><br/>`5m`内的平均网络出包错误率。<br/><br/>单位`%`。 | `100*(sum(node_network_transmit_errs_total{device="eth0"}[5m]) by (khaos_product,khaos_cluster, device, instance)/sum(node_network_transmit_packets_total{device="eth0"}[5m]) by (khaos_product,khaos_cluster, device, instance))` | `info: 5`<br/><br/>`warn: 10`<br/><br/>`crit: 30` |
| **节点TCP每秒入包错误率**<br/><br/>[alert.node.network.tcp.error\_rate.in](http://alert.node.network.tcp.error_rate.in)<br/><br/>重要程序：重要 | 网络出入包错误率过高会严重影响数据面及管控面网络访问。<br/><br/>`5m`内的平均网络入包错误率。<br/><br/>单位`%`。 | `100*(sum(node_network_receive_errs_total{device="eth0"}[5m]) by (khaos_product,khaos_cluster, device, instance)/sum(node_network_receive_packets_total{device="eth0"}[5m]) by (khaos_product,khaos_cluster, device, instance))` | `info: 5`<br/><br/>`warn: 10`<br/><br/>`crit: 30` |
| **节点网络流量过大**<br/><br/>`alert.node.network.flow`<br/><br/>重要程序：重要 | 流量过大可能会影响节点上所有进程的网络通信。原理是`1`分钟内**对外网卡**的**平均流量**，包含**出+入**的流量。流量阈值根据集群硬件条件灵活配置。<br/><br/>单位`mb/s`。 | `(rate(node_network_receive_bytes_total{device=~"eth.+"}[1m])+rate(node_network_transmit_bytes_total{device=~"eth.+"}[1m]))/1024/1024` | `info: 5000`<br/><br/>`warn: 8000`<br/><br/>`crit: 9000` |
| **节点网络带宽使用率**<br/><br/>`alert.node.network.bandwidth_usage_rate`<br/><br/>重要程序：重要 | 流量过大可能会影响节点上所有进程的网络通信。原理是`1`分钟内**对外网卡**的平均流量占用总体网卡带宽的百分比。<br/><br/>单位`%`。<br/><br/>**注意事项：**<br/><br/>`node_network_speed_bytes` **指标仅在物理机下有效，虚拟机下的该指标可能会负值或者无效。因此该告警作为流量告警的辅助告警规则。** | `100*(rate(node_network_receive_bytes_total{device=~"eth.+"}[1m])+rate(node_network_transmit_bytes_total{device=~"eth.+"}[1m]))/(node_network_speed_bytes{device=~"eth.+"} > 0)` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **节点** `NotReady` **持续时间(5分钟)**<br/><br/>`alert.node.status.not_ready5`<br/><br/>重要程序：重要 | 主机上的`kubelet`无法上报主机状态，可能主机宕机或者不稳定，可能会引发后续`Kubernetes`集群内部针对该节点的调度、网络访问等问题。<br/><br/>**按照持续时间划分不同告警级别。** | `kube_node_status_condition{condition="Ready",status="true"} == 0` | `info: 1` |
| **节点** `NotReady` **持续时间(10分钟)**<br/><br/>`alert.node.status.not_ready10`<br/><br/>重要程序：重要 | `warn: 1` |
| **节点** `NotReady` **持续时间(15分钟)**<br/><br/>`alert.node.status.not_ready15`<br/><br/>重要程序：重要 | `crit: 1` |
| **节点Pods使用率**<br/><br/>`alert.node.status.pods.usage_rate`<br/><br/>重要程序：可有可无 | 每个`Node`节点能够维护的`Pods`数量是有限制的，当使用率过高时，`Kuberntes`调度器将法调度新的`Pod`到该节点，从而影响节点上的`Pod`装箱。<br/><br/>该规则默认不启用。<br/><br/>单位`%`。 | `100*sum(kube_pod_info{}) by (khaos_product,khaos_cluster,node) / sum(kube_node_status_allocatable{resource="pods"}) by (khaos_product,khaos_cluster,node)` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **节点异常关机或重启**<br/><br/>`alert.node.status.shut_reboot`<br/><br/>重要程序：重要 | 节点**5分钟内**系统启动时间发生变化，可能发生异常关机或者重启，请注意查看。 | `abs((node_boot_time_seconds{} or 0) - node_boot_time_seconds{} offset 5m != 0)` | `crit: 1` |

## 容器纬度

| **告警名称** | **告警描述** | **处理方式** | **表达式** | **阈值设置** |
| --- | --- | --- | --- | --- |
| **容器CPU使用率**<br/><br/>`alert.container.cpu.usage_rate`<br/><br/>重要程序：可有可无 | 前置条件：只有在容器配置了`resources.limits.cpu`条件下才能使用。<br/><br/>单位`%`。<br/><br/>该规则默认不启用。 |     | `100*sum(rate(container_cpu_usage_seconds_total{namespace=~"argo\|khaos\|obs\|kube-system"}[5m])) by (khaos_product,khaos_cluster,namespace,app_name,pod,container)/sum(container_spec_cpu_quota{namespace=~"argo\|khaos\|obs\|kube-system"}/container_spec_cpu_period{namespace=~"argo\|khaos\|obs\|kube-system"}) by (khaos_product,khaos_cluster,namespace,app_name,pod,container)` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **容器内存使用率**<br/><br/>`alert.container.memory.usage_rate`<br/><br/>重要程序：可有可无 | 前置条件：只有在容器配置了`resources.limits.memory`条件下才能使用。<br/><br/>单位`%`。<br/><br/>该规则默认不启用。 |     | `100*(sum (container_memory_working_set_bytes{namespace=~"argo\|khaos\|obs\|kube-system"}) by (khaos_product,khaos_cluster,namespace,app_name,pod,container)/sum (container_spec_memory_limit_bytes{namespace=~"argo\|khaos\|obs\|kube-system"}) by (khaos_product,khaos_cluster,namespace,app_name,pod,container) <= 1)` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **容器磁盘使用率**<br/><br/>`alert.container.storage.usage_rate`<br/><br/>重要程序：可有可无 | 由于容器内部的挂载点可能很多，并且在`Kubernetes`下都是通过`pv`的方式申请存储，对应也有`pv`的磁盘使用率告警，因此该告警规则默认未启用。<br/><br/>单位`%`。 |     | `100*sum(container_fs_usage_bytes{namespace=~"argo\|khaos\|obs\|kube-system"} / (container_fs_limit_bytes{namespace=~"argo\|khaos\|obs\|kube-system"} != 0 )) by (khaos_product,khaos_cluster,namespace,app_name,pod,container,device)` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **容器持续** `10` **分钟** `NotReady`<br/><br/>(**该告警包含数据面容器**)<br/><br/>`alert.container.not_ready10`<br/><br/>重要程序：重要 | 通过`reason`字段告警具体原因，`reason`字段可能得取值如下：<br/><br/>*   `ContainerCreating`<br/>    <br/>*   `CrashLoopBackOff`<br/>    <br/>*   `CreateContainerConfigError`<br/>    <br/>*   `ErrImagePull`<br/>    <br/>*   `ImagePullBackOff`<br/>    <br/>*   `PodInitializing`<br/>    <br/>*   `OOMKilled`<br/>    <br/>*   `StartError`<br/>    <br/>*   `Error`<br/>    <br/>*   `ContainerStatusUnknown`<br/>    <br/>*   `Unknown`<br/>    <br/><br/>**需要注意：**<br/><br/>**数据面的告警仅针对内核容器，按照container="khaos-biz"通用配置，并不关心业务Pod中的sidecar容器。**<br/><br/>**按照持续时间划分不同告警级别。** | 通过跳板机登录`kubernetes`集群查看`Pod`状态，异常容器日志定位准确原因。 | **管控面：**<br/><br/>*管控面容器处于异常状态，该容器提供的管控能力失效。*<br/><br/>带`reason`的异常容器：<br/><br/>`(`  <br/>`(kube_pod_container_status_terminated_reason{reason!="Completed",namespace=~"argo\|khaos\|obs\|kube-system"} + kube_pod_container_status_terminated_reason{reason!="Completed",namespace=~"argo\|khaos\|obs\|kube-system"} offset 10m) == 2`  <br/>`or`  <br/>`(kube_pod_container_status_waiting_reason{reason!="Completed",namespace=~"argo\|khaos\|obs\|kube-system"} + kube_pod_container_status_waiting_reason{reason!="Completed",namespace=~"argo\|khaos\|obs\|kube-system"} offset 10m) == 2`  <br/>`)`<br/><br/>`unkhown`的异常容器：<br/><br/>`((kube_pod_container_status_ready{namespace=~"argo\|khaos\|obs\|kube-system"} + kube_pod_container_status_ready{namespace=~"argo\|khaos\|obs\|kube-system"} offset 10m) == 0)`  <br/>`unless on(uid)`  <br/>`(`  <br/>`kube_pod_container_status_terminated_reason{namespace=~"argo\|khaos\|obs\|kube-system"}`  <br/>`or`  <br/>`kube_pod_container_status_waiting_reason{namespace=~"argo\|khaos\|obs\|kube-system"}`  <br/>`)`<br/><br/>**数据面：**<br/><br/>*数据面容器异常，会影响用户实例，请优先查看！*<br/><br/>带`reason`的异常容器：<br/><br/>`(`  <br/>`(kube_pod_container_status_terminated_reason{reason!="Completed",container="khaos-biz"} + kube_pod_container_status_terminated_reason{reason!="Completed",container="khaos-biz"} offset 10m) == 2`  <br/>`or`  <br/>`(kube_pod_container_status_waiting_reason{reason!="Completed",container="khaos-biz"} + kube_pod_container_status_waiting_reason{reason!="Completed",container="khaos-biz"} offset 10m) == 2`  <br/>`)`<br/><br/>`unkhown`的异常容器：<br/><br/>`((kube_pod_container_status_ready{container="khaos-biz"} + kube_pod_container_status_ready{container="khaos-biz"} offset 10m) == 0)`  <br/>`unless on(uid)`  <br/>`(`  <br/>`kube_pod_container_status_terminated_reason{container="khaos-biz"}`  <br/>`or`  <br/>`kube_pod_container_status_waiting_reason{container="khaos-biz"}`  <br/>`)` | `info: 1` |
| **容器持续** `20` **分钟** `NotReady`<br/><br/>(**该告警包含数据面容器**)<br/><br/>`alert.container.not_ready20`<br/><br/>重要程序：重要 | `warn: 1` |
| **容器持续** `30` **分钟** `NotReady`<br/><br/>(**该告警包含数据面容器**)<br/><br/>`alert.container.not_ready30`<br/><br/>重要程序：重要 | `crit: 1` |
| **容器发生持续重启**<br/><br/>(**该告警包含数据面容器**)<br/><br/>`alert.pod.status.crash_loop`<br/><br/>重要程序：重要 | 通过`reason`字段告警具体原因，`reason`字段可能得取值如下：<br/><br/>*   `CrashLoopBackOff`<br/>    <br/>*   `CreateContainerConfigError`<br/>    <br/>*   `ErrImagePull`<br/>    <br/>*   `ImagePullBackOff`<br/>    <br/>*   `OOMKilled`<br/>    <br/>*   `StartError`<br/>    <br/>*   `Error`<br/>    <br/>*   `ContainerStatusUnknown`<br/>    <br/>*   `Unknown`<br/>    <br/><br/>**需要注意：**<br/><br/>*   **由于容器重启使用了时间退避，最长退避时间为5m，因此这里默认使用15m作为间隔来计算重启递增值。** | 通过跳板机登录`kubernetes`集群查看`Pod`状态，异常容器日志定位准确原因。 | **管控面：**<br/><br/>`(delta(kube_pod_container_status_restarts_total{namespace=~"argo\|khaos\|obs\|kube-system"} [15m]) > 1) + on(khaos_product,khaos_cluster, namespace, app_name, pod, container) group_right(kube_pod_container_status_last_terminated_reason) 0*(kube_pod_container_status_last_terminated_reason{reason!="Completed",namespace=~"argo\|khaos\|obs\|kube-system"})`<br/><br/>**数据面（非平台管控面空间）**：<br/><br/>`(delta(kube_pod_container_status_restarts_total{namespace!~"argo\|khaos\|obs\|kube-system"} [15m]) > 1) + on(khaos_product,khaos_cluster, namespace, app_name, pod, container) group_right(kube_pod_container_status_last_terminated_reason) 0*(kube_pod_container_status_last_terminated_reason{reason!="Completed",namespace!~"argo\|khaos\|obs\|kube-system"})` | `info: 15m 2`<br/><br/>`warn: 20m 4`<br/><br/>`crit: 30m 5` |

## Pod纬度

| **告警名称** | **告警描述** | **处理方式** | **表达式** | **阈值设置** |
| --- | --- | --- | --- | --- |
| **Pod长期处于无法调度状态**<br/><br/>(**该告警包含数据面容器**)<br/><br/>`alert.pod.status.unschedulable`<br/><br/>重要程序：重要 | Pod在一定时间内没有被调度成功，通常是Pod依赖没有满足要求，例如资源请求、亲和性等前置条件无法满足。 | 通过跳板机登录集群，使用`kubectl describe`命令查看具体原因。 | `kube_pod_status_unschedulable{}` | `info: 10分钟`<br/><br/>`warn: 20分钟`<br/><br/>`crit: 30分钟` |
| **Pod PVC使用率**<br/><br/>(**该告警包含数据面容器**)<br/><br/>`alert.pod.storage.volume.usage_rate`<br/><br/>重要程序：重要 | PVC对应的PV使用率高时，会影响存储，进而影响服务功能。<br/><br/>**需要注意，数据面现网的PVC磁盘使用率都很高。**<br/><br/>单位`%`。 | 清理或扩容PV磁盘。 | `100*(kubelet_volume_stats_used_bytes{}/kubelet_volume_stats_capacity_bytes{})+on(khaos_product,khaos_cluster,persistentvolumeclaim,namespace) group_right(persistentvolumeclaim) 0*kube_pod_spec_volumes_persistentvolumeclaims_info{}` | `info: 80`<br/><br/>`warn: 90`<br/><br/>`crit: 95` |
| **Pod网络入流量过大**<br/><br/>[alert.pod.network.flow\_rate.in](http://alert.pod.network.flow_rate.in)<br/><br/>重要程序：一般 | 原理是`1`分钟内的平均流量。需要注意，`Pod`的网络流量大部分属于集群内部的内网流量。<br/><br/>单位`mb/s`。 |     | `rate(container_network_receive_bytes_total{image!="",interface=~"eth.+",namespace=~"argo\|khaos\|obs\|kube-system"}[1m])/1024/1024` | `info: 800`<br/><br/>`warn: 900`<br/><br/>`crit: 1000` |
| **Pod网络出流量过大**<br/><br/>`alert.pod.network.flow_rate.out`<br/><br/>重要程序：一般 | 原理是`1`分钟内的平均流量。需要注意，`Pod`的网络流量大部分属于集群内部的内网流量。<br/><br/>单位`mb/s`。 |     | `rate(container_network_transmit_bytes_total{image!="",interface=~"eth.+",namespace=~"argo\|khaos\|obs\|kube-system"}[1m])/1024/1024` | `info: 800`<br/><br/>`warn: 900`<br/><br/>`crit: 1000` |

## 服务纬度

### 云巢组件

#### vmagent

| **告警名称** | **告警描述** | **处理方式** | **表达式** | **阈值设置** |
| --- | --- | --- | --- | --- |
| `vmagent` **存在错误的集群ID配置**<br/><br/>`alert.service.khaos.vmagent.incorrect_khaos_cluster`<br/><br/>重要程序：一般 | 有部分集群的**集群ID**没有更新到`vmagent`配置中，可能是集群的`cluster_values.yaml`配置或者`CI`脚本存在问题。<br/><br/>当集群ID配置错误时，可能会影响上层的告警通知、大盘展示，影响问题的准确定位。<br/><br/>该问题通常与集群ID配置错误一起出现。 | 首先在`catalog`仓库中的`tencentcloud/arcod/deploys`目录检索关键字`khaos-cluster`看看哪个集群的配置文件有问题。<br/><br/>如果无法找到，那么使用`count(kube_pod_info{khaos_cluster="khaos-cluster"})by(namespace)`看看是哪个产品的实例，随后对该产品的所有集群遍历查找`ns`定位是否该集群。 | `count(kube_pod_info{khaos_cluster="khaos-cluster"})` | `info: 1` |
| `vmagent` **存在错误的产品标识配置**<br/><br/>`alert.service.khaos.vmagent.incorrect_khaos_product`<br/><br/>重要程序：一般 | 有部分集群的**产品标识**没有更新到`vmagent`配置中，可能是集群的`cluster_values.yaml`配置或者`CI`脚本存在问题。<br/><br/>当集群ID配置错误时，可能会影响上层的告警通知、大盘展示，影响问题的准确定位。<br/><br/>该问题通常与集群ID配置错误一起出现。 | 同上。 | `count(kube_pod_info{khaos_product=""})` | `info: 1` |
| `vmagent` **错误日志激增**<br/><br/>`alert.service.khaos.vmagent.log_errors`<br/><br/>重要程序：重要 | 错误日志一段时间内增加过多，可能会影响监控采集能力。<br/><br/>单位`条`。 | 需要去控制台查看`vmagent pod`的日志确定原因。 | `sum(increase(vm_log_messages_total{level!="info"}[10m])) by (khaos_product, khaos_cluster, app_name, namespace, pod)` | `info: 1000`<br/><br/>`warn: 3000`<br/><br/>`crit: 5000` |
| `vmagent` **本地缓存激增**<br/><br/>`alert.service.khaos.vmagent.local_cache`<br/><br/>重要程序：重要 | 当`vmagent`上报失败时，会按照远端地址缓存本地数据，如果本地缓存数据激增，表示远端写入失败过多。<br/><br/>单位`mb`。 | 需要去控制台查看`vmagent pod`的日志确定原因。判断是否地址配置错误，或者远端写入地址对应的服务异常。 | `sum(vmagent_remotewrite_pending_data_bytes{}) by (job, url)/1024/1024` | `info: 100`<br/><br/>`warn: 500`<br/><br/>`crit: 1000` |

### Kubernetes组件

#### etcd

| **告警名称** | **告警描述** | **表达式** | **阈值设置** |
| --- | --- | --- | --- |
| `etcd` **是否存在主节点**<br/><br/>`alert.service.kube.etcd.has_leader`<br/><br/>重要程序：重要 | 表示`etcd`是否可用。<br/><br/>**需要注意：TKE托管类型集群的** `etcd` **服务由于部署在其他独立的集群中，当前集群内的监控组件没有权限访问因此无法采集其指标。** | `etcd_server_has_leader{}` | `crit: ==0` |

#### apiserver

| **告警英文名** | **告警描述** | **表达式** | **阈值设置** |
| --- | --- | --- | --- |
| `apiserver` **服务端请求错误率**<br/><br/>`alert.service.kube.apiserver.server.error_rate`<br/><br/>重要程序：重要 | `5`分钟内`apiserver`处理的请求错误率较高。<br/><br/>单位`%`。 | `100*sum(rate(apiserver_request_total{code=~"(?:5..)"}[5m])) by (khaos_product,khaos_cluster,app_name,instance,group,version,resource) / sum(rate(apiserver_request_total{}[5m])) by (khaos_product,khaos_cluster,app_name,instance,group,version,resource)` | `info: 50`<br/><br/>`warn: 80`<br/><br/>`crit: 90` |
| **客户端向** `apiserver` **请求错误率**<br/><br/>`alert.service.kube.apiserver.client.error_rate`<br/><br/>重要程序：重要 | `5`分钟内客户端请求`apiserver`的错误率较高。`instance`为客户端，`host`为目标端，`job`用于识别是否`kubelet`访问。<br/><br/>  <br/><br/>单位`%`。 | `100*(sum(rate(rest_client_requests_total{code=~"(4\|5).."}[5m])) by (khaos_product,khaos_cluster,app_name,instance,host) / sum(rate(rest_client_requests_total[5m])) by (khaos_product,khaos_cluster,app_name,instance,host))` | `info: 50`<br/><br/>`warn: 80`<br/><br/>`crit: 90` |
| `apiserver` **服务端请求处理延迟**<br/><br/>`alert.service.kube.apiserver.latency`<br/><br/>重要程序：重要 | `5`分钟内`p99`的请求处理延迟较高。<br/><br/>单位`ms`。 | `1000*histogram_quantile(0.99, sum(rate(apiserver_request_duration_seconds_bucket{verb!~"(?:CONNECT\|WATCHLIST\|WATCH\|PROXY)"} [5m])) without (subresource))` | `info: 3000`<br/><br/>`warn: 5000`<br/><br/>`crit: 10000` |

## 参考资料

*   [https://github.com/samber/awesome-prometheus-alerts](https://github.com/samber/awesome-prometheus-alerts)
    
*   [https://sysdig.com/blog/monitor-kubernetes-api-server](https://sysdig.com/blog/monitor-kubernetes-api-server/)
    

  

