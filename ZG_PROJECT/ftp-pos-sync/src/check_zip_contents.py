from ftplib import FTP
from dotenv import load_dotenv
import os, io, zipfile

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

# 2月の最初のファイルを1つだけ取得して中身を見る
files = ftp.nlst("*20260201*TAS1.TXT")
if files:
    bio = io.BytesIO()
    ftp.retrbinary(f"RETR {files[0]}", bio.write)
    bio.seek(0)
    with zipfile.ZipFile(bio) as z:
        print(f"ファイル: {files[0]}")
        print(f"ZIP内のファイル一覧:")
        for name in z.namelist():
            info = z.getinfo(name)
            print(f"  {name} ({info.file_size} bytes)")

ftp.quit()
