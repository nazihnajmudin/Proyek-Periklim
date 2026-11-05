"""Gambar laporan: data olahan + hasil validasi -> PNG di docs/figures"""
import json
import geopandas as gpd
import matplotlib.pyplot as plt
import pandas as pd

OUT = "docs/figures"
RESULTS = "validation/results"

# Palette Slots (dataviz reference palette)
BLUE, ORANGE, AQUA, YELLOW, MAGENTA = "#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4"
GREEN, VIOLET, RED = "#008300", "#4a3aa7", "#e34948"
INK, MUTED, GRID = "#0b0b0b", "#52514e", "#e4e4e0"

plt.rcParams.update({
    "font.size": 9, "axes.edgecolor": MUTED, "axes.labelcolor": INK, "xtick.color": MUTED,
    "ytick.color": MUTED, "axes.grid": True, "grid.color": GRID, "grid.linewidth": 0.6,
    "axes.spines.top": False, "axes.spines.right": False, "legend.frameon": False,
})

PRESET_LABELS = {
    "baseline": "Phase down PPA", "pvonly": "PLTS atap saja", "retireonly": "Pensiun dini saja",
    "paket": "Paket Cirebon-1", "seimbang": "Paket seimbang",
}


def save(fig, name):
    fig.savefig(f"{OUT}/{name}.png", dpi=200, bbox_inches="tight")
    plt.close(fig)


def map_plants():
    """Peta PLTU Jawa-Bali: ukuran = MW, warna = IPP/PLN"""
    provinces = gpd.read_file("data/processed/provinces.geojson")
    plants = pd.DataFrame(json.load(open("data/processed/plants.json")))
    groups = plants.groupby(["plant", "type"]).agg(mw=("mw", "sum"), lat=("lat", "first"), lon=("lon", "first")).reset_index()

    fig, ax = plt.subplots(figsize=(7.2, 3.0))
    provinces.plot(ax=ax, color="#f1f1ec", edgecolor="#9a9a94", linewidth=0.5)
    for kind, color in [("PLN", VIOLET), ("IPP", ORANGE)]:
        g = groups[groups["type"] == kind]
        ax.scatter(g["lon"], g["lat"], s=g["mw"] / 12, color=color, alpha=0.85, edgecolor="white",
                   linewidth=0.8, label=f"{kind} ({g['mw'].sum() / 1000:.1f} GW)", zorder=3)
    for name in ["Cirebon", "Suralaya", "Paiton", "Tanjung Jati B", "Pelabuhan Ratu", "Cilacap Sumber"]:
        g = groups[groups["plant"] == name].iloc[0]
        ax.annotate(name, (g["lon"], g["lat"]), xytext=(4, 6), textcoords="offset points", fontsize=7, color=INK)
    ax.set_axis_off()
    ax.legend(loc="lower left", fontsize=7, markerscale=0.4)
    save(fig, "peta_pltu")


def preset_summary():
    """Neraca kumulatif per preset: PLN, negara, kesehatan"""
    df = pd.read_csv(f"{RESULTS}/preset_summary.csv")
    df = df[df["preset"] != "baseline"]
    labels = [PRESET_LABELS[p] for p in df["preset"]]
    x = range(len(df))
    fig, ax = plt.subplots(figsize=(7.2, 3.0))
    w = 0.26
    series = [("pln_rp", -w, BLUE, "Neraca PLN"), ("state_rp", 0, VIOLET, "Neraca negara (PLN + APBN)"),
              ("health_saved_rp", w, AQUA, "Nilai kesehatan dihindari")]
    for key, shift, color, label in series:
        values = df[key] / 1e12
        bars = ax.bar([i + shift for i in x], values, w, color=color, edgecolor="white", linewidth=1, label=label)
        ax.bar_label(bars, labels=[f"{v:.1f}".replace(".", ",") for v in values], fontsize=6.5, color=INK, padding=2)
    ax.axhline(0, color=INK, linewidth=0.8)
    ax.set_xticks(list(x), labels)
    ax.set_ylabel("Rp triliun, kumulatif 2026-2040")
    ax.set_ylim(-160, 170)
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.16), ncol=3, fontsize=7)
    save(fig, "neraca_preset")


def ledger_years(preset, name):
    """Komponen neraca PLN per tahun untuk satu preset"""
    df = pd.read_csv(f"{RESULTS}/preset_{preset}.csv")
    parts = [
        ("Pendapatan PLN hilang", df["revenue_lost_rp"], BLUE),
        ("Kompensasi ekspor PLTS", df["export_cost_rp"], ORANGE),
        ("Biaya energi dihemat", df["energy_saved_rp"], AQUA),
        ("Biaya kapasitas PLTU dihemat", df["capacity_saved_rp"], YELLOW),
        ("Kompensasi pensiun dan pengganti", df["comp_pln_rp"] + df["replacement_rp"], MAGENTA),
    ]
    fig, ax = plt.subplots(figsize=(7.2, 3.0))
    pos = [0.0] * len(df)
    neg = [0.0] * len(df)
    for label, values, color in parts:
        values = (values / 1e12).tolist()
        bottom = [pos[i] if v >= 0 else neg[i] for i, v in enumerate(values)]
        ax.bar(df["year"], values, bottom=bottom, color=color, edgecolor="white", linewidth=1, label=label)
        for i, v in enumerate(values):
            if v >= 0:
                pos[i] += v
            else:
                neg[i] += v
    ax.plot(df["year"], df["pln_rp"] / 1e12, color=INK, linewidth=2, marker="o", markersize=3, label="Neraca bersih PLN")
    ax.axhline(0, color=INK, linewidth=0.8)
    ax.set_ylabel("Rp triliun per tahun")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.28), ncol=3, fontsize=7)
    save(fig, name)


def reserve_margin():
    """Reserve margin baseline vs paket seimbang"""
    df = pd.read_csv(f"{RESULTS}/preset_seimbang.csv")
    fig, ax = plt.subplots(figsize=(7.2, 2.6))
    ax.plot(df["year"], df["rm_base"] * 100, color=VIOLET, linewidth=2, marker="o", markersize=3, label="Baseline")
    ax.plot(df["year"], df["rm_scn"] * 100, color=BLUE, linewidth=2, marker="o", markersize=3,
            label="Paket seimbang, sebelum pembangkit pengganti")
    ax.axhline(33, color=MUTED, linestyle="--", linewidth=1, label="Batas rekomendasi MKI 33%")
    ax.set_ylabel("Reserve margin (%)")
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, 1.2), ncol=3, fontsize=7)
    save(fig, "reserve_margin")


def tornado():
    """Sensitivitas neraca PLN paket seimbang"""
    df = pd.read_csv(f"{RESULTS}/sensitivity.csv")
    df = df[df["preset"] == "seimbang"].copy()
    df["span"] = (df["high_pln"] - df["low_pln"]).abs()
    df = df[df["span"] > 1e9].sort_values("span")
    ref = df["ref_pln"].iloc[0] / 1e12
    fig, ax = plt.subplots(figsize=(7.2, 2.4))
    for i, (_, r) in enumerate(df.iterrows()):
        low, high = r["low_pln"] / 1e12, r["high_pln"] / 1e12
        ax.barh(i, low - ref, left=ref, color=BLUE, height=0.55, label="Parameter -20%" if i == 0 else None)
        ax.barh(i, high - ref, left=ref, color=ORANGE, height=0.55, label="Parameter +20%" if i == 0 else None)
    ax.set_yticks(range(len(df)), df["param"])
    ax.axvline(ref, color=INK, linewidth=0.8)
    ax.set_xlabel("Neraca PLN kumulatif 2026-2040 (Rp triliun)")
    ax.legend(loc="lower right", fontsize=7)
    save(fig, "tornado_seimbang")


if __name__ == "__main__":
    map_plants()
    preset_summary()
    ledger_years("paket", "neraca_paket_cirebon")
    ledger_years("seimbang", "neraca_seimbang")
    reserve_margin()
    tornado()
    print("gambar tersimpan di", OUT)
