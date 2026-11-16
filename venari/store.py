"""Data directory layout and atomic file writes for Venari."""
import json
import os
import tempfile

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(ROOT, "data")
SUBDIRS = ("runs", "img", "sites", "clients", "uploads")
SETTINGS = os.path.join(DATA, "settings.json")
KEYS = os.path.join(DATA, "keys.json")


def atomic_write_bytes(path, data, mode=0o644):
    """Write to a temp file in the same folder, fsync, then rename over the target."""
    folder = os.path.dirname(path)
    os.makedirs(folder, exist_ok=True)
    fd, tmp = tempfile.mkstemp(dir=folder, prefix=".tmp-", suffix=".part")
    try:
        os.fchmod(fd, mode)
        with os.fdopen(fd, "wb") as f:
            f.write(data)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def atomic_write_json(path, obj, mode=0o644):
    data = json.dumps(obj, indent=2, ensure_ascii=False).encode("utf-8")
    atomic_write_bytes(path, data, mode=mode)


def read_json(path, default=None):
    try:
        with open(path, "rb") as f:
            return json.loads(f.read().decode("utf-8"))
    except (FileNotFoundError, ValueError):
        return default


def ensure_layout():
    """Create data folders and seed files; keep keys.json at mode 600."""
    os.makedirs(DATA, exist_ok=True)
    for name in SUBDIRS:
        os.makedirs(os.path.join(DATA, name), exist_ok=True)
    if not os.path.exists(SETTINGS):
        atomic_write_json(SETTINGS, {})
    if not os.path.exists(KEYS):
        atomic_write_json(KEYS, {}, mode=0o600)
    os.chmod(KEYS, 0o600)
    # Clean up temp files left by an interrupted write.
    for dirpath, _, files in os.walk(DATA):
        for fn in files:
            if fn.startswith(".tmp-") and fn.endswith(".part"):
                try:
                    os.unlink(os.path.join(dirpath, fn))
                except OSError:
                    pass
