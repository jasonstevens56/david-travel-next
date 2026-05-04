#!/usr/bin/env python3
"""Copy only images referenced by migrated posts.

Set WP_UPLOADS_DIR to your extracted WordPress uploads directory, then run:
  WP_UPLOADS_DIR=/path/to/wp-content/uploads python scripts/copy-used-images.py
"""
from __future__ import annotations
import os
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
USED = ROOT / "used-images.txt"
DEST = ROOT / "public" / "images"
SRC = Path(os.environ.get("WP_UPLOADS_DIR", ""))

if not SRC.exists():
    raise SystemExit("Set WP_UPLOADS_DIR to your wp-content/uploads folder and rerun.")

DEST.mkdir(parents=True, exist_ok=True)
missing = []
copied = 0
for line in USED.read_text(encoding="utf-8").splitlines():
    rel = line.strip().lstrip("/")
    if not rel:
        continue
    source = SRC / rel
    target = DEST / rel
    if source.exists():
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        copied += 1
    else:
        missing.append(rel)

(ROOT / "missing-images.txt").write_text("\n".join(missing) + ("\n" if missing else ""), encoding="utf-8")
print(f"Copied {copied} images. Missing {len(missing)} images.")
