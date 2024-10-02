document.addEventListener("DOMContentLoaded", function() {
    const svg = d3.select("svg");
    const g = svg.append("g");  // Append a <g> group to contain all the paths

    const width = svg.attr("width") || 800;
    const height = svg.attr("height") || 600;

    // Initial projection setup
    const projection = d3.geoMercator()
        .scale((width / 2.1) / Math.PI)
        .translate([width / 2.1, height / 1.5]);  // Initial translation to center the map

    const path = d3.geoPath().projection(projection);

    const colorScale = d3.scaleLinear()
        .domain([0.81, 1.2, 1.8, 2.2, 3.0, 7.67])
        .range(["#4d0000", "#FF3333", "#FFFF00", "#A0D65B", "#4CAF50", "#004d00"]);

    let populationData = {};
    const lastKnownValues = {};

    // Zoom behavior
    const zoom = d3.zoom()
        .scaleExtent([0.85, 10])  // Minimum and maximum zoom levels
        .on('zoom', handleZoom);

    // Initialize zoom behavior on the SVG
    svg.call(zoom);

    // Function to handle zooming
    function handleZoom(event) {
        g.attr("transform", event.transform);  // Apply the zoom and pan transformation to <g>
    }

    // Function to align zoom to the initial center
    function centerZoom() {
        svg.transition()
            .duration(750)
            .call(zoom.translateTo, width / 1.95, height / 2.4);
    }

    // Zoom In/Out, Reset, Pan, and Center controls
    function zoomIn() {
        svg.transition().duration(750).call(zoom.scaleBy, 2);
    }

    function zoomOut() {
        svg.transition().duration(750).call(zoom.scaleBy, 0.5);
    }

    function resetZoom() {
        svg.transition().duration(750).call(zoom.scaleTo, 1);
    }

    function center() {
        centerZoom();
    }

    function panLeft() {
        svg.transition().duration(750).call(zoom.translateBy, -50, 0);
    }

    function panRight() {
        svg.transition().duration(750).call(zoom.translateBy, 50, 0);
    }

    // Update map with projection and paths
    function updateMap(year) {
        const parentContainer = svg.node().parentNode;
        const width = parentContainer.clientWidth;
        const height = parentContainer.clientHeight || 600;

        projection
            .scale((width / 2.1) / Math.PI)
            .translate([width / 2.1, height / 1.5]);

        g.selectAll("path")
            .attr("d", path)
            .attr("fill", d => {
                const countryName = d.properties.name ? d.properties.name.trim() : "";
                const countryData = populationData[countryName];
                const value = countryData ? parseFloat(countryData[year]) : 0;

                if (isNaN(value) || value === 0) {
                    return lastKnownValues[countryName] ? colorScale(lastKnownValues[countryName]) : "#ccc";
                } else {
                    lastKnownValues[countryName] = value;
                    return colorScale(value);
                }
            });
    }

    // Load and process CSV data
    d3.csv("data/fertility-data.csv").then(function(data) {
        data.forEach(row => {
            if (row.Country) {
                const country = row.Country.trim();
                populationData[country] = row;
            }
        });

        // Draw countries using <g> element for better zoom/pan handling
        g.selectAll("path")
            .data(countries_data.features)
            .enter().append("path")
            .attr("class", "country")
            .attr("d", path)
            .on("mouseover", function(event, d) {
                const tooltip = d3.select(".tooltip");
                tooltip.transition().duration(200).style("opacity", .9);
                const countryName = d.properties.name ? d.properties.name.trim() : "";
                const year = d3.select("#yearSlider").property("value");
                const countryData = populationData[countryName];
                const percentage = countryData ? countryData[year] : "N/A";
                tooltip.html(`${countryName}: ${percentage}`)
                    .style("left", (event.pageX + 5) + "px")
                    .style("top", (event.pageY - 28) + "px");
            })
            .on("mouseout", function() {
                d3.select(".tooltip").transition().duration(500).style("opacity", 0);
            });

        // Update the map for the initial year
        const initialYear = d3.select("#yearSlider").property("value");
        updateMap(initialYear);

        // Update the map when the year slider changes
        const slider = d3.select("#yearSlider");
        slider.on("input", function() {
            const selectedYear = this.value;
            d3.select("#yearLabel").text(selectedYear);
            updateMap(selectedYear);
        });

        // Update map on window resize
        window.addEventListener('resize', () => {
            updateMap(d3.select("#yearSlider").property("value"));
        });

        // Handle checkbox for missing countries
        d3.select("#hideMissing").on("change", function() {
            updateMap(d3.select("#yearSlider").property("value"));
        });

    }).catch(function(error) {
        console.error('Error loading or processing data.csv:', error);
    });

    // Attach zoom and pan control functions to buttons (assuming buttons in HTML)
    d3.select("#zoomIn").on("click", zoomIn);
    d3.select("#zoomOut").on("click", zoomOut);
    d3.select("#resetZoom").on("click", resetZoom);
    d3.select("#center").on("click", center);
    d3.select("#panLeft").on("click", panLeft);
    d3.select("#panRight").on("click", panRight);

});
