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

@Entity('catalogues', {schema: 'core'})
export class CatalogueEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestampP',
        comment: 'Fecha de creacion del registro',
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        default: () => 'CURRENT_timestampP',
        comment: 'Fecha de actualizacion de la ultima actualizacion del registro',
    })
    updatedAt: Date;

    @DeleteDateColumn({
        name: 'deleted_at',
        type: 'timestamp',
        nullable: true,
        comment: 'Fecha de eliminacion del registro',
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
    @OneToMany(() => CatalogueEntity, category => category.parent)
    children: CatalogueEntity[];

    /** Foreign Keys **/
    @ManyToOne(() => CatalogueEntity, category => category.children, {nullable: true})
    @JoinColumn({name: 'parent_id'})
    parent: CatalogueEntity;
    @Column({type: 'uuid', name: 'parent_id', nullable: true, comment: 'Padre, Madre'})
    parentId: string;

    /** Columns **/
    @Column({
        name: 'code',
        type: 'varchar',
        comment: 'Codigo del catalogo',
    })
    code: string;

    @Column({
        name: 'description',
        type: 'varchar',
        comment: 'Descripcion del catalogo',
    })
    description: string;

    @Column({
        name: 'name',
        type: 'varchar',
        comment: 'Nombre del catalogo',
    })
    name: string;

    @Column({
        name: 'required',
        type: 'boolean',
        default: true,
        comment: 'Si el catalogo es requerido o no',
    })
    required: boolean;

    @Column({
        name: 'sort',
        type: 'int',
        comment: 'Orden',
    })
    sort: number;

    @Column({
        name: 'type',
        type: 'varchar',
        comment: 'Tipo de menu',
    })
    type: string;
}
