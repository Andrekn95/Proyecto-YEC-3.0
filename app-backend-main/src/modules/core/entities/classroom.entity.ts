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
import {CatalogueEntity} from '@modules/core/entities';

@Entity('classrooms', {schema: 'core'})
export class ClassroomEntity {
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
    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'state_id'})
    state: CatalogueEntity;
    @Column({type: 'uuid', name: 'state_id', comment: 'Habilitada o Inhabilitada'})
    stateId: string;

    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'type_id'})
    type: CatalogueEntity;
    @Column({type: 'uuid', name: 'type_id', comment: 'Intensiva'})
    typeId: string;

    /** Columns **/
    @Column({
        name: 'capacity',
        type: 'int',
        comment: 'Capacidad de personas',
    })
    capacity: number;

    @Column({
        name: 'code',
        type: 'varchar',
        comment: 'Codigo del aula, laboratorio, taller, etc',
    })
    code: string;

    @Column({
        name: 'name',
        type: 'varchar',
        comment: 'Nombre del aula, laboratorio, taller, etc',
    })
    name: string;

    @Column({
        name: 'location',
        type: 'text',
        comment: 'Nombre del aula, laboratorio, taller, etc',
    })
    location: string;
}
