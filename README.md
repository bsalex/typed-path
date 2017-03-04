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

### Suggestions

Also `typed-path` allows typescript to suggest field names for you.

![](http://res.cloudinary.com/daren64mz/image/upload/v1487458263/tp-suggestions_lg5vnb.gif)

## License

Copyright (c) 2017 Oleksandr Beshchuk <[bs.alex.mail@gmail.com](mailto:bs.alex.mail@gmail.com)>  
Licensed under the [Apache License](http://www.apache.org/licenses/LICENSE-2.0).
