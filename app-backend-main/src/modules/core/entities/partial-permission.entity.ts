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
import {TeacherDistributionEntity, PartialEntity} from '@modules/core/entities';

@Entity('partial_permission', {schema: 'core'})
export class PartialPermissionEntity {
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
    @ManyToOne(() => PartialEntity)
    @JoinColumn({name: 'partial_id'})
    partial: PartialEntity;
    @Column({type: 'uuid', name: 'partial_id', comment: 'Parcial al que pertenece'})
    partialId: string;

    @ManyToOne(() => TeacherDistributionEntity)
    @JoinColumn({name: 'teacher_distribution_id'})
    teacherDistribution: TeacherDistributionEntity;
    @Column({type: 'uuid', name: 'teacher_distribution_id', comment: 'Distribución de profesores'})
    teacherDistributionId: string;

    /** Columns **/
    @Column({
        name: 'enabled',
        type: 'boolean',
        comment: 'Permiso',
    })
    enabled: boolean;
}
