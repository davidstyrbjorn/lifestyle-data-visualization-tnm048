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
        var svg:any = d3.select("plot")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        if (data.length !== 0) {
            console.log("D3", data);
            const attr = Object.keys(data[0].lifestyle[0]); // Getting keys from each entry
            // Removing date
            const attributes:string[] = []; 
            attr.forEach(function (item, index) {
                if (index > 0) {
                    attributes.push(attr[index]);
                }
            });


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

            const x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(attributes)

            const lineData: [any, any][] = [];
            

            attributes.map(function(a) {
                lineData.push([
                    x(a),
                    data[0].lifestyle[0][a as keyof Object]
                ]);
            });

            console.log(lineData);
            /*function path(d) {
                return d3.line()(attributes.map( 
                function(a) { console.log(x(a)); return [x(a), data[0].lifestyle[0][a as keyof Object]];}));
            }*/

            /*svg
            .selectAll("myPath")
            .data(data)
            .enter().append("path")
            .attr("d",  path)
            .style("fill", "none")
            .style("stroke", "#69b3a2")
            .style("opacity", 0.5)*/
            
        }
    }, [data] )



    return (
        <div>

        </div>
        /*
        <div id = "plot" ref = {ref}>
            Test
        </div>
        */
    );
} 

export default ParallellAxisPlot;