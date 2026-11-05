# PRD PowerShift

Versi 1.0, 2026-11-05. Status: draf untuk review user.
Dasar keputusan: `ideas/plan-ideasi-v2-sisi-pln.md` (bagian 9, 11, 12) dan persetujuan user 2026-11-05 (cakupan Jawa-Bali, teknologi situs statis JS + Chart.js + Leaflet).
Rencana kerja: `plan/implementation-plan.md`. Referensi: `external/citations.csv`. Lisensi: `external/licenses.md`.

## 1. Ringkasan

PowerShift adalah alat bantu keputusan berbasis web untuk merancang paket "pensiun dini PLTU + penyerapan PLTS atap" di sistem listrik Jawa-Bali. Alat ini menghitung siapa menanggung apa (PLN, APBN, pelanggan, pekerja, warga sekitar PLTU) per tahun 2026-2040, dibanding skenario phase down di akhir PPA. Hasil ditampilkan lewat peta interaktif Jawa-Bali dan grafik.

Kalimat pitch: "PLTS atap sendirian merugikan PLN di tengah oversupply. Dipasangkan dengan pensiun PLTU, biaya tetap PLN ikut turun. PowerShift menghitung paket mana yang membuat PLN dan negara berani."

Demo utama: PLTU Cirebon-1 (660 MW, IPP, COD 2012, PPA sampai 2042, rencana pensiun dini 2035 yang dibatalkan Desember 2025).

## 2. Masalah

Rantai sebab (detail di plan v2 bagian 2):

```
oversupply Jawa-Bali + kontrak take-or-pay PLTU IPP + harga batu bara DMO
  -> PLTS atap mengurangi penjualan PLN, biaya kapasitas PLTU tetap dibayar
  -> kerugian PLN = beban APBN (tarif ditetapkan pemerintah)
  -> kebijakan menahan PLTS atap (Permen ESDM 2/2024: tanpa net metering, kuota)
  -> pensiun dini PLTU dianggap mahal dan berisiko (Cirebon-1 batal, 5 GW -> 1,6 GW)
```

Permen ESDM 10/2025 mewajibkan kajian PLN 6 bulan dengan kriteria kapasitas, usia, utilisasi, emisi, nilai tambah ekonomi, pendanaan, transisi berkeadilan, keandalan sistem, dan dampak BPP ke tarif. Belum ada alat publik yang menghitung kriteria itu untuk paket berpasangan PLTS atap + pensiun PLTU dari sisi neraca PLN dan APBN.

Jendela waktu: reserve margin Jawa-Bali diperkirakan turun di bawah batas aman sekitar 2027. Setelah itu setiap PLTU yang pensiun harus diganti.

## 3. Tujuan dan Bukan Tujuan

### Tujuan

| ID | Tujuan | Ukuran tercapai |
| --- | --- | --- |
| G1 | Menghitung neraca PLN dan APBN untuk paket kebijakan, per tahun 2026-2040 | Neraca tampil dan cocok dengan hitung tangan Cirebon-1 |
| G2 | Menunjukkan keandalan sistem secara sederhana | Reserve margin tiap tahun vs batas aman tampil |
| G3 | Menunjukkan dampak dan keadilan | CO2, kematian dini, pekerja terdampak, manfaat per golongan tampil |
| G4 | Visual peta Jawa-Bali yang menonjol dan bergerak | Peta PLTU dengan slider waktu dan choropleth provinsi |
| G5 | Menguji hipotesis H1-H3 untuk laporan | Empat preset skenario bisa dibandingkan |
| G6 | Menghasilkan grafik dan tabel bersumber untuk laporan | Unduh PNG dan CSV |
| G7 | Bisa diakses kapan saja, gratis | Situs statis, terbuka di bawah 3 detik |

Hipotesis yang diuji:

- H1: PLTS atap tanpa pensiun PLTU memperburuk neraca PLN di tengah oversupply.
- H2: paket PLTS atap + pensiun dini satu PLTU memperkecil kerugian itu, dengan syarat ada pendanaan kompensasi di luar PLN.
- H3: ada kombinasi skema kompensasi ekspor, kuota, dan sumber dana yang membuat neraca PLN mendekati netral sambil tetap menarik bagi pelanggan.

Jika hasil model menolak hipotesis, laporan menulis apa adanya.

### Bukan Tujuan

- Simulasi dispatch per jam, aliran daya, stabilitas frekuensi.
- Optimasi otomatis (mencari paket terbaik). Pengguna yang menggeser tuas.
- Angka keuangan IPP yang presisi. Kontrak IPP tidak publik, dipakai asumsi yang bisa diubah.
- Login, database, backend, data real-time.
- Cakupan di luar sistem Jawa-Bali. PLTU captive (industri, smelter) tidak dimasukkan karena di luar jaringan PLN.
- Atapku (kalkulator rumah tangga). Bonus, hanya jika waktu cukup, tidak masuk laporan.
- Aplikasi mobile. Desktop dan proyektor 16:9 jadi target utama. Ponsel cukup bisa dibuka.

## 4. Pengguna

| Persona | Kebutuhan | Fitur kunci |
| --- | --- | --- |
| Analis Ditjen Ketenagalistrikan ESDM | Bahan kajian pensiun dini sesuai Permen 10/2025 | Neraca, kriteria Permen 10/2025, asumsi bisa diubah |
| Tim perencanaan PLN | Dampak paket ke pendapatan, BPP, cadangan | Neraca PLN, reserve margin |
| Dinas ESDM provinsi (sorotan Jawa Barat) | Kontribusi PLTS atap provinsinya, PLTU di wilayahnya | Peta choropleth, filter provinsi |
| Dosen dan asisten (penilai) | Melihat inovasi bekerja dalam 10 menit presentasi | Preset skenario, peta bergerak, angka ringkas |
| Publik dan media | Memahami kenapa transisi macet | Bahasa Indonesia sederhana, penjelasan singkat |

Bahasa antarmuka: Indonesia.

## 5. Alur Demo (3 menit)

1. Buka PowerShift. Preset "Phase down PPA" aktif. Peta Jawa-Bali menampilkan PLTU, slider tahun di 2026.
2. Tekan putar. PLTU meredup sesuai akhir PPA. Kartu angka menunjukkan emisi dan cadangan.
3. Pilih preset "PLTS atap saja". Neraca PLN memerah (H1).
4. Pilih preset "Paket Cirebon-1". Cirebon-1 pensiun 2035, PLTS atap naik, sebagian kompensasi dari ETM. Neraca membaik (H2).
5. Geser skema kompensasi ekspor dan sumber dana. Cari titik neraca mendekati netral (H3).
6. Buka tab Kriteria Permen 10/2025. Tunjukkan daftar periksa Cirebon-1.
7. Tekan Bagikan. Link skenario tersalin.

## 6. Kebutuhan Fungsional

Prioritas: P1 wajib, P2 sebaiknya ada, P3 bonus.

### 6.1 Panel Paket Kebijakan

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-01 | Pilih satu atau beberapa PLTU Jawa-Bali untuk dipensiunkan dini, default Cirebon-1. Tiap PLTU terpilih punya slider tahun pensiun (2027 sampai tahun baseline) | P1 |
| FR-02 | Skema kompensasi ekspor PLTS atap: 0 persen (aturan sekarang), 65 persen, 100 persen, atau nilai bebas | P1 |
| FR-03 | Target tambahan PLTS atap per tahun Jawa-Bali (MW), dengan bobot segmen: rumah tangga non subsidi, rumah tangga 450/900 VA lewat program, bisnis, industri, gedung pemerintah | P1 |
| FR-04 | Pengalihan subsidi 450/900 VA ke program PLTS atap (persen anggaran subsidi Jawa-Bali) | P1 |
| FR-05 | Sumber dana kompensasi pensiun dini: porsi ETM/JETP, APBN, PLN (jumlah 100 persen) | P1 |
| FR-06 | Preset: Phase down PPA (baseline), PLTS atap saja, Pensiun dini saja, Paket Cirebon-1 | P1 |
| FR-07 | Tombol reset ke baseline | P1 |
| FR-08 | Parameter lanjutan di halaman Asumsi: pertumbuhan beban, harga PLTS per kWp, harga batu bara, kurs, faktor kapasitas, porsi pemakaian sendiri, dll | P2 |

### 6.2 Peta (pusat tampilan)

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-M1 | Titik PLTU Jawa-Bali. Ukuran = kapasitas. Warna = tahun pensiun pada skenario aktif. Hanya PLTU terhubung jaringan PLN | P1 |
| FR-M2 | Slider tahun 2026-2040 dengan tombol putar. PLTU yang sudah pensiun tampil redup. Kartu angka ikut tahun slider | P1 |
| FR-M3 | Choropleth provinsi: kapasitas PLTS atap kumulatif (MWp) pada tahun slider | P1 |
| FR-M4 | Klik PLTU -> popup: nama, pemilik, tipe (IPP/PLN), kapasitas, COD, akhir PPA atau umur desain, emisi, dampak kesehatan, status di skenario, tombol "pensiunkan dini" | P1 |
| FR-M5 | Klik provinsi -> popup: PLTS atap terpasang, pelanggan, penjualan PLN yang hilang | P2 |
| FR-M6 | Lapisan potensi surya (PVOUT) rata-rata per kabupaten | P2 |
| FR-M7 | Lingkar dampak di sekitar PLTU: perkiraan kematian dini per tahun | P2 |
| FR-M8 | Choropleth pelanggan 450/900 VA per provinsi | P2 |
| FR-M9 | Jalur transmisi | P3 |
| FR-M10 | Legenda jelas, atribusi data dan peta dasar di pojok peta | P1 |

Tidak dibuat: panah aliran listrik dari provinsi ke PLTU (menyesatkan secara fisik).

### 6.3 Hasil

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-R1 | Kartu angka: neraca bersih PLN kumulatif, beban APBN kumulatif, CO2 dihindari, kematian dini dihindari, PLTS atap terpasang, reserve margin minimum. Selalu dibandingkan dengan baseline | P1 |
| FR-R2 | Tab Neraca: batang bertumpuk per tahun (pendapatan hilang, biaya energi dihemat, biaya kapasitas dihemat, kompensasi pensiun, kompensasi ekspor) + garis neraca bersih. Toggle PLN / APBN | P1 |
| FR-R3 | Tab Keandalan: garis reserve margin dua skenario + pita batas aman 30-35 persen. Batang energi PLTS atap vs energi PLTU yang pensiun | P1 |
| FR-R4 | Tab Dampak: CO2 kumulatif dua skenario, kematian dini dihindari, pekerja PLTU terdampak per tahun, pekerjaan instalasi PLTS, manfaat per segmen pelanggan | P1 |
| FR-R5 | Tab Kriteria Permen 10/2025: tabel per PLTU terpilih, status indikatif (terpenuhi, sebagian, belum) per kriteria beserta angka pendukung | P1 |
| FR-R6 | Teks penjelasan pendek di tiap tab (satu sampai dua kalimat) | P1 |

### 6.4 Ekspor dan Bagikan

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-E1 | Unduh CSV hasil per tahun (semua variabel keluaran) | P1 |
| FR-E2 | Unduh PNG tiap grafik | P1 |
| FR-E3 | Simpan skenario di URL (parameter query). Membuka link memulihkan skenario | P1 |
| FR-E4 | Unduh PNG peta pada tahun tertentu | P3 |

### 6.5 Halaman Pendukung

| ID | Kebutuhan | Prioritas |
| --- | --- | --- |
| FR-S1 | Halaman Asumsi: tabel parameter (nama, nilai, satuan, sumber, status verifikasi). Nilai bisa diubah dan dipakai model | P1 tampil, P2 bisa diubah |
| FR-S2 | Halaman Metode: rumus model ringkas dan batasan | P1 |
| FR-S3 | Halaman Sumber: daftar data dan lisensi, teks atribusi | P1 |
| FR-S4 | Disclaimer singkat di footer: alat indikatif, bukan dokumen resmi | P1 |

## 7. Model

Prinsip: tahunan, deterministik, bisa dihitung ulang di spreadsheet, setiap parameter punya sumber atau ditandai asumsi.

### 7.1 Indeks

- t: tahun 2026-2040. Tahun dasar data 2025 (atau tahun data terbaru yang tersedia).
- p: unit PLTU Jawa-Bali terhubung jaringan PLN.
- r: provinsi (DKI Jakarta, Banten, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur, Bali).
- s: segmen PLTS atap (rt_nonsub, rt_program, bisnis, industri, pemerintah).

### 7.2 Sistem

- Beban puncak: `P_t = P_0 x (1 + g)^(t - t0)`
- Kebutuhan energi: `D_t = D_0 x (1 + g)^(t - t0)`
- Daya mampu: `C_t = C_0 + tambahan_t - pensiun_t`. `tambahan_t` dari asumsi agregat RUPTL. `pensiun_t` = kapasitas PLTU yang sudah pensiun pada skenario.
- Reserve margin: `RM_t = (C_t - P_t) / P_t`
- PLTS atap tidak menambah daya mampu karena beban puncak Jawa-Bali terjadi malam hari (asumsi konservatif, dicek di pengumpulan data).

### 7.3 PLTS Atap

Dua jalur adopsi:

1. Jalur pasar (rt_nonsub, bisnis, industri, pemerintah):
   - Hemat per kWp per tahun: `H_s = Y_r x (sc_s x T_s + (1 - sc_s) x e x T_s)`
     - `Y_r`: produksi kWh/kWp/tahun provinsi (PVOUT Global Solar Atlas)
     - `sc_s`: porsi dipakai sendiri, `T_s`: tarif segmen, `e`: skema kompensasi ekspor (0 sampai 1)
   - Balik modal: `PB_s = harga_kWp / H_s`
   - Realisasi: `K_baru_s,t = target_t x bobot_s x f(PB_s)`. `f` adalah kurva respon balik modal (tabel bertingkat dari literatur pangsa pasar vs balik modal, ditandai asumsi).
   - Dipotong kuota jika kuota diaktifkan.
2. Jalur program (rt_program, 450/900 VA):
   - `K_baru_program,t = anggaran_dialihkan_t / harga_kWp_program`
   - Tidak bergantung balik modal karena dibiayai program.
- Alokasi ke provinsi: proporsional porsi pelanggan atau penjualan segmen per provinsi (Statistik PLN).
- Energi: `E_pv,t = sum(K_kumulatif x Y_r)`. Degradasi diabaikan.

### 7.4 PLTU

- Baseline pensiun: IPP di akhir PPA, PLN di akhir umur desain (asumsi 40 tahun sejak COD jika tidak ada data).
- Skenario: unit terpilih pensiun di tahun pilihan pengguna.
- Energi unit: `E_p = MW_p x CF_p x 8760`. `CF_p` default per tipe, Cirebon-1 dari data jika ada.
- Emisi unit: `EF_p` (tCO2/MWh) dari GEM, fallback faktor emisi grid.

### 7.5 Neraca PLN (Rp per tahun, positif = PLN lebih untung dari baseline)

```
N_t = - pendapatan_hilang_t
      - kompensasi_ekspor_t
      + biaya_energi_dihemat_t
      + biaya_kapasitas_dihemat_t
      - kompensasi_pensiun_porsi_PLN_t
      - biaya_ganti_energi_pensiun_t
```

- `pendapatan_hilang_t = sum_s(E_pv,s,t x sc_s x T_s)`
- `kompensasi_ekspor_t = sum_s(E_pv,s,t x (1 - sc_s) x e x T_s)`
- `biaya_energi_dihemat_t = E_pv,t x c_marg` (PLTS atap menggantikan pembangkit marjinal)
- `biaya_kapasitas_dihemat_t = sum_p(CP_p)` untuk IPP yang sudah pensiun dini dan masih dalam masa PPA. `CP_p = MW_p x tarif_kapasitas_p`. Untuk PLTU milik PLN: biaya tetap O&M yang dihemat.
- `biaya_ganti_energi_pensiun_t = sum_p(E_p x (c_marg - c_var_p))` untuk unit yang pensiun dini (energinya digeser ke pembangkit lain)
- `kompensasi_pensiun`: `K_p = f_buyout x NPV(sisa CP_p, r)`, dibayar di tahun pensiun atau dicicil (pilihan asumsi). Dibagi ke ETM/JETP, APBN, PLN sesuai FR-05. Kalibrasi Cirebon-1 dengan estimasi publik US$230-300 juta.
- Untuk PLTU milik PLN: kerugian sisa nilai buku (stranded asset) ditampilkan terpisah.

### 7.6 APBN

```
A_t = - pass_through x min(N_t, 0)
      - kompensasi_pensiun_porsi_APBN_t
      - anggaran_dialihkan_t
      + subsidi_dihemat_t
```

- `pass_through`: porsi kerugian PLN yang ditutup APBN lewat kompensasi tarif (default 1, sesuai premis "kerugian PLN = beban APBN").
- `subsidi_dihemat_t = E_pv,program,t x sc_program x (BPP - T_subsidi)`
- Anggaran dialihkan adalah perpindahan pos, jadi ditampilkan terpisah dari biaya baru.

### 7.7 Indikator Lain

- Dampak BPP: `dBPP_t = - N_t / penjualan_t` (Rp/kWh). Dipakai untuk kriteria "dampak BPP ke tarif".
- CO2 dihindari: `E_pv,t x EF_marg + sum_p(E_p x (EF_p - EF_marg))` untuk unit pensiun dini.
- Kematian dini dihindari: per unit `kematian_per_TWh_p x E_p` (CREA/IESR). Fallback rata-rata armada.
- Pekerja PLTU terdampak: `MW_p x pekerja_per_MW` di tahun pensiun.
- Pekerjaan PLTS atap: `K_baru_t x job_year_per_MW`.
- Manfaat per segmen: hemat tagihan agregat per segmen.

### 7.8 Kriteria Permen 10/2025 (indikatif)

| Kriteria | Indikator model | Aturan indikatif |
| --- | --- | --- |
| Kapasitas | MW unit | Ditampilkan, tanpa ambang |
| Usia | tahun sejak COD | Ditampilkan |
| Utilisasi | CF | Ditampilkan |
| Emisi GRK | tCO2/tahun, intensitas | Dibanding rata-rata armada |
| Nilai tambah ekonomi | neraca PLN + APBN kumulatif | Hijau jika positif |
| Dukungan pendanaan | porsi ETM/JETP | Hijau jika porsi luar >= 50 persen (asumsi) |
| Transisi berkeadilan | pekerja terdampak, pekerjaan PLTS | Ditampilkan, catatan kualitatif |
| Keandalan sistem | RM minimum | Hijau jika >= 30 persen |
| Dampak BPP ke tarif | dBPP maksimum | Hijau jika <= ambang (asumsi) |

Ambang adalah asumsi tim, bukan tafsir hukum. Ditulis jelas di halaman Metode.

### 7.9 Preset Skenario

| Preset | Pensiun dini | PLTS atap | Kompensasi ekspor | Dana pensiun |
| --- | --- | --- | --- | --- |
| Phase down PPA | Tidak ada | Tren sekarang | 0 | - |
| PLTS atap saja | Tidak ada | Target tinggi | 0 | - |
| Pensiun dini saja | Cirebon-1 2035 | Tren sekarang | 0 | ETM porsi besar |
| Paket Cirebon-1 | Cirebon-1 2035 | Target tinggi | Sedang | ETM porsi besar |

Angka persis ditetapkan setelah data terkumpul.

## 8. Kebutuhan Data

Status per 2026-11-05. Detail tugas di implementation plan fase D.

| ID | Data | Sumber | Lisensi | Cara ambil | Ketersediaan |
| --- | --- | --- | --- | --- | --- |
| DS-01 | PLTU per unit: nama, koordinat, MW, COD, pemilik, status, emisi | GEM Global Coal Plant Tracker | CC BY 4.0 | Formulir unduh GEM (link ke email, dilakukan user) | Tinggi |
| DS-02 | Akhir PPA, tarif kapasitas, biaya buyout per unit | TZ-CAT Indonesia (2022), berita, ADB | Belum dicek | Unduh TZ-CAT, ekstraksi | Rendah-sedang |
| DS-03 | Data Cirebon-1 detail | ADB, ESDM, berita | Kutipan fakta | Manual | Sedang |
| DS-04 | Kematian dan biaya kesehatan per PLTU | CREA/IESR 2023 | Hak cipta, kutipan | Ekstraksi tabel PDF | Sedang, perlu cek |
| DS-05 | Penjualan dan pelanggan per golongan per provinsi | Statistik PLN / Statistik Ketenagalistrikan ESDM | Dokumen publik, kutipan | Ekstraksi PDF | Sedang-tinggi |
| DS-06 | Tarif per golongan 2026 | Pengumuman tarif PLN/ESDM | Fakta publik | Manual | Tinggi |
| DS-07 | Beban puncak, daya mampu, reserve margin Jawa-Bali | ESDM, PLN, RUPTL 2025-2034 | Dokumen publik | Manual | Sedang |
| DS-08 | PVOUT per provinsi dan kabupaten | Global Solar Atlas | CC BY 4.0 | Unduh GeoTIFF, olah zonal | Tinggi |
| DS-09 | Batas provinsi dan kabupaten | geoBoundaries IDN ADM1/ADM2 | CC BY 4.0 | Unduh GeoJSON | Tinggi |
| DS-10 | Harga PLTS atap per kWp | Berita, IESR, AESI | Kutipan | Manual | Tinggi |
| DS-11 | Faktor emisi grid Jawa-Bali | ESDM Gatrik | Dokumen publik | Manual | Sedang |
| DS-12 | Harga batu bara DMO, biaya variabel PLTU, BPP | Kepmen ESDM | Dokumen publik | Manual | Sedang |
| DS-13 | Kapasitas PLTS atap terpasang dan kuota | ESDM, PLN | Kutipan | Manual | Sedang |
| DS-14 | Pekerja per MW PLTU, job-year per MW PLTS | TZ-CAT, IRENA, literatur | Kutipan | Manual | Sedang |
| DS-15 | Kurva respon balik modal | Literatur adopsi PV | Kutipan | Manual | Sedang |
| DS-16 | Anggaran subsidi listrik dan porsi Jawa-Bali | APBN, Kemenkeu, PLN | Kutipan | Manual | Sedang |
| DS-17 | Peta dasar | OpenStreetMap / CARTO | ODbL + syarat tile | Langsung di aplikasi | Tinggi |

Aturan data:

- Setiap angka di `parameters.json` membawa `source_id` yang merujuk `external/citations.csv` dan `status`: `verified` (dicek ke dokumen asli) atau `assumption`.
- Data mentah disimpan apa adanya di `data/raw/<sumber>/`. Hasil olah di `data/processed/`.

## 9. Arsitektur dan Teknologi

```
data/raw/            unduhan asli per sumber
data/processed/      JSON/GeoJSON hasil olah
scripts/             skrip Python olah data (sekali jalan, tidak di-hosting)
web/                 situs statis yang di-hosting
  index.html         peta + panel + hasil
  assumptions.html   asumsi dan sumber
  method.html        metode dan batasan
  css/style.css
  js/model.js        rumus model, tanpa akses DOM
  js/map.js          Leaflet
  js/charts.js       Chart.js
  js/ui.js           panel, preset, URL state, ekspor
  js/app.js          perekat
  data/              salinan data/processed yang dipakai web
validation/          hitung tangan Cirebon-1 (notebook atau spreadsheet) dan uji model
```

- Library: Leaflet 1.9.x, Chart.js 4.x, dimuat dari CDN dengan versi tetap. Tanpa framework, tanpa build tool.
- Python: dikelola dengan uv. Kandidat paket: pandas, geopandas, rasterio, shapely, openpyxl, pdfplumber.
- Model di `model.js` berupa fungsi murni `run(params, scenario) -> results`, supaya mudah diuji dan dicocokkan dengan hitung tangan.
- State skenario di URL query string.
- Hosting: situs statis gratis (GitHub Pages, Netlify, atau Cloudflare Pages). Operasi git dan deploy dilakukan user.
- Peta dasar: tile CARTO Positron atau OSM dengan atribusi, tanpa API key.

## 10. Desain Tampilan

```
+--------------------------------------------------------------------------------+
| PowerShift  Paket pensiun PLTU + PLTS atap, sistem Jawa-Bali   Asumsi Metode  |
+------------------+-------------------------------------------------------------+
| PAKET            | [Neraca PLN] [Beban APBN] [CO2] [Jiwa] [PLTS atap] [RM min] |
| Preset       v   +-------------------------------------------------------------+
| PLTU dipilih     |                                                             |
|  Cirebon-1  2035 |                  PETA JAWA-BALI                             |
|  + tambah        |       titik PLTU (ukuran = MW, warna = tahun pensiun)       |
| Ekspor PLTS  0%  |       choropleth provinsi (MWp PLTS atap)                   |
| Target MW/thn    |                                                             |
| Bobot segmen     |  [>] 2026 ----------o-------------------------------- 2040  |
| Subsidi dialih   +-------------------------------------------------------------+
| Dana: ETM APBN   | Neraca | Keandalan | Dampak | Kriteria Permen 10/2025       |
|  PLN             |  grafik + penjelasan singkat     [PNG] [CSV]               |
| [Reset] [Bagikan]|                                                             |
+------------------+-------------------------------------------------------------+
| Disclaimer singkat | Atribusi data                                              |
+--------------------------------------------------------------------------------+
```

- Peta mengambil porsi terbesar layar.
- Warna aman buta warna. Baseline abu-abu, paket berwarna.
- Angka besar memakai format Indonesia (Rp T, GWh, MWp).
- Target layar 1366x768 dan proyektor 1920x1080. Di layar sempit panel turun ke bawah.

## 11. Kebutuhan Non-Fungsional

| ID | Kebutuhan |
| --- | --- |
| NFR-01 | Muat awal di bawah 3 detik di koneksi kampus. Total data web di bawah 3 MB |
| NFR-02 | Hitung ulang dan gambar ulang di bawah 200 ms tiap perubahan input |
| NFR-03 | Berjalan di Chrome, Firefox, Edge versi terbaru |
| NFR-04 | Setiap angka bisa dilacak ke sumber atau ditandai asumsi |
| NFR-05 | Data web bisa dibuat ulang dari data mentah dengan skrip |
| NFR-06 | Atribusi lisensi CC BY dan ODbL tampil di aplikasi |
| NFR-07 | Tanpa pelacakan, tanpa cookie, tanpa backend |
| NFR-08 | Kode level mahasiswa menengah, rapi, mengikuti `agents/user-preferences/code-style.md` |
| NFR-09 | Tanpa watermark agent di kode, dokumen, metadata |

## 12. Validasi

- V1 Hitung tangan Cirebon-1 untuk preset "Paket Cirebon-1": neraca PLN, APBN, CO2 untuk 2-3 tahun contoh. Selisih dengan aplikasi di bawah 1 persen. Masuk lampiran laporan.
- V2 Uji kewajaran: tanpa PLTS atap dan tanpa pensiun dini, semua selisih terhadap baseline = 0. Energi tidak negatif. RM baseline sesuai data acuan tahun dasar.
- V3 Uji tanda: menaikkan kompensasi ekspor menaikkan PLTS atap dan menurunkan neraca PLN. Pensiun lebih awal menaikkan CO2 dihindari.
- V4 Sensitivitas untuk laporan: tiap parameter kunci plus minus 20 persen, grafik tornado untuk neraca PLN kumulatif.
- V5 Uji tampilan manual: alur demo bagian 5 berjalan tanpa error di dua browser.

## 13. Metrik Keberhasilan Produk

Untuk bab Kelayakan laporan.

| Jenis | Metrik | Target |
| --- | --- | --- |
| Teknis | Waktu muat, waktu hitung ulang | NFR-01, NFR-02 |
| Teknis | Cocok dengan hitung tangan | V1 lolos |
| Isi | Parameter berstatus verified | >= 70 persen parameter kunci |
| Pemakaian (setelah rilis) | Skenario dibagikan, kunjungan | Dipantau manual, tanpa pelacak |
| Dampak kebijakan | Dipakai dalam satu diskusi atau kajian | Kualitatif |

## 14. Risiko

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Data keuangan IPP tidak publik | Neraca tidak presisi | Asumsi per tipe, kalibrasi Cirebon-1 dengan angka ADB, sensitivitas di laporan |
| Unduhan GEM butuh formulir email | Pengumpulan tertunda | User mengisi formulir. Cadangan: data GEM yang sudah dicerminkan pihak ketiga atau GEM wiki per PLTU |
| Tabel CREA per PLTU tidak lengkap | Dampak kesehatan per unit kosong | Rata-rata armada per TWh sebagai fallback |
| Statistik PLN per provinsi sulit diekstrak | Alokasi provinsi kasar | Alokasi berdasarkan jumlah rumah tangga BPS |
| GeoTIFF Global Solar Atlas besar | Olah data berat | Olah sekali dengan rasterio, simpan hanya rata-rata per wilayah |
| Model terlalu rumit | Melewati level mahasiswa | Satu file model, rumus tahunan, tanpa solver |
| Hasil menolak H2/H3 | Narasi laporan berubah | Ditulis apa adanya, cari kondisi yang membuat paket layak |
| Asisten mempertanyakan batas sistem | Kredibilitas | Cakupan Jawa-Bali sudah sesuai sistem fisik |

## 15. Batasan Yang Ditampilkan di Aplikasi

- Alat indikatif untuk diskusi kebijakan, bukan dokumen resmi PLN atau ESDM.
- Kontrak IPP memakai asumsi.
- PLTS atap tidak dihitung menyumbang daya puncak malam.
- Tanpa simulasi jaringan per jam.
- Angka kesehatan berasal dari pemodelan pihak lain.

## 16. Hubungan Dengan Laporan

| Bagian laporan | Keluaran PowerShift |
| --- | --- |
| 1 Latar dan isu | Diagram rantai sebab, kondisi 2025-2026 |
| 2 Dampak | Peta PLTU Jawa-Bali, emisi, kesehatan, pekerja |
| 3 Opsi respons | Empat preset sebagai opsi, kelebihan dan keterbatasan dari hasil |
| 4 Inovasi | PowerShift: kebaruan, cara kerja, kenapa cocok |
| 5 Kelayakan | Hasil Paket Cirebon-1, biaya, pelaksana, risiko, KPI (bagian 13) |
| 6 Rekomendasi | Dari H1-H3 dan sensitivitas, siapa bertindak |
| 7 Kontribusi | Diisi user |
| Lampiran | Hitung tangan Cirebon-1, tabel asumsi, data mentah ringkas |

## 17. Pertanyaan Terbuka

1. Format penulisan laporan: Google Docs bersama kelompok, Word, atau LaTeX. Menentukan di mana bab laporan ditulis.
2. Nomor kelompok resmi (laporan lama menulis 17, topik 13).
3. Penyedia hosting: diputuskan user saat deploy.
4. Akses unduh GEM dan TZ-CAT membutuhkan formulir. User yang mengisi.
