import asyncio
import sys
import os

# プロジェクトルートをパスに追加
sys.path.append(os.getcwd())

from hotpepper.skill.browser import create_browser_session
from hotpepper.skill.navigation import navigate_to_drink
from hotpepper.skill.drink_ops import get_drink_target
from playwright.async_api import Page, Frame

async def inspect():
    print("🚀 [DEBUG] ドリンク画面のインデックス解析を開始するよ！💅✨")
    
    # ブラウザ起動（一番上の店舗を選択）
    pw, browser, page = await create_browser_session()
    
    try:
        # ドリンク編集画面へ遷移
        await navigate_to_drink(page)
        target = await get_drink_target(page)
        
        print("\n🔍 [DEBUG] 画面上のカテゴリーと商品インデックスを調査中...")
        
        # 「メニューを追加する」ボタンを起点にカテゴリーを特定
        # 0: 分類未設定, 1: 自作1つ目...
        add_buttons = await target.locator("a:has-text('メニューを追加する')").all()
        
        if not add_buttons:
            print("❌ [DEBUG] 『メニューを追加する』ボタンが見つかりませんでした。")
            return

        print(f"📊 [DEBUG] 発見したカテゴリーボタン数: {len(add_buttons)}")
        
        # カテゴリー1から解析（カテゴリー0は無視）
        for cat_idx in range(1, len(add_buttons)):
            button = add_buttons[cat_idx]
            
            # 親テーブルを特定
            # XPath ancestor で最も近い table を取得（drink_ops.py の実績ロジック）
            parent_table = button.locator("xpath=ancestor::table[1]")
            
            # カテゴリー名を取得（テーブルの前の要素などから推測、またはテーブル内の特定行から）
            # ここではシンプルに「カテゴリー {cat_idx}」として表示
            
            # テーブル内の drinkName フィールドを取得（表示されているものだけ！）
            textareas = await parent_table.locator("textarea[id^='drinkName']").and_(target.locator(":visible")).all()
            
            indices = []
            for ta in textareas:
                id_attr = await ta.get_attribute("id")
                if id_attr:
                    try:
                        idx = int(id_attr.replace("drinkName", ""))
                        if idx != 0: # index 0 はテンプレートなので除外
                            indices.append(idx)
                    except: pass
            
            indices.sort()
            
            print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"📂 カテゴリー {cat_idx} (自作カテゴリー {cat_idx})")
            print(f"📝 商品数: {len(indices)} 件")
            print(f"🔢 インデックス一覧: {indices}")
        
        print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
        print("✅ [DEBUG] 解析完了！ブラウザを閉じるね。")
        
    except Exception as e:
        print(f"❌ [DEBUG] エラーが発生したよ: {e}")
    finally:
        await browser.close()
        await pw.stop()

if __name__ == "__main__":
    asyncio.run(inspect())
