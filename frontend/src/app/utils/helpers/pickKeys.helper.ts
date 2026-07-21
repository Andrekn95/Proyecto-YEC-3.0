export function pickKeys<T extends object>(
    obj: Partial<T>,
    keys: readonly (keyof T)[]
): Partial<T> {
    const result: Partial<T> = {};
    for (const key of keys) {
        if (key in obj) {
            result[key] = obj[key];
        }
    }
    return result;
}
