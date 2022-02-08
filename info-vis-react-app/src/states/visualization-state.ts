import { atom, selector } from 'recoil';
import { visualization_options, visualization_type } from '../types/types';

export const visualizationState = atom<visualization_type>({
    key: 'visualizationState',
    default: {option: 'none'}
})

export const visualizationOptionSelector = selector<visualization_options>({
    key: 'visualizationOptionSelector',
    get: ({get}) => {
        return get(visualizationState).option;
    }
});