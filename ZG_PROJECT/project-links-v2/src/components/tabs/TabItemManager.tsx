'use client';

import { Category, Project, Tab, TabItem } from '@/types';
import { Check, Hash, Layout } from 'lucide-react';

interface TabItemManagerProps {
    tab: Tab;
    categories: Category[];
    projectsByCategory: Record<string, Project[]>;
    onToggleItem: (item: TabItem) => void;
}

export function TabItemManager({
    tab,
    categories,
    projectsByCategory,
    onToggleItem
}: TabItemManagerProps) {
    const isSelected = (categoryId: string, projectId?: string) => {
        return tab.items.some(
            (item) =>
                item.categoryId === categoryId &&
                (projectId ? item.projectId === projectId : !item.projectId)
        );
    };

    return (
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                    {/* カテゴリ選択 */}
                    <div
                        onClick={() => onToggleItem({ type: 'category', categoryId: category.id })}
                        className={`
              flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
              ${isSelected(category.id)
                                ? 'bg-blue-600/20 border-blue-500/50 text-blue-400'
                                : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:border-gray-600'
                            }
            `}
                    >
                        <div className={`
              w-5 h-5 rounded flex items-center justify-center border
              ${isSelected(category.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-600'}
            `}>
                            {isSelected(category.id) && <Check size={14} className="text-white" />}
                        </div>
                        <Layout size={18} />
                        <span className="font-bold">{category.name}</span>
                    </div>

                    {/* プロジェクト選択（インデント） */}
                    <div className="pl-8 grid grid-cols-1 gap-2">
                        {projectsByCategory[category.id]?.map((project) => (
                            <div
                                key={project.id}
                                onClick={() =>
                                    onToggleItem({
                                        type: 'project',
                                        categoryId: category.id,
                                        projectId: project.id
                                    })
                                }
                                className={`
                  flex items-center gap-3 p-2.5 rounded-lg border text-sm cursor-pointer transition-all
                  ${isSelected(category.id, project.id)
                                        ? 'bg-blue-600/10 border-blue-500/30 text-blue-300'
                                        : 'bg-gray-800/30 border-gray-800 text-gray-500 hover:border-gray-700'
                                    }
                `}
                            >
                                <div className={`
                  w-4 h-4 rounded flex items-center justify-center border
                  ${isSelected(category.id, project.id) ? 'bg-blue-500 border-blue-500' : 'border-gray-700'}
                `}>
                                    {isSelected(category.id, project.id) && <Check size={12} className="text-white" />}
                                </div>
                                <Hash size={14} />
                                <span>{project.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            {categories.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    表示可能なカテゴリがありません
                </div>
            )}
        </div>
    );
}
