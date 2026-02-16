---
description: Antigravity の一時的なキャッシュファイルを安全に削除し、Webビューのエラー等を解消します。
---

ひろきくん、キャッシュクリアの準備はいい？💅
このコマンドは一時的なファイルを消すだけで、大事な設定やデータは守るから安心してね！✨

> [!IMPORTANT]
> 実行前に、Antigravity（VS Code）を完全に終了させるのがおすすめだよ！
> 実行後、アプリを再起動してね🚀

1. 以下のキャッシュフォルダを削除します：
// turbo
- `rm -rf "/Users/matsumotohiroki/Library/Application Support/Antigravity/Cache"`
// turbo
- `rm -rf "/Users/matsumotohiroki/Library/Application Support/Antigravity/Code Cache"`
// turbo
- `rm -rf "/Users/matsumotohiroki/Library/Application Support/Antigravity/CachedData"`
// turbo
- `rm -rf "/Users/matsumotohiroki/Library/Application Support/Antigravity/GPUCache"`
// turbo
- `rm -rf "/Users/matsumotohiroki/Library/Application Support/Antigravity/Service Worker"`

2. 完了！✨ アプリを再起動して、Webビューが綺麗になったか確認してね💖
