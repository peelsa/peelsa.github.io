"""Checks the static site on every push. No network calls."""
import re
import sys
from pathlib import Path

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
ASSETS = [
    "robots.txt",
    "sitemap.xml",
    "404.html",
    "site.webmanifest",
    "img/og.jpg",
    "img/favicon.png",
    "img/apple-touch-icon.png",
    "css/fonts/inter-latin-400.woff2",
    "css/fonts/inter-latin-500.woff2",
    "css/fonts/inter-latin-600.woff2",
    "css/fonts/inter-latin-700.woff2",
    "css/fonts/OFL.txt",
]
errors = []


def fail(msg):
    errors.append(msg)


def text(rel):
    path = ROOT / rel
    if not path.is_file():
        fail(f"missing {rel}")
        return ""
    return path.read_text(encoding="utf-8")


for rel in ASSETS:
    path = ROOT / rel
    if not path.is_file() or path.stat().st_size < 20:
        fail(f"missing or empty {rel}")

robots = text("robots.txt")
if "Sitemap: https://peelsa.ai/sitemap.xml" not in robots:
    fail("robots.txt is missing the sitemap line")

sitemap = text("sitemap.xml")
locs = re.findall(r"<loc>(.*?)</loc>", sitemap)
expected = []
for page in PAGES:
    url = "https://peelsa.ai/" if page == "index.html" else f"https://peelsa.ai/{page}"
    expected.append(url)
if locs != expected:
    fail(f"sitemap locations do not match the 11 pages: {locs}")
if "404.html" in sitemap:
    fail("sitemap includes the 404 page")

css = text("css/styles.css")
if css.count("@font-face") < 4:
    fail("styles.css is missing the self-hosted Inter faces")
if "fonts.googleapis.com" in css:
    fail("styles.css still points at Google Fonts")

for page in PAGES:
    html = text(page)
    if not html:
        continue
    if "fonts.googleapis.com" in html or "fonts.gstatic.com" in html:
        fail(f"{page} still loads Google Fonts")
    if not re.search(r"<title>[^<]+</title>", html):
        fail(f"{page} is missing a title")
    if 'name="description"' not in html:
        fail(f"{page} is missing a description")
    canon = re.search(r'<link rel="canonical" href="(https://peelsa\.ai/[^"]*)"', html)
    if not canon:
        fail(f"{page} is missing a peelsa.ai canonical")
    if "css/styles.css?v=font" not in html:
        fail(f"{page} is not loading the current stylesheet")

missing = text("404.html")
if missing:
    if 'content="noindex,follow"' not in missing:
        fail("404.html is not marked noindex")
    if "fonts.googleapis.com" in missing:
        fail("404.html still loads Google Fonts")

home = text("index.html")
if '"sameAs"' not in home or "https://github.com/peelsa" not in home:
    fail("homepage company block is missing the GitHub organization")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"ok: {len(PAGES)} pages, sitemap, fonts, 404")
