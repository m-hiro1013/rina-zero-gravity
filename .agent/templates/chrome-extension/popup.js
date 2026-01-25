/**
 * {{project_name}} - Popup Script
 * 
 * ポップアップのロジックをここに書くよ！
 */

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Popup loaded!');

    // 初期化
    init();
});

/**
 * 初期化
 */
async function init() {
    // 設定を読み込む
    await loadSettings();

    // イベントリスナーを設定
    setupEventListeners();
}

/**
 * 設定を読み込む
 */
async function loadSettings() {
    try {
        const result = await chrome.storage.local.get(['featureEnabled']);
        const featureEnabled = result.featureEnabled ?? true;

        document.getElementById('toggle-feature').checked = featureEnabled;
        updateStatusIndicator(featureEnabled);
    } catch (error) {
        console.error('設定の読み込みに失敗:', error);
    }
}

/**
 * イベントリスナーの設定
 */
function setupEventListeners() {
    // アクションボタン
    document.getElementById('action-btn').addEventListener('click', handleAction);

    // トグルスイッチ
    document.getElementById('toggle-feature').addEventListener('change', handleToggle);
}

/**
 * アクションボタンのハンドラー
 */
async function handleAction() {
    const btn = document.getElementById('action-btn');
    const resultDiv = document.getElementById('result');
    const resultText = document.getElementById('result-text');

    // ボタンを無効化
    btn.disabled = true;
    btn.textContent = '処理中...';

    try {
        // 現在のタブに対してアクションを実行
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        // コンテンツスクリプトにメッセージを送信
        const response = await chrome.tabs.sendMessage(tab.id, {
            action: 'execute',
            data: {}
        });

        // 結果を表示
        resultText.textContent = response?.message || 'アクション完了！';
        resultDiv.classList.remove('hidden');

    } catch (error) {
        console.error('アクション実行エラー:', error);
        resultText.textContent = 'エラーが発生しました';
        resultDiv.classList.remove('hidden');
    } finally {
        // ボタンを復元
        btn.disabled = false;
        btn.textContent = 'アクション実行';
    }
}

/**
 * トグルスイッチのハンドラー
 */
async function handleToggle(event) {
    const enabled = event.target.checked;

    try {
        // 設定を保存
        await chrome.storage.local.set({ featureEnabled: enabled });

        // ステータス表示を更新
        updateStatusIndicator(enabled);

        console.log('機能の有効/無効:', enabled);
    } catch (error) {
        console.error('設定の保存に失敗:', error);
    }
}

/**
 * ステータスインジケーターを更新
 */
function updateStatusIndicator(active) {
    const indicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');

    if (active) {
        indicator.classList.add('active');
        statusText.textContent = '有効';
    } else {
        indicator.classList.remove('active');
        statusText.textContent = '無効';
    }
}
