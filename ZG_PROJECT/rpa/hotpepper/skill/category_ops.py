"""
カテゴリー（見出し）操作に特化したスキル集 🏗️✨
iframe切り替え処理を含む、カテゴリー設定の完全実装！

b-log進化版を活用して、iframe内の要素操作を完璧に実現したよ！💅
"""
from playwright.async_api import Page


async def clear_all_headings(page: Page):
    """
    カテゴリー（見出し）を全部空っぽにする特技！🏗️🗑️
    """
    print("🧹 [SKILL] カテゴリーの全削除を開始するよ！")
    await setup_headings(page, [])


async def setup_headings(page: Page, headings: list):
    """
    カテゴリー（見出し）を一括で設定する特技！🏗️💅
    b-logの解析に基づき、ボタンの種類を問わず確実に保存して生還するよ！✨
    
    🆕 b-log 強化データ活用:
    - visibility チェック (isClickable, isVisible, pointerEvents)
    - 複数の要素特定戦略 (className, XPath, nearbyText)
    - iframe 検知（カテゴリー設定画面は iframe 'sb-player' 内！）
    
    🆕 ページ読み込み待機の強化:
    - 各遷移後に loadState='networkidle' を待つ
    - 入力フィールドの表示を確実に待つ
    - 保存ボタンの表示を確実に待つ
    """
    print(f"🏗️ [SKILL] カテゴリー設定を開始！見出し候補: {headings}")
    
    await page.click("input.tabindex66")

    # 🆕 b-log データより: className="jscAlertModalOkBtn", text="OK"
    # visibility: isClickable=true, isVisible=true, pointerEvents=auto
    try:
        ok_btn = page.locator("a.jscAlertModalOkBtn:has-text('OK')")
        if await ok_btn.is_visible(timeout=2000):
            print("⚠️ [SKILL] カテゴリー画面への移動確認OK！")
            # 🎯 b-log で確認済み: このボタンは isClickable=true なので通常クリックでOK
            await ok_btn.click()
    except:
        pass

    # 🆕 URL 遷移を待つ
    await page.wait_for_url("**/doDispCtgy**")
    print("📍 [SKILL] カテゴリー設定画面に到着！")
    
    # 🆕 ページの完全読み込みを待つ（ネットワークが落ち着くまで）
    try:
        await page.wait_for_load_state("networkidle", timeout=5000)
        print("🌐 [SKILL] ページの読み込み完了！")
    except:
        print("⚠️ [SKILL] networkidle タイムアウト、でも続行するよ！")
        # タイムアウトしても続行（一部のページは完全に idle にならない）
    
    # 🆕 追加の待機時間（DOM の更新を待つ）
    await page.wait_for_timeout(1500)
    
    # 🎭 b-log進化版で判明！カテゴリー設定画面は iframe 'sb-player' の中！
    print("🎭 [SKILL] iframe 'sb-player' に切り替え中...")
    iframe = page.frame(name="sb-player")
    if not iframe:
        print("❌ [SKILL] iframe 'sb-player' が見つかりません！")
        raise Exception("iframe 'sb-player' not found")
    
    print("✅ [SKILL] iframe 'sb-player' に切り替え完了！")
    
    # 🆕 入力フィールドが確実に表示されるまで待つ（iframe内で！）
    # b-log完全トレース: 最初の入力欄 (#drinkName0) が表示されればOK！
    # 以前は id^='drinkName' で全要素（99個!?）を待っていたためタイムアウトしていた可能性あり
    input_selector = "#drinkName0"
    print(f"🔍 [SKILL] 最初の入力フィールドを探索中... ({input_selector})（iframe内）")
    
    try:
        await iframe.wait_for_selector(input_selector, state="visible", timeout=10000)
        print("✅ [SKILL] 入力フィールド発見！（iframe内）")
    except Exception as e:
        print(f"⚠️ [SKILL] 入力フィールドの待機でエラー: {e}")
        print("🔍 [SKILL] それでも続行してみるよ...")

    # 🎯 b-log完全トレース: 必要な分だけ処理する！
    # headingsの数だけ、既存のカテゴリを空にして新しい値を入力
    num_headings = len(headings)
    print(f"📊 [SKILL] {num_headings} 個のカテゴリを設定するよ！（iframe内）")
    
    # 🆕 必要な行数を確保（visible な行が足りなければ追加）
    print(f"🔍 [SKILL] visible な行数を確認中...")
    
    # visible な行数をカウント
    visible_count = 0
    for i in range(25):  # 最大25行まで確認
        try:
            field_id = f"#drinkName{i}"
            if await iframe.locator(field_id).is_visible(timeout=500):
                visible_count += 1
            else:
                break  # 非表示になったら終了
        except:
            break
    
    print(f"📊 [SKILL] 現在の visible 行数: {visible_count}")
    print(f"📊 [SKILL] 必要な行数: {num_headings}")
    
    # 足りない場合は追加（num_headings > 0 かつ足りない場合のみ）
    if num_headings > 0 and visible_count < num_headings:
        add_count = num_headings - visible_count
        print(f"➕ [SKILL] {add_count} 行追加するよ！")
        
        # 追加ボタンをクリック
        add_button = iframe.locator("a:has-text('追加')")
        
        for i in range(add_count):
            try:
                if await add_button.is_visible(timeout=1000):
                    await add_button.click()
                    await page.wait_for_timeout(500)  # DOM更新を待つ
                    print(f"✅ [SKILL] {i+1} 行目を追加")
                else:
                    print(f"⚠️ [SKILL] 追加ボタンが見つからない（{i+1}行目）")
                    break
            except Exception as e:
                print(f"⚠️ [SKILL] {i+1} 行目の追加でエラー: {e}")
                break
        
        print(f"✅ [SKILL] 行追加完了！")

    # 🆕 b-logの実際の操作を完全再現:
    # 1. 既存の全行をクリア（visible_count 分すべてを空にする）
    for i in range(visible_count):
        try:
            field_id = f"#drinkName{i}"
            # b-log: クリック → 全選択（Cmd+A） → Backspace → 空文字入力
            # Playwrightでは fill("") で同じ効果が得られる
            await iframe.locator(field_id).click()
            await iframe.locator(field_id).fill("")
            await page.wait_for_timeout(100)
            print(f"🧹 [SKILL] カテゴリー {i} をクリア（iframe内）")
        except Exception as e:
            print(f"⚠️ [SKILL] カテゴリー {i} のクリアでエラー: {e}")
    
    print(f"✅ [SKILL] 既存のカテゴリー {visible_count} 件をクリア完了！（iframe内）")
    
    # 2. 新しい値を入力（必要な分だけ）
    for i, title in enumerate(headings):
        try:
            field_id = f"#drinkName{i}"
            # b-log: クリック → 入力
            await iframe.locator(field_id).click()
            await iframe.locator(field_id).fill(title)
            await page.wait_for_timeout(100)
            print(f"📝 [SKILL] カテゴリー {i} を設定: {title}（iframe内）")
        except Exception as e:
            print(f"⚠️ [SKILL] カテゴリー {i} の入力でエラー: {e}")
    
    # 🆕 入力完了後、DOM の更新を待つ
    await page.wait_for_timeout(1000)
    print("⏳ [SKILL] 入力完了！保存ボタンを探すよ...（iframe内）")
    
    # 💾 保存ボタンを執念で見つけ出すよ！🎯（iframe内で！）
    save_found = False
    
    # 📝 莉奈の「本気ボタン」優先リスト（b-log データに基づく優先順位）
    # 🆕 b-log進化版で実績確認済み: input.tabindex142[value="下書き保存する"] が確実！（iframe内）
    selectors = [
        # 1. b-log で実績のある「下書き保存する」ボタン（最優先！）
        "input.tabindex142[value='下書き保存する']",
        "input[value*='下書き保存']",
        # 2. XPath による特定（b-log データより）
        "//*[@id='submitBtns']/ul[1]/li[2]/input[1]",
        # 3. 従来の input タグ系
        "input[type='submit'][value*='設定']",
        "input[type='button'][value*='設定']",
        "input[value*='設定']",
        "input[value*='登録']",
        "input[value*='OK']",
        # 4. その他のテキストベース
        "a:has-text('設定する')",
        "button:has-text('設定')"
    ]
    
    # 🆕 保存ボタンが表示されるまで待つ（最大10秒）（iframe内で！）
    for sel in selectors:
        try:
            # 🆕 XPath の場合は locator の使い方が違うよ！
            if sel.startswith("/"):
                target = iframe.locator(f"xpath={sel}")
            else:
                target = iframe.locator(sel).first
            
            # 🆕 visibility チェック（b-log データ活用）
            # タイムアウトを長めに設定して、ボタンの表示を待つ
            if await target.is_visible(timeout=3000):
                print(f"🎯 [SKILL] 本命ボタン発見！ ({sel[:50]}...) をクリックするよ✨（iframe内）")
                
                # 🆕 ボタンが完全に表示されるまで少し待つ
                await page.wait_for_timeout(500)
                
                # 🚨 b-log データで pointerEvents=auto を確認済みだが、
                # モーダル残像対策として force=True を使用！💅💥
                await target.click(force=True)
                save_found = True
                break
        except Exception as e:
            # このセレクタでは見つからなかった、次へ！
            print(f"⚠️ [SKILL] {sel[:30]}... では見つからず、次を試すよ（iframe内）")
            continue
            
    if not save_found:
        print("😱 [SKILL] 保存ボタンがどうしても見つからない…！ひろきくん、これ見て！💅")
        await page.pause()

    # 🚨 戻る時の確認モーダル（これが出たら即押し！）
    # 🆕 b-log データより: 同じく className="jscAlertModalOkBtn", text="OK"
    try:
        confirm_ok = page.locator("a.jscAlertModalOkBtn:has-text('OK')").first
        if await confirm_ok.is_visible(timeout=3000):
            print("⚠️ [SKILL] 完了確認モーダルを突破！✨")
            # 🎯 b-log で確認済み: isClickable=true, pointerEvents=auto
            # でも念のため force=True で確実に！💅
            await confirm_ok.click(force=True)
    except:
        pass
    
    await page.wait_for_url("**/draft/drinkInfoEdit/**")
    print("✅ [SKILL] カテゴリー再構築完了！編集画面に帰還！🏰✨")
