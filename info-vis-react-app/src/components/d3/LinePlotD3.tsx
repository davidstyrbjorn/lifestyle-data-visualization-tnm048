import { Slider } from '@mui/material';
import { Box } from '@mui/system';
import * as d3 from 'd3';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import attributeState from '../../states/attribute-state';
import { filteredPersonData } from '../../states/person-state';
import '../../styles/components/line-plot.scss';
import { lifestyle } from '../../types/types';
import getProperty from '../../util/get-property';

const MIN_SLIDER_DIST = 0.05;

const LinePlotD3: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);
    const attributeData = useRecoilValue(attributeState);
    const [sliderValue, setSliderValue] = useState<number[]>([0.0, 1.0]);

    // d3 helper function
    const make_y_gridlines = (y_scale: any): d3.Axis<d3.AxisDomain> => {
        return d3.axisLeft(y_scale).ticks(y_scale.ticks().length);
    }

    // Returns the current span that the slider knobs cover
    const getSliderDistance = (values: number[]): number => {
        return values[1] - values[0];
    }

    const ref = useD3((div: any) => {
        if(personData.length === 0) return;
        if(attributeData.selectedAttributes.length === 0) return;

        // Grab the div width and height
        const div_size: number[] = [div._groups[0][0].clientWidth, div._groups[0][0].clientHeight]
        const margin = {
            top: 20,
            right: 10,
            bottom: 20,
            left: 25
        };

        // set the dimensions and margins of the graph
        const width = (div_size[0] * 0.8);
        const height = (div_size[1] * 0.8);

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

        // 2019-11-17
        let timeParser = d3.timeParse("%Y-%m-%d");
        // TODO: WHat about multipile people?
        let testPerson = personData.at(0)!;
        let data: Array<lifestyle> = testPerson.lifestyle;
        let dates: Date[] = [];
        const avgData: number[] = [];
        for (let i = 0; i < data.length; i++){
            let relative = i/data.length; // Get the relative index, a value from 0.0 to 1.0
            if(relative >= sliderValue[0] && relative <= sliderValue[1]){
                dates.push(timeParser(data[i].date)!);
                avgData.push(getProperty(data[i], attributeString) as number);
            }
        }

        // Get average of the selected person
        let avgY = d3.mean(avgData);

        // Create the x-scale
        let x = d3.scaleTime()
            // @ts-ignore
            .domain(d3.extent(dates))
            .range([margin.left, width - margin.right]);
        let xAxis = d3.axisBottom(x);
        

        // We extract maxY for code-reading reasons! same with minY
        let maxY = d3.max(data, function(d: lifestyle) {
            return getProperty(d, attributeString) as number
        });
        let minY = d3.min(data, function(d: lifestyle) {
            return getProperty(d, attributeString) as number;
        });
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

        // Add the y-scale to the DOM
        svg.append("g")
            .attr('class', 'axis-y')
            .attr('transform', `translate(${margin.left}, 0)`)
            .call(yAxis)

        // + the average line
        // extract min and max dates from dates array, used to get extents on the x-axis
        const d1 = dates.reduce((d1, d2) => d1 < d2 ? d1 : d2);
        const d2 = dates.reduce((d1, d2) => d1 > d2 ? d1 : d2);
        svg.append('line')
            .style('stroke', 'cyan')
            .style('stroke-width', 3)
            .attr('x1', x(d1))
            .attr('y1', y(avgY!))
            .attr('x2', x(d2))
            .attr('y2', y(avgY!))
            .on('mouseenter', (event: any) => {
                const X = event.pageX; 
                const Y = event.pageY - 120;
                const content = `<p>The average value over the selected timespan: 
                    ${parseFloat(avgY!.toString()).toFixed(2)}</p>`;
                showTooltip(tooltip_div, content, X, Y);
            })
            .on('mouseleave', (_event: any) => {
                tooltip_div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });
        
        // Now add all our lines from the data
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line<lifestyle>()
                .x(function(d: lifestyle) {return (x(timeParser(d.date)!))})
                .y(function(d: lifestyle) {return y(getProperty(d, attributeString) as number)})
            );

        // Select the tooltip div
        let tooltip_div = d3.select('.tooltip')
            .style('opacity', 0);

        // Now add all our dots
        svg.selectAll('myCircles')
            .data(data)
            .enter()
            .append('circle')
                .attr('fill', 'red')
                .attr('stroke', 'none')
                .attr('cx', (d: lifestyle) => x(timeParser(d.date)!))
                .attr('cy', (d: lifestyle) => y(getProperty(d, attributeString) as number))
                .attr('r', 5)
                // Add some tooltip interaction to the dots
                .on('mouseover', (_event: any, d: lifestyle) => {
                    const X = x(timeParser(d.date)!)+90;
                    const Y = y(getProperty(d, attributeString) as number)-40;
                    const content = `<p> ${attributeString} value: ${getProperty(d, attributeString)}</p><br/>
                        <p>Date: ${d.date}</p>`;
                    showTooltip(tooltip_div, content, X, Y);
                })
                .on('mouseout', (_d) => {
                    tooltip_div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                })
    }, [personData, attributeData, sliderValue]);

    // TODO: This function does NOT do what i expect it to do with the limits
    const handleSliderChange = (e: Event, v: number | number[], activeThumb: number) => {
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


    if(personData.length !== 1 || attributeData.selectedAttributes.length !== 1){
        return <div>
            <p>Mad</p>
        </div>
    }
    return (
        <div className={'my-dataviz'}>
            <div className={'tooltip'}></div>
            <div ref={ref} className={'visualization-area'}>
            </div>
            <div className={'slider-area'}>
                <Box 
                    margin={'auto'}
                    width="50%"
                >
                    <p className='slider-title'>Range Slider</p>
                    <Slider
                        getAriaLabel={() => 'Date range slider'}
                        value={sliderValue}
                        onChange={handleSliderChange}
                        min={0}
                        step={0.1}
                        max={1}
                        valueLabelDisplay="auto"
                        disableSwap
                    />
                </Box>
            </div>           
		</div>
    );
}

export default LinePlotD3;