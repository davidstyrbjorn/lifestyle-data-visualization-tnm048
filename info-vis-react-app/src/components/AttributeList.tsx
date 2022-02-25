import { Checkbox, FormControlLabel } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import attributeState from "../states/attribute-state";
import { attribute_options } from "../types/types";
import { makeAttributePresentable } from "../util/attribute-util";

import '../styles/components/sidebar.scss';

const AttributeList: React.FC<{}> = () => {
    // Grab the attribute state
    const [attribute, setAttribute] = useRecoilState(attributeState);
    
    // Switching ticked state on the checkbox 
    const onCheckBoxChange = (index: number) => {
        if (!isAttributeSelected(index)) {
            // Add selected index!
            setAttribute({...attribute, selectedAttributes: [...attribute.selectedAttributes, index]})
        }
        else {
            // Remove selected index
            setAttribute({...attribute, selectedAttributes: [...attribute.selectedAttributes.filter(idx => index !== idx)]})
        }

    }

    // Helper function for swiching checkbox
    const isAttributeSelected = (index: number): boolean =>  {
        return attribute.selectedAttributes.includes(index);
    }

    return (
    <div>
        <h2 className="title">Select attribute/s</h2>
        <ul>
            {attribute.availableAttributes.map((val: attribute_options, idx: number) => {
                return (
                    <div className = "checkbox" key={idx}>
                        <FormControlLabel 
                            control={
                                <Checkbox checked={isAttributeSelected(idx)} onChange={() => onCheckBoxChange(idx)} />
                            } 
                            label={makeAttributePresentable(val)} 
                        />
                    </div> 
                )
            })}
        </ul>
    </div>
    );
}

export default AttributeList;