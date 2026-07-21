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
import { ModelCatalogueEntity } from '@modules/common/catalogue/model-catalogue.entity';

@Entity('catalogues', { schema: 'common' })
export class CatalogueEntity {
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
  @OneToMany(() => CatalogueEntity, (category) => category.parent)
  children: CatalogueEntity[];

  /** Foreign Keys **/
  @ManyToOne(() => CatalogueEntity, (category) => category.children, {
    nullable: true,
  })
  @JoinColumn({ name: 'parent_id' })
  parent: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'parent_id',
    nullable: true,
    comment: 'Padre, Madre',
  })
  parentId: string;

  /** Columns **/
  @Column({
    name: 'acronym',
    type: 'varchar',
    nullable: true,
    comment: '',
  })
  acronym: string;

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
    comment: 'Descripcion del catalogo',
  })
  description: string;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'Nombre del catalogo',
  })
  name: string;

  @Column({
    name: 'required',
    type: 'boolean',
    default: true,
    comment: 'Si el catalogo es requerido o no',
  })
  required: boolean;

  @Column({
    name: 'sort',
    type: 'int',
    nullable: true,
    comment: 'Orden',
  })
  sort: number;

  @Column({
    name: 'type',
    type: 'varchar',
    comment: 'Tipo de menu',
  })
  type: string;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    nullable: true,
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
