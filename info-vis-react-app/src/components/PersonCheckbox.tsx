import React from "react";
import personState from "../states/person-state";
import { Checkbox, FormControlLabel } from "@mui/material";
import { useRecoilState } from "recoil";

const PeopleList: React.FC<{}> = () => {
    const [person, setPerson] = useRecoilState(personState);

    // Switching ticked state on the checkbox 
    const onCheckBoxChange = () => {
        setPerson({...person, selected: !person.selected})
    }

    return(
        <div>
            <ul>
                <div className = "checkbox" key={person.name}>
                        <FormControlLabel 
                            control={
                                <Checkbox checked={person.selected} onChange={() => onCheckBoxChange()} />
                            } 
                            label={person.name} 
                        />
                </div>
            </ul>
        </div>
    )
}

export default PeopleList;