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
const manual = JSON.parse(fs.readFileSync(__dirname + "/results/cirebon1_manual.json"));
const paket = m.run(data, presets.paket.sc);
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
const c1 = presets.retireonly.sc.retire;
const id = Object.keys(c1)[0];
const r2035 = m.run(data, scenario({ retire: { [id]: 2035 }, fund: { ext: 0.75, apbn: 0, pln: 0.25 } })).summary;
const r2030 = m.run(data, scenario({ retire: { [id]: 2030 }, fund: { ext: 0.75, apbn: 0, pln: 0.25 } })).summary;
check("V3 pensiun lebih awal -> kematian dihindari naik", r2030.deaths_avoided > r2035.deaths_avoided);
const plnClaim = m.run(data, scenario({ retire: { [id]: 2035 }, fund: { ext: 0.75, apbn: 0, pln: 0.25 }, compMode: "pln" })).summary;
check("V3 kompensasi klaim PLN -> neraca PLN lebih buruk", plnClaim.pln_rp < r2035.pln_rp);
const quotaLow = m.run(data, Object.assign(JSON.parse(JSON.stringify(presets.pvonly.sc)), { quotaMw: 300 })).summary;
check("V3 kuota kecil membatasi PLTS atap", quotaLow.pv_mwp_2040 < m.run(data, presets.pvonly.sc).summary.pv_mwp_2040);

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
const sk = Object.keys(summaryRows[0]);
fs.writeFileSync(__dirname + "/results/preset_summary.csv",
  [sk.join(",")].concat(summaryRows.map((r) => sk.map((k) => JSON.stringify(r[k])).join(","))).join("\n"));

console.log(failed === 0 ? "\nSemua uji lulus" : "\n" + failed + " uji gagal");
process.exit(failed === 0 ? 0 : 1);
