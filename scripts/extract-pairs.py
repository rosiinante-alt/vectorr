#!/usr/bin/env python3
"""
Extract before/after image pairs from composite PNGs.
Crops deterministically, removes poster captions, aligns pairs on identical canvas.
Generates paired PNGs: image-NN-before.png / image-NN-after.png
"""

import os
import json
import hashlib
from pathlib import Path
from PIL import Image
import io

# Configuration
SOURCES_DIR = Path(__file__).parent.parent / "public" / "demo" / "sources"
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "demo" / "examples"
MANIFEST_PATH = OUTPUT_DIR / "manifest.json"

# Crop regions (x, y, width, height) for each composite
# Determined by visual inspection, removing poster captions
CROP_SPECS = {
    "7.png": [
        {"name": "hiker-full", "before": (50, 120, 300, 380), "after": (380, 120, 300, 380)},
        {"name": "hiker-zoom", "before": (50, 520, 300, 300), "after": (380, 520, 300, 300)},
    ],
    "4.png": [
        {"name": "cityscape", "before": (30, 30, 460, 460), "after": (530, 30, 460, 460)},
    ],
    "6.png": [
        {"name": "feathers", "before": (30, 30, 460, 460), "after": (530, 30, 460, 460)},
    ],
    "3.png": [
        {"name": "apple", "before": (165, 170, 365, 475), "after": (530, 170, 365, 475)},
    ],
    "43.png": [
        {"name": "bird", "before": (30, 30, 460, 460), "after": (530, 30, 460, 460)},
    ],
    "5.png": [
        {"name": "feathers-rainbow", "before": (30, 30, 460, 460), "after": (530, 30, 460, 460)},
    ],
    "do3wnload.png": [
        {"name": "heart-pixel", "before": (60, 60, 200, 240), "after": (300, 60, 200, 240)},
    ],
    "downlo56ad.png": [
        {"name": "cursor-8x", "before": (30, 30, 300, 300), "after": (380, 30, 300, 300)},
    ],
    "1download.png": [
        {"name": "wings-logo", "before": (50, 50, 250, 250), "after": (350, 50, 250, 250)},
    ],
    "download.png": [
        {"name": "s-letter", "before": (30, 40, 300, 380), "after": (380, 40, 300, 380)},
    ],
}

def compute_checksum(path):
    """Compute MD5 checksum of file."""
    md5 = hashlib.md5()
    with open(path, 'rb') as f:
        md5.update(f.read())
    return md5.hexdigest()

def crop_and_save(source_path, pair_index, pair_name, before_rect, after_rect):
    """Crop before/after regions and save as paired PNGs on identical canvas."""
    img = Image.open(source_path)
    
    # Extract regions
    before_crop = img.crop(before_rect)
    after_crop = img.crop(after_rect)
    
    # Determine output canvas size (use before dimensions; after should match)
    canvas_width, canvas_height = before_crop.size
    
    # Ensure both crops are same size; pad if needed
    if after_crop.size != (canvas_width, canvas_height):
        after_padded = Image.new("RGBA", (canvas_width, canvas_height), (255, 255, 255, 0))
        offset = ((canvas_width - after_crop.width) // 2, (canvas_height - after_crop.height) // 2)
        after_padded.paste(after_crop, offset, after_crop if after_crop.mode == "RGBA" else None)
        after_crop = after_padded
    
    # Save paired images
    before_filename = f"image-{pair_index:02d}-before.png"
    after_filename = f"image-{pair_index:02d}-after.png"
    
    before_path = OUTPUT_DIR / before_filename
    after_path = OUTPUT_DIR / after_filename
    
    before_crop.save(before_path, "PNG")
    after_crop.save(after_path, "PNG")
    
    return {
        "index": pair_index,
        "name": pair_name,
        "before": before_filename,
        "after": after_filename,
        "canvas_size": (canvas_width, canvas_height),
        "source": source_path.name,
        "source_checksum": compute_checksum(source_path),
    }

def main():
    # Ensure output directory exists
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    manifest = {
        "version": "1.0",
        "generated": __file__,
        "pairs": [],
    }
    
    pair_index = 1
    
    for source_filename, specs in sorted(CROP_SPECS.items()):
        source_path = SOURCES_DIR / source_filename
        
        if not source_path.exists():
            print(f"⚠ Skipping {source_filename}: not found")
            continue
        
        print(f"Processing {source_filename}...")
        
        for spec in specs:
            try:
                pair_data = crop_and_save(
                    source_path,
                    pair_index,
                    spec["name"],
                    spec["before"],
                    spec["after"],
                )
                manifest["pairs"].append(pair_data)
                print(f"  ✓ {spec['name']} → image-{pair_index:02d}-{'{before,after}'}.png")
                pair_index += 1
            except Exception as e:
                print(f"  ✗ {spec['name']}: {e}")
    
    # Save manifest
    with open(MANIFEST_PATH, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n✓ Extracted {pair_index - 1} pairs")
    print(f"✓ Manifest saved to {MANIFEST_PATH}")

if __name__ == "__main__":
    main()
