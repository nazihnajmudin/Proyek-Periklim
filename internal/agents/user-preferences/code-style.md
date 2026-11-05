# Code Style

Sumber: instruksi eksplisit user 2026-11-05, diwarisi dari kebiasaan user di proyek lain.
Berlaku untuk semua deliverable di luar `internal/`: kode, komentar, docstring, HOWTO, log, dokumen.

## Level Kode

- Setara mahasiswa berkemampuan menengah: tidak terlalu kompleks, tidak terlalu dioptimasi.
- Desain tetap rapi.

## Dokumentasi

- Brief, padat, to the point. Tidak terlalu lengkap dan detail.
- Docstring modul atau fungsi gaya simbol, satu baris: `"""Preprocessing: wav -> (32, 32, N)"""`.
- Simbol yang biasa dipakai user: `->`, `:`.
- Tidak berisi daftar output panjang, urutan prioritas, atau alasan desain.

## Komentar

Jumlah sedang, tidak panjang. Hanya dua jenis:

1. Judul blok proses: frasa noun singkat, bahasa Inggris, tidak menjelaskan aksi.
   - Benar: `# Model Configurations`
   - Salah: `# Configure the data by doing bla bla`
2. Inline: singkat, bahasa Indonesia, hanya jika baris benar-benar perlu dijelaskan.

## Kesalahan Gaya AI Yang Dilarang

1. Menjelaskan ke pembaca. Komentar manusia adalah judul dan catatan untuk dirinya, bukan laporan hasil kerja.
   - Dilarang menyisipkan saran, perintah, aksi, diskusi, pertimbangan, keputusan, alasan pilihan.
   - Dilarang memakai kata "user" untuk merujuk pemilik repo. Pakai "human".
   - Gaya bahasa diskusi hanya boleh di `internal/`.
2. Referensi dan sitasi. Dilarang merujuk plan.md, ID keputusan, bab, tabel, spesifikasi, atau "permintaan X".
3. Kalimat panjang. Tulis seperti orang malas mengetik: frasa pendek, bukan paragraf.
   - Dilarang menegaskan dengan kapital (SELALU, SEMUA, DAN). Fokus pada entitas, bukan kardinalitas.
4. Karakter tidak lazim. Hanya karakter yang biasa diketik di keyboard.
   - Dilarang: panah unicode, `≤`, `≥`, `×`, `…`, kutip miring, em dash, en dash.
   - Boleh: `->`, `>=`, `<=`, `x`, `...`.
   - Pengecualian: teks yang memang disalin dari dokumen laporan.

## Istilah

- Jangan memakai istilah internal diskusi di kode, nama kolom, atau dokumentasi. Pakai nama yang menjelaskan dirinya.

## Karakter Terlarang Umum

- Em dash dan tanda pisah.
- Titik koma, kecuali memisahkan dua item yang masing-masing mengandung koma.
- Emoji.

Berlaku juga untuk teks balasan dan dokumen.
