import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '@/pages/auth/auth.service';
import { CatalogueRucsTypeEnum } from '@/pages/core/shared/enums';
import { CustomMessageService } from '@utils/services';

export const guideJuridicalGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const customMessageService = inject(CustomMessageService);

    if (authService.auth?.ruc?.type?.code == CatalogueRucsTypeEnum.juridical) {
        customMessageService.showError({ summary: 'Personas Jurídicas no pueden acceder', detail: 'No cumple' });
        return false;
    }

    return true;
};
