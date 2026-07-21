import { authenticationInterceptor } from './authentication.interceptor';
import { tokenInterceptor } from './token.interceptor';
import { errorInterceptor } from './error.interceptor';
import { versionInterceptor } from './version.interceptor';
import { coreInterceptor } from './core.interceptor';

export const HttpInterceptorProviders = [
    tokenInterceptor,
    authenticationInterceptor,
    errorInterceptor,
    versionInterceptor,
    coreInterceptor
];
