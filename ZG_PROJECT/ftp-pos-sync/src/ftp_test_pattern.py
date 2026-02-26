from ftplib import FTP
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

print("【テスト】 店舗CD '00001' の全ファイル取得")
files = ftp.nlst("00001*")
print(f"件数: {len(files)}")
if files:
    print(f"最初: {files[0]}")
    print(f"最後: {files[-1]}")

ftp.quit()
