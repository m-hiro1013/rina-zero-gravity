# RPA開発フロー完全ガイド 🎯✨

> **このドキュメントは、RPAプロジェクトにおける開発の進め方を完全に定義したものです。**
> **全てのタスクは、この手順に従って進めてください。**

---

## 📋 目次

1. [基本原則](#基本原則)
2. [開発フローの全体像](#開発フローの全体像)
3. [Phase 1: Skill調査](#phase-1-skill調査)
4. [Phase 2: Test実験](#phase-2-test実験)
5. [Phase 3: Skill作成](#phase-3-skill作成)
6. [Phase 4: Workflow作成](#phase-4-workflow作成)
7. [ファイル管理ルール](#ファイル管理ルール)
8. [ドキュメント記載ルール](#ドキュメント記載ルール)
9. [禁止事項](#禁止事項)

---

## 基本原則

### 🎯 最優先事項

1. **Skill優先**: 全ての機能は、再利用可能なSkillとして実装する
2. **Test実験**: 動作確認はTestフォルダで行う（本番コードは書かない）
3. **漏れダブり禁止**: 同じ機能を複数の場所に実装しない
4. **再利用前提**: SkillとWorkflowは、他のプロジェクトでも使えるように設計する
5. **完全文書化**: 全てのSkillとWorkflowには、詳細なコメントを記載する

---

## 開発フローの全体像

```
┌─────────────────────────────────────────────────────────────┐
│ やりたいことが発生                                          │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Skill調査                                          │
│ - 該当する媒体フォルダのskillを探す                         │
│ - 使えるものと不足を確認                                    │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Test実験                                           │
│ - testフォルダで動作確認のみ行う                            │
│ - 使えるskillを併用して、余計なものは作らない               │
│ - 正式なloopや条件分岐は書かない（動作確認のみ！）          │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Skill作成                                          │
│ - 動作確認が完了したら、分解してskillを作成                 │
│ - 漏れダブり禁止（既存skillと重複しないように）             │
│ - testから削除                                              │
└─────────────────────┬───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Workflow作成                                       │
│ - skillが必要分揃ったら、workflowの作成に入る               │
│ - 複雑な条件や照合可否を試す際はtestで行う                  │
│ - ただし実際の動作はskillで完結すること                     │
│ - workflow固有のものは作らない                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Skill調査

### 🔍 目的

やりたいことを実現するために、既存のSkillが使えるか確認する。

### 📝 手順

1. **該当する媒体フォルダのskillを探す**
   ```
   例: hotpepper の場合
   → /Users/matsumotohiroki/Desktop/rina-zero-gravity/ZG_PROJECT/rpa/hotpepper/skill/
   ```

2. **既存Skillの一覧を確認**
   ```bash
   ls -la hotpepper/skill/
   ```

3. **各Skillファイルの冒頭コメントを読む**
   - 何ができるか
   - 何が必要か（事前準備、.envなど）
   - どう使うか

4. **使えるものと不足を確認**
   - ✅ 使えるSkill: そのまま使う
   - ⚠️ 不足しているSkill: Phase 2で実験して作成

### ✅ 完了条件

- 既存Skillで何ができるか把握できた
- 不足しているSkillが明確になった

---

## Phase 2: Test実験

### 🧪 目的

**動作確認のみ**を行う。本番コードは書かない。

### 📝 手順

1. **testフォルダに実験用ファイルを作成**
   ```
   例: tests/test_experiment_xxx.py
   ```

2. **使えるskillを併用する**
   ```python
   # ✅ 正しい例
   from hotpepper.skill.auth import login
   from hotpepper.skill.navigation import navigate_to_drink
   
   async def test_experiment():
       # 既存skillを使って動作確認
       await login(page, LOGIN_ID, PASSWORD, BASE_URL)
       await navigate_to_drink(page)
       # 新しい操作を試す
       await page.click("#newButton")
   ```

3. **余計なものは作らない**
   - ❌ 新しいヘルパー関数を作らない
   - ❌ 新しいクラスを作らない
   - ✅ 既存skillを組み合わせて、最小限のコードで動作確認

4. **正式なloopや条件分岐は書かない**
   ```python
   # ❌ NG: 本番用のloopを書く
   for item in items:
       await process_item(item)
   
   # ✅ OK: 動作確認のみ
   # 1つだけ試す
   await page.click("#item1")
   # 動いたら、次のPhaseでskillに分解
   ```

### ⚠️ 注意事項

- **testでやりたいのは動作確認のみ**
- 正式なloopや条件分岐は、workflow作成時にやる
- まずはskillのテスト優先

### ✅ 完了条件

- 新しい操作が動作することを確認できた
- どのskillを作るべきか明確になった

---

## Phase 3: Skill作成

### 🛠️ 目的

動作確認が完了したら、分解してskillを作成する。

### 📝 手順

1. **testで確認した操作を分解**
   ```
   例: カテゴリー設定の操作
   → setup_headings() という1つのskillに分解
   ```

2. **漏れダブり禁止**
   - 既存skillと重複しないか確認
   - 同じ機能を複数の場所に実装しない

3. **skillファイルに実装**
   ```
   例: hotpepper/skill/category_ops.py
   ```

4. **冒頭に詳細なコメントを記載**（後述の「ドキュメント記載ルール」参照）

5. **testから削除**
   ```bash
   rm tests/test_experiment_xxx.py
   ```

### ✅ 完了条件

- 新しいskillが作成された
- 既存skillと重複していない
- testフォルダから実験用ファイルが削除された

---

## Phase 4: Workflow作成

### 🔄 目的

skillが必要分揃ったら、workflowの作成に入る。

### 📝 手順

1. **skillが必要分揃っているか確認**
   - 全ての操作がskillで完結するか
   - 不足しているskillがないか

2. **workflowファイルを作成**
   ```
   例: hotpepper/workflow/update_drink_menu.py
   ```

3. **複雑な条件や照合可否を試す際はtestで行う**
   ```python
   # 複雑な条件分岐がある場合
   # → testで動作確認してから、workflowに実装
   ```

4. **ただし実際の動作はskillで完結すること**
   ```python
   # ❌ NG: workflow内で新しい操作を書く
   async def workflow():
       await page.click("#newButton")  # これはskillにすべき
   
   # ✅ OK: skillを組み合わせる
   async def workflow():
       await login(page, ...)
       await navigate_to_drink(page)
       await setup_headings(page, headings)
   ```

5. **workflow固有のものは作らない**
   - workflowは、skillの組み合わせのみ
   - 新しい操作が必要なら、skillに分解

### ✅ 完了条件

- workflowが作成された
- 全ての操作がskillで完結している
- workflow固有の操作がない

---

## ファイル管理ルール

### 📁 ディレクトリ構成

```
/Users/matsumotohiroki/Desktop/rina-zero-gravity/ZG_PROJECT/rpa/
├── hotpepper/                  # 媒体フォルダ
│   ├── skill/                  # 本番Skill（再利用可能）
│   │   ├── auth.py
│   │   ├── navigation.py
│   │   ├── drink_ops.py
│   │   ├── category_ops.py
│   │   └── ...
│   └── workflow/               # 本番Workflow（再利用可能）
│       ├── update_drink_menu.py
│       └── ...
├── tests/                      # 実験用（進行中のタスクのみ）
│   ├── test_experiment_xxx.py  # 進行中
│   └── ...
└── prompt/
    └── WORKFLOW.yaml           # 進捗管理
```

### 🗑️ 削除ルール

**testにあるのは進行中のタスクだけ**

- ✅ 動作確認が完了したら、testから削除
- ✅ skillに分解したら、testから削除
- ✅ workflowに統合したら、testから削除

**testに残すのは:**
- 🚧 進行中のタスク
- 🚧 動作確認中の実験

---

## ドキュメント記載ルール

### 📝 Skillファイルの冒頭コメント

**全てのSkillファイルには、以下の情報を記載すること:**

```python
"""
[Skillの名前] - [簡潔な説明]

## 🎯 目的
このSkillが何をするか、なぜ必要かを説明

## 📋 機能一覧
- 機能1: 説明
- 機能2: 説明

## 🔧 事前準備
### 必要な環境変数（.env）
- `HOTPEPPER_LOGIN_ID`: ホットペッパーのログインID
- `HOTPEPPER_PASSWORD`: ホットペッパーのパスワード

### 必要なパッケージ
- playwright
- python-dotenv

## 💡 使い方
```python
from hotpepper.skill.xxx import function_name

# 使用例
await function_name(page, arg1, arg2)
```

## ⚠️ 注意事項
- 注意点1
- 注意点2

## 🔗 関連Skill
- `auth.py`: ログイン処理
- `navigation.py`: ナビゲーション

## 📊 動作イメージ
1. ステップ1の説明
2. ステップ2の説明
3. ステップ3の説明

## 🧪 テスト方法
```python
# テストコード例
```
"""
```

### 📝 Workflowファイルの冒頭コメント

**全てのWorkflowファイルには、以下の情報を記載すること:**

```python
"""
[Workflowの名前] - [簡潔な説明]

## 🎯 目的
このWorkflowが何をするか、どんな業務を自動化するか

## 📋 処理フロー
1. ステップ1: 説明
2. ステップ2: 説明
3. ステップ3: 説明

## 🔧 事前準備
### 必要な環境変数（.env）
- `XXX`: 説明

### 必要なファイル
- `data/input.csv`: 入力データ

## 💡 使い方
```python
from hotpepper.workflow.xxx import workflow_name

# 使用例
await workflow_name(page, data)
```

## 🧩 使用しているSkill
- `auth.login()`: ログイン処理
- `navigation.navigate_to_drink()`: ドリンクメニューへ遷移
- `category_ops.setup_headings()`: カテゴリー設定

## ⚠️ 注意事項
- 注意点1
- 注意点2

## 📊 動作イメージ
1. ログイン
2. ドリンクメニューへ遷移
3. カテゴリー設定
4. 保存

## 🧪 テスト方法
```python
# テストコード例
```

## 🔄 エラー処理
- エラー1: 対処方法
- エラー2: 対処方法
"""
```

---

## 禁止事項

### ❌ 絶対にやってはいけないこと

1. **testに本番コードを書く**
   - testは動作確認のみ
   - 本番コードはskillかworkflowに書く

2. **同じ機能を複数の場所に実装する**
   - 漏れダブり禁止
   - 既存skillを確認してから実装

3. **workflow内で新しい操作を書く**
   - workflowは、skillの組み合わせのみ
   - 新しい操作が必要なら、skillに分解

4. **testを削除せずに残す**
   - 動作確認が完了したら、testから削除
   - testにあるのは進行中のタスクだけ

5. **ドキュメントを書かない**
   - 全てのskillとworkflowには、詳細なコメントを記載
   - 事前準備、使い方、動作イメージを必ず書く

---

## チェックリスト

### ✅ Phase 1: Skill調査

- [ ] 該当する媒体フォルダのskillを探した
- [ ] 既存Skillの一覧を確認した
- [ ] 各Skillファイルの冒頭コメントを読んだ
- [ ] 使えるものと不足を確認した

### ✅ Phase 2: Test実験

- [ ] testフォルダに実験用ファイルを作成した
- [ ] 使えるskillを併用した
- [ ] 余計なものは作らなかった
- [ ] 正式なloopや条件分岐は書かなかった
- [ ] 動作確認が完了した

### ✅ Phase 3: Skill作成

- [ ] testで確認した操作を分解した
- [ ] 既存skillと重複しないか確認した
- [ ] skillファイルに実装した
- [ ] 冒頭に詳細なコメントを記載した
- [ ] testから削除した

### ✅ Phase 4: Workflow作成

- [ ] skillが必要分揃っているか確認した
- [ ] workflowファイルを作成した
- [ ] 複雑な条件や照合可否をtestで確認した
- [ ] 実際の動作はskillで完結している
- [ ] workflow固有のものは作らなかった
- [ ] 冒頭に詳細なコメントを記載した

---

## まとめ

**このフローを徹底することで:**

1. ✅ **再利用性が高まる**: skillとworkflowは、他のプロジェクトでも使える
2. ✅ **保守性が高まる**: 同じ機能が複数の場所にないので、修正が簡単
3. ✅ **可読性が高まる**: 詳細なコメントがあるので、後から見てもわかる
4. ✅ **テストが簡単**: 動作確認はtestで行い、本番コードはskillで完結
5. ✅ **開発が速くなる**: 既存skillを組み合わせるだけで、新しい機能が作れる

**全てのタスクは、この手順に従って進めてください。**
