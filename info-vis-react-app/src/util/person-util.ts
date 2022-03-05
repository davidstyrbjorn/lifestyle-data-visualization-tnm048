import { person_data } from "../types/types";
//import availablePerson from "../states/person-state";

const availablePerson: string[] = ['p01', 'p02', 'p03', 'p04', 'p05', 'p06', 'p07', 'p08']; 

export function getPersonData(name: string) : person_data {
    // Load from .json file from disk and turn it into person_data
    const fileName = name + '.json';
    const person = require("../json/" + fileName) as person_data;
    person.name = name;
    return person;
}

export function loadAllPersonDataIntoMap() : Map<string, person_data> {
    const map = new Map<string, person_data>(); // We return this!
    // Iterate over each available person and add correct data to map
    availablePerson.forEach((name: string) => {
        // Add person + the data to the map
        const data = getPersonData(name);
        map.set(name, data);
    });

    return map;
}