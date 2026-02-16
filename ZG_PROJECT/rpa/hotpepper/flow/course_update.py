"""
コース更新フロー - 店舗内の対象コースを一括で名称変更する

## ⚠️ TODO: スキル分離リファクタ（コースGUI化時に実施）
##
## このflowには以下のブラウザ操作が直接記述されており、
## 「全ての実行処理はスキルに入れる」ルールに違反している。
## コース更新をGUIに追加する際に、必ず以下をスキルに切り出すこと。
##
## 1. course_ops.py (新設) に切り出すスキル:
##    - find_target_course(page, replace_patterns, skipped_names) -> (index, name)
##      現在の12-28行目。tr[id^='courseInfoList'] をスキャンして
##      置換対象のコース名とインデックスを返す。
##      返り値: (target_idx: int, target_name: str) or (-1, "") if not found
##
##    - update_course_name(page, new_name)
##      現在の54行目。page.fill("#courseName0", new_name) を実行。
##      コース編集画面でコース名を上書きする。
##
##    - navigate_to_course_list(page, base_url)
##      現在の61-62行目。page.goto() でコース一覧画面に戻る。
##      帰還後の URL 確認 (wait_for_url) も含む。
##
##    - navigate_to_course_edit(page, row_index)
##      現在の34-35行目。コース一覧から特定行のコース名リンクをクリックして
##      コース編集画面に遷移する。
##
## 2. data_parser.py に追加するスキル:
##    - apply_course_name_replacement(name, replace_patterns, replace_to) -> str
##      現在の37-41行目。文字列置換 + shorten_course_name + 45文字チェック。
##      返り値: 変換後の名前。45文字超えの場合は None を返す（スキップ判定用）。
##
## 3. リファクタ後の course_update.py の構造:
##    - process_all_courses() は while ループ + スキル呼び出しのみ
##    - find_target_course() でターゲット検索
##    - navigate_to_course_edit() で遷移
##    - apply_course_name_replacement() で名前変換
##    - update_course_name() で入力
##    - reset_acceptance_period() で受付期間リセット（既存スキル）
##    - save_changes() で保存（既存スキル）
##    - navigate_to_course_list() で帰還
##
## 4. GUI化時の追加作業:
##    - course_update.py に run() 関数を追加（drink_update.py と同じパターン）
##    - app.py の WORKFLOWS 辞書にコース更新ワークフローを追加
##    - inputs定義: store(selectbox), replace_patterns(textarea), replace_to(text_input)
"""
from playwright.async_api import Page
from ..skill.utils import shorten_course_name
from ..skill.actions import reset_acceptance_period, save_changes

async def process_all_courses(page: Page, replace_patterns: list, replace_to: str, base_url: str):
    """
    その店舗の対象コースを全部見つけて修正するよ！🍴
    """
    skipped_names = set()
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
                # 置換対象 かつ まだスキップしてないやつを探すよ！💅
                if any(p in name for p in replace_patterns) and name not in skipped_names:
                    target_idx = r_idx
                    target_name = name
                    break
        
        if target_idx == -1:
            print("✅ [COURSE] この店舗の対象コースは全部完了！次いくね〜！")
            break

        # 🔧 置換作業開始！
        print(f"✨ [COURSE] ターゲット発見：{target_name}")
        await rows.nth(target_idx).locator("a.courseName").click()
        await page.wait_for_url("**/draft/courseInfoEdit/**")

        # 名前置換
        new_name = target_name
        for p in replace_patterns:
            new_name = new_name.replace(p, replace_to)

        # 魔法の短縮ロジック適用
        new_name = shorten_course_name(new_name, max_length=45)

        # 45文字制限チェック
        if len(new_name) > 45:
            print(f"⚠️ [COURSE] 短縮後も長すぎる（{len(new_name)}文字）からスキップ：{new_name}")
            skipped_names.add(target_name)
            await page.goto(f"{base_url}/draft/courseInfoList/")
            await page.wait_for_url("**/draft/courseInfoList/**")
            continue

        print(f"🔧 [COURSE] 名前を書き換え：{new_name}")
        await page.fill("#courseName0", new_name)

        # アクション呼び出し
        await reset_acceptance_period(page)
        await save_changes(page)

        # コース一覧に戻る
        await page.goto(f"{base_url}/draft/courseInfoList/")
        await page.wait_for_url("**/draft/courseInfoList/**")
