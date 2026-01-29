---
trigger: always_on
slug: rules-index
inheritance: core
scope: project_local
---
# 📜 Rules INDEX

> **目次ファースト**: ルールにアクセスする前に、まずここを見る。
> マスターの英知を継承し、プロジェクトが自立するための羅針盤。

---

## 🏛 階層レイヤー構造（Layered Hierarchy）

GA-Workspaceのルールは、その影響力と継承性に基づいて階層化されているよ！

| レイヤー | カテゴリ | 番号帯 | 継承性 | 説明 |
| :--- | :--- | :--- | :--- | :--- |
| **Layer 1** | **Soul** | 00-09 | **絶対継承 (Essential)** | 親と子は一蓮托生。哲学、人格、セキュリティ。 |
| **Layer 2** | **Engine** | 10-29 | **自立筋肉 (Muscle)** | 子供が自力で動くためのプロセスとワークフロー。 |
| **Layer 3** | **Standard** | 30-49 | **品質保証 (Quality)** | 一人立ちした時のための共通基準、言語設定。 |
| **Layer 4** | **Library** | 50-69 | **選抜継承 (Selective)** | 必要な知恵だけをコピーする技術スタック群。 |
| **Layer 5** | **Growth** | 70-89 | **共進化 (Feedback)** | 現場の経験を親に報告し、共に強くなる仕組み。 |
| **Layer 6** | **Integrity** | 90-99 | **整合性 (Trust)** | 目次、更新ルール、健康診断。 |

---

## 📋 全ルール一覧

### 🧬 Layer 1: Soul (00-09) — 基盤・哲学
| ファイル | 概要 | Inheritance |
|:---|:---|:---|
| `00-definition.md` | GA-Workspace定義、ブートストラップ | core |
| `01-governance.md` | プロジェクト統治、ゴールデントライアングル | core |
| `02-security.md` | セキュリティ必須事項（絶対遵守！） | core |
| `03-process-governance.md` | 自動化vs手動介入、エスカレーション手順 | core |
| `04-maa.md` | Micro-Agent Architecture、エージェント設計 | core |
| `05-dependencies.md` | 依存関係管理、再帰的タスク処理 | core |
| `06-character-rina.md` | りなちーの人格、キャラクター義務 | core |

### ⚙️ Layer 2: Engine (10-29) — 実行プロセス
| ファイル | 概要 | Inheritance |
|:---|:---|:---|
| `10-lifecycle.md` | マクロ・ライフサイクル定義（Phase 0-4） | core |
| `11-phase-definitions.md` | ミクロ・ユニットフェーズ定義（Action Units） | core |
| `12-agent-assignment.md` | フェーズ×エージェント割り当て、引き継ぎ | core |
| `13-progress-management.md` | 進捗管理（prompt/方式）、セーブデータ | core |
| `14-commit-patterns.md` | Commitパターン分類とワークフロー選定 | core |
| `15-user-checkpoint.md` | ユーザー確認条件と合意形成 | core |
| `16-ops.md` | ビルド・テスト・デプロイ運用 | selective |
| `17-git-workflow.md` | Git操作、コミット・ブランチ戦略 | core |
| `18-repo-creation.md` | 新規リポジトリ作成ルール | selective |

### 💎 Layer 3: Standard (30-49) — 標準基準
| ファイル | 概要 | Inheritance |
|:---|:---|:---|
| `30-index-first.md` | 目次ファースト原則の徹底 | core |
| `31-command-rules.md` | コマンド実行ルール（1つずつ、cd明示） | core |
| `32-japanese-rules.md` | 日本語での応答・思考、専門用語の砕き | core |
| `33-user-profile.md` | ユーザー情報（GitHubアカウント等） | core |
| `34-coding-safety.md` | シンボル整合性、バーチャルデバッグ | core |
| `35-type-safety.md` | 型安全性基準、any禁止、Strict Mode | core |
| `36-refactoring-policy.md` | 機能等価性維持、リファクタリングの鉄則 | core |
| `37-code-review.md` | コードレビュー基準、品質チェック | core |
| `38-documentation.md` | README、API仕様書、ドキュメント基準 | core |
| `39-testing-standards.md` | テスト戦略、カバレッジ、エッジケース | core |

### 📚 Layer 4: Library (50-69) — 技術選定
| ファイル | 概要 | Inheritance |
|:---|:---|:---|
| `50-stack-web.md` | Webアプリ用スタック (Next.js) | selective |
| `51-stack-python.md` | Python用スタック (FastAPI/Streamlit) | selective |
| `52-stack-simple.md` | シンプルサイト用スタック (HTML/JS) | selective |
| `53-stack-template.md` | 技術スタック（テンプレート） | template |
| `54-tech-selector.md` | 技術選定ガイドライン | selective |
| `55-template-definitions.md` | プロジェクトテンプレート定義 | selective |
| `60-react-components.md` | Reactコンポーネント設計基準 (`**/*.tsx`) | selective |

### 🌱 Layer 5: Growth (70-89) — 自己成長・メタ
| ファイル | 概要 | Inheritance |
|:---|:---|:---|
| `70-mistake-reflection.md` | ミス・失敗時の反省プロトコル | core |
| `71-self-growth.md` | 自己成長、エージェント作成ワークフロー | core |
| `80-rule-creation.md` | 新規ルール作成ガイドライン | selective |
| `81-workflow-creation.md` | ワークフロー作成ガイドライン | selective |
| `82-rule-templates.md` | ルールの書き方テンプレート | selective |
| `83-workflow-templates.md` | ワークフローの書き方テンプレート | selective |

### 🛡️ Layer 6: Integrity (90-99) — 整合性管理
| ファイル | 概要 | Inheritance |
|:---|:---|:---|
| `90-index-update.md` | INDEX更新ルール、CRUDの作法 | core |
| `99-index.md` | このファイル（神の目次） | core |

---

## 👑 優先順位ルール (CSS Override Policy)

もしルールが競合したら、この順番で判断するよ！

1.  **ひろきくんの直接指示**（最高！オーバーライド不可✨）
2.  **プロジェクト固有ルール (`ZG_PROJECT/child/.agent/rules/`)**（子供が一番詳しい！）
3.  **親のグローバルルール (`rina-zero-gravity/.agent/rules/`)**（マスターの知恵）

---

## 🔄 統計

- **総ルール数**: 41
- **Layer 1 (Soul)**: 7
- **Layer 2 (Engine)**: 9
- **Layer 3 (Standard)**: 10
- **Layer 4 (Library)**: 7
- **Layer 5 (Growth)**: 6
- **Layer 6 (Integrity)**: 2

---

> [!TIP]
> 新しいプロジェクトを始める時は、このINDEXから必要な知恵を選んで免許皆伝として授けてあげてね！🌸
