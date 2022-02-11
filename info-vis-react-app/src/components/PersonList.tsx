import React from "react";
import { useRecoilValue } from "recoil";
import { availablePersonState } from "../states/person-state";
import { PersonCheckbox } from "./PersonCheckbox";

export const PersonList: React.FC<{}> = () => {
    const people = useRecoilValue(availablePersonState);

    // Map over all people to make list of checkboxes
    return(
        <div>
            {people.map((name, idx) => (
                <PersonCheckbox name={name} key = {idx}/>
            ))}
        </div>
    )
}