/* Sensitivitas: parameter kunci plus minus 20 persen -> neraca PLN dan negara kumulatif */
const fs = require("fs");
const m = require("../web/js/model.js");

const read = (f) => JSON.parse(fs.readFileSync(__dirname + "/../web/data/" + f));
const baseData = { params: read("parameters.json"), plants: read("plants.json"), provinces: read("provinces.json") };
const presets = m.makePresets(baseData);

// Parameters to Vary
const KEYS = [
  ["coal", "cap_charge_usd_kw_yr", "Pembayaran kapasitas IPP"],
  ["coal", "comp_etm_rp_mw_yr", "Kompensasi pensiun (ETM)"],
  ["coal", "replacement_usd_kw_yr", "Biaya pembangkit pengganti"],
  ["coal", "coal_price_usd_t", "Harga batu bara DMO"],
  ["pv", "payback_k", "Kepekaan adopsi terhadap balik modal"],
  ["pv", "trend_add_mwp_yr", "Tren tambahan PLTS atap"],
  ["system", "demand_growth", "Pertumbuhan beban"],
  ["system", "usd_idr", "Kurs"],
];

function withParam(group, key, factor) {
  const data = JSON.parse(JSON.stringify(baseData));
  data.params[group][key].value *= factor;
  return data;
}

function sweep(presetKey) {
  const sc = presets[presetKey].sc;
  const ref = m.run(baseData, sc).summary;
  const rows = [];
  for (const [group, key, label] of KEYS) {
    const low = m.run(withParam(group, key, 0.8), sc).summary;
    const high = m.run(withParam(group, key, 1.2), sc).summary;
    rows.push({ preset: presetKey, param: label, ref_pln: ref.pln_rp, low_pln: low.pln_rp, high_pln: high.pln_rp,
                ref_state: ref.state_rp, low_state: low.state_rp, high_state: high.state_rp });
  }
  return rows;
}

const all = sweep("paket").concat(sweep("seimbang"));
const header = Object.keys(all[0]);
fs.mkdirSync(__dirname + "/results", { recursive: true });
fs.writeFileSync(__dirname + "/results/sensitivity.csv",
  [header.join(",")].concat(all.map((r) => header.map((k) => JSON.stringify(r[k])).join(","))).join("\n"));

for (const r of all) {
  const t = (x) => (x / 1e12).toFixed(1);
  console.log(r.preset.padEnd(9), r.param.padEnd(38), "PLN", t(r.low_pln), "|", t(r.ref_pln), "|", t(r.high_pln),
              "  negara", t(r.low_state), "|", t(r.ref_state), "|", t(r.high_state));
}
