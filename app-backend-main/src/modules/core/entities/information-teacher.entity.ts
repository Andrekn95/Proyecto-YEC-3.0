import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {CatalogueEntity, TeacherEntity} from '@modules/core/entities';
import {getDateFormat} from "@utils/helpers";

@Entity('information_teachers', {schema: 'core'})
export class InformationTeacherEntity {
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

    @Column({
        name: 'is_visible',
        type: 'boolean',
        default: true,
        comment: 'true=visible, false=no visible',
    })
    isVisible: boolean;

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'country_higher_education_id'})
    countryHigherEducation: CatalogueEntity;
    @Column({
        type: 'uuid',
        name: 'country_higher_education_id',
        nullable: true,
        comment: 'Pais que obtuvo el titulo de Educacion superior'
    })
    countryHigherEducationId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'dedication_time_id'})
    dedicationTime: CatalogueEntity;
    @Column({type: 'uuid', name: 'dedication_time_id', nullable: true, comment: 'Tiempo de dedicación'})
    dedicationTimeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'financing_type_id'})
    financingType: CatalogueEntity;
    @Column({type: 'uuid', name: 'financing_type_id', nullable: true, comment: 'Tipo de financiamiento'})
    financingTypeId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'higher_education_id'})
    higherEducation: CatalogueEntity;
    @Column({type: 'uuid', name: 'higher_education_id', nullable: true, comment: 'Educacion superior'})
    higherEducationId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'scholarship_id'})
    scholarship: CatalogueEntity;
    @Column({type: 'uuid', name: 'scholarship_id', nullable: true, comment: 'Beca que tiene'})
    scholarshipId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'scholarship_type_id'})
    scholarshipType: CatalogueEntity;
    @Column({type: 'uuid', name: 'scholarship_type_id', nullable: true, comment: 'Tipo de beca'})
    scholarshipTypeId: string;

    @OneToOne(() => TeacherEntity, teacher => teacher.informationTeacher)
    @JoinColumn({name: 'teacher_id'})
    teacher: TeacherEntity;
    @Column({type: 'uuid', name: 'teacher_id', comment: 'Profesor que pertenece la informacion'})
    teacherId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'teaching_ladder_id'})
    teachingLadder: CatalogueEntity;
    @Column({type: 'uuid', name: 'teaching_ladder_id', nullable: true, comment: 'Historial de enseñanza'})
    teachingLadderId: string;

    /** Columns **/
    @Column({
        name: 'academic_unit',
        type: 'varchar',
        nullable: true,
        comment: 'Nombre de la unidad academica',
    })
    academicUnit: string;

    @Column({
        name: 'administrative_hours',
        type: 'float',
        unsigned: true,
        nullable: true,
        comment: 'Horas dedicadas a la administracion al mes',
    })
    administrativeHours: number;

    @Column({
        name: 'class_hours',
        type: 'float',
        unsigned: true,
        nullable: true,
        comment: 'Total de horas de clase dadas',
    })
    classHours: number;

    @Column({
        name: 'community_hours',
        type: 'float',
        unsigned: true,
        nullable: true,
        comment: 'Horas dedicadas a labores comunitarios',
    })
    communityHours: number;

    @Column({
        name: 'degree_higher_education',
        type: 'varchar',
        nullable: true,
        comment: 'Que grado de educación superior tiene el usuario',
    })
    degreeHigherEducation: string;

    @Column({
        name: 'hours_worked',
        type: 'float',
        unsigned: true,
        nullable: true,
        comment: 'Total de las horas trabajadas al mes',
    })
    hoursWorked: number;

    @Column({
        type: 'date',
        name: 'holidays',
        nullable: true,
        comment: 'Fecha de los dias festivos.',
    })
    holidays: Date;

    @Column({
        name: 'home_vacation',
        type: 'date',
        nullable: true,
        comment: 'Fecha para las vacacines',
    })
    homeVacation: Date;

    @Column({
        name: 'institution_higher_education',
        type: 'varchar',
        nullable: true,
        comment: 'Nombre de la institución de educación superior',
    })
    institutionHigherEducation: string;

    @Column({
        name: 'investigation_hours',
        type: 'float',
        unsigned: true,
        nullable: true,
        comment: 'Horas de investigacion al mes',
    })
    investigationHours: number;

    @Column({
        name: 'other_hours',
        type: 'float',
        nullable: true,
        comment: 'Horas dedicadas a otras actividades',
    })
    otherHours: number;

    @Column({
        name: 'publications',
        type: 'varchar',
        unsigned: true,
        nullable: true,
        comment: 'Revisar publicacion',
    })
    publications: string;

    @Column({
        name: 'scholarship_amount',
        type: 'float',
        unsigned: true,
        nullable: true,
        comment: 'Precio de la beca a pagar',
    })
    scholarshipAmount: number;

    @Column({
        name: 'total_subjects',
        type: 'int',
        unsigned: true,
        nullable: true,
        comment: 'Total de personas en la academia',
    })
    totalSubjects: number;

    @Column({
        name: 'technical',
        type: 'varchar',
        nullable: true,
        comment: 'nombre de la tecnica a usar',
    })
    technical: string;

    @Column({
        name: 'technology',
        type: 'varchar',
        nullable: true,
        comment: 'nombres de las salas de tecnologia',
    })
    technology: string;

    @Column({
        name: 'total_publications',
        type: 'int',
        unsigned: true,
        nullable: true,
        comment: 'Total de las publicaciones realizadas hasta el momento',
    })
    totalPublications: number;

    @BeforeInsert()
    @BeforeUpdate()
    async setDate() {
        if (this.holidays)
            this.holidays = getDateFormat(this.holidays);

        if (this.homeVacation)
            this.homeVacation = getDateFormat(this.holidays);
    }
}
