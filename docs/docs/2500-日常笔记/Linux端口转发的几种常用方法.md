---
slug: "/notes/linux-port-forwarding-methods"
title: "Linux端口转发的几种常用方法"
hide_title: true
keywords: ["Linux", "网络配置", "端口转发", "SSH隧道", "iptables", "系统管理"]
description: "详细介绍Linux系统下实现端口转发的多种方法，包括SSH隧道、iptables等常用技术"
---

## `SSH` 端口转发

`SSH`提供了一个非常有意思的功能，就是端口转发，它能够将其他 `TCP` 端口的网络数据通过 `SSH` 链接来转发，并且自动提供了相应的加密及解密服务。

（1）本地端口转发

```bash
ssh -fgN -L 2222:localhost:22 localhost
```

（2）远程端口转发

```bash
ssh -fgN -R 2222:host1:22 localhost
```

（3）动态转发

```bash
ssh -fgN -D 12345 root@host1
```

## `iptables` 端口转发

`CentOS 7.0` 以下使用的是`iptables`，可以通过`iptables`实现数据包的转发。

（1）开启数据转发功能

```bash
vi /etc/sysctl.conf     
## 增加一行 net.ipv4.ip_forward=1

## 使数据转发功能生效
sysctl -p
```

（2）将本地的端口转发到本机端口

```bash
iptables -t nat -A PREROUTING -p tcp --dport 2222 -j REDIRECT --to-port 22
```

（3）将本机的端口转发到其他机器

```bash
iptables -t nat -A PREROUTING -d 192.168.172.130 -p tcp --dport 8000 -j DNAT --to-destination 192.168.172.131:80
iptables -t nat -A POSTROUTING -d 192.168.172.131 -p tcp --dport 80 -j SNAT --to 192.168.172.130

## 清空nat表的所有链
iptables -t nat -F PREROUTING
```

## `firewall` 端口转发

`CentOS 7.0`以上使用的是`firewall`，通过命令行配置实现端口转发。

（1）开启伪装IP

```bash
firewall-cmd --permanent --add-masquerade
```

（2）配置端口转发，将到达本机的`12345`端口的访问转发到另一台服务器的`22`端口。

```bash
firewall-cmd --permanent --add-forward-port=port=12345:proto=tcp:toaddr=192.168.172.131:toport=22
```

（3）重新载入，使其失效。

```bash
firewall-cmd --reload
```

## `rinetd` 端口转发

`rinetd`是一个轻量级`TCP`转发工具，简单配置就可以实现端口映射/转发/重定向。

（1）源码下载

```bash
wget https://li.nux.ro/download/nux/misc/el7/x86_64/rinetd-0.62-9.el7.nux.x86_64.rpm
```

（2）安装`rinetd`

```bash
rpm -ivh rinetd-0.62-9.el7.nux.x86_64.rpm
```

（3）编辑配置文件

```bash
vi rinetd.conf     
0.0.0.0 1234 127.0.0.1 22
```

（4）启动转发

```bash
rinetd -c /etc/rinetd.conf
```

## `ncat` 端口转发

`netcat`（简称`nc`）被誉为网络安全界的”瑞士军刀“，一个简单而有用的工具，这里介绍一种使用`netcat`实现端口转发的方法。

（1）安装`ncat`

```bash
yum install nmap-ncat -y
```

（2）监听本机 `9876` 端口，将数据转发到 `192.168.172.131`的 `80` 端口

```bash
ncat --sh-exec "ncat 192.168.172.131 80" -l 9876  --keep-open
```

## `socat` 端口转发

`socat`是一个多功能的网络工具，使用`socat`进行端口转发。

（1）`socat`安装

```bash
yum install -y socat
```

（2）在本地监听`12345`端口，并将请求转发至`192.168.172.131`的`22`端口。

```bash
socat TCP4-LISTEN:12345,reuseaddr,fork TCP4:192.168.172.131:22
```

## `portmap` 端口转发

`Linux` 版的`lcx`，内网端口转发工具。

（1）下载地址：

```bash
http://www.vuln.cn/wp-content/uploads/2016/06/lcx_vuln.cn_.zip
```

（2）监听本地`1234`端口，转发给`192.168.172.131`的`22`端口

```bash
./portmap -m 1 -p1 1234 -h2 192.168.172.131 -p2 22
```



