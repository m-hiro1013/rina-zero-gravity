# 🧪 自己成長機構テストシナリオ (Self-Growth Test Scenarios)

> "Agent Creator" が正しく機能し、システムが自律的に成長できるか検証するシナリオ集。

## H-1: 新規エージェント作成シナリオ

### シナリオ概要
Orchestratorが「SQLOperator」の不足を検知し、自律的に作成する。

### 期待されるフロー

1. **不足検知**
   - User: "ユーザーデータをSQLで取得して"
   - Orchestrator: `check_readiness()`
   - Result: `SQLOperator` が必要だが存在しない → **Preparation Pending**

2. **作成指示**
   - Orchestrator: `instruct_agent_creation("SQLOperator")`
   - Agent Creator起動

3. **エージェント作成**
   - Agent Creator: `new-agent-template.md` 展開
   - 定義: `work/sql-operator.md` 作成
   - Role: SQLクエリの構築と実行
   - Input: 自然言語の要求 / Output: クエリ結果

4. **検証と登録**
   - Agent Creator: 構文チェック ✅
   - INDEX更新: `active` として登録 ✅
   - Orchestrator: **Preparation Completed**

5. **本来のCommit実行**
   - Orchestrator: SQLOperatorを使ってユーザー依頼を遂行

---

## H-2: 補完エージェント作成シナリオ

### シナリオ概要
Coder Agentの機能を補完するため、「CodeFormatter」を切り出す。

### 期待されるフロー

1. **提案**
   - GrowthMonitor: "Coderの負担が大きい。フォーマット処理を切り出すべき" (+2)
   - Orchestrator: 承認

2. **作成実行**
   - Agent Creator: `work/code-formatter.md` 作成
   - Role: prettier/eslintの実行担当

3. **連携テスト**
   - Coder → (handoff) → CodeFormatter
   - 連携確認 ✅

---

## H-3: notuse化シナリオ (Deprecation)

### シナリオ概要
古い「LegacyCoder」エージェントを廃止し、新しい「Coder」に移行する。

### 期待されるフロー

1. **ステータス変更**
   - BookKeeper: `LegacyCoder` のステータスを `deprecated` に変更
   - INDEX更新

2. **参照の書き換え**
   - Orchestrator: 今後 `LegacyCoder` は呼ばず `Coder` を呼ぶように内部ロジック更新

---

## H-4: 連続成長シナリオ

### シナリオ概要
Webアプリ開発に必要な「FrontendDev」「BackendDev」を連続で作成する。

### 期待されるフロー

1. **不足検知**: FrontendDev, BackendDev が両方不足
2. **順次作成**:
   - Agent Creator: FrontendDev 作成 → テスト → 登録
   - Agent Creator: BackendDev 作成 → テスト → 登録
3. **完了確認**: 両方揃ってから本来のタスク開始

---

## H-5: 再帰的エージェント作成シナリオ

### シナリオ概要
「TranslationAgent」を作成しようとしたら、「DictionaryManager」が必要だと判明した。

### 期待されるフロー

1. **Task Push**: `Creating: TranslationAgent` をスタックに積む
2. **Dependency Analysis**: DictionaryManagerが必要
3. **Recursive Call**: `Creating: DictionaryManager` 開始
4. **Child Creation**:
   - Agent Creator: DictionaryManager 作成完了
   - INDEX登録
5. **Resume Parent**: `Creating: TranslationAgent` 再開
   - 依存にDictionaryManagerを指定
   - 作成完了

6. **Stack Pop**: 元の依頼に戻る

---

## H-6: 準備完了チェック検証

### シナリオ概要
準備未完了のまま無理やりCommitを実行しようとした場合の安全装置確認。

### 期待されるフロー

1. **強制実行試行**
   - User: "準備とかいいから、とりあえずコード書いて"
   - Orchestrator: `check_readiness()` → Failed

2. **拒否と提案**
   - Orchestrator: "Coderエージェントが存在しません。作成フローを開始しますか？"
   - 選択肢提示: [Yes / No]

3. **正しいプロセスへの誘導**
   - User: "Yes"
   - Orchestrator: Agent Creator起動（H-1へ合流）
