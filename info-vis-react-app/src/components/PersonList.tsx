import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import availablePerson, { filteredPersonData, loadedPersonData } from "../states/person-state";
import { PersonCheckbox } from "./PersonCheckbox";

export const PersonList: React.FC<{}> = () => {

    return(
        <div>
            {/* Map over all people to make list of checkboxes */}
            {availablePerson.map((name, idx) => (
                <PersonCheckbox name={name} key = {idx}/>
            ))}
        </div>
    )
}