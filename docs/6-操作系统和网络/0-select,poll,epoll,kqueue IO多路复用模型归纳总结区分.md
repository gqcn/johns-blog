---
slug: "/io-multiplexing-models"
title: "select,poll,epoll,kqueue IO多路复用模型归纳总结区分"
hide_title: true
keywords:
  [
    "IO多路复用",
    "select",
    "poll",
    "epoll",
    "kqueue",
    "系统调用",
    "网络编程",
    "性能优化",
  ]
description: "深入分析和对比各种IO多路复用模型的实现原理、特点和使用场景，包括select、poll、epoll和kqueue等系统调用的详细介绍"
---

## select、poll、epoll与kqueue简介

|     |     |
| --- | --- |
| **select** | select本质上是通过设置或者检查存放fd标志位的数据结构来进行下一步处理。这样所带来的缺点是：<br/><br/>*   单个进程可监视的fd数量被限制<br/>*   需要维护一个用来存放大量fd的数据结构，这样会使得用户空间和内核空间在传递该结构时复制开销大<br/>*   对socket进行扫描时是**线性扫描** |
| **poll** | *   **poll本质上和select没有区别**，它将用户传入的数组拷贝到**内核空间**，然后查询每个fd对应的设备状态，如果设备就绪则在设备等待队列中加入一项并继续遍历，如果遍历完所有fd后没有发现就绪设备，则挂起当前进程，直到设备就绪或者主动超时，被唤醒后它又要再次遍历fd。这个过程经历了多次无谓的遍历。<br/>*   它没有最大连接数的限制，原因是它是基于链表来存储的，但是同样有一个缺点：大量的fd的数组被整体复制于用户态和内核地址空间之间，而不管这样的复制是不是有意义。<br/>*   poll还有一个特点是“**水平触发**”：如果报告了fd后，没有被处理，那么下次poll时会再次报告该fd。 |
| **epoll** | *   epoll支持**水平触发**和**边缘触发**，最大的特点在于边缘触发，它只告诉进程哪些fd刚刚变为就需态，并且只会通知一次。<br/>*   在前面说到的复制问题上，epoll使用mmap减少复制开销。<br/>*   还有一个特点是，**epoll使用“事件”的就绪通知方式**，通过epoll\_ctl注册fd，一旦该fd就绪，内核就会采用类似callback的回调机制来激活该fd，epoll\_wait便可以收到通知。<br/>*   epoll 使用红黑树 (RB-tree) 数据结构来跟踪当前正在监视的所有文件描述符。 |
| **kqueue  <br/>** | *   kqueue和epoll一样，都是用来替换select和poll的。**不同的是kqueue被用在FreeBSD,NetBSD, OpenBSD, DragonFly BSD, 和 macOS中**。<br/>*   kqueue 不仅能够处理文件描述符事件，还可以用于各种其他通知，例如文件修改监视、信号、异步 I/O 事件 (AIO)、子进程状态更改监视和支持纳秒级分辨率的计时器，此外kqueue提供了一种方式除了内核提供的事件之外，还可以使用用户定义的事件。 |

注：

*   水平触发（level-triggered）：只要满足条件，就触发一个事件(只要有数据没有被获取，内核就不断通知你)。
*   边缘触发（edge-triggered）：每当状态变化时，触发一个事件。

## select、poll、epoll与kqueue区别

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
|     | select | poll | epoll | kqueue |
| 支持最大连接数 | 1024（x86） or 2048（x64） | 无上限 | 无上限 | 无上限 |
| IO效率 | 每次调用进行线性遍历，时间复杂度为O(N) | 每次调用进行线性遍历，时间复杂度为O(N) | 使用“事件”通知方式，每当fd就绪，系统注册的回调函数就会被调用，将就绪fd放到rdllist里面，这样epoll\_wait返回的时候我们就拿到了就绪的fd。时间发复杂度O(1)。 | 同epoll |
| fd拷贝 | 每次select都拷贝 | 每次poll都拷贝 | 调用epoll\_ctl时拷贝进内核并由内核保存，之后每次epoll\_wait不拷贝 | 同epoll |

## 总结

当同时需要保持很多的长连接，而且连接的开关很频繁时，就能够发挥epoll最大的优势了。这里与服务器模型其实已经有些交集了。

同时需要保持很多的长连接，而且连接的开关很频繁，最高效的模型是非阻塞、异步IO模型。而且不要用select/poll，这两个API的有着O(N)的时间复杂度。**在Linux用epoll，BSD用kqueue，Windows用IOCP，或者用libevent封装的统一接口（对于不同平台libevent实现时采用各个平台特有的API），这些平台特有的API时间复杂度为O(1)**。 然而在非阻塞，异步I/O模型下的编程是非常痛苦的。由于I/O操作不再阻塞，报文的解析需要小心翼翼，并且需要亲自管理维护每个链接的状态。并且为了充分利用CPU，还应结合线程池，避免在轮询线程中处理业务逻辑。

但这种模型的效率是极高的。以知名的http服务器nginx为例，可以轻松应付上千万的空连接+少量活动链接，每个连接连接仅需要几K的内核缓冲区，想要应付更多的空连接，只需简单的增加内存（数据来源为淘宝一位工程师的一次技术讲座，并未实测）。这使得DDoS攻击者的成本大大增加，这种模型攻击者只能将服务器的带宽全部占用，才能达到目的，而两方的投入是不成比例的。

注：

*   长连接：连接后始终不断开，然后进行报文发送和接受。
*   短链接：每一次通讯都建立连接，通讯完成即断开连接，下次通讯再建立连接。

## 参考资料

*   [http://xingyunbaijunwei.blog.163.com/blog/static/76538067201241685556302/](http://xingyunbaijunwei.blog.163.com/blog/static/76538067201241685556302/)
*   [http://blog.csdn.net/nailding2/article/details/6858199](http://blog.csdn.net/nailding2/article/details/6858199)
*   [http://www.cnblogs.com/xuxm2007/archive/2011/08/15/2139809.html](http://www.cnblogs.com/xuxm2007/archive/2011/08/15/2139809.html)
*   [http://www.zhihu.com/question/20114168](http://www.zhihu.com/question/20114168)
*   [http://www.doc88.com/p-106261947803.html](http://www.doc88.com/p-106261947803.html)
*   [http://donghao.org/2009/08/linuxiapolliepollaueouaeaeeio.html](http://donghao.org/2009/08/linuxiapolliepollaueouaeaeeio.html)
*   [https://juejin.cn/post/7071118804855554061](https://juejin.cn/post/7071118804855554061)

  

