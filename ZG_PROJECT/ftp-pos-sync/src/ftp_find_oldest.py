from ftplib import FTP
from dotenv import load_dotenv
import os

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

ftp = FTP()
ftp.encoding = 'cp932'
ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])

print("--- 最古のファイルを探す旅 ---")

# 過去10年から現在まで順に検索
for year in range(2015, 2027):
    pattern = f"*{year}*"
    try:
        files = ftp.nlst(pattern)
        if files:
            print(f"【発見！】 {year}年: {len(files)}件")
            # 取得した中で名前順にソート（ファイル名に日時が入っている前提）
            files.sort()
            print(f"  最古のファイル(候補): {files[0]}")
            # 最初に見つけた年が最古のはずなので終了
            break
        else:
            print(f"  {year}年: なし")
    except Exception as e:
        print(f"  {year}年: 検索エラー ({e})")

ftp.quit()
