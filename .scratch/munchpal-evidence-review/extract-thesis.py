from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
import json

source = Path(r'C:\Users\DESKTOP-IOT0021\Downloads\! Skripsi_Muhammad Sahlan Shadiq_205150207111059.docx')
out = Path(__file__).parent
ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main', 'a': 'http://schemas.openxmlformats.org/drawingml/2006/main', 'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'}

def paragraph_text(node):
    parts = []
    for e in node.iter():
        if e.tag == '{'+ns['w']+'}t': parts.append(e.text or '')
        elif e.tag == '{'+ns['w']+'}tab': parts.append('\t')
        elif e.tag == '{'+ns['w']+'}br': parts.append('\n')
    return ''.join(parts)

with ZipFile(source) as z:
    doc = ET.fromstring(z.read('word/document.xml'))
    rel = ET.fromstring(z.read('word/_rels/document.xml.rels'))
    relationships = {e.attrib['Id']: e.attrib.get('Target', '') for e in rel}
    blocks = []
    for i, e in enumerate(doc.find('w:body', ns)):
        if e.tag == '{'+ns['w']+'}p':
            style = e.find('w:pPr/w:pStyle', ns)
            image_ids = [x.attrib.get('{'+ns['r']+'}embed') for x in e.findall('.//a:blip', ns)]
            text = paragraph_text(e)
            if not text.strip() and not image_ids: continue
            blocks.append({'block': i, 'type': 'paragraph', 'style': style.attrib.get('{'+ns['w']+'}val') if style is not None else None, 'text': text, 'images': [relationships.get(x) for x in image_ids]})
        elif e.tag == '{'+ns['w']+'}tbl':
            rows = []
            for row in e.findall('w:tr', ns):
                rows.append([' / '.join(paragraph_text(p) for p in cell.findall('w:p', ns)) for cell in row.findall('w:tc', ns)])
            blocks.append({'block': i, 'type': 'table', 'rows': rows, 'text': '\n'.join(' | '.join(row) for row in rows)})
    (out/'thesis-blocks.json').write_text(json.dumps(blocks,ensure_ascii=False,indent=2),encoding='utf-8')
    (out/'thesis-text.txt').write_text('\n\n'.join(f"[B{b['block']}] [{b['type']}] {b.get('style') or ''}\n{b['text']}" + (f"\nIMAGES: {b['images']}" if b.get('images') else '') for b in blocks),encoding='utf-8')
    print(json.dumps({'blocks':len(blocks),'tables':sum(b['type']=='table' for b in blocks),'images':sum(len(b.get('images',[])) for b in blocks),'characters':sum(len(b['text']) for b in blocks),'app_properties': z.read('docProps/app.xml').decode('utf-8') if 'docProps/app.xml' in z.namelist() else None},ensure_ascii=False))
