"""
メニューCD・部門CD・分類CDと名称のダブり・不一致を調査するスクリプト✨
FTPから直接取ってきてローカルで高速分析するよ！
"""
import zipfile, csv, io, os
from ftplib import FTP
from dotenv import load_dotenv
from collections import defaultdict

dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(dotenv_path)

def main():
    ftp = FTP()
    ftp.encoding = 'cp932'
    ftp.connect(os.environ["FTP_HOST"], int(os.environ.get("FTP_PORT", 21)))
    ftp.login(os.environ["FTP_USER"], os.environ["FTP_PASS"])
    
    files = ftp.nlst("*202602*TAS1.TXT")
    files.sort()
    print(f"対象ファイル数: {len(files)} 件")
    
    # CD → 名称の対応を集める
    check_targets = [
        ("部門CD", "部門名称", "部門"),
        ("分類CD", "分類名称", "分類"),
        ("ﾒﾆｭｰCD", "ﾒﾆｭｰ名称", "メニュー"),
    ]
    
    # { label: { cd: { name: count } } }
    cd_to_names = {label: defaultdict(lambda: defaultdict(int)) for _, _, label in check_targets}
    # { label: { name: { cd: count } } }
    name_to_cds = {label: defaultdict(lambda: defaultdict(int)) for _, _, label in check_targets}
    
    total_rows = 0
    
    for i, filename in enumerate(files):
        bio = io.BytesIO()
        ftp.retrbinary(f"RETR {filename}", bio.write)
        bio.seek(0)
        
        try:
            with zipfile.ZipFile(bio) as z:
                item_csv = next((n for n in z.namelist() if n.upper().endswith('_ITEM.CSV')), None)
                if not item_csv:
                    continue
                with z.open(item_csv) as f:
                    content = f.read().decode('cp932')
                    reader = csv.reader(io.StringIO(content))
                    lines = list(reader)
                    if len(lines) < 3:
                        continue
                    
                    headers = [h.strip() for h in lines[1]]
                    col_map = {h: idx for idx, h in enumerate(headers)}
                    
                    for row in lines[2:]:
                        total_rows += 1
                        for cd_col, name_col, label in check_targets:
                            if cd_col in col_map and name_col in col_map:
                                cd = str(row[col_map[cd_col]]).strip()
                                name = str(row[col_map[name_col]]).strip()
                                cd_to_names[label][cd][name] += 1
                                name_to_cds[label][name][cd] += 1
        except Exception as e:
            print(f"  スキップ: {filename} ({e})")
        
        # 進捗表示（50ファイルごと）
        if (i + 1) % 50 == 0:
            print(f"  進捗: {i+1}/{len(files)} ファイル処理済み")
    
    ftp.quit()
    print(f"\n分析対象: {total_rows} 行")
    print("=" * 60)
    
    # レポート出力
    issue_count = 0
    
    for _, _, label in check_targets:
        print(f"\n{'='*60}")
        print(f"【{label}】の監査結果")
        print(f"{'='*60}")
        
        # 1つのCDに複数の名称
        problems_cd = {cd: names for cd, names in cd_to_names[label].items() if len(names) > 1}
        if problems_cd:
            print(f"\n⚠️ 1つのCDに複数の名称があるケース: {len(problems_cd)} 件")
            for cd, names in sorted(problems_cd.items()):
                detail = " / ".join([f'"{n}" ({c}件)' for n, c in names.items()])
                print(f"  CD={cd}: {detail}")
                issue_count += 1
        else:
            print(f"\n✅ CDの重複なし！")
        
        # 1つの名称に複数のCD
        problems_name = {name: cds for name, cds in name_to_cds[label].items() if len(cds) > 1}
        if problems_name:
            print(f"\n⚠️ 1つの名称に複数のCDがあるケース: {len(problems_name)} 件")
            for name, cds in sorted(problems_name.items()):
                detail = " / ".join([f'CD={c} ({cnt}件)' for c, cnt in cds.items()])
                print(f'  "{name}": {detail}')
                issue_count += 1
        else:
            print(f"\n✅ 名称の重複なし！")
        
        # サマリー
        print(f"\n📊 ユニークCD数: {len(cd_to_names[label])}, ユニーク名称数: {len(name_to_cds[label])}")
    
    print(f"\n{'='*60}")
    if issue_count == 0:
        print("🎉 全チェック合格！ダブりも不一致もゼロ！")
    else:
        print(f"⚠️ 要確認: 合計 {issue_count} 件の不一致が見つかったよ！")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()
