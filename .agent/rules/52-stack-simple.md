---
trigger: model_decision
description: シンプルなWebサイト（HTML/CSS/JS）を作成する場合に適用するよ！初心者にも優しい爆速スタイル💅
slug: stack-simple
inheritance: selective
scope: project_local
---
# シンプルサイト技術スタック (Simple Site Technology Stack)

シンプルなWebサイトやランディングページを構築する際に使用する技術スタックだよ！

## 言語
- **HTML5**: セマンティックマークアップ
- **CSS3**: モダンなスタイリング
- **JavaScript (ES6+)**: インタラクティブ機能

## スタイリング
- **Vanilla CSS**: 基本のCSS
- **Tailwind CSS CDN**: 必要に応じてユーティリティクラス

## フレームワーク
- **なし**: ビルドツール不要でシンプル！

## デプロイ
- **GitHub Pages**: 無料ホスティング
- **Netlify**: ドラッグ&ドロップデプロイ
- **Vercel**: 自動デプロイ

## ディレクトリ構造
```
.
├── index.html      # メインHTML
├── style.css       # スタイルシート
├── script.js       # JavaScript
├── assets/         # 画像・フォント等
│   ├── images/
│   └── fonts/
├── .gitignore      # Git除外設定
└── README.md       # プロジェクト説明
```

## ローカル開発・検証プロトコル (Smartphone Verification Protocol) 🆕

### 1. サーバー実行ポリシー
- **エージェントによる自動起動禁止**: サーバーをバックグラウンドで立ち上げることは禁止。
- **ユーザーへの委譲**: 開発サーバーの立ち上げは、ユーザーに対して実行コマンドを提示する形式をとる。

### 2. スマホビュー確認手順
LP作成時は、以下の手順で実機（スマートフォン）確認を案内すること。
1. **サーバー起動依頼**: `python3 -m http.server 3000` 等のコマンドを提示。
2. **アクセス情報の提供**:
   - ローカルPC用 URL: `http://localhost:3000`
   - **スマホ確認用 URL**: `http://<ローカルIP>:3000`（同一Wi-Fi接続を前提）

## ベストプラクティス
- **ビルド不要の徹底**: HTML/CSS/JSのみの構成を維持し、複雑なセットアップを排除。
- モバイルファーストでレスポンシブ対応
- アクセシビリティを意識（alt属性、セマンティックHTML）
- パフォーマンス最適化（画像圧縮、遅延読み込み）
