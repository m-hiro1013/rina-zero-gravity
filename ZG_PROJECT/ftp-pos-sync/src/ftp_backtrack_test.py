from ftplib import FTP
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

print("--- 過去データへの遡りテスト ---")

# 2025年の各月を1日ずつチェック
for month in range(1, 13):
    pattern = f"*2025{month:02}01*"
    files = ftp.nlst(pattern)
    if files:
        print(f"【発見】 2025/{month:02}/01 のデータが {len(files)} 件あります")
    else:
        print(f"  2025/{month:02}/01: なし")

ftp.quit()
