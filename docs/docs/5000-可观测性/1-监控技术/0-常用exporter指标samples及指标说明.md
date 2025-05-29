---
slug: "/observability/prometheus-exporter-metrics-samples"
title: "常用exporter指标samples及指标说明"
hide_title: true
keywords:
  ["Prometheus", "Exporter", "监控指标", "Metrics", "监控采集", "指标样例"]
description: "收集和整理常用 Prometheus Exporter 的监控指标样例，帮助用户快速了解和使用各类 Exporter 进行监控数据采集"
---

## 节点类指标

使用`node-exporter`实现。

组件源码仓库：https://github.com/prometheus/node_exporter

Sample文件：[nodes.txt](/attachments/nodes.txt)

| 名称 | 类型 | 描述 |
| ------ | ------ | ------ |
| `node_boot_time_seconds` | `gauge` | node_boot_time_seconds Unix time of last boot, including microseconds. |
| `node_cpu_seconds_total` | `counter` | node_cpu_seconds_total Seconds the CPUs spent in each mode. |
| `node_disk_read_bytes_total` | `counter` | node_disk_read_bytes_total The total number of bytes read successfully. |
| `node_disk_read_errors_total` | `counter` | node_disk_read_errors_total The total number of read errors. |
| `node_disk_read_retries_total` | `counter` | node_disk_read_retries_total The total number of read retries. |
| `node_disk_read_sectors_total` | `counter` | node_disk_read_sectors_total The total number of sectors read successfully. |
| `node_disk_read_time_seconds_total` | `counter` | node_disk_read_time_seconds_total The total number of seconds spent by all reads. |
| `node_disk_reads_completed_total` | `counter` | node_disk_reads_completed_total The total number of reads completed successfully. |
| `node_disk_write_errors_total` | `counter` | node_disk_write_errors_total The total number of write errors. |
| `node_disk_write_retries_total` | `counter` | node_disk_write_retries_total The total number of write retries. |
| `node_disk_write_time_seconds_total` | `counter` | node_disk_write_time_seconds_total This is the total number of seconds spent by all writes. |
| `node_disk_writes_completed_total` | `counter` | node_disk_writes_completed_total The total number of writes completed successfully. |
| `node_disk_written_bytes_total` | `counter` | node_disk_written_bytes_total The total number of bytes written successfully. |
| `node_disk_written_sectors_total` | `counter` | node_disk_written_sectors_total The total number of sectors written successfully. |
| `node_exporter_build_info` | `gauge` | node_exporter_build_info A metric with a constant '1' value labeled by version, revision, branch, goversion from which node_exporter was built, and the goos and goarch for the build. |
| `node_filesystem_avail_bytes` | `gauge` | node_filesystem_avail_bytes Filesystem space available to non-root users in bytes. |
| `node_filesystem_device_error` | `gauge` | node_filesystem_device_error Whether an error occurred while getting statistics for the given device. |
| `node_filesystem_files` | `gauge` | node_filesystem_files Filesystem total file nodes. |
| `node_filesystem_files_free` | `gauge` | node_filesystem_files_free Filesystem total free file nodes. |
| `node_filesystem_free_bytes` | `gauge` | node_filesystem_free_bytes Filesystem free space in bytes. |
| `node_filesystem_readonly` | `gauge` | node_filesystem_readonly Filesystem read-only status. |
| `node_filesystem_size_bytes` | `gauge` | node_filesystem_size_bytes Filesystem size in bytes. |
| `node_load1` | `gauge` | node_load1 1m load average. |
| `node_load15` | `gauge` | node_load15 15m load average. |
| `node_load5` | `gauge` | node_load5 5m load average. |
| `node_memory_active_bytes` | `gauge` | node_memory_active_bytes Memory information field active_bytes. |
| `node_memory_compressed_bytes` | `gauge` | node_memory_compressed_bytes Memory information field compressed_bytes. |
| `node_memory_free_bytes` | `gauge` | node_memory_free_bytes Memory information field free_bytes. |
| `node_memory_inactive_bytes` | `gauge` | node_memory_inactive_bytes Memory information field inactive_bytes. |
| `node_memory_internal_bytes` | `gauge` | node_memory_internal_bytes Memory information field internal_bytes. |
| `node_memory_purgeable_bytes` | `gauge` | node_memory_purgeable_bytes Memory information field purgeable_bytes. |
| `node_memory_swap_total_bytes` | `gauge` | node_memory_swap_total_bytes Memory information field swap_total_bytes. |
| `node_memory_swap_used_bytes` | `gauge` | node_memory_swap_used_bytes Memory information field swap_used_bytes. |
| `node_memory_swapped_in_bytes_total` | `counter` | node_memory_swapped_in_bytes_total Memory information field swapped_in_bytes_total. |
| `node_memory_swapped_out_bytes_total` | `counter` | node_memory_swapped_out_bytes_total Memory information field swapped_out_bytes_total. |
| `node_memory_total_bytes` | `gauge` | node_memory_total_bytes Memory information field total_bytes. |
| `node_memory_wired_bytes` | `gauge` | node_memory_wired_bytes Memory information field wired_bytes. |
| `node_network_noproto_total` | `counter` | node_network_noproto_total Network device statistic noproto. |
| `node_network_receive_bytes_total` | `counter` | node_network_receive_bytes_total Network device statistic receive_bytes. |
| `node_network_receive_drop_total` | `counter` | node_network_receive_drop_total Network device statistic receive_drop. |
| `node_network_receive_errs_total` | `counter` | node_network_receive_errs_total Network device statistic receive_errs. |
| `node_network_receive_multicast_total` | `counter` | node_network_receive_multicast_total Network device statistic receive_multicast. |
| `node_network_receive_packets_total` | `counter` | node_network_receive_packets_total Network device statistic receive_packets. |
| `node_network_transmit_bytes_total` | `counter` | node_network_transmit_bytes_total Network device statistic transmit_bytes. |
| `node_network_transmit_colls_total` | `counter` | node_network_transmit_colls_total Network device statistic transmit_colls. |
| `node_network_transmit_errs_total` | `counter` | node_network_transmit_errs_total Network device statistic transmit_errs. |
| `node_network_transmit_multicast_total` | `counter` | node_network_transmit_multicast_total Network device statistic transmit_multicast. |
| `node_network_transmit_packets_total` | `counter` | node_network_transmit_packets_total Network device statistic transmit_packets. |
| `node_power_supply_battery_health` | `gauge` | node_power_supply_battery_health IOKit Power Source information field battery_health for <power_supply>. |
| `node_power_supply_charged` | `gauge` | node_power_supply_charged IOKit Power Source information field charged for <power_supply>. |
| `node_power_supply_charging` | `gauge` | node_power_supply_charging IOKit Power Source information field charging for <power_supply>. |
| `node_power_supply_current_ampere` | `gauge` | node_power_supply_current_ampere IOKit Power Source information field current_ampere for <power_supply>. |
| `node_power_supply_current_capacity` | `gauge` | node_power_supply_current_capacity IOKit Power Source information field current_capacity for <power_supply>. |
| `node_power_supply_info` | `gauge` | node_power_supply_info IOKit Power Source information for <power_supply>. |
| `node_power_supply_max_capacity` | `gauge` | node_power_supply_max_capacity IOKit Power Source information field max_capacity for <power_supply>. |
| `node_power_supply_power_source_state` | `gauge` | node_power_supply_power_source_state IOKit Power Source information field power_source_state for <power_supply>. |
| `node_power_supply_present` | `gauge` | node_power_supply_present IOKit Power Source information field present for <power_supply>. |
| `node_power_supply_time_to_empty_seconds` | `gauge` | node_power_supply_time_to_empty_seconds IOKit Power Source information field time_to_empty_seconds for <power_supply>. |
| `node_power_supply_time_to_full_seconds` | `gauge` | node_power_supply_time_to_full_seconds IOKit Power Source information field time_to_full_seconds for <power_supply>. |
| `node_scrape_collector_duration_seconds` | `gauge` | node_scrape_collector_duration_seconds node_exporter: Duration of a collector scrape. |
| `node_scrape_collector_success` | `gauge` | node_scrape_collector_success node_exporter: Whether a collector succeeded. |
| `node_textfile_scrape_error` | `gauge` | node_textfile_scrape_error 1 if there was an error opening or reading a file, 0 otherwise |
| `node_thermal_cpu_available_cpu` | `gauge` | node_thermal_cpu_available_cpu Reflects how many, if any, CPUs have been taken offline. Represented as an integer number of CPUs (0 - Max CPUs). |
| `node_thermal_cpu_scheduler_limit_ratio` | `gauge` | node_thermal_cpu_scheduler_limit_ratio Represents the percentage (0-100) of CPU time available. 100% at normal operation. The OS may limit this time for a percentage less than 100%. |
| `node_thermal_cpu_speed_limit_ratio` | `gauge` | node_thermal_cpu_speed_limit_ratio Defines the speed & voltage limits placed on the CPU. Represented as a percentage (0-100) of maximum CPU speed. |
| `node_time_seconds` | `gauge` | node_time_seconds System time in seconds since epoch (1970). |
| `node_time_zone_offset_seconds` | `gauge` | node_time_zone_offset_seconds System time zone offset in seconds. |
| `node_uname_info` | `gauge` | node_uname_info Labeled system information as provided by the uname system call. |


## 容器类指标

使用`cadvisor`实现，在新版本`Kubernetes`中已经内置。

组件源码地址：https://github.com/kubernetes/kubernetes/tree/master/vendor/github.com/google/cadvisor

Sample文件：[cadvisor.txt](/attachments/cadvisor.txt)

| 名称 | 类型 | 描述 |
| ------ | ------ | ------ |
| `cadvisor_version_info` | `gauge` | cadvisor_version_info A metric with a constant '1' value labeled by kernel version, OS version, docker version, cadvisor version & cadvisor revision. |
| `container_blkio_device_usage_total` | `counter` | container_blkio_device_usage_total Blkio Device bytes usage |
| `container_cpu_cfs_periods_total` | `counter` | container_cpu_cfs_periods_total Number of elapsed enforcement period intervals. |
| `container_cpu_cfs_throttled_periods_total` | `counter` | container_cpu_cfs_throttled_periods_total Number of throttled period intervals. |
| `container_cpu_cfs_throttled_seconds_total` | `counter` | container_cpu_cfs_throttled_seconds_total Total time duration the container has been throttled. |
| `container_cpu_load_average_10s` | `gauge` | container_cpu_load_average_10s Value of container cpu load average over the last 10 seconds. |
| `container_cpu_system_seconds_total` | `counter` | container_cpu_system_seconds_total Cumulative system cpu time consumed in seconds. |
| `container_cpu_usage_seconds_total` | `counter` | container_cpu_usage_seconds_total Cumulative cpu time consumed in seconds. |
| `container_cpu_user_seconds_total` | `counter` | container_cpu_user_seconds_total Cumulative user cpu time consumed in seconds. |
| `container_file_descriptors` | `gauge` | container_file_descriptors Number of open file descriptors for the container. |
| `container_fs_inodes_free` | `gauge` | container_fs_inodes_free Number of available Inodes |
| `container_fs_inodes_total` | `gauge` | container_fs_inodes_total Number of Inodes |
| `container_fs_io_current` | `gauge` | container_fs_io_current Number of I/Os currently in progress |
| `container_fs_io_time_seconds_total` | `counter` | container_fs_io_time_seconds_total Cumulative count of seconds spent doing I/Os |
| `container_fs_io_time_weighted_seconds_total` | `counter` | container_fs_io_time_weighted_seconds_total Cumulative weighted I/O time in seconds |
| `container_fs_limit_bytes` | `gauge` | container_fs_limit_bytes Number of bytes that can be consumed by the container on this filesystem. |
| `container_fs_read_seconds_total` | `counter` | container_fs_read_seconds_total Cumulative count of seconds spent reading |
| `container_fs_reads_bytes_total` | `counter` | container_fs_reads_bytes_total Cumulative count of bytes read |
| `container_fs_reads_merged_total` | `counter` | container_fs_reads_merged_total Cumulative count of reads merged |
| `container_fs_reads_total` | `counter` | container_fs_reads_total Cumulative count of reads completed |
| `container_fs_sector_reads_total` | `counter` | container_fs_sector_reads_total Cumulative count of sector reads completed |
| `container_fs_sector_writes_total` | `counter` | container_fs_sector_writes_total Cumulative count of sector writes completed |
| `container_fs_usage_bytes` | `gauge` | container_fs_usage_bytes Number of bytes that are consumed by the container on this filesystem. |
| `container_fs_write_seconds_total` | `counter` | container_fs_write_seconds_total Cumulative count of seconds spent writing |
| `container_fs_writes_bytes_total` | `counter` | container_fs_writes_bytes_total Cumulative count of bytes written |
| `container_fs_writes_merged_total` | `counter` | container_fs_writes_merged_total Cumulative count of writes merged |
| `container_fs_writes_total` | `counter` | container_fs_writes_total Cumulative count of writes completed |
| `container_last_seen` | `gauge` | container_last_seen Last time a container was seen by the exporter |
| `container_memory_cache` | `gauge` | container_memory_cache Number of bytes of page cache memory. |
| `container_memory_failcnt` | `counter` | container_memory_failcnt Number of memory usage hits limits |
| `container_memory_failures_total` | `counter` | container_memory_failures_total Cumulative count of memory allocation failures. |
| `container_memory_mapped_file` | `gauge` | container_memory_mapped_file Size of memory mapped files in bytes. |
| `container_memory_max_usage_bytes` | `gauge` | container_memory_max_usage_bytes Maximum memory usage recorded in bytes |
| `container_memory_rss` | `gauge` | container_memory_rss Size of RSS in bytes. |
| `container_memory_swap` | `gauge` | container_memory_swap Container swap usage in bytes. |
| `container_memory_usage_bytes` | `gauge` | container_memory_usage_bytes Current memory usage in bytes, including all memory regardless of when it was accessed |
| `container_memory_working_set_bytes` | `gauge` | container_memory_working_set_bytes Current working set in bytes. |
| `container_network_receive_bytes_total` | `counter` | container_network_receive_bytes_total Cumulative count of bytes received |
| `container_network_receive_errors_total` | `counter` | container_network_receive_errors_total Cumulative count of errors encountered while receiving |
| `container_network_receive_packets_dropped_total` | `counter` | container_network_receive_packets_dropped_total Cumulative count of packets dropped while receiving |
| `container_network_receive_packets_total` | `counter` | container_network_receive_packets_total Cumulative count of packets received |
| `container_network_transmit_bytes_total` | `counter` | container_network_transmit_bytes_total Cumulative count of bytes transmitted |
| `container_network_transmit_errors_total` | `counter` | container_network_transmit_errors_total Cumulative count of errors encountered while transmitting |
| `container_network_transmit_packets_dropped_total` | `counter` | container_network_transmit_packets_dropped_total Cumulative count of packets dropped while transmitting |
| `container_network_transmit_packets_total` | `counter` | container_network_transmit_packets_total Cumulative count of packets transmitted |
| `container_processes` | `gauge` | container_processes Number of processes running inside the container. |
| `container_scrape_error` | `gauge` | container_scrape_error 1 if there was an error while getting container metrics, 0 otherwise |
| `container_sockets` | `gauge` | container_sockets Number of open sockets for the container. |
| `container_spec_cpu_period` | `gauge` | container_spec_cpu_period CPU period of the container. |
| `container_spec_cpu_quota` | `gauge` | container_spec_cpu_quota CPU quota of the container. |
| `container_spec_cpu_shares` | `gauge` | container_spec_cpu_shares CPU share of the container. |
| `container_spec_memory_limit_bytes` | `gauge` | container_spec_memory_limit_bytes Memory limit for the container. |
| `container_spec_memory_reservation_limit_bytes` | `gauge` | container_spec_memory_reservation_limit_bytes Memory reservation limit for the container. |
| `container_spec_memory_swap_limit_bytes` | `gauge` | container_spec_memory_swap_limit_bytes Memory swap limit for the container. |
| `container_start_time_seconds` | `gauge` | container_start_time_seconds Start time of the container since unix epoch in seconds. |
| `container_tasks_state` | `gauge` | container_tasks_state Number of tasks in given state |
| `container_threads` | `gauge` | container_threads Number of threads running inside the container |
| `container_threads_max` | `gauge` | container_threads_max Maximum number of threads allowed inside the container, infinity if value is zero |
| `container_ulimits_soft` | `gauge` | container_ulimits_soft Soft ulimit values for the container root process. Unlimited if -1, except priority and nice |
| `machine_cpu_cores` | `gauge` | machine_cpu_cores Number of logical CPU cores. |
| `machine_cpu_physical_cores` | `gauge` | machine_cpu_physical_cores Number of physical CPU cores. |
| `machine_cpu_sockets` | `gauge` | machine_cpu_sockets Number of CPU sockets. |
| `machine_memory_bytes` | `gauge` | machine_memory_bytes Amount of memory installed on the machine. |
| `machine_nvm_avg_power_budget_watts` | `gauge` | machine_nvm_avg_power_budget_watts NVM power budget. |
| `machine_nvm_capacity` | `gauge` | machine_nvm_capacity NVM capacity value labeled by NVM mode (memory mode or app direct mode). |
| `machine_scrape_error` | `gauge` | machine_scrape_error 1 if there was an error while getting machine metrics, 0 otherwise. |



## Kubernetes状态指标

使用`kube-state-metrics`实现，集群中各个资源的快照值，比较大。

组件源码仓库：https://github.com/kubernetes/kube-state-metrics

Sample文件：[kube-state.txt](/attachments/kube-state.txt)

| 名称 | 类型 | 描述 |
| ------ | ------ | ------ |
| `kube_node_annotations` | `gauge` | kube_node_annotations Kubernetes annotations converted to Prometheus labels. |
| `kube_node_created` | `gauge` | kube_node_created [STABLE] Unix creation timestamp |
| `kube_node_deletion_timestamp` | `gauge` | kube_node_deletion_timestamp Unix deletion timestamp |
| `kube_node_info` | `gauge` | kube_node_info [STABLE] Information about a cluster node. |
| `kube_node_labels` | `gauge` | kube_node_labels [STABLE] Kubernetes labels converted to Prometheus labels. |
| `kube_node_role` | `gauge` | kube_node_role The role of a cluster node. |
| `kube_node_spec_taint` | `gauge` | kube_node_spec_taint [STABLE] The taint of a cluster node. |
| `kube_node_spec_unschedulable` | `gauge` | kube_node_spec_unschedulable [STABLE] Whether a node can schedule new pods. |
| `kube_node_status_allocatable` | `gauge` | kube_node_status_allocatable [STABLE] The allocatable for different resources of a node that are available for scheduling. |
| `kube_node_status_capacity` | `gauge` | kube_node_status_capacity [STABLE] The capacity for different resources of a node. |
| `kube_node_status_condition` | `gauge` | kube_node_status_condition [STABLE] The condition of a cluster node. |
| `kube_persistentvolumeclaim_labels` | `gauge` | kube_persistentvolumeclaim_labels [STABLE] Kubernetes labels converted to Prometheus labels. |
| `kube_persistentvolumeclaim_annotations` | `gauge` | kube_persistentvolumeclaim_annotations Kubernetes annotations converted to Prometheus labels. |
| `kube_persistentvolumeclaim_info` | `gauge` | kube_persistentvolumeclaim_info [STABLE] Information about persistent volume claim. |
| `kube_persistentvolumeclaim_status_phase` | `gauge` | kube_persistentvolumeclaim_status_phase [STABLE] The phase the persistent volume claim is currently in. |
| `kube_persistentvolumeclaim_resource_requests_storage_bytes` | `gauge` | kube_persistentvolumeclaim_resource_requests_storage_bytes [STABLE] The capacity of storage requested by the persistent volume claim. |
| `kube_persistentvolumeclaim_access_mode` | `gauge` | kube_persistentvolumeclaim_access_mode [STABLE] The access mode(s) specified by the persistent volume claim. |
| `kube_persistentvolumeclaim_status_condition` | `gauge` | kube_persistentvolumeclaim_status_condition Information about status of different conditions of persistent volume claim. |
| `kube_persistentvolumeclaim_created` | `gauge` | kube_persistentvolumeclaim_created Unix creation timestamp |
| `kube_persistentvolumeclaim_deletion_timestamp` | `gauge` | kube_persistentvolumeclaim_deletion_timestamp Unix deletion timestamp |
| `kube_persistentvolume_claim_ref` | `gauge` | kube_persistentvolume_claim_ref [STABLE] Information about the Persistent Volume Claim Reference. |
| `kube_persistentvolume_annotations` | `gauge` | kube_persistentvolume_annotations Kubernetes annotations converted to Prometheus labels. |
| `kube_persistentvolume_labels` | `gauge` | kube_persistentvolume_labels [STABLE] Kubernetes labels converted to Prometheus labels. |
| `kube_persistentvolume_status_phase` | `gauge` | kube_persistentvolume_status_phase [STABLE] The phase indicates if a volume is available, bound to a claim, or released by a claim. |
| `kube_persistentvolume_info` | `gauge` | kube_persistentvolume_info [STABLE] Information about persistentvolume. |
| `kube_persistentvolume_capacity_bytes` | `gauge` | kube_persistentvolume_capacity_bytes [STABLE] Persistentvolume capacity in bytes. |
| `kube_persistentvolume_created` | `gauge` | kube_persistentvolume_created Unix creation timestamp |
| `kube_persistentvolume_deletion_timestamp` | `gauge` | kube_persistentvolume_deletion_timestamp Unix deletion timestamp |
| `kube_pod_completion_time` | `gauge` | kube_pod_completion_time [STABLE] Completion time in unix timestamp for a pod. |
| `kube_pod_container_info` | `gauge` | kube_pod_container_info [STABLE] Information about a container in a pod. |
| `kube_pod_container_resource_limits` | `gauge` | kube_pod_container_resource_limits The number of requested limit resource by a container. It is recommended to use the kube_pod_resource_limits metric exposed by kube-scheduler instead, as it is more precise. |
| `kube_pod_container_resource_requests` | `gauge` | kube_pod_container_resource_requests The number of requested request resource by a container. It is recommended to use the kube_pod_resource_requests metric exposed by kube-scheduler instead, as it is more precise. |
| `kube_pod_container_state_started` | `gauge` | kube_pod_container_state_started [STABLE] Start time in unix timestamp for a pod container. |
| `kube_pod_container_status_last_terminated_reason` | `gauge` | kube_pod_container_status_last_terminated_reason Describes the last reason the container was in terminated state. |
| `kube_pod_container_status_last_terminated_exitcode` | `gauge` | kube_pod_container_status_last_terminated_exitcode Describes the exit code for the last container in terminated state. |
| `kube_pod_container_status_ready` | `gauge` | kube_pod_container_status_ready [STABLE] Describes whether the containers readiness check succeeded. |
| `kube_pod_container_status_restarts_total` | `counter` | kube_pod_container_status_restarts_total [STABLE] The number of container restarts per container. |
| `kube_pod_container_status_running` | `gauge` | kube_pod_container_status_running [STABLE] Describes whether the container is currently in running state. |
| `kube_pod_container_status_terminated` | `gauge` | kube_pod_container_status_terminated [STABLE] Describes whether the container is currently in terminated state. |
| `kube_pod_container_status_terminated_reason` | `gauge` | kube_pod_container_status_terminated_reason Describes the reason the container is currently in terminated state. |
| `kube_pod_container_status_waiting` | `gauge` | kube_pod_container_status_waiting [STABLE] Describes whether the container is currently in waiting state. |
| `kube_pod_container_status_waiting_reason` | `gauge` | kube_pod_container_status_waiting_reason [STABLE] Describes the reason the container is currently in waiting state. |
| `kube_pod_created` | `gauge` | kube_pod_created [STABLE] Unix creation timestamp |
| `kube_pod_deletion_timestamp` | `gauge` | kube_pod_deletion_timestamp Unix deletion timestamp |
| `kube_pod_info` | `gauge` | kube_pod_info [STABLE] Information about pod. |
| `kube_pod_ips` | `gauge` | kube_pod_ips Pod IP addresses |
| `kube_pod_init_container_info` | `gauge` | kube_pod_init_container_info [STABLE] Information about an init container in a pod. |
| `kube_pod_init_container_resource_limits` | `gauge` | kube_pod_init_container_resource_limits The number of requested limit resource by an init container. |
| `kube_pod_init_container_resource_requests` | `gauge` | kube_pod_init_container_resource_requests The number of requested request resource by an init container. |
| `kube_pod_init_container_status_last_terminated_reason` | `gauge` | kube_pod_init_container_status_last_terminated_reason Describes the last reason the init container was in terminated state. |
| `kube_pod_init_container_status_ready` | `gauge` | kube_pod_init_container_status_ready [STABLE] Describes whether the init containers readiness check succeeded. |
| `kube_pod_init_container_status_restarts_total` | `counter` | kube_pod_init_container_status_restarts_total [STABLE] The number of restarts for the init container. |
| `kube_pod_init_container_status_running` | `gauge` | kube_pod_init_container_status_running [STABLE] Describes whether the init container is currently in running state. |
| `kube_pod_init_container_status_terminated` | `gauge` | kube_pod_init_container_status_terminated [STABLE] Describes whether the init container is currently in terminated state. |
| `kube_pod_init_container_status_terminated_reason` | `gauge` | kube_pod_init_container_status_terminated_reason Describes the reason the init container is currently in terminated state. |
| `kube_pod_init_container_status_waiting` | `gauge` | kube_pod_init_container_status_waiting [STABLE] Describes whether the init container is currently in waiting state. |
| `kube_pod_init_container_status_waiting_reason` | `gauge` | kube_pod_init_container_status_waiting_reason Describes the reason the init container is currently in waiting state. |
| `kube_pod_annotations` | `gauge` | kube_pod_annotations Kubernetes annotations converted to Prometheus labels. |
| `kube_pod_labels` | `gauge` | kube_pod_labels [STABLE] Kubernetes labels converted to Prometheus labels. |
| `kube_pod_overhead_cpu_cores` | `gauge` | kube_pod_overhead_cpu_cores The pod overhead in regards to cpu cores associated with running a pod. |
| `kube_pod_overhead_memory_bytes` | `gauge` | kube_pod_overhead_memory_bytes The pod overhead in regards to memory associated with running a pod. |
| `kube_pod_owner` | `gauge` | kube_pod_owner [STABLE] Information about the Pod's owner. |
| `kube_pod_restart_policy` | `gauge` | kube_pod_restart_policy [STABLE] Describes the restart policy in use by this pod. |
| `kube_pod_runtimeclass_name_info` | `gauge` | kube_pod_runtimeclass_name_info The runtimeclass associated with the pod. |
| `kube_pod_spec_volumes_persistentvolumeclaims_info` | `gauge` | kube_pod_spec_volumes_persistentvolumeclaims_info [STABLE] Information about persistentvolumeclaim volumes in a pod. |
| `kube_pod_spec_volumes_persistentvolumeclaims_readonly` | `gauge` | kube_pod_spec_volumes_persistentvolumeclaims_readonly [STABLE] Describes whether a persistentvolumeclaim is mounted read only. |
| `kube_pod_start_time` | `gauge` | kube_pod_start_time [STABLE] Start time in unix timestamp for a pod. |
| `kube_pod_status_phase` | `gauge` | kube_pod_status_phase [STABLE] The pods current phase. |
| `kube_pod_status_qos_class` | `gauge` | kube_pod_status_qos_class The pods current qosClass. |
| `kube_pod_status_ready` | `gauge` | kube_pod_status_ready [STABLE] Describes whether the pod is ready to serve requests. |
| `kube_pod_status_ready_time` | `gauge` | kube_pod_status_ready_time Readiness achieved time in unix timestamp for a pod. |
| `kube_pod_status_initialized_time` | `gauge` | kube_pod_status_initialized_time Initialized time in unix timestamp for a pod. |
| `kube_pod_status_container_ready_time` | `gauge` | kube_pod_status_container_ready_time Readiness achieved time in unix timestamp for a pod containers. |
| `kube_pod_status_reason` | `gauge` | kube_pod_status_reason The pod status reasons |
| `kube_pod_status_scheduled` | `gauge` | kube_pod_status_scheduled [STABLE] Describes the status of the scheduling process for the pod. |
| `kube_pod_status_scheduled_time` | `gauge` | kube_pod_status_scheduled_time [STABLE] Unix timestamp when pod moved into scheduled status |
| `kube_pod_status_unschedulable` | `gauge` | kube_pod_status_unschedulable [STABLE] Describes the unschedulable status for the pod. |
| `kube_pod_tolerations` | `gauge` | kube_pod_tolerations Information about the pod tolerations |
| `kube_pod_service_account` | `gauge` | kube_pod_service_account The service account for a pod. |



## Kubernetes内部指标

集群的内部指标，大部分场景下没什么用，常用于管控类指标监控。

组件源码地址：https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/apiserver

Sample文件：[kube-internal.txt](/attachments/kube-internal.txt)

| 名称 | 类型 | 描述 |
| ------ | ------ | ------ |
| `apiserver_audit_event_total` | `counter` | apiserver_audit_event_total [ALPHA] Counter of audit events generated and sent to the audit backend. |
| `apiserver_audit_requests_rejected_total` | `counter` | apiserver_audit_requests_rejected_total [ALPHA] Counter of apiserver requests rejected due to an error in audit logging backend. |
| `apiserver_client_certificate_expiration_seconds` | `histogram` | apiserver_client_certificate_expiration_seconds [ALPHA] Distribution of the remaining lifetime on the certificate used to authenticate a request. |
| `apiserver_delegated_authn_request_duration_seconds` | `histogram` | apiserver_delegated_authn_request_duration_seconds [ALPHA] Request latency in seconds. Broken down by status code. |
| `apiserver_delegated_authn_request_total` | `counter` | apiserver_delegated_authn_request_total [ALPHA] Number of HTTP requests partitioned by status code. |
| `apiserver_delegated_authz_request_duration_seconds` | `histogram` | apiserver_delegated_authz_request_duration_seconds [ALPHA] Request latency in seconds. Broken down by status code. |
| `apiserver_delegated_authz_request_total` | `counter` | apiserver_delegated_authz_request_total [ALPHA] Number of HTTP requests partitioned by status code. |
| `apiserver_envelope_encryption_dek_cache_fill_percent` | `gauge` | apiserver_envelope_encryption_dek_cache_fill_percent [ALPHA] Percent of the cache slots currently occupied by cached DEKs. |
| `apiserver_storage_data_key_generation_duration_seconds` | `histogram` | apiserver_storage_data_key_generation_duration_seconds [ALPHA] Latencies in seconds of data encryption key(DEK) generation operations. |
| `apiserver_storage_data_key_generation_failures_total` | `counter` | apiserver_storage_data_key_generation_failures_total [ALPHA] Total number of failed data encryption key(DEK) generation operations. |
| `apiserver_storage_envelope_transformation_cache_misses_total` | `counter` | apiserver_storage_envelope_transformation_cache_misses_total [ALPHA] Total number of cache misses while accessing key decryption key(KEK). |
| `apiserver_webhooks_x509_missing_san_total` | `counter` | apiserver_webhooks_x509_missing_san_total [ALPHA] Counts the number of requests to servers missing SAN extension in their serving certificate OR the number of connection failures due to the lack of x509 certificate SAN extension missing (either/or, based on the runtime environment) |
| `authentication_token_cache_active_fetch_count` | `gauge` | authentication_token_cache_active_fetch_count [ALPHA] |
| `authentication_token_cache_fetch_total` | `counter` | authentication_token_cache_fetch_total [ALPHA] |
| `authentication_token_cache_request_duration_seconds` | `histogram` | authentication_token_cache_request_duration_seconds [ALPHA] |
| `authentication_token_cache_request_total` | `counter` | authentication_token_cache_request_total [ALPHA] |
| `csi_operations_seconds` | `histogram` | csi_operations_seconds [ALPHA] Container Storage Interface operation duration with gRPC error code status total |
| `get_token_count` | `counter` | get_token_count [ALPHA] Counter of total Token() requests to the alternate token source |
| `get_token_fail_count` | `counter` | get_token_fail_count [ALPHA] Counter of failed Token() requests to the alternate token source |
| `go_gc_duration_seconds` | `summary` | go_gc_duration_seconds A summary of the pause duration of garbage collection cycles. |
| `go_goroutines` | `gauge` | go_goroutines Number of goroutines that currently exist. |
| `go_info` | `gauge` | go_info Information about the Go environment. |
| `go_memstats_alloc_bytes` | `gauge` | go_memstats_alloc_bytes Number of bytes allocated and still in use. |
| `go_memstats_alloc_bytes_total` | `counter` | go_memstats_alloc_bytes_total Total number of bytes allocated, even if freed. |
| `go_memstats_buck_hash_sys_bytes` | `gauge` | go_memstats_buck_hash_sys_bytes Number of bytes used by the profiling bucket hash table. |
| `go_memstats_frees_total` | `counter` | go_memstats_frees_total Total number of frees. |
| `go_memstats_gc_cpu_fraction` | `gauge` | go_memstats_gc_cpu_fraction The fraction of this program's available CPU time used by the GC since the program started. |
| `go_memstats_gc_sys_bytes` | `gauge` | go_memstats_gc_sys_bytes Number of bytes used for garbage collection system metadata. |
| `go_memstats_heap_alloc_bytes` | `gauge` | go_memstats_heap_alloc_bytes Number of heap bytes allocated and still in use. |
| `go_memstats_heap_idle_bytes` | `gauge` | go_memstats_heap_idle_bytes Number of heap bytes waiting to be used. |
| `go_memstats_heap_inuse_bytes` | `gauge` | go_memstats_heap_inuse_bytes Number of heap bytes that are in use. |
| `go_memstats_heap_objects` | `gauge` | go_memstats_heap_objects Number of allocated objects. |
| `go_memstats_heap_released_bytes` | `gauge` | go_memstats_heap_released_bytes Number of heap bytes released to OS. |
| `go_memstats_heap_sys_bytes` | `gauge` | go_memstats_heap_sys_bytes Number of heap bytes obtained from system. |
| `go_memstats_last_gc_time_seconds` | `gauge` | go_memstats_last_gc_time_seconds Number of seconds since 1970 of last garbage collection. |
| `go_memstats_lookups_total` | `counter` | go_memstats_lookups_total Total number of pointer lookups. |
| `go_memstats_mallocs_total` | `counter` | go_memstats_mallocs_total Total number of mallocs. |
| `go_memstats_mcache_inuse_bytes` | `gauge` | go_memstats_mcache_inuse_bytes Number of bytes in use by mcache structures. |
| `go_memstats_mcache_sys_bytes` | `gauge` | go_memstats_mcache_sys_bytes Number of bytes used for mcache structures obtained from system. |
| `go_memstats_mspan_inuse_bytes` | `gauge` | go_memstats_mspan_inuse_bytes Number of bytes in use by mspan structures. |
| `go_memstats_mspan_sys_bytes` | `gauge` | go_memstats_mspan_sys_bytes Number of bytes used for mspan structures obtained from system. |
| `go_memstats_next_gc_bytes` | `gauge` | go_memstats_next_gc_bytes Number of heap bytes when next garbage collection will take place. |
| `go_memstats_other_sys_bytes` | `gauge` | go_memstats_other_sys_bytes Number of bytes used for other system allocations. |
| `go_memstats_stack_inuse_bytes` | `gauge` | go_memstats_stack_inuse_bytes Number of bytes in use by the stack allocator. |
| `go_memstats_stack_sys_bytes` | `gauge` | go_memstats_stack_sys_bytes Number of bytes obtained from system for stack allocator. |
| `go_memstats_sys_bytes` | `gauge` | go_memstats_sys_bytes Number of bytes obtained from system. |
| `go_threads` | `gauge` | go_threads Number of OS threads created. |
| `kubelet_cgroup_manager_duration_seconds` | `histogram` | kubelet_cgroup_manager_duration_seconds [ALPHA] Duration in seconds for cgroup manager operations. Broken down by method. |
| `kubelet_container_log_filesystem_used_bytes` | `gauge` | kubelet_container_log_filesystem_used_bytes [ALPHA] Bytes used by the container's logs on the filesystem. |
| `kubelet_containers_per_pod_count` | `histogram` | kubelet_containers_per_pod_count [ALPHA] The number of containers per pod. |
| `kubelet_device_plugin_alloc_duration_seconds` | `histogram` | kubelet_device_plugin_alloc_duration_seconds [ALPHA] Duration in seconds to serve a device plugin Allocation request. Broken down by resource name. |
| `kubelet_device_plugin_registration_total` | `counter` | kubelet_device_plugin_registration_total [ALPHA] Cumulative number of device plugin registrations. Broken down by resource name. |
| `kubelet_docker_operations_duration_seconds` | `histogram` | kubelet_docker_operations_duration_seconds [ALPHA] Latency in seconds of Docker operations. Broken down by operation type. |
| `kubelet_docker_operations_errors_total` | `counter` | kubelet_docker_operations_errors_total [ALPHA] Cumulative number of Docker operation errors by operation type. |
| `kubelet_docker_operations_timeout_total` | `counter` | kubelet_docker_operations_timeout_total [ALPHA] Cumulative number of Docker operation timeout by operation type. |
| `kubelet_docker_operations_total` | `counter` | kubelet_docker_operations_total [ALPHA] Cumulative number of Docker operations by operation type. |
| `kubelet_http_inflight_requests` | `gauge` | kubelet_http_inflight_requests [ALPHA] Number of the inflight http requests |
| `kubelet_http_requests_duration_seconds` | `histogram` | kubelet_http_requests_duration_seconds [ALPHA] Duration in seconds to serve http requests |
| `kubelet_http_requests_total` | `counter` | kubelet_http_requests_total [ALPHA] Number of the http requests received since the server started |
| `kubelet_managed_ephemeral_containers` | `gauge` | kubelet_managed_ephemeral_containers [ALPHA] Current number of ephemeral containers in pods managed by this kubelet. Ephemeral containers will be ignored if disabled by the EphemeralContainers feature gate, and this number will be 0. |
| `kubelet_network_plugin_operations_duration_seconds` | `histogram` | kubelet_network_plugin_operations_duration_seconds [ALPHA] Latency in seconds of network plugin operations. Broken down by operation type. |
| `kubelet_network_plugin_operations_errors_total` | `counter` | kubelet_network_plugin_operations_errors_total [ALPHA] Cumulative number of network plugin operation errors by operation type. |
| `kubelet_network_plugin_operations_total` | `counter` | kubelet_network_plugin_operations_total [ALPHA] Cumulative number of network plugin operations by operation type. |
| `kubelet_node_name` | `gauge` | kubelet_node_name [ALPHA] The node's name. The count is always 1. |
| `kubelet_pleg_discard_events` | `counter` | kubelet_pleg_discard_events [ALPHA] The number of discard events in PLEG. |
| `kubelet_pleg_last_seen_seconds` | `gauge` | kubelet_pleg_last_seen_seconds [ALPHA] Timestamp in seconds when PLEG was last seen active. |
| `kubelet_pleg_relist_duration_seconds` | `histogram` | kubelet_pleg_relist_duration_seconds [ALPHA] Duration in seconds for relisting pods in PLEG. |
| `kubelet_pleg_relist_interval_seconds` | `histogram` | kubelet_pleg_relist_interval_seconds [ALPHA] Interval in seconds between relisting in PLEG. |
| `kubelet_pod_start_duration_seconds` | `histogram` | kubelet_pod_start_duration_seconds [ALPHA] Duration in seconds for a single pod to go from pending to running. |
| `kubelet_pod_worker_duration_seconds` | `histogram` | kubelet_pod_worker_duration_seconds [ALPHA] Duration in seconds to sync a single pod. Broken down by operation type: create, update, or sync |
| `kubelet_pod_worker_start_duration_seconds` | `histogram` | kubelet_pod_worker_start_duration_seconds [ALPHA] Duration in seconds from seeing a pod to starting a worker. |
| `kubelet_run_podsandbox_duration_seconds` | `histogram` | kubelet_run_podsandbox_duration_seconds [ALPHA] Duration in seconds of the run_podsandbox operations. Broken down by RuntimeClass.Handler. |
| `kubelet_run_podsandbox_errors_total` | `counter` | kubelet_run_podsandbox_errors_total [ALPHA] Cumulative number of the run_podsandbox operation errors by RuntimeClass.Handler. |
| `kubelet_running_containers` | `gauge` | kubelet_running_containers [ALPHA] Number of containers currently running |
| `kubelet_running_pods` | `gauge` | kubelet_running_pods [ALPHA] Number of pods that have a running pod sandbox |
| `kubelet_runtime_operations_duration_seconds` | `histogram` | kubelet_runtime_operations_duration_seconds [ALPHA] Duration in seconds of runtime operations. Broken down by operation type. |
| `kubelet_runtime_operations_errors_total` | `counter` | kubelet_runtime_operations_errors_total [ALPHA] Cumulative number of runtime operation errors by operation type. |
| `kubelet_runtime_operations_total` | `counter` | kubelet_runtime_operations_total [ALPHA] Cumulative number of runtime operations by operation type. |
| `kubelet_started_containers_errors_total` | `counter` | kubelet_started_containers_errors_total [ALPHA] Cumulative number of errors when starting containers |
| `kubelet_started_containers_total` | `counter` | kubelet_started_containers_total [ALPHA] Cumulative number of containers started |
| `kubelet_started_pods_errors_total` | `counter` | kubelet_started_pods_errors_total [ALPHA] Cumulative number of errors when starting pods |
| `kubelet_started_pods_total` | `counter` | kubelet_started_pods_total [ALPHA] Cumulative number of pods started |
| `kubelet_volume_stats_available_bytes` | `gauge` | kubelet_volume_stats_available_bytes [ALPHA] Number of available bytes in the volume |
| `kubelet_volume_stats_capacity_bytes` | `gauge` | kubelet_volume_stats_capacity_bytes [ALPHA] Capacity in bytes of the volume |
| `kubelet_volume_stats_inodes` | `gauge` | kubelet_volume_stats_inodes [ALPHA] Maximum number of inodes in the volume |
| `kubelet_volume_stats_inodes_free` | `gauge` | kubelet_volume_stats_inodes_free [ALPHA] Number of free inodes in the volume |
| `kubelet_volume_stats_inodes_used` | `gauge` | kubelet_volume_stats_inodes_used [ALPHA] Number of used inodes in the volume |
| `kubelet_volume_stats_used_bytes` | `gauge` | kubelet_volume_stats_used_bytes [ALPHA] Number of used bytes in the volume |
| `kubernetes_build_info` | `gauge` | kubernetes_build_info [ALPHA] A metric with a constant '1' value labeled by major, minor, git version, git commit, git tree state, build date, Go version, and compiler from which Kubernetes was built, and platform on which it is running. |
| `plugin_manager_total_plugins` | `gauge` | plugin_manager_total_plugins [ALPHA] Number of plugins in Plugin Manager |
| `process_cpu_seconds_total` | `counter` | process_cpu_seconds_total Total user and system CPU time spent in seconds. |
| `process_max_fds` | `gauge` | process_max_fds Maximum number of open file descriptors. |
| `process_open_fds` | `gauge` | process_open_fds Number of open file descriptors. |
| `process_resident_memory_bytes` | `gauge` | process_resident_memory_bytes Resident memory size in bytes. |
| `process_start_time_seconds` | `gauge` | process_start_time_seconds Start time of the process since unix epoch in seconds. |
| `process_virtual_memory_bytes` | `gauge` | process_virtual_memory_bytes Virtual memory size in bytes. |
| `process_virtual_memory_max_bytes` | `gauge` | process_virtual_memory_max_bytes Maximum amount of virtual memory available in bytes. |
| `rest_client_exec_plugin_certificate_rotation_age` | `histogram` | rest_client_exec_plugin_certificate_rotation_age [ALPHA] Histogram of the number of seconds the last auth exec plugin client certificate lived before being rotated. If auth exec plugin client certificates are unused, histogram will contain no data. |
| `rest_client_exec_plugin_ttl_seconds` | `gauge` | rest_client_exec_plugin_ttl_seconds [ALPHA] Gauge of the shortest TTL (time-to-live) of the client certificate(s) managed by the auth exec plugin. The value is in seconds until certificate expiry (negative if already expired). If auth exec plugins are unused or manage no TLS certificates, the value will be +INF. |
| `rest_client_rate_limiter_duration_seconds` | `histogram` | rest_client_rate_limiter_duration_seconds [ALPHA] Client side rate limiter latency in seconds. Broken down by verb and URL. |
| `rest_client_request_duration_seconds` | `histogram` | rest_client_request_duration_seconds [ALPHA] Request latency in seconds. Broken down by verb and URL. |
| `rest_client_requests_total` | `counter` | rest_client_requests_total [ALPHA] Number of HTTP requests, partitioned by status code, method, and host. |
| `storage_operation_duration_seconds` | `histogram` | storage_operation_duration_seconds [ALPHA] Storage operation duration |
| `storage_operation_errors_total` | `counter` | storage_operation_errors_total [ALPHA] Storage operation errors (Deprecated since 1.21.0) |
| `storage_operation_status_count` | `counter` | storage_operation_status_count [ALPHA] Storage operation return statuses count (Deprecated since 1.21.0) |
| `volume_manager_total_volumes` | `gauge` | volume_manager_total_volumes [ALPHA] Number of volumes in Volume Manager |
| `workqueue_adds_total` | `counter` | workqueue_adds_total [ALPHA] Total number of adds handled by workqueue |
| `workqueue_depth` | `gauge` | workqueue_depth [ALPHA] Current depth of workqueue |
| `workqueue_longest_running_processor_seconds` | `gauge` | workqueue_longest_running_processor_seconds [ALPHA] How many seconds has the longest running processor for workqueue been running. |
| `workqueue_queue_duration_seconds` | `histogram` | workqueue_queue_duration_seconds [ALPHA] How long in seconds an item stays in workqueue before being requested. |
| `workqueue_retries_total` | `counter` | workqueue_retries_total [ALPHA] Total number of retries handled by workqueue |
| `workqueue_unfinished_work_seconds` | `gauge` | workqueue_unfinished_work_seconds [ALPHA] How many seconds of work has done that is in progress and hasn't been observed by work_duration. Large values indicate stuck threads. One can deduce the number of stuck threads by observing the rate at which this increases. |
| `workqueue_work_duration_seconds` | `histogram` | workqueue_work_duration_seconds [ALPHA] How long in seconds processing an item from workqueue takes. |



