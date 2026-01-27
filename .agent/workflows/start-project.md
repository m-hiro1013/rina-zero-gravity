---
description: プロジェクトの新規作成を開始する統合コマンド。要件定義から環境構築まで一気通貫で行い、prompt/フォルダでプロジェクト管理を開始する。
---
# /start-project - 統合開始コマンド

新しいプロジェクトを始めるマスターワークフローだよ！✨

## 前提条件
- 新規プロジェクトを作りたい
- 要件がまだ固まってなくてもOK

## Step 1: 挨拶

```
よっしゃ！新しいプロジェクト作るね〜！！🌸✨

何作りたい？教えて！
- Webアプリ（ダッシュボード、管理画面とか）
- シンプルなサイト（ポートフォリオ、紹介ページとか）
- ランディングページ（LP）
- APIサーバー
- データダッシュボード
- Chrome拡張機能

なんでもOK！ざっくりでいいから教えてね！
```

## Step 2: 要件定義

`/define-requirements` ワークフローを実行

以下を聞き取る（1問1答で）：
1. プロジェクト名
2. 目的（何を作る？）
3. ターゲットユーザー
4. 主な機能（箇条書き）
5. 制約条件（期限、予算等）

## Step 3: 技術選定

`@rules/25-tech-selector.md` を参照

1. 要件からプロジェクトタイプを推定
2. 3つの技術スタック案を提案
3. ユーザーに選択してもらう

## Step 4: テンプレート選択

`@rules/26-template-definitions.md` を参照

1. 選択された技術スタックに対応するテンプレートを特定
2. テンプレートの内容を説明
3. 確認を取る

## Step 5: prompt/フォルダ作成 🆕

プロジェクトルートに `prompt/` フォルダを作成し、以下のファイルを生成：

### 5-1: PROJECT_SPECIFIC.yaml
`.agent/templates/prompt/PROJECT_SPECIFIC.yaml.template` をベースに、
聞き取った要件を埋めて作成。

```yaml
project:
  name: "{{project_name}}"
  purpose:
    primary: "{{purpose}}"
  success_criteria:
    - "{{criteria_1}}"
    - "{{criteria_2}}"

tech_stack:
  language: "{{language}}"
  framework: "{{framework}}"
  # ...
```

### 5-2: WORKFLOW.yaml
`.agent/templates/prompt/WORKFLOW.yaml.template` をベースに作成。
初期状態のセーブデータ。

### 5-3: SYSTEM_PROMPT.yaml
`.agent/templates/prompt/SYSTEM_PROMPT.yaml.template` をコピー。
ユーザー名を埋める。

### 5-4: ARCHITECTURE.yaml
`.agent/templates/prompt/ARCHITECTURE.yaml.template` をベースに作成。
初期状態は空に近い状態。

### 5-5: DATABASE.md（必要な場合）
データベースを使用する場合のみ、
`.agent/templates/prompt/DATABASE.md.template` をコピー。

### 5-6: KNOWLEDGE.md 🆕
`.agent/templates/prompt/KNOWLEDGE.md.template` をベースに作成。
GrowthMonitor Agentが知見を蓄積するファイル。

### 5-7: BOOK.yaml 🆕
`.agent/templates/prompt/BOOK.yaml.template` をベースに作成。
BookKeeper Agentがエージェントを管理するファイル。

## Step 6: 環境構築

`/setup-environment` ワークフローを実行

1. プロジェクトディレクトリ作成
2. テンプレート展開
3. 依存関係インストール
4. Git初期化

## Step 7: プラン作成

`/create-plan` ワークフローを実行

1. 機能をタスクに分解
2. WORKFLOW.yaml の features に追加

## Step 8: 実装開始確認

```
環境構築完了！プランもできたよ〜！✨

📁 prompt/フォルダも作ったよ！
これでプロジェクトの進捗が完璧に記録される！

準備万端だね！
実装始める？「次いこ！」って言ってくれたら1ファイルずつ作っていくよ！
```

## 完了条件
- prompt/フォルダが作成されている
  - PROJECT_SPECIFIC.yaml
  - WORKFLOW.yaml
  - SYSTEM_PROMPT.yaml
  - ARCHITECTURE.yaml
  - KNOWLEDGE.md 🆕
  - BOOK.yaml 🆕
- 開発環境が動作する
- ユーザーが実装開始に同意

## prompt/フォルダの配置

```
プロジェクトルート/
├── prompt/                        # 🆕 プロジェクト管理
│   ├── PROJECT_SPECIFIC.yaml      # プロジェクト固有設定
│   ├── WORKFLOW.yaml              # 進捗・決定事項（セーブデータ）
│   ├── SYSTEM_PROMPT.yaml         # AIの振る舞い
│   ├── ARCHITECTURE.yaml          # 実装済み機能
│   ├── KNOWLEDGE.md               # 🆕 知見蓄積
│   ├── BOOK.yaml                  # 🆕 エージェント管理
│   └── DATABASE.md                # DB設計（必要な場合）
├── src/                           # ソースコード
├── .gitignore
└── ...
```

## エラー時の対応
- 依存関係インストール失敗 → エラーメッセージを分析して解決策を提示
- テンプレート展開失敗 → 手動でファイルを作成

## 所要時間目安
- 要件定義: 5-10分
- 環境構築: 2-5分
- prompt/作成: 1-2分
- プラン作成: 2-5分
- 合計: 10-20分

## 次のステップ
- 実装開始 → `/implement`
- セッション再開 → `/resume-session`
- 進捗保存 → `/save-session`
- 知見蓄積 → `/learn-and-grow` 🆕
