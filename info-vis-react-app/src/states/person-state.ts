import { atom, atomFamily } from "recoil";
import { person_data } from "../types/types";
import { loadAllPersonDataIntoMap } from "../util/person-util";

// Holds all available person strings, which can then be used to read from a .json file where all the data is actually stored
const availablePerson: string[] = ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08']; // TODO: Get all available json files instead

// export const availablePersonState = atom<string[]>({
//     key: 'availablePersonState',
//     default: [] // TODO: Get all available json files instead
// });

export const loadedPersonData = atom<Map<string, person_data>>({
    key: 'loadedPersonData',
    default: loadAllPersonDataIntoMap() // Uses names from availablePersonState
})

// Cool solution where the key is string (person name) and value is boolean to keep track of if the person is toggled or not
export const personSelectedState = atomFamily<boolean, string>({
    key: 'personSelectedState',
    default: false,
});

export default availablePerson;