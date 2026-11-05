"""Data web: processed + manual -> web/data/*.json"""
import json
import shutil
import pandas as pd

PROCESSED = "data/processed"
MANUAL = "data/manual"
PVOUT = "data/raw/gsa_api/pvout_regencies.csv"
PLN = "data/processed/pln_2025_provinces.csv"
WEB = "web/data"

# Province Labels
NAMES = {
    "jakarta": "DKI Jakarta", "banten": "Banten", "jabar": "Jawa Barat", "jateng": "Jawa Tengah",
    "diy": "DI Yogyakarta", "jatim": "Jawa Timur", "bali": "Bali",
}


def build_provinces(params):
    """PVOUT kabupaten + penduduk + penjualan PLN -> ringkasan per provinsi"""
    pvout = pd.read_csv(PVOUT)
    mean = pvout.groupby("province")["pvout"].mean()
    pln = pd.read_csv(PLN, index_col="id")
    rows = []
    for pid, name in NAMES.items():
        rows.append({
            "id": pid,
            "name": name,
            "pop": params["population_m"][pid]["value"],
            "pvout": round(float(mean[pid]), 1),
            "sales_gwh": float(pln.loc[pid, "penjualan_gwh_total"]),
            "customers": int(pln.loc[pid, "pelanggan_total"]),
        })
    return rows


def add_pvout_to_regencies():
    """regencies.geojson + PVOUT -> regencies.geojson untuk web"""
    pvout = pd.read_csv(PVOUT).set_index("id")["pvout"]
    with open(f"{PROCESSED}/regencies.geojson") as f:
        geo = json.load(f)
    for feature in geo["features"]:
        rid = feature["properties"]["id"]
        feature["properties"]["pvout"] = float(pvout.get(rid, 0))
    return geo


if __name__ == "__main__":
    with open(f"{MANUAL}/parameters.json") as f:
        params = json.load(f)

    provinces = build_provinces(params)
    with open(f"{PROCESSED}/provinces.json", "w") as f:
        json.dump(provinces, f, indent=1)

    regencies = add_pvout_to_regencies()
    with open(f"{WEB}/regencies.geojson", "w") as f:
        json.dump(regencies, f, separators=(",", ":"))

    shutil.copy(f"{PROCESSED}/provinces.json", f"{WEB}/provinces.json")
    shutil.copy(f"{PROCESSED}/provinces.geojson", f"{WEB}/provinces.geojson")
    shutil.copy(f"{PROCESSED}/plants.json", f"{WEB}/plants.json")
    shutil.copy(f"{MANUAL}/parameters.json", f"{WEB}/parameters.json")
    print("data web diperbarui:", [p["name"] + " " + str(p["pvout"]) for p in provinces])
