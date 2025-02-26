---
slug: "/redis-stream"
title: "Redis Stream简介"
hide_title: true
keywords:
  [
    "Redis",
    "Stream",
    "消息队列",
    "实时数据",
    "消息持久化",
    "消息订阅",
    "流处理",
  ]
description: "介绍 Redis Stream 的基本概念、特性和使用场景，探讨其在消息队列和实时数据处理中的应用"
---

## Stream 概述

**基于Reids的消息队列实现有很多种，比如基于PUB/SUB（订阅/发布）模式、基于List的 PUSH和POP一系列命令的实现、基于Sorted-Set的实现。虽然它们都有各自的特点，比如List支持阻塞式的获取消息，Pub/Sub支持消息多播，Sorted Set支持延时消息，但它们有太多的缺点：**

1.  Redis List没有消息多播功能，没有ACK机制，无法重复消费等等。
2.  Redis Pub/Sub消息无法持久化，只管发送，如果出现网络断开、Redis 宕机等，消息就直接没了，自然也没有ACK机制。
3.  Redis Sorted Set不支持阻塞式获取消息、不允许重复消费、不支持分组。

**Redis Stream 则是 Redis 5.0 版本新增加的数据结构。Redis Stream 主要用于实现消息队列（MQ，Message Queue），可以说是目前最新Redis版本（6.2）中最完美的消息队列实现。**

**Redis Stream 有如下功能：**

1.  提供了对于消费者和消费者组的阻塞、非阻塞的获取消息的功能。
2.  提供了消息多播的功能，同一个消息可被分发给多个单消费者和消费者组；
3.  提供了消息持久化的功能，可以让任何消费者访问任何时刻的历史消息；
4.  提供了强大的消费者组的功能：
    1.  消费者组实现同组多个消费者并行但不重复消费消息的能力，提升消费能力。
    2.  消费者组能够记住最新消费的信息，保证消息连续消费；
    3.  消费者组能够记住消息转移次数，实现消费失败重试以及永久性故障的消息转移。
    4.  消费者组能够记住消息转移次数，借此可以实现死信消息的功能（需自己实现）。
    5.  消费者组提供了PEL未确认列表和ACK确认机制，保证消息被成功消费，不丢失；

**Redis Stream基本上可以满足你对消息队列的所有需求。**

## Stream基本结构

**Redis Stream像是一个仅追加内容的消息链表，把所有加入的消息都一个一个串起来，每个消息都有一个唯一的 ID 和内容，它还从 Kafka 借鉴了另一种概念：消费者组(Consumer Group)，这让Redis Stream变得更加复杂。**

Redis Stream的结构如下：

![](/attachments/1060878-20230517202555105-979983360.png)

**每个 Stream 都有唯一的名称，它就是 Redis 的 key，在我们首次使用 XADD 指令追加消息时自动创建。**

1.  **Consumer Group**：**消费者组，消费者组记录了Starem**的状态\*\*，使用 XGROUP CREATE 命令手动创建，在同一个Stream内消费者组名称唯一。一个消费组可以有多个消费者(Consumer)同时进行组内消费，所有消费者共享Stream内的所有信息，但同一条消息只会有一个消费者消费到，不同的消费者会消费Stream中不同的消息，这样就可以应用在分布式的场景中来保证消息消费的唯一性。
2.  **Last\_delivered\_id**：**游标，用来记录某个消费者组在Stream**上的消费位置信息\*\*，每个消费组会有个游标，任意一个消费者读取了消息都会使游标 last\_delivered\_id 往前移动。创建消费者组时需要指定从Stream的哪一个消息ID（哪个位置）开始消费，该位置之前的数据会被忽略，同时还用来初始化 last\_delivered\_id 这个变量。这个last\_delivered\_id一般来说就是最新消费的消息ID。
3.  **Pending\_ids**：**消费者内部的状态变量，作用是维护消费者的未确认的消息ID。pending\_ids记录了当前已经被客户端读取，但是还没有 ack (Acknowledge character：确认字符）的消息。** 目的是为了保证客户端至少消费了消息一次，而不会在网络传输的中途丢失而没有对消息进行处理。如果客户端没有 ack，那么这个变量里面的消息ID 就会越来越多，一旦某个消息被ack，它就会对应开始减少。**这个变量也被 Redis 官方称为 PEL (Pending Entries List)。**

## 参考资料

*   [https://juejin.cn/post/7112825943231561741](https://juejin.cn/post/7112825943231561741)
*   [https://www.cnblogs.com/goldsunshine/p/17410148.html](https://www.cnblogs.com/goldsunshine/p/17410148.html)

