---
trigger: always_on
slug: project-governance
inheritance: core
scope: global
---
# プロジェクトガバナンス (Project Governance)

本ドキュメントは、プロジェクト構造の健全性とガバナンスモデルを定義する。

## 1. ゴールデントライアングル構成 (Golden Triangle)

プロジェクトの自律走行を保証するための3要素。

```
        stack.md
           △
          / \
         /   \
        /     \
   ops.md ─── Core Workflows
```

1. **Tech Stack Rule (`stack.md`)**: 技術スタック定義
   - 言語、フレームワーク、バージョン
   - プロジェクトの一貫性を保つための技術的制約

2. **Operational Rule (`ops.md`)**: 運用手順定義
   - ビルド、テスト、デプロイの手順
   - 実行可能なコマンドリファレンス

3. **Core Workflows**: 基本業務フロー
   - 機能追加 (`/create-feature`)
   - バグ修正 (`/bug-fix`)
   - コードレビュー (`/code-review`)
   - デプロイ (`/deploy-staging`)

---

## 2. ディレクトリ構成要件

`ZG_PROJECT/<プロジェクト名>/.agent/` 配下にGA-Workspace構成を配置する。

### 必須ルール（基盤）
| ファイル | トリガー | 役割 |
|----------|----------|----------|
| `00-definition.md` | always_on | システム定義 |
| `02-security.md` | always_on | セキュリティ義務 |
| `16-ops.md` | model_decision | 運用手順 |
| `53-stack-template.md` | always_on | 技術スタック（テンプレート） |

### 推奨ルール（品質）
| ファイル | トリガー | 役割 |
|----------|----------|----------|
| `35-type-safety.md` | always_on | 型安全性基準 |
| `32-japanese-rules.md` | always_on | 言語設定 |
| `60-react-components.md` | glob (`**/*.tsx`) | コンポーネント設計基準 |

### 必須ワークフロー（メタ操作）
| ファイル | コマンド | 役割 |
|----------|----------|----------|
| `create-rule.md` | `/create-rule` | 新規ルール作成 |
| `create-workflow.md` | `/create-workflow` | 新規ワークフロー作成 |

---

## 3. 再帰的合成の原則 (Recursive Composition)

ワークフローは階層的に構成される。

```
Level 0: 原子ワークフロー (Atomic Units)
  └── /lint-check, /type-check, /run-tests

Level 1: 合成ワークフロー (Composite Flows)
  └── /verify-code = /lint-check + /type-check + /run-tests

Level 2: 高次ワークフロー (High-level Flows)
  └── /create-feature = Design + Implement + /verify-code + Commit

Level 3: オーケストレーション (Orchestration)
  └── /release = /create-feature + /deploy-staging + Approval + /deploy-production
```

### 呼び出し規則
- 子ワークフローは `/command-name` で呼び出す。
- 必要なパラメータを明示的に渡すこと。
- 失敗時のフォールバック処理を考慮すること。

---

## 4. 環境エンジニアリング (Environment Engineering)

暗黙知をルール化し、環境自体を設計する。

### 暗黙知のコード化
プロジェクト固有のノウハウは、`Rules` および `Workflows` として実装する。

| 知見の種類 | 実装先 |
|------------|------------|
| コードレビュー基準 | `code-review.md` ルール |
| デプロイ手順 | `deploy-staging.md` ワークフロー |
| 環境構築手順 | `setup-dev-environment.md` ワークフロー |
| セキュリティ基準 | `security-mandates.md` ルール |

### WorkflowとRulesの関係

- **Workflow (Procedure)**: 「何をするか」を指示する（推進力）
- **Rules (Policy)**: 「どうあるべきか」を制約する（統制力）

```
Example:
Workflow: "Create User class" (Action)
Rules: "Immutable by default" (Constraint)
Result: @dataclass(frozen=True) class User...
```

---

## 5. 運用サイクル

### 新規プロジェクト作成時
1. `/setup-ga-workspace` を実行。
2. `stack.md` をプロジェクト要件に合わせて更新。
3. ゴールデントライアングル（Stack, Ops, Workflows）を整備。

### ルール・ワークフロー追加時
1. `/create-rule` または `/create-workflow` を使用。
2. 既存定義との重複を確認。
3. 可能であれば汎用化し、再利用性を高める。
4. 番号プレフィックスで優先順位を明確化。

### 定期メンテナンス
1. `/health-check` で構成の健全性を確認。
2. 未使用の定義を削除またはアーカイブ。
3. 発見された暗黙知を即座にコード化。

---

> [!TIP]
> 構成に迷った場合は `/health-check` を実行し、不足している要素を確認すること。
