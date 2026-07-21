import {Component, inject, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {StyleClassModule} from 'primeng/styleclass';
import {Breadcrumb} from 'primeng/breadcrumb';
import {BreadcrumbService} from '@layout/service/breadcrumb.service';
import {CustomIcons} from "@utils/icons/custom-icons";


@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, Breadcrumb],
    template: `
        <div class="rounded-lg shadow-md mb-2">
            <p-breadcrumb [model]="breadcrumbService.items()" [home]="home"/>
        </div>
    `
})
export class AppBreadcrumb implements OnInit {
    protected readonly breadcrumbService = inject(BreadcrumbService);
    home!: MenuItem;

    ngOnInit() {
        this.home = {icon: CustomIcons.HOUSE_SOLID, routerLink: '/'};
    }
}
