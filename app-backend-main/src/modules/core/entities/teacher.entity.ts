import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import {
  CareerEntity,
  CareerToTeacherEntity,
  InformationTeacherEntity,
} from '@modules/core/entities';

@Entity('teachers', { schema: 'core' })
export class TeacherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestampP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestampP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'is_visible',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  isVisible: boolean;

  /** Inverse Relationship **/
  // @ManyToMany(() => CareerEntity, career => career.teachers)
  // careers: CareerEntity[];
  careers: CareerEntity[];

  @OneToMany(() => CareerToTeacherEntity, (careerToTeacher) => careerToTeacher.teacher)
  careerToTeachers: CareerToTeacherEntity[];

  @OneToOne(() => InformationTeacherEntity, (informationTeacher) => informationTeacher.teacher)
  informationTeacher: InformationTeacherEntity;

  /** Foreign Keys **/
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ type: 'uuid', name: 'user_id', comment: 'Usuario: Profesor' })
  userId: string;

  /** Columns **/
}
