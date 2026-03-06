async function drawChart() {
  // Read data
  const countryShapes = await d3.json("world-geojson.json");
  const dataset = await d3.csv("world_bank_data.csv");

  const countryNameAccessor = d => d.properties["NAME"];
  const countryIdAccessor = d => d.properties["ADM0_A3_IS"];

  const metric = "Population growth (annual %)";
  const metricDataByCountry = {};
  dataset.forEach(d => {
    if (d["Series Name"] === metric) {
      return metricDataByCountry[d["Country Code"]] = +d["2017 [YR2017]"] || 0;
    }
  });

  console.log(metricDataByCountry);

  // DIMENSIONS
  let dimensions = {
    width: window.innerWidth * 0.9,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    }
  }; // FIX: closing brace was missing for dimensions object

  dimensions.boundedWidth = dimensions.width
    - dimensions.margin.left
    - dimensions.margin.right;

  const sphere = { type: "Sphere" }; // FIX: removed erroneous parentheses around object literal
  const projection = d3.geoEqualEarth()
    .fitWidth(dimensions.boundedWidth, sphere);
  const pathGenerator = d3.geoPath(projection);
  console.log(pathGenerator.bounds(sphere));
  const [[x0, y0], [x1, y1]] = pathGenerator.bounds(sphere);
  console.log(x0, y0, x1, y1);
  dimensions.boundedHeight = y1;
  dimensions.height = y1
    + dimensions.margin.top
    + dimensions.margin.bottom;

  // SVG
  const wrapper = d3.select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height);

  const boundingBox = wrapper.append("g")
    .style("transform", `translate(
      ${dimensions.margin.left}px, 
      ${dimensions.margin.top}px)`);

  // SCALES
  const metricValues = Object.values(metricDataByCountry);
  const metricValueExtents = d3.extent(metricValues);
  console.log(metricValueExtents);

  const maxChange = d3.max([-metricValueExtents[0], metricValueExtents[1]]); // FIX: d3.max() requires an array, not two separate arguments
  const colorScale = d3.scaleDiverging()
    .domain([-maxChange, 0, maxChange])
    .range(["blue", "white", "red"]);

  d3.select("#min").text(-maxChange.toFixed(2));
  d3.select("#max").text(maxChange.toFixed(2));

  // DRAW DATA
  const earth = boundingBox.append("path")
    .attr("class", "earth")
    .attr("d", pathGenerator(sphere));

  const graticuleJSON = d3.geoGraticule10();
  const graticule = boundingBox.append("path")
    .attr("class", "graticule")
    .attr("d", pathGenerator(graticuleJSON));

  const countries = boundingBox.selectAll(".country")
    .data(countryShapes.features)
    .enter().append("path")
    .attr("class", "country")
    .attr("d", pathGenerator)
    .attr("fill", d => {
      const metricValue = metricDataByCountry[countryIdAccessor(d)];
      if (typeof metricValue === "undefined") return "black"; // FIX: typeof comparison must be against a string, not bare undefined
      return colorScale(metricValue);
    });

  const tooltip = d3.select("#tooltip");

  boundingBox.selectAll(".country")
    .on("mouseenter", onMouseEnter)
    .on("mouseleave", onMouseLeave);

  function onMouseEnter(event, d) { // FIX: missing closing parenthesis after parameter d
    tooltip.select("#name")
      .text(countryNameAccessor(d));
    tooltip.select("#value")
      .text((metricDataByCountry[countryIdAccessor(d)] || 0).toFixed(2)); // FIX: added fallback to avoid crash when value is undefined
    const [tooltipX, tooltipY] = d3.pointer(event);
    tooltip.style("transform", `translate(
      calc(-50% + ${tooltipX}px + ${dimensions.margin.left}px),
      calc(-100% + ${tooltipY}px + ${dimensions.margin.top}px)
    )`);
    tooltip.style("opacity", 1);
  }

  function onMouseLeave() {
    tooltip.style("opacity", 0);
  }

  navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    const [x, y] = projection([
      position.coords.longitude,
      position.coords.latitude
    ]);
    const myLocation = boundingBox.append("circle")
      .attr("class", "myLoc") // FIX: string was missing its closing quote
      .attr("r", 0)
      .attr("cx", x)
      .attr("cy", y); // FIX: removed stray semicolon mid-chain that broke the transition
    myLocation.transition().duration(600)
      .attr("r", 10); // FIX: .attr()("r", 10) was a double-call syntax error; also chained from myLocation variable
  });
  // drawChart function closes here
}
drawChart();