import React from 'react'
import { Info, Users, MessageSquare } from 'lucide-react'

interface LineData {
    year_month: string
    friend_count: number
    block_count: number
    message_count: number
}

interface LineTabProps {
    shopName: string
    lineData: LineData[]
    months: string[]
}

export function LineTab({ shopName, lineData, months }: LineTabProps) {
    const formatYM = (ym: string) => `${ym.substring(0, 4)}/${ym.substring(4)}`

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <MessageSquare size={20} />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">LINE 公式アカウント分析</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">LINE Official Account Analysis - {shopName}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                        <Users size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">友だち数</span>
                    </div>
                    <div className="text-3xl font-black text-gray-900">
                        {lineData.length > 0 ? (lineData[lineData.length - 1].friend_count || 0).toLocaleString() : '-'}
                        <span className="text-sm font-bold text-gray-400 ml-1">人</span>
                    </div>
                </div>
                {/* 他のサマリーカードは必要に応じて追加 */}
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-right">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-6 py-4 text-left font-bold text-gray-900">月</th>
                            <th className="px-6 py-4 font-bold text-gray-900">友だち数</th>
                            <th className="px-6 py-4 font-bold text-gray-900">ブロック数</th>
                            <th className="px-6 py-4 font-bold text-gray-900">配信メッセージ数</th>
                        </tr>
                    </thead>
                    <tbody>
                        {months.map(ym => {
                            const d = lineData.find(item => String(item.year_month) === String(ym))
                            return (
                                <tr key={ym} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-3 text-left font-bold text-gray-900">{formatYM(ym)}</td>
                                    <td className="px-6 py-3 tabular-nums">{d?.friend_count?.toLocaleString() || '-'}</td>
                                    <td className="px-6 py-3 tabular-nums text-red-500">{d?.block_count?.toLocaleString() || '-'}</td>
                                    <td className="px-6 py-3 tabular-nums">{d?.message_count?.toLocaleString() || '-'}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-3">
                <Info className="text-gray-400 shrink-0" size={18} />
                <p className="text-xs text-gray-500 leading-relaxed">
                    友だち数およびブロック数は各月末時点の累計数値です。メッセージ数はその月に配信された総数を示します。
                </p>
            </div>
        </div>
    )
}
