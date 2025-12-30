---
trigger: always_on
slug: project-governance
---
# プロジェクトガバナンス (Project Governance)

GA-Workspace配下のすべてのプロジェクトは、以下のガバナンス規則に従うこと。

## ゴールデントライアングル構成

堅牢なエージェント制御環境は、以下の3要素で構成される：

```
        stack.md
           △
          / \
         /   \
        /     \
   ops.md ─── Core Workflows
```

1. **Tech Stack Rule (`stack.md`)**: `always_on` トリガー
   - 言語、フレームワーク、バージョンを定義
   - エージェントが古い構文や非互換なライブラリを使用することを防ぐ

2. **Operational Rule (`ops.md`)**: `model_decision` トリガー
   - ビルド、テスト、デプロイの手順を定義
   - 「`pnpm test`を使用せよ」などの運用コマンド

3. **Core Workflows**: 頻繁に発生するタスクに対応（3〜5個）
   - 機能追加 (`/create-feature`)
   - バグ修正 (`/bug-fix`)
   - コードレビュー (`/code-review`)
   - デプロイ (`/deploy-staging`)

## 必須構成

すべてのプロジェクトは `ZG_PROJECT/<プロジェクト名>/.agent/` ディレクトリに以下を含むこと：

### 必須ルール（ゴールデントライアングル）
| ファイル | トリガー | 目的 |
|----------|----------|------|
| `00-ga-workspace-definition.md` | always_on | GA-Workspaceの定義と設計原則 |
| `01-stack.md` | always_on | 技術スタック定義 |
| `02-security-mandates.md` | always_on | セキュリティ基準 |
| `10-ops.md` | model_decision | 運用手順 |

### 推奨ルール
| ファイル | トリガー | 目的 |
|----------|----------|------|
| `11-type-safety.md` | always_on | 型安全性基準 |
| `12-code-style.md` | always_on | コーディングスタイル |
| `20-react-components.md` | glob (`**/*.tsx`) | React固有ルール |
| `30-api-design.md` | model_decision | API設計基準 |

### 必須ワークフロー（メタ）
| ファイル | コマンド | 目的 |
|----------|----------|------|
| `create-rule.md` | `/create-rule` | ルール作成 |
| `create-workflow.md` | `/create-workflow` | ワークフロー作成 |

## 再帰的合成の原則

### ワークフローの階層構造
```
Level 0: 原子ワークフロー（単一の操作）
  └── /lint-check, /type-check, /run-tests

Level 1: 合成ワークフロー（原子の組み合わせ）
  └── /verify-code = /lint-check + /type-check + /run-tests

Level 2: 高次ワークフロー（合成の組み合わせ）
  └── /create-feature = 設計 + 実装 + /verify-code + コミット

Level 3: オーケストレーション（複数の高次を統合）
  └── /release = /create-feature + /deploy-staging + 承認 + /deploy-production
```

### 呼び出し規則
- 子ワークフローは `/command-name` 形式で呼び出す
- 呼び出し時は必要なパラメータを明示する
- 子の失敗時の挙動（続行/中断）を明記する

## Environment Engineering（環境エンジニアリング）

GA-Workspaceの能力を最大限に引き出すためには、単なるプロンプトエンジニアリングではなく、**開発環境自体を設計する** アプローチが必要である。

### 暗黙知のコード化
`ZG_PROJECT/<プロジェクト名>/.agent` フォルダは単なる設定ディレクトリではなく、**チームの運用知能のリポジトリ** となる。

| 暗黙知 | コード化先 |
|--------|------------|
| コードレビューの観点 | `code-review.md` ルール |
| デプロイ手順 | `deploy-staging.md` ワークフロー |
| 新人オンボーディング | `setup-dev-environment.md` ワークフロー |
| セキュリティチェック項目 | `security-mandates.md` ルール |

### Workflowが「前進」、Rulesが「品質」を担保
- **Workflow**: タスクを前に進める（Progress）
- **Rules**: 品質を担保する（Quality）

```
Workflowの指示: 「ユーザークラスを新規作成せよ」
Rulesの制約: 「すべてのクラスはイミュータブルなデータクラスでなければならない」
結果: エージェントは @dataclass(frozen=True) を付与したクラスを生成する
```

## 運用規則

### 新規プロジェクト作成時
1. `/setup-ga-workspace` を実行してGA-Workspace構造を初期化
2. `stack.md` をプロジェクトに合わせてカスタマイズ
3. ゴールデントライアングルの3要素を整備

### ルール・ワークフロー追加時
1. `/create-rule` または `/create-workflow` を使用
2. 既存との重複・矛盾がないか確認
3. 再利用可能なら共通化を検討
4. 番号プレフィックスで優先順位を明示

### 定期メンテナンス
1. `/health-check` で設定の健全性を確認
2. 使用されていないルール・ワークフローを整理
3. 新しいベストプラクティスを反映
4. チームの暗黙知を継続的にコード化
