// ============================================
// ユーティリティ関数
// ============================================

export const Utils = {
    getMonthsInRange(start, end) {
        const months = [];
        let current = start;
        while (current <= end) {
            months.push(current);
            const year = Math.floor(current / 100);
            const month = current % 100;
            if (month === 12) {
                current = (year + 1) * 100 + 1;
            } else {
                current = year * 100 + (month + 1);
            }
        }
        return months;
    },

    formatYearMonth(ym) {
        const year = Math.floor(ym / 100);
        const month = ym % 100;
        return `${year}年${month}月`;
    },

    formatMonthShort(ym) {
        const month = ym % 100;
        return `${month}月`;
    },

    formatNumber(num) {
        if (num === null || num === undefined) return '-';
        return num.toLocaleString();
    },

    formatCurrency(num) {
        if (num === null || num === undefined) return '-';
        return '¥' + num.toLocaleString();
    },

    formatPercent(num, decimals = 1) {
        if (num === null || num === undefined) return '-';
        return num.toFixed(decimals) + '%';
    }
};

// ============================================
// 計算ロジック
// ============================================

export const Calculations = {
    calcReservationExcludingWalkinArray(monthlyToretaArray) {
        if (!monthlyToretaArray || monthlyToretaArray.length === 0) {
            return { reservation_count: 0, guest_count: 0 };
        }
        const total = monthlyToretaArray.find(d => d.media === '合計') || { reservation_count: 0, guest_count: 0 };
        const walkin = monthlyToretaArray.find(d => d.media === 'ウォークイン') || { reservation_count: 0, guest_count: 0 };

        return {
            reservation_count: (total.reservation_count || 0) - (walkin.reservation_count || 0),
            guest_count: (total.guest_count || 0) - (walkin.guest_count || 0)
        };
    },

    calcYoY(current, previous) {
        if (!previous || previous === 0) return null;
        return (current / previous) * 100;
    },

    getYoYClass(yoyValue) {
        if (yoyValue === null) return 'yoy-neutral';
        return yoyValue >= 100 ? 'yoy-positive' : 'yoy-negative';
    },

    calcPV(mediaMonthData) {
        if (!mediaMonthData) return { top: 0, total: 0 };
        return {
            top: (mediaMonthData.pv_sp_top || 0) + (mediaMonthData.pv_pc_top || 0),
            total: (mediaMonthData.pv_sp_total || 0) + (mediaMonthData.pv_pc_total || 0)
        };
    },

    calcCVR(reservationCount, pvTop) {
        if (!pvTop || pvTop === 0) return null;
        return (reservationCount / pvTop) * 100;
    },

    calcTotalCost(mediaMonthData) {
        if (!mediaMonthData) return 0;
        const baseCost = mediaMonthData.base_cost || 0;
        const unitLunch = mediaMonthData.unit_cost_lunch || 0;
        const unitDinner = mediaMonthData.unit_cost_dinner || 0;
        const guestLunch = mediaMonthData.guest_count_lunch || 0;
        const guestDinner = mediaMonthData.guest_count_dinner || 0;
        const guestTotal = mediaMonthData.guest_count_total || 0;

        if (guestLunch > 0 || guestDinner > 0) {
            return baseCost + (unitLunch * guestLunch) + (unitDinner * guestDinner);
        }
        return baseCost + (unitDinner * guestTotal);
    },

    calcEstimatedRevenue(mediaMonthData, avgPriceLunch, avgPriceDinner) {
        if (!mediaMonthData) return 0;
        const guestLunch = mediaMonthData.guest_count_lunch || 0;
        const guestDinner = mediaMonthData.guest_count_dinner || 0;
        const guestTotal = mediaMonthData.guest_count_total || 0;

        if (guestLunch > 0 || guestDinner > 0) {
            return (guestLunch * avgPriceLunch) + (guestDinner * avgPriceDinner);
        }
        return guestTotal * avgPriceDinner;
    },

    getProfitClass(profit) {
        return profit >= 0 ? 'profit-positive' : 'profit-negative';
    },

    calcCostPerGuest(totalCost, guestCount) {
        if (!guestCount || guestCount === 0) return null;
        return Math.floor(totalCost / guestCount);
    },

    // 固定表示する主要媒体リスト（主要以外は「その他」に統合）
    FIXED_CHANNELS: [
        '電話',
        'トレタ予約番',
        '食べログ',
        'ホットペッパー',
        'ぐるなび',
        'Retty',
        'Googleで予約'
    ],

    getTopChannels(shop, months) {
        const channelTotals = {};
        const allChannels = new Set();

        // 期間内の全月のトレタデータから経路別の予約数を集計
        months.forEach(ym => {
            const monthlyToreta = (shop.toreta_data || []).filter(d => d.year_month === ym);
            if (!monthlyToreta) return;

            monthlyToreta.forEach(d => {
                const channel = d.media;
                // 「合計」と「ウォークイン」は除外
                if (channel === '合計' || channel === 'ウォークイン') return;

                allChannels.add(channel);
                const count = d.reservation_count || 0;

                if (!channelTotals[channel]) {
                    channelTotals[channel] = 0;
                }
                channelTotals[channel] += count;
            });
        });

        const fixed = this.FIXED_CHANNELS;
        const others = Array.from(allChannels).filter(ch => !this.FIXED_CHANNELS.includes(ch));

        return { fixed, others };
    },

    /**
     * 前年データの有無をチェック
     */
    checkYoyDataAvailability(data, periodStart, periodEnd) {
        const months = Utils.getMonthsInRange(periodStart, periodEnd);
        const yoyMonths = months.map(m => m - 100);

        for (const shop of data.shops) {
            const availableMonths = (shop.monthly_data || []).map(d => d.year_month);
            const hasAnyYoyData = yoyMonths.some(ym => availableMonths.includes(ym));
            if (hasAnyYoyData) {
                return true;
            }
        }
        return false;
    },

    /**
     * 指定期間内のプラン変更一覧を検出（サマリー用）
     */
    detectPlanChanges(data, months) {
        const changes = [];
        const focusMonth = months[months.length - 1];

        // 過去6ヶ月のチェック開始点を計算
        let checkStart = focusMonth;
        for (let i = 0; i < 6; i++) {
            const year = Math.floor(checkStart / 100);
            const month = checkStart % 100;
            if (month === 1) {
                checkStart = (year - 1) * 100 + 12;
            } else {
                checkStart = year * 100 + (month - 1);
            }
        }

        const mediaNames = {
            'tabelog': '食べログ',
            'hotpepper': 'ホットペッパー',
            'gurunavi': 'ぐるなび',
            'line': 'LINE',
            'conetto': 'コネット'
        };

        data.shops.forEach(shop => {
            Object.keys(shop.media_data).forEach(mediaKey => {
                const mediaRows = shop.media_data[mediaKey] || [];
                const sortedRows = [...mediaRows].sort((a, b) => a.year_month - b.year_month);

                for (let i = 1; i < sortedRows.length; i++) {
                    const prevRow = sortedRows[i - 1];
                    const currRow = sortedRows[i];

                    if (currRow.year_month < checkStart || currRow.year_month > focusMonth) continue;

                    const prevPlan = prevRow.plan_name;
                    const currPlan = currRow.plan_name;

                    if (prevPlan && currPlan && prevPlan !== currPlan) {
                        changes.push({
                            shop_name: shop.shop_name,
                            shop_code: shop.shop_code,
                            media_key: mediaKey,
                            media_name: mediaNames[mediaKey] || mediaKey,
                            change_month: currRow.year_month,
                            old_plan: prevPlan,
                            new_plan: currPlan
                        });
                    }
                }
            });
        });

        return changes;
    }
};
