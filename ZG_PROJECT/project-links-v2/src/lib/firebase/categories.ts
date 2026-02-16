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
import { Category, CategoryFormData } from '@/types';
import { deleteAllProjectsInCategory } from './projects';

const COLLECTION = 'categories';

// 全カテゴリ取得
export async function getCategories(): Promise<Category[]> {
    const q = query(collection(db, COLLECTION), orderBy('order'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
    })) as Category[];
}

// カテゴリ作成
export async function createCategory(data: CategoryFormData): Promise<string> {
    const categories = await getCategories();
    const newOrder = categories.length;

    const docRef = await addDoc(collection(db, COLLECTION), {
        name: data.name,
        order: newOrder,
        createdAt: serverTimestamp()
    });

    return docRef.id;
}

// カテゴリ更新
export async function updateCategory(
    categoryId: string,
    data: Partial<CategoryFormData>
): Promise<void> {
    await updateDoc(doc(db, COLLECTION, categoryId), data);
}

// カテゴリ削除（配下のプロジェクトも全削除）
export async function deleteCategory(categoryId: string): Promise<void> {
    // 配下プロジェクトを先に削除
    await deleteAllProjectsInCategory(categoryId);
    // カテゴリ本体を削除
    await deleteDoc(doc(db, COLLECTION, categoryId));
}

// カテゴリ並べ替え
export async function reorderCategories(categoryIds: string[]): Promise<void> {
    const batch = writeBatch(db);

    categoryIds.forEach((id, index) => {
        batch.update(doc(db, COLLECTION, id), { order: index });
    });

    await batch.commit();
}
