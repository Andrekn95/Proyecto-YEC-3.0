import {Component, inject, input, InputSignal, OnInit} from '@angular/core';
import {Button} from "primeng/button";
import {FormRegistryService} from "@utils/services/form-registry.service";
import {JsonPipe} from "@angular/common";
import {MY_ROUTES} from "@routes";
import {CustomIcons} from "@utils/icons/custom-icons";
import {BreadcrumbService} from "@layout/service/breadcrumb.service";
import {CustomMessageService} from "@utils/services";
import {CareerService} from "../../career.service";
import {CareerState} from "@modules/admin/work-flows/career/career.state";
import {CareerStore} from '../../career.store';
import {
    PrincipalDataComponent
} from "@modules/admin/work-flows/career/components/principla-data/principal-data.component";
import {SecondaryDataComponent} from "../secondary-data/secondary-data.component";

@Component({
    selector: 'app-career-form',
    imports: [
        PrincipalDataComponent,
        Button,
        JsonPipe,
        SecondaryDataComponent
    ],
    templateUrl: './career-form.component.html'
})
export class CareerFormComponent implements OnInit {
    private readonly breadcrumbService = inject(BreadcrumbService);
    private readonly formRegistryService = inject(FormRegistryService);
    private readonly customMessageService = inject(CustomMessageService);
    protected readonly careerCreateStore = inject(CareerStore);
    protected readonly careerRegistrationService = inject(CareerService);
    protected readonly CustomIcons = CustomIcons;

    public id = input.required<string>();

    constructor() {
        this.breadcrumbService.setItems(
            [
                {
                    label: 'Listado de Carreras',
                    routerLink: MY_ROUTES.adminPages.user.absolute
                },
                {
                    label: 'Formulario',
                },
            ]
        );
    }

    ngOnInit() {
        if (this.id() !== 'new') this.loadData();
    }

    private loadData() {
        this.careerRegistrationService.findCareer(this.id()).subscribe({
            next: (response) => {
                this.careerCreateStore.updateSection('principalData', response);
                this.careerCreateStore.updateSection('secondaryData', response);
            }
        });
    }

    async onSubmit() {
        if (this.formRegistryService.hasErrors()) {
            this.customMessageService.showFormErrors(this.formRegistryService.errors());
            return;
        }

        const payload = {
            principalData: this.careerCreateStore.principalData(),
            secondaryData: this.careerCreateStore.secondaryData(),
        }

        console.log(payload);
        if (this.id() === 'new') {
            this.create(payload);
        } else {
            this.update(payload);
        }
    }

    private create(payload: CareerState) {
        this.careerRegistrationService.createCareer(payload).subscribe({
            next: (response) => {
            }
        });
    }

    private update(payload: CareerState) {
        this.careerRegistrationService.updateCareer(this.id(), payload).subscribe({
            next: (response) => {
            }
        });
    }
}
