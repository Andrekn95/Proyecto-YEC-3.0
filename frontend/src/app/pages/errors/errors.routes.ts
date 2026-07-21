import { Routes } from '@angular/router';
import { MY_ROUTES } from '@routes';
import { NotFoundComponent } from './not-found.component';
import { UnauthorizedComponent } from './unauthorized.component';
import { ForbiddenComponent } from './forbidden.component';
import { UnavailableComponent } from './unavailable.component';

export default [
    { title: MY_ROUTES.errorPages.unauthorized.base, path: MY_ROUTES.errorPages.unauthorized.base, component: UnauthorizedComponent },
    { title: MY_ROUTES.errorPages.forbidden.base, path: MY_ROUTES.errorPages.forbidden.base, component: ForbiddenComponent },
    { title: MY_ROUTES.errorPages.notFound.base, path: MY_ROUTES.errorPages.notFound.base, component: NotFoundComponent },
    { title: MY_ROUTES.errorPages.unavailable.base, path: MY_ROUTES.errorPages.unavailable.base, component: UnavailableComponent }
] as Routes;
