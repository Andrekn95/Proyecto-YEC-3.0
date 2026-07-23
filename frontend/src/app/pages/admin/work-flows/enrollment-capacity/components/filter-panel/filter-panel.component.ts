import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FieldTree, form} from '@angular/forms/signals';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';
import {EnrollmentCapacityStore} from '../../enrollment-capacity.store';
import {FilterFormInterface} from '../../enrollment-capacity.state';
import {validateFilterForm} from './filter-panel.validation';

const FORM_STATE_KEY = 'filterForm';

@Component({
    selector: 'app-filter-panel',
    imports: [FormsModule, Select, LabelDirective, ErrorMessageDirective],
    templateUrl: './filter-panel.component.html',
})
export class FilterPanelComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    protected readonly store = inject(EnrollmentCapacityStore);

    protected readonly formData: FieldTree<FilterFormInterface> = this.buildForm();

    ngOnInit(): void {
        this.formRegistryService.register(
            'Filtros de Capacidad',
            FORM_STATE_KEY,
            this.formData,
            this.store.filterForm()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private buildForm(): FieldTree<FilterFormInterface> {
        return form<FilterFormInterface>(this.store.filterForm, (schema) => {
            validateFilterForm(schema);
        });
    }
}
