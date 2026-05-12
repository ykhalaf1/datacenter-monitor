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
  const renewScore = (1 - (d.renewable_pct || 0) / 100) * 30;
  const pueVal = d.pue || 1.5;
  const pueScore = Math.min((pueVal - 1.0) / 1.0, 1) * 25;
  const mwScore =
    Math.min(Math.log10((d.capacity_mw || 1) + 1) / Math.log10(5001), 1) * 20;
  const wVal = d.water_mgal || 0;
  const waterScore =
    wVal > 0
      ? Math.min(Math.log10(wVal + 1) / Math.log10(5001), 1) * 25
      : 0;
  return renewScore + pueScore + mwScore + waterScore;
}

function envLabel(score) {
  if (score < 20) return { label: "Very Low", cls: "env-vlow" };
  if (score < 40) return { label: "Low", cls: "env-low" };
  if (score < 60) return { label: "Medium", cls: "env-med" };
  if (score < 78) return { label: "High", cls: "env-high" };
  return { label: "Very High", cls: "env-vhigh" };
}
