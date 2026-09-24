---
name: wechat-draft
description: >
  将 johns-blog 的指定 Markdown 文章同步到已登录的微信公众号草稿箱：用文章首图做封面、排版正文、声明原创；
  同标题草稿已存在则更新，不群发。用户要求发到公众号、创建/更新微信草稿、公众号草稿、封面图，
  或使用 /wechat-draft 时必须使用本 skill。
argument-hint: "[文章路径]"
---

# 微信公众号原创草稿

把指定文章做成公众号草稿。登录态来自本机 Chrome 里已经打开的 `mp.weixin.qq.com`，只保存草稿，不群发。

## 边界

- 输入是仓库里的 Markdown 文章（`docs/` 或 `blog/`）。用户指定路径或当前正在写的文章。
- 已有同标题草稿则更新，没有则新建。
- 每篇都声明原创（不允许转载）。
- 封面用正文第一张图（含它前面的 Mermaid 图）。不另行生图，也不沿用旧的插画封面。
- 封面不写标题，也不要左下角的标题或「原创」字样。图里原本就有的文字保留。

## 步骤

1. 读文章 frontmatter 的 `title` / `description` / `slug`。
2. 转公众号 HTML，并同时做成封面：

```bash
node localdocs/wechat-preview/generate.mjs <文章.md>
```

输出目录是 `localdocs/wechat-preview/<slug>/`。生成结果必须符合下方「排版与保存」，不要手改 `wechat-body.html` 绕过生成器。

`generate.mjs` 把正文第一张图写成 `images/cover-235.jpg`（2.35:1，1080×460）。比例与封面不一致时，缩小这张图并居中放进白底画布，让整张图都留在封面里，不裁切。文章没有图片时停下来说明，不要生一张图补上。

3. 写入草稿（脚本会读 Chrome 的 `mp.weixin.qq.com` Cookie，按标题查找草稿，声明原创后创建或更新）：

```bash
.agents/skills/wechat-draft/scripts/publish.sh localdocs/wechat-preview/<slug>
```

4. 把终端里的 `DRAFT_OK`、`create`/`update` 和编辑链接发给用户。没有 `DRAFT_OK` 或进程不是成功退出时，不要说草稿已保存。不要调用群发接口。

会话失效时停下来，让用户用 Chrome 打开 https://mp.weixin.qq.com 重新登录后再跑第 3 步。不要改用 AppID/AppSecret。

## 排版与保存

微信编辑器会改写提交的 HTML。这些行为由 `localdocs/wechat-preview/generate.mjs` 和 `publish-draft.py` 实现。修改这两个文件时保持下列结果，不要改回浏览器里常见、但微信会拆坏的标签。

正文：

- 文首不放目录，也不要「本页目录」。
- 标签之间的换行在提交前去掉。Markdown 软换行收成一个空格，只有硬换行才写成 `<br>`。源码里的换行会被画成空行；出现在列表里就是只有序号、没有内容的空行。
- 列表和标题用块级 `section` 或 `p`，序号与正文写在同一行。
- 代码块的每一行是一个左对齐的 `section`（`text-align:left`，`text-indent:0`），行首空格写成 `&#160;`。高亮用行内 `color`：已知语言走 Prism，纯文本公式区分数字、标识符和运算符。
- 行内代码用 `span`。表格单元格以文本节点开头。单元格若以 `code` 开头，微信会把后面的文字放进块级 `section`，词语后面就会多出一行。
- 表格外框只画一条线。单元格先写 `border:0`，再只给非末列加右边线、非末行加下边线。外框、单元格四边和微信默认边框叠在一起就会变成双线。
- 去掉 MDX 防换行标签 `<span style={{whiteSpace: 'nowrap'}}>…</span>`，只保留内部文字。这段 JSX 不能当 HTML 提交，否则会在正文里显示成标签文本。围栏代码块里的原文保持不动。

草稿：

- 记下的 `appMsgId` 已不在当前草稿列表中时，新建草稿，不要再去更新那条已删除的记录。
- 是否保存成功同时看响应顶层的 `ret` 和 `msg`。顶层 `ret` 非 0 就是失败，即使 `base_resp.ret` 为 0。`320002`（「此草稿已被删除，无法保存」）属于这种情况，脚本必须失败退出。
