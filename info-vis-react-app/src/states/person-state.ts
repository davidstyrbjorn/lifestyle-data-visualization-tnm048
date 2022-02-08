import { atom } from "recoil";

const personState = atom<any>({
    key: 'personState',
    default: {
        name: 'p01',
        data: []
    }
});

export default personState;