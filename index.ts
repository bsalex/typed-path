type TypedPathNode<T> = {
    $path: string;
};

type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedPathWrapper<T> = (T extends Array<infer Z>
    ? {
        [index: number]: TypedPathWrapper<Z>;
    }
    : T extends TypedPathFunction<infer RET>
        ? {
            (): TypedPathWrapper<RET>;
        } & {
            [P in keyof RET]: TypedPathWrapper<RET[P]>;
        }
        : {
            [P in keyof T]: TypedPathWrapper<T[P]>;
        }
    ) & TypedPathNode<T>;

const toStringMethods: (string | symbol | number)[] = [
    'toString',
    Symbol.toStringTag,
    'valueOf'
];

function pathToString(path: string[]): string {
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
            if (name === '$path') {
                return pathToString(path);
            }

            if (toStringMethods.includes(name)) {
                return () => pathToString(path);
            }

            return typedPath([...path, name.toString()]);
        }
    });
}
