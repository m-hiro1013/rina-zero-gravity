"""
{{project_name}} - Streamlit Dashboard

データ可視化ダッシュボードだよ！
"""

import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta

# ===== ページ設定 =====
st.set_page_config(
    page_title="{{project_name}}",
    page_icon="📊",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ===== カスタムCSS =====
st.markdown("""
    <style>
    .main-header {
        font-size: 2.5rem;
        font-weight: bold;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .metric-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 1rem;
        border-radius: 0.5rem;
        color: white;
    }
    </style>
""", unsafe_allow_html=True)


# ===== サンプルデータ生成 =====
@st.cache_data
def load_sample_data():
    """サンプルデータを生成"""
    np.random.seed(42)
    dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
    
    data = pd.DataFrame({
        'date': dates,
        'sales': np.random.randint(100, 1000, len(dates)),
        'visitors': np.random.randint(50, 500, len(dates)),
        'conversion_rate': np.random.uniform(0.01, 0.1, len(dates)),
        'category': np.random.choice(['A', 'B', 'C', 'D'], len(dates))
    })
    
    return data


# ===== メイン =====
def main():
    # ヘッダー
    st.markdown('<h1 class="main-header">📊 {{project_name}}</h1>', unsafe_allow_html=True)
    
    # データ読み込み
    df = load_sample_data()
    
    # サイドバー
    st.sidebar.header("🔧 設定")
    
    # 日付フィルター
    st.sidebar.subheader("📅 期間選択")
    date_range = st.sidebar.date_input(
        "期間",
        value=(df['date'].min(), df['date'].max()),
        min_value=df['date'].min(),
        max_value=df['date'].max()
    )
    
    # カテゴリフィルター
    st.sidebar.subheader("📁 カテゴリ")
    selected_categories = st.sidebar.multiselect(
        "カテゴリを選択",
        options=df['category'].unique(),
        default=df['category'].unique()
    )
    
    # データフィルタリング
    if len(date_range) == 2:
        mask = (
            (df['date'] >= pd.Timestamp(date_range[0])) & 
            (df['date'] <= pd.Timestamp(date_range[1])) &
            (df['category'].isin(selected_categories))
        )
        filtered_df = df[mask]
    else:
        filtered_df = df[df['category'].isin(selected_categories)]
    
    # KPI メトリクス
    st.subheader("📈 主要指標")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric(
            label="総売上",
            value=f"¥{filtered_df['sales'].sum():,.0f}",
            delta=f"{filtered_df['sales'].pct_change().mean() * 100:.1f}%"
        )
    
    with col2:
        st.metric(
            label="総訪問者",
            value=f"{filtered_df['visitors'].sum():,}",
            delta=f"{filtered_df['visitors'].pct_change().mean() * 100:.1f}%"
        )
    
    with col3:
        st.metric(
            label="平均コンバージョン率",
            value=f"{filtered_df['conversion_rate'].mean() * 100:.2f}%"
        )
    
    with col4:
        st.metric(
            label="データ件数",
            value=f"{len(filtered_df):,}"
        )
    
    st.divider()
    
    # グラフ
    col1, col2 = st.columns(2)
    
    with col1:
        st.subheader("📊 売上推移")
        fig_sales = px.line(
            filtered_df,
            x='date',
            y='sales',
            color='category',
            title="日別売上"
        )
        fig_sales.update_layout(height=400)
        st.plotly_chart(fig_sales, use_container_width=True)
    
    with col2:
        st.subheader("🥧 カテゴリ別売上")
        category_sales = filtered_df.groupby('category')['sales'].sum().reset_index()
        fig_pie = px.pie(
            category_sales,
            values='sales',
            names='category',
            title="カテゴリ別売上シェア"
        )
        fig_pie.update_layout(height=400)
        st.plotly_chart(fig_pie, use_container_width=True)
    
    # データテーブル
    st.subheader("📋 データ一覧")
    st.dataframe(
        filtered_df.style.format({
            'sales': '¥{:,.0f}',
            'visitors': '{:,}',
            'conversion_rate': '{:.2%}'
        }),
        use_container_width=True,
        height=300
    )
    
    # フッター
    st.divider()
    st.caption(f"最終更新: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")


if __name__ == "__main__":
    main()
