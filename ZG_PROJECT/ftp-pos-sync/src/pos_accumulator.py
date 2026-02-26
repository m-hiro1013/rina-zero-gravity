import zipfile
import csv
import io
import os
import requests
import json
import time
from ftplib import FTP
from dotenv import load_dotenv

# .env 読み込み
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

# 設定
FTP_HOST = os.environ.get("FTP_HOST")
FTP_USER = os.environ.get("FTP_USER")
FTP_PASS = os.environ.get("FTP_PASS")
FTP_PORT = int(os.environ.get("FTP_PORT", 21))
GAS_URL = os.environ.get("GAS_URL")

def get_ftp_files(pattern="*202602*TAS1.TXT"):
    # セキュリティ: ホスト名はマスクしてログ出力
    print(f"FTP接続中: ***.***.***")
    ftp = FTP()
    ftp.encoding = 'cp932'
    ftp.connect(FTP_HOST, FTP_PORT)
    ftp.login(FTP_USER, FTP_PASS)
    files = ftp.nlst(pattern)
    # 名前順にソートして時系列で処理しやすくする
    files.sort()
    return ftp, files

def process_ftp_file(ftp, filename):
    print(f"  DL & Extract: {filename}")
    bio = io.BytesIO()
    ftp.retrbinary(f"RETR {filename}", bio.write)
    bio.seek(0)
    
    rows_extracted = []
    headers = []
    
    try:
        with zipfile.ZipFile(bio) as z:
            # *_ITEM.CSV を探す（末尾一致・大文字小文字無視）
            item_csv_name = next((n for n in z.namelist() if n.upper().endswith('_ITEM.CSV')), None)
            if item_csv_name:
                with z.open(item_csv_name) as f:
                    content = f.read().decode('cp932')
                    reader = csv.reader(io.StringIO(content))
                    lines = list(reader)
                    # 1行目: メタ, 2行目: 見出し, 3行目以降: データ
                    if len(lines) >= 2:
                        headers = lines[1]
                        rows_extracted = lines[2:]
            else:
                print(f"    ⚠️ ITEM.CSV not found in {filename}")
    except Exception as e:
        print(f"    ❌ Error processing {filename}: {e}")
        
    return headers, rows_extracted

def send_to_gas(rows, is_first=False):
    """GASにデータを送信する。成功したらTrue、失敗したらFalseを返す。"""
    if not rows:
        return True
    
    payload = {
        "clear": is_first,
        "rows": rows
    }
    
    # GASへの送信（タイムアウトを考慮）
    try:
        response = requests.post(GAS_URL, json=payload, timeout=60)
        result = response.json()
        if result.get("status") == "success":
            print(f"    ✅ GAS送信成功: {len(rows)}件")
            return True
        else:
            print(f"    ❌ GASエラー: {result.get('message')}")
            return False
    except Exception as e:
        print(f"    ❌ 送信失敗: {e}")
        return False

def main():
    # 必須環境変数の事前検証
    missing = [k for k in ["FTP_HOST", "FTP_USER", "FTP_PASS", "GAS_URL"] if not os.environ.get(k)]
    if missing:
        print(f"【エラー】 以下の環境変数が .env に設定されていません: {', '.join(missing)}")
        return

    ftp, files = get_ftp_files()
    print(f"2月の対象ファイル数: {len(files)} 件")
    
    if not files:
        print("対象ファイルがありません。")
        ftp.quit()
        return

    # 全ファイルを一気に送るとGAS側がタイムアウト(30秒)する可能性があるので、
    # 1ファイル（20件前後）ごとに逐次送信するスタイルにするよ！
    # 初回だけ「clear: true」でシートをリセットするね。
    
    processed_files = 0
    total_rows = 0
    failed_files = 0
    is_first_file = True
    
    # カラム見出しは最初のファイルから取得して1回だけ送る（TODO: 必要であれば）
    # 今回はA案「全部つなげる」なので、ヘッダーも最初の1回だけ送る設計にするね。
    
    for filename in files:
        processed_files += 1
        headers, rows = process_ftp_file(ftp, filename)
        
        if rows:
            # 最初の1回だけ見出しを付ける
            to_send = []
            if is_first_file:
                to_send.append(headers)
            to_send.extend(rows)
            
            success = send_to_gas(to_send, is_first=is_first_file)
            
            if success:
                total_rows += len(rows)
                is_first_file = False
            else:
                failed_files += 1

    ftp.quit()
    print("-" * 50)
    print(f"ミッション完了！🎉")
    print(f"処理ファイル数: {processed_files}")
    print(f"成功データ件数: {total_rows}")
    if failed_files > 0:
        print(f"⚠️ 失敗ファイル数: {failed_files} 件（再実行を検討してください）")
    print("-" * 50)

if __name__ == "__main__":
    main()
