import {required, min, max, SchemaPathTree} from '@angular/forms/signals';
import {ModalFormInterface} from '../../enrollment-capacity.state';

export function validateModalForm(schema: SchemaPathTree<ModalFormInterface>): void {
    required(schema.capacity, {
        message: 'La capacidad es requerida',
    });

    min(schema.capacity, 1, {
        message: 'La capacidad mínima es 1',
    });

    max(schema.capacity, 100, {
        message: 'La capacidad máxima es 100',
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
