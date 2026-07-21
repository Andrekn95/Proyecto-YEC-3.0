import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatalogueEntity, InstitutionEntity } from '@modules/core/entities';
import { getDateFormat } from '@utils/helpers';

@Entity('school_periods', { schema: 'core' })
export class SchoolPeriodEntity {
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

  @Column({
    name: 'is_visible',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  isVisible: boolean;

  /** Inverse Relationship **/

  /** Foreign Keys **/
  @ManyToOne(() => InstitutionEntity)
  @JoinColumn({ name: 'institution_id' })
  institution: InstitutionEntity;
  @Column({
    type: 'uuid',
    name: 'institution_id',
    comment: 'Institución a la que pertenece el periodo lectivo',
  })
  institutionId: string;

  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'state_id' })
  state: CatalogueEntity;
  @Column({ type: 'uuid', name: 'state_id', comment: 'Habilitado o Inhabilitado' })
  stateId: string;

  /** Columns **/
  @Column({
    name: 'code',
    type: 'varchar',
    comment: 'Codigo del periodo',
  })
  code: string;

  @Column({
    comment: 'Codigo sniese, suelen manejar diferente',
    type: 'varchar',
    nullable: true,
    name: 'code_sniese',
  })
  codeSniese: string;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'Nombre Ej. Abril 2023 - Octubre 2023',
  })
  name: string;

  @Column({
    name: 'short_name',
    type: 'varchar',
    comment: 'Nombre corto Ej. 2023-1',
  })
  shortName: string;

  @Column({
    name: 'started_at',
    type: 'date',
    comment: 'Fecha Inicio Periodo',
  })
  startedAt: Date;

  @Column({
    name: 'ended_at',
    type: 'date',
    comment: 'Fecha Fin Periodo',
  })
  endedAt: Date;

  @Column({
    name: 'ordinary_started_at',
    type: 'date',
    comment: 'Fecha Inicio Periodo Ordinario',
  })
  ordinaryStartedAt: Date;

  @Column({
    name: 'ordinary_ended_at',
    type: 'date',
    comment: 'Fecha Fin Periodo Ordinario',
  })
  ordinaryEndedAt: Date;

  @Column({
    name: 'extra_ordinary_started_at',
    type: 'date',
    comment: 'Fecha Inicio Periodo Extraordinario',
  })
  extraOrdinaryStartedAt: Date;

  @Column({
    name: 'extra_ordinary_ended_at',
    type: 'date',
    comment: 'Fecha Fin Periodo Extraordinario',
  })
  extraOrdinaryEndedAt: Date;

  @Column({
    name: 'especial_started_at',
    type: 'date',
    comment: 'Fecha Inicio Periodo Especial',
  })
  especialStartedAt: Date;

  @Column({
    name: 'especial_ended_at',
    type: 'date',
    comment: 'Fecha Fin Periodo Especial',
  })
  especialEndedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  setDate() {
    if (this.startedAt) this.startedAt = getDateFormat(new Date(this.startedAt));

    if (this.endedAt) this.endedAt = getDateFormat(new Date(this.endedAt));

    if (this.ordinaryStartedAt)
      this.ordinaryStartedAt = getDateFormat(new Date(this.ordinaryStartedAt));

    if (this.ordinaryEndedAt) this.ordinaryEndedAt = getDateFormat(new Date(this.ordinaryEndedAt));

    if (this.extraOrdinaryStartedAt)
      this.extraOrdinaryStartedAt = getDateFormat(new Date(this.extraOrdinaryStartedAt));

    if (this.extraOrdinaryEndedAt)
      this.extraOrdinaryEndedAt = getDateFormat(new Date(this.extraOrdinaryEndedAt));

    if (this.especialStartedAt)
      this.especialStartedAt = getDateFormat(new Date(this.especialStartedAt));

    if (this.especialEndedAt) this.especialEndedAt = getDateFormat(new Date(this.especialEndedAt));
  }
}
