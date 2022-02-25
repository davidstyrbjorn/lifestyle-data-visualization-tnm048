import {atom} from 'recoil';

export type missingDataType = {
    missingData: number[]
}

export const missingDataState =  atom<missingDataType> ({
    key: 'missingData',
    default: {
       missingData: []
    }
})

export default missingDataState;