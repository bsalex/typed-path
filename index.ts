function pathToString(path: TypedPathKey[]): string {
    return path.reduce<string>((current, next) => {
        if (typeof next === 'number') {
            current += `[${next}]`;
        } else {
            current += current === '' ? next.toString() : `.${next.toString()}`;
        }

        return current;
    }, '');
}

export type TypedPathKey = string | symbol | number;

export type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedPathHandlersConfig = Record<
    string,
    <T extends TypedPathHandlersConfig = Record<never, never>>(path: TypedPathKey[], additionalHandlers?: T) => any
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
    [Symbol.toStringTag]: (path: TypedPathKey[]) => () => pathToString(path),
    valueOf: (path: TypedPathKey[]) => () => pathToString(path)
};

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

const emptyObject = {};
export function typedPath<T, K extends TypedPathHandlersConfig = Record<never, never>>(
    additionalHandlers?: K,
    path: TypedPathKey[] = [],
    defaultsApplied: boolean = false
): TypedPathWrapper<T, K & typeof defaultHandlersConfig> {
    return <TypedPathWrapper<T, K & typeof defaultHandlersConfig>>new Proxy(emptyObject, {
        get(target: T, name: TypedPathKey) {
            let handlersConfig: TypedPathHandlersConfig;

            if (defaultsApplied) {
                handlersConfig = additionalHandlers!;
            } else {
                handlersConfig = {...(additionalHandlers ?? {}), ...defaultHandlersConfig};
            }

            if (handlersConfig.hasOwnProperty(name)) {
                return handlersConfig[name as any](path, additionalHandlers);
            }

            let newChunk = name;

            if (typeof newChunk === 'string') {
                const nameAsNumber = +newChunk;
                if (nameAsNumber === nameAsNumber) {
                    newChunk = nameAsNumber;
                }
            }

            return typedPath(handlersConfig, [...path, newChunk], true);
        }
    });
}
