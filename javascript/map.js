const W = 680,
  H = 400;
const proj = d3.geoAlbersUsa().scale(820).translate([W / 2, H / 2]);
const pathFn = d3.geoPath(proj);
const svg = d3
  .select("#map-wrap")
  .append("svg")
  .attr("viewBox", `0 0 ${W} ${H}`);
const stateLayer = svg.append("g");
const dotLayer = svg.append("g");

const nameToAbbr = {
  Alabama: "AL",
  Alaska: "AK",
  Arizona: "AZ",
  Arkansas: "AR",
  California: "CA",
  Colorado: "CO",
  Connecticut: "CT",
  Delaware: "DE",
  Florida: "FL",
  Georgia: "GA",
  Hawaii: "HI",
  Idaho: "ID",
  Illinois: "IL",
  Indiana: "IN",
  Iowa: "IA",
  Kansas: "KS",
  Kentucky: "KY",
  Louisiana: "LA",
  Maine: "ME",
  Maryland: "MD",
  Massachusetts: "MA",
  Michigan: "MI",
  Minnesota: "MN",
  Mississippi: "MS",
  Missouri: "MO",
  Montana: "MT",
  Nebraska: "NE",
  Nevada: "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  Ohio: "OH",
  Oklahoma: "OK",
  Oregon: "OR",
  Pennsylvania: "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  Tennessee: "TN",
  Texas: "TX",
  Utah: "UT",
  Vermont: "VT",
  Virginia: "VA",
  Washington: "WA",
  "West Virginia": "WV",
  Wisconsin: "WI",
  Wyoming: "WY"
};
const stateMWColor = d3.scaleQuantize(
  [0, 8000],
  ["#0d1f16", "#143326", "#1a4a34", "#1d7a56", "#00b37a", "#00d4aa"]
);

function updateMap(filtered) {
  const stateMW = {};
  filtered.forEach((d) => {
    stateMW[d.state] = (stateMW[d.state] || 0) + d.capacity_mw;
  });
  stateLayer.selectAll(".state").attr("fill", function (d) {
    if (!d || !d.properties) return "#131820";
    const abbr = nameToAbbr[d.properties.name];
    return stateMW[abbr]
      ? stateMWColor(Math.min(stateMW[abbr], 8000))
      : "#131820";
  });
  dotLayer.selectAll(".dc-dot").remove();
  filtered.forEach((d) => {
    const c = proj([d.lng, d.lat]);
    if (!c) return;
    dotLayer
      .append("circle")
      .attr("class", "dc-dot")
      .attr("cx", c[0])
      .attr("cy", c[1])
      .attr("r", Math.max(4, Math.min(18, Math.sqrt(d.capacity_mw / 18))))
      .attr("fill", STATUS_COLORS[d.status] || "#888")
      .attr("opacity", 0.88)
      .attr("stroke", "rgba(0,0,0,0.6)")
      .attr("stroke-width", 0.8)
      .style("cursor", "pointer")
      .on("mouseover", (event) => {
        const tt = document.getElementById("mtt");
        tt.style.display = "block";
        tt.innerHTML = `<div class="tt-name">${d.name}</div>
          <div class="tt-row"><span>Operator</span><span style="color:${getColor(
            d.operator
          )}">${d.operator}</span></div>
          <div class="tt-row"><span>Capacity</span><span>${
            d.capacity_mw >= 1000
              ? (d.capacity_mw / 1000).toFixed(1) + "K"
              : d.capacity_mw
          } MW</span></div>
          <div class="tt-row"><span>Investment</span><span style="color:var(--warn)">$${
            d.investment_bn
          }B</span></div>
          <div class="tt-row"><span>Status</span><span><span class="badge ${
            BADGE_CLASS[d.status]
          }">${d.status}</span></span></div>
          <div class="tt-row"><span>Est. Online</span><span>${
            d.est_online
          }</span></div>
          <div class="tt-row"><span>Initiative</span><span style="color:var(--purple)">${
            d.initiative
          }</span></div>`;
        const box = document.getElementById("map-wrap").getBoundingClientRect();
        let tx = event.clientX - box.left + 12;
        let ty = event.clientY - box.top + 12;
        if (tx + 240 > W) tx = W - 245;
        if (ty + 220 > H) ty -= 220;
        tt.style.left = tx + "px";
        tt.style.top = ty + "px";
      })
      .on("mouseleave", () => {
        document.getElementById("mtt").style.display = "none";
      });
  });
}
