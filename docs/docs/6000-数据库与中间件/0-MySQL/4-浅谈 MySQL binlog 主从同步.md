---
slug: "/database-and-middleware/mysql-binlog-replication"
title: "浅谈 MySQL binlog 主从同步"
hide_title: true
keywords:
  ["MySQL", "binlog", "主从同步", "数据复制", "高可用", "数据同步", "主从架构"]
description: "深入讲解 MySQL binlog 主从同步的原理、配置方法和常见问题处理"
---



## binlog 的基础知识

### binlog 的概念

Server 层的日志系统（归档日志），binlog 中跟踪对其数据库的所有更改操作。是逻辑日志，以追加日志的形式记录。

### binLog 的三种格式

#### **1）statement**

记录 SQL 语句的原文。

风险点：

*   SQL中带有now()等内置函数时，主从的数据可能会不一致。
*   如果主/从用到的索引不同，操作语句带 limit 时，处理的可能是不同行的记录数据。

#### **2）row**

仅记录某条记录的数据修改细节，不关系上下文。例如SQL中带有now()等内置函数时，会被自动转换为当前具体的时间值例如2024-01-01 12:00:00。

缺点：占用空间，同时写 binlog 很耗费 I/O 资源，影响执行速度。

#### **3）mixed**

一般语句使用 statement 格式保存，如果使用了一些函数，statement 格式无法完成主从复制的操作，采用 row 格式。MySQL 自己会判断这条 SQL 语句是否可能引起主备不一致，如果有可能就用 row 格式，否则就用 statement 格式。

## 主从同步的基础流程

![](/attachments/linkedkeeper0_bb790df4-28f3-4e4e-9de0-9e6a233b0348.png)

1.  主库接收到更新命令，执行更新操作，生成 binlog

2.  从库在主从之间建立长连接

3.  主库 dump\_thread 从本地读取 binlog 传送刚给从库

4.  从库从主库获取到 binlog 后存储到本地，成为 relay log（中继日志）

5.  sql\_thread 线程读取 relay log 解析、执行命令更新数据


每个主/从连接都有三个线程，具有多个从库的主库会为每个连接创建一个 dump thread，每个从库都有自己的 I/O thread 和 sql thread。从库使用两个线程将读取主库 binlog 日志和执行更新操作分离开，通过 relay log 机制，使 binlog 的读取和执行互不影响。如果从库某段时间没有运行，重启后从库可以快速读取主库的 binlog 日志；如果从库在 sql thread 执行完 binlog 日志前停止，在重启后也可以在本地的 relay log 中读取到命令继续执行。

*   dump thread：在从库与主库创建连接后，主库创建 dump thread 日志将 binlog 发送到从库，如果该线程追上了主控，它将进入休眠状态知道主库发送信号通知其有新的事件产生时才会被唤醒

*   I/O thread：在从库执行 start slave 语句时，创建 I/O thread，该线程连接到主库，将 binlog 日志记录到中继日志

*   sql thread：读取 relay log 执行命令实现从库数据的更新


## 主从延迟问题

### 1，什么是主从延迟

主从延迟指的是同一个事务在从库执行完成的时间和主库执行完成的时间直接的差值。

延迟时间 = 主库执行完事务写入 binlog 的时刻 - 从库执行完事务的时刻

### 2，主从延迟的来源

1）在一些部署条件下，备库所在机器的性能比主库的机器差

2）备库读压力大

3）大事务场景

4）从库的并行复制能力

### 3，从库并行复制策略

![](/attachments/linkedkeeper0_5a7fd527-6038-49b1-a4f0-7cd20dad38ef.png)

**核心思想：**

由 sql\_thread 作为分配者（coordinator）的角色，负责读取中转日志（relay log）和分发事务，由 worker 线程来执行命令更新数据。

**原则：**

*   不能造成更新覆盖，要求更新同一行的两个事务必须分发到同一个 worker 中

*   同一个事务不能被拆开，必须放到同一个 worker 中


**现有的一些并行复制策略：**

1）5.6 按库并行复制

coordinator 将 relay log 按照 DB 的维度分发给不同的 worker。

*   优点：构造映射关系快，只需要库名；不要求 binlog 格式

*   缺点：如果主库上只有一个 DB，那这个策略就没有效果了，或者存在热点 DB，也起不到并行的效果


2）MariaDB 组提交优化

组提交（group commit）主要有以下特性：

*   一组提交的事务有一个相同的 `commit_id` 直接写到 bin log 里；能够在同一组里提交的事务一定不会修改同一行；主库上可以并行执行的事务备库上也一定可以并行执行。MariaDB 利用组提交的特性对并行复制进行优化，将相同 `commit_id` 的事务分发到多个 worker 执行，一组全部执行完毕后再执行下一批。

*   缺点：在从库上执行时，要等一组事务执行完成后再开始执行下一批事务，这样系统的吞吐量就不够，此外，如果出现大事务，那么这段时间就只用一个 worker 线程在工作，造成资源的浪费。


3）5.7.22 增加 binlog-transaction-dependency-tracking 参数控制并行复制策略

`commit_order` ，根据同时进入 prepare 和 commit 来判断是否可以并行的策略。

原则：

*   同时出入 prepare 状态的事务在从库执行时是可以并行的；

*   处于 prepare 状态的事务与处于 commit 状态的事务之间在备库执行时也是可以并行的。


可以通过 `binlog_group_commit_sync_delay` 和 `bin_log_group_commit_sync_no_delay_count` 拉长 binlog write 和 fsync 之间的时间，制造更多同时处于 prepare 阶段的事务。

writeset，对于事务涉及更新的每一行计算出这行的 hash 值组成集合 writeset，如果两个事务没有操作相同的行，也就是说它们的 writeset 没有交集，就可以并行。

`wrtieset_session`，是在 writeset 的基础上多了个约束，在主库上同一个线程先后执行的两个事务，在备库执行的时候要保证先后顺序。

## 延伸

### 从库连接到主库请求 binlog 日志

从库主动从主库请求 binlog 的副本，而不是主库主动将数据推送到从库。也就是说每个从库都是独立独立地与主库进行连接，每个从库只能通过向主库请求来接收 binlog 的副本，因此从库能够以自己的速度读取和更新数据库的副本，并且可以随意启动和停止赋值过程，而不会影响到主库或者其他从库的状态。

### relay log（中继日志）

中继日志与 binlog 相同，由一组包含描述数据库更改的文件和一个包含所有已使用的中继日志文件名称的索引文件组成。在5.6以前，日志是存在 relay [log.info](http://log.info) 文件中的，在5.6以后可以使用 `--relay log info repository=table` 启动 slave，将此日志写入 `mysql.slave_relay_log_info` 表，而不是文件。

### 复制通道概念

MySQL5.7.6 引入了复制通道的概念，表示事务从主库流到从库的路径。MySQL 服务器会在启动时自动创建一个默认通道，其名称为空字符串（””）。此通道始终存在；用户无法创建或销毁它。如果没有创建其他通道（具有非空名称），则复制语句仅作用于默认通道，以便所有来自旧从属服务器的复制语句都按预期工作。应用于复制通道的语句只能在至少有一个命名通道时使用。

在多源复制中，从库打开多个通道，每个主通道一个，每个通道都有自己的中继日志和 sql thread，一旦复制通道的接收器（I/O 线程）接收到事务，他们将被添加到通道的中继日志文件中并传递到 sql thread，使通道能够独立工作。

### 主库和从库用不同引擎

对于复制过程来说，主库表和从库表是否使用不同的引擎类型并不重要，实际上，在复制过程中不会复制存储引擎系统变量，用户可以针对不同的复制方案为从库设置不同的存储引擎。

### undo log

每一个事务对数据的修改都会被记录到 undo log ，当执行事务过程中出现错误或者需要执行回滚操作的话，MySQL 可以利用 undo log 将数据恢复到事务开始之前的状态。

undo log 属于逻辑日志，记录的是 SQL 语句，**比如说事务执行一条 DELETE 语句，那 undo log 就会记录一条相对应的 INSERT 语句**。**同时，undo log 的信息也会被记录到 redo log 中，因为 undo log 也要实现持久性保护。**并且，undo-log 本身是会被删除清理的，例如 INSERT 操作，在事务提交之后就可以清除掉了；UPDATE/DELETE 操作在事务提交不会立即删除，会加入 history list，由后台线程 purge 进行清理。

undo log 是采用 segment（段）的方式来记录的，每个 undo 操作在记录的时候占用一个 **undo log segment**（undo 日志段），undo log segment 包含在 **rollback segment**（回滚段）中。事务开始时，需要为其分配一个 rollback segment。每个 rollback segment 有 1024 个 undo log segment，这有助于管理多个并发事务的回滚需求。

通常情况下， **rollback segment header**（通常在回滚段的第一个页）负责管理 rollback segment。rollback segment header 是 rollback segment 的一部分，通常在回滚段的第一个页。**history list** 是 rollback segment header 的一部分，它的主要作用是记录所有已经提交但还没有被清理（purge）的事务的 undo log。这个列表使得 purge 线程能够找到并清理那些不再需要的 undo log 记录。

## 参考资料

*   [http://www.linkedkeeper.com/1503.html](http://www.linkedkeeper.com/1503.html) 
*   [https://javaguide.cn/database/mysql/mysql-logs.html](https://javaguide.cn/database/mysql/mysql-logs.html)

  


