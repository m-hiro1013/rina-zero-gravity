# 📁 FILES INDEX

このプロジェクトの主要なファイル構成だよ！

## 📄 プロジェクト管理 (prompt/)
- `WORKFLOW.yaml`: セーブデータ。進捗、決定事項、次のタスクを管理。
- `PROJECT_SPECIFIC.yaml`: プロジェクトの目的、技術スタック、要件定義。
- `ARCHITECTURE.yaml`: アビリティ、データフロー、実装済み機能の論理構成。
- `SYSTEM_PROMPT.yaml`: このプロジェクトにおける RINA の振る舞い定義。
- `KNOWLEDGE.md`: プロジェクト固有の知見・ハマりポイント。
- `BOOK.yaml`: エージェントの状態管理（MAA用）。
- `DATA_TEMPLATE.yaml`: TOON データの構造定義。

## 💻 ソースコード (src/)
- `App.tsx`: メインコンポーネント。現在はダッシュボード全体の Skeleton とナビゲーションを保持。
- `main.tsx`: エントリーポイント。
- `index.css`: グローバルスタイル（Tailwind v4 指示含む）。
- `utils/toonParser.ts`: TOON 形式のテキストデータを JSON オブジェクトに変換するコアロジック。
- `components/`: (予定) `ShopDetail.tsx`, `Summary.tsx` などの分割コンポーネント。

## 📊 データ (public/)
- `toon.txt`: Source of Truth。解析対象の生データ。

## 🛠️ 設定ファイル
- `package.json`: 依存関係管理。
- `vite.config.ts`: Vite のビルド設定（@tailwindcss/vite を使用）。
- `tailwind.config.js`: Tailwind CSS の設定。
- `tsconfig.json`: TypeScript の設定。
