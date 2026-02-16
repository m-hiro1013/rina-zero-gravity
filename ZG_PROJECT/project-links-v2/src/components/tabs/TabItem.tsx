'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tab } from '@/types';
import { X } from 'lucide-react';
import { deleteTab } from '@/lib/firebase/tabs';
import { useStore } from '@/store/useStore';

interface TabItemProps {
    tab: Tab;
    isActive: boolean;
    onClick: () => void;
}

export function TabItem({ tab, isActive, onClick }: TabItemProps) {
    const { tabs, setTabs, setActiveTabId } = useStore();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: tab.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    };

    // タブ削除
    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (tab.isDefault) return;

        if (!confirm(`「${tab.name}」タブを削除しますか？`)) return;

        try {
            await deleteTab(tab.id);
            const newTabs = tabs.filter(t => t.id !== tab.id);
            setTabs(newTabs);

            // 削除したタブがアクティブなら、デフォルトタブに切り替え
            if (isActive) {
                const defaultTab = newTabs.find((t) => t.isDefault);
                if (defaultTab) {
                    setActiveTabId(defaultTab.id);
                }
            }
        } catch (error) {
            alert('タブの削除に失敗しました');
        }
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className={`
        group flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg cursor-pointer select-none transition-all
        ${isActive
                    ? 'bg-gray-900 text-white border-t border-l border-r border-gray-700 border-b-gray-900 -mb-[1px]'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50 border-b border-transparent'
                }
      `}
        >
            <span className="whitespace-nowrap">{tab.name}</span>

            {/* 削除ボタン（デフォルトタブ以外） */}
            {!tab.isDefault && (
                <button
                    onClick={handleDelete}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded transition-opacity"
                >
                    <X size={14} />
                </button>
            )}
        </div>
    );
}
