---
slug: "/ai/copilot-prompts-guide"
title: "Copilot Prompts使用指南"
hide_title: true
keywords:
  [
    "Copilot Prompts",
    "VS Code",
    "GitHub Copilot",
    "提示文件",
    "AI编程",
    "代码生成",
    "开发工作流",
    "最佳实践",
    "Prompt Files",
    "自定义提示",
    "AI辅助开发",
    "任务自动化",
    "项目配置",
    "开发工具",
    "可复用提示"
  ]
description: "Copilot Prompts是VS Code中用于创建可复用开发任务提示的强大功能，允许开发者通过Markdown文件定义标准化的开发工作流，如代码生成、代码审查、项目脚手架等。本文全面介绍Copilot Prompts的核心功能、文件结构、使用方法、配置管理、应用场景和最佳实践，帮助开发者构建高效的开发任务库，提升团队协作效率和代码质量，实现一致性的开发体验。"
toc_max_heading_level: 3
---

## 前言

在日常开发中，我们经常需要执行一些重复性的任务，比如生成特定格式的代码组件、执行代码审查、创建测试用例、生成`API`文档等。每次都要在`GitHub Copilot`聊天中输入详细的提示语，不仅效率低下，而且容易遗漏关键要求，导致生成结果不够理想。

`Copilot Prompts`（提示文件）正是为了解决这一痛点而设计。它允许开发者将常用的开发任务封装成可复用的`Markdown`文件，只需在聊天中输入简短的命令（如`/create-form`），就能触发预定义的复杂提示，快速生成符合规范的代码或完成特定任务。

本文将深入介绍`Copilot Prompts`的功能特性、使用方法、应用场景和最佳实践，帮助你构建自己的开发任务库，显著提升开发效率。

## Copilot Prompts是什么

`Copilot Prompts`是`VS Code`中`GitHub Copilot`的一项功能，它允许开发者通过`Markdown`格式的提示文件（`.prompt.md`）定义可复用的开发任务提示。这些提示文件可以包含详细的指令、参数、工具配置等，让开发者能够快速触发标准化的开发工作流。

简单来说，`Copilot Prompts`就是将你常用的复杂提示语保存成文件，随时调用，确保每次执行任务时都能获得一致且高质量的结果。

### 核心特点

- **可复用性**：将常用的开发任务封装成文件，避免重复输入
- **标准化**：确保团队成员执行相同任务时使用统一的提示和规范
- **参数化**：支持输入变量，使提示文件更加灵活和通用
- **工具集成**：可以指定使用特定的工具（如`GitHub Repo`、文件搜索等）
- **按需触发**：与`Copilot Instructions`不同，提示文件是按需主动调用的
- **团队协作**：可以共享到代码仓库，让团队共享最佳实践

### 与Copilot Instructions的区别

| 特性 | Copilot Instructions | Copilot Prompts |
|------|---------------------|-----------------|
| **触发方式** | 自动应用到所有对话 | 按需主动调用 |
| **使用场景** | 通用规范和准则 | 特定开发任务 |
| **文件扩展名** | `.instructions.md` | `.prompt.md` |
| **参数支持** | 不支持 | 支持输入变量 |
| **工具配置** | 不支持 | 支持指定工具 |
| **作用范围** | 持续影响整个对话 | 仅影响单次调用 |

## 解决什么问题

`Copilot Prompts`主要解决以下几类开发问题：

### 重复性任务效率低

开发中存在大量重复性任务，每次都要输入冗长的提示语。

**场景示例**：
- 生成`CRUD`接口代码
- 创建`React`表单组件
- 生成数据库迁移脚本
- 编写单元测试模板
- 生成`API`文档

### 任务执行缺乏一致性

不同团队成员执行相同任务时，提示语不同导致结果差异大。

**场景示例**：
- 代码审查标准不统一
- 组件生成规范不一致
- 文档格式各不相同
- 测试用例质量参差不齐

### 复杂任务难以描述

某些复杂任务需要详细的上下文和指令，临时输入容易遗漏。

**场景示例**：
- 执行全面的安全审查
- 生成符合复杂规范的代码
- 重构大型代码模块
- 分析性能瓶颈

### 最佳实践难以传承

团队积累的开发经验和技巧无法有效沉淀和传递。

**场景示例**：
- 新成员不了解如何高效使用`Copilot`
- 最佳实践散落在各处，难以复用
- 缺少标准化的工作流程
- 团队协作效率低下

## 核心功能

`Copilot Prompts`提供了丰富的功能来支持各种开发场景。

### 提示文件结构

提示文件由两部分组成：可选的`YAML`头部和必需的正文内容。

#### YAML头部（可选）

```yaml
---
name: "create-react-form"
description: "生成一个React表单组件"
argument-hint: "formName=MyForm"
agent: "edit"
model: "gpt-4"
tools:
  - "workspace"
  - "githubRepo"
---
```

**头部字段说明**：

| 字段 | 说明 | 是否必需 |
|------|------|---------|
| `name` | 提示名称，用于`/`命令调用。若不指定，使用文件名 | 否 |
| `description` | 提示的简短描述 | 否 |
| `argument-hint` | 聊天输入框中显示的参数提示信息 | 否 |
| `agent` | 使用的代理：`ask`、`edit`、`plan`、`agent`或自定义代理名称 | 否 |
| `model` | 使用的语言模型，如`gpt-4`、`claude-3.5-sonnet` | 否 |
| `tools` | 可用的工具列表，如`workspace`、`githubRepo`、`MCP`工具等 | 否 |


#### Copilot AI模式介绍

`Copilot`提供了多种`AI`模式（代理），每种模式针对不同的使用场景进行了优化。在提示文件的`YAML`头部可以通过`agent`字段指定使用的模式。

| 模式 | 说明 | 适用场景 | 主要特点 | 
|--------|------|---------|---------|
| `ask` | 问答 | 代码解释、技术咨询、问题解答 | 侧重于提供信息和回答问题，不会主动修改代码 |
| `edit` | 编辑 | 代码修改、`bug`修复、代码重构 | 直接在文件中进行代码编辑和修改 |
| `plan` | 规划 | 复杂任务规划、多步骤操作、架构设计 | 会先制定详细的执行计划，然后逐步执行 |
| `agent` | 代理 | 自主任务执行、智能决策、综合处理 | 能够自主选择工具、执行多步操作、综合处理复杂任务 |

**模式选择建议**：

- **仅需要答案或解释**：使用`ask`模式
- **需要修改特定代码**：使用`edit`模式
- **需要执行复杂的多步骤任务**：使用`plan`模式
- **需要AI自主完成复杂工作**：使用`agent`模式
- **未指定模式**：`Copilot`会根据提示内容自动选择合适的模式

#### 工具优先级

当提示文件和自定义代理都指定了工具列表时，工具的优先级顺序为：

1. 提示文件中指定的工具（优先级最高）
2. 提示文件引用的自定义代理中的工具
3. 选中代理的默认工具（优先级最低）

**示例**：

```yaml
---
agent: "my-custom-agent"
tools:
  - "workspace"
  - "githubRepo"
---
```

此时会使用提示文件中指定的`workspace`和`githubRepo`工具，而不是`my-custom-agent`的默认工具。

#### 正文内容

正文包含发送给`LLM`的提示文本，支持`Markdown`格式。

```markdown
## 任务描述
请生成一个React表单组件，包含以下功能：

## 要求
- 使用TypeScript
- 使用React Hooks
- 包含表单验证
- 添加错误处理

## 输入参数
表单名称：${input:formName:请输入表单名称}

## 参考文件
请参考项目中的表单规范：[form-guidelines.md](../../docs/form-guidelines.md)
```




### 变量引用

提示文件支持多种变量类型：

| 变量类型 | 语法 | 说明 | 示例 |
|---------|------|------|------|
| 工作区变量 | `${workspaceFolder}` | 工作区根目录路径 | `/Users/john/project` |
| 工作区变量 | `${workspaceFolderBasename}` | 工作区文件夹名称 | `project` |
| 选择变量 | `${selection}` | 当前编辑器中的选中内容 | 选中的代码块 |
| 选择变量 | `${selectedText}` | 当前编辑器中的选中文本 | 选中的文本 |
| 文件变量 | `${file}` | 当前文件的完整路径 | `/Users/john/project/src/app.ts` |
| 文件变量 | `${fileBasename}` | 当前文件名 | `app.ts` |
| 文件变量 | `${fileDirname}` | 当前文件所在目录 | `/Users/john/project/src` |
| 文件变量 | `${fileBasenameNoExtension}` | 当前文件名（不含扩展名） | `app` |
| 输入变量 | `${input:variableName}` | 从聊天输入获取参数 | 用户输入的值 |
| 输入变量 | `${input:variableName:placeholder}` | 带占位符的输入参数 | 显示提示文本 |

### 工具引用

在提示文件正文中，可以使用`#tool:<tool-name>`语法引用工具：

```markdown
使用 #tool:githubRepo 工具搜索相关代码示例。
使用 #tool:workspace 工具查找项目中的类似实现。
```

### 文件引用

使用`Markdown`链接语法引用其他工作区文件：

```markdown
请参考以下文档：
- [编码规范](../../docs/coding-standards.md)
- [组件模板](../../templates/component-template.tsx)
```

**注意**：使用相对路径时，该路径相对于当前提示文件的位置。

## 如何使用Copilot Prompts

### 创建提示文件

有多种方式创建提示文件：

#### 方法一：通过聊天视图创建

1. 在`Chat`视图中，点击齿轮图标（`Configure Chat`）
2. 选择`Prompt Files` > `New prompt file`
3. 选择存储位置：
   - `Workspace`：存储在工作区的`.github/prompts`文件夹中
   - `User profile`：存储在用户配置文件夹中，跨工作区使用

#### 方法二：通过命令面板创建

1. 按`⇧⌘P`（`macOS`）或`Ctrl+Shift+P`（`Windows/Linux`）打开命令面板
2. 运行命令：
   - `Chat: New Prompt File` - 创建新的提示文件
   - `Chat: New Untitled Prompt File` - 创建未命名的提示文件

#### 方法三：手动创建

直接在以下位置创建`.prompt.md`文件：

- **工作区提示**：`.github/prompts/`目录
- **用户提示**：用户配置文件夹（通过设置`chat.promptFilesLocations`配置）

### 编写提示文件

创建文件后，按照以下步骤编写提示内容：

1. **填写YAML头部**（可选）：配置提示的名称、描述、代理、工具等
2. **编写提示正文**：使用`Markdown`格式描述任务要求
3. **添加变量引用**：使用变量使提示更加灵活
4. **引用相关文件**：链接到项目文档或模板文件
5. **测试提示**：使用编辑器中的播放按钮测试提示

### 调用提示文件

有多种方式运行提示文件：

#### 方法一：在聊天中使用斜杠命令

在`Chat`视图中，输入`/<提示名称>`，例如：

```text
/create-react-form formName=UserLoginForm
```

可以在命令后添加额外信息作为参数。

#### 方法二：通过命令面板运行

1. 按`⇧⌘P`打开命令面板
2. 运行`Chat: Run Prompt`命令
3. 从列表中选择要运行的提示文件

#### 方法三：在编辑器中运行

1. 在编辑器中打开提示文件
2. 点击编辑器标题栏中的播放按钮
3. 选择在当前聊天会话运行，或打开新的聊天会话

**提示**：这种方式适合快速测试和迭代提示文件。

### 配置与管理

#### 配置提示文件位置

通过`chat.promptFilesLocations`设置配置额外的提示文件位置：

```json
{
  "chat.promptFilesLocations": [
    ".github/prompts",
    "docs/prompts",
    "scripts/prompts"
  ]
}
```

#### 显示提示推荐

使用`chat.promptFilesRecommendations`设置在新聊天会话开始时显示推荐的提示：

```json
{
  "chat.promptFilesRecommendations": [
    "explain-code",
    "review-security",
    "generate-tests"
  ]
}
```

#### 修改现有提示文件

1. 在`Chat`视图中，选择`Configure Chat` > `Prompt Files`
2. 从列表中选择要修改的提示文件
3. 编辑器会打开该文件，进行修改后保存

或者使用命令面板：

1. 按`⇧⌘P`
2. 运行`Chat: Configure Prompt Files`
3. 选择要修改的提示文件

#### 查看提示文件来源

提示文件可能来自多个来源：内置、用户定义、工作区定义、扩展贡献。

查看来源的方法：

1. 运行`Chat: Configure Prompt Files`命令
2. 将鼠标悬停在提示文件上
3. 工具提示会显示来源位置

### 同步用户提示文件

可以使用`VS Code`的`Settings Sync`功能在多台设备间同步用户提示文件：

1. 确保已启用`Settings Sync`
2. 运行`Settings Sync: Configure`命令
3. 从列表中选择`Prompts and Instructions`
4. 提示文件将自动同步到其他设备

## 应用场景

`Copilot Prompts`适用于各种开发场景，以下是一些典型应用。

### 代码生成场景

#### 生成React组件

```markdown
---
name: "create-react-form"
description: "生成React表单组件"
argument-hint: "formName=MyForm fields=name,email,phone"
agent: "edit"
tools:
  - "workspace"
---

## 任务
生成一个React表单组件，组件名称：${input:formName:请输入表单名称}

## 表单字段
字段列表：${input:fields:请输入字段，逗号分隔}

## 要求
- 使用TypeScript和React Hooks
- 使用Formik进行表单管理
- 使用Yup进行表单验证
- 包含提交和重置功能
- 添加适当的错误提示
- 参考项目中的[表单规范](../../docs/form-guidelines.md)

## 输出
生成组件文件到：src/components/forms/${fileBasenameNoExtension}.tsx
```

#### 生成API接口

```markdown
---
name: "create-api-endpoint"
description: "生成RESTful API接口"
argument-hint: "resource=user method=POST"
agent: "edit"
---

## 任务
为资源 ${input:resource} 生成 ${input:method} 方法的API接口

## 要求
- 使用Express.js框架
- 包含请求参数验证
- 添加错误处理中间件
- 包含Swagger文档注释
- 添加单元测试
- 遵循项目的[API设计规范](../../docs/api-guidelines.md)
```

### 代码审查场景

#### 安全审查

```markdown
---
name: "review-security"
description: "执行代码安全审查"
agent: "agent"
tools:
  - "workspace"
  - "codebase"
---

## 任务
对选中的代码进行全面的安全审查：${selection}

## 检查项
1. SQL注入风险
2. XSS漏洞
3. CSRF防护
4. 敏感信息泄露
5. 身份认证和授权问题
6. 输入验证不足
7. 不安全的依赖项
8. 加密算法使用

## 输出格式
- 按严重程度分类问题
- 提供具体的代码位置
- 给出修复建议和示例代码
- 引用OWASP相关规范
```

#### 性能审查

```markdown
---
name: "review-performance"
description: "执行代码性能审查"
agent: "agent"
tools:
  - "workspace"
---

## 任务
分析选中代码的性能问题：${selection}

## 检查项
1. 算法时间复杂度
2. 内存使用效率
3. 数据库查询优化
4. 缓存策略
5. 并发处理
6. 资源泄漏风险

## 输出
- 识别性能瓶颈
- 给出优化建议
- 提供优化后的代码示例
```

### 文档生成场景

#### 生成API文档

```markdown
---
name: "generate-api-docs"
description: "生成API文档"
agent: "ask"
tools:
  - "workspace"
---

## 任务
为以下API接口生成详细文档：${selection}

## 文档内容
1. 接口描述和用途
2. 请求方法和路径
3. 请求参数（路径参数、查询参数、请求体）
4. 响应格式和状态码
5. 错误码说明
6. 请求示例（curl命令）
7. 响应示例

## 格式要求
使用Markdown格式，符合OpenAPI规范
```

### 测试用例生成

```markdown
---
name: "generate-unit-tests"
description: "生成单元测试"
agent: "edit"
tools:
  - "workspace"
---

## 任务
为以下函数生成单元测试：${selection}

## 测试框架
- 使用Jest测试框架
- 使用TypeScript

## 测试内容
1. 正常场景测试
2. 边界条件测试
3. 异常情况测试
4. Mock外部依赖
5. 测试覆盖率达到90%以上

## 输出
生成测试文件到：${fileDirname}/__tests__/${fileBasenameNoExtension}.test.ts
```

### 代码重构场景

```markdown
---
name: "refactor-extract-function"
description: "提取函数重构"
agent: "edit"
---

## 任务
将选中的代码提取为独立函数：${selection}

## 要求
1. 分析代码逻辑，确定函数职责
2. 选择合适的函数名
3. 识别函数参数和返回值
4. 添加类型注解（TypeScript）
5. 添加JSDoc注释
6. 保持原有功能不变
7. 提高代码可读性和可维护性
```

## 最佳实践

### 命名规范

- 使用有意义的名称，清楚描述提示的用途
- 使用连字符分隔单词，如`create-react-form`、`review-security`
- 避免过于简短或模糊的名称
- 保持团队内命名风格一致

### 提示编写原则

#### 清晰描述任务目标

明确说明提示要完成什么任务，期望什么样的输出：

```markdown
## 任务目标
生成一个RESTful API接口，包含完整的CRUD操作

## 预期输出
- Controller文件
- Service文件
- DTO定义
- 单元测试
```

#### 提供具体示例

通过示例帮助`AI`理解期望的输入和输出格式：

```markdown
## 输入示例
资源名称：User
字段：id, name, email, createdAt

## 输出示例
```typescript
export class UserController {
  async create(data: CreateUserDto): Promise<User> {
    // 实现代码
  }
}
```
```

#### 使用结构化格式

使用标题、列表、表格等结构化元素组织内容：

```markdown
## 功能要求
1. 数据验证
   - 必填字段检查
   - 格式验证
   - 业务规则验证

2. 错误处理
   - 参数错误
   - 业务错误
   - 系统错误
```

### 利用变量和参数

#### 使用输入变量增加灵活性

```markdown
组件名称：${input:componentName:请输入组件名称}
组件类型：${input:componentType:functional|class}
```

#### 引用工作区文件

```markdown
请参考项目中的实现：
- [用户模型](../../src/models/User.ts)
- [认证服务](../../src/services/AuthService.ts)
```

### 工具配置策略

根据任务需求合理配置工具：

```yaml
# 需要搜索代码库
tools:
  - "workspace"
  - "codebase"

# 需要访问GitHub仓库
tools:
  - "githubRepo"

# 需要使用MCP工具
tools:
  - "mcp-server/*"
```

### 引用自定义指令

在提示文件中可以引用`Copilot Instructions`以复用通用规范：

```markdown
## 编码规范
请遵循项目的[编码规范](../../.github/copilot-instructions.md)

## 特定要求
此外，还需要满足以下特定要求：
- 使用异步/等待模式
- 添加详细的错误日志
```

### 测试和迭代

#### 使用编辑器播放按钮测试

在编辑器中打开提示文件，点击播放按钮快速测试效果，根据结果调整提示内容。

#### 收集反馈持续改进

- 记录提示使用中的问题
- 收集团队成员的反馈
- 定期回顾和优化提示文件
- 更新到最新的最佳实践

### 组织和分类

#### 按功能分类

```text
.github/prompts/
├── code-generation/
│   ├── create-react-form.prompt.md
│   ├── create-api-endpoint.prompt.md
│   └── create-model.prompt.md
├── code-review/
│   ├── review-security.prompt.md
│   ├── review-performance.prompt.md
│   └── review-accessibility.prompt.md
├── documentation/
│   ├── generate-api-docs.prompt.md
│   └── generate-readme.prompt.md
└── testing/
    ├── generate-unit-tests.prompt.md
    └── generate-e2e-tests.prompt.md
```

#### 建立索引文件

创建`README.md`记录所有可用提示及其用途：

```markdown
# 项目提示文件索引

## 代码生成
- `/create-react-form` - 生成React表单组件
- `/create-api-endpoint` - 生成API接口

## 代码审查
- `/review-security` - 安全审查
- `/review-performance` - 性能审查

## 文档生成
- `/generate-api-docs` - 生成API文档
```

### 团队协作建议

#### 统一提示风格

制定团队的提示编写规范，确保所有提示文件风格一致。

#### 版本控制管理

将提示文件纳入`Git`管理，记录变更历史：

```bash
git add .github/prompts/
git commit -m "feat: 添加React组件生成提示"
```

#### 代码审查

对新增或修改的提示文件进行代码审查，确保质量。

#### 分享最佳实践

定期在团队内分享有用的提示文件和使用技巧。



## 常见问题

### 如何知道提示文件来自哪里？

提示文件可能来自不同来源：内置、用户定义、工作区定义、扩展贡献。

查看方法：
1. 运行`Chat: Configure Prompt Files`命令
2. 将鼠标悬停在提示文件上
3. 工具提示会显示来源位置

### 提示文件不显示怎么办？

可能的原因和解决方法：

1. **文件扩展名错误**：确保文件以`.prompt.md`结尾
2. **位置不正确**：检查文件是否在`.github/prompts/`或配置的位置
3. **重启VS Code**：有时需要重启编辑器才能识别新文件
4. **检查设置**：确认`chat.promptFilesLocations`设置正确

### 如何调试提示文件？

1. 使用编辑器中的播放按钮测试提示
2. 在开发者工具中查看日志（`Help` > `Toggle Developer Tools`）
3. 简化提示内容，逐步添加复杂度
4. 检查变量引用是否正确

### 提示文件可以嵌套吗？

提示文件本身不支持直接嵌套，但可以通过引用其他文件实现复用：

```markdown
请遵循以下规范：
[编码规范](../../docs/coding-standards.md)
[测试规范](../../docs/testing-standards.md)
```

### 如何在提示文件中使用条件逻辑？

提示文件不支持条件逻辑，但可以通过参数化和清晰的指令让`AI`做出判断：

```markdown
根据组件类型 ${input:type:functional|class} ，生成对应的React组件：
- 如果是functional，使用函数组件和Hooks
- 如果是class，使用类组件和生命周期方法
```


## 参考资料

- [Copilot自定义概述](https://code.visualstudio.com/docs/copilot/customization/overview)
- [创建自定义指令](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [创建自定义代理](https://code.visualstudio.com/docs/copilot/customization/custom-agents)
- [VS Code中的Copilot聊天](https://code.visualstudio.com/docs/copilot/chat/copilot-chat)
- [配置聊天工具](https://code.visualstudio.com/docs/copilot/chat/chat-tools)
- [社区贡献的指令、提示和自定义代理](https://github.com/github/awesome-copilot)


