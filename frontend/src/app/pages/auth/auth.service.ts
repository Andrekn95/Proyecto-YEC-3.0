import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

import { AuthInterface } from '@modules/auth/interfaces/auth.interface';
import { RoleInterface } from '@modules/auth/interfaces/role.interface';
import { Router } from '@angular/router';
import { CustomMessageService } from '@utils/services/custom-message.service';
import { AppService } from '@utils/services/app.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly coreService = inject(AppService);
    private readonly router = inject(Router);
    private readonly customMessageService = inject(CustomMessageService);

    get accessToken(): string | null {
        let accessToken = sessionStorage.getItem('accessToken');

        if (accessToken) {
            accessToken = 'Bearer ' + accessToken.replace(/"/g, '');
        }

        return accessToken;
    }

    set accessToken(value: string) {
        sessionStorage.setItem('accessToken', JSON.stringify(value));
    }

    get refreshToken(): string | null {
        let refreshToken = sessionStorage.getItem('refreshToken');

        if (refreshToken) {
            refreshToken = 'Bearer ' + refreshToken.replace(/"/g, '');
        }

        return refreshToken;
    }

    set refreshToken(value: string) {
        sessionStorage.setItem('refreshToken', JSON.stringify(value));
    }

    get tokenDecode(): string | null {
        let tokenDecode = sessionStorage.getItem('tokenDecode');

        return tokenDecode;
    }

    set tokenDecode(value: string) {
        sessionStorage.setItem('tokenDecode', JSON.stringify(value));
    }

    set avatar(value: string) {
        const auth = this.auth;
        auth.avatar = value;
        sessionStorage.setItem('auth', JSON.stringify(auth));
    }

    get auth(): AuthInterface {
        return JSON.parse(String(sessionStorage.getItem('auth')));
    }

    set auth(auth: AuthInterface | undefined | null) {
        sessionStorage.setItem('auth', JSON.stringify(auth));
    }

    get role(): RoleInterface {
        return JSON.parse(String(sessionStorage.getItem('role')));
    }

    set role(role: RoleInterface | undefined | null) {
        sessionStorage.setItem('role', JSON.stringify(role));
    }

    get roles(): RoleInterface[] {
        return JSON.parse(String(sessionStorage.getItem('roles')));
    }

    set roles(roles: RoleInterface[] | undefined | null) {
        sessionStorage.setItem('roles', JSON.stringify(roles));
    }

    get system(): string | null {
        return environment.APP_NAME;
    }

    get systemShortName(): string | null {
        return environment.APP_SHORT_NAME;
    }

    removeLogin() {
        sessionStorage.clear();
        localStorage.clear();
    }
}
