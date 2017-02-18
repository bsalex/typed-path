import {typedPath as tp} from '../index';

type TestType = {
    a: {
        b: {
            c: number;
        }
    }
};

function getField(path: string, object: any) {
    return 'Here should be some logic to get field by path';
}

const testObject: TestType = {a: {b: {c: 5}}};
const field = getField(tp<TestType>().a.b.c.toString(), testObject); // <- Now we see the error.

export default TestType;
