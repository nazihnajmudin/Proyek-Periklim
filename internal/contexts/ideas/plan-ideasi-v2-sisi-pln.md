# Plan Ideasi v2: Dari Sisi PLN dan Negara

Status: arah disetujui user 2026-11-05 (lihat bagian 9). Pilihan teknologi (bagian 11) dan uji cakupan Jawa-Bali + peta (bagian 12) menunggu keputusan user sebelum PRD.
Turunan dari `plan-ideasi-output.md` (v1, tetap disimpan). Pemicu: argumen user bahwa hambatan utama ada di PLN, bukan di warga.

## 1. Argumen User

1. Masalah utama transisi bukan PLTS atap yang tidak menarik bagi warga, tapi tidak menarik bagi PLN.
2. Negara tidak berani mendanai penyerapan PLTS atap secara masif karena PLN belum siap meninggalkan PLTU.
3. Penyebabnya bisnis PLN dan kompleksitas jaringan terhadap energi hijau.
4. Akibatnya kebijakan kurang suportif untuk menggerakkan warga.
5. Solusi bisa "dijual" ke ESDM untuk mendukung program pensiun dini PLTU yang intensinya mulai ada.
6. Cakupan Jawa Barat sudah cukup.

## 2. Bedah Per Klaim

### Klaim 1: akar masalah di PLN, bukan warga

Penilaian: benar sebagai akar, perlu dirumuskan sebagai rantai sebab.

- Bukti: PLN menolak membayar ekspor PLTS atap saat oversupply karena menaikkan BPP. Permen 2/2024 menghapus net metering, dan IESR serta AESI menilai aturan itu condong ke kepentingan PLN.
- Jadi "tidak menarik bagi warga" adalah akibat, bukan sebab. Rantainya:

```
oversupply Jawa-Bali + kontrak take-or-pay PLTU
  -> PLTS atap mengurangi penjualan PLN, biaya tetap PLN tidak turun
  -> PLN dan negara menahan (hapus net metering, kuota)
  -> PLTS atap tidak menarik bagi rumah tangga
```

- Nuansa yang harus diakui: ada hambatan warga yang tetap ada walau PLN mendukung.
  - Biaya awal tinggi.
  - Pelanggan 450/900 VA membayar tarif bersubsidi, jadi balik modalnya lama dengan skema apa pun. Subsidi tarif justru mematikan insentif PLTS atap untuk kelompok ini.
  - Beban rumah tangga paling tinggi malam hari.
- Kesimpulan: sisi PLN adalah "kunci pintu". Sisi warga adalah hambatan kedua yang baru relevan setelah pintu dibuka.

### Klaim 2: negara tidak berani karena PLN belum siap

Penilaian: benar, tapi pelakunya perlu dipertajam.

- PLN adalah BUMN dengan tarif yang ditetapkan pemerintah. Selisih BPP dan tarif ditutup APBN lewat subsidi dan kompensasi. Jadi "PLN rugi" pada akhirnya "APBN menanggung". Yang ragu sebenarnya Kemenkeu dan ESDM, bukan PLN sendirian.
- Mekanisme beban:
  - Take-or-pay: PLN tetap membayar kapasitas PLTU swasta (IPP) walau listriknya tidak dipakai. Satu estimasi: sekitar Rp3 T per GW kelebihan per tahun, oversupply sekitar 6 GW pada 2022 dan 4 GW akhir 2023.
  - PLTS atap menggerus penjualan PLN. Estimasi PLN: target 3 GW menggerus pendapatan sekitar Rp7-8 T.
  - DMO batu bara (harga dibatasi) membuat listrik PLTU murah di atas kertas, sehingga PLTS terlihat mahal dari kacamata PLN.
- Wawasan kunci: PLTS atap sendirian di tengah oversupply memang merugikan PLN. Penjualan turun, sementara biaya kapasitas PLTU tetap dibayar. PLTS atap baru masuk akal secara bisnis jika dipasangkan dengan pengurangan kapasitas PLTU, sehingga biaya tetap ikut turun.
- Ini memberi arti nyata pada klaim "simultan" di laporan lama, yang di sana tidak pernah dijelaskan mekanismenya.

### Klaim 3: bisnis dan jaringan yang kompleks

Penilaian: bisnis benar dan dominan. Jaringan benar tapi sering dilebih-lebihkan pada penetrasi rendah.

- Pada skala sekarang (PLTS atap nasional sekitar 407 MW per Maret 2025), masalah jaringan kecil dibanding beban sistem Jawa-Bali puluhan GW.
- Masalah teknis nyata muncul di level penyulang (hosting capacity), dan dari PLTU yang tidak fleksibel (sulit turun di bawah beban minimum saat siang terik).
- Implikasi: argumen kita sebaiknya bertumpu pada bisnis dan fiskal. Masalah jaringan ditampilkan sebagai batasan yang diukur kasar, bukan alasan utama. Kalau kita bilang jaringan adalah masalah utama, asisten bisa membantah dengan data penetrasi yang masih kecil.

### Klaim 4: kebijakan jadi kurang suportif

Penilaian: benar, ada bukti langsung.

- Permen 2/2024: net metering dihapus, kuota per sistem, pengajuan berkala.
- ESDM sendiri mengakui PLTS atap rumah tangga jadi kurang menarik.

### Klaim 5: bisa dijual ke ESDM, intensi pensiun dini sudah ada

Penilaian: intensi ada di atas kertas, pelaksanaannya mundur. Pitch tetap kuat jika dibingkai tepat.

- Bukti intensi:
  - Perpres 112/2022.
  - Permen ESDM 10/2025 (peta jalan transisi sektor ketenagalistrikan, April 2025). Kriteria pensiun dini: kapasitas, usia, utilisasi, emisi GRK, nilai tambah ekonomi, dukungan pendanaan, transisi berkeadilan. Ditambah pertimbangan keandalan sistem, dampak BPP ke tarif. PLN wajib menyusun kajian 6 bulan sejak ditugaskan menteri.
  - Kepmen pensiun dini Cirebon-1 sempat diteken (2025).
- Bukti mundur:
  - PLN menarik diri dari Cirebon-1 (Desember 2025), beralih ke "phase down" di akhir PPA.
  - Kapasitas kandidat pensiun dini turun dari 5 GW ke 1,6 GW.
  - DPR sempat menyebut tidak ada pensiun dini. Celios menilai Permen 10/2025 menjadikan pensiun dini opsi terakhir.
  - Rencana PTBA mengambil alih PLTU Pelabuhan Ratu untuk dipensiunkan 2037 tertahan di masalah take-or-pay (berita terakhir Maret 2024).
- Pembingkaian pitch: bukan "ayo pensiunkan PLTU", tapi "alat bantu menyusun kajian yang diwajibkan Permen 10/2025". Kriteria keandalan sistem, dampak tarif, dan transisi berkeadilan adalah persis hal yang membuat pelaksanaan macet, dan persis yang dihitung alat kita.

### Klaim 6: cakupan Jawa Barat

Penilaian: tepat dan justru lebih kuat.

- Dua kasus pensiun dini yang macet ada di Jawa Barat: Cirebon-1 (660 MW, IPP) dan Pelabuhan Ratu (3x350 MW, PLN). Kandidat lain: Indramayu (3x330 MW). Cirebon-2 (1.000 MW) perlu dicek statusnya.
- Provinsi berpenduduk terbesar, pasar PLTS atap besar, RUED Jabar pernah menargetkan tambahan PLTS 918 MW (sedang dikaji ulang). Pemprov sudah membiayai PLTS atap di 7 SMA/SMK lewat APBD.
- Satu PLTU, satu provinsi, satu paket kebijakan: lebih mudah dimodelkan dan lebih mudah dibela di presentasi.
- Catatan jujur: Jawa Barat adalah bagian dari sistem interkoneksi Jawa-Bali. Listrik tidak "milik" provinsi. Batas Jawa Barat dipakai sebagai batas neraca energi (akuntansi), bukan batas fisik. Keandalan dan cadangan tetap dihitung di level Jawa-Bali.

## 3. Temuan Tambahan Yang Mempertajam Argumen

Jendela oversupply sedang menutup.

- Reserve margin Jawa-Madura-Bali diperkirakan sekitar 37,5 persen (2025) dan turun di bawah batas aman 33-35 persen sekitar 2027 jika permintaan tumbuh sekitar 4,45 persen per tahun.
- Selama masih oversupply, satu PLTU bisa dipensiunkan tanpa harus diganti penuh. Setelah jendela tertutup, setiap MW PLTU yang dipensiunkan harus diganti. Kalau penggantinya PLTU atau PLTG baru, transisinya terkunci lagi puluhan tahun.
- PLTS atap tidak bisa mengganti kapasitas malam hari. Tapi PLTS atap bisa mengganti energi siang, sehingga menunda kebutuhan pembangkit baru dan menjaga cadangan.
- Pesan pitch: "pasangkan sekarang selagi oversupply masih ada, atau Jawa Barat akan butuh pembangkit fosil baru".

Ukuran kasar (asumsi, perlu dicek):

| PLTU | Kapasitas | Energi per tahun (asumsi CF) | Setara PLTS atap (asumsi 1.350 kWh/kWp) |
| --- | --- | --- | --- |
| Cirebon-1 | 660 MW | sekitar 4,0 TWh (CF 70 persen) | sekitar 3,0 GWp |
| Pelabuhan Ratu | 1.050 MW | sekitar 5,5 TWh (CF 60 persen) | sekitar 4,1 GWp |
| Indramayu | 990 MW | sekitar 5,2 TWh (CF 60 persen) | sekitar 3,9 GWp |

3 GWp setara sekitar 1 juta rumah x 3 kWp. Ini besar dibanding kuota nasional 5,7 GW untuk 2024-2028. Jadi PLTS atap realistisnya mengganti sebagian energi PLTU. Sisanya diserap oleh cadangan selama masih oversupply. Alat kita harus menampilkan pembagian ini dengan jujur.

## 4. Konsep v2

Nama sistem: PowerShift (keputusan user 2026-11-05).

Satu kalimat: alat bantu keputusan untuk merancang paket "pensiun satu PLTU + penyerapan PLTS atap" di Jawa Barat, yang menunjukkan siapa menanggung apa: PLN, APBN, warga, pekerja.

Pengguna:

- Utama: ESDM (Ditjen Ketenagalistrikan), PLN, Dinas ESDM Jabar. Tujuannya membantu kajian Permen 10/2025.
- Pendukung: publik dan media. Tujuannya diseminasi, menunjukkan manfaat paket ke warga agar ada dukungan sosial.

Hipotesis yang diuji alat (inti klaim laporan):

- H1: PLTS atap tanpa pensiun PLTU merugikan neraca PLN di tengah oversupply.
- H2: PLTS atap yang dipasangkan dengan pensiun dini satu PLTU memperkecil kerugian itu, karena biaya kapasitas PLTU ikut hilang.
- H3: ada kombinasi skema ekspor, kuota, dan sumber dana yang membuat neraca PLN mendekati netral sambil tetap menarik bagi warga.

Hipotesis ini belum tentu terbukti. Kalau hasil model menolaknya, laporan menulis apa adanya. Hasil jujur tetap bernilai sebagai kajian.

### Modul

1. Paket Kebijakan (input)
   - Pilih PLTU di Jabar dan tahun pensiunnya (jadwal PPA vs dipercepat).
   - Skema ekspor PLTS atap: tanpa kompensasi (aturan sekarang), sebagian, penuh.
   - Kuota PLTS atap Jabar per tahun dan segmen sasaran: rumah tangga, gedung pemerintah dan sekolah, bisnis, industri.
   - Pengalihan subsidi 450/900 VA ke PLTS atap (persen).
   - Sumber dana pensiun dini: ETM/JETP, APBN, APBD, PLN.

2. Neraca PLN dan APBN (inti kebaruan)
   - Pendapatan PLN yang hilang: kWh PLTS atap dipakai sendiri x tarif golongan.
   - Biaya bahan bakar yang dihemat: kWh x biaya variabel PLTU.
   - Biaya kapasitas yang dihemat (take-or-pay) jika PLTU pensiun.
   - Biaya kompensasi pensiun dini dan siapa yang membayar.
   - Dampak ke BPP, tarif, dan subsidi atau kompensasi APBN.
   - Ditampilkan per tahun 2026-2040, dibanding skenario phase down (pensiun di akhir PPA).

3. Cek Keandalan Sederhana
   - Reserve margin Jawa-Bali setelah PLTU pensiun, dengan pertumbuhan beban.
   - Neraca energi siang dan malam: berapa yang diganti PLTS atap, berapa yang diserap cadangan, kapan butuh baterai atau pembangkit lain.
   - Bukan simulasi aliran daya. Hanya neraca.

4. Dampak dan Keadilan
   - Emisi CO2 dihindari, kematian dini dihindari (data CREA per PLTU), pekerja PLTU terdampak.
   - Manfaat per golongan pelanggan dan per segmen.
   - Daftar periksa kriteria Permen 10/2025 terisi otomatis dari hasil simulasi.

5. Atapku (bonus, dari v1)
   - Kalkulator rumah tangga versi ringkas, mengikuti paket yang dipilih.
   - Hanya dikerjakan jika waktu cukup ("iseng"). Tidak masuk laporan dan tidak masuk cakupan PRD inti.

## 5. Kebaruan v2 Dibanding v1 dan Alat Lain

| Aspek | v1 | v2 |
| --- | --- | --- |
| Sudut pandang | Warga dan iklim | PLN, APBN, lalu warga |
| Pertanyaan | Berapa PLTS atap yang terpasang | Paket apa yang membuat PLN dan negara berani |
| Wilayah | Jawa-Bali atau nasional | Jawa Barat, satu PLTU per skenario |
| Pengguna utama | Publik | ESDM, PLN, Dinas ESDM Jabar |
| Kaitan regulasi | Permen 2/2024 | Permen 2/2024 + Permen 10/2025 |

Dibanding alat lain:

- TZ-CAT menghitung biaya mengganti PLTU dengan pembangkit EBT skala besar dan baterai. Belum ditemukan alat yang menghitung penggantian lewat PLTS atap terdistribusi bersama dampaknya ke neraca PLN.
- EPS Indonesia memodelkan kebijakan nasional, tidak masuk ke neraca PLN per PLTU.
- SolarHub hanya sisi pelanggan.
- Klaim "belum ada" berdasarkan penelusuran 2026-11-05. Perlu penelusuran lanjutan (misalnya RMI, ADB ETM, IESR) sebelum ditulis di laporan.

## 6. Uji Tiga Syarat Inovasi

| Uji | Jawaban v2 |
| --- | --- |
| Baru | Menghitung paket berpasangan PLTS atap + pensiun PLTU dari sisi neraca PLN dan APBN, yaitu hambatan yang selama ini membuat kebijakan mundur |
| Cocok untuk Indonesia | Struktur khas: PLN monopoli BUMN, take-or-pay IPP, DMO batu bara, subsidi 450/900 VA, oversupply Jawa-Bali yang akan habis, Permen 10/2025 |
| Layak | Hosting gratis, data publik + asumsi terbuka, pelaksana: Dinas ESDM Jabar atau tim kajian PLN dengan pendampingan kampus. KPI: dipakai dalam satu kajian atau diskusi kebijakan, jumlah skenario yang dibuat dan dibagikan |

## 7. Hubungan Dengan Laporan

| Bagian | Isi dari v2 |
| --- | --- |
| 1 Latar dan isu | Rantai sebab: oversupply dan take-or-pay -> kebijakan menahan PLTS atap -> pensiun PLTU macet |
| 2 Dampak | Dampak PLTU Jabar (emisi, kesehatan, pekerja), dan dampak kebijakan yang macet |
| 3 Opsi respons | Phase down PPA, pensiun dini saja, PLTS atap saja, paket berpasangan. Kelebihan dan keterbatasan masing-masing |
| 4 Inovasi | Alat neraca paket berpasangan |
| 5 Kelayakan | Hasil simulasi untuk satu PLTU contoh, pelaksana, risiko, KPI |
| 6 Rekomendasi | Paket terbaik dari simulasi, siapa bertindak (ESDM, PLN, Kemenkeu, Pemprov Jabar) |
| 7 Kontribusi | Diisi user |

Laporan lama Bab 5.1 (fiskal), 5.2 (aktor), 5.3 (risiko) jadi lebih relevan di v2.

## 8. Risiko v2

- Data take-or-pay dan harga kontrak IPP tidak publik. Mitigasi: estimasi dari TZ-CAT, laporan ETP/Ricardo, berita. Semua ditandai asumsi dan bisa diubah di alat.
- Model keuangan PLN bisa terlalu rumit untuk level mahasiswa. Mitigasi: hanya neraca tahunan sederhana (pendapatan, biaya variabel, biaya kapasitas, kompensasi), tanpa pajak, depresiasi, atau struktur utang.
- Hasil bisa menolak H2 atau H3. Mitigasi: dilaporkan apa adanya, kondisi mana yang membuat paket layak.
- Asisten bisa bertanya "kenapa Jawa Barat kalau sistemnya Jawa-Bali". Mitigasi: batas neraca dijelaskan di laporan dan di alat.

## 9. Keputusan User (2026-11-05)

1. Pakai v2. Jangan overengineered. Atapku dari v1 hanya bonus jika waktu cukup, tidak masuk laporan.
2. Cirebon-1 jadi contoh utama dan demo. PLTU Jabar lain boleh dipilih di alat.
3. Teknologi: belum diputuskan. Bahan pertimbangan di bagian 11.
4. Nama sistem: PowerShift.

## 10. Referensi Tambahan v2

- Bisnis.com (2025-04-22). Bahlil rilis aturan baru pensiun dini PLTU, ini syarat dan kriterianya. https://ekonomi.bisnis.com/read/20250422/44/1870997/bahlil-rilis-aturan-baru-pensiun-dini-pltu-ini-syarat-kriterianya
- CNN Indonesia (2025-04-22). Bahlil rilis aturan peta jalan pensiun dini PLTU. https://www.cnnindonesia.com/ekonomi/20250422145518-85-1221332/bahlil-rilis-aturan-peta-jalan-pensiun-dini-pltu
- Hukumonline. Permen ESDM 10/2025 dan transisi ketenagalistrikan di Indonesia. https://www.hukumonline.com/berita/a/permen-esdm-10-2025-dan-transisi-ketenagalistrikan-di-indonesia-lt68179dd259f47
- Mongabay (2025-05-08). Menyoal kebijakan peta jalan transisi energi. https://mongabay.co.id/2025/05/08/menyoal-kebijakan-peta-jalan-transisi-energi/
- Listrik Indonesia. Menteri ESDM teken pensiun dini PLTU Cirebon I. https://listrikindonesia.com/detail/16353/sah-menteri-esdm-teken-pensiun-dini-pltu-cirebon-i
- Kontan. Hitungan PLN soal dampak PLTS atap ke pendapatan dan BPP. https://industri.kontan.co.id/news/begini-hitungan-pln-soal-dampak-plts-atap-ke-pendapatan-dan-bpp
- Tenggara Strategics (2024-02). Updated rooftop solar ruling eliminates net metering. https://asset.tenggara.id/backgrounder/tenggara-backgrounder-february-16-2024/updated-rooftop-solar-panels-rulings-eliminates-net-metering
- Fortune IDN. Kenali skema take or pay yang bebani PLN. https://www.fortuneidn.com/business/eko-wahyudi/kenali-skema-take-or-pay-yang-bebani-pln-bertahun-tahun
- Bisnis.com (2024-01-18). ESDM catat kelebihan pasokan listrik Jawa-Bali turun jadi 4 GW pada 2023. https://ekonomi.bisnis.com/read/20240118/44/1733610/esdm-catat-kelebihan-pasokan-listrik-jawa-bali-turun-jadi-4-gw-pada-2023
- Petromindo. Indonesia's power reserve could fall below safe level by 2027. https://www.petromindo.com/news/article/indonesia-s-power-reserve-could-fall-below-safe-level-by-2027-experts-warn
- Katadata (2023). Akuisisi PLTU Pelabuhan Ratu tunggu kesepakatan take or pay. https://katadata.co.id/berita/energi/6437797177730/akuisisi-pltu-pelabuhan-ratu-tunggu-kesepakatan-take-or-pay-listrik
- CNBC Indonesia (2024-03-08). Suntik mati PLTU Pelabuhan Ratu di tangan pemerintah. https://www.cnbcindonesia.com/news/20240308110445-4-520681/suntik-mati-pltu-pelabuhan-ratu-ditangan-pemerintah
- Listrik Indonesia. ESDM Jabar capai target EBT 20 persen. https://listrikindonesia.com/detail/11576/esdm-jabar-sukses-mencapai-target-ebt-20-persen-sebelum-2025
- CNBC Indonesia (2025-04-29). ESDM bakal tambah kuota PLTS atap. https://www.cnbcindonesia.com/news/20250429153537-4-629673/pada-antre-esdm-bakal-tambah-kuota-plts-atap-tahun-ini

Angka dari ringkasan hasil pencarian. Wajib dicek ke dokumen asli sebelum masuk laporan.

## 11. Bentuk Produk dan Pilihan Teknologi

Ditambahkan 2026-11-05 atas permintaan user, sebagai bahan memilih teknologi sebelum PRD.

### 11.1 Bentuk Produk (sama untuk semua teknologi)

Satu halaman web. Kiri: paket kebijakan. Kanan: hasil. Halaman kedua: asumsi dan sumber.

```
+--------------------------------------------------------------------------+
| PowerShift   Paket pensiun PLTU + PLTS atap, Jawa Barat     [Bagikan]    |
+----------------------+---------------------------------------------------+
| PAKET KEBIJAKAN      | [Biaya bersih PLN] [Subsidi APBN] [CO2] [Jiwa]    |
| PLTU: Cirebon-1   v  |  kartu angka: paket vs phase down PPA            |
| Pensiun: 2030 ----o  +---------------------------------------------------+
| Ekspor PLTS: 0% v    | Tab: Neraca | Keandalan | Dampak | Kriteria       |
| Kuota/thn: 300MW -o  |                                                   |
| Segmen: [x]RT [x]Gdg |  Neraca: batang per tahun 2026-2040              |
| Subsidi dialihkan -o |  (pendapatan hilang, BBM hemat, kapasitas hemat, |
| Dana: ETM/JETP    v  |   kompensasi) + garis neraca bersih               |
|                      |                                                   |
| [Reset ke baseline]  |  [Unduh PNG] [Unduh CSV]                          |
+----------------------+---------------------------------------------------+
| Halaman Asumsi: tabel parameter, nilai, sumber, tombol ubah (lanjutan)   |
+--------------------------------------------------------------------------+
```

Kebutuhan tampilan:

- Kartu angka (4-6 buah), selalu membandingkan paket dengan baseline phase down PPA.
- Grafik batang bertumpuk per tahun: neraca PLN (komponen positif dan negatif) dan neraca energi siang/malam.
- Grafik garis: reserve margin Jawa-Bali dengan garis batas aman, emisi kumulatif dua skenario.
- Tabel daftar periksa kriteria Permen 10/2025 (terpenuhi, sebagian, tidak).
- Peta PLTU Jabar: opsional. Hanya 4 titik, nilai tambahnya kecil, bisa diganti kartu daftar PLTU.
- Ekspor PNG dan CSV: grafik laporan diambil langsung dari alat, jadi model hanya ada satu.
- Bagikan skenario lewat URL (isi slider tersimpan di alamat).

Kebutuhan hitung:

- Model tahunan deterministik: 15 tahun (2026-2040) x sekitar 20-30 variabel. Satu kali hitung di bawah 1 milidetik di JS, beberapa milidetik di Python. Hitung ulang setiap slider digeser, terasa instan di semua opsi.
- Adopsi PLTS atap: kurva sederhana (logistik atau Bass) dipotong kuota. Tidak butuh solver.
- Sensitivitas untuk laporan: ubah tiap parameter plus minus 20 persen, sekitar 20-40 kali hitung. Tetap ringan.
- Tidak ada Monte Carlo, optimasi dispatch, aliran daya, atau machine learning. Tidak butuh server, GPU, atau database.

Kesimpulan: beban hitung dan visual ringan. Pilihan teknologi ditentukan oleh bahasa yang nyaman, kenyamanan hosting saat demo, dan kesan "produk", bukan oleh performa.

### 11.2 Alternatif Teknologi

| Opsi | Bahasa | Grafik | Hosting gratis | Kondisi saat demo |
| --- | --- | --- | --- | --- |
| A. Situs statis: HTML + JS polos + Chart.js | JS | Chart.js (garis, batang bertumpuk, tooltip) | GitHub Pages, Netlify, Vercel, Cloudflare Pages | Selalu hidup, terbuka instan |
| B. Streamlit + Plotly | Python | Plotly (interaktif, zoom, tooltip) | Streamlit Community Cloud | Tidur setelah 12 jam tanpa pengunjung, harus dibangunkan dulu |
| C. stlite (Streamlit di browser via Pyodide) | Python | Plotly | Hosting statis | Tidak tidur, tapi muat awal sekitar 50 MB, bisa sekitar 1 menit |
| D. Dash atau Gradio di Hugging Face Spaces | Python | Plotly | HF Spaces CPU gratis | Tidur setelah 48 jam tanpa pengunjung |
| E. Framework JS (React/Vite, Svelte) | JS | Recharts, dll | Sama dengan A | Sama dengan A |

Rincian per opsi:

**A. Situs statis JS polos**

- Cara kerja: semua hitungan di browser. Slider berubah -> fungsi model dipanggil -> grafik diperbarui.
- Struktur kasar: `index.html`, `style.css`, `model.js` (rumus), `ui.js` (slider, grafik), `data/*.json` (PLTU, tarif, asumsi + sumber).
- Kelebihan: selalu hidup untuk presentasi dan pitch, link langsung bisa dibagikan, terasa seperti produk, tanpa build tool, tanpa server.
- Kekurangan: model ditulis di JS, bukan Python. Kode tampilan (HTML/CSS) lebih banyak ditulis manual dibanding Streamlit.
- Grafik laporan: tombol unduh PNG dari Chart.js dan CSV.

**B. Streamlit**

- Cara kerja: server Python menjalankan ulang seluruh skrip tiap slider berubah. Untuk model sekecil ini tetap terasa cepat.
- Struktur kasar: `app.py` (tampilan), `model.py` (rumus), `data/*.csv`.
- Kelebihan: paling cepat dibuat, satu bahasa Python, `model.py` bisa dipakai ulang di notebook untuk grafik laporan dan sensitivitas.
- Kekurangan: tidur setelah 12 jam tanpa pengunjung (harus dibuka sebelum presentasi), tampilan khas Streamlit yang terlihat seperti dashboard internal, kustomisasi layout terbatas, butuh repo GitHub untuk deploy.

**C. stlite**

- Kode sama dengan B, tapi Python berjalan di browser.
- Kelebihan: Python + hosting statis + tidak tidur.
- Kekurangan: muat awal berat dan lambat. Berisiko di jaringan kelas atau saat pitch. Debugging lebih sulit.

**D. Dash/Gradio di HF Spaces**

- Dash memberi layout lebih bebas dari Streamlit. Gradio lebih cocok untuk demo ML.
- Kekurangan: lebih ribet dari B tanpa keuntungan besar, tetap bisa tidur.

**E. Framework JS**

- Ditolak: overengineered untuk satu halaman dengan beberapa slider dan grafik.

Ditolak juga: spreadsheet (Google Sheets) sebagai produk. Murah dan cepat, tapi tidak terasa sebagai inovasi dan sulit dibagikan sebagai alat.

### 11.3 Rekomendasi

- Utama: A (situs statis JS polos + Chart.js). Alasan: komputasi ringan sehingga JS cukup, selalu hidup untuk demo dan pitch ke ESDM, link mudah dibagikan, tidak ada server yang perlu dirawat.
- Alternatif jika user lebih nyaman Python dan ingin cepat: B (Streamlit). Konsekuensi: buka aplikasi sebelum presentasi, tampilan kurang "produk".
- Pada kedua opsi, kebenaran model dicek dengan satu contoh hitung tangan Cirebon-1 yang juga masuk lampiran laporan.

Sumber hosting:

- Streamlit Community Cloud tidur setelah 12 jam tanpa trafik: https://discuss.streamlit.io/t/how-to-prevent-the-app-enter-the-sleep-mode/87959
- stlite memuat sekitar 50 MB dan bisa butuh sekitar 1 menit: https://github.com/whitphx/stlite/wiki
- HF Spaces CPU gratis tidur setelah 48 jam: https://huggingface.co/docs/huggingface_hub/guides/manage-spaces

## 12. Uji Desain: Cakupan Jawa-Bali dan Visual Peta

Ditambahkan 2026-11-05. Pemicu: user bertanya kesiapan naik ke Jawa-Bali, dan dosen menyukai visual peta.

### 12.1 Naik ke Jawa-Bali: seberapa yakin

Penilaian: yakin untuk kerangka sistem, sedang untuk ketelitian keuangan per PLTU.

Kenapa justru lebih benar:

- Sistem listriknya memang satu interkoneksi Jawa-Bali. Reserve margin dan oversupply sudah dihitung di level Jawa-Bali sejak v2. Batas Jawa Barat tadinya hanya batas akuntansi, dan itu titik lemah yang bisa ditanya asisten. Dengan Jawa-Bali, titik lemah itu hilang.
- Pitch ke ESDM pusat lebih cocok dengan cakupan sistem dibanding satu provinsi.
- Peta jauh lebih hidup: puluhan PLTU (Suralaya, Paiton, Tanjung Jati B, Cilacap, Cirebon, Pelabuhan Ratu, Indramayu, Celukan Bawang, dll) dibanding 4 titik di Jabar.

Yang tidak berubah:

- Mesin model tetap sama: neraca per tahun, satu atau beberapa PLTU dipilih untuk dipensiunkan.
- Cirebon-1 tetap jadi demo utama. Narasi laporan tetap bisa menyorot Jawa Barat.

Yang bertambah:

| Hal | Jabar | Jawa-Bali | Ketersediaan |
| --- | --- | --- | --- |
| Daftar PLTU, kapasitas, koordinat, tahun operasi, pemilik | 4 | puluhan unit | Tinggi: GEM GCPT, CC BY 4.0 |
| Emisi CO2 per PLTU | 4 | puluhan | Tinggi: GEM (estimasi tahunan) |
| Dampak kesehatan per PLTU | 4 | puluhan | Sedang: CREA/IESR 2023 punya analisis per PLTU, format tabel di laporan perlu dicek |
| Akhir PPA dan biaya kapasitas IPP | 4 | puluhan | Rendah di semua cakupan: tidak publik. Pakai asumsi per tipe (IPP vs PLN, usia) + TZ-CAT 2022 |
| Penjualan dan pelanggan per golongan per provinsi | 1 | 7 (DKI, Banten, Jabar, Jateng, DIY, Jatim, Bali) | Sedang-tinggi: Statistik PLN per unit induk distribusi, perlu ekstraksi PDF |
| Potensi surya (kWh/kWp) per provinsi | 1 | 7 | Tinggi: Global Solar Atlas, CC BY 4.0 |

Risiko utama bukan di kode, tapi di pengumpulan data: jumlah PLTU naik dari 4 ke puluhan, dan data keuangan IPP tetap asumsi. Mitigasi: data keuangan per PLTU memakai parameter generik per tipe yang bisa diubah, dan hanya Cirebon-1 yang dihitung teliti (contoh hitung tangan di lampiran).

Rekomendasi: cakupan Jawa-Bali sebagai sistem, Cirebon-1 sebagai demo, Jawa Barat sebagai sorotan narasi.

### 12.2 Apa saja yang bisa tampil di peta

Prioritas 1 (data tersedia, inti cerita):

1. Titik PLTU. Ukuran = kapasitas. Warna = tahun pensiun pada skenario. Klik = kartu detail (pemilik, usia, emisi, dampak kesehatan, status).
2. Slider waktu 2026-2040 di atas peta. PLTU yang pensiun meredup satu per satu, paket vs phase down PPA. Ini visual paling kuat untuk presentasi.
3. Choropleth provinsi: PLTS atap terpasang per provinsi menurut paket (MWp), dihitung dari model.

Prioritas 2 (data tersedia, butuh olah sekali di awal):

4. Lapisan potensi surya (PVOUT, Global Solar Atlas). Raster 1 km diolah sekali jadi gambar overlay atau rata-rata per kabupaten.
5. Lingkar dampak di sekitar PLTU: warga dalam radius tertentu (populasi kabupaten BPS atau WorldPop) dan dampak kesehatan CREA.
6. Choropleth provinsi: pelanggan 450/900 VA dan subsidi yang bisa dialihkan.

Prioritas 3 (bonus):

7. Jalur transmisi (OpenStreetMap). Indah tapi berat dan tidak memengaruhi model.

Yang sengaja tidak dibuat: panah "listrik PLTS atap provinsi X menggantikan PLTU Y". Secara fisik menyesatkan karena listrik mengalir lewat satu jaringan.

Format data peta:

- Batas provinsi dan kabupaten: geoBoundaries (CC BY 4.0, sumber BPS dan OSM), disederhanakan jadi GeoJSON ringan (provinsi sekitar ratusan KB).
- Titik PLTU: JSON dari GEM.
- Peta dasar: tile gratis OpenStreetMap atau CARTO, cukup atribusi, tanpa API key.

### 12.3 Pengaruh ke Teknologi

Peta interaktif dengan slider waktu memperkuat opsi A (situs statis JS).

| Kebutuhan | Opsi A (JS statis) | Opsi B (Streamlit) |
| --- | --- | --- |
| Peta titik + choropleth | Leaflet: ringan, langsung di JS | folium lewat streamlit-folium, atau pydeck |
| Slider waktu di peta | Halus, hanya warna titik yang diperbarui | Tiap geser menjalankan ulang skrip dan menggambar ulang peta, terasa berkedip dan lambat |
| Klik titik -> panel detail | Mudah | Bisa, tapi interaksi dua arah peta dan aplikasi terbatas |
| Overlay potensi surya | Gambar overlay atau GeoJSON kabupaten | Bisa, tapi memperberat tiap rerun |

Pilihan library peta untuk opsi A:

- Leaflet: paling sederhana, dokumentasi banyak, cukup untuk semua prioritas 1 dan 2. Rekomendasi.
- MapLibre GL: peta vektor lebih halus dan bisa 3D (misalnya batang kapasitas berdiri di atas PLTU), kesan lebih "advance". Lebih rumit. Simpan sebagai opsi jika Leaflet terasa kurang.

Pembagian kerja bahasa yang tetap sederhana:

- Python: skrip olah data sekali jalan (GEM, Statistik PLN, Global Solar Atlas, geoBoundaries -> JSON/GeoJSON). Tidak ikut di-hosting.
- JS: aplikasi (model, grafik, peta).

Rekomendasi akhir teknologi: opsi A, situs statis JS polos + Chart.js + Leaflet, dengan skrip Python untuk persiapan data.

Sumber bagian 12:

- GEM Global Coal Plant Tracker, CC BY 4.0: https://globalenergymonitor.org/projects/global-coal-plant-tracker/
- Global Solar Atlas GIS data, CC BY 4.0: https://datacatalog.worldbank.org/search/dataset/0038641
- geoBoundaries Indonesia ADM1/ADM2, CC BY 4.0: https://geo.btaa.org/catalog/27c65d03-c110-47fb-8bf7-e84679668c34
- CREA dan IESR (2023), analisis kesehatan per PLTU: https://energyandcleanair.org/wp/wp-content/uploads/2023/07/CREA_IESR_Health-Benefits-of-Just-Energy-Transition-and-Coal-Phase-out-in-Indonesia_EN_07.2023.pdf
- Penjualan PLN UID Jatim 2024-2025: https://rri.co.id/surabaya/ekonomi/bisnis/2195600/pln-jatim-catat-penjualan-listrik-463-twh
