
export async function wait(ms = 0) {
    return new Promise((_resolve, _reject) => {
        setTimeout(_resolve, ms);
    });

}

/** @hidden */
export function strEnum<T extends string>(o: T[]): {[K in T]: K} {
    return o.reduce((res, key) => {
        res[key] = key;
        return res;
    }, Object.create(null));
}


