import {
    BeforeInsert, BeforeUpdate,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {CatalogueEntity, SchoolPeriodEntity} from '@modules/core/entities';
import {getDateFormat} from "@utils/helpers";

@Entity('events', {schema: 'core'})
export class EventEntity {
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
    @Column({
        name: 'model_id',
        type: 'varchar',
        comment: 'Foreign Key de cualquier otra entidad',
    })
    modelId: string;

    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'name_id'})
    name: CatalogueEntity;
    @Column({type: 'uuid', comment: 'Nombre del evento'})
    nameId: string;

    @ManyToOne(() => SchoolPeriodEntity)
    @JoinColumn({name: 'school_period_id'})
    schoolPeriod: SchoolPeriodEntity;
    @Column({type: 'uuid', name: 'school_period_id', comment: 'Periodo lectivo al que pertenece'})
    schoolPeriodId: string;

    @ManyToOne(() => CatalogueEntity)
    @JoinColumn({name: 'state_id'})
    state: CatalogueEntity;
    @Column({type: 'uuid', name: 'state_id', comment: 'Habilitado o Inhabilitado'})
    stateId: string;

    /** Columns **/
    @Column({
        name: 'description',
        type: 'text',
        comment: '',
    })
    description: string;

    @Column({
        name: 'enabled',
        type: 'boolean',
        comment: '',
    })
    enabled: boolean;

    @Column({
        name: 'ended_at',
        type: 'date',
        comment: 'Fecha Inicio Evento',
    })
    endedAt: Date;

    @Column({
        name: 'sort',
        type: 'int',
        comment: '',
    })
    sort: number;

    @Column({
        name: 'started_at',
        type: 'date',
        comment: 'Fecha Inicio Evento',
    })
    startedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async setDate() {
        if (this.startedAt)
            this.startedAt = getDateFormat(this.startedAt);

        if (this.startedAt)
            this.endedAt = getDateFormat(this.endedAt);
    }
}
