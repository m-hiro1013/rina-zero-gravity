---
trigger: always_on
slug: template-definitions
---
# テンプレート定義 (Template Definitions)

プロジェクトタイプごとのテンプレートを定義するよ！

## テンプレート一覧

| ID | 名前 | 説明 | 技術スタック |
|----|------|------|-------------|
| 1 | web-app | Webアプリケーション | Next.js + TypeScript + Supabase |
| 2 | simple-site | シンプルなWebサイト | HTML + CSS + JavaScript |
| 3 | landing-page | ランディングページ | HTML + Tailwind CSS |
| 4 | api-server | REST API サーバー | FastAPI (Python) |
| 5 | data-dashboard | データダッシュボード | Streamlit (Python) |
| 6 | chrome-extension | Chrome拡張機能 | Manifest V3 |

## 各テンプレートの詳細

### 1. web-app（Next.js）
```
templates/web-app/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── .gitignore
├── .env.example
├── README.md
└── src/
    ├── app/
    │   ├── layout.tsx
    │   └── page.tsx
    ├── components/
    ├── lib/
    └── styles/
        └── globals.css
```

### 2. simple-site（HTML/CSS/JS）
```
templates/simple-site/
├── index.html
├── style.css
├── script.js
├── .gitignore
└── README.md
```

### 3. landing-page（Tailwind）
```
templates/landing-page/
├── index.html
├── style.css
├── tailwind.config.js
├── .gitignore
└── README.md
```

### 4. api-server（FastAPI）
```
templates/api-server/
├── main.py
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

### 5. data-dashboard（Streamlit）
```
templates/data-dashboard/
├── app.py
├── requirements.txt
├── .gitignore
└── README.md
```

### 6. chrome-extension（Manifest V3）
```
templates/chrome-extension/
├── manifest.json
├── popup.html
├── popup.css
├── popup.js
├── background.js
├── content.js
├── icons/
├── .gitignore
└── README.md
```

## テンプレート構成ルール

### 必須ファイル
- `README.md`: プロジェクト説明
- `.gitignore`: Git除外設定

### 条件付き必須
- `.env.example`: APIキー使用時は必須
- `tests/`: テストが必要な場合

### ミニマル構成
- 必要最小限のファイルのみ
- 使わない機能は含めない
- 必要に応じて後から追加

## 管理ファイルテンプレート

### PROJECT.md.template
→ `templates/PROJECT.md.template`

### TODO.md.template
→ `templates/TODO.md.template`

### CHANGELOG.md.template
→ `templates/CHANGELOG.md.template`
