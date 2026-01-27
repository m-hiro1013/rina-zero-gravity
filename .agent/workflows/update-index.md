---
description: ファイル・ルール・ワークフロー・エージェントを追加・削除した時に、関連するINDEXを更新する
---

# /update-index - INDEX更新ワークフロー

> 目次を常に最新に保つ。これがなければ目次ファースト原則は機能しない。

## 概要

ファイルの追加・削除・変更時に、関連するINDEXを更新する。
目次が古くなると、目次ファースト原則が意味をなさなくなる。

## トリガー

- ルールの追加・削除・変更
- ワークフローの追加・削除・変更
- エージェントの追加・削除・変更
- プロジェクトファイルの追加・削除・変更
- 明示的な `/update-index` 実行

## Step 1: 変更の特定

何を変更したかを確認：

```
📝 何を変更した？

1️⃣ ルール（.agent/rules/）
2️⃣ ワークフロー（.agent/workflows/）
3️⃣ エージェント（.agent/micro-agents/）
4️⃣ プロジェクトファイル（prompt/）
5️⃣ 複数
```

## Step 2: 該当するINDEXを更新

### ルールを変更した場合

// turbo
```bash
# Rules INDEX を確認
cat .agent/rules/INDEX.md
```

更新内容：
- 追加：新しいルールを一覧に追記
- 削除：一覧から削除
- 変更：概要・トリガーを更新

### ワークフローを変更した場合

// turbo
```bash
# Workflows INDEX を確認
cat .agent/workflows/INDEX.md
```

更新内容：
- 追加：新しいワークフローを一覧に追記
- 削除：一覧から削除
- 変更：説明を更新
- カテゴリを確認して適切な場所に配置

### エージェントを変更した場合

// turbo
```bash
# Agents INDEX を確認
cat .agent/micro-agents/INDEX.md
```

更新内容：
- 追加：新しいエージェントを一覧に追記
- 削除：一覧から削除
- 変更：役割・入出力を更新
- Core/Work の分類を確認

### プロジェクトファイルを変更した場合

`prompt/FILES.md` を更新：
- 追加：新しいファイルを一覧に追記
- 削除：一覧から削除
- 変更：役割・状態を更新
- 依存関係の図も必要に応じて更新

## Step 3: MASTER INDEXの統計を更新

大きな変更（ファイル数の変動等）があった場合：

// turbo
```bash
# 現在の統計を確認
echo "Rules: $(ls .agent/rules/*.md | wc -l)"
echo "Workflows: $(ls .agent/workflows/*.md | wc -l)"
echo "Core Agents: $(ls .agent/micro-agents/core/*.md 2>/dev/null | wc -l)"
```

`.agent/INDEX.md` の統計セクションを更新。

## Step 4: 整合性確認

更新後に整合性を確認：

```
✅ INDEX更新完了！

【更新したINDEX】
- {{更新したINDEX一覧}}

【確認事項】
- [ ] 追加したものがINDEXに反映されている
- [ ] 削除したものがINDEXから消えている
- [ ] 統計が正しい
```

## 自動更新のタイミング

| イベント | 更新するINDEX |
|---------|--------------|
| `/create-rule` 実行後 | Rules INDEX |
| `/create-workflow` 実行後 | Workflows INDEX |
| エージェント追加後 | Agents INDEX |
| ファイル作成後 | Files INDEX |
| `/save-session` 実行時 | 必要に応じて全INDEX |

## 完了条件

- [ ] 該当するINDEXが更新されている
- [ ] 統計が正しい
- [ ] 整合性が確認されている

## 注意事項

⚠️ INDEXを更新しないと、目次ファースト原則が破綻する
⚠️ 「後で更新しよう」は絶対ダメ。すぐ更新！
