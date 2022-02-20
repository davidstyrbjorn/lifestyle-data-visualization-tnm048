import React, { useEffect } from "react";
import * as d3 from "d3"
import useD3  from "../../hooks/useD3";
import { setOriginalNode } from "typescript";
import availablePerson, {filteredPersonData} from "../../states/person-state";
import { useRecoilState, useRecoilValue } from "recoil";
import { line } from "d3";
import { lifestyle } from "../../types/types";
import { appendFileSync } from "fs";
import '../../styles/components/parallell-axis.scss';

// @TODO: Implement dynamic dates and attributes
// https://www.d3-graph-gallery.com/graph/parallel_basic.html

const ParallellAxisPlot: React.FC<{}> = () => {

    const data = useRecoilValue(filteredPersonData);

    // Update axis depending on data, useD3 handles like useEffect
    const ref = useD3((div: any) => {

        if (data.length !== 0) {
            // Drawing the canvas
            const margin = {top: 200, right: 50, bottom: 50, left: 50}
            const width = 600 - margin.left - margin.right;
            const height =  600 - margin.top - margin.bottom;
            d3.select("#plot")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("class", "p-axis-plot")
            .append("rect")
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("fill", "white")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            let svg = d3.select(".p-axis-plot");

            const attr = Object.keys(data[0].lifestyle[0]); // Getting keys from each entry

            // Removing date
            const attributes:string[] = []; 
            attr.forEach(function (item, index) {
                if (index > 0) {
                    attributes.push(attr[index]);
                }
            });

            // Creating linear scales for each attribute
            const y:any = {}
            for (var i = 0; i < attributes.length; i++) {
                const name = attributes[i]; // Getting names of attributes
                // Create linear scale for min/max values of each attribute
                y[name] = d3.scaleLinear()
                //@ts-ignore
                .domain(d3.extent(data[0].lifestyle, function(d) {return +d[name];}))
                .range([height, 0])
            }

            // Place axis for each attribute
            const x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(attributes)

            // Path drawing function which creates the lines between all attributes. Takes in lifestyle object(s) and returns a d3 line.
            //@ts-ignore
            function path(d:any) {
                //@ts-ignore
                return d3.line()(attributes.map(function(p:any) { return [x(p) /*Scale attributes to x-axis*/, y[p](d[p])/*Scale attribute values to y-axis*/]; }));
            }

            // Filter data to only include one day
            let res = data[0].lifestyle.filter(obj => {
                return obj.date === "2019-11-06"
              })
            
            // Draw lines
            svg
            .selectAll("myPath")
            //@ts-ignore
            .data(res)
            .enter().append("path")
            .attr("d", path)
            .style("fill", "none")
            .style("stroke", "blue")
            .attr("transform", "translate(" + 0 + "," + margin.top + ")");

            // Draw axis
            svg
            .selectAll("myAxis")
            .data(attributes).enter()
            .append("g")
            .attr("transform", function(d) { return "translate(" + x(d) + "," + margin.top + ")"; }) // Transalate axis to right position
            //@ts-ignore
            .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); }) 
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(function(d) { return d; })
            .style("fill", "black");

        }
    }, [data] )

    return (
        <div id = {"plot"} ref = {ref}>
            Test
        </div>
    );
} 

export default ParallellAxisPlot;