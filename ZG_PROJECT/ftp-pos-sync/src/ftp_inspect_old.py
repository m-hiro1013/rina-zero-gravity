from ftplib import FTP
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

print("--- ターゲット検索 ---")

for year in ["2023", "2024", "2025"]:
    print(f"\n【{year}年キーワードのファイル】")
    files = ftp.nlst(f"*{year}*")
    for f in files:
        print(f"  {f}")

ftp.quit()
