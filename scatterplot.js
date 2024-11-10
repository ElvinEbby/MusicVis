// **** Functions to call for scaled values ****

function scaleYear(year) {
    return yearScale(year);
}

function scalePopularityScore(score) {
    return hrScale(score);
}

// **** Code for creating scales, axes and labels ****

var yearScale = d3.scaleTime()
    .domain([new Date(2013, 0, 1), new Date(2020, 0, 1)])  // Setting domain with start and end dates
    .range([60, 700]);

var hrScale = d3.scaleLinear()
    .domain([0, 100]).range([340, 20]);

var parseDate = d3.timeParse("%Y-%m-%d");

var svg = d3.select('svg');

svg.append('g').attr('class', 'x axis')
    .attr('transform', 'translate(0,345)')
    .call(d3.axisBottom(yearScale).tickFormat(d3.timeFormat("%Y")));

svg.append('g').attr('class', 'y axis')
    .attr('transform', 'translate(55,0)')
    .call(d3.axisLeft(hrScale));

// Label the x-axis
svg.append("text")
    .attr("transform", "translate(385, 380)")
    .style("text-anchor", "middle")
    .text("Year");

// Label the y-axis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20) 
    .attr("x", -190)
    .style("text-anchor", "middle")
    .text("Track Popularity Score");

// Title of the graph
svg.append("text")
    .attr("x", 400) 
    .attr("y", 30) 
    .style("text-anchor", "middle")
    .style("font-size", "24px")
    .style("font-weight", "bold")
    .text("Pop Music on Spotify");

// **** Your JavaScript code goes here ****
// Load the CSV file
d3.csv('./spotify_songs.csv').then(function(data) {
    console.log(data);
    // Filter the data
    const filteredData = data.filter(function(d) {
        const releaseDate = new Date(d.track_album_release_date);
        return (
            d.playlist_genre === 'pop' &&
            releaseDate >= new Date(2013, 0, 0) &&
            releaseDate <= new Date(2019, 11, 31)
        );
    });

    // Create a group for each data point
    const groups = svg.selectAll('g')
        .data(filteredData)
        .enter()
        .append('g')
        .attr('transform', function(d) {
            const releaseDate = new Date(d.track_album_release_date);
            const cx = scaleYear(releaseDate);
            const cy = scalePopularityScore(+d.track_popularity);
            return `translate(${cx}, ${cy})`;
        });

    // Append circles to each group
    groups.append('circle')
        .attr('r', 2)
        .attr('fill', function(d) {
            const danceable = +d.danceability;
            if (danceable >= 0.75) {
                return 'orange';
            } else if (danceable <= 0.25) {
                return 'lightgrey';
            } else {
                return 'steelblue';
            }
        })
        .attr('opacity', function(d) {
            const danceable = +d.danceability;
            if (danceable >= 0.75) {
                return 1;
            } else if (danceable <= 0.25) {
                return 0.5;
            } else {
                return 0.7;
            }
        })
        .attr('stroke', function(d) {
            return (+d.danceability >= 0.75) ? 'black' : 'none';
        })
        .attr('stroke-width', function(d) {
            return (+d.danceability >= 0.75) ? 0.3 : 0;
        });

    // Append text labels to each group
    groups.append('text')
        .text(function(d) { return d.track_name; }) 
        .attr('y', -5) 
        .style('text-anchor', 'middle');
});

