import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class UserHttpService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = `${environment.API_URL}/auth/users`;

}
