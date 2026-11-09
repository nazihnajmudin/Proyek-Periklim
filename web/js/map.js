/* Peta: Leaflet -> PLTU, choropleth PLTS atap per provinsi, lapisan tambahan */

const MapView = {
  map: null,
  plantMarkers: [],
  provinceLayer: null,
  pvoutLayer: null,
  healthLayer: null,
  provinceMax: 1,
};

// Color Scales

// nama token CSS, warna nyata dibaca lewat resolveColor
const PV_COLORS = [0, 1, 2, 3, 4, 5].map((i) => "var(--pv-" + i + ")");
const PVOUT_COLORS = [0, 1, 2, 3, 4].map((i) => "var(--pvout-" + i + ")");

function pickColor(colors, value, max) {
  const i = Math.min(colors.length - 1, Math.floor((value / max) * colors.length));
  return resolveColor(colors[Math.max(0, i)]);
}

// Plant Grouping

function groupPlants(plants) {
  /* unit -> satu titik per PLTU */
  const groups = {};
  for (const u of plants) {
    if (!groups[u.plant]) {
      groups[u.plant] = { name: u.plant, lat: u.lat, lon: u.lon, province: u.province,
                          units: [], mw: 0, deaths: 0, co2: 0 };
    }
    const g = groups[u.plant];
    g.units.push(u);
    g.mw += u.mw;
    g.deaths += u.deaths_yr;
    g.co2 += u.co2_mt;
  }
  return Object.values(groups).sort((a, b) => b.mw - a.mw);
}

function plantStatus(group, result, year) {
  /* status PLTU pada tahun tertentu: MW beroperasi, pensiun dini, pensiun normal */
  let on = 0, early = 0, normal = 0;
  for (const u of group.units) {
    const yScn = result.units[u.id];
    if (year < yScn) on += u.mw;
    else if (yScn < u.retire_base && year < u.retire_base) early += u.mw;
    else normal += u.mw;
  }
  return { on: on, early: early, normal: normal };
}

// Initialization

function initMap(data, onPlantClick) {
  const map = L.map("map", { zoomSnap: 0.25 }).setView([-7.3, 110.6], 7);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | ' +
                 'PLTU: Global Energy Monitor (CC BY 4.0) | Batas: geoBoundaries | Surya: Global Solar Atlas',
    maxZoom: 12,
    className: "basemap",
  }).addTo(map);
  MapView.map = map;

  // Province Choropleth
  MapView.provinceLayer = L.geoJSON(data.provincesGeo, {
    style: { color: resolveColor("var(--map-edge)"), weight: 1, fillOpacity: 0.75, fillColor: resolveColor(PV_COLORS[0]) },
  }).addTo(map);

  // Rooftop Solar Potential
  MapView.pvoutLayer = L.geoJSON(data.regenciesGeo, {
    style: (f) => ({ color: resolveColor("var(--color-paper-3)"), weight: 0.4, fillOpacity: 0.75,
                     fillColor: pickColor(PVOUT_COLORS, f.properties.pvout - 1200, 300) }),
    onEachFeature: (f, layer) => layer.bindTooltip(
      f.properties.name + ": " + fmtNum(f.properties.pvout, 0) + " kWh/kWp/tahun"),
  });

  // Health Impact Circles
  MapView.healthLayer = L.layerGroup();

  // Plant Markers
  data.groups = groupPlants(data.plants);
  for (const g of data.groups) {
    const marker = L.circleMarker([g.lat, g.lon], { radius: 6, weight: 2, color: resolveColor("var(--color-paper-3)"), fillOpacity: 0.95 });
    marker.on("click", () => onPlantClick(g, marker));
    marker.addTo(map);
    MapView.plantMarkers.push({ group: g, marker: marker });

    const circle = L.circle([g.lat, g.lon], { radius: Math.sqrt(g.deaths) * 1400, color: resolveColor("var(--map-health)"),
                                              weight: 1, fillOpacity: 0.15 });
    circle.bindTooltip(g.name + ": sekitar " + fmtNum(g.deaths, 0) + " kematian dini per tahun");
    MapView.healthLayer.addLayer(circle);
  }

  addLegend(map);
  return map;
}

function addLegend(map) {
  const legend = L.control({ position: "bottomleft" });
  legend.onAdd = () => {
    const div = L.DomUtil.create("div", "legend");
    div.innerHTML =
      "<b>PLTU</b><br>" +
      '<i style="background:var(--map-coal)"></i>Beroperasi<br>' +
      '<i style="background:var(--map-early)"></i>Pensiun dini (skenario)<br>' +
      '<i style="background:var(--map-off)"></i>Pensiun sesuai baseline<br>' +
      "<b>PLTS atap per provinsi</b><br>" +
      PV_COLORS.map((c) => '<i class="sq" style="background:' + c + '"></i>').join("") +
      '<br><span id="legend-pv"></span>';
    return div;
  };
  legend.addTo(map);
}

// Update

function updateMap(data, result, year) {
  const yi = year - result.years[0];
  const caps = provinceCapacity(data, result, yi);
  const capsEnd = provinceCapacity(data, result, result.years.length - 1);
  const max = Math.max(...Object.values(capsEnd), 1);

  MapView.provinceLayer.eachLayer((layer) => {
    const id = layer.feature.properties.id;
    const value = caps[id] || 0;
    layer.setStyle({ fillColor: pickColor(PV_COLORS, value, max) });
    layer.bindTooltip(layer.feature.properties.name + ": " + fmtNum(value, 0) + " MWp PLTS atap (" + year + ")");
  });
  const legendPv = document.getElementById("legend-pv");
  if (legendPv) legendPv.textContent = "0 sampai " + fmtNum(max, 0) + " MWp (2040)";

  for (const item of MapView.plantMarkers) {
    const s = plantStatus(item.group, result, year);
    let color = "var(--map-coal)";
    if (s.early > 0) color = "var(--map-early)";
    else if (s.on === 0) color = "var(--map-off)";
    const shown = s.on > 0 ? s.on : item.group.mw;
    item.marker.setStyle({ fillColor: resolveColor(color), fillOpacity: s.on === 0 && s.early === 0 ? 0.6 : 0.95 });
    item.marker.setRadius(4 + Math.sqrt(shown) / 5);
  }
}

function resolveColor(cssVar) {
  // Leaflet butuh warna nyata, bukan var() CSS
  const name = cssVar.slice(4, -1);
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function plantPopup(group, result, year, retireMap) {
  /* isi popup PLTU */
  const s = plantStatus(group, result, year);
  const first = group.units[0];
  const minStart = Math.min(...group.units.map((u) => u.start));
  const baseYears = [...new Set(group.units.map((u) => u.retire_base))].sort().join(", ");
  const selected = group.units.some((u) => retireMap[u.id]);
  return '<div class="popup"><h3>PLTU ' + group.name + "</h3><table>" +
    "<tr><td>Pemilik</td><td>" + first.owner + " (" + first.type + ")</td></tr>" +
    "<tr><td>Kapasitas</td><td>" + fmtNum(group.mw, 0) + " MW, " + group.units.length + " unit</td></tr>" +
    "<tr><td>Mulai operasi</td><td>" + minStart + "</td></tr>" +
    "<tr><td>Pensiun baseline</td><td>" + baseYears + "</td></tr>" +
    "<tr><td>Emisi</td><td>" + fmtNum(group.co2, 1) + " juta tCO2/tahun</td></tr>" +
    "<tr><td>Kematian dini</td><td>sekitar " + fmtNum(group.deaths, 0) + " per tahun</td></tr>" +
    "<tr><td>Status " + year + "</td><td>" + fmtNum(s.on, 0) + " MW beroperasi</td></tr>" +
    "</table><button type=\"button\" data-toggle-plant=\"" + group.name + "\">" +
    (selected ? "Batalkan pensiun dini" : "Pensiunkan dini") + "</button></div>";
}

function setLayer(name, visible) {
  const layer = name === "pvout" ? MapView.pvoutLayer : MapView.healthLayer;
  if (visible) layer.addTo(MapView.map);
  else MapView.map.removeLayer(layer);
  if (name === "pvout" && visible) layer.bringToBack();
}
