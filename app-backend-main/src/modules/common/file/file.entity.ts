import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CatalogueEntity } from '@modules/common/catalogue/catalogue.entity';
import { UserEntity } from '@auth/entities';

@Entity('files', { schema: 'common' })
export class FileEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creacion',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de actualizacion',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
    comment: 'Fecha de eliminacion',
  })
  deletedAt: Date;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  enabled: boolean;

  @Index()
  @Column({
    name: 'model_id',
    type: 'uuid',
    nullable: true,
    comment: 'Foreign Key de cualquier otra entidad',
  })
  modelId: string | null;

  /** Foreign Key **/
  @ManyToOne(() => CatalogueEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'type_id' })
  type: CatalogueEntity;
  @Index()
  @Column({
    type: 'uuid',
    name: 'type_id',
    nullable: true,
    comment: 'Tipo de documento',
  })
  typeId: string | null;

  @ManyToOne(() => UserEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Index()
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: true,
    comment: 'user',
  })
  userId: string | null;

  /** Columns **/
  @Column({
    name: 'description',
    type: 'text',
    nullable: true,
    comment: '',
  })
  description: string;

  @Column({
    name: 'extension',
    type: 'varchar',
    comment: 'Extension ex.: .pdf, .xlsx',
  })
  extension: string;

  @Index({ unique: true })
  @Column({
    name: 'file_name',
    type: 'varchar',
    comment: 'In storage',
  })
  fileName: string;

  @Column({
    name: 'original_name',
    type: 'varchar',
    comment: '',
  })
  originalName: string;

  @Column({
    name: 'path',
    type: 'varchar',
    comment: '',
  })
  path: string;

  @Column({
    name: 'mime_type',
    type: 'varchar',
    comment: '',
  })
  mimeType: string;

  @Column({
    name: 'size',
    type: 'bigint',
    comment: 'Size file in bytes',
  })
  size: number;

  @Column({
    name: 'id_temp',
    type: 'bigint',
    nullable: true,
    comment: 'Codigo de la tabla migrada',
  })
  idTemp: number;
}
