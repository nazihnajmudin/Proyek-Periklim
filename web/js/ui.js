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
  p.set("i", Math.round(sc.industryIncentive * 100));
  p.set("y", sc.pvFrom);
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
  sc.industryIncentive = Number(p.get("i") || 0) / 100;
  sc.pvFrom = Number(p.get("y") || base.pvFrom);
  sc.compMode = ["etp", "etm", "pln"].includes(p.get("c")) ? p.get("c") : "etm";
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
  set("incentive", Math.round(sc.industryIncentive * 100), Math.round(sc.industryIncentive * 100) + "%");
  set("pvfrom", sc.pvFrom, String(sc.pvFrom));
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

// Roadmap Indicators

function renderRoadmap(data, sc, result) {
  /* indikator laporan kelompok (Tabel 5.6) -> tabel capaian skenario */
  const k = roadmapKpis(data, sc, result);
  const cell = (level, text) => '<td><span class="status ' + level + '">' +
    { ok: "Tercapai", mid: "Sebagian", no: "Belum", info: "Informasi" }[level] + "</span><br>" + text + "</td>";
  const ratio = k.retiredGw > 0 ? k.pvAdded / 1000 / k.retiredGw : null;
  const rows = [
    ["PLTS atap setara daya PLTU yang dipensiunkan",
     ratio === null ? "info" : ratio >= 1 ? "ok" : ratio >= 0.5 ? "mid" : "no",
     "Tambahan PLTS atap 2040 " + fmtNum(k.pvAdded / 1000, 2) + " GWp, PLTU pensiun dini " + fmtNum(k.retiredGw, 2) + " GW" +
     (ratio === null ? "" : " (" + fmtPct(ratio, 0) + ")")],
    ["PLTS atap Jawa-Bali 2028",
     k.pv2028 >= k.pvTarget2028 ? "ok" : k.pv2028 >= 0.8 * k.pvTarget2028 ? "mid" : "no",
     fmtNum(k.pv2028, 0) + " MWp, kuota Jawa-Madura-Bali hingga 2028: " + fmtNum(k.pvTarget2028, 0) + " MWp"],
    ["PLTU pensiun dini hingga 2040",
     k.retiredGw >= k.retireTarget ? "ok" : k.retiredGw > 0 ? "mid" : "no",
     fmtNum(k.retiredGw, 2) + " GW di Jawa-Bali, target JETP nasional " + fmtNum(k.retireTarget, 1) + " GW"],
    ["Pembangkit pengganti siap sebelum penutupan",
     k.replacementMw === 0 ? "ok" : "info",
     k.replacementMw === 0 ? "Tidak dibutuhkan" : fmtNum(k.replacementMw, 0) + " MW harus beroperasi sebelum PLTU ditutup"],
    ["Keseimbangan fiskal negara",
     result.summary.state_rp >= 0 ? "ok" : result.summary.state_rp + result.summary.health_saved_rp >= 0 ? "mid" : "no",
     "Neraca negara " + fmtRp(result.summary.state_rp) + ", kenaikan BPP maksimum " + fmtNum(Math.max(k.bppMax, 0), 1) + " Rp/kWh"],
    ["Dana luar dibanding alokasi JETP",
     k.extFund === 0 ? "info" : k.extFund <= k.jetpFund ? "ok" : "no",
     "Kebutuhan " + fmtRp(k.extFund) + ", alokasi pensiun dini CIPP JETP sekitar " + fmtRp(k.jetpFund) + " (nasional, cakupan perlu dicek)"],
    ["Pekerja terdampak tercakup program",
     k.workers === 0 ? "info" : "mid",
     fmtNum(k.workers, 0) + " pekerja PLTU perlu pelatihan ulang atau perlindungan sosial sebelum penutupan. " +
     fmtNum(k.pvJobs, 0) + " job-year PLTS atap tambahan"],
    ["Kematian dini dihindari", k.deaths > 0 ? "ok" : "info", fmtNum(k.deaths, 0) + " jiwa kumulatif 2026-2040"],
  ];
  let html = '<table class="criteria"><tr><th>Indikator</th><th>Capaian skenario</th></tr>' +
    rows.map((r) => "<tr><td>" + r[0] + "</td>" + cell(r[1], r[2]) + "</tr>").join("") + "</table>";

  // Phase Summary
  html += '<h3>Ringkasan per fase roadmap</h3><table class="criteria"><tr><th>Fase</th><th>Tahun</th><th>PLTS atap akhir fase</th>' +
    "<th>PLTU pensiun dini</th><th>Neraca negara</th><th>Dana luar</th><th>Kematian dini dihindari</th><th>CO2 dihindari</th></tr>";
  for (const ph of [1, 2, 3, 4]) {
    const rows = result.rows.filter((r) => r.phase === ph);
    if (rows.length === 0) continue;
    const last = rows[rows.length - 1];
    const sum = (key) => rows.reduce((a, r) => a + r[key], 0);
    const state = sum("state_rp");
    html += "<tr><td>" + PHASES[ph] + "</td><td>" + rows[0].year + "-" + last.year + "</td><td>" +
      fmtNum(last.pv_mwp, 0) + " MWp</td><td>" + fmtNum(last.retired_mw, 0) + " MW</td><td>" + fmtSigned(fmtRp(state), state) +
      "</td><td>" + fmtRp(sum("ext_rp")) + "</td><td>" + fmtNum(sum("deaths_avoided"), 0) + "</td><td>" +
      fmtNum(sum("co2_avoided_t") / 1e6, 1) + " Mt</td></tr>";
  }
  document.getElementById("roadmap").innerHTML = html + "</table>";
}

// Candidate Table

function renderCandidates(data, sc, year, onAdd) {
  /* daftar urut kandidat pensiun dini untuk tahap penetapan kandidat roadmap */
  const rows = rankCandidates(data, sc, year);
  let html = '<table class="criteria"><tr><th>#</th><th>PLTU</th><th>Pemilik</th><th>MW</th><th>Usia</th><th>Pensiun baseline</th>' +
    "<th>Neraca negara</th><th>Per GW</th><th>Dana luar</th><th>Kematian/tahun</th><th>Pekerja</th><th></th></tr>";
  rows.forEach((r, i) => {
    const chosen = data.plants.some((u) => u.plant === r.plant && sc.retire[u.id]);
    html += "<tr><td>" + (i + 1) + "</td><td><b>" + r.plant + "</b>" + (r.etp ? ' <span class="tag">ETP</span>' : "") +
      "</td><td>" + r.type + "</td><td>" + fmtNum(r.mw, 0) + "</td><td>" + r.age + "</td><td>" + r.retireBase + "</td><td>" +
      fmtSigned(fmtRp(r.stateRp), r.stateRp) + "</td><td>" + fmtSigned(fmtRp(r.statePerGw), r.statePerGw) + "</td><td>" +
      fmtRp(r.extRp) + "</td><td>" + fmtNum(r.deathsYr, 0) + "</td><td>" + fmtNum(r.workers, 0) + "</td><td>" +
      (chosen ? "dipilih" : '<button data-plant="' + r.plant + '">Tambah</button>') + "</td></tr>";
  });
  const box = document.getElementById("candidates");
  box.innerHTML = html + "</table>" +
    '<p class="hint">Kematian/tahun adalah beban kesehatan unit saat beroperasi. ETP menandai PLTU yang masuk kajian Energy Transition Partnership.</p>';
  for (const btn of box.querySelectorAll("button[data-plant]")) btn.onclick = () => onAdd(btn.dataset.plant, year);
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
