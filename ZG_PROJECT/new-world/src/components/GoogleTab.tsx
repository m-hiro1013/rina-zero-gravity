import React, { useState } from 'react'
import { Info, Search, MessageSquare, TrendingUp, Star } from 'lucide-react'

interface GoogleTabProps {
    shopName: string
    insightData: any[]
    keywordData: any[]
    reviewData: any[]
    months: string[]
}

export function GoogleTab({ shopName, insightData, keywordData, reviewData, months }: GoogleTabProps) {
    const [subTab, setSubTab] = useState<'insight' | 'keyword' | 'review'>('insight')
    const formatYM = (ym: string) => `${ym.substring(0, 4)}/${ym.substring(4)}`

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Search size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight">Google ビジネスプロフィール分析</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">GBP Analytics - {shopName}</p>
                    </div>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['insight', 'keyword', 'review'] as const).map(t => (
                        <button
                            key={t}
                            onClick={() => setSubTab(t)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${subTab === t ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            {t === 'insight' ? 'インサイト' : t === 'keyword' ? '検索キーワード' : '口コミ'}
                        </button>
                    ))}
                </div>
            </div>

            {subTab === 'insight' && (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-sm text-right">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-6 py-4 text-left font-bold text-gray-900">月</th>
                                <th className="px-6 py-4 font-bold text-gray-900">検索数</th>
                                <th className="px-6 py-4 font-bold text-gray-900">表示数</th>
                                <th className="px-6 py-4 font-bold text-gray-900">アクション数</th>
                            </tr>
                        </thead>
                        <tbody>
                            {months.map(ym => {
                                const d = insightData.find(item => String(item.year_month) === String(ym))
                                return (
                                    <tr key={ym} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3 text-left font-bold text-gray-900">{formatYM(ym)}</td>
                                        <td className="px-6 py-3 tabular-nums">{d?.search_count?.toLocaleString() || '-'}</td>
                                        <td className="px-6 py-3 tabular-nums">{d?.view_count?.toLocaleString() || '-'}</td>
                                        <td className="px-6 py-3 tabular-nums text-blue-600 font-bold">{d?.action_count?.toLocaleString() || '-'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {subTab === 'keyword' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {months.slice().reverse().slice(0, 4).map(ym => {
                        const keywordsForMonth = keywordData.filter(item => String(item.year_month) === String(ym))
                        if (keywordsForMonth.length === 0) return null
                        return (
                            <div key={ym} className="bg-white border border-gray-200 rounded-xl p-6">
                                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <TrendingUp size={16} className="text-blue-500" />
                                    {formatYM(ym)} の人気キーワード
                                </h4>
                                <div className="space-y-2">
                                    {keywordsForMonth.sort((a, b) => b.search_count - a.search_count).slice(0, 10).map((k, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-600">{k.keyword}</span>
                                            <span className="font-bold text-gray-900">{k.search_count.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {subTab === 'review' && (
                <div className="space-y-4">
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden text-sm text-right">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200 text-right">
                                    <th className="px-6 py-4 text-left font-bold text-gray-900">月</th>
                                    <th className="px-6 py-4 font-bold text-gray-900">新規口コミ数</th>
                                    <th className="px-6 py-4 font-bold text-gray-900">平均評価</th>
                                </tr>
                            </thead>
                            <tbody>
                                {months.map(ym => {
                                    const d = reviewData.find(item => String(item.year_month) === String(ym))
                                    return (
                                        <tr key={ym} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-3 text-left font-bold text-gray-900">{formatYM(ym)}</td>
                                            <td className="px-6 py-3 tabular-nums">{d?.review_count?.toLocaleString() || '-'}</td>
                                            <td className="px-6 py-3 tabular-nums">
                                                {d?.rating ? (
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                        <span className="font-bold">{d.rating.toFixed(1)}</span>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
