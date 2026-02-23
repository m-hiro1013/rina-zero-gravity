export class ToonParser {
    constructor() { }

    parse(content) {
        const lines = content.split('\n');
        const result = {
            export_info: {
                exported_at: null,
                period: { start: null, end: null },
                shop_count: 0,
                year_month_count: 0
            },
            shops: []
        };

        let i = 0;
        const totalLines = lines.length;

        function getIndentLevel(line) {
            const match = line.match(/^(\s*)/);
            return match ? match[1].length : 0;
        }

        function parseKeyValue(line) {
            const trimmed = line.trim();
            const colonIndex = trimmed.indexOf(':');
            if (colonIndex === -1) return { key: trimmed, value: null };
            const key = trimmed.substring(0, colonIndex).trim();
            const value = trimmed.substring(colonIndex + 1).trim();
            return { key, value: value || null };
        }

        function parseTableHeader(key) {
            const match = key.match(/^(.+?)\[(\d+)\]\{(.+)\}$/);
            if (!match) return null;
            return {
                name: match[1],
                count: parseInt(match[2]),
                columns: match[3].split(',')
            };
        }

        function parseValue(val) {
            if (val === null || val === '' || val === 'null') return null;
            if (val === 'true') return true;
            if (val === 'false') return false;
            const num = Number(val);
            if (!isNaN(num) && val !== '') return num;
            return val;
        }

        function parseTableRows(startIndex, count, columns, baseIndent) {
            const rows = [];
            let idx = startIndex;

            while (idx < totalLines && rows.length < count) {
                const line = lines[idx];
                if (!line.trim()) {
                    idx++;
                    continue;
                }

                const currentIndent = getIndentLevel(line);
                if (currentIndent <= baseIndent && line.trim()) {
                    break;
                }

                const values = line.trim().split(',');
                if (values.length === columns.length) {
                    const row = {};
                    columns.forEach((col, colIdx) => {
                        row[col] = parseValue(values[colIdx]);
                    });
                    rows.push(row);
                }
                idx++;
            }

            return { rows, nextIndex: idx };
        }

        // export_info パース
        while (i < totalLines) {
            const line = lines[i];
            if (line.trim().startsWith('export_info:')) {
                i++;
                while (i < totalLines) {
                    const subLine = lines[i];
                    if (!subLine.trim() || getIndentLevel(subLine) === 0) break;

                    const { key, value } = parseKeyValue(subLine);

                    if (key === 'exported_at') {
                        result.export_info.exported_at = value;
                    } else if (key === 'period') {
                        i++;
                        while (i < totalLines && getIndentLevel(lines[i]) > 2) {
                            const periodLine = parseKeyValue(lines[i]);
                            if (periodLine.key === 'start') {
                                result.export_info.period.start = parseInt(periodLine.value);
                            } else if (periodLine.key === 'end') {
                                result.export_info.period.end = parseInt(periodLine.value);
                            }
                            i++;
                        }
                        continue;
                    } else if (key === 'shop_count') {
                        result.export_info.shop_count = parseInt(value);
                    } else if (key === 'year_month_count') {
                        result.export_info.year_month_count = parseInt(value);
                    }
                    i++;
                }
                break;
            }
            i++;
        }

        // shops パース
        while (i < totalLines) {
            const line = lines[i];
            if (line.trim().match(/^shops\[\d+\]:/)) {
                i++;
                break;
            }
            i++;
        }

        let currentShop = null;

        while (i < totalLines) {
            const line = lines[i];
            const trimmed = line.trim();

            if (!trimmed) {
                i++;
                continue;
            }

            const indent = getIndentLevel(line);

            if (trimmed.startsWith('- shop_code:')) {
                if (currentShop) {
                    result.shops.push(currentShop);
                }
                currentShop = {
                    shop_code: parseValue(trimmed.split(':')[1].trim()),
                    shop_name: '',
                    avg_price_lunch: 0,
                    avg_price_dinner: 0,
                    monthly_data: [],
                    toreta_data: [],
                    media_data: {},
                    ad_cost_data: [],
                    uber_data: []
                };
                i++;
                continue;
            }

            if (!currentShop) {
                i++;
                continue;
            }

            const { key, value } = parseKeyValue(line);

            // 単純なキー・バリュー（shop_name 等）
            if (['shop_name', 'avg_price_lunch', 'avg_price_dinner'].includes(key)) {
                currentShop[key] = parseValue(value);
                i++;
                continue;
            }

            // --- パターンA: テーブルヘッダー検出 (xxx[N]{cols}:) ---
            const tableInfo = parseTableHeader(key);
            if (tableInfo) {
                i++;
                const { rows, nextIndex } = parseTableRows(i, tableInfo.count, tableInfo.columns, indent);
                currentShop[tableInfo.name] = rows;
                i = nextIndex;
                continue;
            }

            // --- パターンB: グループキー (media_data: のような値なしキー) ---
            if (value === null && i + 1 < totalLines) {
                const nextIndent = getIndentLevel(lines[i + 1]);
                if (nextIndent > indent) {
                    // グループの子要素をパース
                    currentShop[key] = {};
                    i++;
                    while (i < totalLines) {
                        const childLine = lines[i];
                        if (!childLine || !childLine.trim()) { i++; continue; }

                        const childIndent = getIndentLevel(childLine);
                        if (childIndent <= indent) break; // インデントが戻ったら終了

                        const childKV = parseKeyValue(childLine);
                        const childTableInfo = parseTableHeader(childKV.key);

                        // 子要素内のテーブルをパース
                        if (childTableInfo) {
                            i++;
                            const { rows, nextIndex } = parseTableRows(i, childTableInfo.count, childTableInfo.columns, childIndent);
                            currentShop[key][childTableInfo.name] = rows;
                            i = nextIndex;
                            continue;
                        }

                        // テーブルでなければ単なるネストした値として保持（必要なら再帰的に拡張可能）
                        if (childKV.value !== null) {
                            currentShop[key][childKV.key] = parseValue(childKV.value);
                        }

                        i++;
                    }
                    continue;
                }
            }

            i++;
        }

        if (currentShop) {
            result.shops.push(currentShop);
        }

        return result;
    }
}
