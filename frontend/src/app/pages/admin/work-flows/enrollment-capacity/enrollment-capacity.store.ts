import {computed, inject, Injectable, signal} from '@angular/core';
import {EnrollmentCapacityHttpService} from './enrollment-capacity.service';
import {ConfirmationService} from 'primeng/api';
import {CustomMessageService} from '@utils/services';
import {
    TeacherDistributionInterface,
    CatalogueInterface,
    ClassroomInterface,
    FilterFormInterface,
    ModalFormInterface,
    RowInterface,
    BlockInterface,
    CellInterface,
    EnrollmentCapacityStatistics,
    ShiftStatistics,
    CourseStatistics,
    ChartDataInterface,
    ChartOptionsInterface,
    CreateTeacherDistributionPayload,
    UpdateTeacherDistributionPayload,
    DEFAULT_CHART_OPTIONS,
    INITIAL_FILTER_FORM,
    INITIAL_MODAL_FORM,
    SubjectInterface,
} from './enrollment-capacity.state';
import { environment } from '@env/environment';

@Injectable({providedIn: 'root'})
export class EnrollmentCapacityStore {
    private readonly httpService = inject(EnrollmentCapacityHttpService);
    private readonly confirmationService = inject(ConfirmationService);
    private readonly customMessageService = inject(CustomMessageService);

    readonly filterForm = signal<FilterFormInterface>({...INITIAL_FILTER_FORM});
    readonly modalForm = signal<ModalFormInterface>({...INITIAL_MODAL_FORM});

    readonly careers = signal<CatalogueInterface[]>([]);
    readonly schoolPeriods = signal<CatalogueInterface[]>([]);
    readonly classrooms = signal<ClassroomInterface[]>([]);
    readonly distributions = signal<TeacherDistributionInterface[]>([]);
    readonly subjects = signal<SubjectInterface[]>([]);

    readonly modalVisible = signal<boolean>(false);
    readonly isEditMode = signal<boolean>(false);
    readonly selectedCell = signal<CellInterface | null>(null);
    readonly chartOptions = signal<ChartOptionsInterface>(DEFAULT_CHART_OPTIONS);
    readonly isLoading = signal<boolean>(false);
    readonly error = signal<string | null>(null);
    readonly enrolledCounts = signal<Map<string, number>>(new Map());
    readonly selectedSubjectId = signal<string | null>(null);

    readonly filteredDistributions = computed<TeacherDistributionInterface[]>(() => {
        const selected = this.selectedSubjectId();
        if (!selected) return this.distributions();
        return this.distributions().filter((d) => d.subjectId === selected);
    });

    readonly parallels = computed<CatalogueInterface[]>(() => {
        const parallelsMap = new Map<string, CatalogueInterface>();
        this.filteredDistributions().forEach((dist) => {
            if (dist.parallel && !parallelsMap.has(dist.parallel.id)) {
                parallelsMap.set(dist.parallel.id, {
                    id: dist.parallel.id,
                    name: dist.parallel.name,
                    code: dist.parallel.code,
                });
            }
        });
        return Array.from(parallelsMap.values());
    });

    readonly workdays = computed<CatalogueInterface[]>(() => {
        const workdaysMap = new Map<string, CatalogueInterface>();
        this.filteredDistributions().forEach((dist) => {
            if (dist.workday && !workdaysMap.has(dist.workday.id)) {
                workdaysMap.set(dist.workday.id, {
                    id: dist.workday.id,
                    name: dist.workday.name,
                    code: dist.workday.code,
                });
            }
        });
        return Array.from(workdaysMap.values());
    });

    readonly academicPeriods = computed<CatalogueInterface[]>(() => {
        const periodsMap = new Map<string, CatalogueInterface>();
        this.filteredDistributions().forEach((dist) => {
            const academicPeriod = dist.subject?.academicPeriod;
            if (academicPeriod && !periodsMap.has(academicPeriod.id)) {
                periodsMap.set(academicPeriod.id, {
                    id: academicPeriod.id,
                    name: academicPeriod.name,
                    code: academicPeriod.description || '',
                });
            }
        });
        return Array.from(periodsMap.values());
    });

    readonly distributionSubjects = computed<SubjectInterface[]>(() => {
        const subjectsMap = new Map<string, SubjectInterface>();
        this.distributions().forEach((dist) => {
            if (dist.subject && !subjectsMap.has(dist.subject.id)) {
                subjectsMap.set(dist.subject.id, dist.subject as SubjectInterface);
            }
        });
        return Array.from(subjectsMap.values());
    });

    readonly matrix = computed<RowInterface[]>(() => {
        this.enrolledCounts();
        return this.buildEnrollmentMatrix(this.filteredDistributions());
    });

    readonly statistics = computed<EnrollmentCapacityStatistics>(() => {
        this.enrolledCounts();
        return this.calculateEnrollmentStatistics(this.filteredDistributions());
    });

    readonly hasLevelSelected = computed<boolean>(() => !!this.selectedSubjectId());

    readonly chartData = computed<ChartDataInterface>(() => {
        return this.buildEnrollmentChart(this.statistics());
    });

    readonly hasFilters = computed<boolean>(() => {
        return !!this.filterForm().schoolPeriodId;
    });

    readonly hasBothFilters = computed<boolean>(() => {
        return !!this.filterForm().careerId && !!this.filterForm().schoolPeriodId;
    });

    readonly showDetails = computed<boolean>(() => {
        return this.hasBothFilters() && !!this.selectedSubjectId();
    });

    readonly hasSelectedLevelDistributions = computed<boolean>(() => {
        const subjectId = this.selectedSubjectId();
        if (!subjectId) return false;
        return this.distributions().some((d) => d.subjectId === subjectId);
    });

    updateFilterForm(update: Partial<FilterFormInterface>): void {
        this.filterForm.update((current) => ({...current, ...update}));
    }

    updateModalForm(update: Partial<ModalFormInterface>): void {
        this.modalForm.update((current) => ({...current, ...update}));
    }

    loadInitialData(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.httpService.findCareers().subscribe({
            next: (data: CatalogueInterface[]) => this.careers.set(data),
            error: () => this.error.set('Error al cargar carreras'),
        });

        this.httpService.findSchoolPeriods().subscribe({
            next: (data: CatalogueInterface[]) => {
                this.schoolPeriods.set(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.error.set('Error al cargar períodos escolares');
                this.isLoading.set(false);
            },
        });

        this.httpService.findClassrooms().subscribe({
            next: (data: ClassroomInterface[]) => this.classrooms.set(data),
            error: () => this.error.set('Error al cargar aulas'),
        });
    }

    loadSubjectsByCareer(careerId: string): void {
        if (!careerId) {
            this.subjects.set([]);
            return;
        }

  
        this.httpService.findSubjectsByCareer(careerId).subscribe({
            next: (data: SubjectInterface[]) => this.subjects.set(data),
            error: () => this.error.set('Error al cargar materias'),
        });
    }

    loadDistributions(form: Partial<FilterFormInterface>): void {
        if (!form.schoolPeriodId) {
            this.distributions.set([]);
            this.enrolledCounts.set(new Map());
            return;
        }

        this.isLoading.set(true);

        this.httpService.findAllDistributions(form).subscribe({
            next: (data: TeacherDistributionInterface[]) => {
                this.distributions.set(data);
                this.loadEnrolledCounts(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.error.set('Error al cargar distribuciones');
                this.isLoading.set(false);
            },
        });
    }

    selectSubject(subjectId: string | null): void {
        this.selectedSubjectId.set(subjectId);
    }

    openCreateModal(subjectId?: string): void {
        this.isEditMode.set(false);
        this.selectedCell.set(null);
        this.modalForm.set({
            ...INITIAL_MODAL_FORM,
            subjectId: subjectId || null,
        });
        this.modalVisible.set(true);
    }

    openEditModal(cell: CellInterface): void {
        this.isEditMode.set(true);
        this.selectedCell.set(cell);
        this.modalForm.set({
            capacity: cell.cupoMaximo,
            parallelId: cell.parallelId,
            workdayId: cell.workdayId,
            subjectId: cell.subjectId,
        });
        this.modalVisible.set(true);
    }

    closeModal(): void {
        this.modalVisible.set(false);
        this.selectedCell.set(null);
        this.modalForm.set({...INITIAL_MODAL_FORM});
    }

    confirmSave(): void {
        this.confirmationService.confirm({
            header: this.isEditMode() ? 'Actualizar distribución' : 'Guardar distribución',
            message: this.isEditMode()
                ? '¿Está seguro de actualizar este cupo?'
                : '¿Está seguro de guardar este nuevo cupo?',
            icon: 'pi pi-question-circle',
            acceptLabel: this.isEditMode() ? 'Actualizar' : 'Guardar',
            rejectLabel: 'Cancelar',
            acceptIcon: 'pi pi-check',
            rejectIcon: 'pi pi-times',
            acceptButtonStyleClass: 'p-button-success',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => this.saveDistribution(),
        });
    }

    confirmDelete(): void {
        this.confirmationService.confirm({
            header: 'Eliminar distribución',
            message: '¿Está seguro de eliminar este cupo?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Eliminar',
            rejectLabel: 'Cancelar',
            acceptIcon: 'pi pi-trash',
            rejectIcon: 'pi pi-times',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => this.deleteDistribution(),
        });
    }

    private loadEnrolledCounts(distributions: TeacherDistributionInterface[]): void {
        if (!distributions.length) {
            this.enrolledCounts.set(new Map());
            return;
        }

        const ids = distributions.map((dist) => dist.id);

        this.httpService.findEnrolledCounts(ids).subscribe({
            next: (result) => {
                const counts = new Map<string, number>();
                distributions.forEach((dist) => {
                    counts.set(dist.id, result[dist.id] || 0);
                });
                this.enrolledCounts.set(counts);
            },
            error: () => {
                const emptyCounts = new Map<string, number>();
                distributions.forEach((dist) => emptyCounts.set(dist.id, 0));
                this.enrolledCounts.set(emptyCounts);
            },
        });
    }

    private saveDistribution(): void {
        const isEditing = this.isEditMode();
        const filterData = this.filterForm();
        const modalData = this.modalForm();

        if (isEditing && this.selectedCell()) {
            const selectedCell = this.selectedCell()!;
            const payload: UpdateTeacherDistributionPayload = {
                capacity: modalData.capacity,
                parallelId: selectedCell.parallelId,
                workdayId: selectedCell.workdayId,
                subjectId: selectedCell.subjectId,
                schoolPeriodId: selectedCell.schoolPeriodId,
            };

            this.httpService.update(selectedCell.id, payload).subscribe({
                next: (updated) => {
                    this.distributions.update((list) =>
                        list.map((d) => (d.id === updated.id ? updated : d))
                    );
                    this.closeModal();
                },
                error: (err: any) => {
                    this.customMessageService.showError({
                        summary: 'Error',
                        detail: err.error?.message || 'No se pudo actualizar la distribución',
                    });
                },
            });
        } else {
            if (!modalData.subjectId || !modalData.parallelId || !modalData.workdayId) {
                this.customMessageService.showError({
                    summary: 'Error',
                    detail: 'Todos los campos son obligatorios',
                });
                return;
            }

            const payload: CreateTeacherDistributionPayload = {
                capacity: modalData.capacity,
                parallelId: modalData.parallelId,
                workdayId: modalData.workdayId,
                subjectId: modalData.subjectId,
                schoolPeriodId: filterData.schoolPeriodId,
                hours: modalData.hours || 4,
            };

            this.httpService.register(payload).subscribe({
                next: (created) => {
                    this.distributions.update((list) => [...list, created]);
                    this.enrolledCounts.update((map) => {
                        const next = new Map(map);
                        next.set(created.id, 0);
                        return next;
                    });
                    this.closeModal();
                },
                error: (err: any) => {
                    this.customMessageService.showError({
                        summary: 'Error',
                        detail: err.error?.message || 'No se pudo crear la distribución',
                    });
                },
            });
        }
    }

    private deleteDistribution(): void {
        const cell = this.selectedCell();
        if (!cell) return;

        this.httpService.remove(cell.id).subscribe({
            next: () => {
                this.distributions.update((list) =>
                    list.filter((d) => d.id !== cell.id)
                );
                this.enrolledCounts.update((map) => {
                    const next = new Map(map);
                    next.delete(cell.id);
                    return next;
                });
                this.closeModal();
            },
            error: (err: any) => {
                this.customMessageService.showError({
                    summary: 'Error',
                    detail: err.error?.message || 'No se pudo eliminar la distribución',
                });
            },
        });
    }

    private buildEnrollmentMatrix(distributions: TeacherDistributionInterface[]): RowInterface[] {
        if (!distributions.length) return [];

        const counts = this.enrolledCounts();
        const workdayMap = new Map<string, BlockInterface>();

        distributions.forEach((dist) => {
            const workdayName = dist.workday?.name || 'Sin Jornada';
            const parallelName = dist.parallel?.name || 'Sin Paralelo';
            const subjectName = dist.subject?.name || 'Sin Materia';
            const academicPeriodName = dist.subject?.academicPeriod?.name || 'Sin Nivel';
            const capacity = dist.capacity || 0;
            const enrolled = counts.get(dist.id) || 0;

            const cell: CellInterface = {
                id: dist.id,
                horario: workdayName,
                paralelo: parallelName,
                materia: subjectName,
                subjectId: dist.subjectId,
                parallelId: dist.parallelId,
                workdayId: dist.workdayId,
                schoolPeriodId: dist.schoolPeriodId,
                nivelAcademico: academicPeriodName,
                cupoMaximo: capacity,
                estudiantesContados: enrolled,
                colorSemaforo: this.calculateColorSemaforo(capacity, enrolled),
                teacherDistributionId: dist.id,
            };

            const workdayId = dist.workdayId || 'unknown';

            if (!workdayMap.has(workdayId)) {
                workdayMap.set(workdayId, {
                    horarioNombre: workdayName,
                    celdas: [],
                });
            }

            workdayMap.get(workdayId)!.celdas.push(cell);
        });

        return Array.from(workdayMap.entries()).map(([workdayId, block]) => ({
            jornadaId: workdayId,
            jornadaNombre: block.horarioNombre,
            bloquesHorarios: [block],
        }));
    }

    private calculateColorSemaforo(capacity: number, enrolled: number): 'verde' | 'naranja' | 'rojo' {
        if (capacity === 0) return 'rojo';
        const percentage = (enrolled / capacity) * 100;
        if (percentage >= 90) return 'rojo';
        if (percentage >= 70) return 'naranja';
        return 'verde';
    }

    private calculateEnrollmentStatistics(distributions: TeacherDistributionInterface[]): EnrollmentCapacityStatistics {
        const counts = this.enrolledCounts();
        const totalCapacity = distributions.reduce((sum, d) => sum + (d.capacity || 0), 0);
        const totalEnrolled = distributions.reduce((sum, d) => sum + (counts.get(d.id) || 0), 0);
        const totalAvailable = totalCapacity - totalEnrolled;
        const globalOccupancyPercentage = totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0;

        return {
            totalCapacity,
            totalEnrolled,
            totalAvailable,
            globalOccupancyPercentage,
            byShift: this.calculateByShift(distributions),
            byCourse: this.calculateByCourse(distributions),
        };
    }

    private calculateByShift(distributions: TeacherDistributionInterface[]): ShiftStatistics[] {
        const counts = this.enrolledCounts();
        const shiftMap = new Map<string, {capacity: number; enrolled: number}>();

        distributions.forEach((dist) => {
            const shiftName = dist.workday?.name || 'Sin Jornada';
            const current = shiftMap.get(shiftName) || {capacity: 0, enrolled: 0};
            current.capacity += dist.capacity || 0;
            current.enrolled += counts.get(dist.id) || 0;
            shiftMap.set(shiftName, current);
        });

        return Array.from(shiftMap.entries()).map(([shiftName, data]) => ({
            shiftName,
            capacity: data.capacity,
            enrolled: data.enrolled,
            available: data.capacity - data.enrolled,
            percentage: data.capacity > 0 ? (data.enrolled / data.capacity) * 100 : 0,
        }));
    }

    private calculateByCourse(distributions: TeacherDistributionInterface[]): CourseStatistics[] {
        const counts = this.enrolledCounts();
        const courseMap = new Map<string, {capacity: number; enrolled: number}>();

        distributions.forEach((dist) => {
            const courseName = dist.subject?.name || 'Sin Materia';
            const current = courseMap.get(courseName) || {capacity: 0, enrolled: 0};
            current.capacity += dist.capacity || 0;
            current.enrolled += counts.get(dist.id) || 0;
            courseMap.set(courseName, current);
        });

        return Array.from(courseMap.entries()).map(([courseName, data]) => ({
            courseName,
            capacity: data.capacity,
            enrolled: data.enrolled,
            available: data.capacity - data.enrolled,
            percentage: data.capacity > 0 ? (data.enrolled / data.capacity) * 100 : 0,
        }));
    }

    private buildEnrollmentChart(statistics: EnrollmentCapacityStatistics): ChartDataInterface {
        return {
            labels: ['Ocupados', 'Disponibles'],
            datasets: [
                {
                    data: [statistics.totalEnrolled, statistics.totalAvailable],
                    backgroundColor: ['#f97316', '#22c55e'],
                    hoverBackgroundColor: ['#ea580c', '#16a34a'],
                },
            ],
        };
    }
}
