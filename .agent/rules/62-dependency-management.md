---
description: 依存関係の解決と再帰的管理ルール。
---

# 依存関係管理ルール (Dependency Management Rules)

> 複雑な問題も、小さな問題の積み重ね。
> 依存を解きほぐせば、すべてはシンプルになる。

## 概要

このルールは、エージェント作成時に発生する依存関係の解決手順と、再帰的な作成プロセスの管理方法を定義する。

---

## 1. 依存関係の定義 (Definition)

エージェントAがエージェントBを必要とする場合、「AはBに依存する」と言う。

**例**:
- `SQLOperator` は `ConnectionManager` に依存する。
- `Reviewer` は `Tester` の結果に依存する。

## 2. 解決原則 (Resolution Principle)

**Bottom-Up Creation**: 依存される側（葉）から先に作成する。

```
Task: Aを作りたい
  Dependency: Bが必要
    Dependency: Cが必要
```

**実行順序**:
1. Cを作成
2. Bを作成 (Cを使用)
3. Aを作成 (Bを使用)

---

## 3. 再帰的管理 (Recursive Management)

### スタック構造

依存関係の解決をスタックで管理する。

```yaml
dependency_stack:
  - id: "task_1"
    agent: "ChatApp"
    status: "pending"
    waiting_for: "SQLOperator"
  
  - id: "task_2"
    agent: "SQLOperator"
    status: "pending"
    waiting_for: "ConnectionManager"
  
  - id: "task_3"
    agent: "ConnectionManager"
    status: "in_progress"
    waiting_for: null
```

### 状態遷移

1. **Push**: 依存が見つかったら、現在のタスクを中断し、依存タスクをスタックに積む。
2. **Execute**: スタックの一番上（葉）を実行する。
3. **Pop**: 完了したらスタックから取り除き、待っていたタスクを再開する。

---

## 4. 安全装置 (Safety)

### 循環参照の禁止

A → B → A のような循環依存は禁止する。検知したらエラーとして報告し、設計を見直す。

### 深度制限

再帰の深さは **3階層** までとする。それ以上深くなる場合は、アーキテクチャが複雑すぎる可能性があるため、ユーザーに確認を求める。

---

## 5. PLAN見直し (Re-Planning)

再帰が発生するたびに、Orchestratorは計画を見直す。

1. **追加タスク**: 依存エージェント作成タスクを追加。
2. **見積もり更新**: 全体の完了サイクル数を再計算。
3. **ユーザー報告**: 計画変更をユーザーに伝える。

---

## 6. 目的の保持 (Purpose Retention)

再帰が深くなっても、**本来の目的（Original Commit）** を忘れてはならない。
`SESSION_STATE.yaml` に常に記録し続ける。

```yaml
context:
  original_goal: "チャットアプリ作成"
  current_action: "ConnectionManager作成"
  reason: "SQLOperatorのため"
```
