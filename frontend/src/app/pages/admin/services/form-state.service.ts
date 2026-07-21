import {computed, effect, Injectable, signal} from '@angular/core';
import {AbstractControl} from '@angular/forms';

interface UserInterface {
    name: string;
    phone: string;
}

interface RoleInterface {
    code: string;
    name: string;
}

export interface FormStateInterface {
    user: UserInterface | null;
    role: RoleInterface | null;
}

const INITIAL_FORM_STATE: FormStateInterface = {
    user: null,
    role: null
};

const FORM_STATE_KEY = 'formState';
const FORM_ERRORS_KEY = 'formErrors';

@Injectable({providedIn: 'root'})
export class FormStateService {
    readonly formState = signal<FormStateInterface>(this.loadFromStorage());
    readonly formErrors = signal<Record<string, string[]>>({});

    readonly user = computed(() => this.formState().user);
    readonly role = computed(() => this.formState().role);

    constructor() {
        effect(() => {
            sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(this.formState()));
            sessionStorage.setItem(FORM_ERRORS_KEY, JSON.stringify(this.formErrors()));
        });
    }

    updateSection<K extends keyof FormStateInterface>(section: K, data: Partial<FormStateInterface[K]>) {
        this.formState.update((state) => ({
            ...state,
            [section]: {
                ...state[section], // lo anterior
                ...data // lo nuevo
            }
        }));
    }

    clearState() {
        this.formState.set(INITIAL_FORM_STATE);
        sessionStorage.removeItem(FORM_STATE_KEY);
    }

    private loadFromStorage(): FormStateInterface {
        const stored = sessionStorage.getItem(FORM_STATE_KEY);
        return stored ? JSON.parse(stored) : INITIAL_FORM_STATE;
    }

    setFormErrors(componentKey: string, errors: string[]): void {
        this.formErrors.update((current) => ({
            ...current,
            [componentKey]: errors
        }));
    }

    readonly allErrors = computed(() => Object.values(this.formErrors()).flat());

    readonly hasErrors = computed(() => this.allErrors().length > 0);

    private readonly forms = new Map<string, AbstractControl>();

    registerForm(key: string, form: AbstractControl): void {
        this.forms.set(key, form);
    }

    unregisterForm(key: string): void {
        this.forms.delete(key);
    }

    private markAllTouched(key?: string): void {
        if (key) {
            this.forms.get(key)?.markAllAsTouched();
        } else {
            console.log(this.forms);
            this.forms.forEach((form) => form.markAllAsTouched());
        }
    }

    validateAll(): boolean {
        this.markAllTouched();
        return !this.hasErrors();
    }
}
