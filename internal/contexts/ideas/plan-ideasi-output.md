# Plan Ideasi Output Proyek Minor Periklim

Status: draf untuk direview user, 2026-11-05.
Sumber: `spesifikasi_tugas/` (PPT teknis dan laporan lama), riset web 2026-11-05.

## 1. Tugas Dalam Satu Halaman

- Mata kuliah MK4066 Perubahan Iklim (Layanan) ITB. Proyek Minor menggantikan UAS.
- Topik kelompok: no. 13, "Transisi energi: PLTS atap dan pensiun dini PLTU" (jenis: mitigasi). Laporan lama menulis "Kelompok 17".
- Tiga pertanyaan wajib: dampak apa, upaya apa, inovasi apa.
- Bentuk luaran yang dipilih: "konsep kajian" (kajian tertulis berbasis data + rancangan inovasi). Inovasinya kita wujudkan sebagai prototipe aplikasi web untuk diseminasi.
- Cakupan kita: prototipe + laporan. PPT tidak termasuk.

Aturan laporan:

| Unsur | Ketentuan |
| --- | --- |
| Format | PDF, A4 potret, nama file `ProyekMinor_Kelompok-XX.pdf` |
| Panjang | 10-15 halaman isi, di luar sampul, daftar pustaka, lampiran |
| Sistematika | Sampul, daftar isi, 7 bagian kerangka, daftar pustaka, lampiran |
| Tabel dan gambar | Bernomor, berjudul, bersumber. Data mentah di lampiran |
| Sitasi | APA, minimal 10 rujukan resmi atau jurnal |

Tujuh bagian kerangka: latar dan isu, dampak, opsi respons, inovasi, kelayakan, rekomendasi, tabel kontribusi.

Bobot nilai (usulan dosen): dampak 25, opsi respons 20, kebaruan inovasi 25, kelayakan dan rekomendasi 15, presentasi 15.
Artinya 50 persen nilai ada di kajian dampak dan inovasi. Prototipe harus memperkuat dua bagian ini.

Uji inovasi dari dosen: (1) baru, (2) cocok untuk Indonesia, (3) layak dijalankan (pelaksana, biaya masuk akal, ukuran keberhasilan bisa dipantau).

## 2. Kondisi Isu Per November 2026

Hal yang belum ada di laporan lama dan mengubah cerita:

- Permen ESDM 2/2024 masih berlaku. Net metering dihapus: listrik yang diekspor ke PLN tidak lagi mengurangi tagihan. Ada kuota PLTS atap per sistem (5.746 MW untuk 2024-2028), pengajuan dibuka periode tertentu.
- Akibatnya PLTS atap rumah tangga kurang menarik karena beban rumah paling tinggi malam hari. ESDM dan IESR sama-sama mengakui ini.
- Kapasitas PLTS atap terpasang masih kecil (ratusan MW) dibanding potensi teknis rumah tangga 194-655 GWp (IESR).
- Cirebon-1, proyek percontohan pensiun dini JETP, dibatalkan PLN (Desember 2025). Pemerintah bergeser dari "phase out" ke "phase down": PLTU dipensiunkan saat PPA habis.
- Kapasitas PLTU yang dipertimbangkan untuk pensiun dini turun dari sekitar 5 GW ke 1,6 GW (JETP progress report 2025).
- IESR pernah mengusulkan subsidi listrik 450/900 VA dialihkan ke PLTS atap (Program Surya Nusantara, 1 GWp untuk sekitar 660 ribu rumah).

Implikasi: pertanyaan kebijakan yang relevan sekarang bukan lagi "pensiun dini atau tidak", tetapi "apa yang bisa membuat pensiun PLTU lebih cepat dari jadwal PPA, dan PLTS atap bisa menyumbang berapa".

## 3. Evaluasi Laporan Lama

Bisa dipakai ulang (setelah dicek ulang sumbernya):

- Bab 2.1: profil emisi sektor energi (KLHK via Katadata, IEA 2024, IPCC 2023, E-NDC).
- Bab 2.3: dampak kesehatan PLTU (Koplitz 2017, CREA), pekerja tambang dan ketergantungan daerah (Kaltim, Sumsel), beban rumah tangga dan subsidi. Ini bagian terkuat.
- Bab 5.1: dampak fiskal pensiun dini (Ricardo 2023 untuk ETP).
- Bab 5.2 dan 5.3: aktor dan risiko (stranded asset, ruang fiskal, ego sektoral).

Masalah:

- Bab 2.2, 3.1-3.4, 4.2, 5.4, tabel kontribusi masih kosong.
- Inovasi Bab 4 hanya "menjalankan PLTS atap dan pensiun dini bersamaan". Ini bukan hal baru dan tidak lulus uji kebaruan.
- Tidak ada hubungan kuantitatif antara PLTS atap dan PLTU. Klaim "PLTS atap menutup defisit daya PLTU yang dipensiunkan" tidak dihitung. Kapasitas PLTS (faktor kapasitas sekitar 15 persen, hanya siang) tidak setara dengan PLTU (sekitar 60-70 persen, 24 jam).
- Roadmap Tabel 6.1 tanpa sumber dan tidak ada dasar angkanya.
- Belum memuat kondisi 2025-2026 (Cirebon-1, phase down).
- Tabel 5.4 menulis periode "2021-2024", kemungkinan maksudnya 2021-2040. Perlu dicek ke sumber Ricardo.
- Fokus pekerja melompat ke tambang batu bara Kalimantan, padahal topiknya PLTU (mayoritas di Jawa). Dua kelompok ini perlu dibedakan.

## 4. Produk Serupa Yang Sudah Ada

| Produk | Pembuat | Yang dilakukan | Yang tidak dilakukan |
| --- | --- | --- | --- |
| Indonesia Energy Policy Simulator | Energy Innovation, WRI Indonesia, IESR | Model system dynamics nasional, banyak tuas kebijakan, output emisi dan biaya | Agregat nasional. Tidak per PLTU, tidak per golongan rumah tangga, tidak menunjukkan siapa yang terdampak |
| TZ-CAT Indonesia | TransitionZero | Data 118 PLTU per unit: profit, sisa umur, biaya ganti, polusi, pekerja. Peringkat multi kriteria | Excel untuk ahli, data Oktober 2022 (sebelum Cirebon-1 batal). Tidak ada sisi PLTS atap atau rumah tangga |
| Jalur pensiun berbasis kesehatan | CREA dan IESR (2023) | Peringkat PLTU berdasarkan biaya kesehatan per kWh, 180 ribu kematian bisa dihindari jika pensiun 2040 | Laporan statis, bukan alat interaktif |
| SolarHub | IESR | Kalkulator PLTS atap per bangunan, penghematan tagihan, direktori installer | Hanya sudut pandang individu. Tidak menunjukkan dampak sistem atau pengaruh kebijakan |
| En-ROADS | Climate Interactive, MIT | Simulator iklim global, sangat populer untuk edukasi | Global, tidak spesifik Indonesia |
| Global Solar Atlas, PVsyst | World Bank, komersial | Produksi listrik surya per lokasi | Hanya teknis |

## 5. Celah dan Kebaruan

Celah yang ditemukan: tidak ada alat yang menyambungkan keputusan PLTS atap di level rumah tangga dengan jadwal pensiun PLTU tertentu di sistem listrik yang sama, sambil menunjukkan siapa yang untung dan siapa yang menanggung.

- Alat kebijakan nasional (EPS) terlalu agregat.
- Alat PLTU (TZ-CAT, CREA) tidak melihat sisi permintaan dan PLTS atap.
- Alat PLTS atap (SolarHub) tidak melihat sistem.

Kebaruan yang diusulkan:

1. Penghubung mikro-makro: "jika N rumah golongan X pasang PLTS atap di bawah kebijakan Y, PLTU mana yang bisa turun lebih cepat dari PPA-nya, berapa tahun, dan apa dampaknya".
2. Baseline realistis 2026: memodelkan rezim Permen 2/2024 (tanpa net metering, ada kuota) dan phase down saat PPA habis, lalu membandingkannya dengan skenario alternatif. Alat lain masih memakai asumsi sebelum 2024.
3. Lensa keadilan: distribusi manfaat per golongan pelanggan (450/900 VA bersubsidi, R1 non subsidi, bisnis, industri) dan beban per daerah (warga sekitar PLTU, pekerja PLTU).
4. Bahasa awam dan bahasa Indonesia. Untuk diseminasi publik, mahasiswa, dan pemda, bukan untuk analis.

## 6. Konsep Produk

Nama kerja: SuryaGanti (bisa diganti).
Satu kalimat: simulator web "tukar guling" PLTS atap dan PLTU, dari atap rumah sampai cerobong PLTU.

Tiga modul:

### A. Atapku (kalkulator rumah tangga)

- Input: provinsi, golongan daya, tagihan bulanan, pola pemakaian (siang/malam).
- Output: kWp yang cocok, biaya, penghematan per bulan, balik modal, di bawah aturan sekarang dan skenario alternatif.
- Penghubung ke modul B: "jika 1 juta rumah seperti kamu pasang, setara menurunkan X GWh PLTU per tahun".

### B. Simulator Kebijakan (inti inovasi)

- Tuas kebijakan:
  - skema ekspor listrik: tanpa kompensasi (aturan sekarang), net metering 65 persen, net metering 100 persen
  - pengalihan subsidi 450/900 VA ke PLTS atap: persen anggaran
  - kuota PLTS atap per sistem
  - harga panel dan bunga kredit hijau
  - kriteria urutan pensiun PLTU: bobot emisi, kesehatan, pekerja, sisa PPA
- Rantai model: kebijakan -> balik modal per golongan -> laju adopsi -> GWh surya per tahun -> PLTU yang dipensiunkan lebih awal -> dampak.
- Output 2026-2040: kapasitas PLTS atap, emisi CO2 dihindari, kematian dini dihindari, pekerja PLTU terdampak, subsidi APBN yang dihemat, daftar PLTU dan tahun pensiunnya dibanding jadwal PPA.
- Perbandingan dua skenario berdampingan. Skenario bisa dibagikan lewat URL.

### C. Peta Dampak dan Keadilan

- Peta PLTU per unit di sistem Jawa-Bali (atau nasional jika data cukup): kapasitas, umur, emisi, perkiraan dampak kesehatan, pekerja.
- Per skenario: PLTU mana yang pensiun lebih cepat, provinsi mana yang paling merasakan manfaat udara bersih, golongan mana yang paling diuntungkan PLTS atap.

## 7. Model Yang Transparan dan Sederhana

Prinsip: level mahasiswa, bisa dicek dengan spreadsheet, setiap asumsi punya sumber dan bisa diubah.

| Langkah | Pendekatan | Kandidat data |
| --- | --- | --- |
| Produksi surya | kWh/kWp/tahun per provinsi | Global Solar Atlas (World Bank) |
| Ekonomi rumah | porsi dipakai sendiri x tarif + porsi ekspor x nilai ekspor, lalu balik modal | Tarif PLN per golongan, harga PLTS per kWp (IESR) |
| Adopsi | kurva pangsa pasar maksimum terhadap balik modal, lalu difusi Bass per tahun | Literatur adopsi PV (NREL dsb.), potensi teknis IESR |
| Batas kuota | adopsi dipotong kuota per sistem | Kuota PLN 2024-2028 |
| Penggantian PLTU | GWh surya menggantikan GWh PLTU urutan teratas sesuai kriteria, unit dipensiunkan saat energi pengganti cukup | GEM Global Coal Plant Tracker, TZ-CAT |
| Emisi | faktor emisi per unit atau faktor emisi grid | GEM, ESDM |
| Kesehatan | kematian per TWh per PLTU | CREA/IESR 2023 |
| Pekerja | pekerja per MW | TZ-CAT, literatur |
| Fiskal | subsidi per rumah 450/900 VA yang berkurang | IESR, APBN |

Batasan yang harus jujur ditulis:

- PLTS hanya siang hari. Mengganti PLTU penuh butuh baterai. Model menghitung kesetaraan energi, dan menampilkan kebutuhan baterai sebagai catatan, bukan simulasi jaringan.
- Bukan model dispatch atau aliran daya.
- Angka kesehatan adalah hasil pemodelan sumber, bukan pengukuran.

## 8. Uji Tiga Syarat Inovasi

| Uji | Jawaban |
| --- | --- |
| Baru | Belum ada alat yang menghubungkan adopsi PLTS atap per golongan dengan jadwal pensiun PLTU per unit dan dampak keadilannya, dengan baseline aturan 2024 dan phase down 2025 |
| Cocok untuk Indonesia | Potensi surya tropis tinggi, struktur subsidi listrik 450/900 VA khas Indonesia, PLTU terkonsentrasi di Jawa-Bali yang padat penduduk, keputusan phase down berbasis PPA |
| Layak | Biaya hosting nol (hosting gratis), data terbuka, pelaksana: kampus atau LSM energi (misalnya IESR) sebagai pengelola, pengguna: publik, pemda, mahasiswa. KPI: jumlah pengguna, skenario yang dibagikan, kutipan dalam diskusi kebijakan |

## 9. Hubungan Prototipe dan Laporan

| Bagian laporan | Kontribusi prototipe |
| --- | --- |
| 1 Latar dan isu | Konteks 2026: Permen 2/2024, Cirebon-1, phase down |
| 2 Dampak | Peta PLTU, emisi, kesehatan, pekerja per wilayah (modul C) |
| 3 Opsi respons | Skenario simulator sebagai pembanding opsi: phase down PPA, pensiun dini, PLTS atap dengan berbagai skema |
| 4 Inovasi | Prototipe itu sendiri: apa yang baru, cara kerja, kenapa cocok |
| 5 Kelayakan | Biaya, pelaksana, risiko, KPI prototipe. Ditambah hasil simulasi biaya dan subsidi |
| 6 Rekomendasi | Diturunkan dari hasil simulasi, misalnya skema ekspor yang paling efektif per rupiah |
| 7 Kontribusi | Diisi user |

Prototipe juga menghasilkan grafik bersumber untuk laporan.

## 10. Alternatif Yang Dipertimbangkan

- Simulator kebijakan nasional saja: tumpang tindih dengan EPS Indonesia, kebaruan lemah.
- Peringkat pensiun PLTU saja: tumpang tindih dengan TZ-CAT dan CREA.
- Kalkulator PLTS atap saja: tumpang tindih dengan SolarHub, tidak menyentuh PLTU.
- Marketplace atau koperasi PLTS atap komunitas: lebih ke model bisnis, sulit diprototipekan dan dibuktikan dalam laporan.

Konsep terpilih menggabungkan sisi yang tidak tersambung di tiga alat pertama.

## 11. Risiko Pengerjaan

- Data per unit PLTU (sisa PPA, pekerja) bisa tidak lengkap atau lama. Mitigasi: TZ-CAT 2022 + GEM terbaru, asumsi ditandai.
- Parameter adopsi tidak ada data lokal yang kuat. Mitigasi: rentang dari literatur, uji sensitivitas di laporan.
- Terlalu luas. Mitigasi: MVP fokus sistem Jawa-Bali, tiga modul dengan fitur minimal.

## 12. Keputusan Terbuka Untuk User

1. Cakupan wilayah MVP: Jawa-Bali saja atau nasional.
2. Teknologi: situs statis (HTML/JS + data JSON, hosting GitHub Pages/Vercel/Netlify) atau Python Streamlit (Streamlit Community Cloud, tidur saat tidak aktif).
3. Nama produk.
4. Apakah laporan ditulis ulang total mengikuti 7 bagian, dengan bagian dari laporan lama dipakai ulang setelah dicek.

## 13. Referensi Kandidat

- CREA dan IESR (2023). Health benefits of a just energy transition and coal phase-out in Indonesia. https://energyandcleanair.org/wp/wp-content/uploads/2023/07/Press-release_CREA_IESR-Indonesia-JETP_07.2023.pdf
- TransitionZero. Coal Asset Transition Tool Indonesia. https://transition-zero.vercel.app/products/coal-asset-transition-tool/tz-cat-indonesia
- TransitionZero. Indonesia's coal retirement conundrum. https://transition-zero.vercel.app/insights/indonesias-coal-retirement-conundrum
- WRI. A tool for designing a policy package to achieve Indonesia's climate targets. https://www.wri.org/research/tool-designing-policy-package-achieve-indonesias-climate-targets
- IESR. Permen ESDM No. 2/2024 membatasi partisipasi publik. https://iesr.or.id/permen-esdm-no-2-2024-membatasi-partisipasi-publik-untuk-mendukung-transisi-energi-lewat-plts-atap/
- ESDM. Revisi Permen ESDM PLTS atap, skema jual beli listrik dihapuskan. https://www.esdm.go.id/id/media-center/arsip-berita/revisi-permen-esdm-plts-atap-skema-jual-beli-listrik-dihapuskan-
- IESR. Potensi pasar PLTS atap rumah tangga (194-655 GWp). https://iesr.or.id/en/?p=37158
- pv magazine (2024). Indonesia targets more than 5.7 GW of rooftop solar by 2028. https://www.pv-magazine-australia.com/2024/06/12/indonesia-targets-more-than-5-7-gw-of-rooftop-solar-by-2028/
- Mongabay (2026-01). Indonesia backs away from coal exit test case. https://news.mongabay.com/2026/01/indonesia-backs-away-from-coal-exit-test-case-amid-financial-and-political-pushback/
- Jakarta Post (2026-02-18). Indonesia coal plant closure U-turn sows energy transition doubts. https://www.thejakartapost.com/business/2026/02/18/indonesia-coal-plant-closure-u-turn-sows-energy-transition-doubts
- Global Energy Monitor. Global Coal Plant Tracker. https://globalenergymonitor.org/projects/global-coal-plant-tracker/
- Energy Transition Partnership. Study on the financial implications of the early retirement of CFPPs in Indonesia. https://www.energytransitionpartnership.org/projects/study-on-the-financial-implications-of-the-early-retirement-of-coal-fired-power-plants/
- Kontan / Kabar Bursa. Usulan IESR pengalihan subsidi listrik ke PLTS atap. https://www.kabarbursa.com/market-hari-ini/peneliti-iesr-usul-pengalihan-subsidi-listrik-ke-plts-atap
- Ditambah rujukan laporan lama yang lolos cek: IPCC 2023, IEA 2024, Koplitz et al. 2017, Resosudarmo et al. 2023, Kefford et al. 2018, Siagian dan Kasuma 2025.

Angka di plan ini dari ringkasan hasil pencarian. Wajib dicek ke dokumen asli sebelum masuk laporan.
