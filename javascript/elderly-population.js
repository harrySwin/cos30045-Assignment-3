function drawGraph() {
		var margin = { top: 60, right: 80, bottom: 60, left: 50 };
		var width = 1000 - (margin.left * 2) - margin.right;
		var height = 800 - margin.bottom;

		var svg = d3.select("#chart")
				.append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height)
				.append('g')
				.attr('transform', 'translate(' + margin.left + ',' + -1 * margin.bottom + ')');

		d3.csv("data/elderly-population-data.csv").then(function (data) {
				// Transform the data into an array of objects
				const years = data.columns.slice(1);
				const countries = data.map(d => ({
						country: d.Country,
						values: years.map(year => ({
								year: +year,
								value: +d[year]
						}))
				}));

				// Populate the dropdowns
				const startYearSelect = d3.select("#startYear");
				const endYearSelect = d3.select("#endYear");

				years.forEach(year => {
						startYearSelect.append("option").attr("value", year).text(year);
						endYearSelect.append("option").attr("value", year).text(year);
				});

				// Set default values
				startYearSelect.property("value", years[0]);
				endYearSelect.property("value", years[years.length - 1]);

				var color = d3.scaleOrdinal(d3.schemePaired);
				const checkboxContainer = d3.select("#checkboxes");
				checkboxContainer.selectAll("button")
						.data(countries)
						.enter().append("button")
						.text(d => d.country)
						.attr("class", "toggle-button active") // Add class for styling
						.attr("data-country", d => d.country)
						.style("background-color", (d, i) => color(i))
						.on("click", function () {
								const country = d3.select(this).attr("data-country");
								const isActive = d3.select(this).classed("active");

								d3.select(this).classed("active", !isActive); // Toggle active class
								updateVisibility();
						});
				d3.select("#selectAll").on("click", function () {
				d3.selectAll(".toggle-button").classed("active", true); // Select all buttons
						updateVisibility(); // Update visibility after selection
				});

				// Remove All button logic
				d3.select("#removeAll").on("click", function () {
						d3.selectAll(".toggle-button").classed("active", false); // Deselect all buttons
						updateVisibility(); // Update visibility after deselection
				});

				function updateVisibility() {
						// Get the selected countries from the active buttons
						const selectedCountries = Array.from(document.querySelectorAll('.toggle-button.active'))
								.map(button => button.getAttribute('data-country'));

						// Update the visibility of the paths (lines)
						svg.selectAll('path')
								.style('opacity', function () {
										const country = d3.select(this).attr('country');
										return selectedCountries.includes(country) ? 1 : 0; // Set opacity based on selection
								});

						// Update the visibility of the circles
						svg.selectAll('circle')
								.style('opacity', function () {
										const country = d3.select(this).attr('country');
										return selectedCountries.includes(country) ? 1 : 0; // Set opacity based on selection
								});
				}

				var x = d3.scaleLinear()
						.domain([1950, 2022])
						.range([0, width - margin.right]);

				var y = d3.scaleLinear()
						.domain([0, d3.max(data, d => d3.max(years, year => +d[year])) * 1.15])
						.range([height, 0]);

				var xAxisGroup = svg.append("g")
				.attr("class", "x-axis")
				.attr("transform", `translate(0,${height})`)
				.call(d3.axisBottom(x).ticks(20).tickFormat(d3.format("d")))
				.selectAll("text") // Select all the text elements
				.attr("transform", "rotate(-45)") // Rotate the labels by 45 degrees
				.attr("text-anchor", "end") // Align the text to start
				.attr("font-size", "14px");

				function yGridLines() {
						return d3.axisLeft(y).ticks(15); // Number of grid lines
				}

				svg.append('g')
						.attr('class', 'grid')
						.call(yGridLines().tickSize(-width).tickFormat('')); // No labels

				function xGridLines() {
						return d3.axisBottom(x).ticks(20);
				}
				svg.append('g')
						.attr('class', 'grid')
						.attr('stroke', 'slategray')
						.attr('transform', `translate(0,${height})`)
						.call(xGridLines().tickSize(-height).tickFormat('')); // No labels

				svg.append('text')
						.attr('x', width / 2) // Center the label horizontally
						.attr('y', height + 40) // Position it below the x-axis
						.attr('dy', '1em') // Adjust vertical position
						.attr('class', 'axis-label')
						.style("text-anchor", "middle")
						.text('Years'); // The label text

				var yAxis = svg.append('g')
						.call(d3.axisLeft(y).ticks(15))
						.selectAll("text")
						.attr("font-size", "14px");

				svg.append("text")
						.attr("transform", "rotate(-90)") // Rotate the label
						.attr("y", 0 - margin.left)
						.attr("x", 0 - (height / 2))
						.attr("dy", "1em")
						.attr('class', 'axis-label')
						.style("text-anchor", "middle")
						.text("Percentage of Population Over 65");

				var line = d3.line()
						.x(d => x(d.year))
						.y(d => y(d.value));
				const tooltip = d3.select("#tooltip");

				countries.forEach((country, index) => {
						svg.append('path')
								.datum(country) // Bind the whole country object, not just values
								.attr('fill', 'none')
								.attr('stroke', color(index))
								.attr('stroke-width', 3.5)
								.attr('d', line(country.values)) // Use the values directly
								.attr('country', country.country)
								.on('mouseover', function (event, d) {
										tooltip.style('opacity', 1)
												.html(country.country)
												.style('left', (event.pageX + 5) + 'px')
												.style('top', (event.pageY - 28) + 'px');
								})
								.on('mousemove', function (event) {
										// Optionally, update the tooltip position
										tooltip.style('left', (event.pageX + 5) + 'px')
												.style('top', (event.pageY - 28) + 'px');
								})
								.on('mouseout', function () {
										tooltip.style('opacity', 0);
								});

						svg.selectAll(`.dot-${index}`)
								.data(country.values)
								.enter().append('circle')
								.attr('class', `dot-${index}`)
								.attr('cx', d => x(d.year))
								.attr('cy', d => y(d.value))
								.attr('r', 5) // Adjust the size of the dots
								.attr('fill', color(index))
								.attr('country', country.country)
								.on('mouseover', function(event, d) {
										tooltip.style('opacity', 1)
												.html(`${country.country}<br>Year: ${d.year}<br>Value: ${d.value}`)
												.style('left', (event.pageX + 5) + 'px')
												.style('top', (event.pageY - 28) + 'px');
								})
								.on('mousemove', function(event) {
										tooltip.style('left', (event.pageX + 5) + 'px')
												.style('top', (event.pageY - 28) + 'px');
								})
								.on('mouseout', function() {
										tooltip.style('opacity', 0);
								});
				});

				// Update graph when dropdown values change
function updateGraph() {
		const startYear = +startYearSelect.property("value");
		let endYear = +endYearSelect.property("value");

		if (endYear < startYear) {
				endYear = startYear; // Correct endYear if it’s less than startYear
				endYearSelect.property("value", endYear);
		}

		// Update x-scale domain based on selected years
		x.domain([startYear, endYear]);

		// Update axes
		svg.selectAll('g.grid').remove(); // Remove old grid lines
		svg.append('g')
				.attr('class', 'grid')
				.call(xGridLines().tickSize(-height).tickFormat(''));

		// Update x-axis
		svg.selectAll("g.x-axis")
				.call(d3.axisBottom(x).ticks(15).tickFormat(d3.format("d")))
				.selectAll("text")
				.attr("transform", "rotate(-45)")
				.attr("text-anchor", "end")
				.attr("font-size", "14px");

		// Update paths
		svg.selectAll('path')
				.attr('d', function(d) {
						if (d && d.values) {
								const filteredValues = d.values.filter(v => v.year >= startYear && v.year <= endYear);
								return line(filteredValues);
						}
						return ''; // Return an empty path if no data
				});

		// Update circles
		svg.selectAll('circle')
				.attr('cx', d => x(d.year))
				.attr('cy', d => y(d.value))
				.attr('display', d => (d.year >= startYear && d.year <= endYear) ? 'block' : 'none');
}


				// Event listeners for dropdowns
				startYearSelect.on("change", updateGraph);
				endYearSelect.on("change", updateGraph);

				// Initial draw
				updateGraph(); // Call the update function to initialize the graph
				updateVisibility();
		});

}

window.onload = drawGraph;
