---
slug: "/database-and-middleware/mysql-index-failure-scenarios"
title: "常见MySQL索引失效场景"
hide_title: true
keywords:
  ["MySQL", "索引", "索引失效", "性能优化", "查询优化", "数据库调优", "SQL优化"]
description: "详细分析 MySQL 中常见的索引失效场景及其解决方案，帮助开发者优化数据库查询性能"
---


## 背景

无论你是技术大佬，还是刚入行的小白，时不时都会踩到Mysql数据库不走索引的坑。常见的现象就是：明明在字段上添加了索引，但却并未生效。

为了方便学习和记忆，这篇文件将常见的一些不走索引情况进行汇总，并以实例展示，帮助大家更好地避免踩坑。建议收藏，以备不时之需。

## 数据库及索引准备

### 创建表结构

为了逐项验证索引的使用情况，我们先准备一张表t\_user：

```sql
CREATE TABLE `t_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `id_no` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '身份编号',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '用户名',
  `age` int(11) DEFAULT NULL COMMENT '年龄',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `union_idx` (`id_no`,`username`,`age`),
  KEY `create_time_idx` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
```

在上述表结构中有三个索引：

*   `id`：为数据库主键;
*   `union_idx`：为`id_no`、`username`、`age`构成的**联合索引**;
*   `create_time_idx`：是由`create_time`构成的普通索引;

### 初始化数据

初始化数据分两部分：基础数据和批量导入数据。

基础数据`insert`了4条数据，其中第4条数据的创建时间为未来的时间，用于后续特殊场景的验证：

```sql
INSERT INTO `t_user` (`id`, `id_no`, `username`, `age`, `create_time`) VALUES (null, '1001', 'Tom1', 11, '2022-02-27 09:04:23');
INSERT INTO `t_user` (`id`, `id_no`, `username`, `age`, `create_time`) VALUES (null, '1002', 'Tom2', 12, '2022-02-26 09:04:23');
INSERT INTO `t_user` (`id`, `id_no`, `username`, `age`, `create_time`) VALUES (null, '1003', 'Tom3', 13, '2022-02-25 09:04:23');
INSERT INTO `t_user` (`id`, `id_no`, `username`, `age`, `create_time`) VALUES (null, '1004', 'Tom4', 14, '2023-02-25 09:04:23');
```

除了基础数据，还有一条存储过程及其调用的SQL，方便批量插入数据，用来验证数据比较多的场景：

```sql
-- 删除历史存储过程
DROP PROCEDURE IF EXISTS `insert_t_user`

-- 创建存储过程
delimiter $

CREATE PROCEDURE insert_t_user(IN limit_num int)
BEGIN
 DECLARE i INT DEFAULT 10;
    DECLARE id_no varchar(18) ;
    DECLARE username varchar(32) ;
    DECLARE age TINYINT DEFAULT 1;
    WHILE i < limit_num DO
        SET id_no = CONCAT("NO", i);
        SET username = CONCAT("Tom",i);
        SET age = FLOOR(10 + RAND()*2);
        INSERT INTO `t_user` VALUES (NULL, id_no, username, age, NOW());
        SET i = i + 1;
    END WHILE;

END $
-- 调用存储过程
call insert_t_user(100);
```

关于存储过程的创建和存储，可暂时不执行，当用到时再执行。

### 数据库版本及执行计划

查看当前数据库的版本：

```bash
select version();
8.0.18
```

上述为本人测试的数据库版本：`8.0.18`。当然，以下的所有示例，大家可在其他版本进行执行验证。

查看SQL语句执行计划，一般我们都采用`explain`关键字，通过执行结果来判断索引使用情况。

执行示例：

```sql
explain select * from t_user where id = 1;
```

执行结果：

![](/attachments/e6803fc893d64b17cfb91908c80dc441507821.jpg)

explain

可以看到上述SQL语句使用了**主键索引(PRIMARY)**，`key_len`为4;

其中`key_len`的含义为：表示索引使用的字节数，根据这个值可以判断索引的使用情况，特别是在组合索引的时候，判断该索引有多少部分被使用到非常重要。

做好以上数据及知识的准备，下面就开始讲解具体索引失效的实例了。

## 常见MySQL索引失效场景

### 1、联合索引不满足最左匹配原则

联合索引遵从最左匹配原则，顾名思义，在联合索引中，最左侧的字段优先匹配。因此，在创建联合索引时，where子句中使用最频繁的字段放在组合索引的最左侧。

而在查询时，要想让查询条件走索引，则需满足：最左边的字段要出现在查询条件中。

实例中，`union_idx`联合索引组成：

```sql
KEY `union_idx` (`id_no`,`username`,`age`)
```

最左边的字段为`id_no`，一般情况下，只要保证`id_no`出现在查询条件中，则会走该联合索引。

**示例一：**

```sql
explain select * from t_user where id_no = '1002';
```

`explain`结果：

![](/attachments/098520242868b81fce270731652ade402f1fd8.jpg)

explain-01

通过`explain`执行结果可以看出，上述SQL语句走了`union_idx`这条索引。

这里再普及一下`key_len`的计算：

*   `id_no`类型为`varchar(18)`，字符集为`utf8mb4_bin`，也就是使用`4`个字节来表示一个完整的`UTF-8`。此时，`key_len = 18* 4 = 72`;
*   由于该字段类型`varchar`为变长数据类型，需要再额外添加`2`个字节。此时，`key_len = 72 + 2 = 74`;
*   由于该字段运行为`NULL(default NULL)`，需要再添加1个字节。此时，`key_len = 74 + 1 = 75`;

上面演示了`key_len`一种情况的计算过程，后续不再进行逐一推演，知道基本组成和原理即可，更多情况大家可自行查看。

**示例二：**

```sql
explain select * from t_user where id_no = '1002' and username = 'Tom2';
```

`explain`结果：

![](/attachments/a3f097581706548b5bc446d70a6bd4bbf22635.jpg)

explain-02

很显然，依旧走了`union_idx`索引，根据上面`key_len`的分析，大胆猜测，在使用索引时，不仅使用了`id_no`列，还使用了`username`列。

**示例三：**

```sql
explain select * from t_user where id_no = '1002' and age = 12;
```

`explain`结果：

![](/attachments/819ad350161afb240da140d1c29dd668c15301.jpg)

explain-03

走了`union_idx`索引，但跟示例一一样，只用到了`id_no`列。

当然，还有三列都在查询条件中的情况，就不再举例了。上面都是走索引的正向例子，也就是满足最左匹配原则的例子，下面来看看，不满足该原则的反向例子。

**反向示例：**

```sql
explain select * from t_user where username = 'Tom2' and age = 12;
```

`explain`结果：

![](/attachments/6297212227be9bcef09770cd1de90a55a87e6d.jpg)

explain-04

此时，可以看到未走任何索引，也就是说索引失效了。

同样的，下面只要没出现最左条件的组合，索引也是失效的：

```sql
explain select * from t_user where age = 12;
explain select * from t_user where username = 'Tom2';
```

**那么，第一种索引失效的场景就是：在联合索引的场景下，查询条件不满足最左匹配原则。**

### 2、使用了select \*

在《阿里巴巴开发手册》的ORM映射章节中有一条【强制】的规范：

> 【强制】在表查询中，一律不要使用 \* 作为查询的字段列表，需要哪些字段必须明确写明。说明:
>
> 1.  增加查询分析器解析成本。
> 2.  增减字段容易与 resultMap 配置不一致。
> 3.  无用字段增加网络 消耗，尤其是 text 类型的字段。

虽然在规范手册中没有提到索引方面的问题，但禁止使用`select *`语句可能会带来的附带好处就是：某些情况下可以走**覆盖索引**。

比如，在上面的联合索引中，如果查询条件是`age`或`username`，当使用了`select *`，肯定是不会走索引的。

但如果希望根据`username`查询出`id_no`、`username`、`age`这三个结果(均为索引字段)，明确查询结果字段，是可以走覆盖索引的：

```sql
explain select id_no, username, age from t_user where username = 'Tom2';
explain select id_no, username, age from t_user where age = 12;
```

`explain`结果：

![](/attachments/f28761f347d3c9fe4b4091bb38dd9d1afe5eb8.jpg)

覆盖索引

无论查询条件是`username`还是`age`，都走了索引，根据key\_len可以看出使用了索引的所有列。

**第二种索引失效场景：在联合索引下，尽量使用明确的查询列来趋向于走覆盖索引;**

**这一条不走索引的情况属于优化项，如果业务场景满足，则进来促使SQL语句走索引。至于阿里巴巴开发手册中的规范，只不过是两者撞到一起了，规范本身并不是为这条索引规则而定的。**

### 3、索引列参与运算

直接来看示例：

```sql
explain select * from t_user where id + 1 = 2 ;
```

`explain`结果：

![](/attachments/e4f30b8148b6ccc9b60014c89b9aac9a272794.jpg)

索引列计算

可以看到，即便`id`列有索引，由于进行了计算处理，导致无法正常走索引。

针对这种情况，其实不单单是索引的问题，还会增加数据库的计算负担。就以上述SQL语句为例，数据库需要全表扫描出所有的`id`字段值，然后对其计算，计算之后再与参数值进行比较。如果每次执行都经历上述步骤，性能损耗可想而知。

建议的使用方式是：先在内存中进行计算好预期的值，或者在SQL语句条件的右侧进行参数值的计算。

针对上述示例的优化如下：

```
-- 内存计算，得知要查询的id为1
explain select * from t_user where id = 1 ;
-- 参数侧计算
explain select * from t_user where id = 2 - 1 ;
```

**第三种索引失效情况：索引列参与了运算，会导致全表扫描，索引失效。**

### 4、索引列参使用了函数示例

```sql
explain select * from t_user where SUBSTR(id_no,1,3) = '100';
```

`explain`结果：

![](/attachments/48fd28277f2576fc89591825a06b02203fcc93.jpg)

索引-函数

上述示例中，索引列使用了函数(`SUBSTR`，字符串截取)，导致索引失效。

此时，索引失效的原因与第三种情况一样，都是因为数据库要先进行全表扫描，获得数据之后再进行截取、计算，导致索引索引失效。同时，还伴随着性能问题。

示例中只列举了`SUBSTR`函数，像`CONCAT`等类似的函数，也都会出现类似的情况。解决方案可参考第三种场景，可考虑先通过内存计算或其他方式减少数据库来进行内容的处理。

**第四种索引失效情况：索引列参与了函数处理，会导致全表扫描，索引失效。**

### 5、错误的like使用

示例：

```sql
explain select * from t_user where id_no like '%00%';
```

`explain`结果：

![](/attachments/b20fe761388f74bb3c34154faa92d5440c49e3.jpg)

索引-like

针对`like`的使用非常频繁，但使用不当往往会导致不走索引。常见的`like`使用方式有：

*   方式一：`like '%abc'`
*   方式二：`like 'abc%'`
*   方式三：`like '%abc%'`

其中方式一和方式三，由于占位符出现在首部，导致无法走索引。这种情况不做索引的原因很容易理解，索引本身就相当于目录，从左到右逐个排序。而条件的左侧使用了占位符，导致无法按照正常的目录进行匹配，导致索引失效就很正常了。

**第五种索引失效情况：模糊查询时(`like`语句)，模糊匹配的占位符位于条件的首部。**

### 6、类型隐式转换

示例：

```sql
explain select * from t_user where id_no = 1002;
```

`explain`结果：

![](/attachments/f3e8a3f83a05aa4aeea925b3c7ac26de6beb8d.jpg)

隐式转换

`id_no`字段类型为`varchar`，但在SQL语句中使用了`int`类型，导致全表扫描。

出现索引失效的原因是：`varchar`和`int`是两个种不同的类型。

解决方案就是将参数`1002`添加上单引号或双引号。

**第六种索引失效情况：参数类型与字段类型不匹配，导致类型发生了隐式转换，索引失效。**

这种情况还有一个特例，如果字段类型为`int`类型，而查询条件添加了单引号或双引号，则mysql会参数转化为int类型，虽然使用了单引号或双引号（优化器）：

```sql
explain select * from t_user where id = '2';
```

上述语句是依旧会走索引的。

### 7、使用OR操作

`OR`是日常使用最多的操作关键字了，但使用不当，也会导致索引失效。

示例：

```sql
explain select * from t_user where id = 2 or username = 'Tom2';
```

`explain`结果：

![](/attachments/359039493770a8eee6d109c0c35b94f742dfde.jpg)

or-索引

看到上述执行结果是否是很惊奇啊，明明`id`字段是有索引的，由于使用`or`关键字，索引竟然失效了。

其实，换一个角度来想，如果单独使用`username`字段作为条件很显然是全表扫描，既然已经进行了全表扫描了，前面`id`的条件再走一次索引反而是浪费了。所以，在使用`or`关键字时，切记两个条件都要添加索引，否则会导致索引失效。

但如果`or`两边同时使用`>`和`<`，则索引也会失效：

```sql
explain select * from t_user where id  > 1 or id  < 80;
```

`explain`结果：

![](/attachments/a9aab576945582c3840420eb96645031dd12e2.jpg)

or-范围

**第七种索引失效情况：查询条件使用`or`关键字，其中一个字段没有创建索引，则会导致整个查询语句索引失效；`or`两边为`>`和`<`范围查询时，索引失效。**

### 8、两列做比较

如果两个列数据都有索引，但在查询条件中对两列数据进行了对比操作，则会导致索引失效。

这里举个不恰当的示例，比如`age`小于`id`这样的两列(真实场景可能是两列同维度的数据比较，这里迁就现有表结构)：

```sql
explain select * from t_user where id > age;
```

`explain`结果：

![](/attachments/f68a9c44459768dae2a752511ed7bd1d5b8fd1.jpg)

索引-两列比较

这里虽然`id`有索引，`age`也可以创建索引，但当两列做比较时，索引还是会失效的。

**第八种索引失效情况：两列数据做比较，即便两列都创建了索引，索引也会失效。**

### 9、不等于比较

示例：

```sql
explain select * from t_user where id_no <> '1002';
```

`explain`结果：

![](/attachments/f88f13f4773f1d7db197912fa801f55330e2ba.jpg)

索引-不等

当查询条件为字符串时，使用`<>`或`!=`作为条件查询，有可能不走索引，但也不全是。

```sql
explain select * from t_user where create_time != '2022-02-27 09:56:42';
```

上述SQL中，由于`2022-02-27 09:56:42`是存储过程在同一秒生成的，大量数据是这个时间。执行之后会发现，当查询结果集占比比较小时，会走索引，占比比较大时不会走索引。此处与结果集与总体的占比有关。

需要注意的是：上述语句如果是`id`进行不等操作，则正常走索引。

```sql
explain select * from t_user where id != 2;
```

`explain`结果：

![](/attachments/d4f3ce2714c27f4af6e9605ba826afa1666c5b.jpg)

不等-ID

**第九种索引失效情况：查询条件使用不等进行比较时，需要慎重，普通索引会查询结果集占比较大时索引会失效。**

### 10、is not null

示例：

```sql
explain select * from t_user where id_no is not null;
```

`explain`结果：

![](/attachments/037f61b8691edc5d5e48895f19b44fa361f6ac.jpg)

索引-is not null

**第十种索引失效情况：查询条件使用`is null`时正常走索引，使用`is not null`时，不走索引。**

### 11、not in和not exists

在日常中使用比较多的范围查询有`in`、`exists`、`not in`、`not exists`、`between and`等。

```sql
explain select * from t_user where id in (2,3);

explain select * from t_user where id_no in ('1001','1002');

explain select * from t_user u1 where exists (select 1 from t_user u2 where u2.id  = 2 and u2.id = u1.id);

explain select * from t_user where id_no between '1002' and '1003';
```

上述四种语句执行时都会正常走索引，具体的`explain`结果就不再展示。主要看不走索引的情况：

```sql
explain select * from t_user where id_no not in('1002' , '1003');
```

`explain`结果：

![](/attachments/68ed8df972ce4621ca5979f22db89b0f713b51.jpg)

索引-not in

当使用`not in`时，不走索引?把条件列换成主键试试：

```sql
explain select * from t_user where id not in (2,3);
```

`explain`结果：

![](/attachments/d84b371582e8f4bff9213587783cde3a23c8cf.jpg)

主键-not in

如果是主键，则正常走索引。

**第十一种索引失效情况`not in`：查询条件使用`not in`时，如果是主键则走索引，如果是普通索引，则索引失效。**

再来看看`not exists`：

```sql
explain select * from t_user u1 where not exists (select 1 from t_user u2 where u2.id  = 2 and u2.id = u1.id);
```

`explain`结果：

![](/attachments/823542d28fd53af78221214b04e1ff23413db6.jpg)

索引-not in

当查询条件使用`not exists`时，不走索引。

**第十一种索引失效情况`not exists`：查询条件使用`not exists`时，索引失效。**

### 12、order by导致索引失效

示例：

```sql
explain select * from t_user order by id_no ;
```

`explain`结果：

![](/attachments/b35e6b61460a813a147441a61eeb4a4c83eac0.jpg)

索引-order by

其实这种情况的索引失效很容易理解，毕竟需要对全表数据进行排序处理。

那么，添加删`limit`关键字是否就走索引了呢?

```sql
explain select * from t_user order by id_no limit 10;
```

`explain`结果：

![](/attachments/11f565b49dea3fbe1b8809c376268f597b418a.jpg)

order by limit

结果依旧不走索引。在网络上看到有说如果`order by`条件满足最左匹配则会正常走索引， 在当前`8.0.18`版本中并未出现。所以，在基于`order by`和`limit`进行使用时，要特别留意。是否走索引不仅涉及到数据库版本，还要看mysql优化器是如何处理的。

这里还有一个特例，就是主键使用`order by`时，可以正常走索引。

```sql
explain select * from t_user order by id desc;
```

`explain`结果：

![](/attachments/f2482e858f7f2bf2321868ffbf063ff62fb9ed.jpg)

主键-order by

可以看出针对主键，还是`order by`可以正常走索引。

另外，笔者测试如下SQL语句：

```sql
explain select id from t_user order by age;
explain select id , username from t_user order by age;
explain select id_no from t_user order by id_no;
```

上述三条SQL语句都是走索引的，也就是说**覆盖索引**的场景也是可以正常走索引的。

现在将`id`和`id_no`组合起来进行`order by`：

```sql
explain select * from t_user order by id,id_no desc;
explain select * from t_user order by id,id_no desc limit 10;
explain select * from t_user order by id_no desc,username desc;
```

`explain`结果：

![](/attachments/a5bec7975f9577766da744f89f213cdaa10011.jpg)

orderby多索引

上述两个SQL语句，都未走索引。

**第十三种索引失效情况：当查询条件涉及到`order by`、`limit`等条件时，是否走索引情况比较复杂，而且与mysql版本有关，通常普通索引，如果未使用`limit`，则不会走索引。`order by`多个索引字段时，可能不会走索引。其他情况，建议在使用时进行`expain`验证。**

### 13、参数不同导致索引失效

此时，如果你还未执行最开始创建的存储过程，建议你先执行一下存储过程，然后执行如下SQL：

```sql
explain select * from t_user where create_time > '2023-02-24 09:04:23';
```

其中，时间是未来的时间，确保能够查到数据。

`explain`结果：

![](/attachments/81f486858a5f263ab7f574057e8bd8887598af.jpg)

索引-参数

可以看到，正常走索引。

随后，我们将查询条件的参数换个日期：

```sql
explain select * from t_user where create_time > '2022-02-27 09:04:23';
```

`explain`结果：

![](/attachments/827d6fb59e22d5690ee605882fb1f05a2ba3f7.jpg)

索引-参数

此时，进行了**全表扫描**。这也是最开始提到的奇怪的现象。

为什么同样的查询语句，只是查询的参数值不同，却会出现一个走索引，一个不走索引的情况呢?

**答案很简单：上述索引失效是因为DBMS发现全表扫描比走索引效率更高，因此就放弃了走索引。**

也就是说，当Mysql发现通过索引扫描的行记录数超过全表的`10%-30%`时，优化器可能会放弃走索引，自动变成全表扫描。某些场景下即便强制SQL语句走索引，也同样会失效。

类似的问题，在进行范围查询(比如`>、< 、>=、<=、in`等条件)时往往会出现上述情况，而上面提到的临界值根据场景不同也会有所不同。

**第十四种索引失效情况：当查询条件为大于等于、`in`等范围查询时，根据查询结果占全表数据比例的不同，优化器有可能会放弃索引，进行全表扫描。**

### 14、其他

当然，还有其他一些是否走索引的规则，这与索引的类型是B-tree索引还是位图索引也有关系，就不再详细展开。

**这里要说的其他，可以总结为第十五种索引失效的情况：Mysql优化器的其他优化策略，比如优化器认为在某些情况下，全表扫描比走索引快，则它就会放弃索引。**

针对这种情况，一般不用过多理会，当发现问题时再定点排查即可。

## 参考资料

*   [https://www.51cto.com/article/702691.html](https://www.51cto.com/article/702691.html)
*   [https://xiaolincoding.com/mysql/index/index\_lose.html](https://xiaolincoding.com/mysql/index/index_lose.html)



