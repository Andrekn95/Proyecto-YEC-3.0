import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany, OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {
    CareerEntity,
    CatalogueEntity,
    EnrollmentDetailEntity, EnrollmentStateEntity,
    SchoolPeriodEntity,
    StudentEntity
} from '@modules/core/entities';
import {getDateFormat} from "@utils/helpers";

@Entity('enrollments', {schema: 'core'})
export class EnrollmentEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
        comment: 'Fecha de creacion del registro',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
        comment: 'Fecha de actualizacion del registro',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha de eliminacion del registro',
    })
    deletedAt: Date;

    /** Inverse Relationship **/
    @OneToMany(() => EnrollmentDetailEntity, enrollmentDetail => enrollmentDetail.enrollment)
    enrollmentDetails: EnrollmentDetailEntity[];

    @OneToMany(() => EnrollmentStateEntity, enrollmentState => enrollmentState.enrollment)
    enrollmentStates: EnrollmentStateEntity[];

    @OneToOne(() => EnrollmentStateEntity, enrollmentState => enrollmentState.enrollment)
    enrollmentState: EnrollmentStateEntity;

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'academic_period_id'})
    academicPeriod: CatalogueEntity;
    @Column({type: 'uuid', name: 'academic_period_id', comment: 'Periodo academico que pertenece'})
    academicPeriodId: string;

    @ManyToOne(() => CareerEntity)
    @JoinColumn({name: 'career_id'})
    career: CareerEntity;
    @Column({type: 'uuid', name: 'career_id', comment: 'Carrera que pertenece'})
    careerId: string;

    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'parallel_id'})
    parallel: CatalogueEntity;
    @Column({type: 'uuid', name: 'parallel_id', comment: 'Paralelo que pertenece'})
    parallelId: string;

    @ManyToOne(() => SchoolPeriodEntity)
    @JoinColumn({name: 'school_period_id'})
    schoolPeriod: SchoolPeriodEntity;
    @Column({type: 'uuid', name: 'school_period_id', comment: 'Periodo lectivo que pertenece'})
    schoolPeriodId: string;

    @ManyToOne(() => StudentEntity)
    @JoinColumn({name: 'student_id'})
    student: StudentEntity;
    @Column({type: 'uuid', name: 'student_id', comment: 'Estudiente matriculado'})
    studentId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'type_id'})
    type: CatalogueEntity;
    @Column({type: 'uuid', name: 'type_id', nullable: true, comment: 'Intensivo'})
    typeId: string;

    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'workday_id'})
    workday: CatalogueEntity;
    @Column({type: 'uuid', name: 'workday_id', comment: 'Jornada laboral'})
    workdayId: string;

    /** Columns **/
    @Column({
        name: 'socioeconomic_category',
        type: 'varchar',
        nullable: true,
        comment: 'Categoria',
    })
    socioeconomicCategory: string;

    @Column({
        name: 'socioeconomic_percentage',
        type: 'float',
        nullable: true,
        comment: 'Porcentaje',
    })
    socioeconomicPercentage: number;

    @Column({
        name: 'socioeconomic_score',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
        comment: 'Puntaje',
    })
    socioeconomicScore: number;

    @Column({
        name: 'code',
        type: 'varchar',
        nullable: true,
        comment: 'Codigo de la matricula',
    })
    code: string;

    @Column({
        name: 'date',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha de la matricula',
    })
    date: Date;

    @Column({
        name: 'applications_at',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha de envio de solicitud',
    })
    applicationsAt: Date;

    @Column({
        name: 'folio',
        type: 'varchar',
        nullable: true,
        comment: 'Numero de folio',
    })
    folio: string;

    @Column({
        name: 'observation',
        type: 'text',
        nullable: true,
        comment: 'Observaciones de la matricula',
    })
    observation: string;

    @BeforeInsert()
    @BeforeUpdate()
    async setDate() {
        if (this.date)
            this.date = getDateFormat(this.date);
    }
}
