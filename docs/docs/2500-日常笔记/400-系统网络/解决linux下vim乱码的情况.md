---
slug: "/notes/linux-vim-encoding-fix"
title: "解决linux下vim乱码的情况"
hide_title: true
keywords: ["Linux", "Vim", "编码", "乱码", "字符集", "配置优化"]
description: "解决 Linux 系统下 Vim 编辑器出现乱码的问题，包括编码设置和配置文件修改方法"
---

```bash
vim ~/.vimrc
```

加入以下内容：

```bash
set fileencodings=utf-8,ucs-bom,gb18030,gbk,gb2312,cp936
set termencoding=utf-8
set encoding=utf-8
```