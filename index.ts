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

export type TypedPathKey = string | symbol | number;

export type TypedPathFunction<T> = (...args: any[]) => T;

export type TypedPathHandlersConfig = Record<
    string,
    <T extends TypedPathHandlersConfig = Record<never, never>>(path: string[], additionalHandlers?: T) => any
>;

const defaultHandlersConfig = {
    $path: (path: string[]) => pathToString(path),
    $raw: (path: string[]) => path,
    toString: (path: string[]) => () => pathToString(path),
    [Symbol.toStringTag]: (path: string[]) => () => pathToString(path),
    valueOf: (path: string[]) => () => pathToString(path)
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

export function typedPath<T, K extends TypedPathHandlersConfig = Record<never, never>>(
    additionalHandlers?: K,
    path: string[] = [],
    defaultsApplied: boolean = false
): TypedPathWrapper<T, K & typeof defaultHandlersConfig> {
    return <TypedPathWrapper<T, K & typeof defaultHandlersConfig>>new Proxy(
        {},
        {
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

                return typedPath(handlersConfig, [...path, name.toString()], true);
            }
        }
    );
}
