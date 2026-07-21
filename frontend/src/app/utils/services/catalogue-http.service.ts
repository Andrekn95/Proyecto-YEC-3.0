import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';
import {CustomMessageService} from '@utils/services/custom-message.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {CatalogueInterface,HttpResponseInterface, ModelCatalogueInterface} from '@utils/interfaces';

@Injectable({
    providedIn: 'root'
})
export class CatalogueHttpService {
    private readonly _httpClient = inject(HttpClient);
    private readonly _apiUrl = `${environment.API_URL}/common/catalogues`;
    private readonly _customMessageService = inject(CustomMessageService);

    findCache(): Observable<CatalogueInterface[]> {
        const url = `${this._apiUrl}/cache`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }

    findCacheModelCatalogues(): Observable<ModelCatalogueInterface[]> {
        const url = `${this._apiUrl}/model-catalogues/cache`;

        return this._httpClient.get<HttpResponseInterface>(url).pipe(
            map((response) => {
                return response.data;
            })
        );
    }
}
