#!/usr/bin/env python3
"""
Generate all Android launcher icon densities from a single source PNG.

Source should be 1024×1024 or larger. We produce:
  - ic_launcher.png          (legacy square icon)
  - ic_launcher_round.png    (legacy round icon — same image since source is already square)
  - ic_launcher_foreground.png (adaptive icon foreground, 108dp with 72dp safe zone)

Android density buckets:
  mdpi    48×48     1.0x
  hdpi    72×72     1.5x
  xhdpi   96×96     2.0x
  xxhdpi  144×144   3.0x
  xxxhdpi 192×192   4.0x
"""

import sys
from pathlib import Path
from PIL import Image, ImageDraw

# Source is 1254×1254
SRC = Path(sys.argv[1])
OUT_BASE = Path(sys.argv[2])

DENSITIES = [
    ("mdpi",    48,  108),
    ("hdpi",    72,  162),
    ("xhdpi",   96,  216),
    ("xxhdpi",  144, 324),
    ("xxxhdpi", 192, 432),
]

src_img = Image.open(SRC).convert("RGBA")
print(f"Source: {src_img.size}, mode={src_img.mode}")

# Optional: also produce a 512×512 for Play Store / GitHub Release listing
OUT_BASE.parent.mkdir(parents=True, exist_ok=True)
src_resized_512 = src_img.resize((512, 512), Image.LANCZOS)
src_resized_512.save(OUT_BASE.parent / "icon-playstore-512.png")
print(f"Saved 512×512 playstore icon")

for name, legacy_size, adapt_size in DENSITIES:
    out_dir = OUT_BASE / f"mipmap-{name}"
    out_dir.mkdir(parents=True, exist_ok=True)

    # Legacy square icon (full source, no padding)
    legacy = src_img.resize((legacy_size, legacy_size), Image.LANCZOS)
    legacy.save(out_dir / "ic_launcher.png")
    legacy.save(out_dir / "ic_launcher_round.png")

    # Adaptive icon foreground:
    # Total canvas is 108dp, but only the inner 72dp is the "safe zone"
    # (the outer ~25% on each side can be masked by the launcher).
    # We place the source at 72/108 = 66.6% size, centered.
    safe_size = int(adapt_size * 72 / 108)
    fg_inner = src_img.resize((safe_size, safe_size), Image.LANCZOS)

    # Create transparent canvas and paste centered
    canvas = Image.new("RGBA", (adapt_size, adapt_size), (0, 0, 0, 0))
    offset = ((adapt_size - safe_size) // 2, (adapt_size - safe_size) // 2)
    canvas.paste(fg_inner, offset, fg_inner)
    canvas.save(out_dir / "ic_launcher_foreground.png")

    print(f"  {name}: launcher={legacy_size}×{legacy_size}, foreground={adapt_size}×{adapt_size} (safe {safe_size})")

print("Done.")
