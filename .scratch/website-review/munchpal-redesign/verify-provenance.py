from pathlib import Path
from PIL import Image
import json, hashlib
pairs = [('image120.png','munchpal-availability-before.png'),('image121.png','munchpal-availability-after.png'),('image128.png','munchpal-message-before.png'),('image129.png','munchpal-message-after.png')]
checks = []
for source_name, public_name in pairs:
    source = Path('.scratch/runtime/munchpal-research/figures') / source_name
    public = Path('public/images') / public_name
    a, b = Image.open(source).convert('RGBA'), Image.open(public).convert('RGBA')
    assert a.size == b.size == (388, 834)
    assert a.tobytes() == b.tobytes(), public_name
    sidecar = Path(str(public) + '.json')
    record = json.loads(sidecar.read_text(encoding='utf-8-sig'))
    record['original_embedded_png_sha256'] = hashlib.sha256(source.read_bytes()).hexdigest()
    record['sha256'] = hashlib.sha256(public.read_bytes()).hexdigest()
    record['decoded_pixel_sha256'] = hashlib.sha256(b.tobytes()).hexdigest()
    record['method'] = 'Original embedded PNG with origin metadata added. Decoded image pixels unchanged; no image generation or reconstruction.'
    sidecar.write_text(json.dumps(record, indent=2) + '\n', encoding='utf-8')
    checks.append({'image': public_name, 'original_pixels_unchanged': True, 'dimensions': list(b.size)})
Path('.scratch/website-review/munchpal-redesign/provenance-check.json').write_text(json.dumps(checks, indent=2) + '\n', encoding='utf-8')
print(json.dumps(checks))
