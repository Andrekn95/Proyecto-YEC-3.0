import {required, SchemaPathTree} from '@angular/forms/signals';
import {FilterFormInterface} from '../../enrollment-capacity.state';

export function validateFilterForm(schema: SchemaPathTree<FilterFormInterface>): void {
    required(schema.schoolPeriodId, {
        message: 'El período escolar es requerido',
    });
}
