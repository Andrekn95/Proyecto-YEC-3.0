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
import {CatalogueEntity, EnrollmentDetailEntity, PartialEntity} from '@modules/core/entities';

@Entity('grades', {schema: 'core'})
export class GradeEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
        comment: 'Fecha de creacion del registro',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestamp',
        comment: 'Fecha de actualizacion del registro',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha de eliminacion del registro',
    })
    deletedAt: Date;

    /** Foreign Keys **/
    @ManyToOne(() => EnrollmentDetailEntity)
    @JoinColumn({name: 'enrollment_detail_id'})
    enrollmentDetail: EnrollmentDetailEntity;
    @Column({type: 'uuid', name: 'enrollment_detail_id', comment: 'Detalles de la matricula'})
    enrollmentDetailId: string;

    @ManyToOne(() => PartialEntity)
    @JoinColumn({name: 'partial_id'})
    partial: PartialEntity;
    @Column({type: 'uuid', name: 'partial_id', comment: 'Parcial al que pertenece'})
    partialId: string;

    /** Columns **/
    @Column({
        name: 'value',
        type: 'decimal',
        precision: 5,
        scale: 2,
        comment: 'Valor de la calificacion',
    })
    value: number;
}
