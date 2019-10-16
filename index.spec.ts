import {expect} from 'chai';
import {typedPath as tp, typedPath} from './index';

type TestType = {
    a: {
        testFunc: () => { result: string },
        b: {
            arrayOfArrays: string[][]
            c: number;
            f: { test: string, blah: { path?: string }, arr: string[] }[];
        }
    }
};

describe('Typed path', () => {
    it('should get field path', () => {
        expect(typedPath<TestType>().a.b.c.$path).to.equal('a.b.c');
    });

    it('should get index path', () => {
        expect(tp<TestType>().a.b.f[3].$path).to.equal('a.b.f[3]');
    });

    it('should get path for toString()', () => {
        expect(tp<TestType>().a.b.f[3].blah.path.toString()).to.equal('a.b.f[3].blah.path');
    });

    it('should get index of index for array of array ', () => {
        expect(tp<TestType>().a.b.arrayOfArrays[3][3].$path).to.equal('a.b.arrayOfArrays[3][3]');
    });

    it('should get array node', () => {
        expect(tp<TestType>().a.b.f.$path).to.equal('a.b.f');
    });

    it('should get function return type path', () => {
        expect(tp<TestType>().a.testFunc.result.$path).to.equal('a.testFunc.result');
    });

    it('should get function path', () => {
        expect(tp<TestType>().a.testFunc.$path).to.equal('a.testFunc');
    });
});
