import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('audits', { schema: 'auth' })
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({ name: 'user_id', type: 'varchar', nullable: true })
  userId: string;

  @Column()
  action: string;

  @Column({ name: 'auditable_id', type: 'varchar' })
  auditableId: string;

  @Column()
  entity: string;

  @Column({ name: 'old_data', type: 'jsonb', nullable: true })
  oldData: any;

  @Column({ name: 'new_data', type: 'jsonb', nullable: true })
  newData: any;
}
