export interface FormError {
    section: string;
    field: string;
    error: string;
    message: string;
}

export type ErrorMessageFactory = (errorValue?: any) => string;

export const ERROR_MESSAGES:
    Record<string, ErrorMessageFactory> = {

    required: () =>
        'Campo obligatorio',

    email: () =>
        'Correo inválido',

    minlength: (error) =>
        `Debe tener al menos ${error.requiredLength} caracteres`,

    maxlength: (error) =>
        `Debe tener máximo ${error.requiredLength} caracteres`,

    pattern: () =>
        'Formato inválido',

    invalidDocument: (error) =>
        error.reason,

    invalidAge: (error) =>
        `La edad mínima es ${error.minAge} años`
};
