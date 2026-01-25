/**
 * {{project_name}} - メインスクリプト
 * 
 * このファイルにJavaScriptを書いていくよ！
 */

// DOM読み込み完了後に実行
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 アプリケーション起動！');
    
    // 初期化処理
    init();
});

/**
 * 初期化関数
 */
function init() {
    // ナビゲーションのスムーススクロール
    setupSmoothScroll();
    
    // ボタンのイベント設定
    setupButtons();
}

/**
 * スムーススクロールの設定
 */
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * ボタンのイベント設定
 */
function setupButtons() {
    const ctaButton = document.querySelector('.btn--primary');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            alert('ボタンがクリックされたよ！');
        });
    }
}

/**
 * ユーティリティ関数
 */
const utils = {
    /**
     * デバウンス
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 要素の表示切り替え
     */
    toggleVisibility(element) {
        element.classList.toggle('hidden');
    }
};
