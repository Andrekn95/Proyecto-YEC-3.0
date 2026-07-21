import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { MY_ROUTES } from '@routes';
import {AuthService} from "@modules/auth/auth.service";
import {RoleInterface} from "@modules/auth/interfaces";

export const roleGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    if (!authService.auth) {
        return router.createUrlTree([MY_ROUTES.errorPages.forbidden]);
    }

    const authRole: RoleInterface = authService.role;

    if (authRole) {
        for (const role of route.data['roles']) {
            if (role.toUpperCase() === authRole.code.toUpperCase()) return true;
        }
    }

    return router.createUrlTree([MY_ROUTES.errorPages.forbidden]);
};
