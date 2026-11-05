"""Statistik PLN 2025: PDF -> pelanggan, penjualan, tarif rata-rata per provinsi Jawa-Bali (CSV)"""
import re
import subprocess
import pandas as pd

PDF = "data/raw/pln/Statistik-PLN-2025-Unaudited.pdf"
OUT = "data/processed/pln_2025_provinces.csv"

# Unit Names
UNITS = {
    "UID Jakarta Raya": "jakarta",
    "UID Banten": "banten",
    "UID Jawa Barat": "jabar",
    "- Jawa Tengah": "jateng",
    "- Daerah Istimewa Yogyakarta": "diy",
    "UID Jawa Timur": "jatim",
    "UID Bali": "bali",
    "Jawa": "jawa",
    "Indonesia": "indonesia",
}
GROUPS = ["rumah_tangga", "industri", "bisnis", "sosial", "pemerintah", "pju", "lainnya", "total"]
TABLES = {4: "pelanggan", 6: "penjualan_gwh", 9: "tarif_rp_kwh"}


def to_number(text):
    """'1.234,56' -> 1234.56"""
    return float(text.replace(".", "").replace(",", "."))


def read_table(lines, number):
    """baris teks PDF -> {unit: [nilai per kelompok]} untuk satu tabel"""
    start = next(i for i, l in enumerate(lines) if f"Tabel/Table {number} :" in l)
    rows = {}
    for line in lines[start:start + 90]:
        text = line.strip()
        for name, uid in UNITS.items():
            if re.match(re.escape(name) + r"\s+[\d.]", text) and uid not in rows:
                values = re.findall(r"[\d.]+,\d+|[\d.]+", text[len(name):])
                rows[uid] = [to_number(v) for v in values][:len(GROUPS)]
    return rows


if __name__ == "__main__":
    text = subprocess.run(["pdftotext", "-layout", PDF, "-"], capture_output=True, text=True).stdout
    lines = text.splitlines()

    records = {}
    for number, field in TABLES.items():
        for uid, values in read_table(lines, number).items():
            for group, value in zip(GROUPS, values):
                records.setdefault(uid, {})[f"{field}_{group}"] = value

    df = pd.DataFrame.from_dict(records, orient="index")
    df.index.name = "id"
    df.to_csv(OUT)
    print(df[["pelanggan_total", "penjualan_gwh_total", "tarif_rp_kwh_total"]])
