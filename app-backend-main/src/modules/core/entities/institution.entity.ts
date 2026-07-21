import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import {
  ResidenceAddressEntity,
  CareerEntity,
  CatalogueEntity,
  SchoolPeriodEntity,
} from '@modules/core/entities';

@Entity('institutions', { schema: 'core' })
export class InstitutionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'create_at',
    type: 'timestamp',
  })
  createAt: Date;

  @UpdateDateColumn({
    name: 'update_at',
    type: 'timestamp',
  })
  updateAt: Date;

  @DeleteDateColumn({
    name: 'delete_at',
    type: 'timestamp',
  })
  deleteAt: Date;

  @Column({
    name: 'is_visible',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  isVisible: boolean;

  /** Inverse Relationship **/
  @ManyToOne(() => ResidenceAddressEntity)
  address: ResidenceAddressEntity;

  @OneToMany(() => CareerEntity, (career) => career.institution)
  careers: CareerEntity[];

  @OneToMany(() => SchoolPeriodEntity, (schoolPeriod) => schoolPeriod.institution)
  schoolPeriods: SchoolPeriodEntity[];

  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'institution_user',
    joinColumn: { name: 'institution_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  users: UserEntity[];

  /** Foreign Keys **/
  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'state_id' })
  state: CatalogueEntity;
  @Column({ type: 'uuid', name: 'state_id', comment: 'Habilitado o Inhabilitado' })
  stateId: string;

  /** Columns **/
  @Column({
    name: 'acronym',
    type: 'varchar',
    default: 'none',
    comment: 'abreviatura del nombre del instituto',
  })
  acronym: string;

  @Column({
    name: 'cellphone',
    type: 'varchar',
    nullable: true,
    comment: 'teléfono móvil directo de contacto con el instituto',
  })
  cellphone: string;

  @Column({
    name: 'code',
    type: 'varchar',
    comment: 'código único para identificar al instituto',
  })
  code: string;

  @Column({
    name: 'code_sniese',
    type: 'varchar',
    comment: 'code_sniese designado al instituto',
  })
  codeSniese: string;

  @Column({
    name: 'denomination',
    type: 'varchar',
    comment: 'denomination para referirse al instituto',
  })
  denomination: string;

  @Column({
    name: 'email',
    type: 'varchar',
    nullable: true,
    comment: 'email para contactar al instituto',
  })
  email: string;

  @Column({
    name: 'logo',
    type: 'varchar',
    nullable: true,
    comment: 'logo que identifica al instituto',
  })
  logo: string;

  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'nombre designado para el instituto',
  })
  name: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    nullable: true,
    comment: 'teléfono directo de contacto con el instituto',
  })
  phone: string;

  @Column({
    name: 'short_name',
    type: 'varchar',
    comment: 'nombre corto designado para el instituto',
  })
  shortName: string;

  @Column({
    name: 'slogan',
    type: 'varchar',
    nullable: true,
    comment: 'slogan que describe al instituto',
  })
  slogan: string;

  @Column({
    name: 'web',
    type: 'varchar',
    nullable: true,
    comment: 'web donde localizar al instituto',
  })
  web: string;
}
