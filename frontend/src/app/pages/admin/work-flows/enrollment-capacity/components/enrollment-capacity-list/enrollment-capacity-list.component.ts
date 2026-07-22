//Lista los registros de cupos/capacidades guardados.

import {Component, effect, inject, OnInit} from '@angular/core';
import {ConfirmDialog} from 'primeng/confirmdialog';
import {FilterPanelComponent} from '../filter-panel/filter-panel.component';
import {StatisticsPanelComponent} from '../statistics-panel/statistics-panel.component';
import {CapacityMatrixComponent} from '../capacity-matrix/capacity-matrix.component';
import {CapacityModalComponent} from '../capacity-modal/capacity-modal.component';
import {LevelCardsComponent} from '../level-cards/level-cards.component';
import {EnrollmentCapacityStore} from '../../enrollment-capacity.store';
import {CellInterface} from '../../enrollment-capacity.state';
import {BreadcrumbService} from '@layout/service/breadcrumb.service';
import {MY_ROUTES} from '@routes';

@Component({
    selector: 'app-enrollment-capacity-list',
    imports: [
        ConfirmDialog,
        FilterPanelComponent,
        StatisticsPanelComponent,
        CapacityMatrixComponent,
        CapacityModalComponent,
        LevelCardsComponent,
    ],
    templateUrl: './enrollment-capacity-list.component.html',
})
export class EnrollmentCapacityListComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    protected readonly store = inject(EnrollmentCapacityStore);

    constructor() {
        this.breadcrumbService.setItems([
            {
                label: 'Capacidad de Matrícula',
                routerLink: MY_ROUTES.adminPages.enrollmentCapacity.absolute,
            },
        ]);

        this.watchFilterChanges();
    }

    ngOnInit(): void {
        this.store.loadInitialData();
    }

    protected openCreateModal(): void {
        this.store.openCreateModal(this.store.selectedSubjectId() ?? undefined);
    }

    protected openEditModal(cell: CellInterface): void {
        this.store.openEditModal(cell);
    }

    private watchFilterChanges(): void {
        effect(() => {
            const filters = this.store.filterForm();

            if (filters.careerId) {
                this.store.loadSubjectsByCareer(filters.careerId);
            }

            if (filters.schoolPeriodId) {
                this.store.loadDistributions({ schoolPeriodId: filters.schoolPeriodId });
            }
        });
    }
}
