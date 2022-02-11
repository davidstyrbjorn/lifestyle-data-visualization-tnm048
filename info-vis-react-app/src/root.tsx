import React from "react";
import { useRecoilValue } from "recoil";
import { visualizationOptionSelector } from "./states/visualization-state";
import None from "./views/none";

import './styles/index.css'
import Sidebar from "./views/sidebar";
import BarChart from "./components/d3/CircleD3";
import CircleD3 from "./components/d3/CircleD3";
import ParallellAxis from "./components/d3/ParallellAxis"

const Root: React.FC<{}> = () => {
    const visualizationOption = useRecoilValue(visualizationOptionSelector);
    return (
        <div className={'container'}>
            <div className={'visualization-view'}>
                {/* DECIDE ON WHICH VISUALIZATION COMPONENT TO RENDER */}
                {visualizationOption === 'none' && <None/>}
                {visualizationOption === 'parallell-axis' && <CircleD3/>}
                {visualizationOption=== 'spider' && <div>SPINDEL</div>}
                <ParallellAxis/>
            </div>
            <Sidebar/>
        </div>
    )   
}

export default Root;