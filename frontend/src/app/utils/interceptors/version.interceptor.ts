import { HttpResponse, HttpInterceptorFn } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AppService } from '@utils/services/app.service';
import {HttpResponseInterface} from "@utils/interfaces";

export const versionInterceptor: HttpInterceptorFn = (req, next) => {
    const _coreService = inject(AppService);

    return next(req.clone()).pipe(
        tap((httpEvent) => {
            if (httpEvent.type === 0) {
                return;
            }

            if (httpEvent instanceof HttpResponse) {
                const version = (httpEvent.body as HttpResponseInterface).version;

                if (version) {
                    _coreService.newVersion = version;

                    if (!_coreService.version) {
                        _coreService.updateSystem();
                    } else if (version != _coreService.version) {
                        if (version != _coreService.version) {
                            // messageService.questionVersion(version)
                            //   .then(result => {
                            //     if (result.isConfirmed) {
                            //       coreService.updateSystem();
                            //     }
                            //   });
                        }
                    }
                }
            }
        })
    );
};
