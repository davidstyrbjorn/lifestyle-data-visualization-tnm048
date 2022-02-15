import React, { useEffect } from "react";
import * as d3 from "d3"
import useD3  from "../../hooks/useD3";
import { setOriginalNode } from "typescript";
import availablePerson, {filteredPersonData} from "../../states/person-state";
import { useRecoilState, useRecoilValue } from "recoil";

const ParallellAxisPlot: React.FC<{}> = () => {

    const data = useRecoilValue(filteredPersonData);

    // Update axis depending on data, useD3 handles like useEffect
    const ref = useD3((svg: any) => {
        // Draw the canvas
        const margin = {top: 50, right: 50, bottom: 50, left: 50}
        const width = 600 - margin.left - margin.right;
        const height =  600 - margin.top - margin.bottom;
        d3.select("plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (data.length !== 0) {
            console.log("D3", data);
            const attributes = Object.keys(data[0].lifestyle[0]);
            const y:any = {}
            // https://www.d3-graph-gallery.com/graph/parallel_basic.html
            for (var i = 1; i < attributes.length; i++) {
                const name = attributes[i]; // Getting names of attributes
                const min:any = data[0].lifestyle.reduce(function (prev: any, curr: any) {
                    return prev[name] < curr[name] ? prev : curr;
                });
                const max:any = data[0].lifestyle.reduce(function (prev: any, curr: any) {
                    return prev[name] > curr[name] ? prev : curr;
                });
                y[name] = d3.scaleLinear()
                .domain([min, max])
                .range([height, 0])
            }
            console.log(y)
        }
    }, [data] )



    return (
        <div>

        </div>
        /*
        <svg ref = {ref}>
            <div id = "plot">
                Test
            </div>
        </svg>*/
    );
} 

export default ParallellAxisPlot;