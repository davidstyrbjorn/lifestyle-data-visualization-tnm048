import React from "react";
import { personSelectedState } from "../states/person-state";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useRecoilState } from "recoil";

type Props = {
    name: string
}

export const PersonCheckbox: React.FC<Props> = ( {name} ) => {
    // Get information from selection state of the person
    const[isSelected, setSelected] = useRecoilState(personSelectedState(name));

    // Reverse selection state value
    const onCheckBoxChange = () => setSelected(prevState => !prevState);

    return(
        <div className="checkbox">
            <FormControlLabel 
                control={
                    <Checkbox checked={isSelected} onChange={() => onCheckBoxChange()} />
                } 
                label={name} 
            />
        </div>
    )
}