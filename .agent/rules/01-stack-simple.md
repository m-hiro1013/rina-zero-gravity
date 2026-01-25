---
trigger: model_decision
slug: stack-simple
description: シンプルなWebサイト（HTML/CSS/JS）を作成する場合に適用
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

## ローカル開発
```bash
# Live Serverを使う場合（VS Code拡張）
# → 右クリック → "Open with Live Server"

# Python簡易サーバー
python -m http.server 8000

# Node.js簡易サーバー
npx serve .
```

## ベストプラクティス
- モバイルファーストでレスポンシブ対応
- アクセシビリティを意識（alt属性、セマンティックHTML）
- パフォーマンス最適化（画像圧縮、遅延読み込み）
