import React from "react";
import personState, { personSelectedState } from "../states/person-state";
import { Checkbox, FormControlLabel } from "@mui/material";
import { atomFamily, useRecoilState } from "recoil";
import { person_information } from "../types/types";

export function PersonCheckbox(props: person_information) {
    const { name } = props;
    const[isSelected, setSelected] = useRecoilState(personSelectedState(props.name));
    const setPersons = useRecoilState(personState);
    return(
        <div></div>
    )
}

export const checkboxSelectedState = atomFamily<>

// const PersonCheckbox: React.FC<{}> = () => {
//     const [person, setPerson] = useRecoilState(personState);

//     // Switching ticked state on the checkbox 
//     const onCheckBoxChange = () => {
//         setPerson({...person, selected: !person.selected})
//     }

//     // return(
//     //     <div>
//     //         <ul>
//     //             <div className = "checkbox" key={person.name}>
//     //                     <FormControlLabel 
//     //                         control={
//     //                             <Checkbox checked={person.selected} onChange={() => onCheckBoxChange()} />
//     //                         } 
//     //                         label={person.name} 
//     //                     />
//     //             </div>
//     //         </ul>
//     //     </div>
//     // )
//     export function PersonCheckbox(props: PersonList) {
//         return(
//             <div></div>
//         )
//     }
// }

// export function PersonCheckbox(props: PersonList) {
//     return(
//         <div></div>
//     )
// }

// //export default PeopleList;