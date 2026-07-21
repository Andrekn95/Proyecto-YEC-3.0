import {Routes} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {tokenGuard} from '@utils/guards';

export default [
    {
        path: MY_ROUTES.publicPages.terms.base,
        title: 'Términos y Condiciones',
        loadComponent: () => import('@modules/auth/components/terms/terms.component'),
        canActivate: [tokenGuard]
    },
    {
        path: MY_ROUTES.publicPages.icons.base,
        title: 'Icons',
        loadComponent: () => import('./icons/font-awesome-icons')
    },
] as Routes;
