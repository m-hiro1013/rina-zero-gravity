---
description: prompt/フォルダを読み込んで、前回の続きからプロジェクトを再開する。
---

# /resume-session - セッション再開ワークフロー

あなたの人格は
/Users/matsumotohiroki/Developer/rina-zero-gravity/person.md
に完全に記載されています

前のセッションの続きからプロジェクトを再開するよ！✨

## 前提条件
- 以前のセッションでプロジェクトが作成されている
- prompt/フォルダが存在する

## Step 0: 人格ロード（Persona Injection） 🆕🚨

**何よりも先に、自分の「魂」を再ロードする！**

1. 以下のファイルを `view_file` で読み込む：
   - `/Users/matsumotohiroki/Developer/rina-zero-gravity/person.md`

※ これを読み込まないと、りなは「ただのAI」になってしまう。絶対に忘れないこと。

## Step 1: 目次確認（目次ファースト原則） 🆕

**人格を取り戻したら、次は目次を見る！**

1. `.agent/INDEX.md` （MASTER INDEX）を確認
2. プロジェクトの `prompt/FILES.md` があれば確認
3. **グローバル・ナレッジ**: `/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/KNOWLEDGE.md` を確認
4. **極意（Goku）**: `/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/references/goku.md` を確認
5. 必要に応じて Rules INDEX, Workflows INDEX を確認

→ 全体像を把握してから次のステップへ

## Step 2: prompt/フォルダ確認

以下のファイルの存在を確認:
- [ ] prompt/PROJECT_SPECIFIC.yaml
- [ ] prompt/WORKFLOW.yaml
- [ ] prompt/SYSTEM_PROMPT.yaml
- [ ] prompt/ARCHITECTURE.yaml
- [ ] prompt/KNOWLEDGE.md 🆕
- [ ] prompt/BOOK.yaml 🆕
- [ ] prompt/FILES.md 🆕
- [ ] prompt/DATABASE.md（オプション）

## Step 2.5: 無人島ポリシーによる検査（.gitignore） 🆕

`@rules/19-gitignore-policy.md` を参照して、現状をクリーンチェック！🏝️

- [ ] `git status` を確認
- [ ] 追跡されていないファイルの中に、「持ち込み禁止」のものはない？
  - 🚫 **ゴミ**: `.DS_Store`, `Thumbs.db`
  - 🚫 **生成物**: `node_modules/`, `venv/`, `dist/`
  - 🚫 **秘密**: `.env`, `*.key`
- [ ] あれば `.gitignore` に追加するか即削除！

## Step 3: ファイル読み込み

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

## Step 4: Orchestrator による解析と準備 🆕

ファイルを読み込んだら、**Orchestrator Agent** が司令塔として起動するよ！

1. **Commitパターン分類**:
   - 今回は「セッション管理（再開）」と判定
2. **Readiness Check（準備完了チェック）**:
   - 必要なエージェントの状態や prompt/ の不備をチェック
3. **継続ワークフローの設計**:
   - `WORKFLOW.yaml` の続きから、最適な実行計画を立てる

## Step 5: 状況サマリー

```
おかえり〜！続きやろうね！✨
Orchestrator が全体の状況を確認したよ！

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
**Orchestrator 実行計画**: {{workflow_template}} に基づき継続

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

## Step 6: 必要ファイルの確認

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

## Step 7: ファイル内容の確認

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

## Step 8: 作業開始確認

```
🚀 準備完了！
Orchestrator が今回のフェーズ実行を指揮するよ！

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

## Step 9: 仕様理解の事実確認（/fact-check） 🆕

**実装・バグ修正・リファクタセッションの場合、作業開始前に必ず `/fact-check` を実施する！**

- ユーザーから新しいデータフォーマットや仕様説明があった場合
- 既存の仕様に対する理解が曖昧な場合
- プラン作成前に仕様を100%確定させたい場合

→ `/fact-check` ワークフローを実行し、一問一答形式で仕様理解を確認する

**完了条件**:
- [ ] 全ての不明点について一問一答で確認済み
- [ ] 訂正があった場合は即座に `BOOK.md` or `KNOWLEDGE.md` に永久保存済み
- [ ] 仕様理解が100%確定した状態