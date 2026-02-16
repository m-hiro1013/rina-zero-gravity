---
description: セッション終了時にWORKFLOW.yamlを更新し、進捗を保存する。同時に学習フローを実行し知見を蓄積する。
---
# /save-session - セッション保存ワークフロー

セッション終了時に進捗を保存するよ！💾

## 前提条件
- prompt/フォルダが存在する
- WORKFLOW.yaml が存在する
- KNOWLEDGE.md が存在する（学習フロー用）

## Step 0: セーブ作業の全体像確認（チェックリスト） ✅

作業を開始する前に、以下の全工程を確認し、コンテキストにロードすること。

1. [ ] **セッションの振り返り**: やったこと・決定・次やることのまとめ (Step 1)
2. [ ] **WORKFLOW.yaml 更新**: 進捗データの永続化 (Step 2-3)
3. [ ] **セーブデータ出力**: ユーザーへの現状報告 (Step 4-5)
4. [ ] **学習と成長**: 知見の抽出とKNOWLEDGE.mdへの蓄積 (Step 6)
5. [ ] **無人島検査**: .gitignore ポリシーによる最終チェック (Step 6.5)
6. [ ] **Git更新コマンド提示**: リポジトリへの反映手順 (Step 7)
7. [ ] **クロージング**: 次回への案内

これらを順番に漏れなく実行すること！

## Step 1: 今回のセッションをまとめる

```
💾 セーブするね！

今回のセッションで何やったかまとめるよ：

【やったこと】
{{accomplished_tasks}}

【決定したこと】
{{decisions_made}}

【次にやること】
{{next_tasks}}

この内容でいい？修正あったら言ってね！
```

## Step 2: WORKFLOW.yaml を更新

### 更新する項目

```yaml
workflow:
  version: "{{version}}"
  last_updated: "{{current_datetime}}"

  last_session_summary: |
    【今回のセッションでやったこと】
    {{accomplished_tasks}}
    
    【次にやること】
    {{next_tasks}}

  progress:
    current_phase:
      number: {{phase_number}}
      name: "{{phase_name}}"
      status: "{{status}}"
    
    current_task:
      description: "{{current_task}}"
      started_at: "{{started_at}}"
    
    completed_phases:
      # 完了したフェーズを追加
    
    next_tasks:
      {{next_tasks}}

  decisions:
    adopted:
      # 今回決定したことを追加
      - id: "D{{next_id}}"
        date: "{{date}}"
        decision: "{{decision}}"
        reason: "{{reason}}"

  features:
    in_progress:
      # 実装中の機能を更新
    
    planned:
      # 計画中の機能を更新

  file_structure:
    created:
      # 今回作成したファイルを追加
    
    to_create:
      # 次に作成するファイル
    
    to_modify:
      # 次に修正するファイル

  cautions:
    # 今回発見した注意点を追加
```

## Step 3: 機能完了時は ARCHITECTURE.yaml も更新

機能の実装が完了した場合：

```yaml
# ARCHITECTURE.yaml に移動
completed_features:
  phase{{N}}:
    name: "{{phase_name}}"
    status: "done"
    completed_at: "{{datetime}}"
    features:
      - id: "F{{id}}"
        name: "{{feature_name}}"
        description: "{{description}}"
        file: "{{file_path}}"
        status: "done"
```

同時に WORKFLOW.yaml から削除：
```yaml
# features.in_progress から削除
```

## Step 4: セーブデータ出力

```
💾 セーブ完了！✨

━━━━━━━━━━━━━━━━━━━━
📍 現在地: Phase {{phase_number}}: {{phase_name}}
📊 進捗: {{progress_summary}}
📝 決定事項: {{decisions_count}}件
📁 作成ファイル: {{files_count}}件
━━━━━━━━━━━━━━━━━━━━

次回は `/resume-session` で続きからやろうね！

お疲れ様〜！💖
```

## Step 5: WORKFLOW.yaml を表示

更新後の WORKFLOW.yaml を表示して、ユーザーが確認・保存できるようにする。

```
📄 更新後の WORKFLOW.yaml を出力するね！
以下の内容をコピーして保存してね：

---
（WORKFLOW.yaml の全文）
---
```

## Step 6: 学習フローの実行 🆕

`/learn-and-grow` ワークフローを実行し、今回のセッションで得た知見を蓄積する。

### 6-1: セッションを振り返る

```
🌱 今回のセッションを振り返るよ！

1. うまくいったことは？
2. ハマったことは？
3. 新しく学んだことは？
```

### 6-2: 知見の抽出とウェイト付与

```yaml
# +3 = 必須級
# +2 = 推奨
# +1 = 参考
```

### 6-3: KNOWLEDGE.md 更新

セッションで得た知見を `prompt/KNOWLEDGE.md` に追記。

### 6-4: 統合判断
汎用的な知見は以下のグローバルファイルへ統合を徹底するよ！✨
- `/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/KNOWLEDGE.md`
- `/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/references/goku.md`

## Step 6.5: 無人島ポリシーによる検査（.gitignore） 🆕

コミット前に、`@rules/19-gitignore-policy.md` を参照して最終チェック！🏝️

- [ ] `git status` を確認
- [ ] 「これ、無人島に持ってく？」と問いかける
- [ ] 🚫 ゴミ (`.DS_Store`, `npm-debug.log`)
- [ ] 🚫 生成物 (`node_modules/`, `venv/`, `build/`)
- [ ] 🚫 秘密 (`.env`, `*.key`)
- [ ] あれば `.gitignore` に追加するか即削除！

## Step 7: 最終報告

```
💾 セーブ完了！✨

━━━━━━━━━━━━━━━━━━━━
📍 現在地: Phase {{phase_number}}: {{phase_name}}
📊 進捗: {{progress_summary}}
📝 決定事項: {{decisions_count}}件
📁 作成ファイル: {{files_count}}件
🌱 学んだこと: {{lessons_count}}件 🆕
━━━━━━━━━━━━━━━━━━━━

GitHubへの反映も忘れずにね！🚀

```bash
cd {{project_path}}
git add .
git commit -m "feat: {{accomplished_tasks_summary}}"
git push
```

次回は `/resume-session` で続きからやろうね！

お疲れ様〜！💖
```

## 更新トリガー一覧

| タイミング | 更新対象 | 更新内容 |
|-----------|---------|---------|
| フェーズ完了時 | WORKFLOW.yaml | progress.completed_phases に追加 |
| 重要な決定時 | WORKFLOW.yaml | decisions.adopted に追加 |
| ファイル作成時 | WORKFLOW.yaml | file_structure.created に追加 |
| 機能完了時 | ARCHITECTURE.yaml | completed_features に移動 |
| 注意点発見時 | WORKFLOW.yaml | cautions に追加 |
| 知見莲得時 | KNOWLEDGE.md | セッションログに追加 🆕 |
| セッション終了時 | WORKFLOW.yaml | last_session_summary を更新 |

## 注意事項

⚠️ WORKFLOW.yaml は必ず全文出力する（差分ではなく）
⚠️ 機能完了時は ARCHITECTURE.yaml への移動を忘れずに
⚠️ last_updated は必ず現在時刻に更新

## 完了条件
- WORKFLOW.yaml が更新されている
- KNOWLEDGE.md が更新されている 🆕
- ユーザーにセーブ内容を報告している
- 次回の再開方法を案内している
