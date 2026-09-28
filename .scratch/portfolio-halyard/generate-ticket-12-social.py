"""Render share cards from approved local portfolio imagery."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
BLUE = "#245BFF"
INK = "#20221F"
CREAM = "#F6F5F1"
FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(FONT_BOLD if bold else FONT_REGULAR, size)


def save(image: Image.Image, target: Path) -> None:
    image.convert("RGB").save(target, "JPEG", quality=90, optimize=True, progressive=True)


card = Image.new("RGB", (1200, 630), CREAM)
draw = ImageDraw.Draw(card)
portrait = Image.open(ROOT / "public/images/alan-portrait.webp").convert("RGB")
portrait = ImageOps.fit(portrait, (460, 550), centering=(0.48, 0.8))
card.paste(portrait, (690, 40))
draw.rectangle((1130, 40, 1150, 120), fill=BLUE)
draw.rectangle((1070, 40, 1150, 60), fill=BLUE)
logo = Image.open(ROOT / "public/images/alan-logo.png").convert("RGBA")
logo.thumbnail((84, 84), Image.Resampling.LANCZOS)
card.paste(logo, (55, 43), logo)
draw.text((55, 205), "Alan", font=font(102, True), fill=INK)
draw.text((55, 302), "Sahlan.", font=font(102, True), fill=INK)
draw.text((59, 463), "Product Designer", font=font(34), fill=INK)
draw.rectangle((58, 562, 596, 564), fill="#DDDDD5")
draw.text((59, 577), "DESIGN  ·  ENGINEER", font=font(18, True), fill=BLUE)
save(card, ROOT / "app/opengraph-image.jpg")

aurelia = Image.open(ROOT / "public/images/aurelia-interface.webp").convert("RGB")
aurelia = ImageOps.fit(aurelia, (1200, 630), centering=(0.5, 0.0))
save(aurelia, ROOT / "app/work/aurelia/opengraph-image.jpg")
