import {atom} from 'recoil';
import { attribute_type } from '../types/types';

export const attributeState =  atom<attribute_type> ({
    key: 'attributeState',
    default: {
        availableAttributes: [],
        selectedAttributes: []
    }
})

export default attributeState;