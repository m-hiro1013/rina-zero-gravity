# {{project_name}}

Streamlitで作ったデータダッシュボードだよ！📊

## 🚀 始め方

### 1. 仮想環境を作成

```bash
python -m venv venv
source venv/bin/activate  # macOS/Linux
# .\venv\Scripts\activate  # Windows
```

### 2. 依存関係をインストール

```bash
pip install -r requirements.txt
```

### 3. アプリを起動

```bash
streamlit run app.py
```

→ http://localhost:8501 でダッシュボードが開くよ！

## 📁 ファイル構成

```
.
├── app.py            # メインのStreamlitアプリ
├── requirements.txt  # 依存関係
├── .gitignore        # Git除外設定
└── README.md         # このファイル
```

## 🎨 カスタマイズ

### データソースを変更

`load_sample_data()` 関数を編集して、実際のデータを読み込むように変更：

```python
@st.cache_data
def load_data():
    # CSVから読み込む場合
    return pd.read_csv('data.csv')
    
    # データベースから読み込む場合
    # conn = sqlite3.connect('database.db')
    # return pd.read_sql('SELECT * FROM table', conn)
```

### グラフを追加

Plotlyを使って新しいグラフを追加：

```python
fig = px.bar(df, x='category', y='value', title="棒グラフ")
st.plotly_chart(fig)
```

## 📝 ライセンス

MIT License
