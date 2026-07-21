import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('partials', { schema: 'core' })
export class PartialEntity {
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

  /** Columns **/
  @Column({
    name: 'code',
    comment: 'Codigo del parcial',
  })
  code: string;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'Nombre visual para el parcial',
  })
  name: string;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: '',
  })
  enabled: boolean;
}
