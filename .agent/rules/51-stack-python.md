---
trigger: model_decision
description: APIやデータ可視化などのPythonプロジェクトを作成する場合に適用するよ！AI系もこれでバッチリ✨
slug: stack-python
inheritance: selective
scope: project_local
---
# Python技術スタック (Python Technology Stack)

APIサーバーやデータダッシュボードを構築する際に使用する技術スタックだよ！

## 言語
- **Python 3.12+**: 最新の安定版

## APIフレームワーク
- **FastAPI**: 高速・モダンなAPIフレームワーク
- **Pydantic**: データバリデーション

## データ可視化
- **Streamlit**: データダッシュボードを超簡単に作れる！

## パッケージマネージャー
- **pip / uv**: 依存関係管理
- **requirements.txt**: 依存関係定義

## テスト
- **pytest**: テストフレームワーク
- **pytest-cov**: カバレッジ計測

## Lint/Format
- **ruff**: 超高速Linter
- **black**: コードフォーマッター
- **mypy**: 型チェック

## コマンド
```bash
# 仮想環境作成
python -m venv venv
source venv/bin/activate  # macOS/Linux
.\venv\Scripts\activate   # Windows

# 依存関係インストール
pip install -r requirements.txt

# 開発サーバー起動
uvicorn main:app --reload  # FastAPI
streamlit run app.py       # Streamlit

# テスト実行
pytest

# Lint/Format
ruff check .
black .
mypy .
```

## ディレクトリ構造（FastAPI）
```
.
├── main.py           # エントリーポイント
├── routers/          # APIルーター
├── models/           # データモデル
├── schemas/          # Pydanticスキーマ
├── services/         # ビジネスロジック
├── tests/            # テスト
├── requirements.txt  # 依存関係
└── .env.example      # 環境変数テンプレート
```
