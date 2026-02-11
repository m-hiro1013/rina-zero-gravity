from playwright.async_api import Page

async def update_drink_item(page: Page, index: int, name: str = None, catch: str = None, price: str = None):
    """
    指定したインデックスのドリンク項目を更新する特技だよ！💅
    index: 1から始まる連番
    """
    print(f"✨ [SKILL] ドリンク項目 {index} を更新中...")
    
    # 名前 (b-log: #drinkName1)
    if name is not None:
        selector = f"#drinkName{index}"
        await page.scroll_into_view_if_needed(selector)
        await page.fill(selector, name)
    
    # キャッチ (b-log: #drinkCatch1)
    if catch is not None:
        selector = f"#drinkCatch{index}"
        await page.fill(selector, catch)
        
    # 価格設定 (b-log: .jscSetMenuPriceCheck)
    if price is not None:
        if price in ["", "空白", "."]:
            # 【ドット回避】自由入力モード(jscTxtInput)を選択して "." を入れる！💅
            print(f"🔗 [SKILL] 価格にドット回避を適用します")
            target_radio = page.locator("input.jscSetMenuPriceCheck.jscTxtInput").nth(index - 1)
            await target_radio.click()
            
            price_text_selector = f"#drinkPrice{index}"
            await page.fill(price_text_selector, ".")
        else:
            # 通常の数値入力モード
            target_radio = page.locator("input.jscSetMenuPriceCheck:not(.jscTxtInput)").nth(index - 1)
            await target_radio.click()
            
            price_input_selector = f"#drinkPriceNumber{index}"
            numeric_price = "".join(filter(str.isdigit, price))
            await page.fill(price_input_selector, numeric_price)
            
            # 税込みチェックボックス
            tax_check = page.locator("input.jscTaxCheckBox").nth(index - 1)
            if not await tax_check.is_checked():
                await tax_check.click()

async def clear_some_items(page: Page, count_to_delete: int = 3):
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
        print(f"🗑️ [SKILL] インデックス {i+1} の『削除』ボタンを狙い撃ち！")
        try:
            btn = page.get_by_role("link", name="削除", exact=True).and_(page.locator(":visible")).nth(i)
            await btn.click(no_wait_after=True)
            await page.wait_for_timeout(500)
        except Exception as e:
            print(f"⚠️ [SKILL] 失敗：{e}")
            
    print(f"✅ [SKILL] {actual_delete_count} 件の削除を試みたよ！")

async def clear_all_items(page: Page):
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


async def add_drink_row(page: Page):
    """
    「メニューを追加する」リンクをクリックする特技！💅
    """
    print("➕ [SKILL] 新しい行を追加中...")
    selector = "a:has-text('メニューを追加する')"
    await page.scroll_into_view_if_needed(selector)
    await page.click(selector)

async def save_drink_draft(page: Page):
    """
    下書き保存を実行し、完了画面(publishControl)から編集画面に舞い戻る特技！🔄💅
    """
    print("💾 [SKILL] 下書き保存を実行中...")
    
    await page.click("input.tabindex2031")
    
    try:
        ok_btn = page.locator("a.jscAlertModalOkBtn:has-text('OK')")
        if await ok_btn.is_visible(timeout=3000):
            await ok_btn.click()
    except:
        pass
        
    await page.wait_for_url("**/publishControl/**")
    print("✅ [SKILL] 保存完了画面（ステータス画面）に到着！")
    
    back_btn = page.locator("input[value*='ドリンクメニュー'], #article input[type='submit']").first
    await back_btn.click()
    
    await page.wait_for_url("**/draft/drinkInfoEdit/**")
    print("🏠 [SKILL] ただいま！ドリンク編集画面に無事帰還したよ！💖✨")
