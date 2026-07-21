import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CareerEntity, TeacherEntity } from '@modules/core/entities';

@Entity('career_teacher', { schema: 'core' })
export class CareerToTeacherEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'is_current',
    type: 'boolean',
    default: true,
    comment: 'true=enabled, false=disabled',
  })
  isCurrent: boolean;

  /** Inverse Relationship **/
  @ManyToOne(() => CareerEntity, (career) => career.careerToTeachers)
  @JoinColumn({ name: 'career_id' })
  career: CareerEntity;

  @Column({ type: 'uuid', name: 'career_id', comment: 'Career Id' })
  careerId: string;

  @ManyToOne(() => TeacherEntity, (teacher) => teacher.careerToTeachers)
  @JoinColumn({ name: 'teacher_id' })
  teacher: TeacherEntity;

  @Column({ type: 'uuid', name: 'teacher_id', comment: 'Career Id' })
  teacherId: string;
}
