import React, { useEffect } from "react";
import * as d3 from "d3"
import useD3  from "../../hooks/useD3";
import { setOriginalNode } from "typescript";
import availablePerson, {filteredPersonData} from "../../states/person-state";
import { useRecoilState, useRecoilValue } from "recoil";
import { line } from "d3";

const ParallellAxisPlot: React.FC<{}> = () => {

    const data = useRecoilValue(filteredPersonData);

    // Update axis depending on data, useD3 handles like useEffect
    const ref = useD3((div: any) => {
        // Draw the canvas
        const margin = {top: 50, right: 50, bottom: 50, left: 50}
        const width = 600 - margin.left - margin.right;
        const height =  600 - margin.top - margin.bottom;
        d3.select("#plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let svg = d3.select("#plot");

        if (data.length !== 0) {
            const attr = Object.keys(data[0].lifestyle[0]); // Getting keys from each entry

            // Removing date
            const attributes:string[] = []; 
            attr.forEach(function (item, index) {
                if (index > 0) {
                    attributes.push(attr[index]);
                }
            });

            // https://www.d3-graph-gallery.com/graph/parallel_basic.html

            // Get min and max value of each attribute and create linear scales for each attribute
            const y:any = {}
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


            // Place axis for each attribute
            const x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(attributes)

            // Create data for drawing lines
            type lineData = [number, number][];
            const lineInfo:lineData = [];
            attributes.map(function(a) {
                lineInfo.push([
                    x(a) as number,
                    data[0].lifestyle[0][a as keyof Object] as unknown as number // Hehe
                ]);
            });

            console.log(lineInfo[0]);   

            // Draw lines
            svg.append("path")
                .datum(lineInfo)
                .attr("d", d3.line() 
                .x(function(d) {return d[0]})
                .y(function(d) {return d[1]})
                )
                .attr("stroke", "black");
            
        }
    }, [data] )



    return (
        <div id = {"plot"} ref = {ref}>
            Test
        </div>
    );
} 

export default ParallellAxisPlot;