import {inject} from '@angular/core';
import {HttpHeaders, HttpInterceptorFn} from '@angular/common/http';
import {AuthService} from '@modules/auth/auth.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);

    let headers = req.headers ? req.headers : new HttpHeaders();

    if (authService.accessToken && !headers.get('Authorization')) {
        headers = headers.append('Authorization', authService.accessToken);
    }

    return next(req.clone({headers}));
};
