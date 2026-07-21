import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form} from '@angular/forms/signals';
import {FormsModule} from '@angular/forms';
import {Select} from 'primeng/select';
import {LabelDirective} from '@utils/directives/label.directive';
import {ErrorMessageDirective} from '@utils/directives/error-message.directive';
import {FormRegistryService} from '@utils/services/form-registry.service';
import {EnrollmentCapacityStore} from '../../enrollment-capacity.store';
import {FilterFormInterface, INITIAL_FILTER_FORM} from '../../enrollment-capacity.state';
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

    protected readonly form$: WritableSignal<FilterFormInterface> = signal({...this.store.filterForm()});
    protected readonly formData: FieldTree<FilterFormInterface> = this.buildForm();
    private formInitialized: boolean = false;

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Filtros de Capacidad',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    protected onCareerChange(value: string): void {
        this.form$.update(current => ({...current, careerId: value}));
    }

    protected onSchoolPeriodChange(value: string): void {
        this.form$.update(current => ({...current, schoolPeriodId: value}));
    }

    private initializeData(): void {
        effect(() => {
            const data = this.store.filterForm();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.store.updateFilterForm(this.form$());
        });
    }

    private buildForm(): FieldTree<FilterFormInterface> {
        return form<FilterFormInterface>(this.form$, (schema) => {
            validateFilterForm(schema);
        });
    }
}
