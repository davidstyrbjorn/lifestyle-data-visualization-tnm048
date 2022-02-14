import React from "react";
import availablePerson from "../states/person-state";
import { PersonCheckbox } from "./PersonCheckbox";
//const availablePerson: string[] = ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08']; 

export const PersonList: React.FC<{}> = () => {
    // Map over all people to make list of checkboxes
    return(
        <div>
            {availablePerson.map((name, idx) => (
                <PersonCheckbox name={name} key = {idx}/>
            ))}
        </div>
    )
}