import { Checkbox, FormControlLabel, IconButton } from "@mui/material";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import attributeState from "../states/attribute-state";
import '../styles/components/sidebar.scss';
import { attribute_options } from "../types/types";
import { makeAttributePresentable } from "../util/attribute-util";

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

    const gotoInfoPage = () => {
        window.open('https://datasets.simula.no/pmdata/');
    }

    return (
    <div>
        <div className="attribute-header">
            <h2 className="attribute-title">Select attribute/s</h2>
            <IconButton color="info" aria-label="upload picture" component="span" onClick={gotoInfoPage}>
                <p>?</p>
            </IconButton>
        </div>
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