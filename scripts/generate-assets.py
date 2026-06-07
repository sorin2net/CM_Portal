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
d.text((tx, 452), "LLTCM", font=fy, fill=(255, 210, 30))
og.save(os.path.join(A, "og.jpg"), quality=88)

FW, FH = 1024, 500
sc = max(FW / bw, FH / bh)
fb = banner.resize((int(bw * sc), int(bh * sc)), Image.LANCZOS)
fx = (fb.width - FW) // 2
fy = (fb.height - FH) // 2
feat = fb.crop((fx, fy, fx + FW, fy + FH)).convert("RGBA")
feat = Image.alpha_composite(feat, Image.new("RGBA", (FW, FH), (8, 8, 13, 165)))
fgrad = Image.new("L", (FW, 1))
for i in range(FW):
    fgrad.putpixel((i, 0), int(235 * max(0, 1 - i / 620)))
fbk = Image.new("RGBA", (FW, FH), (8, 8, 13, 255))
fbk.putalpha(fgrad.resize((FW, FH)))
feat = Image.alpha_composite(feat, fbk).convert("RGB")
feat.paste(logo.resize((180, 180), Image.LANCZOS).convert("RGB"), (66, 160))
fd = ImageDraw.Draw(feat)
fd.text((286, 168), "Creative Monkeyz", font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 62), fill=(245, 245, 248))
fd.text((286, 240), "PORTAL", font=ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 62), fill=(255, 39, 64))
fd.text((286, 330), "Robotzi, gaming, muzica si momente de pe stream", font=ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 27), fill=(212, 212, 224))
feat.save(os.path.join(A, "feature.jpg"), quality=88)
print("Generat: og.jpg, feature.jpg, icon-192.png, icon-512.png, icon-maskable.png")
