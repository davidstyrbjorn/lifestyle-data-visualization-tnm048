import React from "react";
import { useRecoilValue } from "recoil";
import { visualizationOptionSelector } from "./states/visualization-state";
import None from "./views/none";
import Sidebar from "./views/sidebar";
import CircleD3 from "./components/d3/CircleD3";
import SpiderPlot from "./components/d3/SpiderPlot";
import LinePlotD3 from "./components/d3/LinePlotD3";

import './styles/layout.scss';

const Root: React.FC<{}> = () => {
    const visualizationOption = useRecoilValue(visualizationOptionSelector);
    return (
        <div className={'container'}>
            <div className={'visualization-view'}>
                {/* DECIDE ON WHICH VISUALIZATION COMPONENT TO RENDER */}
                {visualizationOption === 'none' && <None/>}
                {visualizationOption === 'parallell-axis' && <CircleD3/>}
                {visualizationOption === 'spider' && <SpiderPlot/>}
                {visualizationOption === 'line-plot' && <LinePlotD3/>}
            </div>
            <Sidebar/>
        </div>
    )   
}

export default Root;