import { atom, atomFamily } from "recoil";

// Holds all available person strings, which can then be used to read from a .json file where all the data is actually stored
export const availablePersonState = atom<string[]>({
    key: 'availablePersonState',
    default: ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08']
});

// Cool solution where the key is string (person name) and value is boolean to keep track of if the person is toggled or not
export const personSelectedState = atomFamily<boolean, string>({
    key: 'personSelectedState',
    default: false,
});