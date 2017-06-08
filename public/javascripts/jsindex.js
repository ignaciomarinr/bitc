// get the data
// get the data

// d3.csv("bin/prueba.csv", function(error, links) {
d3.csv("csv", function(error, links) {

    var nodes = {};
    var id = document.getElementById("sacaValor").getAttribute('value');
    console.log("ID: "+ id)

    var units = "Widgets";

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function(d) { return formatNumber(d); },
        color = d3.scale.category20();


// Compute the distinct nodes from the links.
    links.forEach(function(link) {
        link.source = nodes[link.source] ||
            (nodes[link.source] = {name: link.source});
        link.target = nodes[link.target] ||
            (nodes[link.target] = {name: link.target});
        link.value = +link.value;
    });



  //  var width = 1280,
    //    height = 667;

    var width = screen.width,
        height = screen.height;

    var force = d3.layout.force()
        .nodes(d3.values(nodes))
        .links(links)
        .size([width, height])
        .linkDistance(80)
        .charge(-300)
        .on("tick", tick)
        .start();

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

// var link = svg.append("g").selectAll(".link");
// link.append("title")
//         .text(function(d) {
//             return d.target.name; });


// build the arrow.
    svg.append("svg:defs").selectAll("marker")
        .data(["end"])      // Different link/path types can be defined here
        .enter().append("svg:marker")    // This section adds in the arrows
        .attr("id", String)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 15)
        .attr("refY", -1.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("svg:path")
        .attr("d", "M0,-5L10,0L0,5");

// add the links and the arrows
    var path = svg.append("svg:g").selectAll("path")
        .data(force.links())
        .enter().append("svg:path")
        .attr("class", function(d) { return "link " + d.type; })
        .attr("class", "link")
        .attr("marker-end", "url(#end)")
        .text(function(d) {  console.log("solotext"); return format(d.value); })
        .on("mouseover", function(d){
            var g = d3.select(this);
            var info =g.append("svg:title")
                .classed('info', true)
                .attr("x", 12)
                .attr("dy", ".35em")
                .text(function(d) {  console.log("LINK:" + format(d.value)); return format(d.value); });
        });

// define the nodes
    var node = svg.selectAll(".node")
        .data(force.nodes())
        .enter().append("g")
        .attr("class", "node")
        .call(force.drag)
        .on("mouseover", function(d){
            var g = d3.select(this);
            var info =g.append('text')
                .classed('info', true)
                .attr("x", 12)
                .attr("dy", ".35em")
                .text(function(d) { return d.name; });
        })
        .on("mouseout", function(d){
            d3.select(this).select("text").remove();
        });

// add the nodes
    node.append("circle")
        .attr("r", 5)
        .style("fill", function(d, i) {
            console.log("DENTRO DE JSINDEX: "+ id);
            if(d.name == id) return  "red";

        });

    var drag = force.drag()
        .on("dragstart", function(d) {
            d3.select(this).classed("fixed", d.fixed = true);
        });



// add the curvy lines
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = 0; //Math.sqrt(dx * dx + dy * dy);
            return "M" +
                d.source.x + "," +
                d.source.y + "A" +
                dr + "," + dr + " 0 0,1 " +
                d.target.x + "," +
                d.target.y;
        });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; });
    }

});