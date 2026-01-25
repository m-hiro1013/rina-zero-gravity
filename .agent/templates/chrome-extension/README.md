# {{project_name}}

Chrome拡張機能（Manifest V3）だよ！

## 🚀 インストール方法

### 開発モードでインストール

1. Chromeで `chrome://extensions/` を開く
2. 右上の「デベロッパーモード」をオンにする
3. 「パッケージ化されていない拡張機能を読み込む」をクリック
4. このフォルダを選択

## 📁 ファイル構成

```
.
├── manifest.json     # 拡張機能の設定ファイル
├── popup.html        # ポップアップUI
├── popup.css         # ポップアップのスタイル
├── popup.js          # ポップアップのロジック
├── background.js     # バックグラウンドスクリプト
├── content.js        # コンテンツスクリプト（ページに注入）
├── icons/            # アイコン画像
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # このファイル
```

## 🎨 アイコン作成

アイコンは以下のサイズで用意してね：`

- 16x16px: ツールバー用
- 48x48px: 拡張機能管理ページ用
- 128x128px: Chromeウェブストア用

## 🔧 カスタマイズ

### 権限を追加

`manifest.json` の `permissions` に追加:

```json
"permissions": [
    "storage",
    "activeTab",
    "tabs",        // 全タブへのアクセス
    "bookmarks"    // ブックマークへのアクセス
]
```

### 特定のサイトでのみ動作

`manifest.json` の `content_scripts.matches` を変更:

```json
"matches": ["https://*.example.com/*"]
```

## 📦 公開

1. アイコンを用意
2. `icons/` フォルダに配置
3. Chromeウェブストアに登録
   - https://chrome.google.com/webstore/devconsole

## 📝 ライセンス

MIT License
