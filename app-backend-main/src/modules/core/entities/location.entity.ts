import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';

@Entity('locations', {schema: 'core'})
export class LocationEntity {
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

    /** Inverse Relationship **/
    @OneToMany(() => LocationEntity, location => location.parent)
    children: LocationEntity[];

    /** Foreign Keys **/
    @ManyToOne(() => LocationEntity, location => location.children)
    @JoinColumn({name: 'parent_id'})
    parent: LocationEntity;
    @Column({type: 'uuid', name: 'parent_id', nullable: true, comment: 'Padre, Madre'})
    parentId: string;

    /** Columns **/
    @Column({
        name: 'alpha2_code',
        type: 'varchar',
        nullable: true,
        comment: 'alpha2',
    })
    alpha2Code: string;

    @Column({
        name: 'alpha3_code',
        type: 'varchar',
        nullable: true,
        comment: 'alpha3',
    })
    alpha3Code: string;

    @Column({
        name: 'calling_code',
        type: 'varchar',
        nullable: true,
        comment: 'codigo de pais',
    })
    callingCode: string;

    @Column({
        name: 'code',
        type: 'varchar',
        nullable: true,
        comment: 'Codigo',
    })
    code: string;

    @Column({
        name: 'flag',
        type: 'varchar',
        nullable: true,
        comment: 'Codigo de la bandera para el pais',
    })
    flag: string;

    @Column({
        name: 'latitude',
        type: 'float',
        default: 0,
        comment: 'Latitud',
    })
    latitude: number;

    @Column({
        name: 'longitude',
        type: 'float',
        default: 0,
        comment: 'Longitud',
    })
    longitude: number;

    @Column({
        name: 'level',
        type: 'int',
        default: 0,
        comment: '1=Pais, 2=provincia, 3=canton, 4=parroquia',
    })
    level: number;

    @Column({
        name: 'name',
        type: 'varchar',
        nullable: true,
        comment: 'Codigo',
    })
    name: string;

    @Column({
        name: 'zone',
        type: 'varchar',
        nullable: true,
        comment: 'Urbana o Rural',
    })
    zone: string;

    @Column({
        name: 'id_temp',
        type: 'varchar',
        nullable: true,
        comment: 'web donde localizar al instituto',
    })
    idTemp: string;
}
