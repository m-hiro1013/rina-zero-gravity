import { useState, useEffect, useMemo } from 'react'
import { parseToon, type ToonData } from './utils/toonParser'
import { Calendar, ChevronRight, Store, BarChart3, TrendingUp, Search, Info } from 'lucide-react'

// toon.txt のパス
const TOON_URL = '/toon.txt'

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

function App() {
  const [data, setData] = useState<ToonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedShopCode, setSelectedShopCode] = useState<string | null>(null)

  // 期間選択用の State
  const [startMonth, setStartMonth] = useState<string>('')
  const [endMonth, setEndMonth] = useState<string>('')

  // 🆕 タブ切り替え用の State
  const [activeTab, setActiveTab] = useState<TabType>('売り上げ')

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
                onChange={(e) => setMonthForEnd(e.target.value)}
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
        <div style={{ padding: '24px 48px 0 48px', borderBottom: '1px solid #f3f4f6', backgroundColor: '#ffffff', position: 'sticky', top: 0, zIndex: 10 }}>
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
              {activeTab === '売り上げ' && (
                <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#111827' }}>
                    <TrendingUp size={18} />
                    <span>売上・予約推移</span>
                  </h3>
                  
                  <div style={{ overflowX: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: 'white' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '12px' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                          <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 'bold', color: '#374151' }}>月</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#374151' }}>売上 (税込)</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#374151' }}>予約組数</th>
                          <th style={{ padding: '12px 16px', fontWeight: 'bold', color: '#374151' }}>予約人数</th>
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
                                const monthly = selectedShop.monthly_data?.find(m => String(m.year_month) === ym);
                                const toreta = selectedShop.toreta_data?.find(t => String(t.year_month) === ym && t.media === '合計');
                                
                                const sales = monthly?.sales_amount || 0;
                                const resCount = toreta?.reservation_count || 0;
                                const guestCount = toreta?.guest_count || 0;

                                totalSales += sales;
                                totalRes += resCount;
                                totalGuest += guestCount;

                                return (
                                  <tr key={ym} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                    <td style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 'bold', color: '#111827' }}>{formatYM(ym)}</td>
                                    <td style={{ padding: '10px 16px' }}>{sales ? `¥${sales.toLocaleString()}` : '-'}</td>
                                    <td style={{ padding: '10px 16px' }}>{resCount ? `${resCount.toLocaleString()}組` : '-'}</td>
                                    <td style={{ padding: '10px 16px' }}>{guestCount ? `${guestCount.toLocaleString()}人` : '-'}</td>
                                  </tr>
                                );
                              })}
                              {/* 合計行 */}
                              <tr style={{ backgroundColor: '#f9fafb', fontWeight: 'bold', borderTop: '2px solid #e5e7eb' }}>
                                <td style={{ padding: '12px 16px', textAlign: 'left', color: '#111827' }}>合計</td>
                                <td style={{ padding: '12px 16px', color: '#111827' }}>¥{totalSales.toLocaleString()}</td>
                                <td style={{ padding: '12px 16px', color: '#111827' }}>{totalRes.toLocaleString()}組</td>
                                <td style={{ padding: '12px 16px', color: '#111827' }}>{totalGuest.toLocaleString()}人</td>
                              </tr>
                            </>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab !== '売り上げ' && (
                <div style={{ minHeight: '400px', border: '1px dashed #e5e7eb', borderRadius: '12px', padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fcfcfc', color: '#9ca3af', gap: '16px' }}>
                  <div style={{ fontSize: '48px' }}>
                    {activeTab === 'toreta' && <Calendar size={48} />}
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

  // 終了月変更時のハンドラ（シンボル整合性のために分けたよ！）
  function setMonthForEnd(val: string) {
    setEndMonth(val)
  }
}

export default App


