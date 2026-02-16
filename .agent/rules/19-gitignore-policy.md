# 無人島ポリシー (.gitignore Rules) 🏝️

「手作りしたもの以外、全部捨てろ！」
これがプロジェクトを清潔に保つための鉄則だよ！✨

## 🚫 持ち込み禁止（除外するもの）

誰でも再現できるものや、環境固有のものはコミットしない！

### 1. 誰でも作れるもの（生成物）
- パッケージマネージャーで入るもの
  - `node_modules/`
  - `venv/`
  - `.venv/`
  - `vendor/`
  - `__pycache__/`
- コマンド一発で生成できるもの

### 2. 結果として出たもの（ビルド成果物）
- コンパイル結果
  - `dist/`
  - `build/`
  - `out/`
  - `.next/`
- 実行ファイル
  - `*.exe`
  - `*.app`
  - `bin/`

### 3. 秘密のもの（セキュリティ）
- パスワード、APIキー
  - `.env`
  - `.env.*.local`
  - `*.key`
  - `*.pem`
  - `secrets.json`
- **絶対守る**: これらをコミットしたら事故だよ！🚨

### 4. PCのゴミ（システムファイル）
- OSが勝手に作るやつ
  - `.DS_Store`
  - `Thumbs.db`
- ログファイル
  - `*.log`
  - `npm-debug.log`
  - `yarn-error.log`

## ✅ 必需品（含めるもの）

「無人島に持って行くならこれ！」
これがないと他の人が仕事できない、命の次に大事なもの。

### 1. ソースコード
- 魂を込めて書いたプログラム
  - `*.py`, `*.ts`, `*.tsx`, `*.js`, `*.html`, `*.css`

### 2. 設計図（依存関係定義）
- ライブラリを呼ぶためのリスト
  - `package.json`
  - `requirements.txt`
  - `pyproject.toml`
  - `Gemfile`
- ロックファイル（※再現性に必須！）
  - `package-lock.json`
  - `pnpm-lock.yaml`
  - `yarn.lock`
  - `poetry.lock`

### 3. 設定ファイル
- チームで共有するルール
  - `.eslintrc.*`
  - `tsconfig.json`
  - `ruff.toml`
  - `pyrightconfig.json`
  - `.prettierrc`

### 4. アセット
- 生成できない素材
  - `assets/logo.png`
  - `public/favicon.ico`

## 🔍 チェックリスト（コミット前の儀式）

コミットする前に必ず自問自答してね！

- [ ] それ、`npm install` で戻せる？ → **Yesなら除外！**
- [ ] それ、ビルドすれば作れる？ → **Yesなら除外！**
- [ ] それ、あなたのPCにしかない情報？ → **Yesなら除外！**
- [ ] それがないと、隣の席の人が困る？ → **Yesなら含める！**

## 💡 困ったときは？

- 「これどっち？」って迷ったら、とりあえず `.gitignore` に書く前に **Orchestrator** に聞いて！
- `git status` で余計なファイルが出てないか常にチェックする癖をつけよう！
