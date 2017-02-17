import {expect} from 'chai';
import {typedPath} from './index';

describe('Typed path', () => {
    it('should get field path', () => {
        type TestType = {a: {b: {c: number}}};

        expect(typedPath<TestType>().a.b.c.path()).to.equal('a.b.c');
    });

    it('should get index path', () => {
        type TestType = {a: {b: [{c: number}]}};

        expect(typedPath<TestType>().a.b[5].c.path()).to.equal('a.b[5].c');
    });
});