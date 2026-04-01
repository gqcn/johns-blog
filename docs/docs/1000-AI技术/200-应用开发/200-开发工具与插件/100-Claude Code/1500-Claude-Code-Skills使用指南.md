---
slug: "/ai/claude-code-skills"
title: "Claude Code Skills使用指南"
hide_title: true
keywords:
  [
    "Claude Code",
    "Skills",
    "技能系统",
    "SKILL.md",
    "slash command",
    "斜杠命令",
    "Agent Skills",
    "开放标准",
    "自定义技能",
    "个人技能",
    "项目技能",
    "企业技能",
    "内置技能",
    "Bundled Skills",
    "context fork",
    "子智能体",
    "Subagent",
    "动态上下文",
    "参数注入",
    "disable-model-invocation",
    "user-invocable",
    "allowed-tools",
    "技能分发",
    "技能共享",
    "工作流自动化",
    "代码规范",
    "progressive disclosure",
    "渐进式披露"
  ]
description: "Claude Code Skills是一套基于Agent Skills开放标准的技能扩展机制，通过编写SKILL.md文件让Claude掌握领域专业知识和自定义工作流，既可由用户以斜杠命令手动触发，也可由Claude在对话中自动识别并加载，从而将重复性的最佳实践固化为可复用、可分发的技能单元。本文详细介绍Skills的设计原理、内置技能列表、技能存储位置、SKILL.md格式规范、frontmatter配置项，并通过代码规范检查、自动提交、PR摘要生成等多个实用示例，帮助开发者快速上手编写和使用Skills，显著提升AI辅助开发的效率和一致性。"
toc_max_heading_level: 4
---

## 前言

在持续使用`Claude Code`的过程中，开发者往往会积累一套属于自己或团队的最佳实践：提交代码时要遵循特定格式、代码审查时要检查哪些维度、部署前要验证哪些步骤。这些经验通常存在于脑海或文档中，每次都需要手动向`Claude`解释一遍，耗时且容易遗漏。

`Skills`正是为了解决这一痛点而设计的。它允许将任意知识、规范或工作流封装进一个`SKILL.md`文件，`Claude`便能将其纳入自己的工具箱——在合适的时机自动调用，或者由用户以斜杠命令主动触发。

## 什么是Skills

![Claude Code Skills](assets/1500-Claude-Code-Skills使用指南/image.png)

`Skills`是`Claude Code`提供的技能扩展机制，核心是一个包含`SKILL.md`文件的目录。创建`SKILL.md`后，`Claude`会将该技能加入工具箱：可以用`/技能名`直接调用，也可以由`Claude`在对话时判断相关性后自动加载。

`Claude Code`的`Skills`遵循 [Agent Skills](https://agentskills.io/) 开放标准。该标准由`Anthropic`主导维护，旨在让技能文件可以跨多种`AI`工具使用，实现"编写一次，到处运行"。`Claude Code`在标准基础上扩展了调用控制、子智能体执行、动态上下文注入等高级特性。

:::info NOTE
`Skills`与旧版`.claude/commands/`目录完全兼容。`commands/`下的`.md`文件和`skills/`下的`SKILL.md`都能创建同名斜杠命令，两者功能一致。`Skills`额外支持支撑文件目录、自动加载触发和调用权限控制。如果同名冲突，`Skills`优先级更高。
:::

### 设计目标

`Skills`设计的核心目标是将领域知识与工作流程变为**可复用、可分发**的单元，主要解决以下问题：

- **知识固化**：将代码规范、架构约定、业务领域知识写入技能，让`Claude`始终"记住"，无需每次重复说明
- **工作流标准化**：将部署、提交、代码审查等多步骤流程封装为一条命令，保证团队执行一致性
- **上下文按需加载**：技能描述始终在上下文中，完整内容只在调用时加载，避免浪费上下文窗口
- **跨项目复用**：个人技能在所有项目中通用，项目技能随代码仓库版本控制，团队成员可直接使用

### 设计原理：渐进式披露

`Skills`采用 **渐进式披露（Progressive Disclosure）** 机制管理上下文效率：

```text
Session Start
     |
     v
[Discovery]  ──  仅加载所有技能的 name + description
     |           (轻量级，让 Claude 知道"有什么可用")
     v
[Activation] ──  用户输入或对话内容匹配技能 description
     |           (Claude 决定加载完整 SKILL.md)
     v
[Execution]  ──  Claude 按照 SKILL.md 指令执行任务
                 (按需加载支撑文件、执行脚本)
```

这种设计确保大量技能同时存在时，不会撑满上下文窗口；只有真正需要的技能才会被完整加载。

## 内置技能（Bundled Skills）

`Claude Code`自带一批开箱即用的内置技能，随每次会话提供，通过`/技能名`调用：

| 技能名 | 调用方式 | 功能说明 |
|--------|---------|---------|
| `simplify` | `/simplify [重点]` | 审查近期改动文件，并行启动代码复用、质量、效率三个子智能体，汇总后修复问题 |
| `batch` | `/batch <指令>` | 将大规模代码变更分解为`5`～`30`个独立单元，每单元启动独立子智能体并行实现，各自运行测试和开`PR` |
| `debug` | `/debug [描述]` | 读取当前会话调试日志，分析会话异常，可传入描述来聚焦分析方向 |
| `loop` | `/loop [间隔] <提示词>` | 按指定时间间隔循环执行提示词，适用于轮询部署状态、持续监控`PR`等场景 |
| `claude-api` | `/claude-api` | 加载当前项目语言对应的`Claude API`参考资料，也会在代码`import anthropic`时自动激活 |

## 技能存储位置

技能的存储位置决定了它的适用范围：

| 级别 | 存放路径 | 适用范围 |
|------|---------|---------|
| 企业级 | 由管理员通过托管设置下发 | 组织内所有用户 |
| 个人级 | `~/.claude/skills/<技能名>/SKILL.md` | 本人的所有项目 |
| 项目级 | `.claude/skills/<技能名>/SKILL.md` | 当前项目仅 |
| 插件级 | `<插件目录>/skills/<技能名>/SKILL.md` | 安装了该插件的项目 |

当不同级别存在同名技能时，优先级为：**企业 > 个人 > 项目**。插件技能使用`插件名:技能名`的命名空间，不会与其他级别冲突。

:::tip
在`monorepo`大仓管理的代码仓库场景下，`Claude Code`会自动发现嵌套目录中的`.claude/skills/`子目录。例如编辑`packages/frontend/`中的文件时，也会自动加载`packages/frontend/.claude/skills/`里的技能。
:::

## 编写技能

### 目录结构

每个技能是一个独立目录，`SKILL.md`是必需的入口文件：

```text
my-skill/
├── SKILL.md           # 必需：主指令文件
├── template.md        # 可选：供 Claude 填写的模板
├── examples/
│   └── sample.md      # 可选：示例输出，展示期望格式
└── scripts/
    └── helper.py      # 可选：Claude 可执行的脚本
```

`SKILL.md`以外的文件属于**支撑文件**，需在`SKILL.md`中显式引用，`Claude`才知道它们的存在和用途。这让技能可以将大型参考文档、`API`规范等按需加载，而非每次都占用上下文。

:::tip
保持`SKILL.md`在`500`行以内，将详细参考资料移至独立文件中。
:::

### SKILL.md格式

`SKILL.md`由两部分组成：顶部的`YAML frontmatter`和正文`Markdown`指令。

```markdown
---
name: 技能名称
description: 技能描述，说明功能和触发时机
---

## 技能正文指令

在此编写 Claude 需要遵循的步骤和规则……
```

### Frontmatter配置项


`Frontmatter`的配置字段均为**可选**内容。

| 字段 | 说明 |
|------|------|
| `name` | 技能名称，成为`/斜杠命令`的名称。仅允许小写字母、数字和连字符，最长`64`字符。省略时使用目录名 |
| `description` | 技能描述，`Claude`依此判断何时自动加载。省略时使用正文第一段 |
| `argument-hint` | 在自动补全时显示的参数提示，如`[issue-number]`或`[filename] [format]` |
| `disable-model-invocation` | 设为`true`时，仅用户可手动调用，`Claude`不会自动触发。适合有副作用的工作流（如部署、发送消息）。默认`false` |
| `user-invocable` | 设为`false`时，技能从`/`菜单中隐藏，仅`Claude`可调用。适合作为后台知识库的技能。默认`true` |
| `allowed-tools` | 技能激活时`Claude`可免确认使用的工具列表，如`Read, Grep, Bash(git *)` |
| `model` | 该技能激活时使用的模型 |
| `context` | 设为`fork`时，技能在独立子智能体中运行，拥有隔离的上下文 |
| `agent` | `context: fork`时指定使用的子智能体类型：`Explore`、`Plan`、`general-purpose`或自定义子智能体名 |
| `hooks` | 作用于该技能生命周期的`Hooks`配置 |

**调用控制矩阵**：

`disable-model-invocation`和`user-invocable`两个字段共同决定技能的调用权限：

| 配置 | 用户可调用 | Claude可自动调用 | description加载入上下文 |
|------|-----------|----------------|----------------------|
| 默认 | 是 | 是 | 是 |
| `disable-model-invocation: true` | 是 | 否 | 否 |
| `user-invocable: false` | 否 | 是 | 是 |

### 参数传递

技能支持通过`$ARGUMENTS`占位符接收参数：

| 占位符 | 含义 |
|--------|------|
| `$ARGUMENTS` | 调用时传入的全部参数文本 |
| `$ARGUMENTS[N]` | 按位置（`0`起始）访问第`N`个参数 |
| `$N` | `$ARGUMENTS[N]`的简写，如`$0`表示第一个参数 |
| `${CLAUDE_SESSION_ID}` | 当前会话`ID` |
| `${CLAUDE_SKILL_DIR}` | 技能目录路径，用于引用技能内的脚本或文件 |

若调用时传入了参数但技能内无`$ARGUMENTS`占位符，`Claude Code`会自动将参数以`ARGUMENTS: <内容>`的形式追加到技能内容末尾。

## 使用示例

### 示例一：代码讲解技能

创建一个能用类比和图示讲解代码的个人技能：

**第一步：创建技能目录**

```bash
mkdir -p ~/.claude/skills/explain-code
```

**第二步：编写`SKILL.md`**

```markdown
---
name: explain-code
description: 用类比和图示讲解代码。当用户询问代码工作原理、请求介绍代码库、或询问"这是怎么工作的"时使用。
---

讲解代码时，始终包含以下内容：

1. **从类比开始**：将代码比作日常生活中熟悉的事物
2. **绘制图示**：用 ASCII 艺术展示流程、结构或关系
3. **逐步拆解**：一步一步解释代码执行过程
4. **指出常见误区**：指出容易踩的坑或常见误解

保持解释口语化。对于复杂概念，使用多个类比。
```

**第三步：测试技能**

```bash
# 让 Claude 自动识别触发（描述匹配）
How does this authentication flow work?

# 直接调用技能
/explain-code src/auth/login.ts
```

### 示例二：规范化提交技能

创建一个强制代码提交遵循`Conventional Commits`规范的项目技能：

```bash
mkdir -p .claude/skills/commit
```

```markdown
---
name: commit
description: 将当前改动以规范格式提交到 Git
disable-model-invocation: true
---

将当前所有改动提交到 Git，严格遵循 Conventional Commits 规范：

1. 运行 `git diff --staged` 查看暂存的改动
2. 分析改动类型，选择合适的提交类型前缀：
   - `feat`: 新功能
   - `fix`: Bug 修复
   - `docs`: 文档更新
   - `refactor`: 代码重构（无功能变更）
   - `test`: 测试相关
   - `chore`: 构建/工具链相关
3. 若存在 breaking change，在类型后加 `!`，并在正文中注明 `BREAKING CHANGE:`
4. 提交信息格式为：`<类型>(<范围>): <简短描述>`
5. 执行 `git commit -m "<提交信息>"`

不要直接 push，以便用户检查。
```

由于设置了`disable-model-invocation: true`，`Claude`不会在你没准备好时自动提交，只有你手动输入`/commit`才会触发。

### 示例三：PR摘要生成技能

使用动态上下文注入和子智能体的进阶技能：

```bash
mkdir -p ~/.claude/skills/pr-summary
```

```markdown
---
name: pr-summary
description: 为当前 Pull Request 生成结构化摘要，包括改动说明、影响范围和测试建议
context: fork
agent: Explore
allowed-tools: Bash(gh *)
---

## Pull Request 上下文

- PR 差异（diff）：!`gh pr diff`
- PR 评论：!`gh pr view --comments`
- 改动文件清单：!`gh pr diff --name-only`

## 你的任务

根据以上 PR 数据，生成一份结构化摘要，包含：

1. **改动概述**：用两三句话说明本次 PR 做了什么
2. **改动文件分析**：按模块分组列出关键改动
3. **潜在风险**：指出可能影响稳定性的改动点
4. **建议测试方向**：列出验证本次改动所需的关键测试场景
```

该技能的特点：
- `!command`：该语法在技能内容发送给`Claude`之前先执行`Shell`命令，将真实的`PR`数据注入提示词
- `context: fork`让技能在独立上下文的子智能体中运行，不占用主会话的上下文窗口
- `agent: Explore`使用只读工具集，确保摘要分析阶段不会意外修改任何文件

### 示例四：代码库规范知识库技能

将项目编码规范作为**背景知识**供`Claude`自动参考，而非用户手动调用的命令：

```markdown
---
name: project-conventions
description: 本项目的编码规范和架构约定，包括 API 设计、错误处理、数据库操作等规则
user-invocable: false
---

## API 设计规范

- 所有`REST`接口使用复数名词，如`/users`而非`/user`
- 错误响应格式统一为`{"code": "ERROR_CODE", "message": "..."}`
- 分页参数统一使用`page`和`pageSize`，默认`pageSize`为`20`

## 数据库操作规范

- 禁止在循环中执行数据库查询（N+1 问题）
- 所有批量写操作必须在事务中执行
- 查询语句必须有索引覆盖，禁止全表扫描

## 错误处理规范

- 业务错误使用自定义`AppError`类，包含错误码和用户可读信息
- 系统级错误需记录堆栈日志，不向用户暴露内部细节
```

`user-invocable: false`让这个技能不出现在`/`菜单中（它不是一个"命令"），但`Claude`在写代码时会自动参考其中的规范。

## 常见问题排查

### 技能没有自动触发

1. 检查`description`字段是否包含用户自然语言中会出现的关键词
2. 运行`What skills are available?`确认技能已被发现
3. 尝试换个措辞，让请求更贴近`description`中的描述
4. 若技能是`user-invocable`，可以直接用`/技能名`手动触发验证

### 技能触发频率过高

1. 使描述更精确，减少误匹配范围
2. 添加`disable-model-invocation: true`，改为仅手动调用

### Claude看不到全部技能

技能描述会占用上下文配额（默认为上下文窗口的`2%`，最少`16,000`字符）。若技能太多，部分技能可能被排除。运行`/context`可查看是否有技能被忽略的警告。

可通过设置环境变量`SLASH_COMMAND_TOOL_CHAR_BUDGET`来覆盖默认配额限制。

## 技能分发

根据受众不同，技能可以用多种方式分发：

- **项目共享**：将`.claude/skills/`目录提交到版本控制库，团队成员`clone`即可使用
- **插件打包**：在`Plugin`的`skills/`目录下提供技能，通过插件市场安装
- **企业下发**：通过托管设置（`managed settings`）将技能推送给组织内所有用户

## 参考资料

- [Claude Code Skills官方文档](https://code.claude.com/docs/en/skills)  
- [Agent Skills开放标准](https://agentskills.io/)  
- [Agent Skills规范说明](https://agentskills.io/specification)  
- [示例技能集合](https://github.com/anthropics/skills)
