# Implementation Plan PowerShift

Versi 1.0, 2026-11-05. Status: draf untuk review user.
Turunan dari `plan/prd-powershift.md`. ID FR, DS, V merujuk PRD.

## 0. Aturan Main

- Agent mengerjakan, user menyetujui di akhir tiap fase (gerbang). Fase berikutnya tidak dimulai sebelum gerbang lolos, kecuali tugas yang ditandai paralel.
- Operasi git dan deploy oleh user. Agent tidak menjalankan git selain read-only.
- Tugas yang butuh aksi user ditandai `[USER]`.
- Setiap tugas selesai dicatat di `agents/knowledges/project.md` (status) dan, jika ada temuan data, di `agents/knowledges/isu-energi.md` atau knowledge data baru.
- Angka yang masuk ke model harus punya entri di `external/citations.csv`.
- Kode mengikuti `agents/user-preferences/code-style.md`.

## 1. Ringkasan Fase

| Fase | Isi | Keluaran utama | Gerbang |
| --- | --- | --- | --- |
| F0 | Persiapan repo dan environment | Struktur folder, `.gitignore`, env uv | Struktur disetujui |
| FD | Pengumpulan dan olah data | `data/processed/*`, `parameters.json`, citations lengkap | Tabel data dan status verifikasi direview |
| FM | Model | `web/js/model.js`, hitung tangan Cirebon-1 | Angka Cirebon-1 cocok dan masuk akal |
| FW | Aplikasi web | Situs statis lengkap P1 | Demo 3 menit berjalan |
| FV | Validasi dan sensitivitas | Hasil V1-V5, grafik tornado | Hasil H1-H3 dibahas |
| FR | Laporan | Draf 7 bagian, 10-15 halaman | Draf direview |
| FH | Rilis | Situs online, laporan PDF | Selesai |

Urutan: F0 -> FD -> FM -> FW -> FV -> FR -> FH. FR boleh mulai paralel setelah FD (bab latar dan dampak tidak bergantung model).

## 2. F0 Persiapan

| ID | Tugas | Keluaran | Selesai jika |
| --- | --- | --- | --- |
| T0-1 | Buat struktur folder sesuai PRD bagian 9 + `.gitkeep` di folder kosong | Folder `data/`, `scripts/`, `web/`, `validation/` | Struktur ada |
| T0-2 | Buat `.gitignore` (Python, venv, cache, `internal/`, file data besar seperti GeoTIFF) | `.gitignore` | `internal/` dan GeoTIFF ter-ignore |
| T0-3 | Inisialisasi environment Python dengan uv: `pyproject.toml` minimal | Env siap | `uv run python -c "import pandas"` jalan |
| T0-4 `[USER]` | `git init` dan repo remote jika diinginkan | Repo | Dilakukan user |

Catatan: data mentah besar (GeoTIFF Global Solar Atlas) tidak masuk git. Skrip mencatat URL unduhnya.

## 3. FD Pengumpulan dan Olah Data

Format umum: unduhan asli di `data/raw/<sumber>/`, skrip di `scripts/`, hasil di `data/processed/`. Setiap sumber punya entri citations dan lisensi.

### 3.1 PLTU

| ID | Tugas | Sumber | Keluaran | Selesai jika |
| --- | --- | --- | --- | --- |
| TD-01 `[USER]` | Isi formulir unduh GEM Global Coal Plant Tracker, simpan file Excel ke `data/raw/gem/` | DS-01 | File GCPT terbaru | File ada |
| TD-02 | Filter unit Jawa-Bali, status operating atau dalam konstruksi, terhubung jaringan PLN (buang captive). Kolom: nama, unit, MW, COD, pemilik, koordinat, provinsi, emisi | DS-01 | `data/processed/plants.json` | Daftar unit Jawa-Bali lengkap, jumlah MW dicocokkan dengan angka kapasitas PLTU Jawa-Bali dari ESDM/PLN (selisih dicatat) |
| TD-03 `[USER jika perlu]` | Unduh TZ-CAT Indonesia (Excel + metodologi) | DS-02 | `data/raw/tzcat/` | File ada atau dicatat tidak bisa diakses |
| TD-04 | Gabungkan TZ-CAT ke daftar PLTU: tipe IPP/PLN, akhir PPA, tarif kapasitas, biaya ganti, pekerja. Kosong diisi aturan default (PRD 7.4) dan ditandai `assumption` | DS-02, DS-14 | `plants.json` lengkap | Setiap unit punya `ppa_end`, `type`, `cap_charge` dengan status |
| TD-05 | Kumpulkan fakta Cirebon-1: COD 2012, PPA 30 tahun sampai 2042, rencana pensiun 2035 (ADB), estimasi biaya US$230-300 juta, Rp4,65 T (Bisnis 2022), pembatalan Desember 2025 | DS-03 | Bagian Cirebon-1 di `parameters.json` + citations | Semua angka bersumber |
| TD-06 | Ekstrak tabel dampak kesehatan per PLTU dari laporan CREA/IESR 2023. Cocokkan nama PLTU dengan GEM | DS-04 | `health` di `plants.json` | Unit Jawa-Bali terisi atau fallback rata-rata armada tercatat |

### 3.2 Sistem dan Pasar Listrik

| ID | Tugas | Sumber | Keluaran | Selesai jika |
| --- | --- | --- | --- | --- |
| TD-07 | Cari dan unduh Statistik PLN terbaru (2024 atau 2025) atau Statistik Ketenagalistrikan ESDM | DS-05 | `data/raw/pln/` | PDF ada |
| TD-08 | Ekstrak per provinsi/UID Jawa-Bali: pelanggan dan penjualan per golongan (R1 450, 900, 900 RTM, >=1300, bisnis, industri, sosial/pemerintah) | DS-05 | `data/processed/provinces.json` | Tujuh provinsi terisi. Total dicocokkan dengan total Jawa-Bali |
| TD-09 | Tarif per golongan 2026 | DS-06 | `parameters.json` | 450 VA Rp415, 900 VA Rp605, 900 RTM Rp1.352, 1300-2200 VA Rp1.444,70 dan golongan lain terisi |
| TD-10 | Beban puncak, daya mampu, kapasitas terpasang, reserve margin Jawa-Bali tahun dasar, pertumbuhan beban, tambahan kapasitas RUPTL 2025-2034 | DS-07 | `parameters.json` (bagian system) | Angka tahun dasar dari sumber resmi. Konflik angka dicatat |
| TD-11 | Faktor emisi grid Jawa-Bali terbaru (ESDM Gatrik) | DS-11 | `parameters.json` | Tercatat dengan tahun |
| TD-12 | Harga batu bara DMO, biaya variabel PLTU, BPP pembangkitan terbaru | DS-12 | `parameters.json` | Tercatat |
| TD-13 | Anggaran subsidi listrik dan porsi Jawa-Bali | DS-16 | `parameters.json` | Tercatat atau diestimasi dari porsi pelanggan |

### 3.3 PLTS Atap

| ID | Tugas | Sumber | Keluaran | Selesai jika |
| --- | --- | --- | --- | --- |
| TD-14 | Kapasitas PLTS atap terpasang terbaru (nasional 538 MWp Juli 2025) dan per provinsi jika ada, kuota 2024-2028 | DS-13 | `parameters.json`, `provinces.json` | Tercatat |
| TD-15 | Harga PLTS atap per kWp per segmen (rumah Rp14-20 juta/kWp) dan harga program borongan | DS-10 | `parameters.json` | Rentang + nilai default |
| TD-16 | Porsi dipakai sendiri per segmen | Literatur | `parameters.json` | Bersumber atau ditandai asumsi |
| TD-17 | Kurva respon balik modal | DS-15 | `parameters.json` | Tabel bertingkat bersumber |
| TD-18 | Faktor pekerja: pekerja per MW PLTU, job-year per MW PLTS atap | DS-14 | `parameters.json` | Bersumber |

### 3.4 Geospasial

| ID | Tugas | Sumber | Keluaran | Selesai jika |
| --- | --- | --- | --- | --- |
| TD-19 | Unduh geoBoundaries IDN ADM1 dan ADM2, ambil Jawa-Bali, sederhanakan geometri | DS-09 | `data/processed/provinces.geojson`, `regencies.geojson` | Ukuran provinsi < 300 KB, kabupaten < 1,5 MB |
| TD-20 | Unduh PVOUT Indonesia dari Global Solar Atlas. Hitung rata-rata per provinsi dan kabupaten | DS-08 | `pvout` di `provinces.json`, atribut di `regencies.geojson` | Nilai masuk akal (sekitar 1.200-1.500 kWh/kWp) |
| TD-21 | Siapkan konfigurasi peta dasar dan teks atribusi | DS-17 | Konstanta di `map.js`, `licenses.md` | Atribusi lengkap |

### 3.5 Penutup Fase Data

| ID | Tugas | Keluaran | Selesai jika |
| --- | --- | --- | --- |
| TD-22 | Satukan semua parameter ke `data/processed/parameters.json` dengan struktur `{nilai, satuan, source_id, status, catatan}` | `parameters.json` | Semua parameter PRD bagian 7 ada |
| TD-23 | Lengkapi `external/citations.csv` dan `external/licenses.md` untuk semua sumber yang dipakai | Dua file | Tidak ada `source_id` tanpa entri |
| TD-24 | Ringkasan data untuk review: tabel parameter, status verified/assumption, celah | Knowledge `agents/knowledges/data.md` | Direview user (gerbang FD) |

## 4. FM Model

| ID | Tugas | Keluaran | Selesai jika |
| --- | --- | --- | --- |
| TM-01 | Hitung tangan Cirebon-1 di notebook Python atau spreadsheet untuk tahun 2030, 2035, 2040 (preset Paket Cirebon-1 dan baseline) | `validation/cirebon1_manual.*` | Angka per komponen neraca tersedia |
| TM-02 | Tulis `model.js`: fungsi `run(params, scenario)` sesuai PRD bagian 7, keluaran per tahun | `web/js/model.js` | Berjalan di browser dan Node |
| TM-03 | Preset skenario sebagai objek data | `web/js/presets.js` atau di `parameters.json` | Empat preset |
| TM-04 | Halaman uji sederhana yang menjalankan V2 dan V3 dan membandingkan dengan TM-01 (V1) | `validation/test.html` atau skrip Node | Semua uji lolos |
| TM-05 | Catat hasil awal H1-H3 untuk preset default | Knowledge `agents/knowledges/hasil-model.md` | Direview user (gerbang FM) |

## 5. FW Aplikasi Web

| ID | Tugas | FR | Selesai jika |
| --- | --- | --- | --- |
| TW-01 | Kerangka `index.html`, layout PRD bagian 10, CSS dasar, responsif | - | Layout tampil di 1366x768 dan 1920x1080 |
| TW-02 | Peta Leaflet: peta dasar, titik PLTU, legenda, atribusi | FR-M1, FR-M10 | Titik tampil benar |
| TW-03 | Choropleth provinsi PLTS atap | FR-M3 | Warna berubah sesuai skenario |
| TW-04 | Slider tahun + tombol putar, sinkron peta dan kartu angka | FR-M2 | Animasi halus |
| TW-05 | Popup PLTU dengan tombol pensiunkan dini | FR-M4 | Klik mengubah skenario |
| TW-06 | Panel paket kebijakan dan preset | FR-01 sampai FR-07 | Semua input memicu hitung ulang |
| TW-07 | Kartu angka | FR-R1 | Angka cocok dengan model |
| TW-08 | Tab Neraca, Keandalan, Dampak dengan Chart.js | FR-R2 sampai FR-R4, FR-R6 | Grafik tampil dan berubah |
| TW-09 | Tab Kriteria Permen 10/2025 | FR-R5 | Tabel terisi per PLTU terpilih |
| TW-10 | Ekspor CSV dan PNG, URL state | FR-E1 sampai FR-E3 | Link membuka skenario yang sama |
| TW-11 | Halaman Asumsi, Metode, Sumber, disclaimer | FR-S1 sampai FR-S4 | Isi lengkap |
| TW-12 | P2: popup provinsi, lapisan PVOUT, lingkar dampak, choropleth 450/900 VA, parameter bisa diubah | FR-M5 sampai FR-M8, FR-08 | Dikerjakan jika P1 selesai |
| TW-13 | Uji demo 3 menit (V5) | - | Gerbang FW |

## 6. FV Validasi dan Sensitivitas

| ID | Tugas | Keluaran | Selesai jika |
| --- | --- | --- | --- |
| TV-01 | Jalankan ulang V1-V3 pada versi final | Catatan hasil | Lolos |
| TV-02 | Sensitivitas plus minus 20 persen parameter kunci (V4), grafik tornado | `validation/sensitivity.*`, PNG | Grafik siap laporan |
| TV-03 | Ringkas temuan H1-H3 dan kondisi kelayakan paket | Knowledge `hasil-model.md` | Gerbang FV |

## 7. FR Laporan

Format laporan menunggu keputusan user (PRD pertanyaan terbuka 1).

| ID | Tugas | Isi | Bergantung |
| --- | --- | --- | --- |
| TR-01 | Kerangka laporan: sampul, daftar isi, 7 bagian, daftar pustaka APA, lampiran | Struktur | - |
| TR-02 | Bagian 1 Latar dan isu | Rantai sebab, kondisi 2025-2026, pertanyaan kajian | FD |
| TR-03 | Bagian 2 Dampak | Emisi sektor energi, dampak kesehatan PLTU, pekerja dan daerah, beban rumah tangga. Peta PLTU sebagai gambar | FD |
| TR-04 | Bagian 3 Opsi respons | Empat opsi (preset), kelebihan dan keterbatasan, matriks perbandingan | FV |
| TR-05 | Bagian 4 Inovasi | PowerShift: kebaruan vs alat lain, cara kerja, kecocokan Indonesia | FW |
| TR-06 | Bagian 5 Kelayakan | Hasil Paket Cirebon-1, biaya pengembangan dan pengelolaan, pelaksana, risiko, KPI | FV |
| TR-07 | Bagian 6 Rekomendasi | Langkah konkret per aktor | FV |
| TR-08 | Bagian 7 Tabel kontribusi `[USER]` | Diisi user | - |
| TR-09 | Lampiran: hitung tangan Cirebon-1, tabel asumsi, data ringkas | - | FM, FV |
| TR-10 | Daftar pustaka dari `external/citations.csv`, minimal 10 rujukan resmi atau jurnal | - | FD |
| TR-11 | Cek aturan: 10-15 halaman isi, tabel dan gambar bernomor dan bersumber, karakter terlarang | - | Semua |

Bahan dari laporan lama (Bab 2.1, 2.3, 5.1-5.3) dipakai ulang hanya setelah sumbernya dicek.

## 8. FH Rilis

| ID | Tugas | Keluaran |
| --- | --- | --- |
| TH-01 | Cek akhir: atribusi, disclaimer, link, ukuran data | Daftar periksa |
| TH-02 `[USER]` | Commit, push, aktifkan hosting statis dari folder `web/` | URL publik |
| TH-03 | Tempel URL publik ke laporan dan halaman Sumber | Laporan final |
| TH-04 `[USER]` | Ekspor laporan ke `ProyekMinor_Kelompok-XX.pdf` dan kumpulkan | PDF |

## 9. Tugas Bonus

| ID | Tugas | Syarat mulai |
| --- | --- | --- |
| TB-01 | Atapku: kalkulator rumah tangga ringkas, mengikuti paket aktif. Tidak masuk laporan | FH selesai atau waktu cukup |
| TB-02 | Jalur transmisi di peta (FR-M9) | Sama |
| TB-03 | Ekspor PNG peta (FR-E4) | Sama |
| TB-04 | MapLibre 3D jika Leaflet terasa kurang | Persetujuan user |

## 10. Daftar Aksi User

1. TD-01: isi formulir unduh GEM Global Coal Plant Tracker (link dikirim ke email).
2. TD-03: unduh TZ-CAT Indonesia jika butuh formulir.
3. T0-4 dan TH-02: git, remote, hosting.
4. Putuskan format penulisan laporan.
5. TR-08: tabel kontribusi dan nomor kelompok.
6. Review di tiap gerbang.
