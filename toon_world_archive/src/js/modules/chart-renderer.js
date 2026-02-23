// ============================================
// Chart Renderer Module
// ============================================

export const ChartRenderer = {
    instances: {}, // Chart instances storage

    /**
     * Destroy chart instance if exists
     */
    destroy(id) {
        if (this.instances[id]) {
            this.instances[id].destroy();
            delete this.instances[id];
        }
    },

    /**
     * Render Charts for a specific shop
     */
    renderShopCharts(shop, channelColors) {
        const shopCode = shop.shop_code;

        // 1. Channel Distribution (Stacked Bar Chart)
        this.renderChannelChart(shop, channelColors);
    },

    /**
     * Render Channel Distribution Stacked Bar Chart
     * 旧バージョン互換: 月別の100%積み上げ棒グラフ
     */
    renderChannelChart(shop, channelColors) {
        const canvasId = `chart-channel-${shop.shop_code}`;
        const canvas = document.getElementById(canvasId);

        if (!canvas) {
            console.warn(`Canvas element not found: ${canvasId}`);
            return;
        }

        this.destroy(canvasId);

        // 月別ラベル
        const labels = shop.channel_totals_by_month.map(t => Utils.formatMonthShort(t.ym));

        // 各経路のデータセット構築
        const datasets = shop.channel_data
            .filter(ch => ch.total_count > 0)
            .map(ch => {
                const data = ch.monthly_data.map(md => md.ratio); // 構成比（%）

                return {
                    label: ch.channel_name,
                    data: data,
                    backgroundColor: channelColors[ch.channel_name] || '#9E9E9E'
                };
            });

        const ctx = canvas.getContext('2d');
        this.instances[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: {
                        stacked: true,
                        max: 100,
                        ticks: {
                            callback: value => value + '%'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            boxWidth: 12,
                            font: { size: 10 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: ctx => ctx.dataset.label + ': ' + ctx.parsed.y.toFixed(1) + '%'
                        }
                    }
                }
            }
        });
    }
};
