import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { CatalogueEntity, StudentEntity } from '@modules/core/entities';

@Entity('information_students', { schema: 'core' })
export class InformationStudentEntity {
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
  updateAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  /** Foreign Keys **/
  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'ancestral_language_name_id' })
  ancestralLanguageName: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'ancestral_language_name_id',
    nullable: true,
    comment: 'Lengua Ancestral: Andoa, Achuar',
  })
  ancestralLanguageNameId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'contact_emergency_kinship_id' })
  contactEmergencyKinship: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'contact_emergency_kinship_id',
    nullable: true,
    comment: 'Parentesco, mama, papa, etc',
  })
  contactEmergencyKinshipId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'disability_type_id' })
  disabilityType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'disability_type_id',
    nullable: true,
    comment: 'Tipo disacapasidad: Auditiva, Física, Intelectual, etc',
  })
  disabilityTypeId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'foreign_language_name_id' })
  foreignLanguageName: CatalogueEntity;
  @Column({ type: 'uuid', name: 'foreign_language_name_id', nullable: true, comment: 'Ingles, Chino Mandarian, etc' })
  foreignLanguageNameId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'indigenous_nationality_id' })
  indigenousNationality: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'indigenous_nationality_id',
    nullable: true,
    comment: 'Epera, Chachis, Awa, Tsachila etc',
  })
  indigenousNationalityId: string;

  @Column({ type: 'boolean', name: 'is_ancestral_language', default: false, comment: 'Lengua Ancestral,true = si y false = no' })
  isAncestralLanguage: boolean;

  @Column({
    type: 'boolean',
    name: 'is_catastrophic_illness',
    default: false,
    comment: 'Tiene enfermedad catastrofica, true = si y false = no',
  })
  isCatastrophicIllness: boolean;

  //ejemplo de cambio a boolean
  @Column({ type: 'boolean', name: 'is_disability', default: false, comment: 'Tiene disacapasidad, true = si y false = no' })
  isDisability: boolean;

  @Column({ type: 'boolean', name: 'is_foreign_language', default: false, comment: 'Perdida de gratuidad??,true = si y false = no' })
  isForeignLanguage: boolean;

  @Column({ type: 'boolean', name: 'is_has_children', default: false, comment: 'Tiene Hijos,true = si y false = no' })
  isHasChildren: boolean;

  @Column({ type: 'boolean', name: 'is_house_head', default: false, comment: 'Es Jefe de Hogar,true = si y false = no' })
  isHouseHead: boolean;

  @Column({ type: 'boolean', name: 'is_private_security', default: false, comment: 'Es Jefe de Hogar?? , seguro privado ,true = si y false = no' })
  isPrivateSecurity: boolean;

  @Column({ type: 'boolean', name: 'is_social_security', default: false, comment: 'Es Jefe de Hogar??,true = si y false = no' })
  isSocialSecurity: boolean;

  @Column({ type: 'boolean', name: 'is_work', default: false, comment: 'El estudiante trabaja, true = si y false = no' })
  isWork: boolean;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'monthly_salary_id' })
  monthlySalary: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'monthly_salary_id',
    nullable: true,
    comment: 'Salario mensual por rangos',
  })
  monthlySalaryId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'town_id' })
  town: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'town_id',
    nullable: true,
    comment: 'Pueblo: Chibuleo, Cayambi, Karanki, etc',
  })
  townId: string;

  @OneToOne(() => StudentEntity, student => student.informationStudent)
  @JoinColumn({ name: 'student_id' })
  student: StudentEntity;
  @Column({ type: 'uuid', name: 'student_id', comment: 'Estudiante que pertenece la informacion' })
  studentId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'working_hours_id' })
  workingHours: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'working_hours_id',
    nullable: true,
    comment: 'Horario Laboral: Mañana (4 horas), Vespertino (4 hors), Nocturna ( 4 horas), Dia completo (8 horas), Velada Completa (8 horas) y otros',
  })
  workingHoursId: string;

  /** Columns **/
  //Preguntar
  @Column({
    name: 'address',
    type: 'text',
    nullable: true,
    comment: 'La direccion donde reside el estudiante',
  })
  address: string;

  @Column({
    name: 'catastrophic_illness',
    type: 'varchar',
    nullable: true,
    comment: 'Nombre de la enfermedad catastrofica',
  })
  catastrophicIllness: string;

  @Column({
    name: 'children_total',
    type: 'int',
    nullable: true,
    comment: 'Total de Hijos',
  })
  childrenTotal: number;

  @Column({
    name: 'contact_emergency_name',
    type: 'varchar',
    nullable: true,
    comment: 'Nombre del contacto de emergencia para informar sobre el estudiante',
  })
  contactEmergencyName: string;

  @Column({
    name: 'contact_emergency_phone',
    type: 'varchar',
    nullable: true,
    comment: 'Numeros de contacto de emergencia para informar sobre el estudiante',
  })
  contactEmergencyPhone: string;

  @Column({
    name: 'disability_percentage',
    type: 'float',
    nullable: true,
    comment: 'El porcentaje de discapicidad que tiene el estudiante ',
  })
  disabilityPercentage: number;

  @Column({
    name: 'work_address',
    type: 'text',
    nullable: true,
    comment: 'Direccion del trabajo del estudiante',
  })
  workAddress: string;

  @Column({
    name: 'work_position',
    type: 'varchar',
    nullable: true,
    comment: 'Codigo postal donde el estudiante reside',
  })
  workPosition: string;
}
