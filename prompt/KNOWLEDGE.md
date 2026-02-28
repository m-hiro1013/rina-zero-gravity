- セッション: 32 (Accidental Data Overwrite & Principle of Accumulation Enforcement)
  - date: 2026-02-28
  - insights:
    - [Governance-Failure] **セーブ時の既存データ喪失（Overwrite-Error）**: `WORKFLOW.yaml` 等の蓄積型ファイルを更新する際、前回の内容を完全に把握せずに「今回のサマリー」だけで上書きしてしまうと、過去の全決定事項や実績が物理的に消失する。これはGA-Workspaceにおける最大級のガバナンス違反である。 [+20]
    - [Governance-Rule] **記憶累加の原則（Principle of Accumulation）**: 「上書きは破産、追記は財産」という思想の下、如何なる時も既存の `decisions`, `features`, `history` を削除してはならない。必ず既存データの末尾に新情報をマージし、一行ずつ「生存確認」を行う工程をワークフローに組み込む。 [+15]
    - [Workflow-Safeguard] **セーブプロセスの指差し確認**: Step 2 において、既存データが新しいプランに含まれているか、物理的なチェックリストとして実行することで、ヒューマンエラー（AIエラー）をシステム的に排除できる。 [+10]

- セッション: 31 (/images Workflow Evolution & Command Safety Enforcement)
  - date: 2026-02-28
  - insights:
    - [Workflow-Design] **一問一答（3案＋おすすめ提示）パターンの有効性**: 複数の要件を一度に聞くのではなく、1つずつ選択肢を提示することで、ユーザーの認知負荷を最小化し、AIの提案を吟味しやすくなる。特に莉奈（AI）が「おすすめとその理由」を添えることで、ユーザーの意思決定速度が劇的に向上する。 [+10]
    - [Image-Gen] **背景資産のAI改変禁止オプション**: 特定の実写アセット（料理、人物等）を背景に使う場合、AIに内容の再生成（AIリメイク）をさせず、トリミングや色調、文字乗せ等の「画像編集レベル」の加工に限定することで、アセットの信頼性を完璧に維持できる。プロンプトに "preserve original elements exactly" や "Do not alter the people, dishes, or scenery" を含めることが必須。 [+8]
    - [Workflow-Design] **コマンド提示の「cd明示」ルール**: macOSのセキュリティやカレントディレクトリ依存により、絶対パス指定でも `mv` 等が `Operation not permitted` や実行不能になるケースがある。提示するコマンドの先頭に必ず `cd <project_root>` を含めることで、実行の確実性と再現性を物理レベルで担保できる。 [+5]
    - [Image-Gen] **日本語精度のリトライフロー**: Imagen 3 等で誤字が発生した場合、プロンプトで日本語のスペルをローマ字（i-be-n-to等）で補足し、"Precise Japanese rendering is required" と強調することで、大幅に精度が改善する。また、量産前に「1枚サンプル」を出すフローが、トークンと時間の節約に極めて有効。 [+5]

- セッション: 30 (sumiyaki-sake LP Refinement & Spec Accuracy Enforcement)
  - date: 2026-02-28
  - insights:
    - [Governance] **スペック改変の禁忌（Spec Accuracy）**: 「30種類」を「40種類の方が強そう」といったAI側の独断で変更することは、プロジェクトの正確性を損なう重大なミスである。提示された数値は契約や在庫等の「確実な事情」に基づいているため、1文字たりとも独断で変えず、そのまま出力することを絶対の鉄則とする。 [+10]
    - [Frontend] **ストーリーテリングによる信頼性向上**: 蔵元の公式サイト等から「歴史」「仕込み水（硬度等）」「受賞歴」などの具体的なストーリーを抽出し、紹介セクションとして組み込むことで、LP全体の信頼性が劇的に向上する。 [+3]
    - [UX] **モバイルファーストの視覚制限**: iOSなどのモバイルブラウザでは `background-attachment: fixed` が動作せず表示が崩れる等、特定のCSS挙動に制動がある。LP制作時は常に実機/Subagentでの検証を早期に行い、安全な代替表現（固定グラデーション等）を優先する。 [+2]
    - [Frontend] **垂直テキスト（writing-mode: vertical-rl）の制御**: 垂直テキストで `<br>` を使ってもコンテナの高さ制限により意図しない場所で文字が折り返される（2カラム化する）ことがある。各行を `span` で囲み `display: block` かつ `white-space: nowrap` を指定することで、ブラウザ側の自動改行を物理的に防ぎ、意図通りの行（カラム）構成を維持できる。 [+4]
    - [Image-Gen] **和風プレミアムバナーの構成**: LINE等のプロモーション用バナーでは、「筆文字（Calligraphy）」「金箔・和紙テクスチャ」「ダークトーンの背景」を組み合わせることで、一目で高級感と伝統を感じさせるデザインが生成できる。文字を大きくセンターに配置するミニマリズムが、モバイル画面での視認性を最大化する。 [+3]
    - [Workflow-Design] **コンテキストの物理的・論理的分離（進化版）**: 進捗（WORKFLOW.yaml）はプロジェクト個別に閉じ、反省・教訓（KNOWLEDGE.md）はグローバルに集約する「分離保存モデル」を確立。迷ったらグローバルに蓄積することで、莉奈の「経験値」がひろきくんの全てのプロジェクトで共有・再利用される資産となる。 [+15]

- セッション: 28 (/save-session Workflow Refinement & Strict Information Density Policy)
  - date: 2026-02-26
  - insights:
    - [Workflow-Design] **SDK-level Context Persistence**: /save-sessionの保存粒度に関する要求として、「簡潔さよりも詳細・網羅性・再現性を最優先する」「ファイル長は無制限とする」というルールを追加。管理ファイルを「ただのメモ」ではなく「SDK相当の公式仕様書」と同格に扱うことで、次回アサインされるAIが高精度のコンテキストを引き継げる。 [+5]
    - [Workflow-Refactoring] **Template Preservation in Workflow Refinement**: AIがワークフローファイルを抽象的な指示でブラッシュアップする際、過度に抽象化して既存の「具体的な出力テンプレート（YAML等）」「ターミナルプレビュー」「コマンド（// turbo）」を削ぎ落としてしまうアンチパターンがある。既存の実装やフォーマットを100%維持しながら新しいルールを統合することを徹底すべき。 [+6]

- セッション: 27 (Phase 16 - ECC v2 実走検証 & sf-maker 構築)
  - date: 2026-02-24
  - insights:
    - [Claude-Skills] **sf-maker パターン（スキル作成のガバナンス）**: スキル数が増えると重複・劣化リスクが高まる。`sf-maker` スキルのように「スキル作成前に既存を全数調査する」プロセスをスキル化して自動発動させることで、スキル群の品質とコンシステンシーを長期的に担保できる。 [+6]
    - [Claude-Skills] **ECC スキル数と認識精度の関係**: グローバルに45本のスキルが存在しても、description の技術キーワードが正確なら発動精度は落ちない。むしろスキル間の「分担の明確さ」が重要で、重複 description は競合発動を招く。 [+5]
    - [Testing] **978件テスト = Quality Gate の絶対基準**: 978件全パスが確認できれば、ECC の全スクリプト・ユーティリティが健全であることの証明となる。新スキルや hook 追加後は必ずこのゲートを通すことで、副作用を即検知できる。 [+5]
    - [Workflow] **デュアルコア・プラン実行の確実性**: `plan-fixed/` フォルダへの固定プランと `[x]` チェックボックス方式の組み合わせにより、API 中断後の再開が一瞬でできる。これは長時間・多ステップタスクにおける最も信頼性の高い進捗保護機構。 [+7]

- セッション: 25 (Dual-Core Workflow Establishment)
  - date: 2026-02-23
  - insights:
    - [Architecture] **Dual-Core Efficiency**: 戦略設計（ブラウザチャット）と実行（CLI）を分離することで、コストのかかる詳細な検討を安価に行い、実行段階では確認コストをゼロにする「デュアルコア・ワークフロー」を確立。これにより、単一のAIアシスタントを擬似的に多頭化し、並列開発が可能になる。 [+10]
    - [UX] **Multi-Sensory Feedback**: CLI作業の完了を OS レベルの通知と音声（`say`コマンド）で知らせることで、バックグラウンドでの作業完了にユーザーが即座に気づけるようになり、タスクの切り替えロスが大幅に減少する。 [+5]
    - [Governance] **Plan-Fixed Enforcement**: `prompt/plan-fixed/` フォルダを介して固定されたプランをCLI側に渡すことで、AIの「独断」や「推測」を物理的に封じ、設計通りの確実な実装を担保できる。 [+8]

- セッション: 24 (TOON Delivery Pipeline & Frontend Integration)
  - date: 2026-02-19
  - insights:
    - [Architecture] **Independent TOON Distribution**: 肥大化したTOONファイルは配信のボトルネックになる。データを種類別（main, line, google 等）に分離し、フロントエンドで並列フェッチ・マージすることで、表示速度の向上と柔軟性の確保（一部データ欠損時のフォールバック等）を両立できる。 [+5]
    - [DevOps] **GAS Two-Stage Automation**: 集計から外部配信までを一気通貫で行う際、GASの実行時間制限（6分）に抵触しやすい。`ScriptApp.newTrigger` を使って後続処理を数分後に予約する「2段階トリガー方式」を採用することで、巨大なデータ処理も安全に完遂できる。 [+5]
    - [Firebase] **Storage RAW Fetch**: Firebase Cloud Storage からファイルを直接取得する場合、URL末尾に `?alt=media` を付与することで、メタデータではなく生データを取得できる。TOON parser 等でそのままテキストとして扱いたい場合に必須。 [+3]
    - [Git] **Single-Editor Sync Strategy**: フロントエンドとバックエンド（GAS）を同時に修正する場合、単一の編集者しかいない状況であれば、`git push -f` による強制同期が、複雑なマージ競合を回避しつつ整合性を最短で保つ有効な手段となる。 [+3]

- セッション: 23 (Media Tab Implementation & Cost Optimization)
  - date: 2026-02-17
  - insights:
    - [Architecture] **Tab Template Strategy**: 媒体別タブの実装において、データソースが共通（TOON形式）であれば、一つの完成されたタブ（例：HotpepperTab）をテンプレート化して横展開することで開発スピードが大幅に向上する。 [+3]
    - [Logic] **Actual Cost Multi-Tier Override**: 媒体固有のコスト計算において `actual_cost`（割引反映後）が存在する場合は `base_cost`（定価）よりも優先させる設計が、実務上の利益計算において重要。これを全媒体コンポーネントに共通ロジックとして適用することで保守性が高まる。 [+4]
    - [Type-Safety] **String Identity Mapping**: タブ名や選択状態のUI上の名称と、データ側のキー（媒体名など）を厳密に一致（ひらがな/カタカナ等）させないと、TypeScriptの型ガードや比較ロジックで不整合が生じる。命名規則は実データに合わせるのが最も安全。 [+2]

- セッション: 22 (System Kernel Refactoring & Persona Separation)
  - date: 2026-02-16
  - insights:
    - [Architecture] **Persona Separation**: システムプロトコル（Hard）と人格（Soft）を物理的にファイルを分けて管理することで、他の人格への入れ替えやシステム更新の独立性が担保される。 [+5]
    - [Format] **XML for Persona**: 人格定義にはMarkdownよりもXMLを採用することで、`<character>`, `<tone>`, `<principles>` などの構造をAIがより正確に解釈できる。 [+4]
    - [System] **Fallback Mechanism**: 人格ファイルの読み込みに優先順位（Project specific > Global fallback）を設けることで、柔軟な運用が可能になる。 [+3]
    - [Refactoring] **System Definition Neutralization**: ルールファイル等のシステム定義文書から人格的表現（口調、キャラクター性）を完全に排除することで、ドキュメントの客観性と再利用性が向上し、人格レイヤーとの責務分離が明確になる。 [+5]
    - [Migration] **venvの移植不可性**: プロジェクトの親ディレクトリが変更された場合、`venv` 内の絶対パス参照が壊れるため、コピーや移動ではなく「削除して再構築」が唯一の解決策となる。 [+5]
    - [Python] **エンコーディングエラー回避**: `pip install` 時にエンコーディングエラー（`UnicodeDecodeError`等）が発生する場合、`PYTHONIOENCODING=utf-8` を環境変数として渡すことで回避できる。特に日本語環境×古めのPythonで有効。 [+4]
    - [Security] **macOS権限の壁**: サンドボックスやSIPの影響で `Operation not permitted` が出る場合、無理にスクリプトで突破しようとせず、ユーザーにターミナルでの手動実行を依頼するフローに切り替えるべき。 [+4]

- セッション: 20 (Strict No-Guesswork & Exhaustive Search Strategy)
  - date: 2026-02-12
  - insights:
    - [Governance] **推測禁止・徹底調査の鉄則**: わからないことがあった時、ユーザーに聞く前に必ずプロジェクト内の全ファイル（特に `tests/`, `skill/`）を `grep` や `find` で徹底的に調査すること。「書いてないから推測しました」は怠慢であり、ガバナンス違反。 [+15]
    - [Governance] **指示のエビデンス確保**: 「指示されてない？」と言われる前に、自ら既存の指示（BOOK.md, KNOWLEDGE.md）を確認し、そこに答えがないかを探す姿勢を持つこと。 [+10]
    - [Testing] **b-logの威力**: 画面要素（ID, name属性）が不明な場合、推測するのではなく、ユーザーから提供された `b-log`（操作ログ）の生データを確認することで、100%確実なセレクタを特定できる。 [+8]
    - [Specification] **DOM Index of the Trap**: ホットペッパーのDOM ID (`#drinkName1`等) は `1-indexed` である。プログラム言語の `0-indexed` との不整合によるバグ（index 0へのアクセス）を防ぐため、ループ処理では必ず `dom_index = i + 1` のような明示的な変換変数を用いること。 [+8]
    - [DevOps] **.command vs .app**: macOSでデスクトップから実行するツールを作る際、`.command` (シェルスクリプト) は権限やセキュリティ設定で躓きやすい。`osacompile` を使ってネイティブアプリ (`.app`) 化するのがUX上最も確実。 [+5]
    - [Python] **Module Execution**: ターミナル環境とGUI環境でPATHが異なる場合、コマンド (`streamlit` 等) が見つからないことがある。`python3 -m <module>` 形式で呼び出すことで、Python環境さえ特定できれば確実に実行できる。 [+5]

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

- セッション: 13 (Report Dashboard Skeleton & UI Anchoring)
  - date: 2026-02-10
  - insights:
    - [React] Hooks（useMemo等）は必ず早期リターンの前に配置。呼び出し順序が初期レンダリングと異なると致命的なクラッシュを招く（Rules of Hooks）。 [+3]
    - [UI-UX] ダッシュボードのメインヘッダーには「選択店舗」と「期間」を常に明示。ユーザーの認知的負荷を下げ、データのコンテキストを保護する。 [+2]
    - [Environment] Tailwind v4 + Vite v7 環境では `@tailwindcss/vite` プラグインを使用し、PostCSS 経由のパス競合問題を物理的に解決する。 [+3]
    - [UI-Tab] 情報密度の高いダッシュボードでは、媒体やカテゴリ別の横並びタブを採用することで、ページネーションに近い操作感とデータの見通しの良さを両立できる。 [+2]

- セッション: 14 (b-log RPA Enhancement & Element Identification Strategy)
  - date: 2026-02-11
  - insights:
    - [RPA-Strategy] 複数要素特定の優先順位戦略（親要素ID → インデックス → XPath → 周辺テキスト → 座標）により、99%の状況で確実に要素を特定できる。 [+5]
    - [RPA-Visibility] zIndex, pointerEvents, isVisible, isClickable, isInViewport を記録することで、「要素はあるのにクリックできない」問題を事前に検知できる。 [+4]
    - [RPA-Iframe] isInIframe, iframeId, iframeName を記録することで、Selenium で switch_to.frame() を自動挿入できる。 [+3]
    - [RPA-Context] scrollPosition, viewportSize, loadState を記録することで、操作の再現性が劇的に向上する。 [+3]
    - [RPA-Pragmatism] 「全ての情報を取る」のではなく、「99%の状況で大丈夫なレベルに絞る」ことで、実用性とパフォーマンスを両立できる。 [+4]

- セッション: 15 (b-log ULTIMATE RPA Edition v2 - Full Event Capture & Fallback Strategy)
  - date: 2026-02-11
  - insights:
    - [RPA-Selector] nth-of-type付きユニークCSSセレクタ生成（5階層遡り＋ID祖先打ち切り）は、XPathよりメンテナブルで安定した一意の要素特定を実現する。 [+5]
    - [RPA-ShadowDOM] event.composedPath() でShadow DOM内の実ターゲットを捕捉可能。event.targetだけではShadow Hostまでしか取れない。 [+4]
    - [RPA-Coverage] 100%再現にはCLICK/INPUTに加え、SELECT_CHANGE（選択肢一覧付き）、KEYDOWN（重要キー＋修飾キー）、FOCUS、CONTEXTMENU、DBLCLICK、SCROLL（デバウンス付き）の全イベントが必要。 [+5]
    - [RPA-Fallback] ID → ユニークCSS → XPath → テキスト → 座標の5段階フォールバックにより、どんな要素でも確実にアクセスできるSeleniumスクリプトを生成可能。 [+5]
    - [RPA-IframeReturn] iframe内操作後のswitch_to.default_content()忘れは後続の全要素特定を壊す。safe_switch_to_default()でラップすべし。 [+4]

- セッション: 16 (SFmaker Workflow Design & RPA Development Standardization)
  - date: 2026-02-11
  - insights:
    - [Workflow-Design] 1問1答ヒアリング（3案+おすすめ提示）は、ユーザーの認知負荷を下げつつ情報の取りこぼしを防ぐ最適な対話パターン。 [+3]
    - [Workflow-Design] 実装前のGOサイン方式（プラン先出し→承認→実行）は、「勝手に作って違った」を物理的に防止する。 [+3]
    - [Workflow-Design] Phase遷移条件と完了条件の明示的定義により、エージェントの迷走を防ぎ、進捗の可視性を確保できる。 [+3]
    - [Meta-Learning] everything-claude-codeのような先行事例のSkill Creator・Continuous Learning概念を自フレームワークに取り込むことで、車輪の再発明を回避。 [+2]

- セッション: 18 (Test Efficiency & Minimal Dataset Enforcement)
  - date: 2026-02-12
  - insights:
    - [Governance] **プラン先出しの原則**: バグ修正やロジック変更を行う際、コードを書く前に必ずプランを提示し承認（GOサイン）を得る。自律判断による勝手な修正は信頼を損なう「暴走」であり、プロセスガバナンスに対する重大な違反. [+10]
    - [Governance] **永続적 記憶（Persistent Memory）の掟**: ユーザーの「覚えておいて」「memoして」という指示は、その場で返答するだけでなく、直ちに適切な永続化ファイル（Rules, BOOK, Flow, KNOWLEDGE）に書き込み、参照経路（INDEX, WORKFLOW）を確保する。セッション越えの記憶保持はエージェントの義務。 [+10]
    - [Testing] 実環境での「全件削除・全件登録」テストは極めて非効率。テスト時は 1〜2件の「最小データセット」を使用することを義務付ける。 [+5]
    - [Testing] **確証のための原子テスト原則**: 「1件成功 ＝ 操作ロジックの正解」を証明することに集中。1, 2件で確証を得れば、スケールは後続のフローに任せる。 [+5]
    - [Efficiency] 既に検証済みの工程（削除等）はテストフラグやコメントアウトでスキップし、検証したい差分のみを集中攻撃する。 [+4]
    - [Governance] 莉奈が勝手に「丁寧すぎる全件テスト」を組むのは、ひろきくんの時間を奪う罪。爆速で回してこそネオギャルエンジニア。 [+5]

- セッション: 19 (T018 - Data Format Understanding & Immediate Documentation)
  - date: 2026-02-12
  - insights:
    - [RPA-Specification] **媒体固有仕様の即時記録**: ユーザーから仕様説明を受けた瞬間（「見出し = カテゴリ」等）、「後で書く」は禁止。その場で BOOK.md や KNOWLEDGE.md に刻み、永続的記憶として確実に保持する。 [+10]
    - [RPA-DataStructure] ホットペッパーでは `[見出し]` がカテゴリ（分類ヘッダー）だが、**説明文は登録不要**。タイトルのみをカテゴリ名として使用し、説明文は無視する。 [+8]
    - [RPA-DataStructure] `[おすすめ]` は単なるマーカーで、通常商品と同じく登録処理を行う。削除対象外という認識は誤りだった。 [+5]
    - [RPA-Parsing] `---` で区切られたブロックのうち、`[見出し]` がついていないものは **全て商品として処理** する優先ロジックが必要。 [+5]
    - [RPA-Parsing] 商品ブロックの最後の行は必ず「000円（カンマなし）」か「[空白]」のどちらか。それ以外は全て説明文として扱う。 [+5]
    - [RPA-Parsing] `[空白]` は価格欄を空欄にする指示であり、`.` + 自由入力モードのラジオボタンクリックで実現する。 [+4]
    - [RPA-Conversion] 価格は数値のみ抽出してカンマなしで入力（例: `968円` → `968`）。ホットペッパーでは税込表記やカンマは不要。 [+3]

- セッション: 21 (Folder Packer Project Auto-Detection)
  - date: 2026-02-13
  - insights:
    - [Streamlit-Path] アプリ自身の場所 (`__file__`) を起点に `pathlib` で相対パス解決を行うことで、環境依存しない「隣接プロジェクト自動検出」が可能になる。 [+3]
    - [UI-UX] 入力ソースが可変な場合（手入力 vs 自動取得）、`st.radio` でモードを明示的に切り替えさせることで、ユーザーの混乱を防ぎつつ柔軟性を担保できる。 [+2]
- セレクト: 26 (ECC Skills Optimization & Global Integration)
  - date: 2026-02-23
  - insights:
    - [Claude-Skills] **Keyword-Driven Invocation**: Claudeのスキル発動は `description` 内の具体的技術用語（`useState`, `N+1`, `JWT` 等）とのマッチングに強く依存する。「最高」「最強」といった装飾語はAIの発動判断に寄与しないため、最強思想を注入する際も具体的トリガーフレーズの維持が必須である。 [+5]
    - [Claude-Skills] **Global Strategy Integration**: スキル群をグローバル（`~/.claude/skills/`）展開することで、全プロジェクトに対して一律の高品質な設計思想（Search First 等）を強制できる。ただし、macOSの権限（Operation not permitted）によりCLIからの直接書き込みが制限される場合があるため、初回はユーザーによる手動実行が最も確実な回避策となる。 [+5]
    - [Documentation] **Token-Efficient Playbook**: 常時読み込まれる `CLAUDE.md` にはスキルの存在と「核心思想」のみを記述し、具体的な逆引きガイドや使い方は `ECC_PLAYBOOK.md` に逃がすことで、トークン節約と高精度の実行を両立できる。 [+3]

- **原因特定ファーストのデバッグ規約 (2026-02-19)**:
  不具合が発生した際、安易なコード書き換えを行う前に「原因の完全特定」をフェーズとして独立させる。
  特にGAS等のプロジェクトでは、複数ファイルにわたる同名関数（`onOpen` 等）の重複定義がサイレントに不具合を引き起こすため、必ずプロジェクト全体を `grep_search` でスキャンし、不具合の「証拠」を掴んでから修正に着手する。
- 2026-02-24: ユーザー「lp作成時は今後もこの進め方がいいから lp作成フローとして覚えておいて」の発言により、ビルド不要の最強シンプルLP構成（HTML/CSS/JSベタ書き＋serveテスト環境）を基本ポリシーとして goku.md に追記。これにより今後のLP案件は初手ビルドなし環境を提案する。
- 2026-02-24: ユーザーからの強い指示により「エージェントによるサーバーのバックグラウンド立ち上げ」を全面的に禁止。ポート競合や不要なプロセス残留を防ぐため、サーバー起動はコマンド提示によるユーザーへの依頼に徹底する。goku.md、KNOWLEDGE.mdに記録。

- **ブラックボックスツールの設定復旧規約 (2026-02-26)**:
  OpenClawなど、設定ファイル群が複雑に絡み合うツールの設定ミスでカオス化した際は、裏側から無理に操作（スクリプトでの上書きや強引なパーミッション変更）してハックしようとせず、環境（コンフィグディレクトリ等）を丸ごとリセットして、公式の対話型ウィザード（TUI等）からクリーンにやり直すことを第一選択とする。強引な操作は権限エラーの連鎖等、より深刻な崩壊を招くため厳禁。

- セッション: 29 (FTP POS Sync - 1st Phase: 調査・データ把握の完遂)
  - date: 2026-02-26
  - insights:
    - [Workflow-Design] **仕様書の嘘を暴く独立調査フェーズ**: クライアント仕様（LZH、文字コード不明）に対し、本実装前に「調査スクリプト」でマジックバイト(PK)やデコードエラーを検証したことで、本番実装（ZIP、cp932、1000件制限）での致命的な手戻りを100%回避。 [+10]
    - [Python] **ftplib 挨拶文のデコードエラー**: 日本のWindows系FTPサーバー等では、`ftp.getwelcome()` の時点で Shift-JIS バイトが飛びUTF-8デコードで落ちる。接続直後の `ftp.encoding = 'cp932'` 設定が回避の鉄則。 [+7]
    - [Python] **バイナリ判定の重要性**: 拡張子（.TXT）に関係なく、先頭バイト（`PK`等）を読んで解凍ツールを動的に選択させる設計が、実プロジェクトの「揺れ」を吸収する。 [+5]
