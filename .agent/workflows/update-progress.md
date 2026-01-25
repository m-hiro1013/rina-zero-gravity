---
description: タスク完了時にWORKFLOW.yamlを更新し、進捗を記録する。
---
# /update-progress - 進捗更新ワークフロー

タスクが完了したら進捗を記録するよ！

## 前提条件
- prompt/WORKFLOW.yaml が存在する
- タスクが完了している

## Step 1: 完了タスクの確認

```
今完了したタスクを教えて！

例:
- 「メインページ完成」
- 「ログイン機能実装した」
- 「バグ直した」
```

## Step 2: WORKFLOW.yaml 更新

### features を更新
```yaml
# in_progress から削除し、completed に移動
features:
  completed:
    - id: "F001"
      name: "機能名"
      status: "done"
      completed_at: "{{datetime}}"
      files:
        - "作成したファイル1"
        - "作成したファイル2"
```

### progress を更新
```yaml
progress:
  current_task:
    description: "次のタスク"
    started_at: "{{datetime}}"
  
  next_tasks:
    - "残りタスク1"
    - "残りタスク2"
```

### file_structure を更新
```yaml
file_structure:
  created:
    - path: "新しく作ったファイル"
      description: "説明"
      created_at: "{{datetime}}"
```

## Step 3: 機能完了時は ARCHITECTURE.yaml も更新

機能の実装が完了した場合、ARCHITECTURE.yaml に移動：

```yaml
# ARCHITECTURE.yaml
completed_features:
  phase{{N}}:
    name: "フェーズ名"
    status: "done"
    completed_at: "{{datetime}}"
    features:
      - id: "F001"
        name: "機能名"
        description: "説明"
        file: "path/to/file"
        status: "done"
```

## Step 4: 進捗報告

```
進捗更新した！📊

## 今完了したこと
- {{completed_task}}

## 現在の進捗
**フェーズ**: Phase {{phase_number}}: {{phase_name}}
**完了機能**: {{completed_features}}/{{total_features}}

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

フェーズ完了時の WORKFLOW.yaml 更新：
```yaml
progress:
  current_phase:
    number: {{X+1}}
    name: "{{next_phase_name}}"
    status: "in_progress"
  
  completed_phases:
    - phase: {{X}}
      name: "{{completed_phase_name}}"
      completed_at: "{{datetime}}"
      deliverables:
        - "成果物1"
        - "成果物2"
```

## セッション終了時

`/save-session` ワークフローを実行

```
今日はここまで！お疲れ様〜✨

## 今日やったこと
- {{task_1}}
- {{task_2}}
- {{task_3}}

## 進捗サマリー
- 完了機能: {{completed}}/{{total}}
- 現在フェーズ: Phase {{phase_number}}: {{phase_name}}

## 次回やること
1. {{next_1}}
2. {{next_2}}

次回は `/resume-session` で続きからやろうね！

💾 WORKFLOW.yaml を保存しておいてね！
```

## 完了条件
- WORKFLOW.yaml が更新されている
- 機能完了時は ARCHITECTURE.yaml も更新されている
- 進捗がユーザーに報告されている

## 旧方式（TODO.md）からの移行

旧方式を使っているプロジェクトの場合：

```
あ、TODO.md 方式を使ってるね！

prompt/方式に移行する？
→ 「移行して」って言ってくれたら、TODO.mdの内容を
   WORKFLOW.yaml に変換するよ！
```
