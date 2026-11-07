"""Data web: processed + manual -> web/data/*.json"""
import json
import shutil
import pandas as pd

PROCESSED = "data/processed"
MANUAL = "data/manual"
PVOUT = "data/raw/gsa_api/pvout_regencies.csv"
PLN = "data/processed/pln_2025_provinces.csv"
ETP = "data/manual/etp_retirement.csv"
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


def add_etp_costs(plants):
    """biaya pensiun dini ETP per kelompok unit -> dibagi ke unit menurut MW"""
    etp = pd.read_csv(ETP)
    for _, r in etp.iterrows():
        units = [u for u in plants if u["plant"] == r["plant"] and u["unit"] in r["units"].split("|")]
        total = sum(u["mw"] for u in units)
        for u in units:
            share = u["mw"] / total
            u["etp_name"] = r["etp_name"]
            u["etp_cost_musd_yr"] = round(r["cost_musd_yr"] * share, 3)
            u["etp_valuation_musd"] = round(r["valuation_musd"] * share, 2)
    return plants


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
    with open(f"{PROCESSED}/plants.json") as f:
        plants = add_etp_costs(json.load(f))
    with open(f"{WEB}/plants.json", "w") as f:
        json.dump(plants, f, indent=1)
    shutil.copy(f"{MANUAL}/parameters.json", f"{WEB}/parameters.json")
    print("data web diperbarui:", [p["name"] + " " + str(p["pvout"]) for p in provinces])
