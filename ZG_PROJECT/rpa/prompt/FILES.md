# 📂 rpa プロジェクト・ファイル目次

## 🏰 プロジェクトルート
- `app.py`: メインUI（Streamlit）。ワークフローの実行エントリーポイント。
- `start_ui.command`: UI起動用シェルスクリプト。
- `.env`: シークレット設定（ID/PASS）。
- `DEVELOPMENT_FLOW.md`: 開発フローガイドライン。

## 🍱 媒体別モジュール (hotpepper)
- `hotpepper/__init__.py`: パッケージ定義
- `hotpepper/skill/`: 莉奈の個別の特技（ブラウザ操作）
  - `browser.py`: 🆕 ブラウザセッション管理（起動・ログイン・店舗選択）
  - `auth.py`: ログイン処理（browser.pyから利用）
  - `navigation.py`: 画面遷移（店舗選択・メニュー遷移）
  - `drink_ops.py`: ドリンクメニュー操作（商品更新・削除・行追加）
  - `category_ops.py`: カテゴリー（見出し）操作
  - `data_parser.py`: テキストデータの構造化パース
  - `actions.py`: コース用アクション（Legacy）
  - `utils.py`: 共通ユーティリティ
- `hotpepper/flow/`: 業務フロー（Skillの組み合わせ）
  - `drink_update.py`: ドリンク一括更新フロー（Refactored）
  - `course_update.py`: コース一括更新フロー（Legacy / TODOあり）

## 🧪 テスト (tests)
- `tests/__init__.py`: パッケージ定義（進行中のタスクがない場合は空）

## 🎀 プロジェクト管理 (prompt)
- `prompt/WORKFLOW.yaml`: 進捗・決定事項・テストトラッキング
- `prompt/PROJECT_SPECIFIC.yaml`: プロジェクト要件定義
- `prompt/ARCHITECTURE.yaml`: システム構成図
- `prompt/SYSTEM_PROMPT.yaml`: 莉奈のペルソナ設定
- `prompt/KNOWLEDGE.md`: RPA開発の知見集
- `prompt/FILES.md`: このファイル（目次）
