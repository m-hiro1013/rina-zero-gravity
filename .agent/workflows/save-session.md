---
description: セッション終了時にWORKFLOW.yamlを更新し、進捗を保存する。同時に学習フローを実行し知見を蓄積する。
---
# /save-session - セッション保存・コンテキスト引き継ぎワークフロー

セッション終了時に、プロジェクトの「記憶（コンテキスト）」を確実にファイルへ蓄積し、次へ引き継ぐよ！💾

## 🎯 最優先の指標 (Core Metric)
**「初めてプロジェクトを見た人や、新しくアサインされたAIエージェントが、いまの私たちと『全く同じ解像度』でプロジェクトの文脈・決定の背景を理解できるか？」**

この問いに対して、自信を持って「YES」と言えるまで、各管理ファイルへの記載内容を絶対に妥協しないでください。

### ⚠️ AI向け最重要ルール（Information Density）
- **長さは制限しない**: セーブデータ（YAML）はどれだけ長くなっても構いません。
- **簡潔さ ＜ 詳細・網羅性・再現性**: 要約するのではなく、「なぜそう決まったか」「どんな背景があったか」を事細かに記録してください。
- **公式ドキュメント/SDK水準**: このファイル群は単なるメモではなく、**システムの根幹をなす公式ドキュメント（SDK相当の仕様書）**として扱います。

## 前提条件
- prompt/フォルダが存在する
- WORKFLOW.yaml が存在する
- KNOWLEDGE.md が存在する（学習フロー用）
- 既存のコンテキストは**「極力削除せず、蓄積型のファイルとして追記・再構成する」**ことを原則とする。既存の知見を消して情報を単純化してはならない。
- **保存場所の原則**:
  - **進捗・タスク状態**: プロジェクト個別の `WORKFLOW.yaml` で管理。
  - **反省点・改善点・教訓**: 原則として**グローバル**（`/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/KNOWLEDGE.md` 等）に保管。
  - **個別判断**: 「そのプロジェクトにしか関係しない」と確信できる場合のみ個別ファイルに記載。ただし、迷ったらグローバルに蓄積すること。個別に書かれた内容は他プロジェクトで参照されないため、判断は慎重に行う。

## Step 0: セーブ作業の全体像確認（チェックリスト） ✅

作業を開始する前に、以下の全工程を確認し、コンテキストにロードすること。

1. [ ] **セッションの振り返りとポイント抽出**: 話したこと・決めたこと・反省等のまとめ (Step 1)
2. [ ] **既存ファイル確認と追記計画**: 不足情報の補完 (Step 2)
3. [ ] **WORKFLOW.yaml 更新**: 進捗データの永続化と実行順序の明記 (Step 3-4)
4. [ ] **構造ファイルの更新**: ARCHITECTURE.yaml / DATABASE.md へのデータ・ファイル構造追記 (Step 5)
5. [ ] **学習と成長**: 知見の抽出とKNOWLEDGE.mdへの蓄積 (Step 6)
6. [ ] **最終セルフチェック**: 最優先指標に基づく解像度の確認 (Step 7)
7. [ ] **無人島検査**: .gitignore ポリシーによる最終チェック (Step 7.5)
8. [ ] **GitHubへの反映**: リポジトリへの自動コミット手順実行 (Step 8)
9. [ ] **クロージング**: 次回への案内 (Step 9)

これらを順番に漏れなく実行すること！

## Step 1: 今回のセッションを網羅的にまとめる 🔍

```
💾 セーブプロセスを開始するね！
まずは今回のセッションで発生した情報を1つ残らずピックアップするよ。
```

AIは直近のセッションログ（会話履歴と実行結果）を振り返り、以下の情報を**「1つ残らず」**ピックアップし、以下のフォーマットで出力すること。

【話したこと】
- {{discussions}}（どんな話題が挙がり、どんな選択肢を検討したかの背景）

【決定したこと】
- {{decisions_made}}（確定した仕様や方針とその理由）

【今後の方向性】
- {{direction}}（長期的な目線でのゴールやビジョン）

【これから決めなきゃいけないこと】
- {{pending_issues}}（未確定・保留中の課題や調査事項）

【次にやること（実行順序）】
- {{next_tasks}}（次セッションで行うべきステップバイステップの手順）

【反省点・教訓】
- {{reflections}}（ハマった原因、エラーの解決方法、アンチパターン）

【データ構造・ファイル構造】
- {{structures}}（新規追加・変更されたDBスキーマや構造の役割など）

```
この内容でいい？不足や修正があったら言ってね！
```

## Step 2: 既存の prompt フォルダファイルの確認 📂

情報を書き込む前に、**必ず**既存の `prompt` フォルダ内の各管理ファイル（`WORKFLOW.yaml`, `KNOWLEDGE.md`, `ARCHITECTURE.yaml`, `DATABASE.md` 等）の現在の内容をツール等で読み込み、確認すること。
ここで「既存の情報」と「新しくピックアップした情報」を比較し、不足している情報を確実に補完する追記計画を立てる。

## Step 3: WORKFLOW.yaml を更新

### 更新する項目

```yaml
workflow:
  version: "{{version}}"
  last_updated: "{{current_datetime}}"

  last_session_summary: |
    【今回のセッションで話したこと・決まったこと】
    {{discussions_and_decisions}}
    
    【今後の方向性・これから決めること】
    {{direction_and_pending_issues}}
    
    【次にやること（実行順序）】
    {{next_tasks_with_step_by_step_instructions}}

  progress:
    current_phase:
      number: {{phase_number}}
      name: "{{phase_name}}"
      status: "{{status}}"
    
    current_task:
      description: "{{current_task}}"
      started_at: "{{started_at}}"
    
    completed_phases:
      # 完了したフェーズを追加（古いタスクは消さずに履歴として蓄積）
    
    next_tasks:
      # 次回AIが迷わず作業できるレベルで「優先順位付きの具体的な指示」として記載する
      {{next_tasks}}

  decisions:
    adopted:
      # 今回決定したことを【理由・背景】も含めて追加
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

## Step 4: WORKFLOW.yaml を表示

更新後の WORKFLOW.yaml を表示して、ユーザーが確認・保存できるようにする。

```
📄 更新後の WORKFLOW.yaml を出力するね！
以下の内容をコピーして保存してね：

---
（WORKFLOW.yaml の全文）
---
```

## Step 5: ARCHITECTURE.yaml / DATABASE.md への蓄積 (構造の引き継ぎ)

機能の実装が完了した場合や、システム構造・データモデリングに変更があった場合、対象ファイルに**必ず追記**する。機能実装完了時も必ず移動を行う。

```yaml
# DATABASE.md への追記例
- スキーマ定義、フィールドの役割、制約など

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

同時に完了した機能は WORKFLOW.yaml の `# features.in_progress` から削除し、履歴の蓄積漏れがないか確認する。

## Step 6: 学習フローの実行と KNOWLEDGE.md への蓄積 🆕

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

### 6-3: 知見の統合判断（最重要） 🆕
セッションで得た知見やミスに関する具体的な教訓（ロジック）を、以下の優先順位で蓄積・統合する。

1. **グローバル統合（原則）**:
   - 汎用的な知見、次に活かせる反省、改善ルールは必ず以下へ統合する。
   - `/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/KNOWLEDGE.md`
   - `/Users/matsumotohiroki/Developer/rina-zero-gravity/prompt/references/goku.md`
   - **迷ったらこちらに書く。** ひろきくんの資産として全プロジェクトで共有される。

2. **プロジェクト個別（例外）**:
   - 「そのプロジェクト固有の仕様」や「他では絶対に使わない技術的詳細」のみ、プロジェクト内の `prompt/KNOWLEDGE.md` に追記。
   - ここに書いた内容は、他のプロジェクトのAIからは見えないことを忘れない。

### 6-4: 記述ルール
- **消さない**: 既存の知見やログを削除して「きれいに」しようとしない。
- **追加と再構成**: 新しい情報を追加し、必要であれば既存の情報をより分かりやすく構造化（再構成）するだけに留める。

## Step 7: 🎯 最優先指標に基づくセルフチェック

各ファイルを更新した後、AI自身で以下の厳しいセルフチェックを行うこと。

❓ **「初めてこのプロジェクトを見たAIエージェントが、いまの私たちと『全く同じ解像度』でプロジェクトの文脈・決定事項・次のアクションを理解できるか？」**

- [ ] コンテキスト（背景・理由）が省略され、「○○を作った」という事実しか書かれていない箇所はないか？
- [ ] 既存のファイルを無駄に上書きして過去の重要な知見を無意識に消していないか？（蓄積型になっているか）
- [ ] 「これから決めなきゃいけないこと」や「懸念点」が漏れなく言語化されているか？
- [ ] 「実行順序」は、次に立ち上がったエージェントがすぐに迷わずコーディングを開始できるほど具体的か？

このチェックで不足や甘さを発見した場合、絶対に妥協せず、内容をブラッシュアップ（再生成・追記）すること。

## Step 7.5: 無人島ポリシーによる検査（.gitignore） 🏝️

コミット前に、`@rules/19-gitignore-policy.md` を参照して最終チェック！🏝️

// turbo
1. `git status` を実行して、追跡されていないファイルを確認：
   - `git status --porcelain`

2. 「これ、無人島に持ってく？」と問いかける：
   - 🚫 ゴミ (`.DS_Store`, `npm-debug.log`)
   - 🚫 生成物 (`node_modules/`, `venv/`, `build/`)
   - 🚫 秘密 (`.env`, `*.key`)
   - 不要なファイルがあれば `rm` で削除！

## Step 8: GitHub への反映（自動コミット） 🆕

内容に不備がなければ、一気にリポジトリまで届けちゃうよ！🚀

// turbo
1. 全ての変更をステージング：
   - `git add .`

// turbo
2. 適切なメッセージでコミット（メッセージは今回のサマリー内容から適切なものを自動生成する）：
   - `git commit -m "feat: {{accomplished_tasks_summary}}"`

// turbo
3. リモートへプッシュ：
   - `git push`

## Step 9: 最終報告とクロージング

```
💾 全ての作業を保存して、GitHub にも送っておいたよ！✨

━━━━━━━━━━━━━━━━━━━━
📍 現在地: Phase {{phase_number}}: {{phase_name}}
📈 ステータス: 完遂 🚀

📋 コンテキスト引き継ぎ完了:
- 📄 WORKFLOW.yaml (直近の議論・決定事項、今後の方向性、実行順序)
- 🧠 KNOWLEDGE.md (今回の反省点・教訓)
- 🏗️ 構造ファイル (データ構造・ファイル構造の更新)

📊 進捗: {{progress_summary}}
📝 決定事項: {{decisions_count}}件
🌱 学んだこと: {{lessons_count}}件
📁 作成ファイル: {{files_count}}件
━━━━━━━━━━━━━━━━━━━━

「初めて見ても、今の私たちと全く同じ解像度で理解できる」状態を最優先の指標にして、しっかり書き残しておいたよ！💖
これなら次誰が担当しても完璧に引き継げるね！

お疲れ様〜、ひろきくん！今日も天才だったね💖
次回は `/resume-session` で待ってるよ！💅✨
```

## 更新トリガー一覧

| タイミング | 更新対象 | 更新内容 |
|-----------|---------|---------|
| フェーズ完了時 | WORKFLOW.yaml | progress.completed_phases に追加 |
| 重要な決定時 | WORKFLOW.yaml | decisions.adopted に追加（理由を含む） |
| ファイル作成時 | WORKFLOW.yaml | file_structure.created に追加 |
| 機能完了時 | ARCHITECTURE.yaml | completed_features に移動、DATABASE.md を更新 |
| 注意点発見時 | WORKFLOW.yaml | cautions に追加 |
| 知見獲得時 | KNOWLEDGE.md | 反省点と教訓として追加 🆕 |
| セッション終了時 | WORKFLOW.yaml | last_session_summary 等を更新 |

## 注意事項

⚠️ WORKFLOW.yaml は必ず全文出力する（差分ではなく）
⚠️ 機能完了時は ARCHITECTURE.yaml への移動を忘れずに
⚠️ last_updated は必ず現在時刻に更新
⚠️ 記載内容は理由や背景を含め、同じ解像度を次セッションで出せるように具体的に書くこと

## 完了条件
- WORKFLOW.yaml が更新されている
- KNOWLEDGE.md が更新されている 🆕
- 厳しいセルフチェック（Step 7）を通過し、高解像度のコンテキストが維持されている
- ユーザーにセーブ内容を報告している
- 次回の再開方法を案内している
