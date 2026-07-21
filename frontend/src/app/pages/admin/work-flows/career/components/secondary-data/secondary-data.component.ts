import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {LabelDirective} from "@utils/directives/label.directive";
import {CareerStore} from "../../career.store";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {
    customValidation,
} from "@modules/admin/work-flows/career/components/secondary-data/secondary-data.validation";
import {SecondaryData} from "../../career.state";

const FORM_STATE_KEY = 'secondaryData';

@Component({
    selector: 'app-secondary-data',
    imports: [
        InputText,
        LabelDirective,
        FormField,
        ErrorMessageDirective,

    ],
    templateUrl: './secondary-data.component.html'
})
export class SecondaryDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerStore);
    protected readonly form$: WritableSignal<SecondaryData> = signal(this.careerCreateStore.secondaryData());
    protected readonly formData: FieldTree<SecondaryData> = this.buildForm();
    private formInitialized: boolean = false;

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Secundarios',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private initializeData(): void {
        effect(() => {
            const data = this.careerCreateStore.secondaryData();

            if (!this.formInitialized && data.code) {
                this.formInitialized = true;
                this.form$.set(data);
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.careerCreateStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm(): FieldTree<SecondaryData> {
        return form<SecondaryData>(this.form$, (schema) => {
            customValidation(schema)
        });
    }
}
