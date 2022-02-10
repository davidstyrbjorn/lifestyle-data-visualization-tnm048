import React from "react";
import personState from "../states/person-state";
import { useRecoilState } from "recoil";

const PeopleList: React.FC<{}> = () => {
    const [person, setPerson] = useRecoilState(personState);

    return(
        <div>Testing</div>
    )
}

export default PeopleList;