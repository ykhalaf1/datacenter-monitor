function render() {
  const data = getFiltered();
  const total = data.length;
  const pages = Math.ceil(total / PER) || 1;
  if (page > pages) page = pages;
  const slice = data.slice((page - 1) * PER, page * PER);
  document.getElementById("row-count").textContent = `${total} projects`;
  document.getElementById("pinfo").textContent = `Page ${page} of ${pages}`;
  document.getElementById("pbtn").disabled = page <= 1;
  document.getElementById("nbtn").disabled = page >= pages;
  const tb = document.getElementById("tbody");
  tb.innerHTML = "";
  const colSpan = 14;
  slice.forEach((d) => {
    const bc = BADGE_CLASS[d.status] || "b-planned";
    const pueC = d.pue
      ? d.pue < 1.25
        ? "pue-g"
        : d.pue < 1.45
          ? "pue-w"
          : "pue-b"
      : "";
    const mw =
      d.capacity_mw >= 1000
        ? (d.capacity_mw / 1000).toFixed(1) + "K"
        : d.capacity_mw;

    const tr = document.createElement("tr");
    tr.style.cursor = "pointer";
    const ei = envLabel(envScore(d));
    tr.innerHTML = `
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;color:var(--text)">
          <span class="expand-arrow">▶</span>${d.name}
        </td>
        <td><span class="env-badge ${ei.cls}">${ei.label}</span></td>
        <td style="color:${getColor(
          d.operator
        )};max-width:140px;overflow:hidden;text-overflow:ellipsis">${
      d.operator
    }</td>
        <td style="color:var(--muted2)">${d.city}</td>
        <td>${d.state}</td>
        <td style="text-align:right;font-weight:500">${mw}</td>
        <td style="text-align:right;color:var(--accent2)">${
          d.water_mgal ? d.water_mgal.toLocaleString() : "—"
        }</td>
        <td class="invest" style="text-align:right">$${d.investment_bn}B</td>
        <td><span class="badge ${bc}">${d.status}</span></td>
        <td><span style="font-size:11px;color:var(--muted2)">${d.type}</span></td>
        <td style="color:var(--muted2)">${d.est_online}</td>
        <td class="${pueC}" style="text-align:right">${
      d.pue ? d.pue.toFixed(2) : "—"
    }</td>
        <td style="text-align:right">${
          d.renewable_pct ? d.renewable_pct + "%" : "—"
        }</td>
        <td style="font-size:11px;color:var(--purple);max-width:130px;overflow:hidden;text-overflow:ellipsis">${
          d.initiative || "—"
        }</td>`;

    const detailTr = document.createElement("tr");
    detailTr.className = "detail-row";
    detailTr.style.display = "none";
    detailTr.innerHTML = `<td colspan="${colSpan}">
        <div class="detail-inner">
          <div class="detail-field">
            <span class="detail-label">Initiative</span>
            <span class="detail-value" style="color:var(--purple)">${
              d.initiative || "—"
            }</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Est. Online</span>
            <span class="detail-value">${d.est_online}</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Renewable Energy</span>
            <span class="detail-value" style="color:var(--accent)">${
              d.renewable_pct ? d.renewable_pct + "%" : "—"
            }</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Power Usage (PUE)</span>
            <span class="detail-value ${pueC}">${
      d.pue ? d.pue.toFixed(2) : "—"
    }</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Water Usage</span>
            <span class="detail-value" style="color:var(--accent2)">${
              d.water_mgal
                ? d.water_mgal.toLocaleString() + " Mgal/yr"
                : "—"
            }</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Capacity</span>
            <span class="detail-value">${mw} MW</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Investment</span>
            <span class="detail-value" style="color:var(--danger)">$${
              d.investment_bn
            }B</span>
          </div>
          <div class="detail-field">
            <span class="detail-label">Environmental Impact</span>
            <span class="detail-value"><span class="env-badge ${
              envLabel(envScore(d)).cls
            }">${envLabel(envScore(d)).label}</span>
            <span style="font-size:10px;color:var(--muted);margin-left:6px">score: ${envScore(
              d
            ).toFixed(0)}/100</span></span>
          </div>
          ${
            d.notes
              ? `<div class="detail-notes">${d.notes}</div>`
              : ""
          }
        </div>
      </td>`;

    tr.addEventListener("click", () => {
      const isOpen = tr.classList.contains("expanded");
      tr.classList.toggle("expanded", !isOpen);
      detailTr.style.display = isOpen ? "none" : "table-row";
    });

    tb.appendChild(tr);
    tb.appendChild(detailTr);
  });
  updateMap(data);
  buildStateBars(data);
  buildCompanyList(data);
  updateStats(data);
}

function filterRender() {
  page = 1;
  render();
}

document.querySelectorAll("th[data-col]").forEach((th) => {
  th.addEventListener("click", () => {
    const c = th.dataset.col;
    if (sortCol === c) sortDir *= -1;
    else {
      sortCol = c;
      sortDir = -1;
    }
    document.querySelectorAll("th").forEach((t) => t.classList.remove("sorted"));
    th.classList.add("sorted");
    render();
  });
});
["search", "f-state", "f-op", "f-type"].forEach((id) =>
  document.getElementById(id).addEventListener("input", filterRender)
);

document.querySelectorAll(".sfilter").forEach((btn) => {
  btn.addEventListener("click", () => {
    const s = btn.dataset.status;
    if (s === "all") {
      activeStatuses = new Set(["all"]);
      document.querySelectorAll(".sfilter").forEach((b) => b.classList.remove("on"));
      btn.classList.add("on");
    } else {
      activeStatuses.delete("all");
      document.querySelector(".sfilter.s-all").classList.remove("on");
      if (activeStatuses.has(s)) {
        activeStatuses.delete(s);
        btn.classList.remove("on");
      } else {
        activeStatuses.add(s);
        btn.classList.add("on");
      }
      if (activeStatuses.size === 0) {
        activeStatuses.add("all");
        document.querySelector(".sfilter.s-all").classList.add("on");
      }
    }
    filterRender();
  });
});
