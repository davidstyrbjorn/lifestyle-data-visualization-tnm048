import React, { createRef, useRef } from 'react';
import * as d3 from 'd3';

// renderChartFn is a callback which contains our d3 logic
// dependencies is what variables this d3 code is dependent on, if they change
// the d3 code will re-run
const useD3 = (renderChartFn: any, dependencies: any) => {
    const ref = createRef<SVGSVGElement>();

    React.useEffect(() => {
        // @ts-ignore
        renderChartFn(d3.select(ref.current));
        return () => {};
    }, dependencies);

    return ref;
}

export default useD3;