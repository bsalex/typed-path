# Typed Path

---

## Problem

Types are lost when string paths are used in typescript.  
I.e. `_.get, _.map, _.set, R.pluck` from libraries like [lodash](https://lodash.com), [ramda](http://ramdajs.com/).  
It makes those methods dangerous in case of refactoring, the same as JavaScript.  

![](https://res.cloudinary.com/daren64mz/image/upload/v1487457505/string-refactoring_x2tubt.gif)

---

## Solution

### Errors

With `typed-path` typescript can check paths and warns you about errors.

![](http://res.cloudinary.com/daren64mz/image/upload/v1487457505/tp-refactoring_p4byr3.gif)

#### .$path
[@m-abboud](https://github.com/m-abboud)  
Also you can get access to the path string using `$path` special field. 

Like this:
```js
    console.log(tp<TestType>().a.b.c.d.$path); // this will output "a.b.c.d"
```

#### .$raw
[@dcbrwn](https://github.com/dcbrwn)  
If you need a raw path, which is of type `string[]` - you can get it using `$raw` special field.  
*Deprecated, since it transforms symbols and numbers to strings, which might be not an expected behavior (the method name is "raw").
Please use `.$rawPath`*
```js
    console.log(tp<TestType>().a.b.c.d.$raw); // this will output ["a", "b", "c", "d"]
```

#### .$rawPath
If you need a raw path, which is of type `(string | number | Symbol)[]` - you can get it using `$rawPath` special field.  
```js
    console.log(tp<TestType>().a.b[5].c.d.$rawPath); // this will output ["a", "b", 5, "c", "d"]
```

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

Also `typed-path` allows typescript to suggest field names for you.

![](http://res.cloudinary.com/daren64mz/image/upload/v1487458263/tp-suggestions_lg5vnb.gif)

## License

Copyright (c) 2020 Oleksandr Beshchuk <[bs.alex.mail@gmail.com](mailto:bs.alex.mail@gmail.com)>  
Licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
