---
slug: /notes/goland-debug-issue
title: Goland Debug无法进入断点位置
hide_title: true
description: 解决MacOS上Goland Debug功能无法进入断点位置的问题，与XCode缓存有关
keywords: [Goland, Debug, 断点, MacOS, XCode, Go, dlv]
---


## 背景

- 系统：`MacOS 15.3.2 (24D2082) M4`芯片
- `Go`版本：`1.22.x`到`1.24.x`
- `Goland`版本：`2024.3.5`



今天突然发现`Goland`的`Debug`功能失效了，`Debug`代码时无法进入断点位置。比如以下的这段`Hello World`程序：

![alt text](<assets/Goland Debug无法进入断点位置/image.png>)

启动`Debug`后，总是会跳转到`asm_arm64.s`的源码文件处：

![alt text](<assets/Goland Debug无法进入断点位置/image-1.png>)

`Goland`版本为当前最新版本`2024.3.5`：

![alt text](<assets/Goland Debug无法进入断点位置/image-2.png>)


## 解决

在`Google`了一番，类似的问题包括`dlv`版本与`Go`版本不兼容、`Go`编译参数问题都尝试过，并没有解决。直到看到这篇文章：https://github.com/golang/vscode-go/issues/3081

尝试清理`XCode`的缓存：

```bash
sudo rm -rf /Library/Developer/CommandLineTools
```

再次执行`Debug`时便恢复了。

![alt text](<assets/Goland Debug无法进入断点位置/image-3.png>)

## 存疑

但是按照`issue`上的方式重新安装`XCode`后，问题重新出现。

```bash
xcode-select --install
```

感觉可能是`Goland`或者`dlv`工具与最新版本的`XCode`不兼容，导致`Debug`功能失效。目前暂时不安装`XCode`，待进一步观察情况。