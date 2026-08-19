# -*- coding: utf-8 -*-
"""把「同一課本頁的第 2 張以後」投影片右上角那塊『P.xx｜◀ ⌂ ✕』塗掉。

網站上同一個課本頁的投影片是疊在一起顯示的，每張都印一次頁碼和 PPT 的
上一頁／首頁／結束按鈕會很吵，而且那三顆按鈕在網頁上根本不能按。留第一
張的就夠了。

用法（在 taigi-0811 底下）：
    python tools/mask_repeat_page_header.py          # 實際塗掉
    python tools/mask_repeat_page_header.py --dry    # 只列出會動到哪些檔

原圖如果要還原，從 git 歷史取回即可（這支是就地修改）。
"""
import io, re, sys, os
from collections import Counter
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'src', 'data', 'phonicsData.ts')
DECKS = [('SLIDE_GROUPS', 'slides'), ('SLIDE_GROUPS_PRACTICE', 'slides-practice')]

# 右上角那塊的搜尋範圍：頁碼與按鈕固定在 y 64~106、x 1100 以右（1600x900 的圖）
BAND = (1050, 50, 1600, 120)
PAD = 14


def groups_from_data(name):
    src = io.open(DATA, encoding='utf-8').read()
    blk = src.split('export const %s: SlideGroup[] = [' % name)[1].split('\n];')[0]
    return [[int(x) for x in re.findall(r'\d+', m)] for m in re.findall(r'slides: \[([^\]]*)\]', blk)]


def mask(path, dry=False):
    im = Image.open(path).convert('RGB')
    W, H = im.size
    px = im.load()
    x0, y0, x1, y1 = BAND
    x1, y1 = min(x1, W), min(y1, H)
    minx, miny, maxx, maxy = W, H, 0, 0
    for y in range(y0, y1):
        for x in range(x0, x1):
            r, g, b = px[x, y]
            if r + g + b < 330:                     # 深色＝頁碼文字或黑色圓鈕
                minx, miny = min(minx, x), min(miny, y)
                maxx, maxy = max(maxx, x), max(maxy, y)
    if maxx == 0:
        return None                                  # 這張右上角本來就沒東西
    bx0, by0 = max(0, minx - PAD), max(0, miny - PAD)
    bx1, by1 = min(W, maxx + PAD + 1), min(H, maxy + PAD + 1)
    # 底色取這一塊裡最常出現的顏色（背景一定佔多數）
    bg = Counter(px[x, y] for y in range(by0, by1, 2) for x in range(bx0, bx1, 2)).most_common(1)[0][0]
    # 保險：只塗「長得像頁碼列」的那一塊。像投影片 13 那種整頁放大的深色截圖，
    # 偵測到的範圍會整個歪掉，寧可跳過也不要在內容上蓋一塊色塊。
    if not (1060 <= bx0 and bx1 <= 1580 and by0 >= 30 and by1 <= 135):
        return 'SKIP %s' % ((bx0, by0, bx1, by1),)
    if not dry:
        im.paste(bg, (bx0, by0, bx1, by1))
        im.save(path)
    return (bx0, by0, bx1, by1, bg)


def main():
    dry = '--dry' in sys.argv
    total = 0
    for name, folder in DECKS:
        for g in groups_from_data(name):
            for n in g[1:]:                          # 第 2 張以後
                path = os.path.join(ROOT, 'public', 'images', 'phonics', folder, 'slide-%03d.png' % n)
                box = mask(path, dry)
                total += 1
                print('%s/slide-%03d.png  %s' % (folder, n, box or '右上角沒東西，略過'))
    print('%s %d 張' % ('（試跑）會處理' if dry else '處理完成', total))


if __name__ == '__main__':
    main()
