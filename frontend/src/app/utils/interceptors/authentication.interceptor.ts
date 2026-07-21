import {inject} from '@angular/core';
import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {switchMap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

import {AppService} from '@utils/services/app.service';
import {AuthService} from '@modules/auth/auth.service';
import {AuthHttpService} from '@modules/auth/auth-http.service';
import {MY_ROUTES} from '@routes';

export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
    const coreService = inject(AppService);
    const authService = inject(AuthService);
    const authHttpService = inject(AuthHttpService);
    const router = inject(Router);

    const isRefreshRequest = req.url.includes('/refresh-token');

    const logout = () => {
        authService.removeLogin();
        authHttpService.signOut().subscribe({
            error: () => {
            }
        });
        router.navigate([MY_ROUTES.authPages.signIn.absolute]);
    };

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            /* ===========================
             * 401 - UNAUTHORIZED OR TOKEN EXPIRADO
             * =========================== */
            if (error.status === 401) {
                if (!authService.refreshToken || isRefreshRequest) {
                    logout();
                    return throwError(() => error);
                }

                return authHttpService.refreshToken().pipe(
                    switchMap(({accessToken, refreshToken}) => {
                        authService.accessToken = accessToken;
                        authService.refreshToken = refreshToken;

                        return next(
                            req.clone({
                                setHeaders: {
                                    Authorization: authService.accessToken
                                }
                            })
                        );
                    }),
                    catchError(() => {
                        logout();
                        return throwError(() => error);
                    })
                );
            }

            /* ===========================
             * 403 - PERMISOS / CUENTA
             * =========================== */
            if (error.status === 403) {
                switch (error.error?.error) {
                    case 'INSUFFICIENT_PERMISSIONS':
                        router.navigate([MY_ROUTES.errorPages.forbidden.absolute]);
                        break;

                    case 'ACCOUNT_SUSPENDED':
                    case 'ACCOUNT_LOCKED':
                        logout();
                        break;

                    default:
                        logout();
                }

                return throwError(() => error);
            }

            /* ===========================
             * 503 - MANTENIMIENTO
             * =========================== */
            if (error.status === 503) {
                coreService.serviceUnavailable = error.error?.data;
                logout();
                return throwError(() => error);
            }

            return throwError(() => error);
        })
    );
};
