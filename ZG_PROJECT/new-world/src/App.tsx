import { useState, useEffect } from 'react'
import { parseToon, type ToonData, type Shop } from './utils/toonParser'

// toon.txt のパス
const TOON_URL = '/toon.txt'

function App() {
  const [data, setData] = useState<ToonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedShopCode, setSelectedShopCode] = useState<string | null>(null)

  useEffect(() => {
    fetch(TOON_URL)
      .then(res => res.text())
      .then(text => {
        const parsed = parseToon(text)
        setData(parsed)
        setLoading(false)
        // 初期選択（最初の店舗）
        if (parsed.shops.length > 0) {
          setSelectedShopCode(parsed.shops[0].shop_code)
        }
      })
      .catch(err => {
        console.error('Failed to load toon.txt', err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-10 text-center">Loading Skeleton...</div>
  if (!data) return <div className="p-10 text-center text-red-500">Data Error</div>

  const selectedShop = data.shops.find(s => s.shop_code === selectedShopCode)

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200 font-bold text-lg bg-gray-800 text-white">
          TOON DASHBOARD
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <button
            onClick={() => setSelectedShopCode(null)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${!selectedShopCode ? 'bg-indigo-600 text-white' : 'hover:bg-gray-100'}`}
          >
            📊 全店舗サマリー
          </button>
          <div className="mt-4 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">店舗リスト</div>
          {[...data.shops]
            .sort((a, b) => a.shop_code.localeCompare(b.shop_code, undefined, { numeric: true }))
            .map(shop => (
              <button
                key={shop.shop_code}
                onClick={() => setSelectedShopCode(shop.shop_code)}
                className={`w-full text-left px-3 py-2 rounded text-xs truncate ${selectedShopCode === shop.shop_code ? 'bg-indigo-100 text-indigo-700 font-medium' : 'hover:bg-gray-50'}`}
              >
                {shop.shop_name} ({shop.shop_code})
              </button>
            ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
        {!selectedShop ? (
          <div>
            <h1 className="text-3xl font-bold mb-6">全店舗サマリー</h1>
            <p className="text-gray-600 mb-8">Exported: {data.export_info.exported_at_jst} (Total Shops: {data.export_info.shop_count})</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.shops.map(shop => (
                <div key={shop.shop_code} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="font-bold border-b pb-2 mb-2">{shop.shop_name}</h3>
                  <div className="text-sm text-gray-500">Code: {shop.shop_code}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <header className="flex justify-between items-end border-b pb-4">
              <div>
                <div className="text-indigo-600 font-bold text-sm uppercase mb-1">Store details</div>
                <h1 className="text-3xl font-bold">{selectedShop.shop_name}</h1>
                <div className="text-gray-500">Store Code: {selectedShop.shop_code}</div>
              </div>
              <div className="flex gap-4 text-right">
                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                  <div className="text-xs text-gray-400 uppercase font-bold">Lunch Avg.</div>
                  <div className="text-xl font-bold">¥{selectedShop.avg_price_lunch?.toLocaleString()}</div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm border border-gray-200">
                  <div className="text-xs text-gray-400 uppercase font-bold">Dinner Avg.</div>
                  <div className="text-xl font-bold">¥{selectedShop.avg_price_dinner?.toLocaleString()}</div>
                </div>
              </div>
            </header>

            {/* Sales Chart Skeleton */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4">月次売上推移</h2>
              <div className="flex items-end gap-1 h-48 bg-gray-50 p-4 rounded border border-dashed border-gray-300">
                {selectedShop.monthly_data.map((m, idx) => (
                  <div key={idx} className="flex-1 group relative">
                    <div
                      className="bg-indigo-400 group-hover:bg-indigo-600 transition-colors rounded-t-sm"
                      style={{ height: m.sales_amount ? `${(m.sales_amount / 25000000 * 100)}%` : '2px' }}
                    ></div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-[10px] p-1 rounded whitespace-nowrap z-10">
                      {m.year_month}: ¥{m.sales_amount?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-gray-400 px-2">
                <span>{selectedShop.monthly_data[0]?.year_month}</span>
                <span>{selectedShop.monthly_data[selectedShop.monthly_data.length - 1]?.year_month}</span>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Media Reservations */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 font-mono">media_data.uber_data</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                      <tr>
                        <th className="px-2 py-2">YM</th>
                        <th className="px-2 py-2 text-right">Sales</th>
                        <th className="px-2 py-2 text-right">Orders</th>
                        <th className="px-2 py-2 text-right">Final</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedShop.media_data?.uber_data?.slice(-6).map((u: any, i: number) => (
                        <tr key={i}>
                          <td className="px-2 py-2 font-medium">{u.year_month}</td>
                          <td className="px-2 py-2 text-right">¥{u.sales_amount?.toLocaleString() || '0'}</td>
                          <td className="px-2 py-2 text-right">{u.order_count || 0}</td>
                          <td className="px-2 py-2 text-right font-bold text-indigo-600">¥{u.final_amount?.toLocaleString() || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Ad Cost Summary */}
              <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold mb-4 font-mono">ad_cost_data</h2>
                <div className="space-y-3">
                  {selectedShop.ad_cost_data?.slice(-5).map((ad: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                      <div>
                        <div className="font-bold text-sm tracking-tight">{ad.media} / {ad.plan_name}</div>
                        <div className="text-[10px] text-gray-400 uppercase font-mono">{ad.year_month}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-700">¥{ad.base_cost?.toLocaleString()}</div>
                        <div className="text-[9px] text-gray-400">BASE COST</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
