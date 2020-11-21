import {typedPath as tp, typedPath, TypedPathKey} from './index';

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

interface OptionalThing {
    foo: string;
    bar?: string;
}

const testAdditionalHandlers = {
    $abs: (path: TypedPathKey[]) =>
        typedPath<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers, ['', ...path]),
    $url: (path: TypedPathKey[]) => path.join('/')
};

describe('Typed path', () => {
    it('should get field path', () => {
        expect(typedPath<TestType>().a.b.c.$path).toEqual('a.b.c');
        expect(typedPath<TestType>().a.b.c.$raw).toEqual(['a', 'b', 'c']);
    });

    it('should get index path', () => {
        expect(tp<TestType>().a.b.f[3].$path).toEqual('a.b.f[3]');
        expect(tp<TestType>().a.b.f[3].$raw).toEqual(['a', 'b', 'f', '3']);
    });

    it('should get index of index for array of array ', () => {
        expect(tp<TestType>().a.b.arrayOfArrays[3][3].$path).toEqual('a.b.arrayOfArrays[3][3]');
        expect(tp<TestType>().a.b.arrayOfArrays[3][3].$raw).toEqual(['a', 'b', 'arrayOfArrays', '3', '3']);
    });

    it('should get array node', () => {
        expect(tp<TestType>().a.b.f.$path).toEqual('a.b.f');
        expect(tp<TestType>().a.b.f.$raw).toEqual(['a', 'b', 'f']);
    });

    it('should get function return type path', () => {
        expect(tp<TestType>().a.testFunc.result.$path).toEqual('a.testFunc.result');
        expect(tp<TestType>().a.testFunc.result.$raw).toEqual(['a', 'testFunc', 'result']);
    });

    it('should get function path', () => {
        expect(tp<TestType>().a.testFunc.$path).toEqual('a.testFunc');
        expect(tp<TestType>().a.testFunc.$raw).toEqual(['a', 'testFunc']);
    });

    it('should get path with optional fields', () => {
        expect(tp<OptionalThing>().bar.$path).toEqual('bar');
    });

    it('should get path with symbol', () => {
        expect(tp<TestType>().a[sym].g.$path).toEqual('a.Symbol(SomeSymbol).g');
        expect(tp<TestType>().a[sym].g.$raw).toEqual(['a', 'Symbol(SomeSymbol)', 'g']);
    });

    it('should get path for toString()', () => {
        expect(tp<TestType>().a.b.f[3].blah.path.toString()).toEqual('a.b.f[3].blah.path');
    });

    it('should get path for valueOf()', () => {
        expect(tp<TestType>().a.b.f[3].blah.path.valueOf()).toEqual('a.b.f[3].blah.path');
    });

    it('should work with extended handlers', () => {
        expect(tp<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$url).toEqual('a/b/c');
    });

    it('should work with chained extended handlers', () => {
        expect(tp<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$abs.$url).toEqual('/a/b/c');
    });

    it('should return $rawPath path without transforming each key to string', () => {
        expect(tp<TestType>().a.b.arrayOfArrays[3][3].$rawPath).toEqual(['a', 'b', 'arrayOfArrays', 3, 3]);
    });
});
