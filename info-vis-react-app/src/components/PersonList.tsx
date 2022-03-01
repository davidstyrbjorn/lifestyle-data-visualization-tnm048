import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import availablePerson, { filteredPersonData, loadedPersonData } from "../states/person-state";
import { PersonCheckbox } from "./PersonCheckbox";

import '../styles/components/sidebar.scss';

export const PersonList: React.FC<{}> = () => {
    return(
        <div>
            <div className="attribute-header">
                <h2>Select person/s</h2>
            </div>
            <ul>
                {/* Map over all people to make list of checkboxes */}
                {availablePerson.map((name, idx) => (
                    <PersonCheckbox name={name} key = {idx}/>
                ))}
            </ul>
        </div>
    )
}