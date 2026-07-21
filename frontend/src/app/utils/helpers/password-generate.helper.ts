type PasswordOptions = {
    length?: number; // total, default 12 (mínimo 8)
    allowRepeat?: boolean; // default true
    avoidConfusables?: boolean; // default true
};

export function generatePassword(options: PasswordOptions = {}): string {
    const length = options.length ?? 12;
    const allowRepeat = options.allowRepeat ?? true;
    const avoidConfusables = options.avoidConfusables ?? true;

    // Sets base
    let UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let LOWER = 'abcdefghijklmnopqrstuvwxyz';
    let DIGITS = '0123456789';
    const SPECIAL = '._+-*@$!';

    // Evitar caracteres confusos
    if (avoidConfusables) {
        // Quitar: O, I (upper) y o, l (lower) y 0, 1 (digits)
        UPPER = UPPER.replace(/[OI]/g, '');
        LOWER = LOWER.replace(/[ol]/g, '');
        DIGITS = DIGITS.replace(/[01]/g, '');
    }

    const ALL = UPPER + LOWER + DIGITS + SPECIAL;

    // Requisitos mínimos
    const minRequired = 1 + 2 + 4 + 1; // 8

    if (length < minRequired) throw new Error(`length debe ser >= ${minRequired}`);

    if (!allowRepeat) {
        // Validación: necesitas suficientes caracteres únicos en cada set requerido
        if (new Set(LOWER).size < 4) throw new Error('No hay suficientes minúsculas únicas');
        if (new Set(DIGITS).size < 2) throw new Error('No hay suficientes números únicos');
        if (new Set(UPPER).size < 1) throw new Error('No hay suficientes mayúsculas únicas');
        if (new Set(SPECIAL).size < 1) throw new Error('No hay suficientes especiales únicos');
        if (new Set(ALL).size < length) throw new Error('No hay suficientes caracteres únicos para ese length');
    }

    // Random seguro si existe
    const randInt = (max: number) => {
        if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
            const arr = new Uint32Array(1);
            crypto.getRandomValues(arr);
            return arr[0] % max;
        }
        return Math.floor(Math.random() * max);
    };

    const pick = (s: string) => s[randInt(s.length)];

    const pickUnique = (s: string, used: Set<string>) => {
        if (allowRepeat) return pick(s);

        const pool = [...s].filter((c) => !used.has(c));
        if (pool.length === 0) throw new Error('No hay caracteres disponibles sin repetir en el set');
        return pool[randInt(pool.length)];
    };

    // Construcción cumpliendo reglas
    const used = new Set<string>();
    const chars: string[] = [];

    const pushChar = (c: string) => {
        chars.push(c);
        used.add(c);
    };

    // 1 mayúscula
    pushChar(pickUnique(UPPER, used));

    // 3 minúsculas
    for (let i = 0; i < 4; i++) pushChar(pickUnique(LOWER, used));

    // 3 números
    for (let i = 0; i < 2; i++) pushChar(pickUnique(DIGITS, used));

    // 1 especial
    pushChar(pickUnique(SPECIAL, used));

    // Relleno
    while (chars.length < length) {
        pushChar(pickUnique(ALL, used));
    }

    // Mezcla Fisher–Yates
    for (let i = chars.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    return chars.join('');
}

// Ejemplos:
// console.info(generatePassword()); // 12, sin confusos, con repetición
// console.info(generatePassword({ length: 16 }));
// console.info(generatePassword({ length: 12, allowRepeat: false })); // sin repetir
// console.info(generatePassword({ length: 12, avoidConfusables: false })); // permite 0/1/O/I...
