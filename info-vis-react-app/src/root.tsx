import React from "react";
import { useRecoilValue } from "recoil";
import { visualizationOptionSelector } from "./states/visualization-state";
import None from "./views/none";

import './styles/index.css'
import Sidebar from "./views/sidebar";

const Root: React.FC<{}> = () => {
    const visualizationOption = useRecoilValue(visualizationOptionSelector);
    return (
        <div className={'container'}>
            <div className={'visualization-view'}>
                {/* DECIDE ON WHICH VISUALIZATION COMPONENT TO RENDER */}
                {visualizationOption === 'none' && <None/>}
                {visualizationOption === 'parallell-axis' && <div>PARALLELL AXEL</div>}
                {visualizationOption=== 'spider' && <div>SPINDEL</div>}
            </div>
            <Sidebar/>
        </div>
    )   
}

export default Root;