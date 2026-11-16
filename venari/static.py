"""Non-API responses: the studio page, live version, PWA bits, and pictures."""
import hashlib
import json
import os
import re

import icons
import store

STUDIO = os.path.join(store.ROOT, "studio.html")
THEME = "#111111"

MANIFEST = {
    "name": "Venari",
    "short_name": "Venari",
    "description": "Design search studio and website builder.",
    "start_url": "/",
    "scope": "/",
    "display": "standalone",
    "background_color": THEME,
    "theme_color": THEME,
    "icons": [
        {"src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable"},
        {"src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable"},
    ],
}

HEAD_TAGS = [
    ('rel="manifest"', '<link rel="manifest" href="/manifest.webmanifest">'),
    ('rel="apple-touch-icon"', '<link rel="apple-touch-icon" href="/icon-192.png">'),
    ('name="apple-mobile-web-app-capable"', '<meta name="apple-mobile-web-app-capable" content="yes">'),
    ('name="mobile-web-app-capable"', '<meta name="mobile-web-app-capable" content="yes">'),
    ('name="apple-mobile-web-app-title"', '<meta name="apple-mobile-web-app-title" content="Venari">'),
    ('name="apple-mobile-web-app-status-bar-style"',
     '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'),
]

# Pictures only: extension -> (content type, magic-byte check)
PICTURES = {
    ".png": ("image/png", lambda b: b.startswith(b"\x89PNG\r\n\x1a\n")),
    ".jpg": ("image/jpeg", lambda b: b.startswith(b"\xff\xd8\xff")),
    ".jpeg": ("image/jpeg", lambda b: b.startswith(b"\xff\xd8\xff")),
    ".gif": ("image/gif", lambda b: b[:6] in (b"GIF87a", b"GIF89a")),
    ".webp": ("image/webp", lambda b: b[:4] == b"RIFF" and b[8:12] == b"WEBP"),
    ".avif": ("image/avif", lambda b: b[4:8] == b"ftyp" and b[8:12] in (b"avif", b"avis")),
    ".svg": ("image/svg+xml", lambda b: b"<svg" in b[:4096].lower()),
    ".ico": ("image/x-icon", lambda b: b[:4] == b"\x00\x00\x01\x00"),
}
SAFE_NAME = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,200}$")
PICTURE_DIRS = {"/img/": os.path.join(store.DATA, "img"),
                "/uploads/": os.path.join(store.DATA, "uploads")}


def studio_bytes():
    try:
        with open(STUDIO, "rb") as f:
            return f.read()
    except FileNotFoundError:
        return None


def live_version():
    data = studio_bytes()
    return {"v": hashlib.sha256(data).hexdigest()[:16] if data is not None else ""}


def inject_head(html):
    """Add the home-screen tags right after <head>, skipping any the page already has."""
    text = html.decode("utf-8", errors="surrogateescape")
    lower = text.lower()
    tags = [tag for marker, tag in HEAD_TAGS if marker not in lower]
    if not tags:
        return html
    block = "\n" + "\n".join(tags) + "\n"
    m = re.search(r"<head\b[^>]*>", text, re.I)
    if m:
        text = text[:m.end()] + block + text[m.end():]
    else:
        text = block + text
    return text.encode("utf-8", errors="surrogateescape")


def picture(path):
    """Return (content_type, bytes) for /img/<file> or /uploads/<file>, or None."""
    for prefix, folder in PICTURE_DIRS.items():
        if not path.startswith(prefix):
            continue
        name = path[len(prefix):]
        if not SAFE_NAME.match(name):
            return None
        kind = PICTURES.get(os.path.splitext(name)[1].lower())
        if kind is None:
            return None
        full = os.path.realpath(os.path.join(folder, name))
        if os.path.dirname(full) != os.path.realpath(folder) or not os.path.isfile(full):
            return None
        with open(full, "rb") as f:
            data = f.read()
        if not kind[1](data):
            return None
        return kind[0], data
    return None


def resolve(path):
    """Map a non-API path to (status, content_type, body, extra_headers)."""
    if path in ("/", "/index.html"):
        data = studio_bytes()
        if data is None:
            return (404, "text/plain; charset=utf-8",
                    b"The studio page is not installed: studio.html is missing.\n",
                    {})
        return 200, "text/html; charset=utf-8", inject_head(data), {"Cache-Control": "no-cache"}
    if path == "/live-version":
        body = json.dumps(live_version()).encode()
        return 200, "application/json; charset=utf-8", body, {"Cache-Control": "no-store"}
    if path == "/manifest.webmanifest":
        body = json.dumps(MANIFEST, indent=2).encode()
        return 200, "application/manifest+json; charset=utf-8", body, {"Cache-Control": "no-cache"}
    if path in ("/icon-192.png", "/icon-512.png"):
        size = 192 if "192" in path else 512
        return 200, "image/png", icons.icon_png(size), {"Cache-Control": "public, max-age=86400"}
    pic = picture(path)
    if pic is not None:
        headers = {"Cache-Control": "public, max-age=3600"}
        if pic[0] == "image/svg+xml":
            # SVG can carry script; serve it inert.
            headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'; sandbox"
        return 200, pic[0], pic[1], headers
    return 404, "text/plain; charset=utf-8", b"Not found.\n", {}
