buildFilters();
render();

d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json")
  .then((us) => {
    stateLayer
      .selectAll(".state")
      .data(topojson.feature(us, us.objects.states).features)
      .join("path")
      .attr("class", "state")
      .attr("d", pathFn)
      .attr("fill", "#131820")
      .attr("stroke", "rgba(255,255,255,0.06)")
      .attr("stroke-width", 0.5);
    updateMap(getFiltered());
  })
  .catch(() => {
    document.getElementById("map-wrap").insertAdjacentHTML(
      "beforeend",
      '<div style="padding:40px;text-align:center;color:var(--muted);font-family:var(--mono);font-size:12px;">Map unavailable — check network connection</div>'
    );
  });
