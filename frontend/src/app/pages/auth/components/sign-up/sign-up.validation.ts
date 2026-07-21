import {required, SchemaPathTree,} from '@angular/forms/signals';
import {UserI} from "@modules/auth/components/sign-up/sign-up.state";

export function signUpValidation(schema: SchemaPathTree<UserI>): void {
    required(schema.name, {
        message: 'El nombre corto es requerido',
    });

    required(schema.email, {
        message: 'El nombre corto es requerido',
    });
}
