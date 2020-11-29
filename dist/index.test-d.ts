import {expectType, expectDeprecated, expectError} from 'tsd';
import {typedPath, TypedPathKey} from '.';

const sym = Symbol('SomeSymbol');


type TestType = {
    a: {
        testFunc: () => {result: string};
        b: {
            arrayOfArrays: string[][];
            c: number;
            f: {test: string; blah: {path?: string}; arr: string[]}[];
        };
        [sym]: {
            g: string;
        };
    };
};

const testAdditionalHandlers = {
    $abs: (path: TypedPathKey[]) =>
        typedPath<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers, ['', ...path]),
    $url: (path: TypedPathKey[]) => path.join('/'),
    $length: (path: TypedPathKey[]) => path.length
};

// Default handlers
expectType<string>(typedPath<TestType>().a.b.c.$path);
expectType<string[]>(typedPath<TestType>().a.b.c.$raw);
expectType<string>(typedPath<TestType>().a.b.c.toString());
expectType<TypedPathKey[]>(typedPath<TestType>().a.b.c.$rawPath);
// with array index
expectType<TypedPathKey[]>(typedPath<TestType>().a.b.f[5].$rawPath);
expectDeprecated(typedPath<TestType>().a.b.c.$raw);
// Default handlers


// Type-safe path errors
expectError(typedPath<TestType>().a.W.c.$rawPath);
// Type-safe path errors


// Types for additional handlers
expectType<number>(typedPath<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$length);
// Types for additional handlers