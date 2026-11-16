"""Draws the Venari app icon as a PNG using only the standard library.

A light "V" on a dark square. The V sits inside the middle 60% of the
canvas, so the icon also works as a maskable icon (phones crop to a circle
or rounded square).
"""
import struct
import zlib

BG = (17, 17, 17)        # #111111
FG = (245, 240, 230)     # warm off-white

_cache = {}


def _png(width, height, rows):
    def chunk(kind, data):
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    raw = b"".join(b"\x00" + row for row in rows)  # filter type 0 per row
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))


def _seg_dist(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)
    t = max(0.0, min(1.0, t))
    cx, cy = ax + t * dx, ay + t * dy
    return ((px - cx) ** 2 + (py - cy) ** 2) ** 0.5


def icon_png(size):
    """Return PNG bytes for a square icon of the given size (cached)."""
    if size in _cache:
        return _cache[size]
    s = float(size)
    left, right = (0.27 * s, 0.30 * s), (0.73 * s, 0.30 * s)
    bottom = (0.50 * s, 0.72 * s)
    half = 0.055 * s  # half the stroke width
    rows = []
    for y in range(size):
        row = bytearray()
        py = y + 0.5
        for x in range(size):
            px = x + 0.5
            d = min(_seg_dist(px, py, left[0], left[1], bottom[0], bottom[1]),
                    _seg_dist(px, py, right[0], right[1], bottom[0], bottom[1]))
            # 1px anti-aliased edge
            a = max(0.0, min(1.0, half - d + 0.5))
            row += bytes(int(BG[i] + (FG[i] - BG[i]) * a + 0.5) for i in range(3))
        rows.append(bytes(row))
    data = _png(size, size, rows)
    _cache[size] = data
    return data
