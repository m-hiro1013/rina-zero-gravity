"""
データパーサー - テキスト形式のメニューデータを構造化データに変換する

## 🎯 目的
ひろきくんが提供するテキスト形式のメニューデータ（`---` 区切り）を、
Playwright で登録可能な構造化データ（辞書のリスト）に変換する。

## 📋 機能一覧
- `parse_menu_text(text)`: テキスト全体をパースして、見出しと商品のリストを返す

## 💡 使い方
```python
from hotpepper.skill.data_parser import parse_menu_text

sample_data = \"\"\"
[見出し]カテゴリ名
説明文（無視される）
---
商品名
説明文
968円
---
\"\"\"

menu_items = parse_menu_text(sample_data)
# [
#     {"type": "heading", "title": "カテゴリ名"},
#     {"type": "product", "title": "商品名", "description": "説明文", "price": "968"},
# ]
```

## ⚠️ 注意事項
- 見出しブロックの説明文は **無視** される（ホットペッパーではカテゴリ名のみ登録）
- `[おすすめ]` は単なるマーカーで、通常商品として処理される
- 商品の最後の行は必ず「000円」か「[空白]」のどちらか
- `[空白]` は価格欄を `.` にする指示

## 🔗 関連Skill
- `drink_ops.py`: ドリンクメニュー操作（登録処理で使用）

## 📊 データフォーマット仕様
BOOK.md の「📥 入力（ひろきくんが持ってくる形式）」を参照
"""

import re
from collections import defaultdict


def parse_menu_text(text: str) -> list[dict]:
    """
    テキスト形式のメニューデータをパースする
    
    Args:
        text: `---` で区切られたメニューデータテキスト
    
    Returns:
        構造化されたメニューアイテムのリスト
        [
            {"type": "heading", "title": "カテゴリ名"},
            {"type": "product", "category_index": 0, "title": "商品名", "description": "説明文", "price": "968"},
            {"type": "product", "category_index": 1, "title": "商品名2", "description": "説明文2", "price": "."},
        ]
    """
    # `---` でブロック分割
    blocks = text.strip().split("---")
    
    menu_items = []
    current_category_index = -1  # 🆕 現在のカテゴリーインデックスを追跡
    
    for block in blocks:
        # 空白ブロックをスキップ
        block = block.strip()
        if not block:
            continue
        
        # 行に分割
        lines = [line.strip() for line in block.split("\n") if line.strip()]
        
        if not lines:
            continue
        
        # 1行目で種別判定
        first_line = lines[0]
        
        # 見出し（カテゴリ）の場合
        if first_line.startswith("[見出し]"):
            title = first_line.replace("[見出し]", "").strip()
            menu_items.append({
                "type": "heading",
                "title": title
            })
            # 🆕 カテゴリーが追加されたのでインデックスをインクリメント
            current_category_index += 1
            # 説明文は無視（ホットペッパーでは不要）
            continue
        
        # 商品の場合（`[おすすめ]` も商品として扱う）
        # タイトルを取得（`[おすすめ]` があれば削除）
        title = first_line
        if title.startswith("[おすすめ]"):
            title = title.replace("[おすすめ]", "").strip()
        
        # 最後の行を価格として取得
        last_line = lines[-1]
        
        # 価格の判定
        if last_line == "[空白]":
            price = "."
            description_lines = lines[1:-1]  # タイトルと価格を除いた中間部分
        else:
            # 数値（000円）を抽出
            price_match = re.search(r"(\d+)円?", last_line)
            if price_match:
                price = price_match.group(1)  # 数値のみ
                description_lines = lines[1:-1]  # タイトルと価格を除いた中間部分
            else:
                # 価格が見つからない場合は、最後の行も説明文として扱う
                price = ""
                description_lines = lines[1:]
        
        # 説明文を結合
        description = "\n".join(description_lines)
        
        menu_items.append({
            "type": "product",
            "category_index": current_category_index,  # 🆕 カテゴリーインデックスを追加
            "title": title,
            "description": description,
            "price": price
        })
    
    return menu_items


def group_products_by_category(products: list[dict]) -> tuple[dict, dict]:
    """
    商品リストをカテゴリーインデックスごとにグループ化し、各カテゴリーの必要行数も返す
    
    Args:
        products: parse_menu_text で解析された商品リスト（type='product' のもの）
        
    Returns:
        (products_by_category, required_rows) のタプル
        - products_by_category: {cat_idx: [product_dict, ...]}
        - required_rows: {cat_idx: 行数}
    """
    products_by_category = defaultdict(list)
    for p in products:
        idx = p.get("category_index", 0)
        products_by_category[idx].append(p)
    
    required_rows = {idx: len(items) for idx, items in products_by_category.items()}
    
    return products_by_category, required_rows

