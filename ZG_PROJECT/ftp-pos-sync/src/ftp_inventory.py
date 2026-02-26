from ftplib import FTP
from dotenv import load_dotenv
import os
import re

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

FTP_HOST = os.environ.get("FTP_HOST")
FTP_USER = os.environ.get("FTP_USER")
FTP_PASS = os.environ.get("FTP_PASS")
FTP_PORT = int(os.environ.get("FTP_PORT", 21))

def main():
    if not FTP_HOST or not FTP_USER or not FTP_PASS:
        print("【エラー】 接続情報がありません")
        return

    ftp = FTP()
    ftp.encoding = 'cp932'
    try:
        ftp.connect(FTP_HOST, FTP_PORT)
        ftp.login(FTP_USER, FTP_PASS)
        print("FTP接続成功")
    except Exception as e:
        print(f"接続エラー: {e}")
        return

    print("--- 調査開始 ---")
    
    # nlst() で全体を取得
    files = ftp.nlst()
    print(f"現在のディレクトリのファイル件数 (nlst): {len(files)}")
    
    if len(files) > 0:
        print(f"最初のファイル(nlst): {files[0]}")
        print(f"最後のファイル(nlst): {files[-1]}")
        
    # ワイルドカードを試す
    try:
        # ファイル名が 2024, 2025, 2026 などの年を含んでいるか仮説
        for year in ["2023", "2024", "2025", "2026"]:
            year_files = ftp.nlst(f"*{year}*")
            print(f"{year}が含まれるファイル数: {len(year_files)}")
    except Exception as e:
        print(f"ワイルドカード検索エラー: {e}")

    # mlsd() (Machine readable list for a directory) で詳細取得を試す
    print("--- MLSD コマンドテスト ---")
    try:
        mlsd_files = list(ftp.mlsd())
        print(f"MLSDで取得できた件数: {len(mlsd_files)}")
        if len(mlsd_files) > 0:
            # 日時でソート
            sorted_files = sorted(mlsd_files, key=lambda x: x[1].get('modify', ''))
            print(f"最古のファイル(mlsd): {sorted_files[0][0]}, 最終更新: {sorted_files[0][1].get('modify')}")
            print(f"最新のファイル(mlsd): {sorted_files[-1][0]}, 最終更新: {sorted_files[-1][1].get('modify')}")
    except Exception as e:
        print(f"MLSDコマンドは利用できない模様: {e}")

    ftp.quit()
    print("完了")

if __name__ == "__main__":
    main()
