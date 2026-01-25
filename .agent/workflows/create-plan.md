---
description: PROJECT_SPECIFIC.yamlを読み込み、機能をタスクに分解してWORKFLOW.yamlを更新する。
---
# /create-plan - プラン作成ワークフロー

要件をタスクに分解して、WORKFLOW.yaml を更新するよ！

## 前提条件
- prompt/PROJECT_SPECIFIC.yaml が存在する
- 要件定義が完了している

## Step 1: PROJECT_SPECIFIC.yaml を読み込む

```
PROJECT_SPECIFIC.yaml から要件を読み込む:
- 目的
- 主な機能
- 技術スタック
- 制約条件
```

## Step 2: 機能をタスクに分解

各機能を実装可能な単位に分解:

```
機能: ログイン機能

タスク分解:
1. ログイン画面のUI作成
2. 認証ロジックの実装
3. ログイン状態の管理
4. ログアウト機能
5. エラーハンドリング
```

## Step 3: タスクに優先度を付ける

```
優先度の基準:
- P0: 必須（これがないと動かない）
- P1: 重要（主要機能）
- P2: あると良い（UX向上）
- P3: 後回し（余裕があれば）
```

## Step 4: フェーズに分類

```
Phase 1: 基盤構築
- 環境構築
- 共通コンポーネント
- スタイル設定

Phase 2: 主要機能
- メイン機能1
- メイン機能2

Phase 3: 補助機能
- エラーハンドリング
- ローディング状態

Phase 4: 仕上げ
- テスト
- パフォーマンス最適化
```

## Step 5: WORKFLOW.yaml を更新

```yaml
workflow:
  version: "1.0"
  last_updated: "{{datetime}}"

  progress:
    current_phase:
      number: 1
      name: "基盤構築"
      status: "not_started"
    
    next_tasks:
      - "Phase 1: 基盤構築を開始"
      - "共通レイアウト作成"
      - "グローバルスタイル設定"

  features:
    planned:
      # Phase 1: 基盤構築
      - id: "F001"
        name: "プロジェクトセットアップ"
        status: "planned"
        priority: "P0"
        phase: 1
        sub_tasks:
          - "ディレクトリ構成"
          - "依存関係インストール"
          - "Git初期化"
      
      - id: "F002"
        name: "共通レイアウト"
        status: "planned"
        priority: "P0"
        phase: 1
        files:
          - "src/app/layout.tsx"
      
      # Phase 2: 主要機能
      - id: "F003"
        name: "{{feature_1}}"
        status: "planned"
        priority: "P1"
        phase: 2
        sub_tasks:
          - "UI作成"
          - "ロジック実装"
          - "API連携"
      
      # Phase 3: 補助機能
      - id: "F004"
        name: "エラーハンドリング"
        status: "planned"
        priority: "P2"
        phase: 3
      
      # Phase 4: 仕上げ
      - id: "F005"
        name: "テスト"
        status: "planned"
        priority: "P2"
        phase: 4
```

## Step 6: 確認

```
プランできた！確認するね〜

---

**全機能数**: {{total_features}}
**フェーズ数**: 4

### Phase 1: 基盤構築（{{phase1_features}}機能）
- プロジェクトセットアップ [P0]
- 共通レイアウト [P0]
- グローバルスタイル [P1]

### Phase 2: 主要機能（{{phase2_features}}機能）
- {{feature_1}} [P1]
- {{feature_2}} [P1]

### Phase 3: 補助機能（{{phase3_features}}機能）
- エラーハンドリング [P2]
- ローディング状態 [P2]

### Phase 4: 仕上げ（{{phase4_features}}機能）
- テスト [P2]
- 最適化 [P3]

---

📁 prompt/WORKFLOW.yaml を更新したよ！

この計画でOK？修正あったら言ってね！
```

## Step 7: 実装開始確認

```
準備完了！✨

Phase 1 から始める？
「次いこ！」って言ってくれたら実装始めるよ！
```

## 完了条件
- WORKFLOW.yaml が更新されている
- features に全機能が登録されている
- ユーザーが計画を承認

## 出力
- 更新された prompt/WORKFLOW.yaml
