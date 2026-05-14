function buildFilters() {
  const states = [...new Set(DATA.map((d) => d.state))].sort();
  const ops = [...new Set(DATA.map((d) => d.operator))].sort();
  const types = [...new Set(DATA.map((d) => d.type))].sort();

  const sf = document.getElementById("f-state");
  const of_ = document.getElementById("f-op");
  const tf = document.getElementById("f-type");

  states.forEach((s) => (sf.innerHTML += `<option value="${s}">${s}</option>`));
  ops.forEach((o) => (of_.innerHTML += `<option value="${o}">${o}</option>`));
  types.forEach((t) => (tf.innerHTML += `<option value="${t}">${t}</option>`));
}

function envScore(d) {
  // Water: 0 Mgal/yr → 0pts, 10000+ Mgal/yr → 35pts
  // Log-scaled and now the dominant factor
  const wVal = d.water_mgal || 0;
  const waterScore =
    wVal > 0
      ? Math.min(Math.log10(wVal + 1) / Math.log10(10001), 1) * 35
      : 0;

  // Capacity: 0 MW → 0pts, 10000+ MW → 30pts
  // Log-scaled and 2nd biggest factor
  const mwScore =
    Math.min(
      Math.log10((d.capacity_mw || 1) + 1) / Math.log10(10001),
      1
    ) * 30;

  // Renewable: 0% → 20pts, 100% → 0pts
  const renewScore =
    (1 - (d.renewable_pct || 0) / 100) * 20;

  // PUE: 1.0 → 0pts, 2.0+ → 15pts
  // Least weighted factor
  const pueVal = d.pue || 1.5;
  const pueScore =
    Math.min((pueVal - 1.0) / 1.0, 1) * 15;

  return waterScore + mwScore + renewScore + pueScore;
}

function envLabel(score) {
  if (score < 20)
    return { label: "VERY LOW", cls: "env-vlow" };

  if (score < 40)
    return { label: "LOW", cls: "env-low" };

  if (score < 60)
    return { label: "MEDIUM", cls: "env-med" };

  if (score < 78)
    return { label: "HIGH", cls: "env-high" };

  return { label: "VERY HIGH", cls: "env-vhigh" };
}