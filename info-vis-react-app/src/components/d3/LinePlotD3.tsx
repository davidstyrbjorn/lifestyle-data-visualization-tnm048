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
        var margin = {top: 10, right: 100, bottom: 30, left: 30},
            width = 700 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        let svg: any = document.getElementsByClassName('line-plot-svg');
        console.log(svg);
        if(svg.length === 0){
            svg = d3.select('#my_dataviz')
                .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .attr('class', 'line-plot-svg')
                .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
        }else{
            svg = d3.select('.line-plot.svg');
        }
        
        // 2019-11-17
        let timeParser = d3.timeParse("%Y-%m-%d");
        let testPerson = personData.at(0)!;
        let data = testPerson.lifestyle;
        let dates: Date[] = [];
        data.map((entry) => {
            dates.push(timeParser(entry.date)!)
        })

        let x = d3.scaleTime()
            // @ts-ignore
            .domain(d3.extent(dates))
            .range([0, width]); 
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        let maxY = d3.max(data, function(d) {return d.mood});
        let y = d3.scaleLinear()
            .domain([0, maxY!])
            .range([height, 0])
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', d3.line<lifestyle>()
                .x(function(d) {return (x(timeParser(d.date)!))})
                .y(function(d) {return y(d.mood)})
            )

    }, [personData]);

    return (
        <div ref={ref} id={'my_dataviz'}>
            
		</div>
    );
}

export default LinePlotD3;