# Typed Path

[![https://nodei.co/npm/typed-path.svg?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/typed-path.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/typed-path)  

[![Travis](https://img.shields.io/travis/bsalex/typed-path)](https://travis-ci.org/github/bsalex/typed-path)
[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fbsalex%2Ftyped-path&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/bsalex/typed-path/issues)
![GitHub top language](https://img.shields.io/github/languages/top/bsalex/typed-path)
![David](https://img.shields.io/david/bsalex/typed-path)
![npm bundle size](https://img.shields.io/bundlephobia/min/typed-path)
![GitHub last commit](https://img.shields.io/github/last-commit/bsalex/typed-path)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/bsalex/typed-path)
[![GitHub issues](https://img.shields.io/github/issues/bsalex/typed-path)](https://github.com/bsalex/typed-path/issues)
[![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/bsalex/typed-path)](https://codeclimate.com/github/bsalex/typed-path/)
[![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/bsalex/typed-path)](https://codeclimate.com/github/bsalex/typed-path/)
[![codecov](https://codecov.io/gh/bsalex/typed-path/branch/master/graph/badge.svg?token=uzpVtSWKbv)](https://codecov.io/gh/bsalex/typed-path)
---
  
## Overview

This small utility helps to extract type information from a TypeScript class, interface or type to use it in your code. 

Example:

```js
import {typedPath} from 'typed-path';

type TestType = {
    a: {
        testFunc: () => {result: string};
        b: {
            arrayOfArrays: string[][];
            c: {
                d: number;
            };
        }[];
    };
};

console.log(typedPath<TestType>().a.b[5].c.d.$rawPath);
/*
Outputs
["a", "b", 5, "c", "d"]

*/
```
Please see other path access methods and how to add custom path access methods below.

The utility might also be used to add type protection to such methods as `_.get, _.map, _.set, R.pluck` from libraries like [lodash](https://lodash.com), [ramda](http://ramdajs.com/).  

**It is recommended, though, to use [optional chaining](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#optional-chaining) instead.**


---

## Features

### Errors

With `typed-path`, typescript can check paths and warns you about errors.

![](http://res.cloudinary.com/daren64mz/image/upload/v1487457505/tp-refactoring_p4byr3.gif)

### Path access methods
#### Default
##### .$path
[@m-abboud](https://github.com/m-abboud)  
Also, you can get access to the path string using `$path` special field. 

Like this:
```js
    console.log(tp<TestType>().a.b.c.d.$path); // this will output "a.b.c.d"
```

##### .$raw
[@dcbrwn](https://github.com/dcbrwn)  
If you need a raw path, which is of type `string[]` - you can get it using `$raw` special field.  
*Deprecated, since it transforms symbols and numbers to strings, which might be not an expected behavior (the method name is "raw").
Please use `.$rawPath`*
```js
    console.log(tp<TestType>().a.b.c.d.$raw); // this will output ["a", "b", "c", "d"]
```

##### .$rawPath
If you need a raw path, which is of type `(string | number | Symbol)[]` - you can get it using `$rawPath` special field.  
```js
    console.log(tp<TestType>().a.b[5].c.d.$rawPath); // this will output ["a", "b", 5, "c", "d"]
```

The `$rawPath` is something that you might want to use with the following methods from
Ramda, to add type safety on the path:
- [R.assocPath](https://ramdajs.com/docs/#assocPath),
- [R.dissocPath](https://ramdajs.com/docs/#dissocPath),
- [R.hasPath](https://ramdajs.com/docs/#hasPath),
- [R.path](https://ramdajs.com/docs/#path),
- [R.pathEq](https://ramdajs.com/docs/#pathEq),
- [R.pathOr](https://ramdajs.com/docs/#pathOr),
- [R.paths](https://ramdajs.com/docs/#paths),
- [R.lensPath](https://ramdajs.com/docs/#lensPath)

Example: [https://codesandbox.io/s/typed-path-ramda-assoc-path-x3qby?file=/src/index.ts](https://codesandbox.io/s/typed-path-ramda-assoc-path-x3qby?file=/src/index.ts)

#### Additional handlers 
[@nick-lvov-dev](https://github.com/nick-lvov-dev)

You can extend path handlers functionality using additional handlers:

```js
const testAdditionalHandlers = {
    $url: (path: TypedPathKey[]) => path.join('/')
}

console.log(tp<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$url); // this will output "a/b/c"
```

The additional handlers are also chainable:

```js
const testAdditionalHandlers = {
    $abs: (path: TypedPathKey[]) => typedPath<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers, ['', ...path]),
    $url: (path: TypedPathKey[]) => path.join('/'),
    $length: (path: TypedPathKey[]) => path.length
}

console.log(tp<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$abs.$url); // this will output "/a/b/c"
```

--- 

### Suggestions

Also, `typed-path` allows typescript to suggest field names for you.

![](http://res.cloudinary.com/daren64mz/image/upload/v1487458263/tp-suggestions_lg5vnb.gif)

## License

Copyright (c) 2021 Oleksandr Beshchuk <[bs.alex.mail@gmail.com](mailto:bs.alex.mail@gmail.com)>  
Licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
