# Collaboration

Sumber: instruksi eksplisit user, 2026-11-05.

## Kepemilikan

- Git dan GitHub dikelola user sepenuhnya. Agent hanya read-only (status, log, diff, show, blame), supaya agent tidak muncul sebagai contributor.
- Tidak ada watermark agent pada hasil kerja.
- README hanya ditulis jika diperintah.

## Pengelolaan Pengetahuan

- Catat knowledge dan preferensi secara proaktif, tanpa disuruh dan tanpa konfirmasi.
- Konfirmasi hanya dipakai untuk mengecek kebenaran, bukan apakah sesuatu layak dicatat.
- Pengetahuan boleh berubah. Yang terbaru mengganti yang lama.
- Context berbeda: milik user, wajib konfirmasi sebelum menambah.
- Preferensi tidak perlu selalu dibaca, cukup saat ragu soal cara menjawab dan sebelum menulis kode.

## Komunikasi

- User menulis dalam bahasa Indonesia, balas dengan bahasa yang sama.
- User memberi konteks dan kontrak dulu, baru instruksi kerja di pesan berikutnya. Jika diminta "pahami dulu", jangan mengerjakan task di luar itu.
- User memakai proyek lain sebagai contoh format kerja, tapi tidak ingin proyek itu disinggung lagi setelahnya.

## Alur Kerja Proyek

- Pahami dulu, lalu plan, lalu dokumen (PRD, working plan), baru kode. Setiap tahap menunggu persetujuan user. (2026-11-05)
- Penjelasan ke user memakai bahasa yang mudah dimengerti, bukan bahasa teknis atau akademik yang padat.
- User mengharapkan agent proaktif mencari kebaruan dan referensi sendiri jika dasar belum cukup.
- User tidak ingin agent mengkhawatirkan deadline.
- Laporan kelompok lama dikerjakan banyak orang dan dinilai user kurang kompeten. Perlakukan sebagai bahan mentah yang bisa salah, bukan acuan.
- Saat user membantah atau memberi sudut pandang baru, plan lama tidak ditimpa. Buat file versi baru, yang lama tetap disimpan. (2026-11-05)
- User suka argumennya dibedah per klaim: mana benar, mana perlu nuansa, mana lemah, beserta bukti. Bukan sekadar disetujui.
- User berpikir dari sisi sistem dan institusi (PLN, negara, regulasi), bukan hanya sisi konsumen. Ide produk sebaiknya punya "pembeli" kebijakan yang jelas.
- Jangan overengineered, termasuk di cakupan produk. Fitur tambahan diberi label bonus dan dikerjakan hanya jika waktu cukup. (2026-11-05)
- Untuk keputusan teknis, user ingin disajikan alternatif beserta gambaran konkret hasilnya (tampilan, hitungan, konsekuensi) agar bisa menimbang sendiri. Sertakan rekomendasi.
- Struktur context dirapikan user: `ideas/`, `plan/`, `external/`, `spesifikasi_tugas/`. PRD dan plan ke `plan/`, referensi dan lisensi ke `external/`. (2026-11-05)
- Referensi dikumpulkan di `external/citations.csv` format APA, dengan tipe (data, pustaka, dll) dan URL yang bisa diakses. Setiap sumber baru langsung ditambahkan ke sana.
- Lisensi setiap data yang diambil dicatat di `external/licenses.md`.
