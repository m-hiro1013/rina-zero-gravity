/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#FAF6F1",      // アプリ全体の背景ベース
                sidebar: "#3D2E1E",      // サイドバー背景
                editor: "#FFFFFF",       // エディタ背景
                hover: "#F0EBE4",        // ホバー・選択状態
                "tab-active": "#FAF6F1", // アクティブタブ背景
                "tab-inactive": "#E8E0D8", // 非アクティブタブ背景
                accent: "#D97706",       // アクセントカラー（オレンジ）
                "text-primary": "#1A1A1A", // メインテキスト
                "text-sidebar": "#F5F0EB", // サイドバーテキスト
                "text-muted": "#8C7B6B",   // 補足テキスト
                border: "#D4C8BC",       // ボーダー
                danger: "#DC2626",       // 削除・警告
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'], // Google FontsのInter推奨（後で追加）
            }
        },
    },
    plugins: [],
}
