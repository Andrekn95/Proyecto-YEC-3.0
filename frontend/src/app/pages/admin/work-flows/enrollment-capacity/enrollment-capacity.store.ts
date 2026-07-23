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

function calculateColorSemaforo(capacity: number, enrolled: number): 'verde' | 'naranja' | 'rojo' {
    if (capacity === 0) return 'rojo';
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return 'rojo';
    if (percentage >= 70) return 'naranja';
    return 'verde';
}

function buildCellFromDistribution(
    dist: TeacherDistributionInterface,
    enrolled: number,
): CellInterface {
    const capacity = dist.capacity || 0;
    return {
        id: dist.id,
        horario: dist.workday?.name || 'Sin Jornada',
        paralelo: dist.parallel?.name || 'Sin Paralelo',
        materia: dist.subject?.name || 'Sin Materia',
        subjectId: dist.subjectId,
        parallelId: dist.parallelId,
        workdayId: dist.workdayId,
        schoolPeriodId: dist.schoolPeriodId,
        classroomId: dist.classroomId,
        aula: dist.classroom?.name || '',
        nivelAcademico: dist.subject?.academicPeriod?.name || 'Sin Nivel',
        cupoMaximo: capacity,
        estudiantesContados: enrolled,
        colorSemaforo: calculateColorSemaforo(capacity, enrolled),
        teacherDistributionId: dist.id,
    };
}

function buildCountsMap(
    distributions: TeacherDistributionInterface[],
    counts: Record<string, number>,
): Map<string, number> {
    const map = new Map<string, number>();
    distributions.forEach(d => map.set(d.id, counts[d.id] ?? 0));
    return map;
}

const FALLBACK_WORKDAY = 'Sin Jornada';
const FALLBACK_SUBJECT = 'Sin Materia';

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

    readonly filteredDistributions = computed(() => {
        const selected = this.selectedSubjectId();
        if (!selected) return this.distributions();
        return this.distributions().filter((d) => d.subjectId === selected);
    });

    readonly parallels = computed(() => {
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

    readonly workdays = computed(() => {
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

    readonly matrix = computed(() =>
        this.buildEnrollmentMatrix(this.filteredDistributions(), this.enrolledCounts())
    );

    readonly statistics = computed(() =>
        this.calculateEnrollmentStatistics(this.filteredDistributions(), this.enrolledCounts())
    );

    readonly chartData = computed(() =>
        this.buildEnrollmentChart(this.statistics())
    );

    readonly hasBothFilters = computed(() =>
        !!this.filterForm().careerId && !!this.filterForm().schoolPeriodId
    );

    readonly showDetails = computed(() =>
        this.hasBothFilters() && !!this.selectedSubjectId()
    );

    readonly hasSelectedLevelDistributions = computed(() => {
        const subjectId = this.selectedSubjectId();
        if (!subjectId) return false;
        return this.distributions().some((d) => d.subjectId === subjectId);
    });

    loadInitialData(): void {
        this.isLoading.set(true);
        this.error.set(null);

        this.httpService.findCareers().subscribe({
            next: (data) => this.careers.set(data),
            error: () => this.error.set('Error al cargar carreras'),
        });

        this.httpService.findSchoolPeriods().subscribe({
            next: (data) => {
                this.schoolPeriods.set(data);
                this.isLoading.set(false);
            },
            error: () => {
                this.error.set('Error al cargar períodos escolares');
                this.isLoading.set(false);
            },
        });

        this.httpService.findClassrooms().subscribe({
            next: (data) => this.classrooms.set(data),
            error: () => this.error.set('Error al cargar aulas'),
        });
    }

    loadSubjectsByCareer(careerId: string): void {
        if (!careerId) {
            this.subjects.set([]);
            return;
        }

        this.httpService.findSubjectsByCareer(careerId).subscribe({
            next: (data) => this.subjects.set(data),
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
            next: (data) => {
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
            classroomId: cell.classroomId,
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
        const cell = this.selectedCell();

        if (cell && cell.estudiantesContados > 0) {
            this.customMessageService.showError({
                summary: 'No se puede eliminar',
                detail: `El cupo tiene ${cell.estudiantesContados} estudiante(s) matriculado(s). No se puede eliminar un cupo con estudiantes asignados.`,
            });
            return;
        }

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

        this.httpService.findEnrolledCounts(distributions.map(d => d.id)).subscribe({
            next: (result) => this.enrolledCounts.set(buildCountsMap(distributions, result)),
            error: () => this.enrolledCounts.set(buildCountsMap(distributions, {})),
        });
    }

    private saveDistribution(): void {
        if (this.isEditMode()) {
            this.updateDistribution();
        } else {
            this.createDistribution();
        }
    }

    private updateDistribution(): void {
        const selectedCell = this.selectedCell();
        if (!selectedCell) return;

        const payload: UpdateTeacherDistributionPayload = {
            capacity: this.modalForm().capacity,
            parallelId: selectedCell.parallelId,
            workdayId: selectedCell.workdayId,
            subjectId: selectedCell.subjectId,
            schoolPeriodId: selectedCell.schoolPeriodId,
            classroomId: this.modalForm().classroomId || selectedCell.classroomId,
        };

        this.httpService.update(selectedCell.id, payload).subscribe({
            next: (updated) => {
                this.distributions.update(list =>
                    list.map(d => d.id === updated.id ? updated : d)
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
    }

    private createDistribution(): void {
        const modalData = this.modalForm();

        if (!modalData.subjectId || !modalData.workdayId || !modalData.classroomId) {
            this.customMessageService.showError({
                summary: 'Error',
                detail: 'Todos los campos son obligatorios',
            });
            return;
        }

        const parallelId = modalData.parallelId ?? (this.parallels()[0]?.id ?? '');

        const payload: CreateTeacherDistributionPayload = {
            capacity: modalData.capacity,
            parallelId,
            workdayId: modalData.workdayId,
            subjectId: modalData.subjectId,
            schoolPeriodId: this.filterForm().schoolPeriodId,
            classroomId: modalData.classroomId,
            hours: modalData.hours || 4,
        };

        this.httpService.register(payload).subscribe({
            next: (created) => {
                this.distributions.update(list => [...list, created]);
                this.enrolledCounts.update(map => new Map(map).set(created.id, 0));
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

    private deleteDistribution(): void {
        const cell = this.selectedCell();
        if (!cell) return;

        this.httpService.remove(cell.id).subscribe({
            next: () => {
                this.distributions.update(list =>
                    list.filter(d => d.id !== cell.id)
                );
                this.enrolledCounts.update(map => {
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

    private buildEnrollmentMatrix(
        distributions: TeacherDistributionInterface[],
        counts: Map<string, number>,
    ): RowInterface[] {
        if (!distributions.length) return [];

        const workdayMap = new Map<string, BlockInterface>();

        distributions.forEach((dist) => {
            const workdayName = dist.workday?.name || FALLBACK_WORKDAY;
            const enrolled = counts.get(dist.id) || 0;
            const cell = buildCellFromDistribution(dist, enrolled);
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

    private calculateEnrollmentStatistics(
        distributions: TeacherDistributionInterface[],
        counts: Map<string, number>,
    ): EnrollmentCapacityStatistics {
        const totalCapacity = distributions.reduce((sum, d) => sum + (d.capacity || 0), 0);
        const totalEnrolled = distributions.reduce((sum, d) => sum + (counts.get(d.id) || 0), 0);
        const totalAvailable = totalCapacity - totalEnrolled;

        return {
            totalCapacity,
            totalEnrolled,
            totalAvailable,
            globalOccupancyPercentage: totalCapacity > 0 ? (totalEnrolled / totalCapacity) * 100 : 0,
            byShift: this.calculateByShift(distributions, counts),
            byCourse: this.calculateByCourse(distributions, counts),
        };
    }

    private aggregateByKey(
        distributions: TeacherDistributionInterface[],
        counts: Map<string, number>,
        keyFn: (d: TeacherDistributionInterface) => string,
    ): { key: string; capacity: number; enrolled: number; available: number; percentage: number }[] {
        const map = new Map<string, {capacity: number; enrolled: number}>();

        distributions.forEach((dist) => {
            const key = keyFn(dist);
            const current = map.get(key) || {capacity: 0, enrolled: 0};
            current.capacity += dist.capacity || 0;
            current.enrolled += counts.get(dist.id) || 0;
            map.set(key, current);
        });

        return Array.from(map.entries()).map(([key, {capacity, enrolled}]) => ({
            key,
            capacity,
            enrolled,
            available: capacity - enrolled,
            percentage: capacity > 0 ? (enrolled / capacity) * 100 : 0,
        }));
    }

    private calculateByShift(
        distributions: TeacherDistributionInterface[],
        counts: Map<string, number>,
    ): ShiftStatistics[] {
        return this.aggregateByKey(distributions, counts, d => d.workday?.name || FALLBACK_WORKDAY)
            .map(({key, ...rest}) => ({shiftName: key, ...rest}));
    }

    private calculateByCourse(
        distributions: TeacherDistributionInterface[],
        counts: Map<string, number>,
    ): CourseStatistics[] {
        return this.aggregateByKey(distributions, counts, d => d.subject?.name || FALLBACK_SUBJECT)
            .map(({key, ...rest}) => ({courseName: key, ...rest}));
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
