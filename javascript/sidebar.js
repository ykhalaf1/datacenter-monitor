function buildCompanyList(filtered) {
  const src = filtered || DATA;
  const counts = {};
  src.forEach((d) => {
    counts[d.operator] = (counts[d.operator] || 0) + 1;
  });
  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  const el = document.getElementById("company-list");
  el.innerHTML = "";
  if (!sorted.length) {
    el.innerHTML =
      '<div style="font-family:var(--mono);font-size:11px;color:var(--muted);padding:8px 0">No operators for current filter</div>';
    return;
  }
  const max = sorted[0][1];
  const titleEl = document.getElementById("operator-panel-title");
  if (titleEl) {
    const isAll = activeStatuses.has("all");
    const labels = isAll ? [] : [...activeStatuses];
    titleEl.textContent = labels.length
      ? `Operator(s) — ${labels.join(", ")}`
      : "Operator(s)";
  }
  sorted.forEach(([op, n]) => {
    const row = document.createElement("div");
    row.className = "company-row";
    row.innerHTML = `<div class="company-dot" style="background:${getColor(
      op
    )}"></div>
        <span class="company-name">${
          op.length > 22 ? op.slice(0, 22) + "…" : op
        }</span>
        <div class="cbar-wrap"><div class="cbar" style="width:${
          (n / max) * 100
        }%;background:${getColor(op)}"></div></div>
        <span class="company-count">${n}</span>`;
    row.onclick = () => {
      document.getElementById("f-op").value = op;
      document.querySelectorAll(".company-row").forEach((r) =>
        r.classList.remove("active")
      );
      row.classList.add("active");
      filterRender();
    };
    el.appendChild(row);
  });
}

function buildStateBars(filtered) {
  const src = filtered || DATA;
  const mws = {};
  src.forEach((d) => {
    mws[d.state] = (mws[d.state] || 0) + d.capacity_mw;
  });
  const top = Object.entries(mws)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  if (!top.length) {
    document.getElementById("state-bars").innerHTML =
      '<div style="font-family:var(--mono);font-size:11px;color:var(--muted);padding:8px 0">No data for current filter</div>';
    return;
  }
  const max = top[0][1];
  document.getElementById("state-bars").innerHTML = top
    .map(
      ([st, mw]) =>
        `<div class="mbar-row">
        <div class="mbar-label"><span>${st}</span><span>${(mw / 1000).toFixed(
          2
        )} GW</span></div>
        <div class="mbar-track"><div class="mbar-fill" style="width:${
          (mw / max) * 100
        }%;background:var(--accent);opacity:${0.35 + 0.65 * (mw / max)}"></div></div>
      </div>`
    )
    .join("");
}
