import { TestType, sym } from './../index.spec';
import {typedPath as tp} from '../index';

function getField(path: string, object: any) {
    return 'Here should be some logic to get field by path';
}

const testObject: TestType = {
    a: {
        b: {
            arrayOfArrays: [['hi']],
            c: 5,
            f: [{test: 'tes123t', blah: {path: '123123'}, arr: ['tt']}]
        },
        testFunc: () => ({result: 'test'}),
        [sym]: {
            g: 'test'
        }
    }
};

// Look! No error and type protection here!
const field = getField('a.b.c', testObject);

// f is an array you cant access it directly
console.log(tp<TestType>().a.b.f.blah.$path);

// f is not an array of arrays just a plain string array so double accessor fails
console.log(tp<TestType>().a.b.f[0][0].$path);

// a is not a func
console.log(tp<TestType>().a().$path);

// bad is not a field in the function return type
console.log(tp<TestType>().a.testFunc.bad);

export default TestType;
