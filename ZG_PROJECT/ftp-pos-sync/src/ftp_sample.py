# src/ftp_sample.py
# 目的: FTP接続 → ファイル一覧 → サンプル1ファイルDL → 形式判定
# フェーズ: 1st Phase（調査）

from ftplib import FTP
from dotenv import load_dotenv
import os

# プロジェクトルートにある .env を読み込む
dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

FTP_HOST = os.environ.get("FTP_HOST")
FTP_USER = os.environ.get("FTP_USER")
FTP_PASS = os.environ.get("FTP_PASS")
FTP_PORT = int(os.environ.get("FTP_PORT", 21))

SAVE_DIR = os.path.join(os.path.dirname(__file__), '..', 'ftp_download')


def main():
    if not FTP_HOST or not FTP_USER or not FTP_PASS:
        print("【エラー】 .env ファイルに正しい接続情報が設定されていません。")
        return

    # ダウンロード先フォルダ作成
    os.makedirs(SAVE_DIR, exist_ok=True)

    # --- Step 1: FTP接続 ---
    print("=" * 50)
    print("Step 1: FTP接続中...")
    print("=" * 50)
    ftp = FTP()
    # 変更①: サーバーのShift-JISメッセージを受信するためエンコーディングを指定
    ftp.encoding = 'cp932'
    try:
        ftp.connect(FTP_HOST, FTP_PORT)
        ftp.login(FTP_USER, FTP_PASS)
        print(f"接続成功: {ftp.getwelcome()}")
    except Exception as e:
        print(f"接続失敗: {e}")
        return
    print()

    # --- Step 2: ディレクトリ構造確認 ---
    print("=" * 50)
    print("Step 2: カレントディレクトリ確認")
    print("=" * 50)
    print(f"現在のディレクトリ: {ftp.pwd()}")
    print()

    print("ファイル一覧（詳細）:")
    print("-" * 50)
    ftp.dir()
    print()

    print("ファイル名のみ:")
    print("-" * 50)
    files = ftp.nlst()
    for f in files:
        print(f"  {f}")
    print(f"\n合計: {len(files)} 件")
    print()

    # --- Step 3: サンプル1ファイルDL ---
    if len(files) == 0:
        print("ファイルが見つかりません。ディレクトリが違う可能性があります。")
        ftp.quit()
        return

    target = files[0]
    save_path = os.path.join(SAVE_DIR, target)
    print("=" * 50)
    print(f"Step 3: ダウンロード: {target}")
    print("=" * 50)

    try:
        with open(save_path, "wb") as f:
            ftp.retrbinary(f"RETR {target}", f.write)
    except Exception as e:
        print(f"ダウンロード失敗: {e}")
        ftp.quit()
        return

    file_size = os.path.getsize(save_path)
    print(f"保存先: {save_path}")
    print(f"ファイルサイズ: {file_size} bytes")
    print()

    # --- Step 4: バイナリ先頭で形式判定 ---
    print("=" * 50)
    print("Step 4: ファイル形式判定")
    print("=" * 50)

    with open(save_path, "rb") as f:
        header = f.read(32)

    print(f"先頭32バイト(hex): {header.hex()}")
    print(f"先頭32バイト(raw): {header}")
    print()

    # マジックバイト判定
    if len(header) >= 5 and header[2:5] == b'-lh':
        print("判定結果: LZH形式 ✅")
    elif header[:2] == b'PK':
        print("判定結果: ZIP形式")
    elif header[:2] == b'\x1f\x8b':
        print("判定結果: GZIP形式")
    elif header[:3] == b'BZh':
        print("判定結果: BZIP2形式")
    else:
        try:
            text = header.decode('utf-8')
            print("判定結果: 圧縮されていないテキストの可能性あり")
            print(f"先頭内容: {text}")
        except UnicodeDecodeError:
            try:
                text = header.decode('shift_jis')
                print("判定結果: 圧縮されていないテキスト(Shift-JIS)の可能性あり")
                print(f"先頭内容: {text}")
            except UnicodeDecodeError:
                print("判定結果: 不明な形式")

    print()

    # --- 切断 ---
    ftp.quit()
    print("FTP切断完了")
    print()
    print("=" * 50)
    print("次のステップ: この出力結果をそのまま全部貼ってください")
    print("=" * 50)


if __name__ == "__main__":
    main()
