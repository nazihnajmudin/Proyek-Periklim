"""Tabel dokumen kajian: data olahan + hasil validasi -> LaTeX di docs/kajian/tables"""
import json
import os
import pandas as pd

OUT = "docs/kajian/tables"
RESULTS = "validation/results"

PROVINCE_NAMES = {
    "jakarta": "DKI Jakarta", "banten": "Banten", "jabar": "Jawa Barat", "jateng": "Jawa Tengah",
    "diy": "DI Yogyakarta", "jatim": "Jawa Timur", "bali": "Bali",
}
PRESET_LABELS = {
    "roadmap_pv": "Komponen PLTS atap", "roadmap_retire": "Komponen pensiun dini",
    "fase2": "Fase 1-2", "roadmap": "Roadmap Fase 1-3", "seimbang": "Varian seimbang",
}
STATUS = {"verified": "terverifikasi", "assumption": "asumsi", "perlu-cek": "perlu cek"}


def num(x, digits=0):
    """angka -> format Indonesia (titik ribuan, koma desimal)"""
    x = round(x + 1e-9 * (1 if x >= 0 else -1), digits)   # pembulatan setengah ke atas
    text = f"{x:,.{digits}f}"
    return text.replace(",", "X").replace(".", ",").replace("X", ".")


def show(v, unit):
    """nilai parameter -> teks ringkas"""
    if unit == "tahun":
        return str(v)
    if isinstance(v, float) and v != int(v):
        text = num(v, 4 if abs(v) < 1 else 2)
        return text.rstrip("0").rstrip(",")
    if abs(v) >= 1e9:
        return num(v / 1e9, 2).rstrip("0").rstrip(",") + " miliar"
    return num(v)


def code(text):
    """kode sumber -> texttt yang boleh dipenggal di tanda hubung"""
    return "\\texttt{" + tex(text).replace("-", "-\\allowbreak{}") + "}"


def tex(text):
    return str(text).replace("&", "\\&").replace("%", "\\%").replace("_", "\\_").replace("$", "\\$")


def write(name, body):
    with open(f"{OUT}/{name}.tex", "w") as f:
        f.write(body)


def plants_by_province():
    """PLTU per provinsi: unit, MW per tipe, emisi"""
    plants = pd.DataFrame(json.load(open("data/processed/plants.json")))
    rows = []
    for pid, g in plants.groupby("province"):
        rows.append((PROVINCE_NAMES[pid], len(g), g["mw"].sum(), g.loc[g["type"] == "IPP", "mw"].sum(),
                     g.loc[g["type"] == "PLN", "mw"].sum(), g["co2_mt"].sum(), g["deaths_yr"].sum()))
    rows.sort(key=lambda r: -r[2])
    body = "\\begin{tabular}{lrrrrrr}\n\\toprule\nProvinsi & Unit & MW & IPP (MW) & PLN (MW) & Mt CO$_2$/tahun & Kematian/tahun \\\\\n\\midrule\n"
    for r in rows:
        body += f"{r[0]} & {r[1]} & {num(r[2])} & {num(r[3])} & {num(r[4])} & {num(r[5], 1)} & {num(r[6])} \\\\\n"
    t = plants
    body += f"\\midrule\nTotal & {len(t)} & {num(t['mw'].sum())} & {num(t.loc[t['type'] == 'IPP', 'mw'].sum())} & " \
            f"{num(t.loc[t['type'] == 'PLN', 'mw'].sum())} & {num(t['co2_mt'].sum(), 1)} & {num(t['deaths_yr'].sum())} \\\\\n"
    body += "\\bottomrule\n\\end{tabular}\n"
    write("pltu_provinsi", body)


def preset_results():
    """hasil kumulatif 2026-2040 per preset"""
    df = pd.read_csv(f"{RESULTS}/preset_summary.csv").set_index("preset")
    rows = [
        ("Neraca PLN (Rp T)", lambda s: num(s["pln_rp"] / 1e12, 1)),
        ("Neraca negara, PLN + APBN (Rp T)", lambda s: num(s["state_rp"] / 1e12, 1)),
        ("Dana luar ETM/JETP (Rp T)", lambda s: num(s["ext_rp"] / 1e12, 1)),
        ("Hemat tagihan pelanggan (Rp T)", lambda s: num(s["bill_saving_rp"] / 1e12, 1)),
        ("CO$_2$ dihindari (Mt)", lambda s: num(s["co2_avoided_t"] / 1e6, 1)),
        ("Kematian dini dihindari", lambda s: num(s["deaths_avoided"])),
        ("Nilai kesehatan (Rp T)", lambda s: num(s["health_saved_rp"] / 1e12, 1)),
        ("PLTS atap 2040 (GWp)", lambda s: num(s["pv_mwp_2040"] / 1000, 1)),
        ("Pembangkit pengganti (MW)", lambda s: num(s["replacement_mw_max"])),
        ("Kenaikan BPP maks. (Rp/kWh)", lambda s: num(max(s["bpp_delta_max"], 0), 1)),
        ("Pekerja PLTU terdampak", lambda s: num(s["workers_affected"])),
    ]
    keys = list(PRESET_LABELS)
    body = "\\begin{tabular}{l" + "r" * len(keys) + "}\n\\toprule\nIndikator & " + \
           " & ".join(PRESET_LABELS[k] for k in keys) + " \\\\\n\\midrule\n"
    for label, fn in rows:
        body += label + " & " + " & ".join(fn(df.loc[k]) for k in keys) + " \\\\\n"
    body += "\\bottomrule\n\\end{tabular}\n"
    write("preset", body)


def roadmap_kpis():
    """capaian indikator laporan kelompok per skenario roadmap"""
    df = pd.read_csv(f"{RESULTS}/preset_summary.csv").set_index("preset")
    keys = ["fase2", "roadmap", "seimbang"]
    rows = [
        ("PLTU pensiun dini (GW)", lambda s: num(s["kpi_retired_gw"], 2)),
        ("Tambahan PLTS atap 2040 (GWp)", lambda s: num(s["kpi_pv_added_mwp"] / 1000, 2)),
        ("Rasio PLTS atap terhadap PLTU", lambda s: num(100 * s["kpi_pv_added_mwp"] / 1000 / s["kpi_retired_gw"]) + "\\%"),
        ("PLTS atap Jawa-Bali 2028 (MWp)", lambda s: num(s["pv_mwp_2028"])),
        ("Kuota Jawa-Madura-Bali 2028 (MWp)", lambda s: num(s["kpi_pv_target_2028"])),
        ("Dana luar (Rp T)", lambda s: num(s["ext_rp"] / 1e12, 1)),
        ("Alokasi pensiun dini CIPP JETP (Rp T)", lambda s: num(s["kpi_jetp_fund_rp"] / 1e12, 1)),
        ("Neraca negara (Rp T)", lambda s: num(s["state_rp"] / 1e12, 1)),
    ]
    body = "\\begin{tabular}{lrrr}\n\\toprule\nIndikator & " + " & ".join(PRESET_LABELS[k] for k in keys) + " \\\\\n\\midrule\n"
    for label, fn in rows:
        body += label + " & " + " & ".join(fn(df.loc[k]) for k in keys) + " \\\\\n"
    body += "\\bottomrule\n\\end{tabular}\n"
    write("kpi_roadmap", body)


def candidates():
    """daftar urut kandidat pensiun dini 2031 (penyaring PowerShift)"""
    df = pd.read_csv(f"{RESULTS}/candidates_2031.csv")
    body = "\\begin{tabular}{rllrrrrrr}\n\\toprule\n\\# & PLTU & Pemilik & MW & Pensiun baseline & Neraca negara (Rp T) & Per GW (Rp T) & Dana luar (Rp T) & Kematian/tahun \\\\\n\\midrule\n"
    for i, r in enumerate(df.itertuples(), 1):
        body += f"{i} & {tex(r.plant)} & {r.type} & {num(r.mw)} & {r.retireBase} & {num(r.stateRp / 1e12, 1)} & " \
                f"{num(r.statePerGw / 1e12, 1)} & {num(r.extRp / 1e12, 1)} & {num(r.deathsYr)} \\\\\n"
    body += "\\bottomrule\n\\end{tabular}\n"
    write("kandidat", body)


def hand_calculation():
    """hitung tangan Cirebon-1 2035 + dorongan PLTS atap"""
    rows = json.load(open(f"{RESULTS}/cirebon1_manual.json"))
    items = [
        ("Kapasitas PLTS atap (MWp)", "pv_mwp", 1, 0),
        ("Pendapatan PLN hilang", "revenue_lost_rp", 1e12, 2),
        ("Kompensasi ekspor PLTS", "export_cost_rp", 1e12, 2),
        ("Biaya energi dihemat", "energy_saved_rp", 1e12, 2),
        ("Pembayaran kapasitas dihemat", "capacity_saved_rp", 1e12, 2),
        ("Porsi PLN kompensasi pensiun", "comp_pln_rp", 1e12, 2),
        ("Pembangkit pengganti", "replacement_rp", 1e12, 2),
        ("Neraca PLN", "pln_rp", 1e12, 2),
    ]
    body = "\\begin{tabular}{lrrr}\n\\toprule\nKomponen (Rp T, kecuali disebut) & " + \
           " & ".join(str(r["year"]) for r in rows) + " \\\\\n\\midrule\n"
    for label, key, div, d in items:
        body += label + " & " + " & ".join(num(r[key] / div, d) for r in rows) + " \\\\\n"
    body += "\\bottomrule\n\\end{tabular}\n"
    write("hitung_tangan", body)


def assumptions():
    """tabel parameter model untuk lampiran"""
    params = json.load(open("data/manual/parameters.json"))
    body = "\\begin{longtable}{p{0.33\\textwidth} p{0.2\\textwidth} p{0.26\\textwidth} p{0.11\\textwidth}}\n\\toprule\n" \
           "Parameter & Nilai & Sumber & Status \\\\\n\\midrule\n\\endhead\n"
    for group in ["system", "coal", "health", "pv", "subsidy", "kpi"]:
        for key, p in params[group].items():
            if key == "segments":
                for s in p.values():
                    v = s["value"]
                    value = f"Rp{num(v['price'] / 1e6)} jt/kWp, pakai sendiri {num(v['self'] * 100)}\\%, tarif Rp{num(v['tariff'], 2)}"
                    body += f"PLTS atap: {tex(s['label'])} & {value} & {code(s['source'])} & {STATUS[s['status']]} \\\\\n"
                continue
            value = show(p["value"], p["unit"])
            body += f"{tex(p['label'])} & {value} {tex(p['unit'])} & {code(p['source'])} & {STATUS[p['status']]} \\\\\n"
    body += "\\bottomrule\n\\end{longtable}\n"
    write("asumsi", body)


def unit_list():
    """daftar unit PLTU untuk lampiran"""
    plants = json.load(open("data/processed/plants.json"))
    body = "\\begin{longtable}{p{0.22\\textwidth} p{0.15\\textwidth} r r l r r}\n\\toprule\n" \
           "PLTU & Unit & MW & Mulai & Tipe & Pensiun baseline & tCO$_2$/MWh \\\\\n\\midrule\n\\endhead\n"
    for u in plants:
        body += f"{tex(u['plant'])} & {tex(u['unit'])} & {num(u['mw'])} & {u['start']} & {u['type']} & {u['retire_base']} & {num(u['ef_t_mwh'], 2)} \\\\\n"
    body += "\\bottomrule\n\\end{longtable}\n"
    write("unit_pltu", body)


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    plants_by_province()
    preset_results()
    roadmap_kpis()
    candidates()
    hand_calculation()
    assumptions()
    unit_list()
    print("tabel tersimpan di", OUT)
