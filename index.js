"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var toStringMethods = [
    'toString',
    'path',
    Symbol.toStringTag,
    'valueOf'
];
function pathToString(path) {
    return path.reduce(function (current, next) {
        if (+next === +next) {
            current += "[" + next + "]";
        }
        else {
            current += current === '' ? "" + next : "." + next;
        }
        return current;
    }, '');
}
function typedPath(path) {
    if (path === void 0) { path = []; }
    return new Proxy({}, {
        get: function (target, name) {
            if (toStringMethods.includes(name)) {
                return function () { return pathToString(path); };
            }
            return typedPath(path.concat([name.toString()]));
        }
    });
}
exports.typedPath = typedPath;
//# sourceMappingURL=index.js.map