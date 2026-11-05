/* Eksplorasi H3: kombinasi kebijakan -> neraca PLN dan negara */
const fs = require("fs");
const m = require("../web/js/model.js");

const read = (f) => JSON.parse(fs.readFileSync(__dirname + "/../web/data/" + f));
const data = { params: read("parameters.json"), plants: read("plants.json"), provinces: read("provinces.json") };
const base = m.baselineScenario(data.params);

// Retirement Sets
const ids = (plant, units) => data.plants.filter((u) => u.plant === plant && (!units || units.includes(u.unit))).map((u) => u.id);
const sets = {
  none: [],
  cirebon1: ids("Cirebon", ["Unit 1"]),
  cirebon1_ratu: ids("Cirebon", ["Unit 1"]).concat(ids("Pelabuhan Ratu")),
  ipp_old: ids("Paiton-1").concat(ids("Paiton-2"), ids("Tanjung Jati B", ["Unit 1", "Unit 2"]), ids("Cilacap Sumber", ["Phase I Unit 1", "Phase I Unit 2"])),
};

const rows = [];
for (const [setName, setIds] of Object.entries(sets)) {
  for (const year of [2030, 2035]) {
    for (const e of [0, 0.3, 0.65]) {
      for (const gov of [0, 100, 300]) {
        for (const prog of [0, 0.05, 0.1]) {
          for (const ext of [0.75, 1.0]) {
            const sc = JSON.parse(JSON.stringify(base));
            for (const id of setIds) sc.retire[id] = year;
            Object.assign(sc, { exportShare: e, quotaMw: 1500, govMw: gov, programShare: prog,
                                fund: { ext: ext, apbn: 0, pln: 1 - ext }, compMode: "etm" });
            const s = m.run(data, sc).summary;
            rows.push({ set: setName, year, e, gov, prog, ext, pln: s.pln_rp / 1e12, state: s.state_rp / 1e12,
                        ext_rp: s.ext_rp / 1e12, pv: s.pv_mwp_2040, co2: s.co2_avoided_t / 1e6, deaths: s.deaths_avoided,
                        health: s.health_saved_rp / 1e12 });
          }
        }
      }
    }
  }
}

const header = Object.keys(rows[0]);
fs.mkdirSync(__dirname + "/results", { recursive: true });
fs.writeFileSync(__dirname + "/results/explore_h3.csv",
  [header.join(",")].concat(rows.map((r) => header.map((k) => r[k]).join(","))).join("\n"));

// Best Packages
const fmt = (r) => [r.set, r.year, "e=" + r.e, "gov=" + r.gov, "prog=" + r.prog, "ext=" + r.ext,
  "PLN=" + r.pln.toFixed(1), "negara=" + r.state.toFixed(1), "PV=" + r.pv.toFixed(0), "CO2=" + r.co2.toFixed(0),
  "jiwa=" + r.deaths.toFixed(0), "kes=" + r.health.toFixed(1)].join(" ");
console.log("PLN >= 0, PLTS atap terbesar:");
rows.filter((r) => r.pln >= 0).sort((a, b) => b.pv - a.pv).slice(0, 5).forEach((r) => console.log(" ", fmt(r)));
console.log("Negara >= 0, PLTS atap terbesar:");
rows.filter((r) => r.state >= 0).sort((a, b) => b.pv - a.pv).slice(0, 5).forEach((r) => console.log(" ", fmt(r)));
console.log("Negara + kesehatan >= 0, PLTS atap terbesar:");
rows.filter((r) => r.state + r.health >= 0).sort((a, b) => b.pv - a.pv).slice(0, 5).forEach((r) => console.log(" ", fmt(r)));
console.log("Efek pensiun per set (e=0, gov=0, prog=0, ext=0.75, 2030):");
rows.filter((r) => r.e === 0 && r.gov === 0 && r.prog === 0 && r.ext === 0.75 && r.year === 2030).forEach((r) => console.log(" ", fmt(r)));
