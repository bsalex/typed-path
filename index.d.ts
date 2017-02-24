export declare type TypedPathWrapper<T> = {
    [P in keyof T]: TypedPathWrapper<T[P]>;
} & {
    (): T;
    [index: number]: TypedPathWrapper<T[any]>;
    path: () => string;
};
export declare function typedPath<T>(path?: string[]): TypedPathWrapper<T>;
