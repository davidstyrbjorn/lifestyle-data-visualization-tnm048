import React from "react";
import { useRecoilValue } from "recoil";
import { personState } from "../states/person-state";
import { PersonCheckbox } from "./PersonCheckbox";

export function PersonList() {
    const people = useRecoilValue(personState);
    return(
        <div>
            {people.map(personProps => (
                <PersonCheckbox {...personProps} key = {personProps.name}/>
            ))}

        </div>
    )
}

// const PersonList: React.FC<{}> = (people, togglePerson) => {
//     return(
//         people.map(people, togglePerson) => {
//             return <PersonCheckbox/>
//         })
//     )
// }

// export default PersonList;