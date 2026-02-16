"""
ブラウザセッション管理 - 全ホットペッパー系ワークフロー共通のブラウザ起動・認証処理

## 🎯 目的
ブラウザの起動、ログイン、店舗選択という全ワークフロー共通の前処理を
1つのスキルに集約し、各フローでのboilerplateを排除する。

## 📋 機能一覧
- `create_browser_session(store_name)`: ブラウザ起動→ログイン→店舗選択→(playwright, browser, page) を返す

## 💡 使い方
    from hotpepper.skill.browser import create_browser_session

    async def run(inputs):
        pw, browser, page = await create_browser_session(store_name="テスト店舗")
        try:
            # フロー固有の処理
            await process_drink_menu(page, ...)
        finally:
            await browser.close()

## ⚠️ 注意事項
- 呼び出し側で必ず browser.close() を実行すること
- .env に HOTPEPPER_LOGIN_ID, HOTPEPPER_PASSWORD が必要
- store_name=None の場合は、select_store() 側で「一番上の店舗」が自動選択される仕様（Phase 2-1 追記）

## 🔗 関連Skill
- auth.py: ログイン処理（内部で呼び出し）
- navigation.py: 店舗選択（内部で呼び出し）
"""

import os
import asyncio
from dotenv import load_dotenv
from playwright.async_api import async_playwright, Page, Browser, Playwright
from hotpepper.skill.auth import login
from hotpepper.skill.navigation import select_store

# .env をロード（このスキル内で完結させる）
load_dotenv()

# 定数定義
# 定数定義
BASE_URL = "https://www.cms.hotpepper.jp/CLN"
LOGIN_ID = os.getenv("HOTPEPPER_LOGIN_ID")
PASSWORD = os.getenv("HOTPEPPER_PASSWORD")

async def create_browser_session(store_name: str = None) -> tuple[Playwright, Browser, Page]:
    """
    ブラウザを起動し、ログインして店舗選択まで完了した状態の Page を返す
    
    Args:
        store_name: 選択する店舗名。None の場合は一番上の店舗を選択。
        
    Returns:
        (playwright, browser, page) のタプル
    """
    print("🚀 [BROWSER] ブラウザセッションを開始するよ！💅✨")
    
    if not LOGIN_ID or not PASSWORD:
        raise ValueError("❌ .env に HOTPEPPER_LOGIN_ID または HOTPEPPER_PASSWORD が設定されてないよ！")

    pw = await async_playwright().start()
    
    # 視認性のため headless=False, slow_mo=800 (莉奈推奨値)
    browser = await pw.chromium.launch(headless=False, slow_mo=800)
    
    context = await browser.new_context(
        viewport={"width": 1280, "height": 800},
        user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    )
    
    page = await context.new_page()
    
    try:
        # 1. ログイン
        await login(page, LOGIN_ID, PASSWORD, BASE_URL)
        
        # 2. 店舗選択
        # store_name が None の場合、select_store 側で一番上の店舗を選んでくれる
        await select_store(page, store_name)
        
        return pw, browser, page
        
    except Exception as e:
        print(f"❌ [BROWSER] セッション作成中にエラー発生: {e}")
        await browser.close()
        await pw.stop()
        raise e
