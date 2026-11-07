/* Aplikasi: muat data -> skenario -> model -> tampilan */

const App = {
  data: null,
  scenario: null,
  presets: null,
  result: null,
  baseResult: null,
  year: 2026,
  ledger: "pln",
  tab: "roadmap",
  timer: null,
};

async function loadJson(path) {
  const res = await fetch(path);
  return res.json();
}

async function loadData() {
  const [params, plants, provinces, provincesGeo, regenciesGeo] = await Promise.all([
    loadJson("data/parameters.json"),
    loadJson("data/plants.json"),
    loadJson("data/provinces.json"),
    loadJson("data/provinces.geojson"),
    loadJson("data/regencies.geojson"),
  ]);
  return { params, plants, provinces, provincesGeo, regenciesGeo };
}

// Render Cycle

function recompute(light) {
  App.result = run(App.data, App.scenario);
  renderKpis(App.result, App.baseResult);
  updateMap(App.data, App.result, App.year);
  updateCharts(App.result, App.ledger, App.data.params, App.data.params.system.rm_threshold.value);
  renderCriteria(App.data, App.scenario, App.result);
  renderRoadmap(App.data, App.scenario, App.result);
  if (App.tab === "kandidat") showCandidates();
  if (!light) renderRetireList(App.data, App.scenario, recompute);
  syncControls(App.scenario);
}

function applyPreset(key) {
  App.scenario = cloneScenario(App.presets[key].sc);
  document.getElementById("preset").value = key;
  document.getElementById("preset-note").textContent = App.presets[key].note;
  recompute();
}

function markCustom() {
  document.getElementById("preset-note").textContent = "Skenario disesuaikan.";
}

// Candidate Screening

function showCandidates() {
  const year = Number(document.getElementById("cand-year").value);
  renderCandidates(App.data, App.scenario, year, (plant, y) => {
    for (const u of App.data.plants) {
      if (u.plant === plant && u.retire_base > y + 1) App.scenario.retire[u.id] = y;
    }
    markCustom();
    recompute();
  });
}

// Plant Selection

function togglePlant(group) {
  const selected = group.units.some((u) => App.scenario.retire[u.id]);
  for (const u of group.units) {
    if (selected) delete App.scenario.retire[u.id];
    else App.scenario.retire[u.id] = Math.max(2027, Math.min(u.retire_base, 2035));
  }
  markCustom();
  recompute();
}

function onPlantClick(group, marker) {
  marker.bindPopup(plantPopup(group, App.result, App.year, App.scenario.retire)).openPopup();
  const button = marker.getPopup().getElement().querySelector("button");
  button.onclick = () => {
    togglePlant(group);
    marker.closePopup();
  };
}

// Controls

function bindControls() {
  const presetSelect = document.getElementById("preset");
  for (const [key, p] of Object.entries(App.presets)) {
    const opt = document.createElement("option");
    opt.value = key;
    opt.textContent = p.label;
    presetSelect.appendChild(opt);
  }
  presetSelect.onchange = () => applyPreset(presetSelect.value);

  const slide = (id, apply) => {
    document.getElementById(id).oninput = (ev) => {
      apply(Number(ev.target.value));
      markCustom();
      recompute(true);
    };
  };
  slide("export", (v) => (App.scenario.exportShare = v / 100));
  slide("quota", (v) => (App.scenario.quotaMw = v));
  slide("gov", (v) => (App.scenario.govMw = v));
  slide("program", (v) => (App.scenario.programShare = v / 100));
  slide("incentive", (v) => (App.scenario.industryIncentive = v / 100));
  slide("pvfrom", (v) => (App.scenario.pvFrom = v));
  slide("fund-ext", (v) => {
    const f = App.scenario.fund;
    f.ext = v / 100;
    f.apbn = Math.min(f.apbn, 1 - f.ext);
    f.pln = 1 - f.ext - f.apbn;
  });
  slide("fund-apbn", (v) => {
    const f = App.scenario.fund;
    f.apbn = Math.min(v / 100, 1 - f.ext);
    f.pln = 1 - f.ext - f.apbn;
  });
  for (const r of document.querySelectorAll('input[name="comp"]')) {
    r.onchange = () => {
      App.scenario.compMode = r.value;
      markCustom();
      recompute(true);
    };
  }

  document.getElementById("add-plant").onchange = (ev) => {
    const group = App.data.groups.find((g) => g.name === ev.target.value);
    if (group && !group.units.some((u) => App.scenario.retire[u.id])) togglePlant(group);
    ev.target.value = "";
  };

  document.getElementById("reset").onclick = () => applyPreset("baseline");
  document.getElementById("share").onclick = () => {
    const url = scenarioToUrl(App.scenario);
    history.replaceState(null, "", url);
    const msg = document.getElementById("share-msg");
    navigator.clipboard.writeText(url).then(
      () => (msg.textContent = "Link skenario disalin."),
      () => (msg.textContent = "Salin link dari address bar."));
  };

  // Candidate Year
  const candYear = document.getElementById("cand-year");
  for (let y = 2028; y <= 2038; y++) candYear.add(new Option(String(y), String(y), y === 2031, y === 2031));
  candYear.onchange = showCandidates;

  // Year Slider
  const yearInput = document.getElementById("year");
  yearInput.oninput = () => setYear(Number(yearInput.value));
  document.getElementById("play").onclick = togglePlay;

  // Tabs and Toggles
  for (const btn of document.querySelectorAll(".tabs button")) {
    btn.onclick = () => {
      document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-body").forEach((b) => b.classList.add("hidden"));
      btn.classList.add("active");
      document.getElementById("tab-" + btn.dataset.tab).classList.remove("hidden");
      App.tab = btn.dataset.tab;
      if (App.tab === "kandidat") showCandidates();
    };
  }
  for (const btn of document.querySelectorAll("#ledger-toggle button")) {
    btn.onclick = () => {
      document.querySelectorAll("#ledger-toggle button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      App.ledger = btn.dataset.ledger;
      updateCharts(App.result, App.ledger, App.data.params, App.data.params.system.rm_threshold.value);
    };
  }
  for (const btn of document.querySelectorAll("[data-png]")) btn.onclick = () => downloadChart(btn.dataset.png);
  document.getElementById("csv").onclick = () => downloadCsv(App.result);
  document.getElementById("layer-pvout").onchange = (ev) => setLayer("pvout", ev.target.checked);
  document.getElementById("layer-health").onchange = (ev) => setLayer("health", ev.target.checked);
}

function setYear(year) {
  App.year = year;
  document.getElementById("year").value = year;
  document.getElementById("year-label").textContent = year;
  updateMap(App.data, App.result, year);
}

function togglePlay() {
  const btn = document.getElementById("play");
  if (App.timer) {
    clearInterval(App.timer);
    App.timer = null;
    btn.innerHTML = "&#9654;";
    return;
  }
  if (App.year >= 2040) setYear(2026);
  btn.innerHTML = "&#10074;&#10074;";
  App.timer = setInterval(() => {
    if (App.year >= 2040) return togglePlay();
    setYear(App.year + 1);
  }, 700);
}

// Startup

async function start() {
  App.data = await loadData();
  App.presets = makePresets(App.data);
  App.baseResult = run(App.data, App.presets.baseline.sc);
  initMap(App.data, onPlantClick);
  fillPlantSelect(App.data);
  initCharts();
  bindControls();

  const fromUrl = scenarioFromUrl(App.presets.baseline.sc);
  if (fromUrl) {
    App.scenario = fromUrl;
    document.getElementById("preset-note").textContent = "Skenario dari link.";
    recompute();
  } else {
    applyPreset("roadmap");
  }
}

start();
