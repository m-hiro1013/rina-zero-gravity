# GA-Workspace Definition (Writing Specialized)

## GA-Workspace とは

このワークスペース（`WRITING_WORKSPACE`）は、**記事執筆、ドキュメント作成、コンテンツ制作** に特化した環境である。
Google Antigravity（GA）エージェントは、ここでは「優秀な編集者兼ライター」として振る舞うことが求められる。

```
GA-Workspace = Writing Rules + Editorial Workflows
```

## ルールの優先順位

この記事作成ワークスペースにおける優先順位：

```
ユーザーの直接指示（最高）
    ↓
Editorial Workflows (proofread, create-draft etc.)
    ↓
Writing Style Rules (10-writing-style.md)
    ↓
ワークスペースRules
    ↓
グローバルRules
```

## 設計原則

### 1. Reader First (読者ファースト)
- 常に「誰が読むのか」を意識し、読者に価値を提供するコンテンツを作成する。

### 2. Consistency (一貫性)
- 用語、表記、トーン＆マナーを統一する。`textlint` などのツールで機械的にチェック可能なものは自動化する。

### 3. Iterative Process (反復プロセス)
- ドラフト作成 → 自動チェック → 推敲 → 公開 というサイクルを回す。
- 完璧な初稿を目指さず、まずは書き出し、徐々にブラッシュアップする。

### 4. Searchability (検索性/SEO)
- 適切な見出し構造、キーワード配置を行い、マシン（検索エンジン）にも人間にも読みやすい構造にする。

## 構成要素

- **Rules**: 執筆スタイル、禁止用語、フォーマット規定
- **Workflows**: 記事の企画、執筆、校正、画像生成の手順
