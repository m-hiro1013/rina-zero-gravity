---
description: ユーザーの指示に従って ZG_PROJECT/<プロジェクト名>/.agent にGA-Workspace構造を構築する。GA-Workspaceを作るためのワークフロー。
---
# GA-Workspaceセットアップ (Setup GA-Workspace)

**メタ定義**: このワークフロー自体がGA-Workspaceの一部であり、新しいGA-Workspaceを生成する。

```
GA-Workspace (Meta) --[/setup-ga-workspace]--> ZG_PROJECT/<project>/.agent/
```

**出力先**: `ZG_PROJECT/<プロジェクト名>/.agent/`

---

## Step 1: プロジェクト情報の収集
ユーザーから以下の情報を収集せよ：

1. **プロジェクト名**: ZG_PROJECT配下のディレクトリ名（必須）
   - 例: `my-web-app`, `api-server`, `mobile-client`
2. **技術スタック**: 言語、フレームワーク、パッケージマネージャー
3. **プロジェクトタイプ**: Web、API、CLI、ライブラリ、モバイルなど

ユーザーが明示しない場合は質問して確認すること。

### 出力先の確認
```
ZG_PROJECT/<プロジェクト名>/.agent/
├── rules/
└── workflows/
```

## Step 2: 設定レベルの選択
ユーザーに設定レベルを選択させよ：

| レベル | 内容 |
|--------|------|
| **Minimal** | 必須ルール3つ + メタワークフロー2つ |
| **Standard** | Minimal + 推奨ルール + 基本ワークフロー |
| **Full** | Standard + 全テンプレート + 拡張ワークフロー |

デフォルトは **Standard** とする。

## Step 3: ディレクトリ構造の作成 // turbo
GA-Workspace用のディレクトリを作成せよ：
```bash
mkdir -p ZG_PROJECT/<プロジェクト名>/.agent/rules
mkdir -p ZG_PROJECT/<プロジェクト名>/.agent/workflows
```

## Step 4: 必須ルールの生成
以下の必須ルールを生成せよ：

### 4.1: 00-ga-workspace-definition.md
GA-Workspaceの定義ルールを生成。プロジェクト名を反映させること。

### 4.2: 01-stack.md
収集した技術スタック情報に基づいて生成：
- 言語とバージョン
- フレームワーク
- パッケージマネージャー
- ビルド/テストコマンド

### 4.3: 02-security-mandates.md
セキュリティ基準ルールを生成。

## Step 5: メタワークフローの生成
ルール・ワークフロー作成用のメタワークフローを生成せよ：

### 5.1: create-rule.md
ルール作成ワークフロー

### 5.2: create-workflow.md
ワークフロー作成ワークフロー

## Step 6: 追加コンポーネントの生成（Standard以上）
Standard/Fullレベルの場合、追加で生成：

### ルール
- `10-ops.md` - 運用手順
- `11-type-safety.md` - 型安全性（TypeScriptの場合）
- `12-project-governance.md` - ガバナンス

### ワークフロー（原子）
- `lint-check.md` - Lintチェック
- `type-check.md` - 型チェック
- `run-tests.md` - テスト実行

### ワークフロー（合成）
- `verify-code.md` - コード検証

### ワークフロー（高次）
- `create-feature.md` - 機能追加
- `bug-fix.md` - バグ修正

## Step 7: テンプレートの配置（Fullのみ）
Fullレベルの場合、テンプレート集も配置：
- `rule-templates.md`
- `workflow-templates.md`

## Step 8: 検証 // turbo
生成した設定の検証を行え：
```bash
ls -la ZG_PROJECT/<プロジェクト名>/.agent/rules/
ls -la ZG_PROJECT/<プロジェクト名>/.agent/workflows/
```

YAMLフロントマターが正しいか確認。

## Step 9: 完了報告
以下を報告せよ：

```
## GA-Workspace セットアップ完了 🚀

プロジェクト: <プロジェクト名>
出力先: ZG_PROJECT/<プロジェクト名>/.agent/
レベル: <Minimal/Standard/Full>

### 作成されたファイル
ZG_PROJECT/<プロジェクト名>/
└── .agent/
    ├── rules/
    │   ├── 00-ga-workspace-definition.md ✅
    │   ├── 01-stack.md ✅
    │   ├── 02-security-mandates.md ✅
    │   └── ...
    └── workflows/
        ├── create-rule.md ✅
        ├── create-workflow.md ✅
        └── ...

### 次のステップ
1. `01-stack.md` を確認してプロジェクト固有の設定を調整
2. `/create-rule` で追加のルールを作成
3. `/create-workflow` でプロジェクト固有のワークフローを作成
```
