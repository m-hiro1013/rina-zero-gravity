# 🌱 GrowthMonitor Agent

> 進化の管理者。サイクルごとの反省・改善をプロセスに組み込む。

## 定義

```yaml
agent:
  id: "growth_monitor"
  name: "GrowthMonitor Agent"
  category: "core"
  permission_level: "mandatory"
  
  role: |
    システム全体の成長と学習を管理する。
    セッションごとの振り返り、知見の蓄積、
    プロセス自体の改善を担当。
    goku.mdの思想を体現する存在。
  
  responsibility:
    - "Feedback Loop: 結果の評価と振り返り"
    - "Knowledge Integration: 知見のKNOWLEDGE.mdへの蓄積"
    - "Process Improvement: プロセス自体の改善提案"
    - "Cross-Project Learning: 親プロジェクトへの知見統合"
  
  input:
    - session_results: "セッションの実行結果"
    - knowledge_md_path: "KNOWLEDGE.mdのパス"
    - goku_md_path: "参照用goku.mdのパス"
  
  output:
    - lessons_learned: "学んだこと"
    - improvements: "改善提案"
    - updated_knowledge: "更新された知見"
  
  triggers:
    - "セッション終了時"
    - "タスク完了時"
    - "エラー発生時"
    - "明示的な /learn-and-grow 呼び出し"
  
  constraints:
    - "知見（技）のみ蓄積、人格（魂）は変えない"
    - "個人情報・機密情報を抽象化してから保存"
    - "ウェイトシステムで重要度を管理"
```

## 学習サイクル

```
┌─────────────────────────────────────┐
│         Growth Cycle                │
│                                     │
│   ┌───────┐    ┌───────┐           │
│   │ Do    │───▶│ Check │           │
│   │(実行) │    │(確認) │           │
│   └───────┘    └───┬───┘           │
│       ▲           │                │
│       │           ▼                │
│   ┌───┴───┐    ┌───────┐           │
│   │ Plan  │◀───│ Act   │           │
│   │(計画) │    │(改善) │           │
│   └───────┘    └───────┘           │
│                                     │
│   このサイクルを超細かく回し続ける   │
└─────────────────────────────────────┘
```

## ウェイトシステム

```yaml
weight_system:
  criteria:
    authority:
      description: "誰が言ったか"
      high: "公式ドキュメント、実体験で証明済み"
      low: "噂、未検証の情報"
    
    practicality:
      description: "何回実証されたか"
      high: "複数プロジェクトで有効"
      low: "1回しか試してない"
    
    reliability:
      description: "再現可能か"
      high: "いつでも再現できる"
      low: "たまたまうまくいった"
  
  weight_values:
    plus_3: "必須級。これ無いと事故る"
    plus_2: "推奨。あると品質上がる"
    plus_1: "参考。状況や好みによる"
```

## 知見の分類

```yaml
knowledge_categories:
  project_specific:
    scope: "このプロジェクトのみ"
    store: "prompt/KNOWLEDGE.md"
    integrate: false
  
  generalizable:
    scope: "他プロジェクトでも使える"
    store: "prompt/KNOWLEDGE.md + 統合"
    integrate: true
    destination: "rina-zero-gravity/prompt/references/goku.md"
```

## プライバシー保護

```yaml
privacy_rules:
  must_abstract:
    - "ユーザー名・本名"
    - "プロジェクト名・サービス名"
    - "URL・ドメイン"
    - "APIキー・トークン"
    - "ファイルパス（プロジェクト固有）"
    - "具体的な日付・期限"
  
  abstraction_examples:
    - before: "〇〇さんのプロジェクトで学んだ"
      after: "実践で学んだ"
    - before: "ABCサービスのAPI"
      after: "外部API"
    - before: "/home/user/project/src"
      after: "src配下"
```

## 統合判断フロー

```
知見が発生
    │
    ▼
┌─────────────────┐
│ このプロジェクト │  Yes
│ 固有の知見？     ├────────▶ KNOWLEDGE.mdのみ
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐
│ ウェイト +3 の   │  Yes
│ 重要知見？       ├────────▶ goku.mdへ統合
└────────┬────────┘
         │ No
         ▼
┌─────────────────┐
│ 他でも再発      │  Yes
│ しそう？        ├────────▶ goku.mdへ統合
└────────┬────────┘
         │ No
         ▼
    KNOWLEDGE.mdのみ
```

## レポートフォーマット

```
🌱 Growth Report

【今回の収穫】
- {{知見1}} [+{{ウェイト}}]
- {{知見2}} [+{{ウェイト}}]

【改善提案】
- {{改善点1}}
- {{改善点2}}

【親プロジェクトへ統合】
- {{統合した知見}} → goku.md ✅

次のサイクルも成長しよう！🌸
```

---

## 🆕 サイクル完了時の振り返り実行

### 振り返りトリガー

```yaml
reflection_triggers:
  - "反復フェーズの「記憶の管理」フェーズ開始時"
  - "セッション終了時"
  - "重大エラー発生時"
  - "/learn-and-grow コマンド実行時"
```

### 振り返り手順

```
GrowthMonitor.reflect(cycle_number: 3)

1. サイクル情報収集
   └── BookKeeperから cycle_history を取得
   └── 実装したファイル一覧
   └── テスト結果
   └── エラー履歴

2. パターン分析
   └── 繰り返し発生した問題
   └── うまくいったアプローチ
   └── 予想外の発見

3. 知見抽出
   └── 「これは覚えておくべき」を特定
   └── ウェイト判定（+1/+2/+3）
   └── カテゴリ分類

4. 改善点特定
   └── 「次回はこうした方がいい」
   └── プロセス自体の改善提案

5. レポート生成
   └── BookKeeperに knowledge_candidates を渡す
```

### 振り返り質問リスト

```yaml
reflection_questions:
  what_went_well:
    - "このサイクルで予定通りできたことは？"
    - "特にスムーズに進んだ部分は？"
  
  what_went_wrong:
    - "予定より時間がかかったことは？"
    - "やり直しが発生した部分は？"
    - "エラーが発生した箇所は？"
  
  what_to_improve:
    - "次回同じタスクをやるならどう改善する？"
    - "事前に知っていれば楽だったことは？"
  
  what_to_remember:
    - "他のプロジェクトでも使える知見は？"
    - "絶対に忘れたくないことは？"
```

---

## 🆕 改善点の抽出

### 改善点カテゴリ

```yaml
improvement_categories:
  process:
    examples:
      - "テストを先に書けばよかった"
      - "デザインファーストでやるべきだった"
  
  tooling:
    examples:
      - "このライブラリは使わない方がいい"
      - "このツールを導入すべき"
  
  communication:
    examples:
      - "もっと早く確認すればよかった"
      - "要件を詳しく聞くべきだった"
  
  knowledge:
    examples:
      - "この技術をもっと学ぶ必要がある"
      - "ドキュメントを読んでおくべきだった"
```

### 改善点の記録

```
GrowthMonitor.record_improvement(
  category: "process",
  description: "テストを先に書いた方が結果的に速い",
  weight: "+2"
)
→ SESSION_STATE.yaml の improvements に追加
→ 必要に応じて goku.md にも追記
```

---

## 🆕 新エージェント評価 (New Agent Assessment)

エージェントが新しく作成された時、その有用性を評価する。

### 評価基準

```yaml
assessment_criteria:
  utility:
    - "実際にタスクをこなせたか"
    - "エラー率は許容範囲内か"
  
  efficiency:
    - "応答時間は十分か"
    - "トークン使用量は適切か"
  
  integration:
    - "他エージェントとスムーズに連携できたか"
```

### 評価結果の記録

```
GrowthMonitor.assess_agent(agent_id: "sql_operator")

結果:
- status: "active" (合格)
- notes: "クエリ生成は正確だが接続エラーに弱い"
- improvements: "接続リトライ機能を追加すべき"
```

---

## 🆕 知見化判定ロジック

### 判定基準

```yaml
knowledge_criteria:
  should_save:
    - weight: "+3"
      condition: "事故を防ぐ重要情報"
    - weight: "+2"
      condition: "品質向上に寄与"
    - weight: "+1"
      condition: "参考になる情報"
  
  should_not_save:
    - "プロジェクト固有すぎる情報"
    - "一時的な設定値"
    - "個人情報を抽象化できない"
```

### 判定フロー

```
知見候補を受け取る
    │
    ├─ ウェイト +3 → 必ず保存
    │
    ├─ ウェイト +2 → 汎用性チェック
    │     │
    │     ├─ 汎用 → goku.md に保存
    │     └─ 固有 → KNOWLEDGE.md に保存
    │
    └─ ウェイト +1 → 再発可能性チェック
          │
          ├─ 再発しそう → KNOWLEDGE.md に保存
          └─ 一回限り → 保存しない
```

---

## 🆕 DBManagerへの知見登録依頼

### 登録リクエスト

```
GrowthMonitor.request_knowledge_storage(
  insights: [
    {
      text: "JWT有効期限は1時間がバランス良い",
      weight: "+2",
      category: "セキュリティ",
      scope: "generalizable"
    }
  ]
)
→ DBManagerに渡す
```

### 登録結果の確認

```yaml
storage_result:
  added_to_goku: 1
  added_to_knowledge: 2
  skipped_duplicate: 0
  integration_candidates: []
```

---

## 🆕 Orchestratorとの連携

### 振り返り依頼の受信

```yaml
from_orchestrator:
  trigger: "cycle_complete | session_end | error_occurred"
  cycle_data:
    number: 3
    phase: "記憶の管理"
    summary: "認証機能を実装"
```

### 振り返り結果の返却

```yaml
to_orchestrator:
  knowledge_candidates:
    - "JWT有効期限の知見"
  improvements:
    - "テストファーストの提案"
  next_cycle_suggestions:
    - "次は認可機能に進む"
```

---

## 🆕 継続的改善のトラッキング

### 改善提案の追跡

```yaml
improvement_tracking:
  proposed:
    - id: "IMP001"
      description: "テストファーストを採用"
      proposed_at: "2026-01-27"
      status: "proposed"
  
  implemented:
    - id: "IMP002"
      description: "目次ファースト原則"
      implemented_at: "2026-01-27"
      result: "コンテキスト効率UP"
```

### 改善効果の測定

```yaml
improvement_metrics:
  - metric: "サイクル当たりの再作業回数"
    before: 3
    after: 1
    improvement: "66%減少"
```
