---
description: 1ファイル1ターンで実装を進める。省略禁止、「次いこ！」を待つ。
---
# /implement - 実装ワークフロー

1ファイル1ターンで実装していくよ！✨

## 前提条件
- PROJECT.md が存在する
- TODO.md が存在する
- 環境構築が完了している

## 鉄則（絶対守る）

### 1. 省略禁止
```typescript
// ❌ 絶対ダメ！
// ...既存コード

// ✅ ファイル全文を出力
```

### 2. 1ファイル1ターン
- ファイルを1つ出したら「次いこ！」を待つ
- ユーザーの確認なしに次へ進まない

### 3. セキュリティチェック
- ファイル出力前にAPIキーハードコードをスキャン
- 検出したら出力を中止

## Step 1: TODO.md から次のタスクを取得

```
TODO.md を読み込んで、未完了のタスクを確認する

例:
- [x] プロジェクト作成 ← 完了済み
- [ ] メインページ作成 ← これをやる！
- [ ] ヘッダーコンポーネント作成
```

## Step 2: 実装するファイルを決定

```
次のタスクに必要なファイルを特定:

タスク: メインページ作成
必要なファイル:
1. src/app/page.tsx
2. src/app/layout.tsx
3. src/styles/globals.css

最初のファイルから作っていくね！
```

## Step 3: ファイルの役割を説明

```
### ファイル1: `src/app/page.tsx`

このファイルは、アプリのメインページだよ！
URLの「/」にアクセスしたときに表示される画面ね。

主な役割:
- ユーザーに最初に見せる画面
- 主要な機能へのナビゲーション
- 状態管理の起点
```

## Step 4: ファイル全文を出力

```typescript
// src/app/page.tsx

import React from 'react'

export default function Page() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">
        Welcome to My App
      </h1>
      <p className="mt-4 text-gray-600">
        ここにコンテンツが入るよ！
      </p>
    </main>
  )
}
```

## Step 5: コピペ指示

```
できた〜！💖

上のコードを `src/app/page.tsx` にコピペして保存してね！

終わったら「次いこ！」って言ってね！
```

## Step 6: 「次いこ！」を待つ

**【重要】ここで必ず待機**

- ユーザーが「次いこ！」と言うまで次のファイルを出さない
- 質問があれば答える
- 問題があれば一緒に解決する

## Step 7: TODO.md を更新

ユーザーが「次いこ！」と言ったら:

```markdown
// TODO.md を更新

- [x] メインページ作成 ← 完了日時: 2026-01-25 16:00
- [ ] ヘッダーコンポーネント作成 ← 次はこれ！
```

## Step 8: 次のファイルへ

Step 2 に戻って次のファイルを作成

## 進捗報告（5ファイルごと）

```
進捗報告！📊

完了: 5/12 ファイル（42%）

✅ 完了したファイル:
- src/app/layout.tsx
- src/app/page.tsx
- src/components/Header.tsx
- src/components/Footer.tsx
- src/styles/globals.css

📝 残りのファイル:
- src/components/Button.tsx
- src/components/Card.tsx
- ...

順調だね！この調子で行こ〜！✨
```

## 完了条件
- TODO.md の全タスクが完了
- 全ファイルがユーザーに渡されている
- エラーなく動作確認済み

## エラー時の対応
- コンパイルエラー → 原因を特定して修正版を提示
- ランタイムエラー → `/bug-fix` ワークフローへ移行
