import {Component, inject} from '@angular/core';
import {EnrollmentCapacityStore} from '../../enrollment-capacity.store';
import {SubjectInterface} from '../../enrollment-capacity.state';
import {NgClass} from '@angular/common';

@Component({
    selector: 'app-level-cards',
    imports: [NgClass],
    template: `
        @if (store.subjects().length > 0) {
            <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <h4 class="text-sm font-bold text-slate-600 mb-3 uppercase tracking-wider">Niveles Académicos</h4>
                <div class="flex flex-wrap gap-3">
                    @for (subject of store.subjects(); track subject.id) {
                        <div
                            class="relative flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 min-w-[100px]"
                            [class.border-blue-500]="subject.id === selectedId()"
                            [class.bg-blue-50]="subject.id === selectedId()"
                            [class.border-slate-200]="subject.id !== selectedId()"
                            [class.bg-white]="subject.id !== selectedId()"
                            (click)="onSelect(subject)">
                            <span class="font-bold text-sm text-slate-800">{{ subject.name }}</span>
                            @if (subject.id === selectedId()) {
                                <i class="pi pi-check-circle text-blue-500 text-lg"></i>
                            }
                        </div>
                    }
                </div>
            </div>
        }
    `,
})
export class LevelCardsComponent {
    protected readonly store = inject(EnrollmentCapacityStore);

    protected selectedId(): string | null {
        return this.store.selectedSubjectId();
    }

    protected onSelect(subject: SubjectInterface): void {
        if (this.store.selectedSubjectId() === subject.id) {
            this.store.selectSubject(null);
        } else {
            this.store.selectSubject(subject.id);
        }
    }
}
