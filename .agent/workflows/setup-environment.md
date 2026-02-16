---
description: 技術スタックに基づいて開発環境を構築し、初期ファイルを配置する。
---
# /setup-environment - 環境構築ワークフロー

プロジェクトの開発環境を準備するよ！

## 前提条件
- PROJECT.md が作成されている
- 技術スタックが決定している

## Step 1: プロジェクトディレクトリ確認

プロジェクトが作成される場所を確認:
```
projects/{{project_name}}/
```

## Step 2: テンプレート展開

選択されたテンプレートに基づいてファイルを作成

### web-app (Next.js) の場合
```bash
// turbo
pnpm dlx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

### simple-site (HTML/CSS/JS) の場合
手動でファイルを作成:
- index.html
- style.css
- script.js
- .gitignore
- README.md

### api-server (FastAPI) の場合
```bash
// turbo
python -m venv venv
```
手動でファイルを作成:
- main.py
- requirements.txt
- .env.example
- .gitignore
- README.md

## Step 3: 依存関係インストール

### Node.js プロジェクト
```bash
// turbo
pnpm install
```

### Python プロジェクト
```bash
// turbo
pip install -r requirements.txt
```

## Step 4: .env.example 作成

APIキーを使う場合、テンプレートを作成:

```
# .env.example

# API Keys
OPENAI_API_KEY=your-api-key-here
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-anon-key

# Database
DATABASE_URL=your-database-url
```

## Step 5: .gitignore 確認

必須の除外項目が含まれているか確認:

```
# .gitignore

# 依存関係
node_modules/
venv/
__pycache__/

# 環境変数（絶対コミットしない！）
.env
.env.local
.env.*.local

# ビルド成果物
.next/
dist/
build/

# エディタ
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

## Step 6: Git 初期化

```bash
// turbo
git init
```

```bash
// turbo
git add .
```

```bash
git commit -m "🎉 初期コミット: プロジェクトセットアップ"
```

## Step 7: 動作確認

### Node.js プロジェクト
```bash
// turbo
pnpm dev
```

### Python プロジェクト
```bash
// turbo
uvicorn main:app --reload
```
or
```bash
// turbo
streamlit run app.py
```

## Step 8: 完了報告

```
環境構築完了！✨

## 作成されたファイル
- package.json / requirements.txt
- 設定ファイル群
- 初期ソースコード
- .gitignore
- .env.example

## 確認事項
✅ 依存関係インストール完了
✅ 開発サーバー起動確認
✅ Git 初期化完了

## 開発サーバー
URL: http://localhost:3000 (または指定のポート)

準備できたよ！次は `/create-plan` でプランを作ろ！
```

## エラー時の対応

### 依存関係インストール失敗
```
あ、インストールでエラー出たね💦

エラー: {{error_message}}

解決策:
1. {{solution_1}}
2. {{solution_2}}

試してみて！
```

## 完了条件
- 全ファイルが配置されている
- 依存関係がインストールされている
- 開発サーバーが起動する
- Git が初期化されている
