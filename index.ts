export type TypedPathKey = string | symbol | number;

function appendStringPathChunk(path: string, chunk: TypedPathKey): string {
    if (typeof chunk === 'number') {
        return `${path}[${chunk}]`;
    } else {
        return appendStringSymbolChunkToPath(path, chunk);
    }
}

function appendStringSymbolChunkToPath(path: string, chunk: string | symbol) {
    return `${path}${path === '' ? '' : '.'}${chunk.toString()}`;
}

function pathToString(path: TypedPathKey[]): string {
    return path.reduce<string>((current, next) => {
        return appendStringPathChunk(current, next);
    }, '');
}

export type TypedPathFunction<ResultType> = (...args: any[]) => ResultType;

export type TypedPathHandlersConfig = Record<
    string,
    <T extends TypedPathHandlersConfig>(path: TypedPathKey[], additionalHandlers?: T) => any
>;

function defaultHandlersConfig<RootType>() {
    return {
        $rootType: () => ({} as RootType),
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
}

export type DefaultHandlers<RootType> = ReturnType<typeof defaultHandlersConfig<RootType>>;

export type TypedPathHandlers<ConfigType extends TypedPathHandlersConfig> = {
    [key in keyof ConfigType]: ReturnType<ConfigType[key]>;
};

export type TypedPathWrapper<
    RootType,
    OriginalType,
    HandlersType extends TypedPathHandlers<Record<never, never>>
> = (OriginalType extends Array<infer OriginalArrayItemType>
    ? {
          [index: number]: TypedPathWrapper<RootType, OriginalArrayItemType, HandlersType>;
      }
    : OriginalType extends TypedPathFunction<infer OriginalFunctionResultType>
    ? {
          (): TypedPathWrapper<RootType, OriginalFunctionResultType, HandlersType>;
      } & {
          [P in keyof Required<OriginalFunctionResultType>]: TypedPathWrapper<
              RootType,
              OriginalFunctionResultType[P],
              HandlersType
          >;
      }
    : {
          [P in keyof Required<OriginalType>]: TypedPathWrapper<RootType, OriginalType[P], HandlersType>;
      }) &
    TypedPathHandlers<HandlersType>;

function convertNumericKeyToNumber(key: TypedPathKey): TypedPathKey {
    if (typeof key === 'string') {
        const keyAsNumber = +key;
        if (keyAsNumber === keyAsNumber) {
            return keyAsNumber;
        }
    }

    return key;
}

function getHandlerByNameKey<RootType, K extends TypedPathHandlersConfig>(name: TypedPathKey, additionalHandlers?: K) {
    if (additionalHandlers?.hasOwnProperty(name)) {
        return additionalHandlers[name as string];
    }

    const defaultHandlers = defaultHandlersConfig<RootType>();

    if (defaultHandlers[name as keyof typeof defaultHandlersConfig]) {
        return defaultHandlers[name as keyof typeof defaultHandlersConfig];
    }

    return null;
}

const emptyObject = {};
export function typedPath<
    RootObjectType,
    OriginalObjectType =  RootObjectType,
    HandlersType extends TypedPathHandlersConfig = Record<never, never>
>(
    additionalHandlers?: HandlersType,
    path: TypedPathKey[] = []
): TypedPathWrapper<RootObjectType, OriginalObjectType, HandlersType & DefaultHandlers<RootObjectType>> {
    return <TypedPathWrapper<RootObjectType, OriginalObjectType, HandlersType & DefaultHandlers<RootObjectType>>>(
        new Proxy(emptyObject, {
            get(target: unknown, name: TypedPathKey) {
                const handler = getHandlerByNameKey(name, additionalHandlers);

                return handler
                    ? handler(path, additionalHandlers)
                    : typedPath(additionalHandlers, [...path, convertNumericKeyToNumber(name)]);
            }
        })
    );
}
