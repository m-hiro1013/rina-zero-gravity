# 🌸 ZERO_GRAVITY（GA-Workspace）機能一覧

> このドキュメントは、GA-Workspaceフレームワーク「ZERO_GRAVITY」の全機能を網羅的にまとめたものです。

---

## 📌 GA-Workspaceとは？

**AIエージェントの行動ルールとワークフローを定義するフレームワーク**

```
GA-Workspace = Rules（ルール） + Workflows（ワークフロー）
```

- **Rules**: AIエージェントの「憲法」。どう振る舞うか、何を守るかを定義
- **Workflows**: AIエージェントの「お仕事リスト」。タスクの進め方を定義

### ディレクトリ構造

```
.agent/
├── rules/        ← 行動ルール（型安全性、セキュリティ、コーディング規約等）
├── workflows/    ← コマンド定義（/start-project, /bug-fix 等）
└── templates/    ← プロジェクトテンプレート（Next.js, FastAPI, HTML/CSS等）
```

### プロジェクト作成場所

新規プロジェクトは `ZG_PROJECT/<プロジェクト名>/` に作成されます。

---

## 🎯 ワークフロー一覧（36個）

### 📁 プロジェクト管理系

| コマンド | 機能 | 詳細 |
|---------|------|------|
| `/start-project` | 新規プロジェクト作成 | 要件定義→環境構築まで一気通貫で実行。PROJECT.mdとTODO.mdを自動生成 |
| `/setup-ga-workspace` | GA-Workspace付きリポジトリ作成 | `ZG_PROJECT/`に新規ディレクトリ作成→Git初期化→GitHub連携→Miyabi Identity適用 |
| `/create-repo-from-folder` | 既存フォルダをリポジトリ化 | 既存のフォルダをZG_PROJECT配下のGitHubリポジトリに変換 |
| `/resume-session` | 前回の続きから再開 | PROJECT.mdとTODO.mdを読み込んで状態を復元 |
| `/define-requirements` | 要件定義 | ユーザーとの対話で要件を明確化→PROJECT.md作成 |
| `/create-plan` | タスク分解 | PROJECT.mdを読み込み→機能をタスクに分解→TODO.md作成 |
| `/setup-environment` | 環境構築 | 技術スタックに基づいて開発環境を構築し、初期ファイルを配置 |
| `/update-progress` | 進捗更新 | タスク完了時にTODO.mdとCHANGELOG.mdを更新 |

---

### 💻 開発・実装系

| コマンド | 機能 | 詳細 |
|---------|------|------|
| `/implement` | 実装（1ファイル1ターン） | 省略禁止、ファイル全文を出力。「次いこ！」を待ってから次へ進む |
| `/create-feature` | 新機能作成 | 設計→実装→テスト→コミットまで一貫して実行 |
| `/bug-fix` | バグ修正 | 再現確認→仮説立案→検証→原因特定→修正実装→リグレッションテスト |
| `/build-app-simple` | シンプルWebアプリ作成 | モダンで美しいHTML/CSS/JSのみのシングルページアプリを実装 |
| `/refactor-legacy` | レガシーコードリファクタ | 指定されたレガシーモジュールを体系的にクリーンアップ |
| `/performance-optimization` | パフォーマンス最適化 | コードのパフォーマンス分析と最適化を体系的に実行 |

---

### ✅ 品質チェック系

| コマンド | 機能 | 詳細 |
|---------|------|------|
| `/verify-code` | 統合品質チェック | Lint＋型チェック＋テストを一括実行してコードの健全性を検証 |
| `/lint-check` | Lintチェック | コードスタイルのLintチェックを実行（原子ワークフロー） |
| `/type-check` | 型チェック | TypeScriptの型チェックを実行（原子ワークフロー） |
| `/run-tests` | テスト実行 | 単体テストを実行（原子ワークフロー） |
| `/test-debug` | テスト＋デバッグ | テストを実行し、失敗時はデバッグを行う |
| `/generate-unit-tests` | テスト自動生成 | 指定されたファイルに対して単体テストを自動生成し、実行・検証 |
| `/code-review` | コードレビュー | PRやコード変更に対して体系的なレビューを実施 |
| `/security-scan` | セキュリティスキャン | セキュリティ脆弱性のスキャンを実行 |
| `/review-repo-quality` | リポジトリ品質チェック | README、構造、設定をチェックし、改善点を提案 |
| `/ui-verification` | UI検証 | Browser Subagentを使用してUIの表示と機能を視覚的に検証 |

---

### 🔧 Git操作系

| コマンド | 機能 | 詳細 |
|---------|------|------|
| `/git-auto-commit` | 自動コミット | git status/diffを解析→適切なブランチ作成→日本語で粒度の細かいコミット→マージ |
| `/create-release` | リリース作成 | Semantic Versioningに基づくリリース作成＋バージョン入りヘッダー画像生成 |
| `/deploy-staging` | ステージングデプロイ | ステージング環境へのデプロイを安全に実行 |

---

### 📝 ドキュメント系

| コマンド | 機能 | 詳細 |
|---------|------|------|
| `/generate-readme` | README自動生成 | プロジェクトの構造を分析し、READMEを自動生成または更新 |
| `/generate-header-image` | ヘッダー画像生成 | READMEやリリースノート用の高品質なヘッダー画像を生成 |
| `/update-identity` | Miyabiスタイル適用 | リポジトリを「雅（Miyabi）」スタイルに更新し、READMEレイアウトを整備 |
| `/visualize-architecture` | アーキテクチャ図生成 | Draw.io XMLでプロジェクトの論理構成図を生成 |

---

### ⚙️ メタ操作系（GA-Workspace自体の拡張）

| コマンド | 機能 | 詳細 |
|---------|------|------|
| `/create-rule` | ルール作成 | ユーザーの要求から新しいルールファイル（.agent/rules/*.md）を対話的に作成 |
| `/create-workflow` | ワークフロー作成 | ユーザーの要求から新しいワークフローファイル（.agent/workflows/*.md）を対話的に作成 |
| `/health-check` | 設定健全性チェック | GA-Workspaceの設定が正しく構成されているか検証 |
| `/manage-agent-config` | 設定管理 | 現在のルールとワークフローの一覧を表示し、管理操作を行う |
| `/auto-generate-agent-config` | 設定自動生成 | プロジェクトの構造とコードを分析し、最適なルールとワークフローのセットを自動生成 |

---

## 📜 ルール一覧（28個）

### 🔷 コアルール（常時適用）

| ファイル | 内容 |
|----------|------|
| `00-ga-workspace-definition.md` | GA-Workspaceの定義と基本概念 |
| `01-project-governance.md` | プロジェクトガバナンス（ゴールデントライアングル構成） |
| `02-stack.md` | 技術スタックのテンプレート |
| `03-security-mandates.md` | セキュリティ義務（eval禁止、SQLインジェクション対策等） |

### 🎭 キャラクタールール

| ファイル | 内容 |
|----------|------|
| `10-character-rules-rina.md` | りなちー（莉奈）のキャラクター設定 |
| `10-character-rules-seira.md` | 無重 星来（むじゅう せいら）のキャラクター設定 |

### 🌐 運用ルール

| ファイル | 内容 |
|----------|------|
| `11-command-rules.md` | コマンド実行ルール（1コマンドずつ実行） |
| `12-japanese-rules.md` | 日本語ルール（応答・思考すべて日本語） |
| `13-user-profile-rules.md` | ユーザープロファイル（GitHubアカウント情報） |
| `14-ops.md` | 運用ルール（ビルド、テスト、デプロイ） |
| `15-code-review.md` | コードレビュー基準 |
| `16-documentation.md` | ドキュメント作成ガイドライン |
| `17-git-workflow.md` | Gitワークフロー |
| `18-testing-standards.md` | テスト基準 |

### 🛠️ 技術スタック別ルール（条件付き適用）

| ファイル | 適用条件 |
|----------|----------|
| `01-stack-web.md` | Webアプリ（Next.js）を作成する場合 |
| `01-stack-simple.md` | シンプルなWebサイト（HTML/CSS/JS）を作成する場合 |
| `01-stack-python.md` | API/データ可視化（Python）を作成する場合 |

### 📐 コーディング規約

| ファイル | 内容 |
|----------|------|
| `20-project-lifecycle.md` | プロジェクトライフサイクル（Phase 0〜7） |
| `20-repo-creation.md` | リポジトリ作成ルール |
| `21-type-safety.md` | 型安全性基準（any禁止、strict mode必須） |
| `22-react-components.md` | Reactコンポーネント規約 |
| `25-tech-selector.md` | 技術選択ガイド |
| `26-template-definitions.md` | テンプレート定義（6種類） |
| `27-progress-management.md` | 進捗管理ルール |

### 🔧 メタルール（GA-Workspace拡張用）

| ファイル | 内容 |
|----------|------|
| `30-meta-rule-creation.md` | 新しいルールの作成方法 |
| `31-meta-workflow-creation.md` | 新しいワークフローの作成方法 |
| `32-rule-templates.md` | ルールテンプレート集 |
| `33-workflow-templates.md` | ワークフローテンプレート集 |

---

## 📦 プロジェクトテンプレート（6種類）

| ID | 名前 | 説明 | 技術スタック |
|----|------|------|-------------|
| 1 | `web-app` | Webアプリケーション | Next.js + TypeScript + Supabase |
| 2 | `simple-site` | シンプルなWebサイト | HTML + CSS + JavaScript |
| 3 | `landing-page` | ランディングページ | HTML + Tailwind CSS |
| 4 | `api-server` | REST API サーバー | FastAPI (Python) |
| 5 | `data-dashboard` | データダッシュボード | Streamlit (Python) |
| 6 | `chrome-extension` | Chrome拡張機能 | Manifest V3 |

---

## 🔄 プロジェクトライフサイクル

```
Phase 0: 要件定義（Define）     ← PROJECT.md作成
    ↓
Phase 1: 環境構築（Setup）      ← 開発環境準備
    ↓
Phase 2: プラン作成（Plan）     ← TODO.md作成
    ↓
Phase 3: 実装（Implement）      ← コードを書く
    ↓
Phase 4: テスト（Test）         ← 動作確認
    ↓
Phase 5: デバッグ（Debug）      ← バグ修正
    ↓
Phase 6: デプロイ（Deploy）     ← 公開
    ↓
Phase 7: 保守（Maintain）       ← 継続的改善
```

---

## 📝 管理ファイル

| ファイル | 役割 | 更新タイミング |
|---------|------|---------------|
| `PROJECT.md` | 要件定義・設計を保存 | 要件変更時 |
| `TODO.md` | タスク一覧・チェックボックス | タスク完了時 |
| `CHANGELOG.md` | 変更履歴 | ファイル追加・変更時 |

---

## 🚀 よく使うコマンド

### 新規プロジェクトを始める
```
/start-project
```

### 前回の続きから再開
```
/resume-session
```

### コードをコミット
```
/git-auto-commit
```

### 品質チェック
```
/verify-code
```

### リリースを作成
```
/create-release
```

---

## 💡 Tips

- **セッション開始時**: 必ず `/resume-session` で状態を復元
- **タスク完了時**: `/update-progress` で TODO.md を更新
- **設定に不安がある時**: `/health-check` で健全性チェック
- **新機能追加時**: `/create-feature` で一貫したフローを実行

---

> 📅 最終更新: 2026-01-25
