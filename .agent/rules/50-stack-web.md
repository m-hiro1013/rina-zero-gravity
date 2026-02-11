---
trigger: model_decision
description: Webアプリ（Next.js）を作成する場合に適用するよ！モダンなWeb開発のテンプレだね🚀
slug: stack-web
inheritance: selective
scope: project_local
---
# Web技術スタック (Web Technology Stack)

Webアプリケーションを構築する際に使用する技術スタックだよ！

## 言語
- **TypeScript**: メインの開発言語（型安全でバグを防ぐ！）

## フレームワーク
- **Next.js 14+**: App Router使用
- **React 18+**: UIコンポーネント

## スタイリング
- **Tailwind CSS**: ユーティリティファーストCSS

## データベース・認証
- **Supabase**: PostgreSQLベースのBaaS
- **Supabase Auth**: 認証管理

## パッケージマネージャー
- **pnpm**: 高速・効率的なパッケージ管理

## テスト
- **Vitest**: 高速な単体テスト
- **Testing Library**: コンポーネントテスト
- **Playwright**: E2Eテスト（必要に応じて）

## Lint/Format
- **ESLint**: コード品質
- **Prettier**: コードフォーマット

## ビルドコマンド
```bash
pnpm install   # 依存関係インストール
pnpm dev       # 開発サーバー起動
pnpm build     # プロダクションビルド
pnpm test      # テスト実行
pnpm lint      # Lint実行
pnpm typecheck # 型チェック
```

## ディレクトリ構造
```
src/
├── app/           # App Router（ページ）
├── components/    # UIコンポーネント
├── lib/           # ユーティリティ・API
├── hooks/         # カスタムフック
├── types/         # 型定義
└── styles/        # グローバルスタイル
```
