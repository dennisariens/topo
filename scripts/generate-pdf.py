"""Create the printable booklet from print.html's generated, canonical map content."""
import base64
import hashlib
import io
import json
import re
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas

ROOT = Path(__file__).resolve().parent.parent
SOURCE = (ROOT / 'print.html').read_text()
DATA = json.loads(re.search(r'const DATA=(\{.*?\});\nconst byId=', SOURCE, re.S).group(1))
ITEMS = {item['id']: item for item in DATA['items']}
GROUPS = [group for group in DATA['groups'] if group['key'] != 'all']
DESTINATION = ROOT / 'output/pdf/topo-italie-printboek.pdf'
DESTINATION.parent.mkdir(parents=True, exist_ok=True)

FONT = next((str(p) for p in [Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'), Path('/System/Library/Fonts/Supplemental/Arial.ttf')] if p.exists()), None)
FONT_BOLD = next((str(p) for p in [Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'), Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf')] if p.exists()), None)
if not FONT or not FONT_BOLD:
    raise RuntimeError('Install DejaVu Sans fonts to generate the booklet')
pdfmetrics.registerFont(TTFont('Topo', FONT))
pdfmetrics.registerFont(TTFont('TopoBold', FONT_BOLD))

PAGE_W, PAGE_H = A4
PHOTO = ImageReader(io.BytesIO(base64.b64decode(DATA['photo'])))
MAP_X, MAP_Y, MAP_W = 27, 174, 350
MAP_H = MAP_W * 1235 / 890
TABLE_X, TABLE_W = 390, 176


def pxy(x, y):
    return MAP_X + MAP_W * x / 890, MAP_Y + MAP_H * (1 - y / 1235)


def draw_header(pdf, group, mode, number, total):
    pdf.setFillColor(colors.HexColor('#122d37'))
    pdf.setFont('TopoBold', 18)
    pdf.drawString(27, PAGE_H - 47, 'Topo Italië')
    pdf.setFont('Topo', 10)
    pdf.setFillColor(colors.HexColor('#4d6470'))
    titles = {'learn': 'Leerkaart · antwoorden', 'name': 'Oefening · schrijf de naam', 'locate': 'Oefening · zoek de plek'}
    pdf.drawRightString(PAGE_W - 27, PAGE_H - 45, titles[mode])
    pdf.setStrokeColor(colors.HexColor('#2b6571'))
    pdf.setLineWidth(1.2)
    pdf.line(27, PAGE_H - 57, PAGE_W - 27, PAGE_H - 57)
    pdf.setFont('TopoBold', 15)
    pdf.setFillColor(colors.HexColor('#233943'))
    pdf.drawString(27, PAGE_H - 81, group['title'])
    pdf.setFont('Topo', 9)
    pdf.drawString(27, PAGE_H - 99, 'Naam: _________________________________     Datum: ______________')
    pdf.drawRightString(PAGE_W - 27, 34, f'{number} / {total}')
    pdf.setFillColor(colors.HexColor('#586b70'))
    pdf.setFont('Topo', 7.7)
    pdf.drawString(27, 34, 'V-labels zijn tijdelijke vragen. Leer de plekken en namen, geen schoolcodes.')


def draw_path(pdf, shape, fill, stroke, width=1):
    """Render the canonical SVG M/L/Q/Z paths; Q is converted exactly to cubic."""
    tokens = re.findall(r'[MLQZ]|-?\d+(?:\.\d+)?', shape)
    if re.search(r'[A-Za-z]', re.sub(r'[MLQZ]', '', shape)):
        raise ValueError('Unsupported geographic path command')
    path=pdf.beginPath(); n=0; current=(0,0); previous=None
    while n<len(tokens):
        command=tokens[n];n+=1
        if command not in ('M','L','Q','Z'):
            n-=1;command=previous
        previous='L' if command=='M' else command
        if command in ('M','L'):
            current=(float(tokens[n]),float(tokens[n+1]));n+=2
            (path.moveTo if command=='M' else path.lineTo)(*pxy(*current))
        elif command=='Q':
            q=(float(tokens[n]),float(tokens[n+1]));end=(float(tokens[n+2]),float(tokens[n+3]));n+=4
            c1=tuple(current[k]+2*(q[k]-current[k])/3 for k in (0,1))
            c2=tuple(end[k]+2*(q[k]-end[k])/3 for k in (0,1))
            path.curveTo(*pxy(*c1),*pxy(*c2),*pxy(*end));current=end
        elif command=='Z':path.close()
        else:raise ValueError('Unexpected SVG coordinate without command')
    if fill:pdf.setFillColor(colors.HexColor(fill))
    pdf.setStrokeColor(colors.HexColor(stroke));pdf.setLineWidth(width)
    pdf.drawPath(path,fill=int(bool(fill)),stroke=1)


def draw_clean_map(pdf):
    pdf.saveState()
    clip=pdf.beginPath();clip.rect(MAP_X,MAP_Y,MAP_W,MAP_H);pdf.clipPath(clip,stroke=0)
    pdf.setFillColor(colors.HexColor('#eaf3f5'));pdf.rect(MAP_X,MAP_Y,MAP_W,MAP_H,fill=1,stroke=0)
    for i in DATA['items']:
        if i['kind']=='water':draw_path(pdf,i['shape'],'#d6edf2','#a5c7ca',.4)
    for shape in DATA['context'].values():draw_path(pdf,shape,'#f4f2e9','#b8beb2',.5)
    countries=['area-i','area-j','area-k','area-l','area-m']
    for i in DATA['items']:
        if i['id'] in countries:draw_path(pdf,i['shape'],'#eee8d8','#9caa9d',.6)
    draw_path(pdf,DATA['italy'],'#f5ead2','#9b9d8f',.8)
    for i in DATA['items']:
        if i['id'] in ['area-a','area-b']:draw_path(pdf,i['shape'],'#f5ead2','#9b9d8f',.8)
        elif i['id'] in ['area-c','area-d','area-g','area-h']:draw_path(pdf,i['shape'],'#e9cda2','#bd9877',.6)
        elif i['kind']=='river':draw_path(pdf,i['shape'],None,'#669eaf',1.5)
    for i in DATA['items']:
        if i['kind']=='city' or i['id'] in ['area-e','area-f','area-n','area-o']:
            pdf.setFillColor(colors.HexColor('#a44435'));pdf.setStrokeColor(colors.white);pdf.setLineWidth(.5)
            pdf.circle(*pxy(i['px'],i['py']),1.3 if i['id']=='area-o' else 2.2,fill=1,stroke=1)
    pdf.restoreState()


def draw_map(pdf, items, mode, group_key):
    draw_clean_map(pdf)
    pdf.setStrokeColor(colors.HexColor('#728883'))
    pdf.rect(MAP_X, MAP_Y, MAP_W, MAP_H, fill=0, stroke=1)
    if mode == 'locate':
        return
    for index, item in enumerate(items):
        if item['kind'] == 'city' or item['id'] in ['area-e','area-f','area-n','area-o']:
            x, y = DATA['printLabels'][group_key][item['id']]
            w = 50
            end_x = x - w / 2 if x > item['px'] else x + w / 2 if x < item['px'] else x
            end_y = (y - 21 if y > item['py'] else y + 21) if x == item['px'] else y
            dot_x, dot_y = pxy(item['px'], item['py'])
            edge_x, edge_y = pxy(end_x, end_y)
            pdf.setStrokeColor(colors.HexColor('#214e5b'))
            pdf.setLineWidth(1)
            pdf.line(dot_x, dot_y, edge_x, edge_y)
        else:
            x, y = DATA['anchors'][item['id']]
            if item['id'] == 'area-o':
                x -= 8
        xx, yy = pxy(x, y)
        text = 'V' + str(index + 1)
        width = max(17, pdfmetrics.stringWidth(text, 'TopoBold', 10) + 9)
        xx = min(MAP_X + MAP_W - width / 2 - 3, max(MAP_X + width / 2 + 3, xx))
        yy = min(MAP_Y + MAP_H - 10, max(MAP_Y + 10, yy))
        pdf.setFillColor(colors.white)
        pdf.setStrokeColor(colors.HexColor('#3a646c'))
        pdf.roundRect(xx - width / 2, yy - 7, width, 17, 4, fill=1, stroke=1)
        pdf.setFillColor(colors.HexColor('#193742'))
        pdf.setFont('TopoBold', 10)
        pdf.drawCentredString(xx, yy - 2, text)


def draw_answers(pdf, items, mode):
    y = MAP_Y + MAP_H - 4
    pdf.setFillColor(colors.HexColor('#405d67'))
    pdf.setFont('TopoBold', 9)
    pdf.drawString(TABLE_X, y, 'Zoek de plek' if mode == 'locate' else 'Kaartplek')
    pdf.drawString(TABLE_X + (0 if mode == 'locate' else 38), y - 15, 'Zet het V-label op de kaart' if mode == 'locate' else 'Schrijf de naam:')
    y -= 38
    for index, item in enumerate(items):
        if mode == 'locate':
            pdf.setFont('TopoBold', 9.1)
            pdf.setFillColor(colors.HexColor('#1a3037'))
            pdf.drawString(TABLE_X, y, 'V' + str(index + 1) + '  ' + item['name'])
            pdf.setStrokeColor(colors.HexColor('#b1bcba'))
            pdf.line(TABLE_X, y - 17, TABLE_X + TABLE_W, y - 17)
        else:
            pdf.setFont('TopoBold', 10)
            pdf.setFillColor(colors.HexColor('#23434e'))
            pdf.drawString(TABLE_X, y, 'V' + str(index + 1))
            if mode == 'learn':
                pdf.setFont('Topo', 8.5)
                pdf.drawString(TABLE_X + 26, y, item['name'])
            else:
                pdf.setStrokeColor(colors.HexColor('#b1bcba'))
                pdf.line(TABLE_X + 28, y - 2, TABLE_X + TABLE_W, y - 2)
        pdf.setStrokeColor(colors.HexColor('#d9e0dc'))
        pdf.line(TABLE_X, y - 26, TABLE_X + TABLE_W, y - 26)
        y -= 46
    pdf.setFillColor(colors.HexColor('#4c656d'))
    pdf.setFont('Topo', 8)
    if mode == 'locate':
        pdf.drawString(TABLE_X, max(y - 5, MAP_Y + 22), 'Zoek de juiste plek en')
        pdf.drawString(TABLE_X, max(y - 17, MAP_Y + 10), 'zet het V-label erbij.')


def draw_cover(pdf, total):
    pdf.setFillColor(colors.HexColor('#153640'))
    pdf.rect(0, PAGE_H - 178, PAGE_W, 178, fill=1, stroke=0)
    pdf.setFillColor(colors.white)
    pdf.setFont('TopoBold', 30)
    pdf.drawString(34, PAGE_H - 75, 'Topo Italië')
    pdf.setFont('Topo', 14)
    pdf.drawString(34, PAGE_H - 108, 'Leerkaarten en twee soorten toetsen')
    pdf.setFont('Topo', 10)
    pdf.drawString(34, PAGE_H - 136, '45 namen · 11 groepen · dezelfde geografische kaart als de app')
    pdf.setFillColor(colors.HexColor('#1e3942'))
    pdf.setFont('TopoBold', 12)
    pdf.drawString(34, PAGE_H - 220, 'Welke pagina print je?')
    modes = [('Leerkaarten met antwoorden', 2), ('Oefening: kaartplek → naam', 13), ('Oefening: naam → kaartplek', 24)]
    for index, (name, first_page) in enumerate(modes):
        top = PAGE_H - 255 - index * 139
        pdf.setFillColor(colors.HexColor('#eaf3f3'))
        pdf.roundRect(34, top - 116, PAGE_W - 68, 120, 9, fill=1, stroke=0)
        pdf.setFillColor(colors.HexColor('#193942'))
        pdf.setFont('TopoBold', 12)
        pdf.drawString(47, top - 19, f'{name}  ·  p. {first_page}-{first_page + len(GROUPS) - 1}')
        pdf.setFont('Topo', 8.7)
        for row, group in enumerate(GROUPS):
            column = 0 if row < 6 else 1
            row_in_column = row if row < 6 else row - 6
            x = 48 + column * 256
            y = top - 40 - row_in_column * 12
            pdf.drawString(x, y, f'{first_page + row}. {group["title"]}')
    pdf.setFillColor(colors.HexColor('#526974'))
    pdf.setFont('Topo', 9)
    pdf.drawString(34, 42, 'Bergen, streken en zeezones zijn schematisch. V-labels zijn tijdelijke vragen.')
    pdf.drawRightString(PAGE_W - 27, 27, f'1 / {total}')


def main():
    total = 2 + 3 * len(GROUPS)
    pdf = canvas.Canvas(str(DESTINATION), pagesize=A4, pageCompression=1)
    pdf.setTitle('Topo Italië - printboek met leerkaarten en toetsen')
    draw_cover(pdf, total)
    pdf.showPage()
    number = 1
    for mode in ('learn', 'name', 'locate'):
        for group in GROUPS:
            number += 1
            items = [ITEMS[item_id] for item_id in group['ids']]
            draw_header(pdf, group, mode, number, total)
            draw_map(pdf, items, mode, group['key'])
            draw_answers(pdf, items, mode)
            pdf.showPage()
    pdf.setFont('TopoBold', 16)
    pdf.drawString(27, PAGE_H-45, 'Origineel schoolblad · ter vergelijking')
    pdf.setFont('Topo', 9)
    pdf.drawString(27, PAGE_H-65, 'Eigen perspectief en schaal; gebruik de heldere kaart voor de oefeningen.')
    pdf.drawImage(PHOTO, 65, 70, width=460, height=460*1235/890, preserveAspectRatio=True)
    pdf.drawRightString(PAGE_W-27, 34, f'{total} / {total}')
    pdf.showPage()
    pdf.save()
    (DESTINATION.parent / 'print-source.sha256').write_text(hashlib.sha256(SOURCE.encode()).hexdigest() + '\n')
    print(f'Created {DESTINATION} ({total} pages)')


if __name__ == '__main__':
    main()
