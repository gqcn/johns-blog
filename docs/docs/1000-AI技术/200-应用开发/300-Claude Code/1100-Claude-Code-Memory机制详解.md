---
slug: "/ai/claude-code-memory"
title: "Claude Code Memory机制详解"
hide_title: true
keywords:
  [
    "Claude Code",
    "Memory",
    "CLAUDE.md",
    "Auto Memory",
    "Rules",
    "上下文持久化",
    "跨会话记忆",
    "智能记忆",
    "项目指令",
    "自动记忆",
    "记忆机制",
    "claude/rules",
    "路径规则",
    "用户级规则",
    "组织级规则",
    "MEMORY.md",
    "记忆存储",
    "指令文件",
    "上下文管理",
    "会话持久化",
    "团队协作",
    "编码规范",
    "工作流自动化",
    "知识积累",
    "记忆审计"
  ]
description: "Claude Code Memory机制是解决AI编程助手跨会话上下文丢失问题的核心设计。本文详细介绍Memory的两大组成部分：用户手写指令文件CLAUDE.md（支持项目级、用户级和组织级三种作用域）以及Claude自动积累知识的Auto Memory机制；深入解析.claude/rules/规则目录的组织方式、路径作用域定义和用户级规则；并重点对比CLAUDE.md与Rules的适用场景，帮助开发者构建高效的跨会话知识管理体系，让Claude Code在每次会话中都能快速掌握项目背景、团队规范和个人偏好。"
toc_max_heading_level: 4
---

## 前言

`Claude Code`每次启动时都会开启一个全新的上下文窗口，之前会话中积累的项目知识、编码偏好、调试经验会随之消失。对于长期维护的项目而言，这意味着每次对话都需要重新向`Claude`解释项目架构、团队规范和各种约定，效率极低。

`Memory`机制正是为了解决这个根本性问题而设计的。它让`Claude Code`在会话之间保持对项目的持续理解，无需每次从零开始。

## Memory机制概述

![Claude Code Memory机制](assets/1100-Claude-Code-Memory机制详解/image.png)

### 核心问题

`Claude Code`在设计上存在一个固有限制：每个会话的上下文窗口是独立的，会话结束后，上下文中所有内容（包括你告诉`Claude`的项目架构、你纠正的不良习惯、你反复强调的编码规范）都会彻底消失。这导致：

- 每次新会话都需要重新建立项目背景
- `Claude`反复犯同类错误，因为无法记住之前的纠正
- 团队规范无法自动传递给`Claude`，需要每次手动说明
- 随着项目复杂度增加，"启动成本"越来越高

### 设计原理

`Claude Code`通过两套互补的记忆机制解决这个问题，它们都在每次会话开始时自动加载：

| | `CLAUDE.md` | `Auto Memory` |
|---|---|---|
| **写入方** | 开发者手动编写 | `Claude`自动写入 |
| **内容类型** | 指令与规则 | 学到的知识与规律 |
| **作用域** | 项目、用户或组织 | 按工作树区分 |
| **加载方式** | 每次会话完整加载 | 每次会话加载前`200`行 |
| **适用场景** | 编码规范、工作流、项目架构 | 构建命令、调试经验、`Claude`发现的偏好 |

两套机制相辅相成：`CLAUDE.md`承载稳定的、你主动定义的规则；`Auto Memory`则让`Claude`在与你协作过程中自主积累可复用的知识。

## CLAUDE.md文件

### 基本概念

`CLAUDE.md`是纯文本的`Markdown`文件，用于给`Claude`提供跨会话的持久指令。你用普通文本编写，`Claude`在每次会话开始时读取它。它不是配置文件，而是给`Claude`的"项目说明书"——`Claude`会努力遵循其中的指令，但理解上仍依赖语言模型的推断能力，而非硬性约束。

因此，**写得越具体、越简洁，`Claude`遵循得越稳定**。

### 文件位置与作用域

`CLAUDE.md`支持放置在多个位置，每个位置对应不同的生效范围，更具体的位置优先级更高：

| 类型 | 路径 | 用途 | 
|------|------|------|
| **组织级** | macOS: `/Library/Application Support/ClaudeCode/CLAUDE.md`<br/>Linux/WSL: `/etc/claude-code/CLAUDE.md`<br/>Windows: `C:\Program Files\ClaudeCode\CLAUDE.md` | 全组织统一规范、安全策略、合规要求 |
| **项目级** | `./CLAUDE.md` 或 `./.claude/CLAUDE.md` | 项目架构、编码规范、常用工作流 |
| **用户级** | `~/.claude/CLAUDE.md` | 个人偏好、个人工具习惯 |

项目级`CLAUDE.md`优先级最高（因为更具体），组织级优先级最低。若多个层级存在相互矛盾的指令，`Claude`会倾向于遵循更具体的那一条。

### 设置项目级CLAUDE.md

项目级`CLAUDE.md`存放在`./CLAUDE.md`或`./.claude/CLAUDE.md`。推荐在其中包含：

- 构建与测试命令（如`npm test`、`go test ./...`）
- 编码规范（缩进、命名约定、文件组织）
- 架构决策与模块职责说明
- 常用工作流（如`Git`提交规范、发布流程）

> 可以运行`/init`命令让`Claude`自动分析代码库并生成一份初始`CLAUDE.md`。若文件已存在，`/init`会给出改进建议而非覆盖原有内容。

示例`CLAUDE.md`内容：

```markdown
# Project: my-api-service

## Build & Test
- Build: `go build ./...`
- Test: `go test ./... -race`
- Lint: `golangci-lint run`

## Code Style
- Use 2-space indentation for YAML/JSON files
- All exported functions must have godoc comments
- Error messages should be lowercase without punctuation

## Architecture
- API handlers live in `src/api/handlers/`
- Business logic stays in `src/service/`
- Database queries go in `src/repository/`

## Git Workflow
- Commit messages follow Conventional Commits format
- Always run tests before committing
- Branch naming: `feat/`, `fix/`, `chore/` prefix
```

### 编写有效指令

`CLAUDE.md`在每次会话开始时全部加载进上下文窗口，消耗`token`。文件越长，`Claude`的遵从度反而可能下降。建议：

- **控制长度**：每个`CLAUDE.md`文件目标在`200`行以内；超过时使用`@import`或`.claude/rules/`拆分
- **用结构组织**：使用`Markdown`标题和列表分组相关指令，便于`Claude`扫描
- **写具体指令**：能够验证的具体规则效果远优于模糊描述

| 模糊（效果差）| 具体（效果好）|
|---|---|
| "好好格式化代码" | "使用2空格缩进，不使用Tab" |
| "测试你的修改" | "提交前运行`npm test`" |
| "保持文件有序" | "`API`处理函数放在`src/api/handlers/`下" |

避免在`CLAUDE.md`中放置互相矛盾的指令。若多个文件（包括子目录中的`CLAUDE.md`）给出冲突规则，`Claude`可能随机选择其中一个。定期检查并清理过期或冲突的指令。

### 导入其他文件

`CLAUDE.md`支持使用`@path/to/file`语法导入外部文件，被导入的文件会在启动时展开并加载进上下文，与`CLAUDE.md`本体一同生效：

```markdown
# Project Instructions

See @README for project overview and @package.json for available npm commands.

# Workflow
- Git workflow: @docs/git-instructions.md
```

路径支持相对路径（相对于当前`CLAUDE.md`文件所在目录）和绝对路径，导入深度最多支持5层递归。

对于个人偏好（不想提交到版本库的内容），可以在共享`CLAUDE.md`中导入本地文件：

```markdown
# Individual Preferences
- @~/.claude/my-project-instructions.md
```

> `Claude Code`首次遇到外部导入时会显示确认对话框。若拒绝，导入将保持禁用状态，且不再弹出提示。

### 加载规则

`Claude Code`按以下规则加载`CLAUDE.md`文件：

1. 从当前工作目录向上遍历目录树，逐级检查并加载`CLAUDE.md`文件（即在`foo/bar/`中运行时，同时加载`foo/bar/CLAUDE.md`和`foo/CLAUDE.md`）
2. 当前工作目录下的子目录`CLAUDE.md`不在启动时加载，而是在`Claude`访问该子目录的文件时按需加载
3. 用户级`~/.claude/CLAUDE.md`始终加载
4. 组织级文件始终加载且不可被个人设置排除

在大型`Monorepo`中，若其他团队的`CLAUDE.md`被误加载，可以在`.claude/settings.local.json`中配置`claudeMdExcludes`排除指定文件：

```json
{
  "claudeMdExcludes": [
    "**/monorepo/CLAUDE.md",
    "/home/user/monorepo/other-team/.claude/rules/**"
  ]
}
```

## Rules规则

### 什么是Rules

`Rules`（规则）是`Claude Code`提供的另一种组织指令的方式，通过`.claude/rules/`目录中的独立`Markdown`文件定义，专门解决`CLAUDE.md`文件在大型项目中难以维护的问题。

`Rules`的核心优势在于：

- **模块化**：每个文件覆盖一个主题，便于团队分工维护
- **路径作用域**：支持将规则限定为仅当`Claude`访问特定路径下的文件时才加载，节省上下文空间
- **按需加载**：路径作用域规则只在匹配时触发，减少无关内容占据上下文

### 目录结构

在项目的`.claude/rules/`目录下按主题创建`Markdown`文件，文件名应具有描述性：

```text
your-project/
├── .claude/
│   ├── CLAUDE.md           # Main project instructions
│   └── rules/
│       ├── code-style.md   # Code style guidelines
│       ├── testing.md      # Testing conventions
│       ├── security.md     # Security requirements
│       ├── frontend/
│       │   └── react.md    # React-specific rules
│       └── backend/
│           └── api.md      # API design rules
```

`.md`文件支持递归发现，因此可以按子目录组织规则文件。没有配置`paths`前置内容（`frontmatter`）的规则文件与`.claude/CLAUDE.md`享有相同加载优先级，在会话启动时即刻加载。

### 路径作用域规则

规则文件可以通过`YAML frontmatter`的`paths`字段将生效范围限定到特定文件路径。这类条件规则只在`Claude`访问匹配的文件时才被加载进上下文：

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API Development Rules

- All API endpoints must include input validation
- Use the standard error response format
- Include OpenAPI documentation comments
```

`paths`字段支持`Glob`模式：

| 模式 | 匹配范围 |
|------|------|
| `**/*.ts` | 任意目录下的所有`TypeScript`文件 |
| `src/**/*` | `src/`目录下所有文件 |
| `*.md` | 项目根目录下的`Markdown`文件 |
| `src/components/*.tsx` | 特定目录下的`React`组件文件 |

也支持多模式和大括号展开：

```markdown
---
paths:
  - "src/**/*.{ts,tsx}"
  - "lib/**/*.ts"
  - "tests/**/*.test.ts"
---
```

没有`paths`字段的规则文件无条件加载，对所有文件生效。路径作用域规则在`Claude`读取匹配文件时触发，而不是在每次工具调用时都触发。

### 用户级Rules

除了项目级的`.claude/rules/`，个人规则还可以放置在`~/.claude/rules/`下，对本机所有项目生效：

```text
~/.claude/rules/
├── preferences.md    # Personal coding preferences
└── workflows.md      # Preferred work habits
```

用户级规则先于项目规则加载，因此项目规则享有更高优先级（可覆盖用户规则）。

### 跨项目共享Rules

`.claude/rules/`目录支持符号链接（symlink），可以将共享规则链接到多个项目中：

```bash
# Link a shared rules directory
ln -s ~/shared-claude-rules .claude/rules/shared

# Link a specific file
ln -s ~/company-standards/security.md .claude/rules/security.md
```

`Claude Code`会正常解析并加载符号链接指向的内容，并能检测和处理循环链接。

## Auto Memory自动记忆

### 工作原理

`Auto Memory`（自动记忆）是让`Claude`在协作过程中自主积累跨会话知识的机制。当`Claude`在工作中发现值得记录的信息——如项目特有的构建命令、反复出现的调试模式、你的代码偏好——它会主动将这些内容写入记忆文件，供未来会话使用。

`Claude`不会每次会话都写记忆。它会判断哪些信息在未来对话中具有实用价值，再决定是否保存。

### 存储位置

每个项目的记忆文件存放在`~/.claude/projects/<project>/memory/`目录下，`<project>`路径由`Git`仓库路径推导而来。同一`Git`仓库下的所有工作树和子目录共享同一个记忆目录。不在`Git`仓库中时，使用项目根目录。

记忆目录结构如下：

```text
~/.claude/projects/<project>/memory/
├── MEMORY.md          # Concise index, loaded into every session
├── debugging.md       # Detailed notes on debugging patterns
├── api-conventions.md # API design decisions
└── ...                # Other topic files Claude creates
```

`MEMORY.md`作为记忆目录的索引，记录了各主题文件存储的内容及位置。每次会话启动时，`MEMORY.md`的**前`200`行**会自动加载进上下文；超出`200`行的内容不在启动时加载，`Claude`会在需要时按需读取各主题文件。

记忆文件是**本机私有的**，不跨机器、不跨云环境共享。

### 启用与禁用

`Auto Memory`默认开启。可以通过以下方式关闭：

- 在会话中运行`/memory`并切换自动记忆开关
- 在项目设置中添加配置：

  ```json
  {
    "autoMemoryEnabled": false
  }
  ```

- 设置环境变量：`CLAUDE_CODE_DISABLE_AUTO_MEMORY=1`

> `Auto Memory`需要`Claude Code v2.1.59`或更高版本。可通过`claude --version`查看版本。

### 审计与编辑

自动记忆文件是普通的`Markdown`文件，可以随时查看、编辑或删除。在会话中运行`/memory`可以浏览并打开记忆文件。

当你让`Claude`记住某件事（如"始终使用`pnpm`而非`npm`"），`Claude`会将其写入自动记忆。若想将指令写入`CLAUDE.md`，需要明确说明，如"把这条加入`CLAUDE.md`"，或直接通过`/memory`手动编辑文件。

## CLAUDE.md与Rules的对比

### 核心区别

`CLAUDE.md`和`Rules`都是由开发者手动编写的指令，但在组织方式和使用场景上有明显区别：

| 对比维度 | `CLAUDE.md` | `.claude/rules/` |
|---|---|---|
| **文件数量** | 每个作用域一个文件 | 每个主题一个文件，可多文件 |
| **加载时机** | 始终在会话启动时加载（全量） | 无路径限制的规则在启动时加载；有路径限制的按需加载 |
| **维护难度** | 文件增大后难以维护 | 模块化，团队分工维护更容易 |
| **路径作用域** | 不支持 | 支持，通过`YAML frontmatter`定义 |
| **版本控制** | 通常提交到代码库 | 通常提交到代码库 |
| **适用规模** | 小型项目或精简指令 | 大型项目或多团队协作 |

### 什么时候用CLAUDE.md

`CLAUDE.md`适合以下场景：

- **项目整体说明**：项目架构、技术栈介绍、模块职责等需要全局了解的内容
- **核心约定**：无论在哪个文件上工作都需要遵守的规则（如提交规范、错误处理原则）
- **快速启动**：小型项目，指令量少，单个文件足够清晰
- **个人偏好**：通过`~/.claude/CLAUDE.md`定义仅对自己生效的工作习惯
- **组织规范**：企业通过托管策略部署全员统一的安全和合规级别规则

典型的`CLAUDE.md`内容示例：

```markdown
# Project Overview
This is a Go microservice for order management. See @README for full context.

## Dev Commands
- Test: `go test ./... -race -count=1`
- Build: `make build`
- Lint: `golangci-lint run ./...`

## Core Conventions
- All errors must be wrapped with context: `fmt.Errorf("operation: %w", err)`
- Never commit directly to main; always use feature branches
- API response format defined in @docs/api-response-format.md
```

### 什么时候用Rules

`.claude/rules/`适合以下场景：

- **按文件类型区分规则**：前端文件遵循不同规范（如`React`组件应使用`Hooks`），后端文件遵循另一套规范（如必须添加接口文档注释），通过路径作用域分别加载，互不干扰
- **多人维护指令**：团队不同成员负责不同模块的规范，各自维护独立文件，减少合并冲突
- **控制上下文开销**：路径作用域规则只在相关文件被访问时才进入上下文，避免全量加载不相关规则
- **大型指令集**：当`CLAUDE.md`超过`200`行时，将详细内容拆分到`rules/`中，保持`CLAUDE.md`精简
- **跨项目共享规范**：通过符号链接将公司级规则复用到多个项目

典型的`Rules`文件示例（`testing.md`）：

```markdown
---
paths:
  - "**/*.test.ts"
  - "**/*.spec.ts"
  - "tests/**/*"
---

# Testing Rules

- Use `describe/it` blocks for test organization
- Each test file must import from the local test helpers: `@/test-utils`
- Mock external dependencies; never call real APIs in unit tests
- Test names should describe behavior, not implementation
```

### 与Auto Memory的区别

`Auto Memory`与`CLAUDE.md`/`Rules`的根本区别在于**谁来写**：

- **`CLAUDE.md`和`Rules`**：开发者主动编写，内容稳定、确定性强，适合需要严格遵守的规则和需要团队共享的规范
- **`Auto Memory`**：`Claude`自动写入，内容是`Claude`从工作过程中学到的知识，适合个人习惯、项目特定的技术细节、以及无需人工维护的偏好积累

三者协同工作：`CLAUDE.md`提供稳定的明确规则 → `Rules`提供模块化的精细规则 → `Auto Memory`填补"Claude自己发现的知识"这一空白。

## /memory命令

在`Claude Code`会话中运行`/memory`命令，可以：

- 查看当前会话已加载的所有`CLAUDE.md`和`Rules`文件列表
- 切换`Auto Memory`的开启/关闭状态
- 获取自动记忆目录的链接，点击后在编辑器中打开对应文件

这是调试记忆机制、确认指令是否正确加载的首要工具。

## 常见问题排查

### Claude不遵守CLAUDE.md中的指令

`CLAUDE.md`内容以用户消息的形式注入上下文，而非系统提示的一部分，因此`Claude`会尽力遵循，但没有强制保证。

排查步骤：

1. 运行`/memory`确认该`CLAUDE.md`文件确实在加载列表中；若不在列表中，说明文件路径有误或未被加载
2. 检查文件是否位于正确位置（见上文"文件位置与作用域"章节）
3. 将指令改写得更具体，例如将"规范格式"改为"使用2空格缩进"
4. 检查多个文件之间是否存在冲突指令，若有冲突应删除或统一

### CLAUDE.md文件过大

超过`200`行的文件会消耗更多上下文且降低遵从度。解决方法：

- 将详细内容移至`Rules`文件，在`CLAUDE.md`中保留摘要
- 使用`@path`引用详细说明文档
- 定期清理过期、冗余的指令

### 使用/compact后指令丢失

`/compact`命令压缩对话历史，但`CLAUDE.md`会完整保留。压缩后`Claude`会重新从磁盘读取`CLAUDE.md`并注入会话。

若某条指令在`/compact`后消失，说明该指令仅在对话中给出，没有写入`CLAUDE.md`。将其添加到`CLAUDE.md`文件即可使其持久化。

### 不清楚Auto Memory保存了什么

运行`/memory`并打开自动记忆目录，即可查看`Claude`保存的所有内容——全部是普通`Markdown`文件，可随时编辑或删除。
