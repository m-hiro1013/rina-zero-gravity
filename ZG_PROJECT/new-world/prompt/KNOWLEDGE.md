%# 🧠 知見蓄積 (KNOWLEDGE)

## 🔄 データ構造の将来的な変更 (2026-02-17)
- **対象**: `toreta_data`
- **内容**: 現状は予約数と合算人数のみだが、今後は「ランチ/ディナー」を判別するためのパラメータ（フラグまたは個別カウント）を追加する予定。
- **影響**: 
    - 媒体別分析（食べログ・ホットペッパー）における「従量課金」の計算精度が向上する。
    - 実装済み：現在は `(ランチ単価 + ディナー単価) / 2` を合算客数に掛ける暫定ロジックを採用中。
    - 変更時：`ランチ客数 × ランチ単価 + ディナー客数 × ディナー単価` にロジックを切り替えること。

---
## 🧪 デバッグ・パースに関する知見 (2026-02-19)
- **根本原因の特定**: 一度修正に失敗した場合、あてずっぽうに修正を繰り返さず、必ず `console.log` でデータを可視化してデータ駆動でデバッグすること。
- **CSVパース (重要)**: 送信データ（TOON形式等）にJSONが含まれる場合、単純なカンマ分割や正規表現ではJSON内のカンマや引用符でデータが壊れる。
    - **解決策**: エスケープされた引用符 (`\"`) を考慮した一文字ずつのパースロジックを採用すること。
- **データ型の不一致**: `year_month` や `shop_code` などの識別子が「文字」と「数字」で混在すると比較が失敗する。
    - **解決策**: Parser の出口でこれら識別子を **String型に固定** し、後続の計算ロジックから型変換を排除すること。
- **プロトコル化**: 詳細は `.agent/rules/70-debugging-protocol.md` を参照。

---
## 🔐 GASの権限と自動実行に関する知見 (2026-02-20)
- **権限の不足によるサイレントエラー**: `ScriptApp.newTrigger` や `UrlFetchApp.fetch` は、`appsscript.json` にスコープを記載するだけでは不十分。
- **トリガー実行の罠**: Webアプリとして公開していても、バックグラウンドトリガーで動く関数が新しい権限（外部通信など）を必要とする場合、ユーザーがエディタから手動で一度実行して承認（OAuthフロー）を通さない限り、実行時エラーとなる。
- **解決策**: 必要なメソッドを呼び出すだけの `authCheck` 関数を作成し、ユーザーに一度手動実行してもらうことで、確実に認可ポップアップを表示させることができる。

---
## 🏗 JSXの構造的堅牢性 (2026-02-20)
- **ネストの崩壊**: 三項演算子が重なる大規模なJSX（1000行超）では、タグの閉じ忘れが致命的なレイアウト崩壊を招く。
- **ガードコードの重要性**: `loading` や `!data` のガードはコンテンツエリアの最上部で一括管理し、下位のタブレンダリングロジックが不完全なデータ状態で動かないように隔離すること。

---
## 🌐 Firebase Storage CORS 設定の知見 (2026-02-20)
- **現象**: React/Vite の dev server (`localhost:5173`) から Firebase Storage へ `fetch` すると `No 'Access-Control-Allow-Origin' header` でブロックされる。レスポンスが `200 OK` でも CORS ポリシーがブラウザ側で止める。
- **原因**: Firebase Storage はデフォルトで CORS を許可しない。バケット側に明示的な設定が必要。
- **解決策**: `cors.json` を作成し、`gsutil cors set cors.json gs://<BUCKET>` で適用する。
  ```json
  [{"origin": ["http://localhost:5173", "http://localhost:5174"], "method": ["GET"], "maxAgeSeconds": 3600}]
  ```
- **注意点①**: Vite はポートが使われていると `+1` のポートにフォールバックする（5173→5174）。両方 `origin` に入れておくこと。
- **注意点②**: `gsutil` は Google Cloud SDK に含まれる。ローカルに入っていない場合は Google Cloud Console の Cloud Shell から実行できる。
- **本番デプロイ時**: `origin` を本番 URL に差し替えて `gsutil cors set` を再実行すること。

---
## ⚛️ Recharts の Tooltip 非表示パターン (2026-02-20)
- **問題**: `<Tooltip content={<></>} />` と書くと「Invalid prop `content` supplied to `React.Fragment`」の警告が大量に出る。
- **原因**: Recharts は `content` に渡した要素に内部から props を注入しようとする。React.Fragment は `key` と `children` しか受け取れないため警告が発生する。
- **正解パターン**: `<Tooltip content={() => null} />` — 関数で null を返す形にする。
- **適用箇所**: `TabelogTab.tsx`, `HotpepperTab.tsx`, `GurunaviTab.tsx`, `App.tsx`

---
## 🗂 全店舗合計の toreta 集計は動的収集で行う (2026-02-20)
- **問題**: `全店舗合計（summaryShop）`のtoreta集計が、ハードコードされた媒体リストにしか集計されず、DB_toretaに存在する媒体が欠落する。
- **原因**: `toretaMedias` 配列でフィルタしていたため、電話・トレタ予約番・Retty・Googleで予約 等が0になっていた。
- **解決策**: 全店舗の `toreta_data` から `Set<string>` で動的に全媒体名を収集してから集計する。
  ```tsx
  const allToretaMedias = new Set<string>()
  shops.forEach(s => {
    s.toreta_data?.forEach((d: any) => {
      if (d.media) allToretaMedias.add(d.media)
    })
  })
  ```
- **背景**: GAS側の `jsonExporter.js` は DB_toreta の media 列を無フィルタで全出力するため、フロント側もそれに合わせて動的収集が必須。

