import {Component, effect, inject, OnDestroy, OnInit, signal, WritableSignal} from '@angular/core';
import {FieldTree, form, FormField} from "@angular/forms/signals";
import {InputText} from "primeng/inputtext";
import {LabelDirective} from "@utils/directives/label.directive";
import {ErrorMessageDirective} from "@utils/directives/error-message.directive";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {CareerStore} from "../../career.store";
import {
    customFormValidation,
} from "@modules/admin/work-flows/career/components/principla-data/principal-data.validation";
import {CareerState, PrincipalData} from "../../career.state";
import {CatalogueInterface} from "@utils/interfaces";
import {CareerService} from "@modules/admin/work-flows/career/career.service";
import {CatalogueService, DpaHttpService} from "@utils/services";
import {CatalogueTypeEnum} from "@utils/enums";

const FORM_STATE_KEY = 'principalData';

@Component({
    selector: 'app-principal-data',
    imports: [
        InputText,
        FormField,
        LabelDirective,
        ErrorMessageDirective
    ],
    templateUrl: './principal-data.component.html'
})
export class PrincipalDataComponent implements OnInit, OnDestroy {
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly careerCreateStore = inject(CareerStore);
    protected readonly form$: WritableSignal<PrincipalData> = signal(this.careerCreateStore.principalData());
    protected readonly careerRegistrationService = inject(CareerService);
    protected readonly catalogueService = inject(CatalogueService);
    protected readonly formData: FieldTree<PrincipalData> = this.buildForm();
    private formInitialized: boolean = false;

    //Catalogues
    protected levels: CatalogueInterface[] = [];

    constructor() {
        this.initializeData();
        this.watchFormChanges();
    }

    ngOnInit(): void {
        this.formRegistryService.register(
            'Datos Principales',
            FORM_STATE_KEY,
            this.formData,
            this.form$()
        );

        this.findLevels2();
    }

    ngOnDestroy(): void {
        this.formRegistryService.unregister(FORM_STATE_KEY);
    }

    private initializeData(): void {
        effect(() => {
            const data = this.careerCreateStore.principalData();

            if (!this.formInitialized) {
                this.form$.set(data);
                this.formInitialized = true;
            }
        });
    }

    private watchFormChanges(): void {
        effect(() => {
            this.careerCreateStore.updateSection(FORM_STATE_KEY, this.form$());
        });
    }

    private buildForm(): FieldTree<PrincipalData> {
        return form<PrincipalData>(this.form$, (schema) => {
            customFormValidation(schema)
        });
    }

    // private findLevels() {
    //     this.careerRegistrationService.findCareers(1, '', '').subscribe({
    //         next: (response) => {
    //             this.levels = response;
    //         }
    //     });
    // }

    private findLevels2() {
        this.levels = this.catalogueService.findByType(CatalogueTypeEnum.users_security_question);
        console.log(this.levels);
    }
}
