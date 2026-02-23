const express = require('express');
const app = express();
const PORT = 3000;

// ルートにアクセスすると歓迎メッセージを返す
app.get('/', (req, res) => {
  res.send('Welcome to Dual-Core API!');
});

// /statusにアクセスすると成功ステータスとタイムスタンプを返す
app.get('/status', (req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
