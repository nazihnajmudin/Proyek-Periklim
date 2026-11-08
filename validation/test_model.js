/* Uji model: V1 hitung tangan, V2 kewajaran, V3 arah perubahan */
const fs = require("fs");
const m = require("../web/js/model.js");

const read = (f) => JSON.parse(fs.readFileSync(__dirname + "/../web/data/" + f));
const data = { params: read("parameters.json"), plants: read("plants.json"), provinces: read("provinces.json") };
const presets = m.makePresets(data);
let failed = 0;

function check(name, ok, detail) {
  console.log((ok ? "LULUS " : "GAGAL ") + name + (detail ? "  (" + detail + ")" : ""));
  if (!ok) failed++;
}

function scenario(changes) {
  return Object.assign(JSON.parse(JSON.stringify(presets.baseline.sc)), changes);
}

// V1 Hand Calculation
const cirebon1 = data.plants.find((u) => u.plant === "Cirebon" && u.unit === "Unit 1").id;
const manual = JSON.parse(fs.readFileSync(__dirname + "/results/cirebon1_manual.json"));
const paket = m.run(data, scenario({ retire: { [cirebon1]: 2035 }, exportShare: 0.65, quotaMw: 1500, govMw: 100,
                                     programShare: 0.05, fund: { ext: 0.75, apbn: 0, pln: 0.25 }, compMode: "etm" }));
for (const row of manual) {
  const r = paket.rows.find((x) => x.year === row.year);
  for (const key of Object.keys(row).filter((k) => k.endsWith("_rp") || k === "pv_mwp")) {
    const diff = Math.abs(r[key] - row[key]) / Math.max(Math.abs(row[key]), 1);
    check("V1 " + row.year + " " + key, diff < 0.01, "selisih " + (diff * 100).toFixed(3) + "%");
  }
}

// V2 Sanity
const base = m.run(data, presets.baseline.sc);
const zeroKeys = ["pln_rp", "apbn_rp", "state_rp", "co2_avoided_t", "deaths_avoided", "replacement_mw"];
check("V2 baseline tanpa selisih", base.rows.every((r) => zeroKeys.every((k) => Math.abs(r[k]) < 1e-6)));
check("V2 energi PLTS tidak negatif", paket.rows.every((r) => r.pv_mwp >= 0 && r.pv_mwp_base >= 0));
check("V2 reserve margin baseline 2025 sesuai data", Math.abs(base.rows[0].rm_base - 0.349) < 0.01,
      "2026: " + base.rows[0].rm_base.toFixed(3));
check("V2 baseline menjaga target cadangan mulai 2029",
      base.rows.filter((r) => r.year >= 2029).every((r) => r.rm_base >= 0.33 - 1e-9));

// V3 Direction
const e0 = m.run(data, scenario({ exportShare: 0.3 })).summary;
const e1 = m.run(data, scenario({ exportShare: 0.65 })).summary;
check("V3 nilai ekspor naik -> PLTS atap naik", e1.pv_mwp_2040 > e0.pv_mwp_2040);
check("V3 nilai ekspor naik -> neraca PLN turun", e1.pln_rp < e0.pln_rp);
const id = cirebon1;
const r2035 = m.run(data, scenario({ retire: { [id]: 2035 }, fund: { ext: 0.75, apbn: 0, pln: 0.25 }, compMode: "etm" })).summary;
const r2030 = m.run(data, scenario({ retire: { [id]: 2030 }, fund: { ext: 0.75, apbn: 0, pln: 0.25 }, compMode: "etm" })).summary;
check("V3 pensiun lebih awal -> kematian dihindari naik", r2030.deaths_avoided > r2035.deaths_avoided);
const plnClaim = m.run(data, scenario({ retire: { [id]: 2035 }, fund: { ext: 0.75, apbn: 0, pln: 0.25 }, compMode: "pln" })).summary;
check("V3 kompensasi klaim PLN -> neraca PLN lebih buruk", plnClaim.pln_rp < r2035.pln_rp);
const pvPush = { exportShare: 0.65, quotaMw: 1500, govMw: 100 };
const quotaLow = m.run(data, scenario(Object.assign({}, pvPush, { quotaMw: 300 }))).summary;
check("V3 kuota kecil membatasi PLTS atap", quotaLow.pv_mwp_2040 < m.run(data, scenario(pvPush)).summary.pv_mwp_2040);
const inc0 = m.run(data, scenario({})).summary;
const inc1 = m.run(data, scenario({ industryIncentive: 0.3 })).summary;
check("V3 insentif industri -> PLTS atap naik", inc1.pv_mwp_2040 > inc0.pv_mwp_2040);
check("V3 insentif industri -> APBN turun", inc1.apbn_rp < inc0.apbn_rp);
const late = m.run(data, scenario({ govMw: 100, pvFrom: 2030 })).summary;
const early = m.run(data, scenario({ govMw: 100, pvFrom: 2026 })).summary;
check("V3 kebijakan PLTS atap lebih lambat -> PLTS atap 2040 turun", late.pv_mwp_2040 < early.pv_mwp_2040);
const etp = m.run(data, scenario({ retire: { [id]: 2030 }, fund: { ext: 1, apbn: 0, pln: 0 }, compMode: "etp" })).summary;
const unit = data.plants.find((u) => u.id === id);
const etpTotal = unit.etp_valuation_musd * 1e6 * data.params.system.usd_idr.value * (2040 - 2030 + 1) / (unit.retire_base - 2030);
check("V2 kompensasi ETP = valuasi dibagi rata tahun percepatan", Math.abs(etp.ext_rp - etpTotal) / etpTotal < 1e-6);

// Preset Results
fs.mkdirSync(__dirname + "/results", { recursive: true });
const summaryRows = [];
for (const [key, p] of Object.entries(presets)) {
  const res = m.run(data, p.sc);
  const keys = Object.keys(res.rows[0]);
  fs.writeFileSync(__dirname + "/results/preset_" + key + ".csv",
    [keys.join(",")].concat(res.rows.map((r) => keys.map((k) => r[k]).join(","))).join("\n"));
  summaryRows.push(Object.assign({ preset: key, label: p.label }, res.summary));
}
// Roadmap Components (PLTS atap saja dan pensiun dini saja)
const road = presets.roadmap.sc;
const split = m.splitComponents(data.params, road);
const parts = { roadmap_pv: split.pv, roadmap_retire: split.retire };
for (const [key, sc] of Object.entries(parts)) {
  summaryRows.push(Object.assign({ preset: key, label: key }, m.run(data, sc).summary));
}
for (const [key, p] of Object.entries(presets)) {
  const k = m.roadmapKpis(data, p.sc, m.run(data, p.sc));
  Object.assign(summaryRows.find((r) => r.preset === key), { kpi_retired_gw: k.retiredGw, kpi_pv_added_mwp: k.pvAdded,
    kpi_pv_target_2028: k.pvTarget2028, kpi_jetp_fund_rp: k.jetpFund });
}
// Candidate Ranking (dipensiunkan sendiri 2031, pendanaan roadmap)
const ranked = m.rankCandidates(data, road, 2031);
const ck = ["plant", "type", "mw", "age", "retireBase", "stateRp", "statePerGw", "extRp", "deathsYr", "workers", "etp"];
fs.writeFileSync(__dirname + "/results/candidates_2031.csv",
  [ck.join(",")].concat(ranked.map((r) => ck.map((k) => JSON.stringify(r[k])).join(","))).join("\n"));
check("V3 PLTU IPP lebih menguntungkan negara daripada PLTU PLN",
      Math.min(...ranked.filter((r) => r.type === "IPP").map((r) => r.statePerGw)) >
      Math.max(...ranked.filter((r) => r.type === "PLN").map((r) => r.statePerGw)));
const sk = Object.keys(summaryRows[0]);
fs.writeFileSync(__dirname + "/results/preset_summary.csv",
  [sk.join(",")].concat(summaryRows.map((r) => sk.map((k) => JSON.stringify(r[k])).join(","))).join("\n"));

console.log(failed === 0 ? "\nSemua uji lulus" : "\n" + failed + " uji gagal");
process.exit(failed === 0 ? 0 : 1);
