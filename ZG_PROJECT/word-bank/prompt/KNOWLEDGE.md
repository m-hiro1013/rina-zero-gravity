# Word-Bank Knowledge Base

## 知見一覧

- [Firebase] **Auth Persistence**: `setPersistence` を使ってログイン状態を維持する設定が必要。デフォルトは `browserSessionPersistence` だが、タブを閉じても維持したい場合は `browserLocalPersistence` を検討。
- [Tailwind] **Custom Colors**: `tailwind.config.js` の `theme.extend.colors` にカスタムカラーを追加することで、クラス名として使用可能（例: `bg-primary`, `text-accent`）。
- [React] **Context API**: 頻繁に更新される状態（入力フォーム等）をContextで管理すると再レンダリングが多くなるため、`useReducer` や分割されたContextの使用を検討する。
- [Firestore] **Security Rules**: 開発中は `allow read, write: if true;` にしがちだが、本番運用前には必ず認証済みユーザーのみに制限するルールを適用する。
