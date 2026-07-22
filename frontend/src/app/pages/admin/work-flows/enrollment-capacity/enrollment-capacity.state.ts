import {CatalogueInterface} from '@utils/interfaces';

export type {CatalogueInterface};

export interface SubjectInterface {
    id: string;
    name: string;
    code?: string;
    academicPeriod?: {
        id: string;
        name: string;
        description?: string;
    };
    curriculum?: {
        id: string;
        name: string;
        career?: {
            id: string;
            name: string;
        };
    };
}

export interface ClassroomInterface {
    id: string;
    name: string;
    capacity: number;
    code?: string;
    location?: string;
}

export interface TeacherDistributionInterface {
    id: string;
    parallelId: string;
    schoolPeriodId: string;
    subjectId: string;
    teacherId: string | null;
    workdayId: string;
    classroomId: string | null;
    capacity: number;
    hours: number | null;
    createdAt?: string;
    updatedAt?: string;
    deletedAt?: string | null;

    parallel?: {
        id: string;
        name: string;
        code?: string;
    };
    schoolPeriod?: {
        id: string;
        name: string;
        code?: string;
        shortName?: string;
    };
    subject?: {
        id: string;
        name: string;
        code?: string;
        academicPeriod?: {
            id: string;
            name: string;
            description?: string;
        };
        curriculum?: {
            id: string;
            name: string;
            career?: {
                id: string;
                name: string;
            };
        };
    };
    workday?: {
        id: string;
        name: string;
        code?: string;
    };
    classroom?: {
        id: string;
        name: string;
        capacity: number;
        code?: string;
        location?: string;
    };
    teacher?: {
        id: string;
        name: string;
    } | null;
}

export interface CellInterface {
    id: string;
    horario: string;
    paralelo: string;
    materia: string;
    subjectId: string;
    parallelId: string;
    workdayId: string;
    schoolPeriodId: string;
    classroomId: string | null;
    aula: string;
    nivelAcademico: string;
    cupoMaximo: number;
    estudiantesContados: number;
    colorSemaforo: 'verde' | 'naranja' | 'rojo';
    teacherDistributionId: string;
}

export interface BlockInterface {
    horarioNombre: string;
    celdas: CellInterface[];
}

export interface RowInterface {
    jornadaId: string;
    jornadaNombre: string;
    bloquesHorarios: BlockInterface[];
}

export interface EnrollmentCapacityStatistics {
    totalCapacity: number;
    totalEnrolled: number;
    totalAvailable: number;
    globalOccupancyPercentage: number;
    byShift: ShiftStatistics[];
    byCourse: CourseStatistics[];
}

export interface ShiftStatistics {
    shiftName: string;
    capacity: number;
    enrolled: number;
    available: number;
    percentage: number;
}

export interface CourseStatistics {
    courseName: string;
    capacity: number;
    enrolled: number;
    available: number;
    percentage: number;
}

export interface FilterFormInterface {
    careerId: string;
    schoolPeriodId: string;
}

export interface ModalFormInterface {
    capacity: number;
    parallelId: string | null;
    workdayId: string | null;
    subjectId: string | null;
    classroomId: string | null;
    teacherId?: string;
    hours?: number;
}

export interface CreateTeacherDistributionPayload {
    capacity: number;
    parallelId: string;
    workdayId: string;
    subjectId: string;
    schoolPeriodId: string;
    classroomId?: string | null;
    hours?: number;
}

export interface UpdateTeacherDistributionPayload {
    capacity: number;
    parallelId: string;
    workdayId: string;
    subjectId: string;
    schoolPeriodId: string;
    classroomId?: string | null;
}

export interface ChartDataInterface {
    labels: string[];
    datasets: {
        data: number[];
        backgroundColor: string[];
        hoverBackgroundColor: string[];
    }[];
}

export interface ChartOptionsInterface {
    cutout?: string;
    plugins?: {
        legend?: {
            position?: string;
            labels?: {
                color?: string;
            };
        };
    };
}

export const INITIAL_FILTER_FORM: FilterFormInterface = {
    careerId: '',
    schoolPeriodId: '',
};

export const INITIAL_MODAL_FORM: ModalFormInterface = {
    capacity: 30,
    parallelId: null,
    workdayId: null,
    subjectId: null,
    classroomId: null,
    hours: 4,
};

export const DEFAULT_CHART_OPTIONS: ChartOptionsInterface = {
    cutout: '60%',
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                color: '#475569',
            },
        },
    },
};
