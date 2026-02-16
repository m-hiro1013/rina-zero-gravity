from playwright.async_api import Page

async def select_store(page: Page, store_name: str = None):
    """
    店舗一覧画面から店舗を選択する特技だよ！🏢✨
    store_name が指定されていない場合は、一番上の店舗を選択するね。
    """
    print("🏢 [SKILL] 店舗を選択中...")
    await page.wait_for_url("**/storeSelect/**")
    
    if store_name:
        await page.get_by_role("link", name=store_name).click()
    else:
        # 一番上の店舗を選択（b-log & course.py 参考）
        await page.locator("form[id^='submitForm'] a").first.click()
        
    await page.wait_for_url("**/topMenu/**")
    print("✅ [SKILL] 店舗選択完了！トップメニューに到着したよ🏰")

async def navigate_to_drink(page: Page):
    """
    トップメニューから「ドリンク」編集画面へ遷移する特技だよ！💅
    """
    print("🚀 [SKILL] ドリンクメニューへ遷移中...")
    # トップメニューであることを確認
    if "/topMenu/" not in page.url:
        print("⚠️ [SKILL] トップメニューにいないみたい。移動を試みるよ！")
        
    await page.get_by_role("link", name="ドリンク").click()
    await page.wait_for_url("**/draft/drinkInfoEdit/**")
    print("✅ [SKILL] ドリンク編集画面に到着！")
