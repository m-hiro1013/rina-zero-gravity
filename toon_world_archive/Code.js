/**
 * ================================================================================
 * 📊 店舗分析レポート ジェネレーター - Code.gs
 * ================================================================================
 * 
 * 【このファイルの役割】
 * - Webアプリのエントリーポイント（doGet）
 * - Gemini APIを使ったAIコメント生成
 * - フロントエンド（HTML）へのデータ提供
 * 
 * 【スクリプトプロパティ】
 * - GEMINI_API_KEY: Gemini APIのAPIキー
 * 
 * 【AIコメント構成】
 * - 全体サマリー: 字数制限なし（しっかり分析）
 * - 店舗別サマリー: 100字程度（簡潔に）
 * 
 * ================================================================================
 */

// ============================================
// 1. 定数・設定
// ============================================

/** Gemini APIのエンドポイント */
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

/** APIキー取得 */
function getApiKey() {
    const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
    if (!key) {
        throw new Error('GEMINI_API_KEY がスクリプトプロパティに設定されていません');
    }
    return key;
}

// ============================================
// 2. Webアプリ エントリーポイント
// ============================================

/**
 * GETリクエストのハンドラ（Webアプリのエントリーポイント）
 * @returns {HtmlOutput} HTMLページ
 */
function doGet() {
    return HtmlService.createTemplateFromFile('index')
        .evaluate()
        .setTitle('TOON_WORLD店舗分析レポート ジェネレーター')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ============================================
// 3. Gemini API 呼び出し（共通）
// ============================================

/**
 * Gemini APIを呼び出してテキスト生成
 * @param {string} prompt - プロンプト
 * @param {number} maxTokens - 最大トークン数
 * @returns {string} 生成されたテキスト
 */
function callGeminiApi(prompt, maxTokens = 1000) {
    const apiKey = getApiKey();
    const url = `${GEMINI_API_URL}?key=${apiKey}`;

    const payload = {
        contents: [
            {
                parts: [
                    { text: prompt }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.7,
            // maxOutputTokens: maxTokens,  // ← コメントアウト！
            topP: 0.9
        }
    };

    const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    try {
        const response = UrlFetchApp.fetch(url, options);
        const responseCode = response.getResponseCode();
        const responseText = response.getContentText();

        // デバッグ: レスポンスコードをログ出力
        console.log('=== Gemini API Response ===');
        console.log('Response Code:', responseCode);

        if (responseCode !== 200) {
            console.error('Gemini API Error:', responseCode, responseText);
            return `[APIエラー: ${responseCode}]`;
        }

        const json = JSON.parse(responseText);

        // デバッグ: レスポンス全体をログ出力
        console.log('Response JSON:', JSON.stringify(json, null, 2));

        // レスポンスからテキストを抽出
        if (json.candidates && json.candidates[0] && json.candidates[0].content) {
            const parts = json.candidates[0].content.parts;
            if (parts && parts[0] && parts[0].text) {
                const generatedText = parts[0].text.trim();

                // デバッグ: 生成されたテキストをログ出力
                console.log('Generated Text Length:', generatedText.length);
                console.log('Generated Text:', generatedText);

                // デバッグ: finishReasonを確認
                const finishReason = json.candidates[0].finishReason;
                console.log('Finish Reason:', finishReason);

                if (finishReason === 'MAX_TOKENS') {
                    console.warn('⚠️ トークン上限に達して途中で切れた可能性あり！');
                }

                return generatedText;
            }
        }

        console.error('Unexpected response structure:', responseText);
        return '[レスポンス解析エラー]';

    } catch (error) {
        console.error('Gemini API Exception:', error);
        return `[例外エラー: ${error.message}]`;
    }
}

// ============================================
// 4. AIコメント生成関数
// ============================================

/**
 * 全体サマリーコメント生成（字数制限なし）
 * @param {Object} data - サマリー用データ
 * @returns {string} AIコメント
 */
function getAiSummaryComment(data) {
    try {
        const { period, shops, grandTotals } = data;

        // 月別データをテキスト化
        let monthlyText = '';
        Object.keys(grandTotals.monthly).sort().forEach(ym => {
            const monthData = grandTotals.monthly[ym];
            monthlyText += `${formatYearMonth(ym)}: 売上${formatCurrency(monthData.sales)}, 予約${monthData.reservation_count}組, ${monthData.guest_count}人`;
            if (monthData.sales_yoy) {
                monthlyText += ` (前年比: 売上${monthData.sales_yoy.toFixed(1)}%, 予約${monthData.reservation_yoy.toFixed(1)}%)`;
            }
            monthlyText += '\n';
        });

        // 店舗別サマリーをテキスト化（詳細に）
        let shopText = '';
        shops.forEach(shop => {
            shopText += `\n【${shop.shop_name}】\n`;
            shopText += `売上合計: ${formatCurrency(shop.total_sales)}, 予約: ${shop.total_reservation_count}組, ${shop.total_guest_count}人\n`;

            // 月別推移
            if (shop.monthly_summary && shop.monthly_summary.length > 0) {
                shopText += '月別: ';
                shop.monthly_summary.forEach((m, idx) => {
                    if (idx > 0) shopText += ' → ';
                    shopText += `${m.month_display}:${m.sales}`;
                });
                shopText += '\n';
            }

            // 経路構成
            if (shop.channel_data && shop.channel_data.length > 0) {
                shopText += '予約経路: ';
                shop.channel_data.slice(0, 3).forEach((ch, idx) => {
                    if (idx > 0) shopText += ', ';
                    shopText += `${ch.channel_name}(${ch.total_ratio})`;
                });
                shopText += '\n';
            }

            // 媒体別実績
            if (shop.media_analysis && shop.media_analysis.length > 0) {
                shopText += '媒体実績:\n';
                shop.media_analysis.forEach(media => {
                    shopText += `  ${media.media_name}: 予約${media.total_reservation_count}件, 費用${media.total_cost}, 利益${media.total_profit}, CVR${media.avg_cvr}\n`;
                });
            }
        });

        const prompt = `あなたは飲食店の経営分析コンサルタントです。以下のデータを詳細に分析して、経営者向けの分析レポートを生成してください。

【データ概要】
対象期間: ${formatYearMonth(period.start)} 〜 ${formatYearMonth(period.end)}
店舗数: ${shops.length}店舗

【全店舗合計（月別推移）】
${monthlyText}

【店舗別詳細データ】
${shopText}

【レポート作成指示】
以下の構成で詳細な分析レポートを作成してください：

1. 全体サマリー
   - 全店舗の売上・予約数の全体傾向
   - 前年比がある場合はその評価

2. 店舗別の分析
   - 各店舗の特徴と課題
   - 好調な店舗、改善が必要な店舗の明示

3. 予約経路の傾向
   - 主要な予約経路とその特徴
   - 店舗間の違いがあれば指摘

4. 媒体別の効率性
   - 各媒体のROI（利益/費用）の評価
   - CVRの比較と改善ポイント

5. 今後のアクション提案
   - 具体的な改善施策を2〜3点

文章は敬語で、プロフェッショナルかつ分かりやすいトーンでお願いします。
箇条書きと文章を適宜組み合わせて、読みやすく構成してください。`;

        return callGeminiApi(prompt, 2000);
    } catch (error) {
        console.error('サマリーコメント生成エラー:', error);
        return '[生成エラー: ' + error.message + ']';
    }
}

/**
 * 店舗別サマリーコメント生成（100字程度）
 * @param {Object} shopData - 店舗データ
 * @param {number} avgSales - 全店舗平均売上
 * @returns {string} AIコメント
 */
function getAiShopComment(shopData, avgSales) {
    try {
        // 月別推移
        let trendText = '';
        if (shopData.monthly_summary && shopData.monthly_summary.length > 0) {
            const first = shopData.monthly_summary[0];
            const last = shopData.monthly_summary[shopData.monthly_summary.length - 1];
            trendText = `${first.month_display}:${first.sales} → ${last.month_display}:${last.sales}`;
        }

        // 全店舗平均との比較
        const vsAvg = avgSales > 0 ? ((shopData.total_sales / avgSales) * 100).toFixed(0) : '-';

        // 主要経路
        let topChannel = '-';
        if (shopData.channel_data && shopData.channel_data.length > 0) {
            topChannel = `${shopData.channel_data[0].channel_name}(${shopData.channel_data[0].total_ratio})`;
        }

        // 媒体実績サマリー
        let mediaText = '';
        if (shopData.media_analysis && shopData.media_analysis.length > 0) {
            shopData.media_analysis.forEach(m => {
                mediaText += `${m.media_name}:利益${m.total_profit} `;
            });
        }

        const prompt = `飲食店の経営分析コンサルタントとして、以下の店舗を100字程度で簡潔に評価してください。

【店舗】${shopData.shop_name}
【売上推移】${trendText}
【売上合計】${formatCurrency(shopData.total_sales)}（全店舗平均の${vsAvg}%）
【予約】${shopData.total_reservation_count}組
【主要経路】${topChannel}
【媒体実績】${mediaText}

【指示】
- この店舗の状況を100字程度で簡潔に
- 良い点と改善点を1つずつ
- 敬語で`;

        return callGeminiApi(prompt, 200);
    } catch (error) {
        console.error('店舗コメント生成エラー:', error);
        return '[生成エラー]';
    }
}

// ============================================
// 5. ユーティリティ関数
// ============================================

/**
 * 年月フォーマット（202510 → 2025年10月）
 * @param {number|string} ym - 年月（YYYYMM形式）
 * @returns {string} フォーマット済み文字列
 */
function formatYearMonth(ym) {
    const str = String(ym);
    const year = str.substring(0, 4);
    const month = parseInt(str.substring(4, 6), 10);
    return `${year}年${month}月`;
}

/**
 * 金額フォーマット（1234567 → ¥1,234,567）
 * @param {number} num - 金額
 * @returns {string} フォーマット済み文字列
 */
function formatCurrency(num) {
    if (num === null || num === undefined) return '-';
    return '¥' + num.toLocaleString('ja-JP');
}

// ============================================
// 6. テスト用関数
// ============================================

/**
 * Gemini API接続テスト
 */
function testGeminiApi() {
    const testPrompt = 'こんにちは！これはテストです。「接続成功」と返答してください。';
    const result = callGeminiApi(testPrompt, 100);
    console.log('テスト結果:', result);
    return result;
}

/**
 * APIキー設定確認テスト
 */
function testApiKey() {
    try {
        const key = getApiKey();
        console.log('APIキー取得成功（先頭5文字）:', key.substring(0, 5) + '...');
        return true;
    } catch (error) {
        console.error('APIキー取得失敗:', error.message);
        return false;
    }
}
// ============================================
// 7. HTMLインクルード関数
// ============================================

/**
 * HTMLファイルをインクルードする
 * @param {string} filename - ファイル名（拡張子なし）
 * @returns {string} ファイルの内容
 */
function include(filename) {
    return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ============================================
// 8. スプレッドシート連携（プロンプト管理）
// ============================================

/** スプレッドシートID */
const SPREADSHEET_ID = '1Px95PrwyxOI3a66Qom3MeTuO2-dUHjpLFIE6HksXwfY';
const SHEET_NAME = 'prompts';

/**
 * プロンプトをスプレッドシートから取得
 * @returns {Object} { summary: '...', shop: '...' }
 */
function getPrompts() {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        const sheet = ss.getSheetByName(SHEET_NAME);

        if (!sheet) {
            // シートがなければ作成して初期値を設定
            return initializePromptsSheet(ss);
        }

        const data = sheet.getDataRange().getValues();
        const prompts = {};

        // A列: キー, B列: プロンプト
        data.forEach(row => {
            if (row[0] && row[1]) {
                prompts[row[0]] = row[1];
            }
        });

        return {
            summary: prompts['SUMMARY_PROMPT'] || getDefaultSummaryPrompt(),
            shop: prompts['SHOP_PROMPT'] || getDefaultShopPrompt()
        };
    } catch (error) {
        console.error('プロンプト取得エラー:', error);
        return {
            summary: getDefaultSummaryPrompt(),
            shop: getDefaultShopPrompt()
        };
    }
}

/**
 * プロンプトをスプレッドシートに保存
 * @param {string} summaryPrompt - 全体サマリー用プロンプト
 * @param {string} shopPrompt - 店舗別用プロンプト
 */
function savePrompts(summaryPrompt, shopPrompt) {
    try {
        const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
        let sheet = ss.getSheetByName(SHEET_NAME);

        if (!sheet) {
            sheet = ss.insertSheet(SHEET_NAME);
        }

        // クリアして書き込み
        sheet.clear();
        sheet.getRange('A1:B1').setValues([['SUMMARY_PROMPT', summaryPrompt]]);
        sheet.getRange('A2:B2').setValues([['SHOP_PROMPT', shopPrompt]]);

        // 列幅調整
        sheet.setColumnWidth(1, 150);
        sheet.setColumnWidth(2, 800);

        return { success: true };
    } catch (error) {
        console.error('プロンプト保存エラー:', error);
        return { success: false, error: error.message };
    }
}

/**
 * プロンプトシートを初期化
 */
function initializePromptsSheet(ss) {
    const sheet = ss.insertSheet(SHEET_NAME);

    const summaryPrompt = getDefaultSummaryPrompt();
    const shopPrompt = getDefaultShopPrompt();

    sheet.getRange('A1:B1').setValues([['SUMMARY_PROMPT', summaryPrompt]]);
    sheet.getRange('A2:B2').setValues([['SHOP_PROMPT', shopPrompt]]);

    sheet.setColumnWidth(1, 150);
    sheet.setColumnWidth(2, 800);

    return { summary: summaryPrompt, shop: shopPrompt };
}

/**
 * デフォルトの全体サマリープロンプト
 */
function getDefaultSummaryPrompt() {
    return `以下の飲食店グループの経営データを分析してください。

【分析の観点】
1. 売上トレンド（前月比重視）
   - 全体の傾向
   - 特に顕著な変化があった点
   - 全体と逆の動きをしている点

2. 予約数トレンド（前月比重視）
   - 全体の傾向
   - 特に顕著な変化があった点
   - 全体と逆の動きをしている点

3. 好調店舗（前月比で伸びた3〜4店舗をピックアップ）
   - 店舗名と具体的な数値を明示

4. 要改善店舗（前月比で落ちた3〜4店舗をピックアップ）
   - 店舗名と具体的な数値を明示

5. 予約経路の傾向
   - 一番多い経路
   - 変化率が大きい経路

6. 媒体別ROIの傾向
   - 一番効率が良い媒体
   - 変化率が大きい媒体

7. デリバリー（Uber）の推移
   - 売上全体に占めるシェアと変化
   - 店舗ごとのデリバリー活用の差

8. プラン変更の影響（該当があれば）
   - 変更月の前後2〜3ヶ月を反映して評価

【出力ルール】
- 1まとまりの文章として出力（見出しや箇条書きは使わない）
- ポジティブな点とネガティブな点を中立的に記載
- 必ず具体的な数値を含める
- 体系的・網羅的・建設的な内容にする

【データ】
{{DATA}}`;
}

/**
 * デフォルトの店舗別プロンプト
 */
function getDefaultShopPrompt() {
    return `以下の店舗データを分析してください。

【分析の観点】
1. 売上トレンド（前月比ベース、数値を明示）

2. 予約数トレンド（前月比ベース、数値を明示）

3. 全店舗平均との比較（平均の何%か）

4. 予約経路の特徴（依存度、変化率など）

5. 媒体別の効率（CVR、利益率など）

6. デリバリー（Uber）の実績（売上の何%か、推移など）
 
 7. プラン変更の影響（該当があれば、変更前後の比較）


8. 改善ポイント（具体的な提案）

【出力ルール】
- 1まとまりの文章として出力（見出しや箇条書きは使わない）
- ポジティブな点とネガティブな点を中立的に記載
- 必ず具体的な数値を含める
- 体系的・網羅的・建設的な内容にする
- 注目すべきポイントがはっきりわかるようにする

【データ】
{{DATA}}`;
}


// ============================================
// 9. AIコメント生成（プロンプト連携版）
// ============================================

/**
 * 全体サマリーコメント生成
 * @param {Object} data - レポートデータ
 * @returns {string} AIコメント
 */
function getAiSummaryComment(data) {
    try {
        const prompts = getPrompts();
        const promptTemplate = prompts.summary;

        // データをテキスト化
        const dataText = buildSummaryDataText(data);

        // プロンプトにデータを埋め込み
        const prompt = promptTemplate.replace('{{DATA}}', dataText);

        return callGeminiApi(prompt, 4000);
    } catch (error) {
        console.error('サマリーコメント生成エラー:', error);
        return '[生成エラー: ' + error.message + ']';
    }
}

/**
 * 店舗別コメント生成
 * @param {Object} shopData - 店舗データ
 * @param {number} avgSales - 全店舗平均売上
 * @returns {string} AIコメント
 */
function getAiShopComment(shopData, avgSales) {
    try {
        const prompts = getPrompts();
        const promptTemplate = prompts.shop;

        // データをテキスト化
        const dataText = buildShopDataText(shopData, avgSales);

        // プロンプトにデータを埋め込み
        const prompt = promptTemplate.replace('{{DATA}}', dataText);

        return callGeminiApi(prompt, 2000);
    } catch (error) {
        console.error('店舗コメント生成エラー:', error);
        return '[生成エラー: ' + error.message + ']';
    }
}

/**
 * サマリー用データをテキスト化
 */
function buildSummaryDataText(data) {
    const { period, shops, grandTotals } = data;

    let text = `対象期間: ${formatYearMonth(period.start)} 〜 ${formatYearMonth(period.end)}\n`;
    text += `店舗数: ${shops.length}店舗\n\n`;

    // 全店舗合計（月別）
    text += '【全店舗合計（月別）】\n';
    Object.keys(grandTotals.monthly).sort().forEach(ym => {
        const m = grandTotals.monthly[ym];
        text += `${formatYearMonth(ym)}: 売上${formatCurrency(m.sales)}, 予約${m.reservation_count}組, ${m.guest_count}人`;
        if (m.sales_yoy) {
            text += ` (前年比: 売上${m.sales_yoy.toFixed(1)}%, 予約${m.reservation_yoy.toFixed(1)}%)`;
        }
        text += '\n';
    });

    // 店舗別
    text += '\n【店舗別データ】\n';
    shops.forEach(shop => {
        text += `\n■ ${shop.shop_name}\n`;
        text += `売上合計: ${formatCurrency(shop.total_sales)}, 予約: ${shop.total_reservation_count}組, ${shop.total_guest_count}人\n`;

        // 月別
        if (shop.monthly_summary && shop.monthly_summary.length > 0) {
            text += '月別推移: ';
            shop.monthly_summary.forEach((m, i) => {
                if (i > 0) text += ' → ';
                text += `${m.month_display}:${m.sales}`;
            });
            text += '\n';
        }

        // 経路
        if (shop.channel_data && shop.channel_data.length > 0) {
            text += '予約経路: ';
            shop.channel_data.forEach((ch, i) => {
                if (i > 0) text += ', ';
                text += `${ch.channel_name}(${ch.total_ratio})`;
            });
            text += '\n';
        }

        // 媒体
        if (shop.media_analysis && shop.media_analysis.length > 0) {
            text += '媒体実績: ';
            shop.media_analysis.forEach((m, i) => {
                if (i > 0) text += ' / ';
                text += `${m.media_name}:予約${m.total_reservation_count},利益${m.total_profit},CVR${m.avg_cvr}`;
            });
            text += '\n';
        }

        // 広告費・運用費
        if (shop.ad_cost_data && shop.ad_cost_data.length > 0) {
            text += '広告費・運用費: ';
            shop.ad_cost_data.forEach((ad, i) => {
                if (i > 0) text += ', ';
                text += `${ad.media_name}:${ad.total_cost}`;
            });
            text += '\n';
        }
    });

    return text;
}

/**
 * 店舗用データをテキスト化
 */
function buildShopDataText(shopData, avgSales) {
    let text = `店舗名: ${shopData.shop_name}\n`;
    text += `売上合計: ${formatCurrency(shopData.total_sales)}\n`;
    text += `予約合計: ${shopData.total_reservation_count}組, ${shopData.total_guest_count}人\n`;

    // 全店舗平均との比較
    const vsAvg = avgSales > 0 ? ((shopData.total_sales / avgSales) * 100).toFixed(1) : '-';
    text += `全店舗平均比: ${vsAvg}%\n`;

    // 月別推移
    if (shopData.monthly_summary && shopData.monthly_summary.length > 0) {
        text += '\n【月別推移】\n';
        shopData.monthly_summary.forEach(m => {
            text += `${m.month_display}: 売上${m.sales}, 予約${m.reservation_count}, ${m.guest_count}\n`;
        });
    }

    // 予約経路
    if (shopData.channel_data && shopData.channel_data.length > 0) {
        text += '\n【予約経路構成】\n';
        shopData.channel_data.forEach(ch => {
            text += `${ch.channel_name}: ${ch.total_count}組 (${ch.total_ratio})\n`;
        });
    }

    // 媒体別
    if (shopData.media_analysis && shopData.media_analysis.length > 0) {
        text += '\n【媒体別実績】\n';
        shopData.media_analysis.forEach(m => {
            text += `${m.media_name}: 予約${m.total_reservation_count}, 費用${m.total_cost}, 利益${m.total_profit}, CVR${m.avg_cvr}`;
            if (m.has_plan_change) {
                text += ` ※プラン変更あり(${m.plan_change_month}: ${m.plan_change_detail})`;
            }
            text += '\n';
        });
    }

    // 広告費・運用費
    if (shopData.ad_cost_data && shopData.ad_cost_data.length > 0) {
        text += '\n【広告費・運用費】\n';
        shopData.ad_cost_data.forEach(ad => {
            text += `${ad.media_name}: ${ad.total_cost}（${ad.plan_name}）\n`;
        });
    }

    return text;
}

/**
 * 権限承認用のテスト関数
 * これを実行して承認ダイアログを出す
 */
function authorizeSpreadsheetsAccess() {
    // スプレッドシートを開く（これで権限要求される）
    const ss = SpreadsheetApp.openById('1Px95PrwyxOI3a66Qom3MeTuO2-dUHjpLFIE6HksXwfY');
    const sheet = ss.getSheets()[0];
    Logger.log('スプレッドシート名: ' + ss.getName());
    Logger.log('シート名: ' + sheet.getName());
    Logger.log('権限OK！');
}