function buildCompanyList(filtered) {
  const src = filtered || DATA;
  const counts = {};
  src.forEach(d => { counts[d.operator] = (counts[d.operator]||0) + 1; });
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10);
  const el = document.getElementById('company-list');
  el.innerHTML = '';
  if (!sorted.length) {
    el.innerHTML = '<div style="font-family:var(--mono);font-size:11px;color:var(--muted);padding:8px 0">No operators for current filter</div>';
    return;
  }
  const max = sorted[0][1];
  // Update panel title to reflect active status filters
  const titleEl = document.getElementById('operator-panel-title');
  if (titleEl) {
    const isAll = activeStatuses.has('all');
    const labels = isAll ? [] : [...activeStatuses];
    titleEl.textContent = labels.length ? `Operator(s) — ${labels.join(', ')}` : 'Operator(s)';
  }
  sorted.forEach(([op, n]) => {
    const row = document.createElement('div');
    row.className = 'company-row';
    row.innerHTML = `<div class="company-dot" style="background:${getColor(op)}"></div>
      <span class="company-name">${op.length>22?op.slice(0,22)+'…':op}</span>
      <div class="cbar-wrap"><div class="cbar" style="width:${n/max*100}%;background:${getColor(op)}"></div></div>
      <span class="company-count">${n}</span>`;
    row.onclick = () => {
      document.getElementById('f-op').value = op;
      document.querySelectorAll('.company-row').forEach(r=>r.classList.remove('active'));
      row.classList.add('active');
      filterRender();
    };
    el.appendChild(row);
  });
}
 
// ── buildStateBars (js/sidebar.js continued) ──
// State bars metric modes: 0 = Capacity GW, 1 = Water Usage
const SBARS_MODES = [
  { key: 'capacity_mw',  label: 'Top States (Capacity GW)',        unit: v => (v/1000).toFixed(2)+' GW',    color: 'var(--accent)',  scale: 1000 },
  { key: 'water_mgal',   label: 'Top States (Water Usage Mgal/yr)', unit: v => v.toLocaleString()+' Mgal',  color: '#38b6e8',        scale: 1    },
];
let sBarsMode = 0;
let sBarsFiltered = null;
 
function cycleStateBars(dir) {
  sBarsMode = (sBarsMode + dir + SBARS_MODES.length) % SBARS_MODES.length;
  buildStateBars(sBarsFiltered);
}
 
function buildStateBars(filtered) {
  sBarsFiltered = filtered;
  const src = filtered || DATA;
  const mode = SBARS_MODES[sBarsMode];
  const totals = {};
  src.forEach(d => {
    if (d[mode.key]) totals[d.state] = (totals[d.state]||0) + d[mode.key];
  });
  const top = Object.entries(totals).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const titleEl = document.getElementById('state-bars-title');
  if (titleEl) titleEl.textContent = mode.label;
  if (!top.length) {
    document.getElementById('state-bars').innerHTML = '<div style="font-family:var(--mono);font-size:11px;color:var(--muted);padding:8px 0">No data for current filter</div>';
    return;
  }
  const max = top[0][1];
  document.getElementById('state-bars').innerHTML = top.map(([st,val]) =>
    `<div class="mbar-row">
      <div class="mbar-label"><span>${st}</span><span>${mode.unit(val)}</span></div>
      <div class="mbar-track"><div class="mbar-fill" style="width:${val/max*100}%;background:${mode.color};opacity:${0.35+0.65*val/max}"></div></div>
    </div>`
  ).join('');
}