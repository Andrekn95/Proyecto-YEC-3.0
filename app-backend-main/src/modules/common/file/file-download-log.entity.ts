import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import { FileEntity } from '@modules/common/file/file.entity';

@Entity('file_download_logs', { schema: 'common' })
export class FileDownloadLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creacion',
  })
  createdAt: Date;

  /** Foreign Key **/
  @ManyToOne(() => FileEntity)
  @JoinColumn({ name: 'file_id' })
  file: FileEntity;
  @Column({
    type: 'uuid',
    name: 'file_id',
    comment: 'file',
  })
  fileId: string;

  @ManyToOne(() => UserEntity, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({
    type: 'uuid',
    name: 'user_id',
    nullable: true,
    comment: 'user',
  })
  userId: string;

  /** Columns **/
  @Column({
    name: 'ip_address',
    type: 'varchar',
  })
  ipAddress: string;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent: string;
}
