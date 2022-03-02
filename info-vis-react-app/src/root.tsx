import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { visualizationOptionSelector, visualizationState } from "./states/visualization-state";
import None from "./views/none";
import Sidebar from "./views/sidebar";
import CircleD3 from "./components/d3/CircleD3";
import LinePlotD3 from "./components/d3/LinePlotD3";

import './styles/layout.scss';
import { Button } from "@mui/material";
import { visualization_options } from "./types/types";

const Root: React.FC<{}> = () => {
    const [visualizationOption, setVisualizationOption] = useRecoilState(visualizationState);

    const changeVizOption = (option: visualization_options) => {
        setVisualizationOption({...visualizationOption, option: option});
    }

    return (
        <div className={'container'}>
            <div className={'visualization-view'}>
                <div className={'button-row'}>
                    <Button className="button" variant="outlined"
                        onClick={() => changeVizOption('line-plot')}>Line</Button>
                    <Button className="button" variant="outlined"
                        onClick={() => changeVizOption('parallell-axis')}>Parallel</Button>
                    <Button className="button" variant="outlined"
                        onClick={() => changeVizOption('spider')}>Spider</Button>
                </div>
                {/* DECIDE ON WHICH VISUALIZATION COMPONENT TO RENDER */}
                {visualizationOption.option === 'none' && <None/>}
                {visualizationOption.option === 'parallell-axis' && <CircleD3/>}
                {visualizationOption.option === 'spider' && <div>SPINDEL</div>}
                {visualizationOption.option === 'line-plot' && <LinePlotD3/>}
            </div>
            <Sidebar/>
        </div>
    )   
}

export default Root;