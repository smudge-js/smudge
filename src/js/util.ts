
/** @hidden */
export const console_report = console.log.bind(window.console);

/** @hidden */
export const console_error = console.error.bind(window.console);

/** @hidden */
export function strEnum<T extends string>(o: T[]): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}


