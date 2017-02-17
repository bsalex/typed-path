export type TypedPathWrapper<T> = {
    [P in keyof T]: TypedPathWrapper<T[P]>;
} &
{
    (): T;
    [index: number]: TypedPathWrapper<T[any]>;
    path: () => string;
};

const toStringMethods: (string | symbol | number)[] = [
    'toString',
    'path',
    Symbol.toStringTag,
    'valueOf'
];

function pathToString (path: string[]): string {
    return path.reduce((current, next) => {
        if (+next === +next) {
            current += `[${next}]`;
        } else {
            current += current === '' ? `${next}` : `.${next}`;
        }

        return current;
    }, '');
}

export function typedPath<T>(path: string[] = []): TypedPathWrapper<T> {
    return <TypedPathWrapper<T>>new Proxy({}, {
        get(target: T, name: string | symbol | number) {
            if (toStringMethods.includes(name)) {
                return () => pathToString(path);
            }

            return typedPath([...path, name.toString()]);
        }
    });
}