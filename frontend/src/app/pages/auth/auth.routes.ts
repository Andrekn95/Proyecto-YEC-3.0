import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';

export default [
    {
        path: MY_ROUTES.authPages.signUp.base,
        title: 'Registro',
        loadComponent: () => import('./components/sign-up/sign-up.component')
    },
] as Routes;
