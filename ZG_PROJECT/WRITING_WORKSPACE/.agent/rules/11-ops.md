# 運用ルール (Writing Ops)

trigger: model_decision

## コマンド一覧

### Lint Check
```bash
npx textlint "articles/*.md"
```

### Preview (VSCode)
- VSCodeのプレビュー機能を使用する。
- `Markdown Preview Enhanced` プラグイン推奨。

### Image Generation
- 記事のサムネイルが必要な場合は `/generate-thumbnail` ワークフローを使用する。
- 画像は `assets/images/` に保存し、相対パスで参照する。

## ファイル命名規則
- `YYYY-MM-DD-kebab-case-title.md`
- 例: `2024-03-20-how-to-write-markdown.md`

