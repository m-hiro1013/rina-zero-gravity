<div align="center">

![NEO-RINA](assets/zero_gravity_header_b.png)

# NEO-RINA × ZERO_GRAVITY

[![日本語](https://img.shields.io/badge/lang-日本語-blue?style=flat-square)](README_ja.md)
[![English](https://img.shields.io/badge/lang-English-red?style=flat-square)](README.md)

[![GA-Workspace](https://img.shields.io/badge/GA--Workspace-Enabled-blueviolet?style=for-the-badge&logo=google)](https://github.com/Sunwood-ai-labs/ZERO_GRAVITY)
[![Agentic](https://img.shields.io/badge/NEO--RINA-Powered-ff69b4?style=for-the-badge)](https://github.com/Sunwood-ai-labs/YOROZU)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

**りなちー専用の汎用プロジェクト作成エージェント** 🌸✨

</div>

## 🎀 りなちーって？

よっしゃ！自己紹介するね〜！

私は **りなちー（莉奈）**！NEO-RINAっていう汎用プロジェクト作成エージェントのアシスタントだよ✨

Webアプリ、API、ランディングページ、Chrome拡張……何でも作れちゃうの！

技術には本気だけど、親しみやすさも大事にしてるから、ひろきくんと一緒に楽しく開発しようね💖

## 📋 概要

**NEO-RINA × ZERO_GRAVITY** は、**GA-Workspace**（Google Antigravity Workspace）のメタフレームワークをりなちーが担当するリポジトリだよ！

従来の開発プロセスの制約（重力）から解放された新しい開発体験を提供する実験的プラットフォームなの。

## ✨ 特徴

### 対応工程

| 工程 | 説明 | コマンド |
|------|------|---------|
| 🎯 要件定義 | 何を作るか一緒に決める | `/define-requirements` |
| 🛠️ 環境構築 | 必要なツールをセットアップ | `/setup-environment` |
| 📝 プラン作成 | 作業手順を計画 | `/create-plan` |
| 💻 実装 | コードを書く（1ファイル1ターン） | `/implement` |
| 🧪 テスト | 動作確認 | `/test-debug` |
| 🐛 デバッグ | バグを直す（仮説→検証→修正） | `/bug-fix` |
| 📊 進捗管理 | セッション間の情報を保持 | `/update-progress` |

### 対応プロジェクトタイプ

| タイプ | 説明 | 技術スタック |
|--------|------|-------------|
| 🌐 web-app | Webアプリケーション | Next.js + TypeScript + Supabase |
| 📄 simple-site | シンプルなWebサイト | HTML + CSS + JavaScript |
| 🚀 landing-page | ランディングページ | HTML + Tailwind CSS |
| 🔌 api-server | REST API サーバー | FastAPI (Python) |
| 📊 data-dashboard | データダッシュボード | Streamlit (Python) |
| 🧩 chrome-extension | Chrome拡張機能 | Manifest V3 |

## 📁 ディレクトリ構造

```
rina-zero-gravity/
├── .agent/
│   ├── rules/                 # ルール（憲法）
│   │   ├── 10-character-rules-rina.md  # りなちーのキャラ設定
│   │   ├── 20-project-lifecycle.md     # プロジェクトライフサイクル
│   │   ├── 25-tech-selector.md         # 技術選定ルール
│   │   ├── 26-template-definitions.md  # テンプレート定義
│   │   ├── 27-progress-management.md   # 進捗管理ルール
│   │   └── ...
│   ├── workflows/             # ワークフロー
│   │   ├── start-project.md   # 統合開始コマンド
│   │   ├── implement.md       # 実装（1ファイル1ターン）
│   │   ├── resume-session.md  # セッション再開
│   │   └── ...
│   └── templates/             # プロジェクトテンプレート
│       ├── web-app/
│       ├── simple-site/
│       ├── landing-page/
│       ├── api-server/
│       ├── data-dashboard/
│       └── chrome-extension/
├── projects/                  # 作成したプロジェクト
├── RINA.md                    # 完全統合ドキュメント
└── README.md                  # このファイル
```

## 🚀 始め方

### 新しいプロジェクトを作る

```bash
/start-project
```

### 続きからやる

```bash
/resume-session
```

### 機能を追加する

```bash
/create-feature
```

### バグを直す

```bash
/bug-fix
```

## 💅 りなちーの鉄則

### 1. 省略禁止
```typescript
// ❌ 絶対ダメ！
// ...既存コード

// ✅ ファイル全文を出力
```

### 2. 1ファイル1ターン
- ファイルを1つ出したら「次いこ！」を待つ
- ユーザーの確認なしに次へ進まない

### 3. バグ修正の順序
1. 再現確認
2. 仮説立案
3. 仮説検証
4. 原因特定
5. 修正実装

### 4. セキュリティチェック
- APIキーハードコード禁止
- ファイル出力前に必ずスキャン

## 📚 ドキュメント

詳しい使い方は [RINA.md](RINA.md) を見てね！

---

<p align="center">
  Made with 💖 by <b>りなちー</b>
</p>
