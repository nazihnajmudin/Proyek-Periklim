"""Hitung tangan: Cirebon-1 pensiun 2035 + dorongan PLTS atap (kompensasi ETM) -> neraca PLN 2030, 2035, 2040"""
import json
import math

WEB = "web/data"
YEARS = [2030, 2035, 2040]

# Scenario
EXPORT = 0.65
QUOTA = 1500
GOV_MW = 100
PROGRAM_SHARE = 0.05
FUND_PLN = 0.25
RETIRE_YEAR = 2035


def load(name):
    with open(f"{WEB}/{name}") as f:
        return json.load(f)


params = load("parameters.json")
plants = load("plants.json")
provinces = load("provinces.json")
v = lambda g, k: params[g][k]["value"]
seg = lambda s: params["pv"]["segments"][s]["value"]

# Step 1: PV Yield
sales = sum(p["sales_gwh"] for p in provinces)
yield_kwh = sum(p["pvout"] * p["sales_gwh"] for p in provinces) / sales

# Step 2: Market Additions per Segment
trend = v("pv", "trend_add_mwp_yr")
k = v("pv", "payback_k")
market = {}
for s in ["rt", "bisnis", "industri", "pemerintah"]:
    x = seg(s)
    pb_new = x["price"] / (yield_kwh * x["tariff"] * (x["self"] + (1 - x["self"]) * EXPORT))
    pb_old = x["price"] / (yield_kwh * x["tariff"] * x["self"])
    market[s] = (trend * x["split"], trend * x["split"] * math.exp(-k * pb_new) / math.exp(-k * pb_old))

budget = PROGRAM_SHARE * v("subsidy", "subsidy_rp_2026") * v("subsidy", "jb_share_subsidy")
program_mw = budget / (seg("program")["price"] * 1000)


def additions(i):
    """tahun ke-i (mulai 1) -> tambahan MWp skenario per segmen setelah kuota"""
    w = min(1, i / v("pv", "adoption_ramp_yr"))
    add = {s: base + (long - base) * w for s, (base, long) in market.items()}
    add["pemerintah"] += GOV_MW
    add["program"] = program_mw
    total = sum(add.values())
    if total > QUOTA:
        add = {s: a * QUOTA / total for s, a in add.items()}
    return add


# Step 3: Fleet Averages
usd = v("system", "usd_idr")
per_kcal = v("coal", "coal_price_usd_t") * usd / (v("coal", "coal_kcal_kg") * 1000)
cost = lambda u: per_kcal * u["heat_rate_kcal_kwh"] + v("coal", "vom_rp_kwh")
gen = sum(u["gen_gwh"] for u in plants)
c_marg = sum(u["gen_gwh"] * cost(u) for u in plants) / gen
c1 = next(u for u in plants if u["plant"] == "Cirebon" and u["unit"] == "Unit 1")

# Step 4: Ledger per Year
start = v("pv", "installed_national_mwp_2025") * v("pv", "jb_share_pv")
g = v("system", "demand_growth")
peak0 = v("system", "peak_mw_2024") * (1 + g)
rows = []
for year in YEARS:
    n = year - 2025
    cap_scn = {s: start * seg(s)["split"] for s in ["rt", "bisnis", "industri", "pemerintah", "program"]}
    cap_base = dict(cap_scn)
    for i in range(1, n + 1):
        add = additions(i)
        for s in cap_scn:
            cap_scn[s] += add[s]
            cap_base[s] += trend * seg(s)["split"] if s != "program" else 0

    rev_lost = export = d_energy = 0
    for s in cap_scn:
        x = seg(s)
        e_scn = cap_scn[s] * yield_kwh * 1000           # kWh
        d_e = (cap_scn[s] - cap_base[s]) * yield_kwh * 1000
        per_kwh = v("system", "bpp_rp_kwh") if s == "program" else x["tariff"]
        rev_lost += d_e * x["self"] * per_kwh
        export += e_scn * (1 - x["self"]) * EXPORT * x["tariff"]
        d_energy += d_e

    # Cirebon-1 retired 2035-2041
    retired = RETIRE_YEAR <= year < c1["retire_base"]
    e_c1 = c1["gen_gwh"] * 1e6 if retired else 0      # kWh
    energy_saved = e_c1 * cost(c1) - (e_c1 - d_energy) * c_marg
    cap_saved = v("coal", "cap_charge_usd_kw_yr") * 1000 * usd * c1["mw"] if retired else 0
    comp = v("coal", "comp_etm_rp_mw_yr") * c1["mw"] * FUND_PLN if retired else 0

    # Replacement: setelah 2029 baseline tepat di target, jadi MW pensiun harus diganti
    replacement = v("coal", "replacement_usd_kw_yr") * 1000 * usd * c1["mw"] if retired else 0

    pln = -rev_lost - export + energy_saved + cap_saved - comp - replacement
    rows.append({"year": year, "pv_mwp": sum(cap_scn.values()), "revenue_lost_rp": -rev_lost,
                 "export_cost_rp": -export, "energy_saved_rp": energy_saved, "capacity_saved_rp": cap_saved,
                 "comp_pln_rp": -comp, "replacement_rp": -replacement, "pln_rp": pln})

if __name__ == "__main__":
    with open("validation/results/cirebon1_manual.json", "w") as f:
        json.dump(rows, f, indent=1)
    print(f"Yield rata-rata: {yield_kwh:.1f} kWh/kWp, biaya marjinal: {c_marg:.1f} Rp/kWh")
    for r in rows:
        print(r["year"], " ".join(f"{k}={r[k] / 1e12:.3f}T" for k in r if k.endswith("_rp")), f"PV={r['pv_mwp']:.0f} MWp")
