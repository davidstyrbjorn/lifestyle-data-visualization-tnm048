import React, { RefObject } from 'react';
import * as d3 from 'd3';
import useD3 from '../../hooks/useD3';

const CircleD3: React.FC<{}> = () => {
	const ref = useD3((div: HTMLDivElement) => {

	}, [])

	return (
		<div ref={ref}>
		</div>
	);
}

export default CircleD3;