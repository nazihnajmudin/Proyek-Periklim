"""Panduan: aplikasi web lokal -> tangkapan layar berkotak merah di web/img/guide"""
import functools
import http.server
import os
import threading
from PIL import Image, ImageDraw, ImageFont
from playwright.sync_api import sync_playwright

OUT = "web/img/guide"
PORT = 8790
SCALE = 1.5
CHROMIUM = os.environ.get("CHROMIUM_PATH")   # opsional, jika versi Playwright tidak cocok
RED = (214, 40, 40)
REPORT_FIGURE = "docs/kajian/figures/app_powershift.png"


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args):
        pass


def serve_web():
    """server statis untuk folder web di thread terpisah"""
    handler = functools.partial(QuietHandler, directory="web")
    server = http.server.ThreadingHTTPServer(("localhost", PORT), handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    return server


def font(size):
    for path in ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", "/usr/share/fonts/dejavu/DejaVuSans-Bold.ttf"]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def boxes_of(page, selectors):
    """selector -> kotak (x, y, w, h) dalam piksel gambar"""
    out = []
    for sel in selectors:
        box = page.locator(sel).first.bounding_box()
        out.append(tuple(v * SCALE for v in (box["x"], box["y"], box["width"], box["height"])))
    return out


def annotate(page, name, selectors, pad=40, crop=True, context=()):
    """tangkapan layar viewport -> kotak merah bernomor -> JPEG. context: elemen yang ikut dipotong tanpa kotak"""
    path = f"{OUT}/{name}.png"
    page.screenshot(path=path)
    image = Image.open(path).convert("RGB")
    draw = ImageDraw.Draw(image)
    boxes = boxes_of(page, selectors)
    area = boxes + boxes_of(page, context)
    badge = font(int(15 * SCALE))
    for i, (x, y, w, h) in enumerate(boxes, start=1):
        draw.rounded_rectangle([x - 4, y - 4, x + w + 4, y + h + 4], radius=6, outline=RED, width=int(3 * SCALE))
        r = int(13 * SCALE)
        cx, cy = x - 4, y - 4
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=RED)
        draw.text((cx, cy), str(i), fill="white", font=badge, anchor="mm")

    if crop:
        left = max(0, min(b[0] for b in area) - pad * SCALE)
        top = max(0, min(b[1] for b in area) - pad * SCALE)
        right = min(image.width, max(b[0] + b[2] for b in area) + pad * SCALE)
        bottom = min(image.height, max(b[1] + b[3] for b in area) + pad * SCALE)
        image = image.crop((int(left), int(top), int(right), int(bottom)))
    image.save(f"{OUT}/{name}.jpg", quality=82)
    os.remove(path)


def capture():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=CHROMIUM) if CHROMIUM else p.chromium.launch()
        page = browser.new_page(viewport={"width": 1440, "height": 900}, device_scale_factor=SCALE)
        page.goto(f"http://localhost:{PORT}/index.html")
        page.wait_for_timeout(4000)

        # Overview
        annotate(page, "01-tampilan", ["#panel", "#kpis", ".map-wrap", ".tabs"], crop=False)

        # Preset
        page.hover("section:has(#preset) .note-btn")
        page.wait_for_timeout(400)
        annotate(page, "02-preset", ["#preset", "#preset-note"])

        # Plant Selection
        page.evaluate("""() => {
            const item = MapView.plantMarkers.find((m) => m.group.name === "Pelabuhan Ratu");
            MapView.map.setView([item.group.lat + 0.9, item.group.lon + 1.2], 7, { animate: false });
            onPlantClick(item.group, item.marker);
        }""")
        page.wait_for_timeout(1200)
        annotate(page, "03-pilih-pltu", [".leaflet-popup-content button", "#add-plant"], pad=30,
                 context=[".leaflet-popup-content-wrapper"])
        page.evaluate("() => { MapView.map.closePopup(); MapView.map.setView([-7.3, 110.6], 7, { animate: false }); }")

        # Retirement Year and Funding
        page.locator(".retire-item").first.scroll_into_view_if_needed()
        annotate(page, "04-tahun-dana", [".retire-item input[type=range]", ".radio-row", "#fund-ext", "#fund-apbn"])

        # Rooftop Solar Policy
        page.locator("#program").scroll_into_view_if_needed()
        annotate(page, "05-plts-atap", ["label:has(#gov)", "label:has(#incentive)", "label:has(#pvfrom)",
                                        "label:has(#export)", "label:has(#quota)", "label:has(#program)"])

        # Map and Year Slider
        page.evaluate("() => window.scrollTo(0, 0)")
        page.wait_for_timeout(300)
        annotate(page, "06-peta", [".map-controls", ".map-layers", ".legend"], crop=False)

        # Roadmap Indicators Tab
        page.evaluate("() => window.scrollTo(0, document.querySelector('.tabs').getBoundingClientRect().top + window.scrollY - 60)")
        page.wait_for_timeout(500)
        annotate(page, "07-indikator", ["#roadmap table >> nth=0", "#roadmap h3"], pad=60)
        page.locator("#chart-substitution").scroll_into_view_if_needed()
        page.wait_for_timeout(400)
        annotate(page, "07-kesetaraan", ["#chart-substitution"], pad=30)

        # Candidate Tab
        page.click("button[data-tab=kandidat]")
        page.wait_for_timeout(1500)
        page.evaluate("() => window.scrollTo(0, document.querySelector('.tabs').getBoundingClientRect().top + window.scrollY - 60)")
        page.wait_for_timeout(400)
        annotate(page, "08-kandidat", ["#cand-year", "#candidates table tr >> nth=1", "#candidates button >> nth=0"], pad=60)

        # Ledger Tab
        page.click("button[data-tab=neraca]")
        page.evaluate("() => window.scrollTo(0, document.querySelector('.tabs').getBoundingClientRect().top + window.scrollY - 330)")
        page.wait_for_timeout(700)
        annotate(page, "09-neraca", [".tabs", "#ledger-toggle", "#tab-neraca .chart-actions"], crop=False)

        # Criteria Tab
        page.click("button[data-tab=kriteria]")
        page.wait_for_timeout(400)
        page.locator("#criteria").scroll_into_view_if_needed()
        annotate(page, "10-kriteria", ["#criteria h3 >> nth=0", "#criteria h3 >> nth=1"], pad=120)

        # Analysis Tab
        page.click("button[data-tab=analisis]")
        page.wait_for_timeout(1500)
        page.locator("#tab-analisis").scroll_into_view_if_needed()
        annotate(page, "11-analisis", ["#chart-compare", "#sens-toggle", "#chart-tornado"], pad=60)

        # Share
        page.evaluate("() => window.scrollTo(0, 0)")
        page.locator("#share").scroll_into_view_if_needed()
        annotate(page, "12-bagikan", ["#share", "#reset"])

        # Report Figure
        page.goto(f"http://localhost:{PORT}/index.html")
        page.wait_for_timeout(4000)
        page.select_option("#preset", "roadmap")
        page.fill("#year", "2033")
        page.dispatch_event("#year", "input")
        page.wait_for_timeout(2500)
        page.screenshot(path=REPORT_FIGURE, clip={"x": 0, "y": 0, "width": 1440, "height": 760})
        browser.close()


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    server = serve_web()
    capture()
    server.shutdown()
    print("tangkapan layar tersimpan di", OUT)
