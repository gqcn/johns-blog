---
slug: "/ai/antigravity-guide"
title: "Google Antigravity：Agent-First开发平台使用指南"
hide_title: true
keywords:
  [
    "Antigravity",
    "Google Antigravity",
    "AGY",
    "AI Agent",
    "AI编程工具",
    "agy CLI",
    "Antigravity IDE",
    "Antigravity 2.0",
    "Skills配置",
    "Rules配置",
    "Hooks配置",
    "MCP协议",
    "MCP Server",
    "Plugins配置",
    "GEMINI.md",
    "AGENTS.md",
    "斜杠指令",
    "slash commands",
    "记忆系统",
    "Agent定制化",
    "AI开发工具对比",
    "Claude Code对比",
    "Codex对比",
    "智能体循环",
    "agy customizations",
    "progressive disclosure",
    "权限配置",
    "toolPermission",
    "permissions.allow",
    "permissions.deny",
    "always-proceed"
  ]
description: "本文介绍Google Antigravity的核心特性、多端使用方式（CLI、IDE、Antigravity 2.0）、定制化体系（Rules、Skills、Hooks、MCP、Plugins）和细粒度权限配置，并与Claude Code、Codex等工具进行横向对比。"
toc_max_heading_level: 4
---

## 什么是Antigravity

`Antigravity`（简称`AGY`，https://antigravity.google/ ）是`Google`推出的`Agent-First`开发平台。与传统代码补全插件不同，它让`Agent`直接使用编辑器、终端、浏览器和外部工具，完成规划、实现和验证等多步骤任务。


本文聚焦三种主要交互方式：

- **`Antigravity CLI`（`agy`）**：轻量级终端界面，适合快速交互与脚本自动化
- **`Antigravity IDE`**：独立的`AI-First`集成开发环境，集成编辑器、终端和浏览器`Agent`
- **`Antigravity 2.0`**：独立桌面应用，面向`Agent`编排、异步任务和可视化监控

### 核心特点

| 特性 | 说明 |
|------|------|
| **多端协同** | `CLI`与`Antigravity 2.0`共享核心`Agent Harness`和部分设置，定制化路径按界面区分 |
| **`AI-First`设计** | 以`Agent`为核心，支持多步骤自主任务执行 |
| **高度可定制** | 通过`Rules`、`Skills`、`Hooks`、`MCP`、`Plugins`五大定制化类型灵活扩展 |
| **渐进式披露** | 初始只注入`Skill`名称和描述，需要时再加载完整内容 |
| **团队协作** | 定制化配置可通过版本控制系统在团队中共享 |
| **多模型支持** | 支持`Gemini`、`Claude`和`GPT-OSS`等模型，实际可用范围取决于套餐 |
| **安全沙箱** | 支持终端沙箱模式，限制`Agent`命令执行范围 |

## 安装与启动

### 安装Antigravity CLI

```bash
# 通过官方安装脚本安装
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

安装完成后，运行`agy`命令即可启动`CLI`交互界面。首次运行时，按照屏幕提示完成`Google`账号认证。

### 基本操作

```bash
# 启动 CLI
agy

# 查看所有子命令和参数
agy --help

# 在 CLI 内查看所有斜杠命令
/help

# 退出
Ctrl+D  # 提示框为空时，或输入 /exit、/quit
```

## 定制化系统

`Antigravity`的定制化系统是其最核心的差异化能力，允许开发者将通用`AI`助手改造为专精于特定项目和工作流的专家级伙伴。系统包含五种定制化类型：

| 类型 | 配置文件/目录 | 作用范围 | 适用场景 |
|------|--------------|---------|---------|
| **Rules** | `GEMINI.md`、`AGENTS.md`、`.agents/rules/*.md` | 上下文/层级 | 编码规范、`API`限制、项目规约 |
| **Skills** | `skills/<name>/SKILL.md` | 按需激活 | 多步骤工作流、操作手册 |
| **Plugins** | `plugins/<name>/plugin.json` | 打包分发 | 将`Skills`、`Agents`、`Rules`、`Hooks`和`MCP`打包分发 |
| **Hooks** | `hooks.json` | 生命周期事件 | 工具执行前后的自动化脚本 |
| **MCP Servers** | `mcp_config.json` | 工具集成 | 接入外部服务和自定义工具 |

### 定制化目录发现机制

`Antigravity`主要从以下位置发现定制化配置：

| 类型 | 工作区位置 | `Antigravity CLI`全局位置 | `Antigravity 2.0`/`IDE`全局位置 |
|------|-----------|---------------------------|----------------------------------|
| Rules | `.agents/rules/*.md`、工作区根目录的`GEMINI.md`/`AGENTS.md` | `~/.gemini/antigravity-cli/rules/`、`~/.gemini/GEMINI.md` | `~/.gemini/GEMINI.md` |
| Skills | `.agents/skills/<name>/` | `~/.gemini/antigravity-cli/skills/` | `~/.gemini/config/skills/` |
| Plugins | `.agents/plugins/<name>/` | `~/.gemini/antigravity-cli/plugins/` | `~/.gemini/config/plugins/` |
| Hooks | `.agents/hooks.json` | `~/.gemini/config/hooks.json`或`settings.json` | `~/.gemini/config/hooks.json` |
| MCP | `.agents/mcp_config.json` | `~/.gemini/config/mcp_config.json` | `~/.gemini/config/mcp_config.json` |

Rules 和 Skills 默认使用`.agents/`，目前仍向后兼容`.agent/rules/`和`.agent/skills/`。不要将这一兼容性扩展为`_agents/`或`_agent/`等未被官方文档列出的路径。

### Rules（规则配置）

`Rules`是提供给`Agent`的持久上下文，适合定义编码风格、架构约束和测试流程。它们会影响模型行为，但不等同于由运行时强制执行的权限或安全策略。

**规则文件格式**：

规则以`Markdown`格式编写，通常存放在工作区根目录的`.agents/rules/`中。可以在界面中设置手动、始终启用、模型判断或文件`Glob`匹配等激活方式；根目录的`GEMINI.md`和`AGENTS.md`也可用于提供代码库级说明。

```markdown
# 项目编码规范

- 所有函数必须包含单元测试
- 禁止直接操作数据库，需通过 Repository 层
- API 响应必须包含统一的 Result 包装结构
```

单个规则文件最多`12,000`个字符。规则应保持短小；仅在特定任务中使用的长流程更适合放入`Skill`，避免长期占用上下文。

### Skills（技能配置）

`Skills`是模块化的知识与操作流程包，为`Agent`扩展特定能力。与`Rules`不同，`Skills`不会默认注入上下文，而是仅将名称和描述注入，由模型按需激活——这正是"渐进式披露"的核心设计。

**目录结构**：

```
.agents/skills/<skill_name>/
├── SKILL.md          # 必需：主指令文件（含 frontmatter）
├── scripts/          # 可选：辅助脚本
├── examples/         # 可选：参考实现示例
├── resources/        # 可选：资源文件、模板
└── references/       # 可选：详细参考文档
```

**`SKILL.md`格式示例**：

```markdown
---
name: run-integration-tests
description: >-
  当用户要求运行集成测试时使用本 Skill。
  该 Skill 会准备测试环境、执行测试套件并分析结果。
---

# 集成测试运行指南

## 步骤

1. 运行准备脚本：[prepare.sh](./scripts/prepare.sh)
2. 执行测试命令：`npm test`
3. 检查日志文件分析测试结果
```

**`frontmatter`字段说明**：

| 字段 | 类型 | 必需 | 说明 |
|------|------|------|------|
| `name` | string | 否 | 唯一标识符；省略时默认使用目录名，建议使用小写连字符格式 |
| `description` | string | 是 | 模型根据此描述决定是否激活该`Skill` |

**编写`Skills`的最佳实践**：

- 保持`SKILL.md`简洁，将大量文档放在`references/`子目录，按需加载
- 将复杂命令序列封装在`scripts/`目录的脚本中
- 始终包含验证步骤，让`Agent`能确认操作是否成功
- 不要重复描述`Agent`本身已知的通用知识，聚焦于项目特有的流程

### Hooks（生命周期钩子）

`Hooks`允许在`Agent`执行循环的特定时机运行外部脚本，适合实现安全检查、代码格式化、自动诊断等功能。

**配置文件位置**：`.agents/hooks.json`

**支持的事件类型**：

| 事件 | 触发时机 | 是否支持`matcher` |
|------|---------|-----------------|
| `PreToolUse` | 工具执行前 | 是（按工具名匹配） |
| `PostToolUse` | 工具执行后 | 是（按工具名匹配） |
| `PreInvocation` | 模型调用前 | 否 |
| `PostInvocation` | 每次模型调用完成后 | 否 |
| `Stop` | 执行循环终止时 | 否 |

**配置示例**：

```json
{
  "lint-checker": {
    "PostToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/lint.sh",
            "timeout": 10
          }
        ]
      }
    ]
  },
  "safety-gate": {
    "enabled": false,
    "PreToolUse": [
      {
        "matcher": "run_command",
        "hooks": [
          {
            "command": "./scripts/safety-check.sh"
          }
        ]
      }
    ]
  }
}
```

**`PreToolUse`钩子的输入/输出约定**：

钩子脚本通过`stdin`接收`JSON`格式的上下文，并将决策结果输出到`stdout`：

```json
{
  "decision": "ask",
  "reason": "执行测试命令前需要用户确认。",
  "permissionOverrides": ["command(npm test)"]
}
```

`decision`字段支持五种值：`allow`（自动允许）、`deny`（硬拒绝）、`ask`（询问用户并尊重已有授权）、`force_ask`（忽略已有授权并强制询问）、`deny_unless_prior_grant`（只有已存在授权时才允许）。

### MCP Servers（模型上下文协议服务器）

`MCP`（`Model Context Protocol`）是连接`AI`模型与外部工具/数据的开放标准。通过配置`MCP Server`，可以将自定义工具、数据库查询、外部服务等能力暴露给`Agent`。

**配置文件位置**：

| 范围 | 路径 |
|------|------|
| 全局 | `~/.gemini/config/mcp_config.json` |
| 工作区 | `<项目根>/.agents/mcp_config.json` |
| 插件级 | `plugins/<plugin_name>/mcp_config.json` |

**配置示例**：

```json
{
  "mcpServers": {
    "sqlite-helper": {
      "command": "sqlite-mcp-server",
      "args": ["/path/to/database.db"],
      "env": {
        "DB_READONLY": "true"
      }
    },
    "remote-service": {
      "serverUrl": "https://mcp.mycompany.com/sse"
    }
  }
}
```

**传输机制**：

| 类型 | 适用场景 | 关键字段 |
|------|---------|---------|
| `Stdio`（本地） | 运行本地可执行文件或脚本 | `command`、`args`、`env` |
| 远程服务 | `Streamable HTTP`、`SSE`等远程传输 | `serverUrl`、可选`headers`/`oauth` |

`MCP Server`连接成功后，`Antigravity`会自动发现其提供的工具。CLI 中可输入`/mcp`查看状态；`Antigravity 2.0`可在**Settings > Customizations > Installed MCP Servers**中管理；IDE 则从侧边栏的**... > MCP Servers**进入。

### Plugins（插件配置）

`Plugins`是将`Skills`、`Rules`、`Hooks`和`MCP Server`配置打包为单一可分发单元的机制，是向团队分发复杂定制化的推荐方式。

**目录结构**：

```
.agents/plugins/<plugin_name>/
├── plugin.json       # 必需：插件清单文件
├── mcp_config.json   # 可选：插件提供的 MCP Server
├── hooks.json        # 可选：插件的生命周期钩子
├── agents/           # 可选：自定义子 Agent
├── rules/            # 可选：插件启用时加载的规则
│   └── <rule_name>.md
└── skills/           # 可选：插件提供的 Skills
    └── <skill_name>/
        └── SKILL.md
```

**`plugin.json`格式**：

```json
{
  "name": "team-developer-kit",
  "description": "团队通用开发规则与工作流"
}
```

工作区插件放在`.agents/plugins/`；`Antigravity 2.0`和 IDE 的全局插件放在`~/.gemini/config/plugins/`。CLI 可以使用以下命令安装和管理插件，安装后的文件位于`~/.gemini/antigravity-cli/plugins/`：

```bash
agy plugin list
agy plugin install /path/to/local/plugin
agy plugin enable my-plugin
agy plugin disable my-plugin
agy plugin uninstall my-plugin
```

## 配置管理

`Antigravity`将运行时设置与模型上下文分开管理：`settings.json`控制界面、沙箱和权限等可执行策略；`GEMINI.md`、`AGENTS.md`和 Rules 为模型提供项目说明，但不能覆盖运行时权限。

### 全局配置文件（settings.json）

`Antigravity CLI`的全局配置文件位于`~/.gemini/antigravity-cli/settings.json`，常用配置项如下：

| 配置项 | 类型 | 说明 |
|--------|------|------|
| `colorScheme` | string | 终端配色，如`terminal`、`dark`、`light`、`tokyo night` |
| `toolPermission` | string | 工具执行策略，如`request-review`、`proceed-in-sandbox` |
| `artifactReviewPolicy` | string | 代码等产物写入前的审查策略 |
| `allowNonWorkspaceAccess` | boolean | 是否允许访问工作区外文件，默认`false` |
| `enableTerminalSandbox` | boolean | 是否在操作系统隔离环境中执行终端命令 |
| `permissions.allow` | array | 无需询问即可执行的细粒度权限规则 |
| `permissions.deny` | array | 始终阻止的细粒度权限规则 |
| `permissions.ask` | array | 始终要求确认的细粒度权限规则 |

完整配置项列表可访问官方文档：`https://antigravity.google/docs/cli/reference`。

### 权限配置

`Antigravity`使用细粒度权限引擎管理终端、文件、网络和`MCP`操作。每项敏感操作都表示为`action(target)`，并由`Deny`、`Ask`和`Allow`三组规则共同决定。

#### 工具执行策略（核心开关）

工具执行策略控制`Agent`使用写入、终端和网络等工具时是否需要用户确认，是权限行为的基础配置。

| 策略值 | 说明 | 适用场景 |
|--------|------|---------|
| `request-review` | 写入、终端和网络工具执行前询问 | 默认值，适合不熟悉的项目 |
| `proceed-in-sandbox` | 沙箱内自动执行，无法在沙箱中运行时询问 | 日常开发的推荐起点 |
| `strict` | 所有非只读工具均需确认 | 高安全要求或不熟悉的项目 |
| `always-proceed` | 所有工具都不询问 | 最高风险，仅用于额外隔离的一次性环境 |

**在`settings.json`中配置（CLI全局）**：

```json
{
  "toolPermission": "proceed-in-sandbox",
  "artifactReviewPolicy": "asks-for-review",
  "enableTerminalSandbox": true,
  "allowNonWorkspaceAccess": false
}
```

**在桌面应用（Antigravity 2.0）中配置**：

在 macOS 和 Linux 上，打开**Settings > General > Permission Settings**，选择`Default`、`Request Review`或`Turbo`。其中`Default`会启用沙箱并在需要逃逸沙箱时询问；`Turbo`提供不受限制的文件、终端和网络访问，风险与 CLI 的`always-proceed`类似。Windows 当前仍使用旧版终端执行、工作区外文件访问和沙箱选项，应以设置界面为准。

#### 细粒度权限规则

支持的常用权限动作如下：

| 动作 | 示例 | 说明 |
|------|------|------|
| `read_file` | `read_file(/var/log/app)` | 读取指定文件或目录 |
| `write_file` | `write_file(src/)` | 写入指定文件或目录，同时隐式授予同目标读取权限 |
| `command` | `command(git status)` | 按命令词前缀匹配终端命令 |
| `unsandboxed` | `unsandboxed(git push)` | 允许命令在沙箱外运行 |
| `read_url` | `read_url(github.com)` | 读取域名及其子域名的内容 |
| `execute_url` | `execute_url(console.cloud.google.com)` | 在网页中点击、输入等交互操作 |
| `mcp` | `mcp(linter/*)` | 调用指定`MCP Server`的工具 |

权限优先级固定为`Deny > Ask > Allow`。例如把`command(*)`加入`ask`后，即使`allow`中存在`command(git)`，所有命令仍然会询问。

可在`~/.gemini/antigravity-cli/settings.json`中直接配置：

```json
{
  "permissions": {
    "allow": [
      "command(git status)",
      "command(git diff)",
      "command(go test)",
      "command(regex:npm run (build|lint|test))",
      "read_url(github.com)",
      "mcp(linter/*)"
    ],
    "deny": [
      "command(rm -rf)",
      "command(sudo)",
      "write_file(.git/)"
    ]
  }
}
```

也可以在 CLI 中运行`/permissions`，分别在 Project、Shared 或 Global 范围维护`allow`、`deny`和`ask`规则。交互式管理器会校验规则格式，比手工编辑更稳妥。

#### 文件访问权限控制

工作区内的读写默认允许；工作区外的访问默认需要确认。需要全面开放时，可以设置：

```json
{
  "allowNonWorkspaceAccess": true
}
```

更推荐使用`read_file(/path)`和`write_file(/path)`只开放确实需要的目录，而不是打开整个文件系统。

#### 网络访问权限控制

网络权限不使用`internetAccess`总开关，而是分别配置读取与交互权限：

```json
{
  "permissions": {
    "allow": [
      "read_url(github.com)"
    ],
    "ask": [
      "execute_url(console.cloud.google.com)"
    ]
  }
}
```

`read_url`也会影响终端沙箱的出站网络白名单。目标只匹配域名及其子域名，不匹配 URL 路径。

#### Rules 与权限的边界

可以在`GEMINI.md`或`AGENTS.md`中要求 Agent 谨慎执行删除、部署等操作，但这些文件只是模型上下文，**不能授予或撤销运行时权限**。需要强制实施的限制必须写入`permissions.deny`、`permissions.ask`或`PreToolUse` Hook。

当权限卡片出现时，可以临时扩大文件、URL 或`MCP`目标的授权范围；该临时授权仅在当前`turn`剩余阶段有效。需要跨会话持久保存时，使用`/permissions`或编辑`settings.json`。

#### 推荐配置方案

日常开发建议以沙箱为基础，只对白名单中的低风险操作免确认：

```json
{
  "toolPermission": "proceed-in-sandbox",
  "artifactReviewPolicy": "asks-for-review",
  "enableTerminalSandbox": true,
  "allowNonWorkspaceAccess": false,
  "permissions": {
    "allow": [
      "command(git status)",
      "command(git diff)",
      "command(go test)",
      "command(regex:npm run (build|lint|test))"
    ],
    "deny": [
      "command(rm -rf)",
      "command(sudo)",
      "write_file(.git/)"
    ]
  }
}
```

不要同时加入`"ask": ["command(*)"]`，否则其优先级高于上述命令白名单。只有在一次性容器、临时虚拟机等额外隔离环境中，才应考虑`always-proceed`。

## 斜杠命令（Slash Commands）

在`Antigravity 2.0`和`Antigravity CLI`中输入`/`，可以调用内置命令或专用工作流。部分能力受套餐限制；始终以输入框的自动完成菜单和 CLI 的`/help`结果为准。

| 命令 | 说明 | 适用界面 |
|------|------|---------|
| `/help` | 查看所有可用命令与快捷键 | `CLI` |
| `/exit`、`/quit` | 退出`CLI` | `CLI` |
| `/clear`、`/new` | 清空界面并重置当前对话上下文 | `CLI` |
| `/model` | 切换模型和推理强度 | `CLI` |
| `/credits` | 查看剩余`G1`额度与购买链接 | `CLI` |
| `/usage`（`/quota`） | 查看模型配额使用情况 | `CLI` |
| `/config`（`/settings`） | 打开设置面板 | `CLI` |
| `/permissions` | 管理工具权限配置 | `CLI` |
| `/hooks` | 管理工具事件的`Hook`配置 | `CLI` |
| `/mcp` | 查看和管理`MCP Server` | `CLI` |
| `/skills` | 列出当前可用的所有`Skills` | `CLI` |
| `/agents` | 列出当前可用的自定义`Agent` | `CLI` |
| `/goal` | 持续执行，直到目标完成 | `2.0`、`CLI` |
| `/plan` | 研究代码并生成可审查的实施计划 | `2.0`、`CLI` |
| `/grill-me` | 通过交互式问答澄清设计和边界条件 | `2.0`、`CLI` |
| `/learn` | 将会话中的纠正总结为 Rules 或 Skills | `2.0`、`CLI` |
| `/schedule` | 创建一次性定时或周期任务 | `2.0`、`CLI` |
| `/browser` | 启动沙箱浏览器子`Agent` | `2.0`、`CLI` |
| `/btw` | 在后台提出不打断主对话的旁支问题 | `2.0`、`CLI` |
| `/boost` | 启动多`Agent`深度推理 | `2.0`、`CLI`，付费套餐 |
| `/teamwork-preview` | 启动长周期多`Agent`协作 | `2.0`、`CLI`，付费套餐 |


## 与主流AI工具对比

> 下表按`2026-09-23`的公开文档整理。各产品更新频繁，不能将某一时点的能力差异视为长期结论。

### 工具定位对比

| 工具 | 开发商 | 主要使用界面 | 模型生态 |
|------|--------|-------------|---------|
| **Antigravity** | `Google` | `Antigravity 2.0`、CLI、独立 IDE | `Gemini`、`Claude`、`GPT-OSS`，取决于套餐 |
| **Claude Code** | `Anthropic` | CLI，并可与桌面和 IDE 工作流集成 | `Claude`系列，也可通过受支持的云平台或网关接入 |
| **Codex** | `OpenAI` | 桌面应用、CLI、IDE 扩展和云端 | `GPT-6`、`GPT-5.6`等，取决于账户、客户端和灰度范围 |
| **Cursor** | `Anysphere` | `AI-Native IDE` | 支持 Cursor 提供的多模型选择 |

### 记忆文件（Memory）对比

各工具使用不同的"记忆文件"来为`Agent`注入项目上下文：

| 工具 | 项目级说明 | 用户级说明 | 自动或半自动记忆 |
|------|-----------|-----------|-----------------|
| **Antigravity** | `GEMINI.md`、`AGENTS.md`、`.agents/rules/` | `~/.gemini/GEMINI.md`及对应表面的 Rules 目录 | `/learn`可将会话纠正提炼为 Rules 或 Skills |
| **Claude Code** | `CLAUDE.md`、条件性支持`AGENTS.md`、`.claude/rules/` | `~/.claude/CLAUDE.md` | 支持按仓库存储的 Auto Memory |
| **Codex** | `AGENTS.md`/`AGENTS.override.md`，从仓库根目录逐层加载到当前目录 | `~/.codex/AGENTS.md` | 可选本地 Memories，默认存储在`~/.codex/memories/` |
| **Cursor** | `.cursor/rules/`以及项目 Skills | Cursor 设置中的用户级 Rules | 以 Rules、Skills 等显式定制为主 |

> **兼容性说明**：`AGENTS.md`和`SKILL.md`正在成为跨工具约定，但各工具的发现顺序、全局目录、扩展字段和权限语义并不相同。文件名相同不代表可以不经验证地完全复用。

### Skills路径对比

| 工具 | 项目级`Skills`路径 | 全局`Skills`路径 |
|------|------------------|----------------|
| **Antigravity** | `.agents/skills/` | CLI：`~/.gemini/antigravity-cli/skills/`；2.0/IDE：`~/.gemini/config/skills/` |
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` |
| **Codex** | 从当前目录到仓库根目录的`.agents/skills/` | `~/.agents/skills/` |
| **Cursor** | `.agents/skills/`或`.cursor/skills/` | `~/.agents/skills/`或`~/.cursor/skills/` |

### 定制化系统深度对比

| 能力 | Antigravity | Claude Code | Codex CLI |
|------|------------|-------------|-----------|
| **规则文件** | `GEMINI.md`、`AGENTS.md`、`.agents/rules/` | `CLAUDE.md`、`AGENTS.md`、`.claude/rules/` | `AGENTS.md`、`AGENTS.override.md` |
| **Skills系统** | `SKILL.md`，渐进式披露 | `SKILL.md`，渐进式披露 | `SKILL.md`，渐进式披露 |
| **Hooks机制** | `hooks.json`，含工具和模型调用事件 | 支持生命周期 Hooks，可由设置或插件提供 | `hooks.json`或`config.toml`，支持命令和`MCP`工具 Hook |
| **MCP集成** | `mcp_config.json`，支持本地与远程服务 | 支持项目`.mcp.json`、用户配置和远程服务 | `config.toml`，支持`STDIO`与`Streamable HTTP`、OAuth等 |
| **Plugins打包** | 可打包 Skills、Agents、Rules、Hooks、MCP | 可打包 Skills、Agents、Hooks、MCP/LSP 等 | 可分发 Skills 和连接器，并可提供 Hooks/MCP 配置 |
| **斜杠命令** | 内置规划、自动化、浏览器和多`Agent`工作流 | 内置命令和由 Skills/Plugins 提供的命令 | 内置命令和 Skills；功能随客户端变化 |
| **模型选择** | Gemini 3.x、Claude 4.6、GPT-OSS 等 | 当前 Claude 模型系列 | 当前 GPT-6、GPT-5.6 等系列 |
| **多`Agent`编排** | Subagents、Boost、Teamwork | Subagents、Agent Teams | Subagents；部分高推理模式会自动并行工作 |

### 核心设计理念差异

**渐进式披露（`Progressive Disclosure`）**：三者的 Skills 都先向模型暴露名称和描述，在需要时再读取完整`SKILL.md`及引用资源。这已经是跨工具的通用设计，不是某一产品的独占能力。

**配置并不互通**：三者都支持 Rules、Skills、Hooks、MCP 和 Plugins，但目录、清单格式、事件名、权限模型和信任机制各不相同。团队共享配置前应分别在目标工具中验证，不能只复制目录。

**权限与模型说明相互独立**：`AGENTS.md`、`GEMINI.md`或`CLAUDE.md`主要影响模型决策；真正需要强制执行的命令、文件和网络限制，应使用各工具的权限配置、沙箱或 Hooks。

## 参考资料

- Google Antigravity：[CLI 安装](https://antigravity.google/docs/cli/install)、[CLI 参考](https://antigravity.google/docs/cli/reference)、[设置](https://antigravity.google/docs/settings)、[权限](https://antigravity.google/docs/permissions)
- Google Antigravity 定制化：[Rules](https://antigravity.google/docs/rules-workflows)、[Skills](https://antigravity.google/docs/skills)、[Hooks](https://antigravity.google/docs/hooks)、[MCP](https://antigravity.google/docs/mcp)、[Plugins](https://antigravity.google/docs/plugins)
- Google Antigravity 功能：[模型](https://antigravity.google/docs/models)、[斜杠命令](https://antigravity.google/docs/slash-commands)
- OpenAI Docs：[Codex 模型](https://learn.chatgpt.com/docs/models)、[AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[Skills](https://learn.chatgpt.com/docs/build-skills)、[Memories](https://learn.chatgpt.com/docs/customization/memories)、[Hooks](https://learn.chatgpt.com/docs/hooks)、[MCP](https://learn.chatgpt.com/docs/extend/mcp)
- Claude Code：[Memory 与 AGENTS.md](https://code.claude.com/docs/en/memory)、[Skills](https://code.claude.com/docs/en/skills)、[Plugins](https://code.claude.com/docs/en/plugins)、[模型配置](https://code.claude.com/docs/en/model-config)
- Cursor：[Agent Skills](https://cursor.com/docs/context/skills)
