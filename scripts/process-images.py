import sys
import os
from PIL import Image, ImageDraw

def optimize_screenshot(slug, viewport_png, full_png, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    vp_out = os.path.join(out_dir, f"{slug}.webp")
    full_out = os.path.join(out_dir, f"{slug}-full.webp")

    # 1. Viewport screenshot: target 1440x900, quality 82, under 250KB
    if os.path.exists(viewport_png):
        img = Image.open(viewport_png).convert("RGB")
        img = img.resize((1440, 900), Image.Resampling.LANCZOS)
        q = 82
        img.save(vp_out, "WEBP", quality=q)
        while os.path.getsize(vp_out) > 250 * 1024 and q > 50:
            q -= 5
            img.save(vp_out, "WEBP", quality=q)
        print(f"Viewport {slug}.webp size: {os.path.getsize(vp_out) // 1024} KB (quality={q})")

    # 2. Full-page screenshot: width 1440, max height 3600, quality 82
    if os.path.exists(full_png):
        full = Image.open(full_png).convert("RGB")
        w, h = full.size
        target_w = 1440
        target_h = int(round(h * (target_w / float(w))))
        full_resized = full.resize((target_w, target_h), Image.Resampling.LANCZOS)
        if target_h > 3600:
            full_resized = full_resized.crop((0, 0, 1440, 3600))
        full_resized.save(full_out, "WEBP", quality=82)
        print(f"Full-page {slug}-full.webp size: {os.path.getsize(full_out) // 1024} KB (h={min(target_h, 3600)})")

def generate_placeholder(slug, title, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    vp_out = os.path.join(out_dir, f"{slug}.webp")
    full_out = os.path.join(out_dir, f"{slug}-full.webp")

    # Viewport 1440x900
    img = Image.new("RGB", (1440, 900), color=(17, 26, 44))
    draw = ImageDraw.Draw(img)

    for y in range(900):
        ratio = y / 900.0
        r = int(20 * (1 - ratio) + 11 * ratio)
        g = int(30 * (1 - ratio) + 19 * ratio)
        b = int(48 * (1 - ratio) + 34 * ratio)
        draw.line([(0, y), (1440, y)], fill=(r, g, b))

    # Glass container in center
    draw.rounded_rectangle([200, 150, 1240, 750], radius=28, fill=(27, 43, 69), outline=(143, 176, 214), width=2)

    # Grid pattern inside container
    for gx in range(240, 1200, 80):
        draw.line([(gx, 180), (gx, 720)], fill=(32, 52, 82), width=1)
    for gy in range(180, 720, 80):
        draw.line([(240, gy), (1200, gy)], fill=(32, 52, 82), width=1)

    # Center Badge
    draw.rounded_rectangle([590, 260, 850, 310], radius=16, fill=(14, 22, 38), outline=(143, 176, 214), width=1)
    draw.text((640, 276), "FEATURED WORK", fill=(143, 176, 214))

    # Title & Subtitle
    draw.text((720, 420), title.upper(), fill=(255, 255, 255), anchor="mm")
    draw.text((720, 480), "Live transformation & case study in progress", fill=(159, 179, 204), anchor="mm")

    img.save(vp_out, "WEBP", quality=82)

    # Full page (1440 x 1800)
    full_img = Image.new("RGB", (1440, 1800), color=(14, 22, 38))
    full_img.paste(img, (0, 0))
    full_img.paste(img, (0, 900))
    full_img.save(full_out, "WEBP", quality=82)
    print(f"Generated placeholder for {slug}.webp and {slug}-full.webp")

if __name__ == "__main__":
    action = sys.argv[1]
    if action == "optimize":
        optimize_screenshot(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
    elif action == "placeholder":
        generate_placeholder(sys.argv[2], sys.argv[3], sys.argv[4])
