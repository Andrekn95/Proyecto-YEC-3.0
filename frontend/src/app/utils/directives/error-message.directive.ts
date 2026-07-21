import {Directive, ElementRef, inject, Input, OnDestroy, OnInit, Renderer2, effect, untracked} from '@angular/core';
import {FieldTree} from '@angular/forms/signals';

@Directive({
    selector: '[appErrorMessage]',
    standalone: true
})
export class ErrorMessageDirective implements OnInit, OnDestroy {
    private readonly _elementRef: ElementRef<HTMLDivElement> = inject(ElementRef);
    private readonly _renderer = inject(Renderer2);
    private readonly _nativeElement: HTMLDivElement;

    @Input({required: true}) appErrorMessage!: FieldTree<any>;

    private readonly _errorMessages: Record<string, string | ((errors: any) => string)> = {
        required: () => 'El campo es obligatorio.',
        requiredTrue: () => 'El campo es obligatorio.',
        email: () => 'Correo electrónico no es válido.',
        minlength: (e) => `Debe contener como mínimo ${e['minlength']['requiredLength']} caracteres.`,
        maxlength: (e) => `Debe contener como máximo ${e['maxlength']['requiredLength']} caracteres.`,
        min: (e) => `Número mínimo permitido es ${e['min']['min']}.`,
        max: (e) => `Número máximo permitido es ${e['max']['max']}.`,
        pattern: () => 'No cumple con el formato.',
        noPasswordMatch: () => 'Las contraseñas no coinciden.',
        dateInvalid: () => 'No es una fecha válida.',
        dateMax: (e) => `La fecha ${e['dateMax']['actualDate']} no puede ser mayor a ${e['dateMax']['requiredDate']}.`,
        dateMin: (e) => `La fecha ${e['dateMin']['actualDate']} no puede ser menor a ${e['dateMin']['requiredDate']}.`,
        invalidEmail: () => 'Correo electrónico no es válido.',
        invalidEmailDomain: () => 'El correo no puede pertenecer al Ministerio de Producción.',
        phoneNotAvailable: () => 'Este teléfono no está disponible.',
        agreementExists: () => 'El número interno de convenio ya se encuentra registrado.',
        registeredIdentification: () => 'El RUC ya se encuentra registrado.',
        pendingPaymentRuc: () => 'El RUC ingresado mantiene pagos pendientes.',
        unavailableUser: () => 'El usuario no se encuentra disponible.',
        unavailableEmail: () => 'El correo ya se encuentra en uso, por favor intente con otro.',
        userExist: () => 'El usuario ya se encuentra registrado, por favor intente con otro.',
        unregisteredUser: () => 'El usuario no se encuentra registrado, por favor registre una cuenta.',
        invalidPasswordPolicesUpper: (e) => `La contraseña debe tener al menos ${e['invalidPasswordPolicesUpper']['length']} mayúscula.`,
        invalidPasswordPolicesLower: (e) => `La contraseña debe tener al menos ${e['invalidPasswordPolicesLower']['length']} minúsculas.`,
        invalidPasswordPolicesNumber: (e) => `La contraseña debe tener al menos ${e['invalidPasswordPolicesNumber']['length']} números.`,
        invalidPasswordPolicesSpecialCharacter: (e) => `La contraseña debe tener al menos ${e['invalidPasswordPolicesSpecialCharacter']['length']} caracter especial ${e['invalidPasswordPolicesSpecialCharacter']['allowed']}.`,
        invalidTransactionalCode: () => 'El código de seguridad no es válido.',
    };

    constructor() {
        this._nativeElement = this._elementRef.nativeElement;

        effect(() => {
            const state = this.appErrorMessage();
            const touched = state.touched();
            const dirty = state.dirty();
            const errors = state.errors();

            untracked(() => this._render(touched, dirty, errors));
        });
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
    }

    private _render(touched: boolean, dirty: boolean, errors: readonly any[]): void {
        let text = '';

        if ((touched || dirty) && errors?.length) {
            const messages = errors
                .map(err => {
                    const handler = this._errorMessages[err.kind];
                    if (handler) {
                        const errRecord = {[err.kind]: err};
                        return typeof handler === 'function' ? handler(errRecord) : handler;
                    }
                    return err.message ?? null;
                })
                .filter(Boolean);

            text = messages.join('\n');
            this._renderer.addClass(this._nativeElement, 'text-red-500');
        } else {
            this._renderer.removeClass(this._nativeElement, 'text-red-500');
        }

        this._renderer.setProperty(this._nativeElement, 'innerText', text);
    }
}
