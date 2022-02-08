import {atom} from 'recoil';
import { attribute_type } from '../types/types';

export const attributeState =  atom<attribute_type> ({
    key: 'attributeState',
    default: {
        availableAttributes: ["fatigue", "mood", "readiness", "sleep_duration_h", "sleep_quality", "stress", "glasses_of_fluid", "bodyweight"],
        selectedAttributes: []
    }
})

export default attributeState;