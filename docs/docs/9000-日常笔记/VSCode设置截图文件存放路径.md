---
slug: /notes/vscode-image-path-setting
title: VSCode设置截图文件存放路径
hide_title: true
description: 如何在VSCode中设置Markdown截图文件的自动存放路径，使图片文件更有组织性地保存
keywords: [VSCode, Markdown, 截图, 图片路径, 文件管理]
---

1. 打开`Settings`
    ![alt text](assets/VSCode设置截图文件存放路径/image.png)

2. 输入`markdown.copy`, 找到 `Markdown> Copy Files:Destination`
3. 新增项,:
    - Key为: `**/*.md`, value为目标路径：`assets/${documentBaseName}/${fileName}`
    - Key为: `**/*.MD`, value为目标路径：`assets/${documentBaseName}/${fileName}`
    ![alt text](assets/VSCode设置截图文件存放路径/image-1.png)
