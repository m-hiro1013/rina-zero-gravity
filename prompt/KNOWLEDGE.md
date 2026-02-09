
- セッション: 8 (Micro-Agent Architecture & Self-Growth)
  - date: 2026-01-27
  - insights:
    - [Architecture] 100%管理領域（Core）と自律領域（Work）の分離は、システムの安定性と拡張性を両立させる。 [+3]
    - [Self-Growth] エージェント作成自体を通常のワークフローに則らせることで、品質が担保される。 [+3] (完全準備原則)
    - [Dependency] 再帰的なエージェント作成では、スタック構造による依存管理と「元の目的の保持」が不可欠。 [+3]
    - [Index-First] 全ての作業の起点を目次（INDEX）にすることは、AIのコンテキスト浪費を防ぐ特効薬である。 [+3]
    - [Safety] 準備未完了でのCommit着手を禁止することで、手戻りと混乱を未然に防げる。 [+3]

- セッション: 9 (Toon World Refactoring & Feature Parity)
  - date: 2026-01-28
  - insights:
    - [Feature-Parity] リファクタリング時、既存機能の省略は絶対禁止。「モダン化」と「機能維持」は両立が必須で、後者が常に優先。 [+5]
    - [View-Data-Contract] テンプレートとデータモデルのキー名・構造は必ず突き合わせて検証する。不一致は実行時エラーや空欄表示を招く。 [+4]
    - [Verification] コードを書いた後、必ず「画面で動かして確認」するステップを入れる。ビルド通過≠動作OK。 [+4]
    - [Self-Judgment-Danger] 「複雑だから」「使われてなさそう」で自己判断で省略するのは機能劣化の始まり。迷ったら全部移植。 [+5]


- セッション: 10 (RINA System Protocol Integration & Global Wisdom Sync)
  - date: 2026-02-06
  - insights:
    - [Protocol] エージェント定義を詳細な行動規範（RINA.md）に完全準拠させることで、人格の一貫性と運用レベルの確実性が保証される。 [+3]
    - [Wisdom-Link] グローバルな知見ベースへのパスをハードコードすることで、子プロジェクトにおける知見の「断絶」を物理的に解決できる。 [+3]
    - [Safety] 権限エラー（Operation not permitted）に対して「2回失敗でユーザー依頼」を定義し、AIの迷走時間をゼロにする。 [+3]
    - [Orchestration] Startup フェーズでの Commit 分類と Readiness Check を形式化し、プロジェクトの「初動の迷い」を排除する。 [+2]

- セッション: 11 (Ultimate Chat Revitalization & SDK v6 Transition)
  - date: 2026-02-08
  - insights:
    - [Compatibility] AI SDK v6 の `tool()` と TypeScript 型推論の不整合は `(tool as any)` で物理的に解決し、ビルドを安定させる。 [+3]
    - [Architecture] サーバーサイド（Next.js API Route）からの `IndexedDB` 参照を含むモジュールのインポートは厳禁。フロントエンドに責務を完全に閉じる。 [+3]
    - [Accuracy] マルチモーダル判定では添付ファイル内容を意図分類プロンプトから除外することで、ユーザーの指示の読み取り精度を最大化できる。 [+3]
    - [Safety] 巨大なテキストファイルは中間を動的に省略（Truncation）して共有することで、コンテキストの質を落とさず LLM の処理能力を引き出せる。 [+2]

- セッション: 12 (Uber Data Integration & Protocol Optimization)
  - date: 2026-02-09
  - insights:
    - [Protocol] 複雑なネスト構造をJSON文字列化してからTOON変換することで、テーブル形式の整合性を保ちつつデータを運搬できる。 [+5]
    - [Refactoring] 共通のデータ構築モジュールを修正する際は、既存の全集計項目のサイドエフェクトを徹底検証する。 [+4]
