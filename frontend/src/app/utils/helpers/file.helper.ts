export function uploadFileValidator(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return null;

    let maxMb = 2 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowed.includes(file.type)) {
        return null;
    }

    if (file.size > maxMb) {
        return null;
    }

    return file;
}
