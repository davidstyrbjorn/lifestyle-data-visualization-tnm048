import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { RecoilState, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import useD3 from "../../hooks/useD3";
import { filteredPersonData } from "../../states/person-state";
import '../../styles/components/parallell-axis.scss';
import { attributeState } from "../../states/attribute-state";
import { lifestyle } from "../../types/types";

let showMissingData:boolean = false; // To not render missingdata from undefined

const ParallellAxisPlot: React.FC<{}> = () => {

    const [missingData, setMissingData] = useState<number[]>([]); // Persons who have data missing on the selected date
    const data = useRecoilValue(filteredPersonData); // Person data
    const attributeData = useRecoilValue(attributeState); // Attribute data

    const colors:string[] = ["#fc0b03", "#fc8403", "#fcf803", "#7bfc03", "#007804", "#00fbff", "#004cff", "#4c00ff"]; // Color list 

    // Update axis depending on data, useD3 handles like useEffect
    const ref = useD3((div: any) => {
        console.log("Main hook", missingData);
        if (data.length !== 0) {

            showMissingData = true;

            // Get selected attributes from attribute state
            const selectedAttributes: string[] = []; 
            attributeData.availableAttributes.map(function(val, idx) {
                if (attributeData.selectedAttributes.includes(idx)) {
                    selectedAttributes.push(val);
                }
            }); 

            // Drawing the canvas
            const margin = {top: 200, right: 50, bottom: 50, left: 50}
            const width = 600 - margin.left - margin.right;
            const height =  600 - margin.top - margin.bottom;

            // Only draw background if no previous plot exists
            let previous_svg: any = document.getElementsByClassName('p-axis-plot');
            if (previous_svg.length === 0) {
                d3.select("#plot")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "p-axis-plot")

                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            }

            let svg = d3.select(".p-axis-plot");
            svg.selectAll("*").remove(); // Clear previous plot on redraw

            // Place axis for each attribute
            const x = d3.scalePoint()
            .range([0, width])
            .padding(1)
            .domain(selectedAttributes)

			// Variables for linear scale, used in draw mapping as well
			const y:Record<string,d3.ScaleLinear<number, number, never>> = {}
			const selectedAttributesMax:number[] = [];
			const selectedAttributesMin:number[] = [];
			let maxY;
			let minY; 
            let personDates:string[] = []; // List of selectable dates

			// Create linear scale with biggest span among all persons
            data.map(function(person, pidx){

                // Choosing the largest date span among all persons
                if (personDates.length === 0) {
                    person.lifestyle.map(function(o) {
                        personDates.push(o.date);
                    });
                }
                else if (person.lifestyle.length > personDates.length) {
                    personDates = [];
                    person.lifestyle.map(function(o) {
                        personDates.push(o.date);
                    });
                }

                for (let i = 0; i < selectedAttributes.length; i++) {
                    const name = selectedAttributes[i]; // Getting names of attributes

                    // Create linear scale for min/max values of each attribute
                    maxY =  Math.max.apply(Math, person.lifestyle.map(function(o) {
						return (o as any)[name];
					}));
					
					minY =  Math.min.apply(Math, person.lifestyle.map(function(o) {
						return (o as any)[name];
					}));

                    if (selectedAttributesMax.length < i + 1) { // First entry
						selectedAttributesMax[i] = maxY;
                    } else if (maxY > selectedAttributesMax[i]) {
                        selectedAttributesMax[i] = maxY;
                    }

					if (selectedAttributesMin.length < i + 1) { // First entry
						selectedAttributesMin[i] = minY;
                    } else if (minY < selectedAttributesMin[i]) {
                        selectedAttributesMin[i] = minY;
                    }
                     
					y[name] = d3.scaleLinear()
					.domain([selectedAttributesMin[i], selectedAttributesMax[i]])
					.range([height, 0])

                }
                
            });


            let missingDataNew:number[] = []; // Helper variable to update missingData

			// Draw lines for each person
			data.map(function(person, idx){

				// Path drawing function which creates the lines between all attributes. Takes in lifestyle object(s) and returns a d3 line.
                function path(d:any) {
                    // @ts-ignore
                    return d3.line()(selectedAttributes.map(function(p:any) { return [x(p) /*Scale attributes to x-axis*/, y[p](d[p])/*Scale attribute values to y-axis*/]; }));
                }
                
                // To flag if person should show to have missing data for date
                let noData = true;
                person.lifestyle.every(function(o) {
                    if (o.date === personDates[0]) {
                        noData = false;
                    }
                    return noData;
                })

                // Filter data to only include one day
                let res = person.lifestyle.filter(function(obj, oidx) {
                    if (obj.date === personDates[0]) {
                        console.log(obj.date);
                        return obj;
                    }
                })

                if (noData) {
                    missingDataNew.push(idx);
                }

                // Update missingData using helper variable
                setMissingData(missingDataNew);

				// Remove lines with old scales
				svg.selectAll(".line" + idx).remove();
                
                // Draw new lines
                svg
                .selectAll("myPath")
                //@ts-ignore
                .data(res)
                .enter().append("path")
                .attr("d", path).attr("class", "line" + idx)
                .style("fill", "none")
                .style("stroke", colors[idx])
                .attr("transform", "translate(" + 0 + "," + margin.top + ")");
                
                svg.selectAll(".axis").remove();

                // Draw axis
                svg
                .selectAll("myAxis")
                .data(selectedAttributes).enter()
                .append("g")
                .attr("transform", function(d) { return "translate(" + x(d) + "," + margin.top + ")"; }) // Transalate axis to right position
                //@ts-ignore
                .each(function(d) { d3.select(this).attr("class", "axis").call(d3.axisLeft().scale(y[d])); })
                .style("fill", "white") 
                .append("text")
                .style("text-anchor", "middle")
                .style("fill", "white") 
                .attr("y", -9)
                .text(function(d) { return d; })
                .style("fill", "white");
			});

        }

    }, [data, attributeData] ) // Update plot depending on person, attributes (TODO: on date)

    return (
        <div>
            <div id = {"plot"} ref = {ref}>
            </div>

            {showMissingData &&
            <div className="MissingData">
                <div id="MissingPersons"> 
                    <ol>
                        {
                            missingData.map((v: number, idx) => <p key={idx}>{v}</p>)
                        }
                    </ol>
                    <p>
                        is missing data at this date
                    </p>
                </div>
            </div>
            }
        </div>
    );
} 

export default ParallellAxisPlot;