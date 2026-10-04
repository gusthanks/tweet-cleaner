"""Generate the original geometric icon and store tile; no external assets."""
from pathlib import Path
from PIL import Image, ImageDraw

PROJECT = Path(__file__).resolve().parents[1]
ICON = PROJECT / "extension" / "icons"
ICON.mkdir(parents=True, exist_ok=True)

def mark(size):
    scale = 4
    image = Image.new("RGBA", (size * scale, size * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    def box(coords): return tuple(round(value * size * scale / 128) for value in coords)
    def line(points, width=7, fill="#8bc8fd"):
        draw.line(box(points), width=max(1, round(width * size * scale / 128)), fill=fill, joint="curve")
    draw.rounded_rectangle(box((0, 0, 128, 128)), radius=round(26 * size * scale / 128), fill="#15202b")
    draw.rounded_rectangle(box((27, 24, 94, 108)), radius=round(13 * size * scale / 128), outline="#8bc8fd", width=round(6 * size * scale / 128))
    line((42, 49, 78, 49), 6)
    line((42, 67, 66, 67), 6)
    line((78, 20, 78, 36), 5)
    line((70, 28, 86, 28), 5)
    line((74, 87, 86, 99, 110, 71), 7)
    return image.resize((size, size), Image.Resampling.LANCZOS)

for size in (16, 32, 48, 128):
    mark(size).save(ICON / f"{size}.png")

artifacts = PROJECT / "artifacts" / "store"
artifacts.mkdir(parents=True, exist_ok=True)
tile = Image.new("RGB", (440, 280), "#15202b")
tile.paste(mark(152), (144, 64), mark(152))
tile.save(artifacts / "promo-440x280.png")
print("Ícones e imagem promocional gerados.")
