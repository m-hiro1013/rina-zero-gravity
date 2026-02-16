// auth.js
// 認証処理（index.html / admin.html 共通）

import { auth, provider } from "./firebase-config.js";
import {
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

// 許可するUID（自分のGoogleアカウント）
// ★ Firebaseコンソール > Authentication で確認して置き換える
const ALLOWED_UID = "mGc8BsGhDyMJMmlBkhMNhOaQc6q2";

/**
 * 認証状態を監視し、コールバックを実行
 * @param {Function} onAuthed  - 認証済み時のコールバック(user)
 * @param {Function} onUnauthed - 未認証時のコールバック
 */
export function watchAuth(onAuthed, onUnauthed) {
    onAuthStateChanged(auth, (user) => {
        if (user && user.uid === ALLOWED_UID) {
            onAuthed(user);
        } else {
            if (user) {
                // ログインしているが許可UIDでない → サインアウト
                signOut(auth);
            }
            onUnauthed();
        }
    });
}

/**
 * Googleログイン
 */
export async function login() {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("ログインエラー:", error);
        alert("ログインに失敗しました");
    }
}

/**
 * ログアウト
 */
export async function logout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("ログアウトエラー:", error);
    }
}
