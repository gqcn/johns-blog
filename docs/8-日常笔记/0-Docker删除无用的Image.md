---
slug: "/docker-image-cleanup"
title: "Docker删除无用的Image"
hide_title: true
keywords: ["Docker", "容器技术", "镜像管理", "系统清理", "存储优化", "运维技巧"]
description: "介绍如何有效清理和管理Docker系统中的无用镜像，优化系统存储空间"
---

![](/attachments/image2021-8-24_11-18-6.png)

## 删除`docker`进程不再使用的`image`

```bash
docker system prune -a --volumes
```

::: warning
当您的`docker`占用过多的空间时，该命令执行可能会比较耗时。
:::

![](/attachments/image2022-4-20_17-46-45.png)

![](/attachments/image2022-4-20_17-55-56.png)

![](/attachments/image2022-4-20_17-56-9.png)

![](/attachments/image2022-4-20_17-56-30.png)

## 通过`grep`过滤批量删除`image`

```bash
docker images | grep 'ccr.ccs.tencentyun.com/cdb.khaos' | awk '{print $3}' | sort | uniq | xargs docker rmi
```

![](/attachments/image2021-8-24_11-19-10.png)

结合`-f`参数强制性删除`image`

![](/attachments/image2021-8-24_11-23-40.png)

