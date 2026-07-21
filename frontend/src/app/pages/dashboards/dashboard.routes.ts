import { Routes } from '@angular/router';

export default [
    {
        path: '',
        title: 'SITURIN V3',
        loadComponent: () => import('@modules/dashboards/dashboards.component')
    }
] as Routes;
