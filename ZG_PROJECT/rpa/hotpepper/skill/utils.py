import re

def shorten_course_name(name: str, max_length: int = 45) -> str:
    """
    コース名が max_length を超える場合、段階的に短縮する魔法のロジック。💅
    """
    if len(name) <= max_length:
        return name

    # パターン1: 【】内の不要な結合を分離
    name = re.sub(
        r'【([^】]*?)[、♪・]((カジュアル|スタンダード|ラグジュアリー|プレミアム|ライト)コース)】.*',
        r'【\1】\2',
        name
    )
    if len(name) <= max_length:
        return name

    # パターン2 & 3: 種別名以降の説明文を削除
    name = re.sub(
        r'((カジュアル|スタンダード|ラグジュアリー|プレミアム|ライト)コース)[♪★＊\s].+',
        r'\1',
        name
    )
    if len(name) <= max_length:
        return name
    
    name = re.sub(
        r'((カジュアル|スタンダード|ラグジュアリー|プレミアム|ライト)コース)[^【】\s].*',
        r'\1',
        name
    )
    if len(name) <= max_length:
        return name

    # パターン4: 大喜楼スタイル再構築
    m = re.search(
        r'【歓送迎会[＊*](ライト|スタンダード|プレミアム|ラグジュアリー|カジュアル)】.+?([\d.]+h|[\d]+分)飲み放題付き[！!]?\s*全(\d+)品',
        name
    )
    if m:
        rank = m.group(1)
        duration = m.group(2)
        item_count = m.group(3)
        name = f'"歓送迎会"【{duration}飲み放題付き】{rank}コース 全{item_count}品'
        if len(name) <= max_length:
            return name

    # パターン5: 貸切プラン並び替え
    m = re.search(
        r'"歓送迎会(.+?)"(【[^】]+】)',
        name
    )
    if m:
        sub_name = m.group(1)
        bracket = m.group(2)
        name = f'"歓送迎会"{bracket}{sub_name}'
        if len(name) <= max_length:
            return name

    return name
