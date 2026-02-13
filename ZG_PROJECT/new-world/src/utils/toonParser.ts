/**
 * TOON 形式のテキストを解析し、完全なオブジェクト構造に変換するパーサー
 */

export interface ToonData {
    export_info: {
        type: string;
        exported_at: string;
        exported_at_jst: string;
        period: { start: string; end: string };
        shop_count: number;
        year_month_count: number;
    };
    shops: Shop[];
    debug_info?: any;
}

export interface Shop {
    shop_code: string;
    shop_name: string;
    avg_price_lunch: number;
    avg_price_dinner: number;
    monthly_data: any[];
    toreta_data: any[];
    media_data: {
        hotpepper?: any[];
        tabelog?: any[];
        gurunavi?: any[];
        uber_data?: any[];
        retty?: any[];
        [key: string]: any;
    };
    ad_cost_data: any[];
    [key: string]: any;
}

/**
 * 文字列が数値なら数値、nullならnull、それ以外は文字列のまま返すユーティリティ
 */
const castValue = (val: string) => {
    if (val === "null" || val === "") return null;
    if (!isNaN(Number(val)) && val.trim() !== "") return Number(val);
    return val;
};

/**
 * テーブルヘッダー {a,b,c} をパースしてキー配列を返す
 */
const getKeysFromHeader = (line: string): string[] | null => {
    const match = line.match(/\{([^}]+)\}/);
    return match ? match[1].split(",").map((s) => s.trim()) : null;
};

/**
 * TOON形式のテーブルブロックをパースする
 */
const parseTableBlock = (lines: string[], startIndex: number, keys: string[], count: number) => {
    const result: any[] = [];
    let i = startIndex;
    const end = Math.min(startIndex + count, lines.length);

    while (i < end) {
        const line = lines[i].trim();
        if (!line) break;

        // CSVとして分割。クォート内のカンマに対応するため簡易的な正規表現を使用
        const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [line];
        const cleanedValues = values.map((v) => v.replace(/^"|"$/g, "").trim());

        const obj: any = {};
        keys.forEach((key, idx) => {
            obj[key] = castValue(cleanedValues[idx]);
        });
        result.push(obj);
        i++;
    }
    return { result, nextIndex: i };
};

export const parseToon = (text: string): ToonData => {
    const lines = text.split("\n").map((l) => l.trimEnd());
    const data: any = {
        export_info: {},
        shops: [],
    };

    let currentShop: any = null;
    let currentContext: any = data; // 現在書き込み対象のオブジェクト (data or currentShop)

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        if (!trimmed) continue;

        // 店舗の開始
        if (trimmed.startsWith("- shop_code:")) {
            if (currentShop) data.shops.push(currentShop);
            currentShop = {
                shop_code: trimmed.split(":")[1].trim().replace(/^"|"$/g, ""),
                media_data: {},
            };
            currentContext = currentShop;
            continue;
        }

        // テーブル記法の検知: key[count]{headers}:
        const tableMatch = trimmed.match(/^([a-zA-Z0-9_]+)\[(\d+)\](\{.*\}):$/);
        if (tableMatch) {
            const [, key, countStr, headerPart] = tableMatch;
            const count = parseInt(countStr, 10);
            const keys = getKeysFromHeader(headerPart);
            if (keys) {
                const { result, nextIndex } = parseTableBlock(lines, i + 1, keys, count);
                currentContext[key] = result;
                i = nextIndex - 1; // ループのインクリメント分を考慮
                continue;
            }
        }

        // 単純なキー設定: key: value
        if (trimmed.includes(":")) {
            const firstColonIndex = trimmed.indexOf(":");
            const key = trimmed.substring(0, firstColonIndex).trim();
            const val = trimmed.substring(firstColonIndex + 1).trim().replace(/^"|"$/g, "");

            if (val === "") {
                // セクションの開始（ネスト）
                if (key === "export_info") currentContext = data.export_info;
                if (key === "media_data" && currentShop) currentContext = currentShop.media_data;
                if (key === "period" && currentContext === data.export_info) {
                    data.export_info.period = {};
                    currentContext = data.export_info.period;
                }
                if (key === "debug_info") {
                    data.debug_info = {};
                    currentContext = data.debug_info;
                }
            } else if (val !== "") {
                currentContext[key] = castValue(val);
            }
        }
    }

    if (currentShop) data.shops.push(currentShop);

    return data as ToonData;
};
