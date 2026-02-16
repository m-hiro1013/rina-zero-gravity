// admin.js
// 管理画面（admin.html）用ロジック

import { db } from "./firebase-config.js";
import { watchAuth, login, logout } from "./auth.js";
import {
    collection,
    query,
    orderBy,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    writeBatch,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// ============================================
// DOM要素
// ============================================
const loginSection = document.getElementById("login-section");
const adminSection = document.getElementById("admin-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const addCategoryForm = document.getElementById("add-category-form");
const categoryNameInput = document.getElementById("category-name-input");
const adminCategoriesContainer = document.getElementById("admin-categories-container");

// モーダル関連
const projectDialog = document.getElementById("project-dialog");
const dialogTitle = document.getElementById("dialog-title");
const dialogCloseBtn = document.getElementById("dialog-close-btn");
const projectForm = document.getElementById("project-form");
const editCategoryId = document.getElementById("edit-category-id");
const editProjectId = document.getElementById("edit-project-id");
const projectNameInput = document.getElementById("project-name-input");
const projectUrlInput = document.getElementById("project-url-input");
const linksContainer = document.getElementById("links-container");
const addLinkBtn = document.getElementById("add-link-btn");

// ============================================
// 認証
// ============================================
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

watchAuth(
    (user) => {
        loginSection.style.display = "none";
        adminSection.style.display = "block";
        loadAdminCategories();
    },
    () => {
        loginSection.style.display = "block";
        adminSection.style.display = "none";
        adminCategoriesContainer.innerHTML = "";
    }
);

// ============================================
// カテゴリ追加
// ============================================
addCategoryForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = categoryNameInput.value.trim();
    if (!name) return;

    // 現在のカテゴリ数を取得してorderに使う
    const catSnapshot = await getDocs(collection(db, "categories"));
    const newOrder = catSnapshot.size;

    await addDoc(collection(db, "categories"), {
        name: name,
        order: newOrder,
        createdAt: serverTimestamp()
    });

    categoryNameInput.value = "";
    loadAdminCategories();
});

// ============================================
// カテゴリ一覧読み込み + D&D初期化
// ============================================
async function loadAdminCategories() {
    adminCategoriesContainer.innerHTML = "";

    const catQuery = query(collection(db, "categories"), orderBy("order"));
    const catSnapshot = await getDocs(catQuery);

    for (const catDoc of catSnapshot.docs) {
        const catData = catDoc.data();

        // --- カテゴリブロック ---
        const catBlock = document.createElement("article");
        catBlock.dataset.categoryId = catDoc.id;
        catBlock.classList.add("category-block");

        // カテゴリヘッダー（名前 + 編集/削除ボタン）
        const catHeader = document.createElement("header");

        const catTitle = document.createElement("h3");
        catTitle.textContent = catData.name;
        catTitle.classList.add("category-title");

        const catActions = document.createElement("div");
        catActions.classList.add("category-actions");

        const editCatBtn = document.createElement("button");
        editCatBtn.textContent = "編集";
        editCatBtn.classList.add("outline", "secondary");
        editCatBtn.addEventListener("click", () => editCategory(catDoc.id, catData.name));

        const deleteCatBtn = document.createElement("button");
        deleteCatBtn.textContent = "削除";
        deleteCatBtn.classList.add("outline", "contrast");
        deleteCatBtn.addEventListener("click", () => deleteCategory(catDoc.id));

        catActions.appendChild(editCatBtn);
        catActions.appendChild(deleteCatBtn);
        catHeader.appendChild(catTitle);
        catHeader.appendChild(catActions);
        catBlock.appendChild(catHeader);

        // --- プロジェクト一覧（D&D対応リスト） ---
        const projList = document.createElement("div");
        projList.classList.add("project-list");
        projList.dataset.categoryId = catDoc.id;

        const projQuery = query(
            collection(db, "categories", catDoc.id, "projects"),
            orderBy("order")
        );
        const projSnapshot = await getDocs(projQuery);

        for (const projDoc of projSnapshot.docs) {
            const projData = projDoc.data();

            const projItem = document.createElement("div");
            projItem.classList.add("project-item");
            projItem.dataset.projectId = projDoc.id;

            // ドラッグハンドル
            const handle = document.createElement("span");
            handle.textContent = "☰";
            handle.classList.add("drag-handle");

            // プロジェクト情報
            const projInfo = document.createElement("span");
            projInfo.classList.add("project-info");
            projInfo.textContent = projData.name;

            // 編集・削除ボタン
            const projActions = document.createElement("span");
            projActions.classList.add("project-actions");

            const editProjBtn = document.createElement("button");
            editProjBtn.textContent = "編集";
            editProjBtn.classList.add("outline", "secondary", "small-btn");
            editProjBtn.addEventListener("click", () =>
                openProjectDialog(catDoc.id, projDoc.id, projData)
            );

            const deleteProjBtn = document.createElement("button");
            deleteProjBtn.textContent = "削除";
            deleteProjBtn.classList.add("outline", "contrast", "small-btn");
            deleteProjBtn.addEventListener("click", () =>
                deleteProject(catDoc.id, projDoc.id)
            );

            projActions.appendChild(editProjBtn);
            projActions.appendChild(deleteProjBtn);

            projItem.appendChild(handle);
            projItem.appendChild(projInfo);
            projItem.appendChild(projActions);
            projList.appendChild(projItem);
        }

        catBlock.appendChild(projList);

        // プロジェクト追加ボタン
        const addProjBtn = document.createElement("button");
        addProjBtn.textContent = "+ プロジェクト追加";
        addProjBtn.classList.add("outline");
        addProjBtn.addEventListener("click", () =>
            openProjectDialog(catDoc.id, null, null)
        );
        catBlock.appendChild(addProjBtn);

        adminCategoriesContainer.appendChild(catBlock);

        // --- SortableJS: プロジェクト並び替え ---
        new Sortable(projList, {
            handle: ".drag-handle",
            animation: 150,
            onEnd: async () => {
                await saveProjectOrder(catDoc.id, projList);
            }
        });
    }

    // --- SortableJS: カテゴリ並び替え ---
    new Sortable(adminCategoriesContainer, {
        handle: ".category-title",
        animation: 150,
        draggable: ".category-block",
        onEnd: async () => {
            await saveCategoryOrder();
        }
    });
}

// ============================================
// 並び替え保存
// ============================================

// カテゴリの並び順をFirestoreに保存
async function saveCategoryOrder() {
    const blocks = adminCategoriesContainer.querySelectorAll(".category-block");
    const batch = writeBatch(db);

    blocks.forEach((block, index) => {
        const catId = block.dataset.categoryId;
        const ref = doc(db, "categories", catId);
        batch.update(ref, { order: index });
    });

    await batch.commit();
}

// プロジェクトの並び順をFirestoreに保存
async function saveProjectOrder(categoryId, projList) {
    const items = projList.querySelectorAll(".project-item");
    const batch = writeBatch(db);

    items.forEach((item, index) => {
        const projId = item.dataset.projectId;
        const ref = doc(db, "categories", categoryId, "projects", projId);
        batch.update(ref, { order: index });
    });

    await batch.commit();
}

// ============================================
// カテゴリ編集・削除
// ============================================

async function editCategory(categoryId, currentName) {
    const newName = prompt("カテゴリ名を入力", currentName);
    if (newName === null || newName.trim() === "") return;

    await updateDoc(doc(db, "categories", categoryId), {
        name: newName.trim()
    });

    loadAdminCategories();
}

async function deleteCategory(categoryId) {
    if (!confirm("このカテゴリと配下のプロジェクトをすべて削除しますか？")) return;

    // サブコレクション（projects）を先に全削除
    const projSnapshot = await getDocs(
        collection(db, "categories", categoryId, "projects")
    );
    const batch = writeBatch(db);
    projSnapshot.forEach((projDoc) => {
        batch.delete(projDoc.ref);
    });
    // カテゴリ本体を削除
    batch.delete(doc(db, "categories", categoryId));
    await batch.commit();

    loadAdminCategories();
}

// ============================================
// プロジェクト追加/編集 モーダル
// ============================================

function openProjectDialog(categoryId, projectId, projectData) {
    editCategoryId.value = categoryId;
    editProjectId.value = projectId || "";
    linksContainer.innerHTML = "";

    if (projectData) {
        // 編集モード
        dialogTitle.textContent = "プロジェクト編集";
        projectNameInput.value = projectData.name;
        projectUrlInput.value = projectData.url;

        if (projectData.links && projectData.links.length > 0) {
            for (const link of projectData.links) {
                addLinkRow(link.name, link.url);
            }
        }
    } else {
        // 追加モード
        dialogTitle.textContent = "プロジェクト追加";
        projectNameInput.value = "";
        projectUrlInput.value = "";
    }

    projectDialog.showModal();
}

dialogCloseBtn.addEventListener("click", () => {
    projectDialog.close();
});

// 関連リンク行を追加
addLinkBtn.addEventListener("click", () => {
    addLinkRow("", "");
});

function addLinkRow(name, url) {
    const row = document.createElement("div");
    row.classList.add("link-row");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.placeholder = "名前（例: GitHub）";
    nameInput.value = name;
    nameInput.classList.add("link-name");

    const urlInput = document.createElement("input");
    urlInput.type = "url";
    urlInput.placeholder = "https://...";
    urlInput.value = url;
    urlInput.classList.add("link-url");

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.classList.add("outline", "contrast", "small-btn");
    removeBtn.addEventListener("click", () => row.remove());

    row.appendChild(nameInput);
    row.appendChild(urlInput);
    row.appendChild(removeBtn);
    linksContainer.appendChild(row);
}

// ============================================
// プロジェクト保存
// ============================================

projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoryId = editCategoryId.value;
    const projectId = editProjectId.value;
    const name = projectNameInput.value.trim();
    const url = projectUrlInput.value.trim();

    // 関連リンクを収集
    const links = [];
    const rows = linksContainer.querySelectorAll(".link-row");
    rows.forEach((row) => {
        const linkName = row.querySelector(".link-name").value.trim();
        const linkUrl = row.querySelector(".link-url").value.trim();
        if (linkName && linkUrl) {
            links.push({ name: linkName, url: linkUrl });
        }
    });

    if (projectId) {
        // 更新
        await updateDoc(
            doc(db, "categories", categoryId, "projects", projectId),
            { name, url, links }
        );
    } else {
        // 新規追加
        const projSnapshot = await getDocs(
            collection(db, "categories", categoryId, "projects")
        );
        const newOrder = projSnapshot.size;

        await addDoc(
            collection(db, "categories", categoryId, "projects"),
            {
                name,
                url,
                links,
                order: newOrder,
                createdAt: serverTimestamp()
            }
        );
    }

    projectDialog.close();
    loadAdminCategories();
});

// ============================================
// プロジェクト削除
// ============================================

async function deleteProject(categoryId, projectId) {
    if (!confirm("このプロジェクトを削除しますか？")) return;

    await deleteDoc(doc(db, "categories", categoryId, "projects", projectId));
    loadAdminCategories();
}
