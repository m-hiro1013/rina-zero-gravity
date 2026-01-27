---
trigger: always_on
slug: command-rules
---
# コマンド実行ルール (Command Execution Rules)

## コマンド実行の基本方針

- **1コマンドずつ実行してください**
- 複数のコマンドを連結（`&&` や `;`）して一度に実行しないでください
- 各コマンドの実行結果を確認してから次のコマンドに進んでください

## 理由

- エラーが発生した場合に原因を特定しやすくするため
- 各ステップの出力を確認しながら進めるため
- 問題が起きた時点で停止し、対処できるようにするため

## 例

### ❌ NG: 複数コマンドの連結実行

```bash
npm install && npm run build && npm start
```

### ✅ OK: 1コマンドずつ実行

```bash
npm install
```
↓ 結果を確認

```bash
npm run build
```
↓ 結果を確認

```bash
npm start
```

## 例外

以下の場合のみ、コマンドの連結を許可します：

- ユーザーが明示的に連結実行を指示した場合
- パイプ（`|`）を使った出力の受け渡しが必要な場合
  - 例: `cat file.txt | grep "pattern"`

## 必須：カレントディレクトリの明示
ユーザーにコピー＆ペースト用のコマンドを提示する場合は、**必ず最初にプロジェクトルートへの `cd` コマンドを含めてください。**

### ❌ NG: いきなり実行
```bash
./.venv/bin/python3 tools/test_uploader.py
```

### ✅ OK: ディレクトリ移動を含める
```bash
cd /Users/matsumotohiroki/Desktop/WORKSPACE/rina-zero-gravity/ZG-PROJECT/under-the-sea
./.venv/bin/python3 tools/test_uploader.py
```
