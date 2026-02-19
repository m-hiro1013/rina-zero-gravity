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
        // CSVとして分割。クォート内のエスケープ（\"）を考慮して、正確に分割するよ！💖
        const rawLine = lines[i];
        const cleanedValues: string[] = [];
        let cur = '';
        let inQuote = false;
        const content = rawLine.trim();

        for (let idx = 0; idx < content.length; idx++) {
            const char = content[idx];
            const prev = idx > 0 ? content[idx - 1] : '';

            if (char === '"' && prev !== '\\') {
                // エスケープされていない引用符ならフラグを反転
                inQuote = !inQuote;
                cur += char;
            } else if (char === ',' && !inQuote) {
                // クォートの外にあるカンマなら、そこで区切る
                cleanedValues.push(cur.replace(/^"|"$/g, "").trim());
                cur = '';
            } else {
                cur += char;
            }
        }
        cleanedValues.push(cur.replace(/^"|"$/g, "").trim());

        const obj: any = {};
        keys.forEach((key, idx) => {
            const rawVal = cleanedValues[idx];
            // 識別子（ID）系やJSON文字列は文字列のまま保護するよ
            const isNoCastKey = ['year_month', 'shop_code', 'shop_id', 'media', 'hourly_orders'].includes(key);

            if (rawVal === "null" || rawVal === undefined || rawVal === "") {
                obj[key] = null;
            } else if (!isNoCastKey && !isNaN(Number(rawVal))) {
                obj[key] = Number(rawVal);
            } else {
                obj[key] = rawVal;
            }
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
    let currentContext: any = data;

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

            // 🆕 トップレベルのキーならコンテキストをShopに戻すよ！（media_dataからの脱出）🏃‍♀️
            if (["uber_data", "monthly_data", "toreta_data", "ad_cost_data"].includes(key) && currentShop) {
                currentContext = currentShop;
            }

            if (keys) {
                const { result, nextIndex } = parseTableBlock(lines, i + 1, keys, count);
                currentContext[key] = result;
                i = nextIndex - 1;
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

                // 🆕 セクションの終了判定（適当だけど効くはず！）
                if (["uber_data", "monthly_data", "toreta_data", "ad_cost_data"].includes(key) && currentShop) {
                    currentContext = currentShop;
                }

                if (key === "period" && currentContext === data.export_info) {
                    data.export_info.period = {};
                    currentContext = data.export_info.period;
                }
                if (key === "debug_info") {
                    data.debug_info = {};
                    currentContext = data.debug_info;
                }
            } else {
                // ID系かどうか判定
                const isIdKey = ['year_month', 'shop_code', 'shop_id', 'start', 'end'].includes(key);
                if (val === "null") {
                    currentContext[key] = null;
                } else if (!isIdKey && !isNaN(Number(val))) {
                    currentContext[key] = Number(val);
                } else {
                    currentContext[key] = val;
                }
            }
        }
    }

    if (currentShop) data.shops.push(currentShop);

    return data as ToonData;
};
