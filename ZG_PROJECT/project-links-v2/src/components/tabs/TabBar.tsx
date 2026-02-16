'use client';

import { useStore } from '@/store/useStore';

export function TabBar() {
    const { tabs, activeTabId, setActiveTabId } = useStore();

    if (tabs.length === 0) return null;

    return (
        <div className="sticky top-28 z-30 mb-12 pointer-events-none">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="flex items-center gap-2 bg-gray-900/40 backdrop-blur-2xl p-2 rounded-[24px] border border-white/5 inline-flex pointer-events-auto shadow-2xl">
                    {tabs
                        .sort((a, b) => a.order - b.order)
                        .map((tab) => {
                            const isActive = activeTabId === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTabId(tab.id)}
                                    className={`
                    relative px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 rounded-2xl
                    ${isActive
                                            ? 'text-white bg-blue-600/20 shadow-lg shadow-blue-500/10 border border-blue-500/20'
                                            : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                                        }
                  `}
                                >
                                    {tab.name}
                                    {isActive && (
                                        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full blur-[1px] animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
