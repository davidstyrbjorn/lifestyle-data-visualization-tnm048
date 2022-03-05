import React from 'react';
import { useRecoilState } from 'recoil';
import { isJSDocFunctionType } from 'typescript';
import { visualizationState } from '../states/visualization-state';

const None : React.FC<{}> = () => {
    const [visualization, setVisualization] = useRecoilState(visualizationState);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
        }}>
            <h1 style={{color: 'white'}}>No visualization tech choosen!</h1>
        </div>
    );
}

export default None;