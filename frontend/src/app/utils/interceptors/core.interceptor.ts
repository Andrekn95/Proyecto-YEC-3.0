import { inject } from '@angular/core';
import { HttpContextToken, HttpEvent, HttpHeaders, HttpInterceptorFn, HttpParams, HttpResponse } from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';
import { AppService } from '@utils/services/app.service';
import { CustomMessageService } from '@utils/services';

export const coreInterceptor: HttpInterceptorFn = (req, next) => {
    let flag: boolean | undefined = false;
    const appService = inject(AppService);
    const customMessageService = inject(CustomMessageService);
    let headers = req.headers ? req.headers : new HttpHeaders();
    let params = req.params ? req.params : new HttpParams();

    if (params.get('page')) {
        if (!params.get('limit')) {
            params = params.append('limit', 10);
        }
    }

    
    // headers = headers.append('Accept', 'application/json');
    //
    // flag = req.headers.getAll('Content-Type')?.some((header) => header === 'multipart/form-data');
    //
    // if (!flag) {
    //     headers = headers.append('Content-Type', 'application/json');
    // }

    appService.showLoading();
    appService.showProcessing();

    return next(req.clone({ headers, params })).pipe(
        tap({
            next: (event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // const status = event.status;
                    // const resHeaders = event.headers; // <-- headers de respuesta

                    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
                        if (!event.url?.includes('refresh-token')) {
                            customMessageService.showHttpSuccess(event.body);
                        }
                    }

                    if (['GET'].includes(req.method)) {
                        if (event.url?.includes('transactional-codes')) {
                            customMessageService.showHttpSuccess(event.body);
                        }
                    }
                }
            }
        }),
        
        finalize(() => {
            appService.hideLoading();
            appService.hideProcessing();
        })
    );
};

