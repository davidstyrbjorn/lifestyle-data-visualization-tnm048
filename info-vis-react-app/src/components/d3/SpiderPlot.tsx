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

    // set the dimensions and margins of the graph
    var margin = {top: 100, right: 0, bottom: 0, left: 100},
    width = 900 - margin.left - margin.right,
    height = 900 - margin.top - margin.bottom;

    // Center of spider plot circles
    let center = {x: width/2, y: height/2};

    const ref = useD3((div: any) =>  {
        if(personData.length === 0) return;
        else {

            // Linear range with values ranging from 0-5
            let scale = d3.scaleLinear()
                .domain([0, 5])
                .range([0, 250]);

            // Tick values displayed along circle border
            let ticks = [1, 2, 3, 4, 5];
            let spiderPlotSvg = d3.select('#spider_viz')
            .append('svg')
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'spider-plot-svg')

            ticks.forEach(tick => (
                spiderPlotSvg.append("circle")
                    .attr("cx", center.x)
                    .attr("cy", center.y)
                    .attr("fill", "none")
                    .attr("stroke", "azure")
                    .attr("stroke-width", 5)
                    .attr("r", scale(tick))
            ));

            ticks.forEach(tick => (
                spiderPlotSvg.append("text")
                    .attr("fill", "azure")
                    .attr("x", center.x + 15)
                    .attr("y", center.y - 10 - scale(tick))
                    .text(tick.toString())
            ));

            // Converts from polar coordinates to cartesian
            const angleToCoord = (angle: number, value: number): [number, number] => {
                let r = scale(value);
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);
                return [center.x + x, center.y - y];
            }

            let testLen = 7;

            for(var i = 0; i < testLen; i++) {
                let angle = (2*Math.PI * i / testLen) + (Math.PI / 2);
                let [lineCoordX, lineCoordY] = angleToCoord(angle, 5);

                spiderPlotSvg.append("line")
                    .attr("x1", center.x)
                    .attr("y1", center.y)
                    .attr("x2", lineCoordX)
                    .attr("y2", lineCoordY)
                    .attr("stroke", "azure")
                    .attr("stroke-width", 5)
            }

        }

    }, [personData]);


    return(
        <div ref={ref} id={'spider_viz'}></div>
    );
}

export default SpiderPlot;