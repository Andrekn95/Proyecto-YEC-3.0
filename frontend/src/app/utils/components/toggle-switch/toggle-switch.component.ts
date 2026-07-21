import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToggleSwitch } from 'primeng/toggleswitch';

@Component({
    selector: 'app-toggle-switch',
    template: `
        <p-toggle-switch
            [ngModel]="value" (onChange)="handleChange($event)" [disabled]="disabled">
            <ng-template #handle let-checked="checked">
                <span class="!text-xs font-semibold">{{ checked ? 'SÍ' : 'NO' }}</span>
            </ng-template>
        </p-toggle-switch>
    `,
    imports: [ToggleSwitch, FormsModule],
    standalone: true,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ToggleSwitchComponent),
            multi: true
        }
    ]
})
export class ToggleSwitchComponent implements ControlValueAccessor {
    value: boolean = true;
    disabled = false;

    private onChange: (val: boolean) => void = () => {};
    private onTouched: () => void = () => {};

    writeValue(val: boolean): void {
        this.value = !!val;
    }
    registerOnChange(fn: (val: boolean) => void): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    handleChange(ev: {checked: boolean}) {
        this.value = ev.checked;
        this.onChange(this.value);
        this.onTouched();
    }
}
