import React from "react";
import availablePerson from "../states/person-state";
import '../styles/components/sidebar.scss';
import { PersonCheckbox } from "./PersonCheckbox";


export const PersonList: React.FC<{}> = () => {
    return(
        <>
        <div className="attribute-header">
            <h2>Select person/s</h2>
        </div>
        <div id='personList'>
            <ul>
                {/* Map over all people to make list of checkboxes */}
                {availablePerson.map((name, idx) => (
                    <PersonCheckbox name={name} key = {idx}/>
                ))}
            </ul>
        </div>
        </>
    )
}