"""PLTU: GEM Global Coal Plant Tracker -> unit PLTU jaringan PLN Jawa-Bali (JSON)"""
import json
import geopandas as gpd
import pandas as pd

GEM = "data/raw/gem/Global-Coal-Plant-Tracker-July-2026.xlsx"
PROVINCES = "data/raw/geoboundaries/geoBoundaries-IDN-ADM1_simplified.geojson"
OUT = "data/processed/plants.json"

# Province Ids
PROVINCE_IDS = {
    "Jakarta Special Capital Region": "jakarta", "Banten": "banten", "West Java": "jabar",
    "Central Java": "jateng", "Special Region of Yogyakarta": "diy", "East Java": "jatim", "Bali": "bali",
}

# Model Constants
PPA_YEARS_IPP = 30          # asumsi masa PPA IPP, sama dengan Cirebon-1 (2012 -> 2042)
DESIGN_LIFE_PLN = 40        # asumsi umur desain PLTU milik PLN
MIN_RETIRE_YEAR = 2030      # unit tua yang lewat umur desain diasumsikan pensiun 2030
CREA_DEATHS_PER_GW = 10500 / 40.6   # kematian per GW per tahun, rata-rata armada 2022
BTU_PER_KCAL = 3.968

# Plant-Specific Overrides
RETIRE_OVERRIDE = {
    # rencana 2037 di GEM adalah rencana pensiun dini, baseline 2045
    "Pelabuhan Ratu power station": (2045, "B-CNBC-PELABUHANRATU"),
}
DEATHS_OVERRIDE = {
    # CREA: pensiun 2035 menghindari 6.370 kematian 2036-2042 (7 tahun)
    ("Cirebon power station", "Unit 1"): (6370 / 7, "B-ECOBUSINESS-CIREBON"),
}


def short_name(plant):
    """'Banten Suralaya power station' -> 'Suralaya'"""
    name = plant.replace(" power station", "").replace("Banten ", "")
    return name.replace("PLN ", "").replace("Central Java Power Project", "Batang (Central Java Power)")


def owner_type(owner):
    """String pemilik GEM -> 'PLN' atau 'IPP'"""
    is_pln = ("PLN" in owner) or ("Indonesia Power" in owner)
    is_jv = "Barito" in owner  # Suralaya 9-10 berbentuk usaha patungan dengan PPA
    return "PLN" if is_pln and not is_jv else "IPP"


def load_units():
    """GEM -> unit operasi, non-captive, di dalam provinsi Jawa-Bali"""
    df = pd.read_excel(GEM, sheet_name="Units")
    df = df[(df["Country/Area"] == "Indonesia") & (df["Status"] == "operating") & (df["Captive"].isna())]
    provinces = gpd.read_file(PROVINCES)
    provinces["id"] = provinces["shapeName"].map(PROVINCE_IDS)
    points = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df["Longitude"], df["Latitude"]), crs=4326)

    # PLTU di pesisir bisa jatuh di luar poligon, jadi pakai provinsi terdekat dalam UTM
    utm = 32749
    joined = gpd.sjoin_nearest(points.to_crs(utm), provinces.to_crs(utm)[["id", "geometry"]],
                               how="left", max_distance=5000)
    return joined[joined["id"].notna()]


def baseline_retire(row, kind):
    """Tahun pensiun baseline: akhir PPA (IPP) atau umur desain (PLN)"""
    if row["Plant name"] in RETIRE_OVERRIDE:
        return RETIRE_OVERRIDE[row["Plant name"]]
    if pd.notna(row["Planned retirement"]):
        return int(row["Planned retirement"]), "D-GEM-GCPT"
    start = int(row["Start year"])
    if kind == "IPP":
        return start + PPA_YEARS_IPP, "assumption"
    return max(start + DESIGN_LIFE_PLN, MIN_RETIRE_YEAR), "assumption"


def build(units):
    """DataFrame GEM -> list unit untuk model dan peta"""
    rows = []
    for _, r in units.iterrows():
        kind = owner_type(str(r["Owner"]))
        retire, retire_src = baseline_retire(r, kind)
        mw = float(r["Capacity (MW)"])
        cf = float(r["Capacity factor"])
        gen_gwh = mw * cf * 8.76
        co2_mt = float(r["Annual CO2 (million tonnes / annum)"])

        # Health Impact
        key = (r["Plant name"], r["Unit name"])
        if key in DEATHS_OVERRIDE:
            deaths, health_src = DEATHS_OVERRIDE[key]
        else:
            deaths, health_src = CREA_DEATHS_PER_GW * mw / 1000, "P-CREA-IESR-2023"

        rows.append({
            "id": r["GEM unit/phase ID"],
            "plant": short_name(r["Plant name"]),
            "unit": str(r["Unit name"]).replace("--", "Unit 1"),
            "province": r["id"],
            "lat": round(float(r["Latitude"]), 4),
            "lon": round(float(r["Longitude"]), 4),
            "mw": mw,
            "start": int(r["Start year"]),
            "owner": str(r["Owner"]).split(" [")[0],
            "parent": str(r["Parent"]),
            "type": kind,
            "retire_base": retire,
            "retire_src": retire_src,
            "cf": cf,
            "gen_gwh": round(gen_gwh, 1),
            "co2_mt": round(co2_mt, 3),
            "ef_t_mwh": round(co2_mt * 1e6 / (gen_gwh * 1e3), 3),
            "heat_rate_kcal_kwh": round(float(r["Heat rate (Btu per kWh)"]) / BTU_PER_KCAL),
            "deaths_yr": round(deaths, 1),
            "health_src": health_src,
            "wiki": r["Wiki URL"],
        })
    return sorted(rows, key=lambda x: (x["plant"], x["unit"]))


if __name__ == "__main__":
    plants = build(load_units())
    with open(OUT, "w") as f:
        json.dump(plants, f, indent=1)
    total = sum(p["mw"] for p in plants)
    print(len(plants), "unit,", round(total), "MW ->", OUT)
