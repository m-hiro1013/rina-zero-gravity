import asyncio
from playwright.async_api import async_playwright
import sys

# 🎀 莉奈の最強・全店舗全コース置換スクラプト 🎀
# 「1店舗ずつ、1コースずつ、丁寧に天才的な仕事をこなすよ！」

# 設定（ひろきくん、ここを確認してね！）
LOGIN_ID = "C519682"
PASSWORD = "Pleasure@1"
BASE_URL = "https://www.cms.hotpepper.jp/CLN"

REPLACE_PATTERNS = ["忘新年会", "忘年会", "新年会", "2024"]
REPLACE_TO = "歓送迎会"

async def run_mass_update():
    async with async_playwright() as p:
        # slow_moをちょっと早めて効率アップ！でも動きは見守れる絶妙な速度だよ💅
        browser = await p.chromium.launch(headless=False, slow_mo=800)
        context = await browser.new_context(viewport={'width': 1280, 'height': 800})
        page = await context.new_page()

        print("🚀 [START] ログインを開始するよ！")
        await page.goto(f"{BASE_URL}/login/")
        await page.fill("#jscInputUserId", LOGIN_ID)
        await page.fill("input.jscPasswordInput", PASSWORD)
        await page.click("#submitBtns input[type='submit']")
        
        await page.wait_for_url("**/storeSelect/**")
        
        # 🏢 店舗リンクを全部取得するよ
        store_links = page.locator("form[id^='submitForm'] a")
        store_count = await store_links.count()
        print(f"🏢 全部で {store_count} 店舗見つけたよ！順番に回っていくね✨")

        for s_idx in range(store_count):
            # ページが遷移するので、毎回店舗一覧に戻って再取得するよ
            await page.goto(f"{BASE_URL}/storeSelect/")
            await page.wait_for_url("**/storeSelect/**")
            
            current_store = page.locator("form[id^='submitForm'] a").nth(s_idx)
            store_name = (await current_store.inner_text()).strip()
            
            print(f"\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            print(f"🏢 【{s_idx + 1}/{store_count}　店舗目】: {store_name}")
            print(f"━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
            
            await current_store.click()
            await page.wait_for_url("**/topMenu/**")

            # 🍴 コース一覧へ
            print("🍴 コース画面へ移動中...")
            await page.get_by_role("link", name="コース").click()
            await page.wait_for_url("**/draft/courseInfoList/**")

            # 🔍 その店舗の対象コースを全部見つけるよ
            while True:
                # ページが変わるたびに再取得が必要（DOMが変わるからね！）
                rows = page.locator("tr[id^='courseInfoList']")
                row_count = await rows.count()
                
                target_idx = -1
                target_name = ""
                
                for r_idx in range(row_count):
                    name_el = rows.nth(r_idx).locator("a.courseName")
                    if await name_el.count() > 0:
                        name = (await name_el.inner_text()).strip()
                        # 置換対象かチェック
                        if any(p in name for p in REPLACE_PATTERNS):
                            target_idx = r_idx
                            target_name = name
                            break
                
                if target_idx == -1:
                    print("✅ この店舗の対象コースは全部修正したよ！次いくね〜！")
                    break

                # 🔧 置換作業開始！
                print(f"✨ ターゲット発見：{target_name}")
                await rows.nth(target_idx).locator("a.courseName").click()
                await page.wait_for_url("**/draft/courseInfoEdit/**")

                new_name = target_name
                for p in REPLACE_PATTERNS:
                    new_name = new_name.replace(p, REPLACE_TO)

                # 45文字制限チェック
                if len(new_name) > 45:
                    print(f"⚠️ 名前が長すぎる（{len(new_name)}文字）からスキップするね：{new_name}")
                    await page.goto(f"{BASE_URL}/draft/courseInfoList/")
                    continue

                print(f"🔧 名前を書き換え：{new_name}")
                await page.fill("#courseName0", new_name)

                print("📅 受付期間をリセット（-- を選択）...")
                for field in ["fromMonth", "fromDay", "toMonth", "toDay"]:
                    await page.select_option(f"#{field}", value="")

                print("💾 保存ボタンを探してスクロール...")
                save_button = page.locator("#saveButton")
                await save_button.scroll_into_view_if_needed()
                await save_button.click()
                
                # 保存確認
                await page.wait_for_url("**/draft/courseInfoEdit/doRegister/**")
                print(f"🎉 修正完了！天才！")

                # コース一覧に戻って次のコースを探すよ
                await page.goto(f"{BASE_URL}/draft/courseInfoList/")
                await page.wait_for_url("**/draft/courseInfoList/**")

        print("\n🏁 [FINISH] 全店舗の全コース、莉奈が完璧に直したよ！お疲れ様〜！💖")
        await browser.close()

if __name__ == "__main__":
    try:
        asyncio.run(run_mass_update())
    except KeyboardInterrupt:
        print("\n👋 途中で止めたね！またいつでも呼んで！")
    except Exception as e:
        print(f"\n😵 エラー起きちゃったかも...: {e}")
