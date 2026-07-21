import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactional_codes', { schema: 'auth' })
export class TransactionalCodeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  /** Columns **/
  @Index()
  @Column({
    name: 'requester',
    type: 'varchar',
    nullable: true,
    comment: 'Identificador de quien solicita, puede ser identificacion o correo generalmente',
  })
  requester: string;

  @Column({
    name: 'token',
    type: 'varchar',
    comment: 'Token',
  })
  token: string;

  @Column({
    name: 'is_used',
    type: 'boolean',
    default: false,
    comment: 'true=used, false=no used',
  })
  isUsed: boolean;

  @Column({
    name: 'type',
    type: 'varchar',
    comment: 'Type',
  })
  type: string;

  @BeforeInsert()
  @BeforeUpdate()
  setRequester() {
    if (!this.requester) {
      return;
    }

    if (this.requester.includes('@')) {
      this.requester = this.requester.toLowerCase().trim();
    }
  }
}
