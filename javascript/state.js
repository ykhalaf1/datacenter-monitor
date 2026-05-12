let activeStatuses = new Set(["all"]),
  sortCol = "capacity_mw",
  sortDir = -1,
  page = 1;
const PER = 15;

function getColor(op) {
  for (const k of Object.keys(OP_COLORS)) {
    if (op.startsWith(k.split("/")[0].trim())) return OP_COLORS[k];
  }
  return OP_COLORS[op] || "#888";
}

function getFiltered() {
  const q = document.getElementById("search").value.toLowerCase();
  const fst = document.getElementById("f-state").value;
  const fop = document.getElementById("f-op").value;
  const fty = document.getElementById("f-type").value;
  return DATA.filter((d) => {
    const ms = activeStatuses.has("all") || activeStatuses.has(d.status);
    const mq =
      !q ||
      [d.name, d.operator, d.city, d.state, d.initiative, d.type, d.notes].some(
        (v) => v && v.toLowerCase().includes(q)
      );
    const mst = !fst || d.state === fst;
    const mop = !fop || d.operator === fop;
    const mty = !fty || d.type === fty;
    return ms && mq && mst && mop && mty;
  }).sort((a, b) => {
    const av = sortCol === "env_score" ? envScore(a) : a[sortCol];
    const bv = sortCol === "env_score" ? envScore(b) : b[sortCol];
    if (typeof av === "number") return (av - bv) * sortDir;
    return String(av || "").localeCompare(String(bv || "")) * sortDir;
  });
}
