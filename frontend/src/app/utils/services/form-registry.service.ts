import {computed, Injectable, signal} from '@angular/core';
import {FieldTree} from '@angular/forms/signals';

type AnyFieldTree = FieldTree<unknown>;

export interface FormError {
    label: string;
    form: string;
    field: string;
    message: string;
}

interface RegisteredForm {
    label: string;
    fieldTree: AnyFieldTree;
    keys: string[];
}

@Injectable({
    providedIn: 'root',
})
export class FormRegistryService {

    private readonly forms = signal(
        new Map<string, RegisteredForm>()
    );

    readonly errors = computed<FormError[]>(() => {
        const errors: FormError[] = [];

        for (const [formName, {label, fieldTree, keys}] of this.forms()) {
            for (const key of keys) {
                const field = (fieldTree as Record<string, () => any>)[key]?.();

                if (!field?.invalid?.()) continue;

                for (const error of field.errors()) {
                    errors.push({
                        form: formName,
                        label,
                        field: key,
                        message: error.message ?? error.kind,
                    });
                }
            }
        }

        return errors;
    });

    readonly hasErrors = computed(() => this.errors().length > 0);

    register<T extends object>(
        label: string,
        name: string,
        fieldTree: FieldTree<T>,
        model: T,
    ): void {
        this.forms.update(forms => {
            const next = new Map(forms);

            next.set(name, {
                label,
                fieldTree: fieldTree as AnyFieldTree,
                keys: Object.keys(model),
            });

            return next;
        });
    }

    unregister(name: string): void {
        this.forms.update(forms => {
            const next = new Map(forms);
            next.delete(name);
            return next;
        });
    }
}
