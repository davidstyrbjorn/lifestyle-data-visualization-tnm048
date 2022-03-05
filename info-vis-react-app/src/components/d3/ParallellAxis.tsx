import { Button, Checkbox } from '@mui/material';
import * as d3 from "d3";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import useD3 from "../../hooks/useD3";
import { attributeState } from "../../states/attribute-state";
import { filteredPersonData } from "../../states/person-state";
import '../../styles/components/parallell-axis.scss';
import { AVAILABLE_COLORS, lifestyle, person_data } from "../../types/types";
import getProperty from "../../util/get-property";

let showMissingData:boolean = false;
let showDatePicker:boolean = false;
let personDates:string[] = [];
let oldDate:string = "";
let currentDate:string = "";


const ParallellAxisPlot: React.FC<{}> = () => {

    const [missingData, setMissingData] = useState<number[]>([]); // Persons who have data missing on the selected date
    const data = useRecoilValue(filteredPersonData); // Person data
    const attributeData = useRecoilValue(attributeState); // Attribute data
    const [dateIndex, setDateIndex] = useState<number>(0);
    const [displayAverageDate, setDisplayAverageDate] = useState<boolean>(false);

    const colors = AVAILABLE_COLORS // Color list 


    // Update axis depending on data, useD3 handles like useEffect
    const ref = useD3((div: any) => {
        if (data.length !== 0) {

            showMissingData = true;
            showDatePicker = true;

            // Get selected attributes from attribute state
            const selectedAttributes: string[] = []; 
            attributeData.availableAttributes.map(function(val, idx) {
                if (attributeData.selectedAttributes.includes(idx)) {
                    selectedAttributes.push(val);
                }
            }); 

            const div_size: number[] = [div._groups[0][0].clientWidth, div._groups[0][0].clientHeight]

            

            // Drawing the canvas
            const margin = {top: 100, right: 50, bottom: 100, left: 50}
            const width = (div_size[0] * 0.9) - margin.left - margin.right;
            const height =  (div_size[1] * 0.9) - margin.top - margin.bottom;
            const padding = {top: 50, right: 50, bottom: 50, left: 200}


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

           
            let pd:Set<string> = new Set([]);  // Temporary set of dates to create union between all persons

			// Create linear scale with biggest span among all persons
            data.map(function(person, pidx){

                const setData:string[] = []; 
                person.lifestyle.map(function(o) {
                    setData.push(o.date);
                });

                // Create union of all dates among the persons
                const pDates:Set<string> = new Set(setData);
                // @ts-ignore
                const union = new Set([...pDates, ...pd]);
                pd = union;

                personDates = Array.from(pd);
                personDates.sort();

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
                    return d3.line()(selectedAttributes.map(function(p:any) { 
                        return [x(p) /*Scale attributes to x-axis*/, y[p](d[p])/*Scale attribute values to y-axis*/]; }));
                }

    
                
                // To flag if person should show to have missing data for date
                let noData = true;
                person.lifestyle.every(function(o) {
                    if (o.date === personDates[dateIndex]) {
                        noData = false;
                    }
                    return noData;
                })

                // Filter data to only include one day
                let res = person.lifestyle.filter(function(obj, oidx) {
                    if (obj.date === personDates[dateIndex]) {
                        return obj;
                    }
                })

                let averageValuesDict: Record<string, number> = {};

                if (displayAverageDate) {
                    selectedAttributes.forEach(function (attr, idx) {
                        const mean = d3.mean(person.lifestyle, (d) => getProperty(d, attr as keyof lifestyle) as number)!;
                        averageValuesDict[attr] = mean;
                    })
                }

                let drawRes;
                
                if (!displayAverageDate) {
                    drawRes = res;
                }
                else {
                    drawRes = []
                    drawRes[0] = averageValuesDict;
                }

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
                .append("g")
                //@ts-ignore
                .data(drawRes)
                .enter().append("path")
                .attr("d", path).attr("class", "line" + idx)
                .style("stroke-width", 2)
                .style("fill", "none")
                .style("stroke", colors[idx].primary)
                .style("opacity", 1.0)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                let tooltip_div = d3.select(".tooltip")
                .style("opacity", 0); 

                // Draw an extra transparent line with extra thickness to make hovering easier
                svg
                .selectAll("myPath")
                .append("g")
                //@ts-ignore
                .data(drawRes)
                .enter().append("path")
                .attr("d", path).attr("class", "line" + idx)
                .style("stroke-width", 15)
                .style("fill", "none")
                .style("stroke", "blue")
                .style("opacity", 0)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .on("mouseover", function(event: MouseEvent) {
                    d3.select(this).transition()
                        .duration(50)
                        .attr("opacity", "0.85");
                    tooltip_div.transition()
                        .duration(50)
                        .style("opacity", 1)
                        .style("left", (event.pageX + 10) + "px")
                        .style("top", (event.pageY - 15) + "px")
                    tooltip_div.html(`<p>${person.name.toUpperCase()}</p>`)
                })
                .on("mouseout", function() {
                    d3.select(this).transition()
                        .duration(50)
                        .attr("opacity", 1)
                    tooltip_div.transition()
                        .duration(50)
                        .style("opacity", 0)
                })

                svg.selectAll(".axis").remove();

                // Draw axis
                svg
                .selectAll("myAxis")
                .data(selectedAttributes).enter()
                .append("g")
                //@ts-ignore
                .attr("transform", function(d) { return "translate(" + (x(d) + margin.left) + "," + margin.top + ")"; }) // Transalate axis to right position
                //@ts-ignore
                .each(function(d) { d3.select(this).attr("class", "axis").call(d3.axisLeft().scale(y[d])); })
                .append("text")
                .style("text-anchor", "middle")
                .attr("y", -9)
                .attr("class", "axis-text")
                .text(function(d) { return d; });
			});

        }

    }, [data, attributeData, dateIndex, displayAverageDate] ) // Update plot depending on person, attributes and date

    // Update date on person change, picks next closest date to last chosen date if last chosen date does not exist in new date list
    useEffect(() => {

        if (data.length !== 0) {
            if (oldDate === "") {
                currentDate = personDates[0];
                oldDate = currentDate; 
            }
            else {
                if (personDates.includes(oldDate)) {
                    let index = personDates.indexOf(oldDate);
                    currentDate = personDates[index]; 
                    oldDate = currentDate;
                }
                else {
                    for (let i = 0; i < personDates.length; i++) {
                        if (personDates[i] === oldDate) {
                            currentDate = personDates[i];
                            break;
                        }
                        else if (personDates[i] > oldDate) {
                            currentDate = personDates[i];
                            break;
                        }
                    }
                }
            }
        }
        setDateIndex(personDates.indexOf(currentDate));
    
    },[data])   

    function incrementDate() {
        console.log(personDates);
        console.log(personDates[dateIndex]);
        if (dateIndex < personDates.length) {
            setDateIndex(dateIndex + 1);
            oldDate = personDates[dateIndex];
        }
    }

    function decrementDate() {
        if (dateIndex > 0) {
            setDateIndex(dateIndex - 1);
            oldDate = personDates[dateIndex];
        }
    }

    function toggleAverage() {
        let tmp:boolean = displayAverageDate;
        tmp = !tmp;
        setDisplayAverageDate(tmp);
    }

    return (
        <div className="Visualization">

            <div id = {"plot"} ref = {ref}>
                    <div className={'tooltip'}></div>
            </div>

            <div className="bottom">
                <div className='p-legend'>
                        {data.map((person: person_data, idx: number) => {
                            return (
                                <div className='legend-entry' key={idx}>
                                    <div style={{
                                        backgroundColor: AVAILABLE_COLORS[idx].primary,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 5
                                    }}></div>
                                    <p className="InfoText"> &nbsp; {person.name}</p>
                                </div>
                            );
                        })}
                </div>
            
                <div className="graph-acessories-date">
                    <div className="toggle-average">
                        <div id="toggle-average-button">
                            <Checkbox checked={displayAverageDate} onChange={toggleAverage}/>
                            {!displayAverageDate && <p className="InfoText"> Show average attribute values </p>}
                        </div>
                        <div className="date-display">
                            {displayAverageDate && <p className="InfoText"> Showing average attribute values from &nbsp;</p> }
                            {!displayAverageDate && <p className="InfoText"> &nbsp; from &nbsp;</p>}
                            <p className="InfoText">{personDates[0]}</p>
                            <p className="InfoText">&nbsp; to &nbsp;</p>
                            <p className="InfoText">{personDates[personDates.length - 1]} </p>
                        </div>
                    </div>

                    {!displayAverageDate &&
                    <div className="GraphInfo">
                            {showMissingData &&
                            <div className="MissingData">
                                <div id="MissingPersons"> 
                                    <p className="InfoText">Person &nbsp;</p>
                                        {
                                            missingData.map((v: number, idx) => <p className="InfoText" key={idx}>{v + 1} &nbsp; </p>)
                                        }
                                    <p className="InfoText">
                                        is missing data at this date
                                    </p>
                                </div>
                            </div>
                            }
                            {showDatePicker &&
                                <div className="Datepicker">
                                    <Button variant="contained" className="DateButton" onClick={decrementDate}> Previous </Button> 
                                        <p className="DateText"> {personDates[dateIndex]} </p>
                                    <Button variant="contained" className="DateButton" onClick={incrementDate}> Next </Button>
                                </div>
                            }
                    </div> }
                </div>
            </div>
        </div>

    );
} 

export default ParallellAxisPlot;