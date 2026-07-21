import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@/pages/auth/auth.service';
import { MY_ROUTES } from '@routes';
import { CustomMessageService } from '@utils/services';

export const guideGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const customMessageService = inject(CustomMessageService);

    if (!authService.auth?.sex || !authService.auth?.nationality || !authService.auth?.birthdate) {
        customMessageService.showError({ summary: 'Completar información', detail: 'Complete la información que falta para continuar, Sexo, Nacionalidad y Fecha de Nacimiento' });
        return router.createUrlTree([MY_ROUTES.adminPages.user.profile.absolute], {
            queryParams: {
                from: 'guideEstablishment'
            }
        });
    }

    return true;
};
