/* Grafik: Chart.js -> neraca, keandalan, dampak */

const Charts = {};

// Palette Slots (dataviz reference palette, urutan tetap)
const COLORS = {
  revenue: "#2a78d6",
  export: "#eb6834",
  energy: "#1baf7a",
  capacity: "#eda100",
  retirement: "#e87ba4",
  pln: "#4a3aa7",
  compApbn: "#e34948",
  program: "#008300",
  net: "#0b0b0b",
  scn: "#2a78d6",
  base: "#4a3aa7",
  threshold: "#52514e",
  pv: "#1baf7a",
  coal: "#4a3aa7",
  single: "#2a78d6",
};
const SURFACE = "#ffffff";

function toT(x) {
  return x / 1e12;
}

// Chart Setup

function baseOptions(yTitle) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 250 },
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { position: "bottom", labels: { boxWidth: 12 } },
    },
    scales: {
      x: { stacked: true, grid: { display: false } },
      y: { stacked: true, title: { display: true, text: yTitle } },
    },
  };
}

function initCharts() {
  Charts.ledger = new Chart(document.getElementById("chart-ledger"), {
    type: "bar", data: { labels: [], datasets: [] }, options: baseOptions("Rp triliun per tahun"),
  });

  const rmOptions = baseOptions("Reserve margin (%)");
  rmOptions.scales.x.stacked = false;
  rmOptions.scales.y.stacked = false;
  Charts.rm = new Chart(document.getElementById("chart-rm"), {
    type: "line", data: { labels: [], datasets: [] }, options: rmOptions,
  });

  const energyOptions = baseOptions("GWh per tahun");
  energyOptions.scales.x.stacked = false;
  energyOptions.scales.y.stacked = false;
  Charts.energy = new Chart(document.getElementById("chart-energy"), {
    type: "bar", data: { labels: [], datasets: [] }, options: energyOptions,
  });

  const impactOptions = baseOptions("Juta tCO2 dihindari, kumulatif");
  impactOptions.scales.x.stacked = false;
  impactOptions.scales.y.stacked = false;
  impactOptions.plugins.legend.display = false;
  Charts.impact = new Chart(document.getElementById("chart-impact"), {
    type: "line", data: { labels: [], datasets: [] }, options: impactOptions,
  });

  const deathsOptions = baseOptions("Kematian dini dihindari, kumulatif");
  deathsOptions.scales.x.stacked = false;
  deathsOptions.scales.y.stacked = false;
  deathsOptions.plugins.legend.display = false;
  Charts.deaths = new Chart(document.getElementById("chart-deaths"), {
    type: "line", data: { labels: [], datasets: [] }, options: deathsOptions,
  });

  const jobsOptions = baseOptions("Orang / job-year per tahun");
  jobsOptions.scales.x.stacked = false;
  jobsOptions.scales.y.stacked = false;
  Charts.jobs = new Chart(document.getElementById("chart-jobs"), {
    type: "bar", data: { labels: [], datasets: [] }, options: jobsOptions,
  });
}

// Ledger Datasets

function ledgerDatasets(rows, ledger, passThrough) {
  /* komponen neraca sesuai sudut pandang PLN, APBN, atau negara */
  const bar = (label, color, fn) => ({
    type: "bar", label: label, backgroundColor: color, borderColor: SURFACE, borderWidth: 2,
    borderRadius: 2, stack: "s", data: rows.map((r) => toT(fn(r))),
  });
  const plnParts = [
    bar("Pendapatan PLN hilang", COLORS.revenue, (r) => r.revenue_lost_rp),
    bar("Kompensasi ekspor PLTS", COLORS.export, (r) => r.export_cost_rp),
    bar("Biaya energi dihemat", COLORS.energy, (r) => r.energy_saved_rp),
    bar("Biaya kapasitas PLTU dihemat", COLORS.capacity, (r) => r.capacity_saved_rp),
    bar("Kompensasi pensiun dan pembangkit pengganti", COLORS.retirement, (r) => r.comp_pln_rp + r.replacement_rp),
  ];
  const apbnOwn = [
    bar("Program PLTS atap pemerintah (bersih)", COLORS.program,
        (r) => r.subsidy_saved_rp + r.program_budget_rp + r.gov_saving_rp + r.gov_capex_rp),
    bar("Kompensasi pensiun (APBN)", COLORS.compApbn, (r) => r.comp_apbn_rp),
  ];

  let parts, netKey;
  if (ledger === "pln") {
    parts = plnParts; netKey = "pln_rp";
  } else if (ledger === "apbn") {
    parts = [bar("Penutupan selisih PLN", COLORS.pln, (r) => r.pln_rp * passThrough)].concat(apbnOwn);
    netKey = "apbn_rp";
  } else {
    parts = [bar("Neraca PLN", COLORS.pln, (r) => r.pln_rp)].concat(apbnOwn);
    netKey = "state_rp";
  }
  parts.push({
    type: "line", label: "Neraca bersih", borderColor: COLORS.net, backgroundColor: COLORS.net,
    borderWidth: 2, pointRadius: 3, stack: "net", data: rows.map((r) => toT(r[netKey])),
  });
  return parts;
}

// Update

function updateCharts(result, ledger, params, rmThreshold) {
  const labels = result.years;
  const rows = result.rows;

  Charts.ledger.data = { labels: labels, datasets: ledgerDatasets(rows, ledger, params.system.pass_through.value) };
  Charts.ledger.update();

  Charts.rm.data = {
    labels: labels,
    datasets: [
      { label: "Baseline", data: rows.map((r) => r.rm_base * 100), borderColor: COLORS.base, backgroundColor: COLORS.base,
        borderWidth: 2, pointRadius: 3 },
      { label: "Paket, sebelum pembangkit pengganti", data: rows.map((r) => r.rm_scn * 100), borderColor: COLORS.scn,
        backgroundColor: COLORS.scn, borderWidth: 2, pointRadius: 3 },
      { label: "Batas rekomendasi " + rmThreshold * 100 + "%", data: rows.map(() => rmThreshold * 100),
        borderColor: COLORS.threshold, borderDash: [6, 4], borderWidth: 1, pointRadius: 0 },
    ],
  };
  Charts.rm.update();

  Charts.energy.data = {
    labels: labels,
    datasets: [
      { label: "Tambahan energi PLTS atap vs baseline", data: rows.map((r) => r.pv_energy_gwh), backgroundColor: COLORS.pv, borderRadius: 2 },
      { label: "Energi PLTU yang pensiun dini", data: rows.map((r) => r.retired_energy_gwh), backgroundColor: COLORS.coal },
    ],
  };
  Charts.energy.update();

  let co2 = 0, deaths = 0;
  Charts.impact.data = {
    labels: labels,
    datasets: [{ label: "CO2 dihindari", data: rows.map((r) => (co2 += r.co2_avoided_t / 1e6)),
                 borderColor: COLORS.single, backgroundColor: COLORS.single, borderWidth: 2, pointRadius: 3 }],
  };
  Charts.impact.update();
  Charts.deaths.data = {
    labels: labels,
    datasets: [{ label: "Kematian dini dihindari", data: rows.map((r) => (deaths += r.deaths_avoided)),
                 borderColor: COLORS.single, backgroundColor: COLORS.single, borderWidth: 2, pointRadius: 3 }],
  };
  Charts.deaths.update();

  Charts.jobs.data = {
    labels: labels,
    datasets: [
      { label: "Pekerja PLTU terdampak (orang)", data: rows.map((r) => r.workers_affected), backgroundColor: COLORS.coal },
      { label: "Lapangan kerja PLTS atap tambahan (job-year)", data: rows.map((r) => r.pv_jobs), backgroundColor: COLORS.pv },
    ],
  };
  Charts.jobs.update();
}

function downloadChart(id) {
  const chart = Object.values(Charts).find((c) => c.canvas.id === id);
  const link = document.createElement("a");
  link.href = chart.toBase64Image("image/png", 1);
  link.download = "powershift-" + id + ".png";
  link.click();
}
