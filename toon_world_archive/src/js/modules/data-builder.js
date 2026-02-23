// ============================================
// Data Builder Module
// ============================================

export const DataBuilder = {
    /**
     * Parse済みデータからレポート表示用データを構築する
     * (元の scripts.html の buildReportDataForAi 相当)
     */
    build(parsedData, periodStart, periodEnd, selectedShops) {
        const months = Utils.getMonthsInRange(periodStart, periodEnd);

        // Filter Shop Logic
        let shops = parsedData.shops;
        if (selectedShops && selectedShops.length > 0) {
            shops = shops.filter(shop => selectedShops.includes(shop.shop_code));
        }

        // 前年比データの有無を判定
        const hasYoyData = Calculations.checkYoyDataAvailability(parsedData, periodStart, periodEnd);

        // 全体集計の計算（前年比込み）
        const grandTotals = this.calcGrandTotals(shops, months, hasYoyData);

        // プラン変更一覧（サマリー用）
        const planChanges = Calculations.detectPlanChanges(parsedData, months);

        // レポート用データ構造の構築
        const reportData = {
            period: {
                start: periodStart,
                end: periodEnd
            },
            hasYoyData: hasYoyData,
            planChanges: planChanges,
            shops: [],
            grandTotals: grandTotals
        };

        shops.forEach(shop => {
            // 配列データを検索しやすいように Map に変換
            const monthlyMap = new Map((shop.monthly_data || []).map(d => [d.year_month, d]));
            const toretaMap = new Map((shop.toreta_data || []).map(d => [`${d.year_month}|${d.media}`, d]));
            const adCostMap = new Map((shop.ad_cost_data || []).map(d => [`${d.year_month}|${d.media}`, d]));
            const uberMap = new Map((shop.uber_data || []).map(d => {
                if (d.hourly_orders && typeof d.hourly_orders === 'string') {
                    try { d.hourly_orders = JSON.parse(d.hourly_orders); } catch (e) { d.hourly_orders = {}; }
                }
                return [d.year_month, d];
            }));

            const shopData = {
                shop_code: shop.shop_code,
                shop_name: shop.shop_name,
                avg_price_lunch: shop.avg_price_lunch,
                avg_price_dinner: shop.avg_price_dinner,
                total_sales: 0,
                total_reservation_count: 0,
                total_guest_count: 0,
                total_uber_sales: 0, // 🆕 追加
                monthly_summary: [],
                channel_data: [],
                media_analysis: [],
                ad_cost_table: null,
                raw_ad_cost_data: shop.ad_cost_data,
                raw_monthly_data: shop.monthly_data,
                raw_toreta_data: shop.toreta_data,
                raw_uber_data: shop.uber_data // 🆕 追加
            };

            // 月別サマリー（前年比込み）
            months.forEach(ym => {
                const sales = monthlyMap.get(ym)?.sales_amount || 0;
                const monthlyToreta = (shop.toreta_data || []).filter(d => d.year_month === ym);
                const reservation = Calculations.calcReservationExcludingWalkinArray(monthlyToreta);
                const uber = uberMap.get(ym) || {};

                shopData.total_sales += sales;
                shopData.total_reservation_count += reservation.reservation_count;
                shopData.total_guest_count += reservation.guest_count;
                shopData.total_uber_sales += (uber.sales_amount || 0);

                // 前年比計算
                let salesYoy = null;
                let reservationYoy = null;
                let guestYoy = null;
                if (hasYoyData) {
                    const yoyMonth = ym - 100;
                    const yoySales = monthlyMap.get(yoyMonth)?.sales_amount || 0;
                    const yoyToreta = (shop.toreta_data || []).filter(d => d.year_month === yoyMonth);
                    const yoyRes = Calculations.calcReservationExcludingWalkinArray(yoyToreta);

                    salesYoy = Calculations.calcYoY(sales, yoySales);
                    reservationYoy = Calculations.calcYoY(reservation.reservation_count, yoyRes.reservation_count);
                    guestYoy = Calculations.calcYoY(reservation.guest_count, yoyRes.guest_count);
                }

                shopData.monthly_summary.push({
                    year_month: ym,
                    month_display: Utils.formatMonthShort(ym),
                    sales: Utils.formatCurrency(sales),
                    sales_raw: sales,
                    reservation_count: reservation.reservation_count,
                    guest_count: reservation.guest_count,
                    uber_sales: uber.sales_amount || 0, // 🆕 追加
                    sales_yoy: salesYoy,
                    reservation_yoy: reservationYoy,
                    guest_yoy: guestYoy
                });
            });

            // 経路データ (Calculations.getTopChannels 使用)
            const { fixed, others } = Calculations.getTopChannels(shop, months);
            const allChannels = [...fixed];
            if (others.length > 0) allChannels.push('その他');

            allChannels.forEach(channel => {
                const isOthers = channel === 'その他';
                let channelTotal = 0;
                const monthlyData = [];

                months.forEach(ym => {
                    const monthlyToreta = (shop.toreta_data || []).filter(d => d.year_month === ym);
                    const totalReservation = Calculations.calcReservationExcludingWalkinArray(monthlyToreta);

                    let count = 0;
                    if (isOthers) {
                        others.forEach(ch => {
                            const d = monthlyToreta.find(t => t.media === ch);
                            count += d ? d.reservation_count : 0;
                        });
                    } else {
                        const d = monthlyToreta.find(t => t.media === channel);
                        count = d ? d.reservation_count : 0;
                    }
                    channelTotal += count;

                    const ratio = totalReservation.reservation_count > 0
                        ? (count / totalReservation.reservation_count * 100)
                        : 0;

                    monthlyData.push({
                        ym: ym,
                        count: count,
                        ratio: ratio
                    });
                });

                const ratio = shopData.total_reservation_count > 0
                    ? (channelTotal / shopData.total_reservation_count * 100).toFixed(1) + '%'
                    : '0.0%';

                shopData.channel_data.push({
                    channel_name: channel,
                    total_count: channelTotal,
                    total_ratio: ratio,
                    monthly_data: monthlyData,
                    breakdown: isOthers ? others.sort() : []
                });
            });

            // 経路テーブルの「合計（ウォークイン除く）」行用データ
            shopData.channel_totals_by_month = months.map(ym => {
                const monthlyToreta = (shop.toreta_data || []).filter(d => d.year_month === ym);
                const totalRes = Calculations.calcReservationExcludingWalkinArray(monthlyToreta);
                return {
                    ym: ym,
                    count: totalRes.reservation_count
                };
            });

            // 媒体別分析
            const mediaKeys = Object.keys(shop.media_data).sort((a, b) => {
                const order = ['tabelog', 'hotpepper', 'gurunavi', 'line'];
                const idxA = order.indexOf(a);
                const idxB = order.indexOf(b);
                if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                if (idxA !== -1) return -1;
                if (idxB !== -1) return 1;
                return a.localeCompare(b);
            });

            mediaKeys.forEach(mediaKey => {
                const mediaRows = shop.media_data[mediaKey] || [];
                const mediaMap = new Map(mediaRows.map(r => [r.year_month, r]));
                const planChange = this.detectMediaPlanChangeArray(mediaRows, months);
                const mediaName = this.getMediaName(mediaKey);

                let totalPvTop = 0;
                let totalPvTotal = 0;
                let totalReservation = 0;
                let totalGuest = 0;
                let totalCost = 0;
                let totalRevenue = 0;
                let cvrSum = 0;
                let cvrCount = 0;
                let costPerGuestSum = 0;
                let costPerGuestCount = 0;

                let totalNoteReservation = 0;
                let totalNoteGuest = 0;

                const monthlyValues = months.map(ym => {
                    const m = mediaMap.get(ym) || {};
                    const toretaName = this.getMediaName(mediaKey);
                    const toretaData = toretaMap.get(`${ym}|${toretaName}`) || {};

                    const pv = Calculations.calcPV(m);
                    totalPvTop += pv.top;
                    totalPvTotal += pv.total;

                    const tRes = toretaData.reservation_count || 0;
                    const tGuest = toretaData.guest_count || 0;
                    totalReservation += tRes;
                    totalGuest += tGuest;

                    let netRes, netGuest;
                    if (mediaKey === 'tabelog') {
                        netRes = m.reservation_count_total || 0;
                        netGuest = m.guest_count_total || 0;
                    } else {
                        netRes = tRes;
                        netGuest = tGuest;
                    }

                    const noteRes = Math.max(0, tRes - netRes);
                    const noteGuest = Math.max(0, tGuest - netGuest);

                    totalNoteReservation += noteRes;
                    totalNoteGuest += noteGuest;

                    const cost = Calculations.calcTotalCost(m);
                    const revenue = tGuest * shop.avg_price_dinner;

                    totalCost += cost;
                    totalRevenue += revenue;

                    const cvr = Calculations.calcCVR(tRes, pv.top);
                    if (cvr !== null) {
                        cvrSum += cvr;
                        cvrCount++;
                    }

                    const cpg = Calculations.calcCostPerGuest(cost, tGuest);
                    if (cpg !== null) {
                        costPerGuestSum += cpg;
                        costPerGuestCount++;
                    }

                    return {
                        ym,
                        plan_name: m.plan_name || '-',
                        pv_top: pv.top,
                        pv_total: pv.total,
                        toreta_reservation: tRes,
                        toreta_guest: tGuest,
                        net_reservation: netRes,
                        net_guest: netGuest,
                        note_reservation: noteRes,
                        note_guest: noteGuest,
                        cost: cost,
                        revenue: revenue,
                        profit: revenue - cost,
                        cvr: cvr,
                        cost_per_guest: cpg
                    };
                });

                const avgCvr = cvrCount > 0 ? cvrSum / cvrCount : null;
                const avgCostPerGuest = costPerGuestCount > 0 ? Math.floor(costPerGuestSum / costPerGuestCount) : null;
                const totalProfit = totalRevenue - totalCost;

                shopData.media_analysis.push({
                    key: mediaKey,
                    name: mediaName,
                    has_plan_change: !!planChange,
                    plan_change_detail: planChange ? `${Utils.formatMonthShort(planChange.month)}: ${planChange.old} → ${planChange.new}` : null,
                    monthly_values: monthlyValues,
                    totals: {
                        pv_top: totalPvTop,
                        pv_total: totalPvTotal,
                        toreta_reservation: totalReservation,
                        toreta_guest: totalGuest,
                        net_reservation: totalReservation - totalNoteReservation,
                        net_guest: totalGuest - totalNoteGuest,
                        note_reservation: totalNoteReservation,
                        note_guest: totalNoteGuest,
                        cost: totalCost,
                        revenue: totalRevenue,
                        profit: totalProfit,
                        cvr: avgCvr,
                        cost_per_guest: avgCostPerGuest
                    }
                });
            });

            // 広告費データの構築
            shopData.ad_cost_table = this.buildAdCostTable(shop, months);

            reportData.shops.push(shopData);
        });

        return reportData;
    },

    /**
     * 広告費テーブルデータを構築
     */
    buildAdCostTable(shop, months) {
        if (!shop.ad_cost_data || shop.ad_cost_data.length === 0) {
            return null;
        }

        const mediaSet = new Set();
        shop.ad_cost_data.forEach(d => mediaSet.add(d.media));
        const mediaList = Array.from(mediaSet).sort();

        if (mediaList.length === 0) return null;

        const adCostMap = new Map(shop.ad_cost_data.map(d => [`${d.year_month}|${d.media}`, d]));
        const rows = [];
        const grandTotalByMonth = {};
        months.forEach(ym => grandTotalByMonth[ym] = 0);
        let grandTotal = 0;

        mediaList.forEach(media => {
            let mediaTotal = 0;
            let planName = '-';

            // 最新月のプラン名を取得
            for (let i = months.length - 1; i >= 0; i--) {
                const ym = months[i];
                const data = adCostMap.get(`${ym}|${media}`);
                if (data && data.plan_name) {
                    planName = data.plan_name;
                    break;
                }
            }

            const monthlyCosts = {};
            months.forEach(ym => {
                const data = adCostMap.get(`${ym}|${media}`);
                const cost = data ? (data.actual_cost || data.base_cost || 0) : 0;
                monthlyCosts[ym] = cost;

                mediaTotal += cost;
                grandTotalByMonth[ym] += cost;
            });
            grandTotal += mediaTotal;

            rows.push({
                media_name: media,
                plan_name: planName,
                costs: monthlyCosts,
                total_cost: mediaTotal
            });
        });

        return {
            rows: rows,
            monthly_totals: grandTotalByMonth,
            grand_total: grandTotal
        };
    },

    /**
     * 全体集計（前年比込み）
     */
    calcGrandTotals(shops, months, hasYoyData = false) {
        const totals = {
            monthly: {},
            grand: { sales: 0, reservation_count: 0, guest_count: 0 }
        };

        months.forEach(ym => {
            totals.monthly[ym] = { sales: 0, reservation_count: 0, guest_count: 0, uber_sales: 0 };

            shops.forEach(shop => {
                const monthlySales = shop.monthly_data.find(d => d.year_month === ym);
                const sales = monthlySales ? monthlySales.sales_amount : 0;
                totals.monthly[ym].sales += sales;
                totals.grand.sales += sales;

                const monthlyToreta = shop.toreta_data.filter(d => d.year_month === ym);
                const reservation = Calculations.calcReservationExcludingWalkinArray(monthlyToreta);
                totals.monthly[ym].reservation_count += reservation.reservation_count;
                totals.monthly[ym].guest_count += reservation.guest_count;
                totals.grand.reservation_count += reservation.reservation_count;
                totals.grand.guest_count += reservation.guest_count;

                // Uber売上の合算を追加
                const uberMonth = (shop.uber_data || []).find(d => d.year_month === ym);
                totals.monthly[ym].uber_sales += (uberMonth ? (uberMonth.sales_amount || 0) : 0);
            });

            // 前年比計算
            if (hasYoyData) {
                const yoyMonth = ym - 100;
                let yoySales = 0, yoyReservation = 0, yoyGuest = 0;

                shops.forEach(shop => {
                    const monthlySales = shop.monthly_data.find(d => d.year_month === yoyMonth);
                    yoySales += monthlySales ? monthlySales.sales_amount : 0;

                    const monthlyToreta = shop.toreta_data.filter(d => d.year_month === yoyMonth);
                    const yoyRes = Calculations.calcReservationExcludingWalkinArray(monthlyToreta);
                    yoyReservation += yoyRes.reservation_count;
                    yoyGuest += yoyRes.guest_count;
                });

                totals.monthly[ym].sales_yoy = Calculations.calcYoY(totals.monthly[ym].sales, yoySales);
                totals.monthly[ym].reservation_yoy = Calculations.calcYoY(totals.monthly[ym].reservation_count, yoyReservation);
                totals.monthly[ym].guest_yoy = Calculations.calcYoY(totals.monthly[ym].guest_count, yoyGuest);
            }
        });

        return totals;
    },

    getMediaName(key) {
        const map = {
            'tabelog': '食べログ',
            'hotpepper': 'ホットペッパー',
            'gurunavi': 'ぐるなび',
            'line': 'LINE',
            'conetto': 'コネット'
        };
        return map[key] || key;
    },

    detectMediaPlanChangeArray(mediaRows, months) {
        const filtered = mediaRows.filter(r => months.includes(r.year_month)).sort((a, b) => a.year_month - b.year_month);
        for (let i = 1; i < filtered.length; i++) {
            const prev = filtered[i - 1];
            const curr = filtered[i];
            if (prev.plan_name && curr.plan_name && prev.plan_name !== curr.plan_name) {
                return { month: curr.year_month, old: prev.plan_name, new: curr.plan_name };
            }
        }
        return null;
    }
};
