import {Component, input, output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {RowInterface, CellInterface} from '../../enrollment-capacity.state';

@Component({
    selector: 'app-capacity-matrix',
    imports: [ButtonModule],
    templateUrl: './capacity-matrix.component.html',
})
export class CapacityMatrixComponent {
    readonly matrix = input.required<RowInterface[]>();
    readonly edit = output<CellInterface>();
}
