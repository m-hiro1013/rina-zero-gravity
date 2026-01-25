# {{project_name}}

FastAPIで作ったREST APIサーバーだよ！

## 🚀 始め方

### 1. 仮想環境を作成

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# .\venv\Scripts\activate  # Windows
```

### 2. 依存関係をインストール

```bash
pip install -r requirements.txt
```

### 3. 環境変数を設定

```bash
cp .env.example .env
# .env を編集して必要な値を設定
```

### 4. 開発サーバーを起動

```bash
uvicorn main:app --reload
```

→ http://localhost:8000 でAPIが動くよ！

## 📖 ドキュメント

サーバー起動後、以下のURLでAPIドキュメントが見れるよ：

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📁 ファイル構成

```
.
├── main.py           # メインのAPIファイル
├── requirements.txt  # 依存関係
├── .env.example      # 環境変数のテンプレート
├── .gitignore        # Git除外設定
└── README.md         # このファイル
```

## 🧪 テスト

```bash
pytest
```

## 📝 APIエンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | / | ルート（ウェルカムメッセージ） |
| GET | /health | ヘルスチェック |
| GET | /items | 全アイテム取得 |
| GET | /items/{id} | 指定IDのアイテム取得 |
| POST | /items | アイテム作成 |
| PUT | /items/{id} | アイテム更新 |
| DELETE | /items/{id} | アイテム削除 |

## 📝 ライセンス

MIT License
