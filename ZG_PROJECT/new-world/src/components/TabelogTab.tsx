
import React, { useMemo, useState } from 'react'
import { Search, Info, TrendingUp, BarChart3, ChevronRight } from 'lucide-react'
import { type ToonData } from '../utils/toonParser'
import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList
} from 'recharts'

// ----------------------------------------------------------------------
// Types & Helpers
// ----------------------------------------------------------------------

type ShopData = ToonData['shops'][number]

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

function formatYM(ym: string | number) {
    if (!ym) return ''
    const str = String(ym)
    if (str.length < 6) return str
    return `${str.substring(0, 4)}/${str.substring(4)}`
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export interface TabelogTabProps {
    selectedShop: ShopData
    startMonth: string
    endMonth: string
    checkedRows: Record<string, boolean>
    onToggleRow: (key: string) => void
}

export function TabelogTab({ selectedShop, startMonth, endMonth, checkedRows, onToggleRow }: TabelogTabProps) {
    const [hoveredData, setHoveredData] = useState<any>(null)

    // 1. 平均客単価 (ARCHITECTURE.yaml Line 87-89)
    const avgPrice = useMemo(() => {
        if (!selectedShop) return 0
        return Math.round((selectedShop.avg_price_lunch + selectedShop.avg_price_dinner) / 2)
    }, [selectedShop])

    // 2. 共通のデータ抽出ロジック (ARCHITECTURE.yaml 準拠)
    const getMonthStats = (ym: string) => {
        const tabelog = (selectedShop.media_data?.tabelog as any[])
            ?.find((r: any) => String(r.year_month) === ym) || {} as any

        const toretaTabelog = selectedShop.toreta_data
            ?.find((t: any) => String(t.year_month) === ym && t.media === '食べログ') || {} as any

        // PV計算 (Line 65-68)
        const pvTop = (tabelog.pv_sp_top || 0) + (tabelog.pv_pc_top || 0)
        const pvTotal = (tabelog.pv_sp_total || 0) + (tabelog.pv_pc_total || 0)

        // 予約の分解 (Line 69-75)
        const toretaRes = toretaTabelog.reservation_count || 0
        const toretaGuest = toretaTabelog.guest_count || 0
        const webRes = tabelog.reservation_count_total || 0
        const webGuest = tabelog.guest_count_total || 0
        const noteRes = Math.max(0, toretaRes - webRes)
        const noteGuest = Math.max(0, toretaGuest - webGuest)

        // CVR計算 (Line 77-81)
        const cvr = pvTop > 0 ? (webRes / pvTop) * 100 : 0

        const baseCost = tabelog.base_cost || 0
        const unitLunch = tabelog.unit_cost_lunch || 0
        const unitDinner = tabelog.unit_cost_dinner || 0
        const guestLunch = tabelog.guest_count_lunch || 0
        const guestDinner = tabelog.guest_count_dinner || 0
        const guestTotal = tabelog.guest_count_total || 0

        const cost = (guestLunch > 0 || guestDinner > 0)
            ? baseCost + (unitLunch * guestLunch) + (unitDinner * guestDinner)
            : baseCost + (unitDinner * guestTotal)

        const variableCost = cost - baseCost
        const revenueTotal = toretaGuest * avgPrice
        const profit = Math.round(revenueTotal * 0.7) - cost
        const costPerGuest = webGuest > 0 ? Math.floor(cost / webGuest) : null

        return {
            ym,
            planName: tabelog.plan_name || '-',
            baseCost,
            variableCost,
            pvTop,
            pvTotal,
            toretaRes,
            toretaGuest,
            webRes,
            webGuest,
            noteRes,
            noteGuest,
            cvr,
            cost,
            revenueTotal,
            profit,
            costPerGuest
        }
    }

    // 3. データ加工 (Table用)
    const tabelogTableData = useMemo(() => {
        if (!selectedShop) return []
        const periodMonths = getYearMonthList(startMonth, endMonth)
        return periodMonths.map(ym => getMonthStats(ym))
    }, [selectedShop, startMonth, endMonth, avgPrice])

    // 4. データ加工 (Chart用 - 全予約指標にYoY%を追加💅)
    const chartData = useMemo(() => {
        return tabelogTableData.map(d => {
            const prevYm = String(parseInt(d.ym) - 100)
            const prev = getMonthStats(prevYm)

            // YoY%計算 (ARCHITECTURE.yaml Line 40準拠)
            const yoyPvTop = prev.pvTop > 0 ? (d.pvTop / prev.pvTop * 100) : null
            const yoyToretaRes = prev.toretaRes > 0 ? (d.toretaRes / prev.toretaRes * 100) : null
            const yoyWebRes = prev.webRes > 0 ? (d.webRes / prev.webRes * 100) : null
            const yoyNoteRes = prev.noteRes > 0 ? (d.noteRes / prev.noteRes * 100) : null

            return {
                ...d,
                name: `${d.ym.substring(4)}月`,
                fullYm: d.ym,
                yoyPvTop,
                yoyToretaRes,
                yoyWebRes,
                yoyNoteRes,
                prevWebRes: prev.webRes,
                prevNoteRes: prev.noteRes,
                prevPvTop: prev.pvTop
            }
        })
    }, [tabelogTableData])

    // Helper to render rows
    const renderRow = (label: string, key: string, content: (d: any) => React.ReactNode, extraStyle: React.CSSProperties = {}) => {
        const isChecked = !!checkedRows[key]
        const highlightColor = '#fed7aa'
        const rowBackgroundColor = isChecked ? highlightColor : (extraStyle.backgroundColor || 'transparent')

        return (
            <tr style={{
                borderBottom: '1px solid #f3f4f6',
                backgroundColor: rowBackgroundColor,
                transition: 'background-color 0.2s',
                ...extraStyle
            }}>
                <td style={{
                    padding: '0 8px',
                    textAlign: 'center',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: isChecked ? highlightColor : (extraStyle.backgroundColor || '#ffffff'),
                    zIndex: 2,
                    borderRight: '1px solid #e5e7eb',
                    width: '40px',
                    minWidth: '40px',
                    maxWidth: '40px'
                }}>
                    <input type="checkbox" checked={isChecked} onChange={() => onToggleRow(key)} style={{ cursor: 'pointer' }} />
                </td>
                <td style={{
                    padding: '8px 16px',
                    textAlign: 'left',
                    fontWeight: isChecked ? '900' : 'bold',
                    color: isChecked ? '#ea580c' : (extraStyle.color || '#374151'),
                    position: 'sticky',
                    left: '40px',
                    backgroundColor: isChecked ? highlightColor : (extraStyle.backgroundColor || '#ffffff'),
                    zIndex: 2,
                    borderRight: '2px solid #e5e7eb',
                    minWidth: '140px'
                }}>
                    {label}
                </td>
                {tabelogTableData.map(d => (
                    <td key={d.ym} style={{ padding: '8px 14px', fontWeight: isChecked ? 'bold' : 'normal', color: isChecked ? '#ea580c' : undefined }}>
                        {content(d)}
                    </td>
                ))}
            </tr>
        )
    }

    const renderCvrLabel = (props: any) => {
        const { x, y, width, value } = props
        if (!value || value === 0) return null
        return (
            <g>
                <rect x={x + width / 2 - 20} y={y - 25} width={40} height={18} rx={4} fill="#fb923c" />
                <text x={x + width / 2} y={y - 12} fill="white" textAnchor="middle" fontSize={10} fontWeight="900">
                    {value.toFixed(2)}%
                </text>
            </g>
        )
    }

    return (
        <div style={{ animation: 'fadeIn 0.3s ease-out' }} className="space-y-6">

            {/* 📈 グラフ & 詳細パネル */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-1.5 bg-orange-50 rounded-lg text-orange-600">
                        <TrendingUp size={16} />
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 tracking-tight">食べログ 集客効率 & 成果推移</h3>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">PV vs WEB Reservation Performance</p>
                    </div>
                </div>

                {/* 詳細パネル */}
                <div className="bg-gray-50/20 rounded-2xl p-6 border border-gray-200/50 shadow-sm mb-8">
                    <div className="flex items-center gap-4 mb-6 pb-3 border-b border-gray-200/60">
                        <span className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Analysis Range</span>
                        <span className="text-xl font-black text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">
                            {hoveredData?.activeLabel || (chartData.length > 0 ? chartData[chartData.length - 1].name : '-')}
                        </span>

                        {(() => {
                            const activeIndex = hoveredData?.activeTooltipIndex;
                            const d = (activeIndex !== undefined && chartData[activeIndex]) ? chartData[activeIndex] : chartData[chartData.length - 1];
                            if (!d) return null;
                            return (
                                <div className="ml-auto flex items-center gap-3 px-4 py-1.5 bg-orange-500 rounded-xl shadow-lg shadow-orange-100 border border-orange-400">
                                    <span className="text-[10px] font-black text-orange-50 uppercase tracking-tighter">Est. Profit</span>
                                    <span className="text-xl font-black text-white tabular-nums">¥{d.profit.toLocaleString()}</span>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-6">
                        {(() => {
                            const activeIndex = hoveredData?.activeTooltipIndex;
                            const d = (activeIndex !== undefined && chartData[activeIndex]) ? chartData[activeIndex] : chartData[chartData.length - 1];
                            if (!d) return null;

                            const metrics = [
                                { label: 'Plan', val: d.planName, sub: `¥${d.baseCost.toLocaleString()}`, color: '#94a3b8' },
                                { label: '従量課金', val: `¥${d.variableCost.toLocaleString()}`, color: '#64748b' },
                                { label: 'PV (Top)', val: d.pvTop.toLocaleString(), sub: `全: ${d.pvTotal.toLocaleString()}`, yoy: d.yoyPvTop, color: '#4338ca' },
                                { label: '集客総数', val: `${d.toretaRes}組`, sub: `${d.toretaGuest}人`, yoy: d.yoyToretaRes, color: '#64748b' },
                                { label: 'WEB予約', val: `${d.webRes}組`, sub: `${d.webGuest}人`, yoy: d.yoyWebRes, color: '#fb923c' },
                                { label: 'ノート', val: `${d.noteRes}組`, sub: `${d.noteGuest}人`, yoy: d.yoyNoteRes, color: '#6366f1' },
                                { label: 'CVR', val: `${d.cvr.toFixed(2)}%`, color: '#ea580c' },
                            ]

                            return metrics.map(m => (
                                <div key={m.label} className="flex flex-col gap-1 min-w-[100px]">
                                    <div className="flex items-center gap-1.5 min-h-[14px]">
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter shrink-0">{m.label}</span>
                                        {m.yoy !== undefined && m.yoy !== null && (
                                            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded tabular-nums shrink-0 ${m.yoy >= 100 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                                {m.yoy >= 100 ? '↑' : '↓'}{m.yoy.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[15px] font-black text-gray-900 leading-tight tabular-nums" style={{ color: (m.color !== '#94a3b8' && m.color !== '#64748b') ? m.color : undefined }}>{m.val}</span>
                                        {m.sub && <span className="text-[13.5px] font-extrabold text-gray-500 tabular-nums leading-tight mt-0.5" style={{ color: (m.color !== '#94a3b8' && m.color !== '#64748b' && m.color !== '#4338ca') ? m.color : undefined, opacity: 0.85 }}>{m.sub}</span>}
                                    </div>
                                </div>
                            ))
                        })()}
                    </div>
                </div>

                <div className="h-[380px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={chartData}
                            margin={{ top: 30, right: 30, bottom: 0, left: 10 }}
                            onMouseMove={(state) => state && state.isTooltipActive && setHoveredData(state)}
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
                                yAxisId="left"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#64748b' }}
                                label={{ value: '予約数 (組)', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#94a3b8', dx: -10 }}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#4338ca' }}
                                label={{ value: 'PV (Top)', angle: 90, position: 'insideRight', fontSize: 10, fill: '#4338ca', dx: 10 }}
                            />
                            <Tooltip content={<></>} cursor={{ fill: '#f8fafc', opacity: 0.4 }} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                content={({ payload }) => (
                                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
                                        {payload?.map((entry: any, index: number) => (
                                            <div key={`item-${index}`} className="flex items-center gap-1.5">
                                                <div className={`w-2 h-2 rounded-full ${entry.payload?.strokeDasharray ? 'border-2 border-dashed bg-transparent' : ''}`} style={{ backgroundColor: entry.payload?.strokeDasharray ? 'transparent' : entry.color, borderColor: entry.color }}></div>
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{entry.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            />

                            {/* 今年棒 */}
                            <Bar yAxisId="left" dataKey="webRes" name="Web予約" stackId="curr" fill="#fb923c" barSize={25} isAnimationActive={false} activeBar={{ stroke: '#ffffff', strokeWidth: 2, fillOpacity: 0.8 }}>
                                <LabelList dataKey="cvr" content={renderCvrLabel} />
                            </Bar>
                            <Bar yAxisId="left" dataKey="noteRes" name="ノート予約" stackId="curr" fill="#6366f1" barSize={25} isAnimationActive={false} activeBar={{ stroke: '#ffffff', strokeWidth: 2, fillOpacity: 0.8 }} />

                            {/* 前年棒 */}
                            <Bar yAxisId="left" dataKey="prevWebRes" name="Web予約 (前年)" stackId="prev" fill="#ffedd5" barSize={15} isAnimationActive={false} />
                            <Bar yAxisId="left" dataKey="prevNoteRes" name="ノート (前年)" stackId="prev" fill="#e0e7ff" barSize={15} isAnimationActive={false} />

                            {/* PV Lines */}
                            <Line yAxisId="right" type="monotone" dataKey="prevPvTop" name="PV前年" stroke="#a5b4fc" strokeDasharray="5 5" strokeWidth={2} dot={false} isAnimationActive={false} />
                            <Line yAxisId="right" type="monotone" dataKey="pvTop" name="PV今年" stroke="#4338ca" strokeWidth={3} dot={{ r: 4, fill: '#4338ca', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} isAnimationActive={false} />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* テーブル */}
            <div>
                <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-gray-900 px-1">
                    <Search size={18} className="text-gray-400" />
                    <span>詳細データテーブル</span>
                    {(() => {
                        const rows = tabelogTableData
                        for (let i = 1; i < rows.length; i++) {
                            if (rows[i - 1].planName !== '-' && rows[i].planName !== '-' && rows[i - 1].planName !== rows[i].planName) {
                                return (
                                    <span key="plan-change-alert" style={{ fontSize: '11px', backgroundColor: '#fef2f2', color: '#dc2626', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fecaca' }}>
                                        ⚠️ プラン変更: {formatYM(rows[i].ym)} {rows[i - 1].planName} → {rows[i].planName}
                                    </span>
                                )
                            }
                        }
                        return null
                    })()}
                </h3>

                <div className="overflow-x-auto border border-gray-200 rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right', fontSize: '11px', whiteSpace: 'nowrap' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                <th style={{ padding: '10px 8px', position: 'sticky', left: 0, backgroundColor: '#f3f4f6', zIndex: 10, borderRight: '1px solid #e5e7eb', width: '40px', minWidth: '40px', maxWidth: '40px' }}></th>
                                <th style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 'bold', color: '#374151', position: 'sticky', left: '40px', backgroundColor: '#f3f4f6', zIndex: 10, minWidth: '140px', borderRight: '2px solid #e5e7eb' }}>項目</th>
                                {tabelogTableData.map(d => (
                                    <th key={d.ym} style={{ padding: '10px 14px', fontWeight: 'bold', color: '#374151', minWidth: '94px' }}>{formatYM(d.ym)}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {renderRow('プラン名', 'planName', d => d.planName, { color: '#6b7280' })}
                            {renderRow('店舗トップPV', 'pvTop', d => d.pvTop ? d.pvTop.toLocaleString() : '-', {})}
                            {renderRow('合計PV', 'pvTotal', d => d.pvTotal ? d.pvTotal.toLocaleString() : '-', { color: '#6b7280' })}
                            {renderRow('予約件数 (総数)', 'toretaRes', d => d.toretaRes ? `${d.toretaRes.toLocaleString()}組` : '-', { borderTop: '2px solid #e5e7eb' })}
                            {renderRow('内）web予約数', 'webRes', d => d.webRes ? `${d.webRes.toLocaleString()}組` : '-', { color: '#4338ca', paddingLeft: '28px', fontWeight: 'bold' })}
                            {renderRow('内）ノート組数', 'noteRes', d => d.noteRes > 0 ? `${d.noteRes.toLocaleString()}組` : '-', { color: '#6b7280', paddingLeft: '28px' })}
                            {renderRow('予約人数 (総数)', 'toretaGuest', d => d.toretaGuest ? `${d.toretaGuest.toLocaleString()}人` : '-', { borderTop: '1px solid #e5e7eb' })}
                            {renderRow('内）web予約人数', 'webGuest', d => d.webGuest ? `${d.webGuest.toLocaleString()}人` : '-', { color: '#4338ca', paddingLeft: '28px', fontWeight: 'bold' })}
                            {renderRow('内）ノート人数', 'noteGuest', d => d.noteGuest > 0 ? `${d.noteGuest.toLocaleString()}人` : '-', { color: '#6b7280', paddingLeft: '28px' })}
                            {renderRow('CVR (Webのみ)', 'cvr', d => d.cvr > 0 ? `${d.cvr.toFixed(2)}%` : '-', { borderTop: '2px solid #e5e7eb' })}
                            {renderRow('費用合計', 'cost', d => `¥${d.cost.toLocaleString()}`, { borderTop: '2px solid #e5e7eb' })}
                            {renderRow('想定利益額', 'profit', d => (
                                <span style={{ color: d.profit >= 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                                    ¥{d.profit.toLocaleString()}
                                </span>
                            ), { borderTop: '1px solid #e5e7eb' })}
                            {renderRow('送客コスト/人', 'costPerGuest', d => d.costPerGuest !== null ? `¥${d.costPerGuest.toLocaleString()}` : '-', { color: '#6b7280' })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
