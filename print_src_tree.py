from pathlib import Path
import os

root = Path(__file__).resolve().parent
src_dir = root / "src"

if not src_dir.exists():
    raise SystemExit(f"Source directory not found: {src_dir}")

for path in sorted(src_dir.rglob("*")):
    rel_path = path.relative_to(src_dir)
    if path.is_dir():
        print(f"{rel_path}/")
    else:
        print(str(rel_path))
