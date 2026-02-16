import {
    collection,
    doc,
    query,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    writeBatch,
    serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Tab, TabFormData, TabItem } from '@/types';

const COLLECTION = 'tabs';

// 全タブ取得
export async function getTabs(): Promise<Tab[]> {
    const q = query(collection(db, COLLECTION), orderBy('order'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Tab[];
}

// タブ作成
export async function createTab(data: TabFormData): Promise<string> {
    const tabs = await getTabs();
    const newOrder = tabs.length;

    const docRef = await addDoc(collection(db, COLLECTION), {
        name: data.name,
        order: newOrder,
        isDefault: false,
        items: [],
        createdAt: serverTimestamp()
    });

    return docRef.id;
}

// タブ更新
export async function updateTab(
    tabId: string,
    data: Partial<Tab>
): Promise<void> {
    await updateDoc(doc(db, COLLECTION, tabId), data);
}

// タブ削除（デフォルトタブは削除不可）
export async function deleteTab(tabId: string): Promise<void> {
    const tabs = await getTabs();
    const tab = tabs.find((t) => t.id === tabId);

    if (tab?.isDefault) {
        throw new Error('Cannot delete default tab');
    }

    await deleteDoc(doc(db, COLLECTION, tabId));
}

// タブ並べ替え
export async function reorderTabs(tabIds: string[]): Promise<void> {
    const batch = writeBatch(db);

    tabIds.forEach((id, index) => {
        batch.update(doc(db, COLLECTION, id), { order: index });
    });

    await batch.commit();
}

// タブ自体の更新
export async function updateTabItems(tabId: string, items: TabItem[]): Promise<void> {
    await updateDoc(doc(db, COLLECTION, tabId), {
        items,
        updatedAt: serverTimestamp()
    });
}

// タブに項目を追加
export async function addItemToTab(
    tabId: string,
    item: TabItem
): Promise<void> {
    const tabs = await getTabs();
    const tab = tabs.find((t) => t.id === tabId);

    if (!tab) throw new Error('Tab not found');

    // 重複チェック
    const exists = tab.items.some(
        (i) =>
            i.type === item.type &&
            i.categoryId === item.categoryId &&
            i.projectId === item.projectId
    );

    if (!exists) {
        await updateDoc(doc(db, COLLECTION, tabId), {
            items: [...tab.items, item]
        });
    }
}

// タブから項目を削除
export async function removeItemFromTab(
    tabId: string,
    item: TabItem
): Promise<void> {
    const tabs = await getTabs();
    const tab = tabs.find((t) => t.id === tabId);

    if (!tab) throw new Error('Tab not found');

    const newItems = tab.items.filter(
        (i) =>
            !(
                i.type === item.type &&
                i.categoryId === item.categoryId &&
                i.projectId === item.projectId
            )
    );

    await updateDoc(doc(db, COLLECTION, tabId), {
        items: newItems
    });
}
