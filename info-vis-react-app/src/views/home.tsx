import React from "react";
import { useRecoilState } from "recoil";
import numberState from "../states/test-state";

const Home: React.FC<{}> = () => {
    // Grab the recoil state
    const [number, setNumber] = useRecoilState(numberState);

    return (
        <div>
            <p>Hej mamma: {number}</p>
            <button onClick={() => {
                setNumber(number+1)
            }}>
                Mer hej mamma, king halal mode! Let's goooo kony 2012
            </button>
        </div>
    )   
}

export default Home;