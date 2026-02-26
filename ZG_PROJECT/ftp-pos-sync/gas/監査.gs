/**
 * メニューCD・部門CD・分類CDと名称の「ダブり」「不一致」を徹底調査するよ！✨
 * 結果は「監査レポート」シートに出力するね💖
 */
function auditMenuCodes() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName("Sheet1") || ss.getSheets()[0];
  const rawData = rawSheet.getDataRange().getValues();
  
  if (rawData.length < 2) {
    console.log("データが足りないよ〜！💦");
    return;
  }
  
  const headers = rawData[0];
  const rows = rawData.slice(1);
  const colMap = {};
  headers.forEach((h, i) => colMap[h.trim()] = i);
  
  // チェック対象: CD → 名称 の対応関係を調べるよ！
  const checkTargets = [
    { cdCol: "部門CD",   nameCol: "部門名称",   label: "部門" },
    { cdCol: "分類CD",   nameCol: "分類名称",   label: "分類" },
    { cdCol: "ﾒﾆｭｰCD", nameCol: "ﾒﾆｭｰ名称", label: "メニュー" }
  ];
  
  const reportData = [["チェック種別", "問題タイプ", "CD", "紐づく名称（複数）", "出現回数"]];
  let issueCount = 0;
  
  checkTargets.forEach(target => {
    // 1) 同じCDに複数の名称がある？（CDダブり問題）
    const cdToNames = {};
    // 2) 同じ名称に複数のCDがある？（名称ダブり問題）
    const nameToCds = {};
    
    rows.forEach(row => {
      const cd = String(row[colMap[target.cdCol]] || "").trim();
      const name = String(row[colMap[target.nameCol]] || "").trim();
      if (!cd && !name) return;
      
      // CD → 名称
      if (!cdToNames[cd]) cdToNames[cd] = {};
      cdToNames[cd][name] = (cdToNames[cd][name] || 0) + 1;
      
      // 名称 → CD
      if (!nameToCds[name]) nameToCds[name] = {};
      nameToCds[name][cd] = (nameToCds[name][cd] || 0) + 1;
    });
    
    // 問題検出: 1つのCDに2つ以上の名称
    Object.keys(cdToNames).forEach(cd => {
      const names = Object.keys(cdToNames[cd]);
      if (names.length > 1) {
        const detail = names.map(n => n + " (" + cdToNames[cd][n] + "件)").join(" / ");
        reportData.push([target.label, "⚠️ 1つのCDに複数の名称", cd, detail, names.length]);
        issueCount++;
      }
    });
    
    // 問題検出: 1つの名称に2つ以上のCD
    Object.keys(nameToCds).forEach(name => {
      const cds = Object.keys(nameToCds[name]);
      if (cds.length > 1) {
        const detail = cds.map(c => "CD:" + c + " (" + nameToCds[name][c] + "件)").join(" / ");
        reportData.push([target.label, "⚠️ 1つの名称に複数のCD", name, detail, cds.length]);
        issueCount++;
      }
    });
    
    // サマリー行
    reportData.push([
      target.label, 
      "📊 サマリー", 
      "ユニークCD数: " + Object.keys(cdToNames).length, 
      "ユニーク名称数: " + Object.keys(nameToCds).length, 
      ""
    ]);
    reportData.push(["", "", "", "", ""]); // 空行で区切り
  });
  
  // 結果をシートに出力
  const reportSheetName = "監査レポート";
  let reportSheet = ss.getSheetByName(reportSheetName) || ss.insertSheet(reportSheetName);
  reportSheet.clear();
  
  reportSheet.getRange(1, 1, reportData.length, reportData[0].length).setValues(reportData);
  
  // 見た目を整えるよ✨
  reportSheet.getRange(1, 1, 1, reportData[0].length).setBackground("#fce5cd").setFontWeight("bold");
  reportSheet.setFrozenRows(1);
  reportSheet.autoResizeColumns(1, reportData[0].length);
  
  // 問題行をハイライト（⚠️がある行を黄色に）
  for (let i = 1; i < reportData.length; i++) {
    if (String(reportData[i][1]).includes("⚠️")) {
      reportSheet.getRange(i + 1, 1, 1, reportData[0].length).setBackground("#fff2cc");
    }
  }
  
  console.log("監査完了！問題件数: " + issueCount + " 件");
}
