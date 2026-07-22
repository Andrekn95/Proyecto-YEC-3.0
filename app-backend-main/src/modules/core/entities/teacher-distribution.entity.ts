import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {
    CatalogueEntity, ClassroomEntity, PartialPermissionEntity,
    SchoolPeriodEntity,
    SubjectEntity,
    TeacherEntity
} from '@modules/core/entities';

@Entity('teacher_distributions', {schema: 'core'})
export class TeacherDistributionEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
    })
    deletedAt: Date;

    /** Inverse Relationship **/
    @OneToMany(() => PartialPermissionEntity,partialPermission => partialPermission.teacherDistribution)
    partialPermissions: PartialPermissionEntity[];

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'parallel_id'})
    parallel: CatalogueEntity;
    @Column({type: 'uuid', name: 'parallel_id', comment: 'Paralelos asignados al profesor'})
    parallelId: string;

    @ManyToOne(() => SchoolPeriodEntity)
    @JoinColumn({name: 'school_period_id'})
    schoolPeriod: SchoolPeriodEntity;
    @Column({type: 'uuid', name: 'school_period_id', comment: 'Periodo lectivo al que pertenece'})
    schoolPeriodId: string;

    @ManyToOne(() => SubjectEntity)
    @JoinColumn({name: 'subject_id'})
    subject: SubjectEntity;
    @Column({type: 'uuid', name: 'subject_id', comment: 'Asignaturas asignadas al profesor'})
    subjectId: string;

    @ManyToOne(() => TeacherEntity, {nullable: true})
    @JoinColumn({name: 'teacher_id'})
    teacher: TeacherEntity;
    @Column({type: 'uuid', name: 'teacher_id', nullable: true, comment: 'Profesor asignado'})
    teacherId: string;

    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'workday_id'})
    workday: CatalogueEntity;
    @Column({type: 'uuid', name: 'workday_id', comment: 'Jornada laboral del Profesor'})
    workdayId: string;

    @ManyToOne(() => ClassroomEntity, {nullable: true})
    @JoinColumn({name: 'classroom_id'})
    classroom: ClassroomEntity;
    @Column({type: 'uuid', name: 'classroom_id', nullable: true, comment: 'Aula asignada'})
    classroomId: string;

    /** Columns **/
    @Column({
        name: 'capacity',
        type: 'int',
        nullable: true,
        comment: 'Capacidad Máxima',
    })
    capacity: number;

    @Column({
        name: 'hours',
        type: 'int',
        nullable: true,
        comment: 'Horas de clase semanales',
    })
    hours: number;
}
