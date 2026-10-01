"""Ship homepage scroll-video copies from playlist.txt.

Masters stay in the OneDrive Videos folder. This script never writes there.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

SITE = Path(__file__).resolve().parents[1]
PLAYLIST = Path(r"C:\Users\johne\OneDrive\Peelsa\Videos\playlist.txt")
OUT_DIR = SITE / "video"
JS_OUT = SITE / "js" / "scroll-playlist.js"


def top_level_boxes(data: bytes) -> list[tuple[bytes, int]]:
    boxes = []
    i = 0
    n = len(data)
    while i + 8 <= n:
        size = int.from_bytes(data[i:i + 4], "big")
        kind = data[i + 4:i + 8]
        header = 8
        if size == 1:
            if i + 16 > n:
                break
            size = int.from_bytes(data[i + 8:i + 16], "big")
            header = 16
        if size < header:
            break
        boxes.append((kind, i))
        i += size
    return boxes


def main() -> int:
    if not PLAYLIST.is_file():
        print("missing playlist", PLAYLIST, file=sys.stderr)
        return 1
    names = []
    for line in PLAYLIST.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        start = float(parts[1]) if len(parts) > 1 else 0.0
        names.append((parts[0], start))
    if not names:
        print("playlist is empty", file=sys.stderr)
        return 1
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    shipped = []
    for name, start in names:
        src = PLAYLIST.parent / name
        if not src.is_file():
            print("missing master", src, file=sys.stderr)
            return 1
        dest = OUT_DIR / name
        # Every frame is a keyframe so a scroll seek paints that frame.
        cmd = ["ffmpeg", "-y", "-i", str(src)]
        if start > 0:
            cmd.extend(["-ss", f"{start:.3f}"])
        # A silent audio track is included because iPhone Safari will not
        # show a video-only file. The element stays muted.
        cmd.extend([
            "-f", "lavfi", "-t", "30", "-i", "anullsrc=r=44100:cl=stereo",
            "-map", "0:v:0", "-map", "1:a:0", "-shortest",
            "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
            "-c:v", "libx264", "-preset", "medium", "-crf", "18",
            "-profile:v", "main", "-level", "4.0",
            "-pix_fmt", "yuv420p",
            "-g", "1", "-keyint_min", "1", "-x264-params", "scenecut=0",
            "-c:a", "aac", "-b:a", "32k",
            "-movflags", "+faststart",
            str(dest),
        ])
        print("intra", name, "start", start)
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            sys.stderr.write(result.stderr[-2000:])
            return result.returncode
        boxes = top_level_boxes(dest.read_bytes())
        offsets = {kind: offset for kind, offset in boxes}
        moov = offsets.get(b"moov")
        mdat = offsets.get(b"mdat")
        print(f"  moov {moov} mdat {mdat} bytes {dest.stat().st_size}")
        if moov is None or mdat is None or moov > mdat:
            print("faststart check failed", dest, file=sys.stderr)
            return 1
        shipped.append("video/" + name.replace("\\", "/") + "?v=" + str(int(dest.stat().st_mtime)))
    JS_OUT.write_text(
        "window.SCROLL_VIDEO = " + json.dumps(shipped) + ";\n",
        encoding="utf-8",
    )
    print("wrote", JS_OUT)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
