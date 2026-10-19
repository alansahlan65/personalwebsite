from pathlib import Path
import json
for name in ['munchpal-cover.webp','munchpal-flow.webp','munchpal-home.webp','munchpal-feedback.webp']:
    before = json.loads((Path('.scratch/website-review/munchpal-redesign/before') / (name + '.json.txt')).read_text(encoding='utf-8-sig'))
    current = Path('public/images') / (name + '.json')
    after = json.loads(current.read_text(encoding='utf-8-sig'))
    current.write_text(json.dumps({**before, **after}, indent=2) + '\n', encoding='utf-8')
print('Preserved original source, page, crop and preparation fields alongside embedded-origin fallback metadata.')
