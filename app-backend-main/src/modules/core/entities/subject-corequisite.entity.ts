import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {SubjectEntity} from '@modules/core/entities';

@Entity('subject_corequisites', {schema: 'core'})
export class SubjectCorequisiteEntity {
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

    /** Foreign Keys **/
    @ManyToOne(() => SubjectEntity)
    @JoinColumn({name: 'subject_id'})
    subject: SubjectEntity;
    @Column({type: 'uuid', name: 'subject_id', nullable: true, comment: 'Asignaturas'})
    subjectId: string;

    @ManyToOne(() => SubjectEntity)
    @JoinColumn({name: 'requirement_id'})
    requirement: SubjectEntity;
    @Column({
        type: 'uuid',
        name: 'requirement_id',
        nullable: true,
        comment: 'Requerimientos para estar en esa asignatura'
    })
    requirementId: string;

    /** Columns **/
    @Column({
        name: 'is_enabled',
        type: 'boolean',
        default: true,
        comment: 'true=se valida, false=no se valida',
    })
    isEnabled: boolean;
}
