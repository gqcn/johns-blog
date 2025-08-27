---
slug: "/notes/macos-ssh-proxy-github"
title: "MacOS使用SSH代理访问GitHub"
hide_title: true
keywords: ["macos", "ssh", "proxy", "github", "connect", "socks", "代理", "翻墙"]
description: "解决MacOS环境下通过SSH代理访问GitHub超时问题的完整配置方案"
---


## 背景

某一天，通过`ssh`方式拉取和推送`github`的代码超时失败。DDDD。

## 解决方案


### 前提

本地需要安装有梯子。

本地需要安装有请求转发工具，我这里使用的是`connect`，提前安装好：
```bash
brew install connect
```

创建该文件`~/.ssh/config`，内容如下：
```bash title="config"
Host github.com
  Hostname ssh.github.com
  User git
  Port 443
  # 自己的私钥所在路径
  IdentityFile "~/.ssh/id_ed25519"
  # SOCKS代理设置方法
  ProxyCommand connect -S 127.0.0.1:7890 %h %p
  # HTTPS代理设置方法
  # ProxyCommand connect -H 127.0.0.1:7890 %h %p
```

执行以下命令测试结果：
```bash
% ssh -T git@github.com
Hi gqcn! You've successfully authenticated, but GitHub does not provide shell access.
```


## 参考资料

- https://github.com/orgs/community/discussions/73011
- https://bannirui.github.io/2024/01/24/%E4%BB%A3%E7%90%86git%E7%9A%84ssh%E5%8D%8F%E8%AE%AE/