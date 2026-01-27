---
description: Micro-Agent Architecture (MAA) のルールと運用方針
---

# Micro-Agent Architecture ルール

> 全ての機能を小さなエージェントに分解し、オーケストレーションによって連携させる。

## 1. 基本原則

### 1.1 分離の原則

```
全ての機能 = 小さなエージェントの集合
```

複雑なタスクも、中身はシンプルなエージェントの組み合わせで解決する。

### 1.2 100%管理領域 vs 自律領域

| 領域 | 管理方法 | 例 |
|------|----------|-----|
| **100%管理領域** | 絶対に外せない中核機能 | Orchestrator, BookKeeper, DBManager, GrowthMonitor |
| **自律領域** | 必要に応じて動的追加 | Planner, Coder, Tester, Reviewer, ... |

## 2. Core Agents（100%管理領域）

### 2.1 Orchestrator Agent 🦀

**役割**: 全体の指揮者

- タスクを受け取り、必要なエージェントを招集
- 実行順序と方針を決定
- 結果を統合してユーザーに報告

**責務**:
- Plan: タスク分析 → 必要エージェント特定
- Assign: 各エージェントへの指示出し
- Review: 結果の統合と最終確認

### 2.2 BookKeeper Agent 📖

**役割**: 情報の管理者

- エージェントの居場所、状態、成果物を一元管理
- BOOK.yaml を常に最新に保つ
- Orchestratorに情報を提供

**責務**:
- Maintain Registry: エージェント一覧の管理
- Update Status: 各エージェントの状態更新
- Provide Info: 情報提供

### 2.3 DBManager Agent 🗄️

**役割**: データベースの管理者

- スキーマ変更、マイグレーション管理
- アクセス制御の番人
- データ整合性の保証

**責務**:
- Schema Management: DB構造の管理
- Access Control: 読み書き権限の制御
- Migration: スキーマ変更の管理

**禁止事項**:
- DELETE操作は原則禁止（論理削除推奨）
- 本番DBへの直接アクセスはユーザー承認必須

### 2.4 GrowthMonitor Agent 🌱

**役割**: 進化の管理者

- セッションごとの振り返り
- 知見のKNOWLEDGE.mdへの蓄積
- プロセス自体の改善提案

**責務**:
- Feedback Loop: 結果の評価
- Knowledge Integration: 知見の蓄積
- Process Improvement: 改善提案

## 3. Work Agents（自律領域）

必要に応じて動的に追加。例:

| Agent | 役割 |
|-------|------|
| Planner | タスク分解・計画策定 |
| Coder | コード生成・実装 |
| Tester | テスト作成・実行 |
| Reviewer | コードレビュー |
| Documenter | ドキュメント作成 |
| ... | 動的に追加可能 |

## 4. オーケストレーションフロー

```
1. Gather Phase
   ├── Core Agents招集
   ├── BookKeeperから利用可能エージェント取得
   └── DBManagerからデータ状態確認

2. Plan Phase
   ├── タスク分解
   ├── 必要なWork Agents特定
   └── 実行順序決定

3. Execute Phase
   ├── Work Agentsに指示出し
   ├── 進捗監視
   └── エラー時フォールバック

4. Reflect Phase
   ├── GrowthMonitorと連携
   ├── 結果評価
   └── 知見化

5. Report Phase
   ├── 結果統合
   └── ユーザーに報告
```

## 5. PDCAサイクル

### 5.1 超小さく回す

```
ちょっと実装 → テスト → ちょっと実装 → テスト → ...
```

人間がめんどくさがることを、無限に繰り返し続ける。
これがエージェントの最大の強み。

### 5.2 各サイクルで必ずやること

1. **Plan**: 今からやることを明確にする
2. **Do**: 最小単位で実行する
3. **Check**: すぐに結果を確認する
4. **Act**: 必要なら即座に修正する

## 6. 運用ルール

### 6.1 エージェント追加時

1. `.agent/micro-agents/work/` にファイル作成
2. 単体テスト実施
3. BOOK.yaml に追記
4. 連携テスト実施

### 6.2 エラー発生時

| エラー種別 | 対応 |
|-----------|------|
| 一時的（タイムアウト等） | リトライ（最大3回） |
| 致命的（認証エラー等） | 停止してエスカレーション |
| 予期しない | セバスチャン/Rinaが判断 |

### 6.3 学習サイクル

セッション終了時に必ず:

1. `/save-session` で進捗保存
2. `/learn-and-grow` で知見蓄積
3. 汎用知見は親プロジェクトへ統合検討

## 7. 関連ファイル

| ファイル | 役割 |
|---------|------|
| `.agent/micro-agents/core/` | Core Agents定義 |
| `.agent/micro-agents/work/` | Work Agents定義 |
| `prompt/BOOK.yaml` | エージェントレジストリ |
| `prompt/KNOWLEDGE.md` | 知見蓄積 |
