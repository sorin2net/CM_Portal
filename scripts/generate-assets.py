from PIL import Image, ImageDraw, ImageFont
import os

A = os.path.join(os.path.dirname(__file__), "..", "assets")
logo = Image.open(os.path.join(A, "cm-logo.jpg")).convert("RGBA")
banner = Image.open(os.path.join(A, "cm-banner.jpg")).convert("RGBA")

for size in (192, 512):
    logo.resize((size, size), Image.LANCZOS).convert("RGB").save(os.path.join(A, f"icon-{size}.png"))

m = Image.new("RGBA", (512, 512), (8, 8, 13, 255))
m.alpha_composite(logo.resize((392, 392), Image.LANCZOS), (60, 60))
m.convert("RGB").save(os.path.join(A, "icon-maskable.png"))

W, H = 1200, 630
bw, bh = banner.size
scale = max(W / bw, H / bh)
b2 = banner.resize((int(bw * scale), int(bh * scale)), Image.LANCZOS)
x = (b2.width - W) // 2
y = (b2.height - H) // 2
og = b2.crop((x, y, x + W, y + H)).convert("RGBA")

og = Image.alpha_composite(og, Image.new("RGBA", (W, H), (8, 8, 13, 175)))
grad = Image.new("L", (W, 1))
for i in range(W):
    grad.putpixel((i, 0), int(235 * max(0, 1 - i / 720)))
black = Image.new("RGBA", (W, H), (8, 8, 13, 255))
black.putalpha(grad.resize((W, H)))
og = Image.alpha_composite(og, black).convert("RGB")

og.paste(logo.resize((210, 210), Image.LANCZOS).convert("RGB"), (80, 205))
d = ImageDraw.Draw(og)
fb = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 72)
fr = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 30)
fy = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 26)
tx = 330
d.text((tx, 215), "Creative Monkeyz", font=fb, fill=(245, 245, 248))
d.text((tx, 298), "PORTAL", font=fb, fill=(255, 39, 64))
d.text((tx, 405), "Robotzi, gaming, muzica, interviuri si momente de pe stream", font=fr, fill=(212, 212, 224))
d.text((tx, 452), "LLTCM - Long Live The Creative Monkeyz", font=fy, fill=(255, 210, 30))
og.save(os.path.join(A, "og.jpg"), quality=88)
print("Generat: og.jpg, icon-192.png, icon-512.png, icon-maskable.png")
