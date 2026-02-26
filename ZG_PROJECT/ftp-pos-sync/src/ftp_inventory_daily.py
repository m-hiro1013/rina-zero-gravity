from ftplib import FTP
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

for day in range(20, 27):
    pattern = f"*202602{day}*"
    files = ftp.nlst(pattern)
    print(f"{pattern} の件数: {len(files)}")
    if files:
        print(f"  例: {files[0]}")

ftp.quit()
