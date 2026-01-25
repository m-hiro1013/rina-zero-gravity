# {{project_name}}

Tailwind CSS を使ったモダンなランディングページだよ！

## 🚀 始め方

### ローカルで確認

このテンプレートは Tailwind CSS CDN を使用しているので、ビルド不要！

1. VS Codeの **Live Server** 拡張機能を使う場合:
   - `index.html` を右クリック → "Open with Live Server"

2. Python の簡易サーバーを使う場合:
   ```bash
   python -m http.server 8000
   ```

## 📁 ファイル構成

```
.
├── index.html      # メインのHTML
├── style.css       # カスタムスタイル
├── .gitignore      # Git除外設定
└── README.md       # このファイル
```

## 🎨 カスタマイズ

### 色を変える

Tailwind のクラスを変更するだけ！

```html
<!-- 前 -->
<div class="bg-indigo-600">

<!-- 後（緑に変更） -->
<div class="bg-green-600">
```

### セクションを追加

コピー&ペーストで簡単に追加できるよ:

```html
<section class="py-20 px-4">
    <div class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-gray-800 mb-4">
            新しいセクション
        </h2>
        <p class="text-gray-600">
            コンテンツをここに
        </p>
    </div>
</section>
```

## 📝 ライセンス

MIT License
