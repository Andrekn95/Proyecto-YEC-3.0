import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RoleEntity } from '@auth/entities';

@Entity('menus', { schema: 'auth' })
export class MenuEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamptz',
    nullable: true,
  })
  deletedAt: Date;

  @Column({
    name: 'is_visible',
    type: 'boolean',
    default: true,
    comment: 'true=visible, false=no visible',
  })
  isVisible: boolean;

  /** Relationship **/
  @ManyToOne(() => MenuEntity, (category) => category.children)
  @JoinColumn({ name: 'parent_id' })
  parent: MenuEntity;

  @OneToMany(() => MenuEntity, (category) => category.parent)
  children: MenuEntity[];

  @ManyToMany(() => RoleEntity)
  roles: RoleEntity[];

  /** Columns **/
  @Column({
    name: 'code',
    type: 'varchar',
    comment: 'Codigo unico',
  })
  code: string;

  @Column({
    name: 'icon',
    type: 'varchar',
    comment: 'Icono',
  })
  icon: string;

  @Column({
    name: 'label',
    type: 'varchar',
    comment: 'Nombre del menu',
  })
  label: string;

  @Column({
    name: 'sort',
    type: 'int',
    nullable: true,
    comment: 'Orden del menu',
  })
  sort: number;

  @Column({
    name: 'router_link',
    type: 'varchar',
    nullable: true,
    comment: 'Nombre de la ruta',
  })
  routerLink: string;

  @Column({
    name: 'type',
    type: 'varchar',
    comment: 'Tipo de menu',
  })
  type: string;

  /** Before Actions **/
  @BeforeInsert()
  @BeforeUpdate()
  async setCode() {
    if (!this.code) {
      return;
    }
    this.code = this.code.toLowerCase().trim();
  }
}
