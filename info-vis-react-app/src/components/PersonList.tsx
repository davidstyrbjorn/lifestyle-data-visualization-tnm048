import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import availablePerson, { filteredPersonData, loadedPersonData } from "../states/person-state";
import { PersonCheckbox } from "./PersonCheckbox";

import '../styles/components/sidebar.scss';

export const PersonList: React.FC<{}> = () => {
    return(
        <div>
            <h2 className="title">Select attribute/s</h2>
            <ul>
                {/* Map over all people to make list of checkboxes */}
                {availablePerson.map((name, idx) => (
                    <PersonCheckbox name={name} key = {idx}/>
                ))}
            </ul>
        </div>
    )
}