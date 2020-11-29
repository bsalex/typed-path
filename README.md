# Typed Path

[![https://nodei.co/npm/typed-path.svg?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/typed-path.svg?downloads=true&downloadRank=true&stars=true)](https://www.npmjs.com/package/typed-path)  

[![Build Status](https://travis-ci.org/bsalex/typed-path.svg?branch=master)](https://travis-ci.org/bsalex/typed-path.svg?branch=master)
[![HitCount](http://hits.dwyl.com/bsalex/typed-path.svg)](http://hits.dwyl.com/bsalex/typed-path)
[![Contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/bsalex/typed-path/issues)
![GitHub top language](https://img.shields.io/github/languages/top/bsalex/typed-path)
![David](https://img.shields.io/david/bsalex/typed-path)
![npm bundle size](https://img.shields.io/bundlephobia/min/typed-path)
![GitHub last commit](https://img.shields.io/github/last-commit/bsalex/typed-path)
![Snyk Vulnerabilities for GitHub Repo](https://img.shields.io/snyk/vulnerabilities/github/bsalex/typed-path)
![GitHub issues](https://img.shields.io/github/issues/bsalex/typed-path)
![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability-percentage/bsalex/typed-path)
![Code Climate technical debt](https://img.shields.io/codeclimate/tech-debt/bsalex/typed-path)
---

## Problem

Types are lost when string paths are used in typescript.  
I.e., `_.get, _.map, _.set, R.pluck` from libraries like [lodash](https://lodash.com), [ramda](http://ramdajs.com/).  
It makes those methods dangerous in case of refactoring, the same as JavaScript.  

![](https://res.cloudinary.com/daren64mz/image/upload/v1487457505/string-refactoring_x2tubt.gif)

---

## Solution

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
    $url: (path: string[]) => path.join('/')
}

console.log(tp<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$url); // this will output "a/b/c"
```

The additional handlers are also chainable:

```js
const testAdditionalHandlers = {
    $abs: (path: string[]) => typedPath<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers, ['', ...path]),
    $url: (path: string[]) => path.join('/')
}

console.log(tp<TestType, typeof testAdditionalHandlers>(testAdditionalHandlers).a.b.c.$abs.$url); // this will output "/a/b/c"
```

--- 

### Suggestions

Also, `typed-path` allows typescript to suggest field names for you.

![](http://res.cloudinary.com/daren64mz/image/upload/v1487458263/tp-suggestions_lg5vnb.gif)

## License

Copyright (c) 2020 Oleksandr Beshchuk <[bs.alex.mail@gmail.com](mailto:bs.alex.mail@gmail.com)>  
Licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
