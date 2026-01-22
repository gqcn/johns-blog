---
slug: "/ai/copilot-skills-guide"
title: "Copilot Skills使用指南"
hide_title: true
keywords:
  [
    "Copilot Skills",
    "Agent Skills",
    "VS Code",
    "GitHub Copilot",
    "自定义技能",
    "AI编程",
    "开发工作流",
    "代码生成",
    "最佳实践",
    "SKILL.md",
    "技能文件",
    "AI辅助开发",
    "任务自动化",
    "项目配置",
    "开发工具",
    "可复用技能",
    "开放标准",
    "渐进式披露",
    "技能目录",
    "脚本集成"
  ]
description: "Copilot Skills（Agent Skills）是一种开放标准的技能定义格式，允许开发者通过包含指令、脚本和资源的文件夹来扩展GitHub Copilot的专业能力。本文全面介绍Copilot Skills的核心概念、文件结构、使用方法、配置管理、应用场景和最佳实践，详细说明如何创建和管理技能文件，包括SKILL.md的格式规范、目录结构、命名规则、渐进式披露机制等关键内容，帮助开发者构建可移植的专业技能库，提升AI助手在特定领域任务中的表现和效率。"
toc_max_heading_level: 3
---

## 前言

随着`AI`编程助手的广泛应用，开发者面临着一个新的挑战：如何让`AI`掌握特定领域的专业知识和复杂工作流程？传统的自定义指令虽然能够定义编码规范，但对于需要执行脚本、引用文档、处理多步骤任务等复杂场景，往往力不从心。

`Copilot Skills`（`Agent Skills`）正是为了解决这一问题而诞生的开放标准。它不仅仅是简单的文本指令，而是一个完整的技能包，可以包含详细的操作指南、可执行脚本、参考文档、模板文件等多种资源。更重要的是，`Skills`采用渐进式披露机制，只在需要时加载相关内容，确保高效使用上下文。

与`Copilot Instructions`注重编码规范不同，`Skills`专注于赋予`AI`新的专业能力，让它能够胜任`Web`应用测试、数据分析、文档生成、`CI/CD`调试等各种领域特定任务。本文将深入介绍`Copilot Skills`的功能特性、使用方法、应用场景和最佳实践。

## Copilot Skills是什么

`Copilot Skills`（也称为`Agent Skills`）是一种开放标准的技能定义格式，它允许开发者通过包含指令、脚本和资源的文件夹来扩展`AI`代理的专业能力。每个技能就是一个独立的目录，其中必须包含一个`SKILL.md`文件来定义技能的元数据和使用指南。

简单来说，`Copilot Skills`就是给`AI`助手创建"专业技能包"，让它能够按照你定义的流程和标准完成特定领域的复杂任务。

### 核心特点

- **开放标准**：基于 [agentskills.io](https://agentskills.io/) 开放标准，可跨多个`AI`工具使用
- **完整能力包**：不仅包含指令，还可以包含脚本、文档、模板等资源
- **渐进式披露**：采用三级加载机制，高效管理上下文使用
- **自动激活**：根据任务描述自动匹配和加载相关技能
- **跨平台兼容**：支持`Copilot`、`Claude Code`、`Cursor`等多个平台
- **可移植性强**：技能可以轻松分享和复用
- **版本控制友好**：技能目录可纳入`Git`管理

### 关键概念

| 概念 | 说明 |
|------|------|
| `SKILL.md` | 每个技能必需的核心文件，包含元数据和详细指令 |
| 渐进式披露 | 分三级加载：元数据→指令→资源文件 |
| 项目技能 | 存储在项目的`.github/skills/`目录 |
| 个人技能 | 存储在用户目录的`~/.copilot/skills/` |
| 技能发现 | `AI`通过`name`和`description`判断是否加载技能 |
| 技能激活 | 当任务匹配时，`AI`加载完整的`SKILL.md`内容 |
| 资源访问 | 按需加载技能目录中的脚本、文档等文件 |

### 与Instructions和Prompts的对比

理解三种自定义功能的差异，有助于选择合适的工具：

| 特性 | Instructions | Prompts | Skills |
|------|--------------|---------|---------|
| **主要用途** | 定义编码规范和准则 | 创建可复用的任务提示 | 赋予专业领域能力 |
| **触发方式** | **自动应用**到所有对话 | 按需**手动调用** | 根据任务**自动激活** |
| **文件扩展名** | `.instructions.md` | `.prompt.md` | `SKILL.md` |
| **可包含内容** | 仅文本指令 | 文本指令和参数 | 指令、脚本、文档、资源 |
| **标准化程度** | `VS Code`特定 | `VS Code`特定 | 开放标准（跨平台） |
| **跨平台兼容** | 仅`VS Code`和`GitHub.com` | 仅`VS Code` | 多平台（`VS Code`、`CLI`、编码代理） |
| **上下文管理** | 始终加载 | 单次调用 | 渐进式披露（三级加载） |
| **典型场景** | 代码风格、命名规范 | 生成组件、代码审查 | 测试流程、数据分析 |
| **资源支持** | 不支持 | 不支持 | 支持脚本、文档、模板 |

**选择建议**：

- **使用Instructions**：定义项目的编码标准、命名规范、代码风格等通用准则
- **使用Prompts**：创建可复用的开发任务，如生成组件、执行审查等
- **使用Skills**：赋予`AI`专业能力，处理需要多步骤、脚本执行、文档查询的复杂任务

**组合使用示例**：

```text
项目配置/
├── .github/
│   ├── copilot-instructions.md    # 项目编码规范
│   ├── prompts/
│   │   ├── create-package.prompt.md  # 快速生成组件
│   │   └── code-review.prompt.md     # 执行代码审查
│   └── skills/
│       ├── web-test/                 # 测试执行流程
│       └── performance-analysis/     # 性能优化指导
```


## 解决什么问题

`Copilot Skills`主要解决以下几类开发问题：

### 专业能力不足

通用的`AI`模型缺乏特定领域的专业知识和工作流程。

**场景示例**：
- `Web`应用测试流程和测试框架使用
- 特定行业的数据分析方法
- 公司内部的部署和发布流程
- 特定技术栈的调试技巧
- 法律文档审查标准

### 复杂工作流难以描述

某些任务需要多步骤操作、脚本执行、文档查询等复杂流程。

**场景示例**：
- 需要运行测试脚本并分析结果
- 需要查阅多个参考文档
- 需要使用特定模板生成代码
- 需要执行多步骤的调试流程
- 需要访问外部资源和工具

### 上下文管理困难

将大量指令、示例、文档一次性加载会浪费宝贵的上下文空间。

**场景示例**：
- 详细的`API`参考文档
- 大量的代码示例
- 复杂的配置模板
- 多个脚本文件
- 丰富的测试用例

### 能力无法跨工具使用

为不同`AI`工具重复定义相同的能力，维护成本高。

**场景示例**：
- 同时使用`VS Code`、命令行、编码代理
- 团队成员使用不同的`AI`工具
- 需要在多个项目间共享相同技能
- 希望向社区分享技能定义

## 核心功能

### 技能定义与管理

#### 技能目录结构

每个技能是一个包含`SKILL.md`文件的目录，可以包含额外的资源，例如：

```text
web-test/
├── SKILL.md              # 必需：技能定义文件
├── scripts/              # 可选：可执行脚本
│   ├── 运行测试.py
│   └── 分析结果.sh
├── references/           # 可选：参考文档
│   ├── 测试框架文档.md
│   └── 最佳实践.md
└── assets/               # 可选：静态资源
    ├── 测试模板.js
    └── 配置示例.json
```

**目录结构说明**：

| 文件/目录 | 必需 | 说明 |
|----------|------|------|
| `SKILL.md` | 是 | 技能的核心定义文件，包含`YAML`前置元数据和`Markdown`格式的详细指令 |
| `scripts/` | 否 | 存放可执行脚本的目录，如`Python`、`Bash`、`JavaScript`等脚本文件，用于执行具体任务 |
| `references/` | 否 | 存放参考文档的目录，包含详细的技术文档、`API`参考、配置说明等辅助材料 |
| `assets/` | 否 | 存放静态资源的目录，包括模板文件、配置示例、图片、数据文件等 |



#### SKILL.md文件格式

`SKILL.md`文件由两部分组成：`YAML`前置元数据和`Markdown`正文。

**基本格式**：

```markdown
---
name: web-test
description: 执行Web应用的端到端测试，包括测试脚本运行、结果分析和报告生成
---

# Web应用测试技能

## 何时使用此技能
当需要对Web应用执行自动化测试时使用此技能...

## 测试执行步骤
1. 检查测试环境配置
2. 运行测试脚本：`scripts/运行测试.py`
3. 分析测试结果...

## 结果分析方法
...
```

**完整格式（包含可选字段）**：

```markdown
---
name: pdf-processing
description: 从PDF文件提取文本和表格，填充PDF表单，合并多个PDF文档
license: Apache-2.0
compatibility: 需要pdfplumber和PyPDF2库
metadata:
  author: 技术团队
  version: "1.0"
  category: 文档处理
allowed-tools: Bash(python:*) Read
---

# PDF处理技能

## 技能说明
此技能提供PDF文档处理的全套能力...
```

### 前置元数据字段说明

| 字段 | 必需 | 说明 |
|------|------|----------|
| `name` | 是 | 技能的唯一标识符，最大`64`字符，仅小写字母、数字和连字符，必须与目录名一致  |
| `description` | 是 | 帮助`AI`判断何时加载此技能，最大`1024`字符，描述技能功能和使用场景 |
| `license` | 否 | 指定技能的许可协议，简短的许可证名称或文件引用 |
| `compatibility` | 否 | 说明环境要求（如所需工具、系统包等），最大`500`字符 |
| `metadata` | 否 | 存储作者、版本等额外元数据，键值对映射 |
| `allowed-tools` | 否 | 预批准可使用的工具（实验性），空格分隔的工具列表 |

#### name字段规则

- 长度：`1-64`字符
- 字符：仅允许小写字母（`a-z`）、数字和连字符（`-`）
- 限制：不能以连字符开头或结尾，不能包含连续连字符（`--`）
- 匹配：必须与父目录名称完全一致

**有效示例**：

```yaml
name: pdf-processing
name: data-analysis
name: code-review
name: web-test
```

**无效示例**：

```yaml
name: PDF-Processing  # 不能包含大写字母
name: -pdf            # 不能以连字符开头
name: pdf-            # 不能以连字符结尾
name: pdf--process    # 不能包含连续连字符
name: pdf处理         # 不能包含非ASCII字符
```

#### description字段最佳实践

`description`字段对于技能的自动激活至关重要，应该：

- 清晰描述技能的功能
- 说明适用的使用场景
- 包含有助于匹配的关键词

**好的示例**：

```yaml
description: 从PDF文件中提取文本和表格，填充PDF表单，合并多个PDF文档。适用于需要处理PDF文档、提取数据或批量处理PDF文件的场景。
```

**不好的示例**：

```yaml
description: 处理PDF文件。
```

### 技能存储位置

#### 项目级技能

存储在项目代码仓库中，团队共享：

- 推荐位置：`.github/skills/`
- 兼容位置：`.claude/skills/`（向后兼容）

**目录结构示例**：

```text
项目根目录/
├── .github/
│   └── skills/
│       ├── web-test/
│       │   └── SKILL.md
│       ├── database-migration/
│       │   └── SKILL.md
│       └── performance-analysis/
│           └── SKILL.md
```

#### 个人级技能

存储在用户主目录，仅个人使用：

- 推荐位置：`~/.copilot/skills/`
- 兼容位置：`~/.claude/skills/`（向后兼容）

**适用场景**：
- 个人工作习惯相关的技能
- 跨项目通用的技能
- 尚未准备好分享给团队的实验性技能

### 渐进式披露机制

`Copilot Skills`采用三级加载系统，确保高效使用上下文：

#### 级别1：技能发现

- **加载内容**：仅加载所有技能的`name`和`description`字段
- **加载时机**：`AI`助手（如`Copilot`）启动时始终加载
- **上下文消耗**：每个技能约`100`个`token`
- **作用**：帮助AI助手了解有哪些技能可用，判断哪些与当前任务相关

#### 级别2：指令加载

- **加载内容**：完整的`SKILL.md`文件正文
- **加载时机**：当任务与技能的`description`匹配时
- **上下文消耗**：建议控制在`5000`个`token`以内（约`500`行）
- **作用**：提供详细的操作指南和步骤

#### 级别3：资源访问

- **加载内容**：技能目录中的脚本、文档、模板等文件
- **加载时机**：仅当`AI`助手引用这些文件时
- **上下文消耗**：按需加载，只消耗实际使用的资源
- **作用**：提供执行能力和参考材料

**这种机制的优势**：

- 可以安装大量技能而不消耗过多上下文
- 只有相关技能才会被加载
- 详细的参考资料不会浪费上下文空间
- 支持复杂的技能定义而不影响性能

## 如何使用Copilot Skills

### 启用Skills功能

`Copilot Skills`功能目前处于预览阶段，需要手动启用。

**在VS Code中启用**：

1. 打开设置（`Ctrl+,`或`Cmd+,`）
2. 搜索`chat.useAgentSkills`
3. 勾选启用选项

或者通过设置`JSON`文件：

```json
{
  "chat.useAgentSkills": true
}
```

### 创建技能

#### 步骤1：创建技能目录

在项目根目录创建技能存储位置：

```bash
mkdir -p .github/skills/my-first-skill
```

#### 步骤2：编写SKILL.md文件

创建`.github/skills/my-first-skill/SKILL.md`：

```markdown
---
name: my-first-skill
description: 这是一个示例技能，演示如何创建基本的技能定义
---

# 我的第一个技能

## 技能介绍
这个技能展示了Skills的基本结构和使用方法。

## 使用说明
当你需要示例时，我会提供简单的演示代码。

## 示例
这里可以包含代码示例、操作步骤等内容。
```

#### 步骤3：添加资源文件（可选）

如果需要脚本或模板，可以创建额外的目录和文件：

```bash
mkdir -p .github/skills/my-first-skill/scripts
mkdir -p .github/skills/my-first-skill/references
```

创建示例脚本`scripts/示例脚本.py`：

```python
#!/usr/bin/env python3
# 这是一个示例脚本
print("你好，这是技能中的脚本！")
```

#### 步骤4：在SKILL.md中引用资源

在`SKILL.md`中使用相对路径引用资源：

```markdown
## 执行脚本
运行示例脚本：
[示例脚本](scripts/示例脚本.py)

## 参考文档
查看详细说明：
[详细文档](references/详细说明.md)
```

### 技能自动激活

技能创建完成后，`Copilot`会自动根据你的请求加载相关技能：

**示例对话**：

```text
用户：
- 我需要对Web应用进行测试

AI：
- 检测到与"web应用测试"技能相关，正在加载...
- 根据技能指南，我将帮你执行测试流程...
```

你不需要手动指定要使用哪个技能，`AI`会根据`description`字段自动判断。

### 使用共享技能

可以使用社区或团队分享的技能：

#### 从GitHub获取技能

1. 浏览技能仓库：
   - https://github.com/github/awesome-copilot
   - https://github.com/anthropics/skills

2. 复制技能目录到项目：

```bash
# 复制单个技能
cp -r /path/to/shared-skill .github/skills/

# 或克隆整个仓库后选择需要的技能
git clone https://github.com/anthropics/skills
cp -r skills/web-testing .github/skills/
```

3. 审查和定制`SKILL.md`文件
4. 根据需要调整或添加资源文件

**重要提醒**：
始终审查共享技能的内容，确保它们符合你的安全标准和项目需求。特别注意脚本执行权限和外部资源访问。

### 技能的组合使用

可以创建多个技能并组合使用，构建复杂的工作流：

**示例场景**：代码审查流程

```text
.github/skills/
├── code-quality-check/
│   └── SKILL.md          # 检查代码规范和质量
├── security-scan/
│   └── SKILL.md          # 扫描安全问题
├── performance-analysis/
│   └── SKILL.md          # 分析性能瓶颈
└── test-coverage/
    └── SKILL.md          # 检查测试覆盖率
```

当你请求"对这个文件进行全面的代码审查"时，`Copilot`可能会加载多个相关技能，执行综合的审查流程。

## 实际应用场景

### Web应用测试

**技能定义示例**：

```markdown
---
name: web-app-testing
description: 执行Web应用的端到端测试，运行Playwright测试脚本，分析测试结果并生成报告
---

# Web应用测试技能

## 何时使用
- 需要运行自动化测试
- 需要调试测试失败
- 需要编写新的测试用例
- 需要分析测试覆盖率

## 测试执行流程

### 1. 环境检查
确保已安装必要的依赖：
``bash
npm install
npx playwright install
``

### 2. 运行测试
使用测试模板：[测试模板](scripts/测试模板.spec.js)
``bash
npx playwright test
``

### 3. 分析结果
查看测试报告并识别失败原因...

## 测试用例模板
参考[测试示例](references/测试示例.md)编写测试用例。

## 常见问题
参考[故障排查指南](references/故障排查.md)解决常见问题。
```

### GitHub Actions调试

**技能定义示例**：

```markdown
---
name: github-actions-debug
description: 调试GitHub Actions工作流失败，分析日志，识别常见配置问题并提供修复建议
---

# GitHub Actions调试技能

## 何时使用
- 工作流构建失败
- 需要优化工作流配置
- 需要添加新的工作流步骤

## 调试步骤

### 1. 分析失败日志
1. 定位失败的步骤
2. 查找错误消息
3. 识别错误类型

### 2. 常见问题检查清单
- [ ] 环境变量配置是否正确
- [ ] 密钥和令牌是否有效
- [ ] 依赖版本是否兼容
- [ ] 权限设置是否充分

### 3. 修复建议
根据错误类型提供针对性的修复方案...

## 配置模板
参考[工作流模板](assets/工作流模板.yml)创建标准工作流。

## 最佳实践
查看[最佳实践指南](references/最佳实践.md)优化工作流。
```

### 数据分析任务

**技能定义示例**：

```markdown
---
name: data-analysis
description: 使用Python和pandas进行数据清洗、分析和可视化，生成数据报告
compatibility: 需要pandas、matplotlib、seaborn库
---

# 数据分析技能

## 何时使用
- 需要分析CSV或Excel数据
- 需要生成数据可视化图表
- 需要进行统计分析
- 需要清洗和转换数据

## 分析流程

### 1. 数据加载
使用分析脚本加载数据：[数据加载脚本](scripts/加载数据.py)

### 2. 数据清洗
- 处理缺失值
- 识别异常值
- 标准化数据格式

### 3. 数据分析
- 描述性统计
- 相关性分析
- 趋势分析

### 4. 可视化
使用可视化模板：[图表模板](assets/图表模板.py)

## 示例分析
参考[分析示例](references/分析示例.ipynb)了解完整流程。
```

### API文档生成

**技能定义示例**：

```markdown
---
name: api-doc-generator
description: 根据代码自动生成RESTful API文档，包括接口说明、参数、响应示例
---

# API文档生成技能

## 何时使用
- 需要为新接口生成文档
- 需要更新现有接口文档
- 需要生成OpenAPI规范

## 文档生成流程

### 1. 分析接口代码
识别路由、参数、响应结构等信息。

### 2. 使用文档模板
参考[API文档模板](assets/api文档模板.md)生成文档。

### 3. 文档结构
- 接口概述
- 请求方法和路径
- 请求参数说明
- 响应示例
- 错误码说明

## 示例文档
查看[文档示例](references/文档示例.md)了解标准格式。

## OpenAPI规范
参考[OpenAPI模板](assets/openapi模板.yaml)生成标准规范文件。
```

### 代码重构任务

**技能定义示例**：

```markdown
---
name: code-refactoring
description: 安全地重构代码，改善代码结构，提高可维护性，确保功能不变
---

# 代码重构技能

## 何时使用
- 代码结构混乱需要整理
- 存在重复代码需要抽取
- 需要提高代码可读性
- 需要改善代码设计模式

## 重构原则
1. 小步前进，每次只改一处
2. 每步重构后都要运行测试
3. 保持功能行为不变
4. 提交前进行充分测试

## 重构检查清单
- [ ] 是否有完善的测试覆盖
- [ ] 重构前后测试是否都通过
- [ ] 是否改善了代码可读性
- [ ] 是否减少了代码重复
- [ ] 是否改善了代码结构

## 常见重构模式
参考[重构模式](references/重构模式.md)了解常用技巧。

## 重构示例
查看[重构案例](references/重构案例.md)学习最佳实践。
```

## 最佳实践

### 技能设计原则

#### 单一职责原则

每个技能应该专注于一个明确的任务领域：

**好的示例**：
```text
- web-app-testing/        # 专注于Web测试
- database-migration/     # 专注于数据库操作
- performance-analysis/   # 专注于性能优化
```

**不好的示例**：
```text
- general-tool/      # 范围太广，不够具体
- mess-tool/         # 缺乏明确焦点
```

#### 清晰的描述

`description`字段要准确描述功能和使用场景：

**好的示例**：
```yaml
description: 执行Web应用的端到端测试，使用Playwright运行测试脚本，分析失败原因并生成测试报告。适用于需要运行自动化测试、调试测试失败或编写新测试用例的场景。
```

**不好的示例**：
```yaml
description: 测试相关的工具。
```

#### 合理的文件大小

控制`SKILL.md`文件大小，避免消耗过多上下文：

- **推荐**：`SKILL.md`正文少于`500`行（约`5000`个`token`）
- **策略**：将详细的参考资料拆分到`references/`目录
- **原则**：主文件包含核心流程，细节按需引用

**文件结构示例**：

```text
技能目录/
├── SKILL.md                   # 核心流程（300行）
└── references/
    ├── 详细API文档.md          # 详细参考（1000行）
    ├── 配置选项说明.md         # 配置细节（500行）
    └── 故障排查指南.md         # 问题解决（800行）
```

### 目录和文件组织

#### 标准目录结构

遵循标准结构，提高可读性和可维护性：

```text
技能名称/
├── SKILL.md                 # 必需：核心定义
├── scripts/                 # 可执行脚本
│   ├── 准备环境.sh
│   └── 执行任务.py
├── references/              # 参考文档
│   ├── API文档.md
│   └── 最佳实践.md
└── assets/                  # 静态资源
    ├── 配置模板.yaml
    └── 代码模板.js
```

#### 文件引用规范

在`SKILL.md`中引用其他文件时：

- 使用相对路径
- 保持引用层级简单（避免深层嵌套）
- 提供清晰的链接文本

**示例**：

```markdown
## 执行测试
运行测试脚本：[测试脚本](scripts/运行测试.py)

## 配置说明
参考详细配置：[配置指南](references/配置指南.md)

## 模板文件
使用标准模板：[测试模板](assets/测试模板.spec.js)
```

### 技能内容编写

#### 提供清晰的步骤

使用编号列表或检查清单展示操作步骤：

```markdown
## 部署流程

### 1. 构建准备
- [ ] 检查代码是否已提交
- [ ] 确认测试全部通过
- [ ] 更新版本号

### 2. 执行构建
``bash
npm run build
``

### 3. 部署到服务器
运行部署脚本：[部署脚本](scripts/部署.sh)

### 4. 验证部署
- [ ] 检查服务健康状态
- [ ] 验证关键功能
- [ ] 查看日志确认无错误
```

#### 包含示例

提供具体的输入输出示例：

```markdown
## 使用示例

### 输入
``javascript
const 数据 = {
  用户名: "张三",
  年龄: 28,
  城市: "北京"
};
``

### 处理过程
使用数据转换脚本：[转换脚本](scripts/数据转换.js)

### 输出
``json
{
  "username": "张三",
  "age": 28,
  "city": "北京",
  "timestamp": "2026-01-22T10:30:00Z"
}
``
```

#### 说明边界情况

明确技能的适用范围和限制：

```markdown
## 适用场景
- ✅ 处理100MB以内的数据文件
- ✅ 支持CSV、Excel、JSON格式
- ✅ 可以进行基本的统计分析

## 不适用场景
- ❌ 大规模数据（> 1GB）应使用专业数据库
- ❌ 实时数据流处理需要其他工具
- ❌ 复杂的机器学习任务超出此技能范围

## 环境要求
- Python 3.8+
- pandas、numpy库
- 至少4GB可用内存
```

### 脚本和资源

#### 脚本编写规范

编写自包含、健壮的脚本：

```python
#!/usr/bin/env python3
"""
数据分析脚本
功能：加载CSV文件并生成统计报告
使用：python 数据分析.py <文件路径>
"""

import sys
import pandas as pd

def 分析数据(文件路径):
    """分析数据并返回统计结果"""
    try:
        # 加载数据
        数据 = pd.read_csv(文件路径)
        print(f"成功加载 {len(数据)} 行数据")
        
        # 生成统计
        统计 = 数据.describe()
        print("\n数据统计：")
        print(统计)
        
        return 统计
    except FileNotFoundError:
        print(f"错误：找不到文件 {文件路径}")
        sys.exit(1)
    except Exception as e:
        print(f"错误：{str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("使用方法：python 数据分析.py <文件路径>")
        sys.exit(1)
    
    分析数据(sys.argv[1])
```

**脚本编写要点**：
- 包含清晰的文档字符串
- 提供有用的错误消息
- 处理常见的边界情况
- 使用中文输出提高可读性（如果团队使用中文）

#### 模板文件设计

创建通用、易于定制的模板：

```javascript
// 测试模板.spec.js
// 这是一个测试用例模板，可根据具体需求修改

import { test, expect } from '@playwright/test';

test('页面功能测试', async ({ page }) => {
  // 1. 导航到页面
  await page.goto('https://example.com');
  
  // 2. 执行操作
  await page.click('#按钮');
  
  // 3. 验证结果
  await expect(page.locator('#结果')).toBeVisible();
  
  // TODO: 根据实际情况添加更多测试步骤
});
```

### 技能维护

#### 版本管理

使用`metadata`字段记录版本信息：

```yaml
---
name: data-analysis
description: ...
metadata:
  version: "2.1.0"
  author: 数据团队
  last-updated: "2026-01-20"
  changelog: "新增时间序列分析功能"
---
```

#### 定期更新

- 根据反馈改进技能内容
- 更新过时的工具和方法
- 补充新的使用场景
- 修复发现的问题

#### 文档审查

定期审查技能文档，确保：
- 指令清晰准确
- 示例仍然有效
- 脚本能正常运行
- 链接没有失效

### 安全考虑

#### 审查共享技能

使用第三方技能前要仔细审查：

```bash
# 1. 查看SKILL.md内容
cat .github/skills/新技能/SKILL.md

# 2. 检查脚本内容
cat .github/skills/新技能/scripts/*.py

# 3. 查找可疑操作
grep -r "rm -rf" .github/skills/新技能/
grep -r "curl.*bash" .github/skills/新技能/
```

#### 控制脚本权限

- 不要给脚本不必要的执行权限
- 使用`VS Code`的终端工具控制功能
- 配置自动批准白名单
- 限制网络访问和文件操作

#### 敏感信息处理

- 不要在技能文件中硬编码密钥
- 使用环境变量或配置文件
- 在文档中说明如何安全地配置凭据

```markdown
## 环境配置

需要设置以下环境变量：

``bash
export API_KEY="你的API密钥"
export DATABASE_URL="数据库连接字符串"
``

⚠️ 注意：不要将密钥提交到代码仓库！
```

### 团队协作

#### 创建团队技能库

建立团队共享的技能仓库：

```text
团队项目/
├── .github/
│   └── skills/
│       ├── frontend-dev/
│       ├── backend-dev/
│       ├── database-ops/
│       ├── deployment/
│       └── testing/
```

#### 制定技能规范

为团队技能制定统一标准：

- 命名规范
- 文档结构要求
- 代码风格指南
- 审查流程

#### 鼓励贡献

- 建立技能提交流程
- 进行技能代码审查
- 分享使用经验
- 持续改进现有技能


## 常见问题

### 技能没有被激活怎么办？

**可能原因**：

- `description`字段与任务描述不匹配
- 技能名称或目录结构不符合规范
- `chat.useAgentSkills`设置未启用

**解决方法**：

1. 检查`description`字段是否包含相关关键词
2. 确认`name`字段与目录名完全一致
3. 验证`SKILL.md`的`YAML`前置元数据格式正确
4. 在设置中启用`chat.useAgentSkills`

### 如何调试技能内容？

**调试方法**：

1. 使用`skills-ref`工具验证：
    ```bash
    skills-ref validate .github/skills/my-skill
    ```

2. 查看`VS Code`的输出面板中的`Copilot`日志

3. 在对话中明确提及技能名称：
    ```
    使用"web-app-testing"技能帮我运行测试
    ```

### 技能文件太大怎么办？

**优化策略**：

1. 将详细内容拆分到`references/`目录
2. 使用外部链接引用在线文档
3. 精简`SKILL.md`正文，只保留核心流程
4. 将大型脚本独立存储，在`SKILL.md`中引用

### 多个技能冲突怎么办？

**处理方法**：

1. 确保每个技能的`description`足够具体
2. 避免创建范围重叠的技能
3. 在技能文档中明确说明适用范围
4. 必要时合并功能相近的技能

### 如何共享技能给团队？

**共享方式**：

1. **通过Git**：将技能目录提交到项目仓库
    ```bash
    git add .github/skills/
    git commit -m "添加web应用测试技能"
    git push
    ```

2. **创建技能仓库**：建立独立的技能仓库供多个项目使用

3. **发布到社区**：将通用技能贡献到社区仓库


## 参考资料

- [Copilot官方Skills文档](https://code.visualstudio.com/docs/copilot/customization/agent-skills)
- [Agent Skills开放标准](https://agentskills.io/)
- [Agent Skills规范](https://agentskills.io/specification)
- [Skills参考实现库](https://github.com/agentskills/agentskills/tree/main/skills-ref)
- [Anthropic Skills示例](https://github.com/anthropics/skills)
- [GitHub Awesome Copilot](https://github.com/github/awesome-copilot)
- [Copilot Instructions使用指南](/ai/copilot-instructions-guide)
- [Copilot Prompts使用指南](/ai/copilot-prompts-guide)
