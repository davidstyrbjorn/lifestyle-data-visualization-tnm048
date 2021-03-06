import { Button, Slider } from '@mui/material';
import { Box } from '@mui/system';
import * as d3 from 'd3';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { attributeState } from "../../states/attribute-state";
import { filteredPersonData } from '../../states/person-state';
import '../../styles/components/line-plot.scss';
import '../../styles/components/spider-plot.scss';
import { AVAILABLE_COLORS, lifestyle, person_data } from '../../types/types';
import { makeAttributePresentable } from "../../util/attribute-util";

let animating:boolean = false; // Evil "semi-global" variable to handle animations

// With inspiration from this tutorial: https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
const SpiderPlot: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);
    const data = useRecoilValue(filteredPersonData);

    const [sliderValue, setSliderValue] = useState<number>(0.0);
    const [buttonLabel, setButtonLabel] = useState("Play");
    const attributeData = useRecoilValue(attributeState);

    // Grab the browser window size
    const window_size = useWindowDimensions();

    const handleButtonPress = () => {
        animating = !animating;
        if(animating) {
            setButtonLabel("Stop");
            animateSlider();
        }
    }

    // Animate the slider and plot
    async function animateSlider() {
        let sliderVal = sliderValue;
        while(sliderVal < 0 && animating) {
            setSliderValue(++sliderVal);

            // Wait half second
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        animating = false;
        setButtonLabel("Play");
    }
    // Clear the spider plot svg
    const clearPlot = () => {
        d3.select('#spider_viz')
            .selectAll("*")
            .remove();
    }

    // Set the dimensions and margins of the graph
    let margin = { top: 100, right: 0, bottom: 0, left: 100 },
        strokeWidth = 2;

    let currentDate: string = "";

    // Find domain for dates, mostly same as how it works in LinePlot. Maybe move this somewhere where
    // it can be accessed by all plots?
    let date_strings: string[] = []; // save as string since it easier to compare (they all share same format)

    // Process data beforehand
    let personDataCopy = [...personData];
    let lifestyleResults: lifestyle[][] = [];

    // Get selected attributes from attribute state
    const attributes: string[] = [];
    const formattedAttributes: string[] = [];

    attributeData.availableAttributes.map(function (val, idx) {
        let formatted = makeAttributePresentable(val);
        if (attributeData.selectedAttributes.includes(idx)) {
            attributes.push(val);
            formattedAttributes.push(formatted);
        }
    });

    if (personData.length > 0) {
        // Grab the personData with the most entries!
        personDataCopy.sort((a, b) => a.lifestyle.length < b.lifestyle.length ? 1 : -1)
            .at(0)!
            .lifestyle.forEach((e, idx) => {
                date_strings.push(e.date);
            });

        data.forEach(function (person, index) {
            let filteredData = data[index]!.lifestyle.filter(obj => {

                // Get correct index from slider
                let entries = date_strings.length;
                let dateIdx = entries + sliderValue - 1;

                let dateResult = date_strings[dateIdx];
                currentDate = dateResult;

                // Get current date from slider
                return obj.date === dateResult;
            })
            lifestyleResults.push(filteredData);
        });
    }

    // Variables for linear scale, used in draw mapping as well
    const attribScales: d3.ScaleLinear<number, number, never>[] = [];
    const selectedAttributesMax: number[] = [];
    const selectedAttributesMin: number[] = [];

    // Create linear scale with biggest span among all persons
    data.map(function (person, pidx) {
        // Should base domain on 31 last entries.
        let shortenedLifestyle = person.lifestyle.slice(Math.max(person.lifestyle.length - 31, 0));

        for (let i = 0; i < attributes.length; i++) {
            const name = attributes[i]; // Getting names of attributes
            // Create linear scale for min/max values of each attribute

            let maxY = Math.max.apply(Math, shortenedLifestyle.map(function (o) {
                return (o as any)[name];
            }));

            let minY = Math.min.apply(Math, shortenedLifestyle.map(function (o) {
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

            let scale = d3.scaleLinear()
                .domain([selectedAttributesMin[i], selectedAttributesMax[i]])
                .range([1, 5]);

            attribScales[i] = scale;
        }
    });

    console.log(attribScales.length);

    const ref = useD3((div: any) => {

        // set the dimensions and margins of the graph
        const width = (window_size.width * 0.7);
        const height = (window_size.height * 0.7);

        // Center of spider plot circles
        let center = { x: width / 2, y: height / 2 };

        // Make space for new plot
        clearPlot();

        // Return if no person is selected
        if (personData.length === 0 || !data[0]) return;

        else {
            // If we haven't added the svg before
            let previous_svg: any = document.getElementsByClassName('spider-plot-svg');
            if (previous_svg.length === 0) {
                d3.select('#spider_viz')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'spider-plot-svg')
            }

            let spiderPlotSvg = d3.select('.spider-plot-svg');

            // Linear range with values ranging from 0-5
            let domainRange = { min: 0, max: 5 };
            let radialScale = d3.scaleLinear()
                .domain([domainRange.min, domainRange.max])
                .range([0, height / 4]);

            // Tick values displayed along circle border
            let ticks = [1, 2, 3, 4, 5];

            // Add circles representing values 1-5
            ticks.forEach(tick => (
                spiderPlotSvg.append("circle")
                    .attr("cx", center.x)
                    .attr("cy", center.y)
                    .attr("fill", "none")
                    .attr("stroke", "azure")
                    .attr("stroke-width", strokeWidth)
                    .attr("r", radialScale(tick))
            ));

            // Converts from polar coordinates to cartesian
            const angleToCoord = (angle: number, value: number): [number, number] => {
                let r = radialScale(value);
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);
                return [center.x + x, center.y - y];
            }

            // Amount of attributes
            let length = attributes.length;

            // Given a lifestyle, return list of coordinate pairs for the path
            const getPathForData = (d: lifestyle): [number, number][] => {
                // List of coordinate pairs
                const coordinates: [number, number][] = [];
                attributes.forEach(function (item, index) {
                    let angle = (2 * Math.PI * index / length) + (Math.PI / 2);

                    //@ts-ignore
                    let dataVal = attribScales[index](d[item]);
                    coordinates.push(angleToCoord(angle, dataVal));
                });
                return coordinates;
            }

            attributes.forEach(function (attribute, index) {
                let angle = (2 * Math.PI * index / length) + (Math.PI / 2);
                let [textX, textY] = angleToCoord(angle, domainRange.max + 3);
                let [lineCoordX, lineCoordY] = angleToCoord(angle, domainRange.max);

                // Text fields marking the different attribute names
                spiderPlotSvg.append("text")
                .attr("text-anchor", "middle")
                .attr("x", textX)
                .attr("y", textY)
                .attr("fill", "azure")
                .text(formattedAttributes[index]);

                // Draw lines from center to edges of spider plot
                spiderPlotSvg.append("line")
                .attr("x1", center.x)
                .attr("y1", center.y)
                .attr("x2", lineCoordX)
                .attr("y2", lineCoordY)
                .attr("stroke", "azure")
                .attr("stroke-width", strokeWidth);
            });


            lifestyleResults.forEach(function (entry, entryIndex) {

                if (lifestyleResults[entryIndex].length < 1) {
                    return; // @TODO: Display error message if this happens
                }

                attributes.forEach(function (attribute, index) {
                    let angle = (2 * Math.PI * index / length) + (Math.PI / 2);

                    // Draw nodes at path points.
                    spiderPlotSvg.selectAll('spiderPlotNodes')
                        .data(lifestyleResults[entryIndex])
                        .enter()
                        .append('circle')
                        .attr('fill', AVAILABLE_COLORS[entryIndex].primary)
                        .attr('stroke', 'none')
                        //@ts-ignore
                        .attr('cx', (d) => angleToCoord(angle, attribScales[index](d[attribute]))[0])
                        //@ts-ignore
                        .attr('cy', (d) => angleToCoord(angle, attribScales[index](d[attribute]))[1])
                        .attr('r', radialScale(0.25)) // Base on scale used for surrounding circles
                        .attr('z-index', 2);

                    // Label circles with tick values
                    ticks.forEach(tick => (
                        spiderPlotSvg.append("text")
                            .attr("fill", "white")
                            .attr("font-size", radialScale(0.35))
                            .attr("x", angleToCoord(angle, tick)[0])
                            .attr("y", angleToCoord(angle, tick)[1])
                            .attr("text-anchor", "middle")
                            .text(attribScales[index].invert(tick))
                    ));

                });
                
                let line = d3.line()
                    .x(d => d[0])
                    .y(d => d[1]);

                let coordinates = getPathForData(lifestyleResults[entryIndex][0]);
                spiderPlotSvg.append("path")
                    .datum(coordinates)
                    .attr("d", line)
                    .attr("fill", AVAILABLE_COLORS[entryIndex].primary)
                    .attr("stroke-opacity", 1)
                    .attr("opacity", 0.2);
            });

        }


    }, [personData, sliderValue, attributes]);

    const handleSliderChange = (_e: Event, v: number | number[], _activeThumb: number) => {
        // Return if the incoming value is NOT an array, something is wrong from the component side
        if (Array.isArray(v)) {
            console.error("SOMETHING WRONG IN LINE-PLOT SLIDER handleSliderChange(...)!!!");
            return;
        }
        //console.log(v);
        // Update the value
        setSliderValue(v);
    }

    if (personData.length < 1 || !data[0]) {
        clearPlot();
        return <div className='fallback-container'>
            <h1 className="fallback-text">Could not display plot for this selection</h1>
        </div>
    }
    return (
        <div id='spiderRoot'>
            <div ref={ref} id={'spider_viz'}></div>
            <div id="bottom-area-spider">
                <div className='legend'>
                    {personData.map((person: person_data, idx: number) => {
                        return (
                            <div className='legend-entry' key={idx}>
                                <div style={{
                                    backgroundColor: AVAILABLE_COLORS[idx].primary,
                                    width: 24,
                                    height: 24,
                                    borderRadius: 5
                                }}></div>
                                <p>{person.name}</p>
                            </div>
                        );
                    })}
                </div>
                <div className={'slider-area'}>
                    <Box
                        margin={'auto'}
                        width="50%"
                    >
                        <p className='slider-title'>Current date: {currentDate}</p>
                        <Slider
                            getAriaLabel={() => 'Date slider'}
                            value={sliderValue}
                            onChange={handleSliderChange}
                            disabled={animating}
                            min={-30}
                            step={1}
                            max={0}
                            valueLabelDisplay="auto"
                        />
                        <div id = "play-button-area">
                            <Button className="button" variant="outlined"
                                onClick={() => handleButtonPress()}>{buttonLabel}</Button>
                        </div>
                    </Box>
                </div>
            </div>
        </div>
    );
}

export default SpiderPlot;