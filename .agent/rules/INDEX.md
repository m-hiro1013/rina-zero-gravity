# 📜 Rules INDEX

> **目次ファースト**: ルールにアクセスする前に、まずここを見る

---

## 🔍 クイックリファレンス

| 番号帯 | カテゴリ | 説明 |
|--------|---------|------|
| 00-09 | **基盤** | GA-Workspace定義、ガバナンス |
| 10-19 | **キャラ・運用** | ペルソナ、コマンド、言語設定 |
| 20-29 | **開発プロセス** | ライフサイクル、型安全、進捗管理 |
| 30-39 | **メタ** | ルール・ワークフロー作成 |
| 40-49 | **アーキテクチャ** | MAA、エージェント設計 |

---

## 📋 全ルール一覧

### 00-09: 基盤ルール（常時適用）

| ファイル | トリガー | 概要 |
|---------|---------|------|
| `00-index-first.md` | always_on | 🆕 目次ファースト原則 |
| `00-ga-workspace-definition.md` | always_on | GA-Workspaceの定義、哲学 |
| `01-project-governance.md` | always_on | プロジェクト統治、ゴールデントライアングル |
| `01-stack-python.md` | model_decision | Python系プロジェクト用スタック |
| `01-stack-simple.md` | model_decision | シンプルサイト用スタック |
| `01-stack-web.md` | model_decision | Webアプリ用スタック |
| `02-stack.md` | always_on | 技術スタック（テンプレート） |
| `03-security-mandates.md` | always_on | セキュリティ必須事項 |
| `05-process-governance.md` | always_on | 自動化vs手動介入の判断基準 |

### 10-19: キャラクター・運用ルール

| ファイル | トリガー | 概要 |
|---------|---------|------|
| `10-character-rules-rina.md` | always_on | りなちーのペルソナ |
| `10-character-rules-seira.md` | always_on | 星来のペルソナ |
| `11-command-rules.md` | always_on | コマンド実行ルール（1つずつ） |
| `12-japanese-rules.md` | always_on | 日本語での応答・思考 |
| `13-user-profile-rules.md` | always_on | ユーザー情報（GitHub等） |
| `14-ops.md` | model_decision | ビルド・テスト・デプロイ運用 |
| `15-code-review.md` | model_decision | コードレビュー基準 |
| `16-documentation.md` | model_decision | ドキュメント作成基準 |
| `17-git-workflow.md` | model_decision | Git操作・ブランチ戦略 |
| `18-testing-standards.md` | model_decision | テスト戦略・カバレッジ |

### 20-29: 開発プロセスルール

| ファイル | トリガー | 概要 |
|---------|---------|------|
| `20-project-lifecycle.md` | always_on | プロジェクトフェーズ定義 |
| `20-repo-creation.md` | model_decision | リポジトリ作成ルール |
| `21-type-safety.md` | always_on | 型安全性基準 |
| `22-react-components.md` | glob (`**/*.tsx`) | Reactコンポーネント設計 |
| `25-tech-selector.md` | model_decision | 技術選定ガイド |
| `26-template-definitions.md` | model_decision | プロジェクトテンプレート |
| `27-progress-management.md` | always_on | 進捗管理（prompt/方式） |

### 30-39: メタルール（ルール・ワークフロー作成）

| ファイル | トリガー | 概要 |
|---------|---------|------|
| `30-meta-rule-creation.md` | model_decision | ルール作成ガイド |
| `31-meta-workflow-creation.md` | model_decision | ワークフロー作成ガイド |
| `32-rule-templates.md` | model_decision | ルールテンプレート |
| `33-workflow-templates.md` | model_decision | ワークフローテンプレート |

### 40-49: アーキテクチャルール

| ファイル | トリガー | 概要 |
|---------|---------|------|
| `40-micro-agent-architecture.md` | model_decision | MAA設計、Core/Work Agents |

### 50-59: 最上位レイヤー（Orchestrator制御）✅ COMPLETE

| ファイル | トリガー | 概要 |
|---------|---------|------|
| `50-commit-patterns.md` | always_on | ✅ Commitパターン分類（4パターン） |
| `51-phase-definitions.md` | always_on | ✅ フェーズ定義（初期/反復） |
| `52-agent-assignment.md` | always_on | ✅ フェーズ×エージェント割り当て |
| `53-user-checkpoint.md` | always_on | ✅ ユーザー確認条件 |

---

## 🔥 重要度別クイックガイド

### 必ず適用（always_on）
- `00-index-first.md` - 🆕 目次ファースト原則
- `00-ga-workspace-definition.md` - GA-Workspaceの基本
- `03-security-mandates.md` - セキュリティは絶対
- `10-character-rules-rina.md` - りなちーとして話す
- `12-japanese-rules.md` - 日本語で思考・応答

### 状況に応じて適用（model_decision）
- `01-stack-*.md` - プロジェクトタイプに応じて
- `14-ops.md` - 運用関連の作業時
- `15-code-review.md` - レビュー時
- `40-micro-agent-architecture.md` - エージェント設計時

### ファイルパターンで適用（glob）
- `22-react-components.md` - `**/*.tsx` を編集時

---

## 🔄 ルール追加時の更新

新しいルールを追加したら、このINDEXも更新すること！

```markdown
| `XX-new-rule.md` | トリガー | 概要 |
```

---

## 📊 統計

- **総ルール数**: 31
- **always_on**: 13
- **model_decision**: 16
- **glob**: 1
- **manual**: 1
