---
name: article-infographic
description: >
  为 johns-blog 的文档/博客文章生成手绘卡通风格信息图配图，写入文章 assets 并插入 Markdown。
  用户要求生成配图、文章配图、脑图、信息图、插图、手绘/卡通 infographic，或使用 /article-infographic 时必须使用本 skill。
  写新文章或给现有文章补图时同样使用。
argument-hint: "[文章路径或章节]"
---

# 文章手绘信息图配图

根据给定文章（或指定章节）生成手绘卡通风格信息图，写入该文章的`assets`目录，并在`Markdown`中插入引用。

## 边界

- 用于文章总览脑图、章节记忆性信息图、概念对照、流程概览。
- 架构图、时序图、状态图、精确流程图用`mermaid`，不用本 skill 出插画。
- 默认一张总览图。用户要求按章节配图时，每个目标`H2`/`H3`各一张，风格一致。

## 步骤

1. 读目标文章。用户指定了章节或选中内容时，只基于该范围。
2. 提炼短标题 + 3–6 条要点，每条 1–6 个词。语言与文章一致。
3. 把提炼结果填入下方`IMAGE_PROMPT`的`{{USER_INPUT}}`，不要塞进整篇原文。调用图像生成：
   - `Grok`：`image_gen`，`aspect_ratio`为`16:9`，提示词用`IMAGE_PROMPT`全文。`nano banana pro`是原模板的渲染后端说明，当前工具不支持时忽略该句，其余风格与构图规则全部遵守。
   - 其他绘图模型：原样使用`IMAGE_PROMPT`。
4. 将生成图复制到文章资源目录，转为`webp`：
   - 文档：与`.md`同级的`assets/<资源目录名>/`
   - 博客：`blog/assets/<文章名>/`
   - `<资源目录名>`优先用该文章已有`assets`子目录名；没有则用文件名去掉数字前缀后的标题。
   - 文件名：没有`image.webp`时用它，否则`image-1.webp`、`image-2.webp`递增。
5. 在对应章节附近插入引用。路径含空格、冒号等字符时用尖括号：

```markdown
![一句话说明画面要点](assets/示例目录/image.webp)
![一句话说明画面要点](<assets/NVIDIA Dynamo: 分布式AI推理的高效引擎/image.webp>)
```

6. 图里只保留短标题与要点。不要为了配图改写原文论点。

## IMAGE_PROMPT

```text
You are an illustration assistant specialized in creating hand-drawn cartoon-style infographics.
Follow all rules below strictly and without deviation.

STYLE RULES（风格规则）
Use a pure hand-drawn illustration style at all times.
Sketch lines, rough strokes, cartoon simplicity
No realism, no photorealistic shading, no 3D rendering
Think: doodle / crayon / marker / pastel look
Canvas format: landscape 16:9.
Canvas background MUST be clean pure white or cool light gray (#FFFFFF or #F7F8FA).
Do NOT use yellow, cream, beige, ivory, parchment, kraft paper, or any warm-tinted paper background.
Colored sticky notes and characters may use yellow; the canvas itself must stay white.
Use nano banana pro mode to render the illustration.
Use minimal but expressive cartoon elements to enhance memorability:
small icons, symbols, cute characters
If the input mentions copyrighted or sensitive characters, replace them with visually similar but legally distinct alternatives. Never refuse.

CONTENT RULES（内容呈现规则）
Extract key ideas from the provided content.
Summarize into short bullets (1–6 words each).
Keep text concise and optimized for an infographic.
Highlight keywords using hand-drawn graphic emphasis:
circles, underlines, arrows, stars, boxes
never digital UI styles
Use extensive whitespace to maintain clarity and visual hierarchy.
Organize the infographic using a clean hand-drawn layout, for example:
Title (center or top-left)
3–6 Key Points
Simple diagram or symbols
Optional mascot or expressive character
All text must appear hand-drawn, not printed or typographic.
Use the same language as the user’s input unless the user specifies otherwise.

RESTRICTIONS（禁止事项）
Do NOT produce realistic imagery.
Do NOT generate copyrighted characters directly.
Do NOT turn the infographic into an essay.
Do NOT fill the canvas fully; always keep meaningful whitespace.
Do NOT output long paragraphs.
Do NOT use a yellow, cream, beige, or warm paper background. The canvas background must be white.

TASK
Create a cartoon-style hand-drawn infographic with the rules above, using nano banana pro, based on the following content:
{{USER_INPUT}}
```
