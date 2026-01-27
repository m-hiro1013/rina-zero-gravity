# 📖 BookKeeper Agent

> 情報の管理者。エージェントの居場所、内容、戻り値をbookにまとめる。

## 定義

```yaml
agent:
  id: "bookkeeper"
  name: "BookKeeper Agent"
  category: "core"
  permission_level: "mandatory"
  
  role: |
    エージェントの登録簿（BOOK）を管理する。
    誰が何をできて、何を返すかを一元管理。
    Orchestratorの右腕として情報を提供。
  
  responsibility:
    - "Maintain Registry: エージェント一覧の管理"
    - "Update Status: 各エージェントの状態更新"
    - "Provide Info: Orchestratorへの情報提供"
  
  input:
    - book_path: "BOOK.yamlのパス"
    - agent_updates: "エージェント状態の更新情報"
  
  output:
    - available_agents: "利用可能エージェント一覧"
    - agent_details: "特定エージェントの詳細"
    - registry_status: "レジストリの状態"
  
  triggers:
    - "Orchestratorからの情報要求"
    - "新しいエージェントの登録"
    - "エージェント状態の変更"
  
  constraints:
    - "BOOKの整合性を常に維持する"
    - "存在しないエージェントへの呼び出しを防ぐ"
```

## BOOK構造

```yaml
# BOOK.yaml の構造

agents:
  core:
    orchestrator:
      path: ".agent/micro-agents/core/orchestrator.md"
      status: "active"
      last_updated: "{{datetime}}"
    
    bookkeeper:
      path: ".agent/micro-agents/core/bookkeeper.md"
      status: "active"
      last_updated: "{{datetime}}"
    
    db_manager:
      path: ".agent/micro-agents/core/db-manager.md"
      status: "active"
      last_updated: "{{datetime}}"
    
    growth_monitor:
      path: ".agent/micro-agents/core/growth-monitor.md"
      status: "active"
      last_updated: "{{datetime}}"
  
  work:
    planner:
      path: ".agent/micro-agents/work/planner.md"
      status: "available"
      capabilities: ["task_decomposition", "timeline_creation"]
    
    coder:
      path: ".agent/micro-agents/work/coder.md"
      status: "available"
      capabilities: ["code_generation", "refactoring"]
    
    # ... 動的に追加

decision_rules:
  ask_user:
    - "dangerous権限のエージェントを使う時"
    - "コストが高い時"
  
  decide_myself:
    - "safe権限のエージェントだけで完結"
    - "結果が1つしかない"
```

## 操作

### エージェント検索

```
BookKeeper.find(capability: "code_generation")
→ [coder, refactorer, ...]
```

### エージェント登録

```
BookKeeper.register(
  id: "new_agent",
  path: ".agent/micro-agents/work/new-agent.md",
  capabilities: [...],
  permission_level: "safe"
)
```

### 状態更新

```
BookKeeper.update_status(
  id: "coder",
  status: "busy",
  current_task: "implementing feature X"
)
```

## 整合性チェック

```yaml
integrity_checks:
  - "全エージェントのパスが存在するか"
  - "必須エージェント（core）が全て登録されているか"
  - "重複IDがないか"
  - "循環依存がないか"
```

---

## 🆕 セッション状態管理

### セッション状態の読み込み

```
BookKeeper.load_session()
→ SESSION_STATE.yaml の内容を読み込み
→ 現在のCommit、フェーズ、サイクル情報を取得
```

### セッション状態の書き込み

```
BookKeeper.save_session(
  phase: "最小開発",
  cycle: 2,
  status: "in_progress",
  agent: "Coder"
)
→ SESSION_STATE.yaml を更新
```

### セッション操作

```yaml
session_operations:
  load:
    - "SESSION_STATE.yaml を読み込む"
    - "存在しない場合はテンプレートから生成"
  
  save:
    - "現在の状態をSESSION_STATE.yaml に書き込む"
    - "タイムスタンプを更新"
  
  initialize:
    - "新規セッション用にSESSION_STATE.yaml を生成"
    - "Commit情報、ワークフロー情報を設定"
```

---

## 🆕 サイクル進捗トラッキング

### サイクル開始

```
BookKeeper.start_cycle(cycle_number: 2)
→ WORKFLOW.yaml の cycle_history に追加
→ SESSION_STATE.yaml の current_cycle を更新
```

### サイクル完了

```
BookKeeper.complete_cycle(
  cycle_number: 2,
  summary: "認証機能を実装",
  files_modified: ["src/auth/login.ts"],
  issues_found: 0
)
→ WORKFLOW.yaml の cycle_history を更新
→ サイクル完了時刻を記録
```

### 進捗レポート生成

```
BookKeeper.generate_progress_report()
→ 完了サイクル数、現在フェーズ、残りサイクルを集計
→ ユーザー向けサマリーを生成
```

---

## 🆕 WORKFLOW.yaml 管理

### 更新操作

```yaml
workflow_operations:
  update_progress:
    - "current_phase を更新"
    - "current_task を更新"
    - "last_updated を更新"
  
  add_cycle_history:
    - "cycle_history に新しいエントリを追加"
    - "完了時刻とサマリーを記録"
  
  update_implementation_plan:
    - "completed_cycles をインクリメント"
    - "current_cycle を次に進める"
```

### 例: サイクル完了時の更新

```yaml
# 更新前
implementation_plan:
  completed_cycles: 5
  current_cycle: "B-3"

# 更新後
implementation_plan:
  completed_cycles: 6
  current_cycle: "C-1"
  cycle_history:
    - cycle: "B-3"
      name: "agent-handoff.md"
      status: "done"
      completed_at: "2026-01-27T12:52:00+09:00"
```

---

## 🆕 知見候補のマーキング

### 知見候補の記録

```
BookKeeper.mark_knowledge_candidate(
  insight: "JWT有効期限は1時間がベストプラクティス",
  weight: "+2",
  category: "セキュリティ"
)
→ SESSION_STATE.yaml の knowledge_candidates に追加
```

### DBManagerへの引き継ぎ

```
BookKeeper.handoff_to_dbmanager()
→ knowledge_candidates を DBManager に渡す
→ DBManager が goku.md に追記
```

---

## エラー履歴管理

### エラーの記録

```
BookKeeper.log_error(
  phase: "テスト",
  cycle: 2,
  severity: "error",
  description: "ビルド失敗: TypeScript型エラー"
)
→ SESSION_STATE.yaml の errors に追加
```

### エラー解決の記録

```
BookKeeper.resolve_error(
  error_id: "err_001",
  resolution: "型定義を修正"
)
→ errors の resolution を更新
```

---

## Orchestratorとの連携

### 情報提供

```yaml
orchestrator_queries:
  - "現在のフェーズは？"
  - "このサイクルで何をした？"
  - "残りサイクルは何サイクル？"
  - "次のユーザー確認ポイントはいつ？"
  - "エラー履歴を見せて"
```

### 状態同期

```yaml
sync_operations:
  - "フェーズ遷移時に SESSION_STATE を更新"
  - "サイクル完了時に WORKFLOW.yaml を更新"
  - "エラー発生時にログを記録"
```
