//Muestra totales (cupos, paralelos, etc.) según los filtros.
import {Component, input, Input} from '@angular/core';
import {ChartModule} from 'primeng/chart';
import {
    EnrollmentCapacityStatistics,
    ChartDataInterface,
    ChartOptionsInterface,
} from '../../enrollment-capacity.state';

@Component({
    selector: 'app-statistics-panel',
    imports: [ChartModule],
    templateUrl: './statistics-panel.component.html',
})
export class StatisticsPanelComponent {
    chartData=input.required<ChartDataInterface> ();
   chartOptions=input.required<ChartOptionsInterface>();
 statistics=input.required<EnrollmentCapacityStatistics>();
}
