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
import {CareerEntity} from "./career.entity";
import {CatalogueEntity} from "./catalogue.entity";

@Entity('career_academic_periods', {schema: 'core'})
export class CareerAcademicPeriodsEntity {
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

    @Column({
        name: 'is_enabled',
        type: 'boolean',
        default: true,
        comment: 'true=enabled, false=disabled',
    })
    isEnabled: boolean;

    /** Inverse Relationship **/

    /** Foreign Keys **/
    @ManyToOne(() => CareerEntity, career => career.academicPeriods)
    @JoinColumn({name: 'career_id'})
    career: CareerEntity;
    @Column({type: 'uuid', name: 'career_id', comment: 'Foreign Key'})
    careerId: string;

    @ManyToOne(() => CatalogueEntity, {nullable: true})
    @JoinColumn({name: 'catalogue_id'})
    catalogue: CatalogueEntity;
    @Column({type: 'uuid', name: 'catalogue_id', comment: 'Foreign Key'})
    catalogueId: string;
}
