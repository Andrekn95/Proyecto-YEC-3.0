import {required, SchemaPathTree,} from '@angular/forms/signals';
import {SecondaryData} from "@modules/admin/work-flows/career/career.state";
import {inject} from "@angular/core";
import {CareerStore} from "@modules/admin/work-flows/career/career.store";

export function customValidation(schema: SchemaPathTree<SecondaryData>): void {
    const careerCreateStore = inject(CareerStore);

    const x = ({valueOf}: any) => careerCreateStore.principalData().code === '1' || valueOf(schema.code) === '1';

    required(schema.shortName, {
        message: 'El nombre corto es requerido',
        when: x
    });
}
