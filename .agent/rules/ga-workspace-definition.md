---
trigger: always_on
slug: ga-workspace-definition
---
# GA-Workspace 定義 (GA-Workspace Definition)

## GA-Workspace とは

**GA-Workspace** は、Google Antigravity（GA）環境におけるエージェント制御のための標準設定フレームワークである。

```
GA-Workspace = Rules + Workflows
```

- **Rules（ルール）**: エージェントの「憲法」。永続的な制約と行動指針を宣言的に定義する。
- **Workflows（ワークフロー）**: エージェントの「標準作業手順書（SOP）」。タスク実行の手順を命令的に記述する。

これらはAgent Manager（Mission Control）によって動的に統合され、**複合コンテキスト（Composite Context）** として構築される：

$$C_{total} = C_{system} + C_{rules} + C_{workflow} + C_{history}$$

## 再帰的定義

このGA-Workspace自体が **「GA-Workspaceを作成するためのGA-Workspace」** である。

```
GA-Workspace (Meta)
├── Rules: ルール作成のガイドライン
├── Workflows: ルール・ワークフローを作成するワークフロー
└── Output: 新しいGA-Workspace
```

つまり、このフレームワークを使って：
1. 新規プロジェクト用のGA-Workspaceを生成できる
2. 既存プロジェクトにGA-Workspaceを追加できる
3. GA-Workspace自体を拡張・改善できる

## ディレクトリ構造

GA-Workspaceは `ZG_PROJECT/<プロジェクト名>/` 配下に構築される：

```
ZG_PROJECT/
├── my-web-app/                     # プロジェクト1
│   └── .agent/
│       ├── rules/
│       │   ├── 00-ga-workspace-definition.md
│       │   ├── 01-stack.md
│       │   ├── 02-security-mandates.md
│       │   └── ...
│       └── workflows/
│           ├── create-rule.md
│           ├── create-workflow.md
│           └── ...
├── api-server/                     # プロジェクト2
│   └── .agent/
│       └── ...
└── mobile-client/                  # プロジェクト3
    └── .agent/
        └── ...
```

### ファイル命名規則
- **番号プレフィックス**: `00-`, `10-`, `20-` で優先順位と分類を明示
- **ケバブケース**: `type-safety.md`, `api-design.md`
- **サブディレクトリ**: 関連するルールをグループ化（例: `frontend/`）

## ルールの優先順位

競合するルールが存在する場合、以下の順序で優先される：

```
ユーザーの直接指示（最高）
    ↓
Workflow内の指示
    ↓
フォルダ固有Rules（例: frontend/react-components.md）
    ↓
ワークスペースRules（.agent/rules/*.md）
    ↓
グローバルRules（~/.gemini/GEMINI.md）（最低）
```

**例外**: 禁止事項（`eval()禁止`など）は安全性の観点から常に優先される。

## 4つのトリガータイプ

| トリガー | 構文 | 動作 | 用途 |
|----------|------|------|------|
| **Always On** | `trigger: always_on` | 常にコンテキストに注入 | アーキテクチャ原則、セキュリティ基準 |
| **Model Decision** | `trigger: model_decision` | 意図に基づいて自動選択 | リファクタリング、パフォーマンス改善 |
| **Glob Pattern** | `trigger: glob` + `globs: ["**/*.tsx"]` | ファイルパターンでマッチ | 言語/フレームワーク固有ルール |
| **Manual** | `trigger: manual` | `@rule-name` で明示的に呼び出し | DBマイグレーション、監査 |

## 設計原則

### 1. 再帰的合成 (Recursive Composition)
- 大きなワークフローは小さなワークフローの組み合わせで構成する
- `/comprehensive-check` → `/lint-check` + `/run-tests` + `/security-scan`
- 共通処理は独立したワークフローとして切り出し、再利用する

### 2. 並列実行 (Parallelism)
- 独立したタスクは複数のサブエージェントで並列処理可能
- メインエージェントが「オーケストレーター」として監督
- 例: 「iOSアプリの修正」と「Androidアプリの修正」を同時実行

### 3. 単一責任 (Single Responsibility)
- 1ルール = 1つの関心事
- 1ワークフロー = 1つの目的
- 複数の責務が混在したら分割する

### 4. 段階的自動化 (Progressive Automation)
- 安全な操作 → `// turbo` で自動実行
- 全ステップ自動 → `// turbo-all` でワークフロー全体を自動実行
- 破壊的操作 → ユーザー承認を必須とする

### 5. 自己文書化 (Self-Documenting)
- ルール・ワークフローのファイル自体がドキュメントとなる
- description フィールドで目的を明示する
- コメントで「なぜ」を説明する

## リファレンス機能

`@` 記法で他のルールファイルを参照できる：

```markdown
# バックエンド開発基準

このルールは以下のサブルールを包含する：

@rules/api-design.md
@rules/database-naming.md
@rules/error-handling.md
```

これにより、ルールのモジュール化と重複管理の防止が可能。
