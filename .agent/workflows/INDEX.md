# 🔄 Workflows INDEX

> **目次ファースト**: ワークフローを実行する前に、まずここを見る

---

## 🔍 クイックリファレンス

| カテゴリ | 説明 | 代表的なコマンド |
|---------|------|-----------------|
| **プロジェクト管理** | 開始・再開・保存・計画 | `/start-project`, `/resume-session` |
| **開発** | 実装・機能追加・バグ修正 | `/implement`, `/create-feature`, `/bug-fix` |
| **品質** | テスト・レビュー・検証 | `/verify-code`, `/code-review` |
| **リリース** | デプロイ・リリース作成 | `/deploy-staging`, `/create-release` |
| **ドキュメント** | README・画像生成 | `/generate-readme`, `/generate-header-image` |
| **メタ** | ルール・ワークフロー作成 | `/create-rule`, `/create-workflow` |
| **進化** | 学習・自己更新 | `/learn-and-grow`, `/update-rina-skills` |
| **Orchestrator制御** 🆕 | ワークフローテンプレート | `workflow-templates` |

---

## 📋 全ワークフロー一覧

### プロジェクト管理（8個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/start-project` | `start-project.md` | 新規プロジェクト開始（統合コマンド） |
| `/resume-session` | `resume-session.md` | セッション再開（prompt/読み込み） |
| `/save-session` | `save-session.md` | セッション保存（WORKFLOW.yaml更新） |
| `/define-requirements` | `define-requirements.md` | 要件定義（1問1答） |
| `/create-plan` | `create-plan.md` | タスク分解・計画作成 |
| `/update-progress` | `update-progress.md` | 進捗更新 |
| `/setup-environment` | `setup-environment.md` | 開発環境構築 |
| `/setup-ga-workspace` | `setup-ga-workspace.md` | GA-Workspace構造作成 |

### 開発（6個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/implement` | `implement.md` | 1ファイル1ターン実装 |
| `/create-feature` | `create-feature.md` | 新機能作成（設計→実装→テスト） |
| `/bug-fix` | `bug-fix.md` | バグ修正（仮説→検証→修正） |
| `/build-app-simple` | `build-app-simple.md` | シンプルHTML/CSS/JSアプリ作成 |
| `/refactor-legacy` | `refactor-legacy.md` | レガシーコードリファクタリング |
| `/performance-optimization` | `performance-optimization.md` | パフォーマンス最適化 |

### 品質・テスト（8個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/verify-code` | `verify-code.md` | Lint+型チェック+テスト一括実行 |
| `/code-review` | `code-review.md` | コードレビュー実施 |
| `/lint-check` | `lint-check.md` | Lintチェック（原子ワークフロー） |
| `/type-check` | `type-check.md` | 型チェック（原子ワークフロー） |
| `/run-tests` | `run-tests.md` | テスト実行（原子ワークフロー） |
| `/generate-unit-tests` | `generate-unit-tests.md` | 単体テスト自動生成 |
| `/test-debug` | `test-debug.md` | テスト実行+デバッグ |
| `/security-scan` | `security-scan.md` | セキュリティスキャン |

### リリース・デプロイ（3個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/deploy-staging` | `deploy-staging.md` | ステージング環境デプロイ |
| `/create-release` | `create-release.md` | リリース作成（SemVer） |
| `/git-auto-commit` | `git-auto-commit.md` | 自動コミット・マージ |

### ドキュメント・アセット（4個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/generate-readme` | `generate-readme.md` | README自動生成 |
| `/generate-header-image` | `generate-header-image.md` | ヘッダー画像生成 |
| `/update-identity` | `update-identity.md` | Miyabiスタイル適用 |
| `/visualize-architecture` | `visualize-architecture.md` | アーキテクチャ図生成 |

### メタ・設定・メンテナンス（8個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/cash-clear` | `cash-clear.md` | 🆕 キャッシュクリア（不具合解消） |
| `/create-rule` | `create-rule.md` | 新規ルール作成 |
| `/create-workflow` | `create-workflow.md` | 新規ワークフロー作成 |
| `/create-repo-from-folder` | `create-repo-from-folder.md` | フォルダからリポジトリ作成 |
| `/auto-generate-agent-config` | `auto-generate-agent-config.md` | エージェント設定自動生成 |
| `/manage-agent-config` | `manage-agent-config.md` | エージェント設定管理 |
| `/health-check` | `health-check.md` | GA-Workspace健全性確認 |
| `/update-index` | `update-index.md` | 🆕 INDEX更新（目次ファースト） |

### UI検証（2個）

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/ui-verification` | `ui-verification.md` | ブラウザでUI検証 |
| `/review-repo-quality` | `review-repo-quality.md` | リポジトリ品質チェック |

### 進化・学習（3個）🆕

| コマンド | ファイル | 説明 |
|---------|---------|------|
| `/learn-and-grow` | `learn-and-grow.md` | 知見蓄積（GrowthMonitor） |
| `/update-rina-skills` | `update-rina-skills.md` | Rina自己進化 |
| `/self-check` | `self-check.md` | 🆕 セルフチェック（原則積合確認） |

---

## 🔥 よく使うワークフロー

### プロジェクト開始時
1. `/start-project` - 新規開始
2. `/resume-session` - 続きから

### 開発中
1. `/implement` - 1ファイルずつ実装
2. `/verify-code` - 品質チェック
3. `/save-session` - 進捗保存

### リリース時
1. `/git-auto-commit` - コミット整理
2. `/create-release` - リリース作成

### セッション終了時
1. `/save-session` - 進捗保存
2. `/learn-and-grow` - 知見蓄積

---

## 🔄 ワークフロー追加時の更新

新しいワークフローを追加したら、このINDEXも更新すること！

```markdown
| `/new-command` | `new-command.md` | 説明 |
```

---

## 📊 統計

- **総ワークフロー数**: 41
- **プロジェクト管理**: 8
- **開発**: 6
- **品質・テスト**: 8
- **リリース・デプロイ**: 3
- **ドキュメント**: 4
- **メタ・設定・メンテナンス**: 8
- **UI検証**: 2
- **進化・学習**: 3
