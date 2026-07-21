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
import { UserEntity } from '@auth/entities';
import * as Bcrypt from 'bcrypt';

@Entity('security_questions', { schema: 'auth' })
export class SecurityQuestionEntity {
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

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'is_visible',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  enabled: boolean;

  /** Inverse Relationship **/

  /** Foreign Keys **/
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'user',
  })
  userId: string;

  /** Columns **/
  @Column({
    name: 'code',
    type: 'varchar',
    comment: '',
  })
  code: string;

  @Column({
    name: 'question',
    type: 'varchar',
    comment: '',
  })
  question: string;

  @Column({
    name: 'answer',
    type: 'varchar',
    comment: '',
  })
  answer: string;

  /** Before Actions **/
  @BeforeInsert()
  @BeforeUpdate()
  setAnswer() {
    if (!this.answer) {
      return;
    }

    this.answer = Bcrypt.hashSync(this.answer.toLowerCase().trim(), 10);
  }
}
