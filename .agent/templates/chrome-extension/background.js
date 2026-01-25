/**
 * {{project_name}} - Background Service Worker
 * 
 * バックグラウンドで動作するサービスワーカーだよ！
 */

// 拡張機能インストール時
chrome.runtime.onInstalled.addListener((details) => {
    console.log('🎉 拡張機能がインストールされました！', details.reason);

    // 初期設定
    chrome.storage.local.set({
        featureEnabled: true,
        installDate: new Date().toISOString()
    });
});

// 拡張機能起動時
chrome.runtime.onStartup.addListener(() => {
    console.log('🚀 拡張機能が起動しました！');
});

// メッセージリスナー（ポップアップやコンテンツスクリプトからのメッセージを受信）
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📩 メッセージ受信:', message, 'from:', sender);

    switch (message.action) {
        case 'getStatus':
            chrome.storage.local.get(['featureEnabled'], (result) => {
                sendResponse({ enabled: result.featureEnabled });
            });
            return true; // 非同期レスポンスを示す

        case 'log':
            console.log('📝 ログ:', message.data);
            sendResponse({ success: true });
            break;

        default:
            console.log('❓ 未知のアクション:', message.action);
            sendResponse({ error: 'Unknown action' });
    }
});

// 外部からのメッセージ（他の拡張機能やウェブページから）
chrome.runtime.onMessageExternal.addListener((message, sender, sendResponse) => {
    console.log('🌐 外部メッセージ:', message, 'from:', sender);
    sendResponse({ received: true });
});
