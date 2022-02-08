import React, { useState } from "react";
import { useRecoilState } from "recoil";
import attributeState from "../states/attribute-state";

const AttributeList: React.FC<{}> = () => {
    const [attribute, setAttribute] = useRecoilState(attributeState);

    const addSelectedAttribute = (i: number) => {
        setAttribute({...attribute, })
        // When selecting attributes, add index of selected attribute in available to list of selected.
    }


    return (<div>
        Tja
    </div>);
}


export default AttributeList;