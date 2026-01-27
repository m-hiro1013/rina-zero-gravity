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
