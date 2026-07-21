import {required, SchemaPathTree,} from '@angular/forms/signals';
import {PrincipalData} from "@modules/admin/work-flows/career/career.state";

export function customFormValidation(schema: SchemaPathTree<PrincipalData>): void {
    required(schema.name, {
        message: 'El nombre corto es requerido'
    });

    required(schema.code, {
        message: 'El código es requerido',
    });
}
