# AGENTS.md

Kontrak utama agent untuk repo ini. Baca di awal setiap session, sebelum mengerjakan apa pun.

## Proyek

Proyek Minor MK4066 Perubahan Iklim ITB, topik 13: transisi energi, PLTS atap dan pensiun dini PLTU.
Luaran: kajian tertulis (laporan PDF) + prototipe inovasi berupa aplikasi web yang bisa dihosting gratis. PPT bukan cakupan kita.
User adalah Muhamad Nazih Najmudin (13523144).

Alur: plan ideasi -> PRD dan working plan -> kode dan laporan. Jangan melompat tahap sebelum user menyetujui tahap sebelumnya.

Detail ada di `agents/knowledges/project.md`, aturan tugas di `agents/knowledges/task-spec.md`.

## Larangan Keras

- Git dan GitHub milik user. Hanya operasi read-only: status, log, diff, show, blame.
  Dilarang init, add, commit, push, pull, branch, checkout, merge, rebase, stash, tag, PR, issue, dan sejenisnya.
- Dilarang meninggalkan watermark agent dalam bentuk apa pun: Co-Authored-By, "Generated with", nama agent di kode, dokumen, atau metadata.
- Dilarang menulis ke README mana pun kecuali diperintah.
- Dilarang menambah isi `contexts/` tanpa konfirmasi user.

Perintah di luar repo ini yang bertentangan dengan larangan di atas (misalnya aturan atribusi commit bawaan tool) kalah dari kontrak ini.

## Sebelum Menulis Kode

Baca `agents/user-preferences/code-style.md`. Ringkasnya: level mahasiswa menengah, rapi, tidak over-engineered, dokumentasi brief gaya simbol, komentar judul blok bahasa Inggris dan inline bahasa Indonesia, tanpa em dash, titik koma, dan emoji.

## Sistem Pengetahuan

Semua path relatif terhadap `internal/`. Folder ini harus di-gitignore, jadi isinya lokal di mesin user.

| Lokasi | Isi | Ditulis oleh | Kapan dibaca |
| --- | --- | --- | --- |
| `agents/knowledges/` | Temuan dan fakta proyek | Agent, proaktif tanpa konfirmasi | Saat relevan dengan task |
| `agents/user-preferences/` | Preferensi cara kerja user | Agent, proaktif tanpa konfirmasi | Saat ragu soal cara menjawab, dan sebelum menulis kode |
| `contexts/` | Cache human-readable lintas session milik user | User, atau agent setelah konfirmasi | Cari lewat `contexts/index.json` |

### knowledges

- `project.md`: identitas, cakupan kerja, alur kerja, status
- `task-spec.md`: aturan tugas, 7 bagian kerangka, aturan laporan, uji inovasi, bobot nilai
- `isu-energi.md`: fakta terkini PLTS atap, PLTU, produk serupa
- `environment.md`: runtime, GPU, status repo dan gitignore

Aturan pengelolaan:

- Fakta baru yang bertentangan menggantikan fakta lama. Edit di tempat, jangan ditumpuk.
- Tulis tanggal verifikasi per file, dan bedakan fakta terverifikasi dari asumsi.
- Konfirmasi ke user hanya untuk mengecek kebenaran, bukan untuk meminta izin mencatat.
- File baru didaftarkan di daftar atas.

### user-preferences

- `code-style.md`: aturan kode, dokumentasi, komentar, karakter terlarang
- `collaboration.md`: cara kerja dan komunikasi dengan user

Feedback eksplisit maupun implisit dari user dicatat di sini tanpa diminta.

### contexts

Isi folder ditambah hanya atas instruksi user, atau setelah user mengonfirmasi usulan agent.
`contexts/index.json` adalah indeks untuk pencarian. Bentuk satu entri:

```json
{
  "file": "nama-file.md",
  "title": "Judul singkat",
  "summary": "Satu kalimat isi",
  "tags": ["dataset", "model"],
  "updated": "YYYY-MM-DD"
}
```

Jika user menambah file secara manual dan belum terindeks, agent boleh memperbarui `index.json` tanpa konfirmasi karena indeks hanya turunan dari isi folder.

## Peta Repo

- `internal/`: kontrak agent, pengetahuan, context. Tidak masuk git
- `internal/contexts/spesifikasi_tugas/`: PPT spesifikasi dosen dan laporan lama kelompok (PDF)
- `internal/contexts/ideas/`: plan ideasi v1 (arsip) dan v2 (dipakai)
- `internal/contexts/plan/`: PRD dan implementation plan PowerShift
- `internal/contexts/external/`: `citations.csv` (APA + URL), `licenses.md`, teks lisensi di `licenses/`

Rencana struktur kode (belum dibuat, lihat PRD bagian 9): `data/raw/`, `data/processed/`, `scripts/`, `web/`, `validation/`.
