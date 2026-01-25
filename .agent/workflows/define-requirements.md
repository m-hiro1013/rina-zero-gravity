---
description: ユーザーとの対話で要件を明確化し、PROJECT_SPECIFIC.yamlを作成する。
---
# /define-requirements - 要件定義ワークフロー

ユーザーから要件を聞き取って、PROJECT_SPECIFIC.yaml を作成するよ！

## 前提条件
- `/start-project` から呼び出される
- ユーザーがプロジェクトを作りたいと思っている

## 質問ルール
- **1問1答形式**（複数の質問をまとめて聞かない）
- 各質問で3案提示 + 推奨理由
- ユーザーが「お任せ」と言ったら推奨案を採用

## Step 1: プロジェクト名を聞く

```
まず、プロジェクト名を決めよ！

例:
- my-portfolio（ポートフォリオサイト）
- task-manager（タスク管理アプリ）
- sales-dashboard（営業ダッシュボード）

英語のケバブケース（小文字-ハイフン区切り）がおすすめだよ！
```

## Step 2: 目的を聞く

```
次に、何を作るか教えて！

例:
- 「自分のポートフォリオを作りたい」
- 「タスクを管理できるアプリが欲しい」
- 「営業データを可視化したい」

ざっくりでいいから教えてね！
```

## Step 3: ターゲットユーザーを聞く

```
誰が使う？

- 自分だけ
- チームメンバー
- 一般ユーザー
- 特定の業種（例: 営業チーム）

これで機能の複雑さが変わってくるんだ〜
```

## Step 4: 主な機能を聞く

```
欲しい機能を教えて！箇条書きでOK！

例:
- ログイン機能
- タスクの追加・編集・削除
- ダークモード
- データのエクスポート

思いつく限り書いてみて！
後から追加もできるから大丈夫だよ〜
```

## Step 5: 制約条件を聞く

```
何か制約ある？

- 期限（いつまでに完成？）
- 予算（有料サービス使える？）
- 技術的な制約（◯◯を使いたい/使いたくない）
- その他（既存システムとの連携とか）

特になければ「なし」でOK！
```

## Step 6: PROJECT_SPECIFIC.yaml 生成

収集した情報をもとに `prompt/PROJECT_SPECIFIC.yaml` を作成：

```yaml
project_specific:
  version: "1.0"
  last_updated: "{{date}}"

project:
  name: "{{project_name}}"
  codename: "{{codename}}"
  description: |
    {{description}}
  
  purpose:
    primary: "{{purpose}}"
  
  success_criteria:
    - "{{criteria_1}}"
    - "{{criteria_2}}"
  
  created_at: "{{date}}"

user:
  developer:
    name: "{{user_name}}"
    github: "{{github_username}}"
  
  target_users:
    - role: "{{role_1}}"
      description: "{{role_1_description}}"

tech_stack:
  language: "{{language}}"
  framework: "{{framework}}"
  database: "{{database}}"
  deploy: "{{deploy}}"

constraints:
  technical:
    - "{{constraint_1}}"
  business:
    - "{{constraint_2}}"
```

## Step 7: WORKFLOW.yaml も初期化

`prompt/WORKFLOW.yaml` を作成し、機能一覧を追加：

```yaml
features:
  planned:
    - id: "F001"
      name: "{{feature_1}}"
      status: "planned"
      description: "{{feature_1_description}}"
    
    - id: "F002"
      name: "{{feature_2}}"
      status: "planned"
```

## Step 8: 確認

```
要件定義できた！確認するね〜

---

**プロジェクト名**: {{project_name}}

**目的**: {{purpose}}

**ターゲット**: {{target_users}}

**主な機能**:
1. {{feature_1}}
2. {{feature_2}}
...

**技術スタック**: {{tech_stack}}

**制約条件**: {{constraints}}

---

📁 prompt/フォルダに以下を作成したよ：
- PROJECT_SPECIFIC.yaml（プロジェクト設定）
- WORKFLOW.yaml（進捗管理）
- SYSTEM_PROMPT.yaml（AIの振る舞い）
- ARCHITECTURE.yaml（実装済み機能）

この内容でOK？修正あったら言ってね！
```

## 完了条件
- prompt/PROJECT_SPECIFIC.yaml が作成されている
- prompt/WORKFLOW.yaml が作成されている
- ユーザーが内容を承認

## 出力
- prompt/PROJECT_SPECIFIC.yaml
- prompt/WORKFLOW.yaml（初期状態）
- prompt/SYSTEM_PROMPT.yaml
- prompt/ARCHITECTURE.yaml
