---
slug: "/ai/vgpu-hami-cuda-driver-api"
title: "HAMi CUDA Driver API"
hide_title: true
keywords: [HAMi Core, CUDA Driver API, API劫持, LD_PRELOAD, 显存配额, 算力限制, GPU虚拟化, CUDA拦截, vGPU实现原理]
description: "深入解析HAMi Core通过LD_PRELOAD机制劫持的198个CUDA Driver API，涵盖设备管理、显存分配、内核启动、CUDA Graph等15个分类。详细说明20个核心劫持API如何实现显存配额检查和算力限制控制，以及178个透传API的作用。"
---


`HAMi Core`通过`LD_PRELOAD`机制劫持`CUDA Driver API`调用，实现显存隔离和算力限制。以下是完整的劫持`API`列表：

## 初始化与设备管理 (18个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuInit` | 初始化`CUDA`驱动 | 初始化`HAMi`运行环境 |
| `cuDeviceGet` | 获取设备句柄 | 设备虚拟化映射 |
| `cuDeviceGetCount` | 获取设备数量 | 返回虚拟设备数量 |
| `cuDeviceGetName` | 获取设备名称 | 透传设备信息 |
| `cuDeviceGetAttribute` | 获取设备属性 | 修改显存等属性 |
| `cuDeviceCanAccessPeer` | 检查`P2P`访问能力 | 透传 |
| `cuDeviceGetP2PAttribute` | 获取`P2P`属性 | 透传 |
| `cuDeviceGetByPCIBusId` | 通过`PCI Bus ID`获取设备 | 设备映射 |
| `cuDeviceGetPCIBusId` | 获取`PCI Bus ID` | 透传 |
| `cuDeviceGetUuid` | 获取设备`UUID` | 透传 |
| `cuDeviceGetDefaultMemPool` | 获取默认内存池 | 透传 |
| `cuDeviceGetLuid` | 获取设备`LUID` | 透传 |
| `cuDeviceGetMemPool` | 获取内存池 | 透传 |
| `cuDeviceTotalMem_v2` | 获取总显存 | **返回配额限制的显存** |
| `cuDriverGetVersion` | 获取驱动版本 | 透传 |
| `cuDeviceGetTexture1DLinearMaxWidth` | 获取纹理最大宽度 | 透传 |
| `cuDeviceSetMemPool` | 设置内存池 | 透传 |
| `cuFlushGPUDirectRDMAWrites` | 刷新`RDMA`写入 | 透传 |

## 上下文管理 (23个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuDevicePrimaryCtxGetState` | 获取主上下文状态 | 透传 |
| `cuDevicePrimaryCtxRetain` | 保持主上下文 | 透传 |
| `cuDevicePrimaryCtxSetFlags_v2` | 设置主上下文标志 | 透传 |
| `cuDevicePrimaryCtxRelease_v2` | 释放主上下文 | 透传 |
| `cuCtxGetDevice` | 获取当前上下文设备 | 返回虚拟设备 |
| `cuCtxCreate_v2` | 创建上下文 | 透传 |
| `cuCtxCreate_v3` | 创建上下文(`v3`) | 透传 |
| `cuCtxDestroy_v2` | 销毁上下文 | 透传 |
| `cuCtxGetApiVersion` | 获取`API`版本 | 透传 |
| `cuCtxGetCacheConfig` | 获取缓存配置 | 透传 |
| `cuCtxGetCurrent` | 获取当前上下文 | 透传 |
| `cuCtxGetFlags` | 获取上下文标志 | 透传 |
| `cuCtxGetLimit` | 获取上下文限制 | 透传 |
| `cuCtxGetSharedMemConfig` | 获取共享内存配置 | 透传 |
| `cuCtxGetStreamPriorityRange` | 获取流优先级范围 | 透传 |
| `cuCtxPopCurrent_v2` | 弹出当前上下文 | 透传 |
| `cuCtxPushCurrent_v2` | 压入当前上下文 | 透传 |
| `cuCtxSetCacheConfig` | 设置缓存配置 | 透传 |
| `cuCtxSetCurrent` | 设置当前上下文 | 透传 |
| `cuCtxSetLimit` | 设置上下文限制 | 透传 |
| `cuCtxSetSharedMemConfig` | 设置共享内存配置 | 透传 |
| `cuCtxSynchronize` | 同步上下文 | 透传 |
| `cuGetExportTable` | 获取导出表 | 透传 |

## 流管理 (3个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuStreamCreate` | 创建流 | 透传 |
| `cuStreamDestroy_v2` | 销毁流 | 透传 |
| `cuStreamSynchronize` | 同步流 | 透传 |

## 显存分配与释放 (18个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuMemAlloc_v2` | 分配显存 | **检查配额并记录分配** |
| `cuMemAllocHost_v2` | 分配主机固定内存 | **检查配额** |
| `cuMemAllocManaged` | 分配统一内存 | **检查配额并记录** |
| `cuMemAllocPitch_v2` | 分配对齐显存 | **检查配额并记录** |
| `cuMemFree_v2` | 释放显存 | **更新使用记录** |
| `cuMemFreeHost` | 释放主机内存 | 透传 |
| `cuMemHostAlloc` | 分配主机内存 | **检查配额** |
| `cuMemHostRegister_v2` | 注册主机内存 | **检查配额** |
| `cuMemHostUnregister` | 注销主机内存 | 透传 |
| `cuArray3DCreate_v2` | 创建3D数组 | **计算并检查显存** |
| `cuArrayCreate_v2` | 创建数组 | **计算并检查显存** |
| `cuArrayDestroy` | 销毁数组 | **更新使用记录** |
| `cuMipmappedArrayCreate` | 创建多级纹理数组 | **检查配额** |
| `cuMipmappedArrayDestroy` | 销毁多级纹理数组 | 透传 |
| `cuMemGetInfo_v2` | 获取显存信息 | **返回虚拟显存信息** |
| `cuMemGetAddressRange_v2` | 获取地址范围 | 透传 |
| `cuMemAllocAsync` | 异步分配显存 | **检查配额并记录** |
| `cuMemFreeAsync` | 异步释放显存 | **更新使用记录** |

## 显存拷贝 (20个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuMemcpy` | 显存拷贝 | 透传 |
| `cuMemcpyAsync` | 异步显存拷贝 | 透传 |
| `cuMemcpyDtoH_v2` | 设备到主机拷贝 | 透传 |
| `cuMemcpyHtoD_v2` | 主机到设备拷贝 | 透传 |
| `cuMemcpyDtoD_v2` | 设备到设备拷贝 | 透传 |
| `cuMemcpyDtoHAsync_v2` | 异步设备到主机 | 透传 |
| `cuMemcpyHtoDAsync_v2` | 异步主机到设备 | 透传 |
| `cuMemcpyDtoDAsync_v2` | 异步设备到设备 | 透传 |
| `cuMemcpyAtoD_v2` | 数组到设备拷贝 | 透传 |
| `cuMemcpyDtoA_v2` | 设备到数组拷贝 | 透传 |
| `cuMemcpyPeer` | 跨设备拷贝 | 透传 |
| `cuMemcpyPeerAsync` | 异步跨设备拷贝 | 透传 |
| `cuMemcpy2D_v2` | 2D拷贝 | 透传 |
| `cuMemcpy2DUnaligned_v2` | 2D非对齐拷贝 | 透传 |
| `cuMemcpy2DAsync_v2` | 异步2D拷贝 | 透传 |
| `cuMemcpy3D_v2` | 3D拷贝 | 透传 |
| `cuMemcpy3DAsync_v2` | 异步3D拷贝 | 透传 |
| `cuMemcpy3DPeer` | 跨设备3D拷贝 | 透传 |
| `cuMemcpy3DPeerAsync` | 异步跨设备3D拷贝 | 透传 |
| `cuMemPrefetchAsync` | 异步预取内存 | 透传 |

## 显存设置 (12个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuMemsetD8_v2` | 设置8位值 | 透传 |
| `cuMemsetD16_v2` | 设置16位值 | 透传 |
| `cuMemsetD32_v2` | 设置32位值 | 透传 |
| `cuMemsetD8Async` | 异步设置8位值 | 透传 |
| `cuMemsetD16Async` | 异步设置16位值 | 透传 |
| `cuMemsetD32Async` | 异步设置32位值 | 透传 |
| `cuMemsetD2D8_v2` | 2D设置8位值 | 透传 |
| `cuMemsetD2D16_v2` | 2D设置16位值 | 透传 |
| `cuMemsetD2D32_v2` | 2D设置32位值 | 透传 |
| `cuMemsetD2D8Async` | 异步2D设置8位 | 透传 |
| `cuMemsetD2D16Async` | 异步2D设置16位 | 透传 |
| `cuMemsetD2D32Async` | 异步2D设置32位 | 透传 |

## 内核启动 (7个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuLaunchKernel` | 启动内核 | **算力限制控制** |
| `cuLaunchCooperativeKernel` | 启动协作内核 | **算力限制控制** |
| `cuFuncSetCacheConfig` | 设置函数缓存配置 | 透传 |
| `cuFuncSetSharedMemConfig` | 设置共享内存配置 | 透传 |
| `cuFuncGetAttribute` | 获取函数属性 | 透传 |
| `cuFuncSetAttribute` | 设置函数属性 | 透传 |
| `cuMemAdvise` | 内存建议 | 透传 |

## 事件管理 (2个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuEventCreate` | 创建事件 | 透传 |
| `cuEventDestroy_v2` | 销毁事件 | 透传 |

## 模块加载 (11个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuModuleLoad` | 加载模块 | 透传 |
| `cuModuleLoadData` | 从数据加载模块 | 透传 |
| `cuModuleLoadDataEx` | 扩展加载模块 | 透传 |
| `cuModuleLoadFatBinary` | 加载`Fat Binary` | 透传 |
| `cuModuleGetFunction` | 获取函数 | 透传 |
| `cuModuleUnload` | 卸载模块 | 透传 |
| `cuModuleGetGlobal_v2` | 获取全局变量 | 透传 |
| `cuModuleGetTexRef` | 获取纹理引用 | 透传 |
| `cuModuleGetSurfRef` | 获取表面引用 | 透传 |
| `cuLinkCreate_v2` | 创建链接 | 透传 |
| `cuLinkDestroy` | 销毁链接 | 透传 |

## 10. 虚拟内存管理 (5个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuMemAddressReserve` | 预留地址空间 | 透传 |
| `cuMemCreate` | 创建内存对象 | **检查配额并记录** |
| `cuMemRelease` | 释放内存对象 | **更新使用记录** |
| `cuMemMap` | 映射内存 | 透传 |
| `cuMemImportFromShareableHandle` | 导入共享句柄 | 透传 |

## 11. 内存池管理 (14个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuMemHostGetDevicePointer_v2` | 获取设备指针 | 透传 |
| `cuMemHostGetFlags` | 获取主机内存标志 | 透传 |
| `cuMemPoolTrimTo` | 修剪内存池 | 透传 |
| `cuMemPoolSetAttribute` | 设置内存池属性 | 透传 |
| `cuMemPoolGetAttribute` | 获取内存池属性 | 透传 |
| `cuMemPoolSetAccess` | 设置内存池访问权限 | 透传 |
| `cuMemPoolGetAccess` | 获取内存池访问权限 | 透传 |
| `cuMemPoolCreate` | 创建内存池 | 透传 |
| `cuMemPoolDestroy` | 销毁内存池 | 透传 |
| `cuMemAllocFromPoolAsync` | 从池异步分配 | 透传 |
| `cuMemPoolExportToShareableHandle` | 导出内存池句柄 | 透传 |
| `cuMemPoolImportFromShareableHandle` | 导入内存池句柄 | 透传 |
| `cuMemPoolExportPointer` | 导出内存池指针 | 透传 |
| `cuMemPoolImportPointer` | 导入内存池指针 | 透传 |

## 12. 指针属性 (6个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuPointerGetAttribute` | 获取指针属性 | 透传 |
| `cuPointerGetAttributes` | 获取多个指针属性 | 修改内存类型信息 |
| `cuPointerSetAttribute` | 设置指针属性 | 透传 |
| `cuMemRangeGetAttribute` | 获取内存范围属性 | 透传 |
| `cuMemRangeGetAttributes` | 获取多个范围属性 | 透传 |
| `cuIpcCloseMemHandle` | 关闭`IPC`内存句柄 | 透传 |

## 13. 外部资源互操作 (8个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuImportExternalMemory` | 导入外部内存 | 透传 |
| `cuExternalMemoryGetMappedBuffer` | 获取映射缓冲区 | 透传 |
| `cuExternalMemoryGetMappedMipmappedArray` | 获取映射纹理数组 | 透传 |
| `cuDestroyExternalMemory` | 销毁外部内存 | 透传 |
| `cuImportExternalSemaphore` | 导入外部信号量 | 透传 |
| `cuSignalExternalSemaphoresAsync` | 异步信号外部信号量 | 透传 |
| `cuWaitExternalSemaphoresAsync` | 异步等待外部信号量 | 透传 |
| `cuDestroyExternalSemaphore` | 销毁外部信号量 | 透传 |

## 14. CUDA Graph (47个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuGraphCreate` | 创建图 | 透传 |
| `cuGraphAddKernelNode_v2` | 添加内核节点 | 透传 |
| `cuGraphKernelNodeGetParams_v2` | 获取内核节点参数 | 透传 |
| `cuGraphKernelNodeSetParams_v2` | 设置内核节点参数 | 透传 |
| `cuGraphAddMemcpyNode` | 添加拷贝节点 | 透传 |
| `cuGraphMemcpyNodeGetParams` | 获取拷贝节点参数 | 透传 |
| `cuGraphMemcpyNodeSetParams` | 设置拷贝节点参数 | 透传 |
| `cuGraphAddMemsetNode` | 添加设置节点 | 透传 |
| `cuGraphMemsetNodeGetParams` | 获取设置节点参数 | 透传 |
| `cuGraphMemsetNodeSetParams` | 设置设置节点参数 | 透传 |
| `cuGraphAddHostNode` | 添加主机节点 | 透传 |
| `cuGraphHostNodeGetParams` | 获取主机节点参数 | 透传 |
| `cuGraphHostNodeSetParams` | 设置主机节点参数 | 透传 |
| `cuGraphAddChildGraphNode` | 添加子图节点 | 透传 |
| `cuGraphChildGraphNodeGetGraph` | 获取子图 | 透传 |
| `cuGraphAddEmptyNode` | 添加空节点 | 透传 |
| `cuGraphAddEventRecordNode` | 添加事件记录节点 | 透传 |
| `cuGraphEventRecordNodeGetEvent` | 获取事件记录节点事件 | 透传 |
| `cuGraphEventRecordNodeSetEvent` | 设置事件记录节点事件 | 透传 |
| `cuGraphAddEventWaitNode` | 添加事件等待节点 | 透传 |
| `cuGraphEventWaitNodeGetEvent` | 获取事件等待节点事件 | 透传 |
| `cuGraphEventWaitNodeSetEvent` | 设置事件等待节点事件 | 透传 |
| `cuGraphAddExternalSemaphoresSignalNode` | 添加外部信号量信号节点 | 透传 |
| `cuGraphExternalSemaphoresSignalNodeGetParams` | 获取外部信号量信号参数 | 透传 |
| `cuGraphExternalSemaphoresSignalNodeSetParams` | 设置外部信号量信号参数 | 透传 |
| `cuGraphAddExternalSemaphoresWaitNode` | 添加外部信号量等待节点 | 透传 |
| `cuGraphExternalSemaphoresWaitNodeGetParams` | 获取外部信号量等待参数 | 透传 |
| `cuGraphExternalSemaphoresWaitNodeSetParams` | 设置外部信号量等待参数 | 透传 |
| `cuGraphExecExternalSemaphoresSignalNodeSetParams` | 执行外部信号量信号参数设置 | 透传 |
| `cuGraphExecExternalSemaphoresWaitNodeSetParams` | 执行外部信号量等待参数设置 | 透传 |
| `cuGraphClone` | 克隆图 | 透传 |
| `cuGraphNodeFindInClone` | 在克隆中查找节点 | 透传 |
| `cuGraphNodeGetType` | 获取节点类型 | 透传 |
| `cuGraphGetNodes` | 获取所有节点 | 透传 |
| `cuGraphGetRootNodes` | 获取根节点 | 透传 |
| `cuGraphGetEdges` | 获取边 | 透传 |
| `cuGraphNodeGetDependencies` | 获取节点依赖 | 透传 |
| `cuGraphNodeGetDependentNodes` | 获取依赖节点 | 透传 |
| `cuGraphAddDependencies` | 添加依赖 | 透传 |
| `cuGraphRemoveDependencies` | 移除依赖 | 透传 |
| `cuGraphDestroyNode` | 销毁节点 | 透传 |
| `cuGraphInstantiate` | 实例化图 | 透传 |
| `cuGraphInstantiateWithFlags` | 带标志实例化图 | 透传 |
| `cuGraphUpload` | 上传图 | 透传 |
| `cuGraphLaunch` | 启动图 | 透传 |
| `cuGraphExecDestroy` | 销毁图执行 | 透传 |
| `cuGraphDestroy` | 销毁图 | 透传 |

## 15. 其他 (4个)

| API名称 | 功能说明 | 劫持目的 |
|---------|---------|---------|
| `cuIpcGetMemHandle` | 获取`IPC`内存句柄 | 透传 |
| `cuIpcOpenMemHandle_v2` | 打开`IPC`内存句柄 | 透传 |
| `cuGetProcAddress` | 获取函数地址 | **劫持动态加载的API** |
| `cuGetProcAddress_v2` | 获取函数地址(`v2`) | **劫持动态加载的API** |

## 16. 统计汇总

| 分类 | API数量 | 核心劫持 | 透传 |
|------|---------|---------|------|
| 初始化与设备管理 | 18 | 1 | 17 |
| 上下文管理 | 23 | 1 | 22 |
| 流管理 | 3 | 0 | 3 |
| 显存分配与释放 | 18 | 11 | 7 |
| 显存拷贝 | 20 | 0 | 20 |
| 显存设置 | 12 | 0 | 12 |
| 内核启动 | 7 | 2 | 5 |
| 事件管理 | 2 | 0 | 2 |
| 模块加载 | 11 | 0 | 11 |
| 虚拟内存管理 | 5 | 2 | 3 |
| 内存池管理 | 14 | 0 | 14 |
| 指针属性 | 6 | 1 | 5 |
| 外部资源互操作 | 8 | 0 | 8 |
| `CUDA Graph` | 47 | 0 | 47 |
| 其他 | 4 | 2 | 2 |
| **总计** | **198** | **20** | **178** |

**核心劫持说明**：
- **显存管理**：所有显存分配/释放`API`都会检查配额并记录使用情况
- **算力控制**：内核启动`API`会进行算力限制控制
- **信息伪装**：`cuDeviceTotalMem_v2`、`cuMemGetInfo_v2`返回虚拟显存信息
- **动态劫持**：`cuGetProcAddress`系列确保动态加载的`API`也被劫持



## 17. 参考资料

- https://github.com/Project-HAMi/HAMi-core