from playwright.async_api import Page
from typing import AsyncGenerator
from hotpepper.skill.navigation import navigate_to_drink
from hotpepper.skill.drink_ops import (
    update_drink_item,
    save_drink_draft,
    clear_all_items,
    ensure_rows_for_categories,
    get_drink_indices_per_category,
    get_drink_target
)
from hotpepper.skill.category_ops import setup_headings, clear_all_headings
from hotpepper.skill.data_parser import parse_menu_text, group_products_by_category
from hotpepper.skill.browser import create_browser_session

async def run(inputs: dict) -> AsyncGenerator[str, None]:
    """
    app.py から呼ばれるドリンク更新ワークフローのエントリーポイント。
    
    inputs:
        - store: 店舗名（str）。"（一番上の店舗を選択）" の場合は None 扱い
        - menu_data: メニューデータテキスト（str）
        - skip_clear: 既存データ削除スキップ（bool）
    
    yields:
        - 進捗ログメッセージ（str）
    """
    store_name = None if inputs["store"] == "（一番上の店舗を選択）" else inputs["store"]
    menu_data = inputs["menu_data"]
    skip_clear = inputs["skip_clear"]
    
    # ブラウザセッション作成（ログイン・店舗選択まで完了）
    pw, browser, page = await create_browser_session(store_name=store_name)
    
    try:
        yield "🚀 [FLOW] ドリンクメニュー更新ワークフローを開始するよ！✨"
        # 実処理を実行
        async for log in process_drink_menu(page, menu_data, skip_clear=skip_clear):
            yield log
            
        yield "✅ [FLOW] 全て完了！ブラウザで結果を確認してね💖"
        
        # 目視確認のために一時停止（ユーザーが閉じるのを待つわけではないが、アプリ側で制御）
        # 注意: app.py 側で stop ボタンや終了処理が入るまでは維持される
        await page.pause()
        
    except Exception as e:
        yield f"❌ [FLOW] エラーが発生しちゃった: {e}"
        # エラー時もデバッグのために pause
        await page.pause()
        raise e
    finally:
        await browser.close()
        await pw.stop()

async def process_drink_menu(page: Page, menu_data_text: str, skip_clear: bool = False) -> AsyncGenerator[str, None]:
    """
    ドリンクメニュー一括更新の実処理
    """
    yield "📝 [FLOW] メニューデータを解析中..."
    menu_items = parse_menu_text(menu_data_text)
    
    # 見出しと商品を分離
    headings = [item["title"] for item in menu_items if item["type"] == "heading"]
    products = [item for item in menu_items if item["type"] == "product"]

    yield f"📊 [FLOW] 解析完了：カテゴリー {len(headings)} 件 / 商品 {len(products)} 件"

    # 1️⃣ 画面遷移 & 削除（オプション）
    await navigate_to_drink(page)
    
    target = await get_drink_target(page)
    
    if skip_clear:
        yield "⏭️ [FLOW] テスト効率化のため、全件削除をスキップするよ！💅"
    else:
        yield "🧹 [FLOW] 既存データをクリーンアップ中..."
        await clear_all_items(target)
        await clear_all_headings(page)
        
        # 帰還後のターゲット再取得
        target = await get_drink_target(page)

    # 2️⃣ カテゴリー（見出し）一括作成
    if headings:
        yield "🏗️ [FLOW] カテゴリーを再構築中..."
        await setup_headings(page, headings)
        # 帰還後のターゲット再取得
        target = await get_drink_target(page)

    # 3️⃣ 商品の流し込み
    yield f"📝 [FLOW] 商品を {len(products)} 件登録していくよ！"
    
    # 商品をカテゴリーごとにグループ化
    products_by_category, required_rows = group_products_by_category(products)
    yield f"📊 [FLOW] 必要な行数: {required_rows}"
    
    # 行数を確保
    await ensure_rows_for_categories(target, required_rows)
    
    # カテゴリーごとの実際の行indexを取得
    indices_per_category = await get_drink_indices_per_category(target, len(products_by_category))
    
    # 入力ループ
    for category_idx in sorted(products_by_category.keys()):
        category_products = products_by_category[category_idx]
        actual_indices = indices_per_category.get(category_idx, [])
        
        yield f"🏗️ [FLOW] カテゴリー {category_idx} の商品を {len(category_products)} 件登録中..."
        
        for i, product in enumerate(category_products):
            if i >= len(actual_indices):
                yield f"⚠️ [FLOW] カテゴリー {category_idx} の行が足りないためスキップ: {product['title']}"
                continue
            
            actual_index = actual_indices[i]
            yield f"📦 [FLOW] #{actual_index}: {product['title']} ({product['price']}円)"
            
            await update_drink_item(
                target, 
                actual_index, 
                name=product["title"], 
                catch=product["description"], 
                price=product["price"], 
                with_tax=True
            )

    # 4️⃣ 保存
    yield "💾 [FLOW] 仕上げの保存を実行中..."
    await save_drink_draft(page)
    
    yield "🏁 [FLOW] ドリンクメニュー更新フロー完了！"
