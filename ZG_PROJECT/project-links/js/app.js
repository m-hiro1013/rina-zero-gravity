// app.js
// 表示ページ（index.html）用ロジック

import { db } from "./firebase-config.js";
import { watchAuth, login, logout } from "./auth.js";
import {
    collection,
    query,
    orderBy,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";

// --- DOM要素 ---
const loginSection = document.getElementById("login-section");
const appSection = document.getElementById("app-section");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const categoriesContainer = document.getElementById("categories-container");

// --- イベント ---
loginBtn.addEventListener("click", login);
logoutBtn.addEventListener("click", logout);

// --- 認証監視 ---
watchAuth(
    // 認証済み
    (user) => {
        loginSection.style.display = "none";
        appSection.style.display = "block";
        loadCategories();
    },
    // 未認証
    () => {
        loginSection.style.display = "block";
        appSection.style.display = "none";
        categoriesContainer.innerHTML = "";
    }
);

// --- カテゴリ＋プロジェクト読み込み ---
async function loadCategories() {
    categoriesContainer.innerHTML = "";

    const catQuery = query(collection(db, "categories"), orderBy("order"));
    const catSnapshot = await getDocs(catQuery);

    for (const catDoc of catSnapshot.docs) {
        const catData = catDoc.data();

        // カテゴリ見出し
        const section = document.createElement("section");
        const h2 = document.createElement("h2");
        h2.textContent = catData.name;
        section.appendChild(h2);

        // プロジェクト一覧
        const projQuery = query(
            collection(db, "categories", catDoc.id, "projects"),
            orderBy("order")
        );
        const projSnapshot = await getDocs(projQuery);

        for (const projDoc of projSnapshot.docs) {
            const projData = projDoc.data();
            const article = document.createElement("article");

            // プロジェクト名 + URL
            const h3 = document.createElement("h3");
            const a = document.createElement("a");
            a.href = projData.url;
            a.target = "_blank";
            a.rel = "noopener noreferrer";
            a.textContent = projData.name;
            h3.appendChild(a);
            article.appendChild(h3);

            // 関連リンク（プルダウン）
            if (projData.links && projData.links.length > 0) {
                const details = document.createElement("details");
                const summary = document.createElement("summary");
                summary.textContent = "関連リンク";
                details.appendChild(summary);

                const ul = document.createElement("ul");
                for (const link of projData.links) {
                    const li = document.createElement("li");
                    const linkA = document.createElement("a");
                    linkA.href = link.url;
                    linkA.target = "_blank";
                    linkA.rel = "noopener noreferrer";
                    linkA.textContent = link.name;
                    li.appendChild(linkA);
                    ul.appendChild(li);
                }
                details.appendChild(ul);
                article.appendChild(details);
            }

            section.appendChild(article);
        }

        categoriesContainer.appendChild(section);
    }
}
