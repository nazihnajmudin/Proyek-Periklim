/* Model PowerShift: paket kebijakan -> neraca tahunan 2026-2040 vs baseline phase down */

const YEARS = [];
for (let y = 2026; y <= 2040; y++) YEARS.push(y);

const SEGMENTS = ["rt", "bisnis", "industri", "pemerintah", "program"];

// Parameter Helpers

function val(params, group, key) {
  return params[group][key].value;
}

function segInfo(params, seg) {
  return params.pv.segments[seg].value;
}

// Coal Plant Costs

function varCost(params, unit) {
  // Rp/kWh = harga batu bara per kcal x heat rate + biaya variabel lain
  const price = val(params, "coal", "coal_price_usd_t") * val(params, "system", "usd_idr");
  const perKcal = price / (val(params, "coal", "coal_kcal_kg") * 1000);
  return perKcal * unit.heat_rate_kcal_kwh + val(params, "coal", "vom_rp_kwh");
}

function fleetAverages(params, plants) {
  /* armada -> biaya marjinal, faktor emisi, dan kematian per GWh rata-rata tertimbang energi */
  let gen = 0, cost = 0, co2 = 0;
  for (const u of plants) {
    gen += u.gen_gwh;
    cost += u.gen_gwh * varCost(params, u);
    co2 += u.co2_mt * 1e6;
  }
  const deathsPerGwh = val(params, "health", "deaths_per_gw_yr") / (0.64 * 8760);
  return {
    cMarg: cost / gen,                 // Rp/kWh
    efMarg: co2 / (gen * 1000),        // tCO2/MWh
    deathsPerGwh: deathsPerGwh,
  };
}

// Rooftop Solar Economics

function avgYield(params, provinces) {
  /* PVOUT rata-rata tertimbang penjualan listrik PLN (kWh/kWp/tahun) */
  let sum = 0, sales = 0;
  for (const p of provinces) {
    sum += p.pvout * p.sales_gwh;
    sales += p.sales_gwh;
  }
  return sum / sales;
}

function payback(params, seg, yieldKwh, exportShare, discount) {
  /* tahun balik modal per kWp, discount = insentif fiskal terhadap harga */
  const s = segInfo(params, seg);
  const saving = yieldKwh * (s.self * s.tariff + (1 - s.self) * exportShare * s.tariff);
  return s.price * (1 - (discount || 0)) / saving;
}

function marketShare(params, pb) {
  return Math.exp(-val(params, "pv", "payback_k") * pb);
}

function marketAdditions(params, sc, yieldKwh) {
  /* skenario -> tambahan MWp per tahun segmen pasar dalam jangka panjang */
  const trend = val(params, "pv", "trend_add_mwp_yr");
  const add = {};
  for (const seg of ["rt", "bisnis", "industri", "pemerintah"]) {
    const s = segInfo(params, seg);
    const discount = seg === "industri" ? sc.industryIncentive || 0 : 0;
    const ratio = marketShare(params, payback(params, seg, yieldKwh, sc.exportShare, discount)) /
                  marketShare(params, payback(params, seg, yieldKwh, 0));
    add[seg] = trend * s.split * ratio;
  }
  return add;
}

function policyFrom(sc) {
  return sc.pvFrom || YEARS[0];
}

function policyOn(sc, year) {
  /* kebijakan PLTS atap aktif pada tahun ini */
  return year >= policyFrom(sc);
}

function pvPath(params, sc, yieldKwh) {
  /* skenario -> tambahan dan kapasitas kumulatif per segmen per tahun */
  const start = val(params, "pv", "installed_national_mwp_2025") * val(params, "pv", "jb_share_pv");
  const ramp = val(params, "pv", "adoption_ramp_yr");
  const longRun = marketAdditions(params, sc, yieldKwh);
  const trend = marketAdditions(params, baselineScenario(params), yieldKwh);
  const programPrice = segInfo(params, "program").price * 1000;   // Rp/MWp
  const budgetMax = sc.programShare * val(params, "subsidy", "subsidy_rp_2026") *
                    val(params, "subsidy", "jb_share_subsidy");

  const cap = {}, adds = [], budgets = [];
  for (const seg of SEGMENTS) cap[seg] = [];
  const k = {};
  for (const seg of SEGMENTS) k[seg] = start * segInfo(params, seg).split;

  YEARS.forEach((year, i) => {
    // respons pasar naik bertahap sampai penuh sejak kebijakan berlaku
    const on = policyOn(sc, year);
    const w = on ? Math.min(1, (year - policyFrom(sc) + 1) / ramp) : 0;
    const add = {};
    for (const seg of ["rt", "bisnis", "industri", "pemerintah"]) {
      add[seg] = trend[seg] + (longRun[seg] - trend[seg]) * w;
    }
    add.pemerintah += on ? sc.govMw : 0;
    add.program = on ? budgetMax / programPrice : 0;

    // Quota Cap
    const total = SEGMENTS.reduce((a, s) => a + add[s], 0);
    if (total > sc.quotaMw) {
      for (const s of SEGMENTS) add[s] *= sc.quotaMw / total;
    }
    for (const s of SEGMENTS) {
      k[s] += add[s];
      cap[s].push(k[s]);
    }
    adds.push(add);
    budgets.push(add.program * programPrice);   // anggaran terpakai setelah kuota
  });
  return { cap: cap, adds: adds, budgets: budgets };
}

// Scenario Defaults

function baselineScenario(params) {
  return {
    retire: {},
    exportShare: 0,
    quotaMw: val(params, "pv", "quota_mw_yr"),
    programShare: 0,
    govMw: 0,
    industryIncentive: 0,
    pvFrom: YEARS[0],
    fund: { ext: 0, apbn: 0, pln: 1 },
    compMode: "etm",
  };
}

function retireYear(unit, sc) {
  /* tahun pensiun unit di skenario, tidak boleh lewat baseline */
  const y = sc.retire[unit.id];
  return y ? Math.min(y, unit.retire_base) : unit.retire_base;
}

// Presets

function makePresets(data) {
  const base = baselineScenario(data.params);
  const pick = (plant, units) => data.plants.filter((u) => u.plant === plant && (!units || units.includes(u.unit))).map((u) => u.id);
  const plan = (list) => {
    const out = {};
    for (const [ids, year] of list) for (const id of ids) out[id] = year;
    return out;
  };
  const cirebon1 = pick("Cirebon", ["Unit 1"]);
  const tjb = pick("Tanjung Jati B", ["Unit 1", "Unit 2"]);
  const cilacap = pick("Cilacap Sumber", ["Phase I Unit 1", "Phase I Unit 2"]);
  const celukan = pick("Celukan Bawang");
  // Fase 2: wajib PLTS atap gedung pemerintah dan BUMN, insentif fiskal industri
  const pvRoadmap = { govMw: 200, industryIncentive: 0.15, pvFrom: 2028 };
  const fund = { ext: 0.8, apbn: 0, pln: 0.2 };

  return {
    baseline: {
      label: "Phase down PPA (pembanding)",
      note: "Aturan sekarang: tanpa nilai ekspor PLTS atap, PLTU pensiun di akhir PPA atau umur desain.",
      sc: Object.assign({}, base),
    },
    fase2: {
      label: "Roadmap Fase 1-2: percontohan",
      note: "Cirebon-1 pensiun 2030. Mulai 2028 PLTS atap wajib di gedung pemerintah dan BUMN 200 MW/tahun, insentif fiskal industri 15% harga. 80% kompensasi dari dana luar.",
      sc: Object.assign({}, base, pvRoadmap, { retire: plan([[cirebon1, 2030]]), fund: fund }),
    },
    roadmap: {
      label: "Roadmap lengkap Fase 1-3",
      note: "Fase 2 ditambah Fase 3: Tanjung Jati B 1-2 pensiun 2031, Cilacap Phase I 1-2 pensiun 2033, Celukan Bawang 1-3 pensiun 2035. Total 3,0 GW PLTU IPP, tambahan PLTS atap setara daya yang dipensiunkan.",
      sc: Object.assign({}, base, pvRoadmap, { retire: plan([[cirebon1, 2030], [tjb, 2031], [cilacap, 2033], [celukan, 2035]]), fund: fund }),
    },
    seimbang: {
      label: "Roadmap varian fiskal seimbang",
      note: "Cirebon-1 2030, Tanjung Jati B 1-2 2031, Cilacap Phase I 1-2 2033 (2,58 GW IPP). PLTS atap gedung pemerintah dan BUMN 100 MW/tahun sejak 2028 tanpa insentif industri. 80% kompensasi dari dana luar.",
      sc: Object.assign({}, base, { govMw: 100, pvFrom: 2028 },
                        { retire: plan([[cirebon1, 2030], [tjb, 2031], [cilacap, 2033]]), fund: fund }),
    },
  };
}

// Main Model

function run(data, sc) {
  const params = data.params;
  const plants = data.plants;
  const base = baselineScenario(params);
  const fleet = fleetAverages(params, plants);
  const yieldKwh = avgYield(params, data.provinces);

  const usd = val(params, "system", "usd_idr");
  const bpp = val(params, "system", "bpp_rp_kwh");
  const g = val(params, "system", "demand_growth");
  const passThrough = val(params, "system", "pass_through");
  const capCharge = val(params, "coal", "cap_charge_usd_kw_yr") * 1000 * usd;   // Rp/MW/tahun
  const fixedOm = val(params, "coal", "fixed_om_usd_kw_yr") * 1000 * usd;
  const bookValue = val(params, "coal", "book_value_usd_mw_2022") * usd;
  const compRate = sc.compMode === "pln" ? val(params, "coal", "comp_pln_rp_mw_yr")
                                         : val(params, "coal", "comp_etm_rp_mw_yr");
  // valuasi ETP dibagi rata ke tahun percepatan
  const etpComp = (u, span) => sc.compMode === "etp" && u.etp_valuation_musd ? u.etp_valuation_musd * 1e6 * usd / span : null;
  const workersPerMw = val(params, "coal", "workers_per_mw");
  const replacement = val(params, "coal", "replacement_usd_kw_yr") * 1000 * usd;
  const rmTarget = val(params, "system", "rm_threshold");
  const planFrom = val(params, "system", "plan_from_year");
  const deathsPerGwh = fleet.deathsPerGwh;
  const usdPerDeath = val(params, "health", "usd_per_death");

  const pvScn = pvPath(params, sc, yieldKwh);
  const pvBase = pvPath(params, base, yieldKwh);

  // System Capacity
  const peak0 = val(params, "system", "peak_mw_2024") * (1 + g);
  const cap0 = peak0 * (1 + val(params, "system", "reserve_margin_2025"));
  const sales0 = val(params, "system", "sales_national_twh_2025") * val(params, "system", "jb_share_sales") * 1e6; // MWh

  const out = { years: YEARS.slice(), rows: [], units: {}, fleet: fleet, yieldKwh: yieldKwh,
                pvAdd: pvScn.adds[YEARS.length - 1], pvAddBase: pvBase.adds[YEARS.length - 1] };
  let capBase = cap0;
  let retiredBefore = 0;

  YEARS.forEach((year, i) => {
    const peak = peak0 * Math.pow(1 + g, year - 2025);
    const sales = sales0 * Math.pow(1 + g, year - 2025);

    // Rooftop Solar Energy (MWh)
    const exportShare = policyOn(sc, year) ? sc.exportShare : 0;
    let dSelfRevenue = 0, exportCost = 0, dEnergy = 0, subsidySaved = 0, billSaving = 0, govSaving = 0;
    let pvMwScn = 0, pvMwBase = 0;
    for (const seg of SEGMENTS) {
      const s = segInfo(params, seg);
      const eScn = pvScn.cap[seg][i] * yieldKwh;      // MWh, karena MW x kWh/kWp
      const eBase = pvBase.cap[seg][i] * yieldKwh;
      const dE = eScn - eBase;
      pvMwScn += pvScn.cap[seg][i];
      pvMwBase += pvBase.cap[seg][i];
      dEnergy += dE;
      const revenuePerKwh = seg === "program" ? bpp : s.tariff;   // PLN menerima tarif + subsidi
      dSelfRevenue += dE * s.self * revenuePerKwh * 1000;
      exportCost += eScn * (1 - s.self) * exportShare * s.tariff * 1000;
      const saving = dE * s.self * s.tariff * 1000 + (eScn - eBase) * (1 - s.self) * exportShare * s.tariff * 1000;
      billSaving += saving;
      if (seg === "program") subsidySaved += dE * s.self * (bpp - s.tariff) * 1000;
      if (seg === "pemerintah") govSaving += saving;   // tagihan gedung pemerintah dibayar APBN
    }

    // Coal Retirement
    let retiredMwBase = 0, acceleratedMw = 0, eRet = 0, varRet = 0, co2Ret = 0, deathsRet = 0;
    let capSaved = 0, omSaved = 0, comp = 0, workers = 0;
    for (const u of plants) {
      const yBase = u.retire_base;
      const yScn = retireYear(u, sc);
      if (yBase <= year) retiredMwBase += u.mw;
      const accelerated = yScn <= year && year < yBase;
      if (!accelerated) continue;

      acceleratedMw += u.mw;
      const eUnit = u.gen_gwh * 1000;                 // MWh
      eRet += eUnit;
      varRet += eUnit * varCost(params, u) * 1000;
      co2Ret += u.co2_mt * 1e6;
      deathsRet += u.deaths_yr;
      if (u.type === "IPP") {
        capSaved += capCharge * u.mw;
        const etp = etpComp(u, yBase - yScn);
        comp += etp !== null ? etp : compRate * u.mw;
      } else {
        omSaved += fixedOm * u.mw;
        // penyusutan per tahun = nilai buku hilang, kecuali ada angka ETP
        const etp = etpComp(u, yBase - yScn);
        comp += etp !== null ? etp : bookValue * u.mw / (yBase - 2022);
      }
      if (year === yScn) workers += u.mw * workersPerMw;
    }

    // Energy Balance
    const shiftToFleet = eRet - dEnergy;                // MWh
    const energySaved = varRet - shiftToFleet * fleet.cMarg * 1000;
    const co2Avoided = co2Ret - shiftToFleet * fleet.efMarg;
    const deathsAvoided = deathsRet - (shiftToFleet / 1000) * deathsPerGwh;

    // Ledgers (Rp)
    const compPln = comp * sc.fund.pln;
    const compApbn = comp * sc.fund.apbn;
    const compExt = comp * sc.fund.ext;
    const programBudget = pvScn.budgets[i];
    const govCapex = (pvScn.adds[i].pemerintah - pvBase.adds[i].pemerintah) * segInfo(params, "pemerintah").price * 1000;
    const incentive = policyOn(sc, year) ? sc.industryIncentive || 0 : 0;
    const incentiveCost = incentive * pvScn.adds[i].industri * segInfo(params, "industri").price * 1000;
    // Reliability
    const newRetired = retiredMwBase - retiredBefore;
    retiredBefore = retiredMwBase;
    capBase = capBase - newRetired;
    if (year < planFrom) capBase += val(params, "system", "firm_add_mw_early");
    else capBase = Math.max(capBase, (1 + rmTarget) * peak);
    const capScn = capBase - acceleratedMw;
    const needBase = Math.max(0, (1 + rmTarget) * peak - capBase);
    const needScn = Math.max(0, (1 + rmTarget) * peak - capScn);
    const replacementMw = needScn - needBase;
    const replacementCost = replacementMw * replacement;

    const pln = -dSelfRevenue - exportCost + energySaved + capSaved + omSaved - compPln - replacementCost;
    const apbnOwn = -compApbn - programBudget + subsidySaved + govSaving - govCapex - incentiveCost;
    const apbn = passThrough * pln + apbnOwn;
    const state = pln + apbnOwn;

    out.rows.push({
      year: year,
      pv_mwp: pvMwScn,
      pv_mwp_base: pvMwBase,
      pv_energy_gwh: dEnergy / 1000,
      pln_rp: pln,
      apbn_rp: apbn,
      state_rp: state,
      ext_rp: compExt,
      revenue_lost_rp: -dSelfRevenue,
      export_cost_rp: -exportCost,
      energy_saved_rp: energySaved,
      capacity_saved_rp: capSaved + omSaved,
      comp_pln_rp: -compPln,
      replacement_rp: -replacementCost,
      replacement_mw: replacementMw,
      comp_apbn_rp: -compApbn,
      program_budget_rp: -programBudget,
      subsidy_saved_rp: subsidySaved,
      gov_saving_rp: govSaving,
      gov_capex_rp: -govCapex,
      incentive_rp: -incentiveCost,
      phase: phaseOf(year),
      bill_saving_rp: billSaving,
      bpp_delta_rp_kwh: -pln / (sales * 1000),
      retired_mw: acceleratedMw,
      retired_energy_gwh: eRet / 1000,
      rm_base: capBase / peak - 1,
      rm_scn: capScn / peak - 1,
      peak_mw: peak,
      pv_day_share: pvMwScn * val(params, "pv", "daytime_factor") / peak,
      co2_avoided_t: co2Avoided,
      deaths_avoided: deathsAvoided,
      health_saved_rp: deathsAvoided * usdPerDeath * usd,
      workers_affected: workers,
      pv_jobs: SEGMENTS.reduce((a, s) => a + pvScn.adds[i][s] - pvBase.adds[i][s], 0) * val(params, "pv", "jobs_per_mw"),
    });
  });

  for (const u of plants) out.units[u.id] = retireYear(u, sc);
  out.summary = summarize(out.rows, val(params, "system", "discount_rate"));
  return out;
}

function summarize(rows, rate) {
  /* baris tahunan -> angka ringkas kumulatif */
  const sum = (k) => rows.reduce((a, r) => a + r[k], 0);
  const npv = (k) => rows.reduce((a, r, i) => a + r[k] / Math.pow(1 + rate, i + 1), 0);
  return {
    pln_rp: sum("pln_rp"),
    pln_npv_rp: npv("pln_rp"),
    apbn_rp: sum("apbn_rp"),
    state_rp: sum("state_rp"),
    ext_rp: sum("ext_rp"),
    co2_avoided_t: sum("co2_avoided_t"),
    deaths_avoided: sum("deaths_avoided"),
    health_saved_rp: sum("health_saved_rp"),
    workers_affected: sum("workers_affected"),
    pv_jobs: sum("pv_jobs"),
    bill_saving_rp: sum("bill_saving_rp"),
    pv_energy_gwh: sum("pv_energy_gwh"),
    retired_energy_gwh: sum("retired_energy_gwh"),
    pv_mwp_2028: rows.find((r) => r.year === 2028).pv_mwp,
    pv_mwp_2040: rows[rows.length - 1].pv_mwp,
    rm_min: Math.min(...rows.map((r) => r.rm_scn)),
    rm_min_base: Math.min(...rows.map((r) => r.rm_base)),
    bpp_delta_max: Math.max(...rows.map((r) => r.bpp_delta_rp_kwh)),
    retired_mw_max: Math.max(...rows.map((r) => r.retired_mw)),
    replacement_mw_max: Math.max(...rows.map((r) => r.replacement_mw)),
  };
}

// Roadmap Phases

function phaseOf(year) {
  /* fase roadmap laporan kelompok */
  if (year <= 2027) return 1;
  if (year <= 2030) return 2;
  if (year <= 2035) return 3;
  return 4;
}

const PHASES = {
  1: "Fase 1: harmonisasi regulasi dan pembenahan jaringan",
  2: "Fase 2: pensiun dini percontohan dan akselerasi PLTS atap",
  3: "Fase 3: transisi skala besar dan integrasi BESS",
  4: "Fase 4: sistem energi bersih mandiri",
};

function roadmapKpis(data, sc, result) {
  /* hasil skenario -> indikator roadmap laporan kelompok */
  const p = data.params;
  const s = result.summary;
  const usd = val(p, "system", "usd_idr");
  const retiredGw = data.plants.filter((u) => sc.retire[u.id] && sc.retire[u.id] < u.retire_base)
                                .reduce((a, u) => a + u.mw, 0) / 1000;
  return {
    pvTarget2028: val(p, "kpi", "pv_target_jb_mwp_2028"),
    pv2028: s.pv_mwp_2028,
    pvAdded: s.pv_mwp_2040 - result.rows[result.rows.length - 1].pv_mwp_base,
    retiredGw: retiredGw,
    retireTarget: val(p, "kpi", "retire_target_gw_2040"),
    substitution: s.retired_energy_gwh > 0 ? s.pv_energy_gwh / s.retired_energy_gwh : null,
    replacementMw: s.replacement_mw_max,
    extFund: s.ext_rp,
    jetpFund: val(p, "kpi", "jetp_retire_fund_usd") * usd,
    workers: s.workers_affected,
    pvJobs: s.pv_jobs,
    deaths: s.deaths_avoided,
    co2: s.co2_avoided_t,
    bppMax: s.bpp_delta_max,
  };
}

// Scenario Analysis

function splitComponents(params, sc) {
  /* skenario -> komponen PLTS atap saja dan komponen pensiun dini saja */
  const pv = JSON.parse(JSON.stringify(sc));
  pv.retire = {};
  const retire = Object.assign(baselineScenario(params), { retire: sc.retire, fund: sc.fund, compMode: sc.compMode });
  return { pv: pv, retire: retire };
}

const SENSITIVITY_KEYS = [
  ["coal", "cap_charge_usd_kw_yr", "Pembayaran kapasitas IPP"],
  ["coal", "comp_etm_rp_mw_yr", "Kompensasi pensiun (ETM)"],
  ["coal", "replacement_usd_kw_yr", "Biaya pembangkit pengganti"],
  ["coal", "coal_price_usd_t", "Harga batu bara DMO"],
  ["pv", "payback_k", "Kepekaan adopsi terhadap balik modal"],
  ["pv", "trend_add_mwp_yr", "Tren tambahan PLTS atap"],
  ["system", "demand_growth", "Pertumbuhan beban"],
  ["system", "usd_idr", "Kurs"],
];

function sensitivity(data, sc) {
  /* parameter kunci +-20 persen -> neraca PLN dan negara kumulatif */
  const ref = run(data, sc).summary;
  const withParam = (group, key, factor) => {
    const params = JSON.parse(JSON.stringify(data.params));
    params[group][key].value *= factor;
    return Object.assign({}, data, { params: params });
  };
  return SENSITIVITY_KEYS.map(([group, key, label]) => {
    const low = run(withParam(group, key, 0.8), sc).summary;
    const high = run(withParam(group, key, 1.2), sc).summary;
    return { param: label, ref_pln: ref.pln_rp, low_pln: low.pln_rp, high_pln: high.pln_rp,
             ref_state: ref.state_rp, low_state: low.state_rp, high_state: high.state_rp };
  });
}

// Candidate Screening

function rankCandidates(data, sc, year) {
  /* tiap PLTU dipensiunkan sendiri pada tahun tertentu -> dampak per GW, urut dari yang paling menguntungkan negara */
  const base = baselineScenario(data.params);
  const groups = {};
  for (const u of data.plants) (groups[u.plant] = groups[u.plant] || []).push(u);
  const ref = run(data, Object.assign({}, base, { fund: sc.fund, compMode: sc.compMode })).summary;
  const out = [];
  for (const [name, units] of Object.entries(groups)) {
    const chosen = units.filter((u) => u.retire_base > year + 1);
    if (chosen.length === 0) continue;
    const retire = {};
    for (const u of chosen) retire[u.id] = year;
    const s = run(data, Object.assign({}, base, { retire: retire, fund: sc.fund, compMode: sc.compMode })).summary;
    const mw = chosen.reduce((a, u) => a + u.mw, 0);
    out.push({
      plant: name,
      type: chosen[0].type,
      units: chosen.map((u) => u.unit),
      mw: mw,
      age: year - Math.min(...chosen.map((u) => u.start)),
      retireBase: Math.min(...chosen.map((u) => u.retire_base)),
      stateRp: s.state_rp - ref.state_rp,
      statePerGw: (s.state_rp - ref.state_rp) / (mw / 1000),
      extRp: s.ext_rp,
      deathsYr: chosen.reduce((a, u) => a + u.deaths_yr, 0),
      workers: s.workers_affected,
      etp: chosen.some((u) => u.etp_name),
    });
  }
  return out.sort((a, b) => b.statePerGw - a.statePerGw);
}

// Province Allocation

function provinceCapacity(data, result, yearIndex) {
  /* kapasitas PLTS atap skenario -> per provinsi menurut porsi penjualan listrik PLN */
  const total = result.rows[yearIndex].pv_mwp;
  const sales = data.provinces.reduce((a, p) => a + p.sales_gwh, 0);
  const out = {};
  for (const p of data.provinces) out[p.id] = total * p.sales_gwh / sales;
  return out;
}

if (typeof module !== "undefined") {
  module.exports = { run, baselineScenario, makePresets, roadmapKpis, rankCandidates, splitComponents, sensitivity, phaseOf, PHASES, provinceCapacity, payback, varCost, fleetAverages, avgYield, YEARS, SEGMENTS };
}
