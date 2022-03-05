import { Slider } from '@mui/material';
import * as d3 from 'd3';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import attributeState from '../../states/attribute-state';
import { filteredPersonData } from '../../states/person-state';
import '../../styles/components/line-plot.scss';
import { AVAILABLE_COLORS, lifestyle, person_data } from '../../types/types';
import getProperty from '../../util/get-property';

const MIN_SLIDER_DIST = 0.05;

const LinePlotD3: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);
    const attributeData = useRecoilValue(attributeState);
    const [sliderValue, setSliderValue] = useState<number[]>([0.0, 0.3]);
    const [minMaxDate, setMinMaxDate] = useState<string[]>(['1', '2']);

    // Grab the browser window size
    const window_size = useWindowDimensions();

    // d3 helper function
    const make_y_gridlines = (y_scale: any): d3.Axis<d3.AxisDomain> => {
        return d3.axisLeft(y_scale).ticks(y_scale.ticks().length);
    }

    // Returns the current span that the slider knobs cover
    const getSliderDistance = (values: number[]): number => {
        return Math.abs(values[1] - values[0]);
    }

    const ref = useD3((_div: any) => {
        if(personData.length <= 0) return;
        if(attributeData.selectedAttributes.length === 0) return;

        // set the dimensions and margins of the graph
        const width = (window_size.width * 0.6);
        const height = (window_size.height * 0.6);
        const margin = {
            top: 20,
            right: 10,
            bottom: 20,
            left: 50
        };
        
        // If we haven't added the svg before
        let previous_svg: any = document.getElementsByClassName('line-plot-svg');
        if(previous_svg.length === 0){
            d3.select('.visualization-area')
                .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'line-plot-svg')
        }

        let svg = d3.select('.line-plot-svg');
        svg.selectAll("*").remove();
        
        // Grab the selected attribute variable
        const attributeString = attributeData.availableAttributes[attributeData.selectedAttributes[0]] as keyof lifestyle;
        let date_strings: string[] = []; // save as string since it easier to compare (they all share same format)
        
        let personDataCopy = [...personData];
        // Grab the personData with the most entries!
        personDataCopy.sort((a, b) => a.lifestyle.length < b.lifestyle.length ? 1 : -1)
            .at(0)!
            .lifestyle.forEach((e, idx) => {
                date_strings.push(e.date);
            });

        // Initial maxY and minY! We will later go through and grab the max-maxY from every person
        let maxY = d3.max(personDataCopy.at(0)!.lifestyle, 
            (d) => getProperty(d, attributeString) as number)!;
        let minY =  d3.min(personDataCopy.at(0)!.lifestyle, 
            (d) => getProperty(d, attributeString) as number)!;
        let doMinMax = true;
        // For some attributes we can just directly assign maxY and minY
        if(attributeString === 'fatigue' || attributeString === 'mood'
            || attributeString === 'sleep_quality' || attributeString === 'stress')
        {
            minY = 0;
            maxY = 5;
            doMinMax = false;
        }
        else if(attributeString === 'readiness') {
            minY = 0;
            maxY = 10;
        }   

        // create a time parser function to make our dates into D3 format
        let timeParser = d3.timeParse("%Y-%m-%d");
        
        // Do a dates union of all available dates
        // Perform the union from all other selected persons
        // Also here we make sure to extract min of min and max of max for the attributeValu
        for(let i = 1; i < personDataCopy.length; i++){
            personDataCopy.at(i)!.lifestyle.forEach((e) => {
                // Does the date not exist in the big list? Add it!
                if(date_strings.findIndex((d) => d === e.date) === -1){
                    date_strings.push(e.date);
                }
            });

            // See logic where we declare minY and maxY variables
            if(doMinMax) {
                // Perform min/max calculations
                let localMaxY = d3.max(personDataCopy.at(i)!.lifestyle, 
                    (d) => getProperty(d, attributeString) as number)!;
                let localMinY = d3.min(personDataCopy.at(i)!.lifestyle, 
                    (d) => getProperty(d, attributeString) as number)!;

                // Assignment if we are below/above current value
                maxY = localMaxY > maxY ? localMaxY : maxY;
                minY = localMinY < minY ? localMinY : minY;
            }
        }

        // Finally collect all date union-strings and parse them into Date objects
        let dates: Date[] = [];
        date_strings.forEach((date_string) => {
            dates.push(timeParser(date_string)!);
        });

        // Sort the dates and cut-off based on the slider input
        dates = dates.sort((d1,d2) => d1 > d2 ? 1 : -1);
        dates = dates.filter((_d, idx) => {
            let relative = idx / dates.length;
            return (relative >= sliderValue[0] && relative <= sliderValue[1])
        });

        // Create the x-scale
        const [d1, d2] = d3.extent(dates)!; // Get min and max
        let x = d3.scaleTime()
            .domain([d1!, d2!])
            .range([margin.left, width - margin.right]);
        let xAxis = d3.axisBottom(x);

        // Create the y-scale
        let y = d3.scaleLinear()
            .domain([minY!, maxY!])
            .range([height - margin.top, margin.bottom])
        let yAxis = d3.axisLeft(y);
        
        // Now add the grid!
        svg.append('g')
            .attr('class', 'grid')
            .attr("transform", `translate(${margin.left}, ${0})`)
            .call(make_y_gridlines(y)
                .tickSize(-width)
                // @ts-ignore
                .tickFormat("")
            );

        // Add the x-scale to DOM
        svg.append("g")
            .attr('class', 'axis-x')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis.ticks(8));

        // Add the y-scale to DOM
        svg.append("g")
            .attr('class', 'axis-y')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis)

        // Select the tooltip div, used in the for loop below
        let tooltip_div = d3.select('.tooltip')
            .style('opacity', 0);

        // Now iterate over each person and add data to the plot 
        personData.forEach((p_data: person_data, idx: number) => {
            // const data = p_data.lifestyle;

            // Filter the data based on date
            const data = p_data.lifestyle.filter((entry: lifestyle) => {
                const d = timeParser(entry.date)!;
                return d >= d1! && d <= d2!;
            })

            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', AVAILABLE_COLORS[idx].primary)
                .attr('stroke-width', 3.5)
                // Add some tooltip interaction to the lines
                .on('mouseover', (event: MouseEvent) => {
                    const X = event.pageX; 
                    const Y = event.pageY - 120;
                    const content = `
                        <h4>${p_data.name}</h4> 
                    `;
                    showTooltip(tooltip_div, content, X, Y);
                })
                .on('mouseout', (_d) => {
                    tooltip_div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                })
                .attr('d', d3.line<lifestyle>()
                    .x(function(d: lifestyle) {return (x(timeParser(d.date)!))})
                    .y(function(d: lifestyle) {return y(getProperty(d, attributeString) as number)})
                    // .curve(d3.curveMonotoneX)
                
            );

            // Now add all our dots
            svg.selectAll('myCircles')
            .data(data)
            .enter()
            .append('circle')
                .attr('fill', AVAILABLE_COLORS[idx].primary)
                .attr('stroke', 'none')
                .attr('cx', (d: lifestyle) => x(timeParser(d.date)!))
                .attr('cy', (d: lifestyle) => y(getProperty(d, attributeString) as number))
                .attr('r', 7)
                // Add some tooltip interaction to the dots
                .on('mouseover', (event: MouseEvent, d: lifestyle) => {
                    const X = event.pageX+10; 
                    const Y = event.pageY - 130;
                    const content = `
                        <h4>${p_data.name}</h4>
                        <p> ${attributeString} value: <strong>${getProperty(d, attributeString)}</strong></p>
                        <p>Date: <strong>${d.date}</strong></p>
                    `;
                    showTooltip(tooltip_div, content, X, Y);
                })
                .on('mouseout', (_d) => {
                    tooltip_div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                })

            // Calculate the average for this person
            let avg = d3.mean(data, (entry) => getProperty(entry, attributeString) as number);
            // Draw the average line
            svg.append('line')
                .style('stroke', AVAILABLE_COLORS[idx].primary)
                .style('stroke-width', 4)
                .style('stroke-dasharray', "3,3")
                .attr('x1', x(d1!))
                .attr('y1', y(avg!))
                .attr('x2', x(d2!))
                .attr('y2', y(avg!))
                .on('mouseover', (event: MouseEvent) => {
                    const X = event.pageX+10; 
                    const Y = event.pageY - 130;
                    const d1_pretty = d1!.toISOString().split('T')[0];
                    const d2_pretty = d2!.toISOString().split('T')[0];
                    const content = `
                        <h4>${p_data.name}</h4>
                        <p>Average value from <strong>${d1_pretty}</strong> 
                        to <strong>${d2_pretty}</strong>: 
                        <strong>${avg?.toFixed(3)}</strong></p>
                    `;
                    showTooltip(tooltip_div, content, X, Y);
                })
                .on('mouseout', (_d) => {
                    tooltip_div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                })
        }); 
        
        // And get the pretty min and max date strings
        const d1_pretty = d1!.toISOString().split('T')[0];
        const d2_pretty = d2!.toISOString().split('T')[0];
        setMinMaxDate([d1_pretty, d2_pretty]);

    }, [personData, attributeData, sliderValue, window_size]);

    const handleSliderChange = (_e: Event, v: number | number[], _activeThumb: number) => {
        // Return if the incoming value is NOT an array, something is wrong from the component side
        if(!Array.isArray(v)) {
            console.error("SOMETHING WRONG IN LINE-PLOT SLIDER handleSliderChange(...)!!!");
            return;
        }
        // Return if the knobs are too close to eachother
        if(getSliderDistance(v) < MIN_SLIDER_DIST) return;

        // Update the value
        setSliderValue(v);
    }

    // Helper for showing the tooltip 
    const showTooltip = (div: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
            html_content: string, x: number, y: number) => {
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html(html_content)
            .style('left', x + "px")
            .style('top', y + "px");
    }

    if(attributeData.selectedAttributes.length !== 1 || personData.length === 0){
        return <div className='fallback-container'>
            <h1 className="fallback-text">Please select ONE attribute and at least ONE person</h1>
        </div>
    }
    return (
        <div className={'my-dataviz'}>
            <div className={'tooltip'}></div>
            <div ref={ref} className={'visualization-area'}>
                <h3>{minMaxDate[0]} - {minMaxDate[1]}</h3>
            </div>
            <div className={'bottom-area'}>
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
                <div className='slider-area'>
                    <p className='slider-title'>Date Range</p>
                    <div className='slider-row'>
                        <div className="slider-container">
                            <Slider
                                style={{height: 16}}
                                getAriaLabel={() => 'Date range slider'}
                                value={sliderValue}
                                onChange={handleSliderChange}
                                min={0}
                                step={0.1}
                                max={1}
                                valueLabelDisplay="auto"
                                disableSwap
                            />
                        </div>
                    </div>
                </div>
            </div>           
		</div>
    );
}

export default LinePlotD3;