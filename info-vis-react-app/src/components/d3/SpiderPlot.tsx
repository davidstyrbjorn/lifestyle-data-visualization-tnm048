import * as d3 from 'd3';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import { filteredPersonData } from '../../states/person-state';
import { lifestyle } from '../../types/types';

import '../../styles/components/line-plot.scss';

const SpiderPlot: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);

    // set the dimensions and margins of the graph
    var margin = {top: 100, right: 0, bottom: 0, left: 100},
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

    // With inspiration from this tutorial: https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
    
    const ref = useD3((div: any) =>  {
        if(personData.length === 0) return;
        else {
            let scale = d3.scaleLinear()
                .domain([1, 5])
                .range([0, 250]);

            let ticks = [1, 2, 3, 4, 5];

            let spiderPlotSvg = d3.select('#spider_viz')
            .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'spider-plot-svg')

            ticks.forEach(tick => (
                spiderPlotSvg.append("circle")
                    .attr("cx", width/2)
                    .attr("cy", height/2)
                    .attr("fill", "none")
                    .attr("stroke", "azure")
                    .attr("r", scale(tick))
            ));
        }

    }, [personData]);


    return(
        <div ref={ref} id={'spider_viz'}></div>
    );
}

export default SpiderPlot;