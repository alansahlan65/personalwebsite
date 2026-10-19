from pathlib import Path
from PIL import Image
import json, hashlib
files = ['public/images/munchpal-cover.webp','public/images/munchpal-flow.webp','public/images/munchpal-home.webp','public/images/munchpal-feedback.webp','app/work/munchpal/opengraph-image.jpg']
result = []
for name in files:
    current = Path(name)
    original = Path('.scratch/website-review/munchpal-redesign/before') / current.name
    a, b = Image.open(original).convert('RGBA'), Image.open(current).convert('RGBA')
    assert a.size == b.size and a.tobytes() == b.tobytes(), name
    sidecar = Path(name + '.json')
    data = json.loads(sidecar.read_text(encoding='utf-8-sig'))
    data['sha256'] = hashlib.sha256(current.read_bytes()).hexdigest()
    data['decoded_pixel_sha256'] = hashlib.sha256(b.tobytes()).hexdigest()
    data['origin_metadata_added'] = '2026-10-02, original image pixels unchanged'
    sidecar.write_text(json.dumps(data, indent=2) + '\n', encoding='utf-8')
    result.append({'image': name, 'original_pixels_unchanged': True})
Path('.scratch/website-review/munchpal-redesign/retained-provenance-check.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
print(json.dumps(result))
