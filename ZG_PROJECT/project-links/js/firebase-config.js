// firebase-config.js
// Firebase初期化設定

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/12.9.0/firebase-auth.js";

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
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
