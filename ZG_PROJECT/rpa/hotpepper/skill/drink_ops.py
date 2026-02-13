import asyncio
from playwright.async_api import Page, Frame
from typing import Union

async def update_drink_item(page: Union[Page, Frame], index: int, name: str = None, catch: str = None, price: str = None, with_tax: bool = True):
    """
    指定したインデックスのドリンク項目を更新する特技だよ！💅
    b-log完全再現版：直接IDで指定して、シンプルに入力するよ！
    index: 0から始まる連番（#drinkName0, #drinkPrice0...に対応）
    """
    print(f"✨ [SKILL] ドリンク項目 {index} を更新中...")
    
    # 🎯 b-logで確認した通り、直接IDで指定！
    # 名前
    if name is not None:
        name_field = page.locator(f"#drinkName{index}")
        await name_field.click()
        await name_field.fill(name)
    
    # キャッチ
    if catch is not None:
        catch_field = page.locator(f"#drinkCatch{index}")
        await catch_field.click()
        await catch_field.fill(catch)
        
    # 価格設定
    if price is not None:
        if price in ["", "空白", "."]:
            print(f"🔗 [SKILL] 価格にドット回避を適用します")
            # 🆕 ユーザー提供データに基づき、'標準' (value="1") のラジオボタンを明示的にクリック
            standard_radio = page.locator(f"input[name='frmDrinkMenuDtoList[{index}].drinkPriceKbn'][value='1']")
            await standard_radio.click()
            await page.wait_for_timeout(300)
            
            # ドット回避の場合は price フィールドに直接入力
            price_field = page.locator(f"#drinkPrice{index}")
            await price_field.click()
            await price_field.fill(".")
        else:
            # 🆕 ユーザー提供データに基づき、'数値価格' (value="0") のラジオボタンを明示的にクリック
            # これをしないと、新規追加行などでフィールドが disabled になってエラーになる！🚨
            price_radio = page.locator(f"input[name='frmDrinkMenuDtoList[{index}].drinkPriceKbn'][value='0']")
            await price_radio.click()
            await page.wait_for_timeout(300)

            # 通常価格の場合は priceNumber フィールドに入力
            price_number_field = page.locator(f"#drinkPriceNumber{index}")
            await price_number_field.click()
            
            numeric_price = "".join(filter(str.isdigit, price))
            await price_number_field.fill(numeric_price)

            # 🆕 ユーザー要望：税込チェックボックスをONにする（b-log完全再現）
            if with_tax:
                print(f"✅ [SKILL] 税込チェックボックスをONにするよ！")
                tax_checkbox = page.locator(f"input[name='frmDrinkMenuDtoList[{index}].drinkPriceTaxIncFlg']")
                await tax_checkbox.check()

async def clear_all_items(page: Union[Page, Frame]):
    """
    【ホットペッパー仕様】標準メニューの行 (tr[id^='drinkMenu']) だけを狙い撃ちして全削除！🗑️💅
    おすすめやこだわりには指一本触れさせないよ！⚔️
    """
    print("🧹 [SKILL] 標準ドリンク項目の全削除を開始するよ！")
    for _ in range(5):
        # スコープを標準メニュー行に限定！🎯
        delete_locator = page.locator("tr[id^='drinkMenu'], tr[id^='drinkMenuD']").get_by_role("link", name="削除", exact=True).and_(page.locator(":visible"))
        total_count = await delete_locator.count()
        
        if total_count == 0:
            print("✨ [SKILL] 削除対象（標準メニュー）は見当たらないよ！")
            break
            
        print(f"📋 [SKILL] 標準メニュー行を {total_count} 件発見。下から順番に消していくね🚀")
        
        for i in range(total_count - 1, -1, -1):
            try:
                # 削除ボタンが確実に行の中にいることを再担保
                btn = delete_locator.nth(i)
                if await btn.is_visible(timeout=1000):
                    await btn.click(no_wait_after=True)
                    await page.wait_for_timeout(50)
            except: pass
        await page.wait_for_timeout(500)

async def count_rows_per_category(page: Union[Page, Frame], num_categories: int) -> dict:
    """
    各カテゴリーに現在何行あるかをカウントする
    
    Args:
        page: Page or Frame
        num_categories: カテゴリー数
    
    Returns:
        {0: 3, 1: 5, 2: 2, 3: 1} のような辞書（カテゴリーインデックス: 行数）
    """
    print("🔍 [SKILL] 各カテゴリーの既存行数をカウント中...")
    
    rows_per_category = {}
    
    # 追加ボタンを全て取得（「分類未設定」を含む）
    add_buttons = await page.locator("a:has-text('メニューを追加する')").all()
    
    print(f"📊 [SKILL] 追加ボタンを {len(add_buttons)} 個発見")
    
    # 各カテゴリーについて、親テーブル内の drinkName フィールドをカウント
    for cat_idx in range(num_categories):
        button_index = cat_idx + 1  # +1 オフセット（最初は「分類未設定」）
        
        if button_index >= len(add_buttons):
            print(f"⚠️ [SKILL] カテゴリー {cat_idx}: 追加ボタンが見つからない")
            rows_per_category[cat_idx] = 0
            continue
        
        # このカテゴリーの追加ボタンを取得
        button = add_buttons[button_index]
        
        # ボタンの親要素（テーブル）を取得
        # 追加ボタンは table > tbody > tr > td > div > a の構造なので、
        # XPath ancestor で最も近い table を取得する
        parent_table = button.locator("xpath=ancestor::table[1]")
        # このテーブル内の drinkName フィールドをカウント（表示されているものだけ！）
        name_fields_in_table = parent_table.locator("textarea[id^='drinkName']").and_(page.locator(":visible"))
        count = await name_fields_in_table.count()
        
        rows_per_category[cat_idx] = count
        print(f"📊 [SKILL] カテゴリー {cat_idx}: {count} 行")
    
    print(f"✅ [SKILL] カウント完了: {rows_per_category}")
    return rows_per_category

async def get_drink_indices_per_category(page: Union[Page, Frame], num_categories: int) -> dict:
    """
    カテゴリーごとに現在割り当てられている行インデックス（drinkName の番号）を取得する
    
    Returns:
        {0: [1, 2], 1: [3, 4]} のような辞書（カテゴリーインデックス: [行インデックス, ...]）
    """
    print("🔍 [SKILL] カテゴリー別の行インデックスを抽出中...")
    indices_per_category = {}
    
    # 追加ボタンを全て取得
    add_buttons = await page.locator("a:has-text('メニューを追加する')").all()
    
    for cat_idx in range(num_categories):
        # 🆕 ユーザールール: カテゴリー0（分類未設定）は無視、1からが対象
        # 内部インデックス cat_idx (0, 1...) に対して、
        # 画面上のボタンインデックスは 1:ビール(btn 1), 2:カクテル(btn 2)... となる
        button_index = cat_idx + 1
        
        if button_index >= len(add_buttons):
            indices_per_category[cat_idx] = []
            continue
            
        button = add_buttons[button_index]
        parent_table = button.locator("xpath=ancestor::table[1]")
        
        # このテーブル内の drinkName フィールドを取得（表示されているものだけ！）
        textareas = await parent_table.locator("textarea[id^='drinkName']").and_(page.locator(":visible")).all()
        indices = []
        for ta in textareas:
            id_attr = await ta.get_attribute("id")
            if id_attr:
                try:
                    idx = int(id_attr.replace("drinkName", ""))
                    if idx != 0: # index 0 はテンプレート
                        indices.append(idx)
                except: pass
        
        indices.sort()
        indices_per_category[cat_idx] = indices
        print(f"📊 [SKILL] カテゴリー {cat_idx} (画面ボタン {button_index}) のインデックス: {indices}")
        
    return indices_per_category

async def ensure_rows_for_categories(page: Union[Page, Frame], required_rows: dict):
    """
    各カテゴリーに必要な行数を確保する（足りない分を追加）
    
    Args:
        page: Page or Frame
        required_rows: {0: 1, 1: 6, 2: 3, 3: 4} のような辞書（カテゴリーインデックス: 必要な行数）
    """
    print("🏗️ [SKILL] 各カテゴリーに必要な行数を確保中...")
    
    # 現在の行数をカウント
    current_rows = await count_rows_per_category(page, len(required_rows))
    
    # 各カテゴリーについて、足りない分を追加
    for cat_idx, needed in required_rows.items():
        current = current_rows.get(cat_idx, 0)
        to_add = needed - current
        
        if to_add > 0:
            print(f"➕ [SKILL] カテゴリー {cat_idx}: {to_add} 行追加が必要 (現在 {current} 行 → {needed} 行)")
            for _ in range(to_add):
                await add_drink_row(page, category_index=cat_idx)
                await page.wait_for_timeout(500)  # 追加後の待機
        else:
            print(f"✅ [SKILL] カテゴリー {cat_idx}: 十分な行数があるよ (現在 {current} 行、必要 {needed} 行)")
    
    print("✨ [SKILL] 全カテゴリーの行数確保完了！")

async def add_drink_row(page: Union[Page, Frame], category_index: int = 0):
    """
    新しいドリンク行を追加する
    
    Args:
        page: Page or Frame
        category_index: カテゴリーのインデックス（0始まり）。0=最初のカテゴリー、1=2番目...
    """
    print(f"➕ [SKILL] カテゴリー {category_index} に新しい行を追加中...")
    # ホットペッパーの仕様：最初のボタンは「分類未設定」（デフォルト）
    # 自分で作成したカテゴリーは +1 オフセットが必要
    selector = "a:has-text('メニューを追加する')"
    button_index = category_index + 1  # 🆕 +1 オフセット
    await page.locator(selector).nth(button_index).scroll_into_view_if_needed()
    await page.locator(selector).nth(button_index).click()


async def save_drink_draft(page: Page):
    """
    b-log完全トレース版：保存後のURLと行を特定して、誤爆なしでドリンク編集画面に帰還する特技！🔄💅
    """
    print("💾 [SKILL] 下書き保存を実行中...")
    iframe = page.frame(name="sb-player")
    target = iframe if iframe else page
    
    save_found = False
    
    # 📝 莉奈の「本気ボタン」優先リスト（b-logの実績データを最優先！）
    selectors = [
        "input.tabindex2103[value='下書き保存する']", # 🆕 b-logで確認された「正解」！
        "input[value='下書き保存する']",
        "input[value*='下書き保存']",
        # 以下バックアップ
        "input.tabindex2031[value='下書き保存する']",
        "input.tabindex142[value='下書き保存する']",
        "input[type='submit'][value*='保存']",
        "input[value*='登録']",
        "a:has-text('保存')"
    ]
    
    # 🆕 保存ボタンが表示されるまで待つ（最大10秒）
    for sel in selectors:
        try:
            target_btn = target.locator(sel).first
            
            # 🆕 visibility チェック
            if await target_btn.is_visible(timeout=3000):
                print(f"🎯 [SKILL] 本命ボタン発見！ ({sel}) をクリックするよ✨")
                await page.wait_for_timeout(500)
                await target_btn.click(force=True)
                save_found = True
                break
        except Exception:
            continue
            
    if not save_found:
        print("😱 [SKILL] 保存ボタンがみつからない…！緊急停止！")
        # 最後の手段：汎用的な input[type=submit] を探す
        try:
            fallback = target.locator("input[type='submit']").first
            if await fallback.is_visible(timeout=3000):
                print("🆘 [SKILL] 最後の手段で input[type='submit'] を押すよ！")
                await fallback.click(force=True)
                save_found = True
        except: pass

    if not save_found:
        await page.pause()
    
    print("⏳ [SKILL] 保存後の挙動を待機中（モーダル or URL変化）...")
    
    # 🚨 パターン分岐: 削除があった場合のみ確認モーダルが出る
    # b-log: jscAlertModalOkBtn が出現
    try:
        # モーダルが出るまで少し待つ（出ない場合はtimeoutでスルー）
        ok_btn = page.locator("a.jscAlertModalOkBtn:has-text('OK')").first
        if await ok_btn.is_visible(timeout=3000):
            print("🎯 [SKILL] 削除確認モーダルが出たよ！OKを押すね。")
            await ok_btn.click(force=True)
        else:
            print("ℹ️ [SKILL] 確認モーダルは出なかったよ（削除なしパターン）。")
    except: pass
        
    try:
        await page.wait_for_url(lambda url: "publishControl" in url or "drinkInfoEdit" in url, timeout=10000)
    except: pass

    current_url = page.url
    print(f"📍 [SKILL] 現在のURL: {current_url}")

    if "publishControl" in current_url:
        print("✅ [SKILL] 保存完了画面に到着！ドリンク用の『編集』ボタンを狙い撃ちするよ🎯")
        # 【ホットペッパー仕様】「ドリンク」が含まれる行の編集ボタンのみをクリック！誤爆防止！🛡️
        back_btn = page.locator("tr:has-text('ドリンク')").locator("input[value='編集'], input[name*='UserDto']").first
        
        if await back_btn.is_visible(timeout=5000):
            print("🎯 [SKILL] ドリンク専用・帰還ボタン発見！ポチるよ。")
            await back_btn.click()
        else:
            print("⚠️ [SKILL] 専用ボタンが見つかりません。バックアップのURL帰還を実行します。")
            base_match = current_url.split("/publishControl/")[0]
            await page.goto(f"{base_match}/draft/drinkInfoEdit/")
    
    elif "drinkInfoEdit" in current_url:
        print("🏠 [SKILL] すでに編集画面に戻っているよ。")
    
    else:
        print("⚠️ [SKILL] 予期せぬ画面のため、URLで強制帰還します。")
        if "www.cms.hotpepper.jp/CLN/" in current_url:
            base_url = current_url.split("/CLN/")[0] + "/CLN"
            await page.goto(f"{base_url}/draft/drinkInfoEdit/")
    
    await page.wait_for_url("**/draft/drinkInfoEdit/**", timeout=15000)
    print("🏠 [SKILL] ただいま！ドリンク編集画面に無事帰還したよ！💖✨")

async def get_existing_drink_indices(page: Union[Page, Frame]) -> list[int]:
    """
    ドリンク編集画面上の既存行のインデックス一覧を取得する
    
    Returns:
        [1, 2, 5, ...] のようなソート済みインデックスリスト
    """
    print("🔢 [SKILL] 既存のドリンク行インデックスを取得中...")
    
    # textarea[id^='drinkName'] を全取得（表示されているものだけ！）
    # 🚨 掟: index 0 はテンプレート（非表示）なので絶対に拾わない！
    textareas = await page.locator("textarea[id^='drinkName']").and_(page.locator(":visible")).all()
    indices = []
    
    for ta in textareas:
        id_attr = await ta.get_attribute("id")
        if id_attr:
            # "drinkName5" -> 5
            try:
                idx = int(id_attr.replace("drinkName", ""))
                # 🚫 index 0 は物理的に除外（隠し要素対策）
                if idx == 0:
                    print("⚠️ [SKILL] index 0 を検知したけど、掟に従ってスキップするよ！🚫")
                    continue
                indices.append(idx)
            except ValueError:
                pass
                
    indices.sort()
    print(f"📊 [SKILL] 取得したインデックス: {indices}")
    return indices

async def get_drink_target(page: Page) -> Union[Page, Frame]:
    """
    iframe sb-player の存在を判定し、操作対象（iframe or page）を返す
    """
    # iframeのロードを少し待つ
    try:
        await page.wait_for_timeout(2000)
        iframe = page.frame(name="sb-player")
        if iframe:
            print("🎭 [SKILL] iframe 'sb-player' を操作対象にするよ！")
            return iframe
        else:
            print("📄 [SKILL] iframeが見つからないので、Pageをそのまま操作するよ！")
            return page
    except Exception:
        return page
