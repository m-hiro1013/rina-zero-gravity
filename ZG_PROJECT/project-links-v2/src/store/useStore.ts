import { create } from 'zustand';
import { AppStore } from '@/types';

export const useStore = create<AppStore>((set) => ({
    // 認証
    auth: {
        user: null,
        loading: true,
        isAllowed: false
    },
    setAuth: (auth) => set({ auth }),

    // カテゴリ
    categories: [],
    setCategories: (categories) => set({ categories }),

    // プロジェクト
    projectsByCategory: {},
    setProjectsByCategory: (projectsByCategory) => set({ projectsByCategory }),

    // タブ
    tabs: [],
    setTabs: (tabs) => set({ tabs }),
    activeTabId: null,
    setActiveTabId: (activeTabId) => set({ activeTabId }),

    // UI状態
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading })
}));
