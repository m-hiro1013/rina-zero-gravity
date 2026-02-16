#!/bin/bash
cd "$(dirname "$0")"
export PYTHONPATH=.
echo "🚀 莉奈 RPA 起動中...💅✨"

# 仮想環境の python を探す（もしあれば）
if [ -f "../.venv/bin/streamlit" ]; then
    ../.venv/bin/streamlit run app.py
elif command -v streamlit &> /dev/null; then
    streamlit run app.py
else
    # PATHが通ってない場合、pythonモジュールとして実行
    python3 -m streamlit run app.py
fi
