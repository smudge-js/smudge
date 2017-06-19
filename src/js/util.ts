export const console_report = console.log.bind(window.console);
export const console_error = console.error.bind(window.console);

export function strEnum<T extends string>(o: Array<T>): {[K in T]: K} {
  return o.reduce((res, key) => {
    res[key] = key;
    return res;
  }, Object.create(null));
}