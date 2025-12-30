---
description: GA-Workspaceの設定が正しく構成されているか健全性をチェックする。
---
# 健全性チェック (Health Check)

**目的**: GA-Workspaceの運用性と可用性を維持するための定期チェック。

---

## Step 1: 構造チェック // turbo
必須ディレクトリとファイルの存在を確認せよ：

```bash
echo "=== ディレクトリ構造 ==="
ls -la ZG_PROJECT/<プロジェクト名>/.agent/rules/ 2>/dev/null || echo "❌ rules/ not found"
ls -la ZG_PROJECT/<プロジェクト名>/.agent/workflows/ 2>/dev/null || echo "❌ workflows/ not found"
```

### 必須ファイルチェック
| ファイル | 状態 |
|----------|------|
| `ZG_PROJECT/<プロジェクト名>/.agent/rules/00-ga-workspace-definition.md` | ✅/❌ |
| `ZG_PROJECT/<プロジェクト名>/.agent/rules/01-stack.md` | ✅/❌ |
| `ZG_PROJECT/<プロジェクト名>/.agent/rules/02-security-mandates.md` | ✅/❌ |
| `ZG_PROJECT/<プロジェクト名>/.agent/workflows/create-rule.md` | ✅/❌ |
| `ZG_PROJECT/<プロジェクト名>/.agent/workflows/create-workflow.md` | ✅/❌ |

## Step 2: YAML構文チェック // turbo
各ルール・ワークフローのフロントマターが正しいか検証せよ：

```bash
for f in ZG_PROJECT/<プロジェクト名>/.agent/rules/*.md ZG_PROJECT/<プロジェクト名>/.agent/workflows/*.md; do
  head -20 "$f" | grep -E "^(trigger|description|slug):" || echo "⚠️ $f: missing frontmatter"
done
```

### チェック項目
- `---` で囲まれたフロントマターが存在するか
- ルール: `trigger` フィールドが存在するか
- ワークフロー: `description` フィールドが存在するか

## Step 3: 参照整合性チェック
`@path/to/file.md` 形式の参照が解決可能か確認せよ：

```bash
grep -r "@.*\.md" ZG_PROJECT/<プロジェクト名>/.agent/ | while read line; do
  ref=$(echo "$line" | grep -oE "@[^ ]+\.md")
  # 参照先が存在するか確認
done
```

## Step 4: 重複・矛盾チェック
以下を検出せよ：

### 重複チェック
- 同じ `slug` を持つルールが複数存在しないか
- 同じ名前のワークフローが存在しないか

### 矛盾チェック
- `always_on` ルール間で相反する指示がないか
- 例: 「タブを使え」と「スペースを使え」

## Step 5: 依存関係チェック
ワークフロー間の呼び出し関係を検証せよ：

```
/verify-code
├── /lint-check ✅ 存在
├── /type-check ✅ 存在
└── /run-tests ✅ 存在
```

呼び出し先が存在しない場合は警告を出力。

## Step 6: 循環参照チェック
ワークフローの循環呼び出しがないか確認せよ：

```
❌ 循環検出: /a → /b → /c → /a
```

## Step 7: 結果レポート
健全性チェックの結果を報告せよ：

```
## GA-Workspace 健全性レポート 🏥

チェック日時: <timestamp>

### 構造 
- ディレクトリ: ✅ OK
- 必須ファイル: ✅ 5/5

### 構文
- ルール: ✅ <N>ファイル OK
- ワークフロー: ✅ <M>ファイル OK

### 整合性
- 参照解決: ✅ OK
- 重複: ✅ なし
- 矛盾: ⚠️ 1件の警告

### 依存関係
- 未解決の呼び出し: ✅ なし
- 循環参照: ✅ なし

---
**総合判定**: ✅ HEALTHY / ⚠️ WARNINGS (<N>件) / ❌ UNHEALTHY
```

## Step 8: 修復提案（問題検出時）
問題が検出された場合、修復手順を提案せよ：

```
### 検出された問題と修復手順

1. **❌ stack.md が存在しない**
   → `/create-rule` を実行して作成

2. **⚠️ /deploy-staging が存在しない呼び出しを含む**
   → 呼び出し先を作成するか、参照を修正
```
