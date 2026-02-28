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

## Step 1: `prompt/define.txt` の作成

プロジェクトの要件をまとめてヒアリングするために、`prompt/define.txt` を作成するよ！

1. `prompt/` ディレクトリが存在しない場合は作成する。
2. 以下の内容で `prompt/define.txt` を作成する：

```text
# プロジェクト要件定義 (Requirements Definition)

以下の項目について、わかる範囲で記入してください。
右側の `（ここに記入）` の部分を書き換えてください。

--------------------------------------------------
- プロジェクト名 (英語ケバブケース推奨): （ここに記入）
- 目的（何を作るか、どんな課題を解決するか）: （ここに記入）
- ターゲットユーザー（誰が使うか）: （ここに記入）

▼ 主な機能（欲しい機能を箇条書きで）
- （ここに記入）
- （ここに記入）

▼ 制約条件（期限、予算、使用技術の指定、既存システムとの連携など）
- （ここに記入）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
※このファイル (`define.txt`) を保存したら、私に「書いたよ！」って教えてね！✨
```

## Step 2: ユーザーの記入待ち

```
要件定義のためのテンプレート `prompt/define.txt` を作ったよ！✨

エディタで開いて、右側の `（ここに記入）` の部分を好きなように書き換えてね！
箇条書きで追加したり、自由に追記してOKだよ！

書き終わって保存したら、「書いたよ！」って教えてね！待ってるよ〜💖
```

## Step 3: `define.txt` の読み込みと内容確認

ユーザーから「書いたよ！」と合図があったら、`prompt/define.txt` を読み込む。
内容を分析し、不明点や深掘りしたい点があれば、ここで一問一答で確認する。

## Step 4: PROJECT_SPECIFIC.yaml 生成

収集した `define.txt` の情報をもとに `prompt/PROJECT_SPECIFIC.yaml` を作成：

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

## Step 5: WORKFLOW.yaml も初期化

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

## Step 6: 確認

```
要件定義できた！YAMLファイルに落とし込んだよ〜


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
