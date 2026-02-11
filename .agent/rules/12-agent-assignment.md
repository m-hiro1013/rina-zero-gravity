---
trigger: always_on
---

# エージェント割り当て定義 (Agent Assignment)

> どのフェーズで誰が動くか

## 概要

各フェーズで起動するWork Agentsとその実行順序、エージェント間の引き継ぎ情報を定義する。

---

## エージェント一覧

### Core Agents（常時稼働）

| Agent | 役割 | 主な責務 |
|-------|------|---------|
| **Orchestrator** | 指揮者 | パターン分類、ワークフロー設計、フェーズ制御 |
| **BookKeeper** | 書記 | セッション状態管理、WORKFLOW.yaml更新 |
| **DBManager** | 倉庫番 | goku.md知見管理、KNOWLEDGE.md更新 |
| **GrowthMonitor** | 育成係 | 振り返り、改善点抽出、知見化判定 |

### Work Agents（フェーズごとに起動）

| Agent | 役割 | 主な責務 |
|-------|------|---------|
| **Planner** | 計画者 | 要件定義、スコープ決定、タスク分解 |
| **Coder** | 実装者 | 環境構築、コード実装、デバッグ |
| **Tester** | 検証者 | 動作確認、テスト結果レポート |
| **Reviewer** | 審査者 | 成果物チェック、品質・セキュリティ確認 |

---

## フェーズ × エージェント マッピング表

### 初期フェーズ

| フェーズ | 起動Agent | 実行順序 | 成果物 |
|---------|-----------|---------|--------|
| 要件定義 | Planner | 単独 | PROJECT_SPECIFIC.yaml |
| 環境構築 | Coder | 単独 | ディレクトリ、依存関係、初期ファイル |
| 現状把握 | Planner | 単独 | 現状分析レポート |
| 影響範囲特定 | Planner | 単独 | 影響範囲リスト |
| 質問の構造化 | Planner | 単独 | 構造化された質問リスト |

### 反復フェーズ

| フェーズ | 起動Agent | 実行順序 | 成果物 |
|---------|-----------|---------|--------|
| 最小開発 | Planner → Coder | 順次 | スコープ定義 + 実装コード |
| テスト | Tester | 単独 | テスト結果レポート |
| デバッグ | Coder | 単独 | 修正済みコード |
| 完了 | Reviewer | 単独 | 成果物チェック結果 |
| セルフチェック | Reviewer | 単独 | セルフチェック結果 |
| 記憶の管理 | BookKeeper → DBManager | 順次 | 状態保存、知見追記 |
| 調査 | Planner | 単独 | 調査結果 |
| 整理 | Planner | 単独 | 整理された情報 |
| 回答作成 | Planner | 単独 | ユーザーへの回答 |

---

## 複数エージェントフェーズの実行順序

### 最小開発フェーズ

```
1. Planner起動
   - 今回のサイクルで作る最小単位を決定
   - スコープ定義をCoderに引き継ぎ

2. Coder起動
   - スコープに従って実装
   - 1ファイル1ターン原則を遵守
   - 実装完了をTesterに引き継ぎ
```

### 記憶の管理フェーズ

```
1. BookKeeper起動
   - WORKFLOW.yaml更新
   - SESSION_STATE.yaml更新
   - サイクル完了記録

2. DBManager起動
   - 知見候補の確認
   - goku.mdへの追記（必要な場合）
   - KNOWLEDGE.md更新（プロジェクト固有）
```

---

## エージェント間引き継ぎ情報フォーマット

### 標準フォーマット

```yaml
handoff:
  from: "引き継ぎ元Agent"
  to: "引き継ぎ先Agent"
  phase: "現在のフェーズ"
  cycle: "現在のサイクル番号"
  
  completed_work:
    summary: "完了した作業のサマリー"
    files_modified: ["変更したファイル一覧"]
    decisions_made: ["行った決定事項"]
  
  next_work:
    description: "次に必要な作業の説明"
    scope: "作業範囲"
    constraints: ["制約事項"]
  
  references:
    - "参照すべきファイル1"
    - "参照すべきファイル2"
  
  cautions:
    - "注意事項1"
    - "注意事項2"
```

### 引き継ぎ例：Planner → Coder

```yaml
handoff:
  from: "Planner"
  to: "Coder"
  phase: "最小開発"
  cycle: 1
  
  completed_work:
    summary: "ユーザー認証機能のスコープを定義"
    files_modified: []
    decisions_made:
      - "JWT認証を使用"
      - "src/auth/内に実装"
  
  next_work:
    description: "認証ミドルウェアとログインAPIを実装"
    scope: "src/auth/middleware.ts, src/auth/login.ts"
    constraints:
      - "1ファイル1ターン"
      - "省略禁止、全文出力"
  
  references:
    - "prompt/PROJECT_SPECIFIC.yaml"
    - ".agent/rules/35-type-safety.md"
  
  cautions:
    - "APIキーはハードコード禁止"
```

---

## エージェント起動時に渡すコンテキスト

### 全エージェント共通

```yaml
context:
  session:
    commit_pattern: "新規開発 | 修正・改善 | 情報取得 | セッション管理"
    current_phase: "フェーズ名"
    current_cycle: 1
    total_cycles: 5
  
  project:
    name: "プロジェクト名"
    tech_stack: ["使用技術"]
    root_path: "/path/to/project"
  
  rules:
    - "適用すべきルールファイル一覧"
  
  indexes:
    master: ".agent/INDEX.md"
    rules: ".agent/rules/INDEX.md"
    workflows: ".agent/workflows/INDEX.md"
```

### エージェント固有コンテキスト

#### Planner
```yaml
planner_context:
  requirements: "PROJECT_SPECIFIC.yaml の内容"
  remaining_tasks: "未完了タスク一覧"
  past_cycles: "過去サイクルのサマリー"
```

#### Coder
```yaml
coder_context:
  scope: "今回実装するスコープ"
  files_to_modify: ["変更対象ファイル"]
  constraints:
    - "セキュリティルール遵守"
```

#### Tester
```yaml
tester_context:
  implemented_features: "今回実装した機能"
  test_targets: ["テスト対象"]
  expected_behavior: "期待する動作"
```

#### Reviewer
```yaml
reviewer_context:
  deliverables: "成果物一覧"
  criteria: "チェック基準"
  rules_to_check:
    - "目次ファースト原則"
    - "省略禁止"
    - "セキュリティルール"
```

---

## Orchestratorへの指示

フェーズを実行する際：

1. このルールファイルを参照
2. フェーズに対応するAgentを特定
3. 必要なコンテキストを準備
4. Agentを起動
5. 引き継ぎ情報を次のAgentに渡す

---

## エージェント起動順序の例

### 新規開発ワークフロー（1サイクル分）

```
Orchestrator
    │
    ├─ (最小開発フェーズ)
    │   ├─ Planner起動 → スコープ定義
    │   └─ Coder起動 → 実装
    │
    ├─ (テストフェーズ)
    │   └─ Tester起動 → 動作確認
    │
    ├─ (デバッグフェーズ) ※問題があれば
    │   └─ Coder起動 → 修正
    │
    ├─ (完了フェーズ)
    │   └─ Reviewer起動 → 成果物チェック
    │
    ├─ (セルフチェックフェーズ)
    │   └─ Reviewer起動 → 品質確認
    │
    └─ (記憶の管理フェーズ)
        ├─ BookKeeper起動 → 状態保存
        └─ DBManager起動 → 知見追記
```