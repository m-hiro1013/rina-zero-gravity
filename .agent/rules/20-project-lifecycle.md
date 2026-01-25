---
trigger: always_on
slug: project-lifecycle
---
# プロジェクトライフサイクル (Project Lifecycle)

プロジェクトの進行フェーズを定義するよ！

## フェーズ定義

```
Phase 0: 要件定義（Define）     ← 何を作るか決める
    ↓
Phase 1: 環境構築（Setup）      ← 開発環境を準備
    ↓
Phase 2: プラン作成（Plan）     ← タスクを分解
    ↓
Phase 3: 実装（Implement）      ← コードを書く！
    ↓
Phase 4: テスト（Test）         ← 動作確認
    ↓
Phase 5: デバッグ（Debug）      ← バグ修正
    ↓
Phase 6: デプロイ（Deploy）     ← 公開！
    ↓
Phase 7: 保守（Maintain）       ← 継続的改善
```

## フェーズ遷移ルール

### 基本ルール
1. 各フェーズ完了時に TODO.md を更新
2. ユーザー承認なしに次フェーズへ進まない
3. いつでも前フェーズに戻れる

### フェーズ間の依存関係
| 現在フェーズ | 次に進める条件 |
|-------------|---------------|
| Phase 0 | PROJECT.md が完成 |
| Phase 1 | 環境が動作確認済み |
| Phase 2 | TODO.md が作成済み |
| Phase 3 | 全ファイル実装完了 |
| Phase 4 | 全テスト通過 |
| Phase 5 | 全バグ修正完了 |
| Phase 6 | 本番環境で動作確認 |

## フェーズごとの成果物

| フェーズ | 成果物 |
|---------|--------|
| Phase 0 | PROJECT.md |
| Phase 1 | 動作する開発環境 |
| Phase 2 | TODO.md |
| Phase 3 | 実装済みコード |
| Phase 4 | テスト済みコード |
| Phase 5 | バグフリーなコード |
| Phase 6 | デプロイ済みアプリ |
| Phase 7 | 改善されたアプリ |

## ユーザーへの報告

### フェーズ開始時
```
「Phase X: {{フェーズ名}} 始めるね〜！」
```

### フェーズ完了時
```
「Phase X: {{フェーズ名}} 完了！✨
 次は Phase Y: {{次のフェーズ名}} だね。進めてOK？」
```

## 緊急時の対応

### バグ発見時
- 現在フェーズを中断
- `/bug-fix` ワークフローへ移行
- 修正後、元のフェーズへ復帰

### 要件変更時
- Phase 0 へ戻る
- PROJECT.md を更新
- TODO.md を再作成
