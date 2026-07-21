import {ApplicationConfig, LOCALE_ID, provideZonelessChangeDetection} from '@angular/core';
import {
    provideRouter,
    withComponentInputBinding,
    withEnabledBlockingInitialNavigation,
    withInMemoryScrolling
} from '@angular/router';
import Aura from '@primeuix/themes/aura';
import {providePrimeNG} from 'primeng/config';
import {appRoutes} from './app.routes';
import {registerLocaleData} from '@angular/common';
import localeEs from '@angular/common/locales/es';
import {ConfirmationService, MessageService} from 'primeng/api';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient, withFetch, withInterceptors} from "@angular/common/http";
import {HttpInterceptorProviders} from "@utils/interceptors";

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withComponentInputBinding(), withInMemoryScrolling({
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled'
        }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(withFetch(), withInterceptors(HttpInterceptorProviders)),
        provideAnimations(),
        provideZonelessChangeDetection(),
        providePrimeNG({theme: {preset: Aura, options: {darkModeSelector: '.app-dark'}}}),

        {provide: LOCALE_ID, useValue: 'es'},

        MessageService,
        ConfirmationService
    ]
};
