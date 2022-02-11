import React, { RefObject } from 'react';
import * as d3 from 'd3';
import useD3 from '../../hooks/useD3';

const CircleD3: React.FC<{}> = () => {
	const ref = useD3((svg: any) => {
		// Simple test
		d3.select('.target').style('stroke-width', 8); // Select our circle form below and change stroke-width! 
	}, [])

	return (
		<svg ref={ref}>
			<circle className="target" style={{"fill": "#69b3a2"}} stroke="black" cx={50} cy={50} r={40}/>
		</svg>
	);
}

export default CircleD3;