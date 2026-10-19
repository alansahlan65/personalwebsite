"""Prepare separate motion assets without changing the preserved Figma exports."""
from pathlib import Path
import base64
import copy
import hashlib
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PROJECT = ROOT / "public/demos/munchpal-opener"
SVG = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", SVG)
ET.register_namespace("xlink", XLINK)


def prepare(name, group, output, box=None, omit=()):
    source = ET.parse(PROJECT / f"sources/{name}.svg").getroot()
    node = next(e for e in source.iter() if e.get("id") == group)
    result = ET.Element(f"{{{SVG}}}svg", dict(source.attrib))
    if box:
        result.set("viewBox", " ".join(map(str, box)))
        result.set("width", str(box[2]))
        result.set("height", str(box[3]))
    content = copy.deepcopy(node)
    for parent in content.iter():
        for child in list(parent):
            if child.get("id") in omit:
                parent.remove(child)
    result.append(content)
    for defs in source.findall(f"{{{SVG}}}defs"):
        result.append(copy.deepcopy(defs))
    ET.ElementTree(result).write(PROJECT / f"assets/{output}.svg", encoding="utf-8", xml_declaration=True)


prepare("row", "Frame 1171274814", "food-row", omit=("Request Button (You)",))
prepare("row", "Request Button (You)", "request-button", (251, 0, 82, 20))
prepare("list", "#6 See All", "list")
prepare("report", "#39 Laporan", "report-original")
prepare("chat", "#11-3 Pesan - Request", "chat-original")

# Extract the actual embedded photographs. Resolving image fills locally avoids
# the browser discrepancy documented in the brief. No new imagery is generated.
images = {
    "chat": ["alan-avatar", "janu-avatar", "meal-photo"],
    "report": ["donation-food-photo", "pickup-photo"],
}
for source_name, names in images.items():
    source = ET.parse(PROJECT / f"sources/{source_name}.svg").getroot()
    for element, name in zip(source.iter(f"{{{SVG}}}image"), names):
        href = element.get(f"{{{XLINK}}}href") or element.get("href")
        header, data = href.split(",", 1)
        extension = "jpg" if "jpeg" in header else "png"
        (PROJECT / f"assets/{name}.{extension}").write_bytes(base64.b64decode(data))

entries = []
nodes = {"row": "322:5673", "list": "322:5668", "report": "322:7014", "confirm": "322:5837", "accepted": "322:6041", "bulk": "322:6939", "chat": "322:7676"}
for file in sorted((PROJECT / "sources").glob("*.svg")):
    data = file.read_bytes()
    svg = ET.fromstring(data)
    entries.append({"file": "sources/" + file.name, "nodeId": nodes[file.stem], "exportedAt": "2026-10-19", "viewBox": svg.get("viewBox"), "sizeBytes": len(data), "sha256": hashlib.sha256(data).hexdigest()})
manifest = {
    "fileKey": "nzrjEnmrDqfXUPLawnxmEn",
    "sourceExports": entries,
    "preparation": "sources/ preserves refreshed Figma SVGs byte for byte. assets/ isolates native groups and decodes embedded original photographs. Native row button is isolated for tap motion. No photo replacements.",
    "identity": {"file": "assets/brand.svg", "nodeId": "307:38487", "provenance": "Unchanged original wordmark from ../munchpal/assets/brand.svg"},
    "illustration": {"file": "assets/people-illustration.svg", "provenance": "Original vector people authored for the user's requested illustrated opening. An inline copy supplies independently animated body, head, thumb and arm groups. Phone imagery is the original source Food List. These figures are decorative motion-study artwork, separate from research evidence."},
    "font": {"family": "Rubik", "source": "https://github.com/google/fonts/tree/main/ofl/rubik", "file": "assets/Rubik-Variable.ttf", "license": "assets/Rubik-OFL.txt", "sha256": hashlib.sha256((PROJECT / "assets/Rubik-Variable.ttf").read_bytes()).hexdigest()},
    "adaptations": {
        "confirmation": ["Request this food?", "Send request"],
        "success": "Request sent",
        "accepted": ["Janu Suryajana accepted your request", "Send message"],
        "reply": "Hi Alan, yes, it is. You can pick it up.",
        "bulk": ["Garda Pangan has picked up your donation", "View pickup report"],
        "report": ["Donation report", "Food quantity", "Picked up", "20 Nov 2024", "15:00 WIB"],
        "contrast": "The report action uses #008354, a darker source-green variant for AA white-text contrast. Report headings retain #008A57.",
        "method": "Separate HTML motion-study components use the brief-authorized copy. The native source layout, identities, imagery, quantity 50, pickup address, date and timezone are preserved. Source SVGs remain unmodified."
    }
}
(PROJECT / "assets/manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
print(f"Prepared assets; preserved {len(entries)} source exports")
