import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AttendanceEntity,
  CatalogueEntity,
  EnrollmentDetailStateEntity,
  EnrollmentEntity,
  GradeEntity,
  SubjectEntity,
} from '@modules/core/entities';
import { getDateFormat } from '@utils/helpers';

@Entity('enrollment_details', { schema: 'core' })
export class EnrollmentDetailEntity {
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
  @OneToMany(() => AttendanceEntity, (attendance) => attendance.enrollmentDetail)
  attendances: AttendanceEntity[];

  @OneToMany(() => GradeEntity, (grade) => grade.enrollmentDetail)
  grades: GradeEntity[];

  @OneToMany(
    () => EnrollmentDetailStateEntity,
    (enrollmentDetailState) => enrollmentDetailState.enrollmentDetail,
  )
  enrollmentDetailStates: EnrollmentDetailStateEntity[];

  @OneToOne(
    () => EnrollmentDetailStateEntity,
    (enrollmentDetailState) => enrollmentDetailState.enrollmentDetail,
  )
  enrollmentDetailState: EnrollmentDetailStateEntity;

  /** Foreign Keys **/
  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'academic_state_id' })
  academicState: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'academic_state_id',
    nullable: true,
    comment: 'Aprobado o Desaprobado',
  })
  academicStateId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'income_type_id' })
  incomeType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'income_type_id',
    nullable: true,
    comment: 'Normal, Convalidacion, etc',
  })
  incomeTypeId: string;

  @ManyToOne(() => EnrollmentEntity)
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: EnrollmentEntity;
  @Column({ type: 'uuid', name: 'enrollment_id', comment: 'Matriculado o No Matriculado' })
  enrollmentId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'parallel_id' })
  parallel: CatalogueEntity;
  @Column({ type: 'uuid', name: 'parallel_id', nullable: true, comment: 'Paralelo asignado' })
  parallelId: string;

  @ManyToOne(() => SubjectEntity)
  @JoinColumn({ name: 'subject_id' })
  subject: SubjectEntity;
  @Column({ type: 'uuid', name: 'subject_id', comment: 'Asignaturas asignadas' })
  subjectId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'type_id',
    nullable: true,
    comment: 'ordinaria, extraordinaria o especial',
  })
  typeId: string;

  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'workday_id' })
  workday: CatalogueEntity;
  @Column({ type: 'uuid', name: 'workday_id', comment: 'Jornada laboral' })
  workdayId: string;

  /** Columns **/
  @Column({
    name: 'academic_observation',
    type: 'text',
    nullable: true,
    comment: 'Observacion academica, Ej. pierde por faltas',
  })
  academicObservation: string;

  @Column({
    name: 'number',
    type: 'varchar',
    comment: 'Numero de matricula',
  })
  number: number;

  @Column({
    name: 'date',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de la matricula',
  })
  date: Date;

  @Column({
    name: 'final_attendance',
    type: 'decimal',
    nullable: true,
    precision: 5,
    scale: 2,
    comment: 'Valor de la asistencia',
  })
  finalAttendance: number;

  @Column({
    name: 'final_grade',
    type: 'decimal',
    nullable: true,
    precision: 5,
    scale: 2,
    comment: 'Valor de la calificacion',
  })
  finalGrade: number;

  @Column({
    name: 'observation',
    type: 'text',
    nullable: true,
    comment: 'Observaciones de la matricula',
  })
  observation: string;

  @Column({
    name: 'supplementary_grade',
    type: 'decimal',
    nullable: true,
    precision: 5,
    scale: 2,
    comment: 'Valor del examen supletorio-+',
  })
  supplementaryGrade: number;

  @BeforeInsert()
  @BeforeUpdate()
  async setDate() {
    if (this.date) this.date = getDateFormat(this.date);
  }
}
