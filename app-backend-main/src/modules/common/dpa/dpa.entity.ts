import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';

@Entity('dpa', { schema: 'common' })
export class DpaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_timestampP',
    comment: 'Fecha de creacion del registro',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_timestampP',
    comment: 'Fecha de actualizacion de la ultima actualizacion del registro',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Fecha de eliminacion del registro',
  })
  deletedAt: Date;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  enabled: boolean;

  /** Inverse Relationship **/
  @OneToMany(() => DpaEntity, (category) => category.parent)
  children: DpaEntity[];

  /** Foreign Keys **/
  @ManyToOne(() => DpaEntity, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: DpaEntity;
  @Column({
    type: 'uuid',
    name: 'parent_id',
    nullable: true,
    comment: 'Padre, Madre',
  })
  parentId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'type_id' })
  type: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'type_id',
    nullable: true,
    comment: '',
  })
  typeId: string;

  /** Columns **/
  @Column({
    name: 'code',
    type: 'varchar',
    comment: 'Codigo del catalogo',
  })
  code: string;

  @Column({
    name: 'description',
    type: 'varchar',
    nullable: true,
    comment: '',
  })
  description: string;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'Nombre del catalogo',
  })
  name: string;

  @Column({
    name: 'latitude',
    type: 'float',
    nullable: true,
    comment: '',
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'float',
    nullable: true,
    comment: '',
  })
  longitude: number;

  @Column({
    name: 'sort',
    type: 'int',
    nullable: true,
    comment: 'Orden',
  })
  sort: number;

  @Column({
    name: 'zone_type',
    type: 'varchar',
    nullable: true,
    comment: 'Rural o Urbana',
  })
  zoneType: string;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    comment: '',
  })
  idTemp: string;

  @Column({
    name: 'id_temp_parent',
    type: 'bigint',
    nullable: true,
    comment: '',
  })
  idTempParent: string;
}
