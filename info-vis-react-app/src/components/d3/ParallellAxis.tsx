import React from "react";
import * as d3 from "d3"
import useD3  from "../../hooks/useD3";
import { setOriginalNode } from "typescript";

const ParallellAxisPlot: React.FC<{}> = () => {
    const ref = useD3((svg: any) => {
        const margin = {top: 50, right: 50, bottom: 50, left: 50}
        const width = 600 - margin.left - margin.right;
        const height =  600 - margin.top - margin.bottom;
        d3.select("plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", width + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const data = require("../../p01.json");
        console.log(data["life-style"]);
        const dimensions = Object.keys(data["life-style"][0]["date"]);
        console.log(dimensions);
        const sortedData = data["life-style"].sort((a: any, b: any) => a.fatigue - b.fatigue);
        console.log(sortedData);
        const min = data["life-style"].reduce(function (prev: any, curr: any) {
            return prev.fatigue < curr.fatigue ? prev : curr;
        });
        console.log(min.fatigue);
        const y = {}

        // https://www.d3-graph-gallery.com/graph/parallel_basic.html
        for (const i in dimensions) {
            const name = dimensions[i];


            // y[name] = d3.scaleLinear()
            // .domain(d3.extent)
        }
    }, [] )


    return (
    
        <svg ref = {ref}>
            <div id = "plot">
                Test
            </div>
        </svg>
    );

    
} 

export default ParallellAxisPlot;