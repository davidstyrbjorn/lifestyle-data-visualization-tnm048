import { atom } from "recoil";

const personState = atom<any>({
    key: 'personState',
    default: {
        name: 'p01',
        selected: false,
        data: []
    }
});

export default personState;