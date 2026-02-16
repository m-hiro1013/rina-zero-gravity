#!/bin/bash
# RPA.app を再作成するスクリプト

APP_PATH="/Applications/RPA.app"
COMMAND_PATH="/Users/matsumotohiroki/Developer/rina-zero-gravity/ZG_PROJECT/rpa/start_ui.command"

echo "🚀 RPA.app を再構築します..."

# 既存のアプリがあれば削除（念のため）
if [ -d "$APP_PATH" ]; then
    rm -rf "$APP_PATH"
    echo "🗑️ 旧アプリを削除しました"
fi

# osacompile でアプリを作成
# Terminal で start_ui.command を実行するように設定
osacompile -o "$APP_PATH" -e "tell application \"Terminal\" to do script \"$COMMAND_PATH\""

echo "✅ RPA.app の再構築が完了しました！"
echo "📂 場所: $APP_PATH"
