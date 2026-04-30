---
slug: "/ai/ai-coding-tools-memory-files-and-skills"
title: "主流AI Coding工具记忆文件与Skills路径指南"
hide_title: true
keywords:
  [
    "AI Coding工具",
    "记忆文件",
    "CLAUDE.md",
    "AGENTS.md",
    "GEMINI.md",
    "Claude Code",
    "Codex CLI",
    "GitHub Copilot",
    "Cursor",
    "Windsurf",
    "Gemini CLI",
    "Aider",
    "Cline",
    "Continue",
    "Roo Code",
    "OpenCode",
    "Agent Skills",
    "项目上下文",
    "AI编程助手",
    "copilot-instructions.md",
    "cursorrules",
    "windsurfrules",
    "SKILL.md",
    "AI工具配置"
  ]
description: "全面梳理主流AI Coding工具（Claude Code、Codex CLI、GitHub Copilot、Cursor、Windsurf、Gemini CLI、Aider、Cline、Continue、Roo Code等）的上下文记忆文件路径与Agent Skills文件存放规范，帮助开发者快速掌握各工具的项目级、用户级记忆文件配置方式，以及如何利用vercel-labs/skills实现跨工具的Skills管理与复用，提升AI辅助编程效率。"
toc_max_heading_level: 2
---

## 上下文记忆文件对比

不同工具对项目记忆文件的命名、路径及加载机制有所差异，部分工具（如`GitHub Copilot`、`Cursor`）会同时识别其他工具的标准文件（如`AGENTS.md`、`CLAUDE.md`），以提升跨工具兼容性。

| 工具 | 项目级记忆文件 | 用户级记忆文件 | 备注 |
|---|---|---|---|
| **Claude Code** | `CLAUDE.md` | `~/.claude/CLAUDE.md` | 支持`.claude/rules/`路径规则；自动记忆存于`~/.claude/projects/<project>/memory/` |
| **Codex CLI** | `AGENTS.md` | — | 支持嵌套目录，最近的`AGENTS.md`优先生效 |
| **OpenCode** | `AGENTS.md` | — | 遵循`AGENTS.md`规范 |
| **GitHub Copilot** | `.github/copilot-instructions.md`（仓库全局）<br/>`.github/instructions/NAME.instructions.md`（路径专属） | — | 同时支持读取`AGENTS.md`、`CLAUDE.md`、`GEMINI.md` |
| **Cursor** | `.cursor/rules/`（项目规则目录，`.md`/`.mdc`文件） | `Cursor Settings` → `Rules`（全局用户规则） | 支持`AGENTS.md`作为简单替代方案；企业版支持团队规则 |
| **Windsurf** | `.windsurfrules`（项目规则文件） | `~/.codeium/windsurf/memories/`（`Cascade`自动记忆） | 同时支持全局规则（通过UI配置） |
| **Gemini CLI** | `GEMINI.md`（项目根目录） | `~/.gemini/settings.json` | 支持`.gemini/GEMINI.md`路径 |
| **Aider** | `CONVENTIONS.md`（自定义，通过`--read`加载） | `~/.aider.conf.yml` | 无固定文件名，通过配置文件指定 |
| **Cline** | `.clinerules`（项目规则文件） | `~/.clinerules`（全局规则，`v3.10+`） | `VS Code`扩展形式 |
| **Continue** | `.continue/config.yaml` / `.continue/config.json` | `~/.continue/config.yaml` | 配置文件兼具模型、提示词、规则等配置 |
| **Roo Code** | `.roorules`（项目规则文件） | — | `VS Code`扩展形式 |

> **关于`AGENTS.md`的兼容性说明**：`AGENTS.md`是由社区推动的跨工具记忆文件规范（参见 [agentsmd/agents.md](https://github.com/agentsmd/agents.md)）。`Codex CLI`、`GitHub Copilot`、`Cursor`、`OpenCode`等工具均支持读取该文件。

## Agent Skills路径对比

`Agent Skills`是存放在特定目录下的`SKILL.md`文件集合，工具启动时会自动加载。

| 工具 | 项目级Skills路径 | 全局Skills路径 |
|---|---|---|
| `Claude Code` | `.claude/skills/` | `~/.claude/skills/` |
| `Codex` | `.agents/skills/` | `~/.codex/skills/` |
| `OpenCode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| `GitHub Copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| `Cursor` | `.agents/skills/` | `~/.cursor/skills/` |
| `Windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| `Gemini CLI` | `.agents/skills/` | `~/.gemini/skills/` |
| `Aider (AiderDesk)` | `.aider-desk/skills/` | `~/.aider-desk/skills/` |
| `Cline` | `.agents/skills/` | `~/.agents/skills/` |
| `Continue` | `.continue/skills/` | `~/.continue/skills/` |
| `Roo Code` | `.roo/skills/` | `~/.roo/skills/` |
| `Amp` | `.agents/skills/` | `~/.config/agents/skills/` |
| `Augment` | `.augment/skills/` | `~/.augment/skills/` |
| `Warp` | `.agents/skills/` | `~/.agents/skills/` |
