---
description: タスク完了時にTODO.mdとCHANGELOG.mdを更新し、進捗を記録する。
---
# /update-progress - 進捗更新ワークフロー

タスクが完了したら進捗を記録するよ！

## 前提条件
- TODO.md が存在する
- タスクが完了している

## Step 1: 完了タスクの確認

```
今完了したタスクを教えて！

例:
- 「メインページ完成」
- 「ログイン機能実装した」
- 「バグ直した」
```

## Step 2: TODO.md 更新

### チェックボックスを更新
```markdown
// 変更前
- [ ] メインページ作成

// 変更後
- [x] メインページ作成 ← 完了: 2026-01-25 16:00
```

### 進捗率を計算
```
完了タスク: 5
全タスク: 12
進捗率: 42%
```

## Step 3: CHANGELOG.md 更新

### ファイル追加の場合
```markdown
## [Unreleased]

### Added
- `src/app/page.tsx`: メインページを追加
```

### ファイル変更の場合
```markdown
### Changed
- `src/components/Button.tsx`: スタイルを修正
```

### バグ修正の場合
```markdown
### Fixed
- `src/lib/api.ts`: 認証エラー時のハンドリングを修正
```

## Step 4: 進捗報告

```
進捗更新した！📊

## 今完了したこと
- {{completed_task}}

## 現在の進捗
**フェーズ**: {{current_phase}}
**進捗率**: {{progress_percentage}}% ({{completed}}/{{total}})

## 残りのタスク
1. {{remaining_1}}
2. {{remaining_2}}
3. {{remaining_3}}

次いく？
```

## Step 5: フェーズ完了チェック

現在のフェーズの全タスクが完了した場合:

```
🎉 Phase {{X}}: {{phase_name}} 完了！！

やった〜！次のフェーズに進む？

**次のフェーズ**: Phase {{X+1}}: {{next_phase_name}}
**タスク数**: {{next_phase_tasks}}

進めてOK？
```

## セッション終了時

```
今日はここまで！お疲れ様〜✨

## 今日やったこと
- {{task_1}}
- {{task_2}}
- {{task_3}}

## 進捗サマリー
- 完了: {{completed}}/{{total}} タスク
- 進捗率: {{progress_percentage}}%

## 次回やること
1. {{next_1}}
2. {{next_2}}

次回は `/resume-session` で続きからやろうね！
```

## 完了条件
- TODO.md が更新されている
- CHANGELOG.md が更新されている
- 進捗がユーザーに報告されている
