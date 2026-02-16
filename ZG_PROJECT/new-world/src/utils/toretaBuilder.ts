// === 型定義 ===

/** 1経路 × 1月のデータ */
export interface ChannelMonthData {
    ym: string           // "202504"
    count: number        // 予約組数
    guestCount: number   // 予約人数
    ratio: number        // 構成比（0〜100）
}

/** 1経路の全期間データ */
export interface ChannelRow {
    channelName: string           // "食べログ" etc.
    color: string                 // "#FF6B00" etc.
    monthlyData: ChannelMonthData[]
    totalCount: number            // 全期間の合計組数
    totalGuestCount: number       // 全期間の合計人数
    totalRatio: string            // "48.8%" のような表示用文字列
    isOthers: boolean             // 「その他」行かどうか
    breakdown: string[]           // isOthers=true のとき、内訳の経路名リスト
}

/** 1月の合計行データ（ウォークイン除外） */
export interface MonthTotal {
    ym: string
    count: number
    guestCount: number
}

/** 1月のウォークイン行データ */
export interface WalkinData {
    ym: string
    count: number
    guestCount: number
    ratio: number  // ウォークイン / 合計（全体）× 100
}

/** buildToretaData の戻り値 */
export interface ToretaTableData {
    channelRows: ChannelRow[]       // 経路行（固定7 + その他）
    monthTotals: MonthTotal[]       // 各月の合計行（ネットのみ）
    walkinRow: WalkinData[]         // 各月のウォークイン行
    grandTotalCount: number         // 全期間の合計組数（ネットのみ）
    grandTotalGuestCount: number    // 全期間の合計人数（ネットのみ）
    monthlyGrossTotals: MonthTotal[] // 各月の全合計（ネット + Walk-in）
    grossTotalCount: number         // 全期間の全合計組数（ネット + Walk-in）
    grossTotalGuestCount: number    // 全期間の全合計人数（ネット + Walk-in）
    walkinGrandTotal: {             // ウォークイン全期間合計
        count: number
        guestCount: number
        ratio: number
    }
}

// === 定数 ===

/** 固定表示する主要7経路 */
const FIXED_CHANNELS: string[] = [
    '電話',
    'トレタ予約番',
    '食べログ',
    'ホットペッパー',
    'ぐるなび',
    'Retty',
    'Googleで予約',
]

/** 経路ごとの色定義（旧プロジェクト準拠） */
export const CHANNEL_COLORS: Record<string, string> = {
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
    'PayPayグルメ:Yahoo': '#FF0033',
    'LINE': '#06C755',
    'Google検索': '#34A853',
    'その他': '#9E9E9E',
}

// === メイン関数 ===

/**
 * toretaタブ用のテーブルデータを構築する
 * 
 * @param toretaData - shop.toreta_data（パース済み配列）
 * @param months - 表示対象の月リスト（YYYYMM文字列の配列）
 * @returns ToretaTableData
 */
export function buildToretaData(
    toretaData: any[],
    months: string[]
): ToretaTableData {
    // 1. 各月の合計・ウォークインを集計
    const monthTotals: MonthTotal[] = []
    const monthlyGrossTotals: MonthTotal[] = []
    const walkinRow: WalkinData[] = []

    let grandTotalCount = 0
    let grandTotalGuestCount = 0
    let grossTotalCount = 0
    let grossTotalGuestCount = 0
    let walkinTotalCount = 0
    let walkinTotalGuestCount = 0

    months.forEach(ym => {
        const monthlyRecords = toretaData.filter(d => String(d.year_month) === ym)
        const totalRecord = monthlyRecords.find(d => d.media === '合計')
        const walkinRecord = monthlyRecords.find(d => d.media === 'ウォークイン')

        const totalRes = totalRecord ? Number(totalRecord.reservation_count) : 0
        const totalGuest = totalRecord ? Number(totalRecord.guest_count) : 0

        const walkinRes = walkinRecord ? Number(walkinRecord.reservation_count) : 0
        const walkinGuest = walkinRecord ? Number(walkinRecord.guest_count) : 0

        // ネット合計 = 合計 - ウォークイン
        const netCount = totalRes - walkinRes
        const netGuest = totalGuest - walkinGuest

        monthTotals.push({ ym, count: netCount, guestCount: netGuest })
        monthlyGrossTotals.push({ ym, count: totalRes, guestCount: totalGuest })

        const walkinRatio = totalRes > 0 ? (walkinRes / totalRes) * 100 : 0
        walkinRow.push({ ym, count: walkinRes, guestCount: walkinGuest, ratio: walkinRatio })

        grandTotalCount += netCount
        grandTotalGuestCount += netGuest
        grossTotalCount += totalRes
        grossTotalGuestCount += totalGuest
        walkinTotalCount += walkinRes
        walkinTotalGuestCount += walkinGuest
    })

    // 2. 全経路名を収集（合計、ウォークイン以外）
    const allChannels = new Set<string>()
    toretaData.forEach(d => {
        if (d.media !== '合計' && d.media !== 'ウォークイン') {
            allChannels.add(d.media)
        }
    })

    // 3. 固定経路以外を「その他」に分類
    const othersChannels = Array.from(allChannels).filter(c => !FIXED_CHANNELS.includes(c))
    const displayChannels = [...FIXED_CHANNELS]
    if (othersChannels.length > 0) {
        displayChannels.push('その他')
    }

    // 4. 各経路の行データを構築
    const channelRows: ChannelRow[] = displayChannels.map(channelName => {
        const isOthers = channelName === 'その他'
        const targetChannels = isOthers ? othersChannels : [channelName]

        let rowTotalCount = 0
        let rowTotalGuestCount = 0

        const monthlyData: ChannelMonthData[] = months.map((ym, i) => {
            const monthlyRecords = toretaData.filter(d => String(d.year_month) === ym)
            let count = 0
            let guestCount = 0

            targetChannels.forEach(tc => {
                const record = monthlyRecords.find(d => d.media === tc)
                if (record) {
                    count += Number(record.reservation_count)
                    guestCount += Number(record.guest_count)
                }
            })

            const netTotal = monthTotals[i].count
            const ratio = netTotal > 0 ? (count / netTotal) * 100 : 0

            return { ym, count, guestCount, ratio }
        })

        rowTotalCount = monthlyData.reduce((sum, d) => sum + d.count, 0)
        rowTotalGuestCount = monthlyData.reduce((sum, d) => sum + d.guestCount, 0)

        const totalRatioVal = grandTotalCount > 0 ? (rowTotalCount / grandTotalCount) * 100 : 0
        const totalRatio = `${totalRatioVal.toFixed(1)}%`

        return {
            channelName,
            color: CHANNEL_COLORS[channelName] || '#9E9E9E',
            monthlyData,
            totalCount: rowTotalCount,
            totalGuestCount: rowTotalGuestCount,
            totalRatio,
            isOthers,
            breakdown: isOthers ? othersChannels : []
        }
    })

    const walkinGrandTotalRatio = (grandTotalCount + walkinTotalCount) > 0
        ? (walkinTotalCount / (grandTotalCount + walkinTotalCount)) * 100
        : 0

    return {
        channelRows,
        monthTotals,
        walkinRow,
        grandTotalCount,
        grandTotalGuestCount,
        monthlyGrossTotals,
        grossTotalCount,
        grossTotalGuestCount,
        walkinGrandTotal: {
            count: walkinTotalCount,
            guestCount: walkinTotalGuestCount,
            ratio: walkinGrandTotalRatio
        }
    }
}
