---
slug: "/ai/gpu-pcie-vs-sxm"
title: GPU PCIe版和SXM版的区别
hide_title: true
keywords: [GPU, PCIe, SXM, NVLink, NVSwitch, DGX, HGX, NVIDIA, GPU互联, 大模型训练, AI算力, GPU架构]
description: 详细介绍NVIDIA GPU的PCIe版和SXM版的区别，包括架构特点、互联方式、性能对比和应用场景，帮助理解如何根据不同的AI工作负载选择合适的GPU版本。
---

## 术语说明

在深入了解`GPU`的`PCIe`版和`SXM`版之前，先了解几个关键术语：

| 术语 | 全称 | 说明 | 
|------|------|------|
| `PCIe` | `Peripheral Component Interconnect Express` | 计算机行业标准总线接口，用于连接`GPU`、网卡、存储设备等到主板。最新`PCIe 5.0`单向带宽约为`128GB/s`，是消费级和企业级服务器最常见的`GPU`连接方式 | 
| `SXM` | `Server PCI Express Module` | `NVIDIA`专为高性能计算设计的专有`GPU`插座标准，采用插卡式（非插槽式）设计，功耗更高（可达`500W`），通过专用底板实现`GPU`间高速互联 | 
| `NVLink` | `NVIDIA Link` | `NVIDIA`专有的点对点高速`GPU`互联技术，提供比`PCIe`更高的带宽。`A100`为`600GB/s`（阉割版`A800`为`400GB/s`），`H100`达`900GB/s`（阉割版`H800`为`400GB/s`） | 
| `NVSwitch` | `NVIDIA Switch` | `NVIDIA`的`GPU`互联交换芯片，类似于网络交换机，通过`NVLink`协议实现多个`GPU`之间的全连接高速通信，消除`GPU`间通信瓶颈 | 
| `DGX` | `Deep Learning GPU eXtension` | `NVIDIA`官方出品的`AI`超级计算机整机系统，集成了`GPU`、`CPU`、网络、存储等，出厂即用。可通过`NVSwitch`连接多台`DGX`组成`SuperPod`超级集群 | 
| `HGX` | `High-performance GPU eXtension` | `NVIDIA`向`OEM`厂商（如浪潮、戴尔、`HPE`等）提供的`GPU`服务器参考设计平台，核心架构与`DGX`相似，由第三方厂商集成为完整服务器 | 

## SXM版GPU

`SXM`架构是一种高带宽插座式解决方案，用于将`GPU`连接到英伟达专有的`DGX`和`HGX`系统。对于每一代英伟达`GPU`（包括`H800`、`H100`、`A800`、`A100`，以及早期的`P100`、`V100`），`DGX`系统、`HGX`系统都配有相应`SXM`插座类型。下图是`8`块`A100 SXM`卡插在`HGX`系统上（浪潮`NF5488A5`）。

![SXM版GPU](<assets/4500-GPU PCIe版和SXM版的区别/image-1.png>)

专门的`HGX`系统板通过`NVLink`将`8`个`GPU`互连起来，实现了`GPU`之间的高带宽。如下图所示，每个`H100 GPU`连接到`4`个`NVLink`交换芯片，`GPU`之间的`NVLink`带宽达到`900 GB/s`。同时，每个`H100 SXM GPU`也通过`PCIe`连接到`CPU`，因此`8`个`GPU`中的任何一个计算的数据都可以送到`CPU`。

![SXM版GPU](<assets/4500-GPU PCIe版和SXM版的区别/image-2.png>)

英伟达`DGX`和`HGX`系统板上的所有`SXM`版`GPU`，都通过`NVSwitch`芯片互联，`GPU`之间交换数据采用`NVLink`，未阉割的`A100`是`600GB/s`、`H100`是`900GB/s`，就算阉割过的`A800`、`H800`也还有`400GB/s`。非常适合有海量数据的`AI`大模型训练。

![SXM版GPU](<assets/4500-GPU PCIe版和SXM版的区别/image-3.png>)

`DGX`和`HGX`又有什么区别呢？

`NVIDIA DGX`可理解为原厂整机，扩展性非常强，所提供的性能是任何其他服务器在其给定的外形尺寸中无法比拟的。将多个`NVIDIA DGX H800`与`NVSwitch`系统连接起来，可以将多个（如`32`个、`64`个）`DGX H800`扩展为超级集群`SuperPod`，以实现超大模型训练。`HGX`属OEM整机。

## PCIe版GPU

`PCIe`版只有成对的`GPU`通过`NVLink Bridge`连接。如下图所示。`GPU 1`只直接连接到`GPU 2`，但`GPU 1`和`GPU 8`没有直接连接，因此只能通过`PCIe`通道进行数据通信，不得不利用`CPU`资源。最新的`PCIe`，也只有`128GB/s`。

![PCIe版GPU](<assets/4500-GPU PCIe版和SXM版的区别/image-4.png>)

## 应用场景

大家都知道，大模型训练需要极高的算力，特别是那些参数动辄百亿、千亿级的大模型，对`GPU`间的互联带宽要求也极高。既然`PCIe` 的带宽远不如`NVLink`，那`PCIe` 还有存在的价值吗？

其实单就`GPU`卡的算力而言，`PCIe`版`GPU`的计算性能和`SXM`版`GPU`并没区别，只是`GPU`互联带宽低点而以。对于大模型以外的应用，其实互联带宽的影响不大。下图是`A100 PCIe`和`A100 SXM`的参数对比。（表中 * 表示采用稀疏技术。是一种只存储非零元算的参数，可节省资源）

![PCIe版GPU](<assets/4500-GPU PCIe版和SXM版的区别/image.png>)

`PCIe` 版`GPU`特别适用于那些工作负荷较小、希望在`GPU` 数量方面获得最大灵活性的用户。比如，有的`GPU`服务器，只需要配`4`卡、甚至`2`卡`GPU`，用`PCIe` 版的灵活性就非常大，服务器整机可以做到`1U`或`2U`，对`IDC`机架也要求不高。另外，在推理类应用部署中，我们常常将资源通过虚拟化“化整为零”，按`1:1`的比例配置`CPU`与`GPU`资源。当然`PCIe`版也更省电些，约`300W/GPU`；而`SXM`版在`HGX`架构中，可高达`500W/GPU`。

## 参考资料

- https://mp.weixin.qq.com/s/9G5SzKFTBqz8gT0ShMHbvw
- https://zhuanlan.zhihu.com/p/673903240