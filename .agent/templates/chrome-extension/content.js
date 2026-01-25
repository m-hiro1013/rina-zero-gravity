/**
 * {{project_name}} - Content Script
 * 
 * ウェブページに注入されるスクリプトだよ！
 */

console.log('🎯 Content script loaded on:', window.location.href);

// ===== メッセージリスナー =====

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('📩 メッセージ受信:', message);

    switch (message.action) {
        case 'execute':
            const result = executeAction(message.data);
            sendResponse(result);
            break;

        case 'getData':
            const data = collectData();
            sendResponse(data);
            break;

        default:
            sendResponse({ error: 'Unknown action' });
    }

    return true; // 非同期レスポンスを示す
});

// ===== 機能関数 =====

/**
 * アクションを実行
 */
function executeAction(data) {
    try {
        // ここに実際のアクションを実装
        console.log('🚀 アクション実行:', data);

        // 例: ページのタイトルを取得
        const pageTitle = document.title;
        const pageUrl = window.location.href;

        return {
            success: true,
            message: `ページ「${pageTitle}」でアクションを実行しました！`,
            data: {
                title: pageTitle,
                url: pageUrl,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        console.error('❌ アクション実行エラー:', error);
        return {
            success: false,
            message: 'エラーが発生しました',
            error: error.message
        };
    }
}

/**
 * ページからデータを収集
 */
function collectData() {
    try {
        return {
            success: true,
            data: {
                title: document.title,
                url: window.location.href,
                description: document.querySelector('meta[name="description"]')?.content || '',
                links: Array.from(document.querySelectorAll('a'))
                    .slice(0, 10)
                    .map(a => ({ href: a.href, text: a.textContent?.trim() }))
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// ===== 自動実行 =====

/**
 * 機能が有効な場合のみ実行
 */
async function initIfEnabled() {
    try {
        const { featureEnabled } = await chrome.storage.local.get(['featureEnabled']);

        if (featureEnabled) {
            console.log('✨ 機能が有効です');
            // ここに自動実行したい処理を追加
        } else {
            console.log('💤 機能が無効です');
        }
    } catch (error) {
        console.error('初期化エラー:', error);
    }
}

// ページ読み込み完了後に初期化
initIfEnabled();
