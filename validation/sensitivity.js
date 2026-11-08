/* Sensitivitas: parameter kunci plus minus 20 persen -> neraca PLN dan negara kumulatif */
const fs = require("fs");
const m = require("../web/js/model.js");

const read = (f) => JSON.parse(fs.readFileSync(__dirname + "/../web/data/" + f));
const baseData = { params: read("parameters.json"), plants: read("plants.json"), provinces: read("provinces.json") };
const presets = m.makePresets(baseData);

function sweep(presetKey) {
  return m.sensitivity(baseData, presets[presetKey].sc).map((r) => Object.assign({ preset: presetKey }, r));
}

const all = sweep("roadmap").concat(sweep("seimbang"));
const header = Object.keys(all[0]);
fs.mkdirSync(__dirname + "/results", { recursive: true });
fs.writeFileSync(__dirname + "/results/sensitivity.csv",
  [header.join(",")].concat(all.map((r) => header.map((k) => JSON.stringify(r[k])).join(","))).join("\n"));

for (const r of all) {
  const t = (x) => (x / 1e12).toFixed(1);
  console.log(r.preset.padEnd(9), r.param.padEnd(38), "PLN", t(r.low_pln), "|", t(r.ref_pln), "|", t(r.high_pln),
              "  negara", t(r.low_state), "|", t(r.ref_state), "|", t(r.high_state));
}
