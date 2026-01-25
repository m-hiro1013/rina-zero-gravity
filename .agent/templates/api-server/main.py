"""
{{project_name}} - FastAPI Server

このファイルがAPIサーバーのエントリーポイントだよ！
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
from dotenv import load_dotenv

# 環境変数を読み込む
load_dotenv()

# FastAPIアプリケーション作成
app = FastAPI(
    title="{{project_name}}",
    description="{{description}}",
    version="0.1.0"
)

# CORS設定（フロントエンドからのアクセスを許可）
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切に設定してね！
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ===== データモデル =====

class Item(BaseModel):
    """アイテムモデル"""
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True


class ItemCreate(BaseModel):
    """アイテム作成用モデル"""
    name: str
    description: Optional[str] = None
    price: float
    is_available: bool = True


# ===== 仮データ（データベース代わり） =====

items_db: list[Item] = [
    Item(id=1, name="サンプルアイテム", description="これはサンプルだよ", price=1000),
    Item(id=2, name="テストアイテム", description="テスト用", price=500),
]


# ===== エンドポイント =====

@app.get("/")
async def root():
    """ルートエンドポイント"""
    return {
        "message": "Welcome to {{project_name}}!",
        "docs": "/docs",
        "version": "0.1.0"
    }


@app.get("/health")
async def health_check():
    """ヘルスチェック"""
    return {"status": "healthy"}


@app.get("/items", response_model=list[Item])
async def get_items():
    """全アイテムを取得"""
    return items_db


@app.get("/items/{item_id}", response_model=Item)
async def get_item(item_id: int):
    """指定IDのアイテムを取得"""
    for item in items_db:
        if item.id == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@app.post("/items", response_model=Item)
async def create_item(item: ItemCreate):
    """新しいアイテムを作成"""
    new_id = max([i.id for i in items_db], default=0) + 1
    new_item = Item(id=new_id, **item.model_dump())
    items_db.append(new_item)
    return new_item


@app.put("/items/{item_id}", response_model=Item)
async def update_item(item_id: int, item: ItemCreate):
    """アイテムを更新"""
    for i, existing_item in enumerate(items_db):
        if existing_item.id == item_id:
            updated_item = Item(id=item_id, **item.model_dump())
            items_db[i] = updated_item
            return updated_item
    raise HTTPException(status_code=404, detail="Item not found")


@app.delete("/items/{item_id}")
async def delete_item(item_id: int):
    """アイテムを削除"""
    for i, item in enumerate(items_db):
        if item.id == item_id:
            items_db.pop(i)
            return {"message": "Item deleted successfully"}
    raise HTTPException(status_code=404, detail="Item not found")


# ===== 起動 =====

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
