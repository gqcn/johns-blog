---
slug: "/ai/claude-code-mcp"
title: "Claude Code MCP使用指南"
hide_title: true
keywords:
  [
    "Claude Code",
    "MCP",
    "Model Context Protocol",
    "模型上下文协议",
    "工具集成",
    "外部工具",
    "MCP服务器",
    "stdio",
    "HTTP",
    "SSE",
    "工具调用",
    "GitHub",
    "Sentry",
    "PostgreSQL",
    "数据库查询",
    "OAuth认证",
    "作用域",
    "项目配置",
    "团队协作",
    "Tool Search",
    "MCP资源",
    "工作流自动化",
    "AI集成",
    "开发提效",
    "Notion"
  ]
description: "MCP（Model Context Protocol，模型上下文协议）是Anthropic提出的开放标准，允许Claude Code连接到数百种外部工具、数据库和API服务。本文全面介绍MCP的设计背景与核心原理、三种传输方式（HTTP/SSE/stdio）、三种作用域（本地/项目/用户）的配置方法、OAuth认证机制、MCP资源引用、Tool Search动态加载等核心功能，并提供GitHub代码审查、Sentry错误监控、PostgreSQL数据库查询等实用示例，帮助开发者快速上手并充分发挥Claude Code与外部生态融合的强大能力。"
toc_max_heading_level: 3
---

## 前言

`Claude Code`作为`AI`驱动的编程智能体，其强大之处不仅在于理解代码和执行任务，更在于与外部工具生态的深度集成。在真实的开发工作流中，我们往往需要跨越多个系统：查询`GitHub`上的`Issue`、在`Sentry`中排查线上异常、向`PostgreSQL`中检索数据、在`Figma`中同步设计稿……若每次都需要手动切换工具、复制粘贴内容，效率将大打折扣。

`MCP（Model Context Protocol，模型上下文协议）`正是为彻底解决这一问题而生。它是`Anthropic`提出的开放标准，让`Claude Code`能够像调用本地工具一样，无缝访问数百种外部系统——无需切换窗口，无需手动传递上下文，一切在对话中自然完成。

## 什么是MCP

![Claude Code MCP](assets/1200-Claude-Code-MCP使用指南/image.png)

### 设计背景与问题定义

在没有`MCP`之前，`AI`助手与外部工具的集成面临两大痛点：

- **上下文割裂**：开发者需要在不同工具之间手动复制信息，然后粘贴给`AI`，既繁琐又容易遗漏关键细节。即便`AI`给出了建议，执行动作（如创建`Issue`、发起部署）也仍需手动操作。

- **集成碎片化**：每个`AI`工具都有独立的插件系统，生态不互通，开发者很难将一套集成配置复用到多个`AI`工具中。

`MCP`的出现解决了这两个问题。它定义了一套通用的、可互操作的协议，让任何遵循该协议的工具（`MCP`服务器）都可以被任何支持该协议的`AI`客户端（如`Claude Code`）直接调用。

### 核心设计原理

`MCP`采用**客户端-服务器模型**：

```text
+------------------+           MCP Protocol          +-----------------------+
|   Claude Code    |    <----------------------->    |       MCP Server      |
|   (MCP Client)   |   Tools / Resources / Prompts   | (GitHub, Sentry, ...) |
+------------------+                                 +-----------------------+
```

`MCP`服务器向客户端暴露三类能力：

| 能力类型 | 说明 | 示例 |
|---------|------|------|
| **Tools（工具）** | 可执行的操作，如创建`Issue`、查询数据库 | `create_issue`、`run_query` |
| **Resources（资源）** | 可读取的数据，使用`@`引用语法访问 | `@github:issue://123` |
| **Prompts（提示）** | 预定义的指令模板，以`/`命令形式使用 | `/mcp__github__pr_review` |

这种设计让`Claude Code`不仅能读取外部数据，还能主动触发外部系统的操作，真正实现端到端的自动化工作流。

### MCP能够解决的典型场景

连接了`MCP`服务器之后，你可以对`Claude Code`提出例如以下这样的请求：

- **跨系统任务自动化**：实现`JIRA ENG-4521`中描述的功能，并在`GitHub`上创建`PR`
- **数据驱动决策**：查询`PostgreSQL`，找出过去`90`天内未下单的用户
- **监控与排障**：检查`Sentry`中过去`24`小时内最常见的错误，定位是哪个发布版本引入的
- **设计到代码**：根据`Figma`中最新的设计稿，更新我们的邮件模板

## 安装MCP服务器

### 三种传输方式

`MCP`支持三种传输协议，适用于不同的集成场景：

#### HTTP传输（推荐）

`HTTP`是连接远程云服务的推荐方式，支持最广泛，绝大多数云端`MCP`服务均采用此协议：

```bash
# 基本语法
claude mcp add --transport http <name> <url>

# 示例：连接Notion
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 示例：带Bearer Token认证
claude mcp add --transport http secure-api https://api.example.com/mcp \
  --header "Authorization: Bearer your-token"
```

#### SSE传输（已废弃）

`SSE（Server-Sent Events）`传输已被官方标记为废弃，建议优先选用`HTTP`传输。若服务端尚未支持`HTTP`，可临时使用：

```bash
# 基本语法
claude mcp add --transport sse <name> <url>

# 示例：连接Asana
claude mcp add --transport sse asana https://mcp.asana.com/sse
```

#### stdio传输（本地进程）

`stdio`方式将`MCP`服务器作为本地子进程运行，适合需要直接访问本地文件系统或运行自定义脚本的场景：

```bash
# 基本语法
claude mcp add [选项] <name> -- <command> [args...]

# 示例：添加Airtable服务器
claude mcp add --transport stdio --env AIRTABLE_API_KEY=YOUR_KEY airtable \
  -- npx -y airtable-mcp-server
```

> **注意**：所有选项（`--transport`、`--env`、`--scope`、`--header`）必须放在服务器名称之前，`--`（双横线）用于分隔服务器名称与实际执行的命令及参数。

### 管理已配置的服务器

```bash
# 列出所有已配置的服务器
claude mcp list

# 查看特定服务器的详情
claude mcp get github

# 移除服务器
claude mcp remove github

# 在Claude Code对话中查看服务器状态
/mcp
```

## MCP作用域配置

`MCP`服务器支持三种作用域，决定了配置的存储位置和共享范围：

### 作用域对比

| 作用域 | 存储位置 | 可见性 | 适用场景 |
|-------|---------|-------|---------|
| `local`（默认） | `~/.claude.json`（按项目路径索引） | 仅当前用户，仅当前项目 | 个人专用配置、含敏感凭据的服务器 |
| `project` | 项目根目录的`.mcp.json` | 整个团队（可提交到版本控制） | 团队共享服务器、项目特定工具 |
| `user` | `~/.claude.json`（全局） | 当前用户跨所有项目 | 个人常用工具、跨项目复用的服务 |

### 本地作用域（local）

默认作用域，配置仅对当前用户在当前项目中生效，适合存放个人或含有敏感凭据的配置：

```bash
# 添加本地作用域服务器（默认）
claude mcp add --transport http stripe https://mcp.stripe.com

# 显式指定本地作用域
claude mcp add --transport http stripe --scope local https://mcp.stripe.com
```

### 项目作用域（project）

配置保存在项目根目录的`.mcp.json`文件中，可以提交到版本控制系统，确保团队所有成员使用一致的工具集：

```bash
# 添加项目作用域服务器
claude mcp add --transport http paypal --scope project https://mcp.paypal.com/mcp
```

生成的`.mcp.json`文件格式如下：

```json
{
  "mcpServers": {
    "shared-server": {
      "command": "/path/to/server",
      "args": [],
      "env": {}
    }
  }
}
```

`.mcp.json`还支持环境变量展开，方便团队成员各自维护本机特有的路径和密钥：

```json
{
  "mcpServers": {
    "api-server": {
      "type": "http",
      "url": "${API_BASE_URL:-https://api.example.com}/mcp",
      "headers": {
        "Authorization": "Bearer ${API_KEY}"
      }
    }
  }
}
```

语法说明：`${VAR}`展开为环境变量值；`${VAR:-default}`在变量未设置时使用默认值。

> **安全提示**：出于安全考虑，`Claude Code`在首次使用来自`.mcp.json`的项目作用域服务器前，会提示用户确认。若需重置确认记录，可运行`claude mcp reset-project-choices`。

### 用户作用域（user）

配置跨所有项目可用，仅对当前用户可见，适合个人常用的基础工具：

```bash
# 添加用户作用域服务器
claude mcp add --transport http hubspot --scope user https://mcp.hubspot.com/anthropic
```

### 作用域优先级

当多个作用域存在同名服务器时，优先级从高到低为：**本地（local）> 项目（project）> 用户（user）**，确保个人配置可以覆盖团队共享配置。

## 使用示例

### 使用GitHub进行代码审查

```bash
# 添加GitHub MCP服务器
claude mcp add --transport http github https://api.githubcopilot.com/mcp/

# 在Claude Code中认证
/mcp
```

连接后，可以在对话中直接操作`GitHub`：

```text
Review PR #456 and suggest improvements

Create a new issue for the login bug we just found

Show me all open PRs assigned to me
```

### 使用Sentry监控线上错误

```bash
# 添加Sentry MCP服务器
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 认证后即可查询
/mcp
```

连接后，可以直接用自然语言排查问题：

```text
What are the most common errors in the last 24 hours?

Show me the stack trace for error ID abc123

Which deployment introduced these new errors?
```

### 查询PostgreSQL数据库

```bash
# 添加数据库MCP服务器（stdio方式，本地运行）
claude mcp add --transport stdio db -- npx -y @bytebase/dbhub \
  --dsn "postgresql://readonly:pass@prod.db.com:5432/analytics"
```

连接后，可以用自然语言查询数据：

```text
What's our total revenue this month?

Show me the schema for the orders table

Find customers who haven't made a purchase in 90 days
```

### 从Claude Desktop导入配置

如果已在`Claude Desktop`中配置了`MCP`服务器，可以一键导入：

```bash
# 导入Claude Desktop中的服务器（仅支持macOS和WSL）
claude mcp add-from-claude-desktop

# 验证导入结果
claude mcp list
```

### 通过JSON配置添加服务器

对于复杂的服务器配置，可以直接使用`JSON`格式添加：

```bash
# 添加带自定义Header的HTTP服务器
claude mcp add-json weather-api \
  '{"type":"http","url":"https://api.weather.com/mcp","headers":{"Authorization":"Bearer token"}}'

# 添加本地stdio服务器
claude mcp add-json local-tools \
  '{"type":"stdio","command":"/path/to/tool","args":["--verbose"],"env":{"LOG_LEVEL":"debug"}}'
```


## MCP与Skills的区别与选型

`Claude Code`提供了两种扩展机制：`MCP`和`Skills`。二者都能增强`Claude`的能力，但定位截然不同，理解它们的边界有助于在合适的场景做出正确选择。

### 核心差异对比

| 维度 | MCP | Skills |
|-----|-----|--------|
| **本质** | 外部系统集成协议 | 知识与工作流封装单元 |
| **集成对象** | 外部服务、数据库、`API` | 团队规范、领域知识、重复性流程 |
| **部署要求** | 需运行`MCP`服务器进程（远程或本地） | 仅需一个`SKILL.md`文本文件 |
| **交互方式** | 通过网络协议调用外部系统 | 通过上下文注入指导`Claude`行为 |
| **数据来源** | 实时从外部系统获取 | 静态写入`SKILL.md`，随调用注入 |
| **触发方式** | `Claude`主动调用工具函数 | 斜杠命令触发或`Claude`自动识别加载 |
| **编写门槛** | 需部署服务器（或使用现成的） | 只需编写`Markdown`文件 |
| **更新方式** | 修改服务器端逻辑或重新配置 | 直接编辑`SKILL.md`文件 |

### 设计意图的本质区别

**`MCP`解决的是"连接"问题**：让`Claude`能够"触达"外部世界——读取数据库中的实时数据、在`GitHub`上创建`Issue`、查询`Sentry`中的线上错误。`MCP`是`Claude`的感知器官和执行终端，负责与外部系统建立双向通信。

**`Skills`解决的是"记忆"问题**：将团队的最佳实践、代码规范、业务约定固化为`Claude`可随时调取的专业知识。`Skills`是`Claude`的知识库和工作手册，负责让`Claude`始终以一致、专业的方式行事。

### 选型建议

根据实际需求，可以按以下思路做选择：

**选择`MCP`的场景：**

- 需要访问实时数据（数据库查询、监控数据、`API`响应）
- 需要触发外部系统的操作（创建`Issue`、发送通知、触发`CI/CD`）
- 需要读取或操作第三方平台上的内容（`Notion`文档、`Figma`设计稿、`Jira`工单）
- 需要与现有基础设施深度集成

**选择`Skills`的场景：**

- 需要将团队代码规范、提交格式、架构约定固化为`Claude`能自动遵守的规则
- 需要标准化部署、发布、代码审查等重复性多步骤流程
- 需要向`Claude`注入特定业务领域的专业知识（如特定框架的用法惯例）
- 需要一套轻量的、无需额外基础设施的扩展方案

**两者配合使用：**

`MCP`与`Skills`并不互斥，在复杂场景下可以协同工作。例如，用`MCP`连接数据库获取实时数据，同时用`Skills`定义分析这些数据时应遵循的业务规则和输出格式；或者用`MCP`连接`GitHub`，用`Skills`定义团队的`PR`审查标准——`Claude`在审查代码时，既能通过`MCP`直接获取`PR`内容，又能依据`Skills`中定义的规范给出符合团队风格的反馈。

## 其他MCP特性介绍


### OAuth认证

许多云端`MCP`服务器需要身份认证。`Claude Code`支持`OAuth 2.0`，认证流程简单：

```bash
# 第一步：添加需要认证的服务器
claude mcp add --transport http sentry https://mcp.sentry.dev/mcp

# 第二步：在Claude Code中运行/mcp命令
/mcp

# 第三步：按提示在浏览器中完成登录
```

认证令牌会安全存储并自动刷新。若需撤销访问权限，在`/mcp`菜单中选择「`Clear authentication`」即可。



### 使用MCP资源

`MCP`服务器可以暴露资源（`Resources`），通过`@`语法在对话中直接引用，与引用本地文件的体验一致：

```text
# 引用GitHub Issue
Can you analyze @github:issue://123 and suggest a fix?

# 引用API文档
Please review the API documentation at @docs:file://api/authentication

# 同时引用多个资源进行对比
Compare @postgres:schema://users with @docs:file://database/user-model
```

在提示词中输入`@`可触发自动补全，列出所有已连接服务器中可用的资源。

### 使用MCP提示命令

`MCP`服务器还可以暴露提示模板（`Prompts`），以`/`命令的形式集成到`Claude Code`的命令系统中：

```bash
# 命令格式：/mcp__<服务器名>__<提示名>

# 无参数执行
/mcp__github__list_prs

# 带参数执行（参数以空格分隔）
/mcp__github__pr_review 456

# 带多个参数
/mcp__jira__create_issue "Login bug" high
```

在对话中输入`/`即可浏览所有可用命令，包括来自各`MCP`服务器的提示命令。

### MCP工具搜索（Tool Search）

当配置了大量`MCP`服务器时，工具定义本身会占用大量上下文窗口。`MCP Tool Search`通过按需动态加载工具来解决这一问题。

#### 工作原理

```text
Without Tool Search:          With Tool Search:
All tools preloaded           Tools deferred until needed
[Tool 1 def][Tool 2 def]  ->  [Search Tool] -> load Tool N on demand
[Tool 3 def]...               (saves context window space)
```

当`MCP`工具定义超过上下文窗口的`10%`时，`Tool Search`会自动激活。激活后：

1. `MCP`工具不再预加载到上下文中
2. `Claude`通过搜索工具按需发现并加载所需工具
3. 从用户视角看，工具行为与之前完全相同

#### 配置Tool Search

通过`ENABLE_TOOL_SEARCH`环境变量控制行为：

| 取值 | 说明 |
|-----|------|
| `auto`（默认） | 超过上下文`10%`时自动激活 |
| `auto:5` | 自定义阈值，超过`5%`时激活 |
| `true` | 始终启用 |
| `false` | 禁用，所有工具预加载 |

```bash
# 使用自定义5%阈值
ENABLE_TOOL_SEARCH=auto:5 claude

# 禁用Tool Search
ENABLE_TOOL_SEARCH=false claude
```

> **注意**：`Tool Search`功能要求使用`Sonnet 4`及以上版本或`Opus 4`及以上版本的模型，`Haiku`系列模型不支持此功能。

### 输出限制说明

当`MCP`工具返回大量数据时，`Claude Code`会进行提示和限制：

| 配置项 | 默认值 | 说明 |
|-------|-------|------|
| 警告阈值 | `10,000 tokens` | 超过时显示警告 |
| 最大输出 | `25,000 tokens` | 默认上限 |
| `MAX_MCP_OUTPUT_TOKENS` | `25,000` | 可通过环境变量调整上限 |

```bash
# 提高输出上限（适用于查询大型数据集的场景）
export MAX_MCP_OUTPUT_TOKENS=50000
claude
```

### 将Claude Code作为MCP服务器

`Claude Code`自身也可以作为`MCP`服务器，将其工具能力（文件读写、`Shell`命令执行等）暴露给其他`MCP`客户端：

```bash
# 启动Claude Code作为stdio MCP服务器
claude mcp serve
```

在`Claude Desktop`的配置文件`claude_desktop_config.json`中添加以下配置即可集成：

```json
{
  "mcpServers": {
    "claude-code": {
      "type": "stdio",
      "command": "/full/path/to/claude",
      "args": ["mcp", "serve"],
      "env": {}
    }
  }
}
```

> **注意**：`command`字段必须使用`Claude Code`可执行文件的完整路径。可通过`which claude`命令获取。


## 总结

`MCP`是`Claude Code`打通外部世界的核心机制，其设计价值体现在三个层面：

- **标准化**：一套协议统一所有工具集成，告别碎片化的插件生态
- **自动化**：从信息查询到动作执行，全程在`AI`对话中完成，无需手动切换工具
- **可扩展**：支持`HTTP`、`SSE`、`stdio`三种传输方式，覆盖云端服务和本地工具的所有集成场景

通过合理配置`MCP`服务器，开发者可以让`Claude Code`直接接入`GitHub`、`Sentry`、数据库、设计工具等日常工作中的核心系统，实现真正意义上的全流程`AI`辅助开发。

## 参考资料

- https://code.claude.com/docs/en/mcp