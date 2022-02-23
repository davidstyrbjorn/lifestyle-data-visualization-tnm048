import { Slider } from '@mui/material';
import { Box } from '@mui/system';
import * as d3 from 'd3';
import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import { filteredPersonData } from '../../states/person-state';
import '../../styles/components/line-plot.scss';
import { lifestyle } from '../../types/types';

const LinePlotD3: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);
    const [sliderValue, setSliderValue] = useState<number>(0.5);

    const make_y_gridlines = (y_scale: any): d3.Axis<d3.AxisDomain> => {
        return d3.axisLeft(y_scale).ticks(y_scale.ticks().length);
    }

    const ref = useD3((div: any) => {
        if(personData.length === 0) return;
        if(sliderValue == 0) return;

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
        
        // 2019-11-17
        let timeParser = d3.timeParse("%Y-%m-%d");
        let testPerson = personData.at(0)!;
        let data: Array<lifestyle> = testPerson.lifestyle;
        let dates: Date[] = [];
        data.map((entry: lifestyle, idx: number) => {
            let relative = idx / data.length;
            if(relative < sliderValue) {
                dates.push(timeParser(entry.date)!)
            }
        })

        // Create the x-scale
        let x = d3.scaleTime()
            // @ts-ignore
            .domain(d3.extent(dates))
            .range([margin.left, width - margin.right]);
        let xAxis = d3.axisBottom(x);
        
        // We extract maxY for code-reading reasons!
        let maxY = d3.max(data, function(d: lifestyle) {return d.sleep_duration_h});
        // Create the y-scale
        let y = d3.scaleLinear()
            .domain([0, maxY!])
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
        
        // Now add all our lines from the data
        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line<lifestyle>()
                .x(function(d: lifestyle) {return (x(timeParser(d.date)!))})
                .y(function(d: lifestyle) {return y(d.sleep_duration_h)})
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
                .attr('cy', (d: lifestyle) => y(d.sleep_duration_h))
                .attr('r', 5)
                // Add some tooltip interaction to the dots
                .on('mouseover', (_event: any, d: lifestyle) => {
                    tooltip_div.transition()		
                        .duration(200)		
                        .style("opacity", .9);		
                        tooltip_div.html(
                                "<p>Attribute value:" + d.sleep_duration_h + "</p><br/>" + 
                                "<p>Date: " + d.date + "</p>"
                            )	
                            .style("left", (x(timeParser(d.date)!)+200) + "px")		
                            .style("top", (y(d.sleep_duration_h)-20) + "px");	
                })
                .on('mouseout', (_d) => {
                    tooltip_div.transition()		
                        .duration(500)		
                        .style("opacity", 0);	
                })
    }, [personData, sliderValue]);

    const handleSliderChange = (e: Event, v: number | number[], activeThumb: number) => {
        if(Array.isArray(v)) return;
        setSliderValue(v);
    }


    if(personData.length !== 1){
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