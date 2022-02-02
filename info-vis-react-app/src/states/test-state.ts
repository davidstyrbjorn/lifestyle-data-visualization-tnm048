import { atom } from "recoil";

const numberState = atom<number>({
    key: 'testState', // unique ID (with respect to other atoms/selectors)
    default: 33 // default value (aka initial value)
});

export default numberState;