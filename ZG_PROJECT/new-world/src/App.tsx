import React, { useState, useEffect, useMemo } from 'react'
import { parseToon, type ToonData } from './utils/toonParser'
import { Calendar, ChevronRight, Store, BarChart3, TrendingUp, Search, Info, PieChart } from 'lucide-react'
import { buildToretaData } from './utils/toretaBuilder'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// toon.txt のパス
const TOON_URL = '/toon.txt'

/**
 * 🆕 税率定数
 */
const TAX_RATE = 1.1

/**
 * 🆕 タブの定義
 */
const TABS = [
  '売り上げ',
  'toreta',
  '食べログ',
  'ホットペッパー',
  'Retty',
  'グルナビ',
  'uber',
  'LINE'
] as const

type TabType = typeof TABS[number]

/**
 * YYYYMM形式の文字列リストを生成するよ！
 */
function getYearMonthList(start: string, end: string) {
  const months = []
  let current = parseInt(start)
  const endNum = parseInt(end)

  while (current <= endNum) {
    months.push(current.toString())

    let year = Math.floor(current / 100)
    let month = current % 100

    month++
    if (month > 12) {
      month = 1
      year++
    }
    current = year * 100 + month
  }
  return months
}

/**
 * YYYYMMから12ヶ月前を計算するよ！
 */
function getOneYearAgo(ym: string) {
  let year = Math.floor(parseInt(ym) / 100)
  let month = parseInt(ym) % 100
  year--
  // 12ヶ月前なので月はそのままだけど、データ開始月より前にならないように呼び出し側で制御するよ
  return (year * 100 + month).toString()
}

/**
 * YYYYMMを表示用にフォーマットするよ (例: 202501 -> 2025/01)
 */
function formatYM(ym: string | number) {
  if (!ym) return ''
  const str = String(ym)
  if (str.length < 6) return str
  return `${str.substring(0, 4)}/${str.substring(4)}`
}

/**
 * 🆕 endMonthから6ヶ月遡る起算月を計算するよ！
 */
function calcCheckStart(endYm: string): string {
  if (!endYm) return ''
  let ym = parseInt(endYm)
  for (let i = 0; i < 6; i++) {
    const year = Math.floor(ym / 100)
    const month = ym % 100
    if (month === 1) {
      ym = (year - 1) * 100 + 12
    } else {
      ym = year * 100 + (month - 1)
    }
  }
  return String(ym)
}

/**
 * 🆕 媒体キーを表示名に変換するよ！
 */
function getMediaDisplayName(key: string): string {
  const map: Record<string, string> = {
    tabelog: '食べログ',
    hotpepper: 'ホットペッパー',
    gurunavi: 'ぐるなび',
    line: 'LINE',
    conetto: 'コネット'
  }
  return map[key] || key
}

function App() {
  const [data, setData] = useState<ToonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedShopCode, setSelectedShopCode] = useState<string | null>(null)
  const [hoveredData, setHoveredData] = useState<any>(null)

  // 期間選択用の State
  const [startMonth, setStartMonth] = useState<string>('')
  const [endMonth, setEndMonth] = useState<string>('')

  // 🆕 タブ切り替え用の State
  const [activeTab, setActiveTab] = useState<TabType>('売り上げ')
  // 🆕 トレタ用表示指標切り替え (組数: 'count', 人数: 'guestCount') 💅
  const [toretaMetric, setToretaMetric] = useState<'count' | 'guestCount'>('guestCount')
  const [othersOpen, setOthersOpen] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(TOON_URL)
      .then(res => res.text())
      .then(text => {
        const parsed = parseToon(text)
        setData(parsed)

        // デフォルト期間の設定: 最新月(end) と その11ヶ月前（最新含めて1年前）
        const lastMonth = parsed.export_info.period.end
        const oneYearAgo = getOneYearAgo(lastMonth)

        // データ開始月より前にならないように調整
        const initialStart = oneYearAgo < parsed.export_info.period.start
          ? parsed.export_info.period.start
          : oneYearAgo

        setEndMonth(lastMonth)
        setStartMonth(initialStart)

        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load toon.txt', err)
        setLoading(false)
      })
  }, [])

  // 全期間の月リストを生成
  const allMonths = useMemo(() => {
    if (!data) return []
    return getYearMonthList(data.export_info.period.start, data.export_info.period.end)
  }, [data])

  // 選択された店舗オブジェクトを特定するよ
  const selectedShop = useMemo(() => {
    if (!data || !selectedShopCode) return null
    return data.shops.find(s => s.shop_code === selectedShopCode) || null
  }, [data, selectedShopCode])

  // 店舗コード昇順でソート（サイドバー用）
  const sortedShops = useMemo(() => {
    if (!data) return []
    return [...data.shops].sort((a, b) =>
      a.shop_code.localeCompare(b.shop_code, undefined, { numeric: true })
    )
  }, [data])

  // 🆕 プラン変更の検出
  const planChanges = useMemo(() => {
    if (!selectedShop || !selectedShop.media_data || !endMonth) return []

    const changes: any[] = []
    const checkStart = calcCheckStart(endMonth)

    Object.keys(selectedShop.media_data).forEach(mediaKey => {
      if (mediaKey === 'ad_cost_data') return // 🆕 広告費データはプラン変更の対象外にするよ
      const rows = selectedShop.media_data[mediaKey] || []

      // year_month 昇順ソート
      const sorted = [...rows]
        .filter(r => r.plan_name)
        .sort((a, b) => Number(a.year_month) - Number(b.year_month))

      for (let i = 1; i < sorted.length; i++) {
        const prev = sorted[i - 1]
        const curr = sorted[i]

        // 変更月が checkStart 〜 endMonth の範囲内か？
        if (Number(curr.year_month) < Number(checkStart)) continue
        if (Number(curr.year_month) > Number(endMonth)) continue

        // plan_name が異なる = プラン変更
        if (prev.plan_name !== curr.plan_name) {
          changes.push({
            media_key: mediaKey,
            media_name: getMediaDisplayName(mediaKey),
            change_month: curr.year_month,
            old_plan: prev.plan_name,
            old_cost: prev.base_cost,
            new_plan: curr.plan_name,
            new_cost: curr.base_cost
          })
        }
      }
    })

    // 変更月降順（新しい順）で並べる
    return changes.sort((a, b) => Number(b.change_month) - Number(a.change_month))
  }, [selectedShop, endMonth])

  const toretaTableData = useMemo(() => {
    if (!selectedShop || !selectedShop.toreta_data) return null
    const months = getYearMonthList(startMonth, endMonth)
    return buildToretaData(selectedShop.toreta_data, months)
  }, [selectedShop, startMonth, endMonth])

  // 🆕 構成比グラフ用のデータ加工
  const toretaGraphData = useMemo(() => {
    if (!toretaTableData) return []
    const months = getYearMonthList(startMonth, endMonth)

    return months.map((ym) => {
      const entry: any = { name: `${ym.substring(4)}月`, fullYm: ym }
      toretaTableData.channelRows.forEach(row => {
        const monthData = row.monthlyData.find(d => d.ym === ym)
        // 🆕 指標によって値を切り替えるよ！💅
        entry[row.channelName] = monthData ? monthData[toretaMetric] : 0
      })
      return entry
    })
  }, [toretaTableData, startMonth, endMonth, toretaMetric])

  if (loading) return <div className="p-10 font-mono text-xs text-gray-400 animate-pulse">Loading Skeleton...</div>
  if (!data) return <div className="p-10 font-mono text-xs text-red-500">Data Error</div>

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'white', fontFamily: 'monospace', fontSize: '11px', color: '#374151' }}>
      {/* 掟：Skeleton Sidebar */}
      <aside style={{ width: '260px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', overflow: 'hidden', backgroundColor: '#f9fafb' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', fontWeight: 'bold', letterSpacing: '-0.05em', color: '#111827', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 size={16} />
          <span>NEW-WORLD SKELETON</span>
        </div>

        {/* 🆕 期間選択セクション */}
        <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: '#6b7280', fontSize: '9px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            <Calendar size={12} />
            <span>Report Period</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'pointer', outline: 'none' }}
              >
                {allMonths.map(m => (
                  <option key={`start-${m}`} value={m} disabled={m > endMonth}>{formatYM(m)}</option>
                ))}
              </select>
              <ChevronRight size={12} color="#d1d5db" />
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid #e5e7eb', backgroundColor: '#f9fafb', cursor: 'pointer', outline: 'none' }}
              >
                {allMonths.map(m => (
                  <option key={`end-${m}`} value={m} disabled={m < startMonth}>{formatYM(m)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
          {/* 全店舗サマリー */}
          <button
            onClick={() => setSelectedShopCode(null)}
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 12px',
              marginBottom: '16px',
              borderRadius: '6px',
              border: '1px solid',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              ...(!selectedShopCode
                ? { backgroundColor: '#111827', color: 'white', borderColor: '#111827', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }
                : { backgroundColor: 'white', borderColor: '#e5e7eb', color: '#374151' })
            }}
          >
            <BarChart3 size={14} />
            <span style={{ fontWeight: !selectedShopCode ? 'bold' : 'normal' }}>全店舗サマリー</span>
          </button>

          {/* 店舗リスト（コード昇順） */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ padding: '8px 12px', fontSize: '9px', color: '#9ca3af', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Store size={10} />
              <span>Store List</span>
            </div>
            {sortedShops.map(shop => (
              <button
                key={shop.shop_code}
                onClick={() => setSelectedShopCode(shop.shop_code)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  border: '1px solid',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  fontSize: '10px',
                  transition: 'all 0.2s',
                  ...(selectedShopCode === shop.shop_code
                    ? { backgroundColor: '#eef2ff', borderColor: '#c7d2fe', color: '#4338ca', fontWeight: 'bold' }
                    : { backgroundColor: 'transparent', borderColor: 'transparent', color: '#4b5563' })
                }}
              >
                <span style={{ opacity: 0.5, marginRight: '4px' }}>[{shop.shop_code}]</span> {shop.shop_name}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', backgroundColor: '#ffffff', display: 'flex', flexDirection: 'column' }}>
        {/* 🆕 Fixed Header section */}
        <div style={{ padding: '24px 48px 0 48px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 40 }}>
          <header style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ backgroundColor: '#111827', color: 'white', padding: '8px', borderRadius: '8px' }}>
                  {selectedShop ? <Store size={20} /> : <BarChart3 size={20} />}
                </div>
                <div>
                  <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '2px' }}>
                    {selectedShop ? `Shop Code: ${selectedShop.shop_code}` : 'Global Summary'}
                  </div>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', color: '#111827', margin: 0, letterSpacing: '-0.02em' }}>
                    {selectedShop ? selectedShop.shop_name : '全店舗サマリー'}
                  </h1>
                </div>
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 'bold', color: '#4338ca', backgroundColor: '#eef2ff', padding: '6px 14px', borderRadius: '999px' }}>
                <Calendar size={13} />
                <span>{formatYM(startMonth)}</span>
                <span style={{ opacity: 0.5 }}>~</span>
                <span>{formatYM(endMonth)}</span>
              </div>
            </div>
          </header>

          {/* 🆕 Horizontal Tab Navigation */}
          {selectedShop && (
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '0px' }} className="no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 20px',
                    fontSize: '12px',
                    fontWeight: activeTab === tab ? 'bold' : '500',
                    color: activeTab === tab ? '#111827' : '#6b7280',
                    borderBottom: `3px solid ${activeTab === tab ? '#111827' : 'transparent'}`,
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderTop: 'none',
                    outline: 'none'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* コンテンツ本体 (タブによって切り替わるよ！) */}
        <div style={{ padding: '32px 48px' }}>
          {selectedShop ? (
            <div>
              {/* 🆕 Plan Changes Section (スクロールするようにここに移したよ！) */}
              {selectedShop && planChanges.length > 0 && (
                <div style={{ marginBottom: '32px', padding: '16px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: '#9a3412', fontWeight: 'bold', fontSize: '10px', textTransform: 'uppercase' }}>
                    <Info size={14} />
                    <span>直近のプラン変更（過去6ヶ月）</span>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #fed7aa', textAlign: 'left' }}>
                          <th style={{ padding: '4px 8px', color: '#ea580c' }}>媒体</th>
                          <th style={{ padding: '4px 8px', color: '#ea580c' }}>変更月</th>
                          <th style={{ padding: '4px 8px', color: '#ea580c' }}>旧プラン</th>
                          <th style={{ padding: '4px 8px' }}> </th>
                          <th style={{ padding: '4px 8px', color: '#ea580c' }}>新プラン</th>
                        </tr>
                      </thead>
                      <tbody>
                        {planChanges.map((change, idx) => (
                          <tr key={`${change.media_key}-${change.change_month}-${idx}`} style={{ borderBottom: idx === planChanges.length - 1 ? 'none' : '1px solid #ffecd2' }}>
                            <td style={{ padding: '8px', fontWeight: 'bold' }}>{change.media_name}</td>
                            <td style={{ padding: '8px' }}>{formatYM(change.change_month)}</td>
                            <td style={{ padding: '8px', color: '#9ca3af' }}>
                              {change.old_plan}
                              <span style={{ fontSize: '9px', marginLeft: '6px', color: '#9ca3af' }}>
                                ({change.old_cost !== undefined ? `¥${Number(change.old_cost).toLocaleString()}` : '-'})
                              </span>
                            </td>
                            <td style={{ padding: '8px', color: '#f97316' }}><ChevronRight size={12} /></td>
                            <td style={{ padding: '8px', fontWeight: 'bold', color: '#c2410c' }}>
                              {change.new_plan}
                              <span style={{ fontSize: '10px', marginLeft: '6px', color: '#9a3412', fontWeight: 'normal' }}>
                                ({change.new_cost !== undefined ? `¥${Number(change.new_cost).toLocaleString()}` : '-'})
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === '売り上げ' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                    <TrendingUp size={18} />
                    <span>売上・予約推移</span>
                  </h3>

                  <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '11px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>月</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#374151' }}>売上 (税込)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#6b7280', fontSize: '10px' }}>前年比</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#374151' }}>予約組数</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#6b7280', fontSize: '10px' }}>前年比</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#374151' }}>予約人数</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#6b7280', fontSize: '10px' }}>前年比</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const periodMonths = getYearMonthList(startMonth, endMonth);
                          let totalSales = 0;
                          let totalRes = 0;
                          let totalGuest = 0;

                          return (
                            <>
                              {periodMonths.map(ym => {
                                // 当月データ
                                const monthly = selectedShop.monthly_data?.find(m => String(m.year_month) === ym);
                                const toretaTotal = selectedShop.toreta_data?.find(t => String(t.year_month) === ym && t.media === '合計');
                                const toretaWalkin = selectedShop.toreta_data?.find(t => String(t.year_month) === ym && t.media === 'ウォークイン');

                                const salesExTax = monthly?.sales_amount || 0;
                                const sales = Math.round(salesExTax * TAX_RATE);
                                const resCount = (toretaTotal?.reservation_count || 0) - (toretaWalkin?.reservation_count || 0);
                                const guestCount = (toretaTotal?.guest_count || 0) - (toretaWalkin?.guest_count || 0);

                                totalSales += sales;
                                totalRes += resCount;
                                totalGuest += guestCount;

                                // 🆕 前年同月データの取得
                                const prevYearYm = String(parseInt(ym) - 100);
                                const prevMonthly = selectedShop.monthly_data?.find(m => String(m.year_month) === prevYearYm);
                                const prevToretaTotal = selectedShop.toreta_data?.find(t => String(t.year_month) === prevYearYm && t.media === '合計');
                                const prevToretaWalkin = selectedShop.toreta_data?.find(t => String(t.year_month) === prevYearYm && t.media === 'ウォークイン');

                                const prevSalesExTax = prevMonthly?.sales_amount || 0;
                                const prevSales = Math.round(prevSalesExTax * TAX_RATE);
                                const prevResCount = (prevToretaTotal?.reservation_count || 0) - (prevToretaWalkin?.reservation_count || 0);
                                const prevGuestCount = (prevToretaTotal?.guest_count || 0) - (prevToretaWalkin?.guest_count || 0);

                                // 🆕 前年比の計算
                                const salesVal = prevSales > 0 ? (sales / prevSales) * 100 : null;
                                const resVal = prevResCount > 0 ? (resCount / prevResCount) * 100 : null;
                                const guestVal = prevGuestCount > 0 ? (guestCount / prevGuestCount) * 100 : null;

                                const getYoYColor = (val: number | null) => {
                                  if (val === null) return '#6b7280';
                                  return val >= 100 ? '#10b981' : '#ef4444';
                                };

                                return (
                                  <tr key={ym} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>{formatYM(ym)}</td>
                                    <td style={{ padding: '10px 16px' }}>{sales ? `¥${sales.toLocaleString()}` : '-'}</td>
                                    <td style={{ padding: '10px 16px', color: getYoYColor(salesVal), fontSize: '10px', fontWeight: 'bold' }}>
                                      {salesVal !== null ? `${salesVal.toFixed(1)}%` : '-'}
                                    </td>
                                    <td style={{ padding: '10px 16px' }}>{resCount ? `${resCount.toLocaleString()}組` : '-'}</td>
                                    <td style={{ padding: '10px 16px', color: getYoYColor(resVal), fontSize: '10px', fontWeight: 'bold' }}>
                                      {resVal !== null ? `${resVal.toFixed(1)}%` : '-'}
                                    </td>
                                    <td style={{ padding: '10px 16px' }}>{guestCount ? `${guestCount.toLocaleString()}人` : '-'}</td>
                                    <td style={{ padding: '10px 16px', color: getYoYColor(guestVal), fontSize: '10px', fontWeight: 'bold' }}>
                                      {guestVal !== null ? `${guestVal.toFixed(1)}%` : '-'}
                                    </td>
                                  </tr>
                                );
                              })}
                              {/* 合計行 */}
                              <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold', borderTop: '2px solid #e5e7eb' }}>
                                <td style={{ padding: '12px 16px', textAlign: 'left', color: '#111827' }}>合計</td>
                                <td style={{ padding: '12px 16px', color: '#111827' }}>¥{totalSales.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '10px' }}>-</td>
                                <td style={{ padding: '12px 16px', color: '#111827' }}>{totalRes.toLocaleString()}組</td>
                                <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '10px' }}>-</td>
                                <td style={{ padding: '12px 16px', color: '#111827' }}>{totalGuest.toLocaleString()}人</td>
                                <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '10px' }}>-</td>
                              </tr>
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'toreta' && toretaTableData && (
                <div className="space-y-3 animate-in fade-in duration-500">
                  {/* コンパクトなヘッダー */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                        <PieChart size={16} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 tracking-tight">予約経路分析</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mt-0.5">Reservation Channel Analysis</p>
                      </div>
                    </div>

                    {/* 🆕 表示指標切り替えトグル (セグメントコントロール風) 💅 */}
                    <div className="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                      <button
                        onClick={() => setToretaMetric('count')}
                        className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${toretaMetric === 'count' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        組数 (Groups)
                      </button>
                      <button
                        onClick={() => setToretaMetric('guestCount')}
                        className={`px-3 py-1 text-[10px] font-black rounded-md transition-all ${toretaMetric === 'guestCount' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        人数 (Guests)
                      </button>
                    </div>

                    <div className="flex items-center gap-2 px-2.5 py-1 bg-gray-50 rounded-full border border-gray-100">
                      <div className="w-1 h-1 rounded-full bg-indigo-400"></div>
                      <span className="text-[9px] text-gray-500 font-bold">※ % = ネット予約合計に対する構成比</span>
                    </div>
                  </div>

                  {/* 超コンパクト・プレミアムテーブル (内部スクロール版) */}
                  <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-auto relative max-h-[65vh]" style={{ scrollbarGutter: 'stable' }}>
                    <div className="pr-12 pb-6"> {/* スクロールバーと被らないための大胆な余白エリア 💅 */}
                      <table className="w-full text-[11px] text-right whitespace-nowrap border-separate border-spacing-0">
                        <thead>
                          <tr className="bg-gray-100 border-b-2 border-gray-300">
                            {/* 月ヘッダー (Top-Left): Sticky at top-0 and left-0. Z-index 35. */}
                            <th className="sticky top-0 left-0 bg-gray-100 px-3 py-2 text-left z-35 w-[160px] border-r-2 border-b-2 border-gray-300 shadow-[2px_2px_5px_-2px_rgba(0,0,0,0.1)]">
                              <span className="text-[10px] uppercase tracking-wider font-black text-gray-500 font-mono">Channel</span>
                            </th>
                            {toretaTableData.monthTotals.map(mt => (
                              /* 月ヘッダー (Months): Sticky at top-0. Z-index 30. */
                              <th key={mt.ym} className="sticky top-0 bg-gray-100 px-2 py-2 font-black text-gray-700 border-r border-b-2 border-gray-300 z-30">{formatYM(mt.ym)}</th>
                            ))}
                            {/* 月ヘッダー (Total): Sticky at top-0. Z-index 30. */}
                            <th className="sticky top-0 px-3 py-2 bg-indigo-100/80 text-indigo-950 font-black text-center min-w-[80px] z-30 border-b-2 border-indigo-300 shadow-sm">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-300">
                          {toretaTableData.channelRows.map(row => (
                            <React.Fragment key={row.channelName}>
                              <tr className={`group transition-colors hover:bg-indigo-50/30 ${row.isOthers ? 'cursor-pointer' : ''}`}
                                onClick={() => row.isOthers && setOthersOpen(prev => ({ ...prev, [selectedShop.shop_code]: !prev[selectedShop.shop_code] }))}>
                                <td className="sticky left-0 bg-white group-hover:bg-indigo-50 px-3 py-1.5 text-left font-black border-r-2 border-b border-gray-300 z-10 transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: row.color }}></div>
                                    <span className="text-gray-800 truncate">{row.channelName}</span>
                                    {row.isOthers && <ChevronRight size={12} className={`text-gray-500 transition-transform ${othersOpen[selectedShop.shop_code] ? 'rotate-90 text-indigo-600' : ''}`} />}
                                  </div>
                                </td>
                                {row.monthlyData.map((d, i) => {
                                  const netTotal = toretaTableData.monthTotals[i][toretaMetric];
                                  const val = d[toretaMetric];
                                  const ratio = netTotal > 0 ? (val / netTotal * 100) : 0;
                                  return (
                                    <td key={d.ym} className="px-2 py-1.5 border-r border-b border-gray-200">
                                      {val > 0 ? (
                                        <div className="flex flex-col items-end leading-tight">
                                          <span className="text-gray-900 font-bold text-base">{val.toLocaleString()}</span>
                                          <span className="text-[9px] tabular-nums text-indigo-600 font-black">{ratio.toFixed(1)}%</span>
                                        </div>
                                      ) : (
                                        <span className="text-gray-300">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="px-3 py-1.5 bg-indigo-50/20 font-black border-b border-indigo-200">
                                  <div className="flex flex-col items-center leading-tight">
                                    <span className="text-indigo-700 font-black text-base">
                                      {(toretaMetric === 'count' ? row.totalCount : row.totalGuestCount).toLocaleString()}
                                    </span>
                                    <span className="text-[9px] text-indigo-500 uppercase tracking-tighter">
                                      {toretaMetric === 'count'
                                        ? row.totalRatio
                                        : (toretaTableData.grandTotalGuestCount > 0
                                          ? (row.totalGuestCount / toretaTableData.grandTotalGuestCount * 100).toFixed(1) + '%'
                                          : '0.0%')}
                                    </span>
                                  </div>
                                </td>
                              </tr>
                              {/* 内訳展開 */}
                              {row.isOthers && othersOpen[selectedShop.shop_code] && row.breakdown.map(channelName => {
                                const breakdownMonthlyData = toretaTableData.monthTotals.map((mt) => {
                                  const d = selectedShop.toreta_data?.find(t => String(t.year_month) === mt.ym && t.media === channelName);
                                  const count = d ? Number(d.reservation_count) : 0;
                                  const guestCount = d ? Number(d.guest_count) : 0;
                                  return { count, guestCount };
                                });
                                const breakdownTotalCount = breakdownMonthlyData.reduce((sum, d) => sum + d.count, 0);
                                const breakdownTotalGuestCount = breakdownMonthlyData.reduce((sum, d) => sum + d.guestCount, 0);

                                return (
                                  <tr key={`breakdown-${channelName}`} className="bg-gray-50/50">
                                    <td className="sticky left-0 bg-[#f8fafc] px-3 py-1 text-left border-r-2 border-b border-gray-200 z-10 pl-8 text-[10px] text-gray-600 font-medium italic shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                      {channelName}
                                    </td>
                                    {breakdownMonthlyData.map((d, i) => {
                                      const netTotal = toretaTableData.monthTotals[i][toretaMetric];
                                      const val = d[toretaMetric];
                                      const ratio = netTotal > 0 ? (val / netTotal * 100) : 0;
                                      return (
                                        <td key={i} className="px-2 py-1 border-r border-b border-gray-200 text-[10px] text-gray-500">
                                          {val > 0 ? `${val.toLocaleString()} (${ratio.toFixed(1)}%)` : '-'}
                                        </td>
                                      )
                                    })}
                                    <td className="px-3 py-1 bg-indigo-50/10 border-b border-indigo-100 text-[10px] text-center text-gray-500 italic">
                                      {(() => {
                                        const total = toretaMetric === 'count' ? breakdownTotalCount : breakdownTotalGuestCount;
                                        const grandTotal = toretaMetric === 'count' ? toretaTableData.grandTotalCount : toretaTableData.grandTotalGuestCount;
                                        const ratio = grandTotal > 0 ? (total / grandTotal * 100).toFixed(1) : '0.0';
                                        return `${total.toLocaleString()} (${ratio}%)`;
                                      })()}
                                    </td>
                                  </tr>
                                );
                              })}
                            </React.Fragment>
                          ))}

                          {/* 1. ネット予約合計: Sticky at bottom-[64px] (Walk-in + Grand Totalの上) */}
                          <tr className="sticky bottom-[64px] bg-blue-100 text-blue-950 border-t-2 border-b-2 border-blue-400 z-35 shadow-[0_-2px_10px_rgba(59,130,246,0.2)]">
                            <td className="sticky left-0 bg-blue-100 px-3 py-2 text-left border-r-2 border-b-2 border-blue-400 z-10 shadow-[2px_0_10px_-2px_rgba(0,0,0,0.2)]">
                              <span className="text-[11px] font-black uppercase tracking-widest text-blue-900 underline decoration-blue-400 decoration-2">Reserve Total</span>
                            </td>
                            {toretaTableData.monthTotals.map((mt, i) => {
                              const grossTotal = toretaTableData.monthlyGrossTotals[i];
                              const val = mt[toretaMetric];
                              const gVal = grossTotal[toretaMetric];
                              const ratio = gVal > 0 ? (val / gVal * 100).toFixed(1) : '0.0';
                              return (
                                <td key={mt.ym} className="px-2 py-2 border-r border-b-2 border-blue-300 font-black text-blue-950">
                                  <div className="flex flex-col items-end leading-none">
                                    <span className="text-[12px]">{val.toLocaleString()}{toretaMetric === 'count' ? '組' : '人'}</span>
                                    <span className="text-[8px] text-blue-700 mt-1 font-bold">{ratio}%</span>
                                  </div>
                                </td>
                              );
                            })}
                            <td className="px-3 py-2 bg-blue-200/50 text-center font-black text-blue-950 border-b-2 border-blue-400">
                              <div className="flex flex-col items-center leading-none">
                                <span className="text-[12px] font-black">
                                  {(toretaMetric === 'count' ? toretaTableData.grandTotalCount : toretaTableData.grandTotalGuestCount).toLocaleString()}{toretaMetric === 'count' ? '組' : '人'}
                                </span>
                                <span className="text-[8px] text-blue-700 mt-1 font-bold">
                                  {(() => {
                                    const total = toretaMetric === 'count' ? toretaTableData.grandTotalCount : toretaTableData.grandTotalGuestCount;
                                    const gross = toretaMetric === 'count' ? toretaTableData.grossTotalCount : toretaTableData.grossTotalGuestCount;
                                    return gross > 0 ? (total / gross * 100).toFixed(1) : '0.0';
                                  })()}%
                                </span>
                              </div>
                            </td>
                          </tr>

                          {/* 2. ウォークイン: Sticky at bottom-[32px] (Grand Totalの上) */}
                          <tr className="sticky bottom-[32px] bg-blue-50 text-blue-900 border-t border-b-2 border-blue-300 z-34 shadow-[0_-2px_4px_rgba(0,0,0,0.1)]">
                            <td className="sticky left-0 bg-blue-50 px-3 py-1.5 text-left font-black border-r-2 border-b-2 border-blue-300 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                              <span className="text-[11px] font-black text-blue-800 italic">Walk-in</span>
                            </td>
                            {toretaTableData.walkinRow.map((d, i) => {
                              const grossTotal = toretaTableData.monthlyGrossTotals[i];
                              const val = d[toretaMetric];
                              const gVal = grossTotal[toretaMetric];
                              const ratio = gVal > 0 ? (val / gVal * 100).toFixed(1) : '0.0';
                              return (
                                <td key={d.ym} className="px-2 py-1.5 border-r border-b-2 border-blue-200 tabular-nums leading-tight font-black text-blue-900">
                                  {val > 0 ? (
                                    <div className="flex flex-col items-end">
                                      <span className="text-[12px]">{val.toLocaleString()}{toretaMetric === 'count' ? '組' : '人'}</span>
                                      <span className="text-[9px] text-blue-600 font-black">{ratio}%</span>
                                    </div>
                                  ) : '-'}
                                </td>
                              );
                            })}
                            <td className="px-3 py-1.5 bg-blue-100/40 font-black text-center text-blue-900 text-[11px] border-b-2 border-blue-300">
                              {(() => {
                                const val = toretaMetric === 'count' ? toretaTableData.walkinGrandTotal.count : toretaTableData.walkinGrandTotal.guestCount;
                                const total = toretaMetric === 'count' ? (toretaTableData.grandTotalCount + toretaTableData.walkinGrandTotal.count) : (toretaTableData.grandTotalGuestCount + toretaTableData.walkinGrandTotal.guestCount);
                                const ratio = total > 0 ? (val / total * 100).toFixed(1) : '0.0';
                                return `${val.toLocaleString()}${toretaMetric === 'count' ? '組' : '人'} (${ratio}%)`;
                              })()}
                            </td>
                          </tr>

                          {/* 3. 全合計 (GRAND TOTAL): Sticky at bottom-0. Z-index 36 */}
                          <tr className="sticky bottom-0 bg-[#020617] text-white border-t-2 border-blue-500/50 z-36 shadow-[0_-8px_20px_rgba(0,0,0,0.6)]">
                            <td className="sticky left-0 bg-[#020617] px-3 py-3 text-left border-r-2 border-blue-500/30 z-10 shadow-[4px_0_15px_rgba(0,0,0,0.5)]">
                              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400 ring-1 ring-blue-500/50 px-2 py-0.5 rounded">GRAND TOTAL</span>
                            </td>
                            {toretaTableData.monthlyGrossTotals.map(gt => (
                              <td key={gt.ym} className="px-2 py-3 border-r border-blue-500/20">
                                <div className="flex flex-col items-end leading-none">
                                  <span className="text-[14px] font-black text-white">
                                    {gt[toretaMetric].toLocaleString()}{toretaMetric === 'count' ? '組' : '人'}
                                  </span>
                                  <span className="text-[8px] text-blue-400 font-bold mt-1 tracking-wider uppercase">
                                    {toretaMetric === 'count' ? 'Total Groups' : 'Total Guests'}
                                  </span>
                                </div>
                              </td>
                            ))}
                            <td className="px-3 py-3 bg-black text-center font-black border-l-2 border-blue-600">
                              <div className="flex flex-col items-center leading-none">
                                <span className="text-[15px] font-black text-blue-400 tracking-tighter shadow-blue-500/50 drop-shadow-sm">
                                  {(toretaMetric === 'count' ? toretaTableData.grossTotalCount : toretaTableData.grossTotalGuestCount).toLocaleString()}{toretaMetric === 'count' ? '組' : '人'}
                                </span>
                                <span className="text-[8px] text-blue-300 font-black uppercase tracking-widest mt-1">
                                  {toretaMetric === 'count' ? 'Gross Total' : 'Gross Guests'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 🆕 構成比グラフ (100%積み上げ棒グラフ) */}
                  <div className="mt-6 bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600">
                        <TrendingUp size={16} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900 tracking-tight">予約経路 構成比推移 (ネット予約のみ)</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Monthly Net Reservation Channel Composition</p>
                          <span className="text-[8px] bg-gray-100 text-gray-400 px-1 rounded font-mono">DEBUG: {toretaGraphData.length}mo</span>
                        </div>
                      </div>
                    </div>

                    {/* 外部詳細表示パネル: 横に広げて表示するように大胆チェンジ！💅✨ */}
                    <div className="bg-gray-50/20 rounded-2xl p-6 border border-gray-100 shadow-sm mb-8">
                      <div className="flex items-center gap-4 mb-6 pb-3 border-b border-gray-200/60">
                        <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Selected Month Details</span>
                        <span className="text-xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                          {hoveredData?.activeLabel || (toretaGraphData.length > 0 ? toretaGraphData[toretaGraphData.length - 1].name : '-')}
                        </span>

                        {/* 🆕 予約合計 (Reserve Total) を追加！💅 */}
                        {(() => {
                          const activeIndex = hoveredData?.activeTooltipIndex;
                          const activeEntry = (activeIndex !== undefined && toretaGraphData[activeIndex])
                            ? toretaGraphData[activeIndex]
                            : toretaGraphData[toretaGraphData.length - 1];

                          if (!activeEntry) return null;
                          const netTotalCount = toretaTableData.channelRows.reduce((sum, row) => sum + (activeEntry[row.channelName] || 0), 0);

                          return (
                            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 transition-all border border-indigo-500">
                              <span className="text-[10px] font-black text-indigo-100 uppercase tracking-tighter">Reserve Total</span>
                              <span className="text-xl font-black text-white tabular-nums">{netTotalCount.toLocaleString()}</span>
                              <span className="text-[10px] font-bold text-indigo-200 uppercase">{toretaMetric === 'count' ? '組' : '人'}</span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-6">
                        {(() => {
                          const activeIndex = hoveredData?.activeTooltipIndex;
                          const activeEntry = (activeIndex !== undefined && toretaGraphData[activeIndex])
                            ? toretaGraphData[activeIndex]
                            : toretaGraphData[toretaGraphData.length - 1];

                          if (!activeEntry) return null;

                          const netTotal = toretaTableData.channelRows.reduce((a, b) => a + (activeEntry[b.channelName] || 0), 0);

                          return toretaTableData.channelRows.map(row => {
                            const val = activeEntry[row.channelName] || 0;
                            const pct = netTotal > 0 ? (val / netTotal * 100).toFixed(1) : '0.0';
                            return (
                              <div key={row.channelName} className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: row.color }}></div>
                                  <span className="text-[13px] font-black text-gray-600 truncate">{row.channelName}</span>
                                </div>
                                <div className="flex items-baseline gap-2 font-mono">
                                  <span className="text-xl font-black text-gray-900">{val.toLocaleString()}</span>
                                  <span className="text-[10px] font-bold text-gray-400 uppercase">{toretaMetric === 'count' ? '組' : '人'}</span>
                                  <span className="ml-auto text-[12px] text-blue-600 font-black bg-blue-50/50 px-2 py-0.5 rounded border border-blue-100/50">{pct}%</span>
                                </div>
                              </div>
                            );
                          });
                        })()}
                      </div>
                    </div>

                    <div className="h-[320px] w-full" style={{ minHeight: '320px', minWidth: '300px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={toretaGraphData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          stackOffset="expand"
                          onMouseMove={(state) => {
                            if (state.isTooltipActive) {
                              setHoveredData(state);
                            }
                          }}
                          onMouseLeave={() => setHoveredData(null)}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }}
                            dy={10}
                          />
                          <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fill: '#64748b' }}
                            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                          />
                          {/* ツールチップは非表示にして、外部パネルに任せるよ！💅 */}
                          <Tooltip content={<></>} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
                          <Legend
                            verticalAlign="bottom"
                            height={36}
                            content={({ payload }) => (
                              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-6">
                                {payload?.map((entry: any, index: number) => (
                                  <div key={`item-${index}`} className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                    <span className="text-[10px] font-bold text-gray-500">{entry.value}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          />
                          {toretaTableData.channelRows.map((row) => (
                            <Bar
                              key={row.channelName}
                              dataKey={row.channelName}
                              stackId="toreta"
                              fill={row.color}
                              isAnimationActive={false}
                              activeBar={{ stroke: '#ffffff', strokeWidth: 2, fillOpacity: 0.9 }}
                              radius={[0, 0, 0, 0]}
                              barSize={40}
                            />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== '売り上げ' && activeTab !== 'toreta' && (
                <div style={{ minHeight: '400px', border: '1px dashed #e5e7eb', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', color: '#9ca3af', gap: '16px' }}>
                  <div style={{ fontSize: '48px' }}>
                    {['食べログ', 'ホットペッパー', 'Retty', 'グルナビ'].includes(activeTab) && <Search size={48} />}
                    {['uber', 'LINE'].includes(activeTab) && <Info size={48} />}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                      {`[${activeTab}] セクションを構築中...`}
                    </div>
                    <div style={{ fontSize: '11px' }}>
                      {activeTab} の詳細データをここに表示する予定だよ✨
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* 店舗未選択時の表示 */
            <div style={{ minHeight: '600px', border: '1px dashed #e5e7eb', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', color: '#9ca3af', gap: '16px' }}>
              <div style={{ fontSize: '48px' }}>
                <TrendingUp size={48} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151', marginBottom: '4px' }}>
                  店舗を選択してください
                </div>
                <div style={{ fontSize: '11px' }}>
                  サイドバーから店舗を選ぶと、詳細なレポートが表示されるよ✨
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App


