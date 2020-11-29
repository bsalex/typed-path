export type TypedPathKey = string | symbol | number;

function appendStringPathChunk(path: string, chunk: TypedPathKey): string {
    if (typeof chunk === 'number') {
        return path + `[${chunk}]`;
    } else {
        return appendStringSymbolChunkToPath(path, chunk);
    }
}

function appendStringSymbolChunkToPath(path: string, chunk: string | symbol) {
    return path + (path === '' ? chunk.toString() : `.${chunk.toString()}`);
}

function pathToString(path: TypedPathKey[]): string {
    return path.reduce<string>((current, next) => {
        return appendStringPathChunk(current, next);
    }, '');
}

export type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedPathHandlersConfig = Record<
    string,
    <T extends TypedPathHandlersConfig>(path: TypedPathKey[], additionalHandlers?: T) => any
>;

const defaultHandlersConfig = {
    $path: (path: TypedPathKey[]) => pathToString(path),
    /**
     * @deprecated This method transforms all path chunks to strings.
     * If you need the path with numbers and Symbols - use $rawPath
     */
    $raw: (path: TypedPathKey[]) => path.map((chunk) => chunk.toString()),
    $rawPath: (path: TypedPathKey[]) => path,
    toString: (path: TypedPathKey[]) => () => pathToString(path),
    [Symbol.toStringTag]: (path: TypedPathKey[]) => pathToString(path),
    valueOf: (path: TypedPathKey[]) => () => pathToString(path)
};

type DefaultHandlers = typeof defaultHandlersConfig;

export type TypedPathHandlers<T extends TypedPathHandlersConfig> = {
    [key in keyof T]: ReturnType<T[key]>;
};

export type TypedPathWrapper<T, TPH extends TypedPathHandlers<Record<never, never>>> = (T extends Array<infer Z>
    ? {
          [index: number]: TypedPathWrapper<Z, TPH>;
      }
    : T extends TypedPathFunction<infer RET>
    ? {
          (): TypedPathWrapper<RET, TPH>;
      } & {
          [P in keyof Required<RET>]: TypedPathWrapper<RET[P], TPH>;
      }
    : {
          [P in keyof Required<T>]: TypedPathWrapper<T[P], TPH>;
      }) &
    TypedPathHandlers<TPH>;

function convertNumericKeyToNumber(key: TypedPathKey): TypedPathKey {
    if (typeof key === 'string') {
        const keyAsNumber = +key;
        if (keyAsNumber === keyAsNumber) {
            return keyAsNumber;
        }
    }

    return key;
}

function getHandlerByNameKey<K extends TypedPathHandlersConfig>(name: TypedPathKey, additionalHandlers?: K) {
    if (additionalHandlers?.hasOwnProperty(name)) {
        return additionalHandlers[name as string];
    }

    if (defaultHandlersConfig[name as keyof typeof defaultHandlersConfig]) {
        return defaultHandlersConfig[name as keyof typeof defaultHandlersConfig];
    }
}

const emptyObject = {};
export function typedPath<T, K extends TypedPathHandlersConfig = Record<never, never>>(
    additionalHandlers?: K,
    path: TypedPathKey[] = []
): TypedPathWrapper<T, K & DefaultHandlers> {
    return <TypedPathWrapper<T, K & DefaultHandlers>>new Proxy(emptyObject, {
        get(target: T, name: TypedPathKey) {
            const handler = getHandlerByNameKey(name, additionalHandlers);

            return handler
                ? handler(path, additionalHandlers)
                : typedPath(additionalHandlers, [...path, convertNumericKeyToNumber(name)]);
        }
    });
}
