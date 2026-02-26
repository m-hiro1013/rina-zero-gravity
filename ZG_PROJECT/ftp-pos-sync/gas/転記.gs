/**
 * ひろきくんと決めた「究極の2大シート」を生成する最強の整形スクリプトだよ！✨
 * 手動ボタンでも、ゆくゆくはトリガーでも動くように設計してあるね💖
 */

function runAggregation() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
  const rawData = rawSheet.getDataRange().getValues();
  
  if (rawData.length < 2) {
    console.log("生データが足りないよ〜！💦");
    return;
  }
  
  const headers = rawData[0];
  const rows = rawData.slice(1);
  const colMap = {};
  headers.forEach((h, i) => colMap[h.trim()] = i);

  // 1）商品出数管理シートの生成
  generateItemSalesSheet(ss, rows, colMap);
  
  // 2）曜日・時間帯別傾向シートの生成
  generateTrendSheet(ss, rows, colMap);
  
  console.log("ミッションコンプリート！雅なシートができたよ✨");
}

/**
 * 【NEW】別プロジェクトのマスター用スプレッドシートのshopsシートから店舗ID→業態のマップを作るよ
 * 直接連携することで、データの二重管理を防ぐよ！✨
 */
function getShopCategoryMap() {
  const map = {};
  // report-renewal側のマスタースプレッドシートID
  const masterSpreadsheetId = "1jl-GuhjOIC91Tpml6uaLe0sxGbVLu7mHFiDfVIyaAvs";
  let masterSs;
  try {
    masterSs = SpreadsheetApp.openById(masterSpreadsheetId);
  } catch (e) {
    console.error("マスタースプレッドシートへのアクセス権限がないか、IDが間違っているよ！💦");
    return map;
  }
  
  const sheet = masterSs.getSheetByName("shops");
  if (!sheet) {
    console.warn("マスタースプレッドシートに「shops」シートが見つからないよ！💦");
    return map;
  }
  
  const data = sheet.getDataRange().getValues();
  if (data.length < 2) return map;
  
  // shopsの構造：shop_code(A), shop_id(B), shop_name(C), ..., category(F)
  // ヘッダーのインデックスを探す
  const headers = data[0];
  const cdIdx = headers.indexOf("shop_code") !== -1 ? headers.indexOf("shop_code") : 0;
  const catIdx = headers.indexOf("業態") !== -1 ? headers.indexOf("業態") : (headers.indexOf("category") !== -1 ? headers.indexOf("category") : 5);
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const shopCode = row[cdIdx];
    const category = row[catIdx];
    if (shopCode) {
      map[shopCode] = category || "不明";
    }
  }
  return map;
}

/**
 * 商品出数管理シート
 */
function generateItemSalesSheet(ss, rows, colMap) {
  const targetSheetName = "商品出数管理";
  let targetSheet = ss.getSheetByName(targetSheetName) || ss.insertSheet(targetSheetName);
  targetSheet.clear();
  
  const shopCatMap = getShopCategoryMap();
  const aggregation = {};
  
  rows.forEach(row => {
    const shopId = row[colMap["店舗CD"]];
    const menuId = row[colMap["ﾒﾆｭｰCD"]];
    const bizDay = String(row[colMap["営業日"]]); // YYYYMMDD
    const ym = bizDay.length >= 6 ? bizDay.substring(0, 6) : "不明";
    const category = shopCatMap[shopId] || "不明";
    
    // 複合キー: 業態 + 店舗CD + ﾒﾆｭｰCD + 年月
    const key = category + "_" + shopId + "_" + menuId + "_" + ym;
    
    if (!aggregation[key]) {
      aggregation[key] = {
        "業態": category,
        "店舗CD": shopId,
        "部門名称": row[colMap["部門名称"]],
        "分類名称": row[colMap["分類名称"]],
        "ﾒﾆｭｰCD": menuId,
        "ﾒﾆｭｰ名称": row[colMap["ﾒﾆｭｰ名称"]],
        "年月": ym,
        "売価(税込)": Number(row[colMap["売価(税込)"]]) || 0,
        "売価(税抜)": Number(row[colMap["売価(税抜)"]]) || 0,
        "原価": Number(row[colMap["原価"]]) || 0,
        "販売数": 0
      };
    }
    aggregation[key]["販売数"] += (Number(row[colMap["販売数"]]) || 0);
  });
  
  const outputHeaders = ["業態", "店舗CD", "部門名称", "分類名称", "ﾒﾆｭｰCD", "ﾒﾆｭｰ名称", "年月", "売価(税込)", "売価(税抜)", "原価", "販売数"];
  const outputData = [outputHeaders];
  
  Object.values(aggregation).forEach(item => {
    outputData.push(outputHeaders.map(h => item[h]));
  });
  
  targetSheet.getRange(1, 1, outputData.length, outputData[0].length).setValues(outputData);
  formatSheetMiyabi(targetSheet);
}

/**
 * 曜日・時間帯別傾向シート
 */
function generateTrendSheet(ss, rows, colMap) {
  const targetSheetName = "曜日・時間帯別傾向";
  let targetSheet = ss.getSheetByName(targetSheetName) || ss.insertSheet(targetSheetName);
  targetSheet.clear();
  
  const holidayCache = {}; // 祝日判定の節約用
  const aggregation = {};
  
  rows.forEach(row => {
    const shopId = row[colMap["店舗CD"]];
    const receiptNo = row[colMap["ﾚｼｰﾄNo"]];
    
    // 会計単位で1行にまとめるので 店舗CD + レシートNo がキー
    const key = shopId + "_" + receiptNo;
    
    if (!aggregation[key]) {
      const bizDay = String(row[colMap["営業日"]]); // YYYYMMDD
      const dateObj = parsePosDate(bizDay);
      const ym = bizDay.length >= 6 ? bizDay.substring(0, 6) : "";
      const dateStr = bizDay.length >= 8 ? bizDay.substring(6, 8) : "";
      
      aggregation[key] = {
        "店舗CD": shopId,
        "ﾚｼｰﾄNo": receiptNo,
        "年月": ym,
        "日付": dateStr,
        "曜日": getDayName(dateObj),
        "is_holiday": isHoliday(dateObj, holidayCache),
        "オーダー日時": formatPosTime(row[colMap["オーダー日時"]]),
        "会計日時": formatPosTime(row[colMap["会計日時"]]),
        "会計金額": 0
      };
    }
    aggregation[key]["会計金額"] += (Number(row[colMap["販売金額(税込)"]]) || 0);
  });
  
  const outputHeaders = ["店舗CD", "ﾚｼｰﾄNo", "年月", "日付", "曜日", "is_holiday", "オーダー日時", "会計日時", "会計金額"];
  const outputData = [outputHeaders];
  
  Object.values(aggregation).forEach(item => {
    outputData.push(outputHeaders.map(h => item[h]));
  });
  
  targetSheet.getRange(1, 1, outputData.length, outputData[0].length).setValues(outputData);
  formatSheetMiyabi(targetSheet);
}

// =======================
// ユーティリティ関数たち✨
// =======================

function parsePosDate(s) {
  if (s.length !== 8) return new Date();
  return new Date(s.substring(0, 4), Number(s.substring(4, 6)) - 1, s.substring(6, 8));
}

function getDayName(date) {
  const days = ["日", "月", "火", "水", "木", "金", "土"];
  return days[date.getDay()];
}

function isHoliday(date, cache) {
  const key = Utilities.formatDate(date, "JST", "yyyyMMdd");
  if (cache[key] !== undefined) return cache[key];
  
  // 土日は休日
  if (date.getDay() === 0 || date.getDay() === 6) {
    cache[key] = 1;
    return 1;
  }
  
  // Googleカレンダーで祝日判定
  try {
    const calendarId = "ja.japanese#holiday@group.v.calendar.google.com";
    const calendar = CalendarApp.getCalendarById(calendarId);
    const events = calendar.getEventsForDay(date);
    
    const res = events.length > 0 ? 1 : 0;
    cache[key] = res;
    return res;
  } catch (e) {
    // もしCalendar APIの権限等で失敗した場合は、平日として返す
    cache[key] = 0;
    return 0;
  }
}

function formatPosTime(val) {
  const s = String(val);
  if (s.length < 6) return s;
  const timePart = s.slice(-6);
  return timePart.substring(0, 2) + ":" + timePart.substring(2, 4) + ":" + timePart.substring(4, 6);
}

function formatSheetMiyabi(sheet) {
  const lastCol = sheet.getLastColumn();
  sheet.getRange(1, 1, 1, lastCol).setBackground("#ead1dc").setFontWeight("bold");
  sheet.setFrozenRows(1);
  try {
    sheet.autoResizeColumns(1, lastCol);
  } catch (e) {
    // autoResizeが効かない環境があれば無視
  }
}
