import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@modules/auth/auth.service';
import {AuthHttpService} from "@modules/auth/auth-http.service";

export const tokenGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const authHttpService = inject(AuthHttpService);
    const router = inject(Router);

    if (authService.accessToken) {
        return true;
    }

    authHttpService.signOut().subscribe();

    return false;
};
