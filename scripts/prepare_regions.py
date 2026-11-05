"""Wilayah: geoBoundaries ADM1/ADM2 -> GeoJSON provinsi dan kabupaten Jawa-Bali"""
import json
import geopandas as gpd

RAW = "data/raw/geoboundaries"
OUT = "data/processed"

# Province Names
PROVINCES = {
    "Jakarta Special Capital Region": ("DKI Jakarta", "jakarta"),
    "Banten": ("Banten", "banten"),
    "West Java": ("Jawa Barat", "jabar"),
    "Central Java": ("Jawa Tengah", "jateng"),
    "Special Region of Yogyakarta": ("DI Yogyakarta", "diy"),
    "East Java": ("Jawa Timur", "jatim"),
    "Bali": ("Bali", "bali"),
}


def load_provinces():
    """ADM1 Indonesia -> 7 provinsi Jawa-Bali"""
    adm1 = gpd.read_file(f"{RAW}/geoBoundaries-IDN-ADM1_simplified.geojson")
    adm1 = adm1[adm1["shapeName"].isin(PROVINCES)].copy()
    adm1["name"] = adm1["shapeName"].map(lambda x: PROVINCES[x][0])
    adm1["id"] = adm1["shapeName"].map(lambda x: PROVINCES[x][1])
    return adm1[["id", "name", "geometry"]].reset_index(drop=True)


def load_regencies(provinces):
    """ADM2 Indonesia -> kabupaten/kota yang titik tengahnya di Jawa-Bali"""
    adm2 = gpd.read_file(f"{RAW}/geoBoundaries-IDN-ADM2_simplified.geojson")
    points = adm2.copy()
    points["geometry"] = adm2.representative_point()
    joined = gpd.sjoin(points, provinces, how="inner", predicate="within")

    regencies = adm2.loc[joined.index].copy()
    regencies["name"] = regencies["shapeName"]
    regencies["province"] = joined["id"]
    regencies["id"] = ["r%03d" % i for i in range(len(regencies))]
    regencies["lat"] = joined.geometry.y.round(4)
    regencies["lon"] = joined.geometry.x.round(4)
    return regencies[["id", "name", "province", "lat", "lon", "geometry"]].reset_index(drop=True)


def save_geojson(gdf, path, tolerance):
    """GeoDataFrame -> GeoJSON ringan (geometri disederhanakan, 4 desimal)"""
    gdf = gdf.copy()
    gdf["geometry"] = gdf.geometry.simplify(tolerance, preserve_topology=True)
    data = json.loads(gdf.to_json())
    for feature in data["features"]:
        feature["geometry"] = round_coords(feature["geometry"])
    with open(path, "w") as f:
        json.dump(data, f, separators=(",", ":"))


def round_coords(geom):
    """Bulatkan koordinat GeoJSON ke 4 desimal"""
    def walk(c):
        if isinstance(c[0], (int, float)):
            return [round(c[0], 4), round(c[1], 4)]
        return [walk(x) for x in c]
    geom["coordinates"] = walk(geom["coordinates"])
    return geom


if __name__ == "__main__":
    provinces = load_provinces()
    regencies = load_regencies(provinces)
    save_geojson(provinces, f"{OUT}/provinces.geojson", 0.01)
    save_geojson(regencies, f"{OUT}/regencies.geojson", 0.005)
    regencies.drop(columns="geometry").to_csv(f"{OUT}/regencies.csv", index=False)
    print(len(provinces), "provinsi,", len(regencies), "kabupaten/kota")
