---
slug: "/observability/prometheus-query-functions"
title: "Prometheus: 查询函数"
hide_title: true
keywords: [Prometheus, PromQL, 查询函数, 监控, Grafana, 时间序列, 聚合函数, rate, increase, histogram]
description: "详细介绍Prometheus的完整查询函数列表及其用法，包括数学函数、时间函数、聚合函数、直方图函数等，以及Grafana中查询Prometheus数据时的特有变量和函数。"
---

参考`Prometheus`官网文档：https://prometheus.io/docs/prometheus/latest/querying/functions/

## 数学函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `abs()` | 返回输入向量中所有浮点样本的绝对值 | 包含绝对值的向量 |
| `ceil()` | 向上取整到最接近的整数 | 向上取整后的向量 |
| `floor()` | 向下取整到最接近的整数 | 向下取整后的向量 |
| `round()` | 四舍五入到最接近的整数 | 四舍五入后的向量 |
| `exp()` | 计算指数函数`e^x` | 指数值向量 |
| `ln()` | 计算自然对数 | 自然对数向量 |
| `log2()` | 计算以`2`为底的对数 | 对数向量 |
| `log10()` | 计算以`10`为底的对数 | 对数向量 |
| `sqrt()` | 计算平方根 | 平方根向量 |
| `sgn()` | 返回符号：正数返回`1`，负数返回`-1`，零返回`0` | 符号向量 |

**常用示例：**

```shell
# 取绝对值
abs(temperature)

# 向上取整
ceil(cpu_usage)  # 1.49 → 2.0

# 向下取整
floor(memory_usage)  # 1.78 → 1.0

# 四舍五入到最接近的0.5
round(latency, 0.5)
```

## 限制函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `clamp()` | 将值限制在指定的最小值和最大值之间 | 限制后的向量 |
| `clamp_max()` | 将值限制在指定的最大值以下 | 限制后的向量 |
| `clamp_min()` | 将值限制在指定的最小值以上 | 限制后的向量 |

**常用示例：**

```shell
# 将CPU使用率限制在0-100之间
clamp(cpu_usage, 0, 100)

# 将内存使用限制在1024以下
clamp_max(memory_usage_bytes, 1024*1024*1024)

# 确保磁盘使用率不为负数
clamp_min(disk_usage, 0)
```

## 时间和日期函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `time()` | 返回自`1970年1月1日UTC`以来的秒数 | 当前时间戳（秒） |
| `timestamp()` | 返回向量中每个样本的时间戳 | 时间戳向量 |
| `minute()` | 返回时间戳的分钟部分（`0-59`） | 分钟值向量 |
| `hour()` | 返回时间戳的小时部分（`0-23`） | 小时值向量 |
| `day_of_week()` | 返回星期几（`0-6`，`0`表示星期日） | 星期值向量 |
| `day_of_month()` | 返回月份中的第几天（`1-31`） | 日期值向量 |
| `day_of_year()` | 返回一年中的第几天（`1-365/366`） | 天数值向量 |
| `days_in_month()` | 返回月份的天数（`28-31`） | 天数值向量 |
| `month()` | 返回月份（`1-12`） | 月份值向量 |
| `year()` | 返回年份 | 年份值向量 |

**常用示例：**

```shell
# 获取当前小时（0-23）
hour()

# 获取指标的时间戳
timestamp(up)

# 只在工作日（周一到周五）执行告警
day_of_week() > 0 and day_of_week() < 6

# 获取当前月份
month()
```

## 变化率和增长函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `rate()` | 计算时间序列的每秒平均增长率（用于`Counter`） | 每秒增长率向量 |
| `irate()` | 计算时间序列的瞬时增长率（基于最后两个数据点） | 瞬时增长率向量 |
| `increase()` | 计算时间范围内的增长量（用于`Counter`） | 增长量向量 |
| `delta()` | 计算时间范围内的差值（用于`Gauge`） | 差值向量 |
| `idelta()` | 计算最后两个样本之间的差值（用于`Gauge`） | 差值向量 |
| `deriv()` | 计算时间序列的每秒导数（使用简单线性回归） | 导数向量 |
| `predict_linear()` | 基于线性回归预测未来值 | 预测值向量 |
| `changes()` | 返回时间范围内值变化的次数 | 变化次数向量 |
| `resets()` | 返回`Counter`重置的次数 | 重置次数向量 |

**常用示例：**

```shell
# 计算HTTP请求的每秒速率
rate(http_requests_total[5m])

# 计算过去5分钟的请求增长量
increase(http_requests_total[5m])

# 计算CPU温度在2小时内的变化
delta(cpu_temp_celsius[2h])

# 预测1小时后的磁盘使用量（3600秒后）
predict_linear(disk_usage_bytes[1h], 3600)
```

## 聚合函数（时间范围）

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `avg_over_time()` | 计算时间范围内的平均值 | 平均值向量 |
| `min_over_time()` | 计算时间范围内的最小值 | 最小值向量 |
| `max_over_time()` | 计算时间范围内的最大值 | 最大值向量 |
| `sum_over_time()` | 计算时间范围内的总和 | 总和向量 |
| `count_over_time()` | 计算时间范围内的样本数量 | 样本数量向量 |
| `quantile_over_time()` | 计算时间范围内的分位数 | 分位数向量 |
| `stddev_over_time()` | 计算时间范围内的标准差 | 标准差向量 |
| `stdvar_over_time()` | 计算时间范围内的方差 | 方差向量 |
| `last_over_time()` | 返回时间范围内的最后一个样本 | 最后样本向量 |
| `present_over_time()` | 如果时间范围内有任何样本则返回1 | 0或1的向量 |

**常用示例：**

```shell
# 计算过去5分钟CPU使用率的平均值
avg_over_time(cpu_usage[5m])

# 获取过去1小时温度的最大值
max_over_time(temperature[1h])

# 计算过去5分钟的95分位延迟
quantile_over_time(0.95, http_request_duration_seconds[5m])

# 检查指标在过去5分钟内是否有数据
present_over_time(up[5m])
```

## 实验性聚合函数（需要启用特性标志）

这些函数需要通过 `--enable-feature=promql-experimental-functions` 启用。

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `mad_over_time()` | 计算时间范围内的中位数绝对偏差 | `MAD`值向量 |
| `first_over_time()` | 返回时间范围内的第一个样本 | 第一个样本向量 |
| `ts_of_first_over_time()` | 返回第一个样本的时间戳 | 时间戳向量 |
| `ts_of_last_over_time()` | 返回最后一个样本的时间戳 | 时间戳向量 |
| `ts_of_min_over_time()` | 返回最小值样本的时间戳 | 时间戳向量 |
| `ts_of_max_over_time()` | 返回最大值样本的时间戳 | 时间戳向量 |
| `double_exponential_smoothing()` | 双指数平滑（`Holt Linear`） | 平滑值向量 |

**常用示例：**

```shell
# 获取时间范围内的第一个样本
first_over_time(metric[5m])

# 获取最大值出现的时间戳
ts_of_max_over_time(cpu_usage[1h])

# 双指数平滑（平滑因子0.5，趋势因子0.5）
double_exponential_smoothing(metric[5m], 0.5, 0.5)
```

## 直方图函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `histogram_count()` | 返回直方图中的观测数量 | 计数向量 |
| `histogram_sum()` | 返回直方图中的观测总和 | 总和向量 |
| `histogram_avg()` | 返回直方图的算术平均值 | 平均值向量 |
| `histogram_quantile()` | 计算直方图的分位数 | 分位数向量 |
| `histogram_fraction()` | 计算指定范围内的观测比例 | 比例向量 |
| `histogram_stddev()` | 返回直方图的标准差估计值 | 标准差向量 |
| `histogram_stdvar()` | 返回直方图的方差估计值 | 方差向量 |

**常用示例：**

```shell
# 计算90分位的请求延迟（经典直方图）
histogram_quantile(0.9, rate(http_request_duration_seconds_bucket[10m]))

# 计算平均请求延迟（原生直方图）
histogram_avg(rate(http_request_duration_seconds[5m]))

# 计算200ms以内请求的比例
histogram_fraction(0, 0.2, rate(http_request_duration_seconds[1h]))

# 按job聚合计算90分位延迟
histogram_quantile(0.9, sum by (job, le) (rate(http_request_duration_seconds_bucket[10m])))
```

## 标签操作函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `label_join()` | 将多个标签的值连接成新标签 | 带新标签的向量 |
| `label_replace()` | 使用正则表达式替换标签值 | 替换后的向量 |

**常用示例：**

```shell
# 将多个标签连接成新标签
label_join(up{job="api-server"}, "endpoint", ":", "instance", "port")

# 使用正则提取标签的一部分
label_replace(up{service="api:v1"}, "version", "$1", "service", ".*:(.*)")

# 从instance标签中提取主机名
label_replace(up, "host", "$1", "instance", "([^:]+):.*")
```

## 排序函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `sort()` | 按样本值升序排序 | 排序后的向量 |
| `sort_desc()` | 按样本值降序排序 | 排序后的向量 |
| `sort_by_label()` | 按标签值升序排序（实验性） | 排序后的向量 |
| `sort_by_label_desc()` | 按标签值降序排序（实验性） | 排序后的向量 |

**常用示例：**

```shell
# 按请求数降序排列
sort_desc(http_requests_total)

# 按instance标签升序排列
sort_by_label(up, "instance")
```

## 缺失值检测函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `absent()` | 如果向量为空则返回`1`，否则返回空向量 | `0`或`1`的向量 |
| `absent_over_time()` | 如果时间范围内向量为空则返回`1` | `0`或`1`的向量 |

**常用示例：**

```shell
# 检测指标是否不存在（用于告警）
absent(up{job="api-server"})

# 检测过去1小时内是否没有数据
absent_over_time(up{job="api-server"}[1h])
```

## 类型转换函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `scalar()` | 将单元素向量转换为标量 | 标量值或`NaN` |
| `vector()` | 将标量转换为向量 | 单元素向量 |

**常用示例：**

```shell
# 将聚合结果转换为标量用于计算
scalar(sum(up))

# 将常量转换为向量
vector(100)
```

## 元数据函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `info()` | 返回包含`info`标签的指标信息 | `info`类型指标 |

**常用示例：**

```shell
# 获取目标的元数据信息
target_info
```

## 三角函数

| 函数名称 | 函数描述 | 返回值 |
|---------|---------|--------|
| `acos()` | 反余弦函数 | 反余弦值向量 |
| `acosh()` | 反双曲余弦函数 | 反双曲余弦值向量 |
| `asin()` | 反正弦函数 | 反正弦值向量 |
| `asinh()` | 反双曲正弦函数 | 反双曲正弦值向量 |
| `atan()` | 反正切函数 | 反正切值向量 |
| `atanh()` | 反双曲正切函数 | 反双曲正切值向量 |
| `cos()` | 余弦函数 | 余弦值向量 |
| `cosh()` | 双曲余弦函数 | 双曲余弦值向量 |
| `sin()` | 正弦函数 | 正弦值向量 |
| `sinh()` | 双曲正弦函数 | 双曲正弦值向量 |
| `tan()` | 正切函数 | 正切值向量 |
| `tanh()` | 双曲正切函数 | 双曲正切值向量 |
| `deg()` | 将弧度转换为角度 | 角度值向量 |
| `rad()` | 将角度转换为弧度 | 弧度值向量 |
| `pi()` | 返回`π`的值 | `π`值 |

**常用示例：**

```shell
# 获取π的值
pi()

# 将角度转换为弧度
rad(90)  # 结果约为1.5708

# 将弧度转换为角度
deg(pi())  # 结果为180
```
