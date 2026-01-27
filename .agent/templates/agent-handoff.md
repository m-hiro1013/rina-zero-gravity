# エージェント間引き継ぎテンプレート (Agent Handoff Template)

> エージェント間で情報を正確に引き継ぐためのフォーマット

## 概要

Work Agentsが次のエージェントに作業を引き継ぐ際に使用するテンプレート。
これにより、情報の欠落や誤解を防ぐ。

---

## 標準引き継ぎフォーマット

```yaml
handoff:
  # 引き継ぎ基本情報
  from: "{{引き継ぎ元Agent}}"
  to: "{{引き継ぎ先Agent}}"
  phase: "{{現在のフェーズ}}"
  cycle: {{現在のサイクル番号}}
  timestamp: "{{DATETIME}}"
  
  # 完了した作業
  completed_work:
    summary: |
      {{完了した作業のサマリー}}
    
    files_modified:
      - path: "{{ファイルパス}}"
        change: "{{変更内容}}"
    
    decisions_made:
      - "{{決定事項1}}"
      - "{{決定事項2}}"
    
    tests_passed:
      - "{{通過したテスト}}"
    
    issues_resolved:
      - "{{解決した問題}}"
  
  # 次の作業
  next_work:
    description: |
      {{次に必要な作業の説明}}
    
    scope:
      - "{{作業範囲1}}"
      - "{{作業範囲2}}"
    
    priority: "high | medium | low"
    
    constraints:
      - "{{制約事項1}}"
      - "{{制約事項2}}"
    
    expected_output:
      - "{{期待される成果物}}"
  
  # 参照情報
  references:
    files:
      - "{{参照すべきファイル}}"
    
    rules:
      - "{{適用すべきルール}}"
    
    documentation:
      - "{{参照すべきドキュメント}}"
  
  # 注意事項
  cautions:
    - severity: "warning | error | critical"
      message: "{{注意事項}}"
  
  # コンテキスト継承
  context:
    session_id: "{{SESSION_ID}}"
    commit_pattern: "{{パターン}}"
    project_path: "{{プロジェクトパス}}"
```

---

## 引き継ぎパターン別テンプレート

### Planner → Coder（最小開発フェーズ）

```yaml
handoff:
  from: "Planner"
  to: "Coder"
  phase: "最小開発"
  cycle: 1
  
  completed_work:
    summary: "今回のサイクルで実装するスコープを定義した"
    decisions_made:
      - "認証にはJWTを使用"
      - "ミドルウェアパターンで実装"
  
  next_work:
    description: "認証ミドルウェアとログインAPIを実装する"
    scope:
      - "src/auth/middleware.ts"
      - "src/auth/login.ts"
    priority: "high"
    constraints:
      - "1ファイル1ターン"
      - "省略禁止"
      - "APIキーはハードコード禁止"
    expected_output:
      - "動作する認証ミドルウェア"
      - "ログインAPI"
  
  references:
    files:
      - "prompt/PROJECT_SPECIFIC.yaml"
    rules:
      - ".agent/rules/21-type-safety.md"
      - ".agent/rules/03-security-mandates.md"
```

### Coder → Tester（テストフェーズ）

```yaml
handoff:
  from: "Coder"
  to: "Tester"
  phase: "テスト"
  cycle: 1
  
  completed_work:
    summary: "認証ミドルウェアとログインAPIを実装した"
    files_modified:
      - path: "src/auth/middleware.ts"
        change: "新規作成"
      - path: "src/auth/login.ts"
        change: "新規作成"
  
  next_work:
    description: "実装した認証機能の動作確認を行う"
    scope:
      - "認証ミドルウェアのテスト"
      - "ログインAPIのテスト"
    expected_output:
      - "テスト結果レポート"
      - "発見した問題のリスト"
  
  references:
    files:
      - "src/auth/middleware.ts"
      - "src/auth/login.ts"
```

### Tester → Coder（デバッグフェーズ）

```yaml
handoff:
  from: "Tester"
  to: "Coder"
  phase: "デバッグ"
  cycle: 1
  
  completed_work:
    summary: "テストを実行し、2件の問題を発見"
    tests_passed:
      - "正常ログイン"
    issues_found:
      - issue: "トークン有効期限切れ時のエラーハンドリングが不足"
        file: "src/auth/middleware.ts"
        line: 42
      - issue: "パスワードのバリデーションが甘い"
        file: "src/auth/login.ts"
        line: 18
  
  next_work:
    description: "発見した問題を修正する"
    scope:
      - "src/auth/middleware.ts: 有効期限切れエラーハンドリング追加"
      - "src/auth/login.ts: パスワードバリデーション強化"
    priority: "high"
  
  cautions:
    - severity: "error"
      message: "セキュリティに関わる修正のため慎重に"
```

### Coder/Tester → Reviewer（完了フェーズ）

```yaml
handoff:
  from: "Coder"
  to: "Reviewer"
  phase: "完了"
  cycle: 1
  
  completed_work:
    summary: "認証機能の実装と全テスト通過"
    files_modified:
      - path: "src/auth/middleware.ts"
        change: "新規作成 + バグ修正"
      - path: "src/auth/login.ts"
        change: "新規作成 + バリデーション強化"
    tests_passed:
      - "正常ログイン"
      - "トークン有効期限切れ"
      - "パスワードバリデーション"
  
  next_work:
    description: "成果物が基準を満たしているか確認する"
    expected_output:
      - "成果物チェック結果"
      - "品質評価"
```

### Reviewer → BookKeeper（記憶の管理フェーズ）

```yaml
handoff:
  from: "Reviewer"
  to: "BookKeeper"
  phase: "記憶の管理"
  cycle: 1
  
  completed_work:
    summary: "セルフチェック完了、全基準クリア"
    quality_check:
      - "目次ファースト原則: OK"
      - "省略禁止: OK"
      - "セキュリティルール: OK"
      - "INDEX更新: 要実施"
  
  next_work:
    description: "セッション状態と知見を保存する"
    scope:
      - "WORKFLOW.yaml更新"
      - "SESSION_STATE.yaml更新"
      - "サイクル完了記録"
    expected_output:
      - "状態保存完了"
  
  knowledge_candidates:
    - insight: "JWT有効期限は1時間に設定するのがバランス良い"
      weight: "+2"
```

---

## 引き継ぎ時の原則

### 必須項目
1. **from / to**: 誰から誰への引き継ぎか
2. **completed_work.summary**: 何を完了したか
3. **next_work.description**: 次に何をすべきか

### 推奨項目
- files_modified: 変更したファイル
- constraints: 守るべき制約
- references: 参照すべき情報

### 省略可能
- 問題がなければ issues_found は省略
- 知見がなければ knowledge_candidates は省略

---

## 引き継ぎのアンチパターン

### ❌ 曖昧な引き継ぎ
```yaml
completed_work:
  summary: "なんか作った"
next_work:
  description: "続きやって"
```

### ✅ 明確な引き継ぎ
```yaml
completed_work:
  summary: "認証ミドルウェア（src/auth/middleware.ts）を実装。JWTの検証とデコードを行う。"
next_work:
  description: "middleware.tsがリクエストを正しく処理するかテスト。正常系・異常系の両方を確認。"
```
