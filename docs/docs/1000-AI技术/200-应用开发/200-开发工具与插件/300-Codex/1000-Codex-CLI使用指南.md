---
slug: "/ai/codex-cli-guide"
title: "Codex CLI使用指南"
hide_title: true
keywords:
  [
    "Codex CLI",
    "OpenAI Codex",
    "AI编程",
    "代码智能体",
    "终端编程助手",
    "AGENTS.md",
    "config.toml",
    "斜杠命令",
    "Skills",
    "记忆系统",
    "沙箱安全",
    "approval-mode",
    "full-auto",
    "MCP",
    "codex exec",
    "ChatGPT Plan",
    "Rust CLI",
    "TypeScript CLI",
    "Claude Code对比",
    "AI Agent",
    "代码生成",
    "自动化开发",
    "sandbox-exec",
    "工作流自动化",
    "memories",
    "第三方模型",
    "API中转",
    "CC Switch",
    "服务商切换",
    "DeepSeek",
    "Ollama",
    "OpenRouter"
  ]
description: "Codex CLI是OpenAI推出的本地运行的AI代码智能体，不强制要求使用OpenAI官方账号，支持通过配置第三方模型（DeepSeek、Gemini、Ollama等）或API中转服务灵活使用。本文全面介绍Codex CLI的安装、更新、基础命令、沙箱安全模型、配置文件（config.toml）的详细配置项、斜杠指令、Skills技能系统、记忆（Memories）机制，以及使用CC Switch工具可视化管理和一键切换多个AI工具服务商的方法，并系统对比Codex CLI与Claude Code在设计哲学、配置项和记忆体系上的主要差异，帮助开发者快速上手并深度使用这款强大的终端AI编程工具。"
toc_max_heading_level: 4
---

## 前言

在`AI`辅助编程工具百花齐放的今天，`OpenAI`推出的`Codex CLI`是一款专为开发者设计的、运行在本地终端中的轻量级代码智能体。它将`ChatGPT`级别的推理能力与真实的代码执行、文件操作能力深度结合，让开发者可以在熟悉的终端环境中通过自然语言驱动完整的编程工作流。

本文将系统介绍`Codex CLI`的安装配置、核心功能、详细配置、`Skills`技能系统、记忆机制，并与目前同样广受欢迎的`Claude Code`进行对比，帮助开发者做出工具选择并掌握最佳实践。

## 什么是Codex

### Codex项目概述

`Codex`是`OpenAI`推出的一系列以代码辅助为核心的`AI`产品的统称，但在不同上下文中指代的具体产品有所不同：

| 产品 | 说明 |
|------|------|
| **早期Codex模型（2021）** | `OpenAI`于2021年发布的代码生成模型，已于2023年3月停止服务 |
| **Codex Web（云端版本）** | 运行在`chatgpt.com/codex`的云端`Agent`，需要`ChatGPT Plus/Pro`等账号订阅 |
| **Codex CLI** | 本地运行的终端代码智能体，本文重点介绍 |
| **Codex IDE插件** | 集成到`VS Code`、`Cursor`、`Windsurf`等编辑器的扩展 |
| **Codex App** | 桌面应用体验，通过`codex app`命令或访问`ChatGPT`网页启动 |

### Codex的核心特点

`Codex`（特指`Codex CLI`）具备以下核心特点：

- **本地运行，零上传**：代码在本地处理，不需要上传整个代码库
- **沙箱安全隔离**：通过`Apple Seatbelt`（`macOS`）或`Landlock`（`Linux`）对命令执行进行严格的沙箱限制
- **多模态输入**：支持传入截图或设计图辅助功能实现
- **多模型、多提供商**：支持`OpenAI`官方模型及`Azure`、`Gemini`、`Ollama`、`DeepSeek`等众多兼容提供商
- **完全开源**：源码托管于`GitHub`，基于`Apache-2.0`协议，社区驱动开发
- **MCP支持**：作为`MCP`客户端可连接外部`MCP Server`，也可以作为`MCP Server`为其他工具提供服务
- **Skills技能系统**：支持自定义可复用的专业工作流片段（技能）
- **自动记忆系统**：跨会话自动提取、整合关键信息，避免重复上下文配置
- **ChatGPT账号集成**：可通过`ChatGPT Plus/Pro`订阅使用，无需单独支付`API`费用

## Codex CLI与早期Codex的区别

许多开发者对`Codex CLI`和2021年发布的早期`Codex`模型感到混淆，以下是二者的主要区别：

| 维度 | 早期Codex模型（2021） | Codex CLI |
|------|----------------------|-----------|
| **类型** | `API`模型服务 | 本地终端智能体工具 |
| **功能** | 代码补全与生成 | 完整的代码`Agent`（规划、执行、修改文件、运行命令） |
| **状态** | 已于2023年3月停止服务 | 活跃开发中 |
| **底层模型** | 独立的`Codex`模型 | 使用`gpt-5.4`等推理模型 |
| **使用方式** | 通过`OpenAI API`调用 | 安装后在终端直接使用 |

## 安装与更新

### 系统要求

| 要求项 | 说明 |
|--------|------|
| 操作系统 | `macOS 12+`、`Ubuntu 20.04+/Debian 10+`或`Windows 11`（通过`WSL2`） |
| 内存 | 最低`4GB`（推荐`8GB`） |
| Git（可选） | `2.23+`，用于内置`PR`辅助功能 |

### 安装方法

**方式一：npm安装（推荐）**

```bash
npm install -g @openai/codex
```

**方式二：Homebrew安装（macOS）**

```bash
brew install --cask codex
```

**方式三：从GitHub Release下载二进制**

从[GitHub Release页面](https://github.com/openai/codex/releases/latest)下载对应平台的预编译二进制：

| 平台 | 文件名 |
|------|--------|
| macOS Apple Silicon | `codex-aarch64-apple-darwin.tar.gz` |
| macOS x86_64 | `codex-x86_64-apple-darwin.tar.gz` |
| Linux x86_64 | `codex-x86_64-unknown-linux-musl.tar.gz` |
| Linux arm64 | `codex-aarch64-unknown-linux-musl.tar.gz` |

解压后将可执行文件重命名为`codex`，并放入`PATH`目录即可。

> 注意：当前发布的`Codex CLI`是基于`Rust`重写的新版本，以零依赖原生可执行文件方式分发，不依赖`Node.js`运行时。旧版基于`TypeScript`的实现已被标记为`legacy`。

### 更新方式

```bash
# npm方式
npm update -g @openai/codex

# Homebrew方式
brew upgrade --cask codex
```

## 基础命令与使用

### 启动方式

```bash
# 交互式启动（REPL模式）
codex

# 带初始提示启动
codex "解释这个代码库的架构"

# 全自动模式
codex --approval-mode full-auto "创建一个待办事项应用"

# 非交互式执行（用于CI/自动化）
codex exec "更新CHANGELOG文件"

# 指定模型
codex --model gpt-5.4 "优化这段代码"
```

### 常用命令参数

| 参数 | 简写 | 说明 | 示例 |
|------|------|------|------|
| `--model` | `-m` | 指定使用的模型 | `-m gpt-5.4` |
| `--approval-mode` | `-a` | 设置批准模式 | `-a full-auto` |
| `--quiet` | `-q` | 非交互安静模式 | `-q` |
| `--sandbox` | `-s` | 设置沙箱策略 | `-s workspace-write` |
| `--config` | `-c` | 覆盖单个配置项 | `-c log_dir=./logs` |
| `--no-project-doc` | - | 禁止加载`AGENTS.md` | - |
| `--ephemeral` | - | 不持久化会话记录到磁盘 | - |

### 权限与批准模式

`Codex CLI`通过`--approval-mode`（`-a`）参数控制智能体的自主程度：

| 模式 | 无需批准可执行的操作 | 仍需批准的操作 |
|------|---------------------|---------------|
| **`suggest`**（默认） | 读取仓库内任意文件 | 所有文件写入/修改、所有`Shell`命令 |
| **`auto-edit`** | 读取文件 + 直接应用文件修改 | 所有`Shell`命令 |
| **`full-auto`** | 读写文件 + 执行`Shell`命令（网络已禁用，写入限于工作目录） | 无 |

> 在`full-auto`模式下，**网络访问被完全禁用**，且文件写入被限制在当前工作目录及临时目录，同时`~/.codex`目录为可写路径。

### 常用操作示例

```bash
# 理解代码库
codex "解释这个代码库给我听"

# 重构代码
codex "将Dashboard组件重构为React Hooks"

# 生成SQL迁移
codex "为添加users表生成SQL迁移文件"

# 编写单元测试
codex "为utils/date.ts编写单元测试"

# 批量重命名文件
codex "使用git mv将*.jpeg批量重命名为*.jpg"

# 安全审查
codex "检查代码漏洞并生成安全审查报告"

# 非交互模式（适合CI）
codex exec --ephemeral "为下一个版本更新CHANGELOG"
```

### 沙箱安全模型

`Codex CLI`的沙箱机制因操作系统而异：

- **macOS 12+**：使用`Apple Seatbelt`（`sandbox-exec`）。所有操作被置于只读沙箱中，仅允许`$PWD`、`$TMPDIR`、`~/.codex`等特定路径可写，出站网络在`full-auto`模式下被完全阻断。

- **Linux**：默认不启用沙箱。推荐使用`Docker`容器运行，`Codex`会将自身启动在最小化容器内并挂载仓库目录，同时通过`iptables/ipset`防火墙规则阻断除`OpenAI API`外的所有出站流量。

可以通过`--sandbox`参数指定沙箱策略：

```bash
# 默认只读沙箱
codex --sandbox read-only

# 允许在工作目录写入，仍然封锁网络
codex --sandbox workspace-write

# 完全禁用沙箱（仅在容器或隔离环境中使用）
codex --sandbox danger-full-access
```

也可以使用`codex sandbox`子命令测试特定命令在沙箱下的行为：

```bash
# macOS
codex sandbox macos --full-auto ls /tmp

# Linux
codex sandbox linux --full-auto ls /tmp
```

## 配置文件详解

`Codex CLI`（`Rust`版）的配置文件为`~/.codex/config.toml`，支持丰富的配置选项。

### 基础配置

```toml
# 默认使用的模型
model = "gpt-5.4"

# 沙箱模式：read-only | workspace-write | danger-full-access
sandbox_mode = "workspace-write"

# 日志目录（默认 ~/.codex/log/）
log_dir = "~/.codex/log"

# SQLite状态数据库目录
sqlite_home = "~/.codex/state"
```

### 历史记录配置

```toml
[history]
# 禁用历史记录写入（默认false）
no_history = false
# 历史文件路径（默认 ~/.codex/history.jsonl）
log_path = "~/.codex/history.jsonl"
```

### MCP服务器配置

`Codex CLI`支持在配置文件中配置`MCP Server`连接：

```toml
# stdio传输方式
[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]

# SSE传输方式
[mcp_servers.remote-tool]
url = "http://localhost:3000/sse"
```

### MCP工具批准模式配置

可以按`MCP Server`和工具名称精细控制批准策略：

```toml
[mcp_servers.docs.tools.search]
# approve（每次询问） | auto-approve（自动允许） | auto-deny（自动拒绝）
approval_mode = "auto-approve"
```

### 记忆系统配置

```toml
[memories]
# 是否在启动时生成记忆（从历史会话中提取）
generate_memories = true

# 是否在会话中使用记忆（注入到上下文）
use_memories = true

# 若会话中使用了MCP工具或Web搜索则跳过记忆生成
no_memories_if_mcp_or_web_search = false

# 内存提取阶段使用的模型（默认 gpt-5.4-mini）
extract_model = "gpt-5.4-mini"

# 记忆整合阶段使用的模型（默认 gpt-5.3-codex）
consolidation_model = "gpt-5.3-codex"

# 单次记忆整合最多处理多少条原始记忆
max_raw_memories_for_consolidation = 256

# 记忆的最长保留天数（0-365）
max_unused_days = 30

# 历史会话的最长提取年龄（天，0-90）
max_rollout_age_days = 30

# 启动时最多处理多少个历史会话
max_rollouts_per_startup = 16

# 会话闲置多少小时后才纳入提取候选（1-48）
min_rollout_idle_hours = 6
```

### Skills技能配置

```toml
[skills]
# 控制是否启用内置技能
[skills.bundled]
enabled = true

# 启用或禁用特定技能：
[[skills.config]]
name = "babysit-pr"
enabled = true

[[skills.config]]
# 按路径指定技能目录
path = "/path/to/my/custom-skills"
enabled = true
```

### 通知配置

`Codex`支持在`Agent`完成一轮操作后执行通知脚本：

```toml
[notify]
# 当Agent完成一轮后执行的命令（通过shell执行）
command = "terminal-notifier -title 'Codex' -message 'Agent完成操作'"
```

### Apps（连接器）配置

```toml
[apps.defaults]
# 全局默认：禁用具有破坏性或联网能力的工具
destructive_enabled = false
open_world_enabled = false

# 单独为某个App开启
[apps.github]
enabled = true
destructive_enabled = true
```

### 自定义AI提供商

`Codex CLI`不绑定`OpenAI`服务，支持任何兼容`OpenAI API`格式的模型提供商。`Rust`版本优先通过环境变量配置，旧版`TypeScript`实现则支持`config.json`方式。

**通过环境变量切换提供商**

```bash
# OpenAI官方（默认）
export OPENAI_API_KEY="your-key"

# OpenRouter（聚合多家模型，一个Key访问Claude/Gemini/GPT等）
export OPENROUTER_API_KEY="your-key"
codex --provider openrouter --model anthropic/claude-sonnet-4-5

# DeepSeek
export DEEPSEEK_API_KEY="your-key"
codex --provider deepseek --model deepseek-chat

# 本地Ollama（无需API Key）
codex --provider ollama --model qwen2.5-coder:32b

# Gemini
export GEMINI_API_KEY="your-key"
codex --provider gemini --model gemini-2.0-flash

# 任意OpenAI格式的第三方中转服务（如国内API中转）
export OPENAI_API_KEY="your-relay-api-key"
export OPENAI_BASE_URL="https://api.your-relay.com/v1"
codex

# 完全自定义命名的提供商
export MYPROVIDER_API_KEY="your-key"
export MYPROVIDER_BASE_URL="https://your-provider/v1"
codex --provider myprovider --model my-model-name
```

**内置提供商列表**

| 提供商 | `--provider`值 | 所需环境变量 |
|--------|--------------|------------|
| `OpenAI` | `openai` | `OPENAI_API_KEY` |
| `Azure OpenAI` | `azure` | `AZURE_OPENAI_API_KEY` |
| `OpenRouter` | `openrouter` | `OPENROUTER_API_KEY` |
| `Google Gemini` | `gemini` | `GEMINI_API_KEY` |
| `Ollama`（本地）| `ollama` | 无需 |
| `Mistral` | `mistral` | `MISTRAL_API_KEY` |
| `DeepSeek` | `deepseek` | `DEEPSEEK_API_KEY` |
| `xAI (Grok)` | `xai` | `XAI_API_KEY` |
| `Groq` | `groq` | `GROQ_API_KEY` |
| `ArceeAI` | `arceeai` | `ARCEEAI_API_KEY` |

对于未在上表列出的第三方中转服务，只需设置`OPENAI_API_KEY`和`OPENAI_BASE_URL`，即可直接使用。

**在.env文件中持久化提供商配置**

通过环境变量设置仅对当前终端会话有效，若要持久化，可在`~/.codex/.env`或项目根目录的`.env`文件中统一管理：

```env
# 使用第三方中转服务示例
OPENAI_API_KEY=sk-relay-xxxxxxxx
OPENAI_BASE_URL=https://api.example-relay.com/v1
```

`config.toml`中也可指定默认模型：

```toml
# 与OPENAI_BASE_URL配合使用某中转服务提供的模型
model = "claude-sonnet-4-6"
```

### 自定义CA证书

在企业代理环境下，可以通过以下环境变量配置自定义`CA`证书：

```bash
# 优先级最高，专用于Codex
export CODEX_CA_CERTIFICATE="/path/to/company-ca.pem"

# 次优先级
export SSL_CERT_FILE="/path/to/ca-bundle.pem"
```

### 项目级配置（`.codex/config.toml`）

`Codex CLI`支持多层配置文件叠加，优先级从低到高依次为：

| 层级 | 路径 | 说明 |
|------|------|------|
| **系统级** | `/etc/codex/config.toml`（Unix） | 管理员统一下发的系统配置 |
| **用户级** | `~/.codex/config.toml` | 个人全局配置 |
| **项目树** | 从仓库根到`cwd`各级目录的`.codex/config.toml` | 按目录层级逐级覆盖 |
| **运行时** | `--config`参数 | 启动时临时覆盖 |

高优先级层的配置会**覆盖**低优先级同名字段，未设置的字段则继承低层级的值。

在项目根目录创建`.codex/config.toml`即可启用项目级配置：

```toml
# 项目根目录/.codex/config.toml

# 为该项目指定特定模型
model = "o3"

# 项目级沙箱策略
sandbox_mode = "workspace-write"

# 项目专用MCP服务器
[mcp_servers.project-db]
command = "npx"
args = ["-y", "@company/mcp-db-server"]
```

:::note 安全机制
项目级和目录树级配置在**不受信任**的目录下会被自动禁用，以防止恶意仓库通过`config.toml`劫持`Codex`工具的行为。信任状态通过`codex trust`命令管理（见`/security-config`），与`AGENTS.md`的信任机制独立。
:::

### 完整配置示例

```toml
# ~/.codex/config.toml

model = "gpt-5.4"
sandbox_mode = "workspace-write"

[history]
no_history = false

[memories]
generate_memories = true
use_memories = true
max_unused_days = 30
max_rollout_age_days = 30

[skills.bundled]
enabled = true

[mcp_servers.filesystem]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]

[notify]
command = "terminal-notifier -title 'Codex' -message 'Task done'"
```

## 使用CC Switch管理服务商

手动编辑`config.toml`或每次切换时修改环境变量都比较繁琐，尤其是在`Claude Code`、`Codex`、`Gemini CLI`等多个工具之间频繁切换时。[CC Switch](https://github.com/farion1231/cc-switch)提供了一个可视化的桌面应用解决方案，能够统一管理多个`AI`编程工具的服务商配置。

### CC Switch是什么

`CC Switch`是一款基于`Tauri 2`构建的跨平台桌面应用，支持`Windows`、`macOS`和`Linux`，专门用于可视化管理和一键切换`Claude Code`、`Codex`、`Gemini CLI`、`OpenCode`、`OpenClaw`等`CLI`工具的`API`提供商配置。

主要特性：

- **统一管理多个工具**：一个界面管理`Claude Code`、`Codex`、`Gemini CLI`等五款工具的服务商配置
- **50+内置提供商预设**：包括`AWS Bedrock`、`NVIDIA NIM`、国内各大`API`中转服务，开箱即用
- **一键切换**：无需手动编辑`JSON`/`TOML`/`.env`文件，通过图形界面或系统托盘即时切换
- **统一MCP/Skills管理**：一个面板同步管理多个工具的`MCP Server`和`Skills`配置
- **云同步**：支持通过`Dropbox`、`OneDrive`、`iCloud`或`WebDAV`在多设备间同步配置
- **可靠的原子写入**：基于`SQLite`数据库存储配置，防止配置文件损坏

### 安装CC Switch

从[GitHub Release页面](https://github.com/farion1231/cc-switch/releases/latest)下载对应平台的安装包，或通过以下方式安装：

```bash
# macOS（Homebrew，如果有配置相应tap）
# 或者直接从Release页面下载.dmg安装包

# Windows
# 从Release页面下载.msi安装包

# Linux
# 从Release页面下载.AppImage或.deb包
```

### 使用CC Switch配置Codex

1. 打开`CC Switch`，在主界面选择`Codex`工具标签
2. 点击"添加供应商"，从内置预设中选择所需提供商（如`DeepSeek`、`OpenRouter`、国内中转服务等），或手动填写`Base URL`和`API Key`
3. 在供应商列表中点击目标供应商即可一键切换，`CC Switch`会自动更新`Codex`的配置文件
4. 也可以通过系统托盘菜单快速切换，无需打开完整应用

### CC Switch在多工具场景下的价值

当同时使用`Codex`和`Claude Code`时，二者各有独立的配置文件格式（`config.toml`和`settings.json`），且服务商的`API Key`和`Base URL`需要分别管理。`CC Switch`的统一管理面板可以：

- 保持多个工具使用相同的第三方中转服务而不重复配置
- `MCP Server`配置双向同步，减少重复添加
- `Skills`配置在支持的工具间共享

## AGENTS.md：项目指令文件

`Codex CLI`使用`AGENTS.md`文件（类似`Claude Code`的`CLAUDE.md`）向`Agent`提供跨会话的持久化项目指令。

### 文件加载顺序与优先级

`Codex`按以下顺序查找并合并`AGENTS.md`文件，越具体的规则优先级越高：

| 优先级 | 位置 | 用途 |
|--------|------|------|
| 1（最低）| `~/.codex/AGENTS.md` | 个人全局指令 |
| 2 | 仓库根目录`AGENTS.md` | 项目共享规范 |
| 3（最高）| 当前工作目录`AGENTS.md` | 子目录或功能特定规范 |

### AGENTS.md示例

```markdown
# 项目规范

## 编码规范
- 使用4个空格缩进，不使用Tab
- 函数命名使用camelCase，类命名使用PascalCase
- 所有公开函数必须有JSDoc注释

## 工作流
- 提交前必须运行 `npm test`
- 提交信息格式：`type(scope): description`
- 不使用 `git push --force`

## 项目架构
- src/api/ - REST API接口层
- src/service/ - 业务逻辑层
- src/model/ - 数据模型层
```

可以用`--no-project-doc`参数或设置`CODEX_DISABLE_PROJECT_DOC=1`环境变量禁止加载`AGENTS.md`。

## 斜杠命令（Slash Commands）

在`Codex CLI`的交互式界面中，可以使用斜杠命令执行快捷操作：

| 命令 | 说明 |
|------|------|
| `/new` | 在当前会话中开启新对话 |
| `/clear` | 清屏并开启新对话 |
| `/compact` | 压缩会话历史（防止超出上下文限制） |
| `/review` | 审查当前更改并发现问题 |
| `/diff` | 显示`Git diff`（包括未跟踪文件） |
| `/fork` | 从当前对话创建分支 |
| `/resume` | 恢复已保存的历史对话 |
| `/rename` | 重命名当前会话线程 |
| `/model` | 切换使用的模型和推理强度 |
| `/personality` | 切换`Codex`的沟通风格 |
| `/approvals` | 配置`Codex`的权限范围 |
| `/skills` | 管理和使用技能 |
| `/mcp` | 列出已配置的`MCP`工具 |
| `/apps` | 管理集成的`App`（连接器） |
| `/plugins` | 浏览可用插件 |
| `/plan` | 切换到规划模式（`Plan Mode`） |
| `/status` | 查看当前会话配置和`Token`用量 |
| `/init` | 创建`AGENTS.md`指令文件 |
| `/debug-config` | 显示配置层级和来源（用于调试） |
| `/realtime` | 切换实验性实时语音模式 |
| `/agent` | 切换活跃的`Agent`线程 |
| `/feedback` | 向维护者发送日志 |
| `/quit` / `/exit` | 退出`Codex` |

### 在对话中引用文件

在输入框中使用`@`符号可以引用文件（`/mention`）：

```
@src/utils/date.ts 帮我添加一个日期格式化函数
```

也可以在对话框中用`$`符号插入`ChatGPT`连接器（Apps）。

## Skills技能系统

`Skills`是`Codex CLI`中可复用的专业工作流模块，类似于`Claude Code`的`Skills`机制，能够在特定任务场景下为`Agent`注入专门的系统提示和指令，提升任务完成质量。

### Skills的工作原理

`Skills`通过以下方式工作：

1. 技能以目录形式存在，每个目录包含一个`SKILL.md`文件
2. `Codex`在每次会话启动时扫描配置的技能目录
3. 当用户的任务与某个技能匹配时，技能内容被注入到系统提示中
4. 技能可以声明所需的环境变量依赖，首次使用时会提示用户设置

### Skills目录结构

```
~/.codex/skills/
  my-skill/
    SKILL.md        # 技能定义文件（必需）
```

`SKILL.md`是纯文本的`Markdown`文件，包含：

- 技能的描述（让`Codex`能正确识别何时使用它）
- 具体的操作指令
- 可选的环境变量依赖声明

### 内置Skills

`Codex CLI`预置了若干内置技能，可通过`[skills.bundled] enabled = true`启用：

- **babysit-pr**：辅助`PR`审查与合并流程
- **remote-tests**：管理远程测试执行
- **test-tui**：`TUI`界面测试辅助

### 使用Skills

```bash
# 通过斜杠命令查看和激活技能
/skills

# 在对话中显式调用技能
使用技能 babysit-pr 帮我审查这个PR
```

### 在config.toml中管理Skills

```toml
# 启用内置技能包
[skills.bundled]
enabled = true

# 启用特定技能（按名称）
[[skills.config]]
name = "babysit-pr"
enabled = true

# 添加自定义技能目录
[[skills.config]]
path = "/Users/username/.codex/skills/my-skills"
enabled = true

# 禁用某个技能
[[skills.config]]
name = "test-tui"
enabled = false
```

## 记忆系统（Memories）

`Codex CLI`内置了自动记忆系统，能够在会话之间自动提取、整合和复用关键信息，有效解决`AI Agent`跨会话上下文丢失的问题。

### 记忆机制工作流程

记忆系统分为两个阶段自动运行：

**阶段一：原始记忆提取（Phase 1）**

在每次会话启动时（后台异步），`Codex`从最近的历史会话记录中提取关键信息：
- 使用轻量模型（默认`gpt-5.4-mini`，低推理强度）
- 并发处理多个历史会话（最多8个并发）
- 将提取到的原始记忆写入`~/.codex/memories/`目录下的`raw_memories.md`文件

**阶段二：记忆整合（Phase 2）**

原始记忆积累到一定数量后，触发整合：
- 使用更强的模型（默认`gpt-5.3-codex`，中等推理强度）
- `Codex`对原始记忆进行去重、归类和压缩
- 生成整合后的`memory_summary.md`

### 记忆的存储位置

| 文件/目录 | 说明 |
|-----------|------|
| `~/.codex/memories/` | 记忆存储根目录 |
| `~/.codex/memories/<session-id>/raw_memories.md` | 阶段一提取的原始记忆 |
| `~/.codex/memories/memory_summary.md` | 阶段二整合后的记忆摘要 |
| `~/.codex/memories/rollout_summaries/` | 历史会话摘要 |

### 记忆的使用方式

整合后的记忆摘要会在每次新会话开始时自动注入到上下文中（最多5000个`Token`），让`Codex`在新对话中无需重新建立项目背景。

### 手动管理记忆

```bash
# 通过斜杠命令（内部命令，不建议普通用户直接使用）
/memory-drop    # 清空记忆（谨慎使用）
/memory-update  # 手动触发记忆更新
```

也可以直接编辑`~/.codex/memories/memory_summary.md`来手动管理记忆内容。

## Codex CLI vs Claude Code

`Codex CLI`和`Claude Code`目前是终端`AI`编程助手中最常被对比的两款产品。以下从多个维度进行系统性比较：

### 设计哲学对比

| 维度 | Codex CLI | Claude Code |
|------|-----------|-------------|
| **开发方** | `OpenAI` | `Anthropic` |
| **底层模型** | `gpt-5.4`、`o3`等`OpenAI`推理模型 | `Claude Sonnet/Opus`系列 |
| **开源状态** | 完全开源（`Apache-2.0`） | 闭源工具（仅代码有限开放） |
| **安装方式** | `npm`、`Homebrew`、预编译二进制 | `curl`官方脚本 |
| **技术栈** | `Rust`（新版），`TypeScript`（旧版） | `TypeScript`/`Node.js` |
| **定价** | `ChatGPT`订阅或`API Key` | `Claude`订阅或`API Key` |
| **多提供商** | 支持（`OpenRouter`、`Ollama`、`DeepSeek`等）| 较为封闭，主要使用`Anthropic API` |
| **界面类型** | 全屏`TUI`（`Ratatui`） | 类似`REPL`的终端 |

### 项目指令文件对比

| 对比项 | Codex CLI（AGENTS.md） | Claude Code（CLAUDE.md） |
|--------|----------------------|------------------------|
| **文件名** | `AGENTS.md` | `CLAUDE.md` |
| **文件格式** | `Markdown` | `Markdown` |
| **加载位置（全局）** | `~/.codex/AGENTS.md` | `~/.claude/CLAUDE.md` |
| **加载位置（项目）** | 仓库根目录`AGENTS.md` | 仓库根目录`CLAUDE.md`或`.claude/CLAUDE.md` |
| **子目录支持** | 支持（当前工作目录`AGENTS.md`） | 支持（任意子目录`CLAUDE.md`） |
| **合并方式** | 从全局到具体逐层合并 | 从全局到具体逐层合并 |
| **禁用方式** | `--no-project-doc`或`CODEX_DISABLE_PROJECT_DOC=1` | `/project:hide`或`CLAUDE_CODE_DISABLE_MEMORY` |

### 记忆系统对比

| 对比项 | Codex CLI（Memories） | Claude Code（Memory） |
|--------|---------------------|---------------------|
| **手动指令文件** | `AGENTS.md` | `CLAUDE.md` |
| **自动记忆** | 支持（启动时后台自动提取整合） | 支持（`Auto Memory`机制） |
| **记忆存储位置** | `~/.codex/memories/` | `~/.claude/memories/` |
| **记忆触发方式** | 每次启动后台异步执行 | 每次会话结束时提示或自动触发 |
| **记忆层级** | 单层（全局记忆） | 多层（用户级、项目级按工作树划分） |
| **加载上限** | 注入最多`5000 Token`的摘要 | 加载前`200`行 |
| **整合模型** | 两阶段（提取+整合，可指定不同模型） | 单阶段自动写入 |
| **Rules系统** | 无单独的`Rules`目录（集中于`AGENTS.md`） | 支持`.claude/rules/`目录，按路径作用域匹配 |

### Skills系统对比

| 对比项 | Codex CLI Skills | Claude Code Skills |
|--------|-----------------|-------------------|
| **文件名** | `SKILL.md` | `SKILL.md` |
| **存储位置** | `~/.codex/skills/<name>/SKILL.md` | `~/.claude/skills/<name>/SKILL.md`或自定义路径 |
| **激活方式** | 隐式匹配或`/skills`命令 | 隐式匹配或显式引用 |
| **配置方式** | `config.toml [skills]`块 | `CLAUDE.md`中的`Available skills:`声明 |
| **内置技能** | 提供内置技能包（可关闭） | 无全局内置技能包 |
| **环境变量依赖** | 支持（首次使用时交互式提示） | 支持 |

### 斜杠命令对比

| 对比项 | Codex CLI | Claude Code |
|--------|-----------|-------------|
| **命令类型** | 仅内置命令 | 内置命令 + 用户自定义命令 |
| **自定义命令** | 不支持（所有命令均为硬编码内置命令） | 支持（通过`Markdown`文件定义） |
| **项目级自定义** | 不支持 | `.claude/commands/<名称>.md` |
| **用户级自定义** | 不支持 | `~/.claude/commands/<名称>.md` |
| **内置命令数量** | `25+`个内置命令 | 少量内置命令 |
| **调用方式** | 输入框直接键入`/`触发补全 | 输入框键入`/`触发，自定义命令自动列出 |

### 配置文件对比

| 配置项 | Codex CLI | Claude Code |
|--------|-----------|-------------|
| **主配置文件** | `~/.codex/config.toml`（`TOML`格式） | `~/.claude/settings.json`（`JSON`格式） |
| **项目级配置** | `.codex/config.toml`（从仓库根到`cwd`各层目录均可放置，逐层覆盖） | `.claude/settings.json` |
| **模型配置** | `config.toml`中的`model`字段 | `settings.json`中的`model`字段 |
| **沙箱配置** | `sandbox_mode`字段或`--sandbox`参数 | 通过权限配置间接控制 |
| **MCP配置** | `config.toml`中的`[mcp_servers.*]`块 | `settings.json`中的`mcpServers`字段 |
| **权限细粒度** | `MCP Server`级别到单个工具级别 | 工具级别 |


## 总结

`Codex CLI`是一款设计专注、技术扎实的终端`AI`编程助手。它从最初的`TypeScript`版本重写为`Rust`实现，以零依赖二进制形式分发，在安全沙箱、多模型支持和自动记忆系统方面有其独特优势。

对于已有`ChatGPT`订阅、偏好本地终端工作流、以及需要灵活接入多个`AI`提供商的开发者来说，`Codex CLI`是值得优先考虑的选择。与`Claude Code`配合使用（在不同项目或场景中选择最合适的工具），往往能取得最佳的开发效率提升效果。
