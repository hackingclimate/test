//change CSV url to relative paths before publish

function draw() {
    var margin = { top: 40, right: 30, bottom: 30, left: 30},
	height = 300 - margin.top - margin.bottom;
    var width = 400 - margin.left - margin.right;
    var transIn = 1500;
    var transOut = 1000;
    var introImage = d3.select("#greenland-sea-ice");
    var introImageContainer = d3.select(".container-1");

    var gs = d3.graphScroll()
	.container(d3.select('.container-1'))
        .sections(d3.selectAll('.container-1  #sections > div'))
        .on('active', function(i){
//	    console.log(i + 'th section active')
	    if (i == 0) {
		introImage.style("transform","scale(2)")
		//console.log("intro-image i == 0");		
		introImage.style("opacity","1");
		introImageContainer.style("background","black");
	    }
	    if (i == 1) {
		introImage.style("transform","scale(2.7)");
//		console.log("intro-image i == 1");
		introImage.style("opacity","1");
		introImageContainer.style("background","black");	
	    }
	    if (i == 2) {
		introImage.style("transform","scale(2.7) translateY(-8em)");
		console.log("intro-image i == 2");
		introImage.style("opacity","1");
		introImageContainer.style("background","black");
	    }
	    if (i == 3) {
		introImage.style("opacity","1");
		introImageContainer.style("background","black");
	    }
	    if (i == 4) {
		introImage.style("opacity","1");
		introImageContainer.style("background","black");
	    }
	})

    var lorenzCounter = 0;
    var lorenzSVG = d3.select("#g-lorentz");
  
    var gs3 = d3.graphScroll()
	.container(d3.select('.container-3'))
	.sections(d3.selectAll('.container-3 #sections > div'))
	.on('active', function(i){
	    var linterval;	    
	    if (i == 1) {
		introImage.style("opacity","0");
		introImageContainer.style("background","white");
		if (lorenzCounter === 0) { lorenz(); lorenzCounter++;}
		lorenzSVG.transition().duration(transIn).attr("opacity",1);
	    }

	    if ( i == 2) {
		introImage.style("opacity","0");
		introImageContainer.style("background","white");		
		lorenzSVG.transition().duration(transIn).attr("opacity",1);
	    }

	    if ( i == 3) {
		lorenzSVG.transition().duration(transIn).attr("opacity",1);
	    }

	    if ( i == 4) {
		lorenzSVG.transition().duration(transIn).attr("opacity",1);
	    }

	    if ( i == 5) {
		lorenzSVG.transition().duration(transIn).attr("opacity",1);
	    }

	    if (i == 6) {
		lorenzSVG.transition().duration(transOut).attr("opacity",0);
	    }
	})

    var ppmSVG = d3.select("#svg-ppm");
   
    var gs2 = d3.graphScroll()
	.container(d3.select('.container-2'))
	.sections(d3.selectAll('.container-2 #sections > div'))
        .on('active', function(i){
	    var zeroLine = d3.select("#zero");
	    var threeLine = d3.select("#minus3");
	    var sixLine = d3.select("#minus6");

	    console.log(i + 'th section active')
	    if (i == 0) {
		ppmSVG.select(".rect")
		    .transition()
		    .duration(transOut/2)
		    .attr("x",0);
	    }
	    if (i == 1) {
		ppmSVG.select(".rect")
		    .transition()
		    .duration(transIn/2)
		    .attr("x",width + 40)

		zeroLine.transition()
		    .delay(0)
		    .duration(1500/2)
		    .style("opacity",1);

		threeLine.transition()
		    .duration(1000/2)
		    .style("opacity",0);

		sixLine.transition()
		    .duration(1000/2)
		    .style("opacity",0);
	    }
	    if (i == 2) {
		zeroLine.transition()
		    .duration(1000/2)
		    .style("opacity",0.2);
		
		 threeLine.transition()
		    .delay(0)
		    .duration(1000/2)
		    .style("opacity",1);

		sixLine.transition()
		    .duration(1000/2)
		    .style("opacity",0);
	    }

	    if (i == 3) {
		zeroLine.transition()
		    .duration(1000/2)
		    .style("opacity",0.2);

		threeLine.transition()
		    .duration(1000/2)
		    .style("opacity",0.2);

		sixLine.transition()
		    .delay(0)
		    .duration(1000/2)
		    .style("opacity",1);
	    }
	})

    var customsv = d3.dsvFormat("  ");
    var i = 0;
    
    var globalTempData;
    var ppmHistoricalData;
    var ppmDataNoExtraction;
    var ppmDataWithExtraction;
    var holocene;
    var seaIceExtent;
    
    var bc = "#eee";
    var pre = "https://hackingclimate.github.io/paris"
//    var pre = "";

    d3.request(pre + "/Data/csv/fig2a.txt")
	.mimeType("text/plain")
	.response(function(xhr) { return customsv.parse(xhr.responseText) })
	.get(function(data) {
	    console.log("custom-delimited data:")
	    console.log(data[1]);
	    globalTempData = data;
	    request("fig10-actual");
	});

    function request(filename) {
	d3.request(pre + "/Data/csv/" + filename + ".txt")
	    .mimeType("text/plain")
	    .response(function(xhr) { return customsv.parse(xhr.responseText) })
	    .get(function(data) {
		console.log(filename)
		console.log(data[1]);
		if (i === 0) {
		    ppmHistoricalData = data;
		    i++;
		    request("fig10-wo-extract");
		}
		else if (i === 1) {
		    ppmDataNoExtraction = data;
		    i++;
		    request("holocene-fig3");
		}
		else if (i === 2) {
		    holocene = data;
		    i++;
		    request("fig10-w-extract");
		}
		else if (i === 3) {
		    ppmDataWithExtraction = data;
		    i++;
		    onDataLoad();
		}
	    })
    }
    function onDataLoad() {
	drawCarbonRemovalBlocks();
	drawCO2graph(ppmHistoricalData,'svg-historical-emissions',1);
	drawHolocene(holocene);
	drawCO2graph(ppmHistoricalData,'svg-ppm',0);
	drawCO2Future(ppmDataNoExtraction);	
    }

    function drawCarbonRemovalBlocks() {
	var svg = d3.select("#svg-carbon-removal-blocks")
	    .append("g")
	    .attr("transform", "translate(" + 0 + "," + 55 + ")");

	var constantEmissions = svg.append("g").attr("id", "carbon-removal-constant-emissions").attr("transform","translate(0,0)");

	var threePercentEmissions = svg.append("g").attr("id", "carbon-removal-three-percent-emissions").attr("transform","translate(140,0)");

	var sixPercentEmissions = svg.append("g").attr("id", "carbon-removal-six-percent-emissions").attr("transform","translate(280,0)");

	var yearlyEmissions = svg.append("g").attr("id", "carbon-removal-yearly-emissions").attr("transform","translate(280,112)")

	var unitsText = svg.append("g").attr("transform","translate(0,0)")

	var legend0 = svg.append("g").attr("transform","translate(0,0)");
	var legend1 = svg.append("g").attr("transform","translate(140,0)");
	var legend2 = svg.append("g").attr("transform","translate(280,0)");
	var legend3 = svg.append("g").attr("transform","translate(280,144)");
	var title = svg.append("g").attr("transform","translate(196,0)");
	var Co0 = svg.append("g").attr("transform","translate(0,0)");
	var Co1 = svg.append("g").attr("transform","translate(140,0)");
	var Co2 = svg.append("g").attr("transform","translate(280,0)");
	var Co3 = svg.append("g").attr("transform","translate(280,144)");	

	unitsText.append("text")
	    .attr("class", "carbon-removal-units-description")
	    .attr("y",201)
	    .attr("x",0)
	    .style("text-anchor", "start")
	    .text("1 Square = 10 billion tons (GT)");

	legend0.append("text")
	    .attr("class", "carbon-removal-text")
	    .attr("y",34)
	    .attr("x",52.5)
	    .style("text-anchor", "middle")
	    .text("fall 0% a year");

	Co0.append("text")
	    .attr("class", "carbon-removal-text-gt")
	    .attr("y",169)
	    .attr("x",0)
	    .style("text-anchor", "start")
	    .text("2550 GT");
		

	legend1.append("text")
	    .attr("class", "carbon-removal-text")
	    .attr("y",34)
	    .attr("x",52.5)
	    .style("text-anchor", "middle")
	    .text("fall 3% a year");

	Co1.append("text")
	    .attr("class", "carbon-removal-text-gt")
	    .attr("y",93)
	    .attr("x",0)
	    .style("text-anchor", "start")
	    .text("870 GT");


	legend2.append("text")
	    .attr("class", "carbon-removal-text")
	    .attr("y",34)
	    .attr("x",52.5)
	    .style("text-anchor", "middle")
	    .text("fall 6% a year");

	Co2.append("text")
	    .attr("class", "carbon-removal-text-gt")
	    .attr("y",79)
	    .attr("x",0)
	    .style("text-anchor", "start")
	    .text("560 GT");


	legend3.append("text")
	    .attr("class", "carbon-removal-text-small")
	    .attr("y",0)
	    .attr("x",0)
	    .style("text-anchor","start")
	    .text("Yearly Emissions");

	Co3.append("text")
	    .attr("class", "carbon-removal-text-gt-black")
	    .attr("y",26)
	    .attr("x",0)
	    .style("text-anchor", "start")
	    .text("40 GT");


	title.append("text")
	    .attr("class", "carbon-removal-title")
	    .attr("y",0)
	    .attr("x",0)
	    .style("text-anchor", "middle")
	    .text("CO2 Removal Under Different Emissions Scenarios (from 2021)");

	var color = "rgb(11,218,81)";

	var counter3perc = 0;
	var counter6perc = 0;
	
	for(var i = 0; i < 15; i++) {
	      for(var j = 0; j < 17; j++) {
		  constantEmissions.append('rect')
		      .attr("x",(i * 7))
		      .attr("y",40 + (j * 7))
		      .attr("width",5)
		      .attr("height",5)
		      .attr("fill",color);
	      }
	}

	for(var i = 0; i < 6; i++) {
	    
	    for(var j = 0; j < 15; j++) {
		if (counter3perc < 87) {
		    threePercentEmissions.append('rect')
			.attr("x",(j * 7))
			.attr("y",40 + (i * 7))
			.attr("width",5)
			.attr("height",5)
			.attr("fill",color);
		}
		counter3perc++;
	    }
	}

	for(var i = 0; i < 4; i++) {
	    for(var j = 0; j < 15; j++) {
		if (counter6perc < 56) {
		    sixPercentEmissions.append('rect')
			.attr("x",(j * 7))
			.attr("y",40 + (i * 7))
			.attr("width",5)
			.attr("height",5)
			.attr("fill",color);
		}
		counter6perc++;
	    }
	}

	for(var i = 0; i < 4; i++) {
	    for(var j = 0; j < 1; j++) {
		yearlyEmissions.append('rect')
		      .attr("x",(i * 7))
		      .attr("y",40 + (j * 7))
		      .attr("width",5)
		      .attr("height",5)
		      .attr("fill","black");
	      }
	}
    }

    function drawCO2Future(data) {

	var _x = d3.scaleLinear().range([0, width]);
	var _y = d3.scaleLinear().range([height, 0]);

	var valueline = d3.line().x(function (d) {
	    return _x(d.Year);
	}).y(function (d) {
	    return _y(d.cons);
	});

	var valueline2 = d3.line().x(function (d) {
	    return _x(d.Year);
	}).y(function (d) {
	    return _y(d.minus3);
	});

	var valueline3 = d3.line().x(function (d) {
	    return _x(d.Year);
	}).y(function (d) {
	    return _y(d.minus6);
	});

	var svg = d3.select("#svg-ppm")//abstract
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
	    d.Year = +d.Year;  //abstract
	    d.cons = +d.cons; //abstract
	    d.minus3 = +d.minus3;
	    d.minus6 = +d.minus6;
	});

	_x.domain([1850,2100]); //abstract

	_y.domain([150,600]); //abstract

	svg.append("path")
	    .data([data])
	    .attr("id","zero")
	    .attr("class", "line2") //abstract path class
	    .attr("stroke","rgb(255, 239, 0)")
	    .attr("d", valueline);

	svg.append("path")
	    .data([data])
	    .attr("id","minus3")
	    .attr("class", "line2") //abstract path class
	    .attr("d", valueline2)
	    .attr("stroke","#55acee")
	    .style("opacity",0);

	svg.append("path")
	    .data([data])
	    .attr("id","minus6")
	    .attr("class", "line2") //abstract path class
	    .attr("stroke","rgb(11,218,81)")
	    .attr("d", valueline3)
	    .style("opacity",0);


	svg.append("g")
	    .attr("class", "x-axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(_x)
		  .ticks(5)
		  .tickFormat(d3.format("d"))
		 );
	
	svg.append("g").call(d3.axisLeft(_y).ticks(5)); //abstract ticks

	svg.append('g').attr("class","rectg")
	    .append("rect")
	    .attr("class","rect")
	    .attr("id","ppm-rect")
	    .attr("x",0)
	    .attr("y",0)
	    .attr("width",width)
	    .attr("height",height)
	    .style("fill","white")
	    .style("stroke","none")
    }


    function drawCO2graph(data,id,rect) {

	var _x = d3.scaleLinear().range([0, width]);
	var _y = d3.scaleLinear().range([height, 0]);

	var valueline = d3.line().x(function (d) {
	    return _x(d.Year);
	}).y(function (d) {
	    return _y(d.actual);
	});

	var svg = d3.select("#" + id)//abstract
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
	    d.Year = +d.Year;  //abstract
	    d.actual = +d.actual; //abstract
	});

	if (rect === 1) {
	    _x.domain([1850,2020]); //abstract
	    _y.domain([150,410]); //abstract

	    var annotations = [
	    {
		note: {
//		    title: "Atmospheric carbon dioxide levels since 1860",
		    label: "",
		    wrap: 400
		},
		x: 175,
		y: -40,
		dy: 0,
		dx: 0,
		color: 'black'
	    },
	    {
		note: {
		    label: "We crossed 350ppm in 1988. We need to get back here",
		    title: "",
		    wrap: 150
		},
		x: 130,
		y: 37,
		dy: 0,
		dx: 0,
		color: 'rgba(11,218,81);'
	    },
	    {
		note: {
		    label:"We are now at 410ppm",
		    title:"",
		    wrap: 50
		},
		x: 330,
		y:15,
		dy:150,
		dx:0,
		color: 'grey'
	    }
	].map(function(d){ return d})

	}

	else {
	    _x.domain([1850,2100]); //abstract
	    _y.domain([150,600]); //abstract
	}

	var makeAnnotations = d3.annotation()
	    .type(d3.annotationLabel)
	    .annotations(annotations);

	svg.append("path")
	    .data([data])
	    .attr("class", "line3") //abstract path class
	    .attr("d", valueline);

	if (rect === 1) {
	   svg.append("g")
	       .attr("class", "x-axis")
	       .attr("transform", "translate(0," + height + ")")
	       .call(d3.axisBottom(_x)
		     .tickFormat(d3.format("d"))
		    );

	    svg.append("g").call(d3.axisLeft(_y).ticks(5)); //abstract ticks

	    svg.append("text")
		.attr("class", "y-axis")
		.attr("transform","rotate(-90)")
		.attr("y",0 + 15)
		.attr("x",- height + 5)
		.style("text-anchor", "start")
		.text("Parts Per Million (ppm)")


	    svg.append("g")
		.attr("class", "annotation-group")
		.call(makeAnnotations);

	    svg.append("line")
		.attr("x1",10)
		.attr("x2",325)
		.attr("y1",53)
		.attr("y2",53)
		.attr("stroke-width","1px")
		.attr("stroke","rgb(11,218,81)")
		.attr("stroke-dasharray","5,5");

	    svg.append('g').attr("class","rectg")
		.append("rect")
		.attr("class","rect")
		.attr("x",0)
		.attr("y",0)
		.attr("width",width + 20)
		.attr("height",height)
		.style("fill","white")
		.style("stroke","none")
	}
    }

    function drawHolocene(data) {

	var _x = d3.scaleLinear().range([0, width]);
	var _y = d3.scaleLinear().range([height, 0]);

	var valueline = d3.line().x(function (d) {
	    return _x(d.Age); //abstract
	}).y(function (d) {
	    return _y(d.Temp); //abstract
	});

	var valueline2 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {				
	    return d.Temp < 0.75 ? _y(d.Temp + 0.25) : _y(1.0) ;
	});

	var valueline3 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return d.Temp < 0.8 ? _y(d.Temp + 0.20) : _y(1.0) ;
	    
	});

	var valueline4 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return d.Temp < 0.85 ? _y(d.Temp + 0.15) : _y(1.0) ;
	    //return _y(d.Temp + 0.15);
	});

	var valueline5 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return d.Temp < 0.9 ? _y(d.Temp + 0.1) : _y(1.0) ;
//	    return _y(d.Temp + 0.1);
	});

	var valueline6 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return d.Temp < 0.95 ? _y(d.Temp + 0.05) : _y(1.0) ;
//	    return _y(d.Temp + 0.05);
	});

	var valueline7 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return _y(d.Temp - 0.05);
	});

	var valueline8 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return _y(d.Temp - 0.10);
	});

	var valueline9 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return _y(d.Temp - 0.15);
	});

	var valueline10 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return _y(d.Temp - 0.20);
	});

	var valueline11 = d3.line().x(function (d) {
	    return _x(d.Age);
	}).y(function (d) {
	    return _y(d.Temp - 0.25);
	});

	var temp = "Centennially smoothed Holocene temperature (C) relative to 1880-1920";
	var annotations = [
	    {
		note: {
//		    title: "Centennially smoothed temperature (since the last glacial period)",
		    label: "",
		    wrap: 400
		},
		x: 175,
		y: -40,
		dy: 0,
		dx: 0,
		color: 'black'
	    },
	    {
		note: {
		    label: "The Paris Agreement aims to keep us here",
		    title: "",
		    wrap: 300
		},
		x: 160,
		y: 15,
		dy: 0,
		dx: 0,
		color: "rgb(11,218,81)"
	    },
	    {
		note: {
		    label: "350ppm keeps us here",
		    title: "",
		    wrap: 300
		},
		x: 160,
		y: 65,
		dy: 0,
		dx: 0,
		color: "rgb(85,172,238)"//'rgb(11,218,81)'
	    },

	    {
		note: {
		    label:"Industrial Revolution",
		    title:"",
		    wrap: 120,
		},
		x: 338,
		y: 150,
		dy:-40,
		dx:-60,
		color: 'grey'
	    },
	    {
		note: {
		    label: "This band represents uncertainty. We can be 95% sure that the true average temperature lies within it.",
		    title:"",
		    wrap: 120,		    
		},
		x: 140,
		y: 130,
		dy: 20,
		dx: 0,
//		connector: { end: "arrow"},
		color: 'grey'
	    }
	].map(function(d){ return d})
	
	var makeAnnotations = d3.annotation()
	    .type(d3.annotationLabel)
	    .annotations(annotations);

	var svg = d3.select("#svg-holocene-temp")//abstract
	    .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	data.forEach(function(d) {
	    d.Age = -d.Age;  //abstract
	    d.Temp = +d.Temp; //abstract
	});

	_x.domain([-12050,0]); //abstract

	_y.domain([-1.2,2.2]); //abstract

	svg.append("line")
	    .attr("x1",10)
	    .attr("x2",340)
	    .attr("y1",82)
	    .attr("y2",82)
	    .attr("stroke-width","1px")
	    .attr("stroke","rgb(85,172,238)")
	    .attr("stroke-dasharray","5,5");

	svg.append("line")
	    .attr("x1",10)
	    .attr("x2",340)
	    .attr("y1",48)
	    .attr("y2",48)
	    .attr("stroke-width","1px")
	    .attr("stroke","rgb(11,218,81)")
	    .attr("stroke-dasharray","5,5");

	svg.append("line")
	    .attr("x1",10)
	    .attr("x2",340)
	    .attr("y1",15)
	    .attr("y2",15)
	    .attr("stroke-width","1px")
	    .attr("stroke","rgb(11,218,81)")
	    .attr("stroke-dasharray","5,5");

	svg.append("path")
	    .data([data])
	    .attr("class", "line3") //abstract path class
	    .attr("d", valueline);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
	//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline2);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline3);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline4);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline5);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline6);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline7);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline8);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline9);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline10);

	svg.append("path")
	    .data([data])
	    .attr("class", "uncertainty-line")
//	    .style("stroke-dasharray", ("3, 3"))
	    .attr("d", valueline11);

	svg.append("g")
	    .attr("class", "x-axis")
	    .attr("transform", "translate(0," + height + ")")
	    .call(d3.axisBottom(_x)
		  .ticks(5)
		  .tickFormat(d3.format("d"))
		 );
	
	svg.append("g").call(d3.axisLeft(_y).ticks(5)); //abstract ticks

	svg.append("text")
	    .attr("class", "y-axis")
	    .attr("transform","rotate(-90)")
	    .attr("y",0 + 15)
	    .attr("x",-14)
	    .style("text-anchor", "end")
	    .text("°C (relative to 1880-1920)")

	svg.append("text")
	    .attr("class", "y-axis")
//	    .attr("transform","rotate(-90)")
	    .attr("y",height - 10)
	    .attr("x",width)
	    .style("text-anchor", "end")
	    .text("Age (years before present)")


	svg.append("g")
	    .attr("class", "annotation-group")
	    .call(makeAnnotations)


	svg.append('g').attr("class","rectg")
	    .append("rect")
	    .attr("class","rect")
	    .attr("x",0)
	    .attr("y",0)
	    .attr("width",width + 10)
	    .attr("height",height)
	    .style("fill","white")
	    .style("stroke","none")
    }


    //helper library to have hidden rectangles transition out of view
    //when scrolling past non scrolly graphs
    appear({
	init: function init(){
	    console.log('dom is ready');
	},
	elements: function elements(){
	    // work with all elements with the class "track"
	    return document.getElementsByClassName('svg');
	},
	appear: function appear(el){
	    console.log('visible', el.getAttribute('id'));
	    var id = el.getAttribute('id');
	    d3.select("#"+id).select(".rect")
		.transition()
		.duration(transIn)
		.attr("x",width + 40);
	},
	disappear: function disappear(el){
	    console.log('no longer visible', el);
	    var id = el.getAttribute('id');
	    d3.select("#"+id).select(".rect")
		.transition()
		.duration(transOut)
		.attr("x",0);

	},
	    bounds: -100,
	    reappear: true
    });
   
    drawNotes();
}
