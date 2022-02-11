import { atom, atomFamily } from "recoil";
import { person_information } from "../types/types";

export const personState = atom<person_information[]>({
    key: 'personState',
    default: []
});

export const personSelectedState = atomFamily<boolean, string>({
    key: 'personSelectedState',
    default: false,
});