export function datePickerFormat(): string {
    return 'yy-mm-dd';
}

export function dateOnlyToLocalDate(dateStr?: string | null): Date | null {
    if (!dateStr) return null;

    let d: number, m: number, y: number;

    if (dateStr.includes('/')) {
        [d, m, y] = dateStr.split('/').map(Number);
    } else {
        [y, m, d] = dateStr.split('-').map(Number);
    }

    return new Date(y, m - 1, d, 12, 0, 0);
}
