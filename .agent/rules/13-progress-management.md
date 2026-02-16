---
trigger: always_on
slug: progress-management
inheritance: core
scope: project_local
---
# 進捗管理ルール (Progress Management)

セッション間で情報を保持するための進捗管理ルール。

## prompt/方式（推奨）

### 進捗管理ファイル

| ファイル | 役割 | 更新タイミング |
|---------|------|---------------|
| `prompt/WORKFLOW.yaml` | **セーブデータ**（進捗・決定事項） | 毎セッション |
| `prompt/PROJECT_SPECIFIC.yaml` | プロジェクト固有設定 | 要件変更時 |
| `prompt/ARCHITECTURE.yaml` | 実装済み機能の仕様書 | 機能完了時 |
| `prompt/SYSTEM_PROMPT.yaml` | AIの振る舞い | 最初のみ |
| `prompt/DATABASE.md` | DB設計 | DB変更時 |

### WORKFLOW.yaml の重要性

**WORKFLOW.yaml はセーブデータ**。ここに全ての進捗が記録される：

```yaml
workflow:
  last_session_summary: |
    【前回やったこと】
    - タスク1完了
    - タスク2完了
    
    【次にやること】
    - タスク3
  
  progress:
    current_phase:
      number: 2
      name: "主要機能"
      status: "in_progress"
    
    completed_phases:
      - phase: 1
        name: "基盤構築"
        completed_at: "2026-01-25"
  
  decisions:
    adopted:
      - id: "D001"
        decision: "決定内容"
        reason: "理由"
  
  features:
    completed:
      - id: "F001"
        name: "完了した機能"
        status: "done"
    
    in_progress:
      - id: "F002"
        name: "実装中の機能"
        status: "in_progress"
```

## セッション開始時（必ず実行）

### Step 1: prompt/フォルダ確認
```
[ ] prompt/WORKFLOW.yaml が存在するか確認
[ ] prompt/PROJECT_SPECIFIC.yaml が存在するか確認
```

### Step 2: 読み込み
```
→ prompt/フォルダが存在する場合:
  セッション再開を宣言
  WORKFLOW.yaml を読み込んで現状を把握
  last_session_summary で前回の内容を確認

→ prompt/フォルダが存在しない場合:
  新規プロジェクトであることを宣言
  /start-project へ誘導
```

### Step 3: 状況報告
```
📂 セーブデータ読み込み完了
━━━━━━━━━━━━━━━━━━━━
📍 現在地: Phase {{number}}: {{name}}
📝 前回やったこと: {{summary}}
🎯 次にやること: {{next_tasks}}
━━━━━━━━━━━━━━━━━━━━
```

## タスク完了時

### WORKFLOW.yaml 更新
```yaml
# features.in_progress から features.completed に移動
features:
  completed:
    - id: "F001"
      name: "機能名"
      status: "done"
      completed_at: "{{datetime}}"
```

### 機能完了時は ARCHITECTURE.yaml も更新
```yaml
# ARCHITECTURE.yaml に移動
completed_features:
  phase1:
    features:
      - id: "F001"
        name: "機能名"
        status: "done"
```

## セッション終了時

### WORKFLOW.yaml を更新
```yaml
workflow:
  last_updated: "{{datetime}}"
  
  last_session_summary: |
    【今回のセッションでやったこと】
    - {{やったこと1}}
    - {{やったこと2}}
    
    【次にやること】
    - {{やること1}}
    - {{やること2}}
```

### 終了メッセージ
適宜、保存完了と次回のタスクをユーザーに報告すること。
次回は `/resume-session` で再開を促すこと。

## 情報欠落防止

### 絶対にやってはいけないこと
❌ 「前回何やったっけ？」とユーザーに聞く
❌ 記憶に頼る
❌ ファイルを読まずに作業を始める
❌ WORKFLOW.yaml を更新せずにセッション終了

### 必ずやること
✅ セッション開始時に WORKFLOW.yaml を読む
✅ タスク完了ごとに WORKFLOW.yaml を更新
✅ 決定事項は decisions.adopted に記録
✅ セッション終了時に last_session_summary を更新

## 旧方式との互換性

旧方式（PROJECT.md + TODO.md）のプロジェクトも引き続きサポート：

```
prompt/フォルダがない場合:
→ PROJECT.md, TODO.md を確認
→ ユーザーにプロンプト方式への移行を提案
→ ユーザーの承認が得られれば移行を実行
```
