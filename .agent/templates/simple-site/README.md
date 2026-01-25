# {{project_name}}

シンプルなWebサイトプロジェクトだよ！

## 🚀 始め方

### ローカルで確認

1. VS Codeの **Live Server** 拡張機能を使う場合:
   - `index.html` を右クリック → "Open with Live Server"

2. Python の簡易サーバーを使う場合:
   ```bash
   python -m http.server 8000
   ```
   → http://localhost:8000 にアクセス

3. Node.js の serve を使う場合:
   ```bash
   npx serve .
   ```

## 📁 ファイル構成

```
.
├── index.html      # メインのHTML
├── style.css       # スタイルシート
├── script.js       # JavaScript
├── assets/         # 画像・フォントなど
└── README.md       # このファイル
```

## 🎨 カスタマイズ

### 色を変える
`style.css` の `:root` セクションで変数を変更:

```css
:root {
    --color-primary: #3b82f6;  /* メインカラー */
    --color-secondary: #64748b; /* サブカラー */
}
```

### セクションを追加
`index.html` に新しい `<section>` を追加:

```html
<section id="new-section" class="section">
    <h2>新しいセクション</h2>
    <p>コンテンツをここに</p>
</section>
```

## 📝 ライセンス

MIT License
