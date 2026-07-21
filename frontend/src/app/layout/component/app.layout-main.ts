import {Component, computed, effect, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LayoutService} from '@layout/service/layout.service';
import {MY_ROUTES} from '@routes';
import {environment} from '@env/environment';
import {AppTopbar} from './app.topbar';
import {AppSidebar} from './app.sidebar';
import {AppFooter} from './app.footer';
import {AppBreadcrumb} from './app.breadcrumb';
import {CustomIcons} from "@utils/icons/custom-icons";

@Component({
    selector: 'app-layout-main',
    standalone: true,
    imports: [CommonModule, AppTopbar, AppSidebar, RouterModule, AppFooter, AppBreadcrumb],
    template: `
        <div class="layout-wrapper" [ngClass]="containerClass()">
            <app-topbar/>
            <app-sidebar/>
            <div class="layout-main-container">
                <app-breadcrumb/>

                <div class="layout-main">
                    <router-outlet/>
                </div>

                <app-footer/>
            </div>
            <div class="layout-mask"></div>
        </div>
    `
})
export default class AppLayoutMain {
    layoutService = inject(LayoutService);
    protected readonly environment = environment;
    protected readonly MY_ROUTES = MY_ROUTES;
    protected readonly CustomIcons = CustomIcons;

    constructor() {
        effect(() => {
            const state = this.layoutService.layoutState();
            if (state.mobileMenuActive) {
                document.body.classList.add('blocked-scroll');
            } else {
                document.body.classList.remove('blocked-scroll');
            }
        });
    }

    containerClass = computed(() => {
        const config = this.layoutService.layoutConfig();
        const state = this.layoutService.layoutState();
        return {
            'layout-overlay': config.menuMode === 'overlay',
            'layout-static': config.menuMode === 'static',
            'layout-static-inactive': state.staticMenuDesktopInactive && config.menuMode === 'static',
            'layout-overlay-active': state.overlayMenuActive,
            'layout-mobile-active': state.mobileMenuActive
        };
    });
}
