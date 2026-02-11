---
trigger: model_decision
description: ファイル・ルール・ワークフロー・エージェントを追加・削除した時に、関連するINDEXを更新するためのルールだよ！整合性は命✨
slug: index-update
inheritance: core
scope: global
---

# INDEX更新ルール (Index Update Rules)

> INDEXは常に真実を語らなければならない。
> 嘘つきのINDEXは、システム全体を混乱させる。

## 概要

このルールは、INDEX群の整合性を保つため、更新プロセスとメンテナンスの責務を定義する。
特にAgents INDEX (`.agent/micro-agents/INDEX.md`) は、自己成長において最も重要である。

---

## 1. 基本原則 (Fundamental Principles)

- **即時更新**: エージェント作成・変更・削除時は、**即座に**INDEXを更新する。
- **後回し禁止**: INDEX更新を後回しにすることは許されない（`// turbo-all` でもスキップ不可）。
- **正確性**: INDEXの内容は、実体と完全に一致していなければならない。

---

## 2. 更新対象 (Update Targets)

### Agents INDEX

- **パス**: `.agent/micro-agents/INDEX.md`
- **内容**: 全エージェントのID、役割、ファイルパス、ステータス。
- **トリガー**: エージェント作成完了、ステータス変更、機能追加。

### Rules INDEX

- **パス**: `.agent/rules/INDEX.md`
- **内容**: 全ルールファイルのリスト、概要、優先順位。
- **トリガー**: ルール作成、変更、非推奨化。

### Workflows INDEX

- **パス**: `.agent/workflows/INDEX.md`
- **内容**: 全ワークフローのリスト、説明、コマンド。
- **トリガー**: ワークフロー作成、変更、非推奨化。

---

## 3. エージェント追加フロー (Agent Addition Flow)

1. **エージェント定義作成**: `work/xxx.md` を作成。
2. **INDEX更新**: `.agent/micro-agents/INDEX.md` にエントリを追加。
   - ID
   - ファイルパス
   - 役割（簡潔に）
   - ステータス（`active`）
3. **BOOK.yaml更新**: `prompt/BOOK.yaml` に詳細を追加。
   - ID
   - ファイルパス
   - ケーパビリティ（`capabilities`）
   - 権限レベル（`permission_level`）
4. **整合性チェック**: `check_agent_integrity()` を実行。

---

## 4. ステータス管理

### エージェントステータス

- `active`: 通常稼働中。
- `inactive`: 一時停止中（メンテ中など）。
- `deprecated`: 非推奨（代替エージェントあり）。
- `draft`: 作成中（まだ使えない）。

### 更新ルール

- **作成中**: `draft` で登録。
- **テスト完了**: `active` に変更。
- **問題発生**: `inactive` に変更（Orchestrator判断）。
- **代替登場**: `deprecated` に変更。

---

## 5. 自動更新の仕組み (Mechanism)

### BookKeeperの責務

BookKeeperは、以下のイベントを監視し、INDEXを自動更新する：

- **File Watch**: `.agent/micro-agents/work/*.md` の変更を検知。
- **Session End**: セッション終了時に全エージェントの状態を確認。
- **Agent Handoff**: エージェント間の引き継ぎ時にステータスを確認。

### コマンド自動化

`/update-index` ワークフローを使用すれば、以下の処理が一括で行われる：

1. ファイルスキャン
2. 不整合検出
3. INDEX再生成（テンプレートベース）
4. 古いエントリの削除

**ただし、重要な更新は手動で行い、自動化に頼りすぎないこと。**

---

## 6. エラーハンドリング

### 不整合検出時

- **INDEXにあるがファイルがない**: INDEXから削除（または警告）。
- **ファイルがあるがINDEXにない**: INDEXに追加（`draft` として）。
- **ID重複**: エラーを報告し、手動介入を要求。

### 復旧手順

1. `/update-index --force` を実行して再構築。
2. それでも直らない場合、バックアップから復元。
3. 最終手段として、手動でファイルを編集。
