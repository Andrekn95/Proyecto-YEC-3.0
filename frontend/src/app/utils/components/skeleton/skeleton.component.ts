import { Component, inject, Input } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
    selector: 'app-skeleton',
    templateUrl: './skeleton.component.html',
    imports: [Skeleton],
    standalone: true
})
export class SkeletonComponent {
    @Input() type = 'form';
}
