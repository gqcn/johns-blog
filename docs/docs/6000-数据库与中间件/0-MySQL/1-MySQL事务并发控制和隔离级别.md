---
slug: "/database-and-middleware/mysql-transaction-isolation"
title: "MySQL事务并发控制和隔离级别"
hide_title: true
keywords:
  ["MySQL", "事务", "并发控制", "隔离级别", "ACID", "数据一致性", "事务管理"]
description: "详细介绍 MySQL 事务的并发控制机制和不同隔离级别的特性及应用场景"
---



## 并发事务带来了哪些问题?

在典型的应用程序中，多个事务并发运行，经常会操作相同的数据来完成各自的任务（多个用户对同一数据进行操作）。并发虽然是必须的，但可能会导致以下的问题。

### 脏读（Dirty read）

**读取到了未提交数据。**

一个事务读取数据并且对数据进行了修改，这个修改对其他事务来说是可见的，即使当前事务没有提交。这时另外一个事务读取了这个还未提交的数据，但第一个事务突然回滚，导致数据并没有被提交到数据库，那第二个事务读取到的就是脏数据，这也就是脏读的由来。

例如：事务 1 读取某表中的数据 A=20，事务 1 修改 A=A-1，事务 2 读取到 A = 19,事务 1 回滚导致对 A 的修改并未提交到数据库， A 的值还是 20。

![](/attachments/concurrency-consistency-issues-dirty-reading-C1rL9lNt.png)

### 丢失修改（Lost to modify）

在一个事务读取一个数据时，另外一个事务也访问了该数据，那么在第一个事务中修改了这个数据后，第二个事务也修改了这个数据。这样第一个事务内的修改结果就被丢失，因此称为丢失修改。

例如：事务 1 读取某表中的数据 A=20，事务 2 也读取 A=20，事务 1 先修改 A=A-1，事务 2 后来也修改 A=A-1，最终结果 A=19，事务 1 的修改被丢失。

![](/attachments/concurrency-consistency-issues-missing-modifications-D4pIxvwj.png)

### 不可重复读（Unrepeatable read）

**不同事务读取到了另一事务的已提交数据（针对update）。**

指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称为不可重复读。

例如：事务 1 读取某表中的数据 A=20，事务 2 也读取 A=20，事务 1 修改 A=A-1，事务 2 再次读取 A =19，此时读取的结果和第一次读取的结果不同。

![](/attachments/concurrency-consistency-issues-unrepeatable-read-RYuQTZvh.png)

### 幻读（Phantom read）

**不同事务读取到了另一事务的已提交数据（针对insert/delete）。**

幻读与不可重复读类似。它发生在一个事务读取了几行数据，接着另一个并发事务插入了一些数据时。在随后的查询中，第一个事务就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以称为幻读。

例如：事务 2 读取某个范围的数据，事务 1 在这个范围插入了新的数据，事务 2 再次读取这个范围的数据发现相比于第一次读取的结果多了新的数据。

![](/attachments/concurrency-consistency-issues-phantom-read-D-ETycCp.png)

## 不可重复读和幻读的区别？

(1) 不可重复读是读取了其他事务更改的数据，**针对update操作**

解决：使用**行级锁**，锁定该行，事务A多次读取操作完成后才释放该锁，这个时候才允许其他事务更改刚才的数据。

(2) 幻读是读取了其他事务新增的数据，**针对insert和delete操作**

解决：使用**表级锁**，锁定整张表，事务A多次读取数据总量之后才释放该锁，这个时候才允许其他事务新增数据。

## 并发事务的控制方式有哪些？

MySQL 中并发事务的控制方式无非就两种：**锁** 和 **MVCC**。锁可以看作是悲观控制的模式，多版本并发控制（MVCC，Multiversion concurrency control）可以看作是乐观控制的模式。

**锁** 控制方式下会通过锁来显式控制共享资源而不是通过调度手段，MySQL 中主要是通过 **读写锁** 来实现并发控制。

*   **共享锁（S 锁）**：又称读锁，事务在读取记录的时候获取共享锁，允许多个事务同时获取（锁兼容）。
*   **排他锁（X 锁）**：又称写锁/独占锁，事务在修改记录的时候获取排他锁，不允许多个事务同时获取。如果一个记录已经被加了排他锁，那其他事务不能再对这条记录加任何类型的锁（锁不兼容）。

读写锁可以做到读读并行，但是无法做到写读、写写并行。另外，根据根据锁粒度的不同，又被分为 **表级锁(table-level locking)** 和 **行级锁(row-level locking)** 。InnoDB 不光支持表级锁，还支持行级锁，默认为行级锁。行级锁的粒度更小，仅对相关的记录上锁即可（对一行或者多行记录加锁），所以对于并发写入操作来说， InnoDB 的性能更高。不论是表级锁还是行级锁，都存在共享锁（Share Lock，S 锁）和排他锁（Exclusive Lock，X 锁）这两类。

**MVCC** 是多版本并发控制方法，即对一份数据会存储多个版本，通过事务的可见性来保证事务能看到自己应该看到的版本。通常会有一个全局的版本分配器来为每一行数据设置版本号，版本号是唯一的。

MVCC 在 MySQL 中实现所依赖的手段主要是: **隐藏字段、read view、undo log**。

*   undo log : undo log 用于记录某行数据的多个版本的数据。
*   read view 和 隐藏字段 : 用来判断当前版本数据的可见性。

关于 InnoDB 对 MVCC 的具体实现可以看这篇文章：[InnoDB 存储引擎对 MVCC 的实现](https://javaguide.cn/database/mysql/innodb-implementation-of-mvcc.html) 。

## 事务的隔离级别有哪些？

![](/attachments/image-2024-8-28_20-34-16.png)

## MySQL 的隔离级别是基于锁实现的吗？

**MySQL 的隔离级别基于锁和 MVCC 机制共同实现的。**

*   **串行化**（SERIALIZABLE）隔离级别是通过锁来实现的
*   **读已提交**（READ-COMMITTED）和**可重复读**（REPEATABLE-READ）隔离级别是基于 MVCC 实现的。
*   不过，**串行化**（SERIALIZABLE）之外的其他隔离级别可能也需要用到锁机制，就比如**可重复读**（REPEATABLE-READ）在当前读情况下需要使用加锁读来保证不会出现幻读。

## 参考资料

*   [https://javaguide.cn/database/mysql/mysql-questions-01.html](https://javaguide.cn/database/mysql/mysql-questions-01.html)


