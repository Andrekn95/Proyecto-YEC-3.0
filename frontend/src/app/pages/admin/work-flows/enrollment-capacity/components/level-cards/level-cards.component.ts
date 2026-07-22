import {Component, inject} from '@angular/core';
import {EnrollmentCapacityStore} from '../../enrollment-capacity.store';
import {SubjectInterface} from '../../enrollment-capacity.state';

@Component({
    selector: 'app-level-cards',
    template: `
        @if (store.subjects().length > 0) {
            <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h4 class="text-sm font-bold text-slate-600 mb-5 uppercase tracking-wider">Niveles Académicos</h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4">
                    @for (subject of store.subjects(); track subject.id) {
                        <div
                            class="relative flex flex-col items-center justify-center gap-3 px-5 py-6 rounded-xl border-2 cursor-pointer transition-all duration-200 min-h-[120px] select-none"
                            [class.border-blue-500]="subject.id === selectedId()"
                            [class.bg-blue-50]="subject.id === selectedId()"
                            [class.shadow-md]="subject.id === selectedId()"
                            [class.border-slate-200]="subject.id !== selectedId()"
                            [class.bg-white]="subject.id !== selectedId()"
                            [class.hover:border-blue-300]="subject.id !== selectedId()"
                            [class.hover:shadow-lg]="subject.id !== selectedId()"
                            [class.hover:-translate-y-1]="subject.id !== selectedId()"
                            (click)="onSelect(subject)">
                            <span class="font-extrabold text-base text-slate-800 text-center leading-tight">{{ subject.name }}</span>
                            @if (subject.id === selectedId()) {
                                <span class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                                    <i class="pi pi-check-circle text-sm"></i>
                                    Seleccionado
                                </span>
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
