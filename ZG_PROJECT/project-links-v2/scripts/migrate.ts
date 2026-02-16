import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    updateDoc,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

// Firebase Config (Inlined to avoid import issues)
const firebaseConfig = {
    apiKey: "AIzaSyDkwk5RjCjLEF7F5hXKcMozEwvCvgSlB2Y",
    authDomain: "project-links-650ff.firebaseapp.com",
    projectId: "project-links-650ff",
    storageBucket: "project-links-650ff.firebasestorage.app",
    messagingSenderId: "863167021361",
    appId: "1:863167021361:web:a6c31d984c1d85bba4f010"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * マイグレーションスクリプト
 * 1. 既存プロジェクトに pinned: false, updatedAt を追加
 * 2. デフォルトタブ「すべて」を作成
 */
async function migrateData() {
    console.log('🚀 Migration started...');

    try {
        // 1. 全カテゴリ取得
        const categories = await getDocs(collection(db, 'categories'));
        console.log(`Found ${categories.size} categories.`);

        for (const cat of categories.docs) {
            // 全プロジェクト取得
            const projects = await getDocs(
                collection(db, 'categories', cat.id, 'projects')
            );
            console.log(`- Category [${cat.data().name}]: Found ${projects.size} projects.`);

            for (const proj of projects.docs) {
                const data = proj.data();
                // pinned, updatedAt が未設定なら追加
                if (data.pinned === undefined) {
                    await updateDoc(proj.ref, {
                        pinned: false,
                        updatedAt: serverTimestamp()
                    });
                    console.log(`  - Updated project: ${data.name}`);
                }
            }
        }

        // 2. デフォルトタブ作成
        const tabsSnapshot = await getDocs(collection(db, 'tabs'));
        const hasDefault = tabsSnapshot.docs.some(d => d.data().isDefault);

        if (!hasDefault) {
            await addDoc(collection(db, 'tabs'), {
                name: 'すべて',
                order: 0,
                isDefault: true,
                items: [],  // 空 = 全表示
                createdAt: serverTimestamp()
            });
            console.log('✅ Default tab "すべて" created.');
        } else {
            console.log('ℹ️ Default tab already exists.');
        }

        console.log('🎉 Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
    }
}

migrateData();
