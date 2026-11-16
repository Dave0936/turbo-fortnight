#!/usr/bin/env python3
"""Venari: design search studio and website builder. Standard library only."""
import json
import os
import sys
import time
import traceback
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit, parse_qs

import static
import store

HOST = "127.0.0.1"  # local only, never public
PORT = 8886
VERSION = "0.1.0"
STARTED = time.time()


class ApiError(Exception):
    """Raised by handlers; becomes {"error": message} with status 400."""


# ---- routes: (method, path) -> function(handler, query, body) -> dict ----
ROUTES = {}


def route(method, path):
    def wrap(fn):
        ROUTES[(method, path)] = fn
        return fn
    return wrap


@route("GET", "/api/health")
def health(h, query, body):
    return {"ok": True, "name": "venari", "version": VERSION,
            "uptime": round(time.time() - STARTED, 1)}


class Handler(BaseHTTPRequestHandler):
    server_version = "Venari/" + VERSION
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (time.strftime("%H:%M:%S"), fmt % args))

    def end_headers(self):
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

    # -- responses --
    def send_json(self, obj, status=200):
        data = json.dumps(obj, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(data)

    def send_error_json(self, message):
        self.send_json({"error": message}, 400)

    def read_body(self):
        length = self.headers.get("Content-Length")
        if not length:
            return b""
        try:
            n = int(length)
        except ValueError:
            raise ApiError("The request has an invalid Content-Length header.")
        if n < 0:
            raise ApiError("The request has an invalid Content-Length header.")
        return self.rfile.read(n)

    # -- dispatch --
    def handle_any(self):
        try:
            parts = urlsplit(self.path)
            path = parts.path.rstrip("/") or "/"
            query = {k: v[-1] for k, v in parse_qs(parts.query).items()}
            raw = self.read_body() if self.command in ("POST", "PUT", "PATCH", "DELETE") else b""
            if path.startswith("/api/") or path == "/api":
                self.handle_api(path, query, raw)
            else:
                self.handle_static(path)
        except Exception:
            traceback.print_exc()
            try:
                self.send_error_json("The server hit an unexpected problem handling that request.")
            except Exception:
                self.close_connection = True

    def handle_api(self, path, query, raw):
        fn = ROUTES.get((self.command, path))
        if fn is None:
            if any(p == path for (_, p) in ROUTES):
                return self.send_error_json("That endpoint does not accept %s requests." % self.command)
            return self.send_error_json("There is no API endpoint at %s." % path)
        body = {}
        if raw:
            ctype = (self.headers.get("Content-Type") or "").split(";")[0].strip().lower()
            if ctype in ("", "application/json", "text/plain"):
                try:
                    body = json.loads(raw.decode("utf-8"))
                except (ValueError, UnicodeDecodeError):
                    return self.send_error_json("The request body is not valid JSON.")
            else:
                body = raw
        try:
            result = fn(self, query, body)
        except ApiError as e:
            return self.send_error_json(str(e))
        if result is not None:
            self.send_json(result)

    def handle_static(self, path):
        if self.command not in ("GET", "HEAD"):
            status, ctype, body, extra = 405, "text/plain; charset=utf-8", b"Method not allowed.\n", {"Allow": "GET, HEAD"}
        else:
            status, ctype, body, extra = static.resolve(path)
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        for k, v in extra.items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    do_GET = do_POST = do_PUT = do_PATCH = do_DELETE = do_HEAD = handle_any


def main():
    store.ensure_layout()
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    httpd.daemon_threads = True
    print("Venari listening on http://%s:%d" % (HOST, PORT), flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
