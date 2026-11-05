"""PVOUT: Global Solar Atlas API per kabupaten -> CSV kWh/kWp/tahun"""
import os
import time
import pandas as pd
import requests

REGENCIES = "data/processed/regencies.csv"
CACHE = "data/raw/gsa_api/pvout_regencies.csv"
API = "https://api.globalsolaratlas.info/data/lta?loc={lat},{lon}"


def fetch_point(lat, lon):
    """Titik -> PVOUT_csi tahunan (kWh/kWp)"""
    res = requests.get(API.format(lat=lat, lon=lon), timeout=30)
    res.raise_for_status()
    return res.json()["annual"]["data"]["PVOUT_csi"]


if __name__ == "__main__":
    regencies = pd.read_csv(REGENCIES)
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)

    # Cache Loading
    done = {}
    if os.path.exists(CACHE):
        old = pd.read_csv(CACHE)
        done = dict(zip(old["id"], old["pvout"]))

    rows = []
    for _, r in regencies.iterrows():
        if r["id"] not in done:
            done[r["id"]] = fetch_point(r["lat"], r["lon"])
            time.sleep(1)  # jeda agar tidak membebani API
        rows.append({"id": r["id"], "name": r["name"], "province": r["province"],
                     "lat": r["lat"], "lon": r["lon"], "pvout": round(done[r["id"]], 1)})

    pd.DataFrame(rows).to_csv(CACHE, index=False)
    print(len(rows), "titik tersimpan di", CACHE)
