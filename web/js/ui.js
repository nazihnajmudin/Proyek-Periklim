/* Panel: preset, input kebijakan, URL, kartu angka, kriteria, CSV */

function cloneScenario(sc) {
  return JSON.parse(JSON.stringify(sc));
}

// URL State

function scenarioToUrl(sc) {
  const p = new URLSearchParams();
  const retire = Object.entries(sc.retire).map(([id, y]) => id + ":" + y).join(",");
  if (retire) p.set("r", retire);
  p.set("e", Math.round(sc.exportShare * 100));
  p.set("q", sc.quotaMw);
  p.set("g", sc.govMw);
  p.set("s", Math.round(sc.programShare * 100));
  p.set("c", sc.compMode);
  p.set("fe", Math.round(sc.fund.ext * 100));
  p.set("fa", Math.round(sc.fund.apbn * 100));
  return location.origin + location.pathname + "?" + p.toString();
}

function scenarioFromUrl(base) {
  const p = new URLSearchParams(location.search);
  if (!p.has("e")) return null;
  const sc = cloneScenario(base);
  sc.retire = {};
  if (p.get("r")) {
    for (const part of p.get("r").split(",")) {
      const [id, y] = part.split(":");
      sc.retire[id] = Number(y);
    }
  }
  sc.exportShare = Number(p.get("e")) / 100;
  sc.quotaMw = Number(p.get("q"));
  sc.govMw = Number(p.get("g"));
  sc.programShare = Number(p.get("s")) / 100;
  sc.compMode = p.get("c") === "pln" ? "pln" : "etm";
  const ext = Number(p.get("fe")) / 100;
  const apbn = Math.min(Number(p.get("fa")) / 100, 1 - ext);
  sc.fund = { ext: ext, apbn: apbn, pln: 1 - ext - apbn };
  return sc;
}

// Panel Rendering

function renderRetireList(data, sc, onChange) {
  /* daftar PLTU yang dipensiunkan dini + slider tahun */
  const list = document.getElementById("retire-list");
  list.innerHTML = "";
  const chosen = data.groups.filter((g) => g.units.some((u) => sc.retire[u.id]));
  if (chosen.length === 0) {
    list.innerHTML = '<p class="hint">Belum ada. Pilih dari daftar atau klik PLTU di peta.</p>';
  }
  for (const g of chosen) {
    const units = g.units.filter((u) => sc.retire[u.id]);
    const mw = units.reduce((a, u) => a + u.mw, 0);
    const maxYear = Math.max(...units.map((u) => u.retire_base));
    const year = Math.min(...units.map((u) => sc.retire[u.id]));
    const unitNames = units.length === g.units.length ? "semua unit" : units.map((u) => u.unit).join(", ");
    const item = document.createElement("div");
    item.className = "retire-item";
    item.innerHTML =
      '<div class="name"><span>' + g.name + " (" + fmtNum(mw, 0) + ' MW)</span><button title="Hapus">x</button></div>' +
      '<div class="meta">' + unitNames + "</div>" +
      '<label class="slider">Tahun pensiun <b>' + year + "</b>" +
      '<input type="range" min="2027" max="' + Math.min(maxYear, 2040) + '" step="1" value="' + year + '"></label>' +
      '<div class="meta">Baseline: ' + [...new Set(units.map((u) => u.retire_base))].join(", ") + "</div>";
    item.querySelector("button").onclick = () => {
      for (const u of units) delete sc.retire[u.id];
      onChange();
    };
    item.querySelector("input").oninput = (ev) => {
      for (const u of units) sc.retire[u.id] = Number(ev.target.value);
      item.querySelector("b").textContent = ev.target.value;
      onChange(true);
    };
    list.appendChild(item);
  }
}

function fillPlantSelect(data) {
  const select = document.getElementById("add-plant");
  for (const g of data.groups) {
    const opt = document.createElement("option");
    opt.value = g.name;
    opt.textContent = g.name + " (" + fmtNum(g.mw, 0) + " MW, " + g.units[0].type + ")";
    select.appendChild(opt);
  }
}

function syncControls(sc) {
  /* skenario -> nilai slider dan label */
  const set = (id, value, label) => {
    document.getElementById(id).value = value;
    document.getElementById("v-" + id.replace("fund-", "")).textContent = label;
  };
  set("export", Math.round(sc.exportShare * 100), Math.round(sc.exportShare * 100) + "%");
  set("quota", sc.quotaMw, fmtNum(sc.quotaMw, 0));
  set("gov", sc.govMw, fmtNum(sc.govMw, 0));
  set("program", Math.round(sc.programShare * 100), Math.round(sc.programShare * 100) + "%");
  set("fund-ext", Math.round(sc.fund.ext * 100), Math.round(sc.fund.ext * 100) + "%");
  set("fund-apbn", Math.round(sc.fund.apbn * 100), Math.round(sc.fund.apbn * 100) + "%");
  document.getElementById("v-pln").textContent = Math.round(sc.fund.pln * 100) + "%";
  for (const r of document.querySelectorAll('input[name="comp"]')) r.checked = r.value === sc.compMode;
}

// KPI Cards

function renderKpis(result, baseResult) {
  const s = result.summary;
  const card = (label, value, sub, tone) =>
    '<div class="kpi ' + (tone || "") + '"><div class="label">' + label + '</div><div class="value">' + value +
    '</div><div class="sub">' + sub + "</div></div>";
  const tone = (x) => (x > 1e9 ? "good" : x < -1e9 ? "bad" : "");
  document.getElementById("kpis").innerHTML =
    card("Neraca PLN", fmtSigned(fmtRp(s.pln_rp), s.pln_rp), "kumulatif 2026-2040 vs baseline", tone(s.pln_rp)) +
    card("Neraca negara", fmtSigned(fmtRp(s.state_rp), s.state_rp), "PLN + APBN, tanpa dana luar", tone(s.state_rp)) +
    card("Dana luar", fmtRp(s.ext_rp), "kompensasi dari ETM/JETP", "") +
    card("Hemat tagihan pelanggan", fmtRp(s.bill_saving_rp), "pindah dari PLN ke pemilik PLTS atap", "") +
    card("CO2 dihindari", fmtNum(s.co2_avoided_t / 1e6, 1) + " Mt", "kumulatif 2026-2040", s.co2_avoided_t > 0 ? "good" : "") +
    card("Kematian dini dihindari", fmtNum(s.deaths_avoided, 0), "setara " + fmtRp(s.health_saved_rp), s.deaths_avoided > 0 ? "good" : "") +
    card("PLTS atap 2040", fmtNum(s.pv_mwp_2040 / 1000, 1) + " GWp", "baseline " + fmtNum(baseResult.summary.pv_mwp_2040 / 1000, 1) + " GWp", "") +
    card("Pembangkit pengganti", fmtNum(s.replacement_mw_max, 0) + " MW",
         "agar cadangan tetap " + fmtPct(0.33, 0) + ", biaya sudah dihitung", s.replacement_mw_max > 0 ? "bad" : "");
}

// Permen 10/2025 Criteria

function statusCell(level, text) {
  const label = { ok: "Terpenuhi", mid: "Sebagian", no: "Belum", info: "Informasi" }[level];
  return '<td><span class="status ' + level + '">' + label + "</span></td><td>" + text + "</td>";
}

function renderCriteria(data, sc, result) {
  const box = document.getElementById("criteria");
  const chosen = data.groups.filter((g) => g.units.some((u) => sc.retire[u.id]));
  if (chosen.length === 0) {
    box.innerHTML = '<p class="hint">Pilih minimal satu PLTU untuk pensiun dini agar kriteria bisa dinilai.</p>';
    return;
  }
  const s = result.summary;
  const fleetEf = result.fleet.efMarg;
  const cell = (level, text) => '<td><span class="status ' + level + '">' +
    { ok: "Terpenuhi", mid: "Sebagian", no: "Belum", info: "Informasi" }[level] + "</span><br>" + text + "</td>";

  // Plant Criteria
  let html = "<h3>Kriteria per PLTU (Pasal 11 ayat 1, butir 1-4)</h3>" +
    '<table class="criteria"><tr><th>PLTU</th><th>1. Kapasitas</th><th>2. Usia</th><th>3. Utilisasi</th><th>4. Emisi GRK</th></tr>';
  for (const g of chosen) {
    const units = g.units.filter((u) => sc.retire[u.id]);
    const mw = units.reduce((a, u) => a + u.mw, 0);
    const age = 2026 - Math.min(...units.map((u) => u.start));
    const ef = units.reduce((a, u) => a + u.co2_mt * 1e6, 0) / units.reduce((a, u) => a + u.gen_gwh * 1000, 0);
    const ageText = age >= 15 ? age + " tahun pada 2026" : age + " tahun, sisa umur panjang (alasan pembatalan Cirebon-1)";
    html += "<tr><td><b>" + g.name + "</b><br>" + units.map((u) => u.unit).join(", ") + "</td>" +
      cell("info", fmtNum(mw, 0) + " MW") +
      cell(age >= 15 ? "ok" : "mid", ageText) +
      cell("info", "Faktor kapasitas " + fmtPct(units[0].cf, 0) + " (asumsi GEM)") +
      cell(ef >= fleetEf ? "ok" : "mid", fmtNum(ef, 2) + " tCO2/MWh, rata-rata armada " + fmtNum(fleetEf, 2)) + "</tr>";
  }
  html += "</table>";

  // Package Criteria
  const econ = s.state_rp + s.health_saved_rp;
  const rows = [
    ["5. Nilai tambah ekonomi", s.state_rp > 0 ? "ok" : econ > 0 ? "mid" : "no",
     "Neraca negara " + fmtRp(s.state_rp) + ". Dengan nilai kesehatan: " + fmtRp(econ)],
    ["6. Dukungan pendanaan", sc.fund.ext >= 0.5 ? "ok" : sc.fund.ext > 0 ? "mid" : "no",
     fmtPct(sc.fund.ext, 0) + " kompensasi dari dana luar (" + fmtRp(s.ext_rp) + ")"],
    ["7. Dukungan teknologi", "info", "Pengganti energi berupa PLTS atap yang sudah tersedia di dalam negeri"],
    ["Keandalan sistem", s.replacement_mw_max === 0 ? "ok" : "mid",
     s.replacement_mw_max === 0 ? "Tidak butuh pembangkit pengganti" :
     "Butuh " + fmtNum(s.replacement_mw_max, 0) + " MW pembangkit pengganti (biaya sudah dihitung). Tanpa pengganti, cadangan minimum " + fmtPct(s.rm_min)],
    ["Dampak BPP ke tarif", s.bpp_delta_max <= 0 ? "ok" : s.bpp_delta_max <= 10 ? "mid" : "no",
     "Kenaikan BPP maksimum " + fmtNum(Math.max(s.bpp_delta_max, 0), 1) + " Rp/kWh"],
    ["Transisi berkeadilan", s.workers_affected === 0 ? "info" : s.pv_jobs >= s.workers_affected ? "mid" : "no",
     fmtNum(s.workers_affected, 0) + " pekerja PLTU terdampak, " + fmtNum(s.pv_jobs, 0) +
     " job-year PLTS atap tambahan. Butuh program alih keterampilan"],
  ];
  html += "<h3>Kriteria tingkat paket (butir 5-7 dan ayat 2)</h3>" +
    '<table class="criteria"><tr><th>Kriteria</th><th>Penilaian</th></tr>' +
    rows.map((r) => "<tr><td>" + r[0] + "</td>" + cell(r[1], r[2]) + "</tr>").join("") + "</table>";
  box.innerHTML = html;
}

// CSV Export

function downloadCsv(result) {
  const keys = Object.keys(result.rows[0]);
  const lines = [keys.join(",")].concat(result.rows.map((r) => keys.map((k) => r[k]).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "powershift-hasil.csv";
  link.click();
}
