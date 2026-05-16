function updateStats(filtered) {
  const all = DATA;
  document.getElementById("s-total").textContent = all.length;
  document.getElementById("s-states-sub").textContent = `across ${
    [...new Set(all.map((d) => d.state))].length
  } states`;
  document.getElementById("s-op").textContent = all.filter(
    (d) => d.status === "Operational"
  ).length;
  document.getElementById("s-con").textContent = all.filter(
    (d) => d.status === "Under Construction"
  ).length;

  const src = filtered || all;
  const filteredGW = (src.reduce((s, d) => s + d.capacity_mw, 0) / 1000).toFixed(1);
  const filteredInvest = Math.round(src.reduce((s, d) => s + d.investment_bn, 0));
  const filteredWater = Math.round(
    src.reduce((s, d) => s + (d.water_mgal || 0), 0)
  );
  document.getElementById("s-mw").textContent = filteredGW + "K";
  const investDisplay = filteredInvest >= 1000
    ? '$' + (filteredInvest / 1000).toFixed(2).replace(/\.?0+$/, '') + 'T'
    : '$' + filteredInvest + 'B';
  document.getElementById('s-invest').textContent = investDisplay;
  document.getElementById("s-water").textContent =
    filteredWater >= 1000
      ? (filteredWater / 1000).toFixed(1) + "K"
      : filteredWater;

  const isAll = activeStatuses.has("all");
  const labels = isAll ? [] : [...activeStatuses];
  const filterLabel = labels.length ? labels.join(" + ") : null;
  document.getElementById("s-mw-sub").textContent = filterLabel
    ? `GW across: ${filterLabel}`
    : "GW planned/operational";
  document.getElementById("s-invest-sub").textContent = filterLabel
    ? `$B committed: ${filterLabel}`
    : "USD committed";
  document.getElementById("s-water-sub").textContent = filterLabel
    ? `Mgal/yr: ${filterLabel}`
    : "Mgal / year (filtered)";
}
