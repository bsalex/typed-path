import {typedPath as tp} from '../index';

type TestType = {
    fieldNameOne: {
        fieldNameTwo: {
            c: number;
        }
    }
};

function getField(path: string, object: any) {
    return 'Here should be some logic to get field by path';
}

const testObject: TestType = {fieldNameOne: {fieldNameTwo: {c: 5}}};
const field = getField(, testObject);

export default TestType;
