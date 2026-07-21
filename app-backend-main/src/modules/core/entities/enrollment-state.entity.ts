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
import { CatalogueEntity, EnrollmentEntity } from '@modules/core/entities';
import { UserEntity } from '@auth/entities';
import { getDateFormat } from '@utils/helpers';

@Entity('enrollment_states', { schema: 'core' })
export class EnrollmentStateEntity {
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

  /** Foreign Keys **/
  @ManyToOne(() => EnrollmentEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'enrollment_id' })
  enrollment: EnrollmentEntity;
  @Column({ type: 'uuid', name: 'enrollment_id', comment: 'Matricula' })
  enrollmentId: string;

  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'state_id' })
  state: CatalogueEntity;
  @Column({ type: 'uuid', name: 'state_id', comment: 'Estados' })
  stateId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ type: 'uuid', name: 'user_id', comment: 'Usuario que realiza el cambio' })
  userId: string;

  /** Columns **/
  @Column({
    name: 'date',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de la matricula',
  })
  date: Date;

  @Column({
    name: 'observation',
    type: 'text',
    nullable: true,
    comment: 'Observaciones del cambio de estado de la matricula',
  })
  observation: string;

  @BeforeInsert()
  @BeforeUpdate()
  async setDate() {
    if (this.date) this.date = getDateFormat(this.date);
  }
}
