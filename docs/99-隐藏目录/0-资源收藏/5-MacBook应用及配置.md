---
slug: "/macbook-app-and-config"
title: "MacBook应用及配置"
hide_title: true
unlisted: false
---

/etc/profile

```bash
# 隐藏zsh切换提醒信息
export BASH_SILENCE_DEPRECATION_WARNING=1

# 常用命令别名
alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias k=kubectl
alias km=kubecm
alias kms='kubecm switch'


# Golang环境变量设置
export GO111MODULE=on
export GOPROXY=https://proxy.golang.org,direct
export GOSUMDB=off
export GOPRIVATE=git.code.oa.com,git.woa.com
export GOINSECURE=git.code.oa.com
export GOROOT=/usr/local/go
export GOPATH=/Users/john/go
export PATH=$GOPATH/bin:$GOROOT/bin:$PATH
```

![](/attachments/image-2024-8-19_14-12-56.png)

![](/attachments/image-2024-8-19_14-13-9.png)