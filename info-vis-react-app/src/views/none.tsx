import React from 'react';
import { useRecoilState } from 'recoil';
import { visualizationState } from '../states/visualization-state';
import { visualization_options } from '../types/types';

const None : React.FC<{}> = () => {
    const [visualization, setVisualization] = useRecoilState(visualizationState);

    const switchVisualizationState = (option: visualization_options) => {
        setVisualization({...visualization, option: option});
    }

    return (
        <div>
            <div>No visualization tech choosen!</div>
            <button onClick={() => switchVisualizationState('parallell-axis')}>Press me to show parallell axis!</button>
            <button onClick={() => switchVisualizationState('spider')}>Press me to show spider!</button>
            <button onClick={() => switchVisualizationState('line-plot')}>Press me to show line-plot</button>
        </div>
    );
}

export default None;