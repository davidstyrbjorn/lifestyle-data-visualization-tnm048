import React, { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import { filteredPersonData } from '../../states/person-state';
import * as d3 from 'd3';
import { lifestyle, person_data } from '../../types/types';

const LinePlotD3: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);

    const ref = useD3((div: any) => {
        if(personData.length === 0) return;

        // set the dimensions and margins of the graph
        var margin = {top: 100, right: 100, bottom: 30, left: 100},
            width = 900 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // If we haven't added the svg before
        let previous_svg: any = document.getElementsByClassName('line-plot-svg');
        if(previous_svg.length === 0){
            d3.select('#my_dataviz')
                .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr('class', 'line-plot-svg')
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
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
            .range([0, width]);
        // Add the x-scale to DOM
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // We extract maxY for code-reading reasons!
        let maxY = d3.max(data, function(d) {return d.sleep_duration_h});
        // Create the y-scale
        let y = d3.scaleLinear()
            .domain([0, maxY!])
            .range([height, 0])
        // Add the y-scale to the DOM
        svg.append("g")
            .call(d3.axisLeft(y));

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
                .attr('r', 2)

    }, [personData]);

    return (
        <div ref={ref} id={'my_dataviz'}>
            
		</div>
    );
}

export default LinePlotD3;