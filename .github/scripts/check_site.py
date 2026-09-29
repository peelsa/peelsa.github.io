"""Checks the static site on every push.

Serves the publishing root on localhost and fails if a required URL, tag,
or company-profile link is wrong. No calls to the public site.
"""
import json
import re
import sys
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[2]
PAGES = [
    "index.html",
    "plants.html",
    "legal.html",
    "how-it-works.html",
    "hardware.html",
    "pricing.html",
    "security.html",
    "about.html",
    "contact.html",
    "privacy.html",
    "terms.html",
]
SAME_AS = [
    "https://x.com/peelsalabs",
    "https://github.com/peelsa",
    "https://huggingface.co/peelsa",
]
TWITTER_SITE = '<meta name="twitter:site" content="@peelsalabs" />'
errors = []


def fail(msg):
    errors.append(msg)


def text(rel):
    path = ROOT / rel
    if not path.is_file():
        fail(f"missing {rel}")
        return ""
    return path.read_text(encoding="utf-8")


def page_url(page):
    if page == "index.html":
        return "https://peelsa.ai/"
    return f"https://peelsa.ai/{page}"


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, fmt, *args):
        return

    def send_error(self, code, message=None, explain=None):
        page = ROOT / "404.html"
        if code == 404 and page.is_file():
            body = page.read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().send_error(code, message, explain)


def serve():
    server = ThreadingHTTPServer(("127.0.0.1", 0), Handler)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


def get(url):
    try:
        with urlopen(url, timeout=10) as response:
            return response.status, response.read().decode("utf-8", "replace")
    except HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", "replace")


if not (ROOT / "404.html").is_file():
    fail("missing 404.html")

robots = text("robots.txt")
if "Sitemap: https://peelsa.ai/sitemap.xml" not in robots:
    fail("robots.txt is missing the sitemap line")

sitemap = text("sitemap.xml")
locs = re.findall(r"<loc>(.*?)</loc>", sitemap)
expected = [page_url(page) for page in PAGES]
if locs != expected:
    fail(f"sitemap locations do not match the 11 pages: {locs}")

css = text("css/styles.css")
for host in ("fonts.googleapis.com", "fonts.gstatic.com"):
    if host in css:
        fail(f"styles.css still requests {host}")
if "inter-latin-400.woff2" not in css:
    fail("styles.css is missing the self-hosted Inter files")

for page in PAGES:
    html = text(page)
    if not html:
        continue
    for host in ("fonts.googleapis.com", "fonts.gstatic.com"):
        if host in html:
            fail(f"{page} still requests {host}")
    if not re.search(r"<title>[^<]+</title>", html):
        fail(f"{page} is missing a title")
    if not re.search(r'<meta name="description" content="[^"]+"', html):
        fail(f"{page} is missing a description")
    canonical = page_url(page)
    if f'<link rel="canonical" href="{canonical}"' not in html:
        fail(f"{page} canonical is not {canonical}")
    if TWITTER_SITE not in html:
        fail(f"{page} is missing {TWITTER_SITE}")
    if "e1d50a7d3d354c57be39a8f6daea27db" not in html:
        fail(f"{page} is missing the Cloudflare Web Analytics beacon")

missing = text("404.html")
if missing:
    for host in ("fonts.googleapis.com", "fonts.gstatic.com"):
        if host in missing:
            fail(f"404.html still requests {host}")
    if "This page does not exist." not in missing:
        fail("404.html does not say the page does not exist")
    for label, href in (
        ("Home", "index.html"),
        ("OEMs", "plants.html"),
        ("Legal", "legal.html"),
        ("Contact", "contact.html"),
    ):
        if f'href="{href}"' not in missing:
            fail(f"404.html does not link to {label}")
    if "site-header" not in missing or "site-footer" not in missing:
        fail("404.html is missing the site header or footer")
    if "e1d50a7d3d354c57be39a8f6daea27db" not in missing:
        fail("404.html is missing the Cloudflare Web Analytics beacon")

home = text("index.html")
block = re.search(
    r'<script type="application/ld\+json">(.*?)</script>',
    home,
    re.S,
)
same_as = None
if not block:
    fail("homepage is missing the company info block")
else:
    try:
        data = json.loads(block.group(1))
    except json.JSONDecodeError as exc:
        fail(f"homepage company info block is not valid JSON: {exc}")
        data = {}
    for node in data.get("@graph", []):
        if node.get("@type") == "Organization":
            same_as = node.get("sameAs")
    if same_as != SAME_AS:
        fail(f"Organization sameAs is {same_as}, expected {SAME_AS}")

server = serve()
base = f"http://127.0.0.1:{server.server_address[1]}"
routes = {
    "/": "index.html",
    "/robots.txt": "robots.txt",
    "/sitemap.xml": "sitemap.xml",
}
for page in PAGES:
    if page == "index.html":
        continue
    routes[f"/{page}"] = page

try:
    for route in routes:
        status, _body = get(base + route)
        if status != 200:
            fail(f"{route} returned {status}")
    status, body = get(base + "/this-page-does-not-exist")
    if status != 404:
        fail(f"unknown path returned {status}")
    if "This page does not exist." not in body:
        fail("unknown path did not serve 404.html")
finally:
    server.shutdown()

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"ok: {len(PAGES)} pages, sitemap, fonts, profiles, 404")
