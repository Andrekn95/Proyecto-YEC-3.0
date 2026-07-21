import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { debounceTime, Observable, of, switchMap, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthHttpService } from '@modules/auth/auth-http.service';

export function invalidEmailValidator(): ValidatorFn {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return !value || emailRegex.test(value) ? null : { invalidEmail: true };
    };
}

export function invalidEmailDomainValidator(domain: string = 'produccion.gob.ec'): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value: string = control.value;

        if (!value) return null;

        const parts = value.split('@');
        if (parts.length !== 2) return null;

        const emailDomain = parts[1].toLowerCase();

        return emailDomain === domain.toLowerCase() ? { invalidEmailDomain: { disallowedDomain: domain } } : null;
    };
}

export function registeredIdentificationValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyUserExist(value).pipe(map((response) => (response ? { registeredIdentification: true } : null))))
        );
    };
}

export function userExistValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyUserExist(value).pipe(map((response) => (response ? { userExist: true } : null))))
        );
    };
}

export function unregisteredUserValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyUserExist(value).pipe(map((response) => (response ? null : { unregisteredUser: true }))))
        );
    };
}

export function unavailableUserValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyUserExist(value).pipe(map((response) => (response ? { unavailableUser: true } : null))))
        );
    };
}

export function unavailableEmailValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyEmailExist(value).pipe(map((response) => (response ? { unavailableEmail: true } : null))))
        );
    };
}

export function userUpdatedValidator(authHttpService: AuthHttpService, userId = ''): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyUserUpdated(value, userId).pipe(map((response) => (response ? { userExist: true } : null))))
        );
    };
}

export function pendingPaymentRucValidator(authHttpService: AuthHttpService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
        if (!control.value) return of(null);

        return of(control.value).pipe(
            debounceTime(300),
            take(1),
            switchMap((value) => authHttpService.verifyRucPendingPayment(value).pipe(map((response) => (response ? { pendingPaymentRuc: true } : null))))
        );
    };
}

export function dateGreaterThan(startDateKey: string, endDateKey: string): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
        const start = form.get(startDateKey)?.value;
        const end = form.get(endDateKey)?.value;

        if (!start || !end) return null;

        const startDate = new Date(start);
        const endDate = new Date(end);

        if (endDate < startDate) {
            form.get(startDateKey)?.setErrors({ dateGreaterThan: true, endDate, startDate });
            form.get(endDateKey)?.setErrors({ dateGreaterThan: true, endDate, startDate });
            return { dateGreaterThan: true, endDate, startDate };
        }

        form.get(startDateKey)?.setErrors(null);
        form.get(endDateKey)?.setErrors(null);

        return null;
    };
}

export function passwordPolicesValidator(): ValidatorFn {
    const upperRegex = /[A-Z]/;
    const lowerRegex = /(?:.*[a-z]){4,}/;
    const numberRegex = /(?:.*\d){2,}/;
    const specialCharacterRegex = /[._+\-*@$!]/;

    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        const errors: any = {};

        if (!upperRegex.test(value)) {
            errors.invalidPasswordPolicesUpper = {
                length: 1
            };
        }

        if (!lowerRegex.test(value)) {
            errors.invalidPasswordPolicesLower = {
                length: 4
            };
        }

        if (!numberRegex.test(value)) {
            errors.invalidPasswordPolicesNumber = {
                length: 2
            };
        }

        if (!specialCharacterRegex.test(value)) {
            errors.invalidPasswordPolicesSpecialCharacter = {
                length: 1,
                allowed: '. _ + - * @ $ !'
            };
        }

        return Object.keys(errors).length ? errors : null;
    };
}

export function matchPasswords(password: string, passwordConfirm: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
        const control = group.get(password);
        const matchingControl = group.get(passwordConfirm);

        // Si los controles no existen o si el campo de confirmación ya tiene otro error (ej. required),
        // no hacemos nada para no sobrescribir validaciones previas.
        if (!control || !matchingControl || (matchingControl.errors && !matchingControl.errors['mustMatch'])) {
            return null;
        }

        // Comprobamos si los valores son diferentes
        if (control.value !== matchingControl.value) {
            // Si no coinciden, seteamos el error 'mustMatch' en el control de confirmación
            matchingControl.setErrors({ noPasswordMatch: true });
            return { noPasswordMatch: true };
        } else {
            // Si coinciden, limpiamos el error
            matchingControl.setErrors(null);
            return null;
        }
    };
}
