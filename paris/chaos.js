//appropriated liberally from Hugo Jansen's d3 block
//https://bl.ocks.org/nl-hugo/cfd24fee7e3f4878d9afa7f306e02771
//added an extra attractor, changed starting positions, and
//replaced setInterval with requestAnimationFrame.
function lorenz() {
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
	width = 400 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;

    var rho = 28.0,
	sigma = 10.0,
	beta = 8.0 / 3.0,
	x = 50,
	y = z = 1,
	t = 0.01,
	iter = 0,
	max_iter = 5000,
	data = [];

    var rho1 = 28.0,
	sigma1 = 10.0,
	beta1 = 8.0 / 3.0,
	x1 = 50.00001,
	y1 = z1 = 1,
	data1 = [];

    var svg = d3.select("#g-lorentz")
	.attr("width", width - margin.left + margin.right)
	.attr("height", height - margin.top + margin.bottom)
	.append("g")
	.attr("class", "g-lorentz")
	.attr("transform","scale(0.8,0.8) translate(" + margin.left + "," + margin.top + ")" )

    var colorScale = d3.scaleLinear()
	.domain([0, 40])
	.range([0, 1]);

    var circle = svg.append("circle")
	.attr("class", "circle");

    var line = d3.line()
	.curve(d3.curveCardinal)
	.x(function(d) { return d[0]; })
	.y(function(d) { return d[1]; });

    var track = svg.append("path")
	.attr("class", "track");

    var track1 = svg.append("path")
	.attr("class", "track1");

    // set the gradient
    svg.append("linearGradient")
	.attr("id", "line-gradient")
	.attr("x1", "10%").attr("x1", "90%")
	.attr("y1", "10%").attr("y2", "90%")
	.selectAll("stop")
	.data([
	    {offset: "0%", color: "#b2182b"},
	    {offset: "100%", color: "#2166ac"}
	])
	.enter().append("stop")
	.attr("offset", function(d) { return d.offset; })
	.attr("stop-color", function(d) { return d.color; });

    function lorentz(callback) {
	callback(
	    x += t * (sigma * (y - x)),
	    y += t * (x * (rho - z) - y),
	    z += t * (x * y - beta * z)
	);
    }

    function lorentz1(callback) {
	callback(
	    x1 += t * (sigma1 * (y1 - x1)),
	    y1 += t * (x1 * (rho1 - z1) - y1),
	    z1 += t * (x1 * y1 - beta1 * z1)
	);
    }


    function draw(x, y, z) {
	data.push([(width / 2 + 10 * x), (height + 10 * -z)]);
	track.attr("d", line(data)).attr("stroke", "green");
	circle.attr("transform", function(d) { return "translate(" + data[data.length - 1] + ")"; });
    }

    function draw1(x1, y1, z1) {
	data1.push([(width / 2 + 10 * x1), (height + 10 * -z1)]);
	track1.attr("d", line(data1)).attr("stroke", " #55acee");
	circle.attr("transform", function(d) { return "translate(" + data1[data1.length - 1] + ")"; });
    }

    var start = null;
    function step(timestamp) {
	if (!start) start = timestamp;
	var progress = timestamp - start;
	lorentz(draw);
	lorentz1(draw1);
	if (progress < 90000) {
	    window.requestAnimationFrame(step);
	}
    }

    window.requestAnimationFrame(step);

}
