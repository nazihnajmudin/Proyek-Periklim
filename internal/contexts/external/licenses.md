# Lisensi Data dan Perangkat Lunak

Diperbarui 2026-11-05. Status "rencana" berarti data belum diunduh. Lisensi dicek ulang saat unduh (TD-23 di implementation plan), terutama syarat yang tertulis di file unduhan.
Teks lisensi resmi ada di `licenses/`. ID merujuk `citations.csv`.

## Data

| ID | Data | Lisensi | Teks lisensi | Kewajiban | Status |
| --- | --- | --- | --- | --- | --- |
| D-GEM-GCPT | GEM Global Coal Plant Tracker | CC BY 4.0 | `licenses/CC-BY-4.0.txt` | Atribusi, sebut perubahan | Rencana, unduh lewat formulir |
| D-GSA-PVOUT | Global Solar Atlas PVOUT | CC BY 4.0 | `licenses/CC-BY-4.0.txt` | Atribusi World Bank Group, ESMAP, Solargis | Rencana |
| D-GEOBOUND | geoBoundaries IDN ADM1/ADM2 (sumber BPS, OCHA, OSM) | CC BY 4.0 | `licenses/CC-BY-4.0.txt` | Atribusi geoBoundaries + sitasi Runfola et al. 2020 | Rencana. Cek lisensi per negara di metadata unduhan |
| D-OSM | OpenStreetMap (peta dasar) | ODbL 1.0 (data), tile mengikuti kebijakan penyedia | `licenses/ODbL-1.0.txt` | Teks "(c) OpenStreetMap contributors" di peta | Rencana |
| D-CARTO | Tile CARTO basemaps | Syarat penggunaan CARTO (gratis untuk pemakaian non komersial dengan atribusi, perlu dicek) | Belum diunduh | Teks "(c) CARTO" di peta | Rencana, cek syarat terbaru |
| D-TZCAT | TransitionZero TZ-CAT Indonesia | Belum diketahui | Belum ada | Cek di file unduhan | Rencana |
| D-PLN-STAT | Statistik PLN | Tidak ada lisensi terbuka. Dokumen publik | Tidak ada | Dipakai sebagai kutipan angka dengan sitasi. Dokumen asli tidak didistribusikan ulang | Rencana |
| P-CREA-IESR-2023 | Tabel dampak kesehatan per PLTU | Hak cipta CREA/IESR | Tidak ada | Angka dikutip dengan sitasi. PDF tidak didistribusikan ulang | Rencana |
| Regulasi dan berita | Permen, Perpres, berita | Dokumen publik atau hak cipta media | Tidak ada | Dikutip dengan sitasi | Dipakai sebagai rujukan |

Catatan CC BY 4.0: boleh dipakai, diubah, dan dibagikan, termasuk komersial, asal ada atribusi, tautan lisensi, dan keterangan jika data diubah. Data PowerShift adalah turunan (difilter dan diolah), jadi atribusi menyebut "diolah oleh tim PowerShift".

## Perangkat Lunak

| Nama | Lisensi | Teks lisensi | Kewajiban |
| --- | --- | --- | --- |
| Leaflet 1.9.x | BSD 2-Clause | `licenses/Leaflet-BSD-2-Clause.txt` | Sertakan copyright notice |
| Chart.js 4.x | MIT | `licenses/Chartjs-MIT.txt` | Sertakan copyright notice |

Library dimuat dari CDN, notice sudah tercantum di file library. Halaman Sumber di aplikasi tetap mencantumkannya.

## Teks Atribusi Di Aplikasi (draf)

Pojok peta:

```
Peta dasar (c) OpenStreetMap contributors (c) CARTO | PLTU: Global Energy Monitor (CC BY 4.0) | Batas wilayah: geoBoundaries (CC BY 4.0)
```

Halaman Sumber:

```
Data PLTU: Global Energy Monitor, Global Coal Plant Tracker, versi <bulan tahun>, CC BY 4.0. Difilter untuk sistem Jawa-Bali dan diolah oleh tim PowerShift.
Potensi surya: Global Solar Atlas 2.0, World Bank Group, ESMAP, Solargis, CC BY 4.0. Dirata-ratakan per provinsi dan kabupaten oleh tim PowerShift.
Batas wilayah: geoBoundaries (Runfola et al., 2020), CC BY 4.0. Geometri disederhanakan.
Dampak kesehatan: CREA dan IESR (2023). Angka dikutip.
Pelanggan dan penjualan listrik: Statistik PLN. Angka dikutip.
Peta dasar: OpenStreetMap contributors (ODbL), CARTO.
Library: Leaflet (BSD 2-Clause), Chart.js (MIT).
```
