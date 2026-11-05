# Environment

Diverifikasi 2026-11-05.

## Runtime

- WSL2 Linux, Python 3.12.3 di `/usr/bin/python3`.
- `uv` 0.13.7 di `~/.local/bin/uv`. Di proyek lain user minta environment Python memakai uv. Asumsi berlaku juga di sini sampai dikonfirmasi.
- GPU: NVIDIA RTX 4050 Laptop, 6141 MiB VRAM, sekitar 1090 MiB terpakai saat idle.

## Repo

- Per 2026-11-05 folder proyek kosong dan belum menjadi repo git.
- Belum ada `.gitignore`. Saat dibuat, `internal/` wajib masuk ignore agar knowledge dan context tidak ikut ke git.
- Global ignore user (`~/.config/git/ignore`) hanya berisi `**/.claude/settings.local.json`.
