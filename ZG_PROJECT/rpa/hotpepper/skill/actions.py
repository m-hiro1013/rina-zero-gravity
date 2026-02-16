from playwright.async_api import Page

async def reset_acceptance_period(page: Page):
    """
    受付期間をすべて「--」にリセットするよ！📅
    """
    print("📅 [ACTION] 受付期間をリセット（-- を選択）...")
    fields = ["fromYear", "fromMonth", "fromDay", "toYear", "toMonth", "toDay"]
    for field in fields:
        locator = page.locator(f"#{field}")
        if await locator.count() > 0:
            await locator.select_option(index=0)

async def save_changes(page: Page):
    """
    変更を保存ボタンを押して確定させるよ！💾
    """
    print("💾 [ACTION] 保存ボタンを探してスクロール...")
    save_button = page.locator("#saveButton")
    await save_button.scroll_into_view_if_needed()
    
    print("💾 [ACTION] 【重要】保存ボタンをクリック！")
    await save_button.click()
    
    await page.wait_for_url("**/draft/courseInfoEdit/doRegister/**")
    print("🎉 [ACTION] 修正内容の保存が完了！天才！")
