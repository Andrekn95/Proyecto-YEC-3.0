import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '@env/environment';
import {CustomMessageService} from '@utils/services/custom-message.service';
import {map} from 'rxjs/operators';

import {FileInterface, HttpResponseInterface} from '@utils/interfaces';
import {AppService} from '@utils/services/app.service';

@Injectable({
    providedIn: 'root'
})
export class FileHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/common/files`;
    private readonly _customMessageService = inject(CustomMessageService);
    private readonly _coreService = inject(AppService);

    upload(payload: FormData, modelId: string, typeId: string) {
        const url = `${this._apiUrl}/${modelId}/upload`;

        const params = new HttpParams().append('typeId', typeId);

        return this._httpClient.post<HttpResponseInterface>(url, payload, {params}).pipe(
            map((response) => {
                this._customMessageService.showSuccess({summary: response.title, detail: response.message});

                return response.data;
            })
        );
    }

    downloadFile(file: FileInterface) {
        const url = `${this._apiUrl}/${file.id}/download`;

        this._coreService.showProcessing();

        this._httpClient.get<BlobPart>(url, {responseType: 'blob' as 'json'})
            .subscribe(response => {
                const filePath = URL.createObjectURL(new Blob([response]));

                const downloadLink = document.createElement('a');

                downloadLink.href = filePath;

                downloadLink.setAttribute('download', file.originalName!);

                document.body.appendChild(downloadLink);

                downloadLink.click();

                this._coreService.hideProcessing();
            });
    }
}
