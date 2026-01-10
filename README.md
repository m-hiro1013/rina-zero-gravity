<div align="center">

![ZERO_GRAVITY](assets/zero_gravity_header_b.png)

# ZERO_GRAVITY

[![GA-Workspace](https://img.shields.io/badge/GA--Workspace-Enabled-blueviolet?style=for-the-badge&logo=google)](https://github.com/Sunwood-ai-labs/ZERO_GRAVITY)
[![Agentic](https://img.shields.io/badge/Agentic-Mode_Active-success?style=for-the-badge)](https://github.com/Sunwood-ai-labs/YOROZU)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

</div>

## Overview

**ZERO_GRAVITY** は、**GA-Workspace** (Google Antigravity Workspace) のメタフレームワーク・リポジトリです。
本プロジェクトは、従来の開発プロセスの制約（重力）から解放された、新しい開発体験を提供するための実験的プラットフォームであり、次世代のエージェント駆動型開発の基盤となります。

本ワークスペースは、**49以上の定義ファイル** から構成される高度なガバナンスモデルを内包しており、以下の「ゴールデントライアングル」を中心に自律的なプロジェクト運営を実現します：

1.  **Tech Stack Rule (`stack.md`)**: 技術選定の標準化
2.  **Operational Rule (`ops.md`)**: 運用プロセスの規定
3.  **Core Workflows**: 開発サイクルの自動化

## Features

GA-Workspaceは以下の原則に基づいて設計されています：

- **Recursive Composition (再帰的合成)**: ルールとワークフローの階層的な組み合わせにより、複雑なタスクを効率的に解決します。
- **Rule-based Governance (ルール駆動ガバナンス)**: `.agent/rules` に定義されたポリシーに従い、エージェントが自律的に判断・行動します。
- **Automated Workflows (ワークフロー自動化)**: `.agent/workflows` に定義された手順書に基づき、開発サイクル全体を自動化します。

## Included Capabilities

本リポジトリには、以下のルールとワークフローが事前設定されています。

### Rules (Governance)
| Category | Files |
|----------|-------|
| **Meta** | `ga-workspace-definition`, `project-governance`, `meta-rule-creation` |
| **System** | `stack`, `security-mandates`, `ops` |
| **Development** | `type-safety`, `react-components`, `testing-standards` |
| **Persona** | `character-rules-seira`, `japanese-rules` |

### Workflows (Automation)
| Category | Workflows |
|----------|-----------|
| **Setup & Core** | `/setup-ga-workspace`, `/create-repo-from-folder`, `/manage-agent-config` |
| **Development** | `/create-feature`, `/bug-fix`, `/refactor-legacy`, `/build-app-simple` |
| **Quality** | `/verify-code`, `/lint-check`, `/type-check`, `/run-tests`, `/security-scan` |
| **Release** | `/create-release`, `/git-auto-commit`, `/generate-header-image` |
| **Helper** | `/create-rule`, `/create-workflow`, `/generate-readme`, `/generate-unit-tests` |

## Directory Structure

```mermaid
graph TD
    Root[ZERO_GRAVITY] --> Agent[.agent]
    Root --> Assets[assets]
    Root --> Projects[ZG_PROJECT]
    
    Agent --> Rules[rules]
    Agent --> Workflows[workflows]
    Agent --> Templates[templates]
```

### Governance Structure (.agent)

```plaintext
.agent
├── rules/                      # Agent Constitution
│   ├── 00-ga-workspace-definition.md
│   ├── 01-project-governance.md
│   ├── 02-stack.md
│   ├── 03-security-mandates.md
│   ├── 10-character-rules-seira.md
│   ├── ... (Total 20 rules)
├── workflows/                  # Standard Operating Procedures
│   ├── setup-ga-workspace.md
│   ├── git-auto-commit.md
│   ├── create-release.md
│   ├── verify-code.md
│   ├── ... (Total 27 workflows)
└── templates/                  # Artifact Templates
    └── release_notes_template.md
```

## Getting Started

このリポジトリは、新しいGA-Workspaceプロジェクトの **Source (雛形)** として機能します。

### 1. 新規プロジェクトの作成

```bash
# Agentワークフローによる初期化
/setup-ga-workspace
```

### 2. 既存プロジェクトのGA-Workspace化

```bash
# 対象ディレクトリの変換
/create-repo-from-folder
```

### 3. 環境の拡張

```bash
# 新規ルールの策定
/create-rule

# 新規ワークフローの定義
/create-workflow
```

## 🎨 Showcase: こんなプロジェクトが作れるよ！

ZERO_GRAVITYで作成されたプロジェクトの事例です。

| Project | Description | Link |
|---------|-------------|------|
| **🎬 vidu-mv-creator** | Suno V5 × Vidu Q2 でミュージックビデオを一気通貫制作するワークスペース | [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/Sunwood-ai-labs/vidu-mv-creator) |
| **📚 WRITING_WORKSPACE** | 執筆・コンテンツ制作に特化したGA-Workspaceテンプレート | *準備中* |
| **🛰️ YOROZU** | エージェント主導開発（ADE）の究極のワークスペース。厳格なガバナンスの礎。 | [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github)](https://github.com/Sunwood-ai-labs/YOROZU) |

> [!TIP]
> `/setup-ga-workspace` を実行すれば、あなただけの GA-Workspace プロジェクトをすぐに始められるよ。

---

<p align="center">
  Generated by <b>ZERO_GRAVITY</b>
</p>
