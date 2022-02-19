import * as d3 from 'd3';
import React from 'react';
import { useRecoilValue } from 'recoil';
import useD3 from '../../hooks/useD3';
import { filteredPersonData } from '../../states/person-state';

import '../../styles/components/line-plot.scss';

// With inspiration from this tutorial: https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
const SpiderPlot: React.FC<{}> = () => {
    // Grab the person data
    const personData = useRecoilValue(filteredPersonData);

    // Set the dimensions and margins of the graph
    let margin = {top: 100, right: 0, bottom: 0, left: 100},
        width = 900 - margin.left - margin.right,
        height = 900 - margin.top - margin.bottom,
        strokeWidth = 5;

    // Center of spider plot circles
    let center = {x: width/2, y: height/2};

    const ref = useD3((div: any) =>  {
        if(personData.length === 0) return;
        else {

            // Linear range with values ranging from 0-5
            let domainRange = {min: 0, max: 5};
            let scale = d3.scaleLinear()
                .domain([domainRange.min, domainRange.max])
                .range([0, 250]);

            // Tick values displayed along circle border
            let ticks = [1, 2, 3, 4, 5];
            let spiderPlotSvg = d3.select('#spider_viz')
            .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'spider-plot-svg')

            // Add circles representing values 1-5
            ticks.forEach(tick => (
                spiderPlotSvg.append("circle")
                    .attr("cx", center.x)
                    .attr("cy", center.y)
                    .attr("fill", "none")
                    .attr("stroke", "azure")
                    .attr("stroke-width", strokeWidth)
                    .attr("r", scale(tick))
            ));

            // Label circles with tick values
            ticks.forEach(tick => (
                spiderPlotSvg.append("text")
                    .attr("fill", "azure")
                    .attr("x", center.x + 3 * strokeWidth)
                    .attr("y", center.y - 2 * strokeWidth - scale(tick))
                    .text(tick.toString())
            ));

            // Converts from polar coordinates to cartesian
            const angleToCoord = (angle: number, value: number): [number, number] => {
                let r = scale(value);
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);
                return [center.x + x, center.y - y];
            }

            let testLen = 8;

            for(var i = 0; i < testLen; i++) {
                let angle = (2*Math.PI * i / testLen) + (Math.PI / 2);
                let [lineCoordX, lineCoordY] = angleToCoord(angle, domainRange.max);

                // Draw lines from center to edges of spider plot
                spiderPlotSvg.append("line")
                    .attr("x1", center.x)
                    .attr("y1", center.y)
                    .attr("x2", lineCoordX)
                    .attr("y2", lineCoordY)
                    .attr("stroke", "azure")
                    .attr("stroke-width", strokeWidth)
            }

        }

    }, [personData]);


    return(
        <div ref={ref} id={'spider_viz'}></div>
    );
}

export default SpiderPlot;