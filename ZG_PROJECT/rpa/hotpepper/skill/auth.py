from playwright.async_api import Page

async def login(page: Page, login_id: str, password: str, base_url: str):
    """
    ホットペッパーの管理画面にログインするよ！🚀
    """
    print("🚀 [AUTH] ログインを開始するよ！")
    await page.goto(f"{base_url}/login/")
    await page.fill("#jscInputUserId", login_id)
    await page.fill("input.jscPasswordInput", password)
    await page.click("#submitBtns input[type='submit']")
    
    await page.wait_for_url("**/storeSelect/**")
    print("✅ [AUTH] ログイン成功！店舗選択画面に到着！")
