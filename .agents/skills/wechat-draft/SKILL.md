---
name: wechat-draft
description: >
  将 johns-blog 的指定 Markdown 文章同步到已登录的微信公众号草稿箱：按文章生成封面、排版正文、声明原创；
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
- 封面必须按该文章重新生成，不要拿正文配图或旧封面凑合。

## 步骤

1. 读文章 frontmatter 的 `title` / `description` / `slug`。封面短标题从 `title` 压到 8–16 个字，不要整句标题塞进生图提示词。
2. 生成插画封面（不要把标题画进图里，叠字由脚本完成）：
   - 调用 `image_gen`，`aspect_ratio` 为 `16:9`，提示词用下方 `COVER_PROMPT`，把 `{{TITLE}}` 和 `{{MOTIFS}}` 换成短标题和 3–5 个画面元素。
   - 主体放画面正中，左右可留陪衬。微信会再裁 1:1 分享图，偏题的构图会被切掉。
3. 转公众号 HTML：

```bash
node localdocs/wechat-preview/generate.mjs <文章.md>
```

输出目录是 `localdocs/wechat-preview/<slug>/`。

4. 把生成图裁成 2.35:1 封面并叠上精确标题：

```bash
node localdocs/wechat-preview/compose-cover.mjs \
  --image <image_gen 输出路径> \
  --title "<文章 title>" \
  --out localdocs/wechat-preview/<slug>/images/cover-235.jpg
```

5. 写入草稿（脚本会读 Chrome 的 `mp.weixin.qq.com` Cookie，按标题查找草稿，声明原创后创建或更新）：

```bash
.agents/skills/wechat-draft/scripts/publish.sh localdocs/wechat-preview/<slug>
```

6. 把终端里的 `DRAFT_OK`、`create`/`update` 和编辑链接发给用户。不要调用群发接口。

会话失效时停下来，让用户用 Chrome 打开 https://mp.weixin.qq.com 重新登录后再跑第 5 步。不要改用 AppID/AppSecret。

## COVER_PROMPT

```text
Hand-drawn cartoon cover illustration, landscape banner, generous whitespace.
Sketch lines, crayon and marker look, no photorealism, no 3D, no UI chrome.
One strong central subject that still looks complete when cropped to a center square.
Motifs (simple icons, not paragraphs): {{MOTIFS}}
Theme: {{TITLE}}
Do not render any letters, digits, logos, watermarks, or captions in the image.
```
