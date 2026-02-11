from playwright.async_api import Page

from typing import Union
from playwright.async_api import Page, Frame

async def update_drink_item(page: Union[Page, Frame], index: int, name: str = None, catch: str = None, price: str = None):
    """
    指定したインデックスのドリンク項目を更新する特技だよ！💅
    index: 0から始まる連番（#drinkName0, #drinkPrice0...に対応）
    """
    print(f"✨ [SKILL] ドリンク項目 {index} を更新中...")
    
    # 🏗️ 行の特定（超重要！）
    # 行のIDが #drinkMenu{index} じゃない場合もあるから、商品名フィールドを基準に行(TR)を探すよ！💅
    name_id = f"#drinkName{index}"
    # まずそのフィールドが存在するか確認（タイムアウト防止）
    name_field = page.locator(name_id)
    try:
        await name_field.wait_for(state="attached", timeout=10000)
    except:
        print(f"⚠️ [SKILL] 商品フィールド {name_id} が見つからないよ。行 ID を直接試してみるね。")

    # 行スコープの決定（複数のパターンで攻めるよ！）
    # 1. ズバリそのもののIDがある場合
    # 2. TRの中にそのIDがある場合（これが一番確実！）
    row = page.locator(f"tr:has({name_id}), #drinkMenu{index}, {name_id}").first
    
    # 名前
    if name is not None:
        # rowスコープ内でもう一度 locator を作ると確実！
        target_name_field = row.locator(name_id)
        await target_name_field.scroll_into_view_if_needed()
        await target_name_field.fill(name)
    
    # キャッチ
    if catch is not None:
        catch_field = row.locator(f"#drinkCatch{index}")
        await catch_field.fill(catch)
        
    # 価格設定
    if price is not None:
        if price in ["", "空白", "."]:
            # 【ドット回避】自由入力モード(jscTxtInput)
            print(f"🔗 [SKILL] 価格にドット回避を適用します")
            # rowスコープ内なら、.jscTxtInput が付いているラジオボタンは一つのはず！
            radio = row.locator("input.jscSetMenuPriceCheck.jscTxtInput")
            await radio.click()
            
            # 有効化されるまで待機（莉奈のこだわり！）
            price_field = row.locator(f"#drinkPrice{index}")
            await price_field.wait_for(state="visible")
            for _ in range(10):
                if await price_field.is_enabled():
                    break
                await asyncio.sleep(0.2)
                
            await price_field.fill(".")
        else:
            # 通常の数値入力モード
            radio = row.locator("input.jscSetMenuPriceCheck:not(.jscTxtInput)")
            await radio.click()
            
            price_input_field = row.locator(f"#drinkPriceNumber{index}")
            await price_input_field.wait_for(state="visible")
            # enabled待ち
            for _ in range(10):
                if await price_input_field.is_enabled():
                    break
                await asyncio.sleep(0.2)
                
            numeric_price = "".join(filter(str.isdigit, price))
            await price_input_field.fill(numeric_price)
            
            # 税込みチェックボックス
            tax_check = row.locator("input.jscTaxCheckBox")
            if not await tax_check.is_checked():
                await tax_check.click()

async def clear_some_items(page: Union[Page, Frame], count_to_delete: int = 3):
    """
    下から指定された数だけ削除！「削除を取り消す」を誤操作しないように完全一致で狙うよ！🎯💅
    """
    print(f"🧹 [SKILL] 下から {count_to_delete} 件だけ確実に削除してみるよ！")
    
    delete_locator = page.get_by_role("link", name="削除", exact=True).and_(page.locator(":visible"))
    total_count = await delete_locator.count()
    
    if total_count == 0:
        print("ℹ️ [SKILL] 削除ボタン（完全一致）が一つも見つからないよ！")
        return
        
    actual_delete_count = min(count_to_delete, total_count)
    print(f"📋 [SKILL] 候補を {total_count} 件発見。下から {actual_delete_count} 件実行するね🚀")
    
    for i in range(total_count - 1, total_count - 1 - actual_delete_count, -1):
        print(f"🗑️ [SKILL] インデックス {i} の『削除』ボタンを狙い撃ち！")
        try:
            btn = page.get_by_role("link", name="削除", exact=True).and_(page.locator(":visible")).nth(i)
            await btn.click(no_wait_after=True)
            await page.wait_for_timeout(500)
        except Exception as e:
            print(f"⚠️ [SKILL] 失敗：{e}")
            
    print(f"✅ [SKILL] {actual_delete_count} 件の削除を試みたよ！")

async def clear_all_items(page: Union[Page, Frame]):
    """
    全商品を「削除」ボタン完全一致でしつこく消し去る特技！🗑️💅
    """
    print("🧹 [SKILL] ドリンク項目の全削除を開始するよ！")
    retry_count = 0
    while retry_count < 5:
        delete_locator = page.get_by_role("link", name="削除", exact=True).and_(page.locator(":visible"))
        total_count = await delete_locator.count()
        
        if total_count == 0:
            print("✨ [SKILL] 画面上に削除対象は見当たらないよ！")
            break
            
        print(f"📋 [SKILL] {total_count} 件発見！下から順番に消していくね🚀")
        
        for i in range(total_count - 1, -1, -1):
            try:
                btn = page.get_by_role("link", name="削除", exact=True).and_(page.locator(":visible")).nth(i)
                if await btn.is_visible(timeout=1000):
                    await btn.click(no_wait_after=True)
                    await page.wait_for_timeout(50)
            except:
                pass
        
        await page.wait_for_timeout(500)
        retry_count += 1
            
    print("✅ [SKILL] ドリンク項目のクリーンアップ完了！完全更地だよ✨")


async def add_drink_row(page: Union[Page, Frame]):
    """
    「メニューを追加する」リンクをクリックする特技！💅
    """
    print("➕ [SKILL] 新しい行を追加中...")
    selector = "a:has-text('メニューを追加する')"
    await page.locator(selector).scroll_into_view_if_needed()
    await page.click(selector)

async def save_drink_draft(page: Page):
    """
    下書き保存を実行し、完了画面(publishControl)から編集画面に舞い戻る特技！🔄💅
    iframe内のボタンも考慮するよ！
    """
    print("💾 [SKILL] 下書き保存を実行中...")
    
    # 🎭 iframe 内の保存ボタンも探す
    iframe = page.frame(name="sb-player")
    target = iframe if iframe else page
    
    # セレクタ候補（b-log & category_ops.py 参考）
    selectors = [
        "input.tabindex2036",        # b-log実測値
        "input.tabindex2031",        # メイン編集画面（独自）
        "input.tabindex142[value='下書き保存する']", # iframe内（実績あり）
        "input[value*='下書き保存']",
        "input[type='submit'][value*='保存']"
    ]
    
    save_found = False
    for sel in selectors:
        try:
            btn = target.locator(sel).first
            if await btn.is_visible(timeout=3000):
                print(f"🎯 [SKILL] 保存ボタン発見！ ({sel})")
                await btn.click(force=True)
                save_found = True
                break
        except:
            continue
            
    if not save_found:
        print("⚠️ [SKILL] 保存ボタンが見つかりません。直接クリックを試みます。")
        # 最終手段
        await page.get_by_role("button", name="下書き保存する").click(force=True)
    
    # モーダル突破
    try:
        ok_btn = page.locator("a.jscAlertModalOkBtn:has-text('OK')").first
        if await ok_btn.is_visible(timeout=3000):
            await ok_btn.click(force=True)
    except:
        pass
        
    await page.wait_for_url("**/publishControl/**")
    print("✅ [SKILL] 保存完了画面（ステータス画面）に到着！")
    
    back_btn = page.locator("input[value*='ドリンクメニュー'], #article input[type='submit']").first
    await back_btn.click()
    
    await page.wait_for_url("**/draft/drinkInfoEdit/**")
    print("🏠 [SKILL] ただいま！ドリンク編集画面に無事帰還したよ！💖✨")


