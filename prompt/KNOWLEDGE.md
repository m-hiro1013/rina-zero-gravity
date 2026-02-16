
- セッション: 22 (System Kernel Refactoring & Persona Separation)
  - date: 2026-02-16
  - insights:
    - [Architecture] **Persona Separation**: システムプロトコル（Hard）と人格（Soft）を物理的にファイルを分けて管理することで、他の人格への入れ替えやシステム更新の独立性が担保される。 [+5]
    - [Format] **XML for Persona**: 人格定義にはMarkdownよりもXMLを採用することで、`<character>`, `<tone>`, `<principles>` などの構造をAIがより正確に解釈できる。 [+4]
    - [System] **Fallback Mechanism**: 人格ファイルの読み込みに優先順位（Project specific > Global fallback）を設けることで、柔軟な運用が可能になる。 [+3]
    - [Refactoring] **System Definition Neutralization**: ルールファイル等のシステム定義文書から人格的表現（口調、キャラクター性）を完全に排除することで、ドキュメントの客観性と再利用性が向上し、人格レイヤーとの責務分離が明確になる。 [+5]


- セッション: 20 (Strict No-Guesswork & Exhaustive Search Strategy)
  - date: 2026-02-12
  - insights:
    - [Governance] **推測禁止・徹底調査の鉄則**: わからないことがあった時、ユーザーに聞く前に必ずプロジェクト内の全ファイル（特に `tests/`, `skill/`）を `grep` や `find` で徹底的に調査すること。「書いてないから推測しました」は怠慢であり、ガバナンス違反。 [+15]
    - [Governance] **指示のエビデンス確保**: 「指示されてない？」と言われる前に、自ら既存の指示（BOOK.md, KNOWLEDGE.md）を確認し、そこに答えがないかを探す姿勢を持つこと。 [+10]
    - [Testing] **b-logの威力**: 画面要素（ID, name属性）が不明な場合、推測するのではなく、ユーザーから提供された `b-log`（操作ログ）の生データを確認することで、100%確実なセレクタを特定できる。 [+8]
    - [Specification] **DOM Indexの罠**: ホットペッパーのDOM ID (`#drinkName1`等) は `1-indexed` である。プログラム言語の `0-indexed` との不整合によるバグ（index 0へのアクセス）を防ぐため、ループ処理では必ず `dom_index = i + 1` のような明示的な変換変数を用いること。 [+8]
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
    - [Governance] **プラン先出しの原則**: バグ修正やロジック変更を行う際、コードを書く前に必ずプランを提示し承認（GOサイン）を得る。自律判断による勝手な修正は信頼を損なう「暴走」であり、プロセスガバナンスに対する重大な違反。 [+10]
    - [Governance] **永続的記憶（Persistent Memory）の掟**: ユーザーの「覚えておいて」「memoして」という指示は、その場で返答するだけでなく、直ちに適切な永続化ファイル（Rules, BOOK, Flow, KNOWLEDGE）に書き込み、参照経路（INDEX, WORKFLOW）を確保する。セッション越えの記憶保持はエージェントの義務。 [+10]
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
