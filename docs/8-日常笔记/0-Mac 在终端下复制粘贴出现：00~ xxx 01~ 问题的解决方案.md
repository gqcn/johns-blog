---
slug: "/notes/mac-terminal-copy-paste-issue"
title: "Mac 在终端下复制粘贴出现：00~ xxx 01~ 问题的解决方案"
hide_title: true
keywords: ["Mac", "终端", "复制粘贴", "括号粘贴模式", "Terminal", "Shell"]
description: "解决 Mac 终端下复制粘贴时出现 00~ xxx 01~ 问题，介绍括号粘贴模式的原理及关闭方法"
---

在 Mac 在终端下复制粘贴字符串的时候，偶然出现了粘贴的字符串收尾会多了一对字符：`00~ xxx 01~`

经过一番研究发现，原来这是终端本身的功能：**括号粘贴模式**。

那这个括号粘贴模式有什么用呢？其实他的用处很简单，当设置了括号粘贴模式时，粘贴的文本用控制序列括起来，以便程序可以区分粘贴的文本和输入的文本。

那为什么终端会打开括号粘贴模式呢？其实大部分情况都不是我们主动开启的，是由个别软件在无意中将括号粘贴模式开启的。

**解决方案**

只需在终端关闭括号粘贴模式即可：

```bash
printf "\e[?2004l"
```

那如果想主动开启括号粘贴模式该如何操作呢？也只需在终端开启括号粘贴模式即可：

```bash
printf "\e[?2004h"
```

  
当开启了括号粘贴模式粘贴的字符串收尾会多了一对字符：`00~ xxx 01~`，不过一般情况下我们把它关闭就可以了。

有关括号粘贴模式详情可参考这两篇文章：

*   [https://cirw.in/blog/bracketed-paste](https://cirw.in/blog/bracketed-paste)
*   [http://www.xfree86.org/current/ctlseqs.html](http://www.xfree86.org/current/ctlseqs.html)