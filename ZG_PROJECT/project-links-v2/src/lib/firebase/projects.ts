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
import { Project, ProjectFormData } from '@/types';

// プロジェクト取得（カテゴリ内）
export async function getProjects(categoryId: string): Promise<Project[]> {
    const q = query(
        collection(db, 'categories', categoryId, 'projects'),
        orderBy('order')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        categoryId,
        ...doc.data()
    })) as Project[];
}

// 全プロジェクト取得（全カテゴリ）
export async function getAllProjects(): Promise<Record<string, Project[]>> {
    const categoriesSnapshot = await getDocs(collection(db, 'categories'));

    const entries = await Promise.all(
        categoriesSnapshot.docs.map(async (catDoc) => {
            const projects = await getProjects(catDoc.id);
            return [catDoc.id, projects] as const;
        })
    );

    return Object.fromEntries(entries);
}

// プロジェクト作成
export async function createProject(
    categoryId: string,
    data: ProjectFormData
): Promise<string> {
    const projects = await getProjects(categoryId);
    const newOrder = projects.length;

    const docRef = await addDoc(
        collection(db, 'categories', categoryId, 'projects'),
        {
            name: data.name,
            url: data.url,
            links: data.links,
            pinned: data.pinned ?? false,
            order: newOrder,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        }
    );

    return docRef.id;
}

// プロジェクト更新
export async function updateProject(
    categoryId: string,
    projectId: string,
    data: Partial<ProjectFormData>
): Promise<void> {
    await updateDoc(doc(db, 'categories', categoryId, 'projects', projectId), {
        ...data,
        updatedAt: serverTimestamp()
    });
}

// プロジェクト削除
export async function deleteProject(
    categoryId: string,
    projectId: string
): Promise<void> {
    await deleteDoc(doc(db, 'categories', categoryId, 'projects', projectId));
}

// カテゴリ内全プロジェクト削除
export async function deleteAllProjectsInCategory(
    categoryId: string
): Promise<void> {
    const snapshot = await getDocs(
        collection(db, 'categories', categoryId, 'projects')
    );
    const batch = writeBatch(db);

    snapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });

    await batch.commit();
}

// プロジェクト並べ替え
export async function reorderProjects(
    categoryId: string,
    projectIds: string[]
): Promise<void> {
    const batch = writeBatch(db);

    projectIds.forEach((id, index) => {
        batch.update(doc(db, 'categories', categoryId, 'projects', id), {
            order: index,
            updatedAt: serverTimestamp()
        });
    });

    await batch.commit();
}

// カテゴリ間移動
export async function moveProjectToCategory(
    fromCategoryId: string,
    toCategoryId: string,
    projectId: string
): Promise<void> {
    // 移動元からプロジェクトデータ取得
    const projects = await getProjects(fromCategoryId);
    const project = projects.find((p) => p.id === projectId);

    if (!project) throw new Error('Project not found');

    // 移動先のプロジェクト数を取得（orderに使用）
    const destProjects = await getProjects(toCategoryId);
    const newOrder = destProjects.length;

    // 移動先に新規作成
    await addDoc(collection(db, 'categories', toCategoryId, 'projects'), {
        name: project.name,
        url: project.url,
        links: project.links,
        pinned: project.pinned,
        order: newOrder,
        createdAt: project.createdAt,
        updatedAt: serverTimestamp()
    });

    // 移動元から削除
    await deleteDoc(
        doc(db, 'categories', fromCategoryId, 'projects', projectId)
    );
}

// ピン留めトグル
export async function toggleProjectPin(
    categoryId: string,
    projectId: string,
    pinned: boolean
): Promise<void> {
    await updateDoc(doc(db, 'categories', categoryId, 'projects', projectId), {
        pinned,
        updatedAt: serverTimestamp()
    });
}
