---
slug: "/ai/copilot-instructions-guide"
title: "Copilot Instructions使用指南"
hide_title: true
keywords:
  [
    "Copilot Instructions",
    "VS Code",
    "GitHub Copilot",
    "自定义指令",
    "AI编程",
    "代码生成",
    "编程规范",
    "最佳实践",
    "Instructions文件",
    "AGENTS.md",
    "copilot-instructions.md",
    "AI辅助开发",
    "代码规范",
    "项目配置",
    "开发工具"
  ]
description: "Copilot Instructions是VS Code中用于定制GitHub Copilot行为的强大功能，允许开发者通过自定义指令文件来规范AI生成代码的风格、遵循项目规范、实现一致性的开发体验。本文全面介绍Copilot Instructions的核心功能、使用方法、配置管理、应用场景和最佳实践，帮助开发者充分利用这一功能提升开发效率和代码质量。"
toc_max_heading_level: 3
---

## 前言

在使用`GitHub Copilot`等`AI`编程助手时，我们经常遇到这样的问题：`AI`生成的代码风格不统一、不符合项目规范、缺少必要的注释，或者需要反复提醒`AI`遵循某些开发准则。每次都要在聊天中重复相同的要求，既耗时又容易遗漏。

`Copilot Instructions`正是为了解决这些问题而设计的功能。它允许开发者通过`Markdown`文件定义自定义指令，自动影响`AI`如何生成代码和处理开发任务，确保`AI`的响应始终符合你的编码规范和项目需求。

本文将全面介绍`Copilot Instructions`的功能特性、使用方法、应用场景和最佳实践，帮助你充分利用这一强大功能。

## Copilot Instructions是什么

`Copilot Instructions`是`VS Code`中`GitHub Copilot`的一项自定义功能，它允许开发者通过`Markdown`格式的指令文件来定义通用的开发准则和规范。这些指令会自动添加到`AI`的上下文中，影响`AI`生成代码、回答问题和处理任务的方式。

简单来说，`Copilot Instructions`让你能够"教导"`AI`如何按照你的方式工作，而不需要在每次对话中重复说明。

### 核心特点

- **持久化配置**：指令保存在文件中，团队可以共享，确保一致性
- **自动应用**：符合条件的指令会自动添加到聊天上下文，无需手动指定
- **灵活配置**：支持全局指令、工作区指令、文件类型特定指令等多种粒度
- **多种文件类型**：支持`.github/copilot-instructions.md`、`*.instructions.md`、`AGENTS.md`等多种格式
- **版本控制友好**：指令文件可以纳入`Git`管理，便于团队协作

### 关键概念

| 概念 | 说明 |
|------|------|
| `Instructions`文件 | 包含自定义指令的`Markdown`文件 |
| 自动应用（`Auto-apply`） | 根据`applyTo`模式自动将指令添加到上下文 |
| 手动附加（`Manual attach`） | 通过聊天界面的"`Add Context`"手动选择指令 |
| 作用域（`Scope`） | 指令可以作用于工作区级别或用户级别 |
| 优先级 | 多个指令文件可以同时生效，`VS Code`会合并它们 |

## 解决什么问题

`Copilot Instructions`主要解决以下几类问题：

### 代码风格不一致

不同团队成员或`AI`生成的代码风格可能不一致。通过定义统一的编码规范指令，可以确保所有`AI`生成的代码都遵循相同的风格。

**场景示例**：
- 统一缩进方式（空格 vs 制表符）
- 统一命名规范（驼峰 vs 下划线）
- 统一注释风格
- 统一导入顺序

### 项目规范遵循困难

每个项目都有自己的技术栈、架构模式和最佳实践。手动向`AI`说明这些规范既繁琐又容易遗漏。

**场景示例**：
- 特定框架的使用规范（如`React Hooks`使用规则）
- 项目特定的目录结构约定
- 安全规范（如禁止使用某些危险函数）
- 性能优化准则

### 重复性说明浪费时间

如果每次都要向`AI`重复说明相同的要求，会严重影响开发效率。

**场景示例**：
- 每次都要求添加错误处理
- 每次都要求添加单元测试
- 每次都要求添加类型注解
- 每次都要求使用特定的日志格式

### 团队协作缺乏一致性

团队成员使用`AI`时如果没有统一的指导，生成的代码质量和风格会有较大差异。

**场景示例**：
- 新成员不了解项目规范
- 不同成员对`AI`的使用方式不同
- 代码审查时发现大量不符合规范的代码
- 难以维护代码的一致性

### 上下文信息传递不便

某些项目特定的背景信息需要反复向`AI`说明。

**场景示例**：
- 项目依赖的特殊库的使用方法
- 自定义工具函数的用途
- 项目特定的术语和概念
- 外部`API`的调用规范

## 核心功能

`Copilot Instructions`提供了以下核心功能：

### 多种指令文件类型

`VS Code`支持三种主要的指令文件类型，每种都有其特定用途：

#### .github/copilot-instructions.md

- **位置**：工作区根目录的`.github/`文件夹下
- **作用范围**：自动应用于工作区内的所有聊天请求
- **适用场景**：定义整个项目的通用开发准则
- **兼容性**：也被`Visual Studio`和`GitHub.com`的`Copilot`识别
- **启用方式**：需要启用`github.copilot.chat.codeGeneration.useInstructionFiles`设置

**示例结构**：
```markdown
# 项目编码规范

- 遵循Go官方编码风格指南
- 遵循项目中定义的gofmt和golint规则
- 为所有导出函数添加文档注释
- 使用context进行超时和取消控制
```

#### *.instructions.md

- **位置**：默认在`.github/instructions/`文件夹下，也可配置到用户配置文件夹
- **作用范围**：可通过`applyTo`属性指定特定文件类型或路径
- **适用场景**：针对特定文件类型、语言或任务的定制化指令
- **灵活性**：可以创建多个指令文件，每个针对不同场景

**示例结构**：
```markdown
---
name: "Go编码规范"
description: "Go文件的编码规范"
applyTo: "**/*.go"
---

# Go编码规范

- 遵循Go官方编码风格指南
- 使用gofmt格式化代码
- 为所有导出的函数和类型添加文档注释
- 使用testing包编写单元测试
```

#### AGENTS.md

- **位置**：工作区根目录或子目录
- **作用范围**：自动应用于所有聊天请求
- **适用场景**：为多`AI Agent`环境定义指令
- **实验性功能**：支持嵌套的`AGENTS.md`文件（需启用`chat.useNestedAgentsMdFiles`）
- **启用方式**：需要启用`chat.useAgentsMdFile`设置

### 灵活的应用方式

#### 自动应用

通过在指令文件头部定义`applyTo`属性，可以指定指令自动应用的条件：

```markdown
---
applyTo: "**/*.go"
---

# Go编码规范
...
```

支持的模式包括：
- `**/*.py` - 所有`Python`文件
- `src/**` - `src`目录下的所有文件
- `**/test/**` - 所有测试目录
- `**` - 所有文件

#### 手动附加

在聊天界面中，可以通过"`Add Context`"菜单手动选择要应用的指令文件。这适用于：
- 临时需要某个指令
- 指令没有定义`applyTo`属性
- 需要明确控制指令的应用

### 作用域管理

#### 工作区级别（Workspace Level）

- **存储位置**：`.github/instructions/`或其他配置的工作区路径
- **作用范围**：仅在当前工作区生效
- **适用场景**：项目特定的规范和准则
- **版本控制**：通常应该纳入`Git`管理，供团队共享

#### 用户级别（User Level）

- **存储位置**：用户配置文件目录
- **作用范围**：在所有工作区生效
- **适用场景**：个人偏好的编码风格
- **跨设备同步**：可以通过`Settings Sync`在多台设备间同步

### 指令文件格式

指令文件使用`Markdown`格式，包含可选的`YAML`头部和指令正文：

```markdown
---
name: "后端代码审查指南"
description: "后端代码审查指导原则"
applyTo: "backend/**"
---

# 后端代码审查清单

## 安全性
- 检查SQL注入漏洞
- 验证所有用户输入
- 使用参数化查询

## 性能
- 为需要的字段添加数据库索引
- 优化N+1查询
- 缓存频繁访问的数据

## 测试
- 单元测试覆盖率 > 80%
- 为API接口添加集成测试
```

### 引用上下文

在指令中可以使用`Markdown`链接来引用特定的文件、文档或`URL`：

```markdown
# 项目指南

- 遵循 [style-guide.md](docs/style-guide.md) 中的代码风格指南
- API文档：[API文档](https://api.example.com/docs)
- 使用 [utils.go](src/utils.go) 中的工具函数
```

### 工具引用

可以在指令中引用特定的`Agent`工具：

```markdown
# 指令说明

搜索代码示例时，使用 #tool:githubRepo 工具搜索GitHub仓库。
```

### 设置集成

除了文件形式，还可以通过`VS Code`设置定义特定场景的指令：

| 设置项 | 用途 |
|--------|------|
| `github.copilot.chat.reviewSelection.instructions` | 代码审查指令 |
| `github.copilot.chat.commitMessageGeneration.instructions` | 提交消息生成指令 |
| `github.copilot.chat.pullRequestDescriptionGeneration.instructions` | `PR`描述生成指令 |

## 使用配置

### frontmatter配置
指令文件（`*.instructions.md`）顶部的`YAML`前置配置（`frontmatter`）支持以下字段：

| 配置项 | 必填 | 说明 | 
|--------|------|------|
| `name` | 否 | 指令文件的显示名称，在`UI`中展示。如果未指定，使用文件名 |
| `description` | 否 | 指令文件的简短描述，说明其用途 | 
| `applyTo` | 否 | `Glob`模式，定义指令自动应用的文件范围。相对于工作区根目录。如果未指定，需要手动附加 | 

**配置示例**：

```yaml
---
name: "Go服务层规范"
description: "Go服务层代码最佳实践"
applyTo: "service/**/*.go"
---
```

**配置提示**：
- `applyTo`支持标准的`glob`模式，如`**/*.ts`（所有`TypeScript`文件）、`src/**`（`src`目录下所有文件）
- 如果不设置`applyTo`，指令不会自动应用，只能通过聊天界面手动附加
- 多个指令文件可以匹配同一个文件，`VS Code`会合并所有匹配的指令

### 注意事项

作用范围是工作区（`workspace`）级别的指令文件，必须放置于工作区的`.github/instructions/`目录下，否则无法被编辑器自动识别和应用。如果工作区下包含多个项目，且项目下有独立的`.github/instructions/`指令配置，这些指令无法被编辑器自动识别和应用，需要手动`Add Context...`才行。

## 如何使用

下面详细介绍如何配置和使用`Copilot Instructions`。

### 启用Instructions功能

首先需要在`VS Code`设置中启用相关功能：

#### 启用 .github/copilot-instructions.md

打开设置（`Cmd/Ctrl + ,`），搜索并启用（默认已启用）：
```
github.copilot.chat.codeGeneration.useInstructionFiles
```

#### 启用 AGENTS.md

搜索并启用（默认已启用）：
```
chat.useAgentsMdFile
```

如果需要支持嵌套的`AGENTS.md`文件（实验性，需要手动启用）：
```
chat.useNestedAgentsMdFiles
```

### 创建 .github/copilot-instructions.md

这是最简单的开始方式，适合定义整个项目的通用规范。

**步骤**：

1. 在工作区根目录创建`.github`文件夹（如果不存在）
2. 在`.github`文件夹下创建`copilot-instructions.md`文件
3. 使用`Markdown`格式编写指令

**示例**：

```markdown
# 项目开发指南

## 代码风格
- 使用gofmt进行代码格式化
- 使用tab进行缩进
- 每行最大长度：120字符

## Go语言规范
- 遵循Effective Go指南
- 使用接口定义抽象
- 避免使用interface{}类型，优先使用具体类型

## 错误处理
- 明确处理所有错误
- 使用自定义错误类型提供更多上下文
- 不要忽略或panic错误

## 测试
- 为所有业务逻辑编写单元测试
- 使用testing包和testify断言库
- 目标测试覆盖率 >80%

## 注释
- 为导出的函数和类型添加文档注释
- 用行内注释解释复杂算法
- 保持注释简洁并及时更新
```

### 创建 *.instructions.md 文件

使用`*.instructions.md`可以创建更灵活、针对特定场景的指令。

**方法一：通过UI创建**

1. 打开聊天视图（`Chat View`）
2. 点击配置按钮（齿轮图标）> "`Chat Instructions`"
3. 选择"`New instruction file`"
4. 选择存储位置：
   - **Workspace**：存储在工作区的`.github/instructions/`
   - **User Profile**：存储在用户配置文件夹
5. 输入文件名
6. 编写指令内容

**方法二：通过命令面板创建**

1. 打开命令面板（`Cmd/Ctrl + Shift + P`）
2. 运行命令：`Chat: New Instructions File`
3. 按提示选择位置和输入文件名

**方法三：手动创建**

在`.github/instructions/`目录下直接创建`.instructions.md`文件。

**示例：Go特定指令**

文件：`.github/instructions/go-standards.instructions.md`

```markdown
---
name: "Go编码规范"
description: "Go语言特定的编码指南"
applyTo: "**/*.go"
---

# Go编码规范

## 代码风格
- 严格遵循Effective Go指南
- 使用gofmt格式化代码
- 使用goimports管理导入
- 每行最大长度：120字符

## 类型定义
- 为复杂的数据结构定义类型
- 使用结构体组合而非继承
- 为接口使用最小化定义

## 文档注释
- 为所有导出的包、类型、函数添加文档注释
- 注释以声明的名称开头
- 在注释中包含使用示例

## 错误处理
- 明确处理每个错误，不要使用_忽略
- 使用errors包包装错误以添加上下文
- 使用defer进行资源清理

## 测试
- 使用testing包编写单元测试
- 使用表驱动测试处理多个测试用例
- 使用testify/mock模拟外部依赖
- 目标测试覆盖率 >90%
```

**示例：API服务特定指令**

文件：`.github/instructions/api-service-standards.instructions.md`

```markdown
---
name: "API服务编码规范"
description: "API服务Go代码规范"
applyTo: "api/**/*.go"
---

# API服务开发规范

## 目录结构
- 每个服务一个包
- 使用内部包隔离实现细节
- handler、service、repository分层
- 保持文件在500行以内

## API最佳实践
- 使用RESTful API设计原则
- 统一使用JSON格式
- 实现标准的HTTP状态码
- 使用中间件处理通用逻辑

## 请求处理
- 验证所有输入参数
- 使用context传递请求上下文
- 实现请求超时控制
- 记录请求和响应日志

## 性能
- 使用连接池管理数据库连接
- 实现合理的缓存策略
- 对慢查询添加索引
- 使用goroutine处理异步任务

## 安全性
- 验证用户身份和权限
- 防止SQL注入攻击
- 实现请求限流
- 敏感信息不记录日志
```

### 创建 AGENTS.md 文件

`AGENTS.md`文件适合为多`Agent`环境或整个工作区定义通用指令。

**步骤**：

1. 在工作区根目录创建`AGENTS.md`文件
2. 使用`Markdown`格式编写指令
3. （可选）在子目录创建额外的`AGENTS.md`文件用于特定模块

**示例**：

```markdown
# 开发代理指南

## 代码生成
- 始终包含错误处理
- 为重要操作添加日志记录
- 使用环境变量进行配置
- 永远不要提交密钥或凭证

## 代码审查
- 检查安全漏洞
- 验证测试覆盖率
- 评审性能影响
- 确保文档已更新

## 调试
- 添加描述性日志消息
- 有效使用断点
- 检查边界情况
- 验证错误处理路径

## 文档
- 添加功能时更新README
- 记录API变更
- 为复杂功能添加示例
- 保持架构图更新
```

### 在设置中定义指令

对于特定任务，可以在`VS Code`设置中直接定义指令。

**打开设置JSON**：
1. 命令面板 > `Preferences: Open User Settings (JSON)`
2. 或者打开`.vscode/settings.json`（工作区级别）

**示例配置**：

```json
{
  "github.copilot.chat.reviewSelection.instructions": [
    { "text": "检查安全漏洞和数据验证" },
    { "text": "验证错误处理和边界情况" },
    { "file": "guidelines/code-review-checklist.md" }
  ],
  "github.copilot.chat.commitMessageGeneration.instructions": [
    { "text": "遵循Conventional Commits格式" },
    { "text": "包含工单号，格式：[PROJ-123]" },
    { "text": "保持主题行在50字符以内" }
  ],
  "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
    { "text": "包含：做什么、为什么、怎么做" },
    { "text": "列出所有破坏性变更" },
    { "text": "添加测试说明" },
    { "text": "引用相关问题" }
  ]
}
```

### 手动附加指令到聊天

除了自动应用，还可以手动选择要使用的指令：

**步骤**：

1. 在聊天界面输入提示
2. 点击"`Add Context`"按钮（`@`图标旁边）
3. 选择"`Instructions`"
4. 从列表中选择要附加的指令文件
5. 发送聊天请求

这种方式适合：
- 临时使用某个指令
- 指令没有配置`applyTo`自动应用
- 需要明确控制使用哪些指令

### 管理和编辑指令

**查看现有指令**：

1. 打开聊天视图
2. 点击配置按钮 > "`Chat Instructions`"
3. 查看所有可用的指令文件列表

或者使用命令：`Chat: Configure Instructions`

**编辑指令**：

1. 从指令列表中选择要编辑的文件
2. 在编辑器中修改内容
3. 保存文件，更改立即生效

**查看指令来源**：

将鼠标悬停在指令列表中的文件名上，工具提示会显示文件的完整路径，帮助你识别指令的来源：
- 内置指令
- 用户配置文件夹
- 当前工作区
- 扩展提供的指令

### 配置指令文件位置

默认情况下，工作区级别的指令文件存储在`.github/instructions/`，但可以自定义：

**设置**：`chat.instructionsFilesLocations`

**示例**：

```json
{
  "chat.instructionsFilesLocations": [
    ".github/instructions",
    ".copilot/instructions",
    "docs/ai-instructions"
  ]
}
```

`VS Code`会在这些目录中搜索`.instructions.md`文件。

### 生成指令文件

`VS Code`可以分析你的工作区并自动生成匹配项目的指令文件。

**步骤**：

1. 打开聊天视图
2. 点击配置按钮 > "`Generate Chat Instructions`"
3. `VS Code`会分析项目结构、代码风格等
4. 生成一个`.github/copilot-instructions.md`文件
5. 审查并根据需要调整内容

这是快速开始的好方法，特别是对于已有的项目。

### 跨设备同步指令

用户级别的指令文件可以通过`Settings Sync`在多台设备间同步。

**启用同步**：

1. 确保已启用`Settings Sync`
2. 命令面板 > `Settings Sync: Configure`
3. 确保选中"`Prompts and Instructions`"
4. 用户指令文件会自动同步到其他设备

注意：工作区级别的指令不会通过`Settings Sync`同步，而是通过版本控制系统（如`Git`）共享。

## 应用场景

`Copilot Instructions`在各种开发场景中都非常有用，以下是一些典型的应用场景。为简化示例，指令内容没有写太多，仅供参考。

### 统一团队编码规范

**场景描述**：
团队有多名开发者，每个人的编码风格不同，导致代码库风格混乱，难以维护。

**解决方案**：
创建`.github/copilot-instructions.md`定义团队统一的编码规范：

```markdown
# 团队编码规范

## 命名规范
- 变量：驼峰命名法（camelCase）
- 常量：全大写下划线命名法（UPPER_SNAKE_CASE）
- 类型：大驼峰命名法（PascalCase）
- 文件：小写下划线命名法（snake_case）

## 代码结构
- 函数最大长度：50行
- 文件最大长度：500行
- 将复杂逻辑提取到独立函数
- 每个函数只负责一个功能

## 文档
- 为所有导出函数添加文档注释
- 为复杂逻辑添加行内注释
- 每个模块包含README说明

## Git工作流
- 功能分支命名：feature/TICKET-123-description
- 提交信息格式：type(scope): message
- 合并前压缩提交
```

**效果**：
所有团队成员使用`Copilot`生成代码时都会遵循相同的规范，确保代码一致性。

### 语言和框架特定规范

**场景描述**：
项目使用多种编程语言和框架，每种都有其最佳实践。

**解决方案**：
为不同语言创建专门的指令文件：

**Go API服务**（`.github/instructions/go-api.instructions.md`）：
```markdown
---
applyTo: "api/**/*.go"
---

# Go API服务规范

- 遵循RESTful API设计原则
- 使用GoFrame开发框架
- 实现统一的错误响应格式
- 使用中间件处理认证和日志
- 对所有接口添加限流保护
- 实现优雅关闭
```

**Go数据层**（`.github/instructions/go-data.instructions.md`）：
```markdown
---
applyTo: "dao/**/*.go"
---

# Go数据层规范

- 使用GoFrame ORM进行数据库操作
- 禁止使用原始SQL语句进行数据库操作，避免SQL注入
- 实现数据库事务管理
- 为频繁查询的字段添加索引
- 使用连接池管理连接
- 实现软删除而非物理删除
```

**Go业务层**（`.github/instructions/go-service.instructions.md`）：
```markdown
---
applyTo: "service/**/*.go"
---

# Go业务层规范

- 遵循领域驱动设计原则
- 使用接口定义服务契约
- 明确处理所有错误
- 使用context进行超时控制
- 使用表驱动测试
- 为导出函数添加文档注释
- 使用有意义的变量名
```

### 安全和合规要求

**场景描述**：
项目有严格的安全和合规要求，需要确保`AI`生成的代码符合这些要求。

**解决方案**：
创建安全相关的指令：

```markdown
# 安全指南

## 认证与授权
- 永远不要硬编码凭证
- 使用环境变量存储密钥
- 实现合适的会话管理
- 每次请求都验证用户权限

## 输入验证
- 验证所有用户输入
- 数据库操作前清理数据
- 使用参数化查询
- 转义输出以防止XSS攻击

## 数据保护
- 加密静态敏感数据
- 所有通信使用HTTPS
- 实现请求限流
- 记录安全事件日志

## 代码安全
- 不使用eval()或exec()等危险函数
- 验证文件路径防止目录遍历
- 使用安全的随机数生成器
- 保持依赖库更新

## 合规性
- 遵循GDPR要求
- 实现数据保留策略
- 为敏感操作添加审计日志
- 记录数据处理活动
```

### 测试驱动开发（TDD）

**场景描述**：
团队实施`TDD`，需要确保每个功能都有对应的测试。

**解决方案**：
创建测试相关的指令：

```markdown
# 测试规范

## 单元测试
- 在实现前编写测试
- 使用AAA模式（Arrange-Act-Assert）
- 尽可能每个测试一个断言
- 测试边界情况和错误场景
- 模拟外部依赖

## 测试覆盖率
- 最低80%代码覆盖率
- 关键路径100%覆盖
- 测试正常流程和错误情况

## 测试组织
- 镜像源代码结构
- 使用描述性的测试名称
- 使用表驱动测试组织相关测试
- 使用setup和teardown进行测试准备和清理

## 集成测试
- 端到端测试API接口
- 使用测试数据库
- 每个测试后清理数据
- 测试认证和授权

## 最佳实践
- 保持测试快速和隔离
- 使用固定数据进行测试
- 避免测试实现细节
- 在CI/CD流水线中运行测试
```

### 文档自动生成

**场景描述**：
项目需要详细的文档，但手动维护文档很费时。

**解决方案**：
创建文档生成指令：

```markdown
# 文档编写指南

## 代码文档
- 为所有公开API添加文档注释
- 包含参数类型和描述
- 记录返回值和可能的错误
- 提供使用示例

## API文档
- 记录所有接口端点
- 包含请求/响应示例
- 列出所有可能的状态码
- 记录认证要求

## README更新
- 添加功能时更新README
- 包含安装说明
- 提供快速开始指南
- 列出配置选项

## 架构文档
- 记录设计决策
- 创建架构图
- 解释数据流
- 记录集成点

## 格式要求
- 使用Markdown格式
- 包含代码示例
- 链接到相关文档
- 保持文档更新
```

### 性能优化指导

**场景描述**：
应用有性能要求，需要确保生成的代码性能良好。

**解决方案**：
创建性能优化指令：

```markdown
# 性能优化指南

## 数据库操作
- 为频繁查询的列添加索引
- 避免N+1查询问题
- 使用批量操作
- 为大数据集实现分页
- 使用连接池

## Go性能优化
- 使用sync.Pool复用对象
- 合理使用goroutine
- 避免不必要的内存分配
- 使用buffer池处理I/O
- 使用pprof进行性能分析

## 缓存策略
- 缓存频繁访问的数据
- 使用Redis存储会话
- 实现HTTP缓存头
- 缓存数据库查询结果

## 算法优化
- 使用合适的数据结构
- 尽可能避免嵌套循环
- 实现高效算法
- 优化前先进行性能分析

## 监控
- 添加性能指标
- 记录慢操作日志
- 为性能问题设置告警
- 使用APM监控工具
```

### 微服务架构规范

**场景描述**：
项目采用微服务架构，需要统一服务间的交互规范。

**解决方案**：
创建微服务相关指令：

```markdown
# 微服务架构指南

## 服务设计
- 每个服务单一职责
- 服务无状态化
- 使用API网关进行路由
- 实现熔断器模式

## 服务通信
- 同步通信使用REST或gRPC
- 异步通信使用消息队列
- 实现指数退避的重试逻辑
- 使用关联ID进行链路追踪

## 数据管理
- 每个服务独立数据库
- 复杂工作流使用事件溯源
- 实现最终一致性
- 谨慎处理分布式事务

## 可观测性
- 结构化日志
- 分布式链路追踪
- 健康检查接口
- 每个服务的指标监控

## 部署
- 使用容器（Docker）
- 实现蓝绿部署
- 使用服务网格管理网络
- 使用CI/CD自动化部署
```

### 代码审查自动化

**场景描述**：
代码审查耗时，需要`AI`帮助进行初步审查。

**解决方案**：
配置代码审查指令：

```json
{
  "github.copilot.chat.reviewSelection.instructions": [
    { "text": "检查潜在的bug和逻辑错误" },
    { "text": "验证错误处理是否全面" },
    { "text": "确保代码遵循团队规范" },
    { "text": "检查安全漏洞" },
    { "text": "验证变更的测试覆盖率" },
    { "text": "查找性能问题" },
    { "text": "确保文档已更新" },
    { "file": ".github/instructions/review-checklist.md" }
  ]
}
```

### 多语言项目管理

**场景描述**：
项目包含前端、后端、移动端等多个技术栈。

**解决方案**：
为不同部分创建独立的指令文件：

```
.github/instructions/
├── api-service.instructions.md     (applyTo: "api/**")
├── data-layer.instructions.md      (applyTo: "dao/**")
├── business-logic.instructions.md  (applyTo: "service/**")
├── shared-testing.instructions.md  (applyTo: "**/*_test.go")
└── shared-docs.instructions.md     (applyTo: "docs/**")
```

或使用嵌套的`AGENTS.md`：

```
api/AGENTS.md        # API服务特定指令
service/AGENTS.md    # 业务层特定指令
dao/AGENTS.md        # 数据层特定指令
```

### 遗留代码重构

**场景描述**：
项目有大量遗留代码需要重构，但要保持兼容性。

**解决方案**：
创建重构指导指令：

```markdown
# 遗留代码重构指南

## 兼容性
- 保持向后兼容
- 移除API前添加废弃警告
- 提供迁移指南
- 保持旧测试通过

## 渐进式重构
- 以小的、可测试的增量进行重构
- 重构前先添加测试
- 使用绞杀者模式
- 始终保持系统可运行

## 代码现代化
- 更新到现代语言特性
- 替换废弃的库
- 改进错误处理
- 添加类型注解

## 文档记录
- 记录重构决策
- 解释破坏性变更
- 更新架构图
- 创建重构前后对比

## 质量保证
- 运行完整测试套件
- 执行手动测试
- 检查性能影响
- 合并前团队评审
```

### 开源项目贡献

**场景描述**：
参与开源项目，需要遵循项目的贡献指南。

**解决方案**：
为开源项目创建专门的指令：

```markdown
# 开源贡献指南

## 代码规范
- 遵循项目现有风格
- 开始前阅读CONTRIBUTING.md
- 检查现有的issues和PR
- 重大变更先在issue中讨论

## 提交规范
- 编写清晰、描述性的提交信息
- 在提交中引用issue编号
- 保持提交原子化和聚焦
- 如需要则签名提交

## Pull Request
- 完整填写PR模板
- 为新功能添加测试
- 更新文档
- 及时回应评审意见

## 沟通交流
- 保持尊重和专业
- 遵循行为准则
- 不清楚时提问
- 感谢评审者的时间

## 许可证
- 确保代码与项目许可证兼容
- 如需要添加版权头
- 不包含专有代码
- 记录第三方依赖
```

### AI辅助学习

**场景描述**：
学习新技术或框架，希望`AI`在学习过程中提供指导。

**解决方案**：
创建学习辅助指令：

```markdown
# 学习模式指南

## 教学风格
- 展示代码前先解释概念
- 提供循序渐进的解释
- 包含解释每个部分的注释
- 引用官方文档
- 建议额外的学习资源

## 代码示例
- 从简单示例开始
- 逐步增加复杂度
- 展示多种方法
- 解释每种方法的优缺点
- 包含需要避免的常见陷阱

## 最佳实践
- 解释为什么使用某些模式
- 展示好的和坏的示例
- 讨论设计权衡
- 建议改进我的代码
- 指出学习机会

## 资源推荐
- 链接到官方文档
- 建议相关教程
- 推荐书籍和课程
- 指向GitHub示例
- 分享社区最佳实践
```

## 参考资料

- [VS Code官方文档：Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [GitHub Copilot文档](https://docs.github.com/en/copilot)
- [Awesome Copilot社区示例](https://github.com/github/awesome-copilot)
- [VS Code Copilot设置参考](https://code.visualstudio.com/docs/copilot/copilot-settings)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
