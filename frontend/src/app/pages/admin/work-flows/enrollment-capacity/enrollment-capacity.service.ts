import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, map, catchError, of} from 'rxjs';
import {
    ClassroomInterface,
    TeacherDistributionInterface,
    FilterFormInterface,
    CreateTeacherDistributionPayload,
    UpdateTeacherDistributionPayload,
    SubjectInterface,
} from './enrollment-capacity.state';
import {CatalogueInterface} from '@utils/interfaces';
import {HttpResponseInterface} from '@utils/interfaces';
import {environment} from '@env/environment';

@Injectable({providedIn: 'root'})
export class EnrollmentCapacityHttpService {
    private readonly httpClient = inject(HttpClient);
    private readonly apiUrl = environment.API_URL;
//private readonly apiUrl = environment.ACADEMIC_COORDINATOR_API;
    findCareers(): Observable<CatalogueInterface[]> {
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/careers`).pipe(
            map((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                return data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    code: item.code || item.acronym,
                }));
            }),
            catchError(() => of([]))
        );
    }

    findSchoolPeriods(): Observable<CatalogueInterface[]> {
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/school-periods`).pipe(
            map((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                return data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    code: item.code,
                }));
            }),
            catchError(() => of([]))
        );
    }

    findSubjectsByCareer(careerId: string): Observable<SubjectInterface[]> {
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/careers/${careerId}/subjects`).pipe(
            map((response) => {
                const data = Array.isArray(response.data) ? response.data : [];
                return data.map((item: any): SubjectInterface => ({
                    id: item.id,
                    name: item.name,
                    code: item.code,
                    academicPeriod: item.academicPeriod,
                    curriculum: item.curriculum,
                }));
            }),
            catchError(() => of([]))
        );
    }

    findAllDistributions(filters: Partial<FilterFormInterface>): Observable<TeacherDistributionInterface[]> {
        if (!filters.schoolPeriodId) {
            return of([]);
        }

        let params = new HttpParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value != null && value !== '') {
                params = params.append(key, String(value));
            }
        });

        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/teacher-distributions`, {params}).pipe(
            map((response) => {
                return Array.isArray(response.data) ? response.data : [];
            }),
            catchError(() => of([]))
        );
    }

    findClassrooms(): Observable<ClassroomInterface[]> {
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/classrooms`).pipe(
            map((response) => {
                return Array.isArray(response.data) ? response.data : [];
            }),
            catchError(() => of([]))
        );
    }

    register(payload: CreateTeacherDistributionPayload): Observable<TeacherDistributionInterface> {
        return this.httpClient.post<HttpResponseInterface>(`${this.apiUrl}/teacher-distributions`, payload).pipe(
            map((response) => {
                return Array.isArray(response.data) ? response.data[0] : response.data;
            })
        );
    }

    update(id: string, payload: UpdateTeacherDistributionPayload): Observable<TeacherDistributionInterface> {
        return this.httpClient.put<HttpResponseInterface>(`${this.apiUrl}/teacher-distributions/${id}`, payload).pipe(
            map((response) => {
                return Array.isArray(response.data) ? response.data[0] : response.data;
            })
        );
    }

    findEnrolledCounts(distributionIds: string[]): Observable<Record<string, number>> {
        if (!distributionIds.length) {
            return of({});
        }
        const params = new HttpParams().set('ids', distributionIds.join(','));
        return this.httpClient.get<HttpResponseInterface>(`${this.apiUrl}/teacher-distributions/enrolled-counts`, {params}).pipe(
            map((response) => {
                return response.data || {};
            }),
            catchError(() => of({}))
        );
    }

    remove(id: string): Observable<void> {
        return this.httpClient.delete<HttpResponseInterface>(`${this.apiUrl}/teacher-distributions/${id}`).pipe(
            map(() => undefined)
        );
    }
}
