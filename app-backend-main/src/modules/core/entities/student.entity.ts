import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import { CareerEntity, EnrollmentEntity, InformationStudentEntity } from '@modules/core/entities';

@Entity('students', { schema: 'core' })
export class StudentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_timestamp',
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
  @ManyToMany(() => CareerEntity, (career) => career.students)
  careers: CareerEntity[];

  @OneToOne(
    () => InformationStudentEntity,
    (informationStudentEntity) => informationStudentEntity.student,
  )
  informationStudent: InformationStudentEntity;

  /** Foreign Keys **/
  @OneToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({ type: 'uuid', name: 'user_id', comment: 'Usuario: estudiante' })
  userId: string;

  @OneToMany(() => EnrollmentEntity, (enrollment) => enrollment.student)
  enrollments: EnrollmentEntity[];

  @OneToOne(() => EnrollmentEntity, (enrollment) => enrollment.student)
  enrollment: EnrollmentEntity;
  /** Columns **/
}
