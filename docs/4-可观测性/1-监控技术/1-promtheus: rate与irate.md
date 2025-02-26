---
slug: "/prometheus-rate-irate"
title: "promtheus: rate与irate"
hide_title: true
keywords: ["Prometheus", "rate", "irate", "监控", "指标计算", "时序数据"]
description: "深入解析 Prometheus 中 rate 和 irate 函数的区别和使用场景，帮助用户更好地理解和选择合适的指标计算方法"
---

`irate`和`rate`都会用于计算某个指标在一定时间间隔内的变化速率。但是它们的计算方法有所不同：`irate`取的是在指定时间范围内的**最近两个数据点**来算速率，而`rate`会取指定时间**范围内所有数据点**，算出一组速率，然后取平均值作为结果。

所以官网文档说：`irate`适合快速变化的计数器（`counter`），而`rate`适合缓慢变化的计数器（`counter`）。

根据以上算法我们也可以理解，对于快速变化的计数器，如果使用`rate`，因为使用了平均值，很容易把峰值削平。除非我们把时间间隔设置得足够小，就能够减弱这种效应。

## `rate`

该函数用来计算某个指标在最近一个区间时间内的变化率，它只能用来计算`Counter`类型的指标。  
比如说，`Prometheus`每`15`秒采集一次数据，当某个指标`metric1`的数据采集如下：

|     |     |
| --- | --- |
| **timestamp** | **value** |
| ... | ... |
| 15:00:00 | 10000 |
| 15:00:15 | 10030 |
| 15:00:30 | 10045 |
| 15:00:45 | 10090 |

  
假设当前时间为`15:00:50`，我们执行PromQL语句`rate(metric1[1m])`，该语句的返回值为`2`，计算过程如下：

> `Prometheus`会查找`PromQL`语句执行时，`1m`内`（14:59:51 - 15:00:50）`该指标的采集点，找到如上**四**个采集点，然后用该区间最后一个采集点与第一个采集点的`value`差，除以两个采集点的时间差（秒），即`(10090-10000)/(15:00:45-15:00:00)=2`。

  
**需要注意的是，时间区间的值至少要为采样间隔的两倍，因为只有这样才能保证时间区间内有两个采样点**。比如上面的例子中，假设时间区间设为`29`秒，`PromQL`语句的执行时间为`15:00:59.99`秒，那么它会查找`[15:00:30.99, 15:00:59.99]`时间内的采集点，发现只有一个，那么就没有办法计算，就会报`No datapoints found`的错误。

## `irate`

该函数与`rate`函数不同的是，它是用区间内的最后一个采集点与倒数第二个采集点的`value`差，除以两个采集点的时间差。即`15:00:50`执行语句`irate(metric1[1m])`时，计算出来的值为`(10090-10045)/(15:00:45-15:00:30)=3`

## 参考链接

*   [https://pshizhsysu.gitbook.io/prometheus/prometheus/promql/nei-zhi-han-shu/rate](https://pshizhsysu.gitbook.io/prometheus/prometheus/promql/nei-zhi-han-shu/rate)
*   [https://blog.csdn.net/palet/article/details/82763695](https://blog.csdn.net/palet/article/details/82763695)
*   [https://prometheus.io/docs/prometheus/latest/querying/functions/](https://prometheus.io/docs/prometheus/latest/querying/functions/)

  

  

  

