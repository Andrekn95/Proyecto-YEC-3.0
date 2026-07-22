import {required, SchemaPathTree} from '@angular/forms/signals';
import {ModalFormInterface} from '../../enrollment-capacity.state';

export function validateModalForm(schema: SchemaPathTree<ModalFormInterface>): void {
    required(schema.capacity, {
        message: 'La capacidad es requerida',
    });

    required(schema.classroomId, {
        message: 'El aula es requerida',
    });

    required(schema.workdayId, {
        message: 'La jornada es requerida',
    });

    required(schema.subjectId, {
        message: 'La materia es requerida',
    });
}
