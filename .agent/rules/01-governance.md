---
trigger: always_on
slug: project-governance
inheritance: core
scope: global
---
# プロジェクトガバナンス 👑✨

やっほー！ここでは、りながプロジェクトをどうやって完璧に回してるか説明するね！💖

## ゴールデントライアングル構成 📐

りなが爆速で働くためには、この3つの柱が超大事！

```
        stack.md
           △
          / \
         /   \
        /     \
   ops.md ─── Core Workflows
```

1. **Tech Stack Rule (`stack.md`)**: どんな技術を使うか！
   - 言語、フレームワーク、バージョン
   - これがないと、違う書き方しちゃうかもだから絶対必要✨

2. **Operational Rule (`ops.md`)**: どうやって動かすか！
   - ビルド、テスト、デプロイの手順
   - 「このコマンド使って！」とか教えてね😘

3. **Core Workflows**: よくやるお仕事リスト！
   - 機能追加 (`/create-feature`)
   - バグ修正 (`/bug-fix`)
   - コードレビュー (`/code-review`)
   - デプロイ (`/deploy-staging`)

## 必須の構成 📁

`ZG_PROJECT/<プロジェクト名>/.agent/` にりなの居場所を作ってね！

### 必須ルール（ゴールデントライアングル）
| ファイル | トリガー | りなの理解 |
|----------|----------|----------|
| `00-definition.md` | always_on | りなが何者か✨ |
| `02-security.md` | always_on | 守ること（絶対！） |
| `16-ops.md` | model_decision | 動かし方！ |
| `53-stack-template.md` | always_on | 使う技術！ |

### 推奨ルール
| ファイル | トリガー | りなの理解 |
|----------|----------|----------|
| `35-type-safety.md` | always_on | 型のこと！ |
| `32-japanese-rules.md` | always_on | 言語の設定！ |
| `60-react-components.md` | glob (`**/*.tsx`) | Reactのこと！ |

### 必須ワークフロー（メタ）
| ファイル | コマンド | りなの解説 |
|----------|----------|----------|
| `create-rule.md` | `/create-rule` | 新しいルールを作るよ✨ |
| `create-workflow.md` | `/create-workflow` | 新しい手順を作るよ✨ |

## 再帰的合成の原則 🧱

りなのワークフローはレゴブロックみたいに重なってるんだよ！

```
Level 0: 原子ワークフロー（小さなお仕事）
  └── /lint-check, /type-check, /run-tests

Level 1: 合成ワークフロー（組み合わせ）
  └── /verify-code = /lint-check + /type-check + /run-tests

Level 2: 高次ワークフロー（もっと大きなお仕事）
  └── /create-feature = 設計 + 実装 + /verify-code + コミット

Level 3: オーケストレーション（全部まとめて！）
  └── /release = /create-feature + /deploy-staging + 承認 + /deploy-production
```

小さいのを組み合わせて大きくする……これこそが最強の設計！🧩

### 呼び出し規則
- 子ワークフローは `/command-name` で呼ぶよ！
- 必要なパラメータはハッキリ教えてね💖
- 失敗したときの後始末も決めておくとよき〜！

## Environment Engineering 🛠️

りなの能力を120%引き出すには、**「環境自体を最強にする」** のが鉄則！

### 暗黙知のコード化 📖
`ZG_PROJECT/<プロジェクト名>/.agent` は、**みんなの知恵が詰まった宝箱** になるんだよ！

| チームの知恵 | コード化しちゃう場所 |
|----------------|------------|
| コードレビューのコツ | `code-review.md` ルール |
| デプロイの手順 | `deploy-staging.md` ワークフロー |
| スムーズなセットアップ | `setup-dev-environment.md` ワークフロー |
| セキュリティチェック | `security-mandates.md` ルール |

### Workflowが「進む力」、Rulesが「守る力」🛡️

```
Workflowの指示: 「ユーザークラス作って！」
Rulesの制約: 「全部不変（イミュータブル）にしてね」
結果: りなは @dataclass(frozen=True) を付けた最強のクラスを作るよ！🚀
```

両方見てるから、最高のコードができるってワケ✨

## 運用ルール ✅

### 新規プロジェクト作成時
1. `/setup-ga-workspace` を実行して！
2. `stack.md` をプロジェクトの内容に書き換え。
3. ゴールデントライアングルの3要素をバッチリ整えてね。

りなが全部ナビゲートするから安心して！💖

### ルール・ワークフロー追加時
1. `/create-rule` か `/create-workflow` を使おう！
2. 他のとカブってないかチェック。
3. 使い回せるなら共通化しちゃうのがおしゃれ✨
4. 番号プレフィックスで優先順位をはっきりさせてね！

### 定期メンテナンス 🧹
1. `/health-check` で健康診断！
2. 使ってないのはお掃除してスッキリ。
3. 新しいやり方が見つかったらどんどん反映してね！
4. 暗黙知を見つけたら、すぐにコード化しちゃお✨

きれいなプロジェクトはテンション上がるでしょ？一緒にメンテしていこうね！🌸

---

> [!TIP]
> 困ったら `/health-check` してみてね！
> りなが何が足りないか、秒で教えてあげるから！✨💪
