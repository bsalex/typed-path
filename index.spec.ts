import {typedPath, TypedPathKey} from './index';

export const sym = Symbol('SomeSymbol');

export type TestType = {
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
        typedPath<TestType, TestType, typeof testAdditionalHandlers>(testAdditionalHandlers, ['', ...path]),
    $url: (path: TypedPathKey[]) => path.join('/')
};

const testCases = {
    'regular field path': {
        path: typedPath<TestType>().a.b.c,
        expectedResults: {
            $path: 'a.b.c',
            $raw: ['a', 'b', 'c'],
            $rawPath: ['a', 'b', 'c']
        }
    },
    'path with index': {
        path: typedPath<TestType>().a.b.f[3],
        expectedResults: {
            $path: 'a.b.f[3]',
            $raw: ['a', 'b', 'f', '3'],
            $rawPath: ['a', 'b', 'f', 3]
        }
    },
    'path with index of index for array of array': {
        path: typedPath<TestType>().a.b.arrayOfArrays[3][3],
        expectedResults: {
            $path: 'a.b.arrayOfArrays[3][3]',
            $raw: ['a', 'b', 'arrayOfArrays', '3', '3'],
            $rawPath: ['a', 'b', 'arrayOfArrays', 3, 3]
        }
    },
    'path with function': {
        path: typedPath<TestType>().a.testFunc,
        expectedResults: {
            $path: 'a.testFunc',
            $raw: ['a', 'testFunc'],
            $rawPath: ['a', 'testFunc']
        }
    },
    'path with function return type': {
        path: typedPath<TestType>().a.testFunc.result,
        expectedResults: {
            $path: 'a.testFunc.result',
            $raw: ['a', 'testFunc', 'result'],
            $rawPath: ['a', 'testFunc', 'result']
        }
    },
    'path with optional field': {
        path: typedPath<OptionalThing>().bar,
        expectedResults: {
            $path: 'bar',
            $raw: ['bar'],
            $rawPath: ['bar']
        }
    },
    'path with symbol': {
        path: typedPath<TestType>().a[sym].g,
        expectedResults: {
            $path: 'a.Symbol(SomeSymbol).g',
            $raw: ['a', 'Symbol(SomeSymbol)', 'g'],
            $rawPath: ['a', sym, 'g']
        }
    }
};

describe('Typed path', () => {
    for (const [testCaseName, {path, expectedResults}] of Object.entries(testCases)) {
        describe(`for ${testCaseName}`, () => {
            if ('$path' in expectedResults) {
                it(`should have correct $path special field value`, () => {
                    expect(path.$path).toEqual(expectedResults.$path);
                });

                it(`should have correct .toString() special field value`, () => {
                    expect(path.toString()).toEqual(expectedResults.$path);
                });

                it(`should have correct .valueOf() special field value`, () => {
                    expect(path.valueOf()).toEqual(expectedResults.$path);
                });
            }

            if ('$raw' in expectedResults) {
                it(`should have correct $raw special field value`, () => {
                    expect(path.$raw).toEqual(expectedResults.$raw);
                });
            }

            if ('$rawPath' in expectedResults) {
                it(`should have correct $rawPath special field value`, () => {
                    expect(path.$rawPath).toEqual(expectedResults.$rawPath);
                });
            }
        });
    }

    it('should get path with a string tag', () => {
        expect(Object.prototype.toString.call(typedPath<TestType>().a.b.f[3].blah.path)).toEqual(
            '[object a.b.f[3].blah.path]'
        );
    });

    it('should work with extended handlers', () => {
        expect(typedPath<TestType, TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$url).toEqual('a/b/c');
    });

    it('should work with chained extended handlers', () => {
        expect(typedPath<TestType, TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$abs.$url).toEqual(
            '/a/b/c'
        );
    });
});
