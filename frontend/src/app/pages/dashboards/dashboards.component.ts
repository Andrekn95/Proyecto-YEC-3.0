import {Component, inject} from '@angular/core';
import {AuthService} from '@modules/auth/auth.service';
import {RoleEnum} from '@utils/enums';
import {BreadcrumbService} from '@layout/service/breadcrumb.service';
import AdminDashboardComponent from "@modules/dashboards/admin/admin-dashboard.component";

@Component({
    selector: 'app-dashboards',
    imports: [AdminDashboardComponent],
    template: `
        @if (authService.role) {
            @switch (authService.role.code) {
                @case (RoleEnum.ADMIN) {
                    <app-admin-dashboard/>
                }
            }
        }
    `,
    styleUrl: './dashboards.component.scss'
})
export default class DashboardsComponent {
    protected readonly authService = inject(AuthService);
    protected readonly RoleEnum = RoleEnum;
    private readonly breadcrumbService = inject(BreadcrumbService);

    constructor() {
        this.breadcrumbService.setItems([{label: 'Dashboard'}]);
    }
}
