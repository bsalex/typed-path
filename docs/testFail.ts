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
const field = getField('a.b.c', testObject); // <- Look! No error and type protection here!

export default TestType;
