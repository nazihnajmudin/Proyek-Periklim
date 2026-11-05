# PowerShift

Simulator paket pensiun dini PLTU dan PLTS atap untuk sistem listrik Jawa-Bali, 2026-2040.
Proyek Minor MK4066 Perubahan Iklim (Layanan) ITB, Kelompok 17, topik 13: transisi energi, PLTS atap dan pensiun dini PLTU.

PowerShift menghitung siapa menanggung apa dari sebuah paket kebijakan: neraca PLN, APBN, dana luar (ETM/JETP), pelanggan, keandalan sistem, emisi, dan kematian dini, dibanding baseline phase down di akhir PPA.

## Isi Repo

| Folder | Isi |
| --- | --- |
| `web/` | Aplikasi web statis (HTML, JavaScript, Leaflet, Chart.js). Bagian yang di-hosting |
| `data/raw/` | Data asli: GEM (PLTU), geoBoundaries (batas wilayah), Global Solar Atlas (PVOUT per kabupaten) |
| `data/manual/` | `parameters.json`: parameter model beserta sumber dan status verifikasi |
| `data/processed/` | Hasil olah: daftar PLTU, ringkasan provinsi, batas wilayah sederhana, ekstrak Statistik PLN 2025 |
| `scripts/` | Skrip Python olah data, gambar dan tabel laporan, tangkapan layar panduan |
| `validation/` | Hitung tangan, uji model, sensitivitas, eksplorasi kombinasi kebijakan, beserta hasilnya |
| `docs/` | Laporan LaTeX (APA) dan PDF final `ProyekMinor_Kelompok-17.pdf` |

## Struktur

```
.
├── web/
│   ├── index.html            simulator
│   ├── guide.html            panduan bergambar
│   ├── assumptions.html      parameter dan sumber
│   ├── method.html           rumus dan batasan
│   ├── sources.html          sumber data dan lisensi
│   ├── css/style.css
│   ├── js/
│   │   ├── model.js          model tahunan dan preset
│   │   ├── map.js            peta Leaflet
│   │   ├── charts.js         grafik Chart.js
│   │   ├── ui.js             panel, kartu angka, kriteria, URL
│   │   ├── format.js         format angka
│   │   └── app.js            pemuatan data dan siklus render
│   ├── data/                 JSON dan GeoJSON untuk aplikasi
│   └── img/guide/            tangkapan layar panduan
├── data/
│   ├── raw/
│   │   ├── gem/              Global Coal Plant Tracker, Integrated Power, Coal Finance
│   │   ├── geoboundaries/    batas ADM1 dan ADM2 Indonesia
│   │   └── gsa_api/          PVOUT per kabupaten
│   ├── manual/parameters.json
│   └── processed/
├── scripts/
│   ├── prepare_regions.py    batas wilayah Jawa-Bali
│   ├── fetch_pvout.py        PVOUT dari API Global Solar Atlas
│   ├── prepare_plants.py     PLTU jaringan PLN Jawa-Bali dari GEM
│   ├── prepare_pln.py        tabel Statistik PLN 2025
│   ├── build_web_data.py     salin dan gabung data ke web/data
│   ├── report_figures.py     gambar laporan
│   ├── report_tables.py      tabel laporan
│   └── guide_screenshots.py  tangkapan layar halaman panduan
├── validation/
│   ├── cirebon1_manual.py    hitung tangan Paket Cirebon-1
│   ├── test_model.js         uji model
│   ├── sensitivity.js        sensitivitas parameter
│   ├── explore_h3.js         eksplorasi kombinasi kebijakan
│   └── results/
├── docs/
│   ├── main.tex
│   ├── sections/
│   ├── tables/
│   ├── figures/
│   ├── references.bib
│   ├── latexmkrc
│   └── ProyekMinor_Kelompok-17.pdf
├── pyproject.toml
└── uv.lock
```

## Menjalankan di Localhost

Butuh Python 3 dan browser. Aplikasi memuat data lewat `fetch`, jadi harus lewat server lokal, tidak bisa dibuka langsung sebagai file.

```bash
cd web
python3 -m http.server 8000
```

Buka `http://localhost:8000`. Cara pakai ada di menu Panduan (`http://localhost:8000/guide.html`).

## Membangun Ulang Data dan Laporan

Tidak perlu untuk sekadar menjalankan aplikasi, karena hasilnya sudah ada di repo.

Kebutuhan: [uv](https://docs.astral.sh/uv/), Node.js, `pdftotext` (poppler-utils), TeX Live dengan `latexmk`, `biber`, `biblatex-apa`.

```bash
uv sync

# Data
uv run python scripts/prepare_regions.py
uv run python scripts/fetch_pvout.py        # butuh internet, sekitar 15 menit
uv run python scripts/prepare_plants.py
uv run python scripts/prepare_pln.py        # butuh PDF Statistik PLN 2025
uv run python scripts/build_web_data.py

# Validasi
uv run python validation/cirebon1_manual.py
node validation/test_model.js
node validation/sensitivity.js
node validation/explore_h3.js

# Laporan
uv run python scripts/report_figures.py
uv run python scripts/report_tables.py
cd docs && latexmk
```

`latexmk` menghasilkan `docs/build/main.pdf`.

Tangkapan layar panduan dan gambar aplikasi di laporan dibuat ulang dengan Playwright:

```bash
uv run --with playwright python -m playwright install chromium
uv run --with playwright python scripts/guide_screenshots.py
```

### File yang tidak ada di repo

Dua PDF berhak cipta pihak lain tidak ikut repo. Unduh manual jika ingin membangun ulang:

| File | Lokasi | Sumber |
| --- | --- | --- |
| Statistik PLN 2025 (unaudited) | `data/raw/pln/Statistik-PLN-2025-Unaudited.pdf` | https://www.pln.co.id/webapi/media/file/webkorp/asset/eac6296a-541f-4e89-acef-86db3c4b7df4.pdf |
| CREA dan IESR (2023) | `data/raw/crea/CREA_IESR_Health-Benefits-Indonesia_EN_07.2023.pdf` | https://energyandcleanair.org/wp/wp-content/uploads/2023/07/CREA_IESR_Health-Benefits-of-Just-Energy-Transition-and-Coal-Phase-out-in-Indonesia_EN_07.2023.pdf |

Laporan CREA hanya dipakai sebagai kutipan angka, tidak dibaca oleh skrip.

## Data dan Lisensi

- PLTU: Global Energy Monitor, Global Coal Plant Tracker, July 2026 release, CC BY 4.0. Difilter untuk sistem Jawa-Bali.
- Potensi surya: Global Solar Atlas 2.0, World Bank Group, ESMAP, Solargis, CC BY 4.0.
- Batas wilayah: geoBoundaries (Runfola et al., 2020). ADM1 ODbL 1.0, ADM2 CC BY 3.0 IGO.
- Penjualan, pelanggan, tarif per provinsi: Statistik PLN 2025 (unaudited), dikutip.
- Peta dasar: (c) OpenStreetMap contributors.
- Library: Leaflet (BSD 2-Clause), Chart.js (MIT).

Rincian sumber setiap parameter ada di halaman Asumsi dan Sumber pada aplikasi.

Alat ini bersifat indikatif untuk diskusi kebijakan, bukan dokumen resmi PLN atau ESDM.
