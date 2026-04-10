---
slug: "/ai/claude-managed-agents"
title: "Claude Managed Agents：托管式长时智能体的构建与实践"
hide_title: true
keywords:
  [
    "Claude Managed Agents",
    "托管智能体",
    "长时任务",
    "自主智能体",
    "Agent",
    "Session",
    "Environment",
    "云容器",
    "沙箱隔离",
    "工具调用",
    "SSE事件流",
    "MCP服务器",
    "brain hands架构",
    "会话持久化",
    "智能体即服务",
    "agent_toolset",
    "Bash工具",
    "自定义工具",
    "网络访问控制",
    "多智能体编排",
    "事件驱动",
    "异步任务",
    "上下文管理",
    "harness解耦",
    "rate limit"
  ]
description: "Claude Managed Agents是Anthropic推出的托管式智能体平台服务，为长时运行的自主智能体提供完整的基础设施支持。开发者无需自行搭建智能体循环、沙箱执行环境和工具调用层，只需定义Agent配置（模型、系统提示、工具集）和Environment（云容器模板），即可通过API启动Session并以SSE事件流的方式实时获取结果。本文详细介绍Managed Agents的核心设计思想（brain-hands-session三层解耦架构）、与SubAgents和AgentTeams的本质区别、四大核心概念（Agent/Environment/Session/Events）的配置细节、内置工具与自定义工具的使用方式、环境网络控制与包管理、完整的快速上手流程以及多个实用示例，帮助开发者构建可靠、可扩展的生产级AI自动化工作流。"
toc_max_heading_level: 3
---

## 前言

随着`Claude`模型能力的持续提升，越来越多的开发团队希望借助`AI`完成更复杂、耗时更长的自动化任务——例如在真实代码库中进行多文件重构、自主执行端到端的数据分析流水线、或者在云端持续运行的研究助手。然而，构建一个生产级的智能体系统并不简单：开发者需要设计`agent loop`、管理沙箱安全隔离、处理工具调用错误、维护会话状态，以及解决长时任务中上下文窗口被耗尽等难题。

`Managed Agents`是`Anthropic`在`Claude Platform`上推出的解决方案——一个面向长时自主任务的**托管智能体服务**。它将智能体运行所需的基础设施（沙箱容器、工具执行层、会话持久化）统一托管，让开发者聚焦于定义智能体的行为和目标，而不是搭建和维护底层基础设施。

## 什么是Managed Agents

`Claude Managed Agents`是`Anthropic`提供的**预构建、可配置的智能体运行框架**，运行在托管的云基础设施之上。与直接调用`Messages API`相比，它提供了完整的智能体运行时，包括：

- **自动化的`agent loop`**：无需自行编写驱动`Claude`循环调用工具直到任务完成的代码
- **安全隔离的执行容器**：每个`Session`拥有独立的云容器，`Claude`可以在其中执行`Bash`命令、读写文件、访问网络
- **持久化的会话状态**：会话事件日志保存在服务端，支持中断恢复和异步消费
- **内置性能优化**：自动的`Prompt Caching`、上下文压缩（`Compaction`）等机制，确保长时任务的高效运行

| 维度 | Messages API | Claude Managed Agents |
|------|-------------|----------------------|
| 定位 | 直接模型调用，细粒度控制 | 预构建智能体框架，长时自主任务 |
| 需自建 | 完整的`agent loop`、沙箱、工具执行 | 几乎不需要 |
| 适用场景 | 自定义控制流、短对话 | 长时任务、异步工作流 |
| 会话持久 | 否（调用方管理状态） | 是（服务端持久化） |
| 执行环境 | 无 | 托管云容器 |

## 设计思想：解耦Brain、Hands与Session

`Managed Agents`的架构核心是将智能体系统分成三个独立、可替换的层次：

```text
+---------+       execute(name, input)       +-----------+
|  Brain  | ───────────────────────────────> |   Hands   |
| (Claude |                                  | (Sandbox  |
| +harness)|  <── string result ──────────── |   Tools)  |
+---------+                                  +-----------+
     |
     | emitEvent / getEvents
     v
+---------+
| Session |  (append-only durable event log)
+---------+
```

- **Brain（大脑）**：`Claude`模型及其`harness`（驱动模型循环调用工具的控制逻辑），完全无状态，可以独立扩展
- **Hands（手）**：沙箱容器和工具——任何工具调用都抽象为`execute(name, input) → string`接口，容器宕机只是工具调用返回错误，可以重启新容器继续
- **Session（会话）**：所有事件的持久化追加日志，保存在`Brain`和`Hands`之外，任何一方崩溃都不丢失进度

这种三层解耦带来了显著的工程优势：

- **容错性**：容器故障不导致会话丢失，`harness`崩溃后通过`wake(sessionId)`恢复，从上次事件继续
- **安全性**：凭据不存放在沙箱容器内，`Claude`生成的代码无法直接访问`API Key`
- **性能**：`p50 TTFT`（首`Token`延迟）降低约`60%`，`p95`降低超过`90%`
- **灵活性**：同一个`Brain`可以连接多个`Hands`，多个`Brain`可以共享`Hands`

## 与SubAgents和AgentTeams的区别

理解三者的定位差异，有助于在实际场景中选择合适的工具：

| 特性 | SubAgents | AgentTeams | Managed Agents |
|------|-----------|------------|----------------|
| 运行环境 | `Claude Code`本地 | `Claude Code`本地 | 云端托管基础设施 |
| 使用方式 | `/agents`命令或自动委托 | 实验性功能，多实例协作 | `REST API` / `SDK` |
| 典型场景 | 主对话的子任务委托 | 多维度并行任务协作 | 长时自动化、异步后台任务 |
| 会话持久 | 否（随主对话生命周期） | 否 | 是（服务端持久化） |
| 执行沙箱 | 本地工作目录 | 本地工作目录 | 隔离的云容器 |
| 适合开发者 | 使用`Claude Code`的开发者 | 使用`Claude Code`的开发者 | 构建`AI`产品的开发者 |
| 上下文隔离 | 是（独立上下文窗口） | 是（每个实例独立） | 是（独立容器+独立上下文） |
| 实验阶段 | GA | 实验性 | Beta |

简而言之：

- **`SubAgents`** — `Claude Code`内部的任务委托机制，解决**上下文保护**和**工具权限约束**问题
- **`AgentTeams`** — `Claude Code`的多实例并行协作，解决**同时探索多条路径**的问题
- **`Managed Agents`** — 面向开发者的**平台级托管服务**，解决**在生产环境中可靠运行长时自主智能体**的问题

:::info NOTE
`Managed Agents`目前处于`Beta`阶段，所有请求需携带`managed-agents-2026-04-01`的`Beta`请求头。`SDK`会自动添加该头部。
:::

## 核心概念

`Managed Agents`围绕四个核心概念构建：

| 概念 | 含义 |
|------|------|
| `Agent` | 模型、系统提示、工具集、`MCP`服务器和`Skills`的组合配置 |
| `Environment` | 云容器模板（预安装包、网络访问规则等） |
| `Session` | 在指定`Environment`中运行的智能体实例，执行具体任务并产生输出 |
| `Events` | 应用程序与智能体之间交换的消息（用户消息、工具结果、状态更新等） |

### Agent

`Agent`是一个**可复用、带版本管理**的配置对象，定义了`Claude`在会话中的行为方式。创建一次`Agent`，通过`ID`在所有`Session`中复用。

`Agent`的配置字段：

| 字段 | 必填 | 说明 |
|------|------|------|
| `name` | 是 | 智能体的可读名称 |
| `model` | 是 | 驱动智能体的`Claude`模型（支持`Claude Sonnet 4.6`及更新版本） |
| `system` | 否 | 系统提示，定义智能体的行为和角色 |
| `tools` | 否 | 可用工具列表（内置工具集、`MCP`工具、自定义工具） |
| `mcp_servers` | 否 | 提供标准化第三方能力的`MCP`服务器 |
| `skills` | 否 | 为特定领域提供专属上下文的`Skills` |
| `callable_agents` | 否 | 可调用的其他智能体（多智能体编排，研究预览功能） |
| `description` | 否 | 智能体功能的描述说明 |
| `metadata` | 否 | 任意键值对，用于自行追踪 |

每次更新`Agent`都会生成新版本，版本号从`1`开始递增。`Agent`可以被归档（`Archive`），归档后变为只读，已运行的`Session`继续正常工作，但无法再创建新`Session`引用该`Agent`。

### Environment

`Environment`定义了`Session`运行时的容器配置。多个`Session`可以共享同一个`Environment`，但每个`Session`拥有**独立的容器实例**，文件系统互不干扰。

`Environment`的主要配置项：

| 配置项 | 说明 |
|--------|------|
| `name` | 唯一名称（组织内唯一） |
| `config.type` | 容器类型，目前为`cloud` |
| `config.packages` | 预安装包（`pip`、`npm`、`apt`等，会被缓存） |
| `config.networking` | 网络访问控制（`unrestricted`或`limited`） |

### Session

`Session`是智能体执行具体任务的运行实例。每个`Session`引用一个`Agent`和一个`Environment`，拥有独立的容器、独立的上下文窗口和独立的事件日志。

### Events

`Events`是应用与智能体之间通信的基本单位，通过`SSE`（`Server-Sent Events`）实时流式传输。常见的事件类型：

| 事件类型 | 方向 | 含义 |
|---------|------|------|
| `user.message` | 应用→智能体 | 发送用户消息 |
| `agent.message` | 智能体→应用 | 智能体的文本回复 |
| `agent.tool_use` | 智能体→应用 | 智能体正在调用某工具 |
| `agent.tool_result` | 应用→智能体 | 自定义工具的执行结果 |
| `session.status_idle` | 智能体→应用 | 智能体完成当前任务，进入空闲 |
| `session.status_error` | 智能体→应用 | 会话发生错误 |

## 内置工具

使用`agent_toolset_20260401`工具类型可以一次性启用完整的内置工具集：

| 工具名 | `name`标识 | 功能 |
|--------|-----------|------|
| `Bash` | `bash` | 在容器内执行`Shell`命令 |
| `Read` | `read` | 读取文件内容 |
| `Write` | `write` | 写入文件 |
| `Edit` | `edit` | 对文件执行字符串替换 |
| `Glob` | `glob` | 快速文件模式匹配 |
| `Grep` | `grep` | 使用正则表达式搜索文本 |
| `Web fetch` | `web_fetch` | 从`URL`获取网页内容 |
| `Web search` | `web_search` | 在互联网上搜索信息 |

所有工具默认启用。可以通过`configs`数组单独禁用特定工具，或通过设置`default_config.enabled: false`然后仅显式启用所需工具。

## 快速上手

### 前置条件

1. `Anthropic Console`账号
2. 有效的`API Key`
3. 设置环境变量：`export ANTHROPIC_API_KEY="your-api-key-here"`

### 完整流程

`Managed Agents`的使用分为四步：创建`Agent` → 创建`Environment` → 启动`Session` → 发送消息并消费事件流。

**第一步：创建Agent**

```bash
agent=$(
  curl -sS --fail-with-body https://api.anthropic.com/v1/agents \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: managed-agents-2026-04-01" \
    -H "content-type: application/json" \
    -d '{
      "name": "Coding Assistant",
      "model": "claude-sonnet-4-6",
      "system": "You are a helpful coding assistant. Write clean, well-documented code.",
      "tools": [
        {"type": "agent_toolset_20260401"}
      ]
    }'
)

AGENT_ID=$(jq -er '.id' <<< "$agent")
AGENT_VERSION=$(jq -er '.version' <<< "$agent")
echo "Agent ID: $AGENT_ID, version: $AGENT_VERSION"
```

**第二步：创建Environment**

```bash
environment=$(
  curl -sS --fail-with-body https://api.anthropic.com/v1/environments \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: managed-agents-2026-04-01" \
    -H "content-type: application/json" \
    -d '{
      "name": "quickstart-env",
      "config": {
        "type": "cloud",
        "networking": {"type": "unrestricted"}
      }
    }'
)

ENVIRONMENT_ID=$(jq -er '.id' <<< "$environment")
echo "Environment ID: $ENVIRONMENT_ID"
```

**第三步：启动Session**

```bash
session=$(
  curl -sS --fail-with-body https://api.anthropic.com/v1/sessions \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: managed-agents-2026-04-01" \
    -H "content-type: application/json" \
    -d "{
      \"agent\": \"$AGENT_ID\",
      \"environment_id\": \"$ENVIRONMENT_ID\",
      \"title\": \"My first session\"
    }"
)

SESSION_ID=$(jq -er '.id' <<< "$session")
echo "Session ID: $SESSION_ID"
```

**第四步：发送消息并消费事件流**

```bash
# 发送用户消息（API会缓存事件，直到Stream连接建立后再消费）
curl -sS --fail-with-body \
  "https://api.anthropic.com/v1/sessions/$SESSION_ID/events" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "events": [
      {
        "type": "user.message",
        "content": [
          {
            "type": "text",
            "text": "Create a Python script that generates the first 20 Fibonacci numbers and saves them to fibonacci.txt"
          }
        ]
      }
    ]
  }' > /dev/null

# 建立SSE连接，实时消费事件流
while IFS= read -r line; do
  [[ $line == data:* ]] || continue
  json=${line#data: }
  case $(jq -r '.type' <<< "$json") in
    agent.message)
      jq -j '.content[] | select(.type == "text") | .text' <<< "$json"
      ;;
    agent.tool_use)
      printf '\n[Using tool: %s]\n' "$(jq -r '.name' <<< "$json")"
      ;;
    session.status_idle)
      printf '\n\nAgent finished.\n'
      break
      ;;
  esac
done < <(
  curl -sS -N --fail-with-body \
    "https://api.anthropic.com/v1/sessions/$SESSION_ID/stream" \
    -H "x-api-key: $ANTHROPIC_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -H "anthropic-beta: managed-agents-2026-04-01" \
    -H "Accept: text/event-stream"
)
```

典型输出如下：

```
I'll create a Python script that generates the first 20 Fibonacci numbers.
[Using tool: write]
[Using tool: bash]
The script ran successfully. Let me verify the output file.
[Using tool: bash]
fibonacci.txt contains the first 20 Fibonacci numbers (0 through 4181).

Agent finished.
```

### 执行过程说明

当用户发送消息后，`Managed Agents`的内部流程如下：

```
User Event
    |
    v
[1] Provision Container  <-- based on Environment config
    |
    v
[2] Run Agent Loop       <-- Claude decides which tools to use
    |
    v
[3] Execute Tools        <-- bash, file ops, web search inside container
    |
    v
[4] Stream Events        <-- real-time SSE events to client
    |
    v
[5] session.status_idle  <-- agent has nothing more to do
```

## 详细配置示例

### 数据分析Agent配置

以下示例创建一个预装数据分析包的`Agent`和`Environment`：

**创建数据分析Environment**

```bash
curl -fsSL https://api.anthropic.com/v1/environments \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "data-analysis",
    "config": {
      "type": "cloud",
      "packages": {
        "pip": ["pandas", "numpy", "scikit-learn", "matplotlib"],
        "npm": ["express"]
      },
      "networking": {"type": "unrestricted"}
    }
  }'
```

**创建数据分析Agent**

```bash
curl -fsSL https://api.anthropic.com/v1/agents \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "Data Analysis Agent",
    "model": "claude-sonnet-4-6",
    "system": "You are an expert data analyst. Load data, perform analysis, generate visualizations, and provide actionable insights. Always save results to files.",
    "tools": [
      {
        "type": "agent_toolset_20260401"
      }
    ]
  }'
```

### 禁用特定工具

若需要一个只能读写文件、不能执行`Shell`命令的只读分析`Agent`：

```bash
curl -fsSL https://api.anthropic.com/v1/agents \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "Read-Only Analyst",
    "model": "claude-sonnet-4-6",
    "tools": [
      {
        "type": "agent_toolset_20260401",
        "configs": [
          {"name": "bash", "enabled": false},
          {"name": "write", "enabled": false},
          {"name": "edit", "enabled": false}
        ]
      }
    ]
  }'
```

或者使用白名单方式，只启用特定工具：

```bash
{
  "type": "agent_toolset_20260401",
  "default_config": {"enabled": false},
  "configs": [
    {"name": "read", "enabled": true},
    {"name": "glob", "enabled": true},
    {"name": "grep", "enabled": true}
  ]
}
```

### 生产环境网络限制配置

生产环境中建议使用`limited`网络模式，遵循最小权限原则：

```bash
curl -fsSL https://api.anthropic.com/v1/environments \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "production-env",
    "config": {
      "type": "cloud",
      "packages": {
        "pip": ["requests", "boto3"]
      },
      "networking": {
        "type": "limited",
        "allowed_hosts": ["https://api.example.com", "https://s3.amazonaws.com"],
        "allow_mcp_servers": true,
        "allow_package_managers": false
      }
    }
  }'
```

网络配置参数说明：

| 参数 | 说明 |
|------|------|
| `type: unrestricted` | 完全放开出站网络（有通用安全黑名单） |
| `type: limited` | 仅允许`allowed_hosts`中的域名 |
| `allowed_hosts` | 允许访问的`HTTPS`域名列表 |
| `allow_mcp_servers` | 是否允许访问配置的`MCP Server`端点（默认`false`） |
| `allow_package_managers` | 是否允许访问公共包注册表（默认`false`） |

### 使用自定义工具

`Managed Agents`支持自定义工具，扩展`Claude`的能力边界。自定义工具由**应用侧执行**，`Claude`通过结构化请求调用，结果以`agent.tool_result`事件返回：

```bash
# 创建带自定义工具的Agent
curl -fsSL https://api.anthropic.com/v1/agents \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d '{
    "name": "Weather Agent",
    "model": "claude-sonnet-4-6",
    "tools": [
      {
        "type": "agent_toolset_20260401"
      },
      {
        "type": "custom",
        "name": "get_weather",
        "description": "Get current weather for a location. Use this when users ask about weather conditions in any city.",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "City name, e.g. Beijing, New York"
            }
          },
          "required": ["location"]
        }
      }
    ]
  }'
```

自定义工具调用时，应用侧需要监听`agent.tool_use`事件并发送`agent.tool_result`事件返回结果：

```python
# Python伪代码：处理自定义工具调用
for event in stream_events(session_id):
    if event["type"] == "agent.tool_use" and event["name"] == "get_weather":
        location = event["input"]["location"]
        weather_data = call_weather_api(location)   # 应用侧执行
        
        # 将结果返回给智能体
        send_event(session_id, {
            "events": [{
                "type": "agent.tool_result",
                "tool_use_id": event["id"],
                "content": [{"type": "text", "text": str(weather_data)}]
            }]
        })
```

### 版本管理与Agent更新

`Agent`支持版本化更新，每次更新自动生成新版本号：

```bash
# 更新Agent的系统提示（需传入当前version以防止并发冲突）
curl -fsSL -X PUT "https://api.anthropic.com/v1/agents/$AGENT_ID" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  -H "content-type: application/json" \
  -d "{
    \"version\": $AGENT_VERSION,
    \"system\": \"You are a helpful coding assistant. Always write tests for your code.\"
  }"

# 查看版本历史
curl -fsSL "https://api.anthropic.com/v1/agents/$AGENT_ID/versions" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01" \
  | jq -r '.data[] | "Version \(.version): \(.updated_at)"'

# 归档Agent（不可再创建新Session引用，但已有Session继续运行）
curl -fsSL -X POST "https://api.anthropic.com/v1/agents/$AGENT_ID/archive" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-beta: managed-agents-2026-04-01"
```

## 支持的包管理器

创建`Environment`时可以通过`packages`字段预安装依赖包，支持以下包管理器：

| 包管理器 | 生态 | 版本格式示例 |
|---------|------|------------|
| `apt` | 系统包（`apt-get`） | `"ffmpeg"` |
| `cargo` | `Rust`（`cargo`） | `"[email protected]"` |
| `gem` | `Ruby`（`gem`） | `"rails:7.1.0"` |
| `go` | `Go`模块 | `"golang.org/x/tools/cmd/goimports@latest"` |
| `npm` | `Node.js`（`npm`） | `"[email protected]"` |
| `pip` | `Python`（`pip`） | `"pandas==2.2.0"` |

多个包管理器按字母顺序执行（`apt` → `cargo` → `gem` → `go` → `npm` → `pip`），安装结果会被缓存，相同`Environment`的后续`Session`无需重复安装。

## 速率限制

`Managed Agents`的`API`端点按组织维度进行速率限制：

| 端点类型 | 速率限制 |
|---------|---------|
| 创建类（`agents`、`sessions`、`environments`等） | 每分钟`60`次 |
| 读取类（检索、列表、流式等） | 每分钟`600`次 |

组织级别的`Spend Limit`和基于使用层级的速率限制同样适用。

## 适用场景

`Managed Agents`最适合以下类型的工作负载：

- **长时运行任务**：持续数分钟甚至数小时、涉及多次工具调用的复杂任务
- **云端执行**：需要安全隔离容器、预安装依赖包、受控网络访问的场景
- **零基础设施搭建**：不想自行构建`agent loop`、沙箱、工具执行层的团队
- **有状态会话**：需要持久化文件系统和跨会话对话历史的应用
- **异步工作流**：后台自动化任务，结果通过事件流异步消费

## 小结

`Claude Managed Agents`代表了`Anthropic`对"平台级`AI`编排服务"的探索。通过将`Brain`（`Claude`+`harness`）、`Hands`（沙箱+工具）和`Session`（事件日志）三层彻底解耦，它解决了单体容器设计在容错性、安全性和可扩展性上的根本缺陷。对于希望快速构建生产级`AI`自动化系统的开发者而言，`Managed Agents`提供了一条低摩擦的路径：定义配置，启动会话，专注于业务逻辑——将基础设施交给`Anthropic`托管。

目前，`Managed Agents`仍处于`Beta`阶段，部分高级功能（`Outcomes`、`Multi-agent`编排、`Memory`）处于研究预览阶段，需要单独申请访问权限。随着功能的持续完善，它有望成为构建复杂`AI`自动化工作流的主流选择之一。
