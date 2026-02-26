from ftplib import FTP
from dotenv import load_dotenv
import os
import re

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

print("--- 年別・月別 本気調査 ---")

# ファイル名から日付を抽出する正規表現
# 店舗CDなどは可変っぽいので、8桁の数字+6桁の数字+TAS1.TXT を探す
date_pattern = re.compile(r"(\d{8})\d{6}TAS1\.TXT")

all_years = {}

for year in range(2020, 2027):
    # nlst のワイルドカードで絞り込み（1000件制限を回避するため）
    # 日付の入る位置にアスタリスクを置いてみる
    # 例: *2023????TAS1.TXT
    # ただしFTPサーバーによってワイルドカードの挙動が違うので慎重に
    
    pattern = f"*{year}*"
    try:
        files = ftp.nlst(pattern)
        actual_dates = []
        for f in files:
            match = date_pattern.search(f)
            if match:
                date_str = match.group(1)
                if date_str.startswith(str(year)):
                    actual_dates.append(date_str)
        
        if actual_dates:
            actual_dates.sort()
            print(f"【{year}年】 合計:{len(files)}件 (うち日付一致:{len(actual_dates)}件)")
            print(f"  最古: {actual_dates[0]}")
            print(f"  最新: {actual_dates[-1]}")
            all_years[year] = actual_dates[0]
        else:
            print(f"【{year}年】 0件")
            
    except Exception as e:
        print(f"【{year}年】 エラー: {e}")

if all_years:
    oldest_year = min(all_years.keys())
    print("\n" + "="*30)
    print(f"結論: サーバー上の最古データは 【{all_years[oldest_year]}】 ごろ！")
    print("="*30)

ftp.quit()
