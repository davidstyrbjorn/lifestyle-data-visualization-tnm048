import { Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { useRecoilState } from "recoil";
import attributeState from "../states/attribute-state";

const AttributeList: React.FC<{}> = () => {
    const [attribute, setAttribute] = useRecoilState(attributeState);

    // Adds the index of a selected (checked) attribute to the selectedattributes list
    const addSelectedAttribute = (i: number) => {
        setAttribute({...attribute, selectedAttributes: [...attribute.selectedAttributes, i]})
    }

    // Removes the index of the attribute clicked from selectedattributes
    const removeSelectedAttribute = (i: number) => {
        setAttribute({...attribute, selectedAttributes: [...attribute.selectedAttributes.filter(index => index !== i)]})
    }

    // Switching ticked state on the checkbox 
    const onCheckBoxChange = (index: number) => {
        if (!isAttributeSelected(index)) {
            addSelectedAttribute(index);
        }
        else {
            removeSelectedAttribute(index)
        }

    }

    // Helper function for swiching checkbox
    const isAttributeSelected = (index: number): boolean =>  {
        return attribute.selectedAttributes.includes(index);
    }

    return (<div>
        <ul>
            {attribute.availableAttributes.map((val, idx) => {
                return (
                    <div className = "checkbox">
                                                                     {/*Checked is a variable                 onChange is a function handler*/}                                                                       
                        <FormControlLabel control={<Checkbox checked = {isAttributeSelected(idx)} onChange = {() => onCheckBoxChange(idx)} />} label={val} />
                    </div> 
                )
            })}
        </ul>
        
        Chosen attributes:
        <ul>
            {
                // Just to check the selection works
                attribute.selectedAttributes.map((val, idx) => {
                    return (
                        <div className = "checkbox">
                            {attribute.availableAttributes[val]}
                        </div>
                    )
                })}
        </ul>
    </div>);
}

export default AttributeList;