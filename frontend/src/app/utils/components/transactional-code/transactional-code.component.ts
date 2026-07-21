import {Component, forwardRef, inject, input} from '@angular/core';
import {
    AbstractControl,
    AsyncValidator,
    ControlValueAccessor,
    FormsModule,
    NG_ASYNC_VALIDATORS,
    NG_VALUE_ACCESSOR,
    ValidationErrors
} from '@angular/forms';
import {InputOtp, InputOtpChangeEvent} from 'primeng/inputotp';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {Button} from 'primeng/button';
import {InputGroup} from 'primeng/inputgroup';
import {CustomIcons} from "@utils/icons/custom-icons";
import {AuthHttpService} from "@modules/auth/auth-http.service";

@Component({
    selector: 'app-transactional-code',
    template: `
        <p-inputgroup>
            <div (paste)="onContainerPaste($event)">
                <p-inputOtp id="transactionalCode" [ngModel]="value" [length]="6" [integerOnly]="true"
                            (onChange)="handleChange($event)" [disabled]="disabled" [mask]="isMask"/>
            </div>
            <p-button class="ml-2" [icon]="isMask ? CustomIcons.EYE_SOLID : CustomIcons.EYE_SLASH_SOLID"
                      (onClick)="isMask = !isMask" [text]="true" [raised]="true"/>
        </p-inputgroup>
    `,
    imports: [FormsModule, InputOtp, Button, InputGroup],
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => TransactionalCodeComponent),
            multi: true
        },
        {
            provide: NG_ASYNC_VALIDATORS,
            useExisting: forwardRef(() => TransactionalCodeComponent),
            multi: true
        }
    ]
})
export class TransactionalCodeComponent implements ControlValueAccessor, AsyncValidator {
    // value: string = '';
    disabled = false;
    isMask = true;

    requester = input.required<string | null>();
    private readonly authHttpService = inject(AuthHttpService);

    writeValue(val: string): void {
        this.value = val;
    }

    registerOnChange(fn: (val: string) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    // handleChange(ev: InputOtpChangeEvent) {
    //     this.value = ev.value;
    //     this.onChange(this.value);
    //
    //     if (this.value.length === 6) {
    //         this.onTouched();
    //     }
    // }

    validate(control: AbstractControl): Observable<ValidationErrors | null> {
        const value = control.value;

        if (!value) {
            return of({required: true});
        }

        if (value.length < 6) {
            return of({minlength: {requiredLength: 6, actualLength: value.length}});
        }

        return this.authHttpService.verifyTransactionalCode(value, this.requester()!).pipe(
            map((_) => {
                return null;
            }),

            catchError((error) => {
                return of({invalidTransactionalCode: true});
            })
        );
    }

    private _value: string = '';

    get value(): string {
        return this._value;
    }

    set value(raw: string | undefined | null) {
        this._value = (raw ?? '').replace(/\D/g, '').slice(0, 6);
    }

    handleChange(ev: InputOtpChangeEvent): void {
        this.value = ev.value; // el setter sanitiza automáticamente
        this.onChange(this._value);
        if (this._value.length === 6) {
            this.onTouched();
        }
    }

    onContainerPaste(event: ClipboardEvent): void {
        event.preventDefault();
        const raw = event.clipboardData?.getData('text') ?? '';
        this.value = raw; // el setter ya limpia y trunca
        this.onChange(this._value);
        if (this._value.length === 6) {
            this.onTouched();
        }
    }

    private onChange: (val: string) => void = () => {
    };

    private onTouched: () => void = () => {
    };
    protected readonly CustomIcons = CustomIcons;
}
