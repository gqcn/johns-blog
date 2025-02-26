---
slug: "/mysql-insert-duplicate-deadlock"
title: "MySQL 5.7 insert into on duplicate 死锁"
hide_title: true
keywords:
  ["MySQL", "死锁", "insert into", "on duplicate", "数据库", "并发", "性能优化"]
description: "分析 MySQL 5.7 中使用 insert into on duplicate 语句时可能出现的死锁问题及其解决方案"
---


## 一、问题复现

表结构：

```
CREATE TABLE `test` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `alias` int(11) NOT NULL,
  `age` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `u_idx_alias` (`alias`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

事务隔离级别为`MySQL`默认的`RR`（可重复读）

数据库版本：`5.7.20`

插入数据：

```
insert into test(alias,age) values(1,1),(3,3),(5,5),(7,7);
```

死锁前提条件：多个并发同时执行`insert into on duplicate update xxx` 判断唯一键是否存在，存在更新数据

|     |     |     |     |
| --- | --- | --- | --- |
| 时间戳 | 事务1 | 事务2 | 事务3 |
| T1  | ``begin;insert into  `test`(`alias`,`age`) values(9,9) on duplicate key update age=9;`` |     |     |
| T2  |     | ``begin;insert into  `test`(`alias`,`age`) values(10,10) on duplicate key update age=11;`` |     |
| T3  |     |     | ``begin;insert into  `test`(`alias`,`age`) values(11,11) on duplicate key update age=11;`` |
| T4  | `commit;` |     | `ERROR 1213 (40001): Deadlock found when trying to get lock; try restarting transaction` |

## 二、锁机制分析

这里我们来具体分析一下到底加了什么锁，我们知道insert插入操作的时候会加 X锁和插入意向锁，这里我们看看 `insert into on duplicate key`加什么锁,

首先打开：

```
set GLOBAL innodb_status_output_locks=ON;
set GLOBAL innodb_status_output=ON;
```

MySQL的锁统计，这个线上不推荐打开打开的话日志会记录得比较多。

首先执行第一个SQL，输入`show engine innodb status`命令查看。

在执行执行第二个SQL，发现其插入意向锁正在被`gap锁`阻塞。

同样的如果我们执行第三个SQL，插入意向锁也会被第一个事务`gap锁`阻塞，如果第一个事务的`gap锁`提交，他们首先又会先获取`gap锁(`这里从锁的信息判断，被阻塞的时候是没有`gap锁`)，其次再获取插入意向锁，就导致了T2、T3两个形成循环链路，最终导致死锁。

## 三、为什么会有gap锁

`gap锁`是`RR`隔离级别下用来解决幻读的一个手段，一般出现在`delete`中，为什么会出现在这里呢？这其实是一个`BUG`，在 [https://bugs.mysql.com/bug.php?id=50413](https://bugs.mysql.com/bug.php?id=50413) 这个`BUG`中可以看见：

> Concurrent "INSERT …ON DUPLICATE KEY UPDATE" statements run on a table  
> with multiple unique indexes would sometimes cause events to be written to  
> the binary log incorrectly

当我们并发的用`INSERT …ON DUPLICATE KEY UPDATE`的时候，如果我们有多个唯一索引，那么有可能会导致binlog错误，也就是会导致主从复制不一致，具体的一些测试可以去链接中查看。

## 三、关于gap锁介绍

间隙锁实质上是对索引前后的间隙上锁，不对索引本身上锁。根据检索条件向左寻找最靠近检索条件的记录值A，作为左区间，向右寻找最靠近检索条件的记录值B作为右区间，即锁定的间隙为（A，B）。间隙锁的目的是为了防止幻读，其主要通过两个方面实现这个目的：

1.  防止间隙内有新数据被插入。
2.  防止已存在的数据，更新成间隙内的数

示例数据：

```
+----+------+
| id | n    |
+----+------+
| 1  | 1    |
| 3  | 102  |
| 5  | 105  |
| 7  | 107  |
| 9  | 109  |
+----+------+
```

如果事务A开启一个事务，执行`select * from test where n = 105 for update`会对 `n` 在 `(102,105), (105, 107)`的数据上锁。

## 四、解决方案

### 1、升级版本

由于是一个BUG，因此升级`MySQL`版本到`5.7.35`及以上版本即可解决，比如MySQL 8以上版本也没类似问题。

### 2、就是要用5.7版本

*   使用`RC`级别，`RC`隔离级别下不会有`gap锁`
*   在数据库表中只建立主键，不建立其他唯一索引。
*   不使用 `insert on duplicate key update`，使用普通的`insert`。根据业务场景判断`ON DUPLICATE KEY UPDATE` 是否有必要
    *   先`insert` 再捕获异常，然后进行更新
    *   使用`insert ignore`，然后判断 `affected rows` 是否是1，然后再决定是否更新。  
          
        

  

  
