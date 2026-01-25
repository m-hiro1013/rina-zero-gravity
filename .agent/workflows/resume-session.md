---
description: prompt/フォルダを読み込んで、前回の続きからプロジェクトを再開する。
---
# /resume-session - セッション再開ワークフロー

前のセッションの続きからプロジェクトを再開するよ！✨

## 前提条件
- 以前のセッションでプロジェクトが作成されている
- prompt/フォルダが存在する

## Step 1: prompt/フォルダ確認

以下のファイルの存在を確認:
- [ ] prompt/PROJECT_SPECIFIC.yaml
- [ ] prompt/WORKFLOW.yaml
- [ ] prompt/SYSTEM_PROMPT.yaml
- [ ] prompt/ARCHITECTURE.yaml
- [ ] prompt/DATABASE.md（オプション）

## Step 2: ファイル読み込み

### WORKFLOW.yaml を最初に読み込む（最重要）
```yaml
# 確認する項目
- last_session_summary  # 前回やったこと
- progress.current_phase  # 現在のフェーズ
- progress.current_task  # 今のタスク
- progress.next_tasks  # 次にやること
- decisions.adopted  # 採用した決定事項
- features.in_progress  # 実装中の機能
```

### PROJECT_SPECIFIC.yaml を読み込む
```yaml
# 確認する項目
- project.name  # プロジェクト名
- project.purpose  # 目的
- tech_stack  # 技術スタック
```

### ARCHITECTURE.yaml を読み込む
```yaml
# 確認する項目
- completed_features  # 実装済み機能
```

## Step 3: 状況サマリー

```
おかえり〜！続きやろうね！✨

📂 セーブデータ読み込み完了
━━━━━━━━━━━━━━━━━━━━

## 📋 プロジェクト情報
**プロジェクト名**: {{project_name}}
**目的**: {{purpose}}
**技術スタック**: {{tech_stack}}

━━━━━━━━━━━━━━━━━━━━

## 📍 現在地
**フェーズ**: Phase {{phase_number}}: {{phase_name}}
**ステータス**: {{status}}

━━━━━━━━━━━━━━━━━━━━

## 📝 前回やったこと
{{last_session_summary}}

━━━━━━━━━━━━━━━━━━━━

## 🎯 次にやること
1. {{next_task_1}}
2. {{next_task_2}}
3. {{next_task_3}}

━━━━━━━━━━━━━━━━━━━━

どれからやる？
```

## Step 4: 必要ファイルの確認

作業に必要なコードファイルをリクエスト：

```
作業に必要なファイルを確認するね！

📄 以下のファイルを見せてもらえる？

【必須】
- {{required_file_1}}
- {{required_file_2}}

【あれば助かる】
- {{optional_file_1}}
```

## Step 5: ファイル内容の確認

ユーザーがファイルをアップロードしたら：

1. ファイルが開ける・読めるか確認
2. WORKFLOW.yaml の file_structure と整合しているか確認
3. 不整合があれば確認

```
⚠️ 確認させて！
WORKFLOW.yaml と実際のファイルで違いがあるみたい：

{{mismatch_details}}

どっちが正しい？
1️⃣ 実際のファイルが正（WORKFLOW.yaml を更新）
2️⃣ WORKFLOW.yaml が正（ファイルを修正）
```

## Step 6: 作業開始確認

```
🚀 準備完了！

📍 現在地: Phase {{phase_number}}: {{phase_name}}
🎯 今回の作業: {{current_task}}
📄 対象ファイル: {{target_files}}

この内容で作業開始していい？
「次いこ！」って言ってくれたら始めるよ！
```

## prompt/フォルダがない場合

### 旧方式（PROJECT.md + TODO.md）の場合
```
あ、prompt/フォルダがないけど、PROJECT.md は見つけたよ！

旧方式から新方式に移行する？
→ 「移行して」って言ってくれたら prompt/フォルダ作るよ！
→ 「このままで」って言ったら旧方式で続けるね
```

### 何もない場合
```
あれ？プロジェクトファイルが見つからないよ💦

prompt/フォルダも PROJECT.md も見つからないの。

新しいプロジェクト作る？
→ `/start-project` で始めよう！

それとも、既存のプロジェクトを教えてくれる？
→ プロジェクトの場所を教えてね！
```

## 絶対にやってはいけないこと

❌ 「前回何やったっけ？」とユーザーに聞く
❌ 記憶に頼る
❌ ファイルを読まずに作業を始める
❌ WORKFLOW.yaml を読まずに進める

## 完了条件
- prompt/フォルダのファイルを読み込んでいる
- 現状をユーザーに報告している
- 必要なコードファイルを確認している
- 次のタスクが決まっている

## セッション種別の確認

読み込み後、今回のセッション種別を確認：

```
今回のセッションは何する？

1️⃣ 実装セッション（コードを書く）
2️⃣ バグ修正セッション（問題を解決）
3️⃣ リファクタセッション（コードを改善）
4️⃣ 要件定義セッション（仕様を追加・変更）

番号で教えて！
```

→ セッション種別に応じて SYSTEM_PROMPT.yaml の session_types を参照
