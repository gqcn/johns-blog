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

- **Instructions文件**：包含自定义指令的`Markdown`文件
- **自动应用（Auto-apply）**：根据`applyTo`模式自动将指令添加到上下文
- **手动附加（Manual attach）**：通过聊天界面的"`Add Context`"手动选择指令
- **作用域（Scope）**：指令可以作用于工作区级别或用户级别
- **优先级**：多个指令文件可以同时生效，`VS Code`会合并它们

## 解决什么问题

`Copilot Instructions`主要解决以下几类问题：

### 1. 代码风格不一致

不同团队成员或`AI`生成的代码风格可能不一致。通过定义统一的编码规范指令，可以确保所有`AI`生成的代码都遵循相同的风格。

**场景示例**：
- 统一缩进方式（空格 vs 制表符）
- 统一命名规范（驼峰 vs 下划线）
- 统一注释风格
- 统一导入顺序

### 2. 项目规范遵循困难

每个项目都有自己的技术栈、架构模式和最佳实践。手动向`AI`说明这些规范既繁琐又容易遗漏。

**场景示例**：
- 特定框架的使用规范（如`React Hooks`使用规则）
- 项目特定的目录结构约定
- 安全规范（如禁止使用某些危险函数）
- 性能优化准则

### 3. 重复性说明浪费时间

如果每次都要向`AI`重复说明相同的要求，会严重影响开发效率。

**场景示例**：
- 每次都要求添加错误处理
- 每次都要求添加单元测试
- 每次都要求添加类型注解
- 每次都要求使用特定的日志格式

### 4. 团队协作缺乏一致性

团队成员使用`AI`时如果没有统一的指导，生成的代码质量和风格会有较大差异。

**场景示例**：
- 新成员不了解项目规范
- 不同成员对`AI`的使用方式不同
- 代码审查时发现大量不符合规范的代码
- 难以维护代码的一致性

### 5. 上下文信息传递不便

某些项目特定的背景信息需要反复向`AI`说明。

**场景示例**：
- 项目依赖的特殊库的使用方法
- 自定义工具函数的用途
- 项目特定的术语和概念
- 外部`API`的调用规范

## 核心功能

`Copilot Instructions`提供了以下核心功能：

### 1. 多种指令文件类型

`VS Code`支持三种主要的指令文件类型，每种都有其特定用途：

#### .github/copilot-instructions.md

- **位置**：工作区根目录的`.github/`文件夹下
- **作用范围**：自动应用于工作区内的所有聊天请求
- **适用场景**：定义整个项目的通用开发准则
- **兼容性**：也被`Visual Studio`和`GitHub.com`的`Copilot`识别
- **启用方式**：需要启用`github.copilot.chat.codeGeneration.useInstructionFiles`设置

**示例结构**：
```markdown
# Project Coding Standards

- Use TypeScript for all new files
- Follow ESLint rules defined in .eslintrc
- Add JSDoc comments for all public functions
- Use async/await instead of promises
```

#### *.instructions.md

- **位置**：默认在`.github/instructions/`文件夹下，也可配置到用户配置文件夹
- **作用范围**：可通过`applyTo`属性指定特定文件类型或路径
- **适用场景**：针对特定文件类型、语言或任务的定制化指令
- **灵活性**：可以创建多个指令文件，每个针对不同场景

**示例结构**：
```markdown
---
name: "Python Coding Standards"
description: "Coding standards for Python files"
applyTo: "**/*.py"
---

# Python Coding Standards

- Follow PEP 8 style guide
- Use type hints for all function parameters
- Include docstrings for all functions and classes
- Use pytest for unit testing
```

#### AGENTS.md

- **位置**：工作区根目录或子目录
- **作用范围**：自动应用于所有聊天请求
- **适用场景**：为多`AI Agent`环境定义指令
- **实验性功能**：支持嵌套的`AGENTS.md`文件（需启用`chat.useNestedAgentsMdFiles`）
- **启用方式**：需要启用`chat.useAgentsMdFile`设置

### 2. 灵活的应用方式

#### 自动应用

通过在指令文件头部定义`applyTo`属性，可以指定指令自动应用的条件：

```markdown
---
applyTo: "**/*.ts"
---

# TypeScript Coding Standards
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

### 3. 作用域管理

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

### 4. 指令文件格式

指令文件使用`Markdown`格式，包含可选的`YAML`头部和指令正文：

```markdown
---
name: "Backend Review Guidelines"
description: "Code review guidelines for backend code"
applyTo: "backend/**"
---

# Backend Code Review Checklist

## Security
- Check for SQL injection vulnerabilities
- Validate all user inputs
- Use parameterized queries

## Performance
- Add database indexes where needed
- Optimize N+1 queries
- Cache frequently accessed data

## Testing
- Unit test coverage > 80%
- Include integration tests for API endpoints
```

### 5. 引用上下文

在指令中可以使用`Markdown`链接来引用特定的文件、文档或`URL`：

```markdown
# Project Guidelines

- Follow the style guide in [style-guide.md](docs/style-guide.md)
- API documentation: [API Docs](https://api.example.com/docs)
- Use utility functions from [utils.ts](src/utils.ts)
```

### 6. 工具引用

可以在指令中引用特定的`Agent`工具：

```markdown
# Instructions

When searching for code examples, use #tool:githubRepo to search GitHub repositories.
```

### 7. 设置集成

除了文件形式，还可以通过`VS Code`设置定义特定场景的指令：

| 设置项 | 用途 |
|--------|------|
| `github.copilot.chat.reviewSelection.instructions` | 代码审查指令 |
| `github.copilot.chat.commitMessageGeneration.instructions` | 提交消息生成指令 |
| `github.copilot.chat.pullRequestDescriptionGeneration.instructions` | `PR`描述生成指令 |

## 使用配置

指令文件（`*.instructions.md`）顶部的`YAML`前置配置（`frontmatter`）支持以下字段：

| 配置项 | 必填 | 说明 | 
|--------|------|------|
| `name` | 否 | 指令文件的显示名称，在`UI`中展示。如果未指定，使用文件名 |
| `description` | 否 | 指令文件的简短描述，说明其用途 | 
| `applyTo` | 否 | `Glob`模式，定义指令自动应用的文件范围。相对于工作区根目录。如果未指定，需要手动附加 | 

**配置示例**：

```yaml
---
name: "React Component Standards"
description: "Best practices for React components"
applyTo: "src/components/**/*.{tsx,jsx}"
---
```

**注意事项**：
- `applyTo`支持标准的`glob`模式，如`**/*.ts`（所有`TypeScript`文件）、`src/**`（`src`目录下所有文件）
- 如果不设置`applyTo`，指令不会自动应用，只能通过聊天界面手动附加
- 多个指令文件可以匹配同一个文件，`VS Code`会合并所有匹配的指令

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
# Project Development Guidelines

## Code Style
- Use 2 spaces for indentation
- Use semicolons at the end of statements
- Maximum line length: 100 characters

## TypeScript
- Enable strict mode
- Use interfaces for object types
- Avoid using `any` type

## React
- Use functional components with hooks
- Extract custom hooks for reusable logic
- Use TypeScript for prop types

## Testing
- Write unit tests for all business logic
- Use Jest and React Testing Library
- Aim for >80% code coverage

## Comments
- Add JSDoc comments for public APIs
- Explain complex algorithms with inline comments
- Keep comments concise and up-to-date
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

**示例：Python特定指令**

文件：`.github/instructions/python-standards.instructions.md`

```markdown
---
name: "Python Coding Standards"
description: "Python specific coding guidelines"
applyTo: "**/*.py"
---

# Python Coding Standards

## Style Guide
- Follow PEP 8 style guide strictly
- Use Black for code formatting
- Use isort for import sorting
- Maximum line length: 88 characters

## Type Hints
- Use type hints for all function parameters and return values
- Use `typing` module for complex types
- Use `Optional` for nullable parameters

## Documentation
- Add docstrings to all modules, classes, and functions
- Use Google style docstring format
- Include parameter types and return types in docstrings

## Error Handling
- Use specific exception types
- Always include error messages
- Use context managers for resource management

## Testing
- Use pytest for unit testing
- Use parametrize for data-driven tests
- Mock external dependencies
- Aim for >90% code coverage
```

**示例：前端特定指令**

文件：`.github/instructions/frontend-standards.instructions.md`

```markdown
---
name: "Frontend Coding Standards"
description: "Standards for frontend React/TypeScript code"
applyTo: "src/components/**"
---

# Frontend Development Standards

## Component Structure
- One component per file
- Use named exports
- Co-locate styles with components
- Keep components under 300 lines

## React Best Practices
- Use functional components with hooks
- Extract custom hooks for shared logic
- Use React.memo for expensive components
- Avoid inline function definitions in JSX

## State Management
- Use useState for local state
- Use useReducer for complex state logic
- Use context for shared state
- Minimize prop drilling

## Performance
- Use React.lazy for code splitting
- Implement virtualization for long lists
- Optimize re-renders with useMemo and useCallback
- Use Web Workers for heavy computations

## Accessibility
- Include ARIA labels
- Support keyboard navigation
- Maintain proper heading hierarchy
- Test with screen readers
```

### 创建 AGENTS.md 文件

`AGENTS.md`文件适合为多`Agent`环境或整个工作区定义通用指令。

**步骤**：

1. 在工作区根目录创建`AGENTS.md`文件
2. 使用`Markdown`格式编写指令
3. （可选）在子目录创建额外的`AGENTS.md`文件用于特定模块

**示例**：

```markdown
# Development Agent Guidelines

## Code Generation
- Always include error handling
- Add logging for important operations
- Use environment variables for configuration
- Never commit secrets or credentials

## Code Review
- Check for security vulnerabilities
- Verify test coverage
- Review performance implications
- Ensure documentation is updated

## Debugging
- Add descriptive log messages
- Use breakpoints effectively
- Check for edge cases
- Verify error handling paths

## Documentation
- Update README when adding features
- Document API changes
- Include examples for complex features
- Keep architecture diagrams current
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
    { "text": "Check for security vulnerabilities and data validation" },
    { "text": "Verify error handling and edge cases" },
    { "file": "guidelines/code-review-checklist.md" }
  ],
  "github.copilot.chat.commitMessageGeneration.instructions": [
    { "text": "Follow Conventional Commits format" },
    { "text": "Include ticket number in format: [PROJ-123]" },
    { "text": "Keep subject line under 50 characters" }
  ],
  "github.copilot.chat.pullRequestDescriptionGeneration.instructions": [
    { "text": "Include: What, Why, How" },
    { "text": "List all breaking changes" },
    { "text": "Add testing instructions" },
    { "text": "Reference related issues" }
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

`Copilot Instructions`在各种开发场景中都非常有用，以下是一些典型的应用场景。

### 1. 统一团队编码规范

**场景描述**：
团队有多名开发者，每个人的编码风格不同，导致代码库风格混乱，难以维护。

**解决方案**：
创建`.github/copilot-instructions.md`定义团队统一的编码规范：

```markdown
# Team Coding Standards

## Naming Conventions
- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Classes: PascalCase
- Files: kebab-case

## Code Structure
- Maximum function length: 50 lines
- Maximum file length: 500 lines
- Extract complex logic into separate functions
- One responsibility per function

## Documentation
- JSDoc for all public functions
- Inline comments for complex logic
- README for each module

## Git Workflow
- Feature branch naming: feature/TICKET-123-description
- Commit message format: type(scope): message
- Squash commits before merging
```

**效果**：
所有团队成员使用`Copilot`生成代码时都会遵循相同的规范，确保代码一致性。

### 2. 语言和框架特定规范

**场景描述**：
项目使用多种编程语言和框架，每种都有其最佳实践。

**解决方案**：
为不同语言创建专门的指令文件：

**Python项目**（`.github/instructions/python.instructions.md`）：
```markdown
---
applyTo: "**/*.py"
---

# Python Standards

- Use Python 3.10+ features
- Follow PEP 8 style guide
- Use type hints everywhere
- Use dataclasses for data structures
- Prefer pathlib over os.path
- Use f-strings for formatting
- Handle exceptions explicitly
```

**React项目**（`.github/instructions/react.instructions.md`）：
```markdown
---
applyTo: "src/**/*.{tsx,jsx}"
---

# React Standards

- Use functional components only
- Implement proper error boundaries
- Use React Query for data fetching
- Memoize expensive computations
- Follow React Hooks rules
- Use TypeScript for props
- Implement accessibility features
```

**Go项目**（`.github/instructions/go.instructions.md`）：
```markdown
---
applyTo: "**/*.go"
---

# Go Standards

- Follow effective Go guidelines
- Use golangci-lint rules
- Handle all errors explicitly
- Use context for cancellation
- Prefer table-driven tests
- Document exported functions
- Use meaningful variable names
```

### 3. 安全和合规要求

**场景描述**：
项目有严格的安全和合规要求，需要确保`AI`生成的代码符合这些要求。

**解决方案**：
创建安全相关的指令：

```markdown
# Security Guidelines

## Authentication & Authorization
- Never hardcode credentials
- Use environment variables for secrets
- Implement proper session management
- Validate user permissions on every request

## Input Validation
- Validate all user inputs
- Sanitize data before database operations
- Use parameterized queries
- Escape output for XSS prevention

## Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Implement rate limiting
- Log security events

## Code Security
- No eval() or exec() usage
- Validate file paths to prevent traversal
- Use secure random number generators
- Keep dependencies updated

## Compliance
- Follow GDPR requirements
- Implement data retention policies
- Add audit logging for sensitive operations
- Document data processing activities
```

### 4. 测试驱动开发（TDD）

**场景描述**：
团队实施`TDD`，需要确保每个功能都有对应的测试。

**解决方案**：
创建测试相关的指令：

```markdown
# Testing Standards

## Unit Tests
- Write tests before implementation
- Use Arrange-Act-Assert pattern
- One assertion per test when possible
- Test edge cases and error scenarios
- Mock external dependencies

## Test Coverage
- Minimum 80% code coverage
- 100% coverage for critical paths
- Test both happy path and error cases

## Test Organization
- Mirror source code structure
- Use descriptive test names
- Group related tests in describe blocks
- Use beforeEach for common setup

## Integration Tests
- Test API endpoints end-to-end
- Use test database
- Clean up after each test
- Test authentication and authorization

## Best Practices
- Keep tests fast and isolated
- Use fixtures for test data
- Avoid testing implementation details
- Run tests in CI/CD pipeline
```

### 5. 文档自动生成

**场景描述**：
项目需要详细的文档，但手动维护文档很费时。

**解决方案**：
创建文档生成指令：

```markdown
# Documentation Guidelines

## Code Documentation
- Add JSDoc/docstring for all public APIs
- Include parameter types and descriptions
- Document return values and exceptions
- Provide usage examples

## API Documentation
- Document all endpoints
- Include request/response examples
- List all possible status codes
- Document authentication requirements

## README Updates
- Update README when adding features
- Include installation instructions
- Provide quick start guide
- List configuration options

## Architecture Documentation
- Document design decisions
- Create architecture diagrams
- Explain data flow
- Document integration points

## Format
- Use Markdown format
- Include code examples
- Link to related documentation
- Keep documentation up-to-date
```

### 6. 性能优化指导

**场景描述**：
应用有性能要求，需要确保生成的代码性能良好。

**解决方案**：
创建性能优化指令：

```markdown
# Performance Guidelines

## Database Operations
- Use indexes on frequently queried columns
- Avoid N+1 queries
- Use batch operations
- Implement pagination for large datasets
- Use connection pooling

## Frontend Performance
- Implement code splitting
- Lazy load components
- Optimize images
- Use CDN for static assets
- Minimize bundle size

## Caching
- Cache frequently accessed data
- Use Redis for session storage
- Implement HTTP caching headers
- Cache database query results

## Algorithms
- Use appropriate data structures
- Avoid nested loops when possible
- Implement efficient algorithms
- Profile before optimizing

## Monitoring
- Add performance metrics
- Log slow operations
- Set up alerts for performance issues
- Use APM tools
```

### 7. 微服务架构规范

**场景描述**：
项目采用微服务架构，需要统一服务间的交互规范。

**解决方案**：
创建微服务相关指令：

```markdown
# Microservices Guidelines

## Service Design
- Single responsibility per service
- Stateless services
- Use API gateway for routing
- Implement circuit breakers

## Communication
- Use REST for synchronous communication
- Use message queues for async communication
- Implement retry logic with exponential backoff
- Use correlation IDs for tracing

## Data Management
- Database per service pattern
- Use event sourcing for complex workflows
- Implement eventual consistency
- Handle distributed transactions carefully

## Observability
- Structured logging
- Distributed tracing
- Health check endpoints
- Metrics for each service

## Deployment
- Use containers (Docker)
- Implement blue-green deployment
- Use service mesh for networking
- Automate deployment with CI/CD
```

### 8. 代码审查自动化

**场景描述**：
代码审查耗时，需要`AI`帮助进行初步审查。

**解决方案**：
配置代码审查指令：

```json
{
  "github.copilot.chat.reviewSelection.instructions": [
    { "text": "Check for potential bugs and logic errors" },
    { "text": "Verify error handling is comprehensive" },
    { "text": "Ensure code follows team standards" },
    { "text": "Check for security vulnerabilities" },
    { "text": "Verify test coverage for changes" },
    { "text": "Look for performance issues" },
    { "text": "Ensure documentation is updated" },
    { "file": ".github/instructions/review-checklist.md" }
  ]
}
```

### 9. 多语言项目管理

**场景描述**：
项目包含前端、后端、移动端等多个技术栈。

**解决方案**：
为不同部分创建独立的指令文件：

```
.github/instructions/
├── frontend-react.instructions.md  (applyTo: "frontend/**")
├── backend-nodejs.instructions.md  (applyTo: "backend/**")
├── mobile-flutter.instructions.md  (applyTo: "mobile/**")
├── shared-testing.instructions.md  (applyTo: "**/*test*")
└── shared-docs.instructions.md     (applyTo: "docs/**")
```

或使用嵌套的`AGENTS.md`：

```
frontend/AGENTS.md   # 前端特定指令
backend/AGENTS.md    # 后端特定指令
mobile/AGENTS.md     # 移动端特定指令
```

### 10. 遗留代码重构

**场景描述**：
项目有大量遗留代码需要重构，但要保持兼容性。

**解决方案**：
创建重构指导指令：

```markdown
# Legacy Code Refactoring Guidelines

## Compatibility
- Maintain backward compatibility
- Add deprecation warnings before removing APIs
- Provide migration guides
- Keep old tests passing

## Incremental Refactoring
- Refactor in small, testable increments
- Add tests before refactoring
- Use strangler fig pattern
- Keep the system working at all times

## Code Modernization
- Update to modern language features
- Replace deprecated libraries
- Improve error handling
- Add type annotations

## Documentation
- Document refactoring decisions
- Explain breaking changes
- Update architecture diagrams
- Create before/after comparisons

## Quality Assurance
- Run full test suite
- Perform manual testing
- Check performance impact
- Review with team before merging
```

### 11. 开源项目贡献

**场景描述**：
参与开源项目，需要遵循项目的贡献指南。

**解决方案**：
为开源项目创建专门的指令：

```markdown
# Open Source Contribution Guidelines

## Code Standards
- Follow the project's existing style
- Read CONTRIBUTING.md before starting
- Check existing issues and PRs
- Discuss major changes in issues first

## Commit Guidelines
- Write clear, descriptive commit messages
- Reference issue numbers in commits
- Keep commits atomic and focused
- Sign commits if required

## Pull Requests
- Fill out PR template completely
- Include tests for new features
- Update documentation
- Respond to review comments promptly

## Communication
- Be respectful and professional
- Follow code of conduct
- Ask questions when unclear
- Thank reviewers for their time

## Licensing
- Ensure code is compatible with project license
- Add copyright headers if required
- Don't include proprietary code
- Document third-party dependencies
```

### 12. AI辅助学习

**场景描述**：
学习新技术或框架，希望`AI`在学习过程中提供指导。

**解决方案**：
创建学习辅助指令：

```markdown
# Learning Mode Instructions

## Teaching Style
- Explain concepts before showing code
- Provide step-by-step explanations
- Include comments explaining each part
- Reference official documentation
- Suggest additional learning resources

## Code Examples
- Start with simple examples
- Gradually increase complexity
- Show multiple approaches
- Explain pros and cons of each approach
- Include common pitfalls to avoid

## Best Practices
- Explain why certain patterns are used
- Show both good and bad examples
- Discuss design trade-offs
- Suggest improvements to my code
- Point out learning opportunities

## Resources
- Link to official docs
- Suggest relevant tutorials
- Recommend books and courses
- Point to GitHub examples
- Share community best practices
```

## 参考资源

- [VS Code官方文档：Custom Instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [GitHub Copilot文档](https://docs.github.com/en/copilot)
- [Awesome Copilot社区示例](https://github.com/github/awesome-copilot)
- [VS Code Copilot设置参考](https://code.visualstudio.com/docs/copilot/copilot-settings)
- [Model Context Protocol (MCP)](https://modelcontextprotocol.io/)
