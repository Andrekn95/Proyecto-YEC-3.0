import {Component, inject} from '@angular/core';
import {AuthService} from '@modules/auth/auth.service';
import {RoleEnum} from '@utils/enums';
import {BreadcrumbService} from '@layout/service/breadcrumb.service';

@Component({
    selector: 'app-admin-dashboard',
    imports: [],
    template: `
        Admin Dashboard!
    `
})
export default class AdminDashboardComponent {
    protected readonly authService = inject(AuthService);
    private readonly breadcrumbService = inject(BreadcrumbService);

    constructor() {
        this.breadcrumbService.setItems([{label: 'Dashboard'}]);
    }
}
