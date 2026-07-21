import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {RowInterface, CellInterface} from '../../enrollment-capacity.state';

@Component({
    selector: 'app-capacity-matrix',
    imports: [ButtonModule],
    templateUrl: './capacity-matrix.component.html',
})
export class CapacityMatrixComponent {
    @Input({required: true}) matrix!: RowInterface[];
    @Output() edit = new EventEmitter<CellInterface>();
    @Output() create = new EventEmitter<void>();
}
