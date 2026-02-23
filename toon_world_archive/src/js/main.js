// ============================================
// Vue.js Application Entry Point
// ============================================

const { createApp, ref, computed, onMounted, nextTick, watch } = Vue;

// 初期テンプレートを保存する変数（ダウンロード用）
let initialAppTemplate = '';

const app = createApp({
    setup() {
        // --- State ---
        const step = ref(1); // 1: Input, 2: Settings, 3: Report
        const isLoading = ref(false);
        const loadingText = ref('読み込み中...');
        const rawData = ref(null);      // Parsed TOON Object
        const reportData = ref(null);   // Data formatted for View
        const isDragging = ref(false);

        // Settings
        const periodStart = ref(null);
        const periodEnd = ref(null);
        const availableShops = ref([]); // { code: string, name: string }[]
        const selectedShops = ref([]); // shop_code[]
        const aiEnabled = ref(false); // Global AI toggle

        // UI State
        const openShopCode = ref(null); // Accordion state
        const othersOpen = ref({}); // { shop_code: boolean }

        // AI Feature
        const aiSummary = ref({ content: '', loading: false, error: null });
        const aiShopComments = ref({}); // { shop_code: { content: '', loading: false, error: null } }

        // --- Computed ---
        const hasData = computed(() => !!reportData.value && step.value === 3);
        const hasRawData = computed(() => !!rawData.value);

        // --- Methods ---

        // File Handling
        const handleDrop = async (e) => {
            e.preventDefault();
            isDragging.value = false;
            const files = e.dataTransfer.files;
            if (files.length > 0) processFile(files[0]);
        };

        const handleFileSelect = (e) => {
            const files = e.target.files;
            if (files.length > 0) processFile(files[0]);
        };

        const processFile = (file) => {
            isLoading.value = true;
            loadingText.value = 'ファイルを解析中...';

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const content = e.target.result;
                    const parser = new ToonParser();
                    const parsed = parser.parse(content);

                    console.log('Parsed Data:', parsed);
                    rawData.value = parsed;

                    // Initial Setup from parsed data
                    initializeOptions(parsed);

                    // Move to Settings Step
                    step.value = 2;

                    isLoading.value = false;
                } catch (err) {
                    console.error(err);
                    alert('ファイルの解析に失敗しました: ' + err.message);
                    isLoading.value = false;
                }
            };
            reader.readAsText(file);
        };

        const initializeOptions = (data) => {
            // Set Period
            if (data.export_info.period) {
                // 単一の期間が入っている前提 (TOONの仕様による)
                periodStart.value = data.export_info.period.start;
                periodEnd.value = data.export_info.period.end;
            }

            // Set Shops
            if (data.shops && data.shops.length > 0) {
                availableShops.value = data.shops.map(s => ({
                    code: s.shop_code,
                    name: s.shop_name
                }));
                // Default: Select All
                selectedShops.value = data.shops.map(s => s.shop_code);
            }
        };

        const generateReport = async () => {
            console.log('Generating report...');
            if (!rawData.value) return;

            isLoading.value = true;
            loadingText.value = 'レポートを生成中...';

            try {
                // Short wait to update UI state
                await new Promise(resolve => setTimeout(resolve, 100));

                // Use DataBuilder to transform data
                const result = DataBuilder.build(
                    rawData.value,
                    Number(periodStart.value),
                    Number(periodEnd.value),
                    selectedShops.value
                );

                console.log('Report Data:', result);
                reportData.value = result;

                // Reset UI state for report
                openShopCode.value = null;
                aiSummary.value = { content: '', loading: false, error: null };
                aiShopComments.value = {};

                // Move to Report Step
                step.value = 3;

                // Trigger AI if enabled (Simulate GAS call trigger)
                if (aiEnabled.value) {
                    fetchAiSummary();
                }
            } catch (err) {
                console.error(err);
                alert('レポート生成エラー: ' + err.message);
            } finally {
                isLoading.value = false;
            }
        };

        const backToSettings = () => {
            step.value = 2;
        };

        const resetAll = () => {
            rawData.value = null;
            reportData.value = null;
            availableShops.value = [];
            selectedShops.value = [];
            step.value = 1;
            openShopCode.value = null; // Reset open shop code
            aiShopComments.value = {}; // Reset AI shop comments
        };

        const toggleShop = (shopCode) => {
            if (openShopCode.value === shopCode) {
                openShopCode.value = null;
            } else {
                openShopCode.value = shopCode;
                // Render charts when opening
                const shop = reportData.value.shops.find(s => s.shop_code === shopCode);
                if (shop) {
                    setTimeout(() => {
                        // Channel Colors Map
                        const colors = {};
                        shop.channel_data.forEach(ch => {
                            colors[ch.channel_name] = getChannelColor(ch.channel_name);
                        });
                        ChartRenderer.renderShopCharts(shop, colors);
                    }, 0);
                }
            }
        };

        const closeShop = () => {
            openShopCode.value = null;
        };

        const toggleOthers = (shopCode) => {
            othersOpen.value[shopCode] = !othersOpen.value[shopCode];
        };

        const getOthersBreakdown = (shop) => {
            const othersChannel = shop.channel_data.find(ch => ch.channel_name === 'その他');
            if (othersChannel && othersChannel.breakdown) {
                return othersChannel.breakdown; // 既にソート済み
            }
            return [];
        };

        const formatOthersCount = (shop, ym, otherName) => {
            const othersChannel = shop.channel_data.find(ch => ch.channel_name === 'その他');
            if (!othersChannel) return '-';
            const monthData = othersChannel.monthly_data.find(d => d.ym === ym);
            if (!monthData) return '-';

            // Note: monthly_dataには合計値しか入っていないため、utils.jsでの集計時にブレークダウンごとの月次データも保持する必要があるが、
            // 現状の構造維持のため、簡易的に元データ(shop.toreta_data)から取得する
            const toretaMonth = shop.raw_toreta_data[ym];
            if (!toretaMonth) return '-';

            const count = toretaMonth[otherName]?.reservation_count || 0;
            return count > 0 ? `${formatNumber(count)}組` : '-';
        };

        const formatOthersTotal = (shop, otherName) => {
            // 簡易計算: 全月の合計
            let total = 0;
            const months = Utils.getMonthsInRange(reportData.value.period.start, reportData.value.period.end);
            months.forEach(ym => {
                const toretaMonth = shop.raw_toreta_data[ym];
                if (toretaMonth) {
                    total += toretaMonth[otherName]?.reservation_count || 0;
                }
            });
            return total > 0 ? `${formatNumber(total)}組` : '-';
        };

        const sortedChannelData = (channelData) => {
            // その他を一番下に移動
            const normal = channelData.filter(ch => ch.channel_name !== 'その他');
            const others = channelData.filter(ch => ch.channel_name === 'その他');
            return [...normal, ...others];
        };

        const getShopName = (code) => {
            if (!code || !reportData.value) return '';
            const shop = reportData.value.shops.find(s => s.shop_code === code);
            return shop ? shop.shop_name : '';
        };

        const toggleAllShops = () => {
            if (selectedShops.value.length === availableShops.value.length) {
                selectedShops.value = [];
            } else {
                selectedShops.value = availableShops.value.map(s => s.code);
            }
        };

        const renderCharts = (shopCode) => {
            const shop = reportData.value.shops.find(s => s.shop_code === shopCode);
            if (shop) {
                // Channel Colors Map
                const colors = {};
                shop.channel_data.forEach(ch => {
                    colors[ch.channel_name] = getChannelColor(ch.channel_name);
                });

                // Use ChartRenderer
                ChartRenderer.renderShopCharts(shop, colors);
            }
        };

        // --- Restore Data (for Downloaded Report) ---
        onMounted(() => {
            // 初期テンプレートを保存（VueがDOMを書き換える前...と言いたいが、
            // app.mountが呼ばれる前なら取れるはずだが、createApp内なのでタイミングが微妙。
            // 確実なのは app.mount の直前で取得して、downloadReportから参照すること。
            // ここではデータ復元のみ行う。

            if (window.__PRELOADED_DATA__) {
                console.log('💾 リストアデータを検出しました。レポートを復元します...');
                const data = window.__PRELOADED_DATA__;

                // データの復元
                if (data.reportData) {
                    reportData.value = data.reportData;
                    step.value = 3;
                }

                if (data.settings) {
                    periodStart.value = data.settings.periodStart;
                    periodEnd.value = data.settings.periodEnd;
                    selectedShops.value = data.settings.selectedShops;
                    aiEnabled.value = data.settings.aiEnabled;
                }

                // AI分析結果の復元（あれば）
                if (data.aiSummary) aiSummary.value = data.aiSummary;
                if (data.aiShopComments) aiShopComments.value = data.aiShopComments;

                // RawData復元（再計算用）
                if (data.rawData) {
                    rawData.value = data.rawData;
                    // availableShops等の復元
                    if (data.rawData.shops) {
                        availableShops.value = data.rawData.shops.map(s => ({
                            code: s.shop_code,
                            name: s.shop_name
                        }));
                    }
                }
            }
        });

        // --- AI Features ---
        const fetchAiSummary = () => {
            if (!hasData.value) return;

            aiSummary.value.loading = true;
            aiSummary.value.error = null;

            // Prepare data for GAS
            // We need to pass raw structured data, not the massive strings if possible, 
            // but current logic expects built text.
            // For now, let's call GAS function (mocked locally, real in GAS).

            if (typeof google !== 'undefined' && google.script) {
                const summaryData = {
                    period: reportData.value.period,
                    shops: reportData.value.shops, // This is quite large, might hit limits if not careful
                    grandTotals: reportData.value.grandTotals
                };

                google.script.run
                    .withSuccessHandler(result => {
                        aiSummary.value.content = result;
                        aiSummary.value.loading = false;
                    })
                    .withFailureHandler(error => {
                        aiSummary.value.error = error.message;
                        aiSummary.value.loading = false;
                    })
                    .getAiSummaryComment(summaryData);
            } else {
                // Local Mock
                setTimeout(() => {
                    aiSummary.value.content = "【AI分析プレビュー】\nこれはローカル環境用のダミーテキストです。\n実際の環境ではGemini AIによる分析結果が表示されます。";
                    aiSummary.value.loading = false;
                }, 1500);
            }
        };

        const fetchAiShopComment = (shop) => {
            if (!shop) return;

            // Init state for this shop
            aiShopComments.value[shop.shop_code] = { content: '', loading: true, error: null };

            if (typeof google !== 'undefined' && google.script) {
                const avgSales = reportData.value.grandTotals.grand.sales / reportData.value.shops.length;

                google.script.run
                    .withSuccessHandler(result => {
                        aiShopComments.value[shop.shop_code] = { content: result, loading: false, error: null };
                    })
                    .withFailureHandler(error => {
                        aiShopComments.value[shop.shop_code] = { content: '', loading: false, error: error.message };
                    })
                    .getAiShopComment(shop, avgSales);
            } else {
                // Local Mock
                setTimeout(() => {
                    aiShopComments.value[shop.shop_code] = {
                        content: `【${shop.shop_name} 分析】\n売上は好調に推移しています。予約経路は食べログが主要です。`,
                        loading: false,
                        error: null
                    };
                }, 1000);
            }
        };

        // Watch for checkbox change
        watch(aiEnabled, (newVal) => {
            if (newVal && hasData.value && !aiSummary.value.content && !aiSummary.value.loading) {
                fetchAiSummary();
            }
        });

        // --- Utils Exposure ---
        const formatCurrency = Utils.formatCurrency;
        const formatNumber = Utils.formatNumber;
        const formatPercent = Utils.formatPercent;
        const getProfitClass = Calculations.getProfitClass;
        const getYoYClass = Calculations.getYoYClass;

        const getChannelColor = (name) => {
            const colors = {
                '電話': '#4CAF50',
                'トレタ予約番': '#00BCD4',
                '食べログ': '#FF6B00',
                'ホットペッパー': '#E60012',
                'Retty': '#FF5722',
                '一休': '#1A1A1A',
                'OZmall': '#E91E63',
                'ぐるなび': '#B50000',
                'Googleで予約': '#4285F4',
                'かんたんネット予約': '#9C27B0',
                'かんたんネット予約プラス': '#7B1FA2',
                'PayPayグルメ': '#FF0033',
                'LINE': '#06C755',
                'その他': '#9E9E9E'
            };
            return colors[name] || '#9E9E9E';
        };

        // --- Download Feature ---
        // --- Download Feature ---
        const downloadReport = () => {
            if (!reportData.value) return;

            // 1. 保存するデータを準備
            const saveData = {
                reportData: reportData.value,
                rawData: rawData.value,
                settings: {
                    periodStart: periodStart.value,
                    periodEnd: periodEnd.value,
                    selectedShops: selectedShops.value,
                    aiEnabled: aiEnabled.value
                },
                aiSummary: aiSummary.value,
                aiShopComments: aiShopComments.value
            };

            // 2. 現在のDOMの状態ではなく、アプリ起動直後のクリーンな状態のHTML構造を再現する
            // document.documentElement.outerHTML を使うと、現在のレンダリング済み（v-for展開済み）のDOMが取れてしまい、
            // 再度Vueがマウントしたときに二重レンダリング等の問題が起きる。
            // そのため、保存しておいた initialAppTemplate を使って #app の中身を書き換える。

            // HTML全体を取得
            const doc = document.documentElement.cloneNode(true);

            // #app の中身を初期テンプレートに戻す
            const appDiv = doc.querySelector('#app');
            if (appDiv && initialAppTemplate) {
                appDiv.innerHTML = initialAppTemplate;
            }

            // 3. 復元用データを注入
            // エスケープ処理：JSON内のスクリプトタグ閉じを防止
            // Unicodeエスケープで正規表現を作成（ソースコードに < / s c r i p t > を出現させない）
            const scriptCloseRegex = new RegExp('\u003c/script\u003e', 'g');
            const jsonStr = JSON.stringify(saveData).replace(scriptCloseRegex, '\\u003c/script\\u003e');

            const dataScript = document.createElement('script');
            dataScript.textContent = `window.__PRELOADED_DATA__ = ${jsonStr};`;

            // 重要：Vueがマウントされる前にデータを定義しておく必要があるため、
            // bodyの末尾ではなく、headの末尾（CSSの後、メインスクリプトの前あたり）に追加する
            // あるいは body の先頭でも良い
            const head = doc.querySelector('head');
            head.appendChild(dataScript);

            // 4. HTML文字列化してダウンロード
            // GAS/ブラウザのパーサー対策として、HTMLタグを含む文字列を直接コードに書かない
            // Unicodeエスケープを使用してタグを表現
            const doctype = '\u003c!DOCTYPE html\u003e\n';
            const htmlClose = '\u003c/html\u003e';

            // outerHTMLには </html> が含まれていない場合がある（documentElement.outerHTMLは含むはずだが念のため）
            // 安全のため、doc.outerHTML を使う
            const fullHTML = doctype + doc.outerHTML;

            const blob = new Blob([fullHTML], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `店舗分析レポート_${reportData.value.period.start}-${reportData.value.period.end}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        };

        return {
            step,
            isLoading,
            loadingText,
            handleDrop,
            handleFileSelect,
            isDragging,
            hasData,
            reportData,

            // Settings
            aiEnabled,
            periodStart,
            periodEnd,
            availableShops,
            selectedShops,
            generateReport,
            backToSettings,
            resetAll,
            Object,

            // Actions
            toggleAllShops,
            downloadReport,

            // UI State
            openShopCode,
            toggleShop,
            closeShop,

            // Others Toggle
            othersOpen,
            toggleOthers,
            getOthersBreakdown,
            formatOthersCount,
            formatOthersTotal,
            sortedChannelData,
            getShopName,

            // AI
            aiSummary,
            aiShopComments,
            fetchAiShopComment,

            // Utils
            formatCurrency,
            formatNumber,
            formatPercent,
            getProfitClass,
            getYoYClass,
            getChannelColor,
            Utils
        };
    }
});

// マウント直前に初期テンプレートを確保
// これにより、ダウンロード時に「Vue未適用のきれいなHTML」などを使ってファイルを生成できる
const appElement = document.getElementById('app');
if (appElement) {
    initialAppTemplate = appElement.innerHTML;
}

app.mount('#app');

