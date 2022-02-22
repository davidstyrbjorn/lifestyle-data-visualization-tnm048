import * as d3 from 'd3';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import { filteredPersonData } from '../../states/person-state';
import { lifestyle } from '../../types/types';

import '../../styles/components/line-plot.scss';

const LinePlotD3: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);

    const ref = useD3((div: any) => {
        if(personData.length === 0) return;

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
        const height = (div_size[1] * 0.4);

        // If we haven't added the svg before
        let previous_svg: any = document.getElementsByClassName('line-plot-svg');
        if(previous_svg.length === 0){
            d3.select('.my_dataviz')
                .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .attr('class', 'line-plot-svg')
        }

        // Get the svg
        let svg = d3.select('.line-plot-svg');
        svg.selectAll("*").remove();
        
        // 2019-11-17
        let timeParser = d3.timeParse("%Y-%m-%d");
        let testPerson = personData.at(0)!;
        let data = testPerson.lifestyle;
        let dates: Date[] = [];
        data.map((entry) => {
            dates.push(timeParser(entry.date)!)
        })

        // Create the x-scale
        let x = d3.scaleTime()
            // @ts-ignore
            .domain(d3.extent(dates))
            .range([margin.left, width - margin.right]);
        let xAxis = d3.axisBottom(x);
        
        // Add the x-scale to DOM
        svg.append("g")
            .attr('class', 'axis-x')
            .attr('transform', `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        // We extract maxY for code-reading reasons!
        let maxY = d3.max(data, function(d) {return d.sleep_duration_h});
        // Create the y-scale
        let y = d3.scaleLinear()
            .domain([0, maxY!])
            .range([height - margin.top, margin.bottom])
        let yAxis = d3.axisLeft(y);

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
                .x(function(d) {return (x(timeParser(d.date)!))})
                .y(function(d) {return y(d.sleep_duration_h)})
            );

        // Now add all our dots
        svg.selectAll('myCircles')
            .data(data)
            .enter()
            .append('circle')
                .attr('fill', 'red')
                .attr('stroke', 'none')
                .attr('cx', (d) => x(timeParser(d.date)!))
                .attr('cy', (d) => y(d.sleep_duration_h))
                .attr('r', 2);

    }, [personData]);

    return (
        <div ref={ref} className={'my_dataviz'}>
            
		</div>
    );
}

export default LinePlotD3;