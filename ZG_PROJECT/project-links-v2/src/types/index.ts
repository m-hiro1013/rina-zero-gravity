// ============================================
// 基本型
// ============================================

export interface Timestamp {
    seconds: number;
    nanoseconds: number;
}

// ============================================
// カテゴリ
// ============================================

export interface Category {
    id: string;
    name: string;
    order: number;
    createdAt: Timestamp;
}

export interface CategoryFormData {
    name: string;
}

// ============================================
// プロジェクト
// ============================================

export interface ProjectLink {
    name: string;
    url: string;
}

export interface Project {
    id: string;
    categoryId: string;        // 所属カテゴリID
    name: string;
    url: string;
    order: number;
    links: ProjectLink[];
    pinned: boolean;           // ★ 新規: ピン留め状態
    createdAt: Timestamp;
    updatedAt: Timestamp;      // ★ 新規: 更新日時
}

export interface ProjectFormData {
    name: string;
    url: string;
    links: ProjectLink[];
    pinned?: boolean;
}

// ============================================
// タブ（★ 新規）
// ============================================

export type TabItemType = 'category' | 'project';

export interface TabItem {
    type: TabItemType;
    categoryId: string;
    projectId?: string;        // type='project' の場合のみ
}

export interface Tab {
    id: string;
    name: string;
    order: number;
    isDefault: boolean;        // 「すべて」タブかどうか
    items: TabItem[];          // タブ内の項目
    createdAt: Timestamp;
}

export interface TabFormData {
    name: string;
}

// ============================================
// 認証
// ============================================

export interface AuthUser {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
}

export interface AuthState {
    user: AuthUser | null;
    loading: boolean;
    isAllowed: boolean;        // 許可UIDかどうか
}

// ============================================
// ストア
// ============================================

export interface AppStore {
    // 認証
    auth: AuthState;
    setAuth: (auth: AuthState) => void;

    // カテゴリ
    categories: Category[];
    setCategories: (categories: Category[]) => void;

    // プロジェクト（カテゴリIDでグループ化）
    projectsByCategory: Record<string, Project[]>;
    setProjectsByCategory: (projects: Record<string, Project[]>) => void;

    // タブ
    tabs: Tab[];
    setTabs: (tabs: Tab[]) => void;
    activeTabId: string | null;
    setActiveTabId: (id: string | null) => void;

    // UI状態
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}
