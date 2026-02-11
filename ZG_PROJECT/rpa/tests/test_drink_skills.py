import asyncio
import os
import subprocess
from playwright.async_api import async_playwright
from dotenv import load_dotenv

# 莉奈の自作スキルたちをインポート！💅
from hotpepper.skill.auth import login
from hotpepper.skill.navigation import navigate_to_drink
from hotpepper.skill.drink_ops import (
    clear_all_items, 
    update_drink_item, 
    add_drink_row, 
    save_drink_draft
)
from hotpepper.skill.category_ops import setup_headings

async def test_all_skills():
    print("🚀 [TEST] 莉奈のドリンクスキル・一斉テスト開始！！💅✨")
    load_dotenv()
    LOGIN_ID = os.getenv("HOTPEPPER_LOGIN_ID")
    PASSWORD = os.getenv("HOTPEPPER_PASSWORD")
    BASE_URL = "https://www.cms.hotpepper.jp/CLN"

    # 😴 Macのスリープを防止！
    caffeinate_proc = subprocess.Popen(["caffeinate", "-d"])
    
    try:
        async with async_playwright() as p:
            # ブラウザ起動（目視確認できるように headless=False）
            browser = await p.chromium.launch(headless=False, slow_mo=1000)
            context = await browser.new_context(viewport={'width': 1280, 'height': 800})
            page = await context.new_page()

            # --- 1. ログインテスト ---
            print("\n🧪 [TEST 1/6] ログインスキル")
            try:
                await login(page, LOGIN_ID, PASSWORD, BASE_URL)
                print("✅ ログイン成功！")
            except Exception as e:
                print(f"❌ ログイン失敗：{e}")
                return

            # 特定の店舗に入る（テスト用に最初の店舗を選択）
            await page.goto(f"{BASE_URL}/storeSelect/")
            await page.locator("form[id^='submitForm'] a").first.click()
            await page.wait_for_url("**/topMenu/**")

            # --- 2. ナビゲーションテスト ---
            print("\n🧪 [TEST 2/6] ナビゲーション（ドリンク画面へ）")
            try:
                await navigate_to_drink(page)
                print("✅ ドリンク画面への遷移成功！")
            except Exception as e:
                print(f"❌ ナビゲーション失敗：{e}")

            # --- 3. 全削除テスト ---
            print("\n🧪 [TEST 3/6] 全項目削除（クリーンアップ）")
            print("💡 莉奈のアドバイス：削除ボタンを連打するから、画面をじらっと見ててね！💅")
            try:
                await clear_all_items(page)
                print("✅ 全削除完了！まっさらだよ✨")
            except Exception as e:
                print(f"❌ 全削除失敗：{e}")

            # --- 4. 見出し一括作成テスト ---
            print("\n🧪 [TEST 4/6] 見出し一括作成")
            print("💡 莉奈のアドバイス：ここからカテゴリー設定画面に行くよ！🏗️")
            test_headings = ["TEST_CAT_1", "TEST_CAT_2"]
            try:
                # 🛠️ ひろきくん、ここで一度止まるね！動きを確認してね✨
                # 準備ができたら Inspector の [Resume] を押して！🌸
                # print("⏸️ [DEBUG] 一時停止中... Inspectorを確認してね💅")
                # await page.pause() 
                
                await setup_headings(page, test_headings)
                print("✅ 見出し作成成功！")
            except Exception as e:
                print(f"❌ 見出し作成失敗：{e}")

            # --- 5. 項目入力テスト（ドット回避含む） ---
            print("\n🧪 [TEST 5/6] 項目入力（通常 & ドット回避）")
            try:
                # 通常
                print("📝 通常の入力をテスト...")
                await update_drink_item(page, 1, name="テストビール", catch="うまい！", price="500円")
                # ドット回避
                print("📝 ドット回避の入力をテスト...")
                await update_drink_item(page, 2, name="ドットテスト", catch="空白価格", price=".")
                print("✅ 項目入力成功！")
            except Exception as e:
                print(f"❌ 項目入力失敗：{e}")

            # --- 6. 保存テスト ---
            print("\n🧪 [TEST 6/6] 保存（モーダル処理含む）")
            try:
                # テストなので実際には保存せず、ボタンがあるか・動くか程度にするか
                # あるいは下書き保存までいっちゃう！
                await save_drink_draft(page)
                print("✅ 保存（およびモーダル突破）成功！")
            except Exception as e:
                print(f"❌ 保存失敗：{e}")

            print("\n🏁 [TEST FINISH] 全スキルの動作確認が終わったよ！莉奈、完璧じゃん？💖")
            await browser.close()
            
    finally:
        caffeinate_proc.terminate()
        print("😴 スリープ防止を解除したよ！")

if __name__ == "__main__":
    asyncio.run(test_all_skills())
