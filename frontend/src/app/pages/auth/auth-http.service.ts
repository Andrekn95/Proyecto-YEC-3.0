import {inject, Injectable} from '@angular/core';
import {HttpResponseInterface, PasswordChangedInterface, SignInInterface, UserInterface} from './interfaces';
import {environment} from '@env/environment';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {concatMap, map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from '@modules/auth/auth.service';
import {SignInResponseInterface} from '@modules/auth/interfaces';
import {from, Observable, of} from 'rxjs';
import {AppService, CatalogueHttpService, DpaHttpService} from '@utils/services';
import {CoreEnum} from '@utils/enums';
import {Router} from '@angular/router';
import {MY_ROUTES} from '@routes';
import {CatalogueInterface} from '@utils/interfaces';
import {SignUpState} from "@modules/auth/components/sign-up/sign-up.state";

@Injectable({
    providedIn: 'root'
})
export class AuthHttpService {
    protected readonly catalogueHttpService = inject(CatalogueHttpService);
    private readonly authService = inject(AuthService);
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/auth`;
    private readonly dpaHttpService = inject(DpaHttpService);
    private readonly router = inject(Router);
    private readonly appService = inject(AppService);

    refreshToken() {
        const url = `${this.apiUrl}/refresh-token`;

        const headers = new HttpHeaders({Authorization: this.authService.refreshToken!});

        return this.httpClient.post<SignInResponseInterface>(url, null, {headers}).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    signIn(payload: SignInInterface) {
        const url = `${this.apiUrl}/sign-in`;

        return this.catalogueHttpService.findCache().pipe(
            // 1. Guardar catálogos principales
            concatMap((catalogues) => from(this.appService.setEncryptedValue(CoreEnum.catalogues, catalogues))),

            // 2. Obtener y guardar Model Catalogues (Agrupado)
            switchMap(() => this.catalogueHttpService.findCacheModelCatalogues().pipe(concatMap((response) => from(this.appService.setEncryptedValue(CoreEnum.modelCatalogues, response))))),

            // 3. Obtener y guardar DPA (Agrupado)
            switchMap(() => this.dpaHttpService.findCache().pipe(concatMap((dpa) => from(this.appService.setEncryptedValue(CoreEnum.dpa, dpa))))),

            // 5. Petición HTTP final del Login
            switchMap(() => this.httpClient.post<SignInResponseInterface>(url, payload)),

            // 6. Asignación de variables de sesión
            tap((response: SignInResponseInterface) => {
                const {data} = response;

                this.authService.accessToken = data.accessToken;
                this.authService.refreshToken = data.refreshToken;
                this.authService.auth = data.auth;
                this.authService.roles = data.roles;

                if (data.roles.length === 1) {
                    this.authService.role = data.roles[0];
                }
            }),

            // 7. Retorno de la data final
            map((response: SignInResponseInterface) => response.data)
        );
    }

    signOut() {
        if (!this.authService.accessToken) {
            localStorage.clear();
            sessionStorage.clear();
            this.router.navigate([MY_ROUTES.authPages.signIn.absolute]);
            return of();
        }

        const url = `${this.apiUrl}/sign-out`;

        return this.httpClient.post<SignInResponseInterface>(url, null).pipe(
            map((response) => {
                localStorage.clear();
                sessionStorage.clear();
                this.router.navigate([MY_ROUTES.authPages.signIn.absolute]);
                return response.data;
            })
        );
    }

    changePassword(payload: PasswordChangedInterface): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/passwords`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    resetPassword(payload: PasswordChangedInterface): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/passwords/reset`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    signUpExternal(payload: SignUpState) {
        const url = `${this.apiUrl}/sign-up-external`;

        return this.httpClient.post<SignInResponseInterface>(url, payload).pipe(
            map((response) => {
                return response;
            })
        );
    }

    requestTransactionalCode(): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes`;

        return this.httpClient.post<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    requestTransactionalSignupCode(identification: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${identification}/signup`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    requestTransactionalPasswordResetCode(identification: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${identification}/password-reset`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyTransactionalCode(token: string, requester: string): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/transactional-codes/${token}/verify`;
        return this.httpClient.patch<HttpResponseInterface>(url, {requester}).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyUserExist(identification: string) {
        const url = `${this.apiUrl}/${identification}/exist`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyEmailExist(email: string) {
        const url = `${this.apiUrl}/${email}/email-exist`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyUserUpdated(identification: string, userId = '') {
        const url = `${this.apiUrl}/${identification}/updated`;

        const params = new HttpParams().append('userId', userId);

        return this.httpClient.get<HttpResponseInterface>(url, {params}).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyRegisteredUser(identification: string) {
        const url = `${this.apiUrl}/${identification}/registered`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifySecurityQuestionsAndResetEmail(userId: string, payload: any): Observable<HttpResponseInterface> {
        const url = `${this.apiUrl}/${userId}/security-questions/verify`;

        return this.httpClient.patch<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyRucPendingPayment(ruc: string) {
        const url = `${this.apiUrl}/verify-ruc-pending-payment/${ruc}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findSecurityQuestions(): Observable<CatalogueInterface> {
        const url = `${this.apiUrl}/security-questions`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    createSecurityQuestions(payload: CatalogueInterface): Observable<UserInterface> {
        const url = `${this.apiUrl}/security-questions`;

        return this.httpClient.post<HttpResponseInterface>(url, payload).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    verifyEmail(token: string) {
        const url = `${this.apiUrl}/verify-email`;

        return this.httpClient.post<HttpResponseInterface>(url, {token}).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    requestVerifyEmail(username: string) {
        const url = `${this.apiUrl}/request-verify-email`;

        return this.httpClient.post<HttpResponseInterface>(url, {username}).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findRUC(ruc: string) {
        const url = `${this.apiUrl}/rucs/${ruc}`;

        return this.httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    acceptTermsConditions(termsAcceptedAt: boolean) {
        const url = `${this.apiUrl}/terms-conditions/accept`;

        return this.httpClient.patch<HttpResponseInterface>(url, {termsAcceptedAt}).pipe(
            map((response) => {
                this.authService.auth = {...this.authService.auth, termsAcceptedAt: new Date()};
                return response.data;
            })
        );
    }

    rejectTermsConditions() {
        const url = `${this.apiUrl}/terms-conditions/reject`;

        return this.httpClient.patch<HttpResponseInterface>(url, null).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
