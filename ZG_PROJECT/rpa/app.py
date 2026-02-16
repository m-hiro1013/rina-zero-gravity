import streamlit as st
import asyncio
import importlib

# 🎀 RPA 実行 UI（拡張可能版）！💅✨

# 店舗リスト（共通）
STORE_LIST = [
    "（一番上の店舗を選択）",
    "アジアンビストロ 　Dai 　青葉台店",
    "アジアンビストロ 　Dai 　駒沢店",
    "アジアンビストロ 　Dai 　新百合ヶ丘店",
    "アジアンビストロ　 Dai 　日吉店",
    "アジアンビストロ Dai 立川グリーンスプリングス店",
    "アジアンビストロ　Dai　たまプラーザ店",
    "アジアンビストロ Dai 日本橋店",
    "アジアンビストロDai　武蔵小杉店",
    "アジアンビストロ Dai 東京ガーデンテラス店",
    "アジアンビストロＤａｉ　那覇店",
    "アジアンビストロ Dai 二子玉川店",
    "スパニッシュイタリアンDai たまプラーザ店",
    "炭焼き　大　新百合ヶ丘店",
    "炭焼き　大　立川グリーンスプリングス店",
    "炭焼き　大　たまプラーザ店",
    "大喜楼　たまプラーザ店",
    "トラットリア＆ピッツェリア　Dai　町田店",
    "アジアンビストロ Dai 勝どき店",
    "ブリランテタヴォラ Dai 勝どき店"
]

# ワークフロー定義（ここに追加していく！）
WORKFLOWS = {
    "ホットペッパードリンクメニュー更新": {
        "description": "ドリンクメニューを一括更新するワークフローだよ！",
        "inputs": {
            "store": {
                "type": "selectbox",
                "label": "🏢 店舗を選択",
                "options": STORE_LIST,
                "default": 0
            },
            "menu_data": {
                "type": "textarea",
                "label": "📝 メニューデータ",
                "height": 400,
                "default": """[見出し] ビール
---
クラフトビール
時期により銘柄を変えております
968円
---
キリン ハートランド
洗練されたアロマホップを使用
770円
---
[見出し] カクテル
---
モヒート
ミントとライムの爽やかなカクテル
[空白]
---
カシスオレンジ
フルーティで飲みやすい
550円"""
            },
            "skip_clear": {
                "type": "checkbox",
                "label": "既存データを削除しない（追加モード）",
                "default": True
            }
        },
        "module": "hotpepper.flow.drink_update"  # 🆕 モジュールパスで指定
    }
    # 🆕 ここに今後のワークフローを追加していくよ！
    # "コースメニュー更新": {"module": "hotpepper.flow.course_update", ...},
}

# Streamlit UI
st.set_page_config(
    page_title="🤖 RPA 実行ツール",
    page_icon="🤖",
    layout="wide"
)

st.title("🤖 RPA 実行ツール")
st.markdown("---")

# ワークフロー選択
selected_workflow = st.selectbox(
    "🔧 実行するワークフローを選択",
    options=list(WORKFLOWS.keys()),
    help="実行したいワークフローを選んでね！"
)

workflow_config = WORKFLOWS[selected_workflow]
st.info(f"📖 {workflow_config['description']}")

st.markdown("---")

# 動的に入力UIを生成
col1, col2 = st.columns([2, 1])

with col1:
    st.subheader("📝 入力")
    
    # 入力値を格納する辞書
    user_inputs = {}
    
    # ワークフローの定義に基づいてUIを動的生成
    for input_name, input_config in workflow_config["inputs"].items():
        if input_config["type"] == "textarea":
            user_inputs[input_name] = st.text_area(
                input_config["label"],
                value=input_config.get("default", ""),
                height=input_config.get("height", 200)
            )

with col2:
    st.subheader("⚙️ 設定")
    
    # selectbox と checkbox は右側に表示
    for input_name, input_config in workflow_config["inputs"].items():
        if input_config["type"] == "selectbox":
            user_inputs[input_name] = st.selectbox(
                input_config["label"],
                options=input_config["options"],
                index=input_config.get("default", 0)
            )
        elif input_config["type"] == "checkbox":
            user_inputs[input_name] = st.checkbox(
                input_config["label"],
                value=input_config.get("default", False)
            )
    
    st.markdown("---")
    
    # 実行ボタン
    if st.button("🚀 実行", type="primary", use_container_width=True):
        # 入力チェック（menu_dataがある場合のみ）
        if "menu_data" in user_inputs and (not user_inputs["menu_data"] or not user_inputs["menu_data"].strip()):
            st.error("❌ メニューデータを入力してね！")
        else:
            with st.spinner("🔄 実行中..."):
                log_placeholder = st.empty()
                
                # モジュールを動的にインポートして run 関数を取得
                try:
                    module_name = workflow_config["module"]
                    module = importlib.import_module(module_name)
                    run_func = module.run
                    
                    # 非同期関数を実行
                    async def execute():
                        async for log_message in run_func(user_inputs):
                            log_placeholder.info(log_message)
                    
                    asyncio.run(execute())
                    
                except ImportError as e:
                    st.error(f"❌ モジュールが見つからないよ: {e}")
                except AttributeError as e:
                    st.error(f"❌ run 関数が見つからないよ: {e}")
                except Exception as e:
                    st.error(f"❌ エラー発生: {e}")

# 使い方
st.markdown("---")
st.subheader("📖 使い方")

st.markdown("""
### 実行手順

1. **ワークフローを選択**（プルダウン）
2. 選択したワークフローに応じた**入力欄**が表示される
3. **必要な情報を入力**
4. **🚀 実行**ボタンをクリック
5. ブラウザが自動で開いて処理が始まるよ！

### ワークフローの追加方法

今後、新しいワークフローを追加する場合は：

1. `hotpepper/flow/` に `run(inputs)` を持つモジュールを作成
2. `WORKFLOWS` 辞書に新しいワークフローを追加
3. `module` パスを指定
4. 再起動するだけ！

超簡単に拡張できるよ！✨
""")
