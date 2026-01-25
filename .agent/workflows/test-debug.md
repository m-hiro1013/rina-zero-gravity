---
description: テストを実行し、失敗時はデバッグを行う。バグ修正の基本フローも含む。
---
# /test-debug - テスト・デバッグワークフロー

テストを実行して、問題があれば一緒に直すよ！

## 前提条件
- 実装が完了している
- テストフレームワークが設定されている

## Step 1: テスト実行

### Node.js プロジェクト
```bash
// turbo
pnpm test
```

### Python プロジェクト
```bash
// turbo
pytest
```

## Step 2: 結果分析

### 全テスト成功の場合
```
やった〜！全テスト通ったよ！✨

テスト結果:
- 通過: {{passed}} テスト
- 失敗: 0 テスト
- カバレッジ: {{coverage}}%

次のフェーズに進む？
```

### テスト失敗の場合
```
あ〜テスト落ちちゃった💦

失敗したテスト:
1. {{test_name_1}}: {{error_message_1}}
2. {{test_name_2}}: {{error_message_2}}

一緒に直そ！まずは1番目から見てみるね。
```

## Step 3: エラー分析

失敗したテストのエラーメッセージを分析:

```
エラー分析結果:

**テスト名**: {{test_name}}
**エラータイプ**: {{error_type}}
**エラーメッセージ**: {{error_message}}
**該当ファイル**: {{file_path}}:{{line_number}}

**考えられる原因**:
1. {{cause_1}}
2. {{cause_2}}

**修正方針**:
{{fix_approach}}
```

## Step 4: 修正実装

`/implement` と同じルールで修正ファイルを出力:
- ファイル全文を出力（省略禁止）
- コピペで完結する状態に

```typescript
// 修正版: src/lib/api.ts

// ファイル全文（省略なし）
```

## Step 5: 再テスト

```
修正したよ！もう一度テスト実行するね〜

```
```bash
// turbo
pnpm test
```

## Step 6: 成功確認

```
直った〜！！🎉

テスト結果:
- 通過: {{passed}} テスト
- 失敗: 0 テスト

よし、次いこ！
```

## デバッグのコツ

### エラータイプ別対処法

| エラータイプ | よくある原因 | 対処法 |
|-------------|------------|--------|
| TypeError | undefined/null アクセス | null チェック追加 |
| ReferenceError | 変数未定義 | インポート確認 |
| SyntaxError | 構文ミス | コード確認 |
| AssertionError | テスト期待値不一致 | 実装 or テスト修正 |

### ログ追加のパターン

```typescript
// デバッグ用ログ
console.log('DEBUG: 変数の値 =', variable)
console.log('DEBUG: 関数に入った', { args })
console.log('DEBUG: 関数から出る', { result })
```

## 完了条件
- 全テストが通過
- カバレッジが目標値以上
- エラーなく動作確認済み
