---
slug: "/ai/ai-code-dev-agent-skills-and-mcp-tools"
title: "AI代码开发常用Agent Skills与MCP工具梳理"
hide_title: true
keywords:
  [
    "Agent Skills",
    "MCP工具",
    "Model Context Protocol",
    "Claude Code",
    "AI代码开发",
    "everything-claude-code",
    "api-design",
    "backend-patterns",
    "coding-standards",
    "e2e-testing",
    "tdd-workflow",
    "eval-harness",
    "security-review",
    "GitHub",
    "Firecrawl",
    "Exa Search",
    "Context7",
    "Supabase MCP",
    "ClickHouse MCP",
    "Vercel MCP",
    "Railway MCP",
    "Cloudflare MCP",
    "sequential-thinking",
    "memory MCP",
    "filesystem MCP",
    "Magic UI MCP",
    "Markitdown MCP",
    "Playwright MCP",
    "GitHub MCP",
    "Chrome DevTools MCP",
    "browser-tools-mcp",
    "AI工作流",
    "智能体工具",
    "AI编程辅助",
    "代码质量",
    "skill-creator",
    "document-skills",
    "find-skills",
    "frontend-design",
    "code-simplifier",
    "ralph-loop",
    "algorithmic-art",
    "canvas-design",
    "brand-guidelines",
    "theme-factory",
    "slack-gif-creator",
    "mcp-builder",
    "web-artifacts-builder",
    "webapp-testing",
    "doc-coauthoring",
    "internal-comms",
    "docx",
    "pdf",
    "pptx",
    "xlsx",
    "Brave Search MCP",
    "Excel MCP",
    "Figma MCP",
    "Knowledge Graph Memory",
    "Sequential Thinking MCP",
    "mcp-doc-forge",
    "GoFrame Skills",
    "goframe-v2",
    "GoFrame框架",
    "playwright-cli",
    "@playwright/cli",
    "浏览器自动化",
    "ui-ux-pro-max",
    "UI/UX设计智能",
    "davila7",
    "shadcn-ui",
    "shadcn/ui",
    "stitch-skills"
  ]
description: "系统梳理AI代码开发中常用的Agent Skills与MCP（Model Context Protocol）工具，涵盖everything-claude-code项目收录的编码开发、测试评估、安全审查、内容创作等多类Skills，专为GoFrame框架打造的goframe-v2技能，微软官方playwright-cli浏览器自动化CLI工具，以及GitHub、Context7、Supabase、ClickHouse、Memory、Sequential Thinking、Markitdown、Playwright MCP、Chrome DevTools等主流MCP服务器配置与使用方式，帮助开发者快速了解、安装并使用这些工具，提升AI辅助开发效率。"
toc_max_heading_level: 4
---

## 前言

随着`Claude Code`、`Cursor`等`AI`编程工具的普及，**Agent Skills**（技能）和**MCP**（`Model Context Protocol`，模型上下文协议）工具已成为提升`AI`开发效率的核心手段。

- **Agent Skills** 是一类结构化的工作流定义文件，告诉`AI`在特定场景下应遵循哪些最佳实践、使用哪些工具、按什么步骤工作。它本质上是领域知识的结构化封装，可被`AI`直接读取并执行。
- **MCP工具** 是遵循`MCP`协议的外部服务器，`AI Agent`可通过标准接口调用这些工具，实现对`GitHub`、数据库、网页搜索、云端部署等外部系统的操作。

:::info 提示
- 以下带有🌟标记的工具是作者已经使用过觉得不错的工具。
- 以下带有🔥标记的工具是作者在初始化项目就会选择安装。
- `Skills`别装太多，否则`AI`会选择困难，不知道该用哪个，通常安装`3-5`个常用的`Skill`即可。
- 本文会持续更新，收录更多经过实践验证的`Agent Skills`和`MCP`工具。
- 如果朋友们有使用过觉得不错的工具，欢迎评论留言。
:::


## Agent Skills

### 编码开发类

这类技能涵盖日常编码工作中的架构规范、设计模式、代码标准等，是最基础也最常用的一类。


#### frontend-patterns

**功能说明**：前端开发模式技能，提供组件化设计思路、状态管理最佳实践、性能优化策略等前端工程化规范，帮助`AI`生成可维护、可扩展的前端代码。

**使用场景**：组件设计、状态管理、性能优化、前端架构规划。

**官网/参考**：[https://github.com/affaan-m/everything-claude-code/tree/main/skills/frontend-patterns](https://github.com/affaan-m/everything-claude-code/tree/main/skills/frontend-patterns)

**安装命令：**

```bash
npx skills add affaan-m/everything-claude-code@frontend-patterns
```



#### frontend-slides🌟

**功能说明**：零依赖`HTML`演示文稿构建技能，按照严格的视口适配规则生成单文件`HTML`幻灯片，并提供`PPTX`转换指导，无需安装额外依赖即可制作专业演示文稿。

**使用场景**：生成产品展示、技术分享、项目汇报的演示文稿页面。

**官网/参考**：[https://github.com/affaan-m/everything-claude-code/tree/main/skills/frontend-slides](https://github.com/affaan-m/everything-claude-code/tree/main/skills/frontend-slides)

**安装命令：**

```bash
npx skills add affaan-m/everything-claude-code@frontend-slides
```



#### frontend-design🌟🔥

**功能说明**：`Anthropic` 官方前端设计技能，提供专业级 `UI` 设计规范和响应式布局最佳实践，帮助 `AI` 生成美观、可访问、适配多端的前端界面代码。

**使用场景**：前端界面设计、响应式布局实现、`UI` 组件开发、设计规范落地。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@frontend-design
```

#### goframe-v2🌟🔥

**功能说明**：`GoFrame`框架专属`AI`技能，为`AI`深度理解`GoFrame`框架规范与最佳实践提供完整支持，涵盖命令行管理、配置管理、日志组件、错误处理、数据校验、数据库`ORM`等核心组件的设计概览、使用指南与注意事项，并内置`HTTP`服务、`gRPC`微服务等多种项目类型的实战代码示例，帮助`AI`生成高质量、可投产的`GoFrame`代码。

**使用场景**：使用`GoFrame`框架、构建`HTTP/gRPC`微服务、遵循`GoFrame`最佳实践进行代码生成。

**官网/参考**：https://github.com/gogf/skills、https://goframe.org/ai/goframe-skills

**安装命令：**

```bash
npx skills add github.com/gogf/skills
```



#### mcp-builder

**功能说明**：`MCP`（`Model Context Protocol`）服务器开发指南技能，提供完整的四阶段开发流程：**深度研究与规划 → 实现 → 审查测试 → 评估**，内置 `TypeScript`（推荐）和 `Python`（`FastMCP`）两种实现路径的参考文档，帮助 `AI` 高质量地创建可供 `LLM` 调用的外部服务工具。

**使用场景**：为外部 `API` 或服务构建 `MCP` 服务器、设计工具命名与描述规范、实现工具输入输出 `Schema`、编写 `MCP` 评估测试集。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@mcp-builder
```


### 测试与质量保障类

这类技能专注于测试策略、评估框架和持续验证，是保障`AI`生成代码质量的重要手段。

#### e2e-testing🌟🔥

**功能说明**：端到端测试模式技能，内置`Playwright`测试框架最佳实践，涵盖`Page Object Model`设计模式、测试文件组织结构、`CI/CD`集成配置、`Artifact`管理，以及处理不稳定测试（`flaky tests`）的策略，帮助`AI`生成稳定可靠的`E2E`测试代码。

**使用场景**：编写`Playwright E2E`测试、设计`Page Object Model`、配置`CI/CD`集成。

**官网/参考**：[https://github.com/affaan-m/everything-claude-code/tree/main/skills/e2e-testing](https://github.com/affaan-m/everything-claude-code/tree/main/skills/e2e-testing)

**安装命令：**

```bash
npx skills add affaan-m/everything-claude-code@e2e-testing
```

#### webapp-testing

**功能说明**：本地 `Web` 应用测试工具包，内置基于 `Playwright` 的原生 `Python` 自动化脚本及服务器生命周期管理工具（`with_server.py`），支持静态 `HTML` 和动态 `Web` 应用两种测试路径，通过侦察优先（`Reconnaissance-then-Action`）模式精准定位 `UI` 元素并执行自动化操作。

**使用场景**：验证前端功能、调试 `UI` 行为、捕获浏览器截图与控制台日志、对本地运行的 `Web` 应用进行端到端测试。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@webapp-testing
```

### 浏览器自动化类

这类技能专注于浏览器自动化操作，让`AI`能够高效地控制浏览器完成测试、数据抓取等任务。

#### playwright-cli🌟

**功能说明**：微软官方`Playwright CLI`工具，专为`AI`编码代理（`Coding Agent`）设计的浏览器自动化命令行接口。相比`Playwright MCP`，`CLI`方式更加`Token`高效——无需将大型工具`Schema`和可访问性树（`Accessibility Tree`）加载到模型上下文中，通过简洁的专用命令即可完成网页导航、点击、输入、截图、网络请求拦截等操作，非常适合需要在有限上下文窗口内兼顾大型代码库与浏览器自动化任务的高吞吐量编码代理。

**使用场景**：自动化网页操作与测试、网页内容抓取、表单填写与按钮点击、页面截图与`PDF`导出、网络请求拦截与`Mock`、多会话并行浏览器管理、生成`Playwright`测试代码。

**注意事项**：
- `playwright-cli`默认使用无头模式，因此在测试时你无法看到打开的UI界面，但是进程仍然存在，如果需要则提醒`AI`使用有头模式。
- 该`Skill`会不断开启新的浏览器实例并且难以清除掉，而`playwright MCP`会复用一个实例，因此我注意使用`playwright MCP`。

**官网/参考**：[https://github.com/microsoft/playwright-cli](https://github.com/microsoft/playwright-cli)

**安装命令：**

```bash
# 全局安装 playwright-cli
npm install -g @playwright/cli@latest

# 安装 Agent Skills（支持 Claude Code、GitHub Copilot 等编码代理）
playwright-cli install --skills
```

### 技能管理类

这类技能专注于 `Agent Skills` 生态本身的管理，包括技能的创建、发现与安装推荐。

#### skill-creator🌟🔥

> 适合全局安装。

**功能说明**：`Anthropic` 官方认证的技能创建工具，通过访谈式分析帮助用户将重复工作流提炼为可复用的标准技能。支持完整的 **`draft → test → evaluate → improve`** 循环：自动生成 `SKILL.md` 结构、并行运行测试用例（对照实验对比有无技能的效果差异）、可视化评测结果，并提供描述优化模块以提升技能触发准确率。

**使用场景**：将重复工作流封装为技能、迭代优化已有技能、从对话历史中提取并固化最佳实践、打包发布自定义技能。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@skill-creator
```

#### find-skills🌟🔥

> 适合全局安装。

**功能说明**：技能发现与推荐工具，当用户提问"有没有能做 `X` 的工具"或"如何完成 `X`"时，自动搜索技能库中最匹配的技能并给出安装命令和详情链接。是扩展 `AI` 能力边界的入口工具。

**使用场景**：发现并安装适合当前任务的技能、快速了解技能生态、让 `AI` 自主选择并扩展工具能力。

**官网/参考**：[https://github.com/vercel-labs/skills](https://github.com/vercel-labs/skills)

**安装命令：**

```bash
npx skills add vercel-labs/skills@find-skills
```



### 文档处理类

这类技能专注于操作各类办公文档，实现 `AI` 自动化读写 `Excel`、`Word`、`PPT`、`PDF` 等格式。

#### doc-coauthoring

**功能说明**：结构化文档协作写作工作流，全程引导用户完成三阶段流程：**上下文收集 → 逐节细化精炼 → 读者视角测试**。通过访谈式问答收集背景信息，逐节进行头脑风暴、筛选、起草和迭代，最后用新会话的 `Claude`（无上下文污染）验证文档是否对读者清晰易懂。

**使用场景**：编写技术规格文档、设计文档（`PRD`/`RFC`/决策文档）、提案与汇报、任何需要结构化、高质量的文档写作任务。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@doc-coauthoring
```



#### internal-comms

**功能说明**：内部沟通写作资源集，内置多种企业内部沟通格式的规范模板，包括 **3P 周报**（进展/计划/问题）、公司简报、`FAQ` 回答、状态报告、领导层更新、事故报告等，帮助 `AI` 按公司习惯格式生成规范的内部沟通文档。

**使用场景**：撰写团队周报、发布公司新闻简报、整理常见问题解答、起草事故复盘报告、生成项目进度汇报。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@internal-comms
```



#### xlsx/docx/pdf/pptx

**功能说明**：`Anthropic` 官方办公文档操作技能集，分别处理 `Excel`（含财务模型颜色规范、公式校验、`LibreOffice` 自动重算）、`Word`、`PDF` 和 `PowerPoint` 四种格式，支持 `AI` 自动创建、编辑和分析各类办公文件。每种格式为独立技能，按需安装。

**使用场景**：自动填写 `Excel` 报表、批量处理数据、智能阅读 `PDF`、生成 `Word` 文档、制作 `PPT` 演示文稿。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
# 按需选择安装对应格式的技能
npx skills add anthropics/skills@xlsx   # Excel 支持
npx skills add anthropics/skills@docx   # Word 支持
npx skills add anthropics/skills@pdf    # PDF 支持
npx skills add anthropics/skills@pptx   # PPT 支持
```


### 内容创作与设计类

这类技能专注于视觉创作、品牌设计和多媒体内容生成。

#### canvas-design

**功能说明**：视觉艺术设计技能，同样采用哲学先行的两步创作流程：先生成**设计哲学宣言**（极简文字、空间构图、色彩语言等），再将其转化为博物馆级别的 `.png` 或 `.pdf` 设计作品，文字极少、视觉为主，强调如同大师作品般的精工细作。

**使用场景**：创作海报、视觉艺术品、品牌设计稿、产品宣传单页，或任何需要专业视觉设计输出的场景。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@canvas-design
```


#### theme-factory🌟🔥

**功能说明**：演示文稿与各类 `Artifact` 主题样式工具，内置 10 套精心搭配的主题（含配色方案和字体组合，如 `Ocean Depths`、`Midnight Galaxy`、`Tech Innovation` 等），展示主题画册供用户选择后自动应用到目标 `Artifact`，也支持根据需求即时生成自定义主题。

**使用场景**：为 `PPT`/`HTML` 页面/报告统一应用专业配色和字体、快速切换不同视觉风格、为 `Artifact` 生成定制主题。

**官网/参考**：[https://github.com/anthropics/skills](https://github.com/anthropics/skills)

**安装命令：**

```bash
npx skills add anthropics/skills@theme-factory
```


#### ui-ux-pro-max

**功能说明**：综合型`UI/UX`设计智能技能，内置50+`UI`风格、97种配色方案、57组字体搭配、99条`UX`规则和25种图表类型，覆盖`React`、`Next.js`、`Vue`、`Svelte`、`SwiftUI`、`React Native`、`Flutter`、`Tailwind`、`shadcn/ui`共9种技术栈。通过`--design-system`命令一键生成包含风格、配色、字体、互动动画等全要素的完整设计系统，并提供交付前核查清单保障专业`UI`品质。支持从解析用户需求、匹配设计风格、到生成针对特定技术栈代码的完整工作流。

**使用场景**：设计网站、起始页、仪表盘、管理后台、电商页面、`SaaS应用`、移动`App`等各类前端项目的`UI`组件设计与实现、品牌视觉风格选择、`UX最佳实践审查`、配色方案与字体搜索、图表类型选择。

**官网/参考**：[https://github.com/davila7/claude-code-templates](https://github.com/davila7/claude-code-templates)

**安装命令：**

```bash
npx skills add davila7/claude-code-templates@ui-ux-pro-max
```


#### shadcn-ui

**功能说明**：`Google`官方`stitch-skills`项目出品的`shadcn/ui`集成专家技能。`shadcn/ui`不同于传统组件库——元件源码直接复制到项目中，完全自主可改，无运行时包体积。该技能提供组件源码获取、自定义安装、主题配置及最佳实践指导，支持`v4`新特性（`Base UI`原语件、`RTL`、`Vega/Nova/Maia`等内置视觉风格），并内置与`shadcn MCP`工具的深度整合，允许`AI`通过工具搜索组件目录、获取组件元数据与示例代码、源码及整页块（`Blocks`）。

**使用场景**：在`React`/`Next.js`项目中集成`shadcn/ui`组件、定制主题与深色模式、使用`react-hook-form + Zod`构建表单验证、搭建仪表盘`/`登录`/`侵边栏等常用页面块、组件变体编写和可访问性保障。

**官网/参考**：[https://github.com/google-labs-code/stitch-skills](https://github.com/google-labs-code/stitch-skills)

**安装命令：**

```bash
npx skills add google-labs-code/stitch-skills@shadcn-ui
```


## MCP

`MCP`（`Model Context Protocol`）是`Anthropic`发布的开放协议，允许`AI`模型通过标准化接口调用外部工具和数据源。每个`MCP`服务器可以是本地命令行工具，也可以是远程`HTTP`服务，`AI Agent`通过调用这些服务器来扩展其能力。

:::info 提示
不同`AI`编辑器的`MCP`配置文件路径和格式略有差异，可以通过以下方式进行安装：
- 优先推荐通过`AI`编辑器的`MCP`市场。
- 也可以通过提示词让`AI`协助安装指定名称的`MCP`安装包，如果存在多个同名`MCP`安装包，在提示词中额外给定参考链接地址即可。
:::




### 代码仓库类

#### GitHub

**功能说明**：`GitHub`官方`MCP`服务器，允许`AI`直接操作`GitHub`仓库，涵盖仓库文件读取、`Issue`管理、`Pull Request`创建与查看、代码搜索、分支操作等，是`AI`辅助开发工作流与`GitHub`深度集成的核心工具。

**使用场景**：查看与创建`Issue`、提交`Pull Request`、搜索仓库代码、读取文件内容、管理分支与发布。

**注意事项**：使用前需配置`GITHUB_PERSONAL_ACCESS_TOKEN`环境变量（在 https://github.com/settings/tokens 生成）。

**安装提示词**：
```text
安装MCP工具"github-mcp-server"，并完成该MCP工具的配置，参考：https://github.com/github/github-mcp-server
```

**官网/参考**：[https://github.com/github/github-mcp-server](https://github.com/github/github-mcp-server)

### 网页搜索类

#### Context7

**功能说明**：实时文档查询工具，专为`LLM`优化了各主流开源库和框架的文档索引，使`AI`能够查询到最新版本的`API`文档，避免因训练数据截止日期导致的接口过时问题。

**使用场景**：查询第三方库最新`API`、获取框架官方文档、解决版本兼容性问题。

**安装提示词**：
```text
安装MCP工具"@context7/mcp-server"，并完成该MCP工具的配置，参考：https://github.com/upstash/context7
```

**官网/参考**：https://github.com/upstash/context7

### 文档处理类

#### Markitdown

**功能说明**：微软开源的多格式文档转`Markdown`工具的`MCP`服务器，支持将`PDF`、`Word`（`docx`）、`Excel`（`xlsx`）、`PowerPoint`（`pptx`）、图片、`HTML`、`CSV`等多种格式一键转换为`Markdown`，便于`AI`读取和处理本地文档内容。

**使用场景**：读取本地`PDF`/`Word`/`Excel`文档内容、将非结构化文件转为`AI`可处理的`Markdown`格式、批量文档内容提取。

**安装提示词**：
```text
安装MCP工具"markitdown-mcp"，并完成该MCP工具的配置，参考：https://github.com/microsoft/markitdown/tree/main/packages/markitdown-mcp
```

**官网/参考**：[https://github.com/microsoft/markitdown](https://github.com/microsoft/markitdown)

#### Excel MCP Server

**功能说明**：无需安装 `Microsoft Excel`，让 `AI` 直接创建、读取、修改 `Excel` 文件，支持数据读写、公式计算、表格格式化（字体/颜色/边框）、图表生成（折线/柱状/饼图等）和数据透视表，覆盖 `xlsx`、`xlsm`、`xltx`、`xltm` 等主流 `Excel` 文件格式。

**使用场景**：财务报表自动化、销售数据汇总、批量数据清洗、生成可视化图表、创建带格式的数据报告。

**安装提示词**：
```text
安装MCP工具"excel-mcp-server"，并完成该MCP工具的配置，参考：https://github.com/haris-musa/excel-mcp-server
```

**官网/参考**：[https://github.com/haris-musa/excel-mcp-server](https://github.com/haris-musa/excel-mcp-server)


#### MCP Doc Forge

**功能说明**：多格式文档读取与处理 `MCP` 服务器，支持读取 `PDF`、`DOCX`、`TXT`、`HTML`、`CSV` 等格式，并提供格式转换（`DOCX→HTML/PDF`、`HTML→Markdown`）、`PDF` 合并/拆分、多编码文本处理（`UTF-8`/`Big5`/`GBK`）等功能，让 `AI` 轻松操作各类本地文档内容。

**使用场景**：合同审核、资料提取、文档格式转换、批量内容清洗与分析、非结构化文档文本提取。

**安装提示词**：
```text
安装MCP工具"@cablate/mcp-doc-forge"，并完成该MCP工具的配置，参考：https://github.com/cablate/mcp-doc-forge
```

**官网/参考**：[https://github.com/cablate/mcp-doc-forge](https://github.com/cablate/mcp-doc-forge)


### 记忆与推理类

#### Knowledge Graph Memory Server

**功能说明**：用本地知识图谱为 `AI` 提供跨会话的持久化记忆，以 **实体（Entity）–关系（Relation）–观察（Observation）** 三元组形式存储用户偏好、项目上下文和历史交互，支持增删改查图谱节点，彻底解决 `AI` 每次对话从零开始的问题。底层数据以 `JSONL` 文件本地保存，隐私安全。

**使用场景**：个性化助手记忆用户偏好、项目知识库、团队协作上下文持久化、跨会话追踪错误模式与解决方案。

**安装提示词**：
```text
安装MCP工具"@modelcontextprotocol/server-memory"，并完成该MCP工具的配置，参考：https://github.com/modelcontextprotocol/servers/tree/main/src/memory
```

**官网/参考**：[https://github.com/modelcontextprotocol/servers/tree/main/src/memory](https://github.com/modelcontextprotocol/servers/tree/main/src/memory)


#### Sequential Thinking

**功能说明**：结构化链式推理工具，引导 `AI` 将复杂问题拆解为一系列可管理的思考步骤（`thought`），每步可修正、回溯或分叉出新的推理分支，形成可追踪的完整思考过程，最终生成并验证解决方案假设。支持动态调整总步骤数量，适合问题范围不明确的开放性任务。

**使用场景**：战略规划决策、代码架构分析与 `Debug`、法律/合规案例分析、科学研究假设验证、需要多步迭代推导的复杂技术方案。

**安装提示词**：
```text
安装MCP工具"@modelcontextprotocol/server-sequential-thinking"，并完成该MCP工具的配置，参考：https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking
```

**官网/参考**：[https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)


### 浏览器自动化类

#### Playwright🌟🔥

**功能说明**：微软官方`Playwright`浏览器自动化`MCP`服务器，允许`AI`通过可访问性树（`Accessibility Tree`）和截图的方式操控真实浏览器，实现网页导航、表单填写、按钮点击、内容抓取、截图等操作，是`AI`自主完成浏览器任务的核心工具。

**使用场景**：自动化网页操作、网页内容抓取与交互、端到端测试执行、网页截图、登录与表单自动化。

**安装提示词**：
```text
安装MCP工具"@playwright/mcp"，并完成该MCP工具的配置，参考：https://github.com/microsoft/playwright-mcp
```

**官网/参考**：[https://github.com/microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp)


#### Chrome DevTools MCP

**功能说明**：基于`Chrome DevTools Protocol`（`CDP`）的浏览器调试`MCP`工具，允许`AI`实时读取浏览器控制台日志、网络请求、页面截图、`DOM`结构等调试信息，帮助`AI`直接感知和分析浏览器运行时状态，显著提升前端调试效率。该`MCP`需配合`Chrome`扩展使用，扩展地址在参考链接中获取。

**使用场景**：读取控制台错误与警告、抓取网络请求与响应、获取当前页面截图与`DOM`、辅助前端`Bug`定位与分析。

**安装提示词**：
```text
安装MCP工具"@agentdeskai/browser-tools-mcp"，并完成该MCP工具的配置，参考：https://github.com/AgentDeskai/browser-tools-mcp
```

**官网/参考**：[https://github.com/AgentDeskai/browser-tools-mcp](https://github.com/AgentDeskai/browser-tools-mcp)


## 参考资料

- https://skillsmp.com/
- https://skills.sh/
- https://github.com/anthropics/skills
- https://github.com/affaan-m/everything-claude-code
- https://github.com/modelcontextprotocol/servers
- https://github.com/github/github-mcp-server
- https://github.com/microsoft/markitdown
- https://github.com/microsoft/playwright-mcp
- https://github.com/AgentDeskai/browser-tools-mcp
- https://ghuntley.com/ralph/
- https://github.com/gogf/skills
- https://github.com/microsoft/playwright-cli
- https://github.com/davila7/claude-code-templates
- https://github.com/google-labs-code/stitch-skills


