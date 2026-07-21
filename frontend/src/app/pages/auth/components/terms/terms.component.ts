import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { DatePickerModule } from 'primeng/datepicker';
import { MY_ROUTES } from '@routes';
import {CustomIcons} from "@utils/icons/custom-icons";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ConfirmationService } from 'primeng/api';
import { environment } from '@env/environment';
import {AuthHttpService} from "@modules/auth/auth-http.service";

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    standalone: true,
    imports: [PdfViewerModule, ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule, ReactiveFormsModule, DatePickerModule]
})
export default class TermsComponent implements OnInit {
    protected readonly CustomIcons = CustomIcons;
    protected readonly MY_ROUTES = MY_ROUTES;

    private readonly router = inject(Router);
    private readonly authHttpService = inject(AuthHttpService);
    private readonly confirmationService = inject(ConfirmationService);

    constructor() {}

    async ngOnInit() {}

    protected onSubmit() {
        this.acceptTerms();
    }

    protected acceptTerms() {
        this.confirmationService.confirm({
            message: '¿Está seguro de aceptar?',
            header: 'Aceptar',
            icon: CustomIcons.CHECK_DOUBLE_SOLID,
            rejectButtonStyleClass: 'p-button-text',
            acceptButtonStyleClass: 'p-button-text p-button-raised',
            rejectButtonProps: {
                label: 'Cancelar',
                severity: 'secondary',
                text: true
            },
            acceptButtonProps: {
                label: 'Sí, Aceptar'
            },
            accept: () => {
                this.authHttpService.acceptTermsConditions(true).subscribe({
                    next: (_) => {
                        this.router.navigate([MY_ROUTES.adminPages.user.profile.absolute], { replaceUrl: true });
                    }
                });
            },
            key: 'confirmdialog'
        });
    }

    protected readonly environment = environment;
}
