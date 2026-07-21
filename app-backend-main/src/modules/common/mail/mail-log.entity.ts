import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mail_logs')
export class MailLogEntity {
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

  /** Columns **/
  @Column({ type: 'text' })
  to: string | string[];

  @Column()
  subject: string;

  @Column({ type: 'jsonb', nullable: true })
  data: any;

  @Column({ type: 'jsonb', nullable: true })
  attachments: any[];

  @Column({ nullable: true })
  template: string;

  @Column({
    type: 'enum',
    enum: ['queued', 'sending', 'sent', 'failed', 'retrying'],
    default: 'queued',
  })
  status: string;

  @Column({ default: 0 })
  attempts: number;

  @Column({ nullable: true })
  error: string;
}
