# Project

Diperbarui 2026-11-05.

## Identitas

- Proyek Minor MK4066 Perubahan Iklim (Layanan) ITB, pengganti UAS. Dosen: Dr. rer. nat. Armi Susandi. Penilaian oleh asisten.
- Nama file PPT menulis MK4056, isi slide menulis MK 4066. Asumsi: MK4066 benar.
- Topik kelompok: no. 13, "Transisi energi: PLTS atap dan pensiun dini PLTU" (mitigasi).
- Laporan lama menyebut "Kelompok 17". Nomor kelompok resmi belum dikonfirmasi user.
- Kelompok besar (sekitar 25 orang). User menilai kualitas kerja lama rendah dan tidak nyambung.
- User: Muhamad Nazih Najmudin (13523144).

## Cakupan Kerja Kita

- Luaran yang dipilih: konsep kajian, dengan inovasi diwujudkan sebagai prototipe aplikasi web untuk diseminasi.
- Dikerjakan: prototipe + laporan tertulis. PPT tidak termasuk.
- Laporan lama tidak diikuti strukturnya. Dipakai sebagai bahan saja.
- Hosting harus gratis.

## Alur Kerja Yang Disepakati

1. Plan ideasi output (context `ideas/plan-ideasi-output.md`), dijelaskan ke user dengan bahasa mudah.
2. Setelah plan disetujui: PRD dan working plan.
3. Baru masuk ke kode.

## Status

- 2026-11-05: plan ideasi v1 (sisi warga) ditulis. User membantah: hambatan utama di PLN dan negara, cakupan cukup Jawa Barat, produk dijual ke ESDM. Plan v2 (`contexts/ideas/plan-ideasi-v2-sisi-pln.md`) ditulis, menunggu review. v1 tetap disimpan atas permintaan user.
- 2026-11-05: user memilih v2. Nama sistem PowerShift. Demo utama Cirebon-1. Atapku (v1) hanya bonus jika waktu cukup, tidak masuk laporan. Bentuk produk dan alternatif teknologi ditambahkan di plan v2 bagian 11, menunggu pilihan teknologi user. Setelah itu PRD.
- 2026-11-05: user menyetujui cakupan Jawa-Bali dan teknologi. PRD v1.0 (`contexts/plan/prd-powershift.md`) dan implementation plan v1.0 (`contexts/plan/implementation-plan.md`) ditulis, menunggu review. Citations dan lisensi di `contexts/external/`.
- Belum ada kode, belum repo git. Langkah berikut setelah review: F0 persiapan, lalu FD pengumpulan data.

## Keputusan Produk

- Nama: PowerShift.
- Konsep: alat bantu keputusan paket "pensiun satu PLTU + PLTS atap" di Jawa Barat, neraca PLN dan APBN, cek keandalan, dampak, kriteria Permen 10/2025.
- Demo: Cirebon-1.
- Teknologi (disetujui user 2026-11-05): situs statis JS polos + Chart.js + Leaflet, skrip Python (uv) untuk olah data sekali jalan.
- Cakupan (disetujui user 2026-11-05): sistem Jawa-Bali, Cirebon-1 demo, Jabar sorotan narasi.
- Dosen menyukai visual peta. Peta wajib tampil menonjol (plan v2 bagian 12).

Aturan tugas detail di `task-spec.md`. Fakta isu terkini di `isu-energi.md`.
