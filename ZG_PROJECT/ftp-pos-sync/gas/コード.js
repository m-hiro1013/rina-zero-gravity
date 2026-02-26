function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1") || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
    
    if (data.clear) {
      sheet.clear();
    }
    
    if (data.rows && data.rows.length > 0) {
      sheet.getRange(sheet.getLastRow() + 1, 1, data.rows.length, data.rows[0].length).setValues(data.rows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({status: "success", count: data.rows.length})).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()})).setMimeType(ContentService.MimeType.JSON);
  }
}