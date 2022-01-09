const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

const colours = ["#9ACD32","#6B8E23", "#556B2F", "#66CDAA", 
                "#8FBC8B", "#20B2AA", "#008B8B", "#48C9B0"];

function getTheColor(exdicaprio, name) {
    let index = exdicaprio.indexOf(name);
     return colours[index];
 }

const width = 700;
const height = 500;
const margin = {
    top: 10,
    right: 10,
    botton: 40,
    left: 40
}

let ageDicaprio = [];
let exdicaprio = [];
const svg = d3.select("#chart").append("svg")
                .attr("id", "svg")
                .attr("width", width)
                .attr("height", height);
const elementGroup = svg.append("g")
                        .attr("id", "elementGroup")
                        .attr("transform", `translate(${margin.left}, ${margin.top})`);

let x = d3.scaleBand().range([0, width - margin.left - margin.right]).paddingInner(0.1).paddingOuter(0.1);
let y = d3.scaleLinear().range([height - margin.top - margin.botton, 0]);

const axisGroup = svg.append("g").attr("id", "axisGroup");
const xAxisGroup = axisGroup.append("g").attr("id", "xAxisGroup")
                                        .attr("transform", `translate(${margin.left}, ${height - margin.botton})`);
const yAxisGroup = axisGroup.append("g").attr("id", "yAxisGroup")
                                        .attr("transform", `translate(${margin.left}, ${margin.top})`);
const xAxis = d3.axisBottom().scale(x);
const yAxis = d3.axisLeft().scale(y);

d3.csv("data.csv").then(data => {

    data.map(d => {
        if (exdicaprio.indexOf(d.name) === -1) {
            exdicaprio.push(d.name);
          }
    });

    var Data = data
    Data.map(d => {
        d.year = +d.year;
        d.age = +d.age;
        d.ageDicap = age(d.year);
        d.color = getTheColor(exdicaprio, d.name);
    })

    x.domain(Data.map(d => d.year));
    y.domain([0,d3.max(Data.map(d => d.ageDicap))]);
  
    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    var elements = elementGroup.selectAll("rect").data(Data);
    elements.enter().append("rect")
                        .attr("id", d => d.name)
                        .attr("fill", d => d.color)
                        .attr("width", x.bandwidth())
                        .attr("height", d => height - margin.top - margin.botton - y(d.age))
                        .attr("x", d => x(d.year))
                        .attr("y", d => y(d.age))

    elementGroup.datum(Data).append("path")
        .attr("id", "Dicaprio")
        .attr("d", d3.line()
        .x(d => (x.bandwidth()/2) + x(d.year))
        .y(d => y(d.ageDicap)));
    elementGroup.selectAll("dot").data(Data)
        .enter().append("circle")
          .attr("cx", d => (x.bandwidth()/2) + x(d.year))
          .attr("cy", d => y(d.ageDicap))
          .attr("r", 3);
});